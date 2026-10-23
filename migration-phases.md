# Migration Plan: Unit & Building Selection Mechanics

> **Current Status**: **Phases 1-5 COMPLETE**. Selection foundation, visual feedback, prioritized box selection, context-aware interactions, and selection-driven HUD are fully implemented in `js/`. Fixed persistent team/selection rings on workers and soldiers. Focus has shifted to final Airbnb style guide alignment (Phase 6).

This document outlines the phases for migrating and refining the selection logic from `js.bak/` and `grimcraft-bak.html` into the current `js/` codebase, following the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

## Phase 1: Selection Foundation (`input.js`)
*   **Additive Selection**: Refine `doClickSelect` to handle Shift-click correctly for all entity types.
*   **Strategic Point Interaction**: Ensure Strategic Points are correctly picked and integrated into the selection flow (e.g., when a builder is selected).
*   **Selection Clearing**: Standardize `clearSelection` and `clearEnemySelection` to reset all visual states (rings, bars) across all entity types.

## Phase 2: Visual Feedback & Hitboxes (`meshes.js` & `scene.js`)
*   **Dynamic Hitboxes**: Implement the `HITBOX_SIZE` and `_hitboxDebug` logic for soldiers to ensure reliable picking.
*   **Selection Rings**:
    *   Standardize `selectionDisc` (torus) for units.
    *   Ensure `makeSquareSelRing` is used consistently for buildings and structures.
    *   Implement "Enemy Hover" rings (dimmer red) and "Enemy Target" rings (bright/pulsing).
*   **Targeting Pulse**: Implement the `_startTargetPulse` logic in `input.js` or a dedicated system to provide visual confirmation of focused attacks.

## Phase 3: Multi-Entity Box Selection (`input.js`)
*   **Projection Logic**: Standardize the 3D-to-2D projection helper for consistent screen-space box selection.
*   **Filter Prioritization**: Implement logic to prioritize certain types (e.g., units over buildings) when box-selecting mixed groups.
*   **Entity Coverage**: Ensure APCs, Jets, and Airfields are properly included in `doBoxSelect`.

## Phase 4: Context-Aware Interactions (`input.js`)
*   **Right-Click Orders**:
    *   **Units**: Attack-move vs. Direct-target (soldier vs. squad).
    *   **Builders**: Contextual Build/Repair/Capture based on target metadata.
    *   **APC/Jets**: Specific transport and flight orders.
*   **Rally Points**: Fully integrate `updateRallyMarker` and `clearRallyMarker` for Barracks and Airfields.

## Phase 5: Selection-Driven HUD (`hud.js`)
*   **Batch HUD Rendering**: Ensure `renderSquadHUD` and `renderBuildingHUD` handle multiple selections gracefully (e.g., "3 SQUADS SELECTED").
*   **Production Sync**: Display combined production queues and stats for multiple selected barracks/airfields.
*   **Action Buttons**: Dynamically generate action grids based on the union of capabilities in a multi-selection.

## Phase 6: Code Style & Quality
*   **Airbnb Refactoring**:
    *   Use `const` and `let` exclusively.
    *   Replace traditional `for` loops with `forEach`, `map`, `filter`, and `reduce`.
    *   Use arrow functions for all callbacks and anonymous functions.
    *   Implement proper destructuring for component data.
    *   Ensure consistent trailing commas and semicolon usage.
*   **Type Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`) when accessing ECS components.
