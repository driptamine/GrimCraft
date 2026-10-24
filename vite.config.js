import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { excludeMaps, excludeModels, syncRuntimeAssets } from './scripts/sync-runtime-assets.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // CI has no .env file (gitignored): secrets arrive as process env, so it
  // wins over the file values used for local builds.
  const r2Endpoint = process.env.R2_ENDPOINT_URL || env.R2_ENDPOINT_URL || '';
  const r2Path = ((process.env.R2_PUBLIC_PATH ?? env.R2_PUBLIC_PATH) || '').replace(/^\/+|\/+$/g, '');
  // r2.dev public URLs and custom domains serve the bucket root directly,
  // so an extra path segment is appended only when explicitly configured.
  // (R2_BUCKET_NAME stays the real bucket name for uploads and is NOT used here.)
  const modelBase =
    mode === 'production' && r2Endpoint
      ? (r2Path ? `${r2Endpoint}/${r2Path}` : r2Endpoint)
      : '';
  // UI assets default to the same R2 bucket (under the `assets/` prefix);
  // R2_ASSET_BASE overrides when icons live elsewhere.
  const assetBase =
    mode === 'production'
      ? (process.env.R2_ASSET_BASE || env.R2_ASSET_BASE || r2Endpoint || '')
      : (process.env.R2_ASSET_BASE || env.R2_ASSET_BASE || '');
  return {
    plugins: [
      react(),
      wyw(),
      {
        // Vite wipes dist on every build (emptyOutDir). Maps (~20 MB) sync
        // every time; models (~0.9 GB of .glb) are skipped unless
        // GRIM_SYNC_MODELS=1, or synced manually via `npm run sync-assets`.
        name: 'sync-runtime-assets',
        closeBundle() {
          const roots = [
            { src: 'maps', dest: 'dist/maps', exclude: excludeMaps, label: 'maps' },
          ];
          const syncModels = env.GRIM_SYNC_MODELS === '1' || process.env.GRIM_SYNC_MODELS === '1';
          if (syncModels) {
            roots.push({ src: 'models', dest: 'dist/models', exclude: excludeModels, label: 'models' });
          } else {
            console.log('[sync-runtime-assets] models: skipped (set GRIM_SYNC_MODELS=1 or run npm run sync-assets)');
          }
          syncRuntimeAssets(roots);
        },
      },
    ],
    define: {
      'import.meta.env.VITE_MODEL_BASE': JSON.stringify(modelBase),
      'import.meta.env.VITE_ASSET_BASE': JSON.stringify(assetBase),
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
    },
  };
});