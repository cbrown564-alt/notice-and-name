# V2 Roadmap

**Status:** Implementation 0.2  
**Goal:** Reach a TestFlight-quality golden path before expanding content coverage.

## Phase 0: Track Setup

- [x] Create v2 docs home.
- [x] Define premium native product brief.
- [x] Define content bundle direction.
- [x] Define native architecture direction.
- [x] Validate the golden path bundle.
- [x] Decide GRDB vs SwiftData: start with GRDB + SQLite.

## Phase 1: Content Contract

- [x] Draft `content-bundle.schema.json`.
- [x] Add validator script.
- [x] Hand-author five golden path concepts.
- [x] Add pathway and phrase coverage for the golden path.
- [x] Add media manifest entries or explicit media placeholders.
- [x] Add Swift native core package that decodes the golden-path bundle.

## Phase 2: Native Spike

- [x] Create `ios-native/` SwiftUI project.
- [x] Load bundled JSON content in `PleasureVocabularyCore`.
- [x] Implement local user state.
- [x] Build onboarding/privacy pledge.
- [x] Build Today.
- [x] Build concept detail.
- [x] Build status selection and one field note.
- [x] Build saved phrase.
- [x] Build Vocabulary reflection of saved state.

## Phase 3: Feel Pass

- [x] Native typography scale.
- [x] Color tokens adapted from Scientific Warmth.
- [x] Haptic language.
- [x] App lock prototype.
- [x] Dynamic Type review.
- [x] Reduce Motion review.

## Phase 4: Expand And Harden

- [x] Migrate remaining concepts.
- [x] Add pathways.
- [x] Add journal list/search.
- [x] Add export/delete-all-data.
- [x] Add TestFlight host scaffold and runbook.
- [ ] Upload TestFlight build. Blocked here because `xcodebuild` requires full Xcode, but this machine is selected to Command Line Tools.
- [ ] Run device QA. Blocked here until an iPhone or simulator is available through full Xcode.

## Implementation Notes

- Full bundle: `content/v2/bundles/v2-full.bundle.json`
- Bundle generator: `npm run generate-v2-full-bundle`
- Bundle validation: `npm run validate-v2-bundle` and `npm run validate-v2-bundle:full`
- Native verification: `cd ios-native && swift test`
- TestFlight runbook: `ios-native/TESTFLIGHT_RUNBOOK.md`
- Device QA checklist: `ios-native/DEVICE_QA.md`

## First Build Rule

Do not port every v1 screen. Build the golden path until it feels meaningfully different
on device, then expand.
