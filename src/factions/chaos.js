import worker from '../../animations/chaos/worker.json';
import chaos_space_marine from '../../animations/chaos/chaos_space_marine.json';
import bloodthirster from '../../animations/chaos/bloodthirster.json';
import structures from '../../animations/chaos/structures.json';

import infProduction from '../../animations/chaos/chaos_structures_infantries_production_list.json';
import vehProduction from '../../animations/chaos/chaos_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Chaos',
  hq: 'models/chaos/structures/desecrated_stronghold.glb',
  infantry: [
    {
      name: 'Heretic',
      model: 'models/chaos/infantry/heretic.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Chaos Space Marine',
      model: 'models/chaos/infantry/chaos_space_marine.glb',
      animations: chaos_space_marine,
      cost: 100,
      time: 3,
      hiddenNodes: [
        'chaos_banner',
        'marine_sergeant_banner_rod',
        'chaos_rocket_launcher',
        'chaos_heavy_bolter',
        'chaos_heavy_bolter_belt',
        'chaos_missiles',
        'chaos_knife',
        'chaos_plasma_rifle',
        'chaos_flamer',
      ]
    },
  ],
  units: [
    {
      name: 'bloodthirster',
      model: 'models/chaos/infantry/bloodthirster.glb',
      animations: bloodthirster,
      hiddenNodes: ['independant_bloodthirster_axe'],
      cost: 400,
      time: 12,
      hp: 1500,
      size: 1,
      attackRange: 5,
      damage: 60,
      canFly: true,
    },
  ],
  structures: [
    {
      name: 'Chaos Armoury',
      model: 'models/chaos/structures/armoury.glb',
      type: 'armoury',
      animations: structures['armoury'],
      cost: 150,
      time: 10,
      production: productionList['armoury.glb'] || []
    },
    {
      name: 'Chaos Icon',
      model: 'models/chaos/structures/chaos_icon.glb',
      type: 'chaos_icon',
      animations: structures['chaos_icon'],
      cost: 60,
      time: 5,
      production: productionList['chaos_icon.glb'] || []
    },
    {
      name: 'Chaos Temple',
      model: 'models/chaos/structures/chaos_temple.glb',
      type: 'chaos_temple',
      animations: structures['chaos_temple'],
      cost: 150,
      time: 10,
      production: productionList['chaos_temple.glb'] || []
    },
    {
      name: 'Desecrated Stronghold',
      model: 'models/chaos/structures/desecrated_stronghold.glb',
      type: 'desecrated_stronghold',
      animations: structures['desecrated_stronghold'],
      cost: 300,
      time: 15,
      production: productionList['desecrated_stronghold.glb'] || []
    },
    {
      name: 'Greater Sacrificial Circle',
      model: 'models/chaos/structures/greater_sacrificial_circle.glb',
      type: 'greater_sacrificial_circle',
      animations: structures['greater_sacrificial_circle'],
      cost: 200,
      time: 12,
      // No `model`: squad training resolves via the units registry, and a
      // model here would load the GLB twice (units + vehicles containers).
      production: [...(productionList['greater_sacrificial_circle.glb'] || []), {
        name: 'bloodthirster',
        icon: 'assets/icons/Chaos/Units/Commanders/bloodthirster_icon.png',
        cost: 400,
        time: 12,
      }]
    },
    {
      name: 'Mine Field',
      model: 'models/chaos/structures/land_mine.glb',
      type: 'land_mine',
      animations: structures['land_mine'],
      cost: 40,
      time: 4,
      production: productionList['land_mine.glb'] || []
    },
    {
      name: 'Listening Post',
      model: 'models/chaos/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Machine Pit',
      model: 'models/chaos/structures/machine_pit.glb',
      type: 'machine_pit',
      animations: structures['machine_pit'],
      cost: 180,
      time: 12,
      production: productionList['machine_pit.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/chaos/structures/plasma_generator.glb',
      type: 'plasma_generator',
      animations: structures['plasma_generator'],
      cost: 80,
      time: 6,
      production: productionList['plasma_generator.glb'] || []
    },
    {
      name: 'Sacrificial Circle',
      model: 'models/chaos/structures/sacrificial_circle.glb',
      type: 'sacrificial_circle',
      animations: structures['sacrificial_circle'],
      cost: 120,
      time: 8,
      production: productionList['sacrificial_circle.glb'] || []
    },
    {
      name: 'Thermo Plasma Generator',
      model: 'models/chaos/structures/thermo_plasma_generator.glb',
      type: 'thermo_plasma_generator',
      animations: structures['thermo_plasma_generator'],
      cost: 120,
      time: 8,
      production: productionList['thermo_plasma_generator.glb'] || []
    },
  ],
  // Heretic build grid (4 columns, null = reserved empty slot):
  // row 1: stronghold, temple, listening post, plasma;
  // row 2: armoury, machine pit, sacrificial circle, thermo plasma;
  // row 3: (turret), mine field, greater sacrificial circle.
  buildOrder: [
    'desecrated_stronghold', 'chaos_temple', 'listening_post', 'plasma_generator',
    'armoury', 'machine_pit', 'sacrificial_circle', 'thermo_plasma_generator',
    null, 'land_mine', 'greater_sacrificial_circle',
  ],
  icons: {
    hq: 'assets/icons/Chaos/Buildings/Command/hq_icon.png',
    barracks: 'assets/icons/Chaos/Buildings/Production/temple_icon.png',
    squad: 'assets/icons/Chaos/Units/Basic/marine_icon.png',
    worker: 'assets/icons/Chaos/Units/Support/slave_icon.png',
    listening_post: 'assets/icons/Chaos/Units/Basic/listen_post_icon.png',
    plasma_generator: 'assets/icons/Chaos/Buildings/Economy/plasma_gen_icon.png',
    mechanized: 'assets/icons/Chaos/Units/Basic/machine_pit_icon.png',
    turret: 'assets/icons/Chaos/Buildings/Defense/machine_turret_icon.png',
    airfield: 'assets/icons/Chaos/Units/Vehicles/hell_talon_icon.png',
    gun_turret: 'assets/icons/Chaos/Buildings/Defense/missile_turret_icon.png',
    tower_base: 'assets/icons/Chaos/Units/Basic/listen_post_icon.png',
    thermo_generator: 'assets/icons/Chaos/Buildings/Economy/thermo_plasma_gen_icon.png',
    desecrated_stronghold: 'assets/icons/Chaos/Buildings/Command/hq_icon.png',
    chaos_temple: 'assets/icons/Chaos/Buildings/Production/temple_icon.png',
    armoury: 'assets/icons/Chaos/Units/Basic/armoury_icon.png',
    machine_pit: 'assets/icons/Chaos/Units/Basic/machine_pit_icon.png',
    sacrificial_circle: 'assets/icons/Chaos/Units/Basic/sacrifice_icon.png',
    greater_sacrificial_circle: 'assets/icons/Chaos/Units/Basic/greater_sacrifice_icon.png',
    thermo_plasma_generator: 'assets/icons/Chaos/Buildings/Economy/thermo_plasma_gen_icon.png',
    land_mine: 'assets/icons/Chaos/Units/Basic/mine_field_icon.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
