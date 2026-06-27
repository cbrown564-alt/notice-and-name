# V2 Roadmap

**Status:** Prototype complete; scale-up planning
**Goal:** Turn the premium SwiftUI prototype into a release-quality, scalable product
system without losing the intimacy that made the prototype work.

## Current State

The v2 direction has been validated as a product experience. The native prototype is a
meaningful improvement over the Expo MVP: calmer, more private, more tactile, and centered
on personal vocabulary rather than slide completion.

Completed foundations:

- [x] Premium native product brief.
- [x] SwiftUI-first, local-first architecture direction.
- [x] GRDB + SQLite persistence decision.
- [x] V2 content bundle schema and validation script.
- [x] Golden-path content bundle.
- [x] Full v2 bundle generation and validation.
- [x] Native content loading.
- [x] Local user state.
- [x] Onboarding/privacy pledge.
- [x] Today, concept detail, Vocabulary, field notes, and saved phrases.
- [x] Native typography, color, haptics, app lock prototype, Dynamic Type, and Reduce Motion.
- [x] Journal search, export/delete-all-data, TestFlight host scaffold, and device QA docs.

## Complete Vision

V2 should become three things working together:

1. **A premium private iOS app** for building a personal pleasure vocabulary.
2. **A durable content system** for concepts, pathways, phrases, citations, and media.
3. **A trust-centered product platform** that can later support updates, paid access,
   optional backup, and carefully constrained personalization.

The app remains the heart. The platform exists only to make the app richer, safer, and
easier to maintain.

## Product Principles At Scale

- **Private first, always:** no account required, no cloud dependency, no surprise analytics.
- **Vocabulary over performance:** users are not optimizing themselves; they are finding language.
- **Personal before comprehensive:** a smaller set of resonant words is more valuable than a completed catalog.
- **Native feel is product value:** typography, haptics, motion, and privacy affordances matter.
- **Content is a system:** every concept needs schema, citations, phrases, pathways, media, and review status.
- **Share carefully:** partner language should be explicit, consent-aware, and never leak private notes.

## Phase 5: Production Hardening

Goal: make the prototype robust enough for sustained personal use.

Hardening contract: [PHASE_5_HARDENING.md](PHASE_5_HARDENING.md).

Guard against the repeated screen-fit failure mode: onboarding-adjacent SwiftUI views can
collapse to their intrinsic content size after state transitions, leaving side bars or a
partial-height canvas. First-run, app-lock, and recovery screens must take a full-window
frame before painting the app canvas, then be checked on both current and smaller iPhones.

- [x] Finalize GRDB migration strategy and schema versioning.
- [x] Add automated persistence tests for concept state, notes, phrases, app lock, export, and deletion.
- [x] Add content bundle migration tests for future bundle updates.
- [x] Harden app lock behavior across cold launch, background/foreground, onboarding, and export flows.
- [x] Complete error and empty states for missing media, corrupt bundle, failed export, and locked database.
- [x] Add snapshot or UI smoke tests for core screens where feasible.
- [x] Verify full Dynamic Type, VoiceOver labels, Reduce Motion, and contrast.
- [x] Establish performance budgets for launch time, database operations, and media loading.

Exit criteria:

- No known data-loss paths.
- Local state survives app upgrades and bundle changes.
- Delete-all-data and export are tested, not just implemented.
- Core screens remain usable at large accessibility text sizes.

## Phase 6: Content Scale-Up

Goal: move from migrated content to editorially managed content.

- [ ] Complete editorial QA on all 22 concepts in the v2 bundle.
- [ ] Audit every citation and remove or qualify weak claims.
- [ ] Add concept-level review metadata: `draft`, `reviewed`, `approved`, `retired`.
- [ ] Add content linting for tone, private-note leakage, missing phrases, and missing citations.
- [ ] Expand phrase templates by use case: self-understanding, partner request, boundary, curiosity, reassurance.
- [ ] Rework pathways around user intent instead of legacy category grouping.
- [ ] Define media policy: which concepts need image, diagram, video, or no media.
- [ ] Build a lightweight content preview workflow outside the app.

Exit criteria:

- Every shipped concept has approved copy, citations, at least one reflection prompt, and at least one saved phrase.
- Pathways feel authored, not mechanically migrated.
- The app can ship without placeholder media or unknown review status.

## Phase 7: Premium Product Shape

Goal: decide what the paid product is before launch mechanics harden around the wrong model.

- [ ] Decide paid-upfront vs free trial/subscription vs free core plus premium packs.
- [ ] Define free preview surface, if any.
- [ ] Decide whether all private tools remain available without an account.
- [ ] Design premium entitlement model without making the app feel transactional.
- [ ] Add StoreKit 2 only after the product model is decided.
- [ ] Draft App Store positioning, privacy copy, screenshots, and content warnings.
- [ ] Add support and feedback channel that preserves user privacy.

Recommended starting model:

Paid-upfront or free trial with one-time unlock. Avoid subscription until there is a real
content-update cadence that justifies it.

Exit criteria:

- Pricing supports the premium positioning.
- Privacy story is simple enough to explain in one paragraph.
- No purchase flow blocks local-first trust.

## Phase 8: TestFlight Beta

Goal: learn from real use without over-instrumenting a sensitive app.

- [ ] Produce installable TestFlight build from full Xcode.
- [ ] Run internal QA on at least one current iPhone and one smaller-screen iPhone.
- [ ] Recruit a small trusted beta cohort.
- [ ] Create a beta feedback guide focused on comprehension, trust, usefulness, and awkward moments.
- [ ] Track issues manually before adding analytics.
- [ ] Review all share flows for accidental disclosure risk.
- [ ] Validate App Store privacy labels and data safety statements.

Exit criteria:

- Beta users can complete onboarding, save words, write notes, export/delete data, and recover from app lock without assistance.
- Feedback confirms the app feels safer and more useful than the old version.
- No blocker remains for App Store submission.

## Phase 9: V2.0 Launch

Goal: ship a small, polished, trustworthy product.

- [ ] Freeze v2.0 content bundle.
- [ ] Freeze v2.0 native feature scope.
- [ ] Complete App Store metadata, screenshots, privacy labels, and review notes.
- [ ] Add release checklist and rollback plan.
- [ ] Tag content and app versions together.
- [ ] Submit for App Review.
- [ ] Prepare post-launch support process.

V2.0 should ship with restraint. The launch promise is a premium private vocabulary app,
not a full sexual wellness platform.

Exit criteria:

- App Store build approved.
- Support path exists.
- Content/app versions are traceable.
- Known limitations are documented.

## Phase 10: Content Platform

Goal: make content updates safe, fast, and repeatable.

- [ ] Split source content from generated bundles.
- [ ] Add a content authoring format that is pleasant to review.
- [ ] Add bundle diff reports: added concepts, changed claims, changed phrases, changed media.
- [ ] Add citation registry and source reuse.
- [ ] Add media registry with accessibility and reduced-motion metadata.
- [ ] Add content preview app or local web preview.
- [ ] Add release signing or checksum verification for bundles.
- [ ] Consider remote content updates only after bundle integrity and privacy posture are clear.

Exit criteria:

- A concept can be edited, reviewed, previewed, validated, bundled, and shipped without touching Swift UI code.
- Bundle changes are auditable.
- Editorial mistakes are easier to catch before they reach users.

## Phase 11: Trustworthy Expansion

Goal: expand only where the product has earned it.

Candidates:

- Optional encrypted backup or CloudKit sync, off by default.
- Partner-safe share pages that reveal only selected public content.
- iPad and Mac companion layouts.
- More guided programs around desire, anatomy, communication, and presence.
- Expert-reviewed content packs.
- A privacy-constrained “help me find the word for this” feature using only approved content.
- Android only after the iOS product and content system are stable.

Guardrails:

- No community feed.
- No default cloud account.
- No unrestricted sexual advice chatbot.
- No analytics that make users wonder what is being watched.

## Operating Tracks

These tracks should run continuously once production hardening begins.

| Track | Owner Mindset | Durable Artifacts |
| --- | --- | --- |
| Native app | Product engineering | SwiftUI app, GRDB migrations, tests, release checklist |
| Content | Editorial/product | Source content, citation registry, bundle diffs, review status |
| Privacy | Trust and safety | Threat model, app lock rules, export/delete tests, privacy labels |
| Design | Native premium feel | Tokens, components, motion rules, accessibility reviews |
| Release | Operations | TestFlight notes, App Store metadata, support process |

## Metrics Without Creep

Start with qualitative and local signals:

- Do users save at least one word?
- Do users write at least one field note?
- Do users keep or edit a phrase?
- Do users understand app lock, export, and deletion?
- Do users say the app feels safe enough for the category?

Avoid default behavioral analytics until there is a clear, opt-in reason.

## Near-Term Next Steps

1. Run the current prototype on real devices and record remaining fit/finish issues.
2. Start Phase 5 production hardening with GRDB migration and data-loss tests.
3. Start Phase 6 content QA in parallel, beginning with citations and phrase templates.
4. Decide the Phase 7 pricing model before adding StoreKit.
5. Prepare the first TestFlight cohort only after export/delete/app-lock behavior is boringly reliable.
