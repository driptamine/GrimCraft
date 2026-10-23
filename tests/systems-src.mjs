import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Concatenated source of the systems barrel plus every module in
// src/systems/, for the suites that assert on implementation text.
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function readSystemsSource() {
  const parts = [fs.readFileSync(path.join(ROOT, 'src/systems.js'), 'utf8')];
  const dir = path.join(ROOT, 'src/systems');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
    parts.push(fs.readFileSync(path.join(dir, file), 'utf8'));
  }
  return parts.join('\n');
}
