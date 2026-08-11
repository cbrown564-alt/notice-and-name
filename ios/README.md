# Notice & Name Native

This folder contains the premium native rebuild track.

Current scope:

- Swift package for native content models
- JSON loader for v2 content bundles
- GRDB-backed local user state
- SwiftUI app module for the v2 golden path and expanded concept library
- Xcode host-app scaffold for TestFlight packaging

The app module is source-ready and compiles through SwiftPM. Producing a TestFlight
archive still requires a full Xcode installation, signing team, and host Xcode project.

## Commands

```bash
swift test
```

From the repository root:

```bash
npm run generate-v2-full-bundle
npm run validate-v2-bundle
npm run validate-v2-bundle:full
```

The tests load:

- `../content/v2/bundles/golden-path.bundle.json`
- `../content/v2/bundles/v2-full.bundle.json`

## App Entry

The SwiftUI root view lives in the package product `PleasureVocabularyApp`.

The Xcode host entry is:

`AppHost/PleasureVocabularyHostApp.swift`

Distribution notes:

- [TESTFLIGHT_RUNBOOK.md](./TESTFLIGHT_RUNBOOK.md)
- [DEVICE_QA.md](./DEVICE_QA.md)
