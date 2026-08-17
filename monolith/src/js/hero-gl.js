import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry,
  ShaderMaterial, Mesh, VideoTexture, LinearFilter, Vector2,
} from 'three';

/**
 * The hero plate runs through a shader instead of straight <video> for one
 * reason: scroll velocity drives an anamorphic squeeze and a whisper of
 * channel separation, so the image reacts to the scroll the way glass would.
 * Everything here is cheap — one full-screen quad, no post pipeline.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2  uResolution;
  uniform vec2  uTexResolution;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uIntro;

  varying vec2 vUv;

  // background-size: cover, in UV space
  vec2 coverUv(vec2 uv) {
    vec2 s = uResolution;
    vec2 i = uTexResolution;
    vec2 ratio = vec2(
      min((s.x / s.y) / (i.x / i.y), 1.0),
      min((s.y / s.x) / (i.y / i.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    float v = clamp(uVelocity, -1.0, 1.0);

    vec2 uv = coverUv(vUv);

    // Anamorphic squeeze: the frame pinches horizontally and stretches
    // vertically as the scroll accelerates, then settles back.
    vec2 c = uv - 0.5;
    float r = dot(c, c);
    c *= vec2(1.0 - v * 0.10 - r * v * 0.16, 1.0 + v * 0.045);

    // Intro: the plate opens out of a squeeze on first paint.
    c *= mix(1.14, 1.0, uIntro);
    uv = c + 0.5;

    // Channel separation, scaled by the same velocity. Barely there at rest.
    float sep = abs(v) * 0.0055 + 0.0004;
    vec2 dir = normalize(c + 1e-5);

    float rC = texture2D(uTexture, uv + dir * sep).r;
    float gC = texture2D(uTexture, uv).g;
    float bC = texture2D(uTexture, uv - dir * sep).b;
    vec3 col = vec3(rC, gC, bC);

    // Halation — highlights bleed warm, the way the footage was graded.
    float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col += vec3(0.055, 0.030, 0.008) * smoothstep(0.62, 1.0, luma);

    col *= 1.0 - smoothstep(0.42, 1.05, length(c) * 1.32) * 0.55;  // vignette
    col *= mix(0.0, 1.0, uIntro);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initHeroGl({ video, canvas, reducedMotion }) {
  if (reducedMotion || !canvas || !video) return null;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null; // no WebGL — the plain <video> underneath stays visible
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const texture = new VideoTexture(video);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;

  const uniforms = {
    uTexture: { value: texture },
    uResolution: { value: new Vector2(1, 1) },
    uTexResolution: { value: new Vector2(1920, 1080) },
    uVelocity: { value: 0 },
    uTime: { value: 0 },
    uIntro: { value: 0 },
  };

  const mesh = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    depthTest: false,
    depthWrite: false,
  }));
  scene.add(mesh);

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const w = Math.round(box.width) || window.innerWidth;
    const h = Math.round(box.height) || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w, h);
  };
  resize();
  window.addEventListener('resize', resize);

  // The canvas is measured before the preloader lifts, when layout can still be
  // settling. Watching the element is more reliable than watching the window.
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

  video.addEventListener('loadedmetadata', () => {
    uniforms.uTexResolution.value.set(video.videoWidth || 1920, video.videoHeight || 1080);
  }, { once: true });

  // Stop drawing the moment the hero is off screen.
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '10% 0px' })
      .observe(canvas);
  }

  let velocity = 0;
  let target = 0;
  let live = false;

  const api = {
    setVelocity(v) { target = v; },
    reveal() { live = true; canvas.classList.add('is-live'); video.classList.add('is-hidden'); },
    render(time) {
      if (!visible) return;
      velocity += (target - velocity) * 0.09;
      uniforms.uVelocity.value = velocity;
      uniforms.uTime.value = time;
      if (live && uniforms.uIntro.value < 1) {
        uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + 0.016);
      }
      renderer.render(scene, camera);
    },
  };

  return api;
}
