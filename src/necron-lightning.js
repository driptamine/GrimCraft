import * as THREE from 'three';
import { mkGroup, mkTube, mkLines, disposeObj } from './three-helpers.js';
import { spawnParticles } from './systems.js';

// ══════════════════════════════════════════════════════════════════════════════
//  NECRON LIGHTNING — Soulstorm-style unstable green energy discharge.
//
//  Layered bolt (white-hot core line + green tube layers + additive glow
//  sprites + secondary branch arcs + impact flash) driven through the
//  existing beam-entity lifecycle: createLightningEntity() builds one,
//  systemBeam ticks update() and destroys the entity when it ends.
//
//  Usage:
//    const lightning = new NecronLightning(scene, { intensity: 1.2 });
//    lightning.fire(startVector3, targetVector3);
//    // per frame: if (!lightning.update(dt)) lightning.dispose();
//
//  Perf notes: core/branch line positions update in place (no per-frame
//  allocation); tube layers rebuild at most every 2nd frame on 'high' and
//  never animate on 'low'; the glow texture is shared module-wide and is
//  never disposed; module-scope temps avoid Vector3 churn.
// ══════════════════════════════════════════════════════════════════════════════

const _dir = new THREE.Vector3();
const _side = new THREE.Vector3();
const _upv = new THREE.Vector3();
const _tmp = new THREE.Vector3();

const DEFAULTS = {
  quality: 'high', // 'high' | 'low'
  intensity: 1.0, // scales brightness + flicker amplitude
  color: 0x00ff41, // necron green energy
  coreColor: 0xf2fff2, // near-white hot center
  duration: 0.32, // seconds the bolt lives
  segments: 12, // main-path joints (sharp angles)
  branchCount: 4, // secondary arc pool size
  branchProbability: 0.75, // respawn chance per dead branch per frame
  jitter: 1.0, // lateral displacement scale
  flicker: 0.55, // brightness noise amplitude
  bloomStrength: 1.0, // glow sprite / aura scaling (fake + future real bloom)
  particleCount: 5, // impact burst particles
};

let _glowTexture = null;

function getGlowTexture() {
  if (_glowTexture) {
    return _glowTexture;
  }
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x / (size - 1)) * 2 - 1;
      const dy = (y / (size - 1)) * 2 - 1;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const alpha = Math.pow(1 - dist, 2.2);
      const i = (y * size + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(alpha * 255);
    }
  }
  // DataTexture: no DOM canvas needed, works headless and in-browser.
  _glowTexture = new THREE.DataTexture(data, size, size);
  _glowTexture.needsUpdate = true;
  return _glowTexture;
}

function makeGlowSprite(color, opacity) {
  const material = new THREE.SpriteMaterial({
    map: getGlowTexture(),
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.userData.pickable = false;
  return sprite;
}

export class NecronLightning {
  constructor(scene, options = {}) {
    this.opts = { ...DEFAULTS, ...options };
    if (this.opts.quality === 'low') {
      this.opts.segments = Math.max(6, this.opts.segments - 4);
      this.opts.branchCount = Math.max(1, Math.floor(this.opts.branchCount / 2));
      this.opts.particleCount = Math.max(0, this.opts.particleCount - 2);
    }
    this.scene = scene || null;
    this.root = mkGroup('necron_lightning');
    if (this.scene) {
      this.scene.add(this.root);
    }
    this.root.frustumCulled = false;

    const n = this.opts.segments + 1;
    this._path = [];
    for (let i = 0; i < n; i++) {
      this._path.push(new THREE.Vector3());
    }

    // Layer 1: white-hot 1px core, updated in place every frame.
    this._coreGeo = new THREE.BufferGeometry();
    this._corePos = new Float32Array(n * 3);
    this._coreGeo.setAttribute('position', new THREE.BufferAttribute(this._corePos, 3));
    this._coreBase = new THREE.Color(this.opts.coreColor).multiplyScalar(1 + this.opts.intensity);
    this._coreMat = new THREE.LineBasicMaterial({ color: this._coreBase.clone(), transparent: true });
    this._core = new THREE.Line(this._coreGeo, this._coreMat);
    this._core.frustumCulled = false;
    this._core.userData.pickable = false;
    this.root.add(this._core);

    // Layers 2-3: green energy tube + wide translucent aura.
    this._midMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.opts.color).multiplyScalar(0.6 + this.opts.intensity * 0.7),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._auraMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.opts.color).multiplyScalar(0.4 + this.opts.intensity * 0.4),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._tubeMid = null;
    this._tubeAura = null;

    // Layer 4: soft outer glow sprites (mid-bolt + impact).
    this._glowMid = makeGlowSprite(this.opts.color, 0.5 * this.opts.bloomStrength);
    this._glowHit = makeGlowSprite(this.opts.color, 0.9 * this.opts.bloomStrength);
    this.root.add(this._glowMid);
    this.root.add(this._glowHit);
    this._flash = makeGlowSprite(0xffffff, 1);
    this.root.add(this._flash);

    // Secondary branch arcs: pooled lines, few frames of life each.
    this._branches = [];
    for (let i = 0; i < this.opts.branchCount; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(this.opts.color).multiplyScalar(1 + this.opts.intensity * 0.5),
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      line.userData.pickable = false;
      line.visible = false;
      this.root.add(line);
      this._branches.push({ line, age: 0, life: 0 });
    }
    // Impact arcs share one fading material.
    this._impactMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.opts.coreColor).multiplyScalar(1 + this.opts.intensity),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    this._impactArcs = [];
    for (let i = 0; i < 3; i++) {
      const line = mkLines(
        `necron_impact_${i}`,
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
        null,
        1,
      );
      line.material.dispose();
      line.material = this._impactMat;
      line.frustumCulled = false;
      line.userData.pickable = false;
      this.root.add(line);
      this._impactArcs.push(line);
    }

    this.age = 0;
    this.alive = false;
    this._frame = 0;
    this._start = new THREE.Vector3();
    this._end = new THREE.Vector3();
    this._length = 1;
    this._amp = 0.5;
  }

  fire(start, target) {
    this._start.copy(start);
    this._end.copy(target);
    _dir.copy(target).sub(start);
    this._length = _dir.length() || 1;
    _dir.normalize();
    const ref = Math.abs(_dir.y) > 0.9 ? _tmp.set(1, 0, 0) : _tmp.set(0, 1, 0);
    _side.crossVectors(_dir, ref).normalize();
    _upv.crossVectors(_side, _dir).normalize();
    this._side = (this._side || new THREE.Vector3()).copy(_side);
    this._upv = (this._upv || new THREE.Vector3()).copy(_upv);
    this._amp = Math.min(1.2, this._length * 0.06) * this.opts.jitter;
    this.age = 0;
    this._frame = 0;
    this.alive = true;
    this.root.visible = true;

    this._jitterPath();
    this._writeCore();
    this._rebuildTubes();
    this._placeGlow();

    // Impact: flash + tiny branching arcs + particle burst. The hit point
    // starts brighter than the rest of the bolt.
    this._flash.position.copy(this._end);
    this._flash.scale.set(2.4, 2.4, 1);
    this._flash.material.opacity = 1;
    this._flash.material.color.set(0xffffff);
    for (const arc of this._impactArcs) {
      this._randomShortArc(arc, this._end, 0.6 + Math.random() * 1.4);
    }
    if (this.opts.particleCount > 0) {
      spawnParticles(this._end, new THREE.Color(this.opts.color), this.opts.particleCount);
    }
    if (this.opts.quality === 'high') {
      _tmp.copy(this._start).add(this._end).multiplyScalar(0.5);
      spawnParticles(_tmp, new THREE.Color(this.opts.color), 2);
    }
    for (const branch of this._branches) {
      branch.age = 0;
      branch.life = 0;
      branch.line.visible = false;
      if (Math.random() < this.opts.branchProbability) {
        this._respawnBranch(branch);
      }
    }
    return this;
  }

  update(deltaTime) {
    if (!this.alive) {
      return false;
    }
    this.age += deltaTime;
    if (this.age >= this.opts.duration) {
      this.alive = false;
      this.root.visible = false;
      return false;
    }
    this._frame += 1;
    const t = this.age / this.opts.duration;
    const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;

    // Unstable brightness: continuous noise + occasional hard spikes.
    let flicker = 1 + (Math.random() - 0.5) * this.opts.flicker * this.opts.intensity;
    if (Math.random() < 0.06) {
      flicker += 0.8 + Math.random() * 0.6;
    }

    // Core re-jitters every frame (in place, no allocation).
    this._jitterPath();
    this._writeCore();
    this._coreMat.color.copy(this._coreBase).multiplyScalar(Math.max(0.15, flicker * fade));
    this._coreMat.opacity = Math.min(1, fade + 0.2);

    // Tubes follow at a lower rate: every 2nd frame on high, frozen on low.
    const tubeEvery = this.opts.quality === 'high' ? 2 : Infinity;
    if (this._frame % tubeEvery === 0) {
      this._rebuildTubes();
    }
    this._midMat.opacity = Math.min(1, 0.8 * flicker * fade);
    this._auraMat.opacity = Math.min(1, 0.28 * flicker * fade);

    // Glow sprites breathe around the bolt; impact flash decays fast.
    const breathe = 1 + Math.sin(this.age * 90) * 0.12 * flicker;
    const glowScale = (0.6 + this._length * 0.08) * breathe * this.opts.bloomStrength;
    this._glowMid.scale.set(glowScale * 1.6, glowScale * 1.0, 1);
    this._glowMid.material.opacity = Math.min(1, 0.5 * flicker * fade * this.opts.bloomStrength);
    this._glowHit.material.opacity = Math.min(1, 0.9 * flicker * fade * this.opts.bloomStrength);
    const flashT = Math.min(1, this.age / 0.15);
    this._flash.material.opacity = Math.max(0, (1 - flashT) * flicker);
    const flashScale = 2.4 * (1 - flashT * 0.75);
    this._flash.scale.set(flashScale, flashScale, 1);
    this._impactMat.opacity = Math.max(0, (1 - flashT) * flicker);

    // Branches live a few frames, then maybe jump again elsewhere.
    for (const branch of this._branches) {
      branch.age += deltaTime;
      if (branch.age >= branch.life) {
        if (Math.random() < this.opts.branchProbability) {
          this._respawnBranch(branch);
        } else {
          branch.line.visible = false;
          branch.life = 0.02;
          branch.age = 0;
        }
      } else if (branch.line.visible) {
        branch.line.material.opacity = Math.max(0, (1 - branch.age / branch.life) * flicker);
      }
    }
    return true;
  }

  dispose() {
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
    this.root.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      // All materials here are per-bolt instances; the shared glow texture
      // itself is never disposed (material.dispose leaves textures alone).
      if (child.material) {
        child.material.dispose();
      }
    });
    this.alive = false;
  }

  _jitterPath() {
    const n = this._path.length;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const p = this._path[i];
      p.copy(this._start).addScaledVector(_dir, t * this._length);
      if (i > 0 && i < n - 1) {
        // Full kink mid-bolt, converging to an exact strike at the target.
        const a = this._amp * Math.sin(t * Math.PI) * (1 - t * t * 0.9);
        p.addScaledVector(this._side, (Math.random() - 0.5) * 2 * a);
        p.addScaledVector(this._upv, (Math.random() - 0.5) * 2 * a);
      }
    }
  }

  _writeCore() {
    for (let i = 0; i < this._path.length; i++) {
      const p = this._path[i];
      this._corePos[i * 3] = p.x;
      this._corePos[i * 3 + 1] = p.y;
      this._corePos[i * 3 + 2] = p.z;
    }
    this._coreGeo.attributes.position.needsUpdate = true;
  }

  _rebuildTubes() {
    if (this._tubeMid) {
      this.root.remove(this._tubeMid);
      this._tubeMid.geometry.dispose();
    }
    if (this._tubeAura) {
      this.root.remove(this._tubeAura);
      this._tubeAura.geometry.dispose();
    }
    // mkTube auto-attaches to the default scene; re-parent into the bolt.
    this._tubeMid = mkTube('necron_bolt_mid', this._path, 0.025, 5);
    this._tubeMid.material = this._midMat;
    this._tubeMid.userData.pickable = false;
    this.root.add(this._tubeMid);
    this._tubeAura = mkTube('necron_bolt_aura', this._path, 0.07, 5);
    this._tubeAura.material = this._auraMat;
    this._tubeAura.userData.pickable = false;
    this.root.add(this._tubeAura);
  }

  _placeGlow() {
    _tmp.copy(this._start).add(this._end).multiplyScalar(0.5);
    this._glowMid.position.copy(_tmp);
    this._glowHit.position.copy(this._end);
    const hitScale = 1.2 * this.opts.bloomStrength;
    this._glowHit.scale.set(hitScale, hitScale, 1);
  }

  _respawnBranch(branch) {
    const n = this._path.length;
    const fromIdx = 1 + Math.floor(Math.random() * (n - 2));
    const from = this._path[fromIdx];
    const length = 0.5 + Math.random() * Math.min(2.5, this._length * 0.15);
    // Random walk away from the bolt; sometimes snaps back onto it.
    const reconnect = Math.random() < 0.25;
    const toIdx = Math.min(n - 1, Math.max(0, fromIdx + Math.floor((Math.random() - 0.5) * 6)));
    const points = 3 + Math.floor(Math.random() * 3);
    const pos = branch.line.geometry.attributes.position;
    _tmp.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      let px;
      let py;
      let pz;
      if (reconnect && i === points - 1) {
        px = this._path[toIdx].x;
        py = this._path[toIdx].y;
        pz = this._path[toIdx].z;
      } else {
        px = from.x + _tmp.x * length * t + (Math.random() - 0.5) * 0.5 * t;
        py = from.y + _tmp.y * length * t + (Math.random() - 0.5) * 0.5 * t;
        pz = from.z + _tmp.z * length * t + (Math.random() - 0.5) * 0.5 * t;
      }
      pos.setXYZ(i, px, py, pz);
    }
    branch.line.geometry.setDrawRange(0, points);
    pos.needsUpdate = true;
    branch.line.material.opacity = 0.5 + Math.random() * 0.5;
    branch.life = 0.03 + Math.random() * 0.06;
    branch.age = 0;
    branch.line.visible = true;
  }

  _randomShortArc(line, origin, length) {
    const pos = line.geometry.attributes.position;
    _tmp.set(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5).normalize();
    const bend = (Math.random() - 0.5) * length * 0.6;
    pos.setXYZ(0, origin.x, origin.y, origin.z);
    pos.setXYZ(
      1,
      origin.x + _tmp.x * length * 0.5 - _tmp.z * bend,
      origin.y + _tmp.y * length * 0.5,
      origin.z + _tmp.z * length * 0.5 + _tmp.x * bend,
    );
    if (pos.count > 2) {
      pos.setXYZ(
        2,
        origin.x + _tmp.x * length,
        origin.y + _tmp.y * length * 0.4,
        origin.z + _tmp.z * length,
      );
      line.geometry.setDrawRange(0, 3);
    }
    pos.needsUpdate = true;
  }
}
