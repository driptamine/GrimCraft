# Project Mandates

## File Protections
- **`grimcraft.html` is strictly READ-ONLY.** Under no circumstances should any CLI agent modify, overwrite, or delete this file. It is a critical legacy entry point that must remain untouched. Any requested changes involving game logic or entities should be performed in the modular JS files in the `js/` directory (e.g., `js/entities.js`, `js/systems.js`, etc.).
