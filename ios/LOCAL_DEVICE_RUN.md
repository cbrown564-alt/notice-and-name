# Local Device Run Notes

This track is for running the native SwiftUI app locally, without TestFlight or App Store
Connect.

## Current Local Status

- Xcode selected: `/Applications/Xcode.app/Contents/Developer`
- Xcode version: `26.6`
- Generated project: `PleasureVocabulary.xcodeproj`
- Bundle identifier: `com.pleasurevocab.app`
- Personal Team ID: `QCVP3CNMP6`
- Simulator build: passed
- Simulator install/launch: passed on iPhone 17 Pro simulator
- First rendered screen: onboarding/privacy pledge
- Physical iPhone build: passed on Cobro, iPhone 15 Pro Max
- Physical iPhone install/launch: passed after trusting the developer profile on-device

## Commands

Generate the project:

```bash
cd ios
xcodegen generate --spec project.yml
```

Build for simulator:

```bash
xcodebuild \
  -project PleasureVocabulary.xcodeproj \
  -scheme PleasureVocabulary \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5' \
  -derivedDataPath DerivedData \
  build
```

Install and launch on the booted simulator:

```bash
xcrun simctl install booted DerivedData/Build/Products/Debug-iphonesimulator/PleasureVocabulary.app
xcrun simctl launch booted com.pleasurevocab.app
```

## Physical Device Requirements

For a local iPhone or iPad install, Xcode still needs development signing. TestFlight is
not required.

Open Xcode and complete:

1. Xcode -> Settings -> Accounts.
2. Add the Apple ID connected to the developer team.
3. Confirm `Conor Brown (Personal Team)` is available.
4. Open Window -> Devices and Simulators.
5. Connect/unlock the device.
6. Pair/trust the device if prompted.
7. Enable Developer Mode on the device if iOS asks for it.

After that, retry:

```bash
cd ios
xcodebuild \
  -project PleasureVocabulary.xcodeproj \
  -scheme PleasureVocabulary \
  -configuration Debug \
  -destination 'platform=iOS,id=00008103-000274803A7B001E' \
  -derivedDataPath DerivedData \
  -allowProvisioningUpdates \
  build
```

## Latest Physical-Device Blockers

- Resolved: iPhone `Cobro` needed pairing and Developer Mode.
- Resolved: project spec originally used stale team `XZADSGNR44`; Personal Team is
  `QCVP3CNMP6`.
- Resolved: first launch required trusting the developer profile in iPhone Settings.
