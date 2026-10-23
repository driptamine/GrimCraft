import worker from '../../animations/eldar/worker.json';
import soldier from '../../animations/eldar/soldier.json';
import structures from '../../animations/eldar/structures.json';

import infProduction from '../../animations/eldar/eldar_structures_infantries_production_list.json';
import vehProduction from '../../animations/eldar/eldar_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Eldar',
  hq: 'models/eldar/structures/webway_assembly.glb',
  infantry: [
    {
      name: 'Bonesinger',
      model: 'models/eldar/infantry/bonesinger.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Guardian',
      model: 'models/eldar/infantry/guardian.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: ['Eldar_Flag', 'Eldar_Flag_Pole']
    },
  ],
  units: [
    {
      name: 'dark_reaper',
      model: 'models/eldar/infantry/dark_reaper.glb',
      animations: soldier,
      hiddenNodes: ['Eldar_Flag', 'Eldar_Flag_Pole'],
      icon: 'assets/icons/Eldar/Units/Elite/dark_reaper_icon.png',
      cost: 100,
      time: 3,
      size: 5,
      attackRange: 22,
      damage: 12,
      hp: 450,
      stationaryFireOnly: true,
    },
  ],
  structures: [
    {
      name: 'Thermo Plasma Generator',
      model: 'models/eldar/structures/advanced_warp_generator.glb',
      type: 'advanced_warp_generator',
      animations: structures['advanced_warp_generator'],
      cost: 120,
      time: 8,
      production: productionList['advanced_warp_generator.glb'] || []
    },
    {
      name: 'Aspect Portal',
      model: 'models/eldar/structures/aspect_portal.glb',
      type: 'aspect_portal',
      animations: structures['aspect_portal'],
      cost: 150,
      time: 10,
      production: productionList['aspect_portal.glb'] || []
    },
    {
      name: 'Mine Field',
      model: 'models/eldar/structures/land_mine.glb',
      type: 'land_mine',
      animations: structures['land_mine'],
      cost: 40,
      time: 4,
      production: productionList['land_mine.glb'] || []
    },
    {
      name: 'Listening Shrine',
      model: 'models/eldar/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Soul Shrine',
      model: 'models/eldar/structures/soul_shrine.glb',
      type: 'soul_shrine',
      animations: structures['soul_shrine'],
      cost: 120,
      time: 8,
      production: productionList['soul_shrine.glb'] || []
    },
    {
      name: 'Support Platform',
      model: 'models/eldar/structures/support_platform.glb',
      type: 'support_platform',
      animations: structures['support_platform'],
      cost: 100,
      time: 7,
      production: productionList['support_platform.glb'] || []
    },
    {
      name: 'Support Portal',
      model: 'models/eldar/structures/support_portal.glb',
      type: 'support_portal',
      animations: structures['support_portal'],
      cost: 180,
      time: 12,
      production: productionList['support_portal.glb'] || []
    },
    {
      name: 'Support Portal Ulthwe',
      model: 'models/eldar/structures/support_portal_ulthwe.glb',
      type: 'support_portal_ulthwe',
      animations: structures['support_portal_ulthwe'],
      cost: 180,
      time: 12,
      production: productionList['support_portal_ulthwe.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/eldar/structures/warp_generator.glb',
      type: 'warp_generator',
      animations: structures['warp_generator'],
      cost: 80,
      time: 6,
      production: productionList['warp_generator.glb'] || []
    },
    {
      name: 'Webway Assembly',
      model: 'models/eldar/structures/webway_assembly.glb',
      type: 'webway_assembly',
      animations: structures['webway_assembly'],
      cost: 300,
      time: 15,
      production: productionList['webway_assembly.glb'] || []
    },
    {
      name: 'Webway Gate',
      model: 'models/eldar/structures/webway_gate.glb',
      type: 'webway_gate',
      animations: structures['webway_gate'],
      cost: 200,
      time: 12,
      production: productionList['webway_gate.glb'] || []
    },
  ],
  // Bonesinger build grid (4x3, row-major).
  buildOrder: [
    'webway_assembly', 'aspect_portal', 'listening_post', 'warp_generator',
    'webway_gate', 'soul_shrine', 'support_portal', 'advanced_warp_generator',
    'support_platform', 'land_mine',
  ],
  icons: {
    hq: 'assets/icons/Eldar/Units/Basic/webway_assembly_icon.png',
    barracks: 'assets/icons/Eldar/Buildings/Production/aspect_portal_icon.png',
    squad: 'assets/icons/Eldar/Units/Basic/guardian_icon.png',
    worker: 'assets/icons/Eldar/Units/Support/bonesinger_icon.png',
    listening_post: 'assets/icons/Eldar/Buildings/Economy/listening_post_icon.png',
    plasma_generator: 'assets/icons/Eldar/Buildings/Economy/warp_generator_icon.png',
    mechanized: 'assets/icons/Eldar/Buildings/Production/support_portal_icon.png',
    turret: 'assets/icons/Eldar/Units/Basic/support_platform_starcannon_icon.png',
    airfield: 'assets/icons/Eldar/Units/Vehicles/nightwing_icon.png',
    gun_turret: 'assets/icons/Eldar/Units/Basic/support_platform_dcannon_icon.png',
    tower_base: 'assets/icons/Eldar/Buildings/Economy/listening_post_icon.png',
    thermo_generator: 'assets/icons/Eldar/Buildings/Economy/advanced_warp_generator_icon.png',
    // Bonesinger build-grid buttons, keyed by structure type.
    webway_assembly: 'assets/icons/Eldar/Units/Basic/webway_assembly_icon.png',
    aspect_portal: 'assets/icons/Eldar/Buildings/Production/aspect_portal_icon.png',
    warp_generator: 'assets/icons/Eldar/Buildings/Economy/warp_generator_icon.png',
    webway_gate: 'assets/icons/Eldar/Units/Basic/webway_gate_icon.png',
    soul_shrine: 'assets/icons/Eldar/Units/Basic/soul_shrine_icon.png',
    support_portal: 'assets/icons/Eldar/Buildings/Production/support_portal_icon.png',
    advanced_warp_generator: 'assets/icons/Eldar/Buildings/Economy/advanced_warp_generator_icon.png',
    support_platform: 'assets/icons/Eldar/Units/Basic/support_platform_starcannon_icon.png',
    land_mine: 'assets/icons/Eldar/Units/Basic/mine_field.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
