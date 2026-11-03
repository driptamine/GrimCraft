/** Icon asset for a reinforcement queue entry: mirrors the button that queued it. */

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
