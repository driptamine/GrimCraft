// Simulation systems live in ./systems/ (split from this file).
// This barrel preserves the original public import surface.
export { findClosestEnemySoldier, disposeMeshComponent, spawnParticles } from './systems/combat.js';
export { systemSoldier, systemSquad } from './systems/squad.js';
export { systemBuilder } from './systems/builder.js';
export { systemBuilding, systemStructure, systemStructureCollision } from './systems/structures.js';
export { systemStrategicPoint } from './systems/points.js';
export { systemBullet, systemGrenade, systemLaserBullet, systemBeam, systemReaperBullet, systemBlasterBullet, systemPlasmaBullet, systemParticle, systemMissile } from './systems/projectiles.js';
export { systemApc, systemVehicle, _apcEjectPassengers } from './systems/vehicles.js';
export { systemAirfield, systemJet } from './systems/air.js';
export { systemRequisitionIncome, systemAI, systemWinCheck, _initSystems } from './systems/meta.js';
