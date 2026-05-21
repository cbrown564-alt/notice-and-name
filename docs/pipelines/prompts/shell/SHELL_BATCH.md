# Shell Asset Batch (Phase D — §8a)

**Goal:** Regenerate pathway heroes, explainer headers, and UI chrome so shell imagery matches ratified concept plates (Scientific Warmth v1.0).

**Prerequisites:** 5/5 reference renders approved (`data/reference-renders.json`).

## Specs

| Asset type | Size | Max (post-compress) | Generator |
|------------|------|---------------------|-----------|
| Pathway hero | 1200×675 | 200 KB | ChatGPT Images 2 |
| Explainer header | 1200×675 | 200 KB | ChatGPT Images 2 |
| Deck slide bg | 1080×1920 safe area | 150 KB | ChatGPT Images 2 |
| Empty / home UI | 1024×1024 or 3:4 | 150 KB | ChatGPT Images 2 |

## Batch order

1. **Deck slides** — `ui/slide-*.md` (Name, Understand, Explore)
2. **Empty states + home** — journal, collection, welcome, daily-discovery
3. **Pathways** — 5 covers (one per journey personality)
4. **Explainers** — 4 research article headers

## Procedure

1. Generate from prompt file (no in-image text).
2. Save to production path listed in each prompt.
3. `npm run compress-assets`
4. Spot-check in app: pathway detail, explainer detail, ConceptDeck slides, Home, Journal, Profile shelf.
5. `npm run sync-registry` → `npm run validate-manifest`

## Queue

```bash
npm run batch-asset-queue
```

## Prompt index

### UI

| Asset | Prompt |
|-------|--------|
| slide-name | [ui/slide-name.md](./ui/slide-name.md) |
| slide-understand | [ui/slide-understand.md](./ui/slide-understand.md) |
| slide-explore | [ui/slide-explore.md](./ui/slide-explore.md) |
| home-welcome | [ui/home-welcome.md](./ui/home-welcome.md) |
| daily-discovery | [ui/daily-discovery.md](./ui/daily-discovery.md) |
| empty-journal | [ui/empty-journal.md](./ui/empty-journal.md) |
| empty-collection | [ui/empty-collection.md](./ui/empty-collection.md) |

### Pathways

| Pathway | Prompt |
|---------|--------|
| foundations | [pathways/foundations.md](./pathways/foundations.md) |
| solo-exploration | [pathways/solo-exploration.md](./pathways/solo-exploration.md) |
| partner-communication | [pathways/partner-communication.md](./pathways/partner-communication.md) |
| expanding-repertoire | [pathways/expanding-repertoire.md](./pathways/expanding-repertoire.md) |
| mindful-presence | [pathways/mindful-presence.md](./pathways/mindful-presence.md) |

### Explainers

| Article | Prompt |
|---------|--------|
| orgasm-gap | [explainers/orgasm-gap.md](./explainers/orgasm-gap.md) |
| anatomy-101 | [explainers/anatomy-101.md](./explainers/anatomy-101.md) |
| mind-body | [explainers/mind-body.md](./explainers/mind-body.md) |
| communication-science-101 | [explainers/communication-science-101.md](./explainers/communication-science-101.md) |
