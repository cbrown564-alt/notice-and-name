# Notice & Name — testing

Lean suite on purpose. Old heavy UI smoke and manifest validation were wiped 2026-08-11.

## What runs in CI

See .github/workflows/ci.yml

- content (ubuntu): generate, validate, and lint the v2 content bundle
- ios (macos): sync media, then run package tests in ios/

Triggers: push or PR to main.

## Local tests

- ContentBundleTests.swift — bundle loads; concept and pathway counts
- UserStoreTests.swift — local GRDB user store basics
- AppLockTests.swift — app lock coordinator behavior

Clear ios/.build after path or rename changes, then run package tests from ios/.

## Why small

Protects shipping truth (bundle and privacy primitives) without pinning brittle UI. Broader coverage returns with StoreKit and export UX in Phase C.
