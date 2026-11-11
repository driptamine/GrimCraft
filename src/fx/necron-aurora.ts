import * as THREE from 'three';
export const NECRON_GLOW_STORAGE_KEY = 'grimcraft-necron-glow';
export type NecronGlowMode = 'new' | 'current' | 'off';
const timeUniform = { value: 0 };
let selectedMode: NecronGlowMode | null = null;
const trackedRoots = new Set<THREE.Object3D>();
const ribbonGeometry = new THREE.PlaneGeometry(1, 1, 12, 20);
ribbonGeometry.translate(0, .5, 0);
ribbonGeometry.userData.shared = true;
const auroraMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: timeUniform },
    vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorld;
    void main(){
      vUv=uv;
      vec3 transformed=position;
      vec3 origin=(modelMatrix*vec4(0.,0.,0.,1.)).xyz;
      float phase=origin.x*.71+origin.z*.43;
      transformed.x+=sin(uv.y*6.5-uTime*1.05+phase)*.11*uv.y;
      transformed.z+=sin(uv.y*4.+uTime*.7+phase)*.08*uv.y;
      vWorld=(modelMatrix*vec4(transformed,1.)).xyz;
      gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
    }`,
    fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorld;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){return noise(p)*.57+noise(p*2.03+7.1)*.28+noise(p*4.07+3.9)*.15;}
    void main(){
      vec2 flow=vec2(vUv.x*4.+vWorld.x*.35,vUv.y*3.-uTime*.48+vWorld.z*.2);
      float turbulence=fbm(flow);
      float curtain=sin(vUv.x*23.+turbulence*7.+vUv.y*2.-uTime*.65)*.5+.5;
      float strands=smoothstep(.25,.92,curtain)*smoothstep(.26,.78,turbulence);
      float edges=smoothstep(0.,.17,vUv.x)*smoothstep(0.,.17,1.-vUv.x);
      float vertical=smoothstep(0.,.10,vUv.y)*pow(max(0.,1.-vUv.y),1.4);
      float alpha=edges*vertical*(strands*.62+turbulence*.12);
      if(alpha<.004)discard;
      vec3 color=mix(vec3(.005,.48,.009),vec3(.19,1.,.025),strands);
      gl_FragColor=vec4(color*1.65,alpha);
      #include <colorspace_fragment>
    }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false,
});
auroraMaterial.userData.shared = true;
function softLightTexture(): THREE.DataTexture {
    const size = 64, pixels = new Uint8Array(size * size * 4);
    for (let row = 0; row < size; row++)
        for (let column = 0; column < size; column++) {
            const distance = Math.hypot((column + .5) / size * 2 - 1, (row + .5) / size * 2 - 1);
            const offset = (row * size + column) * 4;
            pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 255;
            pixels[offset + 3] = Math.round(Math.pow(Math.max(0, 1 - distance), 2.5) * 255);
        }
    const texture = new THREE.DataTexture(pixels, size, size);
    texture.needsUpdate = true;
    return texture;
}
const glowTexture = softLightTexture();
function glowMaterial(color: number, opacity: number): THREE.SpriteMaterial {
    const material = new THREE.SpriteMaterial({ map: glowTexture, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    material.userData.shared = true;
    return material;
}
const lampHaloMaterial = glowMaterial(0x35ffb1, .65);
const lampCoreMaterial = glowMaterial(0xdefff7, 1);
const wellHaloMaterial = glowMaterial(0x58ff05, .9);
const wellCoreMaterial = glowMaterial(0xe7ffad, 1);
const wellGeometry = new THREE.CircleGeometry(1, 48);
wellGeometry.rotateX(-Math.PI / 2);
wellGeometry.userData.shared = true;
const gasNoise = `
    float hash(vec2 position){return fract(sin(dot(position,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 position){vec2 cell=floor(position),fraction=fract(position);fraction=fraction*fraction*(3.-2.*fraction);
      return mix(mix(hash(cell),hash(cell+vec2(1.,0.)),fraction.x),mix(hash(cell+vec2(0.,1.)),hash(cell+vec2(1.,1.)),fraction.x),fraction.y);}
    float gas(vec2 position){return noise(position)*.58+noise(position*2.03+7.1)*.28+noise(position*4.07+3.9)*.14;}
`;
const wellMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: timeUniform },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uTime;varying vec2 vUv;
    ${gasNoise}
    void main(){vec2 position=(vUv-.5)*2.;float radius=length(position);
      vec2 drift=vec2(uTime*.14,-uTime*.11);
      vec2 warp=vec2(gas(position*2.+drift),gas(position*2.1-drift+13.));
      float density=gas(position*3.+warp*1.3+drift);
      float edge=1.-smoothstep(.62,1.,radius);
      float core=exp(-dot(position,position)*7.);
      vec3 color=mix(vec3(.055,.85,.002),vec3(.65,1.,.13),smoothstep(.3,.8,density)*core);
      gl_FragColor=vec4(color*1.35,edge*(.48+density*.46));
      #include <colorspace_fragment>
    }`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false
});
wellMaterial.userData.shared=true;
const gasCloudGeometry = new THREE.PlaneGeometry(1,1);
gasCloudGeometry.userData.shared=true;
const gasCloudMaterials=[0.,4.7,9.3].map(phase=>{
    const material=new THREE.ShaderMaterial({
        uniforms:{uTime:timeUniform,uPhase:{value:phase}},
        // Broad camera-facing puffs stay low in the well; no vertical ribbons.
        vertexShader:`varying vec2 vUv;void main(){vUv=uv;vec4 center=modelViewMatrix*vec4(0.,0.,0.,1.);
          center.xy+=position.xy*vec2(length(modelMatrix[0].xyz),length(modelMatrix[1].xyz));gl_Position=projectionMatrix*center;}`,
        fragmentShader:`uniform float uTime;uniform float uPhase;varying vec2 vUv;
          ${gasNoise}
          void main(){vec2 position=(vUv-.5)*2.;float distanceSquared=dot(position,position);
            float edge=pow(max(0.,1.-distanceSquared),2.);
            vec2 drift=vec2(uTime*.12,-uTime*.09)+uPhase;
            vec2 warp=vec2(gas(position*1.8+drift),gas(position*1.7-drift+11.));
            float density=gas(position*2.8+warp*1.5+drift);
            float alpha=edge*smoothstep(.15,.78,density)*.4;
            vec3 color=mix(vec3(.035,.65,.002),vec3(.36,1.,.035),density);
            gl_FragColor=vec4(color*1.45,alpha);
            #include <colorspace_fragment>
          }`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false
    });material.userData.shared=true;return material;
});
const warriorGasMaterials = [0, 5.7, 12.4, 19.1].map(phase => {
    const material = new THREE.ShaderMaterial({
        uniforms: { uTime: timeUniform, uPhase: { value: phase } },
        vertexShader: gasCloudMaterials[0].vertexShader,
        fragmentShader: `uniform float uTime;uniform float uPhase;varying vec2 vUv;
          ${gasNoise}
          void main(){
            vec2 position=(vUv-.5)*2.;
            // Isotropic, slowly changing density: no upward flow or thin strands.
            vec2 drift=vec2(sin(uTime*.21+uPhase),cos(uTime*.18+uPhase))*.35;
            vec2 warp=vec2(gas(position*1.5+drift+uPhase),gas(position*1.6-drift+uPhase+11.));
            float density=gas(position*2.6+warp*1.1+drift+uPhase);
            float edge=pow(max(0.,1.-dot(position,position)),1.7);
            float alpha=edge*(.12+smoothstep(.24,.78,density)*.48);
            vec3 color=mix(vec3(.025,.52,.055),vec3(.3,1.,.07),density);
            gl_FragColor=vec4(color*1.25,alpha);
            #include <colorspace_fragment>
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    });
    material.userData.shared = true;
    return material;
});
function addGlowSprite(parent: THREE.Object3D, material: THREE.SpriteMaterial, size: number, name: string): void {
    const sprite = new THREE.Sprite(material);
    sprite.name = name;
    sprite.scale.set(size, size, 1);
    sprite.userData.pickable = false;
    parent.add(sprite);
}
function addWisps(parent: THREE.Object3D, width: number, height: number): void {
    for (let layer = 0; layer < 3; layer++) {
        const ribbon = new THREE.Mesh(ribbonGeometry, auroraMaterial);
        ribbon.name = 'necron_aurora_wisp';
        ribbon.scale.set(width, height, width);
        ribbon.rotation.y = layer * Math.PI / 3;
        ribbon.renderOrder = 6;
        ribbon.userData.pickable = false;
        parent.add(ribbon);
    }
}
function addGeneratorLamp(parent: THREE.Object3D, position: THREE.Vector3, width: number, name: string): void {
    const lamp = new THREE.Group();
    lamp.name = name;
    lamp.position.copy(position);
    lamp.userData.pickable = false;
    parent.add(lamp);
    addGlowSprite(lamp, lampHaloMaterial, width * 1.6, 'necron_generator_lamp_halo');
    addGlowSprite(lamp, lampCoreMaterial, width * .6, 'necron_generator_lamp_core');
    for (const sprite of lamp.children)
        sprite.position.y = width * .16;
}
function addGeneratorWell(parent: THREE.Object3D, position: THREE.Vector3, width: number, height: number): void {
    const well = new THREE.Group();
    well.name = 'necron_generator_center';
    well.position.copy(position);
    well.userData.pickable = false;
    parent.add(well);
    const radius = width * .18;
    const pool = new THREE.Mesh(wellGeometry, wellMaterial);
    pool.name = 'necron_generator_energy_pool';
    pool.scale.setScalar(radius);
    pool.userData.pickable = false;
    well.add(pool);
    addGlowSprite(well, wellHaloMaterial, radius * 2.2, 'necron_generator_center_halo');
    addGlowSprite(well, wellCoreMaterial, radius * .85, 'necron_generator_center_core');
    for(let layer=0;layer<3;layer++){
        const cloud=new THREE.Mesh(gasCloudGeometry,gasCloudMaterials[layer]);
        cloud.name='necron_generator_gas_cloud';
        cloud.position.set((layer-1)*radius*.24,radius*(.04+layer*.06),0);
        cloud.scale.set(radius*(1.9-layer*.2),Math.min(height*.13,radius*.65),1);
        cloud.frustumCulled=false;cloud.userData.pickable=false;well.add(cloud);
    }
}
export function necronGlowMode(): NecronGlowMode {
    if (selectedMode)
        return selectedMode;
    try {
        const stored = localStorage.getItem(NECRON_GLOW_STORAGE_KEY);
        if (stored === 'current' || stored === 'off')
            return selectedMode = stored;
    }
    catch { }
    return selectedMode = 'new';
}
function applyMode(root: THREE.Object3D): void {
    const mode = necronGlowMode();
    root.traverse(node => {
        if (node.name === 'necron_aurora')
            node.visible = node.userData.necronGeneratorGlow ? mode !== 'off' : mode === 'new';
        if (node.name === 'necron_aura' || node.userData.necronLegacyShell)
            node.visible = mode === 'current';
    });
}
export function setNecronGlowMode(mode: NecronGlowMode): void {
    selectedMode = mode;
    try {
        localStorage.setItem(NECRON_GLOW_STORAGE_KEY, mode);
    }
    catch { }
    for (const root of trackedRoots)
        applyMode(root);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function')
        window.dispatchEvent(new Event('necron-glow-changed'));
}
export function updateNecronAurora(time: number): void {
    timeUniform.value = time;
    for (const root of trackedRoots)
        if (!root.parent)
            trackedRoots.delete(root);
}
/** Keep both warrior variants alive so switching never reloads a GLB. */
export function attachWarriorAurora(root: THREE.Object3D): void {
    if (root.getObjectByName('necron_aurora'))
        return;
    root.traverse(node => {
        if (node.name.endsWith('_gas'))
            node.userData.necronLegacyShell = true;
    });
    const group = new THREE.Group();
    group.name = 'necron_aurora';
    group.userData.pickable = false;
    root.add(group);
    // Soft overlapping clouds hug the torso and thighs instead of rising above the head.
    const clouds = [
        [-.33, 1.3, 0, 1.15, 1.05],
        [.34, 1.15, .08, 1.15, 1.1],
        [-.18, .68, .06, .95, .8],
        [.12, 1.6, 0, .85, .65],
    ];
    clouds.forEach(([x, y, z, width, height], layer) => {
        const cloud = new THREE.Mesh(gasCloudGeometry, warriorGasMaterials[layer]);
        cloud.name = 'necron_warrior_gas_cloud';
        cloud.position.set(x, y, z);
        cloud.scale.set(width, height, 1);
        cloud.userData.pickable = false;
        cloud.userData.necronEffect = true;
        group.add(cloud);
    });
    trackedRoots.add(root);
    applyMode(root);
}
export function attachNecronStructureAurora(root: THREE.Object3D, type: string): void {
    if (root.getObjectByName('necron_aurora'))
        return;
    if (!['obelisk', 'listening_post', 'plasma_generator', 'thermoplasma_generator', 'thermo_generator'].includes(type))
        return;
    root.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3();
    root.traverse(node => {
        const mesh = node as THREE.Mesh;
        if (mesh.isMesh && !node.userData.necronEffect && !node.name.includes('sel') && !node.name.includes('hitbox')) {
            mesh.geometry.computeBoundingBox();
            if (mesh.geometry.boundingBox)
                bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
        }
    });
    if (bounds.isEmpty())
        return;
    const inverse = root.matrixWorld.clone().invert();
    const localBounds = bounds.clone().applyMatrix4(inverse);
    const size = localBounds.getSize(new THREE.Vector3()), center = localBounds.getCenter(new THREE.Vector3());
    const group = new THREE.Group();
    group.name = 'necron_aurora';
    group.userData.pickable = false;
    group.userData.necronEffect = true;
    root.add(group);
    if (type === 'obelisk' || type === 'listening_post') {
        // Tall curtains along the shaft; the stone remains readable inside them.
        const shaft = new THREE.Group();
        shaft.position.set(center.x, localBounds.min.y + size.y * .16, center.z);
        group.add(shaft);
        addWisps(shaft, Math.min(size.x, size.z) * .95, size.y * .95);
    }
    else {
        group.userData.necronGeneratorGlow = true;
        const anchors: THREE.Object3D[] = [];
        root.traverse(node => {
            if (/^marker_capture_light_[1-4]$/i.test(node.name))
                anchors.push(node);
        });
        const groundAnchors = anchors.length === 0;
        if (groundAnchors)
            root.traverse(node => {
                if (/^mrkr_grnd_light_0[1-4]$/i.test(node.name))
                    anchors.push(node);
            });
        const positions = anchors.slice(0, 4).map(node => root.worldToLocal(node.getWorldPosition(new THREE.Vector3())));
        if (positions.length < 4) {
            positions.length = 0;
            for (let corner = 0; corner < 4; corner++) {
                const angle = corner * Math.PI / 2;
                positions.push(new THREE.Vector3(center.x + Math.cos(angle) * size.x * .31, localBounds.min.y + size.y * .65, center.z + Math.sin(angle) * size.z * .31));
            }
        }
        if (groundAnchors)
            for (const position of positions) {
                const angle = Math.atan2(position.z - center.z, position.x - center.x);
                position.set(center.x + Math.cos(angle) * size.x * .32, localBounds.min.y + size.y * 1.015, center.z + Math.sin(angle) * size.z * .32);
            }
        const generatorWidth = Math.min(size.x, size.z);
        const lightWidth = Math.max(.18, generatorWidth * .12);
        positions.forEach((position, index) => addGeneratorLamp(group, position, lightWidth, `necron_generator_light_${index + 1}`));
        const rimHeight = Math.max(...positions.map(position => position.y));
        addGeneratorWell(group, new THREE.Vector3(center.x, rimHeight - size.y * (groundAnchors ? .02 : .055), center.z), generatorWidth, size.y);
    }
    trackedRoots.add(root);
    applyMode(root);
}
