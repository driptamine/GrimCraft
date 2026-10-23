import fs from 'fs';
import path from 'path';

const modelsDir = './models';
const outputDir = './animations';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const factions = [
    { name: 'chaos', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'eldar', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'ig', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'necrons', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'orks', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'sob', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' },
    { name: 'space_marines', dir: 'space marines', infantry: 'troops', structures: 'structures', vehicles: 'vehicles' },
    { name: 'tau', infantry: 'infantry', structures: 'structures', vehicles: 'vehicles' }
];

function extractAnimNames(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        if (buffer.length < 20) return [];
        
        // GLB Header check
        const magic = buffer.readUInt32LE(0);
        if (magic !== 0x46546C67) return []; // 'glTF'

        const jsonChunkLength = buffer.readUInt32LE(12);
        const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
        const gltf = JSON.parse(jsonString);
        
        return (gltf.animations || []).map(a => a.name).sort();
    } catch (e) {
        console.error(`Error parsing ${filePath}: ${e.message}`);
        return null;
    }
}

function processDirectory(factionDir, subDir, outputFile) {
    if (!subDir) return;
    const fullDir = path.join(modelsDir, factionDir, subDir);
    if (!fs.existsSync(fullDir)) {
        console.warn(`Directory not found: ${fullDir}`);
        return;
    }

    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.glb'));
    const results = {};

    files.forEach(file => {
        const anims = extractAnimNames(path.join(fullDir, file));
        if (anims) {
            results[file] = anims;
        }
    });

    fs.writeFileSync(path.join(outputDir, outputFile), JSON.stringify(results, null, 2));
    console.log(`Saved: ${outputFile} (${Object.keys(results).length} models)`);
}

factions.forEach(f => {
    const factionDir = f.dir || f.name;
    
    // Process Infantries
    processDirectory(factionDir, f.infantry, `${f.name}_infantries.json`);
    
    // Process Structures
    processDirectory(factionDir, f.structures, `${f.name}_structures.json`);

    // Process Vehicles
    processDirectory(factionDir, f.vehicles, `${f.name}_vehicles.json`);
});

console.log('\nBulk extraction complete.');
