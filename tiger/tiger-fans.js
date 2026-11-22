/* TIGER FANS – cọp 3D khán giả ngồi ghế, mỗi con một cử chỉ + một bộ đồ riêng (mũ, khăn, áo choàng, nơ).
   Dùng lại lưới/xương cọp đua (TR.make) nên tải thêm gần như không có. Tư thế ngồi: đùi ngang, cẳng chân thẳng xuống. */
(function () {
  'use strict';
  var TR = window.TR, R = window.TigerRig;
  if (!TR || !R) return;
  var M = R.math, D = R.D0, I = R.IDX, FA = window.FANS = { pool: [], groups: [] };
  var NF = 12;
  var GEST = [{ wave: 1 }, { cheer: 1 }, { lean: .25, look: .6 }, { look: -.6 }, { cheer: 1, lean: .15 }, { wave: 1, look: .5 },
    { look: .9 }, { lean: .3 }, { cheer: 1, look: -.4 }, { wave: 1, lean: .1 }, {}, { lean: .2, look: -.8 }];
  var HAT = ['santa', 'santa', 'beanie', 'beanie', 'antlers', 'crown', 'elf', 'santa', 'beanie', 'elf', 'antlers', 'beanie'];
  var HC = [0xd32f2f, 0x1f8f55, 0x2f6fd8, 0xffd54a, 0x8b5a2b, 0xffd54a, 0x1f8f55, 0x2f6fd8, 0xd32f2f, 0xd32f2f, 0x8b5a2b, 0x8e24aa];
  var CAPE = [0xd32f2f, 0x1f8f55, 0x2f6fd8, 0x8e24aa, 0xe8a317, 0x0f8f8f, 0xf4511e, 0xd32f2f, 0x2f6fd8, 0x1f8f55, 0xe8a317, 0x8e24aa];
  var SCARF = [0xffd54a, 0xffffff, 0xd32f2f, 0x1f8f55, 0x2f6fd8, 0xffd54a, 0xffffff, 0x8e24aa, 0xd32f2f, 0xffffff, 0x1f8f55, 0xffd54a];
  var mats = {};
  function mt(TH, c, em) { var k = c + '_' + (em || 0); return mats[k] || (mats[k] = new TH.MeshStandardMaterial({ color: c, roughness: .6, metalness: 0, emissive: c, emissiveIntensity: em == null ? .2 : em, side: TH.DoubleSide })); }
  function add(p, m) { p.add(m); return m; }
  function hat(TH, kind, c) {
    var g = new TH.Group(), W = mt(TH, 0xffffff, .35), m;
    if (kind === 'santa') {
      m = add(g, new TH.Mesh(new TH.ConeGeometry(.66, 1.25, 18), mt(TH, c))); m.position.set(0, .62, 0);
      m = add(g, new TH.Mesh(new TH.TorusGeometry(.66, .15, 8, 20), W)); m.rotation.x = Math.PI / 2;
      m = add(g, new TH.Mesh(new TH.SphereGeometry(.17, 10, 8), W)); m.position.set(0, 1.25, 0);
      g.rotation.x = -.28;
    } else if (kind === 'beanie') {
      m = add(g, new TH.Mesh(new TH.SphereGeometry(.7, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mt(TH, c))); m.position.y = .02;
      m = add(g, new TH.Mesh(new TH.TorusGeometry(.7, .12, 8, 20), mt(TH, 0xffffff, .3))); m.rotation.x = Math.PI / 2; m.position.y = .02;
      m = add(g, new TH.Mesh(new TH.SphereGeometry(.15, 10, 8), mt(TH, 0xffd54a))); m.position.y = .72;
    } else if (kind === 'elf') {
      m = add(g, new TH.Mesh(new TH.ConeGeometry(.58, 1.5, 16), mt(TH, c))); m.position.set(0, .75, 0);
      m = add(g, new TH.Mesh(new TH.TorusGeometry(.58, .1, 8, 18), mt(TH, 0xffd54a))); m.rotation.x = Math.PI / 2;
      m = add(g, new TH.Mesh(new TH.SphereGeometry(.12, 8, 6), mt(TH, 0xffd54a))); m.position.set(0, 1.5, 0);
      g.rotation.x = -.15; g.rotation.z = .1;
    } else if (kind === 'crown') {
      m = add(g, new TH.Mesh(new TH.CylinderGeometry(.6, .66, .32, 16, 1, true), mt(TH, 0xffd54a, .4)));
      for (var k = 0; k < 6; k++) { m = add(g, new TH.Mesh(new TH.ConeGeometry(.12, .4, 6), mt(TH, 0xffd54a, .4))); m.position.set(Math.sin(k * 1.047) * .62, .34, Math.cos(k * 1.047) * .62); }
      m = add(g, new TH.Mesh(new TH.SphereGeometry(.1, 8, 6), mt(TH, 0xd32f2f, .5))); m.position.set(0, .1, .68);
    } else {   /* antlers: gạc tuần lộc trên băng đô */
      [-1, 1].forEach(function (s) {
        var b = add(g, new TH.Mesh(new TH.CylinderGeometry(.06, .08, .85, 6), mt(TH, c))); b.position.set(s * .38, .4, -.05); b.rotation.z = -s * .35;
        var t = add(g, new TH.Mesh(new TH.CylinderGeometry(.045, .06, .45, 6), mt(TH, c))); t.position.set(s * .6, .72, -.05); t.rotation.z = s * .6;
        var u = add(g, new TH.Mesh(new TH.CylinderGeometry(.04, .055, .35, 6), mt(TH, c))); u.position.set(s * .5, .5, .1); u.rotation.x = .7; u.rotation.z = -s * .2;
      });
    }
    return g;
  }
  function outfit(tg, i, TH) {
    var head = tg.bones[I.head], neck = tg.bones[I.neck], chest = tg.bones[I.chest], g, m;
    g = hat(TH, HAT[i], HC[i]); g.position.set(0, .78, -.03); head.add(g);
    /* áo choàng phủ vai + lưng, chừa ngực để thấy logo 9 SẠCH */
    var ca = new TH.Mesh(new TH.CylinderGeometry(.5, .9, .95, 22, 1, true, Math.PI * .22, Math.PI * 1.56), mt(TH, CAPE[i], .22));
    ca.position.set(0, .05, -.02); chest.add(ca);
    m = new TH.Mesh(new TH.CylinderGeometry(.51, .92, .1, 22, 1, true, Math.PI * .22, Math.PI * 1.56), mt(TH, 0xffffff, .3)); m.position.set(0, -.42, -.02); chest.add(m);
    if (i % 2 === 0) { m = new TH.Mesh(new TH.TorusGeometry(.46, .12, 8, 20), mt(TH, SCARF[i], .25)); m.rotation.x = Math.PI / 2; m.position.set(0, -.02, 0); neck.add(m); }
    else { [-1, 1].forEach(function (s) { var b = new TH.Mesh(new TH.ConeGeometry(.16, .3, 8), mt(TH, SCARF[i], .3)); b.rotation.z = s * Math.PI / 2; b.position.set(s * .17, -.02, .45); neck.add(b); });
      m = new TH.Mesh(new TH.SphereGeometry(.09, 8, 6), mt(TH, 0xffd54a)); m.position.set(0, -.02, .46); neck.add(m); }
  }
  function sit(pz) {
    var q = pz.q, d0, tq, sa, fa;
    ['L', 'R'].forEach(function (s) {
      var t1 = Math.PI / 2 - .06 + (s === 'L' ? .03 : -.03);
      tq = M.arc(D['thigh.' + s], [s === 'L' ? .07 : -.07, -Math.cos(t1), Math.sin(t1)]);
      sa = M.arc(D['shin.' + s], [0, -1, .02]); d0 = D['foot.' + s]; fa = M.arc(d0, d0);
      q[I['thigh.' + s]] = tq; q[I['shin.' + s]] = M.qmul(M.qinv(tq), sa); q[I['foot.' + s]] = M.qmul(M.qinv(sa), fa);
    });
    pz.y = -.165;
  }
  FA.pose = function (tg, tm) {
    var gs = GEST[tg.fi % GEST.length], pz = R.solve({ ph: 0, k: 0, t: tm + tg.fi * 1.73, wave: gs.wave || 0, cheer: gs.cheer || 0, jump: 0, air: 0, lean: (gs.lean || 0) + .02 * Math.sin(tm * 1.7 + tg.fi), look: gs.look || 0 });
    sit(pz); TR.apply(tg, pz); TR.tail(tg, tm, 0, 0);
  };
  FA.build = function (TH) {
    if (FA.pool.length || !TR.ready) return FA.pool;
    var i, tg;
    for (i = 0; i < NF; i++) { tg = TR.make(TH); if (!tg) break; tg.fi = i; outfit(tg, i, TH); FA.pool.push(tg); FA.pose(tg, 0); }
    return FA.pool;
  };
  var lastT = -1;
  FA.tick = function (tm) { if (tm - lastT < .066) return; lastT = tm; FA.pool.forEach(function (tg) { if (tg.g.parent) FA.pose(tg, tm); }); };
})();
