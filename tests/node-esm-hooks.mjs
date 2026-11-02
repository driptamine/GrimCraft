// ESM hooks that make Vite-isms loadable under plain `node --test`.
// Registered per test file via `register('./node-esm-hooks.mjs', import.meta.url)`.
// Game code is untouched: these hooks only affect the test process.
import { readFile, stat } from 'node:fs/promises';
import ts from 'typescript';

async function resolveTsSibling(url) {
  // During the JS→TS migration, imports keep their `.js` spellings (Vite and
  // tsc resolve those to `.ts` siblings). Teach plain node the same trick.
  const m = url.match(/\.(jsx?)(\?|#|$)/);
  if (!m || !url.startsWith('file:')) {
    return null;
  }
  const tsHref = url.replace(/\.(jsx?)(\?|#|$)/, (_match, ext, rest) => (ext === 'jsx' ? '.tsx' : '.ts') + rest);
  try {
    await stat(new URL(tsHref.split('?')[0].split('#')[0]));
    return tsHref;
  } catch (_) {
    return null;
  }
}

export async function resolve(specifier, context, next) {
  // Faction data files use bare JSON imports (Vite handles those natively).
  if (specifier.endsWith('.json')) {
    return { url: new URL(specifier, context.parentURL).href, shortCircuit: true };
  }
  if (typeof specifier === 'string' && context.parentURL) {
    try {
      const sibling = await resolveTsSibling(new URL(specifier, context.parentURL).href);
      if (sibling) {
        return { url: sibling, shortCircuit: true };
      }
    } catch (_) {}
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith('.json')) {
    return { format: 'json', source: await readFile(new URL(url), 'utf8'), shortCircuit: true };
  }
  if (url.endsWith('/src/core/scene.js') || url.endsWith('/src/core/scene.ts')) {
    // Headless seam: let tests inject a scene/camera so resetGame can run
    // under node --test without a renderer. Appended export only; the game
    // itself never calls it (createScene owns scene/camera in production).
    const source = await readFile(new URL(url), 'utf8');
    if (!source.includes('export let camera')) {
      throw new Error('node-esm-hooks: src/core/scene drifted, update the shim');
    }
    const seam = '\nexport function __setSceneCameraForTests(sceneInstance, cameraInstance) { scene = sceneInstance; camera = cameraInstance; }\n';
    if (url.endsWith('.ts')) {
      const out = ts.transpileModule(source + seam, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
        },
      });
      return { format: 'module', source: out.outputText, shortCircuit: true };
    }
    return {
      format: 'module',
      source: source + seam,
      shortCircuit: true,
    };
  }
  if (url.endsWith('/src/assets.js') || url.endsWith('/src/assets.ts')) {
    // src/assets reads import.meta.env (Vite-only). Serve the real source
    // with just those expressions neutralized so modelUrl()/assetUrl() are
    // identity here. The .ts source still carries type annotations, so run
    // it through the transpiler below instead of serving it raw.
    const raw = await readFile(new URL(url), 'utf8');
    if (!raw.includes('import.meta.env.VITE_MODEL_BASE') || !raw.includes('import.meta.env.VITE_ASSET_BASE')) {
      throw new Error('node-esm-hooks: src/assets drifted, update the shim');
    }
    const neutralized = raw
      .replace('import.meta.env.VITE_MODEL_BASE', 'undefined')
      .replace('import.meta.env.VITE_ASSET_BASE', 'undefined');
    if (url.endsWith('.ts')) {
      const out = ts.transpileModule(neutralized, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
        },
      });
      return { format: 'module', source: out.outputText, shortCircuit: true };
    }
    return { format: 'module', source: neutralized, shortCircuit: true };
  }
  if ((url.includes('/src/') || url.includes('/tests/')) && (url.endsWith('.ts') || url.endsWith('.tsx'))) {
    // Migrated TypeScript sources: strip types with the repo's own
    // TypeScript so plain `node --test` keeps running them mid-migration.
    // Same Vite-ism stub as the .js branch below: import.meta.glob is
    // statically replaced at build time, so fall back to an empty map.
    const source = (await readFile(new URL(url), 'utf8')).replaceAll('import.meta.glob', '(import.meta.glob || (() => ({})))');
    const out = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    return { format: 'module', source: out.outputText, shortCircuit: true };
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
