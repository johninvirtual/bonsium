# Plan: Mobile UI Declutter & Real-World Inspired 3D Model Overhaul

**Date:** 2026-11-24  
**Feature Name:** `mobile_ui_and_realworld_3d_overhaul`  
**Status:** Completed (Verified 2026-11-24)

---

## 1. Feature Overview & User Story

Based on real device mobile testing (provided in user screenshots):

1. **Mobile UI is Cluttered & Overlapping**:
   - Top card is overly bulky and consumes ~30% of the screen.
   - Bottom dock stacks multiple heavy floating bars (category switcher + scale/sound bar), while the "Orbit • Zoom • Tap" hint overlaps and collides behind the bottom bar.
   - The central 3D model is squeezed into a narrow viewport window.
   - **Goal**: Clean, modern Zen mobile interface giving 85%+ screen real estate to the 3D model. Top header becomes a sleek compact navbar with clean variant pills. Bottom dock merges into a single slim floating bar. Info card becomes an elegant slide-over drawer / bottom sheet opened on demand. Remove overlapping hint text.

2. **3D Models Lack Real-World Fidelity**:
   - **Lotus Plantarium**: Current sunbeam is a harsh, solid triangular cone cutting across the screen; petals are rigid low-poly crystal facets; stem is a straight tube. Needs: Silky smooth, spoon-shaped cupped lotus petals with soft pink-to-white gradients, authentic flat-topped seed pod with radiating stamens, peltate veined leaves with dew droplets, natural stem curvature, and subtle atmospheric dust (remove harsh solid cone).
   - **Windswept Juniper Bonsai**: Current trunk is an untextured brown cylinder with a flat white painted streak and turquoise low-poly blobs. Needs: Sculpted twisting trunk with muscular sinewy bark grain, carved bleached ivory deadwood (_Shari/Jin_) integrated into the wood grain, layered scale-foliage juniper pads with fine needle texture, and natural stone slab pot.
   - **Moon Jellyfish Aquarium**: Current jellies look like solid opaque gumdrops with flat purple disks. Needs: Highly translucent bell material with Fresnel edge glow, horseshoe clover gonads with soft bioluminescence, delicate trailing frilly oral arms, and deep marine atmospheric fog with drifting marine snow.
   - **Terrarium**: Current moss looks like smooth cartoon green hemispheres; crystals look like plastic spikes; snail is barely visible. Needs: Multi-textured moss cushions with surface roughness and organic lichen clumps, lush miniature fern fronds, realistic succulent with thick fleshy cupped leaves with blush tips, transparent refractive bell glass cloche with rim bevels, and an articulated miniature snail with detailed shell.

---

## 2. 3D Visual Design & Real-World Overhaul

### 2.1 Sacred Lotus (`plantarium.ts`)

- **Sunbeam Rework**: Remove the hard ConeGeometry beam. Replace with soft atmospheric particle glow and subtle point-light illumination so the scene feels open, luminous, and natural.
- **Radial Spoon Petals**:
  - Replace rigid cone petals with curved, concave spoon petals created using smooth geometry (`ParametricGeometry` or sculpted curved spline surfaces with smooth normals and two-tone petal gradient).
  - 3 concentric tiers arranged in a natural opening bowl:
    - Inner bud petals (6) curving gently inward around the center.
    - Mid petals (8) cupping outward.
    - Outer petals (8) flared open gracefully.
- **Center Pistil Seed Receptacle**:
  - Flat-topped inverted conical seed pod (_torus_) with distinct seed apertures.
  - Ring of 24 delicate golden-yellow filament stamens radiating outward.
- **Broad Floating Lotus Pad**:
  - Natural circular leaf with a notched V-slit and gentle undulating rim.
  - Distinct central point with delicate radial leaf veins.
  - Hemispherical clear dew droplets with surface tension highlights.

### 2.2 Windswept Juniper Bonsai (`bonsai-juniper.ts`) & Pine Bonsai (`bonsai.ts`)

- **Trunk Geometry & Materials**:
  - Muscular, sinewy twisted trunk using varying radii Catmull-Rom tubes with bark grain texture.
  - Continuous carved deadwood _Shari_ running along the windward contour with bleached ivory/driftwood tones, twisting seamlessly with the live bark vein (_lifeline_).
  - Prominent wind-sculpted _Jin_ spikes at the apex.
- **Juniper Foliage Clouds**:
  - Replace low-poly spheres with layered, dense foliage pads formed of overlapping tufts with dark forest green centers and vibrant emerald/cyan tips.
  - Progressive windward reduction and leeward elongation.
- **Natural Slate Stone Base**:
  - Layered rock slab with weathered geological edges, soil mound with moss patches, and small accent stones.

### 2.3 Moon Jellyfish Aquarium (`aquarium-jellyfish.ts`)

- **Translucent Bell Hydrodynamics**:
  - Custom `MeshPhysicalMaterial` with high transmission (0.92), low roughness (0.05), soft cyan tint (`0x7dd3fc`), and subtle Fresnel edge glow.
  - True umbrella bell curvature with scalloped margin and delicate rim tentacle fringe.
  - 4 horseshoe-shaped gastric clover gonads with soft translucent magenta/violet bioluminescent glow.
  - 4 flowing, delicate, rippling oral arms trailing gracefully beneath the bell, swaying with swimming momentum.
- **Aquatic Environment**:
  - Deep gradient water column with soft caustic refraction and drifting marine snow.

### 2.4 Terrarium Polish (`terrarium.ts` & `terrarium-desert.ts`)

- **Glass Cloche**:
  - Refined cylindrical bell dome with smooth rim lip and turned wooden base plate.
- **Lush Botanical Flora**:
  - Velvet moss mounds with procedural surface bump, mini-fern leaflets, and fleshy succulent rosettes with pinkish-red leaf tips.
  - Polished river pebbles and natural quartz points.
- **Living Snail & Fireflies**:
  - Properly scaled, distinct snail shell with spiral whorls, foot, and eye stalks sliding along a moss rock.
  - Pulsing warm fireflies with soft light falloff.

---

## 3. UI/UX Declutter & Mobile Optimization (`ZenHud.svelte`)

### 3.1 Mobile Layout Rework

- **Eliminate Overlapping Elements**:
  - Remove the floating hint "Orbit • Zoom • Tap" that collides with the bottom bars.
  - Clean vertical separation so no HUD components ever overlap.
- **Top Bar (Sleek, Unobtrusive)**:
  - On mobile: A compact glass pill containing:
    - Brand dot & Biosphere title.
    - Prominent Variant Selector Pills: `[ 1 ] [ 2 ] [ 3 ]` (or short names `[ Pine ] [ Sakura ] [ Wind ]`) with active indicator.
    - Compact `Info` button (opens a slide-up sheet, never covering the 3D model by default).
    - Compact theme toggle (`☀️/🌙`) and mute button (`🔊/🔇`).
- **Bottom Bar (Single Unified Dock)**:
  - Consolidate category switcher and audio status into a **single, slim, horizontal floating dock**:
    - Icons with subtle labels: `🎋 Bonsai` `🪴 Terrarium` `🫧 Aquarium` `🌸 Plantarium`.
    - Integrated audio wave icon / volume popover so it doesn't need a separate stacked row on mobile.
- **Safe Area Insets**:
  - Add `pb-[env(safe-area-inset-bottom)]` and `pt-[env(safe-area-inset-top)]` so UI never collides with mobile notches, address bars, or home indicators.

---

## 4. Audio & State Continuity

- All 12 procedural sound profiles remain responsive, warm, and click-free.
- State store retains active variant index and category switching.

---

## 5. Performance Budget & Resource Disposal

- Framerate: 60 FPS maintained on mobile.
- Draw calls: $\le 45$ per micro-world.
- Memory: Explicit disposal of geometries, materials, and textures in `dispose()` hooks.

---

## 6. Verification & Test Plan

1. **Mobile Emulation Verification**: Test viewport at 390x844 (iPhone 14/15) and 412x915 (Android) to verify zero overlap, clean margins, and unobstructed 3D models.
2. **Visual Fidelity Verification**:
   - Inspect Lotus: radial symmetry, curved spoon petals, golden seed pod, no harsh solid cone.
   - Inspect Juniper: twisted muscular trunk, carved shari/jin deadwood, layered juniper clouds.
   - Inspect Jellyfish: translucent bells, clover gonads, flowing oral arms, deep oceanic atmosphere.
   - Inspect Terrarium: lush moss, distinct snail, clear refractive glass.
3. **Build & Quality Check**: Run `make check`, `make lint`, and `make build`.
