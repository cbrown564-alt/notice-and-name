# V2 Premium Native Track

This folder is the planning and architecture home for the **iOS-first premium rebuild**.
The legacy Expo / React Native prototype at the repo root is being retired; see
[EXPO_RETIREMENT.md](./EXPO_RETIREMENT.md).

## Start Here

| Document | Purpose |
| --- | --- |
| [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) | Product spine, audience, core loop, and what changes from v1 |
| [NATIVE_ARCHITECTURE.md](./NATIVE_ARCHITECTURE.md) | SwiftUI-first technical direction, local-first privacy model, and system boundaries |
| [CONTENT_SYSTEM.md](./CONTENT_SYSTEM.md) | Content package model consumed by the native app |
| [ROADMAP.md](./ROADMAP.md) | Practical build sequence from brief to TestFlight |
| [EXPO_RETIREMENT.md](./EXPO_RETIREMENT.md) | Expo removal plan, feature keep/drop decisions, and merge sequence |

## Working Principle

V2 is a premium private vocabulary app backed by a real content system. The app should
feel like a native, intimate instrument for self-knowledge, not a cross-platform content
deck with more polish.

## Native Core

The production iOS app lives in [`../../ios-native`](../../ios-native). It loads the full
v2 content bundle (22 concepts, 5 pathways, 4 research explainers) and persists user state
with GRDB. Research explainers appear under **Explore → Research Explainers**.
