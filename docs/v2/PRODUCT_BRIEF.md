# Pleasure Vocabulary Builder V2 Product Brief

**Status:** Draft 0.1  
**Track:** Premium native product  
**Product client:** iOS SwiftUI app in `ios/`, local-first by default

## Product Spine

Pleasure Vocabulary Builder V2 helps adults build a private, precise language for their
own pleasure and, when they choose, translate that language into partner-safe
communication.

The product is not primarily a glossary, course, tracker, or erotica experience. It is a
private vocabulary workspace: a place where a user can recognize an experience, learn the
word for it, decide whether it fits, and keep language they may use later.

## Primary Promise

Build a clearer, kinder vocabulary for what feels good, what does not, what you are
curious about, and how to say it.

## Core Loop

1. **Notice** a felt experience, question, or pattern.
2. **Name** it with evidence-grounded vocabulary.
3. **Personalize** the term: resonates, curious, not for me, tried.
4. **Reflect** privately in a small field note.
5. **Translate** into a phrase the user could keep or share.

## Product Pillars

| Pillar | Meaning in V2 |
| --- | --- |
| Private by default | No account, no sync, no analytics requirement, no public profile |
| Language before performance | The app helps users name and communicate, not optimize themselves |
| Native intimacy | SwiftUI, haptics, motion, typography, and privacy affordances should feel made for the device |
| Evidence with warmth | Research-backed without clinical coldness or overclaiming |
| Reusable self-knowledge | A concept is not complete when read; it becomes useful when fitted to the user's language |

## Primary Audience

Adults, especially women and partners, who want better language for sexual pleasure,
arousal, anatomy, and communication. They are curious, privacy-sensitive, and likely
frustrated by vague sex education, generic wellness advice, or overly explicit formats.

## V2 Information Architecture

| Area | Job |
| --- | --- |
| Today | One gentle prompt, one suggested word, or one unfinished reflection |
| Vocabulary | The user's saved, resonant, curious, and rejected words |
| Explore | Guided pathways and full concept library |
| Journal | Private field notes, optionally linked to concepts |
| Share Builder | Convert selected concepts and reflections into partner-safe language |

The app may not need a permanent Share tab. In the first prototype, share building should
be available from concept and vocabulary detail screens.

## What Changes From V1

| V1 Pattern | V2 Direction |
| --- | --- |
| ConceptDeck as universal lesson format | Flexible concept detail with learning blocks, field notes, and phrases |
| Library-forward navigation | Today and personal vocabulary become the emotional center |
| Progress/streak framing | Pattern of self-knowledge over completion mechanics |
| Hardcoded TypeScript content | Validated content bundles consumed by the app |
| Share as endpoint | Partner-safe language woven into concept usage |
| Asset-heavy obligation per concept | Media earns its place; native typography and interaction can carry simple concepts |

## Golden Path Prototype

The first native slice should cover five concepts:

- Responsive Desire
- Angling
- Pairing
- Spectatoring
- Non-concordance

The slice is complete when a user can onboard, open Today, learn one concept, mark how it
fits, write one private note, generate one saved phrase, and see Vocabulary reflect that
activity.

## Non-Goals For The First Native Slice

- Accounts
- Remote sync
- Subscription mechanics
- AI personalization
- Full 22-concept migration
- Android parity
- A web app
- Public community features

These are not rejected forever. They are delayed until the native private experience proves
itself on device.

## Success Criteria

- The app feels meaningfully calmer, safer, and more intimate than a generic content deck.
- Content can be updated without editing Swift views.
- Private user state is local and deletable.
- The golden path works on device without placeholder UI.
- A user can leave with one word and one phrase they might actually use.
