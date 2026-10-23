import fs from 'fs';
import path from 'path';

const infantryDir = './models/ig/infantry';
const outputFile = './ig-infantry-animations.json';

const models = [
    'guardsmen.glb',
    'guardsmen_sergeant.glb',
    'kasrkin.glb',
    'kasrkin_sergeant.glb',
    'ogryn.glb',
    'ogryn_bonehead.glb',
    'aa_ogryn.glb',
    'commissar.glb',
    'imperial_captain.glb',
    'tech_priest.glb',
    'vindicare_temple_assassin.glb',
    'sanctioned_psyker.glb',
    'priest.glb',
    'aa_priest.glb',
    'heavy_weapon_platoon.glb',
    'heavy_weapon_platoon_deployed.glb'
];

function extractAnimNames(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        
        // GLB Header: Magic (4), Version (4), Length (4)
        // Chunk 0 Header: Length (4), Type (4)
        const jsonChunkLength = buffer.readUInt32LE(12);
        const jsonChunkType = buffer.toString('utf8', 16, 20);
        
        if (jsonChunkType !== 'JSON') {
            throw new Error('First chunk is not JSON');
        }
        
        const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
        const gltf = JSON.parse(jsonString);
        
        if (!gltf.animations) return [];
        
        return gltf.animations.map(a => a.name).sort();
    } catch (e) {
        console.error(`Error parsing ${filePath}: ${e.message}`);
        return null;
    }
}

const results = {};

console.log('Starting extraction...');

models.forEach(file => {
    const fullPath = path.join(infantryDir, file);
    if (fs.existsSync(fullPath)) {
        console.log(`Processing: ${file}`);
        const anims = extractAnimNames(fullPath);
        if (anims) {
            results[file] = anims;
        }
    } else {
        console.warn(`File not found: ${fullPath}`);
    }
});

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`\nSUCCESS: Extracted data for ${Object.keys(results).length} models.`);
console.log(`Saved to: ${outputFile}`);
