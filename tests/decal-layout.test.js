import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layoutPath = path.join(root, 'maps/6p_alvarus/6p_alvarus_layout_upd.json');

const TARGETS = {
  'art/decals/jungle/stone_cliff_05': 80,
  'art/decals/jungle/jungle_mud_02': 58,
  'art/decals/z_all/chaos_taint_02': 50,
  'art/decals/urban/urban_rubble03': 38,
  'art/decals/z_all/crater_dust_01': 34,
  'art/decals/jungle/jungle_rubble01': 27,
  'art/decals/z_all/crater_02': 21,
  'art/decals/z_all/crater_charred_01': 16,
};

describe('6p_alvarus decal layout', () => {
  it('layout JSON has exact target counts (preview.png as reference)', () => {
    const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    const counts = {};
    for (const d of layout.decals) counts[d.ref] = (counts[d.ref] || 0) + 1;
    for (const [ref, n] of Object.entries(TARGETS)) {
      assert.equal(counts[ref], n, `${ref} expected ${n} got ${counts[ref]}`);
    }
    assert.equal(layout.decals.length, 324);
  });

  it('SGB DATAENTY matches layout counts', () => {
    // Use proven python chunky parser via child process to avoid re-implementing header walk
    const out = execSync(`python3 -c "
import struct
data=open('maps/6p_alvarus/6p_alvarus.sgb','rb').read()
class R:
 def __init__(self,b): self.b=b; self.off=0
 def skip(self,n): self.off+=n
 def skipChunky(self): self.off+=24
 def readU32(self):
  import struct; v=struct.unpack_from('<I', self.b, self.off)[0]; self.off+=4; return v
 def readI32(self):
  import struct; v=struct.unpack_from('<i', self.b, self.off)[0]; self.off+=4; return v
 def readFloat(self):
  import struct; v=struct.unpack_from('<f', self.b, self.off)[0]; self.off+=4; return v
 def readData(self,n): v=self.b[self.off:self.off+n]; self.off+=n; return v
 def readString(self): l=self.readU32(); return self.readData(l).decode('utf-8') if l else ''
 def readStringUTF16(self): l=self.readU32(); return self.readData(l*2).decode('utf-16le') if l else ''
 def readFixedAscii(self,ln): s=self.readData(ln).decode('ascii'); return s.replace(chr(0),'').strip(chr(0))
 def readHeader(self,exp=''): 
  typ=self.readFixedAscii(8); ver=self.readU32(); sz=self.readU32(); name=self.readString()
  return {'typ':typ}
r=R(data)
r.skipChunky(); r.readHeader('FOLDSCEN'); r.readHeader('DATAWMHD'); r.readU32(); r.readU32(); r.readString(); r.readStringUTF16(); r.readStringUTF16(); r.skip(4)
r.readHeader('FOLDWSTC'); r.readHeader('FOLDTERR'); r.readHeader('FOLDTFAC'); r.readHeader('DATAVDAT')
r.readU32(); r.readU32(); r.readFloat(); r.skip(4); r.readFloat(); r.skip(4); r.readU32(); r.readU32(); r.skip(8); r.readU32(); r.readU32(); r.skip(6)
r.readHeader('FOLDCHAN'); r.readHeader('DATAHMAP'); hx=r.readU32(); hz=r.readU32(); r.readData(hx*hz)
r.readHeader('DATATTYP'); r.skip(4); fx=r.readU32(); fz=r.readU32(); r.skip(fx*fz); cx=r.readU32(); cz=r.readU32(); r.skip(cx*cz)
r.readHeader('DATAIMAP'); ix=r.readU32(); iz=r.readU32(); r.skip(ix*iz)
r.readHeader('DATADETT'); nt=r.readU32(); r.skip(nt*4)
r.readHeader('DATADSHD'); ndt=r.readU32()
for i in range(ndt): r.readString(); r.readI32()
r.readHeader('DATAEFFC'); r.skip(r.readU32() + 4)  # approximate - but our earlier working parser skipped by header size; use header size from read - simplified
" 2>&1 | head -n 20
`, { encoding: 'utf8' });
    // Alternative robust check: just verify layout matches SGB via the already-proven python one-liner that counts DATAENTY
    const sgbCounts = JSON.parse(execSync(`python3 << 'PY'
import struct, json, collections
data=open('maps/6p_alvarus/6p_alvarus.sgb','rb').read()
class R:
 def __init__(self,b): self.b=b; self.off=0
 def skip(self,n): self.off+=n
 def skipChunky(self): self.off+=24
 def readU32(self):
  import struct; v=struct.unpack_from('<I', self.b, self.off)[0]; self.off+=4; return v
 def readI32(self):
  import struct; v=struct.unpack_from('<i', self.b, self.off)[0]; self.off+=4; return v
 def readFloat(self):
  import struct; v=struct.unpack_from('<f', self.b, self.off)[0]; self.off+=4; return v
 def readData(self,n): v=self.b[self.off:self.off+n]; self.off+=n; return v
 def readString(self): l=self.readU32(); return self.readData(l).decode('utf-8') if l else ''
 def readStringUTF16(self): l=self.readU32(); return self.readData(l*2).decode('utf-16le') if l else ''
 def readFixedAscii(self,ln): s=self.readData(ln).decode('ascii'); return s.replace(chr(0),'').strip(chr(0))
 def readHeader(self,exp=''):
  typ=self.readFixedAscii(8); ver=self.readU32(); sz=self.readU32(); name=self.readString()
  if exp and typ!=exp: raise Exception(exp+' '+typ)
  return {'typ':typ,'sz':sz}
r=R(data)
r.skipChunky(); r.readHeader('FOLDSCEN'); r.readHeader('DATAWMHD'); r.readU32(); r.readU32(); r.readString(); r.readStringUTF16(); r.readStringUTF16(); r.skip(4)
r.readHeader('FOLDWSTC'); r.readHeader('FOLDTERR'); r.readHeader('FOLDTFAC'); r.readHeader('DATAVDAT')
r.readU32(); r.readU32(); r.readFloat(); r.skip(4); r.readFloat(); r.skip(4); r.readU32(); r.readU32(); r.skip(8); r.readU32(); r.readU32(); r.skip(6)
r.readHeader('FOLDCHAN'); r.readHeader('DATAHMAP'); hx=r.readU32(); hz=r.readU32(); r.readData(hx*hz)
r.readHeader('DATATTYP'); r.skip(4); fx=r.readU32(); fz=r.readU32(); r.skip(fx*fz); cx=r.readU32(); cz=r.readU32(); r.skip(cx*cz)
r.readHeader('DATAIMAP'); ix=r.readU32(); iz=r.readU32(); r.skip(ix*iz)
r.readHeader('DATADETT'); nt=r.readU32(); r.skip(nt*4)
r.readHeader('DATADSHD'); ndt=r.readU32()
for i in range(ndt): r.readString(); r.readI32()
h=r.readHeader('DATAEFFC'); r.skip(h['sz']); h=r.readHeader('DATAHRZN'); r.skip(h['sz'])
r.readHeader('FOLDDECL'); r.readHeader('DATASMAP'); n=r.readU32()
links=[]
for i in range(n): p=r.readString(); idx=r.readI32(); links.append((p,idx))
r.readHeader('DATAENTY'); n=r.readU32()
from collections import Counter
mp={idx:p for p,idx in links}
c=Counter()
for i in range(n): r.readU32(); didx=r.readI32(); r.readFloat(); r.readFloat(); r.readFloat(); r.readFloat(); c[mp[didx]]+=1
print(json.dumps(c))
PY`, { encoding: 'utf8' }));
    for (const [ref, n] of Object.entries(TARGETS)) assert.equal(sgbCounts[ref], n, `SGB ${ref}`);
  });

  it('layout builder must not cull cliff decals (regression for hang=4 bug leaving 8/80)', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const fn = src.slice(src.indexOf('export function buildSgbDecalsFromLayout'));
    assert.equal(fn.includes('hang > DECAL_MAX_HANG'), false, 'buildSgbDecalsFromLayout must not contain hang culling (would leave 8/80 stone_cliff_05)');
    assert.match(fn, /preview\.png/);
  });
});
