import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { excludeMaps, excludeModels, syncRuntimeAssets } from './scripts/sync-runtime-assets.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const r2Endpoint = env.R2_ENDPOINT_URL || '';
  const r2Bucket = env.R2_BUCKET_NAME || '';
  const modelBase =
    mode === 'production' && r2Endpoint && r2Bucket
      ? `${r2Endpoint}/${r2Bucket}`
      : '';
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