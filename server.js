const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
// This solves the issue of loading models from different origins or local development
app.use(cors());

// Serve static files from the root directory
// Express.static automatically handles MIME types for .glb, .json, etc.
app.use(express.static(__dirname, {
    setHeaders: (res, filePath) => {
        // Specifically ensure .glb and .gltf files have correct headers if needed
        if (filePath.endsWith('.glb')) {
            res.set('Content-Type', 'model/gltf-binary');
        }
        if (filePath.endsWith('.gltf')) {
            res.set('Content-Type', 'model/gltf+json');
        }
        // Always allow CORS on static assets
        res.set('Access-Control-Allow-Origin', '*');
    }
}));

// Route for the main game page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'grimcraft.html'));
});

app.listen(PORT, () => {
    console.log(`
══════════════════════════════════════════════════════════════
  GRIMCRAFT RTS SERVER RUNNING
  
  URL: http://localhost:${PORT}
  CORS: Enabled (All Origins)
  Static Path: ${__dirname}
══════════════════════════════════════════════════════════════
    `);
});
