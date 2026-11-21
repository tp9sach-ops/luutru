/* Dựng trọng số da (skin weights) cho mô hình cọp: phân vùng cứng theo xương -> khoảng cách TRÊN BỀ MẶT (Dijkstra) -> trộn mượt.
   Dùng: node skin.js <thư mục dữ liệu thô> <thư mục xuất> */
const fs = require('fs'), path = require('path');
const R = require('../tiger-rig.js');
const [, , inDir, outDir] = process.argv;
const rd = (n, T) => new T(fs.readFileSync(path.join(inDir, n)).buffer.slice(fs.readFileSync(path.join(inDir, n)).byteOffset, fs.readFileSync(path.join(inDir, n)).byteOffset + fs.readFileSync(path.join(inDir, n)).byteLength));
const buf = n => { const b = fs.readFileSync(path.join(inDir, n)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const P0 = new Float32Array(buf('s_pos.f32')), N0 = new Float32Array(buf('s_nor.f32')), U0 = new Float32Array(buf('s_uv.f32')), I0 = new Uint32Array(buf('s_idx.u32')), C0 = new Uint8Array(buf('s_col.u8'));
const n = P0.length / 3;
/* trục mô hình: xoay x +90° của nút gốc glTF: (x,y,z)->(x,-z,y) */
const V = [], NR = [];
for (let i = 0; i < n; i++) { V.push([P0[i * 3], -P0[i * 3 + 2], P0[i * 3 + 1]]); NR.push([N0[i * 3], -N0[i * 3 + 2], N0[i * 3 + 1]]); }

/* gộp đỉnh trùng vị trí (đường nối UV) để trọng số liền mạch */
const key = v => Math.round(v[0] * 20000) + ',' + Math.round(v[1] * 20000) + ',' + Math.round(v[2] * 20000);
const canon = new Int32Array(n), map = new Map(); let nc = 0; const cv = [];
for (let i = 0; i < n; i++) { const k = key(V[i]); if (!map.has(k)) { map.set(k, nc); cv.push(i); nc++; } canon[i] = map.get(k); }
console.log('đỉnh', n, 'đỉnh duy nhất', nc);
const adj = Array.from({ length: nc }, () => new Map());
const dist3 = (a, b) => Math.hypot(V[a][0] - V[b][0], V[a][1] - V[b][1], V[a][2] - V[b][2]);
for (let t = 0; t < I0.length; t += 3) for (let e = 0; e < 3; e++) { const a = canon[I0[t + e]], b = canon[I0[t + (e + 1) % 3]]; if (a !== b && !adj[a].has(b)) { const d = dist3(cv[a], cv[b]); adj[a].set(b, d); adj[b].set(a, d); } }

/* ---- phân vùng cứng ---- */
const dark = i => C0[i * 3] < 90 && C0[i * 3 + 1] < 80 && C0[i * 3 + 2] < 80;
function label(i) {
  const [x, y, z] = V[i], ax = Math.abs(x), L = x >= 0 ? 'L' : 'R';
  const dx = (ax - 0.268) / 0.075, dyv = (y - 0.985) / 0.098, dz = (z + 0.06) / 0.085;
  if (y > 0.86 && dx * dx + dyv * dyv + dz * dz < 1) return 'ear.' + L;
  if (dark(i) && y > 1.05 && ax < 0.15) return 'hair';
  if (y >= 0.63) return 'head';
  if (y >= 0.595 && ax < 0.14) return 'neck';
  if (y < 0.605 && ((ax > 0.185 && y > 0.40) || (ax > 0.165 && y > 0.47))) {
    if (ax < 0.245) return 'upperarm.' + L;
    if (ax < 0.30) return 'forearm.' + L;
    return 'hand.' + L;
  }
  if (y >= 0.47) return 'chest';
  if (y >= 0.375) return 'spine';
  if (y >= 0.30 || (y >= 0.26 && ax < 0.03)) return 'hips';
  if (y >= 0.135) return 'thigh.' + L;
  if (y >= 0.066) return 'shin.' + L;
  return 'foot.' + L;
}
const SIG = { hips: .04, spine: .04, chest: .04, neck: .03, head: .03, 'ear': .02, hair: .02, upperarm: .035, forearm: .02, hand: .015, thigh: .035, shin: .02, foot: .012 };
const sigOf = nm => SIG[nm.split('.')[0]] || .03;
const lab = new Array(nc); for (let c = 0; c < nc; c++) lab[c] = R.IDX[label(cv[c])];
const nb = R.BONES.length;

/* ---- Dijkstra đa nguồn cho từng xương ---- */
class Heap { constructor() { this.a = []; } push(d, v) { const a = this.a; a.push([d, v]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break;[a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break;[a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; } get n() { return this.a.length; } }
const W = new Float32Array(nc * nb);
for (let b = 0; b < nb; b++) {
  const d = new Float32Array(nc).fill(1e9), h = new Heap();
  let any = 0; for (let c = 0; c < nc; c++) if (lab[c] === b) { d[c] = 0; h.push(0, c); any = 1; }
  if (!any) continue;
  const sg = sigOf(R.BONES[b].n), cut = sg * 4;
  while (h.n) { const [dd, u] = h.pop(); if (dd > d[u] || dd > cut) continue; for (const [v, w] of adj[u]) { const nd = dd + w; if (nd < d[v] && nd <= cut) { d[v] = nd; h.push(nd, v); } } }
  for (let c = 0; c < nc; c++) if (d[c] < 1e8) W[c * nb + b] = Math.exp(-Math.pow(d[c] / sg, 2));
}
/* ---- 4 ảnh hưởng mạnh nhất, chuẩn hoá ---- */
const SI = new Uint8Array(n * 4), SW = new Uint8Array(n * 4), cnt = new Array(nb).fill(0);
for (let i = 0; i < n; i++) {
  const c = canon[i], ws = []; for (let b = 0; b < nb; b++) if (W[c * nb + b] > 1e-3) ws.push([W[c * nb + b], b]);
  if (!ws.length) ws.push([1, lab[c]]);
  ws.sort((a, b) => b[0] - a[0]); const top = ws.slice(0, 4); const s = top.reduce((a, b) => a + b[0], 0);
  let acc = 0; const q = top.map(t => Math.round(t[0] / s * 255)); q[0] += 255 - q.reduce((a, b) => a + b, 0);
  for (let k = 0; k < 4; k++) { SI[i * 4 + k] = k < top.length ? top[k][1] : 0; SW[i * 4 + k] = k < top.length ? q[k] : 0; }
  cnt[top[0][1]]++;
}
console.log('đỉnh chiếm ưu thế theo xương:'); R.BONES.forEach((b, i) => console.log(' ', b.n.padEnd(12), cnt[i]));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'skin_idx.u8'), Buffer.from(SI.buffer));
fs.writeFileSync(path.join(outDir, 'skin_w.u8'), Buffer.from(SW.buffer));
fs.writeFileSync(path.join(outDir, 'label.u8'), Buffer.from(Uint8Array.from(Array.from({ length: n }, (_, i) => lab[canon[i]]))));
console.log('xong');
