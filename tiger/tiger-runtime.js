/* =====================================================================
   TIGER RUNTIME – nạp cọp có xương (SkinnedMesh) và điều khiển chuyển động trong game.
   Cần: THREE (r128), tiger-rig.js. Dùng:
     TR.load('tiger/').then(function(){ var tg = TR.make(THREE); scene.add(tg.g); ... TR.pose(l,x,v,dt,i,rt,ctx) })
   ===================================================================== */
(function () {
  'use strict';
  var R = window.TigerRig, K = R.K, M = R.math;
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

  /* điều khiển 1 làn mỗi khung hình.  l: {ln,tg,gb,gl,ph}, ctx: {state,tm,win,mid} */
  TR.pose = function (l, x, v, dt, i, rt, ctx) {
    var g = l.tg, st = ctx.state, tm = ctx.tm;
    var tk = v, wave = 0, cheer = 0, jump = 0, air = 0, lean = 0, look = 0;
    if (st === 'intro') tk = 0;
    else if (st === 'warm') { tk = .42; lean = .1; }
    var wingo = ctx.win >= 0;
    if (wingo) tk = 0;
    /* làm mượt tốc độ & pha */
    l.kk = (l.kk === undefined ? tk : l.kk) + (tk - (l.kk === undefined ? tk : l.kk)) * Math.min(1, dt * 7);
    var k = l.kk;
    l.ph += dt * (3.2 + 12.6 * Math.min(1.3, k)) * (k > .03 ? 1 : 0) + dt * .0;
    var hop = 0, ry = 0;
    if (st === 'intro' && ctx.mid) {                 /* cọp giữa: vẫy tay, nhún nhảy chào */
      wave = 1; hop = Math.abs(Math.sin(tm * 4)) * .22; ry = -.3 + Math.sin(tm * 2) * .1;
    }
    if (wingo) {                                     /* cọp thắng: nhảy cẫng, giơ hai tay, xoay qua lại */
      var q = ctx.win, ph = Math.abs(Math.sin(q * 6)), sw = Math.sin(q * 6);
      cheer = Math.min(1, q * 6);
      jump = ph * .7 / K * 1.0;                       /* mô hình: độ cao nhảy */
      air = Math.min(1, ph * 2.4);
      ry = Math.sin(q * 3) * .6;
    }
    var pz = R.solve({ ph: l.ph, k: k, t: tm + i * 1.73, wave: wave, cheer: cheer, jump: jump, air: air, lean: lean, look: look });
    TR.apply(g, pz);
    l.ln.position.x = x;
    g.g.position.y = hop;
    g.g.rotation.y = ry;
    if (l.gl) l.gl.material.opacity = .42 + .2 * Math.sin(tm * 3 + i);
  };
})();
