// Global registration of the node ESM hooks for `npm test`.
//
// Test files historically call register() themselves, but that only affects
// dynamic import()s: static imports are all resolved before the test body
// (and its register() call) runs. During the JS→TS migration a static chain
// like three-helpers.js → r2-progress.js must redirect to the .ts sibling,
// so the hooks have to be installed before ANY test file links. Loaded via
// `node --import` (inherited by every node --test child process).
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
