# Notice & Name — Editorial Audit (Phase B)

**Date:** 2026-08-11 (Europe/London)  
**Scope:** 22 shipping concepts in `v2-full.bundle.json`  
**Sources read:** `content/v2/bundles/v2-full.bundle.json`, `content/v2/copy/concept-copy.json`, `content/v2/editorial-review.json`, `data/vocabulary.ts`, `docs/CURRENT_STATE.md`, iOS `ConceptPages.swift`  
**Quality bar:** private, precise, adult, non-clinical-worksheet; subtitle *Notice what you like, name it.*; loop **Notice → Name → Reflect → Keep** (UI descent also includes See / Understand).

This is an **audit**, not a full rewrite. Tiny P0 phrase fixes may land in the same change set; wholesale copy rewrite is the next batch.

## Cross-cutting findings

| Issue | Priority | Notes |
| --- | --- | --- |
| UI step labeled **Recognize** while brand loop is **Notice** | P1 | Hardcoded in `ConceptPages.swift`. Bundle block type remains `recognize`. Align label to Notice before launch marketing hardens. |
| Bundle reflection block titled **Field Note**; UI shows **Reflect** | P2 | UI wins; generated titles are unused noise. |
| Many **Understand** blocks read like lit reviews (author + year in body) | P2 | Keep citations; leave one adult insight sentence on-screen. |
| Many **See It** captions are anatomy-lab voice | P1 | Captions should be felt/precise, not textbook labels. |
| Summaries often open with describes / refers to / is the practice of | P2 | Cover/list copy; rewrite toward private noticing language. |
| Reflection prompts overuse Think of a time / Recall a time / How do you feel | P1 | Worksheet intake. Prefer one concrete noticing question. |
| Curiosity phrases often I want to learn / I am curious what | P2 | Fine in small doses; too many sound like therapy homework. |
| All 22 concepts are reviewStatus approved with full phrase use-cases | — | Coverage exists; quality is uneven. |

### Priority summary

| Priority | Count (concepts) | Meaning |
| --- | --- | --- |
| **P0** | **3** | Must fix before launch (broken phrase, wrong boundary speaker, or intake-worksheet Notice). |
| **P1** | **14** | Should rewrite in first editorial batches; tone / partner-sayability / thin Notice and Reflect. |
| **P2** | **5** | Solid enough to ship; polish Understand / See / summary voice later. |

---

## Concepts

### 1. `angling` — Angling (technique) — **P2**
- **Strengths:** Clean Notice moment; Name precise; Keep and partner-request sayable and adult.
- **Weak spots:** Understand leads with study branding; SEE caption slightly clinical; curiosity a touch goal-seeking.
- **Priority:** P2

### 2. `rocking` — Rocking (technique) — **P1**
- **Strengths:** Partner-request excellent (losing the good spot when separating); reassurance owns minimal movement without apology.
- **Weak spots:** Recognize opens didactic 'Notice that…'; Reflect is 'Think of a time…' worksheet; long textbook summary; clinical SEE.
- **Priority:** P1

### 3. `shallowing` — Shallowing (technique) — **P1**
- **Strengths:** Keep is brand-true (shallow is the good part, not a warm-up); boundary and reassurance partner-safe.
- **Weak spots:** SEE uses introitus; Understand research-report heavy; Recognize thin vs Keep conviction.
- **Priority:** P1

### 4. `pairing` — Pairing (technique) — **P2**
- **Strengths:** Recognize lived; partner-request and boundary (reaching down) practical and non-shaming.
- **Weak spots:** Understand citation-stack heavy; Reflect second clause tips into skills-coaching.
- **Priority:** P2

### 5. `building` — Building (sensation) — **P1**
- **Strengths:** Recognize has sensory specificity; Keep / partner-request private and precise.
- **Weak spots:** Reflect 'Recall a time…' worksheet; SEE vascular/neural lab voice; textbook summary.
- **Priority:** P1

### 6. `plateauing` — Plateauing (sensation) — **P2**
- **Strengths:** Names a rarely-honored state without pathologizing; Keep legitimizes not tipping over; phrases partner-safe.
- **Weak spots:** Understand lecture-y; Reflect slightly instructs ('Next time… notice').
- **Priority:** P2

### 7. `edging` — Edging (sensation) — **P0**
- **Strengths:** Recognize and Reflect embodied and adult; Keep sharp; reassurance ('not a test I can fail') on-brand.
- **Weak spots:** P0: boundary phrase broken / wrong speaker ('just say so and we'll let it happen'). Reads as instructing partner, not user say-later line. Summary 'practice of…' worksheet-adjacent.
- **Priority:** P0

### 8. `spreading` — Spreading (sensation) — **P1**
- **Strengths:** Keep private and anti-chase; reassurance about going quiet is partner-safe gold.
- **Weak spots:** Reflect 'Think of a time…'; SEE neural-signals clinical; Name/Understand essay-ish.
- **Priority:** P1

### 9. `pulsing` — Pulsing (sensation) — **P1**
- **Strengths:** Partner-request (match a steady rhythm) concrete and sayable; Keep good.
- **Weak spots:** SEE concentric-contraction / pelvic-floor lab voice fails brand; textbook summary; Reflect thin.
- **Priority:** P1

### 10. `warmup-window` — Warm-up Window (timing) — **P1**
- **Strengths:** Partner-request naming twenty unhurried minutes brave and useful; Keep owns timing without apology.
- **Weak spots:** SEE engorgement/blood-flow clinical; Understand lit-review; Reflect coach-intake double question; curiosity homework voice.
- **Priority:** P1

### 11. `responsive-desire` — Responsive Desire (timing) — **P2**
- **Strengths:** Strong launch concept; Keep and reassurance partner-safe and non-pathologizing; boundary protects pause.
- **Weak spots:** Understand name-drops theorists in-body; Reflect long. Still above bar overall.
- **Priority:** P2

### 12. `spontaneous-desire` — Spontaneous Desire (timing) — **P1**
- **Strengths:** Boundary (urge is not an obligation) excellent; reassurance avoids prescribing frequency.
- **Weak spots:** Recognize thinner than responsive twin; Keep slightly self-helpy; Understand gender-comparison can feel othering if misread.
- **Priority:** P1

### 13. `golden-trio` — Golden Trio (timing) — **P1**
- **Strengths:** Boundary against ticking boxes on-voice; Keep values variety without shame.
- **Weak spots:** P1: definition leads with 86% rate — outcome-promise adjacent on Name card; Recognize generic; Reflect worksheet; title gimmicky vs quieter concepts.
- **Priority:** P1

### 14. `spectatoring` — Spectatoring (psychological) — **P1**
- **Strengths:** Recognize vivid and adult; boundary/reassurance handle going quiet without making partner the therapist.
- **Weak spots:** Keep/self-understanding tip into self-help mantra; Understand stacks three citations; curiosity meta-homework.
- **Priority:** P1

### 15. `embodied-presence` — Embodied Presence (psychological) — **P1**
- **Strengths:** Partner-request (slow enough to feel each thing) and reassurance (quiet is not checking out) strong.
- **Weak spots:** Reflect 'Recall a time…'; Understand clinical-studies voice; Name glossary-like; mindfulness-module risk next to spectatoring.
- **Priority:** P1

### 16. `non-concordance` — Non-concordance (psychological) — **P1**
- **Strengths:** Critical partner-safety concept; partner-request and boundary (trust words over body signs) launch-critical and largely excellent.
- **Weak spots:** SEE textbook pathways; Understand meta-analysis density; Reflect worksheets the insight; curiosity self-improvement tone; reassure 'normal/broken' slightly clinical. Protect partner phrases; rewrite Notice/See/Reflect.
- **Priority:** P1

### 17. `sexual-self-esteem` — Sexual Self-Esteem (psychological) — **P0**
- **Strengths:** Keep ('worth taking up space') brand-aligned; curiosity has promise if softened.
- **Weak spots:** P0: Recognize is intake-worksheet ('How do you feel about yourself as a sexual person…'). Partner-request imports performance grading ('good in bed') and cheerleader role. Boundary asks partner to police self-talk. Glossary summary.
- **Priority:** P0

### 18. `body-appreciation` — Body Appreciation (psychological) — **P0**
- **Strengths:** Keep clean; partner-request intimate without therapy-speak.
- **Weak spots:** P0: reassurance broken dangling repeat ('— it doesn't'). Boundary overloaded / hard to say aloud. Recognize two stacked therapy questions. Reflect 'Think of a moment…'.
- **Priority:** P0

### 19. `clitoral-structure` — Clitoral Structure (anatomy) — **P1**
- **Strengths:** Keep reframes internal vs external well; reassurance about indirect touch partner-safe.
- **Weak spots:** Recognize is trivia ('Did you know…') not noticing; Reflect didactic; Name dumps glossary terms without warmth.
- **Priority:** P1

### 20. `nerve-density` — Nerve Density (anatomy) — **P1**
- **Strengths:** Partner-request (lighter / more indirect) immediately usable; boundary frames intensity as sensitivity not rejection.
- **Weak spots:** Reflect coachy double question; reassure 'nothing wrong' clinical; Name TED-fact comparison framing.
- **Priority:** P1

### 21. `clitourethrovaginal` — CUV Complex (anatomy) — **P1**
- **Strengths:** Keep demystifies without sneering; reassurance kind; boundary against forcing good.
- **Weak spots:** Display name clinical for consumer UI; Recognize thin; partner-request still hunts a spot; Understand slightly polemic.
- **Priority:** P1

### 22. `internal-stimulation` — Internal Clitoral Stimulation (anatomy) — **P2**
- **Strengths:** Tight link to angling; partner-request and boundary (angle rather than harder) precise and partner-safe; Keep clear.
- **Weak spots:** Overlaps CUV / angling / structure (editorial fatigue); Recognize average; reassure 'normal' slightly clinical.
- **Priority:** P2

---

## Tiny fixes applied with this audit

Surgical edits landed in `content/v2/copy/concept-copy.json` (+ `data/vocabulary.ts` recognize for sexual-self-esteem), then bundle regenerated:

1. `edging` boundary — first-person partner-safe say-later line.
2. `body-appreciation` reassurance — removed broken dangling clause.
3. `sexual-self-esteem` recognize — Notice moment instead of intake question.

Full rewrites for those concepts (and the P1 batch) remain open. Concepts stay P0 until partner-request / boundary polish lands for sexual-self-esteem and body-appreciation.

---

## Recommended next rewrite batch (do these 5 first)

1. `sexual-self-esteem` — P0 Notice + partner phrases.
2. `body-appreciation` — P0 broken Keep set.
3. `edging` — P0 boundary; otherwise close to bar.
4. `rocking` — template fix for technique cluster.
5. `golden-trio` — remove rate-promise from Name/definition.

Follow-on: warmup-window, non-concordance, pulsing/spreading SEE, anatomy Notice frames.

## Edit surfaces reminder

| Change type | Edit |
| --- | --- |
| Recognize / Reflect / phrases | `content/v2/copy/concept-copy.json` |
| Definition / summary / Understand / See | `data/vocabulary.ts` |
| Review status | `content/v2/editorial-review.json` |
| Then | generate-v2-full-bundle, validate, lint |

Do not hand-edit `v2-full.bundle.json`.
