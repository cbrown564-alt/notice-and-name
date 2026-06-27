# V2 Premium Native Track

This folder is the planning and architecture home for the ground-up premium rebuild.
The current Expo app remains the v1 prototype, content reference, and asset archive.
V2 should not port screens one-for-one.

## Start Here

| Document | Purpose |
| --- | --- |
| [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) | Product spine, audience, core loop, and what changes from v1 |
| [NATIVE_ARCHITECTURE.md](./NATIVE_ARCHITECTURE.md) | SwiftUI-first technical direction, local-first privacy model, and system boundaries |
| [CONTENT_SYSTEM.md](./CONTENT_SYSTEM.md) | Content package model consumed by the native app |
| [ROADMAP.md](./ROADMAP.md) | Practical build sequence from brief to TestFlight |

## Working Principle

V2 is a premium private vocabulary app backed by a real content system. The app should
feel like a native, intimate instrument for self-knowledge, not a cross-platform content
deck with more polish.

## Native Core

The first native package lives in [`../../ios-native`](../../ios-native). It currently
loads and validates the golden-path content bundle from Swift tests.
