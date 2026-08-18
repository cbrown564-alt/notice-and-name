# Notice & Name — App Store listing packet

Paste-ready metadata for App Store Connect. Soft Intimate voice. Phase D draft only — no fake screenshots, no video production.

**Status:** In-repo draft for Conor taste pass. Capture real 6.7" screenshots on device. Support URL, privacy URL, and Connect IAP remain Conor-owned.

**Limits:** Counts are Unicode characters (Swift `count` / Python `len`). Cut before shipping if any field overruns.

---

## 1. Identity

| Field | Value | Count |
| --- | --- | --- |
| **Name** | Notice & Name | **13 / 30** |
| **Subtitle** | Notice what you like, name it. | **30 / 30** |
| **Bundle ID** | `com.noticeandname.app` | — |
| **Spoken** | Notice and Name | — |

---

## 2. Promotional text

≤170 characters. Soft Intimate. No hype.

```
A private place to notice what you like, and find words for it. Everything stays on your phone. No account. No feed. Start free. Unlock once when you're ready.
```

**159 / 170**

---

## 3. Description

≤4000 characters. Paste as-is.

```
Notice & Name is a private place to notice what you like, and find words for it.

Short concepts. Clear language. Phrases you can actually say — when you're ready.

The loop is simple.

Notice. Name. Reflect. Keep.

Start free with a few concepts and a mind-body research explainer. When it fits, unlock the full library once. No subscription.

Everything stays on your phone. No account. No feed. No one watching. You can lock the app, export your notes, or delete everything.

This is not a course. Not therapy. Not a clinic. Not a feed. Just a calm adult instrument for a private vocabulary of pleasure — twenty-two concepts you can return to at your own pace.
```

**663 / 4000**

---

## 4. Keywords

Comma-separated. No competitor names. No app name (Apple already indexes it).

```
pleasure,intimacy,vocabulary,desire,sexual education,body,partner,private,adult learning,words
```

**94 / 100**

---

## 5. What’s New (1.0)

```
1.0 — Notice what you like. Name it. A private vocabulary for pleasure, on your phone. No account. No feed.
```

**107 / 4000**

---

## 6. Screenshot sequence (6.7" iPhone primary)

Capture list for Conor on device. **Do not** invent or generate fake screenshot images.

Apple product-page caption guidance used here: **≤45 characters** (App Preview / screenshot caption discipline). Keep Soft Intimate; no hype chips on the glass.

| # | In-app surface | How to get there | Caption (paste under frame) | Count | VO take |
| --- | --- | --- | --- | --- | --- |
| 1 | **Today** | Fresh install or post-onboarding Today tab; calm home, free concepts visible | Notice what you like. | **21 / 45** | `preview-a-core` (open) |
| 2 | **Concept · See** | Open free concept **Angling** → See page (diagram / illustration dominant) | See the idea clearly. | **21 / 45** | `preview-c-loop` |
| 3 | **Concept · Name** | Same concept → Name page (the word + short definition) | Words you might say. | **20 / 45** | `preview-a-core` (middle) |
| 4 | **Concept · Keep** | Same concept → Keep (partner-safe phrase cards) | Phrases you can keep. | **21 / 45** | `preview-b-privacy` |
| 5 | **Settings · Privacy** | Settings → Privacy card: App lock on; Export / Delete visible without scrolling past Library if possible | Lock. Export. Delete. | **21 / 45** | `preview-f-trailer` (privacy beat) |
| 6 | **Unlock sheet** | Settings → Unlock, or open a gated concept → sheet **Open the full vocabulary** | Start free. Unlock once. | **24 / 45** | `preview-a-core` (close) / `preview-e-soft-close` |

**Capture notes**

- Primary size: **6.7" iPhone** (required). Secondary sizes later if Connect asks.
- Prefer free-preview surfaces for shots 1–4 so Review can match the listing without IAP.
- Shot 6: quiet unlock sheet — not a shouty paywall. Price may show placeholder until Connect IAP exists; capture after Conor creates `com.noticeandname.app.fullunlock` if the sheet looks empty in sandbox.
- Optional alternate for shot 2: **Responsive Desire** See page if Angling media is mid-taste.
- Frame count: **6**. Do not add stats, badge stickers, or competitor callouts in the chrome.

---

## 7. App Preview video

No video in this slice. When Conor cuts a preview:

| Choice | File | Use when |
| --- | --- | --- |
| **Primary** | `assets/audio/app-store/preview-a-core.mp3` | Standard short preview (~15–30s). Matches subtitle + privacy + start-free / unlock-once. |
| **Alternate** | `assets/audio/app-store/preview-f-trailer.mp3` | Longer cut that needs lock / export / delete and “no subscription treadmill.” |

Scripts: `assets/audio/app-store/SCRIPTS.json` (`preview-a-core`, `preview-f-trailer`). Alts (`preview-a-core-alt`, paced takes) are backups only.

Lay VO under device captures from §6. Do not regenerate audio in this slice.

---

## 8. App Review notes

Paste into App Review Information → Notes.

```
Age rating intent: 17+ educational sexual health / intimacy vocabulary. No user-generated content. No social feed. No tracking.

Local-only: no account, no login, no cloud sync. Reflections and kept phrases stay on device. App lock, JSON export, and delete-all are in Settings.

Free preview (no purchase required):
• Concepts: Responsive Desire, Angling, Non-concordance
• Research explainer: mind-body
Open any of those from Today / Vocabulary / Explore. Full concept pages (Notice → Name → See → Understand → Reflect → Keep) are available without unlocking.

Gated content: other concepts show a quiet unlock sheet (“Open the full vocabulary”). One-time non-consumable unlock.
Product ID: com.noticeandname.app.fullunlock
(Conor creates this IAP in App Store Connect before submit — client is already wired.)

Restore: Settings → Restore Purchases (also on the unlock sheet).

No demo account — there is no account system.

Support URL: Conor — paste when live.
Privacy Policy URL: Conor — paste when live.
```

---

## 9. Privacy Nutrition (intent)

Matches `ios/AppHost/PrivacyInfo.xcprivacy`:

| Manifest key | Value |
| --- | --- |
| `NSPrivacyTracking` | `false` |
| `NSPrivacyTrackingDomains` | empty |
| `NSPrivacyCollectedDataTypes` | empty |
| `NSPrivacyAccessedAPITypes` | empty |

**App Store privacy answers (intent)**

- **Data Not Collected** — app does not collect data from the device for the developer.
- **Tracking:** No.
- **Purchases:** via Apple (StoreKit). No third-party analytics, ads, or account backend in the shipping client.
- Do not invent collected data types in Connect; if Connect’s questionnaire needs a purchases-related disclosure for Apple-handled IAP, answer only what Apple’s form requires — do not claim we collect payment details.

---

## 10. Still Conor

| Item | Owner |
| --- | --- |
| Support email (listing + Review) | Conor |
| Privacy policy URL (live page) | Conor |
| App Store Connect IAP `com.noticeandname.app.fullunlock` (£15 GBP non-consumable) | Conor |
| Real 6.7" screenshots + optional other sizes | Conor |
| Taste pass on this copy | Conor |
| App Preview video edit (VO already in repo) | Conor |
| TestFlight / submit | Conor (later — not this slice) |

---

## Voice references (do not invent a louder register)

Onboarding (approved): *This is Notice and Name. A private place to notice what you like, and find words for it. Everything stays on your phone. No account. No feed. No one watching.* · *Notice. Name. Reflect. Keep.*

App Store VO (`preview-a-core`): *Notice what you like. Name it. Notice and Name is a private vocabulary for pleasure — short concepts, clear words, and phrases you can actually say. Everything stays on your phone. No account. No feed. Start free. Unlock once when you're ready.*
