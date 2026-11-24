# Bonsium - Agent Guidelines & Engineering Standards

## 1. Project Overview & Vision

**Bonsium** is an interactive, meditative 3D audiovisual web platform that brings miniature, living botanical and aquatic worlds to life:

- **Bonsai**: Contemplative miniature trees with procedural growth, pruning mechanics, wind physics, and resonant wooden/koto harmonies.
- **Terrarium**: Enclosed glass biomes featuring moss, succulents, condensation, mist particles, and crystal/glass acoustic harmonics.
- **Aquarium**: Aquatic biospheres with fluid dynamics, caustic lighting, schooling fish (boids), air bubblers, and submerged low-pass ambient pads.
- **Plantarium**: Blooming botanical gardens, photosynthesis light beams, kinetic growth, and uplifting generative chord progressions.

The core essence of Bonsium is the **seamless harmony between real-time 3D visuals and generative, responsive music**. Every user interaction (touch, click, drag, orbit, prune, water, light shift) produces both visual changes and harmonious musical evolution.

---

## 2. Core Tech Stack

- **Framework**: Svelte with SvelteKit (Svelte 5 runes `$state`, `$derived`, `$effect` for lightweight, high-performance UI overlays).
- **Language**: TypeScript (strict mode throughout; strict typing for audio parameters, 3D events, and math vectors).
- **3D Graphics & Shaders**:
  - **Three.js** with **Threlte** (declarative Svelte wrapper for Three.js scene graphs).
  - Custom **GLSL Shaders**: Water surface waves, caustics, glass refraction/translucency, foliage wind oscillation, and subsurface scattering.
  - Post-Processing: Subtle bloom, depth of field, and ambient occlusion.
- **Generative Audio & Sound Design**:
  - **Tone.js** & Native **Web Audio API**.
  - Procedural music generation: Ambient drone generators, scale quantizers (Japanese Hirajoshi, Pentatonic, Lydian), algorithmic chord progressions, and procedural envelope synthesis.
  - Interactive acoustic triggers: Real-time sonification of user actions (pruning snips, water droplet chimes, resonant glass rings).
  - Spatial Audio: 3D audio panners attached to moving visual elements (e.g. fish, droplets, insects).
- **UI & Styling**: Tailwind CSS (minimalist Zen HUD; auto-hiding during passive contemplation; accessible audio & visual controls).

---

## 3. Core Architectural Principles

### 3.1 Audiovisual Decoupling (Event Bus Pattern)

- The 3D scene and the audio engine must **never** be tightly coupled.
- Communication between visual interactions and sound synthesis happens through a strongly-typed, reactive event bus (`AudioVisualEventBus`):
  - **Visual events emitted**: `BRANCH_PRUNED`, `WATER_RIPPLED`, `GLASS_TAPPED`, `DROPLET_FALLEN`, `SUNLIGHT_CHANGED`, `BIOSPHERE_CHANGED`.
  - **Audio reactions**: The audio engine maps these events to pitch triggers, filter cutoffs, reverb modulations, or rhythm adjustments.

### 3.2 Resource Lifecycle & Zero-Leak Memory Management

- Switching between biospheres (e.g., from Terrarium to Aquarium) must completely purge previous GPU and audio assets:
  - **Three.js Disposal**: Traverse scene graphs and explicitly call `.dispose()` on all geometries, materials, textures, and render targets.
  - **Audio Node Disposal**: Stop scheduled events, cancel Transport timelines, disconnect audio nodes, and `.dispose()` Tone.js synths/effects to prevent audio glitches and memory leaks.

### 3.3 Audio Autoplay & Web Audio Resilience

- Adhere strictly to browser audio autoplay policies: Web Audio contexts initialize in a `suspended` state.
- Provide a graceful, atmospheric "Enter Experience" or initial tap prompt to resume the `AudioContext`.
- Always use smooth gain ramping (`linearRampToValueAtTime` / `exponentialRampToValueAtTime`) on all audio triggers to completely eliminate audible clicks and pops.

### 3.4 60 FPS Performance Budgets

- **Framerate Target**: Solid 60 FPS on standard modern laptops and mobile devices.
- **Device Pixel Ratio (DPR)**: Clamp DPR via `Math.min(window.devicePixelRatio, 2)` to prevent mobile GPU thermal throttling.
- **Draw Call Budget**: Keep active draw calls under 50 per micro-world scene using `InstancedMesh` for foliage, pebbles, fish, and rain particles.
- **Asset Optimization**: Use glTF/GLB with Draco/Meshopt compression; favor procedural generation (L-systems, parametric meshes) where practical.

---

## 4. Biosphere Modules & Sonic Profiles

| Biosphere      | Visual Identity & Shaders                                                         | Musical Scale & Instrument Palette                                                     | Interactive Gestures                                                             |
| -------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Bonsai**     | Gnarled trunk, cherry blossom / pine pads, drifting petals, ceramic dish          | Hirajoshi scale; koto plucks, bamboo flutes, wooden temple blocks, ambient wind        | Pruning branches, wiring/bending, seasonal foliage shift, wind breeze adjust     |
| **Terrarium**  | Glass vessel refraction, layered soil/gravel, moss clusters, humidity mist        | Pentatonic scale; glass marimba, soft rain droplets, crystal chimes, airy pad          | Tapping jar, misting/humidity slider, rotatable viewing turntable                |
| **Aquarium**   | Caustic floor lighting, undulating water surface, schooling fish (boids), bubbles | Dorian / Lydian modal scales; submerged low-pass synth pads, crystalline bubble plucks | Water ripples on touch, fish feeding, aerator bubbler toggle, current flow speed |
| **Plantarium** | Blooming petals, creeping vines, sunlight god rays, spore particles               | Major Pentatonic / Lydian; warm analog pads, rising arpeggios, organic bell tones      | Sunlight angle/intensity control, watering growth accelerator, seed planting     |

---

## 5. Agent Development Rules

- **High Code Quality**: Maintain clear separation between Svelte UI components, Threlte scene graphs, GLSL shaders, and audio synthesis services. Write self-documenting TypeScript with strict interfaces.
- **Test for Hidden Bugs**:
  - Handle WebGL context loss (`webglcontextlost` and `webglcontextrestored`).
  - Guard against audio buffer underruns and audio context suspension state changes.
  - Test responsive canvas resizing and orientation changes across desktop and mobile.
  - Prevent touch gesture collision between 3D orbit controls and UI elements.
- **Clarify Before Assuming**:
  - Always clarify with the user regarding aesthetic style (e.g. low-poly vs stylized realism vs cel-shaded), audio scales, complex interaction mechanics, or third-party dependencies before implementation.

---

## 6. Logs, State & Planning Governance

### 6.1 Plan Protocol (`.agents/plan/{feature_name}_{date}.md`)

- **Always create and agree on a plan before making code changes.**
- Every plan must specify:
  1. Feature overview and user story.
  2. 3D visual design, shaders, and scene hierarchy.
  3. Audio design, musical scales, synth patches, and event triggers.
  4. Svelte components and state integration.
  5. Performance budget & resource disposal strategy.
  6. Verification and test plan (WebGL + Audio).
- **The plan must be agreed upon by the user before executing code changes.**

### 6.2 State Management (`.agents/state/state.json`)

- Maintain persistent project status in `.agents/state/state.json`.
- Adhere to the standard format defined in `.agents/template/state.template`.
- Tracks:
  - Active biosphere and implemented features.
  - Graphics settings (DPR, shadows, post-processing).
  - Audio settings (master volume, active scale, tempo, state).
  - Open technical debt and performance benchmarks.

### 6.3 Logging Protocol (`.agents/logs/{date}.json`)

- Maintain chronological records of agent/user decisions in `.agents/logs/{date}.json`.
- Adhere to the standard format defined in `.agents/template/log.template`.
- Captures:
  - Architecture and design decisions.
  - Audio tuning and musical scale selections.
  - User agreements and confirmations.
  - Bug fixes and performance profiling results.
- Logs are append-only and read only when troubleshooting past decisions.
