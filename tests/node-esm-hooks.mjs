// ESM hooks that make Vite-isms loadable under plain `node --test`.
// Registered per test file via `register('./node-esm-hooks.mjs', import.meta.url)`.
// Game code is untouched: these hooks only affect the test process.
import { readFile } from 'node:fs/promises';

export async function resolve(specifier, context, next) {
  // Faction data files use bare JSON imports (Vite handles those natively).
  if (specifier.endsWith('.json')) {
    return { url: new URL(specifier, context.parentURL).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith('.json')) {
    return { format: 'json', source: await readFile(new URL(url), 'utf8'), shortCircuit: true };
  }
  if (url.endsWith('/src/scene.js')) {
    // Headless seam: let tests inject a scene/camera so resetGame can run
    // under node --test without a renderer. Appended export only; the game
    // itself never calls it (createScene owns scene/camera in production).
    const source = await readFile(new URL(url), 'utf8');
    if (!source.includes('export let camera;')) {
      throw new Error('node-esm-hooks: src/scene.js drifted, update the shim');
    }
    return {
      format: 'module',
      source: `${source}\nexport function __setSceneCameraForTests(sceneInstance, cameraInstance) { scene = sceneInstance; camera = cameraInstance; }\n`,
      shortCircuit: true,
    };
  }
  if (url.endsWith('/src/assets.js')) {
    // src/assets.js reads import.meta.env (Vite-only). Serve the real source
    // with just those expressions neutralized so modelUrl()/assetUrl() are
    // identity here.
    const source = await readFile(new URL(url), 'utf8');
    if (!source.includes('import.meta.env.VITE_MODEL_BASE') || !source.includes('import.meta.env.VITE_ASSET_BASE')) {
      throw new Error('node-esm-hooks: src/assets.js drifted, update the shim');
    }
    return {
      format: 'module',
      source: source
        .replace('import.meta.env.VITE_MODEL_BASE', 'undefined')
        .replace('import.meta.env.VITE_ASSET_BASE', 'undefined'),
      shortCircuit: true,
    };
  }
  if (url.includes('/src/') && url.endsWith('.js')) {
    // Vite-ism: import.meta.glob is statically replaced at build time; under
    // plain node it is undefined, so fall back to an empty map (same outcome
    // as the try/catch guards in cursors.js / maps-menu.js).
    const source = await readFile(new URL(url), 'utf8');
    if (source.includes('import.meta.glob')) {
      return {
        format: 'module',
        source: source.replaceAll('import.meta.glob', '(import.meta.glob || (() => ({})))'),
        shortCircuit: true,
      };
    }
  }
  return next(url, context);
}
