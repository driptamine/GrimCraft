import * as THREE from 'three';
import { scene, world, camera, PLAYER, SQUAD_SCATTER } from './core/scene.js';

function _sceneLights(): THREE.Object3D[] {
  const lights: THREE.Object3D[] = [];
  if (scene) {
    scene.traverse((child: any) => {
      if (child.isLight) {
        lights.push(child);
      }
    });
  }
  return lights;
}

function _sceneMeshes(): THREE.Object3D[] {
  const meshes: THREE.Object3D[] = [];
  if (scene) {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });
  }
  return meshes;
}

export let _nodesPanelOpen = false;
export let _nodesFilter = '';
export let _nodesCollapsed = new Set<string | number>();

export interface NodesEntry {
  isPrototypeGroup?: boolean;
  isPrototypePart?: boolean;
  isCustomWidget?: boolean;
  widgetType?: string;
  allRoots?: THREE.Object3D[];
  protoRoot?: THREE.Object3D;
  protoNode?: THREE.Object3D;
  node?: THREE.Object3D | null;
  partName?: string;
  allParts?: THREE.Object3D[];
  depth: number;
  typeTag: string;
  icon?: string;
  enabled: boolean;
  childCount: number;
  id: string | number;
  displayName: string;
}

export let _nodesFlatList: NodesEntry[] = [];

export function toggleNodesPanel(): void {
  _nodesPanelOpen = !_nodesPanelOpen;
  const panel = document.getElementById('nodes-panel');
  const toggleButton = document.getElementById('nodes-toggle-btn');
  if (!panel || !toggleButton) {
    return;
  }
  if (_nodesPanelOpen) {
    panel.classList.add('open');
    toggleButton.classList.add('active');
    if (_nodesCollapsed.size === 0) {
      ['SOLDIER_[BLUE]', 'SOLDIER_[RED]', 'BUILDER', 'JET_[BLUE]', 'JET_[RED]', 'APC'].forEach((key) => {
        _nodesCollapsed.add(`proto_${key}`);
      });
    }
    nodesRefresh();
  } else {
    panel.classList.remove('open');
    toggleButton.classList.remove('active');
  }
}

function _collectNodes(): NodesEntry[] {
  if (!scene || !world) {
    return [];
  }
  const entries: NodesEntry[] = [];
  const ecsMeshRoots = new Set<THREE.Object3D>();
  const allSoldierRoots = { blue: [] as THREE.Object3D[], red: [] as THREE.Object3D[] };
  const allBuilderRoots: THREE.Object3D[] = [];
  const allJetRoots = { blue: [] as THREE.Object3D[], red: [] as THREE.Object3D[] };
  const allApcRoots: THREE.Object3D[] = [];

  for (const squadId of world.query('squad')) {
    const squadComponent = world.get(squadId, 'squad');
    if (!squadComponent) {
      continue;
    }
    squadComponent.soldiers.forEach((soldierId: any) => {
      if (soldierId === null) {
        return;
      }
      const meshComponent = world.get(soldierId, 'mesh');
      if (!meshComponent?.root) {
        return;
      }
      ecsMeshRoots.add(meshComponent.root);
      (squadComponent.team === PLAYER ? allSoldierRoots.blue : allSoldierRoots.red).push(meshComponent.root);
    });
  }
  for (const builderId of world.query('builder')) {
    const meshComponent = world.get(builderId, 'mesh');
    if (meshComponent?.root) {
      allBuilderRoots.push(meshComponent.root);
      ecsMeshRoots.add(meshComponent.root);
    }
  }
  for (const jetId of world.query('jet')) {
    const jet = world.get(jetId, 'jet');
    const meshComponent = world.get(jetId, 'mesh');
    if (!meshComponent?.root) {
      continue;
    }
    ecsMeshRoots.add(meshComponent.root);
    (jet?.team === PLAYER ? allJetRoots.blue : allJetRoots.red).push(meshComponent.root);
  }
  for (const apcId of world.query('apc')) {
    const meshComponent = world.get(apcId, 'mesh');
    if (meshComponent?.root) {
      allApcRoots.push(meshComponent.root);
      ecsMeshRoots.add(meshComponent.root);
    }
  }

  function pushPrototype(label: string, icon: string, typeTag: string, allRoots: THREE.Object3D[]): void {
    if (allRoots.length === 0) {
      return;
    }
    const protoRoot = allRoots[0];
    const children = protoRoot.children
      ? protoRoot.children.filter((child) => child.isObject3D)
      : [];
    const groupId = `proto_${label.replace(/\s/g, '_')}`;
    const groupEnabled = allRoots.some((root) => root.visible);
    entries.push({
      isPrototypeGroup: true,
      allRoots,
      protoRoot,
      depth: 0,
      typeTag,
      icon,
      enabled: groupEnabled,
      childCount: children.length,
      id: groupId,
      displayName: `${label} ×${allRoots.length}`,
    });
    if (_nodesCollapsed.has(groupId)) {
      return;
    }
    children.forEach((child) => {
      const partName = child.name || '(part)';
      const partEnabled = child.visible;
      const allParts = allRoots.map((root) => (root.children ? root.children.find((c) => c.name === partName) : null)).filter((c): c is THREE.Object3D => !!c);
      entries.push({
        isPrototypePart: true,
        partName,
        allParts,
        protoNode: child,
        allRoots,
        depth: 1,
        typeTag: !(child as THREE.Mesh).isMesh ? 'node' : 'mesh',
        icon: !(child as THREE.Mesh).isMesh ? '⤡' : '◈',
        enabled: partEnabled,
        childCount: 0,
        id: `part_${groupId}_${partName}`,
        displayName: partName,
      });
    });
  }

  pushPrototype('SOLDIER [BLUE]', '🧪', 'soldier', allSoldierRoots.blue);
  pushPrototype('SOLDIER [RED]', '🧪', 'soldier', allSoldierRoots.red);
  pushPrototype('BUILDER', '🔨', 'builder', allBuilderRoots);
  pushPrototype('JET [BLUE]', '🛩', 'jet', allJetRoots.blue);
  pushPrototype('JET [RED]', '🛩', 'jet', allJetRoots.red);
  pushPrototype('APC', '🚛', 'apc', allApcRoots);

  for (const buildingId of world.query('building')) {
    const buildingComponent = world.get(buildingId, 'building');
    const meshComponent = world.get(buildingId, 'mesh');
    if (!meshComponent?.root) {
      continue;
    }
    ecsMeshRoots.add(meshComponent.root);
    const children = meshComponent.root.children
      ? meshComponent.root.children.filter((child: any) => child.isObject3D)
      : [];
    entries.push({
      node: meshComponent.root,
      depth: 0,
      typeTag: 'building',
      icon: '🏗',
      enabled: meshComponent.root.visible,
      childCount: children.length,
      id: meshComponent.root.id,
      displayName: (buildingComponent?.type || 'BUILDING').toUpperCase(),
    });
    if (!_nodesCollapsed.has(meshComponent.root.id)) {
      children.forEach((child: any) => {
        entries.push({
          node: child,
          depth: 1,
          typeTag: 'mesh',
          icon: '◈',
          enabled: child.visible,
          childCount: 0,
          id: child.id,
          displayName: child.name || '(part)',
        });
      });
    }
  }

  for (const airfieldId of world.query('airfield')) {
    const meshComponent = world.get(airfieldId, 'mesh');
    if (!meshComponent?.root) {
      continue;
    }
    ecsMeshRoots.add(meshComponent.root);
    const children = meshComponent.root.children
      ? meshComponent.root.children.filter((child: any) => child.isObject3D)
      : [];
    entries.push({
      node: meshComponent.root,
      depth: 0,
      typeTag: 'building',
      icon: '✈',
      enabled: meshComponent.root.visible,
      childCount: children.length,
      id: meshComponent.root.id,
      displayName: 'AIRFIELD',
    });
    if (!_nodesCollapsed.has(meshComponent.root.id)) {
      children.forEach((child: any) => {
        entries.push({
          node: child,
          depth: 1,
          typeTag: 'mesh',
          icon: '◈',
          enabled: child.visible,
          childCount: 0,
          id: child.id,
          displayName: child.name || '(part)',
        });
      });
    }
  }

  for (const spId of world.query('strategicPoint')) {
    const meshComponent = world.get(spId, 'mesh');
    if (!meshComponent?.root) {
      continue;
    }
    ecsMeshRoots.add(meshComponent.root);
    const children = meshComponent.root.children
      ? meshComponent.root.children.filter((child: any) => child.isObject3D)
      : [];
    entries.push({
      node: meshComponent.root,
      depth: 0,
      typeTag: 'point',
      icon: '🚩',
      enabled: meshComponent.root.visible,
      childCount: children.length,
      id: meshComponent.root.id,
      displayName: 'STRATEGIC POINT',
    });
    if (!_nodesCollapsed.has(meshComponent.root.id)) {
      children.forEach((child: any) => {
        entries.push({
          node: child,
          depth: 1,
          typeTag: 'mesh',
          icon: '◈',
          enabled: child.visible,
          childCount: 0,
          id: child.id,
          displayName: child.name || '(part)',
        });
      });
    }
  }

  _sceneLights().forEach((light: any) => {
    entries.push({
      node: light,
      depth: 0,
      typeTag: 'light',
      icon: '☀',
      enabled: light.visible,
      childCount: 0,
      id: light.id,
      displayName: light.name,
    });
  });

  if (camera) {
    entries.push({
      node: camera,
      depth: 0,
      typeTag: 'cam',
      icon: '📷',
      enabled: true,
      childCount: 0,
      id: camera.id,
      displayName: camera.name,
    });
  }

  entries.push({
    isCustomWidget: true,
    widgetType: 'scatter',
    id: 'widget_scatter',
    depth: 0,
    displayName: 'SCATTER',
    typeTag: 'setting',
    enabled: true,
    childCount: 0,
    node: null,
  });

  const infraRoots = scene.children
    .filter((node: any) => (node.isMesh || node.isGroup) && !ecsMeshRoots.has(node))
    .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  infraRoots.forEach((root: any) => {
    const isMesh = root.isMesh;
    let typeTag = 'mesh';
    let icon = '◈';
    if (root.name === 'ground') {
      typeTag = 'ground';
      icon = '⬛';
    } else if (/^(grid|gm_)/.test(root.name)) {
      typeTag = 'grid';
      icon = '⦦';
    } else if (!isMesh) {
      typeTag = 'node';
      icon = '⤡';
    }
    const children = root.children
      ? root.children.filter((child: any) => child.isObject3D)
      : [];
    entries.push({
      node: root,
      depth: 0,
      typeTag,
      icon,
      enabled: isMesh ? (root.visible) : true,
      childCount: children.length,
      id: root.id,
      displayName: root.name || '(unnamed)',
    });
    if (!_nodesCollapsed.has(root.id)) {
      children.forEach((child: any) => {
        entries.push({
          node: child,
          depth: 1,
          typeTag: 'mesh',
          icon: '◈',
          enabled: child.visible,
          childCount: 0,
          id: child.id,
          displayName: child.name || '(part)',
        });
      });
    }
  });

  return entries;
}

function _matchesFilter(entry: NodesEntry, filter: string): boolean {
  if (!filter) {
    return true;
  }
  const lowercaseFilter = filter.toLowerCase();
  return (entry.displayName || entry.node?.name || '').toLowerCase().includes(lowercaseFilter)
    || entry.typeTag.toLowerCase().includes(lowercaseFilter);
}

export function nodesRefresh(): void {
  if (!_nodesPanelOpen || !scene) {
    return;
  }
  _nodesFlatList = _collectNodes();
  const list = document.getElementById('nodes-list');
  const count = document.getElementById('nodes-count');
  if (!list) {
    return;
  }
  const visible = _nodesFlatList.filter((entry) => _matchesFilter(entry, _nodesFilter));
  if (!visible.length) {
    list.innerHTML = '<div id="nodes-empty">NO NODES MATCH FILTER</div>';
    if (count) {
      count.textContent = '0 NODES';
    }
    return;
  }
  list.innerHTML = '';
  visible.forEach((entry) => {
    if (entry.isCustomWidget && entry.widgetType === 'scatter') {
      const row = document.createElement('div');
      row.className = 'node-row';
      row.style.cssText = 'padding:5px 8px; gap:5px; flex-wrap:nowrap; pointer-events:all;';
      row.innerHTML = `<span class="node-icon" style="flex-shrink:0">⧺</span>`
        + `<span class="node-name root-name" style="flex-shrink:0;min-width:44px">SCATTER</span>`
        + `<input type="range" id="nodes-scatter-slider" min="0.4" max="4.0" step="0.1" value="${SQUAD_SCATTER.toFixed(1)}" style="flex:1;accent-color:#b07aff;height:3px;cursor:pointer;min-width:0" title="Formation spacing">`
        + `<span id="nodes-scatter-val" style="color:#fff;font-size:8px;font-weight:bold;flex-shrink:0;min-width:26px;text-align:right">${SQUAD_SCATTER.toFixed(1)}x</span>`
        + `<span class="node-type-tag setting" style="flex-shrink:0">SETTING</span>`;
      const slider = row.querySelector('#nodes-scatter-slider') as HTMLInputElement | null;
      if (slider) {
        slider.addEventListener('input', (event) => {
          event.stopPropagation();
          const valEl = document.getElementById('nodes-scatter-val');
          if (valEl) valEl.textContent = `${parseFloat(slider.value).toFixed(1)}x`;
          const scatterSlider = document.getElementById('scatter-slider') as HTMLInputElement | null;
          const scatterValue = document.getElementById('scatter-val');
          if (scatterSlider) {
            scatterSlider.value = parseFloat(slider.value).toFixed(1);
          }
          if (scatterValue) {
            scatterValue.textContent = `${parseFloat(slider.value).toFixed(1)}x`;
          }
        });
      }
      list.appendChild(row);
      return;
    }

    const row = document.createElement('div');
    row.className = `node-row${entry.enabled ? '' : ' hidden-row'}`;
    row.dataset.uid = String(entry.id);

    if (entry.depth > 0) {
      const indent = document.createElement('span');
      indent.className = 'node-indent';
      indent.style.width = `${entry.depth * 12}px`;
      row.appendChild(indent);
    }

    const expandButton = document.createElement('span');
    expandButton.className = `node-expand-btn${entry.childCount > 0 ? '' : ' leaf'}`;
    if (entry.childCount > 0) {
      expandButton.textContent = _nodesCollapsed.has(entry.id) ? '▶' : '▼';
      expandButton.onclick = (event) => {
        event.stopPropagation();
        if (_nodesCollapsed.has(entry.id)) {
          _nodesCollapsed.delete(entry.id);
        } else {
          _nodesCollapsed.add(entry.id);
        }
        nodesRefresh();
      };
    } else {
      expandButton.textContent = '·';
    }
    row.appendChild(expandButton);

    const eye = document.createElement('span');
    eye.className = `node-eye${entry.enabled ? '' : ' off'}`;
    eye.textContent = entry.enabled ? '👁' : '◌';
    eye.onclick = (event) => {
      event.stopPropagation();
      _nodesToggleVisibility(entry);
    };
    row.appendChild(eye);

    const icon = document.createElement('span');
    icon.className = 'node-icon';
    icon.textContent = entry.icon ?? '';
    row.appendChild(icon);

    const nameElement = document.createElement('span');
    const nameClass = entry.typeTag === 'light'
      ? 'light-name'
      : entry.typeTag === 'cam'
        ? 'cam-name'
        : entry.depth === 0
          ? 'root-name'
          : 'mesh-name';
    nameElement.className = `node-name ${nameClass}`;
    const readableName = entry.displayName || entry.node?.name || '(unnamed)';
    nameElement.textContent = readableName.length > 26 ? `${readableName.slice(0, 24)}…` : readableName;
    nameElement.title = readableName;
    row.appendChild(nameElement);

    const tagElement = document.createElement('span');
    tagElement.className = `node-type-tag ${entry.typeTag}`;
    tagElement.textContent = entry.typeTag.toUpperCase();
    row.appendChild(tagElement);

    list.appendChild(row);
  });

  if (count) {
    const total = _nodesFlatList.length;
    const shown = visible.length;
    count.textContent = shown < total ? `${shown} / ${total} NODES` : `${total} NODES`;
  }
}

function _nodesToggleVisibility(entry: NodesEntry): void {
  if (entry.isPrototypeGroup) {
    const nowEnabled = entry.allRoots!.some((root) => root.visible);
    entry.allRoots!.forEach((root) => {
      if (nowEnabled) {
        root.visible = false;
      } else {
        root.visible = true;
        root.visible = true;
      }
    });
    nodesRefresh();
    return;
  }
  if (entry.isPrototypePart) {
    const nowEnabled = entry.protoNode!.visible;
    entry.allParts!.forEach((part) => {
      if (nowEnabled) {
        part.visible = false;
      } else {
        part.visible = true;
        part.visible = true;
      }
    });
    nodesRefresh();
    return;
  }
  const node = entry.node;
  if (!node) {
    return;
  }
  const isMesh = (node as THREE.Mesh).isMesh;
  const isLight = (node as THREE.Light).isLight;
  if (isMesh) {
    const nowEnabled = node.visible;
    if (nowEnabled) {
      node.visible = false;
    } else {
      node.visible = true;
      node.visible = true;
    }
  } else if (isLight) {
    node.visible = !node.visible;
  }
  nodesRefresh();
}

export function nodesShowAll(): void {
  if (!scene) {
    return;
  }
  _sceneMeshes().forEach((mesh) => {
    mesh.visible = true;
  });
  _sceneLights().forEach((light) => { light.visible = true; });
  nodesRefresh();
}

export function nodesHideAll(): void {
  if (!scene) {
    return;
  }
  _sceneMeshes().forEach((mesh) => { mesh.visible = false; });
  _sceneLights().forEach((light) => { light.visible = false; });
  nodesRefresh();
}

export function filterNodes(value: string): void {
  _nodesFilter = value.trim();
  nodesRefresh();
}

let _nodesPanelRefreshWired = false;

// Idempotent: call once when the game boots with a real DOM. Importing this
// module must stay side-effect free so headless tests (node --test) exit.
export function initNodesPanelAutoRefresh(): void {
  if (_nodesPanelRefreshWired) {
    return;
  }
  _nodesPanelRefreshWired = true;
  setInterval(() => {
    if (_nodesPanelOpen) {
      nodesRefresh();
    }
  }, 2000);
}
