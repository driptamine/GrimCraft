import * as THREE from 'three';

interface HoverMeta {
  soldierEntityId?: number;
  squadEntityId?: number;
  builderEntityId?: number;
  apcEntityId?: number;
  vehicleEntityId?: number;
  jetEntityId?: number;
}

interface HoverUnit {
  id: number;
  ownerId: number;
  kind: string;
  team: string;
  root: THREE.Object3D;
}

function unitRingRadius(root: any, kind: string): number {
  return root._selDisc?.geometry?.parameters?.radius
    ?? (kind === 'apc' || kind === 'jet' ? 3.5 : kind === 'vehicle' ? 2.5 : 0.75);
}

function hoveredUnits(world: any, meta: HoverMeta | null): HoverUnit[] {
  if (!world || !meta) return [];
  const squadId = meta.squadEntityId ?? world.get(meta.soldierEntityId, 'soldier')?.squadId;
  const squad = squadId != null ? world.get(squadId, 'squad') : null;
  const units: HoverUnit[] = [];
  const add = (id: number, ownerId: number, kind: string, unit: any): void => {
    const root = world.get(id, 'mesh')?.root;
    if (!unit || !root || root.visible === false || root.userData.disposed || unit.hp <= 0) return;
    // Уже выбранный отряд показывает свой торус выделения — внешний ховер-торус не дублируем.
    if (unit.selected || root._selDisc?.visible) return;
    units.push({ id, ownerId, kind, team: unit.team || squad?.team, root });
  };
  if (squad) {
    // Весь выбранный отряд уже подсвечен торусами выделения.
    if (squad.selected) return units;
    for (const id of squad.soldiers || []) {
      if (id != null) add(id, squadId, 'soldier', world.get(id, 'soldier'));
    }
    return units;
  }
  for (const [kind, id] of [
    ['builder', meta.builderEntityId], ['apc', meta.apcEntityId],
    ['vehicle', meta.vehicleEntityId], ['jet', meta.jetEntityId],
  ] as const) {
    if (id != null) add(id, id, kind, world.get(id, kind));
  }
  return units;
}

/** Hover owns its own rings, leaving selection and target-pulse meshes alone. */
export function createUnitHover(scene: THREE.Object3D, groundAt: (x: number, z: number) => number = () => 0) {
  const geometry = new THREE.TorusGeometry(1, 0.035, 8, 40);
  geometry.rotateX(Math.PI / 2);
  const rings = new Map<number, THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>>();
  const position = new THREE.Vector3();
  let currentWorld: any = null;
  let currentMeta: HoverMeta | null = null;
  let hostile: (id: number, team: string) => boolean = () => false;

  function remove(id: number): void {
    const ring = rings.get(id);
    if (!ring) return;
    ring.removeFromParent();
    ring.material.dispose();
    rings.delete(id);
  }
  function clear(): void {
    for (const id of rings.keys()) remove(id);
    currentWorld = null;
    currentMeta = null;
  }
  function refresh(world: any): void {
    if (!world || world !== currentWorld) { clear(); return; }
    const units = hoveredUnits(world, currentMeta);
    const active = new Set(units.map((unit) => unit.id));
    for (const id of rings.keys()) if (!active.has(id)) remove(id);
    for (const unit of units) {
      let ring = rings.get(unit.id);
      if (!ring) {
        ring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
          transparent: true, opacity: 0.75, depthWrite: false, toneMapped: false,
        }));
        ring.name = `unit_hover_${unit.id}`;
        ring.userData.pickable = false;
        ring.renderOrder = 3;
        rings.set(unit.id, ring);
        scene.add(ring);
      }
      const radius = unitRingRadius(unit.root, unit.kind);
      ring.scale.set(radius * 1.12, 1, radius * 1.12);
      unit.root.getWorldPosition(position);
      ring.position.set(position.x, groundAt(position.x, position.z) + 0.1, position.z);
      ring.material.color.setHex(hostile(unit.ownerId, unit.team) ? 0xff5544 : 0x44ff88);
    }
  }
  return {
    get hoveredUnitId(): number | null {
      return currentMeta?.soldierEntityId ?? currentMeta?.builderEntityId
        ?? currentMeta?.apcEntityId ?? currentMeta?.vehicleEntityId ?? currentMeta?.jetEntityId ?? null;
    },
    update(world: any, meta: HoverMeta | null, isHostile: (id: number, team: string) => boolean = () => false): void {
      if (world !== currentWorld) clear();
      currentWorld = world;
      currentMeta = meta;
      hostile = isHostile;
      refresh(world);
    },
    refresh, clear,
    dispose(): void { clear(); geometry.dispose(); },
  };
}

interface UnitSelection {
  unitIds?: readonly number[];
  builderId?: number | null;
  enemySquadId?: number | null;
  hoveredUnitId?: number | null;
}

const healthBarPlaneRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const healthBarCameraRotation = new THREE.Quaternion();
const healthBarParentRotation = new THREE.Quaternion();
const healthBarCenter = new THREE.Vector3();
const healthBarCameraRight = new THREE.Vector3();
const healthBarCameraUp = new THREE.Vector3();
const healthBarOrbitDirection = new THREE.Vector3();
const healthBarUnitKinds = ['soldier', 'builder', 'apc', 'vehicle', 'jet'];

/** Orbit unit bars about the torus center and face their planes toward the camera. */
export function faceHealthBarsToCamera(world: any, camera: THREE.Camera | null, groundAt: (x: number, z: number) => number = () => 0): void {
  if (!world || !camera) return;
  camera.getWorldQuaternion(healthBarCameraRotation);
  healthBarCameraRight.set(1, 0, 0).applyQuaternion(healthBarCameraRotation);
  healthBarCameraUp.set(0, 1, 0).applyQuaternion(healthBarCameraRotation);
  healthBarOrbitDirection.set(-healthBarCameraRight.z, 0, healthBarCameraRight.x);
  if (healthBarOrbitDirection.lengthSq() < 1e-10) {
    healthBarOrbitDirection.set(0, 0, 1).applyQuaternion(healthBarCameraRotation).setY(0);
  }
  healthBarOrbitDirection.normalize();
  if (healthBarOrbitDirection.dot(healthBarCameraUp) > 0) healthBarOrbitDirection.negate();
  // makeHpBar lays its child planes flat in XZ.
  healthBarCameraRotation.multiply(healthBarPlaneRotation);
  for (const id of world.query('mesh')) {
    const mesh = world.get(id, 'mesh');
    const bar = mesh?.hpBar;
    if (!bar?.visible) continue;
    const kind = healthBarUnitKinds.find((kind) => world.has(id, kind));
    if (kind && mesh.root) {
      mesh.root.getWorldPosition(healthBarCenter);
      const radius = unitRingRadius(mesh.root, kind) * 1.12 + 0.26;
      bar.position.copy(healthBarCenter).addScaledVector(healthBarOrbitDirection, radius);
      bar.position.y = groundAt(bar.position.x, bar.position.z) + 0.1;
      if (bar.parent) bar.parent.worldToLocal(bar.position);
    }
    bar.quaternion.copy(healthBarCameraRotation);
    if (bar.parent) {
      bar.parent.getWorldQuaternion(healthBarParentRotation).invert();
      bar.quaternion.premultiply(healthBarParentRotation);
    }
    // Billboard +X is screen-right, so keep the filled end pinned to screen-left.
    if (bar._fg && bar._width != null) {
      bar._fg.position.x = -(1 - bar._fg.scale.x) * bar._width / 2;
    }
  }
}

/** Show selected squads and individual hovered units after simulation updates visibility. */
export function syncUnitHealthBars(world: any, { unitIds = [], builderId = null, enemySquadId = null, hoveredUnitId = null }: UnitSelection = {}): void {
  if (!world) return;
  const selected = new Set(unitIds);
  const inspectedEnemy = unitIds.length === 0 && builderId == null ? enemySquadId : null;
  const show = (id: number, visible: boolean): void => {
    const mesh = world.get(id, 'mesh');
    if (mesh?.hpBar) mesh.hpBar.visible = visible && !!mesh.root && mesh.root.visible !== false && !mesh.root.userData?.disposed;
  };
  for (const id of world.query('soldier', 'mesh')) {
    const soldier = world.get(id, 'soldier');
    const squad = world.get(soldier.squadId, 'squad');
    show(id, soldier.hp > 0 && (id === hoveredUnitId || selected.has(soldier.squadId) || !!squad?.selected || soldier.squadId === inspectedEnemy));
  }
  for (const id of world.query('builder', 'mesh')) {
    const builder = world.get(id, 'builder');
    show(id, builder.hp > 0 && (id === hoveredUnitId || id === builderId || !!builder.selected));
  }
  for (const kind of ['apc', 'vehicle', 'jet']) {
    for (const id of world.query(kind, 'mesh')) {
      const unit = world.get(id, kind);
      show(id, unit.hp > 0 && (id === hoveredUnitId || selected.has(id) || !!unit.selected));
    }
  }
  // Individual soldiers already show their HP; the unused squad-level bar
  // must not reappear when passengers leave a transport.
  for (const id of world.query('squad', 'mesh')) {
    const mesh = world.get(id, 'mesh');
    if (mesh.hpBar) mesh.hpBar.visible = false;
  }
}
