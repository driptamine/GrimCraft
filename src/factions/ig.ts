import structuresJson from '../../animations/ig/structures/structures.json';
import { techPriestEnginseer } from '../../stats/races/ig/infantry/tech_priest_enginseer.js';
import { guardsmen } from '../../stats/races/ig/infantry/guardsmen.js';
import { sergeant } from '../../stats/races/ig/infantry/sergeant.js';
import { commissar } from '../../stats/races/ig/infantry/commissar.js';
import { psyker } from '../../stats/races/ig/infantry/psyker.js';
import { priest } from '../../stats/races/ig/infantry/priest.js';
import { vindicare } from '../../stats/races/ig/infantry/vindicare.js';
import { heavyWeaponsTeam } from '../../stats/races/ig/infantry/heavy_weapons_team.js';
import { kasrkin } from '../../stats/races/ig/infantry/kasrkin.js';
import { ogryn } from '../../stats/races/ig/infantry/ogryn.js';
import { commandSquad } from '../../stats/races/ig/infantry/command_squad.js';
const structures: Record<string, unknown> = structuresJson;

const STRUCTURE_HIDDEN_NODES = [
  'scaffolding', 'crate_', 'turbine', 'mrk_turbine',
  'mech_arm', 'railing', 'fuel_tank', 'attachment',
];

export default {
  name: 'Imperial Guard',
  teamcolours: {
    cadian8: 'models/ig/color/cadian8.teamcolour',
    cadian31: 'models/ig/color/cadian31.teamcolour',
    cadian51: 'models/ig/color/cadian51.teamcolour',
    cadian101: 'models/ig/color/cadian101.teamcolour',
    cadian110: 'models/ig/color/cadian110.teamcolour',
    cadian180: 'models/ig/color/cadian180.teamcolour',
    cadian412: 'models/ig/color/cadian412.teamcolour',
    kauravaconservator252: 'models/ig/color/kauravaconservator252.teamcolour',
  },
  hq: 'models/ig/structures/hq.glb',
  infantry: [
    techPriestEnginseer,
    guardsmen,
  ],
  units: [
    sergeant,
    commissar,
    psyker,
    priest,
    vindicare,
    heavyWeaponsTeam,
    kasrkin,
    ogryn,
    commandSquad,
  ],
  structures: [
    {
      name: 'HQ (Animated)',
      model: 'models/ig/structures/hq-anim.glb',
      type: 'hq-anim',
      animations: structures['hq-anim'],
      hiddenNodes: [...STRUCTURE_HIDDEN_NODES, 'hq_shadow'],
      cost: 300,
      time: 15,
      production: []
    },
    {
      name: 'HQ',
      model: 'models/ig/structures/hq.glb',
      type: 'hq',
      animations: structures['hq'],
      hiddenNodes: [...STRUCTURE_HIDDEN_NODES, 'hq_shadow'],
      cost: 300,
      time: 15,
      production: [
        {
          name: 'guardsmen',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_guardsmen.png',
          model: 'models/ig/infantry/guardsmen.glb',
          cost: 160,
          time: 20
        },
        {
          name: 'builder',
          icon: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_enginseer.png',
          model: 'models/ig/infantry/tech_priest_engineseer.glb',
          cost: 80,
          time: 2
        },
        {
          name: 'commissar',
          icon: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_commissar.png',
          model: 'models/ig/infantry/commissar.glb',
          cost: 150,
          time: 6
        },
        {
          name: 'psyker',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_psyker.png',
          model: 'models/ig/infantry/sanctioned_psyker.glb',
          cost: 140,
          time: 6
        },
        {
          name: 'priest',
          icon: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_priest.png',
          model: 'models/ig/infantry/priest.glb',
          cost: 140,
          time: 6
        },
        {
          name: 'vindicare',
          icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_assassin.png',
          model: 'models/ig/infantry/vindicare_temple_assassin.glb',
          cost: 160,
          time: 7
        },
      ],
      addons: [
        {
          name: 'telepathica_temple',
          icon: 'assets/icons/Imperial Guard/Buildings/Production/addon_guard_telepathica_temple.png',
          cost: 100,
          unlocks: 'psyker'
        },
        {
          name: 'ministorum_temple',
          icon: 'assets/icons/Imperial Guard/Buildings/Production/addon_guard_ministorum_temple.png',
          cost: 100,
          unlocks: 'priest'
        },
        {
          name: 'vindicare_temple',
          icon: 'assets/icons/Imperial Guard/Buildings/Production/addon_guard_vindicare_temple.png',
          cost: 100,
          unlocks: 'vindicare'
        },
        {
          name: 'battle_command',
          icon: 'assets/icons/Imperial Guard/Buildings/Command/addon_guard_hq_1.png',
          cost: 200,
          tier: 2
        },
        {
          name: 'long_range_scanner',
          icon: 'assets/icons/Imperial Guard/Buildings/Command/addon_guard_hq_2.png',
          cost: 150,
          requiresTier: 2,
          scanner: true
        },
      ],
    },
    {
      name: 'Infantry Command',
      model: 'models/ig/structures/infantry_command.glb',
      type: 'infantry_command',
      animations: structures['infantry_command'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 150,
      time: 10,
      production: [
        {
          name: 'guardsmen',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_guardsmen.png',
          model: 'models/ig/infantry/guardsmen.glb',
          cost: 160,
          time: 20
        },
        {
          name: 'heavy_weapons_team',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_heavy_weapons_team.png',
          model: 'models/ig/infantry/heavy_weapon_platoon.glb',
          cost: 150,
          time: 6
        },
        {
          name: 'kasrkin',
          icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_kasrkin.png',
          model: 'models/ig/infantry/kasrkin.glb',
          cost: 180,
          time: 7
        },
        {
          name: 'ogryn',
          icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_ogryns.png',
          model: 'models/ig/infantry/ogryn.glb',
          cost: 160,
          time: 7
        },
        {
          name: 'command_squad',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_command_squad.png',
          model: 'models/ig/infantry/imperial_captain.glb',
          cost: 200,
          time: 8
        },
      ],
    },
    {
      name: 'Listening Post',
      model: 'models/ig/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 60,
      time: 5,
      production: [],
      addons: [
        {
          name: 'fortified_position',
          icon: 'assets/icons/Imperial Guard/Units/Basic/addon_guard_list_post_1.png',
          cost: 100,
          power: 60,
          time: 35,
          tier: 2,
          requiresTier: 1,
        },
        {
          name: 'heavily_fortified_position',
          icon: 'assets/icons/Imperial Guard/Units/Basic/addon_guard_list_post_2.png',
          cost: 250,
          power: 100,
          time: 45,
          tier: 3,
          requiresTier: 2,
        },
      ],
    },
    {
      name: 'Mars Pattern Command',
      model: 'models/ig/structures/mars_pattern_command.glb',
      type: 'mars_pattern',
      animations: structures['mars_pattern'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 150,
      time: 10,
      production: []
    },
    {
      name: 'Mechanized Command',
      model: 'models/ig/structures/mechanized_command.glb',
      type: 'mechanized',
      animations: structures['mechanized'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 180,
      time: 12,
      production: [
        {
          name: 'chimera',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/guard_squad_chimera.png',
          model: 'models/ig/vehicles/chimera.glb',
          cost: 180,
          time: 7,
          projectileType: 'beam'
        },
        {
          name: 'sentinel',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/guard_squad_sentinel.png',
          model: 'models/ig/vehicles/sentinel.glb',
          cost: 140,
          time: 5
        },
        {
          name: 'hellhound',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/guard_squad_hellhound.png',
          model: 'models/ig/vehicles/hellhound.glb',
          cost: 220,
          time: 8
        },
        {
          name: 'basilisk',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/guard_squad_basilisk.png',
          model: 'models/ig/vehicles/basilisk.glb',
          cost: 260,
          time: 10
        },
        {
          name: 'marauder_bomber',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/marauder_icon.png',
          model: 'models/ig/vehicles/marauder_bomber.glb',
          cost: 320,
          time: 12
        },
        {
          name: 'leman_russ_battle_tank',
          icon: 'assets/icons/Imperial Guard/Units/Vehicles/guard_squad_lemanruss.png',
          model: 'models/ig/vehicles/leman_russ_battle_tank.glb',
          cost: 300,
          time: 11,
          requires: ['full_scale_war']
        },
      ],
      research: [
        {
          key: 'full_scale_war',
          name: 'Full Scale War',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_fullscalewar.png',
          cost: 200,
          power: 100,
          time: 60,
          requires: [],
          desc: 'Enables Leman Russ and Baneblade',
        },
      ],
    },
    {
      name: 'Plasma Generator',
      model: 'models/ig/structures/plasma_generator.glb',
      type: 'plasma_generator',
      animations: structures['plasma_generator'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 80,
      time: 6,
      production: []
    },
    {
      name: 'Tactica Control',
      model: 'models/ig/structures/tactica_control.glb',
      type: 'tactica_control',
      animations: structures['tactica_control'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 120,
      time: 8,
      production: [],
      research: [
        {
          key: 'death_before_dishonor',
          name: 'Death before Dishonor',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_morale.png',
          cost: 75,
          power: 15,
          time: 20,
          requires: [],
          desc: 'Guardsmen +15 HP',
        },
        {
          key: 'battle_armor',
          name: 'Battle Armor',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_guardsmen_health.png',
          cost: 100,
          power: 50,
          time: 45,
          requires: [],
          desc: 'Guardsmen HP +25%',
        },
        {
          key: 'uncommon_valor',
          name: 'Uncommon Valor',
          icon: 'assets/icons/Imperial Guard/Units/Basic/guard_uncommon_valor.png',
          cost: 100,
          power: 100,
          time: 60,
          requires: ['battle_command'],
          desc: 'Command squad +100 HP',
        },
        {
          key: 'satellite_targeting',
          name: 'Satellite Targeting',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_guardsmen_range.png',
          cost: 100,
          power: 25,
          time: 30,
          requires: ['battle_command'],
          desc: 'Guardsmen range +20%',
        },
        {
          key: 'will_of_the_emperor',
          name: 'Will of the Emperor',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_morale_2.png',
          cost: 75,
          power: 15,
          time: 20,
          requires: ['battle_command'],
          desc: 'Guardsmen +25 HP',
        },
        {
          key: 'weapon_specialization',
          name: 'Weapon Specialization',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_weapon_specialization.png',
          cost: 100,
          power: 100,
          time: 30,
          requires: ['satellite_targeting'],
          desc: 'Guardsmen damage +50%',
        },
        {
          key: 'genetic_enhancement',
          name: 'Genetic Enhancement',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_kasrkin_speed.png',
          cost: 100,
          power: 50,
          time: 60,
          requires: ['battle_command'],
          desc: 'Kasrkin speed +33%',
        },
        {
          key: 'kasrkin_armor',
          name: 'Kasrkin Armor',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_kasrkin_armor.png',
          cost: 100,
          power: 50,
          time: 60,
          requires: ['battle_command'],
          desc: 'Kasrkin HP +25%',
        },
        {
          key: 'powered_bayonets',
          name: 'Powered Bayonets',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_ogryn_melee.png',
          cost: 100,
          power: 75,
          time: 60,
          requires: ['battle_command'],
          desc: 'Ogryn melee damage +25%',
        },
        {
          key: 'infiltration_research',
          name: 'Infiltration Research',
          icon: 'assets/icons/Imperial Guard/Units/Abilities/guard_research_assassin_infiltrate.png',
          cost: 150,
          power: 100,
          time: 40,
          requires: ['battle_command'],
          desc: 'Vindicare infiltration (cloaked)',
        },
      ],
    },
    {
      name: 'Turret',
      model: 'models/ig/structures/turret_heavy_bolter.glb',
      type: 'turret',
      animations: structures['turret_heavy_bolter'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 100,
      time: 7,
      production: []
    },
    {
      name: 'Thermo Generator',
      model: 'models/ig/structures/thermo_generator.glb',
      type: 'thermo_generator',
      animations: structures['thermo_generator'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 80,
      time: 6,
      production: []
    },
    {
      name: 'Mines',
      model: 'models/ig/structures/land_mine.glb',
      type: 'mines',
      animations: structures['land_mine'],
      hiddenNodes: STRUCTURE_HIDDEN_NODES,
      cost: 50,
      time: 4,
      production: []
    },
  ],
  icons: {
    hq: 'assets/icons/Imperial Guard/Buildings/Command/guard_hq.png',
    infantry_command: 'assets/icons/Imperial Guard/Units/Basic/guard_infantry.png',
    squad: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_guardsmen.png',
    worker: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_enginseer.png',
    listening_post: 'assets/icons/Imperial Guard/Buildings/Economy/guard_listening_post.png',
    plasma_generator: 'assets/icons/Imperial Guard/Buildings/Economy/guard_plasma_generator.png',
    mechanized: 'assets/icons/Imperial Guard/Units/Basic/guard_mechanized.png',
    turret: 'assets/icons/Imperial Guard/Buildings/Defense/guard_turret_heavy_bolter.png',
    airfield: 'assets/icons/Imperial Guard/Units/Vehicles/marauder_icon.png',
    gun_turret: 'assets/icons/Imperial Guard/Buildings/Defense/guard_missile_turret.png',
    tower_base: 'assets/icons/Imperial Guard/Buildings/Economy/guard_listening_post.png',
    thermo_generator: 'assets/icons/Imperial Guard/Buildings/Economy/guard_thermo_plasma.png',
    tactica_control: 'assets/icons/Imperial Guard/Units/Basic/guard_tactica.png',
    mars_pattern: 'assets/icons/Imperial Guard/Units/Basic/guard_mars_pattern.png',
    mines: 'assets/icons/Imperial Guard/Units/Basic/guard_mines.png',
    turret_heavy_bolter: 'assets/icons/Imperial Guard/Buildings/Defense/guard_turret_heavy_bolter.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
