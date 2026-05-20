# Gemini — Clinical prompts (guardrail-safe)

ChatGPT Thinking mode blocked **spreading**, **warmup-window**, and **clitoral-structure** for nudity/sexuality. Use these **clinical / health-literacy** framings in Gemini (Flash with image generation).

**Prefix:** `Create a square educational medical illustration for a health literacy app.`

**Always include:** textbook style, not erotic, no text/labels/watermarks, cream canvas `#F9F5F1`, fine etching, coral bioluminescent accents.

---

## spreading (sensation)

```
Create a square educational medical illustration for a health literacy app. Topic: whole-body sensory referral from pelvic nerve plexus.

Show a respectful sagittal pelvic anatomy diagram (textbook style, not erotic). From the pelvic nerve hub, draw golden bioluminescent ripple lines propagating along nerve pathways into thighs and lower abdomen — metaphor for sensation spreading beyond a contact point.

Style: Scientific Warmth — warm cream paper background #F9F5F1, fine etching lines, coral bioluminescent accents, gallery medical illustration quality. No text, labels, watermarks, or explicit sexual content.
```

---

## warmup-window (timing)

```
Create a square educational medical illustration for a health literacy app. Topic: vascular perfusion change during a 20-minute physiological warm-up phase.

Split-panel diagram of external genital anatomy (Gray's Anatomy textbook style, clinical, non-erotic). Left: resting state — pale tissue, minimal vascular fill. Right: post-warm-up — increased vascular perfusion shown as soft coral glow (not graphic).

Style: Scientific Warmth — cream canvas #F9F5F1, fine etching, bioluminescent accents. No text, labels, or watermarks.
```

---

## clitoral-structure (anatomy)

```
Create a square educational medical illustration for a health literacy app. Topic: internal architecture of the clitoral complex (glans, body, crura, vestibular bulbs) for urology/gynecology education.

3D anatomical rendering with accurate proportions; crura shown wrapping adjacent canal space. Wing-like bilateral symmetry metaphor. Pearlescent tissue, gallery medical quality, respectful and clinical.

Style: Scientific Warmth — cream canvas #F9F5F1, fine etching, coral accents. No text, labels, or watermarks. Not erotic.
```

---

## ChatGPT — pilot results (May 2026)

| Concept | Result | Notes |
|---------|--------|-------|
| angling | ✅ | Saved to `pilot/angling-chatgpt-images-2.png` (155 KB) — **verify zero in-image text** before swap |
| non-concordance | ✅ | Saved to `pilot/non-concordance-chatgpt-images-2.png` (221 KB) — review tone vs Scientific Warmth |
| spreading | ❌ guardrails | Use Gemini prompt above |
| warmup-window | ❌ guardrails | Use Gemini prompt above |
| clitoral-structure | ❌ guardrails | Use Gemini prompt above |

Save pilots to: `assets/images/concepts/illustrations/pilot/{concept}-gemini.png`

Promote after review: `npm run swap-pilot-winner -- {concept} gemini`  
(Or `chatgpt-images-2` for technique/psych pilots.)
