# Backend Architecture

**Canonical detail:** [`../backend-refactor-complete.md`](../backend-refactor-complete.md) (full phase-by-phase narrative).

This page is the quick reference for contributors.

---

## Overview

Local-first persistence with a **repository pattern** over platform storage adapters. Business logic is shared; only I/O differs between native (SQLite) and web (AsyncStorage).

```
UI (hooks / Context)
    → Database facade (lib/database)
        → Repositories (lib/repositories/*)
            → StorageAdapter (lib/storage/*)
                → SQLite (native) | AsyncStorage (web)
```

---

## Key modules

| Path | Role |
|------|------|
| `lib/validation.ts` | Zod schemas; runtime validation on read |
| `lib/errors.ts` | `DatabaseError`, `ValidationError`, `NotFoundError`, `StorageError` |
| `lib/logger.ts` | Scoped structured logging |
| `lib/database/index.ts` | Singleton `db` facade |
| `lib/repositories/*` | Entity CRUD + domain queries |
| `lib/storage/sqliteAdapter.ts` | Native adapter |
| `lib/storage/asyncStorageAdapter.ts` | Web adapter |
| `contexts/*` | React Context replaces legacy event bus |

---

## Entities

- **Concepts** — progress, resonance, unlock/mastery (`user_concepts`)
- **Journal** — reflection entries
- **Pathways** — completion state per pathway
- **Onboarding** — goals and privacy flags
- **Settings** — app preferences

---

## Testing

```bash
npm test
```

198 unit tests cover repositories, validation, and error helpers (`__tests__/lib/`).

---

## Migrations

Schema changes go through versioned migrations in the SQLite adapter. Web adapter mirrors shape with JSON serialization where needed.

---

## Out of scope (v1.0)

- Remote sync / accounts
- Server API
- Premium enforcement (typed, not gated)
