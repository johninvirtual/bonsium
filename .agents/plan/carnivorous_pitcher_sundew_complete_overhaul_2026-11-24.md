# Plan: Complete Architectural Overhaul of Carnivorous Pitcher & Sundew Terrarium

**Date:** 2026-11-24  
**Feature Name:** `carnivorous_pitcher_sundew_complete_overhaul`  
**Status:** Pending User Agreement

---

## 1. Feature Overview & Problem Statement

### Identified Defects from User Screenshot

In the current implementation of **Terrarium Variant 3: Carnivorous Pitcher & Sundew**:

1. **Truncated Severed Stem**: The central vine is a single green cylinder that abruptly terminates in mid-air with an exposed, unmodeled cut.
2. **Disconnected Mid-Air Pitchers**: Three crude red cylindrical cups hover in empty space with small wire stems that fail to connect to the central vine or any foliage.
3. **Missing Leaf Architecture**: Real _Nepenthes_ (tropical pitcher plants) develop pitchers at the tips of coiled tendrils extending from broad lanceolate leaves (_lamina_). The current model has **zero leaves**.
4. **Primitive Sundew Colony**: The _Drosera_ sundew consists only of a tiny cluster of orange cones sticking out of the substrate like toothpicks, lacking authentic glandular rosettes or glistening mucilage dew droplets.
5. **Flat Barren Substrate**: The substrate lacks the rich hummocky textures and colors of a real peat bog (_Sphagnum_ moss cushions and weathered bogwood).

---

## 2. 3D Visual Design, Geometry & Scene Hierarchy

### 2.1 Climbing Nepenthes Vine & Foliage Architecture (`terrarium-carnivorous.ts`)

- **Sinuous Climbing Vine**:
  - Continuous organic curve curving naturally upward toward the cloche ceiling, terminating in a delicate apical unfurling shoot/bud rather than a severed tube.
- **Glossy Lanceolate Lamina Leaves**:
  - 5 to 6 broad, arching, leathery leaves arranged in alternating spiral phyllotaxis around the climbing stem.
  - Created using smooth custom parametric/curved quad grids with a prominent sunken central midrib and graceful downward arching tips.
- **Gracefully Coiled Tendrils**:
  - Slender, continuous Catmull-Rom spline tubes extending from the midrib tip of each leaf, looping outward and downward into a natural pigtail curl that directly connects to each pitcher urn.
- **Anatomically Accurate Pitcher Urns (_Ascidia_)**:
  - **Lower Bulbous Chamber & Waisted Neck**: Formed via a smooth lathe profile with a swollen lower digestive reservoir that gently narrows into an elegant waist, then flares out to an oblique oval mouth.
  - **Fringed Frontal Wings (_Alae_)**: Dual longitudinal fins with delicate fringe tooth details running down the front face of each pitcher.
  - **Ribbed Recurved Peristome**: High-specular fluted collar ring surrounding the opening with fine radial ridges.
  - **Vaulted Rain Lid (_Operculum_)**: Concave protective hood arched over the peristome opening with an apical spur at the posterior hinge.
  - **Botanical Coloration**: Crimson/scarlet body with vibrant chartreuse-lime gradients around the peristome and lid, plus an inner glossy liquid surface.

### 2.2 Glistening Drosera Sundew Colony (_Drosera capensis_)

- **Basal Crown & Radiating Rosette**:
  - 18–24 arching linear-spathulate leaves radiating outward from a central basal core.
  - One or two leaves gently curled in a lifelike predatory reflex.
- **Glandular Hair Tentacles & Diamond Dew Droplets**:
  - High-density crimson glandular trichomes lining the upper surface and margin of each leaf.
  - Each tentacle tipped with an ultra-clear spherical mucilage droplet (`MeshPhysicalMaterial`, transmission: 0.95, roughness: 0.02) that sparkles under terrarium lighting.

### 2.3 Sphagnum Bog Substrate & Terrain

- **Living Hummocky Sphagnum Moss**:
  - Undulating golden-green, chartreuse, and burgundy bog moss cushions with organic surface displacement.
- **Weathered Bogwood Root**:
  - A gnarled miniature dark bogwood root nestled naturally into the peat.
- **Glass Vessel & Lighting**:
  - Blown-glass cloche with crystal finial loop and turned walnut hardwood base.
  - Rising humid morning mist particles and glistening dew highlights.

---

## 3. Generative Audio & Event Mapping

- **Scale & Tuning**: Japanese Insen / Inharmonic Pentatonic Glass Chimes (432Hz reference).
- **Interactive Audio**:
  - Orbiting/tossing: Modulates wetness of a high-passed glass resonance diffuser.
  - Resonate Tap: Generates a crystalline droplet chime with soft sub-harmonic pitch drop (evoking viscous bog water and dew drops).

---

## 4. Performance Budget & Resource Disposal

- **Draw Call Target**: $\le 38$ draw calls for the entire scene.
- **Geometry Optimization**: Shared materials for leaves, pitchers, tendrils, and dew droplets; geometry segments balanced for 60 FPS mobile rendering.
- **Strict Zero-Leak Disposal**: All geometries, textures, materials, and lights tracked in the `disposables` array and cleanly freed upon biosphere switch or component destruction.

---

## 5. Verification & Quality Checklist

1. `make check`: 0 TypeScript and Svelte diagnostic errors or warnings.
2. `make lint`: 100% Prettier formatting and ESLint conformance.
3. `make build`: Static site generation verified cleanly for GitHub Pages.
4. Visual verification: Completely eliminated severed stem and floating pitchers; full foliage, tendrils, anatomical urns, glistening sundew rosette, and living bog moss.
