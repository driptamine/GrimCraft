import { it } from 'node:test';
import assert from 'node:assert/strict';
import { serverIdFromPath, serverPath, setServerRoute } from '../src/net/server-route.js';

it('reads a specific server route and rejects malformed or unrelated paths', () => {
  assert.equal(serverIdFromPath('/server/uyx9VVMaH9M'),'uyx9VVMaH9M');
  assert.equal(serverIdFromPath('/server/uyx9VVMaH9M/'),'uyx9VVMaH9M');
  assert.equal(serverIdFromPath('/server/%D1%82%D0%B5%D1%81%D1%82'),'тест');
  for (const path of ['/', '/server/', '/server/a/b', '/server/a%2Fb', '/server/a%5Cb', '/server/%ZZ', '/servers/lobby-1']) assert.equal(serverIdFromPath(path),null);
  assert.equal(serverPath('Z0x_c8-aP2Q'),'/server/Z0x_c8-aP2Q');
});
it('updates navigation without duplicating history entries and keeps rendering options', () => {
  const original=globalThis.window;
  const location={pathname:'/',search:'?models=procedural&quality=low'};
  const urls=[];
  globalThis.window={location,history:{pushState(_state,_title,url){urls.push(url);location.pathname=url.split('?')[0]}}};
  try {
    setServerRoute('Q8eN4vTz3_a');setServerRoute('Q8eN4vTz3_a');setServerRoute(null);
    assert.deepEqual(urls,['/server/Q8eN4vTz3_a?models=procedural&quality=low','/?models=procedural&quality=low']);
  } finally { globalThis.window=original; }
});
