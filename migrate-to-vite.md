# Plan: Migrate to Vite (ESM Refactor)

This plan outlines the steps to migrate the "Grimcraft" RTS project from a classic global-script architecture to a modern ES Modules (ESM) architecture using Vite.

## Objective
- Enable fast development with Hot Module Replacement (HMR).
- Simplify asset management (models, textures, CSS).
- Solve CORS issues for 3D models via Vite's development server.
- Prepare the project for an optimized production build.

## Key Files & Context
- **`index.html`**: The main entry point (renamed from `grimcraft.html`).
- **`vite.config.js`**: Configuration for the Vite server and build pipeline.
- **`package.json`**: updated with Vite scripts and `npm` dependencies.
- **`js/*.js`**: All logic files will be refactored to use `export` and `import`.

## Implementation Steps

### Phase 1: Environment Setup
1.  **Rename Entry Point**: Rename `grimcraft.html` to `index.html`.
2.  **Configuration**: Create `vite.config.js` with basic server settings.
3.  **Dependencies**:
    - Update `package.json` scripts (`dev`, `build`, `preview`).
    - Ensure `babylonjs` and `babylonjs-loaders` are installed via npm.
    - Remove old `server.js` (Express) and its dependencies.

### Phase 2: ESM Refactor (The Module Shift)
This is the most significant part. Each file will be converted to a module:
1.  **`js/ecs.js`**: Export the `World` class.
2.  **`js/scene.js`**: 
    - Import `BABYLON` from `babylonjs`.
    - Export shared globals: `engine`, `scene`, `camera`, `PLAYER`, `ARENA`, etc.
3.  **`js/mat-cache.js`**: Export `getMat` and import `scene`.
4.  **`js/factions.js`**: Export `FACTIONS`, `factionContainers`, and `loadFactionModels`.
5.  **`js/meshes.js`**: Export all mesh factory functions (e.g., `makeSoldierMesh`).
6.  **`js/entities.js`**: Export entity creation functions (e.g., `createSquadEntity`).
7.  **`js/systems.js`**: Export all system functions.
8.  **`js/input.js`**: Export input initialization and handling.
9.  **`js/hud.js`**: Export HUD update logic.
10. **`js/multiplayer.js`**: Export networking components.
11. **`js/game.js`**: 
    - Act as the main entry point.
    - Import all dependencies.
    - Initialize the game loop.

### Phase 3: HTML & Assets
1.  **Update `index.html`**: 
    - Remove all separate `<script>` tags.
    - Add `<script type="module" src="/js/game.js"></script>`.
2.  **Asset Paths**: Ensure all paths to `models/*.glb` and `css/*.css` are relative to the root or handled by Vite.

## Verification & Testing
- Run `npm run dev` to start the development server.
- Verify the game loads at `http://localhost:3000` (or the Vite default port).
- Confirm all 3D models load correctly (solving the previous CORS issue).
- Test UI interactions (HUD, input, building) to ensure module links are correct.
- Verify the PWA manifest and Service Worker are correctly detected.

## Alternatives Considered
- **Stick with Express**: Simpler for a "quick fix" but lacks modern development features and optimizations for a growing codebase.
- **Vite without ESM (legacy)**: Possible but defeats the primary purpose of using Vite (speed and standard compliance).
