import * as THREE from 'three';
import { scene, world, TEAM_COLOR, PLAYER } from './scene.js';
import { makeSoldierMesh } from './meshes.js';
import { _applyGrenadierVisuals, _applyPlasmaVisuals, _applySuperiorVisuals } from './entities.js';
import { mkTorus, mkGroup, disposeObj, childMeshes, descendants } from './three-helpers.js';
import { loadGltf, instantiateGltf } from './gltf-models.js';

export let _assetContainer = null;
export let _customModelScale = 1.0;
export let _customModelName = '';
export let _customModelOffsetX = 0;
export let _customModelOffsetY = 0;
export let _customModelOffsetZ = 0;
export let _customModelRotX = 0;
export let _customModelRotY = 0;
export let _customModelRotZ = 0;
export let _autoOffsetX = 0;
export let _autoOffsetY = 0;
export let _autoOffsetZ = 0;

export let _animSlotNames = { idle: null, run: null, shoot: null, shootMove: null };
export let _modelAnimGroupNames = [];

export function _buildAnimList() {
  const sectionElement = document.getElementById('anim-list-section');
  const scrollContainer = document.getElementById('anim-list-scroll');
  if (!scrollContainer) {
    return;
  }
  scrollContainer.innerHTML = '';

  if (!_modelAnimGroupNames.length) {
    sectionElement.style.display = 'none';
    return;
  }
  sectionElement.style.display = 'block';

  _modelAnimGroupNames.forEach((name, index) => {
    const listItem = document.createElement('div');
    listItem.className = 'anim-list-item';
    listItem.id = `anim-item-${index}`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'anim-list-name';
    nameSpan.title = name;
    nameSpan.textContent = name.length > 22 ? `${name.slice(0, 20)}…` : name;
    listItem.appendChild(nameSpan);

    ['idle', 'run', 'shoot', 'shootMove'].forEach((slot) => {
      const button = document.createElement('button');
      button.className = 'anim-assign-btn';
      button.id = `anim-assign-${index}-${slot}`;
      button.textContent = slot === 'idle' ? '💤' : slot === 'run' ? '🏃' : slot === 'shoot' ? '🔫' : '🎯';
      button.title = slot === 'idle' ? 'Assign to IDLE' : slot === 'run' ? 'Assign to RUN' : slot === 'shoot' ? 'Assign to SHOOT' : 'Assign to MOVE-FIRE (firing while moving)';
      button.onclick = () => assignAnimFromList(index, slot);
      listItem.appendChild(button);
    });

    scrollContainer.appendChild(listItem);
  });

  _refreshAnimListHighlights();
}

export function _refreshAnimListHighlights() {
  _modelAnimGroupNames.forEach((name, index) => {
    ['idle', 'run', 'shoot', 'shootMove'].forEach((slot) => {
      const button = document.getElementById(`anim-assign-${index}-${slot}`);
      if (!button) {
        return;
      }
      button.className = 'anim-assign-btn';
      if (_animSlotNames[slot] === name) {
        button.classList.add(`assigned-${slot}`);
      }
    });
  });
}

export function assignAnimFromList(animIdx, slotName) {
  const name = _modelAnimGroupNames[animIdx];
  if (!name) {
    return;
  }
  _animSlotNames[slotName] = name;
  _refreshAnimListHighlights();
  _replaceExistingSoldierMeshes();
  setAnimStatus(`✔ ${name} → ${slotName.toUpperCase()}`);
  setTimeout(() => setAnimStatus(''), 2000);
}

export function toggleModelPanel() {
  const panel = document.getElementById('model-upload-panel');
  panel.classList.toggle('open');
}

export function handleModelDrop(e) {
  e.preventDefault();
  const dropZone = document.getElementById('model-drop-zone');
  if (dropZone) {
    dropZone.classList.remove('dragover');
  }
  if (e.dataTransfer.files.length) {
    handleModelFiles(e.dataTransfer.files);
  }
}

export function setAnimStatus(msg, isErr) {
  const element = document.getElementById('anim-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.style.color = isErr ? '#ff6644' : (msg ? '#ffe066' : 'rgba(80,200,255,0.5)');
}

function _readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function _readAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function _buildDataURI(files) {
  const mainFile = files.find((file) => /\.(glb|gltf|fbx)$/i.test(file.name));
  const extension = mainFile.name.split('.').pop().toLowerCase();
  if (extension === 'fbx') {
    return { uri: await _readAsDataURL(mainFile), extension: '.fbx' };
  }
  if (extension === 'glb') {
    const buffer = await _readAsBuffer(mainFile);
    const uri = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(new Blob([buffer], { type: 'model/gltf-binary' }));
    });
    return { uri, extension: '.glb' };
  }
  const companions = {};
  for (const file of files) {
    if (file === mainFile) {
      continue;
    }
    companions[file.name.toLowerCase()] = file;
    companions[file.name.split(/[/\\]/).pop().toLowerCase()] = file;
  }
  const gltf = JSON.parse(await mainFile.text());
  if (gltf.buffers) {
    for (const buffer of gltf.buffers) {
      if (buffer.uri && !buffer.uri.startsWith('data:')) {
        const key = buffer.uri.split(/[/\\]/).pop().toLowerCase();
        const companionFile = companions[key] || companions[buffer.uri.toLowerCase()];
        if (!companionFile) {
          throw new Error(`Missing file: "${buffer.uri}" — select it together with the .gltf`);
        }
        buffer.uri = await _readAsDataURL(companionFile);
      }
    }
  }
  if (gltf.images) {
    for (const image of gltf.images) {
      if (image.uri && !image.uri.startsWith('data:')) {
        const key = image.uri.split(/[/\\]/).pop().toLowerCase();
        const companionFile = companions[key] || companions[image.uri.toLowerCase()];
        if (companionFile) {
          image.uri = await _readAsDataURL(companionFile);
        }
      }
    }
  }
  const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(gltf))));
  return { uri: `data:model/gltf+json;base64,${jsonB64}`, extension: '.gltf' };
}

export async function handleModelFiles(fileList) {
  const files = Array.from(fileList);
  const mainFile = files.find((file) => /\.(glb|gltf|fbx)$/i.test(file.name));
  if (!mainFile) {
    setModelStatus('ERROR: no .glb / .gltf / .fbx file found', 'err');
    return;
  }

  setModelStatus('LOADING…', 'loading');

  if (_assetContainer) {
    try {
      _assetContainer.dispose();
    } catch (error) {
      // ignore
    }
    _assetContainer = null;
  }
  _animSlotNames = { idle: null, run: null, shoot: null, shootMove: null };
  _modelAnimGroupNames = [];

  try {
    const { uri, extension } = await _buildDataURI(files);

    const container = await loadGltf(uri, extension);
    _assetContainer = container;

    const isMeleeName = (lowerName) => /(melee|attack|slash|swing|punch|stab|combat|knife|damage|thrown)/.test(lowerName);
    _modelAnimGroupNames = container.animations
      .map((clip) => clip.name)
      .filter((name) => !isMeleeName(name.toLowerCase()));

    const isFiringName = (lowerName) => /(fir|shoot|gun|weapon)/.test(lowerName) && !lowerName.startsWith('vis_');
    const isSituational = (lowerName) => /^(vis_|sync_|die_|thrown_|sacrifice|cower|flag_plant|capture_)/.test(lowerName);

    _modelAnimGroupNames.forEach((name) => {
      const lowerName = name.toLowerCase();
      if (isSituational(lowerName)) return;
      const isFiring = isFiringName(lowerName);
      const isGenericIdleFiring = isFiring && /^(idle|stand)_?(fir|shoot)/.test(lowerName);
      const isGenericMoveFiring = isFiring && /^(move|run|walk|jog|strafe)_?(fir|shoot)/.test(lowerName);
      const isGenericIdle = !isFiring && /^(idle|stand)/.test(lowerName);
      const isGenericRun = !isFiring && /^(run|walk|jog|move_run)/.test(lowerName);
      if (!_animSlotNames.shootMove && isGenericMoveFiring) {
        _animSlotNames.shootMove = name;
      } else if (!_animSlotNames.shoot && isGenericIdleFiring) {
        _animSlotNames.shoot = name;
      } else if (!_animSlotNames.idle && isGenericIdle) {
        _animSlotNames.idle = name;
      } else if (!_animSlotNames.run && isGenericRun) {
        _animSlotNames.run = name;
      }
    });

    _modelAnimGroupNames.forEach((name) => {
      const lowerName = name.toLowerCase();
      if (isSituational(lowerName)) return;
      const isFiring = isFiringName(lowerName);
      const isMelee = isMeleeName(lowerName);
      const isIdleFiring = isFiring && /(idle|stand|hold)/.test(lowerName);
      const isMoveFiring = isFiring && /(move|run|walk|jog|strafe)/.test(lowerName);
      const isIdle = !isFiring && !isMelee && /(idle|stand)/.test(lowerName);
      const isRun = !isFiring && !isMelee && /(run|walk|jog|move)/.test(lowerName);
      if (!_animSlotNames.shootMove && isMoveFiring) {
        _animSlotNames.shootMove = name;
      } else if (!_animSlotNames.shoot && isIdleFiring) {
        _animSlotNames.shoot = name;
      } else if (!_animSlotNames.shoot && isFiring && !isMelee) {
        _animSlotNames.shoot = name;
      } else if (!_animSlotNames.idle && isIdle) {
        _animSlotNames.idle = name;
      } else if (!_animSlotNames.run && isRun) {
        _animSlotNames.run = name;
      }
    });

    if (_modelAnimGroupNames.length > 0) {
      const firstName = _modelAnimGroupNames[0];
      if (!_animSlotNames.idle) {
        _animSlotNames.idle = firstName;
      }
      if (!_animSlotNames.run) {
        _animSlotNames.run = _modelAnimGroupNames[1] || firstName;
      }
      if (!_animSlotNames.shoot) {
        const candidate = _modelAnimGroupNames[2] || firstName;
        _animSlotNames.shoot = /(melee|attack|slash|swing|punch|stab|combat)/i.test(candidate) ? null : candidate;
      }
    }

    _buildAnimList();

    let _customModelScale_raw = 1.0;
    try {
      const tempInst = instantiateGltf(container);
      const measureBox = new THREE.Box3();
      tempInst.rootNodes.forEach((rootNode) => {
        measureBox.expandByObject(rootNode);
      });
      tempInst.dispose();

      const modelHeight = measureBox.max.y - measureBox.min.y;
      _customModelScale_raw = (isFinite(modelHeight) && modelHeight > 0.001) ? (1.85 / modelHeight) : 1.0;

      _autoOffsetX = isFinite(measureBox.min.x) ? -((measureBox.min.x + measureBox.max.x) / 2) : 0;
      _autoOffsetY = isFinite(measureBox.min.y) ? -measureBox.min.y : 0;
      _autoOffsetZ = isFinite(measureBox.min.z) ? -((measureBox.min.z + measureBox.max.z) / 2) : 0;
    } catch (error) {
      const fallbackBox = new THREE.Box3();
      container.meshes.forEach((mesh) => {
        try {
          fallbackBox.expandByObject(mesh);
        } catch (error2) {
          // ignore
        }
      });
      const modelHeight = fallbackBox.max.y - fallbackBox.min.y;
      _customModelScale_raw = (isFinite(modelHeight) && modelHeight > 0.001) ? (1.85 / modelHeight) : 1.0;
    }
    _customModelOffsetX = 0;
    _customModelOffsetY = 0;
    _customModelOffsetZ = 0;
    ['x', 'y', 'z'].forEach((axis) => {
      const el = document.getElementById(`model-off-${axis}`);
      if (el) {
        el.value = 0;
      }
      const label = document.getElementById(`model-off-${axis}-val`);
      if (label) {
        label.textContent = '0.00';
      }
    });
    updateModelScale(_customModelScale_raw);

    const shortName = mainFile.name.length > 20 ? `${mainFile.name.slice(0, 17)}…` : mainFile.name;
    const modelInfoName = document.getElementById('mi-name');
    if (modelInfoName) {
      modelInfoName.textContent = shortName;
    }
    const modelInfoSize = document.getElementById('mi-size');
    if (modelInfoSize) {
      modelInfoSize.textContent = `${(mainFile.size / 1024).toFixed(1)} KB`;
    }
    const modelInfoElement = document.getElementById('model-loaded-info');
    if (modelInfoElement) {
      modelInfoElement.style.display = 'block';
    }

    const total = _modelAnimGroupNames.length;
    setModelStatus(total ? `MODEL LOADED — ${total} ANIM${total > 1 ? 'S' : ''}` : 'MODEL LOADED', 'ok');

    _replaceExistingSoldierMeshes();
  } catch (error) {
    setModelStatus(`LOAD ERROR — ${error.message || error}`, 'err');
  }
}

export function handleModelFile(file) {
  if (file) {
    handleModelFiles([file]);
  }
}

export function setModelStatus(msg, className) {
  const element = document.getElementById('model-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = className || '';
}

export function toggleSliderSection(name) {
  const sectionBody = document.getElementById(`slider-section-${name}`);
  const arrowElement = document.getElementById(`${name}-arrow`);
  if (!sectionBody) {
    return;
  }
  const isHidden = sectionBody.style.display === 'none';
  sectionBody.style.display = isHidden ? '' : 'none';
  if (arrowElement) {
    arrowElement.classList.toggle('collapsed', !isHidden);
  }
}

export function updateModelScale(value) {
  _customModelScale = Math.max(0.001, parseFloat(value) || 1);
  const inverseScale = 1 / _customModelScale;
  const scaleValue = document.getElementById('model-scale-val');
  if (scaleValue) {
    scaleValue.textContent = _customModelScale.toFixed(3);
  }
  const scaleNumber = document.getElementById('model-scale-num');
  if (scaleNumber) {
    scaleNumber.value = _customModelScale.toFixed(3);
  }
  const scaleSlider = document.getElementById('model-scale');
  if (scaleSlider) {
    scaleSlider.value = Math.round(Math.log10(_customModelScale) * 100);
  }
  if (_assetContainer && world) {
    const applyScale = (entityId) => {
      const mc = world.get(entityId, 'mesh');
      if (mc?.root?._isCustomModel) {
        mc.root.scale.setScalar(_customModelScale);
        if (mc.root._selDisc) {
          mc.root._selDisc.scale.setScalar(inverseScale);
        }
      }
    };
    world.query('soldier').forEach(applyScale);
    world.query('builder').forEach(applyScale);
  }
}

export function updateModelScaleFromSlider(sliderVal) {
  const scale = Math.pow(10, parseFloat(sliderVal) / 100);
  updateModelScale(scale);
}

export function updateModelScaleFromNum(numVal) {
  updateModelScale(numVal);
}

export function updateModelOffset(axis, value) {
  value = parseFloat(value);
  if (axis === 'x') {
    _customModelOffsetX = value;
  } else if (axis === 'y') {
    _customModelOffsetY = value;
  } else {
    _customModelOffsetZ = value;
  }
  const label = document.getElementById(`model-off-${axis}-val`);
  if (label) {
    label.textContent = value.toFixed(2);
  }
  if (world) {
    const applyOffset = (entityId) => {
      const mc = world.get(entityId, 'mesh');
      if (mc?.root?._isCustomModel && mc.root._pivot) {
        mc.root._pivot.position.set(
          _autoOffsetX + _customModelOffsetX,
          _autoOffsetY + _customModelOffsetY,
          _autoOffsetZ + _customModelOffsetZ,
        );
      }
    };
    world.query('soldier').forEach(applyOffset);
    world.query('builder').forEach(applyOffset);
  }
}

export function updateModelRotation(axis, value) {
  value = parseFloat(value);
  if (axis === 'x') {
    _customModelRotX = value;
  } else if (axis === 'y') {
    _customModelRotY = value;
  } else {
    _customModelRotZ = value;
  }
  const label = document.getElementById(`model-rot-${axis}-val`);
  if (label) {
    label.textContent = `${Math.round(value)}°`;
  }
  if (world) {
    const applyRotation = (entityId) => {
      const mc = world.get(entityId, 'mesh');
      if (mc?.root?._isCustomModel && mc.root._pivot) {
        mc.root._pivot.rotation.set(
          _customModelRotX * Math.PI / 180,
          _customModelRotY * Math.PI / 180,
          _customModelRotZ * Math.PI / 180,
        );
      }
    };
    world.query('soldier').forEach(applyRotation);
    world.query('builder').forEach(applyRotation);
  }
}

export function clearCustomModel() {
  if (_assetContainer) {
    try {
      _assetContainer.dispose();
    } catch (error) {
      // ignore
    }
    _assetContainer = null;
  }
  _customModelName = '';
  _customModelOffsetX = 0;
  _customModelOffsetY = 0;
  _customModelOffsetZ = 0;
  _autoOffsetX = 0;
  _autoOffsetY = 0;
  _autoOffsetZ = 0;
  _customModelRotX = 0;
  _customModelRotY = 0;
  _customModelRotZ = 0;
  _animSlotNames = { idle: null, run: null, shoot: null, shootMove: null };
  _modelAnimGroupNames = [];

  const listSection = document.getElementById('anim-list-section');
  if (listSection) {
    listSection.style.display = 'none';
  }
  const listScroll = document.getElementById('anim-list-scroll');
  if (listScroll) {
    listScroll.innerHTML = '';
  }

  ['x', 'y', 'z'].forEach((axis) => {
    const sliderElement = document.getElementById(`model-off-${axis}`);
    const valueLabel = document.getElementById(`model-off-${axis}-val`);
    if (sliderElement) {
      sliderElement.value = 0;
    }
    if (valueLabel) {
      valueLabel.textContent = '0.00';
    }
    const rotationSlider = document.getElementById(`model-rot-${axis}`);
    const rotationValueLabel = document.getElementById(`model-rot-${axis}-val`);
    if (rotationSlider) {
      rotationSlider.value = 0;
    }
    if (rotationValueLabel) {
      rotationValueLabel.textContent = '0°';
    }
  });
  setModelStatus('NO MODEL LOADED · USING DEFAULT', '');
  const loadedInfo = document.getElementById('model-loaded-info');
  if (loadedInfo) {
    loadedInfo.style.display = 'none';
  }
  const fileInput = document.getElementById('model-file-input');
  if (fileInput) {
    fileInput.value = '';
  }
  _replaceExistingSoldierMeshes();
}

export function _replaceExistingSoldierMeshes() {
  if (!world) {
    return;
  }
  world.query('soldier').forEach((soldierId) => {
    const soldier = world.get(soldierId, 'soldier');
    const mc = world.get(soldierId, 'mesh');
    if (!soldier || !mc) {
      return;
    }
    const squad = world.get(soldier.squadId, 'squad');
    if (!squad) {
      return;
    }

    const oldRoot = mc.root;
    const position = oldRoot.position.clone();
    const rotation = oldRoot.rotation.clone();

    childMeshes(oldRoot).forEach((mesh) => disposeObj(mesh));
    disposeObj(oldRoot);

    const newRoot = makeSoldierMesh(squad.team, { soldierEntityId: soldierId, squadEntityId: soldier.squadId });
    newRoot.position.copy(position);
    newRoot.rotation.copy(rotation);
    if (soldier.isGrenadier) {
      _applyGrenadierVisuals(newRoot);
    } else if (squad.projectileType === 'plasma') {
      _applyPlasmaVisuals(newRoot);
    }
    if (soldier.isSuperior) {
      _applySuperiorVisuals(newRoot);
    }
    mc.root = newRoot;
  });
}

export function _cloneCustomModel(teamKey, metaPayload) {
  const config = TEAM_COLOR[teamKey] || TEAM_COLOR.builder;
  const instance = instantiateGltf(_assetContainer);
  instance.animationGroups.forEach((animationGroup) => animationGroup.stop());
  const root = mkGroup('custom_soldier_root');
  root._isCustomModel = true;
  const pivot = mkGroup('custom_pivot');
  root.add(pivot);
  pivot.position.set(
    _autoOffsetX + _customModelOffsetX,
    _autoOffsetY + _customModelOffsetY,
    _autoOffsetZ + _customModelOffsetZ,
  );
  pivot.rotation.set(
    _customModelRotX * Math.PI / 180,
    _customModelRotY * Math.PI / 180,
    _customModelRotZ * Math.PI / 180,
  );
  instance.rootNodes.forEach((rootNode) => {
    pivot.add(rootNode);
    rootNode.visible = true;
  });
  childMeshes(pivot).forEach((mesh) => {
    mesh.userData.pickable = true;
    mesh.userData = { ...metaPayload };
    if (scene._registerShadows) {
      scene._registerShadows(mesh);
    }
  });
  root._pivot = pivot;
  root.scale.setScalar(_customModelScale);
  root._instanceData = instance;
  const bodyMat = new THREE.MeshStandardMaterial();
  bodyMat.color = config.diffuse.clone();
  bodyMat.emissive = config.emissive.clone();
  root._bodyMat = bodyMat;

  const selDisc = mkTorus('sel_custom', 1.5, 0.05, 32);
  selDisc.rotation.x = 0;
  selDisc.position.y = 0.05;
  root.add(selDisc);
  const inverseScale = _customModelScale > 0 ? 1 / _customModelScale : 1;
  selDisc.scale.setScalar(inverseScale);
  const selMat = new THREE.MeshBasicMaterial();
  selMat.color = new THREE.Color(0, 1, 0.53);
  selMat.opacity = 0;
  selMat.transparent = true;
  selDisc.material = selMat;
  selDisc.visible = false;
  selDisc.visible = false;
  selDisc.userData = { ...metaPayload };
  root._selDisc = selDisc;
  root._selMat = selMat;

  const _dummy = () => {
    const node = mkGroup('dummy');
    root.add(node);
    return node;
  };
  root._legL = _dummy();
  root._legR = _dummy();
  root._armL = _dummy();
  root._armR = _dummy();
  root._helmTopMesh = null;
  root._helmBrimMesh = null;

  root._animGroups = {};
  root._currentAnim = null;
  root._shootDone = false;

  ['idle', 'run', 'shoot', 'shootMove'].forEach((slot) => {
    const wantedName = _animSlotNames[slot];
    if (!wantedName) {
      return;
    }
    const animationGroup = instance.animationGroups.find((g) => g.name.startsWith(wantedName));
    if (animationGroup) {
      root._animGroups[slot] = animationGroup;
    }
  });

  root._playAnim = function (name, loop) {
    if (loop === undefined) {
      loop = (name !== 'shoot' && name !== 'shootMove');
    }
    const firingAnims = ['shoot', 'shootMove'];
    if (firingAnims.includes(root._currentAnim) && !root._shootDone && name !== root._currentAnim) {
      return;
    }
    if (root._currentAnim === name && loop) {
      return;
    }
    if (root._currentAnim === name && !loop) {
      return;
    }
    let resolvedName = name;
    if (!root._animGroups[name]) {
      const fallbackOrder = name === 'idle' ? ['run', 'shoot', 'shootMove']
        : name === 'run' ? ['idle', 'shoot', 'shootMove']
          : name === 'shootMove' ? ['shoot', 'idle', 'run']
            : ['idle', 'run', 'shoot', 'shootMove'];
      const found = fallbackOrder.find((s) => root._animGroups[s]);
      if (found) {
        resolvedName = found;
      } else {
        return;
      }
    }
    const resolvedLoop = loop && resolvedName !== 'shoot' && resolvedName !== 'shootMove';
    Object.values(root._animGroups).forEach((animationGroup) => {
      try {
        animationGroup.stop();
      } catch (error) {
        // ignore
      }
    });
    root._currentAnim = resolvedName;
    root._shootDone = (resolvedName !== 'shoot') && (resolvedName !== 'shootMove');
    const animationGroup = root._animGroups[resolvedName];
    if (!animationGroup) {
      return;
    }
    try {
      animationGroup.loopAnimation = resolvedLoop;
      animationGroup.onAnimationGroupEndObservable.clear();
      animationGroup.reset();
      animationGroup.start(resolvedLoop, 1.0);
      if (!resolvedLoop) {
        animationGroup.onAnimationGroupEndObservable.addOnce(() => {
          root._shootDone = true;
          root._currentAnim = null;
        });
      }
    } catch (error) {
      console.warn('_playAnim error', resolvedName, error);
    }
  };
  const ring = mkTorus('teamRing_' + Math.random(), 1.5, 0.06, 24);
  ring.rotation.x = 0;
  ring.position.y = 0.05;
  root.add(ring);
  ring.userData.pickable = false;
  const ringMat = new THREE.MeshBasicMaterial();
  ringMat.color = teamKey === PLAYER ? new THREE.Color(0, 1, 0.4) : new THREE.Color(1, 0.15, 0.1);
  ringMat.opacity = 0;
  ringMat.transparent = true;
  ring.material = ringMat;
  ring.visible = false;
  ring.visible = false;
  root._teamRing = ring;
  if (!root._selMat) root._selMat = ringMat;
  if (!root._selDisc) root._selDisc = ring;
  return root;
}

export function _instantiateFromContainer(container, metaPayload) {
  if (!container) {
    return null;
  }
  const instance = instantiateGltf(container);
  instance.animationGroups.forEach((animationGroup) => animationGroup.stop());
  const root = mkGroup('model_root');
  root._animationGroups = instance.animationGroups;
  instance.rootNodes.forEach((rootNode) => {
    root.add(rootNode);
    // Some models have an invisible __root__ node that needs to be enabled
    rootNode.visible = true;
  });
  (container._hiddenNodes || []).forEach((nodeName) => {
    const wanted = nodeName.toLowerCase();
    instance.rootNodes.forEach((rootNode) => {
      descendants(rootNode).forEach((child) => {
        const childName = child.name.toLowerCase().split('_inst_')[0];
        if (childName === wanted || childName.startsWith(wanted)) {
          child.visible = false;
          child.visible = false;
          child.userData.pickable = false;
        }
      });
    });
  });
  childMeshes(root).forEach((mesh) => {
    mesh.userData.pickable = true;
    mesh.userData = { ...mesh.userData, ...metaPayload };
    if (scene._registerShadows) {
      scene._registerShadows(mesh);
    }
  });
  return root;
}
