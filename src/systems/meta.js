import { createSquadEntity } from '../entities.js';
import {
  PLAYER,
  controlBoth,
  counters,
  gainRequisition,
  getRequisitionRate,
  setGameOver,
  world,
} from '../scene.js';
import { systemAirfield, systemJet } from './air.js';
import { systemBuilder } from './builder.js';
import { systemStrategicPoint } from './points.js';
import { systemBeam, systemBlasterBullet, systemBullet, systemGrenade, systemLaserBullet, systemMissile, systemParticle, systemPlasmaBullet, systemReaperBullet } from './projectiles.js';
import { systemSoldier, systemSquad } from './squad.js';
import { systemBuilding, systemStructure, systemStructureCollision } from './structures.js';
import { systemApc, systemVehicle } from './vehicles.js';


export function systemRequisitionIncome(world, deltaTime) {
  if (window._multiplayerMode) {
    return;
  }
  const rate = getRequisitionRate(world);
  counters.baseReqT += deltaTime * (rate * 0.1);
  if (counters.baseReqT >= 1) {
    const gained = Math.floor(counters.baseReqT);
    counters.baseReqT -= gained;
    gainRequisition(world, gained);
  }
}


export function systemAI(world, deltaTime) {
  if (controlBoth) {
    return;
  }
  counters.aiT += deltaTime;
  if (counters.aiT >= 28) {
    counters.aiT = 0;
    createSquadEntity(world, PLAYER === 'blue' ? 'red' : 'blue', 30 + (Math.random() - .5) * 10, (Math.random() - .5) * 40, 5);
  }
}


export function systemWinCheck(world) {
  const playerSquads = world.query('squad').filter((id) => world.get(id, 'squad')?.team === PLAYER);
  const playerBuildings = world.query('building');
  const playerBuilders = world.query('builder');
  if (playerSquads.length === 0 && playerBuildings.length === 0 && playerBuilders.length === 0) {
    setGameOver(true);
    const winText = document.getElementById('winText');
    if (winText) {
      winText.textContent = PLAYER === 'blue' ? 'RED WINS' : 'BLUE WINS';
      winText.style.color = PLAYER === 'blue' ? '#ff4444' : '#4444ff';
    }
    const win = document.getElementById('win');
    if (win) {
      win.style.display = 'flex';
    }
  }
}


export function _initSystems(w) {
  w.addSystem(systemSoldier);
  w.addSystem(systemSquad);
  w.addSystem(systemBuilder);
  w.addSystem(systemBuilding);
  w.addSystem(systemStructure);
  w.addSystem(systemApc);
  w.addSystem(systemVehicle);
  w.addSystem(systemStructureCollision);
  w.addSystem(systemStrategicPoint);
  w.addSystem(systemBullet);
  w.addSystem(systemLaserBullet);
  w.addSystem(systemBeam);
  w.addSystem(systemPlasmaBullet);
  w.addSystem(systemBlasterBullet);
  w.addSystem(systemReaperBullet);
  w.addSystem(systemGrenade);
  w.addSystem(systemParticle);
  w.addSystem(systemAirfield);
  w.addSystem(systemJet);
  w.addSystem(systemMissile);
  w.addSystem(systemRequisitionIncome);
}
