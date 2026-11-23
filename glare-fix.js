/* GLARE-FIX v1 – giảm lóa sáng ở khoảnh khắc về đích + bục vinh quang (ảnh chia sẻ Facebook).
   Nguyên nhân: sau khi cọp về đích, cảnh có rất nhiều hiệu ứng CỘNG SÁNG (additive) chồng nhau ngay trước ống kính replay: 8 chùm đèn pha hình nón (patches-scene.js), quầng sáng 26x26 độ sáng .8 tại chỗ cọp thắng (celebrate() trong game.js), quầng cổng đích, đèn đường, quầng hộp quà từng cọp. Thêm nữa lúc cắt dây đích finale.js bắn 160 hạt pháo giấy TẠI MỘT ĐIỂM ngay chỗ cọp rồi chụp luôn đúng khung đó => cục trắng vàng cháy sáng.
   Sửa (không đụng game.js / finale.js, móc vào FIN.tick):
   (1) từ lúc về đích, mỗi khung hình chặn trần độ sáng các hiệu ứng cộng sáng (giảm dần trong 0,8 s, không giật) + thu nhỏ hạt pháo giấy / bọt;
   (2) lùi lần chụp khung "chạm đích" 0,45 s để pháo giấy kịp tỏa ra rồi mới chụp;
   (3) khung chụp (FIN.snaps.fin / .pod) chỉnh nhẹ: nén vùng sáng + tăng nhẹ độ bão hòa trước khi ghép ảnh chia sẻ.
   Mọi lỗi đều bị bắt: hỏng phần này thì game vẫn chạy như cũ. Tắt để so sánh: thêm ?glare=0 vào link. */
(function () {
  'use strict';
  if (/[?&]glare=0/.test(location.search)) return;
  var G = { plan: null, items: [], pts: [], scan: -1e9, on: false, hold: 0, rel: 0, sn: null, dn: {}, pn: {} };
  var START = .5, RAMP = .8, HOLD = 450;

  /* trần độ sáng theo cỡ quầng: to -> gần như tắt, nhỏ -> giảm vừa phải; chùm đèn pha hình nón -> .03 */
  function capFor(o) {
    if (o.isSprite) { var s = Math.abs(o.scale.x); return s >= 20 ? .05 : (s >= 6 ? .12 : .25); }
    return .03;
  }

  function scan(X) {
    var TH = window.THREE, add = TH.AdditiveBlending, I = [], P = [];
    X.S.traverse(function (o) {
      var m = o.material; if (!m || Array.isArray(m)) return;
      if (o.isPoints) {
        if (X.CNF && o.geometry === X.CNF.g) P.push({ m: m, k: 'c' });
        else if (X.PUF && o.geometry === X.PUF.g) P.push({ m: m, k: 'p' });
        return;
      }
      if (m.blending !== add) return;
      if (o.isSprite) { if (m.fog === false) return; I.push({ o: o, m: m }); return; }   /* fog=false: mặt trăng trên trời, bỏ qua */
      if (o.geometry && o.geometry.type === 'ConeGeometry') I.push({ o: o, m: m });       /* chùm đèn pha */
    });
    G.items = I; G.pts = P;
  }

  function restore() {
    G.items.forEach(function (q) { var u = q.m.userData; if (u.__o0 !== undefined) { q.m.opacity = u.__o0; delete u.__o0; } });
    G.pts.forEach(function (q) { var u = q.m.userData; if (u.__s0 !== undefined) { q.m.size = u.__s0; q.m.opacity = u.__p0; delete u.__s0; delete u.__p0; } });
    G.on = false;
  }

  function apply(f) {
    G.items.forEach(function (q) {
      var u = q.m.userData, c = 1 + (capFor(q.o) - 1) * f;
      if (u.__o0 === undefined) u.__o0 = q.m.opacity;
      if (q.m.opacity > c) q.m.opacity = c;
    });
    G.pts.forEach(function (q) {
      var u = q.m.userData, sz = q.k === 'c' ? .55 : .5, op = q.k === 'c' ? .8 : .5;
      if (u.__s0 === undefined) { u.__s0 = q.m.size; u.__p0 = q.m.opacity; }
      q.m.size = u.__s0 * (1 - (1 - sz) * f);
      q.m.opacity = u.__p0 * (1 - (1 - op) * f);
    });
    G.on = true;
  }

  /* chỉnh nhẹ khung chụp: nén vùng sáng (gối 0,72, dốc 0,5) + tăng bão hòa 14% */
  function roll(v) { return v > .72 ? .72 + (v - .72) * .5 : v; }
  function grade(url, cb) {
    var im = new Image();
    im.onload = function () {
      try {
        var w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas');
        c.width = w; c.height = h;
        var x = c.getContext('2d'); x.drawImage(im, 0, 0);
        var d = x.getImageData(0, 0, w, h), a = d.data, i, r, g, b, L;
        for (i = 0; i < a.length; i += 4) {
          r = roll(a[i] / 255); g = roll(a[i + 1] / 255); b = roll(a[i + 2] / 255);
          L = .299 * r + .587 * g + .114 * b;
          a[i] = (L + (r - L) * 1.14) * 255; a[i + 1] = (L + (g - L) * 1.14) * 255; a[i + 2] = (L + (b - L) * 1.14) * 255;
        }
        x.putImageData(d, 0, 0);
        cb(c.toDataURL('image/jpeg', .92));
      } catch (e) { cb(url); }
    };
    im.onerror = function () { cb(url); };
    im.src = url;
  }

  function gradeSnaps() {
    var S = window.FIN && window.FIN.snaps; if (!S) return;
    if (G.sn !== S) { G.sn = S; G.dn = {}; G.pn = {}; }
    ['fin', 'pod'].forEach(function (k) {
      var u = S[k]; if (!u || typeof u !== 'string' || G.dn[k] === u || G.pn[k] === u) return;
      G.pn[k] = u;
      grade(u, function (g) { G.dn[k] = g; if (window.FIN && window.FIN.snaps === S && S[k] === u) S[k] = g; });
    });
  }

  function tick(now) {
    var X = window.DC && window.DC.x && window.DC.x();
    if (!X || !X.plan || !X.S) return;
    if (G.plan !== X.plan) { if (G.on) restore(); G.plan = X.plan; G.scan = -1e9; G.hold = 0; G.rel = 0; }
    var rt = (now - X.plan.t0) / 1000, fin = (X.state === 'race' || X.state === 'done') && rt >= X.DUR + START;
    if (!fin) { if (G.on) restore(); return; }
    if (now - G.scan > 200) { G.scan = now; scan(X); }
    apply(Math.min(1, (rt - X.DUR - START) / RAMP));
    /* lùi lần chụp "chạm đích" (finale.js đặt cờ __snapReq cùng khung với lúc bắn pháo giấy) */
    var F = window.FIN, inRep = rt >= X.plan.mx + .8 && rt < X.plan.mx + 6.5;
    if (window.__snapReq && !G.rel && !G.hold && inRep && F && F.snaps && !F.snaps.fin) { G.hold = now + HOLD; window.__snapReq = 0; }
    if (G.hold && now >= G.hold) { G.hold = 0; G.rel = 1; window.__snapReq = 1; }
  }

  function hook() {
    var F = window.FIN; if (!F || F.__gf) return !!F;
    var t0 = F.tick;
    F.tick = function (now, dt) {
      t0.call(F, now, dt);
      try { tick(now); gradeSnaps(); } catch (e) { try { console.warn('glare', e); } catch (_) {} }
    };
    F.__gf = 1; return true;
  }
  if (!hook()) window.addEventListener('load', hook);
})();
