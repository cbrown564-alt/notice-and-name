# Writing an instrument

Every concept in Notice & Name is taught by an **instrument**: a drawing you can
touch, written in [Exact](https://github.com/expo/exact)'s Contract language as
inline SVG. No images, no video, no canvas. This is the house style and the
handful of Exact rules that matter for it. `instruments/clitoral-structure.contract`
(with `instruments/organ.contract`) is the reference to copy from.

## What an instrument is

One component in `instruments/<concept-id>.contract`:

```contract
use clamp01, span, Caption, Chip from "./kit.contract"

component Angling
  inject
    still: bool          // true when the person asked for reduced motion
  props
    uid: string          // unique per mounted page: build every id from it
  state tilt = 0
  …
  view
    column gap=14
      svg id=`an-${uid}` testId="an-stage" viewBox="0 0 340 300" width="100%" display="block" …
      Caption(line=…)            // the instrument's voice
      row gap=8 justify-content="center" flex-wrap="wrap"
        Chip(…)                  // optional controls
```

`concept.contract` mounts it by concept id; the page supplies the card around it.

## The quality bar

1. **One gesture, one insight.** Within ten seconds of touching it, the person
   has felt the idea: not read it. If the drawing would teach as much as a
   static picture, it is not an instrument yet.
2. **The Caption speaks.** Its line changes with the state and says in plain
   words what the picture is showing right now. Two sentences at most, warm,
   adult, never clinical for its own sake, never coy. No exclamation marks.
3. **It is true.** Anatomy is drawn as anatomy (simplified, not cartoonish, not
   explicit). A number on screen comes from a named study in `content.ts`.
4. **It is calm.** Nothing scores, counts streaks or celebrates. Motion is slow
   and soft; something always breathes a little so the stage feels alive.
5. **It works for everyone.** Light and dark, reduced motion, keyboard, a
   screen reader, a 320-point phone.

## House style

- **Stage:** `viewBox="0 0 340 H"` with H between 200 and 340. `width="100%"
  display="block"`. No background rect: the page's card is the ground.
- **Colour:** tokens from `app.tamber` only, never hex. They follow dark mode.

  | Token | Use |
  | --- | --- |
  | `ink`, `ink.soft`, `ink.faint` | outlines and text; labels; hairlines and idle parts |
  | `paper`, `paper.raised`, `paper.sunk` | page; card (the stage's ground); wells and tracks |
  | `ember`, `ember.deep`, `ember.glow`, `ember.light` | the active thing: touch, arousal, heat; highlight |
  | `rose`, `rose.deep` | tissue, skin, the body at rest |
  | `sage`, `sage.deep`, `sage.soft` | calm, safety, steadiness |
  | `dusk`, `dusk.deep`, `dusk.soft` | the watching mind, thoughts, detachment |
  | `honey`, `honey.soft` | desire, an insight landing |
  | `bone` | bone and neutral structure |

- **Line:** outlines `stroke="ink"` at 1–1.4, `stroke-linecap="round"`, usually
  under 0.6 opacity. Leader lines `ink.faint` at 1. Fills are soft gradients,
  not flat blocks; glows are radial gradients fading to `stop-opacity=0`.
- **Type in the SVG:** 10.5–12 units, `fill="ink.soft"`. Only short labels;
  sentences belong in the Caption. Sizes in the HTML around it are in `rem`.
- **Motion:** state changes ease over 300–900 ms. Idle loops run 2–6 s,
  `ease-in-out`, and every `animation` is `still ? "none" : "…"`. Turn
  transitions off while a finger is dragging (`glide`/`down` in the reference).
- **Controls:** direct manipulation on the drawing first; `Chip`s as the
  tappable, keyboard-reachable alternative that jump to the same states.

## Exact rules that bite

- **Timers live in the root only.** A child component has no `task`. Loop with
  CSS `animation`; move between states with `transition`; read
  `performanceNow()` inside an action if you need elapsed time. Anything that
  must tick (the arousal engine) is a root member passed in by `inject`.
- **Pointer to viewBox.** Put `pointerdown`/`pointermove`/`pointerup` and
  `touch-action="none"` on the `svg`. `e.offsetX` is in CSS pixels of the svg:
  `let x = e.offsetX / frame(`an-${uid}`).width * 340`. `frame()` takes a
  computed id; `measure()` does not. `pointermove` also fires for a hovering
  mouse, so keep a `down` state. `pan=act(dx, dy)` gives deltas instead.
- **Press on a shape:** `press=act(arg)` works on any SVG element; add
  `pointer-events="none"` to decoration drawn over it.
- **What transitions and animates:** `opacity`, `translate`, `scale`, `rotate`,
  colours, and SVG `fill`, `stroke`, `stroke-dashoffset`, `r`, `cx`, `cy`, `x`,
  `y`, `rx`, `ry`, `d`. A spring is `transition="cx -exact-spring(170, 18, 1)"`
  (no duration). To scale or rotate a shape about itself add
  `transform-box="fill-box" transform-origin="center"`.
- **Keyframes** are file-level and literal: `keyframes an-drift` then
  `50% translate="0px -4px"`. Prefix the name with the instrument's short code;
  names are global.
- **Expressions** are TypeScript's minus a lot: no truthiness, no `null`, no
  object literals, no array indexing (`xs.at(i)` is an option). Maths is
  `sin cos floor ceil round min max`; `kit.contract` adds `clamp clamp01 lerp
  mag fract rnd ease span`. Subtraction needs spaces (`a - b`): names may
  contain hyphens. Actions read the state as it was when they began; bind new
  values with `let`.
- **Ids** inside a component are its own (two instances may both say
  `id="glow"` for a gradient), but an id you pass to `frame()` must be unique
  on the page: build it from `uid`.
- **Lists in SVG:** `for i in range(n) key=i` draws repeated marks; scatter
  them with `rnd(i)`, which is the same on every host.

## The loop

```sh
bun exact.mjs contract build app.contract --json --errors-only   # [] means clean
bun exact.mjs agent web --url /atlas/angling "clock data" \
  "tap an-stage drag 0 60" "clock settle" "screenshot .exact/an.png" \
  "prefer prefers-color-scheme dark" "clock settle" "screenshot .exact/an-dark.png"
bun exact.mjs test web
```

Look at every screenshot, in both schemes. `tap <testId> at <x> <y>` presses a
point of a node (CSS pixels from its top left), `tap <testId> down` … `tap up`
holds, `clock +800` moves time, `prefer prefers-reduced-motion reduce` checks
the still version, `state` prints every state. Give each control a `testId`
and add a test to `app.test.contract` that performs the gesture and expects the
state it should reach.
