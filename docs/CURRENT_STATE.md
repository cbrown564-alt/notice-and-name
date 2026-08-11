# Notice & Name — Current State

**Date:** 2026-08-11

## Product

- **Brand:** Notice & Name (formerly Pleasure Vocabulary / Pleasure Vocabulary Builder)
- **Subtitle:** "Notice what you like, name it."
- **Core loop:** Notice → Name → Reflect → Keep  
  (UI descent often: Recognize → Name → See → Understand → Reflect → Keep)

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
- No StoreKit yet

## Dual eras & rename leftovers

- Dual content eras still in repo: Expo-shaped `data/vocabulary.ts` + `content/v2/copy` + generator; shipping truth is the v2 native bundle
- Repo litter: `.expo/`, `dist/`, `ios-native/`, `components/` (Phase A strips when touching)
- Xcode targets/modules still `PleasureVocabulary*`
- On-disk DB dir still `PleasureVocabulary`

## Pricing (locked, not implemented)

- Free download with useful private preview
- One non-consumable full unlock at £15
- No subscription at launch

## Quality bar (target)

1. Concept experience  
2. Felt privacy  
3. Partner-safe phrases  
4. App Store presence  

## Plan phases

A stabilize → B core loop to bar → C StoreKit/business → D TestFlight/submit  
(see `PLAN.md` on user's machine)
