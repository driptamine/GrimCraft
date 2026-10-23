import worker from '../../animations/orks/worker.json';
import soldier from '../../animations/orks/soldier.json';
import structures from '../../animations/orks/structures.json';

import infProduction from '../../animations/orks/orks_structures_infantries_production_list.json';
import vehProduction from '../../animations/orks/orks_structures_vehicles_production_list.json';

const productionList = { ...infProduction, ...vehProduction };
export default {
  name: 'Orks',
  hq: 'models/orks/structures/settlement.glb',
  infantry: [
    {
      name: 'Grots',
      model: 'models/orks/infantry/grots.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Boyz',
      model: 'models/orks/infantry/boyz.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: ['ork_flag', 'ork_flag_pole']
    },
  ],
  units: [
    {
      name: 'boyz_shoota',
      model: 'models/orks/infantry/boyz_shoota.glb',
      animations: soldier,
      hiddenNodes: ['ork_flag', 'ork_flag_pole'],
      icon: 'assets/icons/Orks/Units/Basic/shoota_boyz_icon.png',
      cost: 100,
      time: 3,
      size: 5,
      attackRange: 22,
      damage: 12,
    },
  ],
  structures: [
    {
      name: 'Bigga Generator',
      model: 'models/orks/structures/bigger_generator.glb',
      type: 'bigger_generator',
      animations: structures['bigger_generator'],
      cost: 120,
      time: 8,
      production: productionList['bigger_generator.glb'] || []
    },
    {
      name: 'Da Boyz Hut',
      model: 'models/orks/structures/da_boyz_hut.glb',
      type: 'da_boyz_hut',
      animations: structures['da_boyz_hut'],
      cost: 150,
      time: 10,
      production: productionList['da_boyz_hut.glb'] || []
    },
    {
      name: 'Generator',
      model: 'models/orks/structures/generator.glb',
      type: 'generator',
      animations: structures['generator'],
      cost: 80,
      time: 6,
      production: productionList['generator.glb'] || []
    },
    {
      name: 'Mine Field',
      model: 'models/orks/structures/land_mine.glb',
      type: 'land_mine',
      animations: structures['land_mine'],
      cost: 40,
      time: 4,
      production: productionList['land_mine.glb'] || []
    },
    {
      name: "Da Listenin' Post",
      model: 'models/orks/structures/listening_post.glb',
      type: 'listening_post',
      animations: structures['listening_post'],
      cost: 60,
      time: 5,
      production: productionList['listening_post.glb'] || []
    },
    {
      name: 'Da Mek Shop',
      model: 'models/orks/structures/mek_shop.glb',
      type: 'mek_shop',
      animations: structures['mek_shop'],
      cost: 180,
      time: 12,
      production: productionList['mek_shop.glb'] || []
    },
    {
      name: 'Pile O Gunz!',
      model: 'models/orks/structures/pile_o_guns.glb',
      type: 'pile_o_guns',
      animations: structures['pile_o_guns'],
      cost: 120,
      time: 8,
      production: productionList['pile_o_guns.glb'] || []
    },
    {
      name: 'Settlement',
      model: 'models/orks/structures/settlement.glb',
      type: 'settlement',
      animations: structures['settlement'],
      cost: 300,
      time: 15,
      production: productionList['settlement.glb'] || []
    },
    {
      name: 'Waaagh! Banner',
      model: 'models/orks/structures/waagh_banner.glb',
      type: 'waagh_banner',
      animations: structures['waagh_banner'],
      cost: 100,
      time: 7,
      production: productionList['waagh_banner.glb'] || []
    },
  ],
  // Grot build grid (4x3, row-major).
  buildOrder: [
    'settlement', 'da_boyz_hut', 'listening_post', 'generator',
    'waagh_banner', 'pile_o_guns', 'mek_shop', 'bigger_generator',
    'land_mine',
  ],
  icons: {
    hq: 'assets/icons/Orks/Buildings/Command/hq_icon.png',
    barracks: 'assets/icons/Orks/Buildings/Production/da_boyz_hut_icon.png',
    squad: 'assets/icons/Orks/Units/Basic/slugga_boyz_icon.png',
    worker: 'assets/icons/Orks/Units/Support/grot_icon.png',
    listening_post: 'assets/icons/Orks/Buildings/Economy/listening_post_icon.png',
    plasma_generator: 'assets/icons/Orks/Buildings/Economy/generator_icon.png',
    mechanized: 'assets/icons/Orks/Units/Basic/mek_shop_icon.png',
    turret: 'assets/icons/Orks/Buildings/Other/waaagh_banner_icon.png',
    airfield: 'assets/icons/Orks/Units/Vehicles/fighta_bomma_icon.png',
    gun_turret: 'assets/icons/Orks/Buildings/Other/waaagh_banner_addon_1_icon.png',
    tower_base: 'assets/icons/Orks/Buildings/Economy/listening_post_icon.png',
    thermo_generator: 'assets/icons/Orks/Units/Basic/big_gen_icon.png',
    // Grot build-grid buttons, keyed by structure type.
    settlement: 'assets/icons/Orks/Buildings/Command/hq_icon.png',
    da_boyz_hut: 'assets/icons/Orks/Buildings/Production/da_boyz_hut_icon.png',
    generator: 'assets/icons/Orks/Buildings/Economy/generator_icon.png',
    waagh_banner: 'assets/icons/Orks/Buildings/Other/waaagh_banner_icon.png',
    pile_o_guns: 'assets/icons/Orks/Units/Basic/pile_o_gunz_icon.png',
    mek_shop: 'assets/icons/Orks/Units/Basic/mek_shop_icon.png',
    bigger_generator: 'assets/icons/Orks/Units/Basic/big_gen_icon.png',
    land_mine: 'assets/icons/Orks/Units/Basic/mine_field_icon.png',
    infantries: {},
    vehicles: {},
    structures: {},
  }
};
