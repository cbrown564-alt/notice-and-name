# Style Bible Reference Renders

**Phase:** 1.1 — ratify `design/STYLE_BIBLE.md` before Phase 3 batch production  
**Tracker:** [`data/reference-renders.json`](../../data/reference-renders.json)  
**Target:** **5/5 approved** — one reference illustration per category family  
**Bar:** Style coherence **≥ 5**, scientific accuracy **≥ 4**, no embedded text (stricter than general pilot promotion)

---

## Why this gate exists

Batch-regenerating 22 illustrations without a locked visual language produced the January incoherence problem. Reference renders are the **canonical plates** each family must match. No Phase 3 image batch starts until `reference-renders.json` shows `"ratified": true`.

---

## The five families

| Family | Concept | Generator | Prompt | Status |
|--------|---------|-----------|--------|--------|
| Technique | `angling` | ChatGPT Images 2 | [`illustrations/angling.md`](./prompts/illustrations/angling.md) | ✅ Approved |
| Sensation | `spreading` | Gemini clinical | [`GEMINI_CLINICAL_PROMPTS.md`](./prompts/GEMINI_CLINICAL_PROMPTS.md#spreading-sensation) | ✅ Approved |
| Timing | `warmup-window` | Gemini clinical | [`GEMINI_CLINICAL_PROMPTS.md`](./prompts/GEMINI_CLINICAL_PROMPTS.md#warmup-window-timing) | ✅ Approved |
| Psychological | `non-concordance` | ChatGPT Images 2 | [`illustrations/non-concordance.md`](./prompts/illustrations/non-concordance.md) | ✅ Approved |
| Anatomy | `clitoral-structure` | Gemini clinical | [`GEMINI_CLINICAL_PROMPTS.md`](./prompts/GEMINI_CLINICAL_PROMPTS.md#clitoral-structure-anatomy) | ✅ Approved |

Run `npm run reference-renders` for live status.

---

## Workflow (per family)

### 1. Generate

Use the prompt linked above. **Global prefix** (all families):

> Scientific Warmth — warm cream canvas `#F9F5F1`, fine etching line work, bioluminescent coral accents for nerves and arousal, pearlescent tissue, gallery medical illustration quality. **No text, labels, or watermarks.** Non-explicit, anatomically respectful.

**Save candidates to:**

```
assets/_staging/reference/{family}/{generator}.png
```

Or use the existing pilot path (auto-linked on sync):

```
assets/_staging/pilot/illustrations/{concept-id}/{generator}.png
```

| Family | Recommended tool | Notes |
|--------|------------------|-------|
| technique | ChatGPT Images 2 | [`CHATGPT_THINKING_PROMPTS.md`](./prompts/CHATGPT_THINKING_PROMPTS.md) — **verify zero in-image text** |
| sensation, timing, anatomy | Gemini (Google Flow) | [`GEMINI_CLINICAL_PROMPTS.md`](./prompts/GEMINI_CLINICAL_PROMPTS.md) — guardrail-safe clinical framing |
| psychological | ChatGPT Images 2 | Already approved — use as tone reference for other families |

### 2. Register (optional)

If saved directly to `reference/` staging:

```bash
npm run reference-renders -- register sensation gemini
```

### 3. Review in app

1. Run the SwiftUI app from `ios/PleasureVocabulary.xcodeproj`, then open Explore → concept → See
2. Check STYLE_BIBLE §9 checklist (palette, no text, respectful anatomy, glow reads as sensation)  
3. Compare against **non-concordance** (psychological reference) for tone consistency

### 4. Score

```bash
npm run reference-renders -- score sensation gemini --style 5 --accuracy 5 --no-text pass --notes "Ripple metaphor reads clearly"
```

Reference bar requires **style ≥ 5** (not the general pilot threshold of 4).

### 5. Promote + approve

```bash
# Promotes pilot → production illustration + marks family approved
npm run reference-renders -- promote sensation gemini

# Or if already in production, approve only:
npm run reference-renders -- approve psychological
```

### 6. Sync + validate

```bash
npm run sync-registry
npm run generate-concept-audit
npm run validate-manifest
```

---

## Angling regeneration record

The first technique reference was rejected for in-image titles. The replacement passed
the reference bar and is now approved. Future regeneration should retain this explicit
negative prompt:

**Add to angling prompt body:**

> CRITICAL: Do not render any text, titles, labels, captions, or typography anywhere in the image. The app provides all copy.

**ChatGPT path:** [`CHATGPT_THINKING_PROMPTS.md`](./prompts/CHATGPT_THINKING_PROMPTS.md) → angling section.

After regen:

```bash
npm run reference-renders -- register technique chatgpt-images-2
npm run reference-renders -- score technique chatgpt-images-2 --style 5 --accuracy 5 --no-text pass
npm run reference-renders -- promote technique chatgpt-images-2
```

---

## Ratification (5/5)

When all families show `status: "approved"` in `reference-renders.json`:

1. `npm run reference-renders` shows `RATIFIED ✅`
2. Update `design/STYLE_BIBLE.md` header: **Status: v1.0 ratified**
3. Confirm `docs/v2/ROADMAP.md` still reflects the approved media baseline
4. **Unblock Phase 3** illustration batch — use approved references as visual anchors in every per-concept prompt

---

## Commands reference

| Command | Purpose |
|---------|---------|
| `npm run reference-renders` | Dashboard (5/5 progress) |
| `npm run reference-renders -- sync` | Pull scores from asset-registry |
| `npm run reference-renders -- register <family> <generator>` | Link candidate PNG |
| `npm run reference-renders -- score <family> [generator] --style N ...` | Record rubric scores |
| `npm run reference-renders -- approve <family>` | Lock reference (production must exist) |
| `npm run reference-renders -- promote <family> [generator]` | Swap pilot → production + approve |
| `npm run reference-renders -- reject <family> --notes "..."` | Mark rejected |

---

## File layout

```
assets/_staging/
├── reference/                    # Optional canonical copies per family
│   ├── technique/
│   ├── sensation/
│   ├── timing/
│   ├── psychological/
│   └── anatomy/
└── pilot/illustrations/          # A/B pilots (linked automatically)
    └── {concept-id}/{generator}.png

data/reference-renders.json       # Machine tracker (source of truth for ratification)
```

---

*See also: [`ASSET_EVALUATION.md`](./ASSET_EVALUATION.md) · [`PILOT_BATCH.md`](./prompts/PILOT_BATCH.md) · [`STYLE_BIBLE.md`](../design/STYLE_BIBLE.md) §10*
