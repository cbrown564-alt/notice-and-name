# Notice & Name — plan

Working plan from code + market assessment (updated 2026-08-11 evening). Replaces archived roadmaps.

## Quality bar (must be excellent)

1. Concept experience (Notice → Name → Reflect → Keep)
2. Felt privacy (lock, export, delete, no account)
3. Partner-safe phrases
4. App Store presence (listing, privacy story, screenshots)

Good-enough / later: Today cleverness, pathway polish, full video coverage, module rename (`PleasureVocabulary*`), coaching, community.

## Phases

### A — Stabilize
- [x] Archive old docs
- [x] Lean tests + CI
- [x] Working docs (this folder)
- [x] Merge rename PR → direct-to-main workflow after
- [x] Remove Expo litter
- [x] Treat v2 bundle pipeline as sole content truth (see [`CONTENT.md`](./CONTENT.md))

### B — Core loop to bar
- [x] Editorial pass on 22 concepts ([`EDITORIAL_AUDIT.md`](./EDITORIAL_AUDIT.md); batches 1–4)
- [x] Soft Intimate voice + audio packs (phrases, onboarding, Notice moments, explainers, SFX, App Store VO)
- [x] Wire audio into iOS (sync, playback, Settings toggles)
- [ ] Device QA (current + small phone) — Conor
- [ ] Export via share sheet / Files
- [~] Fix worst media gaps only (Gemini Omni video / GPT-Image 2 stills; abstract/educational to clear blockers) — **batch1 6 plates+thumbs + batch2 spontaneous-desire plate/thumb + 3 thumbs (my-generator / 512 crop), pending taste vs GPT-Image 2**
- [x] Cross-cutting UI polish (Recognize→Notice labels, Field Note vs Reflect) — from editorial audit
- [x] Interactive diagrams for all 22 concepts — **22/22 ship**, pending device QA ([`INTERACTIVES.md`](./INTERACTIVES.md); Phase B track)

### C — Business
- [x] Lock unlock price (£15 one-time)
- [ ] StoreKit non-consumable + preview boundary (Responsive Desire, Angling, Non-concordance + one explainer)
- [ ] Support email + privacy policy URL — Conor
- [ ] Metadata, screenshots, review notes (App Store VO takes ready in `assets/audio/app-store/`)

### D — Beta → submit
- [ ] Small TestFlight cohort
- [ ] Freeze + submit

## Ownership

**Conor:** support email/domain, Apple auth / real-device QA, taste on copy & screenshots, media blocker calls.

**Sensory Success:** engineering, content drafts, StoreKit, docs, CI, metadata drafts, beta synthesis. Commits go straight to `main` (no PRs).

## Reference

- Taste / reuse across repos: [`TASTE_SURVEY.md`](./TASTE_SURVEY.md)
- Launch checklist: [`LAUNCH_GAPS.md`](./LAUNCH_GAPS.md)
- Onboarding VO script (approved): [`ONBOARDING_SCRIPT.md`](./ONBOARDING_SCRIPT.md)
- Interactive diagrams (all 22): [`INTERACTIVES.md`](./INTERACTIVES.md)
