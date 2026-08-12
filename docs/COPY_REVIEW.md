# Notice & Name — Full Editorial Copy Review

**Date:** 2026-08-12 (Europe/London)  
**Scope:** All 22 shipping concepts in `content/v2/bundles/v2-full.bundle.json`  
**Also read:** `content/v2/copy/concept-copy.json`, `docs/EDITORIAL_AUDIT.md`, `docs/TASTE_SURVEY.md` (voice bits), `docs/INTERACTIVES.md` / `docs/CONTENT.md`, iOS `ConceptPages.swift` labels  
**Quality bar:** Soft Intimate — private, precise, adult, calm; anti-gamification; anti-TED/lab/worksheet; one idea per encounter; partner phrases sayable and non-shaming. The actual user-facing loop is **Notice → Name → See → Understand → Reflect → Keep**.
**Method:** Fresh surface-by-surface pass (Cover/summary, Notice, Name, See, Understand, Reflect, Keep + five phrase templates). Review only — no concept rewrite in this pass.

---

## 1. Executive verdict

The set is **close to launch-ready editorially, not quite clean**. Phase B batches (logged in `EDITORIAL_AUDIT.md`) cleared the worst worksheet/shame/TED failures and left partner phrases generally strong and sayable. What remains is quieter but systemic: **Understand still opens like a lit review** on most concepts; **Notice and curiosity lean on repeating templates** (“Ever…”, “I want to notice…”); **cover copy for anatomy still leads with trivia** (9 cm, ~8,000 endings); and the **CUV / internal-stimulation / clitoral-structure / angling cluster overlaps** so four encounters risk teaching the same front-wall idea. Fix those before treating copy as locked — not a rewrite of the whole deck.

### What’s stale in `EDITORIAL_AUDIT.md`

| Prior claim | Status now |
| --- | --- |
| UI still says **Recognize**; Field Note vs Reflect open | **Stale.** `ConceptPages.swift` hardcodes **Notice** / **Reflect** / **Keep**. Shipping bundle reflection titles are already **Reflect**. |
| All concept P0/P1/P2 cleared; remaining work is UI polish only | **Too optimistic.** Systemic Soft Intimate / insight-first / differentiation polish remains (this doc). |
| Journal “field notes” | **Still true and allowed** — journal UI/DB still say field notes; concept loop says Reflect. |

---

## 2. Cross-cutting findings

### Canonical concept loop

The six-stage sequence above is the product's user-facing loop, not just an editorial checklist. Keep these names aligned across the concept pages, bundle titles, and documentation. The journal may still use “field notes” where that is a separate journal feature, but concept-page copy should use **Reflect**.

### Understand: current opening and target shape

Current `golden-trio` opening:

> “Frederick et al. (2018) found that women who received intercourse, manual genital stimulation, and oral sex in the same encounter reported orgasm more often than with intercourse alone.”

This leads with the study and its comparison before telling the reader what to notice. An insight-first version would lead with the lived meaning, then seat the evidence:

> “One kind of touch is not always the whole story. Variety can help because clitoral touch is often part of what makes an encounter work; the study supports that pattern, not a recipe.”

That is the target shape: felt insight first, evidence second, and a clear boundary against turning the finding into a prescription. The wording is a model for structure, not proposed final copy.

### Anatomy ownership table

The four nearby concepts need distinct jobs. Rewrites should preserve these boundaries:

| Concept | Owns | Primary reader question | Avoid absorbing |
| --- | --- | --- | --- |
| `clitoral-structure` | The organ's full internal/external structure | “What is the larger map of the clitoris?” | Front-wall technique or a general lesson that all internal pleasure is clitoral |
| `clitourethrovaginal` | The connected clitoris–urethra–front-wall anatomy | “What structures are connected in this area?” | A how-to move, depth/angle advice, or a “find the G-spot” glossary lesson |
| `internal-stimulation` | The felt access to internal clitoral tissue | “What might this fuller internal feeling be?” | Re-teaching the anatomical map or becoming a generic front-wall exploration guide |
| `angling` | Changing direction, tilt, or contact to find what feels better | “How can a small change in angle alter the sensation?” | Explaining the whole organ or claiming that one angle is universally right |

The shortest distinction is: **structure is the organ, CUV is the connected map, internal stimulation is the felt access, and angling is the adjustment.**

| Issue | Priority | Notes |
| --- | --- | --- |
| **Understand leads evidence-first** (~17/22) — author-year or “research describes…” before adult insight | **P0** | Citations belong; on-screen body should **lead with the felt insight**, then seat the evidence. Worst: `angling`, `golden-trio`, `spectatoring`, anatomy four, `building`/`plateauing` model-speak. |
| **Anatomy cluster near-duplicate** — CUV ≈ internal-stimulation ≈ (parts of) clitoral-structure ≈ angling | **P0** | Four encounters can feel like one idea (front wall / angle / internal clit). Must differentiate: map vs felt access vs tilt vs organ size. |
| **Cover/summary fact-forward / TED** on anatomy + trio | **P1** | `clitoral-structure` (9 cm / crura), `nerve-density` (~8,000), `golden-trio` (names a combo), `pulsing` summary digresses into orgasm physiology. Lead with noticing language. |
| **Notice opener template** — 9× “Ever…”, plus Felt/Noticed/Caught | **P1** | Not classic worksheet (“Think of a time”), but the deck rhymes. Vary openings; some can be mid-scene statements without the quiz cadence. |
| **Curiosity “I want to notice…”** (~12/22) | **P1** | Soft homework. Prefer concrete, partner-sayable curiosity, or drop a few toward noticing-without-announcing. |
| **Name ≈ Summary** redundancy | **P2** | Especially `pairing`, `warmup-window`, `shallowing`. Cover can be warmer/shorter; Name the precise term. |
| **Stats-as-prose awkwardness** | **P1** | `golden-trio` Understand reads like a results paragraph; `non-concordance` 10–30% is useful but denser than Soft Intimate; keep numbers in Understand only, never Cover/Name. |
| **Gender-generalizing lead** | **P1** | `rocking` Understand: “Most women need…”. Prefer precise + non-othering. |
| **See captions** mostly landed | **P2** | Good felt captions across 22. Residual: `shallowing` “Nerve-rich…” (lab), `sexual-self-esteem` “Belonging in your own desire” (abstract TED). Diagram insight chips are UI chrome — fine; not scored as body copy. |
| **building ↔ warmup-window** reassurance/phrase bleed | **P2** | Both own “slow warm-up isn’t a problem.” Keep building about *gathering intensity*; warmup about *timing before genital*. |
| **spectatoring ↔ body-appreciation ↔ sexual-self-esteem** adjacency | **P2** | Notices all touch “watching / looking / old story.” Differentiation is mostly working; don’t let future edits collapse them. |
| **Keep block title “A Phrase To Keep”** vs UI **Keep** | **P2** | UI label wins; bundle title unused noise (same class as old Field Note). |
| **Edging definition ASCII hyphen** | **P2** | `happens - often` → em dash. Egregious tiny typo when next edited. |
| **Expo leftovers in concept body** | — | **None found** in shipping concept surfaces. |
| **UI Recognize / Field Note on concept pages** | — | **Cleared.** Journal “field notes” intentionally remains. |

---

## 3. Per-concept review

Overall: **good** = Soft Intimate, differentiated, sayable · **meh** = one or two surfaces drag · **weak** = multiple surfaces or cluster risk.  
**Rewrite urgency** (separate from overall voice quality): P0 must-differentiate / lit-review worst · P1 polish before lock · P2 nice-to-have.

| id | overall | urgency | must-fix lines | notes |
| --- | --- | --- | --- | --- |
| `angling` | meh | P1 | Understand lead: “Hensel et al. (2021) found…” | Notice/See/Keep/phrases strong and adult. Flip Understand to insight-first. |
| `rocking` | meh | P1 | Understand: “Most women need some form of clitoral stimulation…” | Partner-request (“lose the good spot”) excellent. Drop gender-generalizing lead. |
| `shallowing` | good | P2 | See: “Nerve-rich entrance…” | Brand-true Keep; boundary/reassure partner-safe. Soften See lab word. |
| `pairing` | good | P2 | Name ≈ Summary | Phrases excellent (esp. boundary when reaching down). Understand anti-broken line is good. |
| `building` | meh | P1 | Understand model-speak; reassure overlaps warmup | Notice/Reflect lived. Own *gathering*, not *timing*. |
| `plateauing` | good | P2 | Understand “Sexual response models name…” | Keep legitimizes hover — leave Keep/phrases alone. |
| `edging` | good | P2 | Definition field ASCII hyphen | Recognize/Reflect/Keep/reassure (“not a test I can fail”) on-voice. |
| `spreading` | good | P2 | Understand vague “Embodied sexuality research…” | Keep + quiet-reassure are gold. |
| `pulsing` | meh | P1 | Summary second sentence (orgasm physiology); Understand Meston & Buss lead | Notice/Reflect tempo-specific and good. Tighten Cover; insight-first Understand. |
| `warmup-window` | good | leave | Name ≈ Summary (optional) | “Twenty unhurried minutes” partner-request brave and useful. Leave phrases. |
| `responsive-desire` | good | leave | — | Launch-critical; Keep/boundary/reassure non-pathologizing. Leave alone. |
| `spontaneous-desire` | good | leave | — | Boundary (urge ≠ obligation) excellent. Leave alone. |
| `golden-trio` | weak | P0 | Understand (Frederick results paragraph); Cover “names a combination…” | Anti-checklist boundary good; Name still checklist-adjacent. Rewrite Understand to adult insight; Cover toward noticing variety, not study branding. |
| `spectatoring` | good | P2 | Understand citation pile (Masters → Barlow → Brotto) | Notice vivid; Keep sensation-over-performance. Compress Understand. |
| `embodied-presence` | good | leave | — | Framed as opposite of spectatoring, not mindfulness homework. Phrases strong. |
| `non-concordance` | good | leave | Understand density (10–30%) optional compress | Partner-request + boundary launch-critical — **preserve**. Soften Reflect only if already in file. |
| `sexual-self-esteem` | good | P2 | See: “Belonging in your own desire” (abstract) | Keep/phrases brand-aligned. Make See more felt. |
| `body-appreciation` | good | P2 | Notice adjacent to spectatoring | Boundary (no body postmortem) sayable. Leave phrases. |
| `clitoral-structure` | meh | P0 | Cover leads 9 cm / legs / bulbs trivia | Notice lived; Keep reframe good. Cover should feel wider pleasure first; facts in Understand. |
| `nerve-density` | meh | P0 | Cover “roughly 8,000”; curiosity “I want to map…” | Partner-request (lighter/indirect) immediately usable. Fact out of Cover; curiosity less homework. |
| `clitourethrovaginal` | weak | P0 | Near-dup with `internal-stimulation` Notice/Keep; Name still G-spot glossary | Differentiate as **connected map** (not the felt move). Reassurance “everyone” soft-ok. |
| `internal-stimulation` | weak | P0 | Notice almost same front-wall yes as CUV | Own **felt access / angle beats depth**; point to angling for the move, CUV for the map. |

---

## 4. Recommended rewrite order

Edit surfaces reminder (do **not** hand-edit the bundle):

| Change | Edit |
| --- | --- |
| Notice / Reflect / phrases | `content/v2/copy/concept-copy.json` |
| Definition / summary / Name / Understand / See | `data/vocabulary.ts` |
| Then | `generate-v2-full-bundle` → validate → lint |

### Batch A — differentiation + TED covers (do first)

1. `golden-trio` — Cover + Understand (+ Name polish if still checklist-y)
2. `clitourethrovaginal` — Notice / Name / Keep / See vs internal-stimulation
3. `internal-stimulation` — Notice / Reflect / Keep; explicit map vs move vs felt-access split
4. `clitoral-structure` — Cover/summary (+ Name warmth); facts stay in Understand
5. `nerve-density` — Cover/summary + curiosity; Keep/partner-request leave

### Batch B — Understand insight-first + template hygiene

6. `angling`, `rocking`, `pulsing`, `building`, `plateauing`, `spreading`, `spectatoring`, `body-appreciation` (See), `sexual-self-esteem` (See), `shallowing` (See), `pairing`/`warmup-window` (Name≠Summary)
7. Global pass: Notice opener variety + curiosity de-templating across remaining “I want to notice” lines

### Batch C — light

8. `edging` definition hyphen; Keep title “A Phrase To Keep” → align generator to **Keep** if titles ever surface; journal field-notes copy only if product wants Reflect language there too (out of scope unless asked).

---

## 5. Leave alone (already strong)

Do not reopen these unless a nearby batch forces a consistency touch:

| id | Why |
| --- | --- |
| `responsive-desire` | Launch pattern concept; phrases partner-safe; non-pathologizing |
| `spontaneous-desire` | Boundary/reassure excellent; Notice lived |
| `embodied-presence` | Opposite-of-spectatoring framing; quiet-is-not-checkout reassure |
| `edging` (phrases/Keep/Notice/Reflect) | Adult, anti-test; only fix definition hyphen when in file |
| `plateauing` (Keep + phrases) | Rarely-honored state named without shame |
| `warmup-window` (phrases) | Twenty-minute ask is brave and useful |
| `pairing` (phrases) | Boundary when reaching down is practical gold |
| `shallowing` (Keep + boundary/reassure) | “Shallow is the good part” brand-true |
| `non-concordance` (partner-request + boundary) | Trust-words-over-body-signs — preserve verbatim |
| `spectatoring` (Keep + boundary) | Sensation-over-performance; quiet without therapistizing partner |
| `spreading` (Keep + reassure) | Anti-chase; going quiet is partner-safe |
| `sexual-self-esteem` (Keep + phrases) | Worth-taking-up-space; specific not pep-talk |

---

## 6. Priority counts (this review)

| Bucket | Count | Meaning |
| --- | --- | --- |
| **P0 concepts** | **5** | `golden-trio`, `clitourethrovaginal`, `internal-stimulation`, `clitoral-structure`, `nerve-density` |
| **P1 concepts** | **4** | `pulsing`, `angling`, `rocking`, `building` (plus systemic Notice/curiosity template debt on otherwise-good concepts) |
| **P2 concepts** | **8** | `shallowing`, `pairing`, `plateauing`, `spreading`, `edging`, `spectatoring`, `sexual-self-esteem`, `body-appreciation` |
| **Leave alone** | **5** | `responsive-desire`, `spontaneous-desire`, `embodied-presence`, `warmup-window`, `non-concordance` (phrase cores especially) |

Concept totals: 5 + 4 + 8 + 5 = 22.

---

## 7. Scoring cheat-sheet (surfaces)

What “good” meant in this pass:

| Surface | Pass bar |
| --- | --- |
| Cover/summary | Private noticing; not glossary, not trivia lead |
| Notice | One lived moment; not worksheet recall; not identical to sibling concepts |
| Name | Precise term in adult voice; not a second summary |
| See | Felt caption matching interactive reality; not lab label |
| Understand | **Insight first**, citation seated; no results-paragraph voice |
| Reflect | One concrete noticing question |
| Keep + phrases | Sayable tonight; non-shaming; partner-safe; one idea |

---

*Batch A source rewrites are complete. Batch B covers the flagged Understand/See surfaces, varies the repeated Notice openers, and softens curiosity lines that felt like assignments. Batch C alignment also reduced Name/summary repetition, changed generated phrase-block titles to **Keep**, fixed the edging dash, and replaced the abstract sexual-self-esteem caption. Both shipping bundle copies were regenerated and pass full validation, content lint, and Swift package tests. Remaining verification is visual review in the app when CoreSimulator is available.*
