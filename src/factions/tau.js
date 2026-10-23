import worker from '../../animations/tau/worker.json';
import soldier from '../../animations/tau/soldier.json';
import structures from '../../animations/tau/structures.json';

import infProduction from '../../animations/tau/tau_structures_infantries_production_list.json';
import vehProduction from '../../animations/tau/tau_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Tau',
  hq: 'models/tau/structures/tau_hq.glb',
  infantry: [
    {
      name: 'Earth Caste Builder',
      model: 'models/tau/infantry/earth_caste_builder.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Fire Warrior',
      model: 'models/tau/infantry/fire_warrior.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: ['tau_banner', 'tau_banner_rod']
    },
  ],
  structures: [
    {
      name: 'Tau Barracks',
      model: 'models/tau/structures/tau_barracks.glb',
      type: 'tau_barracks',
      animations: structures['tau_barracks'],
      cost: 150,
      time: 10,
      production: productionList['tau_barracks.glb'] || []
    },
    {
      name: 'Build Crane',
      model: 'models/tau/structures/tau_build_crane.glb',
      type: 'tau_build_crane',
      animations: structures['tau_build_crane'],
      cost: 120,
      time: 8,
      production: productionList['tau_build_crane.glb'] || []
    },
    {
      name: 'Cadre Headquarters',
      model: 'models/tau/structures/tau_hq.glb',
      type: 'tau_hq',
      animations: structures['tau_hq'],
      cost: 300,
      time: 15,
      production: productionList['tau_hq.glb'] || []
    },
    {
      name: 'Kroot Shaping Center',
      model: 'models/tau/structures/tau_kroot_nest.glb',
      type: 'tau_kroot_nest',
      animations: structures['tau_kroot_nest'],
      cost: 100,
      time: 7,
      production: productionList['tau_kroot_nest.glb'] || []
    },
    {
      name: 'Listening Post',
      model: 'models/tau/structures/tau_listening_post.glb',
      type: 'tau_listening_post',
      animations: structures['tau_listening_post'],
      cost: 60,
      time: 5,
      production: productionList['tau_listening_post.glb'] || []
    },
    {
      name: 'Listening Post SP',
      model: 'models/tau/structures/tau_listening_post_sp.glb',
      type: 'tau_listening_post_sp',
      animations: structures['tau_listening_post_sp'],
      cost: 60,
      time: 5,
      production: productionList['tau_listening_post_sp.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/tau/structures/tau_plasma_generator.glb',
      type: 'tau_plasma_generator',
      animations: structures['tau_plasma_generator'],
      cost: 80,
      time: 6,
      production: productionList['tau_plasma_generator.glb'] || []
    },
    {
      name: 'Path to Enlightenment',
      model: 'models/tau/structures/tau_research.glb',
      type: 'tau_research',
      animations: structures['tau_research'],
      cost: 150,
      time: 10,
      production: productionList['tau_research.glb'] || []
    },
    {
      name: 'Kauyon Command Post',
      model: 'models/tau/structures/tau_shrine_of_kauyon.glb',
      type: 'tau_shrine_of_kauyon',
      animations: structures['tau_shrine_of_kauyon'],
      cost: 120,
      time: 8,
      production: productionList['tau_shrine_of_kauyon.glb'] || []
    },
    {
      name: "Mont'ka Command Post",
      model: 'models/tau/structures/tau_shrine_of_mont_ka.glb',
      type: 'tau_shrine_of_mont_ka',
      animations: structures['tau_shrine_of_mont_ka'],
      cost: 120,
      time: 8,
      production: productionList['tau_shrine_of_mont_ka.glb'] || []
    },
    {
      name: 'Coalition Center',
      model: 'models/tau/structures/tau_shrine_of_purpose.glb',
      type: 'tau_shrine_of_purpose',
      animations: structures['tau_shrine_of_purpose'],
      cost: 120,
      time: 8,
      production: productionList['tau_shrine_of_purpose.glb'] || []
    },
    {
      name: 'Thermo Plasma Generator',
      model: 'models/tau/structures/tau_thermoplasma_generator.glb',
      type: 'tau_thermoplasma_generator',
      animations: structures['tau_thermoplasma_generator'],
      cost: 120,
      time: 8,
      production: productionList['tau_thermoplasma_generator.glb'] || []
    },
    {
      name: 'Vehicle Beacon',
      model: 'models/tau/structures/tau_vehicle_building.glb',
      type: 'tau_vehicle_building',
      animations: structures['tau_vehicle_building'],
      cost: 180,
      time: 12,
      production: productionList['tau_vehicle_building.glb'] || []
    },
  ],
  // Earth Caste Builder build grid (4x3, row-major).
  buildOrder: [
    'tau_hq', 'tau_barracks', 'tau_listening_post', 'tau_plasma_generator',
    'tau_kroot_nest', 'tau_research', 'tau_vehicle_building', 'tau_thermoplasma_generator',
    'tau_shrine_of_mont_ka', 'tau_shrine_of_kauyon', 'tau_shrine_of_purpose',
  ],
  icons: {
    hq: 'assets/icons/Tau/Buildings/Command/tau_hq_icon.png',
    barracks: 'assets/icons/Tau/Buildings/Production/tau_barracks_icon.png',
    squad: 'assets/icons/Tau/Units/Basic/tau_fire_warrior_icon.png',
    worker: 'assets/icons/Tau/Units/Support/tau_builder_icon.png',
    listening_post: 'assets/icons/Tau/Buildings/Economy/tau_listening_post_icon.png',
    plasma_generator: 'assets/icons/Tau/Buildings/Economy/tau_plasma_generator_icon.png',
    mechanized: 'assets/icons/Tau/Buildings/Tech/tau_research_building_icon.png',
    turret: 'assets/icons/Tau/Units/Basic/list_post_1_icon.png',
    airfield: 'assets/icons/Tau/Units/Vehicles/tau_barracuda_icon.png',
    gun_turret: 'assets/icons/Tau/Units/Basic/list_post_1_icon.png',
    tower_base: 'assets/icons/Tau/Units/Basic/guidance_beacon_icon.png',
    thermo_generator: 'assets/icons/Tau/Buildings/Economy/tau_thermoplasma_generator_icon.png',
    // Earth Caste Builder build-grid buttons, keyed by structure type.
    tau_hq: 'assets/icons/Tau/Buildings/Command/tau_hq_icon.png',
    tau_barracks: 'assets/icons/Tau/Buildings/Production/tau_barracks_icon.png',
    tau_listening_post: 'assets/icons/Tau/Buildings/Economy/tau_listening_post_icon.png',
    tau_plasma_generator: 'assets/icons/Tau/Buildings/Economy/tau_plasma_generator_icon.png',
    tau_kroot_nest: 'assets/icons/Tau/Units/Basic/tau_kroot_nest_icon.png',
    tau_research: 'assets/icons/Tau/Buildings/Tech/tau_research_building_icon.png',
    tau_vehicle_building: 'assets/icons/Tau/Units/Basic/guidance_beacon_icon.png',
    tau_thermoplasma_generator: 'assets/icons/Tau/Buildings/Economy/tau_thermoplasma_generator_icon.png',
    tau_shrine_of_mont_ka: 'assets/icons/Tau/Units/Basic/tau_shrine_of_montka_icon.png',
    tau_shrine_of_kauyon: 'assets/icons/Tau/Units/Basic/tau_shrine_of_kauyon_icon.png',
    tau_shrine_of_purpose: 'assets/icons/Tau/Units/Basic/tau_shrine_of_purpose_icon.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
