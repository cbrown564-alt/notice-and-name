# Phase 7 Premium Product Shape

**Status:** Proposed for owner decision
**Last updated:** July 14, 2026
**Owner:** Product
**Implementation gate:** Do not add StoreKit until the model, preview boundary, and
initial price are approved.

## Recommendation

Release the app as a free download with a useful private preview and one
**non-consumable full unlock**. Do not launch with a subscription.

This model fits the current product:

- The initial release is a finished local content library, not an ongoing service.
- A non-consumable purchase is bought once and does not expire.
- Users can judge the tone, privacy posture, and core interaction before paying.
- The app can preserve its no-account, no-sync design.
- A subscription can be reconsidered only after a real editorial update cadence exists.

Apple's current purchase types describe non-consumables as one-time purchases that do not
expire. Apple's free-trial offers apply to auto-renewable subscriptions, so this proposal
uses a permanent preview rather than describing the one-time unlock as a trial.

References:

- [In-App Purchase types](https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-types/)
- [StoreKit 2](https://developer.apple.com/storekit/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Proposed Free Preview

The preview should prove the complete private loop rather than expose disconnected sample
screens.

Included without purchase:

- Onboarding and privacy pledge.
- Today, Settings, app lock, export, and delete-all-data.
- Three complete concepts: Responsive Desire, Angling, and Non-concordance.
- Status changes, one or more field notes, and saved phrases for preview concepts.
- The full Explore index with locked concepts visibly identified.
- Research explainer titles and summaries, with one complete explainer.

Full unlock includes:

- All 22 concepts.
- All five pathways.
- All four research explainers.
- Notes and saved phrases across the complete library.
- Future maintenance updates to the v2 library.

Privacy controls, data export, data deletion, and purchase restoration must never be
paywalled.

## Purchase Experience

The first paywall should appear only when the user opens locked content or explicitly asks
to unlock the library. It should not interrupt onboarding or the first preview concept.

The paywall should state:

- One purchase; no subscription.
- No account required.
- Private data remains on the device.
- What is included in the full library.
- Restore Purchases is always available.

The StoreKit implementation should use a non-consumable product and verified StoreKit 2
transactions. The app should derive access from current verified entitlements and preserve
offline access after a successful purchase. A local flag must not be the sole proof of
purchase.

## App Store Positioning

Lead with the product's specific promise:

> Find clearer words for what fits, what does not, and what you may want to say later.

Supporting points:

- 22 evidence-grounded pleasure concepts.
- Private field notes and partner-safe phrases.
- No account, tracking, or cloud dependency.
- Warm educational illustrations and interactive diagrams; no explicit demonstrations.

Submission metadata must accurately describe the mature educational subject, use the
appropriate age rating, and avoid promotional imagery that could be read as explicit or
intended primarily for arousal. App Review notes should explain the educational purpose and
make the unlock visible and testable for review.

## Support And Feedback

The beta and launch support path should not require an account in the app. Use a public
support and privacy-policy page plus an email address that does not ask users to include
private notes or sexual details. The app should warn users before including diagnostic or
personal text in a support message.

## Owner Decisions Required

1. Approve free preview plus one-time full unlock, or choose paid upfront.
2. Approve the three preview concepts and one preview explainer.
3. Choose the initial price and launch territories in App Store Connect.
4. Name the support email, support URL, and privacy-policy URL.

After decisions 1–3, engineering can implement and test one StoreKit purchase loop:
load product → purchase → unlock → relaunch offline → restore purchase → handle cancellation
and verification failure without losing local user data.
