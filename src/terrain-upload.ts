import * as THREE from 'three';
import { scene } from './scene.js';
import { mkGroup, disposeObj, childMeshes, loadTexture } from './three-helpers.js';
import { loadGltf, instantiateGltf } from './gltf-models.js';
import type { GltfContainer } from './gltf-models.js';
import type { AnyGroup } from './meshes/types.js';

interface TerrainLayer {
  name: string;
  texture: THREE.Texture;
  visible: boolean;
}

export let _terrainTexture: THREE.Texture | null = null;
export let _terrainLayers: TerrainLayer[] = [];
export let _terrainLayerRoot: THREE.Group | null = null;
export let _propContainer: GltfContainer | null = null;
export let _propInstances: THREE.Object3D[] = [];
export let _propScale = 1.0;
export let _terrainMeshRoot: AnyGroup | null = null;
export let _terrainMeshScale = 1.0;
export let _terrainMeshY = 0.0;

export function toggleTerrainPanel(): void {
  const panel = document.getElementById('terrain-upload-panel');
  if (panel) {
    panel.classList.toggle('open');
  }
}

export function handleTerrainTexDrop(e: DragEvent): void {
  e.preventDefault();
  const dropZone = document.getElementById('terrain-tex-dz');
  if (dropZone) {
    dropZone.classList.remove('dragover');
  }
  const file = e.dataTransfer!.files[0];
  if (file) {
    loadTerrainTexture(file);
  }
}

export function loadTerrainTexture(file: File): void {
  if (!file) {
    return;
  }
  if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
    setTerrainTexStatus('UNSUPPORTED FORMAT', 'err');
    return;
  }
  setTerrainTexStatus('LOADING…', 'loading');
  const url = URL.createObjectURL(file);
  if (_terrainTexture) {
    _terrainTexture.dispose();
    _terrainTexture = null;
  }
  _terrainTexture = loadTexture(url, {
    onLoad: () => {
      const tex = _terrainTexture as THREE.Texture;
      const groundMaterial = scene._ground?.material;
      if (groundMaterial) {
        const tileX = parseInt((document.getElementById('tex-tile-x') as HTMLInputElement).value) || 8;
        const tileY = parseInt((document.getElementById('tex-tile-y') as HTMLInputElement).value) || 8;
        tex.repeat.set(tileX, tileY);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        groundMaterial.map = null;
        groundMaterial.emissiveMap = tex;
        groundMaterial.needsUpdate = true;
        groundMaterial.emissive = new THREE.Color(1, 1, 1);
      }
      setTerrainTexStatus('✓ ' + file.name.slice(0, 28), 'ok');
    },
    onError: (err) => setTerrainTexStatus('LOAD ERROR', 'err'),
  });
}

/**
 * URL-driven terrain swap — same ground-material emissive path as
 * loadTerrainTexture() but for the built-in decals browser (maps/6p_alvarus/decals/).
 * The decal rasters may be legacy formats (.tga/.dds) which the
 * file-drop twin rejects, so load straight from URL instead.
 */
export function updateTexTiling(): void {
  const tileXEl = document.getElementById('tex-tile-x') as HTMLInputElement | null;
  const tileYEl = document.getElementById('tex-tile-y') as HTMLInputElement | null;
  const tileX = parseInt(tileXEl?.value as string) || 8;
  const tileY = parseInt(tileYEl?.value as string) || 8;
  const labelX = document.getElementById('tex-tile-x-val');
  if (labelX) {
    labelX.textContent = String(tileX);
  }
  const labelY = document.getElementById('tex-tile-y-val');
  if (labelY) {
    labelY.textContent = String(tileY);
  }
  if (_terrainTexture) {
    _terrainTexture.repeat.set(tileX, tileY);
  }
}

export async function loadTerrainTextureUrl(url: string, nameHint?: string): Promise<void> {
  if (!url) {
    return;
  }
  const name = nameHint || url.split('/').pop() || url;
  setTerrainTexStatus('LAYERING… ' + name.slice(0, 24), 'loading');
  const layerTexture = loadTexture(url, {
    onLoad: () => {
      layerTexture.repeat.set(64, 64);
      layerTexture.center.set(0.5, 0.5);
      layerTexture.rotation = (Math.PI * _terrainLayerAngle) / 180;
      layerTexture.wrapS = THREE.RepeatWrapping;
      layerTexture.wrapT = THREE.RepeatWrapping;
      let painted = 0;
      const targets = paintTargets();
      targets.forEach((m) => {
        if (!m.material) {
          m.material = new THREE.MeshStandardMaterial();
        }
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.map = layerTexture;
        mat.color = new THREE.Color(1, 1, 1);
        mat.emissiveMap = null;
        mat.needsUpdate = true;
        painted++;
      });
      _terrainLayers.push({ name, texture: layerTexture, visible: true });
      renderTerrainLayerList();
      setTerrainTexStatus('✓ ' + name.slice(0, 28) + ' → ' + painted + ' MESH(ES)', 'ok');
    },
    onError: (err) => setTerrainTexStatus('LOAD ERROR', 'err'),
  });
}

function paintTargets(): THREE.Mesh[] {
  let host: THREE.Object3D | null | undefined = null;
  try {
    const sgbModule = (window as unknown as { __sgbTexModule?: { _sgbRoot?: THREE.Object3D | null } | null }).__sgbTexModule;
    host = sgbModule ? sgbModule._sgbRoot : null;
  } catch (e) {
    host = null;
  }
  if (!host) {
    let targets: THREE.Mesh[] = [];
    try {
      targets = childMeshes(_sgbRootFromModule);
    } catch (e) {
      targets = [];
    }
    if (targets.length) {
      return targets;
    }
  }
  if (host) {
    const meshes = childMeshes(host);
    if (meshes.length) {
      return meshes;
    }
  }
  return scene._ground ? [scene._ground] : [];
}

let _sgbRootFromModule: THREE.Group | null = null;
let _sgbTilesX = 0;
let _sgbTilesZ = 0;
export function linkSgbRoot(root: THREE.Group | null, tilesX: number, tilesZ: number): void {
  _sgbRootFromModule = root;
  _sgbTilesX = tilesX || 0;
  _sgbTilesZ = tilesZ || 0;
}

function _dropYOnTerrain(x: number, z: number): number {
  const root = _sgbRootFromModule || _terrainMeshRoot;
  if (!root) {
    return 0;
  }
  const meshes = childMeshes(root);
  if (!meshes.length) {
    return 0;
  }
  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(x, 1000, z),
    new THREE.Vector3(0, -1, 0),
    0,
    2000,
  );
  const hits = raycaster.intersectObjects(meshes, false);
  return hits.length ? hits[0].point.y : 0;
}

export function toggleTerrainLayer(index: number): void {
  const layer = _terrainLayers[index];
  if (!layer) {
    return;
  }
  layer.visible = !layer.visible;
  paintTargets().forEach((m) => {
    if (!m.material) {
      return;
    }
    const mat = m.material as THREE.MeshStandardMaterial;
    if (layer.visible) {
      mat.map = layer.texture;
      mat.needsUpdate = true;
      mat.color = new THREE.Color(1, 1, 1);
      mat.emissiveMap = null;
      mat.needsUpdate = true;
      mat.emissive = new THREE.Color(0, 0, 0);

    } else {
      mat.map = null;
      mat.needsUpdate = true;
      mat.color = new THREE.Color(0.35, 0.35, 0.35);
    }
  });
  renderTerrainLayerList();
  setTerrainTexStatus(
    (layer.visible ? '✦ ' : '— ') + layer.name.slice(0, 26) + ' ' + (layer.visible ? 'SHOWN' : 'HIDDEN'),
    layer.visible ? 'ok' : '',
  );
}

export function removeTerrainLayer(index: number): void {
  const layer = _terrainLayers[index];
  if (!layer) {
    return;
  }
  if (layer.texture) {
    layer.texture.dispose();
  }
  _terrainLayers.splice(index, 1);
  paintTargets().forEach((m) => {
    if (!m.material) {
      return;
    }
    const mat = m.material as THREE.MeshStandardMaterial;
    const topLayer = _terrainLayers
      .filter((l) => l.visible)
      .pop();
    if (topLayer) {
      mat.map = topLayer.texture;
      mat.needsUpdate = true;
      mat.color = new THREE.Color(1, 1, 1);
      mat.emissiveMap = null;
      mat.needsUpdate = true;
      mat.emissive = new THREE.Color(0, 0, 0);

    } else {
      mat.map = null;
      mat.needsUpdate = true;
      mat.color = new THREE.Color(0.35, 0.35, 0.35);
    }
  });
  renderTerrainLayerList();
  setTerrainTexStatus(_terrainLayers.length ? '✓ ' + _terrainLayers.length + ' LAYER(S) REMAIN' : 'NO TERRAIN TEXTURE — USING SOLID COLOUR', _terrainLayers.length ? 'ok' : '');
}

let _terrainLayerAngle = 270;

function applyTerrainLayerAngle(): void {
  const rad = (Math.PI * _terrainLayerAngle) / 180;
  _terrainLayers.forEach((layer) => {
    if (layer.texture) {
      layer.texture.center.set(0.5, 0.5);
      layer.texture.rotation = rad;
    }
  });
  const el = document.getElementById('terrain-layer-angle-val');
  if (el) {
    el.textContent = _terrainLayerAngle + '°';
  }
}

export function rotateTerrainLayers(): void {
  _terrainLayerAngle = (_terrainLayerAngle + 90) % 360;
  applyTerrainLayerAngle();
}

function renderTerrainLayerList(): void {
  const list = document.getElementById('terrain-layers-list');
  if (!list) {
    return;
  }
  if (!_terrainLayers.length) {
    list.innerHTML = '<div class="terrain-tex-row terrain-tex-title">NO LAYERS — LOAD A TERRAIN TEXTURE</div>';
    return;
  }
  list.innerHTML = '';
  _terrainLayers.forEach((layer, i) => {
    const row = document.createElement('div');
    row.className = 'terrain-tex-row' + (layer.visible ? ' terrain-tex-title' : '');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '4px';
    const eye = document.createElement('button');
    eye.textContent = layer.visible ? '👁' : '•';
    eye.style.cursor = 'pointer';
    eye.style.background = 'none';
    eye.style.border = '1px solid #3a4555';
    eye.style.borderRadius = '3px';
    eye.style.color = '#aeb6bf';
    eye.style.fontSize = '10px';
    eye.title = (layer.visible ? 'HIDE' : 'SHOW') + ' LAYER ' + (i + 1);
    eye.addEventListener('click', () => toggleTerrainLayer(i));
    const label = document.createElement('span');
    label.textContent = (i + 1) + '. ' + layer.name.slice(0, 26);
    label.style.flex = '1';
    const del = document.createElement('button');
    del.textContent = '✕';
    del.style.cursor = 'pointer';
    del.style.background = 'none';
    del.style.border = '1px solid #3a4555';
    del.style.borderRadius = '3px';
    del.style.color = '#ff6644';
    del.style.fontSize = '10px';
    del.title = 'REMOVE LAYER ' + (i + 1);
    del.addEventListener('click', () => removeTerrainLayer(i));
    row.appendChild(eye);
    row.appendChild(label);
    row.appendChild(del);
    list.appendChild(row);
  });
}

function setTerrainTexStatus(msg: string, className = ''): void {
  const element = document.getElementById('terrain-tex-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = 'terrain-status' + (className ? ' ' + className : '');
}

export function handleTerrainMeshDrop(e: DragEvent): void {
  e.preventDefault();
  const dropZone = document.getElementById('terrain-mesh-dz');
  if (dropZone) {
    dropZone.classList.remove('dragover');
  }
  handleTerrainMeshFiles(e.dataTransfer!.files);
}

export function handleTerrainMeshFiles(files: FileList | File[] | null): void {
  if (!files || !files.length) {
    return;
  }
  const sgbFile = Array.from(files).find((file) => /\.sgb$/i.test(file.name));
  if (sgbFile) {
    import('./sgb-upload.js').then((module) => module.loadSgbFile(sgbFile));
    return;
  }
  const mainFile = Array.from(files).find((file) => /\.(glb|gltf)$/i.test(file.name));
  if (!mainFile) {
    setTerrainMeshStatus('DROP A .GLB OR .GLTF FILE', 'err');
    return;
  }
  setTerrainMeshStatus('LOADING…', 'loading');
  import('./sgb-upload.js').then((module) => module.clearSgbMap(true));
  const fileMap: Record<string, string> = {};
  Array.from(files).forEach((file) => { fileMap[file.name] = URL.createObjectURL(file); });
  const mainUrl = fileMap[mainFile.name];
  clearTerrainMesh(true);
  loadGltf(mainUrl, mainFile.name.match(/\.(gltf|glb)$/i)?.[0] || '.glb').then((container) => {
    const inst = instantiateGltf(container);
    inst.animationGroups.forEach((ag) => ag.stop());
    const parent = mkGroup('_terrainMeshRoot') as AnyGroup;
    inst.rootNodes.forEach((rn) => { parent.add(rn); });
    parent.scale.setScalar(_terrainMeshScale);
    parent.position.y = _terrainMeshY;
    childMeshes(parent).forEach((m) => {
      m.userData.pickable = false;
      m.receiveShadow = true;
      if (scene._registerShadows) {
        scene._registerShadows(m);
      }
      if (m.material) {
        // three.js materials have no disableLighting/specularColor switches;
        // glTF imports arrive with PBR values that render correctly as-is.
      }
    });
    if (scene._ground) {
      scene._ground.visible = false;
    }
    parent._sourceContainer = container;
    _terrainMeshRoot = parent;
    setTerrainMeshStatus('✓ ' + mainFile.name.slice(0, 28), 'ok');
    Object.values(fileMap).forEach((url) => URL.revokeObjectURL(url));
    const inp = document.getElementById('terrain-mesh-input') as HTMLInputElement | null;
    if (inp) {
      inp.value = '';
    }
  }).catch((err) => {
    setTerrainMeshStatus(
      'LOAD ERROR: ' + (err instanceof Error ? err.message : String(err)).slice(0, 30), 'err',
    );
    Object.values(fileMap).forEach((url) => URL.revokeObjectURL(url));
  });
}

export function updateTerrainMeshScale(sliderVal: string | number): void {
  _terrainMeshScale = Math.pow(10, parseFloat(String(sliderVal)) / 100);
  document.getElementById('terrain-mesh-scale-val')!.textContent = _terrainMeshScale.toFixed(2);
  if (_terrainMeshRoot) {
    _terrainMeshRoot.scale.setScalar(_terrainMeshScale);
  }
}

export function updateTerrainMeshY(sliderVal: string | number): void {
  _terrainMeshY = parseFloat(String(sliderVal));
  document.getElementById('terrain-mesh-y-val')!.textContent = _terrainMeshY.toFixed(1);
  if (_terrainMeshRoot) {
    _terrainMeshRoot.position.y = _terrainMeshY;
  }
  import('./sgb-upload.js').then((module) => module.updateTerrainMapY(sliderVal));
}

export function clearTerrainMesh(silent?: boolean): void {
  import('./sgb-upload.js').then((module) => module.clearSgbMap(true));
  if (_terrainMeshRoot) {
    if (_terrainMeshRoot._sourceContainer) {
      try {
        _terrainMeshRoot._sourceContainer.dispose();
      } catch (e) {
        // ignore
      }
    }
    childMeshes(_terrainMeshRoot).forEach((m) => disposeObj(m));
    disposeObj(_terrainMeshRoot);
    _terrainMeshRoot = null;
  }
  if (scene._ground) {
    scene._ground.visible = true;
  }
  if (!silent) {
    setTerrainMeshStatus('NO TERRAIN MESH LOADED');
  }
}

function setTerrainMeshStatus(msg: string, className = ''): void {
  const element = document.getElementById('terrain-mesh-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = 'terrain-status' + (className ? ' ' + className : '');
}

export function handleTerrainPropDrop(e: DragEvent): void {
  e.preventDefault();
  const dropZone = document.getElementById('terrain-prop-dz');
  if (dropZone) {
    dropZone.classList.remove('dragover');
  }
  handleTerrainPropFiles(e.dataTransfer!.files);
}

export function handleTerrainPropFiles(files: FileList | File[] | null): void {
  if (!files || !files.length) {
    return;
  }
  const mainFile = Array.from(files).find((file) => /\.(glb|gltf)$/i.test(file.name));
  if (!mainFile) {
    setPropStatus('DROP A .GLB OR .GLTF FILE', 'err');
    return;
  }
  setPropStatus('LOADING…', 'loading');
  const fileMap: Record<string, string> = {};
  Array.from(files).forEach((file) => { fileMap[file.name] = URL.createObjectURL(file); });
  const mainUrl = fileMap[mainFile.name];
  if (_propContainer) {
    _propContainer.dispose();
    _propContainer = null;
  }
  clearPropInstances();
  loadGltf(mainUrl, mainFile.name.match(/\.(gltf|glb)$/i)?.[0] || '.glb').then((container) => {
    _propContainer = container;
    setPropStatus('✓ ' + mainFile.name.slice(0, 26), 'ok');
    rescatterProps();
  }).catch((err) => {
    setPropStatus('LOAD ERROR: ' + (err instanceof Error ? err.message : String(err)).slice(0, 30), 'err');
  });
}

export function updatePropScale(sliderVal: string | number): void {
  _propScale = Math.pow(10, parseFloat(String(sliderVal)) / 100);
  document.getElementById('prop-scale-val')!.textContent = _propScale.toFixed(2);
  _propInstances.forEach((root) => root.scale.setScalar(_propScale));
}

export function clearPropInstances(): void {
  _propInstances.forEach((root) => {
    childMeshes(root).forEach((m) => disposeObj(m));
    disposeObj(root);
  });
  _propInstances = [];
  const list = document.getElementById('terrain-props-list');
  if (list) {
    list.innerHTML = '';
  }
}

export function rescatterProps(): void {
  if (!_propContainer) {
    return;
  }
  clearPropInstances();
  const count = parseInt((document.getElementById('prop-count') as HTMLInputElement).value) || 20;
  const avoid = parseInt((document.getElementById('prop-avoid') as HTMLInputElement).value) || 18;
  const HALF = 57;
  for (let i = 0; i < count; i++) {
    let x: number;
    let z: number;
    let attempt = 0;
    do {
      x = (Math.random() * 2 - 1) * HALF;
      z = (Math.random() * 2 - 1) * HALF;
      attempt++;
    } while (Math.abs(x as number) < avoid && Math.abs(z as number) < avoid && attempt < 30);
    const inst = instantiateGltf(_propContainer);
    inst.animationGroups.forEach((ag) => ag.stop());
    inst.rootNodes.forEach((rn) => {
      const y = _dropYOnTerrain(x as number, z as number);
      rn.position.set(x as number, y, z as number);
      rn.rotation.y = Math.random() * Math.PI * 2;
      rn.scale.setScalar(_propScale);
      childMeshes(rn).forEach((m) => { m.isPickable = false; });
      _propInstances.push(rn);
    });
  }
  const list = document.getElementById('terrain-props-list');
  if (list) {
    list.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'terrain-prop-row';
    row.innerHTML = `<span>${_propInstances.length} props placed</span><button id="clear-props-btn">✕ REMOVE</button>`;
    list.appendChild(row);
    const btn = document.getElementById('clear-props-btn');
    if (btn) {
      btn.addEventListener('click', clearPropInstances);
    }
  }
}

function setPropStatus(msg: string, className = ''): void {
  const element = document.getElementById('terrain-prop-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = 'terrain-status' + (className ? ' ' + className : '');
}

export function clearAllTerrain(): void {
  clearTerrainMesh();
  if (_terrainTexture) {
    _terrainTexture.dispose();
    _terrainTexture = null;
  }
  _terrainLayers.forEach((layer) => {
    if (layer.texture) {
      layer.texture.dispose();
    }
  });
  _terrainLayers = [];
  paintTargets().forEach((m) => {
    if (!m.material) {
      return;
    }
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.map = null;
    mat.needsUpdate = true;
    mat.color = new THREE.Color(0.35, 0.35, 0.35);
    mat.emissiveMap = null;
    mat.needsUpdate = true;
    mat.emissive = new THREE.Color(0, 0, 0);

  });
  const groundMaterial = scene._ground?.material;
  if (groundMaterial) {
    groundMaterial.map = null;
    groundMaterial.needsUpdate = true;
    groundMaterial.emissiveMap = null;
    groundMaterial.needsUpdate = true;
    groundMaterial.emissive = new THREE.Color(0, 0, 0);
  }
  renderTerrainLayerList();
  setTerrainTexStatus('NO TEXTURE — USING SOLID COLOUR');
  if (_propContainer) {
    _propContainer.dispose();
    _propContainer = null;
  }
  clearPropInstances();
  setPropStatus('NO PROPS LOADED');
}

export function setBrightness(val: number): void {
  if (!scene) {
    return;
  }
  if (scene._ambLight) {
    scene._ambLight.intensity = (scene._ambBase ?? 0.55) * val;
  }
  if (scene._sunLight) {
    scene._sunLight.intensity = (scene._sunBase ?? 1.8) * val;
  }
  if (scene._fillLight) {
    scene._fillLight.intensity = (scene._fillBase ?? 0.45) * val;
  }
  if (scene._rimLight) {
    scene._rimLight.intensity = (scene._rimBase ?? 0.28) * val;
  }
  const el = document.getElementById('brightness-val');
  if (el) {
    el.textContent = val.toFixed(2);
  }
}
