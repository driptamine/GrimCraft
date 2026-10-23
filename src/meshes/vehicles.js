import * as THREE from 'three';
import { getMat } from '../mat-cache.js';
import { _instantiateFromContainer } from '../model-upload.js';
import { AIRFIELD_BOUNDS, TEAM_COLOR, scene } from '../scene.js';
import {
  descendants,
  mkBox,
  mkCylinder,
  mkGroup,
  mkSphere,
  mkTorus,
} from '../three-helpers.js';
import { _factionBucket } from './common.js';
import { makeSquareSelRing } from './hud.js';


export function makeApcMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.mechanized || faction.structures.apc;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const turretNode = descendants(root).find((n) => n.name.toLowerCase().includes('turret')) || root;
    root._turret = turretNode;
    root._laserTip = null;
    root._laserTipMat = null;
    const selectionMaterial = new THREE.MeshBasicMaterial();
    selectionMaterial.color = new THREE.Color(0, 1, 0.53);
    selectionMaterial.opacity = 0;
    selectionMaterial.transparent = true;
    const selectionRing = mkTorus('apcselring', 7.0, 0.12, 32);
    selectionRing.position.set(0, 0.08, 0);
    root.add(selectionRing);
    selectionRing.material = selectionMaterial;
    selectionRing.visible = false;
    selectionRing.visible = false;
    root._selDisc = selectionRing;
    root._selMat = selectionMaterial;
    root._ring = selectionRing;
    root._ringMat = selectionMaterial;
    if (scene._registerShadows) {
      scene._registerShadows(root);
    }
    return root;
  }

  const root = mkGroup('apc');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('apcb', width, height, depth);
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
    const cylinder = mkCylinder('apcc', diameterTop, diameterBottom, height, 10);
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
  addBox(3.5, 1.4, 5.5, 0x1a3020, 0, 0, 0.7, 0);
  const hullTop = addBox(2.8, 1.0, 3.5, 0x223828, 0, 1.7, 0.5);
  const hullTopMaterial = new THREE.MeshStandardMaterial();
  hullTopMaterial.color = config.diffuse.clone();
  hullTopMaterial.emissive = config.emissive.clone();
  hullTop.material = hullTopMaterial;

  addBox(3.6, 0.5, 1, 0x1a2a1a, 0, 0, 1.35, -2.5);
  [-1.6, 1.6].forEach((x) => {
    addCyl(0.6, 0.6, 5.5, 0x111111, 0, x, 0.5, 0).rotation.z = Math.PI / 2;
    addCyl(0.5, 0.5, 5.5, 0x222222, 0, x, 0.5, 0).rotation.z = Math.PI / 2;
  });
  const turretNode = mkGroup('apc_turret');
  root.add(turretNode);
  turretNode.position.set(0, 2.3, 0.5);
  const turretHead = mkBox('apcth', 1.8, 0.7, 1.8);
  turretNode.add(turretHead);
  const turretHeadMaterial = new THREE.MeshStandardMaterial();
  turretHeadMaterial.color = config.diffuse.clone();
  turretHeadMaterial.emissive = config.emissive.clone();
  turretHead.material = turretHeadMaterial;
  turretNode.add(turretHead);
  turretHead.userData = { ...metaPayload };
  const cannon = mkCylinder('apccannon', 0.12, 0.18, 2.2, 8);
  cannon.rotation.x = Math.PI / 2;
  cannon.position.set(0, 0.1, 1.3);
  turretNode.add(cannon);
  const cannonMaterial = new THREE.MeshStandardMaterial();
  cannonMaterial.color = new THREE.Color(0.1, 0.1, 0.1);
  cannon.material = cannonMaterial;
  const tip = mkSphere('apctip', 0.22, 12);
  tip.position.set(0, 0.1, 2.4);
  turretNode.add(tip);
  const tipMaterial = new THREE.MeshStandardMaterial();
  tipMaterial.color = new THREE.Color(0, 1, 0.4);
  tipMaterial.emissive = new THREE.Color(0, 0.67, 0.27);
  tip.material = tipMaterial;
  root._laserTip = tip;
  root._laserTipMat = tipMaterial;
  root._turret = turretNode;
  const selectionMaterial = new THREE.MeshBasicMaterial();
  selectionMaterial.color = new THREE.Color(0, 1, 0.53);
  selectionMaterial.opacity = 0;
  selectionMaterial.transparent = true;
  const selectionRing = mkTorus('apcselring', 7.0, 0.12, 32);
  selectionRing.rotation.x = 0;
  selectionRing.position.set(0, 0.08, 0);
  root.add(selectionRing);
  selectionRing.material = selectionMaterial;
  selectionRing.visible = false;
  selectionRing.visible = false;
  root._selDisc = selectionRing;
  root._selMat = selectionMaterial;
  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  return root;
}


export function makeVehicleMesh(model, position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction?.vehicles?.[model];
  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const turretNode = descendants(root).find((n) => n.name.toLowerCase().includes('turret')) || root;
    root._turret = turretNode;
    root._laserTip = null;
    root._laserTipMat = null;
    const selectionMaterial = new THREE.MeshBasicMaterial();
    selectionMaterial.color = new THREE.Color(0, 1, 0.53);
    selectionMaterial.opacity = 0;
    selectionMaterial.transparent = true;
    const selectionRing = mkTorus('vselring', 5.0, 0.12, 32);
    selectionRing.rotation.x = 0;
    selectionRing.position.set(0, 0.08, 0);
    root.add(selectionRing);
    selectionRing.material = selectionMaterial;
    selectionRing.visible = false;
    selectionRing.visible = false;
    root._selDisc = selectionRing;
    root._selMat = selectionMaterial;
    if (scene._registerShadows) {
      scene._registerShadows(root);
    }
    return root;
  }

  const root = mkGroup('vehicle');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  const box = mkBox('vbox', 2.2, 1.2, 3.4);
  box.position.y = 0.6;
  root.add(box);
  box.material = getMat('vboxmat', {
    diffuseColor: new THREE.Color('#' + config.diffuse.toString(16).padStart(6, '0')),
    emissiveColor: config.emissive,
    specularColor: new THREE.Color(0, 0, 0),
  });
  box.userData = { ...metaPayload };
  const top = mkBox('vturret', 1.0, 0.6, 1.4);
  top.position.set(0, 1.3, -0.2);
  root.add(top);
  top.material = getMat('vturretmat', {
    diffuseColor: new THREE.Color('#' + config.diffuse.toString(16).padStart(6, '0')),
    emissiveColor: config.emissive,
    specularColor: new THREE.Color(0, 0, 0),
  });
  top.userData = { ...metaPayload };
  root._turret = top;
  return root;
}


export function makeAirfieldMesh(position, teamKey, metaPayload) {
  const faction = _factionBucket(teamKey, metaPayload);
  const container = faction.structures.airfield || faction.structures.mechanized;

  if (container) {
    const root = _instantiateFromContainer(container, metaPayload);
    root.position.copy(position);
    const ring = makeSquareSelRing(root, AIRFIELD_BOUNDS, 0.16, 0.05);
    root._ring = ring;
    root._ringMat = ring._material;
    if (scene._registerShadows) scene._registerShadows(root);
    return root;
  }

  const root = mkGroup('airfield');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;

  const addBox = function addBox(width, height, depth, color, emissiveColor, x, y, z) {
    const box = mkBox('afb', width, height, depth);
    box.position.set(x, y, z);
    root.add(box);
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
    const cylinder = mkCylinder('afc', diameterTop, diameterBottom, height, tess);
    cylinder.position.set(x, y, z);
    root.add(cylinder);
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    cylinderMaterial.color = new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emissiveColor) {
      cylinderMaterial.emissive = new THREE.Color('#' + emissiveColor.toString(16).padStart(6, '0'));
    }

    cylinder.material = cylinderMaterial;
    cylinder.userData = { ...metaPayload };
    return cylinder;
  };

  addBox(14, 0.22, 7, 0x1a1a1f, 0, 0, 0.11, 0);
  addBox(12, 0.01, 0.18, 0xddcc00, 0xaa9900, 0, 0.22, 0);
  [-3.2, 3.2].forEach((z) => {
    const stripe = addBox(12, 0.01, 0.12, 0xffffff, 0, 0, 0.22, z);
    const stripeMaterial = new THREE.MeshStandardMaterial();
    stripeMaterial.color = config.diffuse.clone();
    stripeMaterial.emissive = config.emissive.clone();
    stripe.material = stripeMaterial;
  });
  [-5.8, 5.8].forEach((x) => {
    [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].forEach((z) => {
      addBox(0.9, 0.01, 0.32, 0xffffff, 0xaaaaaa, x, 0.22, z);
    });
  });

  addBox(1.8, 0.28, 1.8, 0x2a2a35, 0, 0, 0.25, -4.8);
  addBox(1.4, 3.0, 1.4, 0x363650, 0, 0, 1.78, -4.8);
  addBox(2.4, 0.5, 2.4, 0x252540, 0, 0, 3.53, -4.8);
  addBox(2.2, 0.65, 2.2, 0x1c2040, 0x080820, 0, 4.05, -4.8);
  addBox(2.25, 0.3, 2.25, 0x332200, 0x664400, 0, 4.05, -4.8);
  addCyl(0.05, 0.05, 1.8, 0x888888, 0, 0, 5.25, -4.8);
  const beacon = mkSphere('afbeacon', 0.22, 5);
  beacon.position.set(0, 6.18, -4.8);
  root.add(beacon);
  const beaconMaterial = new THREE.MeshStandardMaterial();
  beaconMaterial.color = new THREE.Color(1, 0.3, 0.1);
  beaconMaterial.emissive = new THREE.Color(1, 0.1, 0.0);
  beacon.material = beaconMaterial;
  root._beacon = beacon;
  root._beaconMat = beaconMaterial;

  addBox(5.5, 0.18, 3.8, 0x222228, 0, -5.5, 0.09, 1.5);
  addBox(0.18, 2.8, 3.8, 0x2a2a35, 0, -8.4, 1.4, 1.5);
  addBox(5.5, 0.18, 0.18, 0x2a2a35, 0, -5.5, 2.8, -0.3);
  [-0.55, 0, 0.55].forEach((z) => {
    addBox(5.5, 0.32, 1.5, 0x252535, 0, -5.5, 2.88, z * 2.2);
  });
  [-0.3, 3.3].forEach((z) => {
    addBox(0.18, 2.8, 3.8, 0x242430, 0, -5.5, 1.4, z);
  });

  [0.8, -0.8].forEach((z) => {
    addCyl(0.7, 0.7, 2.0, 0x33332a, 0, -9.4, 1.0, z, 10);
    addCyl(0.72, 0.72, 0.14, 0x444438, 0, -9.4, 2.1, z, 10);
  });
  addBox(0.1, 0.1, 1.8, 0x555548, 0, -9.4, 0.95, 0);

  const parkedRoot = mkGroup('parked_jet');
  root.add(parkedRoot);
  parkedRoot.position.set(-5.5, 0.22, 1.5);
  parkedRoot.rotation.y = Math.PI / 2;
  parkedRoot.scale.setScalar(0.55);
  _buildJetGeometry(parkedRoot, {
    diffuse: new THREE.Color('#1a2a3a'),
    emissive: new THREE.Color('#112233'),
  }, metaPayload);

  const ring = makeSquareSelRing(root, AIRFIELD_BOUNDS, 0.16, 0.05);
  root._ring = ring;
  root._ringMat = ring._material;

  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  return root;
}


export function _buildJetGeometry(root, config, metaPayload) {
  const bodyColor = ('#' + config.diffuse.getHexString());
  const emissiveColor = ('#' + config.emissive.getHexString());
  const material = function material(color, emis, alpha) {
    const jetMaterial = new THREE.MeshStandardMaterial();
    jetMaterial.color = (typeof color === 'string')
      ? new THREE.Color(color)
      : new THREE.Color('#' + color.toString(16).padStart(6, '0'));
    if (emis) {
      jetMaterial.emissive = (typeof emis === 'string')
        ? new THREE.Color(emis)
        : new THREE.Color('#' + emis.toString(16).padStart(6, '0'));
    }

    if (alpha !== undefined) {
      jetMaterial.opacity = alpha;
      jetMaterial.transparent = true;
    }
    return jetMaterial;
  };
  const box = function box(width, height, depth, color, emis, x, y, z, rx = 0, ry = 0, rz = 0) {
    const jetBox = mkBox('jb', width, height, depth);
    jetBox.position.set(x, y, z);
    jetBox.rotation.set(rx, ry, rz);
    root.add(jetBox);
    jetBox.userData.pickable = false;
    jetBox.material = material(color, emis);
    if (metaPayload) {
      jetBox.userData = { ...metaPayload };
    }
    return jetBox;
  };
  const cyl = function cyl(diameterTop, diameterBottom, height, color, emis, x, y, z, rx = 0, ry = 0, rz = 0, tess = 8) {
    const cylinder = mkCylinder('jc', diameterTop, diameterBottom, height, tess);
    cylinder.position.set(x, y, z);
    cylinder.rotation.set(rx, ry, rz);
    root.add(cylinder);
    cylinder.userData.pickable = false;
    cylinder.material = material(color, emis);
    if (metaPayload) {
      cylinder.userData = { ...metaPayload };
    }
    return cylinder;
  };

  box(0.55, 0.42, 5.2, bodyColor, 0, 0, 0, 0);
  box(0.38, 0.28, 1.6, bodyColor, 0, 0, 0, 2.8);
  cyl(0.0, 0.26, 0.8, 0x222233, 0, 0, 0, 3.6, Math.PI / 2, 0, 0, 6);
  box(0.36, 0.24, 0.9, 0x0a1a2a, 0x001830, 0, 0.28, 1.8, 0, 0, 0);
  box(0.28, 0.16, 0.72, 0x0d2a44, 0x002244, 0, 0.38, 1.8);

  const wingAngle = 0.38;
  [
    [-1, 1],
    [1, -1],
  ].forEach(([signX]) => {
    const wingPlane = mkBox('jwing', 1.9, 0.06, 2.8);
    wingPlane.position.set(signX * 1.05, -0.05, -0.4);
    wingPlane.rotation.set(0, signX * wingAngle * -1, 0);
    root.add(wingPlane);
    wingPlane.userData.pickable = false;
    wingPlane.material = material(bodyColor, emissiveColor);
    if (metaPayload) {
      wingPlane.userData = { ...metaPayload };
    }
    const wingTip = mkBox('jwt', 0.4, 0.05, 1.0);
    wingTip.position.set(signX * 1.92, -0.04, -1.1);
    root.add(wingTip);
    wingTip.userData.pickable = false;
    wingTip.material = material(0x222222, 0);
    if (metaPayload) {
      wingTip.userData = { ...metaPayload };
    }
    const navLight = mkSphere('jntl', 0.12, 4);
    navLight.position.set(signX * 2.1, -0.02, -1.5);
    root.add(navLight);
    navLight.userData.pickable = false;
    const navLightMaterial = new THREE.MeshBasicMaterial();
    navLightMaterial.color = (signX < 0)
      ? new THREE.Color(1, 0.1, 0.1)
      : new THREE.Color(0.1, 1, 0.1);
    navLight.material = navLightMaterial;
  });

  [
    [-1, 1],
    [1, -1],
  ].forEach(([signX]) => {
    const canardFin = mkBox('jcf', 0.55, 0.04, 0.55);
    canardFin.position.set(signX * 0.42, 0.0, 2.1);
    canardFin.rotation.set(0, signX * 0.2, 0);
    root.add(canardFin);
    canardFin.userData.pickable = false;
    canardFin.material = material(bodyColor, 0);
    if (metaPayload) {
      canardFin.userData = { ...metaPayload };
    }
  });

  [-0.55, 0.55].forEach((engineX) => {
    cyl(0.22, 0.28, 1.8, 0x222222, 0, engineX, -0.1, -1.0, Math.PI / 2, 0, 0, 10);
    cyl(0.26, 0.24, 0.12, 0x111111, 0, engineX, -0.1, 0.0, Math.PI / 2, 0, 0, 10);
    const nozzle = mkCylinder('jnoz', 0.14, 0.22, 0.55, 10);
    nozzle.position.set(engineX, -0.1, -2.05);
    nozzle.rotation.x = Math.PI / 2;
    root.add(nozzle);
    nozzle.userData.pickable = false;
    const nozzleMaterial = new THREE.MeshStandardMaterial();
    nozzleMaterial.color = new THREE.Color(0.08, 0.08, 0.08);
    nozzleMaterial.emissive = new THREE.Color(0.04, 0.04, 0.04);
    nozzle.material = nozzleMaterial;
    const flame = mkSphere('jflame', 0.28, 5);
    flame.position.set(engineX, -0.1, -2.4);
    flame.scale.z = 2.2;
    root.add(flame);
    flame.userData.pickable = false;
    const flameMaterial = new THREE.MeshBasicMaterial();
    flameMaterial.color = new THREE.Color(1, 0.3, 0.0);
    flameMaterial.opacity = 0.85;
    flameMaterial.transparent = true;
    flame.material = flameMaterial;
    root['_flame_' + engineX] = flame;
    root['_flameMat_' + engineX] = flameMaterial;
  });

  const verticalFin = mkBox('jvfin', 0.06, 0.7, 1.4);
  verticalFin.position.set(0, 0.38, -1.6);
  root.add(verticalFin);
  verticalFin.userData.pickable = false;
  verticalFin.material = material(0x222222, 0);
  if (metaPayload) {
    verticalFin.userData = { ...metaPayload };
  }

  [-1.1, -0.55, 0.55, 1.1].forEach((missileX, index) => {
    const missile = mkCylinder('jhp', 0.06, 0.08, 0.7, 6);
    missile.position.set(missileX, -0.14, -0.2 + (index % 2) * 0.3);
    missile.rotation.x = Math.PI / 2;
    root.add(missile);
    missile.userData.pickable = false;
    const hardpointMaterial = new THREE.MeshStandardMaterial();
    hardpointMaterial.color = new THREE.Color(0.55, 0.55, 0.45);
    missile.material = hardpointMaterial;
  });
}


export function makeJetMesh(position, teamKey, metaPayload) {
  const root = mkGroup('jet');
  root.position.copy(position);
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.blue;
  _buildJetGeometry(root, config, metaPayload);

  const selectionRing = makeSquareSelRing(root, 3.5, 0.15, -0.3);
  root._selRing = selectionRing;
  root._selMat = selectionRing._material;

  if (scene._registerShadows) {
    scene._registerShadows(root);
  }
  return root;
}
