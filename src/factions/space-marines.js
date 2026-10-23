import worker from '../../animations/space-marines/worker.json';
import soldier from '../../animations/space-marines/soldier.json';
import structures from '../../animations/space-marines/structures.json';

import infProduction from '../../animations/space-marines/space_marines_structures_infantries_production_list.json';
import vehProduction from '../../animations/space-marines/space_marines_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Space Marines',
  teamcolours: {
    bloodravens: 'models/space marines/team_colors/bloodravens.teamcolour',
    bloodangels: 'models/space marines/team_colors/bloodangels.teamcolour',
    darkangels: 'models/space marines/team_colors/darkangels.teamcolour',
    imperialfists: 'models/space marines/team_colors/imperialfists.teamcolour',
    ravenguard: 'models/space marines/team_colors/ravenguard.teamcolour',
    spacewolves: 'models/space marines/team_colors/spacewolves.teamcolour',
    ultramarines: 'models/space marines/team_colors/ultramarines.teamcolour',
    whitescars: 'models/space marines/team_colors/whitescars.teamcolour',
  },
  hq: 'models/space marines/structures/command_hq.glb',
  infantry: [
    {
      name: 'Servitor',
      model: 'models/space marines/troops/servitor.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Space Marine',
      model: 'models/space marines/troops/space_marine.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: [
        'marine_missile_launcher',
        'marine_missile',
        'marine_knife',
        'marine_heavy_bolter_wheel',
        'marine_heavy_bolter_belt',
        'marine_heavy_bolter_backpack',
        'marine_heavy_bolter',
        'marine_grenade',
        'marine_flamer',
        'marine_banner_rod',
        'marine_banner',
        'marine_backpack_missiles',
      ]
    },
  ],
  units: [
    {
      name: 'grey_knight',
      model: 'models/space marines/troops/grey_knight.glb',
      animations: soldier,
      icon: 'assets/icons/Space Marines/Units/Elite/space_marine_icon_grey_knights.png',
      cost: 150,
      time: 5,
      hp: 250,
      size: 5,
      attackRange: 20,
      damage: 16,
    },
  ],
  structures: [
    {
      name: 'Armoury',
      model: 'models/space marines/structures/armoury.glb',
      type: 'armoury',
      animations: structures['armoury'],
      cost: 150,
      time: 10,
      production: productionList['armoury.glb'] || []
    },
    {
      name: 'Chapel-Barracks',
      model: 'models/space marines/structures/barracks.glb',
      type: 'barracks',
      animations: structures['barracks'],
      cost: 150,
      time: 10,
      production: productionList['barracks.glb'] || []
    },
    {
      name: 'Stronghold',
      model: 'models/space marines/structures/command_hq.glb',
      type: 'command_hq',
      animations: structures['command_hq'],
      cost: 300,
      time: 15,
      production: productionList['command_hq.glb'] || []
    },
    {
      name: 'Mine Field',
      model: 'models/space marines/structures/land_mine.glb',
      type: 'land_mine',
      animations: structures['land_mine'],
      cost: 40,
      time: 4,
      production: productionList['land_mine.glb'] || []
    },
    {
      name: 'Listening Post',
      model: 'models/space marines/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Machine Cult',
      model: 'models/space marines/structures/machine_cult.glb',
      type: 'machine_cult',
      animations: structures['machine_cult'],
      cost: 180,
      time: 12,
      production: productionList['machine_cult.glb'] || []
    },
    {
      name: 'Orbital Relay',
      model: 'models/space marines/structures/orbital_relay.glb',
      type: 'orbital_relay',
      animations: structures['orbital_relay'],
      cost: 200,
      time: 12,
      production: productionList['orbital_relay.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/space marines/structures/plasma_generator.glb',
      type: 'plasma_generator',
      animations: structures['plasma_generator'],
      cost: 80,
      time: 6,
      production: productionList['plasma_generator.glb'] || []
    },
    {
      name: 'Sacred Artifact',
      model: 'models/space marines/structures/progenitor_temple.glb',
      type: 'progenitor_temple',
      animations: structures['progenitor_temple'],
      cost: 120,
      time: 8,
      production: productionList['progenitor_temple.glb'] || []
    },
    {
      name: 'Thermo Plasma Generator',
      model: 'models/space marines/structures/thermo_plasma_generator.glb',
      type: 'thermo_plasma_generator',
      animations: structures['thermo_plasma_generator'],
      cost: 120,
      time: 8,
      production: productionList['thermo_plasma_generator.glb'] || []
    },
  ],
  // Servitor build grid (4x3, row-major): r3c1 reserved for Heavy Bolter Turret
  // (no Space Marines turret model exists — slot stays empty).
  buildOrder: [
    'command_hq', 'barracks', 'listening_post', 'plasma_generator',
    'armoury', 'machine_cult', 'progenitor_temple', 'thermo_plasma_generator',
    null, 'land_mine', 'orbital_relay',
  ],
  icons: {
    hq: 'assets/icons/Space Marines/Buildings/Command/hq_icon.png',
    barracks: 'assets/icons/Space Marines/Buildings/Production/barracks_icon.png',
    squad: 'assets/icons/Space Marines/Units/Basic/tacticalmarine_icon.png',
    worker: 'assets/icons/Space Marines/Units/Support/servitor_icon.png',
    listening_post: 'assets/icons/Space Marines/Units/Basic/listeningpost_icon.png',
    plasma_generator: 'assets/icons/Space Marines/Buildings/Economy/generator_icon.png',
    mechanized: 'assets/icons/Space Marines/Units/Basic/machinecult_icon.png',
    turret: 'assets/icons/Space Marines/Buildings/Defense/bolter_turret_icon.png',
    airfield: 'assets/icons/Space Marines/Units/Basic/orbitalrelay_icon.png',
    gun_turret: 'assets/icons/Space Marines/Buildings/Defense/missile_turret_icon.png',
    tower_base: 'assets/icons/Space Marines/Units/Basic/listeningpost_icon.png',
    thermo_generator: 'assets/icons/Space Marines/Buildings/Economy/thermogenerator_icon.png',
    // Servitor build-grid buttons, keyed by structure type.
    command_hq: 'assets/icons/Space Marines/Units/Basic/stronghold_icon.png',
    armoury: 'assets/icons/Space Marines/Units/Basic/armoury_icon.png',
    machine_cult: 'assets/icons/Space Marines/Units/Basic/machinecult_icon.png',
    progenitor_temple: 'assets/icons/Space Marines/Buildings/Production/progtemple_icon.png',
    thermo_plasma_generator: 'assets/icons/Space Marines/Buildings/Economy/thermogenerator_icon.png',
    land_mine: 'assets/icons/Space Marines/Units/Basic/mine_field_icon.png',
    orbital_relay: 'assets/icons/Space Marines/Units/Basic/orbitalrelay_icon.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
