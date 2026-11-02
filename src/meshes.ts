// Mesh factories and point rules live in ./meshes/ (split from this file).
// This barrel preserves the original public import surface.
export { makeMissileMesh, makeBulletMesh, makeLaserBulletMesh, makePlasmaBulletMesh, makeGrenadeMesh, makeSoldierMesh, applyGuardsmanHead } from './meshes/soldiers.js';
export { makeHpBar, updateHpBar, makeSquareSelRing } from './meshes/hud.js';
export { makeHQMesh, makeBarracksMesh, makeTowerMesh, makeThermoMesh, makeTowerBaseMesh, makeGunTurretMesh, makeConfigStructureMesh } from './meshes/buildings.js';
export { STRATEGIC_POINT_HIDDEN_NODES, STRATEGIC_POINT_GROUND_PLANE, STRATEGIC_POINT_GROUND_PLANE_RENDER_ORDER, patchStrategicPointGroundPlane, STRATEGIC_POINT_CENTERPOST, patchStrategicPointCenterpost, canPlaceListeningPost, STRATEGIC_POINT_BANNERS, shouldShowCaptureFlag, _wirePointFlagNodes, updatePointFlag, STRATEGIC_POINT_CLIPS, POINT_PRE_PLANT_RISE, raiseScrubProgress, nextStrategicPointAnim, _wirePointAnims, preloadStrategicPointModel, preloadRelicModel, preloadObjectiveModel, makeStrategicPointMesh, buildListeningPostMesh } from './meshes/points.js';
export { makeApcMesh, makeVehicleMesh, makeAirfieldMesh, _buildJetGeometry, makeJetMesh } from './meshes/vehicles.js';
export { ghostUsesConfigModel, makeGhostMesh } from './meshes/ghost.js';
