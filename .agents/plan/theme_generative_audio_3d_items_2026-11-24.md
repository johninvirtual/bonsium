# Plan: Light/Dark/Auto Theming, Generative ASMR Audio & Procedural 3D Biospheres

**Date:** 2026-11-24  
**Feature Name:** `theme_generative_audio_3d_items`  
**Status:** Completed (Verified)

---

## 1. Feature Overview & User Story

### User Story

As a user visiting Bonsium, I want a calming, meditative, ASMR audiovisual experience where:

1. I can switch seamlessly between a fresh greeny Light mode (porcelain white with subtle emerald accents and gentle borders), a true black Dark mode (with vibrant neon-emerald accents and bioluminescent glows), or Auto (following system preference).
2. The site features continuous, rich, 100% procedural generative ambient music (ASMR drones/pads) without relying on any audio files.
3. Every biosphere category (Bonsai, Terrarium, Aquarium, Plantarium) has a dedicated procedurally generated 3D item with its own unique procedural sound signature and smooth, click-free audio transitions.
4. I have an intuitive, Zen-like HUD to select categories, toggle items, adjust ambient sound, and enter a distraction-free contemplation mode.

---

## 2. Visual Design & Theme System (Light, Dark, Auto)

### 2.1 Color Palette & Contrast

- **Theme Modes**: `'light' | 'dark' | 'auto'`, persisted in `localStorage` and synchronized with `prefers-color-scheme`.
- **Global Transition**: `transition-colors duration-700 ease-in-out` on root container, surfaces, text, and SVG icons.
- **Light Theme**:
  - Background: Soft porcelain / morning dew white (`#fbfdfb` with subtle radial gradient to `#f0f5f1`).
  - Glass Surfaces: High-translucency white frosted glass (`rgba(255, 255, 255, 0.75)` with `backdrop-blur-md`).
  - Borders: Whisper-thin fresh herbal green (`rgba(16, 185, 129, 0.2)`).
  - Accents: Fresh emerald & sage green (`#10b981`, `#059669`).
  - Contextual Highlights: Subtle sakura blossom pink (`#f472b6`) for Bonsai, amber moss gold (`#fbbf24`) for Terrarium, cyan dew (`#06b6d4`) for Aquarium, solar warmth (`#eab308`) for Plantarium.
  - Text: Deep earthy graphite / forest charcoal (`#19241e`, `#374151`).
  - Shadows: Soft organic emerald-tinted diffusion (`rgba(16, 185, 129, 0.08)`).
- **Dark Theme**:
  - Background: True void black (`#000000` to `#050906`).
  - Glass Surfaces: Obsidian dark glass (`rgba(10, 16, 12, 0.7)` with `backdrop-blur-md`).
  - Borders: Luminescent neon emerald border (`rgba(0, 255, 136, 0.25)`).
  - Accents: Bioluminescent neon spring green (`#00ff88`, `#10b981`).
  - Contextual Highlights: Radiant neon pink, warm ember amber, luminous deep cyan, and golden solar aura.
  - Text: High-clarity mint/white (`#f0fdf4`) and muted luminous sage (`#86efac`).
  - Glows: Ambient neon green edge flares and subtle box-shadow auras.

### 2.2 3D Lighting Adaptation

- The Three.js scene ambient and directional lights dynamically shift intensity and color balance based on active theme:
  - **Light mode**: Crisp soft white skylight + gentle directional sunlight producing soft shadows.
  - **Dark mode**: Deep moody ambient light + high-contrast neon rim lights and point lights illuminating the procedural items from within.

---

## 3. Procedural 3D Visuals & Shaders (One Item per Category)

All 3D assets will be created **strictly via code** using Three.js (no external 3D model files or image textures):

### 3.1 Item 1: Contemplative Pine Bonsai (Category: `bonsai`)

- **Pot**: Procedural ceramic pot geometry with glazed earthenware material.
- **Trunk & Branches**: Gnarled wood structure generated via parametric spline curves with procedural wood grain texture generated on an offscreen HTML5 canvas.
- **Foliage Clouds**: Clustered soft pine needle clusters with custom vertex sway shader responding to a simulated gentle breeze.
- **Particles**: Subtle falling cherry blossom / autumn leaf particles drifting in wind.

### 3.2 Item 2: Crystal Moss Terrarium (Category: `terrarium`)

- **Glass Vessel**: Procedural LatheGeometry glass jar/dome with high transmission, smooth specular reflections, and chromatic refraction.
- **Geological Substrate**: Layered discs of white pebbles, black activated charcoal, and rich dark humus.
- **Flora**: Procedural velvet moss mounds (noise-perturbed hemispheres) with a central rosette succulent.
- **Condensation & Mist**: Floating rising moisture particles inside the glass vessel.

### 3.3 Item 3: Bioluminescent Boid Aquarium (Category: `aquarium`)

- **Vessel**: Minimalist water cylinder tank with refractive glass borders and animated caustic floor plane.
- **Water Surface**: Animated wavy water plane with subtle sine wave oscillation.
- **Aquatic Life**: Procedural schooling neon fish (tail-wagging geometry animated via sinusoidal mesh deformation) navigating around the tank.
- **Aerator Bubbles**: Rising translucent air bubbles with procedural wobble and popping scale reduction.

### 3.4 Item 4: Radiant Lotus Plantarium (Category: `plantarium`)

- **Flora**: Multi-layered procedural lotus flower with opening/closing breathing petal tiers.
- **Stem & Leaves**: Arching parametric stem with fleshy lily pads resting on the base.
- **Sunlight Shaft**: Semi-transparent volumetric god-ray cone shining down on the bloom.
- **Spore Shimmer**: Orbiting glowing golden spore particles with Brownian turbulence.

### 3.5 Interactive 3D Canvas

- Smooth mouse parallax and orbital rotation with damping.
- Click raycasting: clicking on any procedural model triggers a physical pulse/wobble animation and emits an audio-visual interaction event.

---

## 4. Generative Audio Design (100% Code-Synthesized)

Zero audio files will be used. A complete, high-fidelity procedural synthesis engine will be built with the native Web Audio API:

### 4.1 Master Audio Bus Architecture

- **AudioContext**: Initialized upon user tap ("Begin Contemplation").
- **Master Chain**: Master Gain $\to$ DynamicsCompressorNode (transparent soft brickwall limiter preventing any clipping) $\to$ Destination.
- **Lush Algorithmic Reverb**: Algorithmic impulse response buffer generating a smooth 2.8s exponential decay stereo reverb simulating an open atrium / greenhouse.
- **Stereo Ping-Pong Delay**: Subtle spatial feedback delay line with lowpass filtering.

### 4.2 Home Screen Ambient ASMR Pad / Drone

- Multi-oscillator harmonic chord (Root, 5th, Octave, 9th) centered around 432 Hz tuning.
- Slow LFO modulation (0.08 Hz) sweeping a dual-pole biquad lowpass filter (220 Hz to 680 Hz), mimicking natural slow breathing.
- Filtered pink/brown ASMR noise generator providing a subtle texture of warm atmospheric wind.

### 4.3 Category & Item Sonic Profiles

| Category / Item                  | Instrument Patch & Synthesis Method                                                                                                            | Musical Scale & Frequencies                          | Interactive Gesture Trigger                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Bonsai** (_Pine_)              | Plucked wooden string (Karplus-Strong physical modeling / triangle plucked decay with wooden body resonance).                                  | Japanese **Hirajoshi** scale (`C, Db, F, G, Ab`).    | Branch prune / pluck: crisp koto resonance with subtle pitch bend.                |
| **Terrarium** (_Moss Dome_)      | Glass Marimba & Crystalline Bells: Dual sine oscillators with inharmonic crystal ratios (1.0, 2.76, 5.4).                                      | **Pentatonic Minor** (`A, C, D, E, G`).              | Glass tap: bright crystal ping with water droplet frequency drop ($f_0 \to f_1$). |
| **Aquarium** (_Boid Reef_)       | Submerged Low-pass Bubble Synth: Modulated sine wave with rapid ascending frequency sweep ($130 \to 420 \text{ Hz}$) + watery resonant filter. | **Dorian** modal scale (`D, E, F, G, A, B, C`).      | Water ripple / feed: fluid bubble cluster with spatial stereo panning.            |
| **Plantarium** (_Radiant Lotus_) | Warm Analog Bloom Synth: Soft sawtooth passed through a resonant 24dB ladder lowpass filter with slow envelope sweep + high-frequency shimmer. | **Major Pentatonic / Lydian** (`G, A, B, D, E, F#`). | Petal touch: rising harmonic chime chord and golden bell sprinkle.                |

### 4.4 Smooth Transitions

- Equal-power crossfades between categories over 1.5 seconds (`exponentialRampToValueAtTime`).
- Zero audible clicks or pops via calibrated attack and release ramps ($> 15 \text{ ms}$).

---

## 5. UI & State Integration

### 5.1 Svelte Components Architecture

- `src/lib/components/ZenHud.svelte`:
  - **Category Switcher**: Elegant top/bottom pill dock with clean category icons and active status indicator.
  - **Item Carousel / Card**: Displays active item name, lore, scale, and sound wave visualizer.
  - **Theme Switcher**: Segmented toggle for Light ☀️, Dark 🌙, and Auto ⚙️ modes.
  - **Audio Controls**: Mute toggle, master volume slider, and ASMR drone level.
  - **Contemplation Mode**: "Breathe" toggle to hide HUD for pure visual and acoustic meditation.
- `src/lib/scene/Canvas3D.svelte`:
  - Three.js WebGL canvas mounting, window resizing, DPR clamping (`Math.min(devicePixelRatio, 2)`).
  - Item switching with automatic scene graph disposal.
  - Smooth camera animation and interaction raycaster.

### 5.2 State Store (`world-state.svelte.ts`)

- Reactive Svelte 5 runes for:
  - `theme`: `'light' | 'dark' | 'auto'`
  - `activeThemeActual`: `'light' | 'dark'` (resolved from system if auto)
  - `activeBiosphere`: `'bonsai' | 'terrarium' | 'aquarium' | 'plantarium'`
  - `isAudioInitialized`, `isMuted`, `masterVolume`, `hudVisible`, `breatheMode`

---

## 6. Performance Budget & Resource Disposal

- **Three.js Disposal**: Complete traversal and `.dispose()` of geometries, materials, and canvas textures when switching biospheres or unmounting.
- **Audio Lifecycle**: Disconnecting and ramping down oscillator nodes when transitioning; zero dangling Web Audio nodes.
- **Framerate Target**: Solid 60 FPS with DPR clamped to 2.
- **Draw Calls**: Kept under 40 per scene using procedural geometries and instanced particles.

---

## 7. Verification & Test Plan

1. **Dependencies**: Install `three` and `@types/three`.
2. **Type Checking & Code Quality**:
   - Run `make check`: 0 errors.
   - Run `make lint`: 0 errors.
   - Run `make build`: Verify successful production bundle.
3. **Theming Verification**:
   - Test Light mode: Clean white with fresh subtle green borders.
   - Test Dark mode: True black with neon green accents and glows.
   - Test Auto mode: Properly responds to OS color scheme changes.
   - Verify smooth 700ms theme transition.
4. **Audio Verification**:
   - Verify initial "Begin Contemplation" unlocks Web Audio context cleanly.
   - Verify ASMR home ambient pad drone plays smoothly without clipping.
   - Verify switching categories crossfades generative patches seamlessly.
   - Verify interaction triggers (clicking 3D models or HUD buttons) generate harmonic chimes.
5. **3D Visuals Verification**:
   - Verify all 4 procedural items render cleanly with lighting and procedural textures.
   - Verify camera orbit and mouse parallax respond smoothly.
