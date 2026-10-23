import * as THREE from 'three';
import { getMat } from '../mat-cache.js';
import { _instantiateFromContainer } from '../model-upload.js';
import {
  BUILDING_BOUNDS,
  PLAYER,
  STRUCTURE_BOUNDS,
  TEAM_COLOR,
  scene,
} from '../scene.js';
import {
  childMeshes,
  descendants,
  mkBox,
  mkCylinder,
  mkGroup,
  mkPoly,
  mkSphere,
  mkTorus,
} from '../three-helpers.js';
import { _factionBucket } from './common.js';
import { makeSquareSelRing } from './hud.js';


export function makeHQMesh(position, teamKey, metaPayload) {
  const container = _factionBucket(teamKey, metaPayload).hq;
  if (!container) {
    const root = mkGroup('hq_fallback');
    root.position.copy(position);
    const box = mkBox('hq_box', 6, 6, 6);
    box.position.y = 3;
    root.add(box);
    const ring = makeSquareSelRing(root, BUILDING_BOUNDS.hq, 0.16);
    root._ring = ring;
    root._ringMat = ring._material;
    return root;
  }

  const root = _instantiateFromContainer(container, metaPayload);
  root.position.copy(position);
  root.rotation.y = Math.PI / 2;
  // Ensure metadata is applied to all child meshes for picking
  childMeshes(root).forEach((mesh) => {
    mesh.userData = { ...metaPayload };
  });
  const ring = makeSquareSelRing(root, BUILDING_BOUNDS.hq, 0.16);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) scene._registerShadows(root);
  return root;
}


export function makeBarracksMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.infantry_command || faction.structures.barracks;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const ring = makeSquareSelRing(root, BUILDING_BOUNDS.barracks, 0.13);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('barracks');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('b', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.castShadow = true;
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    } else {
      boxMaterial.emissive = new THREE.Color(0, 0, 0);
    }

    box.material = boxMaterial;
    box.userData = { ...metaPayload };
    return box;
  };
  addBox(5, 0.4, 5, 0x443322, 0, 0, 0.2, 0);
  addBox(4.4, 2.5, 4.4, 0x665544, 0, 0, 1.65, 0);
  addBox(5, 0.35, 5, 0x332211, 0, 0, 3.1, 0);
  addBox(0.9, 1.6, 0.15, 0x221100, 0, 0, 0.8, 2.3);
  [-1.4, 1.4].forEach((x) => {
    const windowBox = mkBox('w', 0.7, 0.7, 0.12);
    windowBox.position.set(x, 2, 2.3);
    root.add(windowBox);
    const windowMaterial = new THREE.MeshStandardMaterial();
    windowMaterial.color = new THREE.Color(0.2, 0.27, 0.53);
    windowMaterial.emissive = new THREE.Color(0, 0.07, 0.2);
    windowBox.material = windowMaterial;
    windowBox.userData = { ...metaPayload };
  });
  const flagPole = mkBox('fp', 0.1, 3, 0.1);
  flagPole.position.set(2, 1.5, -2);
  root.add(flagPole);
  const flagPoleMaterial = new THREE.MeshStandardMaterial();
  flagPoleMaterial.color = new THREE.Color(0.33, 0.2, 0.07);
  flagPole.material = flagPoleMaterial;
  const flagBanner = mkBox('fb', 1.2, 0.65, 0.05);
  flagBanner.position.set(0.6 + 2, 3.1, -2);
  root.add(flagBanner);
  const flagBannerMaterial = new THREE.MeshStandardMaterial();
  flagBannerMaterial.color = config.diffuse.clone();
  flagBannerMaterial.emissive = config.emissive.clone();
  flagBanner.material = flagBannerMaterial;

  // Note: makeSquareSelRing will be imported or exported from here if needed
  // I'll keep it here for now as it's used by multiple factories.
  const ring = makeSquareSelRing(root, BUILDING_BOUNDS.barracks, 0.13);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  // Ensure metadata is applied to all child meshes for picking
  childMeshes(root).forEach((mesh) => {
    if (!mesh._isSelRingBar) {
      mesh.userData = { ...metaPayload };
    }
  });
  return root;
}


export function makeTowerMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.turret;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const turretNode = descendants(root).find((n) => n.name.toLowerCase().includes('turret')) || root;
    root._turret = turretNode;
    const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.tower, 0.14, 0.05);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('tower');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  const addCyl = function addCyl(diameterTop, diameterBottom, height, color, emissiveColor, x, y, z) {
    const cylinder = mkCylinder('c', diameterTop, diameterBottom, height, 8);
    cylinder.position.set(x, y, z);
    root.add(cylinder);
    cylinder.castShadow = true;
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    cylinderMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      cylinderMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    cylinder.material = cylinderMaterial;
    cylinder.userData = { ...metaPayload };
    return cylinder;
  };
  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('b', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.castShadow = true;
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    box.material = boxMaterial;
    box.userData = { ...metaPayload };
    return box;
  };
  addCyl(4, 4.8, 0.5, 0x334433, 0, 0, 0.25, 0);
  addCyl(1.2, 1.6, 5, 0x445544, 0, 0, 3, 0);
  addBox(2.4, 0.4, 2.4, 0x3a4a3a, 0, 0, 5.7, 0);
  const turretNode = mkGroup('turret');
  root.add(turretNode);
  turretNode.position.set(0, 6.2, 0);
  const turretHead = mkBox('th', 1.4, 0.7, 1.4);
  turretNode.add(turretHead);
  const turretHeadMaterial = new THREE.MeshStandardMaterial();
  turretHeadMaterial.color = config.diffuse.clone();
  turretHeadMaterial.emissive = config.emissive.clone();
  turretHead.material = turretHeadMaterial;
  const barrel = addCyl(0.2, 0.2, 1.4, 0x111111, 0, 0, 0.1, 0);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 1.0;
  turretNode.add(barrel);
  root._turret = turretNode;

  const coinMesh = mkPoly('coin', 1, 0.3);
  coinMesh.position.set(0, 7.2, 0);
  root.add(coinMesh);
  const coinMaterial = new THREE.MeshStandardMaterial();
  coinMaterial.color = new THREE.Color(1, 0.8, 0);
  coinMaterial.emissive = new THREE.Color(0.53, 0.4, 0);
  coinMesh.material = coinMaterial;
  root._coin = coinMesh;

  const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.tower, 0.14, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  // Ensure metadata is applied to all child meshes for picking
  childMeshes(root).forEach((mesh) => {
    if (!mesh._isSelRingBar) {
      mesh.userData = { ...metaPayload };
    }
  });
  return root;
}


export function makeThermoMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.thermo_generator;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.thermoGen, 0.14, 0.05);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('powerplant');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;

  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('ppb', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.castShadow = true;
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    box.material = boxMaterial;
    box.userData = { ...metaPayload };
    return box;
  };
  const addCyl = function addCyl(diameterTop, diameterBottom, height, color, emissiveColor, x, y, z, tess = 12) {
    const cylinder = mkCylinder('ppc', diameterTop, diameterBottom, height, tess);
    cylinder.position.set(x, y, z);
    root.add(cylinder);
    cylinder.castShadow = true;
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    cylinderMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      cylinderMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    cylinder.material = cylinderMaterial;
    cylinder.userData = { ...metaPayload };
    return cylinder;
  };

  addBox(6.5, 0.3, 6.5, 0x2a2a2a, 0, 0, 0.15, 0);
  addBox(4.8, 2.2, 4.2, 0x3a4040, 0, 0, 1.4, 0);
  addBox(5.0, 0.25, 4.4, 0x2e3535, 0, 0, 2.62, 0);

  const dome = mkSphere('ppdome', 2.6, 8);
  dome.scale.y = 0.65;
  dome.position.set(0, 3.2, 0);
  root.add(dome);
  dome.castShadow = true;
  const domeMaterial = new THREE.MeshStandardMaterial();
  domeMaterial.color = new THREE.Color(0.55, 0.62, 0.55);
  dome.material = domeMaterial;
  dome.userData = { ...metaPayload };

  const domeRing = mkTorus('ppdring', 2.2, 0.18, 24);
  domeRing.rotation.x = Math.PI / 2;
  domeRing.position.set(0, 2.55, 0);
  root.add(domeRing);
  const domeRingMaterial = new THREE.MeshStandardMaterial();
  domeRingMaterial.color = config.diffuse.clone();
  domeRingMaterial.emissive = config.emissive.clone();
  domeRing.material = domeRingMaterial;
  root._coreGlowMat = domeRingMaterial;

  [
    [-2.0, 0, 1.8],
    [2.0, 0, 1.8],
  ].forEach(([positionX, , positionZ]) => {
    addCyl(1.05, 1.3, 3.8, 0x4a5050, 0, positionX, 1.9, positionZ, 16);
    addCyl(1.2, 1.05, 0.5, 0x4a5050, 0, positionX, 3.95, positionZ, 16);
    addCyl(0.7, 0.7, 3.8, 0x1a1a1a, 0, positionX, 1.9, positionZ, 12);
    addCyl(1.22, 1.22, 0.12, 0x5a6060, 0, positionX, 4.22, positionZ, 16);
  });

  [
    [-2.0, 4.5, 1.8],
    [2.0, 4.5, 1.8],
  ].forEach(([positionX, positionY, positionZ], index) => {
    const steam = mkCylinder('ppsteam' + index, 1.4, 0.5, 0.9, 10);
    steam.position.set(positionX, positionY, positionZ);
    root.add(steam);
    const steamMaterial = new THREE.MeshBasicMaterial();
    steamMaterial.color = new THREE.Color(0.15, 0.2, 0.15);
    steamMaterial.opacity = 0.45;
    steamMaterial.transparent = true;
    steam.material = steamMaterial;
  });

  addBox(1.8, 1.4, 1.2, 0x2e3030, 0, -3.2, 0.9, -1.0);
  [-3.6, -2.8].forEach((x) => {
    addCyl(0.18, 0.18, 0.9, 0x555555, 0, x, 1.6, -1.0);
    addCyl(0.28, 0.28, 0.12, 0x444444, 0, x, 2.1, -1.0);
  });
  addBox(0.1, 2.2, 0.1, 0x444444, 0, -3.2, 1.5, 0.4);
  addBox(1.2, 0.08, 0.08, 0x444444, 0, -3.2, 2.65, 0.4);
  addBox(4.82, 0.3, 0.08, 0xffcc00, 0xaa8800, 0, 0.85, 2.12);

  const meter = mkBox('ppmeter', 0.14, 1.8, 0.14);
  meter.position.set(0, 5.0, 0);
  root.add(meter);
  const meterMaterial = new THREE.MeshStandardMaterial();
  meterMaterial.color = new THREE.Color(0, 1, 0.53);
  meterMaterial.emissive = new THREE.Color(0, 0.67, 0.27);
  meterMaterial.opacity = 0.85;
  meterMaterial.transparent = true;
  meter.material = meterMaterial;
  root._meter = meter;

  const warnLight = mkSphere('ppwl', 0.22, 5);
  warnLight.position.set(0, 6.0, 0);
  root.add(warnLight);
  const warningLightMaterial = new THREE.MeshStandardMaterial();
  warningLightMaterial.color = new THREE.Color(1, 0.2, 0.1);
  warningLightMaterial.emissive = new THREE.Color(0.8, 0, 0);
  warnLight.material = warningLightMaterial;

  const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.thermoGen, 0.14, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  // Ensure metadata is applied to all child meshes for picking
  childMeshes(root).forEach((mesh) => {
    if (!mesh._isSelRingBar) {
      mesh.userData = { ...metaPayload };
    }
  });
  return root;
}


export function makeTowerBaseMesh(position, teamKey = PLAYER, metaPayload = {}) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.armoury;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.towerBase, 0.13, 0.05);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('towerbase');
  root.position.copy(position);
  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('tb', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.castShadow = true;
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    box.material = boxMaterial;
    box.userData = { ...metaPayload };
    return box;
  };
  const addCyl = function addCyl(diameterTop, diameterBottom, height, color, emissiveColor, x, y, z) {
    const cylinder = mkCylinder('tc', diameterTop, diameterBottom, height, 8);
    cylinder.position.set(x, y, z);
    root.add(cylinder);
    cylinder.castShadow = true;
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    cylinderMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      cylinderMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    cylinder.material = cylinderMaterial;
    cylinder.userData = { ...metaPayload };
    return cylinder;
  };
  addBox(3.5, 0.5, 3.5, 0x223322, 0, 0, 0.25, 0);
  [-1.2, 1.2].forEach((x) => {
    [-1.2, 1.2].forEach((z) => {
      addCyl(0.3, 0.35, 2.5, 0x334433, 0, x, 1.5, z);
    });
  });
  addBox(2, 0.4, 2, 0x1a2a1a, 0, 0, 2.7, 0);
  const turretNode = mkGroup('tbturret');
  root.add(turretNode);
  turretNode.position.set(0, 3.1, 0);
  const turretHead = mkBox('tbth', 1.8, 0.6, 1.8);
  turretNode.add(turretHead);
  const turretHeadMaterial = new THREE.MeshStandardMaterial();
  turretHeadMaterial.color = new THREE.Color(0.1, 0.25, 0.1);
  turretHeadMaterial.emissive = new THREE.Color(0, 0.08, 0);
  turretHead.material = turretHeadMaterial;
  turretHead.userData = { ...metaPayload };
  [-0.35, 0.35].forEach((offsetX) => {
    const barrel = mkCylinder('tbb', 0.18, 0.22, 1.8, 8);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(offsetX, 0.0, 1.2);
    turretNode.add(barrel);
    const barrelMaterial = new THREE.MeshStandardMaterial();
    barrelMaterial.color = new THREE.Color(0.07, 0.07, 0.07);
    barrel.material = barrelMaterial;
  });
  root._turret = turretNode;
  const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.towerBase, 0.13, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  // Ensure metadata is applied to all child meshes for picking
  childMeshes(root).forEach((mesh) => {
    if (!mesh._isSelRingBar) {
      mesh.userData = { ...metaPayload };
    }
  });
  return root;
}


export function makeGunTurretMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.gun_turret || faction.structures.turret;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.gunTurret, 0.13, 0.05);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('gunTurret');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;

  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('gtb', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
    box.castShadow = true;
    const boxMaterial = new THREE.MeshStandardMaterial();
    boxMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      boxMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    box.material = boxMaterial;
    box.userData = { ...metaPayload };
    return box;
  };
  const addCyl = function addCyl(diameterTop, diameterBottom, height, color, emissiveColor, x, y, z, tess = 8) {
    const cylinder = mkCylinder('gtc', diameterTop, diameterBottom, height, tess);
    cylinder.position.set(x, y, z);
    root.add(cylinder);
    cylinder.castShadow = true;
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    cylinderMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      cylinderMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    cylinder.material = cylinderMaterial;
    cylinder.userData = { ...metaPayload };
    return cylinder;
  };

  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2;
    const loopX = Math.sin(angle) * 2.1;
    const loopZ = Math.cos(angle) * 2.1;
    const bagBox = addBox(1.2, 0.55, 0.55, 0x5a4a2a, 0x2a1f0a, loopX, 0.28, loopZ);
    bagBox.rotation.y = angle;
  }
  addBox(3.2, 0.18, 3.2, 0x2a2218, 0, 0, 0.09, 0);
  [-1.4, 1.4].forEach((x) => {
    [-1.4, 1.4].forEach((z) => {
      addCyl(0.14, 0.16, 0.85, 0x3a3228, 0, x, 0.48, z, 6);
    });
  });

  addCyl(0.7, 0.85, 0.75, 0x1e2218, 0, 0, 0.75, 0, 12);

  const turretNode = mkGroup('gtturret');
  root.add(turretNode);
  turretNode.position.set(0, 1.22, 0);

  const housingMat = new THREE.MeshStandardMaterial();
  housingMat.color = config.diffuse.clone();
  housingMat.emissive = config.emissive.clone();

  const housing = mkBox('gthouse', 1.6, 0.65, 1.4);
  turretNode.add(housing);
  housing.castShadow = true;
  housing.material = housingMat;
  housing.userData = { ...metaPayload };

  const frontPlate = mkBox('gtfp', 1.6, 0.55, 0.22);
  frontPlate.position.set(0, 0.05, 0.72);
  frontPlate.rotation.x = 0.35;
  turretNode.add(frontPlate);
  frontPlate.castShadow = true;
  const frontPlateMaterial = new THREE.MeshStandardMaterial();
  frontPlateMaterial.color = new THREE.Color(0.15, 0.18, 0.10);
  frontPlateMaterial.emissive = new THREE.Color(0.04, 0.06, 0.01);
  frontPlate.material = frontPlateMaterial;
  frontPlate.userData = { ...metaPayload };

  [-0.85, 0.85].forEach((offsetX) => {
    const shield = mkBox('gtshield', 0.14, 0.52, 1.1);
    shield.position.set(offsetX, 0.04, 0.12);
    turretNode.add(shield);
    shield.castShadow = true;
    const shieldMaterial = new THREE.MeshStandardMaterial();
    shieldMaterial.color = new THREE.Color(0.10, 0.12, 0.08);
    shieldMaterial.emissive = new THREE.Color(0.02, 0.03, 0.01);
    shield.material = shieldMaterial;
    shield.userData = { ...metaPayload };
  });

  [-0.38, 0.38].forEach((offsetX) => {
    const jacket = mkCylinder('gtjacket', 0.22, 0.28, 2.4, 10);
    jacket.rotation.x = Math.PI / 2;
    jacket.position.set(offsetX, -0.02, 1.4);
    turretNode.add(jacket);
    jacket.castShadow = true;
    const jacketMaterial = new THREE.MeshStandardMaterial();
    jacketMaterial.color = new THREE.Color(0.08, 0.08, 0.08);
    jacket.material = jacketMaterial;
    const support = mkCylinder('gtsupp', 0.28, 0.22, 0.22, 8);
    support.rotation.x = Math.PI / 2;
    support.position.set(offsetX, -0.02, 2.56);
    turretNode.add(support);
    support.castShadow = true;
    const supportMaterial = new THREE.MeshStandardMaterial();
    supportMaterial.color = new THREE.Color(0.06, 0.06, 0.06);
    support.material = supportMaterial;
    const muzzle = mkSphere('gtmuzzle_' + offsetX, 0.20, 12);
    muzzle.position.set(offsetX, -0.02, 2.7);
    turretNode.add(muzzle);
    const muzzleMaterial = new THREE.MeshBasicMaterial();
    muzzleMaterial.color = new THREE.Color(0.6, 0.3, 0);
    muzzleMaterial.opacity = 0;
    muzzleMaterial.transparent = true;
    muzzle.material = muzzleMaterial;
    if (offsetX < 0) {
      root._muzzleMatL = muzzleMaterial;
    } else {
      root._muzzleMatR = muzzleMaterial;
    }
  });

  const ammoBox = mkBox('gtammo', 0.55, 0.42, 0.45);
  ammoBox.position.set(-0.62, 0.38, -0.35);
  turretNode.add(ammoBox);
  const ammoBoxMaterial = new THREE.MeshStandardMaterial();
  ammoBoxMaterial.color = new THREE.Color(0.25, 0.20, 0.08);
  ammoBoxMaterial.emissive = new THREE.Color(0.06, 0.05, 0.01);
  ammoBox.material = ammoBoxMaterial;
  ammoBox.userData = { ...metaPayload };

  const stripe = mkBox('gtstripe', 3.2, 0.04, 0.35);
  stripe.position.set(0, 0.19, -1.35);
  root.add(stripe);
  const stripeMaterial = new THREE.MeshBasicMaterial();
  stripeMaterial.color = new THREE.Color(0.9, 0.6, 0.0);
  stripeMaterial.opacity = 0.7;
  stripeMaterial.transparent = true;
  stripe.material = stripeMaterial;
  stripe.userData.pickable = false;

  root._turret = turretNode;
  const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS.gunTurret, 0.13, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;

  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  return root;
}


export function makeConfigStructureMesh(type, position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction?.structures?.[type];
  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    if (root) {
      root.position.copy(position);
      const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS[type] ?? 3.5, 0.14, 0.05);
      root._ring = ring;
      root._ringMat = ring._material;
      if (scene._registerShadows) scene._registerShadows(root);
      childMeshes(root).forEach((mesh) => {
        if (!mesh._isSelRingBar) {
          mesh.userData = { ...metaPayload };
        }
      });
      return root;
    }
  }
  return _makeProceduralStructureMesh(type, position, teamKey, metaPayload);
}


export function _makeProceduralStructureMesh(type, position, teamKey, metaPayload) {
  const root = mkGroup(`struct_${type}`);
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  const mat = new THREE.MeshStandardMaterial();
  mat.color = config.diffuse.clone();
  mat.emissive = config.emissive.clone();
  const darkMat = getMat(0x222222);
  const addBox = function addBox(w, h, d, material, x, y, z) {
    const box = mkBox('sb', w, h, d);
    box.position.set(x, y, z);
    root.add(box);
    box.material = material;
    box.castShadow = true;
    box.userData = { ...metaPayload };
    return box;
  };

  if (type === 'mines') {
    addBox(2.6, 0.14, 2.6, darkMat, 0, 0.08, 0);
    for (let i = 0; i < 5; i += 1) {
      const mx = (Math.random() - 0.5) * 1.8;
      const mz = (Math.random() - 0.5) * 1.8;
      const mine = mkCylinder('mine', 0.5, 0.5, 0.24, 8);
      mine.position.set(mx, 0.24, mz);
      root.add(mine);
      mine.material = darkMat;
      mine.userData = { ...metaPayload };
      const spike = mkCylinder('spike', 0, 0.08, 0.28, 8);
      spike.position.set(mx, 0.5, mz);
      root.add(spike);
      spike.material = getMat(0x888888);
      spike.userData = { ...metaPayload };
    }
  } else {
    const small = type === 'thermo_generator' || type === 'plasma_generator';
    const w = small ? 3.2 : 4.5;
    const h = small ? 2.2 : 3.2;
    addBox(w, 0.4, w, darkMat, 0, 0.2, 0);
    addBox(w * 0.7, h, w * 0.7, mat, 0, 0.2 + h / 2, 0);
    const core = mkSphere('core', 0.7, 8);
    core.position.set(0, 0.2 + h + 0.35, 0);
    root.add(core);
    const coreMat = new THREE.MeshBasicMaterial();
    coreMat.color = new THREE.Color(0, 0.67, 0.27);
    core.material = coreMat;
    core.userData = { ...metaPayload };
    root._coreGlowMat = coreMat;
    root._meter = core;
  }

  const ring = makeSquareSelRing(root, STRUCTURE_BOUNDS[type] ?? 3.5, 0.14, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;
  if (scene._registerShadows) scene._registerShadows(root);
  return root;
}
