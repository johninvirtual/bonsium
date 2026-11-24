# Plan: Top-Right Info Panel, Favicon & Visual Polish of 3D Models

**Date:** 2026-11-24  
**Feature Name:** `info_top_right_favicon_and_model_visual_polish`  
**Status:** Completed (Verified 2026-11-24)

---

## 1. Feature Overview & User Requests

1. **Info Section Placement & UX**:
   - Current: Info modal pops up directly in the center of the viewport, covering the entire 3D model, with an awkward bottom scrollbar/overflow bar on mobile/landscape.
   - Target: Move the Info section to the **top-right corner** as a sleek, collapsible card/drawer. Can be easily toggled on/off, auto-collapses on tap outside or button press, and never obstructs the central 3D model.
2. **Favicon**:
   - Current: No favicon linked in `src/app.html`, `static/favicon.svg` missing.
   - Target: Create a high-res glowing emerald Zen bonsai/lotus SVG favicon in `static/favicon.svg` and link it in `src/app.html` with title and SEO meta tags.
3. **Model Visual Inspection & Polish (Peek via Browser Subagent)**:
   - Overhaul the incomplete **Carnivorous Pitcher & Sundew** terrarium (realistic climbing _Nepenthes_ vine, broad arching lamina leaves, coiled tendrils, winged pitcher urns with ribbed peristome and lid, glistening _Drosera_ sundew rosette with sticky clear mucilage droplets).
   - Overhaul the **Flowering Sakura Bonsai** (replace low-poly potato pink blobs with authentic branching cherry blossom twig pads, multi-layered fluttering petals, glazed celadon ceramic pot with drainage feet).
   - Use the **Browser Subagent** to navigate `http://localhost:5173`, inspect the live rendered canvas, capture screenshots, and verify visual quality across variants.

---

## 2. Technical Details & Component Architecture

### 2.1 ZenHud.svelte Top-Right Info Panel

- Add an explicit `Info` toggle button in the top-right header with clear icon and tooltip.
- Position the Info card in the top-right (`fixed top-14 right-3 sm:right-5 z-40 max-w-sm sm:max-w-md`).
- Smooth entry/exit transition with backdrop blur, rounded-2xl container, and zero modal backdrop blocking the 3D model.
- Click-outside detection to automatically hide the panel when the user interacts with the 3D scene.

### 2.2 Favicon & App Header

- Place polished SVG favicon in `static/favicon.svg` (crisp scalable vector of a meditative bonsai tree in glowing jade/emerald).
- Link in `src/app.html`: `<link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/favicon.svg" />`.
- Add `<title>` and OpenGraph tags.

### 2.3 3D Model Visual Overhauls

- `src/lib/scene/models/terrarium-carnivorous.ts`: Complete botanical _Nepenthes_ and _Drosera_ system.
- `src/lib/scene/models/bonsai-sakura.ts`: Authentic gnarled cherry blossom trunk, layered blossom clouds with realistic petal clusters, and glazed celadon pot.

### 2.4 Browser Subagent Verification

- Launch browser subagent (`Model: 'flash'`) on `http://localhost:5173`.
- Navigate between Bonsai, Terrarium, Aquarium, Plantarium.
- Verify UI responsiveness and visual aesthetics.

---

## 3. Verification & Governance

- `make check`: 0 errors, 0 warnings.
- `make lint`: 100% Prettier & ESLint passing.
- `make build`: Static site build verified.
- Update `.agents/state/state.json` and `.agents/logs/2026-11-24.json`.
