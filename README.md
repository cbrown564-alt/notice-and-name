# Notice & Name

> Notice what you like. Name it.

A private atlas of sexual pleasure for adults, taught by drawings you can touch.
Every idea in it — anatomy most people were never shown, how arousal moves
through time, where desire comes from, how to ask for what you want — is an
**instrument**: a hand-written, interactive SVG that makes the idea something
you feel in ten seconds instead of something you read.

It is one [Exact](https://github.com/expo/exact) app: the same source runs on
the web and natively on iOS and macOS. There are no generated images, no video
and no canvas. Every picture is code in `instruments/`.

## What is in it

- **Atlas.** 26 concepts in six chapters: The Map (anatomy), The Curve
  (arousal over time), Wanting (desire), Attention, Touch, and Saying It.
- **An instrument for every concept.** Peel the skin back to find the whole
  clitoris. Hold to build arousal and watch the curve you make. Tilt a pelvis
  and see where pressure lands. Lift a brake and watch the needle move.
  [`docs/DESIGN.md`](docs/DESIGN.md) lists them all and what each one teaches.
- **Words to keep.** Each concept ends in sentences you can say (to yourself,
  to ask, to set a boundary, to get curious, to reassure), a private note, and
  a place to say whether it resonates.
- **Today.** One small thing to notice each day, and five paths through the atlas.
- **Yours.** Your vocabulary, kept phrases and field notes. No account, no
  server, no analytics: the app is granted one file on the device and nothing
  else, and "Erase everything" empties it.

The figures quoted come from published research; each concept names its
sources, and `content.ts` holds all of it.

## Run it

Exact is used by path, from a checkout beside this repository (or wherever
`EXACT` points). You need [Bun](https://bun.sh) 1.4.2, Rust (rustup), and Chrome.

```sh
git clone https://github.com/expo/exact ../expo/exact
(cd ../expo/exact && git checkout 4465ccd98c1b && bun scripts/exact.mjs setup)   # once; a few minutes

bun exact.mjs web            # the dev loop: a URL that rebuilds on save
bun exact.mjs test web       # every *.test.contract, in headless Chrome
bun exact.mjs verify         # tests, then light/dark/width/large-text checks
bun exact.mjs linux && bun exact.mjs test linux   # the same tests on a native host, no browser
bun exact.mjs ios --run      # an iOS Simulator (macOS with Xcode)
bun exact.mjs mac --run      # a Mac app
```

The suite passes on the web host and on Exact's native Linux host, which
paints the same drawings with no browser involved. iOS and macOS build from
the same source but need a Mac; they have not been run yet.

Exact is pre-1.0 and changes daily, so the commit above is the one this app is
developed and tested against (CI pins the same one). Move it deliberately:
check out a newer Exact, run `bun exact.mjs update`, then `bun exact.mjs verify`.

## Where things are

| Path | What |
| --- | --- |
| `app.contract` | The shell: tabs, Today, Atlas, Yours, the state that is kept. |
| `concept.contract` | A concept's page, and which instrument it mounts. |
| `engine.contract` | The arousal engine: the one simulation, shared by three instruments. |
| `instruments/` | One file per instrument, plus shared drawings and `kit.contract`. |
| `app.tamber` | The palette, light and dark. Instruments use only these tokens. |
| `content.ts` | Every concept, chapter, path and daily prompt: the editorial source. |
| `app.ts` | The data module: serves the content, keeps field notes in one file. |
| `*.test.contract` | Tests, as scripts of taps and expectations that run on every host. |
| `docs/INSTRUMENTS.md` | How to write an instrument: the house style and the rules. |
| `docs/DESIGN.md` | The design: principles, the catalogue of instruments, what is next. |
| `docs/reference/` | The research digest, the original brief, market and App Store notes. |
| `archive/audio/` | Voice recordings made for the previous app; not bundled. |

## History

This repository previously held a SwiftUI app whose teaching relied on
generated illustrations and video. That client, its media and its asset
pipeline were retired in favour of this one (see the git history before
`Rebuild Notice & Name on Exact`). The reviewed copy for the original 22
concepts was carried over into `content.ts`.

## License

Private / internal project.
