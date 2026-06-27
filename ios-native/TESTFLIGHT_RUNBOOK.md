# TestFlight Runbook

This native track is ready for an Xcode-hosted iOS app target, but this workspace is
currently selected to Command Line Tools only. `xcodebuild` archives require a full Xcode
installation and an Apple Developer signing team.

## Preflight

Run these from the repository root:

```bash
npm run generate-v2-full-bundle
npm run validate-v2-bundle
npm run validate-v2-bundle:full
cd ios-native && swift test
```

Confirm full Xcode is selected:

```bash
xcode-select -p
```

If the result is `/Library/Developer/CommandLineTools`, switch to full Xcode before
archiving:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

## Xcode Host Target

Create an iOS SwiftUI app target named `PleasureVocabulary` and point it at:

- `ios-native/AppHost/PleasureVocabularyHostApp.swift`
- `ios-native/AppHost/Info.plist`
- `ios-native/AppHost/PrivacyInfo.xcprivacy`
- local package product `PleasureVocabularyApp`

Suggested target settings:

- Deployment target: iOS 17.0+
- Bundle identifier: owned App Store Connect identifier
- Signing: automatic with the Apple Developer team
- Version: `0.2.0`
- Build: managed by Xcode or App Store Connect

## Archive And Upload

After the host target exists in an Xcode project or workspace:

```bash
xcodebuild \
  -scheme PleasureVocabulary \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath build/PleasureVocabulary.xcarchive \
  archive

xcodebuild \
  -exportArchive \
  -archivePath build/PleasureVocabulary.xcarchive \
  -exportOptionsPlist ios-native/ExportOptions.plist \
  -exportPath build/TestFlight
```

Then verify the uploaded build in App Store Connect and add it to an internal TestFlight
group.

## Release Gate

Do not promote a build until:

- `swift test` passes.
- Both v2 bundle validators pass.
- Onboarding, lock, Today, concept detail, Vocabulary, Journal, export, and delete-all-data
  pass device QA.
- Privacy nutrition labels match the local-only posture: no account, no tracking, no
  collected data for this first slice.
