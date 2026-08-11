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

## Interactive Diagrams (S0 + S1 + S2)

Run with Reduce Motion off first, then on. Confirm insight chips update; no in-canvas text.

### Technique five (S0)
- Angling: vertical drag tilts pelvis; posterior tuck glows; insight Neutral / Anterior / Posterior.
- Rocking: free drag partner wedge; heat at pubic contact; insight No contact → Near → Contact.
- Shallowing: horizontal drag; entrance peak vs deep pressure; insight Shallow · sensitive / Deep · pressure.
- Pairing: tap External + Internal; bridge glow when both on; insight Paired.
- Edging: vertical drag climbs; release eases back; insight Near the edge / Easing back.

### Anatomy four (S1)
- Clitoral Structure (`iceberg`): drag/tap peels Glans → Bulbs → Crura; light haptic per new layer; RM shows soft full iceberg.
- Nerve Density: vertical drag zooms; filaments densify Sparse field → Crowded endings; haptic entering dense zone; RM dense frame.
- CUV Complex: toggle Clitoral / Urethral / Anterior; overlap glow ≥2; One cluster + haptic on full triad; RM all three on.
- Internal Stimulation: vertical drag; Anterior path glows vs Deep pressure dull; haptic on anterior engage; RM anterior teaching frame.

### Sensation four (S2)
- Building: hold fills reservoir; release leaks; insight Gathering / Held / Easing; haptic ~70%; RM mid-fill.
- Plateauing: drag along climb→ridge; insight Climbing / On the ridge / Sliding off; haptic on first ridge arrival; RM parked on plateau.
- Pulsing: tap emits concentric rings (~0.8s); insight Still / Pulse; light haptic per tap; RM one soft mid-expand ring.
- Spreading: tap origin; ripples through nerve tree; insight Contact / Spreading; haptic on origin tap; RM mid-spread frame.

### Diagram a11y / feel
- Reduce Motion: each of the 13 shows a static teaching frame (no idle pulse, no required animation).
- VoiceOver: diagram treated as single image with caption label.
- Small phone: chip buttons (Pairing, CUV) wrap without truncating awkwardly.
- Haptics: light impact only at insight moments (never continuous).
