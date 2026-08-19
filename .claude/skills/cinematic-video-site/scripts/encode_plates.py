#!/usr/bin/env python3
"""
Batch-encode Veo/Flow plates for the web: mp4 + webm + poster frame per clip.

Two things here are easy to get wrong by hand and are the reason this exists:

  1. VP9 loses to x264 on grain and other high-frequency detail. Since <source>
     lists webm first, the browser then downloads the *bigger* file. Any webm
     that comes out larger than its mp4 is deleted so the source list falls
     through to the mp4 on its own.

  2. Decorative plates (grain, light leaks, loaders) tolerate far more
     compression than hero plates. Encoding everything at one quality either
     wastes megabytes or ruins the hero. Roles carry their own settings.

Requires ffmpeg and ffprobe on PATH.

  python encode_plates.py --src ~/Downloads --out site/public/video --map map.json

map.json is {"target-name": "Source_File_From_Flow.mp4", ...}. Target names
should match the role table in references/flow-prompts.md so the quality preset
is picked automatically. Without --map, every mp4 in --src is encoded under its
own stem.
"""

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

# crf_h264, crf_vp9, max_width — keyed by a substring of the target name.
# Hero and case plates are the ones people look at; overlays are not.
PROFILES = [
    ("texture", (36, 48, 960)),    # grain/leaks: noise at low opacity, crush it
    ("loader", (27, 36, 1280)),    # brief, minimal, wants to be tiny
    ("transition", (26, 40, 1440)),
    ("case", (26, 42, 1080)),      # vertical cards never need more than 1080 wide
    ("hero", (25, 34, 1920)),
    ("reel", (25, 34, 1920)),
    ("about", (25, 34, 1920)),
    ("cta", (25, 34, 1792)),
]
DEFAULT_PROFILE = (25, 34, 1920)


def profile_for(name: str):
    for key, settings in PROFILES:
        if key in name:
            return settings
    return DEFAULT_PROFILE


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(f"\n  ffmpeg failed: {' '.join(str(c) for c in cmd)}\n")
        sys.stderr.write(result.stderr[-1500:] + "\n")
    return result.returncode == 0


def probe(path: Path):
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height",
             "-show_entries", "format=duration",
             "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, check=True).stdout.split()
        w, h = out[0].split(",")[:2]
        return f"{w}x{h}", float(out[-1])
    except Exception:
        return "?", 0.0


def encode(src: Path, out_dir: Path, name: str):
    crf, vp9, width = profile_for(name)
    scale = f"scale='min({width},iw)':-2"
    mp4, webm, jpg = (out_dir / f"{name}.{ext}" for ext in ("mp4", "webm", "jpg"))

    ok = run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-an",
              "-vf", scale, "-c:v", "libx264", "-profile:v", "high",
              "-pix_fmt", "yuv420p", "-crf", str(crf), "-preset", "slow",
              "-movflags", "+faststart", "-g", "48", str(mp4)])
    if not ok:
        return None

    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-an",
         "-vf", scale, "-c:v", "libvpx-vp9", "-crf", str(vp9), "-b:v", "0",
         "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", str(webm)])

    # Poster at 1s — frame 0 is often black on a fade-in.
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1", "-i", str(src),
         "-frames:v", "1", "-vf", scale, "-q:v", "4", str(jpg)])

    dropped = False
    if webm.exists() and webm.stat().st_size >= mp4.stat().st_size:
        webm.unlink()
        dropped = True

    return {
        "name": name,
        "mp4": mp4.stat().st_size,
        "webm": webm.stat().st_size if webm.exists() else None,
        "dropped": dropped,
        "served": min(mp4.stat().st_size,
                      webm.stat().st_size if webm.exists() else mp4.stat().st_size),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", required=True, type=Path, help="directory holding the Flow downloads")
    ap.add_argument("--out", required=True, type=Path, help="destination, e.g. public/video")
    ap.add_argument("--map", type=Path, help='JSON of {"target-name": "Source_File.mp4"}')
    args = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH.")

    args.out.mkdir(parents=True, exist_ok=True)

    if args.map:
        # utf-8-sig: Windows editors and PowerShell write a BOM that plain
        # json.loads chokes on, and the resulting error points nowhere useful.
        raw = json.loads(args.map.read_text(encoding="utf-8-sig"))
        pairs = [(name, args.src / src) for name, src in raw.items()]
    else:
        pairs = [(p.stem, p) for p in sorted(args.src.glob("*.mp4"))]

    if not pairs:
        sys.exit(f"No source clips found in {args.src}")

    results, missing = [], []
    for name, src in pairs:
        if not src.exists():
            missing.append((name, src.name))
            print(f"  MISSING  {name:<24} expected {src.name}")
            continue
        dims, dur = probe(src)
        print(f"  encoding {name:<24} {dims} {dur:.1f}s ... ", end="", flush=True)
        info = encode(src, args.out, name)
        if not info:
            print("FAILED")
            continue
        results.append(info)
        webm = f"{info['webm'] // 1024} KB" if info["webm"] else ("dropped" if info["dropped"] else "--")
        print(f"mp4 {info['mp4'] // 1024} KB   webm {webm}")

    total = sum(r["served"] for r in results) / (1024 * 1024)
    print(f"\n  {len(results)} plates encoded · {total:.1f} MB best-case over the wire")

    dropped = [r["name"] for r in results if r["dropped"]]
    if dropped:
        print(f"  webm dropped (lost to mp4): {', '.join(dropped)}")
    if missing:
        print(f"  MISSING {len(missing)}: {', '.join(n for n, _ in missing)}")
        print("  Ask the user for these before building — do not silently skip a section.")


if __name__ == "__main__":
    main()
