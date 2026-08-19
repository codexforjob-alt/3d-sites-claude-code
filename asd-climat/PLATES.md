# ASD Climat — плашки для Flow (фаза 1)

## Бизнес

ASD Climat — климатическая компания в Алматы, на рынке с 2010 года. Продажа, монтаж и
обслуживание кондиционеров и систем вентиляции: бытовые сплиты, мульти-сплиты, кассетные
и канальные блоки, VRF на объектах. Дилер ALMACOM, работают также с LG, GREE, OTEX.
Заявки приходят в WhatsApp Business на 8 778 824 22 22, почта `zakaz@asd-climat.kz`,
Instagram `@asd_climate_almaty`.

Аудитория — владельцы квартир и частных домов в Алматы, а также кафе, офисы, магазины и
серверные. Одна задача страницы: получить заявку на бесплатный замер или на конкретную
модель с ценой «под ключ». Не «повысить узнаваемость бренда» — заявку в WhatsApp.

## Структура: D · Ledger (с одним вкраплением C · Room)

Покупатель кондиционера в Алматы сравнивает: сколько стоит, какая модель, на сколько
квадратов, как быстро приедут, что с гарантией. Ему нужны цифры, а не настроение. Поэтому
страница — плотная таблица, а видео работает как воздух между блоками, а не как фон.

Следствие, важное для промптов: **текст поверх видео почти нигде не идёт**. Плашки —
самостоятельные полосы между блоками цифр. Исключение — герой, где видео стоит колонкой
рядом с текстом, а не под ним.

### Регистр

Не тёмное кино. Регистр — «прохладная дневная точность»: бледные холодные белые, серо-синие
тени, низкий контраст, ноль зерна и бликов, статичная камера или моторизованный слайдер.
Кондиционер продаёт прохладу, а не тайну.

Одна плашка намеренно выбивается — уличный блок на фасаде в полуденном пекле, тёплая и
выгоревшая. Это единственный тёплый кадр на всей странице, и он же задаёт единственный
акцентный цвет в вёрстке: сигнальный оранжевый на ценах и на кнопке WhatsApp. Всё
остальное — холодное. Палитра страницы буквально работает как термостат.

### Карта секций

| # | Секция | Плашка | Формат | Что делает |
|---|---|---|---|---|
| 1 | Первый экран: заголовок, цена «от», кнопка WhatsApp | `hero-curtain` | 9:16 | Вертикальная колонка справа от текста; на телефоне — во всю ширину. Зациклена |
| 2 | Что ставим: марки, BTU, площадь, цена под ключ | — | — | Таблица. Видео нет |
| 3 | Полоса-выдох | `plate-copper` | 16:9 | Макро вальцовки медной трассы. Текста поверх нет |
| 4 | Как проходит монтаж: 5 шагов, часы и деньги | `plate-vacuum` | 16:9 → кроп в 1:1 | Стоит внутри шага «вакуумирование» |
| 5 | Обслуживание и гарантия: чистка, дозаправка, сроки | — | — | Таблица |
| 6 | Полоса-выдох | `plate-outdoor` | 16:9 | Единственный тёплый кадр |
| 7 | Объекты: квартиры, офисы, кафе, серверные | — | — | Цифры |
| 8 | Финальный экран с телефоном и WhatsApp | `cta-room` | 16:9 | Большая пустая область слева под крупный заголовок |

Пять плашек. Это полный набор, не обязательный минимум.

**Минимум, чтобы увидеть сайт живым:** `hero-curtain`, `plate-copper`, `cta-room`.
На трёх страница уже собирается целиком; секции 4 и 6 просто временно идут без видео.

## Настройки Flow

- Режим **Text to Video**, модель **Veo 3.1 Quality**, длина **8 секунд**
- `hero-curtain` — соотношение **9:16**. Остальные — **16:9**
- `plate-vacuum` генерим в 16:9, квадрат я вырежу при сборке — 1:1 в Flow нет
- Максимальное доступное разрешение. Сжимать буду я, не Flow
- Звук не нужен: браузеры пускают автоплей только в `muted`
- Слабый клип — сначала перегенерировать на другом сиде, и только потом трогать промпт.
  Обычно дело не в промпте

## Имена файлов

Скачать в одну папку и назвать ровно так, без лишних суффиксов Flow:

```
hero-curtain.mp4
plate-copper.mp4
plate-vacuum.mp4
plate-outdoor.mp4
cta-room.mp4
```

Дальше фаза 2 — сборка — идёт механически: я прогоняю `ffprobe`, кодирую в mp4/webm,
снимаю постеры и собираю страницу под то, что реально пришло.

---

## Промпты

Все на английском — Veo обучен на английском и на русском заметно проседает.
Копировать в Flow целиком, одним куском, включая список запретов.

### 1 · `hero-curtain` — 9:16, зациклить

> Slow-motion vertical shot of a sheer white linen curtain hanging beside a tall apartment
> window. A steady, invisible stream of cool air lifts the lower half of the curtain, it
> billows once, unhurried, and settles back flat against the wall. Behind the fabric, far
> out of focus, a hazy summer city and a pale mountain ridge under a hot bleached sky. Shot
> on Sony Venice 2 with an 85mm prime, f/2.0, shallow focus holding the weave of the fabric,
> 120fps. Lighting: enormous soft daylight from the window behind the curtain, the linen
> glowing translucent where the sun passes through it, gentle bounce fill on the interior
> wall, no hard shadows anywhere. Camera movement: locked-off, completely static, tripod, no
> drift. Colour grade: cool neutral whites, pale grey-blue in the shadows, faint warm haze
> only in the distant window, very low contrast, lifted blacks, no grain, no flare. Mood:
> calm, cool, quiet, relieved. Vertical 9:16 framing with the upper third clean empty wall
> for overlaid text. No text, no letters, no logos, no watermarks, no people, no faces, no
> air conditioner visible, no furniture. The first and last frame must both show the curtain
> hanging completely still against the wall so the clip loops seamlessly.

### 2 · `plate-copper` — 16:9

> Extreme macro cinematography of a freshly flared copper refrigerant pipe seated into a
> brass flare nut, a gloved hand entering frame with a torque wrench and making one slow
> quarter turn before withdrawing. Bare bright copper, a single bead of condensation sliding
> down the tube. Shot on ARRI Alexa 35 with a 100mm macro probe lens, f/4, shallow depth of
> field, 96fps. Lighting: large soft top light with a hard silver rim skimming along the
> copper, cool-neutral fill from camera left, clean narrow speculars running the length of
> the tube, shadows falling off to pale grey rather than black. Camera movement: motorised
> slider, slow linear push from left to right, perfectly level, constant speed, no shake.
> Colour grade: cool neutral whites and pale grey, warm copper as the only saturated colour
> in frame, low contrast, no grain, no lens flare, crisp and technical. Mood: precise,
> unhurried, competent. Wide 16:9 with the pipe running along the lower third and clean
> out-of-focus grey filling the upper half. No text, no letters, no logos, no watermarks,
> no faces, no brand names on the tools, no digits, no displays.

### 3 · `plate-vacuum` — 16:9, кроп в квадрат при сборке

> Extreme macro cinematography of the round oil sight glass on the side of a vacuum pump.
> Pale amber oil fills the lower half of the glass and a slow rising column of tiny bubbles
> gradually thins until the oil goes perfectly still. Painted grey metal housing around the
> glass, a faint film of dust on the surface. Shot on ARRI Alexa 35 with a 100mm macro lens,
> f/4, extremely shallow depth of field, 96fps. Lighting: single soft key from camera right
> raking across the painted metal, cool-neutral fill, one narrow specular arc following the
> curve of the glass, shadows falling to pale grey. Camera movement: locked-off, static, no
> drift, no shake. Colour grade: cool grey metal, amber oil as the only warm note, low
> contrast, no grain, no halation, clean and technical. Mood: patient, mechanical, exact.
> Framing keeps the sight glass slightly left of centre with clean empty metal to the right,
> and stays readable when cropped hard to a square. No text, no letters, no numbers, no dial
> markings, no gauge faces, no logos, no watermarks, no hands, no people.

### 4 · `plate-outdoor` — 16:9, единственный тёплый кадр

> Slow-motion shot of a plain unbranded white outdoor condensing unit mounted on a steel
> bracket against a sun-bleached rendered apartment facade, its fan turning steadily behind
> the grille, air shimmering with heat distortion above the housing. Past the edge of the
> building, a hazy summer ridge of mountains under a bleached sky. Shot on Sony Venice 2 with
> a 50mm prime, f/4, level horizon, mild perspective compression, 60fps. Lighting: hard high
> afternoon sun from camera right, sharp bracket shadows thrown across the render, strong
> bounce off the pale wall, blown highlights along the sunlit edge of the housing. Camera
> movement: very slow gimbal-stabilised drift upward, constant speed, no handheld shake.
> Colour grade: warm bleached whites, sand and dust tones, washed pale blue sky, low
> saturation, gentle halation on the sunlit edge, fine grain. Mood: hot, still, midday,
> exposed. Wide 16:9 with the unit low in the left of frame and empty bright wall filling the
> upper right. No text, no letters, no logos, no brand names, no model badges, no watermarks,
> no people, no reflections of a film crew.

### 5 · `cta-room` — 16:9

> Slow, smooth tracking shot moving right to left through a quiet, empty modern apartment
> living room in late afternoon. Pale plaster walls, light oak floor, one linen sofa, a glass
> of cold water on a low table with condensation beading down its side, sheer curtains
> breathing very slightly at the window. Nothing in the room moves except the camera. Shot on
> RED Komodo with a 35mm prime, f/4, deep focus, everything sharp, perfectly level horizon.
> Lighting: broad soft daylight through the window at camera right, long gentle shadows
> stretching across the floor, generous bounce fill, cool-neutral balance drifting slightly
> warm near the glass. Camera movement: motorised slider, perfectly linear, constant slow
> speed, no drift, no shake. Colour grade: pale neutral whites, oat and warm grey, cool
> grey-blue in the shadows, very low contrast, lifted blacks, no grain, no flare. Mood:
> settled, cool, domestic, unhurried. Wide 16:9 with the left half of frame clean empty wall
> for a large headline. No text, no letters, no logos, no watermarks, no people, no
> television, no air conditioner visible.

---

## Замечание по последнему кадру

В `cta-room` кондиционера намеренно нет в кадре, хотя это сайт про кондиционеры. Это тезис
всей страницы: хорошо поставленный сплит не слышно, не видно и он не течёт на подоконник.
Финальный экран показывает результат, а не коробку на стене. Если этот тезис не нравится —
скажите до генерации, промпт переписывается за одно сообщение, а клип уже нет.

---

# Дополнение: смена акцента на VRF и вентиляцию

Страница переехала с бытовых сплитов на коммерческие объекты. Три плашки
из пяти работают на новом материале даже лучше:

- `hero-curtain` — тюль теперь читается не как «спальня», а как приток
  в переговорной; каптион переписан под скорость на решётке
- `plate-copper` — медные магистрали VRF, где стыков десятки, а не один
- `plate-vacuum` — вакуумирование контура на 200+ метров, 6–12 часов

Две выбиваются, и это надо чинить генерацией, а не текстом.

## Урок по `plate-copper`

Veo напечатал `ARRI` на перчатке монтажника, взяв бренд из моей же фразы
«Shot on ARRI Alexa 35». **Не называйте марку камеры в промпте**, если в кадре
есть ткань, спецодежда или инструмент — модель охотно ставит на них логотип.
Пишите «large-format cinema camera with a 100 mm macro probe lens».

## Замена 1 · `band-plant` — наружные блоки VRF, 16:9

Сейчас в полосе стоит бытовой наружный блок на фасаде жилого дома. Для VRF
нужна модульная связка на кровле или технической площадке.

> Slow-motion shot of a row of four large unbranded pale grey modular condensing
> units standing on steel frames on a flat commercial rooftop, their wide fan
> grilles turning steadily, air shimmering with heat above the housings. Gravel
> ballast underfoot, a parapet, and beyond it a hazy summer ridge of mountains
> under a bleached sky. Shot on Sony Venice 2 with a 35mm prime, f/5.6, level
> horizon, deep focus, 60fps. Lighting: hard high afternoon sun from camera
> right, long sharp frame shadows across the gravel, strong bounce off the pale
> roof, blown highlights along the sunlit edges. Camera movement: slow
> gimbal-stabilised lateral track from left to right, constant speed, no
> handheld shake. Colour grade: warm bleached whites, sand and dust tones,
> washed pale blue sky, low saturation, gentle halation on the sunlit edges,
> fine grain. Mood: hot, industrial, still, midday. Wide 16:9 with the units
> along the lower half and empty bright sky filling the upper right. No text, no
> letters, no logos, no brand names, no model badges, no watermarks, no people.

## Замена 2 · `cta-floor` — финальный экран, 16:9

Сейчас в финале жилая комната с льняным диваном — на странице про офисы
и рестораны это самое слабое место.

> Slow, smooth tracking shot moving right to left through a quiet, empty
> open-plan office in late afternoon. Pale plaster walls, light oak floor, low
> desks with empty chairs pushed in, a glass meeting room at the far end, a
> single potted tree, sheer blinds breathing very slightly at a wall of windows.
> Nothing moves except the camera. Shot on RED Komodo with a 35mm prime, f/4,
> deep focus, everything sharp, perfectly level horizon. Lighting: broad soft
> daylight through the window wall at camera right, long gentle shadows
> stretching across the floor, generous bounce fill, cool-neutral balance
> drifting slightly warm near the glass. Camera movement: motorised slider,
> perfectly linear, constant slow speed, no drift, no shake. Colour grade: pale
> neutral whites, oat and warm grey, cool grey-blue in the shadows, very low
> contrast, lifted blacks, no grain, no flare. Mood: settled, cool, ordered,
> unhurried. Wide 16:9 with the left third of frame clean empty wall for a large
> headline. No text, no letters, no logos, no watermarks, no people, no screens,
> no monitors showing anything, no ceiling cassettes visible.

Обе — Text to Video, Veo 3.1 Quality, 8 секунд, 16:9. Скачать как
`band-plant.mp4` и `cta-floor.mp4`; петли, кодирование и подстановку в вёрстку
сделаю я.
