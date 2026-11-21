/* Đóng gói lưới + trọng số da thành tiger.bin / tiger.json cho game. Dùng: node pack.js <dữ liệu thô> <thư mục skin> <thư mục xuất> */
const fs = require('fs'), path = require('path');
const R = require('../tiger-rig.js');
const [, , rawDir, skinDir, outDir] = process.argv;
const buf = (d, n) => { const b = fs.readFileSync(path.join(d, n)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const P0 = new Float32Array(buf(rawDir, 's_pos.f32')), N0 = new Float32Array(buf(rawDir, 's_nor.f32')), U0 = new Float32Array(buf(rawDir, 's_uv.f32')), I0 = new Uint32Array(buf(rawDir, 's_idx.u32'));
const SI = new Uint8Array(buf(skinDir, 'skin_idx.u8')), SW = new Uint8Array(buf(skinDir, 'skin_w.u8'));
const n = P0.length / 3, K = R.K;
const pos = new Float32Array(n * 3), nor = new Int8Array(n * 4), uv = new Uint16Array(n * 2);
for (let i = 0; i < n; i++) {
  pos[i * 3] = P0[i * 3] * K; pos[i * 3 + 1] = -P0[i * 3 + 2] * K; pos[i * 3 + 2] = P0[i * 3 + 1] * K;
  const nx = N0[i * 3], ny = -N0[i * 3 + 2], nz = N0[i * 3 + 1], l = Math.hypot(nx, ny, nz) || 1;
  nor[i * 4] = Math.round(nx / l * 127); nor[i * 4 + 1] = Math.round(ny / l * 127); nor[i * 4 + 2] = Math.round(nz / l * 127);
  uv[i * 2] = Math.round(Math.min(1, Math.max(0, U0[i * 2])) * 65535); uv[i * 2 + 1] = Math.round(Math.min(1, Math.max(0, U0[i * 2 + 1])) * 65535);
}
const idx = new Uint16Array(I0.length); for (let i = 0; i < I0.length; i++) idx[i] = I0[i];
const parts = [['pos', pos], ['nor', nor], ['uv', uv], ['sidx', SI], ['sw', SW], ['idx', idx]];
let off = 0; const meta = { n, tris: idx.length / 3, K, parts: {} }; const chunks = [];
for (const [k, a] of parts) { const b = Buffer.from(a.buffer, a.byteOffset, a.byteLength); const pad = (4 - (off % 4)) % 4; if (pad) { chunks.push(Buffer.alloc(pad)); off += pad; } meta.parts[k] = [off, b.length]; chunks.push(b); off += b.length; }
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tiger.bin'), Buffer.concat(chunks));
meta.bones = R.BONES; meta.bytes = off;
fs.writeFileSync(path.join(outDir, 'tiger.json'), JSON.stringify(meta));
console.log('tiger.bin', off, 'bytes', 'tris', meta.tris, 'verts', n);
