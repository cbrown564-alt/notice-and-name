# edging — Interactive diagram

**Caption:** Intensity rising toward a threshold, then receding  
**Category:** sensation  
**Mechanic:** Drag up to climb the **arousal curve** toward the crest (threshold); release and the glow recedes down the slope.  
**States:** idle (origin ember) → building → approaching edge (~70%) → at threshold (~85%+) → receding on release  
**Reduce motion:** Frozen frame at ~80% along the curve with caption context  
**Tokens:** passive (full curve etching) / active (trace + orb) / glow (bioluminescent climb)  
**Do not:** axis labels, numeric scale, chart chrome, explicit anatomy, in-canvas caption text  

## Visual language

- **Rise curve:** Cubic path bottom-left → top-right — simplified sexual response **build** phase (pairs with future Building / Plateauing diagrams).
- **Active trace:** Coral glow grows along the curve behind the traveler orb.
- **Threshold:** Soft ring at ~85% arc length — the “edge.”
- **After crest:** Faint **dashed** segment hinting the drop edging avoids — not interactive, no labels.

## Native iOS interaction

| Input | Behavior |
|-------|----------|
| Pan up | Intensity increases (orb climbs curve, clamped 0–1) |
| Release | Orb springs back toward origin |
| Reduce Motion | Static frame at intensity 0.8, gestures off |

## Haptics

Light impact once when crossing into threshold zone (≥ 0.85).

## Accessibility

- `accessibilityLabel` = deck caption
- Announce "At threshold" and "Receding" sparingly on state change
