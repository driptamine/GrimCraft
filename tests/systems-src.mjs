import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Concatenated source of the systems barrel plus every module in
// src/systems/, for the suites that assert on implementation text.
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function readSystemsSource() {
  // Migration reads both spellings: each module exists once (either .js or
  // its .ts port), the barrel likewise.
  const barrel = fs.existsSync(path.join(ROOT, 'src/systems.ts'))
    ? path.join(ROOT, 'src/systems.ts')
    : path.join(ROOT, 'src/systems.js');
  const parts = [fs.readFileSync(barrel, 'utf8')];
  const dir = path.join(ROOT, 'src/systems');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js') || f.endsWith('.ts')).sort()) {
    parts.push(fs.readFileSync(path.join(dir, file), 'utf8'));
  }
  return parts.join('\n');
}
