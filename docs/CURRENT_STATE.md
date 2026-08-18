# Notice & Name — Current State

**Date:** 2026-08-18

## Product

- **Brand:** Notice & Name (formerly Pleasure Vocabulary / Pleasure Vocabulary Builder)
- **Subtitle:** "Notice what you like, name it."
- **Core loop:** Notice → Name → See → Understand → Reflect → Keep

## Code & identity

- Local folder: `~/code/notice-and-name`
- GitHub: `cbrown564-alt/notice-and-name`
- Bundle id: `com.noticeandname.app`
- Stack: native SwiftUI + GRDB, local-first, no account
- Primary code: `ios/`

## What works today

- Tabs: Today, Vocabulary, Explore, Journal, Settings
- Privacy: app lock, export JSON, delete-all
- Content shipping truth: `v2-full.bundle.json`
  - 22 approved concepts
  - 5 pathways
  - 4 explainers
  - 35 media refs
- Media: 22 illustrations/thumbnails, 4 videos, 5 native diagrams
- StoreKit 2 full unlock + free preview boundary on main (`8f9700e`): product id `com.noticeandname.app.fullunlock`, quiet unlock sheet, Settings restore/unlock, `Configuration.storekit` for Xcode
- App Store listing packet draft: [`docs/APP_STORE.md`](./APP_STORE.md)

## Content truth & rename leftovers

- **Shipping truth:** v2 full bundle in iOS Resources (see `docs/CONTENT.md`)
- **Edit truth for generation:** Expo-shaped `data/*.ts` + `content/v2/copy` + `editorial-review.json` + `assets/` — still required by the generator; not dead Expo runtime
- Repo litter dirs are gitignored; stripped when touching
- Xcode targets/modules still `PleasureVocabulary*`
- On-disk DB dir still `PleasureVocabulary`

## Pricing (locked; in-app implemented)

- Free download with useful private preview (Responsive Desire, Angling, Non-concordance + `mind-body` explainer)
- One non-consumable full unlock at £15 — StoreKit client wired; **App Store Connect IAP still Conor**
- No subscription at launch

## Quality bar (target)

1. Concept experience  
2. Felt privacy  
3. Partner-safe phrases  
4. App Store presence  

## Plan phases

A stabilize → B core loop to bar → C StoreKit/business → D TestFlight/submit  
(see `PLAN.md` on user's machine)
