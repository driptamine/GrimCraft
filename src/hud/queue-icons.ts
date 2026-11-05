/** Icon asset for a reinforcement queue entry: mirrors the button that queued it. */
import type { FactionConfig, ProductionItem } from '../factions/types.js';

interface ProductionQueueItem {
  type: string;
  icon?: string;
}

/** Resolve the same icon used by the producing building's recruitment button. */
export function productionQueueIcon(
  item: ProductionQueueItem,
  faction: FactionConfig | undefined,
  buildingType?: string,
  production: readonly ProductionItem[] = [],
): string {
  if (item.icon) return item.icon;
  if (!faction) return '';
  const key = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const type = key(item.type);
  const matches = (entry: { name?: string; model?: string }): boolean =>
    !!type && (key(entry.name) === type || key(entry.model?.split('/').pop()?.replace(/\.glb$/i, '')) === type);
  const iconIn = (entries: readonly ProductionItem[]): string => {
    for (const entry of entries) {
      if (typeof entry === 'object' && entry && matches(entry) && entry.icon) return entry.icon;
    }
    return '';
  };
  const structure = faction.structures?.find((entry) => entry.type === buildingType);
  const productionIcon = iconIn(production) || iconIn(structure?.production || []);
  if (productionIcon) return productionIcon;

  const defaultUnit = type === 'squad' ? faction.infantry?.[1]
    : type === 'builder' ? faction.infantry?.[0] : null;
  if (defaultUnit?.icon) return defaultUnit.icon;
  const unit = [...(faction.units || []), ...(faction.infantry || [])].find(matches);
  if (unit?.icon) return unit.icon;
  // Legacy queues and network snapshots may omit production details.
  for (const entry of faction.structures || []) {
    const icon = iconIn(entry.production || []);
    if (icon) return icon;
  }
  const iconKey = type === 'builder' ? 'worker' : item.type;
  const icon = faction.icons?.[iconKey];
  return typeof icon === 'string' ? icon : '';
}

export interface ReinforceQueueItem {
  type: string;
  formIdx?: number;
  isGrenadier: boolean;
}

export function reinforceQueueIcon(q: ReinforceQueueItem): string {
  if (q.isGrenadier) {
    return 'assets/icons/Imperial Guard/Units/Abilities/guard_upgrade_grenade_launcher.png';
  }
  if (q.type === 'plasma') {
    return 'assets/icons/Space Marines/Buildings/Economy/guard_upgrade_plasma_gun.png';
  }
  if (q.type === 'reinforce' && q.formIdx === 0) {
    return 'assets/icons/Imperial Guard/Units/Basic/guard_sargeant_icon.png';
  }
  return 'assets/command_icons/reinforce.png';
}
