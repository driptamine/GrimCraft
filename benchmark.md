# Benchmark — merge draw calls (статика)

Мерж статических HQ/структур при загрузке: `src/merge-static.js`, хук в
`src/factions.js` (только HQ + структуры; пехота, техника и точки —
без изменений). Таблица ниже — analytic before/after по GLB-файлам,
перегенерируется скриптом:

```
node scripts/merge-benchmark.mjs
```

Метод: для каждой модели считаются видимые примитивы (точное правило
`hiddenNodes`: exact/`_inst_` + поддерево) — это before. After: по одному
вызову на материал со сливаемой геометрией + примитивы в анимированных
поддеревьях и скинированные (не мержатся, остаются как есть).
Мультиматериальные меши сплитятся по группам — как в рантайме.

## Сцена старта (8 HQ, по одному на позицию)

|  | before | after |
|---|---|---|
| 8 HQ | 494 | 42 (−91%) |

С тенями главный + теневой проходы: ~988 → ~84 вызовов на HQ.
Пехота пока не мержится: 13 вызовов на гвардейца как было.

## Все HQ/структуры загружаемого сета (84 модели)

| model | prims before | calls after | saved |
|---|---|---|---|
| Imperial Guard HQ | 180 | 6 | 97% |
| Imperial Guard / hq-anim | 180 | 6 | 97% |
| Imperial Guard / hq | 180 | 6 | 97% |
| Imperial Guard / mars_pattern | 172 | 6 | 97% |
| Imperial Guard / mechanized | 171 | 6 | 96% |
| Imperial Guard / infantry_command | 105 | 5 | 95% |
| Imperial Guard / tactica_control | 102 | 4 | 96% |
| Imperial Guard / turret | 99 | 4 | 96% |
| Imperial Guard / listening_post | 95 | 4 | 96% |
| Tau / tau_vehicle_building | 77 | 6 | 92% |
| Space Marines / orbital_relay | 63 | 4 | 94% |
| Space Marines HQ | 64 | 7 | 89% |
| Space Marines / command_hq | 64 | 7 | 89% |
| Necrons HQ | 58 | 4 | 93% |
| Necrons / monolith | 58 | 4 | 93% |
| Dark Eldar HQ | 57 | 4 | 93% |
| Chaos / listening_post | 54 | 4 | 93% |
| Space Marines / listening_post | 53 | 4 | 92% |
| Necrons / greater_summoning_core | 50 | 3 | 94% |
| Space Marines / barracks | 53 | 6 | 89% |
| Tau HQ | 51 | 5 | 90% |
| Tau / tau_hq | 51 | 5 | 90% |
| Tau / tau_shrine_of_purpose | 49 | 4 | 92% |
| Imperial Guard / plasma_generator | 49 | 5 | 90% |
| Orks HQ | 49 | 7 | 86% |
| Orks / settlement | 49 | 7 | 86% |
| Tau / tau_kroot_nest | 48 | 6 | 88% |
| Tau / tau_shrine_of_kauyon | 43 | 4 | 91% |
| Tau / tau_shrine_of_mont_ka | 43 | 4 | 91% |
| Tau / tau_plasma_generator | 41 | 4 | 90% |
| Tau / tau_research | 39 | 4 | 90% |
| Space Marines / armoury | 38 | 4 | 89% |
| Tau / tau_listening_post | 36 | 4 | 89% |
| Tau / tau_listening_post_sp | 36 | 4 | 89% |
| Space Marines / machine_cult | 36 | 5 | 86% |
| Space Marines / progenitor_temple | 33 | 4 | 88% |
| Tau / tau_barracks | 33 | 4 | 88% |
| Chaos / greater_sacrificial_circle | 30 | 2 | 93% |
| Chaos / machine_pit | 30 | 4 | 87% |
| Orks / waagh_banner | 30 | 5 | 83% |
| Eldar / aspect_portal | 28 | 3 | 89% |
| Chaos / chaos_temple | 25 | 4 | 84% |
| Tau / tau_thermoplasma_generator | 25 | 4 | 84% |
| Chaos / sacrificial_circle | 22 | 2 | 91% |
| Orks / listening_post | 21 | 3 | 86% |
| Chaos HQ | 22 | 4 | 82% |
| Chaos / desecrated_stronghold | 22 | 4 | 82% |
| Orks / mek_shop | 24 | 7 | 71% |
| Eldar / listening_post | 20 | 3 | 85% |
| Necrons / energy_core | 18 | 2 | 89% |
| Necrons / turret | 18 | 2 | 89% |
| Space Marines / plasma_generator | 20 | 4 | 80% |
| Necrons / thermoplasma_generator | 16 | 2 | 88% |
| Eldar / support_portal | 18 | 4 | 78% |
| Orks / pile_o_guns | 19 | 6 | 68% |
| Necrons / forbidden_archive | 15 | 2 | 87% |
| Chaos / armoury | 17 | 4 | 76% |
| Orks / bigger_generator | 17 | 5 | 71% |
| Orks / da_boyz_hut | 17 | 5 | 71% |
| Necrons / summoning_core | 14 | 2 | 86% |
| Orks / generator | 16 | 5 | 69% |
| Space Marines / thermo_plasma_generator | 15 | 4 | 73% |
| Tau / tau_build_crane | 13 | 2 | 85% |
| Eldar / advanced_warp_generator | 13 | 3 | 77% |
| Eldar / warp_generator | 13 | 3 | 77% |
| Eldar HQ | 13 | 5 | 62% |
| Eldar / webway_assembly | 13 | 5 | 62% |
| Eldar / soul_shrine | 10 | 3 | 70% |
| Eldar / webway_gate | 10 | 3 | 70% |
| Eldar / support_platform | 7 | 3 | 57% |
| Eldar / support_portal_ulthwe | 7 | 3 | 57% |
| Chaos / plasma_generator | 6 | 3 | 50% |
| Chaos / thermo_plasma_generator | 6 | 3 | 50% |
| Orks / land_mine | 1 | 1 | 0% |
| Imperial Guard / thermo_generator | ERR ENOENT: no such file or directory, open '/Users/driptamine/Desktop/TINKERING/tinkering-threejs/grimcraft-threejs/models/ig/structures/thermo_generator.glb' | | |
| Imperial Guard / mines | ERR ENOENT: no such file or directory, open '/Users/driptamine/Desktop/TINKERING/tinkering-threejs/grimcraft-threejs/models/ig/structures/land_mine.glb' | | |
| Necrons / listening_post | ERR ENOENT: no such file or directory, open '/Users/driptamine/Desktop/TINKERING/tinkering-threejs/grimcraft-threejs/models/necrons/structures/listening_post.glb' | | |
| Necrons / summoning_core_big | 14 | 2 | 86% |
| Chaos / chaos_icon | 11 | 3 | 73% |
| Necrons / plasma_generator | 8 | 2 | 75% |
| Necrons / obelisk | 6 | 2 | 67% |
| Chaos / land_mine | 1 | 1 | 0% |
| Space Marines / land_mine | 1 | 1 | 0% |
| Eldar / land_mine | 1 | 1 | 0% |
| **total 84 models** | **3332** | **321** | **90%** |

## Как проверить в игре

- Консоль при загрузке: `[FACTION] Merged <label>: <before> -> <after> meshes`;
  сводка доступна как `mergeStats` из `src/factions.js`.
- `renderer.info.render.calls` до/после (сравнить на одной и той же сцене).
- A/B тумблер: `?models=procedural` vs GLB; тиры `?quality=low|medium|high`.
- FPS-метр в TopBar.

## Дальше

- Пехота: мерж однообразных скинированных частей (13→3 на бойца) —
  требует склейки `skinIndex/skinWeight` и ребинда к скелету, пока не сделано.
- Техника пропущена сознательно (возможны кодовые повороты башен по именам узлов).
