# FPS / Производительность — план оптимизации

## Диагноз (что найдено в коде)

Главный подозреваемый — **количество draw calls от фрагментированных GLB**, а не солдаты.

`GLTFLoader` создаёт отдельный `THREE.Mesh` на каждый примитив, а three.js их **не мерджит** — значит одна база = ~180 draw calls.

| модель | примитивов (= draw calls) | материалов |
|---|---|---|
| `models/ig/structures/hq.glb` | **181** | 5 |
| `models/dark eldar/infantry/raider.glb` | **304** | 12 |
| `models/ig/infantry/guardsmen.glb` | **21** | 2 |
| все `models/` (303 файла) | **7162** | — |

Прочие факторы:
- **Тени**: каждый под-меш помечен `castShadow` (`src/scene.js:807-822`, `src/meshes.js:296-302`), при `PCFSoftShadowMap` теневой проход удваивает draw calls + скиннинг.
- **CPU**: `findClosestEnemySoldier` — O(отряды×солдаты) с `distanceTo` (sqrt) на каждый отряд каждый кадр (`src/systems.js:116, 532, 535`).
- **Миксеры**: по одному `AnimationMixer` + `Skeleton.update` на каждого солдата (`src/gltf-models.js:223-245`).
- `SQUAD_MAX = 13` (`src/scene.js:46`), отряды спавнятся по карте.

## План

### Шаг 1 — Измерить (обязательно первым)
- A/B через существующий тумблер: `?models=procedural` (`src/model-source.js:56`, ветка в `src/game.js:184`). Если FPS резко падает с GLB — виноваты draw calls.
- Проверить `?quality=low` (`src/scene.js:686-699`): отключает тени, dpr>1, MSAA.
- Вывести `renderer.info.render.calls/.triangles` в TopBar (FPS-метр уже есть — `src/hud/store.js:65`, `src/hud/components/TopBar.jsx:92`).
- Profiler Chrome / Spector.js: разложить кадр на JS / shadow pass / главный pass.

### Шаг 2 — Быстрые победы, низкий риск
- Пехота: убрать `castShadow` у мелких/скрытых под-мешей, уменьшить `shadow.mapSize`/фрустум (`src/scene.js:795-802`), либо отдать пехоте blob-тень (уже есть, `src/meshes.js:475`) и отключить реальную тень.
- Убедиться, что merged/skinned меши корректно cull'ятся по фрустуму.

### Шаг 3 — Главная победа: мердж draw calls
- **Статика без скина** (структуры, техника): мерджить при загрузке по материалу через `mergeGeometries` (уже применяется в `src/sgb-parser.js:397`). `hq.glb` 181→5 (~97% экономии). Риск низкий — они не анимируются и не переключают узлы.
- **Солдаты** (скин + `hiddenNodes`): целиком мерджить нельзя, но можно склеить непереключаемые части одного материала (`guardsmen_body`, `guardsmen_chest*`, `guardsmen_*_shoulder*`, `guardsmen_knee*`, `guardsmen_knife_waist` — все `ig_guardsmen`), оставив переключаемые `guardsmen_head02/03/04`, `guardsmen_lasgun`, `guardsmen_plasma_pistol`, `guardsmen_grenade_launcher`, `guardsmen_flamer` отдельными. ~9→4 draw calls на бойца.
- Долгосрочно — предмерджить на этапе экспорта GLB (asset pipeline).

### Шаг 4 — CPU
- `findClosestEnemySoldier`: `distanceToSquared`, пространственная сетка, throttle (пересчёт не каждый кадр).
- Отключать/пропускать миксеры вне видимости.

### Шаг 5 — Регресс
- Расширить quality tier (тени, dpr, дальность тумана/LOD) так, чтобы «medium» реально помогал.

## Полезное

- Тумблер моделей: `?models=procedural` / `?models=glb` (`src/model-source.js`, storage key `grimcraft-models`).
- Тир качества: `?quality=low|medium|high` / `window.__GRIMCRAFT_QUALITY` (`src/scene.js:644-679`).
- FPS-метр: `src/hud/store.js:65-101`.
