import * as THREE from 'three';

const MAX_PARTICLES = 320;
const STEP_DISTANCE = .32;
type GroundHeight = (x: number, z: number) => number;
interface Walker {
    position: THREE.Vector3;
    distance: number;
    side: number;
}
interface DustParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    age: number;
    lifetime: number;
    size: number;
}

/** World-space footfalls, driven by rendered movement in either game mode. */
export class NecronFootDust {
    private walkers = new Map<THREE.Object3D, Walker>();
    private particles: DustParticle[] = [];
    private spare: DustParticle[] = [];
    private opacity = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PARTICLES), 1);
    private mesh: THREE.InstancedMesh;
    private position = new THREE.Vector3();
    private matrix = new THREE.Matrix4();
    private time = { value: 0 };

    constructor(private groundHeight: GroundHeight) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        geometry.setAttribute('dustOpacity', this.opacity);
        const material = new THREE.ShaderMaterial({
            uniforms: { uTime: this.time },
            vertexShader: `attribute float dustOpacity;varying vec2 vUv;varying float vOpacity;varying vec2 vSeed;
              void main(){vUv=uv;vOpacity=dustOpacity;vSeed=instanceMatrix[3].xz;
                vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
                center.xy+=position.xy*vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
                gl_Position=projectionMatrix*center;}`,
            fragmentShader: `uniform float uTime;varying vec2 vUv;varying float vOpacity;varying vec2 vSeed;
              float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
              float noise(vec2 p){vec2 cell=floor(p),f=fract(p);f=f*f*(3.-2.*f);
                return mix(mix(hash(cell),hash(cell+vec2(1.,0.)),f.x),mix(hash(cell+vec2(0.,1.)),hash(cell+vec2(1.,1.)),f.x),f.y);}
              void main(){vec2 position=(vUv-.5)*2.;
                float edge=pow(max(0.,1.-dot(position,position)),1.25);
                float density=noise(position*3.+vSeed+vec2(uTime*.2,-uTime*.1));
                float alpha=edge*(.55+density*.45)*vOpacity;
                if(alpha<.002)discard;
                gl_FragColor=vec4(mix(vec3(.38,.34,.28),vec3(.72,.65,.52),density),alpha);
                #include <colorspace_fragment>
              }`,
            transparent: true, depthWrite: false, toneMapped: false,
        });
        this.mesh = new THREE.InstancedMesh(geometry, material, MAX_PARTICLES);
        this.mesh.name = 'necron_foot_dust';
        this.mesh.count = 0;
        this.mesh.frustumCulled = false;
        this.mesh.userData.pickable = false;
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.opacity.setUsage(THREE.DynamicDrawUsage);
        for (let index = 0; index < MAX_PARTICLES; index++)
            this.spare.push({ position: new THREE.Vector3(), velocity: new THREE.Vector3(), age: 0, lifetime: 1, size: 1 });
    }

    update(deltaTime: number, roots: Iterable<THREE.Object3D>, scene: THREE.Scene): void {
        // Never draw a dust trail across a map reset or a renderer/scene replacement.
        if (this.mesh.parent && this.mesh.parent !== scene)
            this.clear();
        const delta = Math.min(Math.max(deltaTime, 0), .1);
        if (!delta) return;
        this.time.value += delta;
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const particle = this.particles[index];
            particle.age += delta;
            if (particle.age >= particle.lifetime) {
                this.spare.push(particle);
                this.particles.splice(index, 1);
            } else {
                particle.position.addScaledVector(particle.velocity, delta);
            }
        }
        const seen = new Set<THREE.Object3D>();
        for (const root of roots) {
            if (!root.parent || !root.visible) continue;
            seen.add(root);
            root.getWorldPosition(this.position);
            const previous = this.walkers.get(root);
            if (!previous) {
                this.walkers.set(root, { position: this.position.clone(), distance: 0, side: 1 });
                continue;
            }
            const moveX = this.position.x - previous.position.x;
            const moveZ = this.position.z - previous.position.z;
            const distance = Math.hypot(moveX, moveZ);
            const ground = this.groundHeight(this.position.x, this.position.z);
            // Ignore standing jitter, airborne motion, loading snaps and teleports.
            const walking = distance > delta * .3 && distance < Math.max(1.2, deltaTime * 14)
                && Math.abs(this.position.y - ground) < .35 && deltaTime <= .25;
            if (walking) {
                previous.distance += distance;
                for (let step = 0; previous.distance >= STEP_DISTANCE && step < 2; step++) {
                    previous.distance -= STEP_DISTANCE;
                    const along = THREE.MathUtils.clamp(1 - previous.distance / distance, 0, 1);
                    const directionX = moveX / distance, directionZ = moveZ / distance;
                    const footX = previous.position.x + moveX * along + directionZ * previous.side * .18;
                    const footZ = previous.position.z + moveZ * along - directionX * previous.side * .18;
                    this.emit(footX, footZ, directionX, directionZ);
                    previous.side *= -1;
                }
            } else {
                previous.distance = 0;
            }
            previous.position.copy(this.position);
        }
        for (const root of this.walkers.keys())
            if (!seen.has(root)) this.walkers.delete(root);

        this.particles.forEach((particle, index) => {
            const progress = particle.age / particle.lifetime;
            const size = particle.size * (.65 + progress * 1.1);
            this.matrix.makeScale(size, size * .55, 1);
            this.matrix.setPosition(particle.position);
            this.mesh.setMatrixAt(index, this.matrix);
            this.opacity.setX(index, Math.min(1, progress * 14) * (1 - progress) ** 1.2 * .85);
        });
        this.mesh.count = this.particles.length;
        this.mesh.instanceMatrix.needsUpdate = true;
        this.opacity.needsUpdate = true;
        if (this.mesh.count && !this.mesh.parent) scene.add(this.mesh);
        if (!this.mesh.count) this.mesh.removeFromParent();
    }

    private emit(x: number, z: number, directionX: number, directionZ: number): void {
        const particle = this.spare.pop();
        if (!particle) return;
        particle.position.set(x, this.groundHeight(x, z) + .12, z);
        particle.velocity.set(-directionX * .22 + (Math.random() - .5) * .14, .12, -directionZ * .22 + (Math.random() - .5) * .14);
        particle.age = 0;
        particle.lifetime = .9 + Math.random() * .2;
        particle.size = 1.05 + Math.random() * .25;
        this.particles.push(particle);
    }

    clear(): void {
        this.walkers.clear();
        this.spare.push(...this.particles);
        this.particles.length = 0;
        this.mesh.count = 0;
        this.mesh.removeFromParent();
    }
}
