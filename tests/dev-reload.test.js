import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createServer } from 'vite';

test('source and HTML edits preserve the match while invalidating cached code', async () => {
  // Use the real project config and Vite watcher handlers, without opening a
  // network port or changing files in a running developer's workspace.
  const server = await createServer({
    server: { middlewareMode: true, ws: false, watch: null },
    logLevel: 'silent',
  });
  try {
    const messages = [];
    server.environments.client.hot.send = message => messages.push(message);
    const graph = server.environments.client.moduleGraph;
    const module = await graph.ensureEntryFromUrl('/src/fx/plasma-cloud-blaster.ts');
    module.isSelfAccepting = false;
    module.transformResult = { code: 'old code', map: null };

    for (const file of ['src/fx/plasma-cloud-blaster.ts', 'index.html', 'public/service-worker.js']) {
      for (const listener of server.watcher.listeners('change')) {
        await listener(path.resolve(file));
      }
    }

    assert.equal(module.transformResult, null, 'manual refresh must load fresh code');
    assert.deepEqual(messages.filter(message => ['full-reload', 'update'].includes(message.type)), [],
      'file changes must not reload the page or replace live game modules');
  } finally {
    await server.close();
  }
});
