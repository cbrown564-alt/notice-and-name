# Phase 5 Production Hardening

Phase 5 turns the native prototype into a safer local-first app surface. The contract below
is intentionally small: protect user data, fail closed for incompatible content, keep private
exports from lingering behind the app lock, and preserve full-screen recovery surfaces.

## GRDB Migration Strategy

- The local store owns an integer schema version exposed as `UserStore.currentSchemaVersion`.
- Every schema change must be registered as an ordered GRDB migration with a stable ID.
- The latest applied app schema is stored in `app_metadata` with `schemaVersion`,
  `lastMigrationId`, and `migratedAt`.
- Existing user state is keyed by stable content IDs, so bundle updates must not delete local
  `concept_state`, `field_note`, `saved_phrase`, or `pathway_progress` rows.
- Tests must cover filesystem reopen behavior before shipping any schema change.

## Content Bundle Updates

- The app supports content bundle schema `1`.
- Future schema versions fail validation until a bundle migration is explicitly written.
- `ContentBundleUpdatePlan` compares old and new bundles by concept ID and reports retained,
  added, and removed concepts.
- Removed concepts do not automatically delete local user data. Data deletion remains an
  explicit user action.

## App Lock Rules

- A cold launch with onboarding complete and app lock enabled starts locked.
- Completing onboarding keeps the app open; future backgrounding or cold launch applies the lock.
- Moving to the background while app lock is enabled locks the app and clears export previews.
- Disabling app lock immediately releases the gate.
- Failed authentication keeps the app locked.

## Failure And Empty States

- Corrupt or missing bundles show a full-window recovery state before painting the app canvas.
- Onboarding and lock screens take a full-window frame to avoid partial-height canvas regressions.
- Vocabulary and Journal empty/search-empty states use structured labels and SF Symbols.
- Missing media references show an inline fallback while keeping the concept text available.
- Failed export, locked database, and other persistence errors surface through the shared alert.

## Accessibility Checks

- SwiftUI text uses Dynamic Type fonts and wraps with `fixedSize(horizontal: false, vertical: true)`
  on recovery and explanatory states.
- Decorative SF Symbols are hidden from VoiceOver; structured empty/error states combine their
  child labels.
- Reduce Motion is respected for concept-card animation and media references.
- Full QA still requires device verification with VoiceOver, large accessibility text sizes,
  contrast review, and Reduce Motion on at least one current iPhone and one smaller iPhone.

## Performance Budgets

Budgets are intentionally conservative for local-first use:

| Surface | Budget | Verification |
| --- | ---: | --- |
| Cold bundle load plus store initialization | < 1.5 s on current iPhone | Device QA stopwatch / Instruments |
| 100 local concept/note writes plus JSON export | < 2.0 s in package tests | `localStoreOperationsStayWithinPerformanceBudget` |
| Individual database read/write used by UI actions | < 100 ms on current iPhone | Instruments during TestFlight QA |
| Media reference rendering fallback | No blocking disk/network work | Code review and device smoke |

## Automated Coverage

- `PleasureVocabularyCoreTests` covers settings, concept state, notes, phrases, pathways,
  content versions, export JSON, delete-all-data, schema metadata, filesystem reopen, bundle
  update planning, and a local database performance budget.
- `PleasureVocabularyAppTests` covers app-lock lifecycle rules, root-view construction from a
  loaded model, and export-preview clearing before lock presentation.
