# Concept Experience

**Status:** Design locked; implementation in progress (P3)
**Surface:** The native iOS concept-detail screen — the heart of the app.

## Intent

A concept is not a deck to clear. It is a **short contemplative passage** — one big
idea held in a calm field, arriving when the reader is ready for it. The experience
should let someone pause, reflect, understand, and leave whenever they like, without
ever feeling like a task to complete.

This replaces the continuous vertical scroll of stacked cards, which encouraged
surveying rather than dwelling.

## Locked decisions

- **Vertical descent.** Swipe up to move between ideas. Each idea is full-screen and
  full-focus; no peeking neighbor cards pull the eye away. Reading is vertical, so
  descending through a concept feels like deepening attention.
- **Ambient color as wayfinding, plus an index on demand.** The background hue shifts
  per idea; moving to a new hue *is* the signal you have moved to a new kind of thought.
  A quiet named index (Recognize · Name · See · Understand · Reflect · Keep) appears only
  when reached for. No progress bar, no "X of Y", no completion accounting.
- **Reflect without a quiz.** The reflect page offers a gentle prompt, a frictionless
  optional private note, and a single quiet "resonates" gesture. Status becomes a side
  effect of attention, never a graded verdict.

## The page model

Pages compose from whatever blocks a concept has, in authored order, with the response
pages anchored at the end. A missing block simply drops its page.

| Page | Source | Ambient wash | The feel |
| --- | --- | --- | --- |
| Cover | concept name · category · summary | warm canvas | the title you descend from |
| Recognize | `recognize` block | blush | a mirror: "have you ever…?" |
| Name | `definition` block | plum | give it language |
| See | `media` block (illustration or native diagram) | neutral canvas | the illuminating still point |
| Understand | `mechanism` block + citation | sage / moss | grounding |
| Reflect | `reflection` block + note + resonance | quiet | the designed pause |
| Keep | `phrase` block / phrase templates | gold | a phrase to carry; saving is the close |

## Mechanics

- **Native paging, not a custom gesture deck.** `ScrollView(.vertical)` +
  `.scrollTargetBehavior(.paging)` + each page `.containerRelativeFrame(.vertical)`.
  This gives correct momentum, VoiceOver paging, and Dynamic Type for free — the old
  hand-rolled pan/spring carousel fought reading and accessibility.
- **The arrival breath.** `.scrollTransition` drives each page's content from
  slightly-faded-and-offset to full as it reaches center; off-center pages rest dim. The
  idea *surfaces* rather than slides in. One soft haptic on each settle; a warmer note
  when a word or phrase is kept.
- **Ambient wash.** The per-idea accent (the same palette as the block accents) applied
  as a full-screen, few-percent atmosphere — read as place, not decoration.
- **Index on demand.** A single faint dot column on the trailing edge expands on tap into
  the named list; tap an entry to jump. Invisible until reached for.
- **Reflect.** The prompt fades in a beat late so the reader lands in stillness first.
  "Keep a line for yourself" opens an inline private note (reuses existing note saving). A
  lone resonance gesture sets `resonates` with a warm haptic and a small bloom. Curious /
  not-for-me live in the on-demand menu, not as a forced fork.
- **No finish.** Leaving is swipe-down / close from anywhere; the concept settles back into
  the vocabulary. Revisiting can jump straight to any idea.

## Accessibility

- **Reduce Motion** collapses the scroll transitions to plain opacity (or none); haptics
  remain, as they are not motion.
- **Large Dynamic Type** degrades gracefully: if one idea's text exceeds the screen, that
  page scrolls internally rather than clipping. Paging is the default, never a cage.
- **VoiceOver** uses native paging; each page is a labelled group announcing its idea name;
  the on-demand index aids navigation.

## Media

- The 4 mechanism concepts (angling, rocking, shallowing, pairing) render the **native
  SwiftUI diagram** as their See page — it is richer and gently animated.
- The other 18 concepts render their **bundled illustration** (the optimized production
  PNGs under `assets/images/concepts/illustrations/`, copied into the app bundle).
- The framed placeholder remains only as a true fallback for genuinely missing assets.
- Internal paths (`native://…`, `assets/…`) are never shown to the reader.

## Implementation phases

- **P0** (`done`): media path-leak fix; read/write separation.
- **P1** (`done`): per-block hierarchy, ambient accents, surfaced citations, entrance motion.
- **P2** (`done`): native diagrams for the four mechanism concepts.
- **P2.1**: bundle and render the real illustrations at the media layer.
- **P3a**: paged container — vertical paging, page composition, ambient wash, arrival
  breath, settle haptic, Reduce Motion + Dynamic Type handling.
- **P3b**: the page surfaces — Cover, Recognize, Name, See, Understand, Reflect, Keep.
- **P3c**: on-demand index, entry/exit polish, final motion and haptic tuning.
