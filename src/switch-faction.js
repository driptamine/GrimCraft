// ⇄ SWITCH FACTION button (right column, below the CAMERA button).
// Cycles the player side through every faction with a standing HQ, hands
// control of that side to the player, and jumps the camera to its HQ.
// Factions without an HQ are skipped, so a 2-faction match still toggles
// like before.
import * as THREE from 'three';
import { camera, setPlayerTeam } from './scene.js';
import { playerFaction, setPlayerFaction } from './factions.js';
import { factionsWithHQ, hqPositionForFaction, hqTeamForFaction } from './hud/data.js';
import { updateHUD } from './hud.js';

export function switchFaction() {
  const present = factionsWithHQ();
  if (!present.length) {
    return;
  }
  let next = present[0];
  const idx = present.indexOf(playerFaction);
  if (idx >= 0) {
    next = present[(idx + 1) % present.length];
  }
  setPlayerFaction(next);
  const team = hqTeamForFaction(next);
  if (team) {
    setPlayerTeam(team);
  }
  const hq = hqPositionForFaction(next);
  if (hq && camera) {
    camera.target = new THREE.Vector3(hq.x, 0, hq.z);
  }
  updateHUD();
}
