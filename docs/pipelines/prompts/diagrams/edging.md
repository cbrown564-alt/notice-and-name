# edging — Interactive diagram

**Caption:** Intensity rising toward a threshold, then receding  
**Category:** sensation  
**Mechanic:** Vertical drag — warmth rises in a soft vessel toward a glowing horizon; release and it recedes (approach & retreat).  
**States:** idle (ember) → building → approaching edge (~70%) → at threshold (~85%+) → receding on release  
**Reduce motion:** Frozen frame at ~80% threshold with caption context  
**Tokens:** passive (vessel etching) / active (threshold glow) / glow (bioluminescent fill + bloom) / sage base (grounding ember)  
**Do not:** rectangular gauges, ruler lines, numeric labels, alarm red, explicit anatomy, in-canvas caption text  

## Visual language

- **Vessel:** Soft chalice silhouette — organic sides, not a UI progress bar (Style Bible §2 sensation family).
- **Fill:** Bioluminescent tide with turbulence texture; curved meniscus surface, not flat block.
- **Threshold:** Glowing horizon arc with blur — the “edge,” not a mechanical red line.
- **Rest state:** Subtle sage ember glow at the base.

## Interaction (RN + iOS)

| Input | Behavior |
|-------|----------|
| Pan up | Intensity increases (clamped 0–1) |
| Release | Warmth springs back to ember level |
| Reduce Motion | Static frame at intensity 0.8, gestures off |

## Haptics

Light impact once when crossing into threshold zone (≥ 0.85).

## Accessibility

- `accessibilityLabel` = deck caption
- Announce "At threshold" and "Receding" sparingly on state change
