# Design

## The idea

Most of what makes sex better is knowledge nobody was given: what the anatomy
actually is, how arousal behaves over time, why desire shows up when it does,
what attention does to sensation, and the words to ask for a small change.
Reading about these helps a little. *Feeling* them helps a lot.

So Notice & Name teaches with **instruments**: each concept is a drawing that
responds to the hand. You peel, hold, tilt, tap, drag, and the idea happens in
front of you. The words come after, and they are short.

The loop is the product's name: **notice** something true about how pleasure
works, then **name** it, so it can be found again and asked for.

## Principles

1. **The drawing is the lesson.** If a still picture would teach as much, it is
   not finished. One gesture, one insight, within ten seconds.
2. **Hand-drawn in code.** Every picture is inline SVG written for this app:
   it follows dark mode, text size and reduced motion, it can be touched, and
   it can be corrected by editing a line. Nothing is generated or filmed.
3. **True, and sourced.** Anatomy is drawn as anatomy, simplified and never
   explicit. Every number on screen comes from a study named beside it.
4. **Calm and adult.** No scores, streaks or confetti. No shame and no pep
   talk. Every pattern shown is a normal one.
5. **Private by construction.** No account, no network grant, no analytics.
   The only thing stored is what the person chooses to keep, on the device.
6. **The platform's manners.** Exact draws the platform's own bars, tabs,
   buttons and sheets; the brand lives in the content, not in fighting them.

## The shape of the app

- **Today**: a welcome the first time, then one prompt a day (something small
  to notice, tied to a concept) and five paths through the atlas.
- **Atlas**: six chapters, 26 concepts, each with its own glyph.
- **A concept's page**: the instrument; then *Notice* (a moment you may
  recognise), *Understand* (the mechanism, with its evidence), *Try*, *Say it*
  (five sentences: for myself, to ask, a boundary, getting curious, to
  reassure; keep or share any of them), *Reflect* (a private note), and *How
  does this land?* (resonates, curious, not for me).
- **Yours**: the vocabulary those answers build, kept phrases, field notes,
  and erase-everything.

On a wide window the instrument stays beside the words; on a phone it leads.

## The catalogue

Each instrument, its gesture, and the one thing it is for.

### The Map — anatomy most of us were never shown

| Concept | Gesture | What you find out |
| --- | --- | --- |
| The Whole Clitoris | Drag down through the skin | The bead you can see is the tip of an organ about nine centimetres long: body, bulbs and legs appear in turn. |
| Nerve Density | Slide a lens across the skin; change the pressure | A handful of endings fire on the thigh, a blaze on the glans; there, "firm" is simply too much signal. |
| The Front Wall | Tap each tissue | Clitoris, urethra and front vaginal wall meet in one neighbourhood: what "G-spot" names. |
| Reaching Inside | Drag a pressure point inside the canal | Toward the front wall reaches the internal clitoris; deeper does not. |

### The Curve — how arousal moves through time

| Concept | Gesture | What you find out |
| --- | --- | --- |
| The Warm-up Window | Scrub through half an hour | Arousal is a physical change: tissue fills, and touch that was too sharp becomes good. |
| Building | Press and hold | It starts as almost nothing, then carries itself; let go and it fades slowly, so a pause is not a reset. |
| Plateauing | Set how much touch there is | Some amount of touch simply holds the level: a hover is a place, not a stall. |
| Edging | Hold to climb, let go before the edge | Approach, ease back, approach again; the wanting stays, and release after approaches lands differently. |
| Pulsing | Tap along | High arousal has a beat, about one every 0.8 seconds at orgasm; touch can meet it. |
| Spreading | Touch a spot, widen attention | Sensation can leave the place being touched and travel through the body. |

Building, Plateauing and Edging are one simulation (`engine.contract`) played
three ways, so the same model of arousal is felt from three sides.

### Wanting — where desire comes from

| Concept | Gesture | What you find out |
| --- | --- | --- |
| Spontaneous Desire | Tap anywhere in an ordinary day | Wanting can arrive first, out of nowhere. One door, not the standard. |
| Responsive Desire | Add context to a coal | Arousal lifts first; wanting wakes second. No spark beforehand is not a no. |
| Brakes & Accelerators | Tap what is true tonight | Brakes outweigh accelerators: lifting one does more than adding stimulation. |
| Non-concordance | Compare two meters; switch the scatter | Body response and felt arousal are separate signals, and in women barely correlated. Ask; do not infer. |

### Attention — where your mind is changes what your body feels

| Concept | Gesture | What you find out |
| --- | --- | --- |
| Spectatoring | Drag attention between the body and its observer | Watching yourself from outside flattens the signal; coming back restores it. |
| Embodied Presence | Tap a drifting thought to let it pass | Presence is not an empty mind: it is the return, again and again. |
| Body Appreciation | Wipe between "seen" and "felt" | The same body is a list of parts from outside, and warmth and pressure from inside. |
| Sexual Self-Esteem | Tap an old story to rewrite it | Not confidence: permission. |

### Touch — named moves you can notice, repeat and ask for

| Concept | Gesture | What you find out |
| --- | --- | --- |
| The Language of Touch | Set pressure, pace, pattern, place | Any touch is four words, and the four words make a sentence you can say. |
| Angling | Drag to tilt the pelvis | A few degrees moves where the same pressure lands. |
| Rocking | Pull two forms apart; switch thrusting and rocking | Thrusting breaks external contact every stroke; rocking never does. |
| Shallowing | Drag along the canal | The entrance is the most densely nerved part: a destination, not a warm-up. |
| Pairing | Switch inside and outside on | One organ, reached from both ends. |
| The Golden Trio | Add kinds of touch | 50, then 71, then 86 in a hundred: variety is ordinary. |

### Saying It — turning what you know into words between you

| Concept | Gesture | What you find out |
| --- | --- | --- |
| The Orgasm Gap | Tap a bar to compare | Women with women, 86; women with men, 65. Same bodies, different script. |
| Asking | Build a sentence from three parts | Warm, specific, and an invitation: a request someone can actually act on. |

## Visual language

Warm paper, plum ink, and one hot colour. `ember` is always the live thing: a
touch, heat, arousal. `rose` is the body at rest, `sage` is calm and safety,
`dusk` is the watching mind, `honey` is desire and insight. Titles and the
instrument's Caption are set in the system serif; everything else is the
platform's own text. The full rules are in [`INSTRUMENTS.md`](INSTRUMENTS.md).

## Not carried over, and next

- **Purchases and app lock.** The previous client had a StoreKit unlock and a
  biometric lock. Exact has recipes for both (`purchases`, `permissions`);
  neither is wired yet, so every concept is open.
- **Voice.** The recorded phrases in `archive/audio` match the original 22
  concepts' sentences and could be played from *Say it*.
- **Native polish.** The app is developed on Exact's web host and its tests
  also pass on the native Linux host. iOS and macOS build from the same
  source but have not been run or had a design pass on device.
- **Text size.** Body text follows the reader's text size without limit and
  display type follows it to a cap. Labels inside a drawing scale with the
  drawing instead; what they say is always also in the Caption.
- **Wider still.** Candidates with a clear instrument: the pelvic floor,
  aftercare and comedown, pain as information, desire across a long
  relationship, and a couple's mode where two people compare maps.
