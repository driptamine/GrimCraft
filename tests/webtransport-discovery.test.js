import { it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchWebTransportConnection } from '../src/net/lobby-api.js';

it('discovers a fresh certificate and refuses disabled or invalid WebTransport metadata', async () => {
  const original = globalThis.fetch;
  let info = {enabled:true,webtransport_url:'https://127.0.0.1:4433/grimcraft',certificate_hash:'A'.repeat(64)};
  const calls=[];
  globalThis.fetch=async (url,options)=>{calls.push({url,options});return{ok:true,json:async()=>info}};
  try {
    assert.equal((await fetchWebTransportConnection()).certificate_hash,'a'.repeat(64));
    info={...info,certificate_hash:'b'.repeat(64)};
    assert.equal((await fetchWebTransportConnection()).certificate_hash,'b'.repeat(64));
    assert.ok(calls.every(c=>c.options.cache==='no-store'));
    info={...info,enabled:false};
    await assert.rejects(fetchWebTransportConnection(),/without --no-wt/);
    info={...info,enabled:true,certificate_hash:'broken'};
    await assert.rejects(fetchWebTransportConnection(),/invalid WebTransport/);
    info={...info,certificate_hash:'b'.repeat(64),webtransport_url:'ws://127.0.0.1:8080/join'};
    await assert.rejects(fetchWebTransportConnection(),/invalid WebTransport/);
  } finally { globalThis.fetch=original; }
});
