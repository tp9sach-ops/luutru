/* FINALE v2 – màn về đích kiểu TVC: (1) cọp chạy về đích BÌNH THƯỜNG, đợi mọi cọp về xong; (2) sau đó PHÁT LẠI CHẬM (replay, 0,4x) khoảnh khắc cọp thắng chạm dây đích, camera thấp ở mép đường đua phía trước vạch, đẩy dần + thu hẹp góc, thấy cả vài cọp về sát phía sau, dây đích đứt khi chạm, chụp khung hình đó; (3) bục vinh quang 1-2-3 bằng cọp 3D cầm chai bắn bọt, chụp khung hình bục; (4) lưu ảnh vào FIN.snaps để share-fix.js ghép ảnh chia sẻ Facebook.
   v2: bỏ quay chậm TRƯỚC khi về đích (SLOWMO.s=1); replay dựng lại vị trí từ plan.tab nên tái hiện đúng cuộc đua.
   Nạp TRƯỚC loader.js. Móc vào game.js qua patches-fix.js: DC.x() (lấy biến trong game), FIN.tick() (sau relab mỗi khung hình), FIN.pw() (tư thế ăn mừng), FIN.finDelay() (chờ hết replay + cảnh bục mới hiện bảng chúc mừng).
   Mọi lỗi trong FIN.tick đều bị bắt: hỏng phần này thì game vẫn chạy như cũ. */
(function () {
  'use strict';
  var S = { pl: null, pod: null, bars: 0, rep: null };
  /* replay: a = giây trước DUR bắt đầu phát lại, b = giây sau DUR kết thúc, s = tốc độ (0,4 = chậm còn 40%) */
  var REP = { a: 1.4, b: .8, s: .4 };
  function repLen() { return (REP.a + REP.b) / REP.s; }
  function t0Of(p) { return p.mx + .8; }
  function tpOf(p) { return t0Of(p) + repLen() + .15; }
  var FIN = window.FIN = {
    snaps: {},
    /* thời gian (giây) kể từ lúc lên bục của cọp hạng nhất/nhì/ba; -1 nếu không phải */
    pw: function (i) { var p = S.pod; return (p && p.on && p.rk.indexOf(i) >= 0) ? Math.max(0, p.q) : -1; },
    /* chờ bao lâu (ms) từ lúc celebrate() tới khi hiện bảng chúc mừng: hết replay + cảnh bục */
    finDelay: function () {
      try {
        var p = window.DC.x().plan, rt = (performance.now() - p.t0) / 1000;
        return Math.max(2500, Math.round((tpOf(p) + 5.6 - rt) * 1000));
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

  /* tiến độ (0..1) của cọp i tại thời gian t trên đồng hồ cuộc đua: giống hàm pr() trong game */
  function prg(pl, i, t) {
    var T = pl.tab[i], x = t / T.dt, k = x | 0;
    if (x <= 0) return 0;
    if (k >= T.n - 1) return T.c[T.n - 1];
    return T.c[k] + (T.c[k + 1] - T.c[k]) * (x - k);
  }

  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

  /* REPLAY: q = giây thật kể từ lúc bắt đầu phát lại */
  function replay(X, pl, q, now, dt) {
    var TH = window.THREE, n = X.LN.length, TH0 = X.TH0, TOTA = X.TOTA, RM = X.RM, LS = 2.7, RI = 14,
      tr = X.DUR - REP.a + q * REP.s, U = Math.max(0, Math.min(1, q / repLen())), C = X.C, W = pl.W,
      thF = TH0 - TOTA - 1.2 / RM, asp = X.fw && X.fh ? X.fw / X.fh : 1.6;
    if (!S.rep) {
      var Lw = n * LS + 1, tp = new TH.Group(), m1 = new TH.Mesh(new TH.BoxGeometry(.05, .13, Lw), new TH.MeshBasicMaterial({ color: 0xd8132f })),
        m2 = new TH.Mesh(new TH.BoxGeometry(.05, .13, Lw), new TH.MeshBasicMaterial({ color: 0xffffff }));
      m1.position.y = 1.75; m2.position.y = 1.58; tp.add(m1); tp.add(m2);
      tp.position.set(Math.cos(thF) * RM, 0, Math.sin(thF) * RM); tp.rotation.y = Math.PI / 2 - thF;
      X.S.add(tp);
      var cap = document.createElement('div');
      cap.style.cssText = 'position:absolute;left:0;right:0;bottom:8.5%;text-align:center;color:#ffe9a8;font:800 13px "Be Vietnam Pro",sans-serif;letter-spacing:.3em;text-shadow:0 2px 6px #000;z-index:3;pointer-events:none';
      cap.textContent = 'KHOẢNH KHẮC CHẠM ĐÍCH';
      X.TV.appendChild(cap);
      S.rep = { tape: tp, cap: cap, cut: 0 };
      S.bars = 1; showBars(X);
      try { X.beep(330, .25); } catch (e) {}
    }
    S.rep.cap.style.display = 'block';
    /* dựng lại vị trí + dáng chạy của mọi cọp ở thời điểm tr (chạy chậm theo REP.s) */
    X.LN.forEach(function (l, i) {
      var p = prg(pl, i, tr), p2 = prg(pl, i, tr + .06), th = TH0 - p * TOTA, r = RM + (i - (n - 1) / 2) * LS,
        v = Math.max(0, Math.min(1.3, (p2 - p) / .06 * X.DUR * .9));
      if (window.TR && l.tg && l.tg.rig) TR.pose(l, 0, v, dt * REP.s, i, tr, { state: 'race', tm: now / 1000, win: -1, mid: false, fall: -1 });
      l.th = th; l.v = v;
      l.ln.position.set(Math.cos(th) * r, 0, Math.sin(th) * r);
      l.ln.rotation.y = Math.PI / 2 - th;
      if (l.sp) l.sp.visible = false;
    });
    /* dây đích đứt khi cọp thắng chạm vạch + chụp khung hình đẹp */
    var thW = TH0 - prg(pl, W, tr) * TOTA;
    if (!S.rep.cut && thW <= thF) {
      S.rep.cut = 1; S.rep.tape.visible = false;
      var wp0 = X.LN[W].ln.position;
      burst(X, wp0.x, 2.2, wp0.z, X.CCOL[(Math.random() * X.CCOL.length) | 0]);
      burst(X, wp0.x, 2.6, wp0.z, X.CCOL[(Math.random() * X.CCOL.length) | 0]);
      snapReq('fin');
    }
    /* camera nghệ thuật: thấp, ở mép đường đua phía trước vạch, nhìn chéo vào cọp thắng, đẩy dần vào + thu hẹp góc */
    var rW = RM + (W - (n - 1) / 2) * LS, Ro = RI + n * LS, out = W >= (n - 1) / 2, rc = out ? Ro + 3.6 : RI - 2.2,
      d = (asp < 1 ? 17 - 6 * ease(U) : 13 - 5.5 * ease(U)), thC = thF - d / RM, h = 1.0 + .7 * ease(U),
      wp = X.LN[W].ln.position, bl = .5 * ease(U + .15),
      lx = Math.cos(thF) * rW, lz = Math.sin(thF) * rW,
      fov = (asp < 1 ? 50 : 34) * (1 - .15 * ease(U));
    C.position.set(Math.cos(thC) * rc, h, Math.sin(thC) * rc);
    C.lookAt(lx + (wp.x - lx) * bl, 2.0, lz + (wp.z - lz) * bl);
    if (Math.abs(C.fov - fov) > .02) { C.fov = fov; C.updateProjectionMatrix(); }
  }

  function endRep(X) {
    var R = S.rep; if (!R) return;
    try { X.S.remove(R.tape); } catch (e) {}
    R.cap.style.display = 'none';
    S.rep = null; S.repDone = 1;
    if (S.bars === 1) { S.bars = 2; X.hideTvc(); }
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

  function run(now, dt) {
    /* tắt quay chậm cũ TRƯỚC khi về đích (s=1: không kéo giãn thời gian); replay chạy ở đây sau khi mọi cọp về xong */
    var SM = window.SLOWMO; if (SM) { SM.a = .8; SM.b = .4; SM.s = 1; }
    if (!window.DC || !window.DC.x) return;
    var X = window.DC.x(), pl = X.plan;
    if (!pl || !X.LN.length) return;
    if (S.pl !== pl) { S = { pl: pl, pod: null, bars: 0, rep: null }; FIN.snaps = {}; }
    if (X.state !== 'race' && X.state !== 'done') return;
    snapGet();
    var rt = (now - pl.t0) / 1000, T0 = t0Of(pl), Tp = tpOf(pl), podOn = !!(S.pod && S.pod.on);
    dt = dt || .016;
    if (!podOn && !S.repFail && rt >= T0 && rt < Tp - .15) {
      try { replay(X, pl, rt - T0, now, dt); } catch (e) { S.repFail = 1; try { endRep(X); console.warn('replay', e); } catch (_) {} }
    } else if (S.rep) { endRep(X); }
    var TpUse = S.repFail ? T0 + 1.1 : Tp;
    if (rt >= TpUse && !S.pod) buildPod(X, pl, rt);
    if (S.pod && S.pod.on) podTick(X, pl, rt, now);
  }
})();
