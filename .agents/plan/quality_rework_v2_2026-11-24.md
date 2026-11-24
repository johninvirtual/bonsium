# Plan: Quality Rework — Audio, 3D Models, UI Responsiveness & Accessibility

**Date:** 2026-11-24  
**Feature Name:** `quality_rework_v2`  
**Status:** Completed (All 10 feedback items implemented and verified)

---

## Feedback Items & Resolution Map

### 1. Theme is for UI only, NOT the 3D models

- Remove all `isDark` parameter threading from model `update()` functions.
- 3D models keep their own natural artistic colors regardless of theme.
- 3D scene lighting stays at a neutral, well-lit baseline for both themes.
- Only the HTML/CSS UI surfaces (HUD, backgrounds, entry overlay) respond to light/dark/auto.

### 2. Sounds are ugly → Richer, warmer generative synthesis

- **ASMR Ambient Drone**: Rework to use warmer detuned unison oscillators with longer attack envelopes, gentler filter sweep range (200–500 Hz instead of harsh extremes), and softer pink noise.
- **Bonsai**: Longer sustain, rounder pluck with filtered harmonics (not raw triangle wave). Add subtle pitch vibrato.
- **Terrarium**: Softer glass bells with exponential decay envelopes, gentler droplet without jarring frequency jumps.
- **Aquarium**: Smoother, rounder bubbles with formant-like resonances rather than sharp sine sweeps. Slower ascent.
- **Plantarium**: Gentler sawtooth with lower resonance Q value, warmer filter sweep, and pad-like sustain.
- All instruments: Longer attack ramps (>20ms), slower decays, more reverb send, lower overall volume per voice.

### 3. Models are ugly → More refined geometry and materials

- **All models**: Better proportions, smoother curves (more segments), richer materials with appropriate roughness/metalness.
- **Bonsai**: More natural trunk curvature with varying thickness, denser and more organic foliage pads, moss-covered soil surface.
- **Terrarium**: Thicker visible glass walls, more varied moss clusters, additional small stones/pebbles, ferns as extra flora.
- **Aquarium**: More fish variety (5+ fish), proper tail geometry, aquatic plants (Vallisneria, Anubias), pebbled gravel floor, decorative driftwood.
- **Plantarium**: Smoother petal geometry using LatheGeometry, more natural color gradients, additional leaves, water ripple plane.

### 4. Z-fighting fixes

- Apply `polygonOffset` on coplanar materials (soil on pot, floor on base, pads on water surfaces).
- Offset overlapping geometries by small y amounts (0.001–0.01) rather than placing at exact same height.
- Use `renderOrder` where needed to enforce draw order for transparent surfaces.

### 5. Additional items per category

- Add a **second item** per category (totaling 8 items; more can follow in future iterations):
  - **Bonsai #2**: Sakura Cherry Blossom Bonsai (flowering variant with pink petals)
  - **Terrarium #2**: Desert Succulent Terrarium (sandy substrate, varied succulents, warm tones)
  - **Aquarium #2**: Coral Reef Lagoon (coral formations, anemones, clownfish, sea plants)
  - **Plantarium #2**: Fern Canopy (hanging basket with cascading ferns, dripping water particles)

### 6. Aquarium needs water plants & decorations

- Add procedural Vallisneria (tall grass-like aquatic plants swaying gently).
- Add a small driftwood/branch piece on the floor.
- Add scattered pebbles/gravel across the tank floor.
- More fish (5 fish with varied colors and swim patterns).

### 7. Make it more lively

- Increase particle counts where appropriate.
- Add gentle continuous ambient motion: slow world rotation, breathing scale pulses.
- Fish school with slight randomized acceleration/deceleration.
- Foliage has subtle continuous wind oscillation.
- Bubbles have varied sizes and wobble frequencies.
- Spore/mist particles have turbulent drifting paths.
- Add subtle floating dust motes in the sunbeam (Plantarium).

### 8. UI should not hinder 3D on mobile / lower resolutions

- **Responsive HUD redesign**:
  - On mobile (<640px): Compact bottom-only dock with minimal footprint; item card hidden by default.
  - Category switcher: icon-only on mobile, icon+text on desktop.
  - Theme toggle: collapsed into a single cycle button on mobile.
  - Audio controls: compact single-row on mobile.
  - Top header: smaller, auto-fading after 3 seconds of inactivity.
- Ensure HUD panels use `pointer-events-none` on containers so touches pass through to 3D canvas.

### 9. Zoom support (scroll/pinch)

- Add `wheel` event listener on 3D canvas for scroll-to-zoom.
- Add pinch gesture detection for mobile zoom.
- Camera distance range: min 3.0, max 9.0 (default 5.2).
- Smooth interpolation on zoom with damping.

### 10. Accessibility review

- Ensure all interactive elements have visible focus indicators.
- Proper `aria-label` on all buttons, sliders, and navigation elements.
- Keyboard navigation: Tab through HUD elements, Enter/Space to activate.
- Reduced-motion support: Check `prefers-reduced-motion` and disable particle animations, slow rotation, and breathing pulse if set.
- Screen reader announcements for biosphere/theme changes via `aria-live` region.
- Sufficient color contrast ratios for all text in both light and dark themes.
- Volume slider has proper `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.

---

## Implementation Strategy

This is a large rework (~2100 lines across 8 files). Work will be parallelized:

1. **Audio Engine Rework** — Richer, warmer synthesis with better envelopes
2. **3D Model Rework** — All 4 existing models + 4 new items + z-fighting + liveliness
3. **UI/UX Rework** — Responsive HUD, zoom, accessibility, theme decoupling from models
4. **Integration & Verification** — `make check`, `make lint`, `make build`

---

## Verification Plan

1. `make check`: 0 errors, 0 warnings.
2. `make lint`: 0 errors.
3. `make build`: Clean production bundle.
4. Manual check: Theme toggle only affects UI surfaces, not 3D models.
5. Manual check: Audio sounds warm and pleasant, not harsh.
6. Manual check: Models are proportionate with no z-fighting.
7. Manual check: Mobile viewport shows full 3D model with minimal HUD obstruction.
8. Manual check: Scroll/pinch zoom works within bounds.
9. Manual check: Tab navigation and screen reader output are correct.
