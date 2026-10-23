import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Concatenated source of the input barrel plus every module in
// src/input/, for the suites that assert on implementation text.
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function readInputSource() {
  const parts = [fs.readFileSync(path.join(ROOT, 'src/input.js'), 'utf8')];
  const dir = path.join(ROOT, 'src/input');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
    parts.push(fs.readFileSync(path.join(dir, file), 'utf8'));
  }
  return parts.join('\n');
}
