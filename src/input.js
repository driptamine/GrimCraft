// Input handling lives in ./input/ (split from this file).
// This barrel preserves the original public import surface.
export { POINT_HOVER_RADIUS, POINT_HOVER_SEGMENTS, _rangeCirclesVisible, _hideRangeCircles, _showRangeCircles, keys, tickCamera } from './input/camera.js';
export { raycastGround, pickMesh, pickFpsTargetMesh, FPS_PICK_OFFSETS, clearEnemySelection, clearSelection, setSquadSelected, setBuildingSelected, setApcSelected, setVehicleSelected, setJetSelected, _setAirfieldSelected, updateRallyMarker, clearRallyMarker, updateAirfieldRallyMarker, clearAirfieldRallyMarker, doClickSelect, doBoxSelect } from './input/selection.js';
export { spawnMoveMarker, spawnAttackMarker, spawnBeamTracer, flashHitmarker, spawnSpPing } from './input/markers.js';
export { _stopBuildGhost, _startBuildGhost, _moveBuildGhost, startBuild, cancelBuild } from './input/build-ghost.js';
export { issueRightClick, issueGroundOrder, issueFpsShot, demolishBuilding, buildAddon, _pendingBuilderCommand, setBuilderCommand, clearBuilderCommand, isFlyArmed, armFlyTargeting, cancelFlyTargeting, setBuilderStance, placeListeningPost, placeBuild } from './input/orders.js';
export { updateSelBoxCSS, isHostileToSelection, setupPointerEvents, initInput } from './input/events.js';
