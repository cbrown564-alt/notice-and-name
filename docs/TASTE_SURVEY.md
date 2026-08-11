# Taste Survey — reusable patterns for Notice & Name

**Surveyed:** 2026-08-11 (Europe/London)  
**Scope:** Read-only pass over Conor Brown repos under `/Users/cobro/code/`.  
**Target product:** Notice & Name — private educational iOS app for sexual pleasure vocabulary (Soft Intimate voice, local-first, calm UI, research-backed concepts).  
**Method:** README / PRODUCT / DESIGN / pipeline docs first; then TTS/voice, media, privacy, and UX hotspots. No repo modifications except this file.

---

## Taste thesis

Across the portfolio, Conor's product taste is consistent even when domains differ (Irish heritage, ML pedagogy, football history, speech coaching, local studio):

1. **Intimate + exacting, never gamified.** Warmth without sentimentality; rigor without clinic or classroom theater. Anti-streak, anti-confetti, anti-scoreboard.
2. **One authored anchor per surface.** Image-led or text-led are equal; the screen must feel intentional before every word is read.
3. **Evidence honesty as brand.** Provenance, uncertainty, and "what we don't know" are UI features — not footnotes. Claims stay conservative; interaction can be vivid.
4. **Local-first privacy as felt promise.** No account when possible; on-device storage; delete/export as first-class; privacy spoken in human language at the moment of collection.
5. **Content company with an app attached.** Versioned packs, adversarial review, bake-offs, manifests, checksums, human release gates — generation is never shipping approval.
6. **Signature sensory moments over feature breadth.** Polish three magical interactions (voice orb, A/B compare, completion ritual) rather than shipping a wide mediocre surface.
7. **Voice casting is product.** ElevenLabs / Gemini TTS are treated as design systems (profiles, bake-offs, credit budgets, QA statuses), not afterthoughts.
8. **Editorial serif + system shell.** Display serif for meaning moments; native SF/system for controls; mineral or warm-paper surfaces; rare accent color.

**For Notice & Name specifically:** Soft Intimate already matches the speech/irish emotional register (calm studio, accent-of-self preserved to pleasure-of-self named). Borrow irish editorial grammar + speech vulnerability UX + ml-lab exhibit spine + unitedstats lens-not-loom for explainers — and enforce irish/ml-lab audio release discipline so Soft Intimate never ships unreviewed.

---

## Per-repo findings

### 1. `irish` — An Turas (priority)

| | |
|---|---|
| **Stack** | Native iOS (SwiftUI / XcodeGen), Python content/audio tools, JSON county packs |
| **Product (1 line)** | Learn Irish through a living historical atlas — county stories, evidence, and 20 earned words at a time |

**Taste signals**
- **Typography / color:** New York/Georgia display + SF Pro body; limestone / shore-night mineral palette; moss (interactive), lichen (archival), rust (correction only); atlas green/gold/white for progress (`DESIGN.md`).
- **Copy voice:** Grounded, intimate, exacting; candid about evidence and uncertainty; anti-gamification and anti-plastic-shamrock (`PRODUCT.md` Brand Personality).
- **Privacy / offline:** Offline chapter packs; generated art must not contain UI copy or pose as documentary evidence (`AGENTS.md`).
- **Audio / TTS:** Full bake-off culture — ABAIR / Gemini / Azure / ElevenLabs; launch narrative voice **Irish Cultural Guide** (`NPWroowF4phQhaPWjXPj`); every clip needs Irish-language + editorial QA before bundling (`docs/TTS-research.md`, `content/audio/README.md`).
- **Content pipeline:** Generator to adversarial reviewer to overall editor; human pedagogue/historian sign-off after (`docs/CONTENT-PIPELINE.md`). Phrase-family v2 + generation-batch schemas with orthogonal states (authoring != capture != audio-QA != learner-release).
- **Onboarding / modes:** Story vs Learning modes from one authored sequence; calm full-screen activities; speaking never scored.
- **Media gen:** Illustration exploration with style principles + pipeline-scale recipe (`docs/ILLUSTRATIONS.md`, `art/`).

**Concrete reusable ideas for Notice & Name**

| Idea | Path |
|---|---|
| Living Design System frontmatter (tokens + component recipes in one DESIGN.md) | `irish/DESIGN.md` |
| Brand personality + anti-references block | `irish/PRODUCT.md` |
| Content company roles: generator / adversarial reviewer / editor | `irish/docs/CONTENT-PIPELINE.md` |
| Orthogonal audio states (planned to selected/rejected) | `irish/content/audio/README.md` |
| Voice profile lockfile pattern | `irish/content/audio/authoring/voice-profiles-v1.json` |
| TTS bake-off harness + winners.json discipline | `irish/tools/tts-bakeoff/` |
| Structured audio generation / drain / reconciliation | `irish/tools/structured_audio_*.py` |
| One screen, one task activity anatomy | `irish/PRODUCT.md`; `irish/docs/ACTIVITY-QUALITY-SPEC.md` |
| Story page vs activity page attention modes | `irish/PRODUCT.md` |
| Illustration style principles | `irish/docs/ILLUSTRATIONS.md` |
| Runtime speech catalog pattern | `irish/ios/AnTuras/Speech.swift` |



### 2. `local` — Mourne Made (priority)

| | |
|---|---|
| **Stack** | Astro + TypeScript/pnpm, Vercel functions, media optimize tooling |
| **Product (1 line)** | Local digital studio site that shows a before/after transformation before asking a Dundrum/Newcastle business to buy |

**Taste signals**
- **Typography / color:** Antonio display + Atkinson Hyperlegible body; Bay & Mournes palette (sea slate, gorse yellow, bay ink, foam) (`docs/DESIGN.md`).
- **Copy voice:** Neighbourly, direct, optimistic, specific; show change before sales claim; evidence boundaries explicit.
- **Privacy:** Plain-language privacy at point of collection; rate-limit digests salted; alert webhooks never carry PII (`README.md`).
- **Audio / TTS:** Narrative audio with credit budgets, casting notes, research-only gate until listener score sheet (`research/narrative-audio-plan.md`, `research/narration/INDEX.md`).
- **Media / sensory:** Sensory system plan - mechanism prototypes vs product surfaces; horizon is identity, lights are evidence (`docs/sensory-system-plan.md`).

**Concrete reusable ideas**

| Idea | Path |
|---|---|
| Evidence boundary language | `local/PRODUCT.md` |
| Sensory system: approve mechanisms, then decide surface and budget | `local/docs/sensory-system-plan.md` |
| Narrative audio credit arithmetic + casting-before-copy | `local/research/narrative-audio-plan.md` |
| Research-only audio gate until human listening | `local/research/narration/INDEX.md` |
| Subject-specific visual identity shells | `local/docs/DESIGN.md` |
| Before/After sweep with Reduce Motion | `local/docs/DESIGN.md` |
| Publication packet / provenance checks | `research/publication.json` |
| Media optimize pipeline | `tools/media` |
| Guest-voice check tooling | `local/tools/check/check-concept-guest-voice.mjs` |

### 3. `unitedstats` — Red Thread (priority)

| | |
|---|---|
| **Stack** | Next.js App Router + Tailwind, SQLite, GitHub Actions ingest, Vercel |
| **Product (1 line)** | Nostalgia-first Manchester United history: spark to authored deepening lens to trustworthy fixture record |

**Taste signals**
- **Typography / color:** Archivo + IBM Plex Mono; pitch-dark floodlit ledger; devil red / gold / win-yellow / loss-brick with lightness-safe semantics (`DESIGN.md`).
- **Copy voice:** Fan-sayable, precise, evidence-honest, curious guide; smell-list lint against AI filler (`docs/BRANDING.md`, `docs/COPY-RUBRIC.md`).
- **UX model:** Lens, not loom — author frames meaning; user points the lens (`PRODUCT.md`).
- **Audio:** ElevenLabs music bake-offs; authored score principles; no reckless autoplay (`docs/AUDIO-STRATEGY.md`).
- **Trust surfaces:** `/data` coverage ledger, corrections to GitHub issues, source trails.

**Concrete reusable ideas**

| Idea | Path |
|---|---|
| Lens-not-loom bar for Explore / research explainers | `unitedstats/PRODUCT.md` |
| Spark to deepening to verify journey | `unitedstats/PRODUCT.md`, `docs/JOURNEY.md` |
| Copy rubric + smell-list | `unitedstats/docs/COPY-RUBRIC.md` |
| Brand rename discipline | `unitedstats/docs/BRANDING.md` |
| Audio bake-off rounds with manifests + hashes | `docs/AUDIO-STRATEGY.md` |
| Coverage / provenance as a first-class surface | app `/data`, `docs/SOURCE-AUDIT.md` |
| Mono numerals for counts/dates | `DESIGN.md` |

### 4. `ml-lab` — ML Lab (priority)

| | |
|---|---|
| **Stack** | Next.js, in-browser ML/Pyodide, TypeScript content, ElevenLabs/Gemini audio scripts |
| **Product (1 line)** | Hands-on ML exhibits: See it / Run it / Break it / Explain it — intuition by running and breaking the model |

**Taste signals**
- **Typography / color:** Geist; warm light OKLCH surfaces; semantic viz colors (prediction/truth/error/param) carried into prose ink (`DESIGN.md`).
- **Copy voice:** Economist x 3Blue1Brown; vivid about interaction, conservative about claim (`docs/style/voice.md`).
- **Local-first progress:** Mastery levels on-device (`PRODUCT.md`).
- **Audio:** Narration pipeline with textHash staleness, word timings, dual providers (Gemini Sulafat / ElevenLabs), committed static MP3s (`scripts/generate-audio.ts`, `docs/04-content-pipeline.md`).
- **Pedagogy:** Four-stage spine is navigation; failure gallery as first-class stage; exhibit acceptance rubric.
- **Media gen:** Midjourney + art bible; recurring forces cast with strict style sheets.

**Concrete reusable ideas**

| Idea | Path |
|---|---|
| Four-stage exhibit spine adapted to Notice / Name / Reflect / Keep | `ml-lab/PRODUCT.md`, `src/lib/exhibit/spine.ts` |
| Voice style guide as single owner of learner-facing copy | `ml-lab/docs/style/voice.md` |
| Audio generator: hash-gated idempotent regeneration + word timings | `ml-lab/scripts/generate-audio.ts` |
| Content pipeline stages + human taste gate | `ml-lab/docs/04-content-pipeline.md` |
| Specimen hero / placard pattern for concept opening | `ml-lab/DESIGN.md` |
| Failure taxonomy cards for what this word is not | `docs/07-failure-taxonomy.md` |
| Rubric-gated flagship status | `docs/06-evaluation-criteria.md` |
| Local-first progress model language | `PRODUCT.md` |

### 5. `speech` — Speaking Clearly / ClarityLab (priority — TTS and vulnerability UX)

| | |
|---|---|
| **Stack** | SwiftUI iOS (ClarityLab), Python ElevenLabs config helper, research/pilot docs |
| **Product (1 line)** | Accent-preserving speech clarity coach: understand / hear / see / try / compare / reflect |

**Taste signals**
- **Emotional frame:** Reduce vulnerability; reward courage; calm studio, not clinic or game (`design.md`).
- **Typography / color:** Warm low-sat paper/dusk/sage; characterful display + system UI; avoid clinical blue and neon.
- **Privacy:** On-device recordings excluded from iCloud Backup; on-device ASR; Data Not Collected intent; Erase my voice data (`pilot/DATA_RETENTION.md`, RootView privacy card).
- **Audio / TTS:** Prepaid ElevenLabs capture plan — paired reference/cue scripts, manifest statuses, dry-run before spend, mechanical checks != human approval (`design.md` section 11); key loader with no network (`tools/elevenlabs_config.py`). Soft Intimate for N&N is the same casting discipline family.
- **Motion / haptics / sound:** Slow springs 250-450ms; VoiceOrbView; Haptics vocabulary; soft marimba/felt sounds; respect mute + Reduce Motion.
- **Onboarding:** 3-4 quiet screens; first recording inside onboarding as low-stakes room check; pre-permission mic copy.
- **Motivation:** No global clarity score; streaks never punish; welcome back — nothing lost.

**Concrete reusable ideas**

| Idea | Path |
|---|---|
| Vulnerability-safe emotional frame (port almost verbatim) | `speech/design.md` sections 1-2, 8 |
| VoiceOrbView pattern for calm listening / reflection presence | `ClarityLab/Sources/VoiceOrbView.swift` |
| Haptics design system (softPulse, tick, successBloom) | `ClarityLab/Sources/Haptics.swift` |
| Sounds player + mute-switch respect | `ClarityLab/Sources/Sounds.swift` |
| Design tokens shell | `ClarityLab/Sources/DesignSystem.swift` |
| Onboarding: privacy + name + first gentle interaction | `ClarityLab/Sources/OnboardingView.swift` |
| A/B compare as polished magic moment | `ClarityLab/Sources/TakeCompareView.swift` |
| Cue teaching loop mapped to concept stages | `CueTeachingView.swift`, `design.md` section 10 |
| Session complete ritual (warm observation, not score) | `SessionCompleteView.swift` |
| Daily nudge copy as supportive coach | `DailyNudge.swift` |
| ElevenLabs env loader (no logging secrets) | `tools/elevenlabs_config.py` |
| Matched-pair TTS catalogue + provenance statuses | `design.md` section 11 |
| Privacy / deletion table for App Store nutrition language | `pilot/DATA_RETENTION.md`, `CONSENT.md`, `SAFETY_SCRIPT.md` |
| PrivacyInfo.xcprivacy pattern | `ClarityLab/Sources/PrivacyInfo.xcprivacy` |

---

## Quick peeks (secondary)

### `music` — Interlude (strong UX taste)

- iOS taste-expedition app: checkpoint to direction to routes to inspection to listening to reflection to check-in.
- **Reusable:** explainable routes (never unexplained compatibility score); user must approve/reject/rewrite the system interpretation — mirrors N&N keep phrases that actually fit you.
- Paths: `music/PRODUCT.md`, `IMPLEMENTATION_PLAN.md`.

### `inventory` — Home Inventory (privacy/evidence)

- Calm, evidentially rigorous; AI never infallible; lead with property not system.
- **Reusable:** plain-speaking evidence UX; anti-magic-wand AI language for research-backed pleasure concepts.
- Paths: `inventory/PRODUCT.md`, `DESIGN.md`.

### `physics-ipad` — Physics Lab (sibling of ml-lab)

- Native iPad exhibits + knowledge graph; adults, no gamified condescension.
- **Reusable:** exhibit-as-object; honest partial-ship status.
- Path: `physics-ipad/README.md`.

### `mathland` (strong pedagogy UX)

- Atlas / Studio / Observatory; welcoming + rigorous + wondrous; media must teach or leave.
- **Reusable:** recovery without shame; multimodal only when it adds meaning; anti-punitive correctness gates.
- Paths: `mathland/PRODUCT.md`, `DESIGN.md`.

### `Calibrate`

- Older health-ish stack; lower taste density for N&N than speech/irish — skip for implementation borrowing.

---

## Top 8 reusable ideas for Notice & Name

1. **Vulnerability-first studio UX (from `speech`)**
   Port the emotional frame, onboarding privacy pages, no-score progress, and welcome-back streak ethics. Soft Intimate VO + calm UI should feel like ClarityLab studio, not a course.
   Start: `speech/design.md`, `OnboardingView.swift`, `Haptics.swift`, `VoiceOrbView.swift`.

2. **Orthogonal Soft Intimate release pipeline (from `irish` + `speech`)**
   Treat every VO clip like irish phrase audio: manifest to dry-run to capture to mechanical checks to human review to selected. Soft Intimate ID `7jyL3MarGgOcEOTRHLJL` is casting; QA is shipping.
   Start: `irish/content/audio/README.md`, `speech/design.md` section 11, `irish/tools/tts-bakeoff/`.

3. **Hash-gated narration regen (from `ml-lab`)**
   Adapt `generate-audio.ts` so onboarding + concept narration regenerate only when prose textHash / voice / model drifts — fits existing `notice-and-name/scripts/sync-ios-audio.js`.
   Start: `ml-lab/scripts/generate-audio.ts`.

4. **Notice / Name / Reflect / Keep as exhibit spine (from `ml-lab` + N&N onboarding)**
   Make the four stages structural navigation (like See/Run/Break/Explain), with stage purpose lines owned by a voice guide. Aligns with approved onboarding script.
   Start: `ml-lab/docs/style/voice.md`, `ml-lab/src/lib/exhibit/spine.ts`, `notice-and-name/docs/ONBOARDING_SCRIPT.md`.

5. **Editorial Design.md as single token source (from `irish`)**
   Collapse coral/sage/Playfair notes into a frontmatter design system (surfaces, radii, button recipes, dark mode counterpart) so SwiftUI and asset scripts share one bible.
   Start: `irish/DESIGN.md`.

6. **Lens-not-loom explainers (from `unitedstats`)**
   Research/explainer surfaces should be authored lenses (one meaningful frame + few knobs), not open browse-all-facts looms. Pair with copy smell-list against clinical/lab/TED voice already flagged in EDITORIAL_AUDIT.md.
   Start: `unitedstats/PRODUCT.md` (The Bar), `docs/COPY-RUBRIC.md`.

7. **Content-company adversarial review (from `irish`)**
   Formalize generator to adversarial reviewer to editor for concept batches; keep research citations conservative (in this study… not science proves). Mirrors ml-lab accuracy discipline.
   Start: `irish/docs/CONTENT-PIPELINE.md`, `ml-lab/docs/style/voice.md`.

8. **Felt privacy card + deletion table (from `speech` + N&N plan)**
   Elevate lock / export / delete / no-account into a ClarityLab-style privacy card and a retention table suitable for App Store nutrition + in-app About. Exclude sensitive journal from backups if not already.
   Start: `speech/pilot/DATA_RETENTION.md`, `ClarityLab/Sources/RootView.swift` privacyCard, `notice-and-name/docs/LAUNCH_GAPS.md`.

---

## Cross-cutting patterns (cheat sheet)

| Pattern | Where it shows up | N&N application |
|---|---|---|
| Anti-gamification | irish, speech, ml-lab, mathland | No hearts/XP; progress = words kept and days shown up |
| Serif meaning / system chrome | irish, local, N&N Playfair | Keep Playfair for Name/Keep moments; SF for chrome |
| Rare accent color | irish moss, local gorse, N&N coral | Coral only for primary human actions / warmth |
| Bake-off then lock voice | irish, local, ml-lab, unitedstats, speech | Soft Intimate locked; still per-clip QA |
| Manifest + checksum media | irish, unitedstats, ml-lab, local | Extend N&N asset registry statuses |
| Reduce Motion / a11y first-class | irish AGENTS, speech, local BeforeAfter | Required on orb, stage transitions, VO autoplay |
| Honest uncertainty | irish evidence, unitedstats coverage, speech abstention | Research cards: cite + limit + what this does not mean |
| Signature 3 moments | speech prototype strategy | Soft Intimate listen, Keep phrase save, privacy ritual |

---

## Suggested next borrows (implementation order)

1. Draft `notice-and-name/docs/VOICE.md` from ml-lab voice.md + irish Brand Personality + Soft Intimate constraints.
2. Add audio release states to the existing media master sheet / sync scripts (irish statuses).
3. Port Haptics + Reduce Motion springs from ClarityLab into iOS shell.
4. Rewrite Explore explainers as unitedstats-style lenses.
5. Add in-app privacy card copy modeled on ClarityLab + onboarding section 5.

---

*End of survey. Sources are the listed paths on disk as of 2026-08-11; no code was modified in surveyed repos.*
