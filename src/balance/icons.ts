// Bundle the existing small game icons so the editor also works without R2.
import guardsman from '../../assets/icons/Imperial Guard/Units/Basic/guard_squad_guardsmen.png';
import guardPlasma from '../../assets/icons/Imperial Guard/Buildings/Economy/guard_squad_guardsmen__guard_plasma_gun_guardsmen.png';
import kasrkin from '../../assets/icons/Imperial Guard/Units/Elite/guard_squad_kasrkin.png';
import kasrkinPlasma from '../../assets/icons/Imperial Guard/Buildings/Economy/guard_squad_kasrkin__guard_plasma_gun_kasrkin.png';
import chaosMarine from '../../assets/icons/Chaos/Units/Basic/marine_icon.png';
import chaosHeavyBolter from '../../assets/icons/Chaos/Units/Basic/marine_icon__chaos_heavy_bolter_tactical.png';
import chaosPlasma from '../../assets/icons/Chaos/Buildings/Economy/marine_icon__chaos_plasma_gun_tactical.png';
import marine from '../../assets/icons/Space Marines/Units/Basic/tacticalmarine_icon.png';
import marineHeavyBolter from '../../assets/icons/Space Marines/Units/Basic/tacticalmarine_icon__space_marine_heavy_bolter_tactical.png';
import greyKnight from '../../assets/icons/Space Marines/Units/Elite/hg_grey_knights_icon.png';
import guardian from '../../assets/icons/Eldar/Units/Basic/guardian_icon.png';
import reaper from '../../assets/icons/Eldar/Units/Elite/dark_reaper_icon.png';
import slugga from '../../assets/icons/Orks/Units/Basic/slugga_boyz_icon.png';
import shoota from '../../assets/icons/Orks/Units/Basic/shoota_boyz_icon.png';
import warrior from '../../assets/icons/Necrons/Units/Basic/necron_warrior_icon.png';
import fireWarrior from '../../assets/icons/Tau/Units/Basic/tau_fire_warrior_icon.png';
import battleSister from '../../assets/icons/Sisters of Battle/Units/Basic/squad_battle_sister.png';

export const WEAPON_ICONS: Record<string, string> = {
  lasgun: guardsman, laspistol: guardsman, plasma_gun: guardPlasma, hellgun: kasrkin, kasrkin_plasma_gun: kasrkinPlasma,
  bolter: chaosMarine, heavy_bolter: chaosHeavyBolter, chaos_plasma_gun: chaosPlasma,
  space_marine_bolter: marine, space_marine_heavy_bolter: marineHeavyBolter, storm_bolter: greyKnight,
  shuriken_catapult: guardian, reaper_launcher: reaper, slugga, shoota, gauss_flayer: warrior,
  pulse_rifle: fireWarrior, sororitas_bolter: battleSister,
};
