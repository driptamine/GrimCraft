import worker from '../../animations/necrons/worker.json';
import soldier from '../../animations/necrons/soldier.json';
import structures from '../../animations/necrons/structures.json';

import infProduction from '../../animations/necrons/necrons_structures_infantries_production_list.json';
import vehProduction from '../../animations/necrons/necrons_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Necrons',
  hq: 'models/necrons/structures/monolith.glb',
  infantry: [
    {
      name: 'Builder Scarab',
      model: 'models/necrons/infantry/builder_scarab.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Necron Warrior',
      model: 'models/necrons/infantry/necron_basic_warrior.glb',
      animations: soldier,
      cost: 100,
      time: 3
    },
  ],
  structures: [
    {
      name: 'Energy Core',
      model: 'models/necrons/structures/energy_core.glb',
      type: 'energy_core',
      animations: structures['energy_core'],
      cost: 80,
      time: 6,
      production: productionList['energy_core.glb'] || []
    },
    {
      name: 'Forbidden Archive',
      model: 'models/necrons/structures/forbidden_archive.glb',
      type: 'forbidden_archive',
      animations: structures['forbidden_archive'],
      cost: 150,
      time: 10,
      production: productionList['forbidden_archive.glb'] || []
    },
    {
      name: 'Greater Summoning Core',
      model: 'models/necrons/structures/greater_summoning_core.glb',
      type: 'greater_summoning_core',
      animations: structures['greater_summoning_core'],
      cost: 300,
      time: 15,
      production: productionList['greater_summoning_core.glb'] || []
    },
    {
      name: 'Listening Post',
      model: 'models/necrons/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Dormant Monolith',
      model: 'models/necrons/structures/monolith.glb',
      type: 'monolith',
      animations: structures['monolith'],
      cost: 300,
      time: 15,
      production: productionList['monolith.glb'] || []
    },
    {
      name: 'Obelisk',
      model: 'models/necrons/structures/obelisk.glb',
      type: 'obelisk',
      animations: structures['obelisk'],
      cost: 100,
      time: 7,
      production: productionList['obelisk.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/necrons/structures/plasma_generator.glb',
      type: 'plasma_generator',
      animations: structures['plasma_generator'],
      cost: 80,
      time: 6,
      production: productionList['plasma_generator.glb'] || []
    },
    {
      name: 'Summoning Core',
      model: 'models/necrons/structures/summoning_core.glb',
      type: 'summoning_core',
      animations: structures['summoning_core'],
      cost: 150,
      time: 10,
      production: productionList['summoning_core.glb'] || []
    },
    {
      name: 'Summoning Core Big',
      model: 'models/necrons/structures/summoning_core_big.glb',
      type: 'summoning_core_big',
      animations: structures['summoning_core_big'],
      cost: 200,
      time: 12,
      production: productionList['summoning_core_big.glb'] || []
    },
    {
      name: 'Thermo Plasma Generator',
      model: 'models/necrons/structures/thermoplasma_generator.glb',
      type: 'thermoplasma_generator',
      animations: structures['thermoplasma_generator'],
      cost: 120,
      time: 8,
      production: productionList['thermoplasma_generator.glb'] || []
    },
    {
      name: 'Gauss Turret',
      model: 'models/necrons/structures/turret.glb',
      type: 'turret',
      animations: structures['turret'],
      cost: 100,
      time: 7,
      production: productionList['turret.glb'] || []
    },
  ],
  // Builder Scarab build grid (4x3, row-major).
  buildOrder: [
    'monolith', 'obelisk', 'plasma_generator', 'thermoplasma_generator',
    'summoning_core', 'forbidden_archive', 'greater_summoning_core', 'energy_core',
    'turret',
  ],
  icons: {
    hq: 'assets/icons/Necrons/Buildings/Command/necron_hq_1_icon.png',
    barracks: 'assets/icons/Necrons/Units/Vehicles/necron_monolith_icon.png',
    squad: 'assets/icons/Necrons/Units/Basic/necron_warrior_icon.png',
    worker: 'assets/icons/Necrons/Units/Support/necron_builder_scarab_icon.png',
    listening_post: 'assets/icons/Necrons/Buildings/Economy/necron_listening_post_icon.png',
    plasma_generator: 'assets/icons/Necrons/Buildings/Economy/necron_plasma_generator_icon.png',
    mechanized: 'assets/icons/Necrons/Units/Basic/necron_summoning_core_icon.png',
    turret: 'assets/icons/Necrons/Buildings/Defense/necron_turret.png',
    airfield: 'assets/icons/Necrons/Units/Basic/necron_greater_summoning_core_icon.png',
    gun_turret: 'assets/icons/Necrons/Buildings/Defense/necron_turret_upgrade.png',
    tower_base: 'assets/icons/Necrons/Buildings/Economy/necron_listening_post_icon.png',
    thermo_generator: 'assets/icons/Necrons/Buildings/Economy/necron_thermoplasma_generator_icon.png',
    // Builder Scarab build-grid buttons, keyed by structure type.
    monolith: 'assets/icons/Necrons/Units/Vehicles/necron_monolith_icon.png',
    obelisk: 'assets/icons/Necrons/Buildings/Economy/necron_listening_post_icon.png',
    thermoplasma_generator: 'assets/icons/Necrons/Buildings/Economy/necron_thermoplasma_generator_icon.png',
    summoning_core: 'assets/icons/Necrons/Units/Basic/necron_summoning_core_icon.png',
    forbidden_archive: 'assets/icons/Necrons/Units/Basic/necron_forbidden_archive_icon.png',
    greater_summoning_core: 'assets/icons/Necrons/Units/Basic/necron_greater_summoning_core_icon.png',
    energy_core: 'assets/icons/Necrons/Units/Basic/necron_energy_core_icon.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
