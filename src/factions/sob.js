import worker from '../../animations/sob/worker.json';
import soldier from '../../animations/sob/soldier.json';
import structures from '../../animations/sob/structures.json';

import infProduction from '../../animations/sob/sob_structures_infantries_production_list.json';
import vehProduction from '../../animations/sob/sob_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Sisters of Battle',
  hq: 'models/sob/structures/adepta_sororitas_convent.glb',
  infantry: [
    {
      name: 'Servitor',
      model: 'models/sob/infantry/servitor.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Battle Sister',
      model: 'models/sob/infantry/battle_sister.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: ['sb_obj_banner', 'sb_obj_flagpole']
    },
  ],
  structures: [
    {
      name: 'Adepta Sororitas Convent',
      model: 'models/sob/structures/adepta_sororitas_convent.glb',
      type: 'adepta_sororitas_convent',
      animations: structures['adepta_sororitas_convent'],
      cost: 300,
      time: 15,
      production: productionList['adepta_sororitas_convent.glb'] || []
    },
    {
      name: 'Adeptus Mechanicus Workshop',
      model: 'models/sob/structures/adeptus_mechanicus_workshop.glb',
      type: 'adeptus_mechanicus_workshop',
      animations: structures['adeptus_mechanicus_workshop'],
      cost: 180,
      time: 12,
      production: productionList['adeptus_mechanicus_workshop.glb'] || []
    },
    {
      name: 'Ecclesiarchal Chapel',
      model: 'models/sob/structures/ecclesiarchal_chapel.glb',
      type: 'ecclesiarchal_chapel',
      animations: structures['ecclesiarchal_chapel'],
      cost: 150,
      time: 10,
      production: productionList['ecclesiarchal_chapel.glb'] || []
    },
    {
      name: 'Holy Reliquary',
      model: 'models/sob/structures/holy_reliquary_v2.glb',
      type: 'holy_reliquary_v2',
      animations: structures['holy_reliquary_v2'],
      cost: 120,
      time: 8,
      production: productionList['holy_reliquary_v2.glb'] || []
    },
    {
      name: 'Inferno Turret',
      model: 'models/sob/structures/inferno_turret.glb',
      type: 'inferno_turret',
      animations: structures['inferno_turret'],
      cost: 100,
      time: 7,
      production: productionList['inferno_turret.glb'] || []
    },
    {
      name: 'Listening Post',
      model: 'models/sob/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Plasma Generator',
      model: 'models/sob/structures/plasma_generator.glb',
      type: 'plasma_generator',
      animations: structures['plasma_generator'],
      cost: 80,
      time: 6,
      production: productionList['plasma_generator.glb'] || []
    },
    {
      name: 'Pristine Sanctuary',
      model: 'models/sob/structures/pristine_sanctuary.glb',
      type: 'pristine_sanctuary',
      animations: structures['pristine_sanctuary'],
      cost: 120,
      time: 8,
      production: productionList['pristine_sanctuary.glb'] || []
    },
    {
      name: 'Purgatus Mines',
      model: 'models/sob/structures/purgatus_mines.glb',
      type: 'purgatus_mines',
      animations: structures['purgatus_mines'],
      cost: 40,
      time: 4,
      production: productionList['purgatus_mines.glb'] || []
    },
    {
      name: 'Shrine of St Celestine',
      model: 'models/sob/structures/shrine_of_st_celestine.glb',
      type: 'shrine_of_st_celestine',
      animations: structures['shrine_of_st_celestine'],
      cost: 120,
      time: 8,
      production: productionList['shrine_of_st_celestine.glb'] || []
    },
    {
      name: 'Thermo Plasma Generator',
      model: 'models/sob/structures/thermo_plasma_generator.glb',
      type: 'thermo_plasma_generator',
      animations: structures['thermo_plasma_generator'],
      cost: 120,
      time: 8,
      production: productionList['thermo_plasma_generator.glb'] || []
    },
  ],
  icons: {
    hq: 'assets/icons/Sisters of Battle/Buildings/Command/building_hq.png',
    barracks: 'assets/icons/Sisters of Battle/Buildings/Other/building_infantry.png',
    squad: 'assets/icons/Sisters of Battle/Units/Basic/squad_battle_sister.png',
    worker: 'assets/icons/Sisters of Battle/Units/Support/hg_servitor_icon.png',
    listening_post: 'assets/icons/Sisters of Battle/Buildings/Economy/building_listening_post.png',
    plasma_generator: 'assets/icons/Sisters of Battle/Buildings/Economy/building_plasma_generator.png',
    mechanized: 'assets/icons/Sisters of Battle/Buildings/Other/building_vehicle_building.png',
    turret: 'assets/icons/Sisters of Battle/Buildings/Defense/building_turret_flamer.png',
    airfield: 'assets/icons/Sisters of Battle/Units/Basic/squad_lightning.png',
    gun_turret: 'assets/icons/Sisters of Battle/Buildings/Defense/building_missile_turret.png',
    tower_base: 'assets/icons/Sisters of Battle/Buildings/Economy/building_listening_post.png',
    thermo_generator: 'assets/icons/Sisters of Battle/Buildings/Economy/building_thermo_plasma.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
