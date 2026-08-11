# Copy Guidelines

**Audience:** Adults learning pleasure vocabulary for self-knowledge and partner communication.  
**Tone:** Scientific Warmth — precise, warm, non-judgmental, second person where appropriate.

---

## Voice

- Address the reader as **you** on Reflect and actionable slides; use neutral third person on Understand when citing mechanisms.
- Prefer concrete sensory language over euphemism or clinical coldness.
- Never shame desire, anatomy, or lack of experience.
- Avoid prescriptive partner dynamics (“make them…”, “your partner must…”).

---

## Slide arc (per concept)

| Slide | Job | Length |
|-------|-----|--------|
| **Recognize** | Felt experience before the name | 1–2 short paragraphs |
| **Name** | Introduce term + one-line definition | Title + definition |
| **Illustrate** | Visual teaches mechanism; caption supports, does not repeat definition | Caption ≤ 2 sentences |
| **Understand** | Evidence + mechanism; cite without overstating | 2–3 paragraphs + sources |
| **Reflect** (`explore` in data) | One try-this experiment; optional journal hook | 1 prompt + optional sub-bullets |

Trim redundancy between Recognize and Name — Recognize is story; Name is label.

---

## Definitions (`data/vocabulary.ts`)

- Lead with what the user **notices** or **can do**, then mechanism.
- One core idea per definition; avoid stacking three metaphors.
- Align terms with explainers (CUV, responsive desire, non-concordance).

---

## Citations

- Match `researchBasis` and Understand slide sources to real publications where possible.
- Use “research suggests” not “proves” unless the study design supports it.
- Format: Author (Year) or journal name in slide footers as already styled in deck.

---

## Reflect slides

- **Do:** “Try noticing…”, “Experiment with…”, “If you want, track…”
- **Don’t:** Mandatory timelines, partner blame, performance framing.
- Keep experiments solo-friendly; partner variants optional in one clause.

---

## Status labels (UI)

- **Tried it** / **Curious** / **Not for me** — never imply failure for “Not for me”.

---

## Review checklist (editorial pass)

- [ ] Definition readable in under 20 seconds
- [ ] No duplicate sentences across Recognize and Name
- [ ] Illustrate caption does not duplicate illustration content literally
- [ ] Understand does not overclaim causality
- [ ] Reflect is actionable in one session
- [ ] Related concept ids exist in vocabulary

Log completion in `data/copy-review.json` (ids list), then run `npm run generate-concept-audit` to refresh `CONCEPT_AUDIT.md`.
