# Benchmark — merge пехоты (реализовано)

Расчёт по GLB + внедрение: `src/merge-skinned.js`, хук в `src/factions.js`
для worker/soldier/units. Скинированные части клеятся в bind space с
конкатенацией `skinIndex/skinWeight` и ребиндом к общему скелету —
анимации ходьбы/атаки работают как раньше.

Перегенерация:

```
node scripts/infantry-merge-benchmark.mjs
```

Метод: для каждой пехотной модели загружаемого сета считаются видимые
примитивы при дефолтном hidden-наборе (одно оружие показано, баннер убран) —
это before. Отдельно остаются: рантайм-переключаемое (оружие гвардии,
баннер/шест плантера) и меши, искомые по имени в рантайме (`karskin_plasmagun`
для glow). Всё остальное видимое группируется по материалам — по 1 вызову
на материал. `marker_*` узлы — пустышки (проверено в glb), мерж их не заденет.

## Оценка сцены

~2 вызова на бойца вместо ~9 в среднем (гвардеец: 13→2).
Пример: 100 бойцов ≈ 900 → ~200 вызовов в главном проходе (×2 с тенями).

## Все пехотные модели загружаемого сета (27 моделей)

| faction | model | prims before | calls after | saved |
|---|---|---|---|---|
| Chaos | Chaos / Chaos Space Marine | 6 | 2 | 67% |
| Chaos | Chaos / Heretic | 2 | 2 | 0% |
| Dark Eldar | Dark Eldar / Kabalite Warrior | 5 | 1 | 80% |
| Dark Eldar | Dark Eldar / Tortured Slave | 2 | 1 | 50% |
| Eldar | Eldar / Guardian | 7 | 1 | 86% |
| Eldar | Eldar / Bonesinger | 3 | 1 | 67% |
| Eldar | Eldar / dark_reaper | 3 | 1 | 67% |
| Imperial Guard | Imperial Guard / command_squad | 37 | 3 | 92% |
| Imperial Guard | Imperial Guard / sergeant | 17 | 3 | 82% |
| Imperial Guard | Imperial Guard / ogryn | 14 | 1 | 93% |
| Imperial Guard | Imperial Guard / Guardsmen | 13 | 2 | 85% |
| Imperial Guard | Imperial Guard / heavy_weapons_team | 13 | 6 | 54% |
| Imperial Guard | Imperial Guard / Tech Priest Enginseer | 12 | 1 | 92% |
| Imperial Guard | Imperial Guard / priest | 7 | 2 | 71% |
| Imperial Guard | Imperial Guard / commissar | 4 | 1 | 75% |
| Imperial Guard | Imperial Guard / psyker | 4 | 1 | 75% |
| Imperial Guard | Imperial Guard / kasrkin | 4 | 2 | 50% |
| Imperial Guard | Imperial Guard / vindicare | 3 | 1 | 67% |
| Necrons | Necrons / Necron Warrior | 4 | 1 | 75% |
| Necrons | Necrons / Builder Scarab | 1 | 1 | 0% |
| Orks | Orks / Boyz | 23 | 1 | 96% |
| Orks | Orks / boyz_shoota | 22 | 1 | 95% |
| Orks | Orks / Grots | 10 | 1 | 90% |
| Space Marines | Space Marines / Servitor | 18 | 2 | 89% |
| Space Marines | Space Marines / Space Marine | 7 | 1 | 86% |
| Tau | Tau / Fire Warrior | 4 | 1 | 75% |
| Tau | Tau / Earth Caste Builder | 1 | 1 | 0% |
| **total 27 models** | | **246** | **42** | **83%** |

## Что сделано и как проверено

- Пулы только из частей с общими material + skeleton + world + bind;
  всё остальное остаётся как было. Любой фейл мержа оставляет сцену
  пиксель-в-пиксель (оригиналы удаляются только после успеха).
- Исключения: hiddenNodes, рантайм-переключаемое (оружие, баннер
  плантера, `karskin_plasmagun`), анимированные поддеревья, морфы,
  инстансы. Проверено: 0 из 146 пехотных моделей имеют mesh-узлы
  с анимациями — допущения расчёта точны.
- 7 тестов (`tests/merge-skinned.test.js`), сюит зелёный.
- Проверка в игре (за пользователем): консольный `mergeStats`,
  `renderer.info.render.calls`, анимации ходьбы/атаки, своп оружия,
  плантер с баннером, плазма-glow у касркин.
