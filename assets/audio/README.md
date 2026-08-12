# Notice & Name -- audio

Voice: Notice & Name -- Soft Intimate (ElevenLabs custom design A3)
voice_id: see VOICE_ID.txt
Model: eleven_turbo_v2_5

## Sync into the iOS app bundle

Canonical files live under assets/audio/. Copy into the SPM resource bundle with:

    node scripts/sync-ios-media.js
    node scripts/sync-ios-audio.js

sync-ios-media also invokes sync-ios-audio, so CI stays in lockstep.
Destination (gitignored): ios/Sources/PleasureVocabularyApp/Resources/media/audio/

- phrases/*.mp3
- onboarding/*.mp3 (00-full + beats; skip *-rushed-backup*)
- notice-moments/*.mp3
- explainers/ — retired (no narration MP3s synced)
- sfx/*-v1.mp3 only

Package.swift .copy("Resources/media") includes audio once synced.

## Where the UI plays

- Keep PhraseKeepCard Play: phrases/{phraseTemplate.id}.mp3
- Keep bookmark SFX: sfx/keep-v1.mp3
- Recognize Listen (no autoplay): notice-moments/{conceptId}.mp3 + notice-start
- Explainer detail: read-only article (narration retired; no ElevenLabs credits)
- Onboarding Listen (no autoplay): onboarding/00-full.mp3
- Reflect save note SFX: sfx/reflect-saved-v1.mp3
- App lock enabled SFX: sfx/app-lock-v1.mp3
- Arriving on Keep page SFX: sfx/concept-complete-v1.mp3

Settings: Sound effects and Voice playback (both default on).
Voice is user-initiated; missing files hide controls.
AppAudioPlayer.playUnlockSFX() ready for future StoreKit unlock UI.

## phrases/
110 partner-phrase MP3s (one per phraseTemplate id).

## onboarding/
6 beats + 00-full continuous. Script: docs/ONBOARDING_SCRIPT.md (approved).

## notice-moments/
22 guided Notice moments. Scripts: content/v2/audio-scripts/notice-moments.json

## explainers/
Explainer narration retired 2026-08-12 (Soft Intimate copy pass; no ElevenLabs credits).
Directory kept empty so sync-ios-audio clears stale iOS Resources. Do not regenerate VO.

## app-store/
App Store preview VO variants. Not synced into the app bundle.

## sfx/
Soft UI SFX (source has v1/v2; app ships v1): keep, phrase-copied, concept-complete, unlock, app-lock, page-transition, notice-start, reflect-saved.
