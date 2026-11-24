# Plan: Expanded Variants, GitHub Pages, Radial Lotus, Terrarium Creatures & Top-Left HUD

**Date:** 2026-11-24  
**Feature Name:** `expanded_variants_github_pages_and_enhancements`  
**Status:** Completed (All 9 items implemented and verified)

---

## 1. Feature Overview & User Story

The user requested 9 concrete improvements to elevate Bonsium:

1. **Network Exposure for `make dev`**: Ensure `make dev` binds to `0.0.0.0` so the dev server can be accessed over the local Wi-Fi network from phones and tablets.
2. **GitHub Pages Deployment**: Transition build from `@sveltejs/adapter-auto` to `@sveltejs/adapter-static`, handle base path configuration for GitHub Pages repository hosting, set prerendering, and add a GitHub Actions deployment workflow.
3. **Radial Lotus Redesign**: Fix the petal rotation matrix and geometry in `plantarium.ts` so the lotus flower exhibits true radial symmetry in concentric tiers with interleaved petal angles and curved concave profiles.
4. **Terrarium Visual Polish**: Deepen the lushness and realism of the terrarium vessel, cork cap, substrate layering, ferns, and stones.
5. **Prominent Variant Selection in Top-Left**: Relocate the item information and variant switcher to the top-left corner of the viewport, making it immediately visible, tactile, and prominent while keeping the central 3D scene clear.
6. **First Variant Polish**: Enhance the quality, geometry, textures, and presence of the primary variant in each category (Pine Bonsai, Moss Terrarium, Freshwater Aquarium, Lotus Plantarium).
7. **Living Creatures in the Terrarium**: Introduce animated living miniature creatures (e.g., crawling garden snail with shell and eye stalks, plus glowing fireflies/moths with fluttering wings) inside the terrariums.
8. **3rd Variant for Each Category (12 Total Micro-Worlds)**:
   - **Bonsai #3:** Windswept Juniper Bonsai (_Fukinagashi_) with sculpted bleached driftwood (_Jin/Shari_) and trailing foliage.
   - **Terrarium #3:** Carnivorous Pitcher & Sundew Bog Terrarium (_Nepenthes_) with red-veined pitchers and glistening dew droplets.
   - **Aquarium #3:** Bioluminescent Moon Jellyfish Abyss with undulating translucent bells, floating marine snow, and deep pads.
   - **Plantarium #3:** Night-Blooming Cereus (_Queen of the Night_) with starburst spidery petals and glowing nocturnal spores.

---

## 2. 3D Visual Design, Shaders & Scene Hierarchy

### 2.1 Radial Lotus blossom (`plantarium.ts`)

- Build petal groups using radial orientation vectors:
  - For each tier $k \in \{0, 1, 2\}$, petal count $N_k$, angle $\theta_i = \frac{2\pi i}{N_k} + \text{offset}_k$.
  - Radially aligned coordinate frames: `lookAt` center point or `rotation.y = \theta_i` combined with localized radial tilt (`rotation.x = -\text{tilt}`).
  - Curvature: use smoothly curved petal geometry with concave profile and translucent two-tone gradient texture.
  - Golden pistil stamen core with radiating filament tips.

### 2.2 Terrarium Living Creatures (`terrarium.ts`, `terrarium-desert.ts`)

- **Procedural Miniature Garden Snail**:
  - Spiral coiled shell geometry (`TorusKnotGeometry` or concentric smoothed toroids) with brown/amber stripe banding.
  - Soft translucent snail foot sliding slowly along a mossy rock path.
  - Wiggling tentacle eye stalks moving gently in the humid air.
- **Luminescent Forest Fireflies / Fairies**:
  - Point-light / glow particle cluster hovering inside the glass dome with gentle fluttering flight paths and slow harmonic pulsing luminescence.

### 2.3 First Variant Enhancements

- **Pine Bonsai #1**: Enhanced trunk gnarling with Catmull-Rom spline variations, sculpted deadwood bark cracks, tiered multi-layered pine foliage pads (flat bottom, rounded cloud top), and unglazed clay pot with draining feet.
- **Moss Terrarium #1**: Richer moss varieties (cushion moss, fern moss, reindeer lichen), polished river stones, glistening quartz spikes, and dew condensation drops.
- **Freshwater Aquarium #1**: Flowing Vallisneria ribbons with progressive wave displacement, arching driftwood with java moss patches, and 5 distinct boid fish with natural schooling behavior.

### 2.4 New 3rd Variants (4 New Files)

1. `src/lib/scene/models/bonsai-juniper.ts`:
   - Drastic windswept trunk leaning horizontally.
   - Carved white deadwood _Shari_ running along the spine.
   - Deep emerald-cyan juniper pads clustered on the leeward side.
   - Rough slate slab rock base.
2. `src/lib/scene/models/terrarium-carnivorous.ts`:
   - Sphagnum bog moss and peat substrate.
   - Curved red-green Nepenthes pitcher tubes with translucent lids and digestive fluid level.
   - Sparkling Sundew rosette (_Drosera_) with glistening glandular hairs.
   - Bell-jar glass cloche.
3. `src/lib/scene/models/aquarium-jellyfish.ts`:
   - Deep obsidian cylinder tank with deep blue/indigo ambient lighting.
   - 3 procedural translucent Moon Jellyfish (_Aurelia aurita_) with pulsating umbrella bells and trailing oral tentacles.
   - Bioluminescent cyan/magenta edge glow.
   - Drifting marine snow particles.
4. `src/lib/scene/models/plantarium-cereus.ts`:
   - Night-blooming cereus with starburst spidery white petals, golden stamens, and dark violet succulent stems.
   - Deep indigo glazed pedestal dish.
   - Ethereal floating phosphorescent spore particles.

---

## 3. Audio Design, Musical Scales & Sound Signatures

Expand procedural audio triggers in `ProceduralAudioEngine` to support the new item sound profiles:

- **Juniper Bonsai (Windswept)**: Deep wood block temple strike + wind rush filter sweep in Japanese Hirajoshi.
- **Pitcher Bog Terrarium**: Soft droplet plops and resonant hollow wooden chime in Insen / Minor Pentatonic.
- **Jellyfish Abyss**: Sub-bass oceanic drone, resonant water chamber filter sweeps, and glass bell harmonics in Lydian / Dorian.
- **Night-Blooming Cereus**: Ethereal glass harmonica bell chords and ambient celestial pads in Akebono / Major Pentatonic.

---

## 4. Svelte Components, Top-Left HUD & State Integration

### 4.1 Top-Left HUD Redesign (`ZenHud.svelte`)

- Move the item info card and variant switcher to the **top-left corner**:
  - Prominent variant switcher pills right below the biosphere title: e.g. `[1. Pine] [2. Sakura] [3. Windswept]`.
  - Tactile active variant highlight with soft emerald glow.
  - Card is prominent yet structured with a clean collapsible description to never obstruct the central 3D world.
- Move brand / theme / audio controls cleanly to top-right and bottom dock.
- Keep bottom category dock streamlined: Bonsai, Terrarium, Aquarium, Plantarium with icons.

### 4.2 State Store (`world-state.svelte.ts`)

- Update `BIOSPHERE_ITEMS` to hold 3 items per category (12 total items).
- Ensure `activeItemIndex` persists per category or resets gracefully.
- Add sound trigger mapping for all 12 variants.

---

## 5. Network Dev Server & GitHub Pages Deployment

### 5.1 Network Exposure for `make dev`

- Update `vite.config.ts`:
  ```ts
  server: {
    host: true, // binds to 0.0.0.0
    port: 5173
  }
  ```
- Update `Makefile` and `package.json` dev scripts with `--host 0.0.0.0`.

### 5.2 GitHub Pages Configuration

- Install `@sveltejs/adapter-static`.
- Configure `vite.config.ts`:
  ```ts
  adapter: adapter({
  	pages: 'build',
  	assets: 'build',
  	fallback: '404.html',
  	precompress: false,
  	strict: true
  });
  ```
- Handle base path: `paths: { base: process.env.BASE_PATH || '' }` in `svelte.config.js` / SvelteKit config.
- Create `src/routes/+layout.ts` with:
  ```ts
  export const prerender = true;
  export const ssr = false;
  ```
- Create `.github/workflows/deploy.yml` for automated GitHub Pages build & deployment on push to `main`.

---

## 6. Performance Budget & Resource Disposal Strategy

- **Draw calls**: Target $\le 45$ active draw calls per scene using shared geometries and materials.
- **60 FPS Framerate**: Clamped DPR at $\min(\text{devicePixelRatio}, 2)$.
- **Zero Memory Leaks**: Explicit disposal of all Three.js geometries, materials, and textures in `dispose()` hooks when switching variants or biospheres.

---

## 7. Verification & Test Plan

1. **Dev Server Network Check**: Run `make dev` and verify binding to `0.0.0.0` with accessible Network URL.
2. **Type Check**: Run `make check` — expect 0 errors, 0 warnings.
3. **Lint & Formatting**: Run `make lint` and `make format` — expect 0 errors.
4. **Static Build**: Run `make build` — verify `@sveltejs/adapter-static` produces static files in `build/` with `404.html` and `index.html`.
5. **Interactive Verification**:
   - Verify all 12 variants load cleanly.
   - Verify radial symmetry of the lotus blossom from top, front, and perspective angles.
   - Verify terrarium snail crawling animation and firefly glow.
   - Verify prominent top-left variant selector and HUD responsiveness.
