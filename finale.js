/* FINALE v1 – màn về đích kiểu TVC: (1) quay chậm cận cảnh cọp chạm vạch đích, chụp khung hình đẹp; (2) sau khi mọi cọp về đích: bục vinh quang 1-2-3 bằng cọp 3D đứng trên bục, mỗi cọp cầm chai bắn bọt ăn mừng, chụp khung hình bục; (3) lưu ảnh vào FIN.snaps để share-fix.js ghép ảnh chia sẻ Facebook.
   Nạp TRƯỚC loader.js. Móc vào game.js qua patches-fix.js: DC.x() (lấy biến trong game), FIN.tick() (sau relab mỗi khung hình), FIN.pw() (tư thế ăn mừng), FIN.finDelay() (chờ hết cảnh bục mới hiện bảng chúc mừng).
   Mọi lỗi trong FIN.tick đều bị bắt: hỏng phần này thì game vẫn chạy như cũ. */
(function () {
  'use strict';
  var S = { pl: null, pod: null, bars: 0 };
  var FIN = window.FIN = {
    snaps: {},
    /* thời gian (giây) kể từ lúc lên bục của cọp hạng nhất/nhì/ba; -1 nếu không phải */
    pw: function (i) { var p = S.pod; return (p && p.on && p.rk.indexOf(i) >= 0) ? Math.max(0, p.q) : -1; },
    /* chờ bao lâu (ms) từ lúc celebrate() tới khi hiện bảng chúc mừng: hết cảnh bục */
    finDelay: function () {
      try {
        var p = window.DC.x().plan, rt = (performance.now() - p.t0) / 1000;
        return Math.max(2500, Math.round((p.mx + 1.9 + 5.6 - rt) * 1000));
      } catch (e) { return 3400; }
    },
    tick: function (now, dt) {
      try { run(now, dt); } catch (e) { try { console.warn('finale', e); } catch (_) {} }
    }
  };

  function showBars(X) {
    X.TV.style.display = 'block';
    setTimeout(function () { X.BT.style.height = X.BB.style.height = '6%'; }, 30);
  }

  /* chụp 1 khung hình: đặt cờ, app.js lưu vào window.__snap sau lần vẽ kế tiếp */
  function snapReq(key) {
    if (S['rq_' + key]) return;
    S['rq_' + key] = 1; S.want = key; window.__snap = null; window.__snapReq = 1;
  }
  function snapGet() {
    if (S.want && window.__snap) { FIN.snaps[S.want] = window.__snap; S.want = null; window.__snap = null; }
  }

  function burst(X, cx, cy, cz, col) {
    var q, th, ph, sp;
    for (q = 0; q < 80; q++) {
      th = Math.random() * 6.283; ph = Math.acos(2 * Math.random() - 1); sp = 6 + Math.random() * 5;
      X.emit(X.CNF, cx, cy, cz, Math.sin(ph) * Math.cos(th) * sp, Math.cos(ph) * sp, Math.sin(ph) * Math.sin(th) * sp, 1.5 + Math.random() * .9, col);
    }
  }

  /* camera A: thấp, đặt phía trước vạch đích nhìn thẳng vào cọp lao tới, cọp chạm vạch giữa khung */
  function camA(X, pl, rt) {
    var L = X.LN[pl.W], wo = L.ln.position, r = Math.sqrt(wo.x * wo.x + wo.z * wo.z) || X.RM,
      thF = X.TH0 - X.TOTA - 1.2 / X.RM, thC = thF - 12 / r, asp = X.fw && X.fh ? X.fw / X.fh : 1.6, C = X.C, fov = asp < 1 ? 36 : 30;
    C.position.set(Math.cos(thC) * (r - .7), 1.5 + Math.sin(rt * 3) * .03, Math.sin(thC) * (r - .7));
    C.lookAt(wo.x, 2.7, wo.z);
    if (Math.abs(C.fov - fov) > .05) { C.fov = fov; C.updateProjectionMatrix(); }
  }

  function numTex(TH, txt) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 96px "Be Vietnam Pro",sans-serif';
    x.lineWidth = 10; x.strokeStyle = '#7a4a00'; x.strokeText(txt, 64, 70); x.fillStyle = '#fff'; x.fillText(txt, 64, 70);
    return new TH.CanvasTexture(c);
  }

  /* dựng bục 1-2-3 ở khu đất trống phía ngoài cảnh đua (bán kính ~125), camera nhìn từ phía tâm ra */
  function buildPod(X, pl, rt) {
    var TH = window.THREE, n = X.LN.length, ord = [], i, PZ = 125;
    for (i = 0; i < n; i++) ord.push(i);
    ord.sort(function (a, b) { return pl.f[a] - pl.f[b]; });
    var rk = ord.slice(0, Math.min(3, n)), G = new TH.Group(), bl = [];
    G.position.set(0, 0, PZ); X.S.add(G);
    var spec = [{ x: 0, h: 3.2, c: 0xffc83a, t: '1' }, { x: 4.7, h: 2.3, c: 0xdfe6f2, t: '2' }, { x: -4.7, h: 1.6, c: 0xc98542, t: '3' }].slice(0, rk.length);
    var base = new TH.Mesh(new TH.BoxGeometry(17, .5, 5.4), new TH.MeshStandardMaterial({ color: 0xa3102a, roughness: .7 }));
    base.position.set(0, .25, 0); G.add(base);
    spec.forEach(function (s) {
      var m = new TH.Mesh(new TH.BoxGeometry(4.2, s.h, 3.4), new TH.MeshStandardMaterial({ color: s.c, roughness: .45, metalness: .35, emissive: s.c, emissiveIntensity: .14 }));
      m.position.set(s.x, .5 + s.h / 2, 0); G.add(m);
      var p = new TH.Mesh(new TH.PlaneGeometry(2.4, 2.4), new TH.MeshBasicMaterial({ map: numTex(TH, s.t), transparent: true }));
      p.position.set(s.x, .5 + s.h / 2, -1.71); p.rotation.y = Math.PI; G.add(p);
    });
    if (X.TX && X.TX.logo) {
      var lg = new TH.Sprite(new TH.SpriteMaterial({ map: X.TX.logo, transparent: true }));
      lg.scale.set(7, 7, 1); lg.position.set(0, 12, 4); G.add(lg);
    }
    if (X.TX && X.TX.glowY) {
      var gw = new TH.Sprite(new TH.SpriteMaterial({ map: X.TX.glowY, transparent: true, opacity: .55, depthWrite: false, blending: TH.AdditiveBlending }));
      gw.scale.set(26, 20, 1); gw.position.set(0, 6.5, 3); G.add(gw);
    }
    var pt = new TH.PointLight(0xffe0b0, 1.5, 60, 2); pt.position.set(0, 9, -8); G.add(pt);
    var gm = new TH.MeshStandardMaterial({ color: 0x1b5e32, roughness: .3, metalness: .4 });
    rk.forEach(function () {
      var b = new TH.Group();
      var body = new TH.Mesh(new TH.CylinderGeometry(.13, .13, .55, 12), gm); body.position.y = .28;
      var neck = new TH.Mesh(new TH.CylinderGeometry(.055, .11, .32, 12), gm); neck.position.y = .7;
      var foil = new TH.Mesh(new TH.CylinderGeometry(.065, .065, .14, 12), new TH.MeshStandardMaterial({ color: 0xffd54a, metalness: .6, roughness: .3 })); foil.position.y = .9;
      var lab = new TH.Mesh(new TH.CylinderGeometry(.135, .135, .2, 12), new TH.MeshStandardMaterial({ color: 0xfff3c4 })); lab.position.y = .26;
      b.add(body); b.add(neck); b.add(foil); b.add(lab);
      X.S.add(b); bl.push(b);
    });
    S.pod = { on: true, rk: rk, G: G, bl: bl, spec: spec, t0: rt, q: 0, PZ: PZ, lb: 0, v: new TH.Vector3(), fc: new TH.Color(0xfff0b0) };
    S.bars = 3; showBars(X);
    [523, 659, 784, 1047].forEach(function (f, k) { setTimeout(function () { try { X.beep(f, .4); } catch (e) {} }, k * 160); });
    burst(X, 0, 12, PZ + 4, new TH.Color(0xffd54a));
  }

  function podTick(X, pl, rt, now) {
    var P = S.pod, q = rt - P.t0, C = X.C, R = window.TigerRig, I = R && R.IDX, v = P.v, j;
    P.q = q;
    P.rk.forEach(function (li, k) {
      var L = X.LN[li], s = P.spec[k], y = .5 + s.h;
      L.ln.position.set(s.x, y, P.PZ);
      L.ln.rotation.y = Math.PI / 2 + (s.x > 0 ? .3 : (s.x < 0 ? -.3 : 0));
      var bt = P.bl[k], bone = (L.tg && L.tg.bones && I && I['hand.R'] !== undefined) ? L.tg.bones[I['hand.R']] : null;
      if (bone) bone.getWorldPosition(v); else v.set(s.x + .9, y + 3.4, P.PZ);
      bt.position.set(v.x, v.y - .05, v.z);
      bt.rotation.set(Math.sin(now * .045 + k) * .25, 0, -.35 + Math.sin(now * .05 + k * 2) * .3);
      var az = bt.rotation.z, ox = v.x - Math.sin(az) * .95, oy = v.y - .05 + Math.cos(az) * .95;
      for (j = 0; j < 2; j++) X.emit(X.PUF, ox, oy, v.z, (Math.random() - .5) * 2.4 - Math.sin(az) * 4, 5 + Math.random() * 3, -1.5 + (Math.random() - .5) * 2, .8 + Math.random() * .5);
      X.emit(X.CNF, ox, oy, v.z, (Math.random() - .5) * 3, 6 + Math.random() * 4, -2 + (Math.random() - .5) * 3, 1.2 + Math.random() * .6, P.fc);
    });
    if (now - P.lb > 450) {
      P.lb = now;
      burst(X, (Math.random() - .5) * 16, 14 + Math.random() * 6, P.PZ + 8 + Math.random() * 10, X.CCOL[(Math.random() * X.CCOL.length) | 0]);
    }
    var asp = X.fw && X.fh ? X.fw / X.fh : 1.6, d = asp < 1 ? 19 : 17,
      fov = Math.max(36, Math.min(74, 2 * Math.atan((9 / d) / asp) * 180 / Math.PI)), dz = d - q * .28;
    C.position.set(Math.sin(q * .45) * 1.1, 4.1 + q * .04, P.PZ - dz);
    C.lookAt(0, 4.8, P.PZ);
    if (Math.abs(C.fov - fov) > .05) { C.fov = fov; C.updateProjectionMatrix(); }
    /* bảng tên quà phía trên đầu mỗi cọp: tính lại cỡ theo camera bục (relab của game tính theo camera cũ) */
    var H = X.fh || 600, px = Math.max(26, Math.min(42, H * .045)), kk = 2 * px / H * Math.tan(C.fov * Math.PI / 360);
    P.rk.forEach(function (li) {
      var L = X.LN[li]; if (!L.sp) return;
      L.sp.visible = true; L.sp.center.set(.5, 0); L.sp.getWorldPosition(v);
      var hh = kk * v.distanceTo(C.position);
      L.sp.scale.set(hh * 2.9, hh * (L.sp.userData.hf || 1), 1);
    });
    if (q >= 3.2) snapReq('pod');
  }

  function run(now) {
    var SM = window.SLOWMO; if (SM) { SM.a = .8; SM.b = .4; SM.s = .34; }
    if (!window.DC || !window.DC.x) return;
    var X = window.DC.x(), pl = X.plan;
    if (!pl || !X.LN.length) return;
    if (S.pl !== pl) { S = { pl: pl, pod: null, bars: 0 }; FIN.snaps = {}; }
    if (X.state !== 'race' && X.state !== 'done') return;
    snapGet();
    var rt = (now - pl.t0) / 1000, DUR = X.DUR, a = SM ? SM.a : .8, b = SM ? SM.b : .4,
      podOn = !!(S.pod && S.pod.on), inWin = rt > DUR - a - .02 && rt < DUR + b + .15;
    if (inWin && !podOn) {
      if (S.bars !== 1) { S.bars = 1; showBars(X); }
      camA(X, pl, rt);
      if (rt >= DUR + .05) {
        if (!S.rq_fin) {
          var Lw = X.LN[pl.W].ln.position;
          burst(X, Lw.x, 3, Lw.z, X.CCOL[(Math.random() * X.CCOL.length) | 0]);
        }
        snapReq('fin');
      }
    } else if (!inWin && S.bars === 1) { S.bars = 2; X.hideTvc(); }
    var Tp = pl.mx + 1.9;
    if (rt >= Tp && !S.pod) buildPod(X, pl, rt);
    if (S.pod && S.pod.on) podTick(X, pl, rt, now);
  }
})();
