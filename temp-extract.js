import fs from 'fs';
import path from 'path';

const structuresDir = './models/ig/structures';
const files = fs.readdirSync(structuresDir).filter(f => f.endsWith('.glb'));

const results = {};

files.forEach(file => {
    try {
        const buffer = fs.readFileSync(path.join(structuresDir, file));
        const jsonChunkLength = buffer.readUInt32LE(12);
        const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
        const gltf = JSON.parse(jsonString);
        results[file] = (gltf.animations || []).map(a => a.name).sort();
    } catch (e) {
        results[file] = [`ERROR: ${e.message}`];
    }
});

console.log(JSON.stringify(results, null, 2));
