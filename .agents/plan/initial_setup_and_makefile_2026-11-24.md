# Plan: NVM Integration, Makefile & Initial SvelteKit Project Setup

**Date:** 2026-11-24  
**Feature Name:** `initial_setup_and_makefile`  
**Status:** Completed (Verified)

---

## 1. Feature Overview & User Story

### User Story

As a developer on the Bonsium project, I want a standardized Node environment managed via `nvm`, a robust `Makefile` with developer convenience commands, and a clean baseline SvelteKit project configured with TypeScript, Svelte 5, and Tailwind CSS so that the foundational structure is established for building interactive 3D biospheres and generative audio synthesis.

---

## 2. Environment & Tooling Architecture

### 2.1 Node & NVM Configuration

- **Target Node Version**: Node `v26.13.1` (or latest LTS), configured via `.nvmrc`.
- **NVM Integration in Makefile**:
  - `make` spawns a subshell per recipe line; `nvm` is a shell function sourced from `$NVM_DIR/nvm.sh`.
  - The `Makefile` will define an `NVM_EXEC` wrapper to execute any command in the context of the `.nvmrc` version.

### 2.2 Makefile Targets Specification

| Category         | Target             | Description                                                            |
| ---------------- | ------------------ | ---------------------------------------------------------------------- |
| **Help**         | `make help`        | Displays all targets with categorized explanations.                    |
| **NVM**          | `make nvm-install` | Installs the Node version specified in `.nvmrc`.                       |
|                  | `make nvm-use`     | Switches to the Node version specified in `.nvmrc`.                    |
|                  | `make nvm-env`     | Displays current Node, NPM, and NVM versions.                          |
|                  | `make nvm-which`   | Prints path of the resolved Node binary.                               |
| **Dependencies** | `make install`     | Installs npm dependencies using the active NVM environment.            |
|                  | `make clean`       | Removes `node_modules`, `.svelte-kit`, `build`, and cache directories. |
| **Development**  | `make dev`         | Starts SvelteKit dev server (`vite dev --host`).                       |
|                  | `make build`       | Builds the production bundle (`vite build`).                           |
|                  | `make preview`     | Serves the production build locally.                                   |
|                  | `make check`       | Runs Svelte compiler and TypeScript diagnostics (`svelte-check`).      |
|                  | `make format`      | Formats code with Prettier.                                            |
|                  | `make lint`        | Runs linter checks.                                                    |

---

## 3. SvelteKit Architecture & Project Structure

### 3.1 Framework & Core Dependencies

- **Framework**: SvelteKit (Svelte 5 runes: `$state`, `$derived`, `$effect`).
- **Language**: TypeScript (`strict: true`).
- **Styling**: Tailwind CSS + PostCSS (zen minimalist aesthetic, auto-hiding HUD styles).

### 3.2 Directory Hierarchy

```text
bonsium/
├── .agents/                    # Agent plans, states, and logs
│   ├── plan/
│   ├── state/
│   ├── logs/
│   └── template/
├── .nvmrc                      # Node version pin (26.13.1)
├── Makefile                    # NVM & Svelte orchestration recipes
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── app.html
│   ├── app.d.ts
│   ├── routes/
│   │   ├── +layout.svelte      # Global audio context & theme wrapper
│   │   └── +page.svelte        # Biosphere viewport & Zen HUD overlay
│   └── lib/
│       ├── audio/              # Generative audio engine & synths
│       │   ├── bus/            # AudioVisualEventBus
│       │   └── scales/         # Hirajoshi, Pentatonic, Lydian definitions
│       ├── scene/              # Three.js / Threlte 3D scene graphs
│       │   ├── biospheres/     # Bonsai, Terrarium, Aquarium, Plantarium
│       │   └── common/         # Camera, Lighting, Orbit Controls
│       ├── shaders/            # Custom GLSL shaders (water, glass, foliage)
│       ├── state/              # Svelte 5 reactive stores (world state, audio state)
│       └── components/         # Zen HUD UI components (volume, controls, selectors)
```

---

## 4. Audio-Visual Scaffolding Strategy

- **Audio Scaffolding**: Setup placeholder types for `AudioVisualEventBus` in `src/lib/audio/bus/event-bus.ts` so future biosphere components can emit strongly-typed visual events.
- **3D Scaffolding**: Placeholder canvas component ready for Threlte / Three.js canvas mounting with DPR clamping (`Math.min(devicePixelRatio, 2)`).

---

## 5. Performance Budget & Resource Disposal

- **DPR Clamping**: Configured in root canvas layout.
- **Bundle Footprint**: Scaffolding will rely on standard Vite chunks with tree-shaking enabled.
- **Audio Lifecycle**: Root layout will provide user-activation boundary to satisfy browser autoplay security policies.

---

## 6. Verification and Test Plan

1. **NVM Makefile Verification**:
   - Run `make nvm-env` and ensure correct Node (`v26.13.1`) and npm (`v11.20.0`) are detected.
   - Run `make help` to verify documentation output.
2. **SvelteKit Project Scaffolding Verification**:
   - Run `make install` to confirm clean dependency installation.
   - Run `make check` to ensure zero TypeScript / Svelte compilation errors.
   - Run `make build` to verify production Vite bundle generation succeeds.
3. **State & Log Update**:
   - Update `.agents/state/state.json` and append to `.agents/logs/2026-11-24.json`.
