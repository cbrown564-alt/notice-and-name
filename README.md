# Notice & Name

> Formerly developed under the working title Pleasure Vocabulary Builder.

A premium, educational iOS app that helps adults build a private, precise vocabulary for sexual pleasure — through guided concepts, pathways, field notes, and partner-safe phrases.

The production client is the **SwiftUI app** in [`ios/`](./ios/). Editorial content lives in TypeScript sources under `data/` and is compiled into validated JSON bundles consumed by the native app.

## Features

- **Today**: A gentle daily prompt and suggested concept to explore.
- **Vocabulary**: Saved, resonant, curious, and rejected words with personal status.
- **Explore**: Guided pathways, the full concept library, and research explainers.
- **Journal**: Private field notes linked to concepts.
- **Saved phrases**: Partner-safe language generated from concept templates.
- **Private & local**: Progress stored on-device with GRDB; optional app lock, export, and delete-all-data.

## Tech Stack

- **Client**: SwiftUI, GRDB (local persistence), native iOS media
- **Content pipeline**: TypeScript sources in `data/*.ts` → validated bundles in `content/v2/bundles/`
- **Tooling**: Node.js scripts for bundle generation, validation, lint, and media sync

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Xcode (for building and running the iOS app)
- macOS (for device builds and TestFlight)

### Content pipeline

From the repository root:

```bash
npm install
npm run generate-v2-full-bundle
```

This generates the full v2 content bundle from `data/*.ts` and writes it to `content/v2/bundles/`.

### Native app tests

```bash
cd ios && swift test
```

Open `ios/` in Xcode to run on a simulator or device. See the runbooks below for TestFlight and device QA.

## Documentation

| Document | Purpose |
| --- | --- |
| [**docs/CONTENT.md**](./docs/CONTENT.md) | Content pipeline: edit surfaces vs shipping v2 bundle |
| [**ios/TESTFLIGHT_RUNBOOK.md**](./ios/TESTFLIGHT_RUNBOOK.md) | Xcode archive and TestFlight distribution |
| [**ios/DEVICE_QA.md**](./ios/DEVICE_QA.md) | On-device QA checklist before release |
| [**docs/README.md**](./docs/README.md) | Full documentation index |

## Project Structure

```
ios/          Production SwiftUI app (GRDB, content bundle loader)
data/                Editorial TypeScript (vocabulary, pathways, explainers)
content/v2/          Bundle schema, generated JSON, validation, preview
assets/              Canonical media (illustrations, thumbnails, video)
scripts/             Bundle generation, lint, media sync, asset tooling
docs/                Product, design, pipeline, and architecture docs
```

## Design System

The app uses a warm, editorial visual language:

- **Primary**: Rich Coral (`#E8603C`) — warmth and human connection
- **Secondary**: Muted Sage (`#60846A`) — calm, grounding, growth
- **Typography**: Playfair Display for headers, system sans for body text

See [`docs/design/STYLE_BIBLE.md`](./docs/design/STYLE_BIBLE.md) for the full style guide.

## License

Private / Internal Project
