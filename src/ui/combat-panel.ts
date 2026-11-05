import {
  kasrkinFireRate, setKasrkinFireRate,
  KASRKIN_FIRE_RATE_DEFAULT, KASRKIN_FIRE_RATE_MIN, KASRKIN_FIRE_RATE_MAX,
} from '../combat/fire-rate.js';

export function toggleCombatPanel(): void {
  const panel = document.getElementById('combat-panel');
  const button = document.getElementById('combat-panel-btn');
  if (!panel || !button) return;
  const open = panel.classList.toggle('open');
  button.classList.toggle('active', open);
  button.setAttribute('aria-expanded', String(open));
  syncCombatPanel();
}

function syncCombatPanel(): void {
  const slider = document.getElementById('kasrkin-fire-rate') as HTMLInputElement | null;
  const value = document.getElementById('kasrkin-fire-rate-val');
  const rate = kasrkinFireRate();
  if (slider) {
    slider.min = String(KASRKIN_FIRE_RATE_MIN);
    slider.max = String(KASRKIN_FIRE_RATE_MAX);
    slider.value = String(rate);
    slider.setAttribute('aria-valuetext', `${rate.toFixed(1)} bursts per second`);
  }
  if (value) value.textContent = `${rate.toFixed(1)}/s`;
}

export function updateKasrkinFireRate(value: unknown): void {
  setKasrkinFireRate(value);
  syncCombatPanel();
}

export function resetKasrkinFireRate(): void {
  updateKasrkinFireRate(KASRKIN_FIRE_RATE_DEFAULT);
}
