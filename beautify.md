# Beautify — js/ folder

Goal: Normalize all `.js` files under `js/` to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

## Rules

- Single quotes for strings
- One declaration per `const`/`let` (no comma-separated)
- Arrow functions always wrap args in parens: `(x) =>`
- Space after keywords: `if (`, `for (`, `while (`
- Always use braces for `if`/`else`/`for`/`while`
- Space after commas in parameter lists and arrays
- Space inside `{ }` braces for object literals
- Space inside `[ ]` brackets for array literals
- Trailing commas on multiline objects, arrays, imports, exports
- No `var` — prefer `const`, use `let` only if reassigned
- No trailing whitespace
- One statement per line (break compound lines)
- `else` on same line: `} else {`
- No commented-out code blocks
- No `console.log` noise
- Prefer template literals over concatenation
- Default parameters last
- Named function expressions for inner functions
- Each file ends with a single newline
- No 1-2 letter variable/parameter/function names — renamed to human-readable

## Tracking

| File | Status | Notes |
|---|---|---|
| `game.js` | done | |
| `scene.js` | done | |
| `entities.js` | done | |
| `meshes.js` | done | |
| `factions.js` | done | |
| `input.js` | done | |
| `systems.js` | done | |
| `multiplayer.js` | done | |
| `hud.js` | done | |
| `model-upload.js` | done | |
| `terrain-upload.js` | done | |
| `mat-cache.js` | done | |
| `nodes-panel.js` | done | |
| `ecs.js` | done | |
