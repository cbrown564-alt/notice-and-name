# edging — Interactive diagram

**Caption:** Intensity rising toward a threshold, then receding  
**Category:** sensation  
**Mechanic:** Vertical throttle — drag up to raise intensity toward a coral threshold line; release and intensity recedes (approach & retreat).  
**States:** idle (low) → building → approaching edge (~70%) → at threshold (~85%+) → receding on release  
**Reduce motion:** Frozen frame at ~80% threshold with caption context  
**Tokens:** passive (tank outline) / active (threshold line, fill peak) / glow (sensation near edge)  
**Do not:** numeric labels, alarm red, explicit anatomy, in-canvas caption text, gamified scoring  

## Layout

- Vertical tank (~100×220pt) centered on `conceptCanvas`
- Coral threshold line at 85% fill height
- Fill rises from bottom; glow blooms at fill top when near threshold

## Interaction (RN + iOS)

| Input | Behavior |
|-------|----------|
| Pan up | Intensity increases (clamped 0–1) |
| Release | Fill springs back to 0 (retreat) |
| Reduce Motion | Static frame at intensity 0.8, gestures off |

## Haptics

Light impact once when crossing into threshold zone (≥ 0.85).

## Accessibility

- `accessibilityLabel` = deck caption
- Announce "At threshold" and "Receding" sparingly on state change
