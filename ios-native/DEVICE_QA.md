# Native Device QA

Run this checklist on an iPhone before TestFlight promotion. Use a fresh install first,
then repeat the persistence checks after force-quitting and reopening the app.

## Golden Path

- Onboarding opens directly into the privacy pledge.
- App lock toggle is visible during onboarding.
- Accepting the pledge lands on Today.
- With app lock enabled, canceling the first authentication prompt after onboarding
  leaves the Locked screen full-bleed with no white/black bars or partial-height panel.
- If app lock is enabled, relaunching asks for device authentication or passcode.
- Today shows one suggested concept and the saved counts.
- Opening a concept marks it explored.
- Status can be changed to Resonates, Curious, Tried, and Not for me.
- A field note can be saved from concept detail.
- A phrase can be saved from concept detail.
- Vocabulary reflects the changed status, note, and phrase.
- Journal lists the field note.
- Journal search finds the note by body text and concept id.

## Expanded Content

- Explore lists all 5 pathways.
- Explore lists all 22 concepts.
- Each pathway opens and all pathway concept links resolve.
- Concept detail renders recognize, definition, media, mechanism, reflection, and phrase
  blocks without missing copy.
- Video media entries show a static fallback when Reduce Motion is enabled.

## Privacy And Data

- Settings toggles app lock without losing state.
- Settings toggles reduced previews without losing state.
- Export local data produces JSON containing settings, concept state, notes, phrases,
  pathway progress, and content version.
- Delete all local data clears notes, phrases, concept states, pathway progress, and
  content version.
- Delete all local data restores default private settings.
- No screen asks for account creation, sync, analytics, or network permissions.

## Feel Pass

- Dynamic Type: test default, large, and accessibility text sizes.
- Reduce Motion: enable in system settings and confirm no required meaning depends on
  animation.
- Haptics: accepting pledge, saving note, saving phrase, status changes, and delete all
  give restrained feedback.
- VoiceOver: tab labels, lock button, status menu, export, and delete controls are named.
- Small phone width: buttons, status labels, and pathway rows do not truncate awkwardly.
- Dark environments: contrast remains readable with the warm light palette.
