# Pleasure Vocabulary Builder — Full UI Review & Creative Plan

**Date:** May 20, 2026  
**Author:** Code Review Agent  
**Scope:** App chrome, ConceptDeck, component library, interaction patterns, visual identity gaps, and a creative proposal for elevating the experience from "polished prototype" to "delightful product."

---

## 1. Executive Summary

Pleasure Vocabulary Builder is a **remarkably strong MVP** built in roughly one week of intensive development. It has a coherent visual identity ("Scientific Warmth"), a well-architected backend, 22 concepts of editorial content, and a functioning 5-slide learning deck. The current state scores **~7/10** on core UX and **5/10** on visual polish — the foundation is solid, but the experience has not yet crossed the threshold from "functional educational app" to "delightful, habit-forming learning companion."

This review identifies **three opportunity horizons:**

1. **Fix the friction** — accessibility, gesture polish, dead code, responsive gaps.
2. **Elevate the craft** — motion design, typography as experience, haptics, and micro-interactions that reward curiosity.
3. **Think bigger** — rethink the core loop so the app becomes a *pleasure literacy companion*, not just a deck viewer.

---

## 2. What the Product Aims to Do

### The North Star
Help users (primarily women and their partners) build a **precise, evidence-based vocabulary for sexual pleasure** — turning intuitive bodily experiences into named, reproducible, communicable concepts.

### The Differentiation (from audit + market analysis)

| Dimension | This App | Dipsea | Ferly | OMGyes |
|-----------|----------|--------|-------|--------|
| **Format** | Named concepts + citations + pathways | Audio erotica | Mindfulness/guided practices | Video demonstrations |
| **Hook** | Language & mastery through naming | Mood & story | Body awareness & shame reduction | Explicit technique demos |
| **Tone** | Warm, editorial, evidence-based | Entertainment | Clinical wellness | Direct instruction |
| **Privacy model** | Local-first, no account | Cloud subscription | Cloud subscription | Web purchase |

The app occupies a unique position: **it's the Merriam-Webster + National Geographic of pleasure** — authoritative but beautiful, precise but warm. That positioning should be felt in *every pixel*.

### The Core Loop (as designed)

1. **Discover** — Home suggestion, Library browse, or Pathway journey.
2. **Learn** — Complete the ConceptDeck (5 slides): Recognize → Name → Illustrate → Understand → Reflect.
3. **Mark** — Set resonance: "Tried it" / "Curious" / "Not for me."
4. **See patterns** — Atelier profile surfaces category affinities and collection.
5. **Communicate** — Use scripts and starters to talk about discoveries.

### The Loop's Missing Emotional Beat

The current loop is *cognitively* complete but *emotionally* thin. There's no:
- **Mastery signal** — "You now know 12 concepts. You speak pleasure more precisely than 80% of users."
- **Social proof of learning** — "People who resonated with 'Responsive Desire' also explored..."
- **Rhythm of return** — No streaks, no gentle nudges, no "today's concept takes 90 seconds."
- **Celebration of courage** — Marking a concept as "resonates" should feel like a small act of self-knowledge, not a database update.

---

## 3. Current State: What Exists & How It Executes

### 3.1 Architecture & Foundation (Strong)

| Area | Assessment | Score |
|------|-----------|-------|
| Design system tokens | `theme.ts` is comprehensive: colors, typography (Major Third scale), spacing, shadows, semantic status | ⭐⭐⭐⭐⭐ |
| Component primitives | Button, Card, Container, Typography, Badge, ProgressBar are solid and typed | ⭐⭐⭐⭐ |
| Backend / data layer | Repository pattern, SQLite + AsyncStorage adapters, Zod validation, 198 passing tests | ⭐⭐⭐⭐⭐ |
| Error handling | Toast, full-screen, inline — well-architected | ⭐⭐⭐⭐ |
| Asset pipeline | Manifest-driven, compress-assets script, validate-manifest CI | ⭐⭐⭐⭐ |

### 3.2 Screens & Flows (Functional, Uneven)

| Screen | Status | Quality Notes |
|--------|--------|---------------|
| **Onboarding** | ✅ Complete | Warm gradient welcome, goal selection with radio accessibility, privacy承诺. No progress indicator. No skip. |
| **Home** | ✅ Complete | Greeting, daily suggestion hero, stats row, resume card. Articles fetched but **not rendered** (dead code). Header image fragile. |
| **Library** | ✅ Complete | All / Pathways / Research toggle. Category filters. **2-column math defined but `numColumns={1}`** — single column only. No search. No empty state for filters. |
| **ConceptDeck** | ✅ Complete | 5-slide arc with media types. FlatList paging. **No gesture handler** — swipe is scroll-based, can be jittery. No screen reader announcements for slide changes. |
| **Journal** | ✅ Complete | Editorial date sidebar, compose inline, long-press delete. **Undiscoverable delete**, no edit, no concept linking during creation. |
| **Profile (Atelier)** | ✅ Complete | Bento grid, pattern insight banner, collection shelf. Fixed card dimensions. Insights recalculate on render (now memoized ✅). |
| **Communication** | ✅ Complete | Starters/Scripts/Barriers tabs. Accordion cards. No copy-to-clipboard. |
| **Share** | 🟡 Functional | Checkboxes, toggle, preview bubble, native share. Switch accessibility incomplete. No image/PDF export. |
| **Explainer detail** | ✅ Complete | Editorial article with hero, takeaways, quotes, myth cards. `scrollY` unused. No reading progress. |
| **Pathway detail** | ✅ Complete | Progress card, step list with connectors. No completion celebration. |

### 3.3 Motion & Interaction (Partial)

| Element | Implementation | Assessment |
|---------|---------------|------------|
| Slide entrance animations | Reanimated `FadeInDown`, `ZoomIn`, `FadeInUp` | ⭐⭐⭐⭐ Clean, staggered |
| Resonance burst | Lottie overlay, respects `reduceMotion` | ⭐⭐⭐⭐⭐ Excellent |
| Pulse heart | Reanimated spring + ring burst | ⭐⭐⭐⭐ Nice micro-interaction |
| ConceptDeck swipe | FlatList `pagingEnabled` | ⭐⭐⭐ Functional, not delightful |
| Skia diagrams | 4 interactive diagrams (Angling, Rocking, Shallowing, Pairing) | ⭐⭐⭐⭐⭐ Sophisticated |
| Tab bar | PNG images, 100px height, opacity-only inactive state | ⭐⭐⭐ Doesn't tint, too tall |
| Toast | Legacy `Animated` API | ⭐⭐⭐ Should use Reanimated |
| Progress bar | No animation on change | ⭐⭐⭐ Jarring jumps |

### 3.4 Visual Identity Execution (Mixed)

| Layer | Status | Issue |
|-------|--------|-------|
| **Shell (app chrome)** | 🟡 Good | Typography tokens solid. Some hardcoded colors. Tab bar uses PNGs not vectors. |
| **Concept plates (illustrations)** | 🟡 Mixed | ~most exist; quality uneven; 5 reference renders approved; batch regen paused |
| **Thumbnails** | 🟡 Mixed | Several missing or using illustration fallback |
| **Video/motion** | 🟡 Partial | 3 MP4s wired; building/pulsing prompts ready; some too large |
| **Interactive (Skia)** | ✅ Good | 4 wired, palette matches theme |

### 3.5 Accessibility (Partial — Needs Investment)

| Requirement | Status | Gap |
|-------------|--------|-----|
| Touch targets ≥44pt | 🟡 Partial | Mute button, deck controls need audit |
| Reduced motion fallback | ✅ Good | Video + Lottie both respect setting |
| Screen reader support | ❌ Weak | No slide change announcements, missing `accessibilityLabel` on icon buttons, no focus trapping in modals |
| Contrast ≥4.5:1 | 🟡 Likely OK | Theme tokens designed for it, but not systematically tested |
| Dark mode | ❌ Out of scope (v1.0) | `Colors.ts` dead code creates confusion |

---

## 4. Gap Analysis: What's Missing

### 4.1 Engineering Gaps (Fixable in days)

1. **ConceptDeck gestures** — Replace FlatList scroll with `PanGestureHandler` + Reanimated snap points. Add rubber-band resistance at edges.
2. **Dead code** — `Colors.ts`, unused `ResonanceSelector`, unrendered Home articles, duplicate `getCategoryIcon`.
3. **Responsive dimensions** — Replace `Dimensions.get('window')` with `useWindowDimensions` + rotation handling.
4. **Accessibility pass** — Add `accessibilityRole`, `accessibilityLabel`, focus management, slide change announcements.
5. **Journal UX** — Add edit, confirm-delete, concept-linking during creation.

### 4.2 Craft Gaps (Fixable in weeks)

1. **Typography as experience** — Currently static. Could use kinetic type: concept names that gently breathe, italic prompts that fade in word-by-word.
2. **Haptic vocabulary** — No haptics except possibly on buttons. Could use: light tap on slide advance, success pattern on resonance, subtle tick on progress.
3. **Shared element transitions** — Concept card thumbnail → Illustrate slide could morph seamlessly.
4. **Tab bar redesign** — Vector icons with active tint + subtle spring animation. Reduce height.
5. **Empty states** — Generic illustrations. Could be contextual: "Your collection is waiting for its first concept" with a warm CTA.
6. **Onboarding completion** — No celebration. A small Lottie or particle burst when finishing goals selection would reinforce commitment.

### 4.3 Strategic Gaps (Fixable in months — the "think bigger")

1. **No learning rhythm** — The app waits for the user to open it. There's no gentle, respectful nudge: "Today's 90-second concept: Building."
2. **No mastery arc** — 22 concepts is a perfect-sized corpus for a "Pleasure Literacy" level system. Beginner → Explorer → Fluent → Scholar.
3. **No connection between concepts** — "If you liked Responsive Desire, try Warm-up Window" is buried. The relationship graph should be visual and explorable.
4. **No communication scaffolding** — The toolkit is static. What if users could build a "share sheet" of their discoveries *as a conversation script*?
5. **No reflection depth** — Journal entries are isolated. What if the app occasionally surfaced past entries alongside related concepts?

---

## 5. Domain Research: Best Practices in Educational & Wellness Apps

### 5.1 What Great Learning Apps Do

**Duolingo** (gamification benchmark)
- **Micro-session design**: Every lesson is ~5 minutes. The app never asks for more than the user has.
- **Streaks & stakes**: Daily engagement is driven by loss aversion (streak freeze) + small rewards.
- **Character personality**: The owl has *opinions*. The app feels like it cares whether you return.
- **Lesson for PVB**: The ConceptDeck is already micro-sized (~2–3 min). But there's no *reason* to do one today vs. next week. A "Pleasure Literacy Streak" or "7 Concepts in 7 Days" challenge could create rhythm.

**Headspace** (mindfulness/wellness benchmark)
- **Atmospheric design**: Color, sound, and motion all signal "this is a safe space" before content begins.
- **Progressive disclosure**: Beginners see simple paths. Advanced users unlock deeper content.
- **Haptic + sonic feedback**: Each interaction has a gentle sound + haptic. The app feels *meditative*.
- **Lesson for PVB**: The "Scientific Warmth" identity is close, but the app doesn't *sound* or *feel* warm enough yet. Add subtle haptics. Consider ambient sound on the Reflect slide. Make the deck feel like turning pages in a leather journal.

**Codecademy / Tandem** (skill-building benchmarks)
- **Immediate application**: You learn a concept, then immediately use it.
- **Community visibility**: Seeing that others struggled with the same concept reduces shame.
- **Lesson for PVB**: The "Try This" slide is good, but it's text-only. What if it offered a 30-second guided reflection (voiceover)? Or a check-in 24 hours later?

### 5.2 What Great Wellness Apps Do

**Ferly** (sexual wellness direct competitor)
- **Body mapping**: Guided touch sessions with journaling. PVB is more cognitive; Ferly is more somatic. PVB's niche (naming + science) is defensible.
- **Shame reduction**: Language is consistently non-judgmental, but also *celebratory*.
- **Lesson for PVB**: The copy is already excellent (non-judgmental, second-person). But the UI doesn't *celebrate* enough. Resonance selection should feel like self-discovery, not data entry.

**OMGyes** (technique education benchmark)
- **Interactive video**: Users control pressure, speed, location in video demos.
- **Explicit but respectful**: No shame, no euphemism, but also no pornography. Clear educational framing.
- **Lesson for PVB**: The Skia diagrams are the right direction. More interactivity (e.g., a "try the motion" haptic pattern for Pulsing/Building) could make concepts *felt*, not just understood.

### 5.3 2025 Mobile Design Trends Relevant to PVB

| Trend | Application to PVB |
|-------|-------------------|
| **Emotion-driven design** | Color psychology, micro-interactions, subtle animations that reduce anxiety and reward curiosity |
| **Kinetic typography** | Concept names that gently animate on slide entry; italic prompts that fade in word-by-word |
| **Microinteractions** | Haptic on slide advance, spring on resonance select, progress bar animation |
| **Variable fonts** | Not currently used, but could enable smooth weight transitions on focus/interaction |
| **3D / depth with clarity** | Subtle parallax on ConceptDeck slides, layered depth on Atelier bento cards |
| **AI personalization** | Adaptive daily suggestions based on resonance patterns, not just rotation |

---

## 6. Design Inspiration: Principles from Beautiful Apps

### 6.1 On "Kimi K2.6 Case Studies"

Research into Kimi K2.6 (Moonshot AI's latest model) did not surface published UI/UX case studies — K2.6 is primarily known for agentic coding, multimodal reasoning, and long-context comprehension. However, the **Kimi Chat app itself** embodies several principles worth studying:

- **Clean, responsive UI**: Minimalist with focus on speed and readability.
- **Fluid response flow**: Low-latency performance even during large input processing.
- **Dark mode craftsmanship**: Naturally adapts for eye comfort.
- **File upload & context retention**: Seamless multimodal experience.

**Principles to borrow:**
1. **Speed as a feature** — Every interaction in Kimi Chat feels instant. PVB's FlatList deck could feel sluggish by comparison. Gesture-driven + Reanimated = 60fps commitment.
2. **Clarity over decoration** — Kimi doesn't compete with your content. PVB's shell should be even more invisible.
3. **Multimodal coherence** — Text, image, and video should feel like one continuous surface, not different "modes."

### 6.2 Cross-Domain Beautiful Design Patterns

**Apple Journal app**
- **Moment-based entry**: Photos, location, workouts auto-suggested as journal prompts.
- **Filtered photo grids**: Browsable, tappable, intimate.
- **Lesson for PVB**: The Journal screen could suggest entries based on recently explored concepts: "You read about Edging today. Want to note any thoughts?"

**Spotify Wrapped / Apple Music Replay**
- **Pattern visualization**: Abstract, beautiful data about your behavior.
- **Shareable artifacts**: Designed explicitly for social sharing.
- **Lesson for PVB**: The Atelier profile could generate a "Pleasure Literacy Report" — a beautiful, shareable summary of your resonance patterns, top categories, and concepts mastered.

**Kinfolk magazine (editorial design)**
- **Generous whitespace**: Text breathes. Images have room to be felt.
- **Serif + sans-serif harmony**: Editorial authority + modern clarity.
- **Lesson for PVB**: The Playfair Display + Inter pairing is already strong. Lean into it: let headings be *bigger*, let body text have *more* line height, let images sit in *more* negative space.

**Notion / Craft (document apps)**
- **Block-based editing**: Everything is a manipulable unit.
- **Slash commands**: Discovery of features without leaving the keyboard.
- **Lesson for PVB**: The ConceptDeck is already "block-based" (slides). Could the Reflect slide offer quick-reaction "blocks" that feel tactile and rearrangeable?

---

## 7. Creative Proposal: Making It Delightful

### 7.1 The Design Philosophy: "The Living Laboratory"

The Style Bible says "a living journal in a modern laboratory." I propose we push this further:

> **"Every interaction should feel like turning the page of a book that knows you."**

The app should feel:
- **Tactile** — Swipes have weight. Buttons press back. Progress glows.
- **Intelligent** — It remembers, connects, suggests without being pushy.
- **Respectful** — Never demanding. Always inviting. Privacy is felt, not just stated.
- **Beautiful** — The kind of beautiful that makes you want to show someone: "Look at this app."

### 7.2 The Big Ideas

#### Idea 1: "The Deck as Object" — A Gesture-Driven, Physical Deck

**Current:** FlatList scrolls horizontally. Functional but generic.

**Proposed:** The ConceptDeck becomes a *physical object* in space:
- Swipe with **momentum and snap** — like shuffling cards. Use `react-native-reanimated-carousel` or custom `PanGestureHandler` with spring physics.
- **Edge peek**: The next slide is visible at ~15% opacity on the right edge, inviting continuation.
- **Progress as a glow**: A subtle coral glow intensifies along the bottom edge as you advance through the 5 slides — not just dots, but a *pulse*.
- **Slide transitions**: Each slide doesn't just appear; it *settles* — a micro-scale-down from 1.02→1.0 + fade, giving weight to the content.
- **Haptic signature**: Light `impactLight` on slide snap, medium `impactMedium` on reaching Reflect.

**Why this matters:** The deck is the core loop. Making it feel *crafted* elevates every concept.

#### Idea 2: "Resonance as Ritual" — A Celebratory Reflection Moment

**Current:** Three cards. Tap one. Lottie plays. Router.back(). Done.

**Proposed:** Marking resonance becomes a small ritual of self-knowledge:
- **Selection**: The chosen card gently lifts (shadow deepens, scale 1.03) with a warm haptic.
- **Confirmation**: A particle burst (subtle, like bioluminescent dust) emanates from the touch point — using Skia or Reanimated particles, themed to the category color.
- **The Quote**: A single, beautifully typeset line appears: *"Naming is the first act of mastery."* (or category-specific quotes).
- **The Bridge**: Instead of immediate `router.back()`, a 1.5s moment of stillness, then a gentle cross-fade back to Library with the concept card now showing its new status.
- **Optional**: A soft chime (if sound is enabled in settings) — a single crystal bowl tone.

**Why this matters:** The emotional peak of the app is *acknowledging* that something resonated. Don't rush it.

#### Idea 3: "The Atelier as Mirror" — A Profile That Feels Personal

**Current:** Bento grid + shelf. Informative but static.

**Proposed:** The profile becomes a *mirror* of the user's pleasure literacy journey:
- **The Bloom**: A generative, abstract "flower" or "aura" visualization in the profile header that grows/morphs based on explored categories. Techniques = geometric structure. Sensations = flowing color. Psychology = depth/layers. Anatomy = branching networks. Built with Skia or even a simple animated SVG.
- **Milestone ribbons**: "First concept explored", "5 techniques named", "Anatomy scholar", "Psychology curious" — small, delightful badges that appear without modal interruption (a subtle toast or inline pop).
- **The Report**: Monthly or on-demand, generate a "Pleasure Literacy Report" — a beautifully designed, shareable summary. Think Spotify Wrapped but intimate and private. Export as image (using `react-native-view-shot`) or PDF.
- **Pattern poetry**: Instead of "Your top category is Techniques," try: *"You're drawn to the geometry of touch — techniques that shape sensation with intention."* The app speaks *to* the user, not *about* them.

**Why this matters:** The profile is where users see themselves. Make it feel like self-discovery, not analytics.

#### Idea 4: "Pathways as Journeys" — Narrative Progression

**Current:** Step list with connector lines. Functional.

**Proposed:** Pathways become *journeys* with narrative texture:
- **The Map**: A zoomable, scrollable "map" rather than a list. Each concept is a node; lines between them pulse when traversable.
- **Unlock moments**: When completing a pathway's prerequisite concept, the next node "blooms" open with a small animation — not a lock disappearing, but a *bud opening*.
- **Guide voice**: Optional short intro text per pathway: "This path is for those who want to understand the landscape before exploring the territory." (or similar, per pathway personality).
- **Completion ritual**: Finishing a pathway triggers a celebration — a full-screen moment with a summary of concepts learned, optionally shareable.

**Why this matters:** Pathways are the macro structure. If they feel like checklists, users churn. If they feel like journeys, they complete.

#### Idea 5: "Gentle Rhythm" — Respecting Attention, Building Habit

**Current:** The app is passive. It waits.

**Proposed:** Respectful, opt-in rhythm features:
- **"A moment of clarity"**: Optional daily notification (customizable time) with a single concept name and one-sentence prompt: *"Today's concept: Building. Notice when sensation rises today."*
- **The 90-second promise**: On the Home screen, prominently: "Next concept takes 90 seconds." Reduce friction to start.
- **Weekly reflection**: Sunday evening optional prompt: "This week you named 3 new concepts. Want to journal about one?"
- **Streaks without shame**: If a user misses a day, the streak doesn't break with a sad face. It pauses: "Your exploration continues when you're ready."

**Why this matters:** Habit formation requires *reliable triggers* and *low friction*. The content is already micro-sized. The app just needs to nudge gently.

#### Idea 6: "The Journal as Dialogue" — Between User and Self

**Current:** Inline compose, date sidebar, long-press delete.

**Proposed:** The journal becomes a *dialogue*:
- **Prompted entries**: When exploring a concept, offer a one-tap "Journal about this" button that pre-populates the concept tag and a starter prompt: *"What does 'Responsive Desire' change about how you see your own arousal?"
- **Mood/sensation tagging**: Simple tags before saving: "Curious", "Surprised", "Validating", "Uncertain". These become part of the pattern insight.
- **Memory surfacing**: Occasionally show past entries: "3 months ago you wrote about Building. Re-reading it now — does it land differently?"
- **Visual entries**: Allow attaching a color or abstract shape (from a small palette) to entries — the journal becomes visually browseable.

**Why this matters:** Journaling is where learning becomes *embodied*. The app should make that transition effortless.

#### Idea 7: "Communication as Courage" — Scripts That Feel Yours

**Current:** Static starters, scripts, barriers. Accordion cards.

**Proposed:** The communication toolkit becomes *personalized*:
- **"Build your starter"**: Let users tap to assemble a script from modular phrases, then copy/share. Like Mad Libs for intimacy communication.
- **Practice mode**: A "rehearse" feature where the user can read the script aloud (voice recording optional, private) and the app gives gentle feedback on pace/tone (using simple on-device audio analysis, or just a timer).
- **Barriers as unlocks**: When a user marks a concept as "resonates", related barrier cards unlock additional reassuring language: "You resonated with 'Non-concordance'. Here's language for when your body and mind feel out of sync."

**Why this matters:** Communication is the *outcome* of literacy. The app should scaffold the hardest part: actually speaking.

### 7.3 Visual Identity Evolutions

#### Typography: From Static to Living

- **Deck entrance**: Concept names use a subtle "typewriter" or word-by-word fade on the Recognize slide. Not flashy — just *deliberate*.
- **Italic intimacy**: The `deckPrompt` italic serif is already beautiful. Let it appear with a slightly longer fade — like someone speaking thoughtfully.
- **Variable font exploration**: If Playfair Display Variable becomes available via Expo, animate weight on scroll for headlines.

#### Color: From Palette to Atmosphere

- **Ambient tinting**: Each slide type has a *very* subtle ambient tint that bleeds into the shell. Recognize = warm blush. Illustrate = cream. Understand = cool sage. Reflect = deep coral. The transition between slides softly cross-fades these tints.
- **Bioluminescent accents**: The "glow" metaphor from the Style Bible should animate. On the Illustrate slide, a subtle, slow-breathing glow behind the image — like living tissue.

#### Motion: From Animation to Physics

- **Spring everything**: All scaling, opacity, and translation should use `withSpring` with consistent configs. The app should feel like it has *mass*.
- **Parallax depth**: On the ConceptDeck, background elements (decorative shapes, gradients) move at 0.5x the slide velocity, creating depth.
- **Scroll-linked**: On explainer articles, the hero image slowly scales down (0.95→1.0) as you scroll, creating a "settling" feeling.

---

## 8. Implementation Roadmap

### Phase A: Foundation (Week 1–2) — Fix the Friction

| Task | Effort | Files |
|------|--------|-------|
| Remove dead code (`Colors.ts`, `ResonanceSelector`, unrendered Home articles) | ½ day | `constants/Colors.ts`, `components/ResonanceSelector.tsx`, `app/(tabs)/index.tsx` |
| Replace `Dimensions` with `useWindowDimensions` + rotation handling | 1 day | `components/conceptdeck/*`, `components/diagrams/*` |
| Accessibility pass: labels, roles, focus management | 2 days | All interactive components |
| ConceptDeck gesture refactor: `PanGestureHandler` + Reanimated snap | 3 days | `components/ConceptDeck.tsx` |
| Journal UX: edit, confirm-delete, concept-linking | 2 days | `app/(tabs)/journal.tsx` |
| Tab bar: vector icons + spring animation + reduced height | 1 day | `app/(tabs)/_layout.tsx` |

### Phase B: Craft (Week 3–5) — Elevate the Experience

| Task | Effort | Files |
|------|--------|-------|
| Haptic integration across core flows | 1 day | `components/ConceptDeck.tsx`, `components/conceptdeck/ReflectSlide.tsx` |
| Slide transition polish: spring settle + cross-fade | 2 days | `components/conceptdeck/*` |
| Resonance ritual: particle burst + quote + pause | 3 days | `components/conceptdeck/ReflectSlide.tsx` |
| Progress glow animation | 1 day | `components/ConceptDeck.tsx` |
| Atelier refresh: abstract aura visualization | 4 days | `app/(tabs)/profile.tsx` + new Skia/SVG component |
| Empty states: contextual copy + illustration | 2 days | `components/ui/EmptyState.tsx` |
| Toast migration to Reanimated | 1 day | `components/error/Toast.tsx` |
| Onboarding celebration | ½ day | `app/onboarding/goals.tsx` |

### Phase C: Delight (Week 6–10) — Think Bigger

| Task | Effort | Files |
|------|--------|-------|
| Daily suggestion rhythm + notifications | 3 days | `lib/notifications.ts`, `app/(tabs)/index.tsx` |
| Streaks without shame | 2 days | `lib/streaks.ts`, `app/(tabs)/profile.tsx` |
| Pathway map visualization | 5 days | `app/pathway/[id].tsx` + new map component |
| Pleasure Literacy Report (shareable) | 4 days | `app/share.tsx`, `components/ReportView.tsx` |
| Journal prompts + memory surfacing | 3 days | `app/(tabs)/journal.tsx`, `hooks/useJournal.ts` |
| Communication builder (modular scripts) | 4 days | `app/communicate.tsx` |
| Ambient slide tinting | 2 days | `components/ConceptDeck.tsx` |
| Scroll-linked parallax (explainers) | 2 days | `app/explainer/[id].tsx` |

### Phase D: Asset Track — Visual Coherence 🟡 Started May 21, 2026

| Task | Effort | Status |
|------|--------|--------|
| Batch regenerate all 22 illustrations + thumbnails | 3–4 weeks | 🟡 Queue: `npm run batch-asset-queue` |
| Generate remaining video loops (Pulsing, Spontaneous Desire, Embodied Presence) | 1 week | 🟡 Prompts ready; P0+P1 in `VIDEO_PILOT_BATCH.md` |
| Pathway hero images + explainer headers | 3 days | 🟡 Prompts: `prompts/shell/pathways/`, `explainers/` |
| UI shell image refresh (slide backgrounds, empty states) | 2 days | 🟡 Prompts: `prompts/shell/ui/` |

**Runbook:** `docs/pipelines/PHASE_D_RUNBOOK.md`

---

## 9. Success Metrics

| Metric | Baseline | Target | How to Measure |
|--------|----------|--------|----------------|
| Concept completion rate | Unknown | ≥40% of opened concepts reach Reflect | Repository event logging |
| Deck Illustrate engagement | Unknown | ≥15s median on slide 3 | Time-on-slide tracking |
| Resonance marking rate | Unknown | ≥25% of completions set non-default | Repository analytics |
| 7-day retention | Unknown | ≥30% return after first concept | Onboarding → Day 7 visit |
| Share initiated | Unknown | ≥5% of profile visits | Share sheet trigger count |
| NPS / subjective delight | Unknown | Qualitative: "Beautiful" mentioned in 50% of feedback | TestFlight feedback |

---

## 10. Conclusion

Pleasure Vocabulary Builder is already a **good product**. With focused investment in three areas — **gesture physics, emotional ritual, and learning rhythm** — it can become a **great product**.

The core insight is this: **users don't come to this app to "consume content." They come to feel more articulate, more empowered, and less alone in their bodies.** Every design decision should serve that emotional outcome.

The FlatList should feel like a deck of cards. The resonance selection should feel like self-discovery. The profile should feel like a mirror. The daily notification should feel like a friend who remembers what you're learning.

The technology is ready. The content is ready. The identity is ready. **Now make it feel alive.**

---

*This document should be reviewed alongside:*
- `docs/design/STYLE_BIBLE.md` (visual identity)
- `docs/PROJECT_STATUS_REPORT.md` (current status)
- `docs/IMPLEMENTATION_PLAN.md` (execution timeline)
