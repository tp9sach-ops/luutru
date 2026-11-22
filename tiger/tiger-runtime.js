/* =====================================================================
   TIGER RUNTIME – nạp cọp có xương (SkinnedMesh) và điều khiển chuyển động trong game.
   Cần: THREE (r128), tiger-rig.js. Dùng:
     TR.load('tiger/').then(function(){ var tg = TR.make(THREE); scene.add(tg.g); ... TR.pose(l,x,v,dt,i,rt,ctx) })
   v2 (mục 8): TƯ THẾ SẴN SÀNG (chân trước chân sau, gối khuỵu, chúi người, nhún nhẹ) khi chưa chạy (idle / giới thiệu / đếm ngược);
               XUẤT PHÁT: chạy luôn, không đứng đơ rồi bị kéo (sàn tốc độ chạy trong ~2.6 s đầu của cuộc đua).
   ===================================================================== */
(function () {
  'use strict';
  var R = window.TigerRig, K = R.K, M = R.math, TW = Math.PI * 2;
  var TR = window.TR = { ready: false, meta: null, geo: null, mat: null };

  function getBuf(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }); }
  function getJson(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }); }
  function getTex(url, opt) {
    return new Promise(function (ok, bad) {
      new THREE.TextureLoader().load(url, function (t) { t.flipY = false; t.anisotropy = opt && opt.aniso || 4; ok(t); }, undefined, function () { bad(new Error('texture ' + url)); });
    });
  }

  /* nạp lưới + trọng số da + texture, dùng chung cho mọi con cọp */
  TR.load = function (base) {
    base = base || 'tiger/';
    return Promise.all([getJson(base + 'tiger.json'), getBuf(base + 'tiger.bin'), getTex(base + 'tiger_color.webp', { aniso: 4 }), getTex(base + 'tiger_normal.webp').catch(function () { return null; })]).then(function (r) {
      var meta = r[0], bin = r[1], P = meta.parts, n = meta.n;
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bin, P.pos[0], n * 3), 3));
      /* normal 4 thành phần (căn lề 4 byte) → cắt còn 3 */
      var n4 = new Int8Array(bin, P.nor[0], n * 4), n3 = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) { n3[i * 3] = n4[i * 4] / 127; n3[i * 3 + 1] = n4[i * 4 + 1] / 127; n3[i * 3 + 2] = n4[i * 4 + 2] / 127; }
      g.setAttribute('normal', new THREE.BufferAttribute(n3, 3));
      g.setAttribute('uv', new THREE.BufferAttribute(new Uint16Array(bin, P.uv[0], n * 2), 2, true));
      g.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint8Array(bin, P.sidx[0], n * 4), 4));
      g.setAttribute('skinWeight', new THREE.BufferAttribute(new Uint8Array(bin, P.sw[0], n * 4), 4, true));
      g.setIndex(new THREE.BufferAttribute(new Uint16Array(bin, P.idx[0], meta.tris * 3), 1));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1.8, 0), 3.2);
      var m = new THREE.MeshStandardMaterial({ map: r[2], roughness: .78, metalness: 0, skinning: true,
        emissive: 0xffffff, emissiveMap: r[2], emissiveIntensity: .22 });
      if (r[3]) { m.normalMap = r[3]; m.normalScale = new THREE.Vector2(.7, .7); }
      TR.meta = meta; TR.geo = g; TR.mat = m; TR.ready = true;
      return TR;
    });
  };

  /* dựng 1 con cọp: trả về đối tượng tương thích với game (g, b, h, al, ll, t, top, bx) */
  TR.make = function (TH) {
    TH = TH || THREE;
    if (!TR.ready) return null;
    var B = R.BONES, bones = B.map(function (b) { var o = new TH.Bone(); o.name = b.n; return o; });
    bones.forEach(function (o, i) { var lp = R.localPos(i); o.position.set(lp[0] * K, lp[1] * K, lp[2] * K); if (B[i].p >= 0) bones[B[i].p].add(o); });
    var g = new TH.Group(), m = new TH.Group();
    m.rotation.y = Math.PI / 2;                    /* mặt cọp (+z mô hình) -> +x của đường đua */
    var mesh = new TH.SkinnedMesh(TR.geo, TR.mat);
    mesh.frustumCulled = false;
    m.add(bones[0]); m.add(mesh); g.add(m);
    g.updateMatrixWorld(true);
    var sk = new TH.Skeleton(bones);
    mesh.bind(sk);
    /* điểm gắn hộp quà: hệ trục game (x tiến, z ngang) đặt ở khớp đầu */
    var h = new TH.Object3D(); h.rotation.y = -Math.PI / 2; bones[R.IDX.head].add(h);
    var d = function () { return new TH.Object3D(); };
    return { g: g, m: m, b: bones[R.IDX.hips], h: h, al: [d(), d()], ll: [d(), d()], t: d(), top: 1.17, bx: -.12, rig: 1, bones: bones, mesh: mesh };
  };

  /* áp tư thế (đơn vị mô hình) lên các xương */
  TR.apply = function (tg, pz) {
    var s = pz.q, b = tg.bones, i, q;
    for (i = 0; i < b.length; i++) { q = s[i]; b[i].quaternion.set(q[0], q[1], q[2], q[3]); }
    b[0].position.set(pz.x * K, pz.y * K, pz.z * K);
  };

  /* TƯ THẾ SẴN SÀNG cho hai chân (IK 2 xương như trong solve): chân TRÁI đặt trước, chân PHẢI lùi sau (gót nhấc nhẹ), gối khuỵu, hông hạ thấp.
     Tay + thân lấy từ lớp "chạy" của solve ở pha 0 (tay phải ra trước, tay trái ra sau, khuỷu gập, thân chúi) nên khớp với dáng chuẩn bị bứt tốc.
     w = 0..1 trọng số trộn; t = thời gian cho nhịp nhún thở. */
  function nrm3(a) { var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function readyLegs(pz, w, t) {
    var q = pz.q, I = R.IDX, D = R.D0, L1 = .165, L2 = .083, HY = .31, AY = .062, RC = L1 + L2, dy = -.035 + .004 * Math.sin(t * 3.1);
    ['L', 'R'].forEach(function (s) {
      var sg = s === 'L' ? 1 : -1, fx = sg > 0 ? .05 : -.045, pit = sg > 0 ? .1 : -.3,
        fy = AY - (HY + dy), d = Math.sqrt(fx * fx + fy * fy), sc = d > 0 ? Math.min(d, RC * .9985) / d : 1, tx = fx * sc, ty = fy * sc,
        dd = Math.sqrt(tx * tx + ty * ty), al = Math.atan2(tx, -ty),
        be = Math.acos(M.clamp((L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd), -1, 1)), t1 = al + be,
        kn = Math.acos(M.clamp((L1 * L1 + L2 * L2 - dd * dd) / (2 * L1 * L2), -1, 1)), t2 = t1 - (Math.PI - kn),
        tq = M.arc(D['thigh.' + s], [0, -Math.cos(t1), Math.sin(t1)]), sa = M.arc(D['shin.' + s], [0, -Math.cos(t2), Math.sin(t2)]),
        d0 = D['foot.' + s],
        fd = nrm3([d0[0], d0[1] * Math.cos(-pit) - d0[2] * Math.sin(-pit), d0[1] * Math.sin(-pit) + d0[2] * Math.cos(-pit)]), fa = M.arc(d0, fd);
      q[I['thigh.' + s]] = M.nlerp(q[I['thigh.' + s]], tq, w);
      q[I['shin.' + s]] = M.nlerp(q[I['shin.' + s]], M.qmul(M.qinv(tq), sa), w);
      q[I['foot.' + s]] = M.nlerp(q[I['foot.' + s]], M.qmul(M.qinv(sa), fa), w);
    });
    pz.y = M.lerp(pz.y, dy, w);
  }

  /* điều khiển 1 làn mỗi khung hình.  l: {ln,tg,gb,gl,ph}, ctx: {state,tm,win,mid} */
  TR.pose = function (l, x, v, dt, i, rt, ctx) {
    var g = l.tg, st = ctx.state, tm = ctx.tm;
    var tk = v, wave = 0, cheer = 0, jump = 0, air = 0, lean = 0, look = 0;
    var wingo = ctx.win >= 0;
    if (st === 'intro') tk = 0;
    else if (st === 'warm') { tk = .42; lean = .1; }
    if (wingo) tk = 0;
    /* v22: cọp đang tăng tốc chúi hẳn về trước, cọp top 3 gắng sức thêm (l.rk = hạng, do patches-drama.js gán) */
    if (st === 'race' && !wingo) lean = Math.max(0, Math.min(.2, (v - .9) * .8)) + (l.rk !== undefined && l.rk < 3 ? .06 : 0);
    /* xuất phát: chạy luôn – sàn tốc độ chạy trong ~2.6 s đầu để chân không đứng đơ trong lúc vị trí đang tăng tốc */
    if (st === 'race' && !wingo && rt < 2.6) tk = Math.max(tk, .55 * (1 - M.sstep(1.2, 2.6, rt)));
    /* tư thế sẵn sàng: khi chưa chạy (idle, giới thiệu trừ cọp giữa đang vẫy, đếm ngược) */
    var rdT = (!wingo && (st === 'idle' || st === 'warm' || st === 'intro')) ? 1 : 0;
    if (l.rd === undefined) l.rd = rdT;
    l.rd += (rdT - l.rd) * Math.min(1, dt * (rdT ? 6 : 12));
    var rd = l.rd;
    tk = tk * (1 - rd) + .5 * rd;
    /* làm mượt tốc độ & pha */
    l.kk = (l.kk === undefined ? tk : l.kk) + (tk - (l.kk === undefined ? tk : l.kk)) * Math.min(1, dt * 7);
    var k = l.kk;
    l.ph += dt * (2.8 + 9.4 * Math.min(1.3, k)) * (k > .03 ? 1 : 0) * (1 - rd);
    if (rd > .01) l.ph += (Math.round(l.ph / TW) * TW - l.ph) * Math.min(1, dt * 6) * rd;   /* về pha 0: chân trái trước, tay phải trước */
    var hop = 0, ry = 0;
    if (false && st === 'intro' && ctx.mid) {   /* v19: tắt vẫy tay, cọp giữa vào thế sẵn sàng như các cọp khác */                 /* cọp giữa: vẫy tay, nhún nhảy chào */
      wave = 1; hop = Math.abs(Math.sin(tm * 4)) * .22; ry = -.3 + Math.sin(tm * 2) * .1;
    }
    if (wingo) {                                     /* cọp thắng: nhảy cẫng, giơ hai tay, xoay qua lại */
      var q = ctx.win, ph = Math.abs(Math.sin(q * 6)), sw = Math.sin(q * 6);
      cheer = Math.min(1, q * 6);
      jump = ph * .7 / K * 1.0;                       /* mô hình: độ cao nhảy */
      air = Math.min(1, ph * 2.4);
      ry = Math.sin(q * 3) * .6;
    }
    var pz = R.solve({ ph: l.ph + rd * .08 * Math.sin(tm * 3 + i * .9), k: k, t: tm + i * 1.73, wave: wave, cheer: cheer, jump: jump, air: air, lean: lean + .08 * rd, look: look });
    if (rd > .005) readyLegs(pz, rd, tm + i * 1.1);
    TR.apply(g, pz);
    l.ln.position.x = x;
    g.g.position.y = hop;
    g.g.rotation.y = ry;
    if (l.gl) l.gl.material.opacity = .42 + .2 * Math.sin(tm * 3 + i);
  };
})();
