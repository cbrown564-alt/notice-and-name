# V2 Native Architecture

**Status:** Draft 0.1  
**Decision:** iOS-first, SwiftUI-first, local-first

## Target Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| UI | SwiftUI | Use native navigation, sheets, forms, haptics, dynamic type |
| Persistence | GRDB + SQLite | Explicit migrations, SQL queries, export/import control, durable local-first data |
| Sensitive settings | Keychain | App lock state, encryption keys if added |
| Encryption | CryptoKit if required | Decide after data threat model; avoid vague "encrypted" claims |
| Media | AVFoundation / native video views | Keep loops short, silent, and reduced-motion aware |
| Content input | Generated JSON bundle | App consumes versioned, validated content package |
| Build/distribution | Xcode + TestFlight | Native QA starts early |
| Sync | None for first slice | Optional CloudKit later, off by default |

## System Boundaries

```
Content Source Files
        ↓
Bundle Generator + Validation
        ↓
Versioned Content Bundle
        ↓
SwiftUI App
        ↓
Local User Store
```

The native app should not know about repository docs, generation prompts, or source asset
experiments. It should consume a compact release bundle and local media assets.

## Local Data Model

| Entity | Purpose |
| --- | --- |
| UserConceptState | Per-concept status: unexplored, explored, resonates, curious, tried, not for me |
| FieldNote | Private journal entry, optionally linked to a concept or pathway |
| SavedPhrase | Partner-safe phrase generated or assembled from content |
| PathwayProgress | Ordered pathway progress |
| AppSettings | App lock, notification privacy, reduced sensitivity options |
| ContentVersion | Installed content bundle version and migration metadata |

## Privacy Defaults

- No account required.
- No remote sync in the first slice.
- App lock is offered during onboarding, not hidden in settings.
- Notifications must use discreet copy.
- Share sheets must never include private field notes unless the user explicitly selects them.
- Delete-all-data and export should be first-class settings.
- Analytics are absent or explicitly opt-in after the app proves the core experience.

## Native UX Principles

- Use `NavigationStack`, system sheets, context menus, and SF Symbols where they fit.
- Let typography, spacing, and haptics carry the premium feel before adding ornamental art.
- Keep the first screen useful. No marketing landing screen inside the app.
- Favor dense calm over oversized content cards.
- Respect Dynamic Type and Reduce Motion from the first prototype.

## Technology Decisions To Make Before Coding

1. **Content bundle format:** single JSON bundle vs multiple files.
2. **Asset packaging:** app-bundled media for v2.0 vs downloadable packs later.
3. **App lock semantics:** biometric-only, passcode fallback, or system-auth prompt.
4. **Telemetry posture:** none, local-only diagnostics, or opt-in anonymous events.

## Suggested Initial Choice

Use **SwiftUI + GRDB + generated JSON content bundle** for the first native spike.

GRDB is a little less magical than SwiftData, but this product benefits from explicit
migrations, export/import control, queryable private state, and long-term durability.
SwiftData remains a possible future simplification for non-sensitive preference-style
objects, but the primary user data store should start in SQLite.
