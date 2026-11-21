/* =====================================================================
   TIGER FALL – cọp vấp té úp mặt, nằm choáng, chống tay đứng dậy rồi chạy tiếp.
   Nạp SAU tiger-rig.js + tiger-runtime.js. Dùng: TR.fallApply(lane, pz, u)  (u = giây kể từ lúc bắt đầu té; pz = tư thế từ R.solve)
   - Trộn dáng té lên dáng chạy theo trọng số w (0 = chạy bình thường, 1 = dáng té hoàn toàn).
   - Chạm đất tự tính bằng FK: điểm thấp nhất của thân/tay/chân luôn nằm đúng trên mặt đất (không lún, không lơ lửng).
   Trục mô hình: x ngang (trái cọp = +x), y lên, z phía trước. Góc pitch dương = chúi về trước.
   ===================================================================== */
(function () {
  'use strict';
  var R = window.TigerRig, TR = window.TR; if (!R || !TR) return;
  var M = R.math, IDX = R.IDX, B = R.BONES, K = R.K, D0 = R.D0;
  var qmul = M.qmul, qinv = M.qinv, arc = M.arc, nlerp = M.nlerp, ss = M.sstep;
  var T_END = 3.4;
  function qax(ax, a) { var s = Math.sin(a / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(a / 2)]; }
  function qx(a) { return qax([1, 0, 0], a); }
  function qz(a) { return qax([0, 0, 1], a); }
  function nrm(a) { var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  /* KHUNG HÌNH CHÍNH. u: giây; w: mức trộn;
     hp: chúi hông; ch: chúi thêm ngực; hd: đầu (âm = ngẩng); a: tay vung ra trước (0 = ngang, 1.57 = thẳng trước); e: tay nâng (âm = hạ xuống);
     el: khuỷu gập; tL/tR: đùi trái/phải (dương = ra trước); kL/kR: gối gập; ft: bàn chân (dương = mũi chân chúi xuống); rl: nghiêng sườn */
  var KF = [
    { u: 0.00, w: 0.0, hp: 0.00, ch: 0.00, hd: 0.00, a: 0.3, e: -0.4, el: 0.5, tL: 0.3, tR: -0.3, kL: 0.5, kR: 0.8, ft: 0.0, rl: 0.0 },
    { u: 0.16, w: 0.8, hp: 0.38, ch: 0.10, hd: -0.12, a: 0.9, e: 0.35, el: 0.2, tL: 0.55, tR: -0.45, kL: 0.5, kR: 0.9, ft: 0.2, rl: 0.05 },
    { u: 0.40, w: 1.0, hp: 0.95, ch: 0.12, hd: -0.35, a: 1.30, e: -0.10, el: 0.1, tL: 0.25, tR: -0.55, kL: 0.5, kR: 1.0, ft: 0.4, rl: 0.10 },
    { u: 0.68, w: 1.0, hp: 1.38, ch: 0.05, hd: -0.60, a: 1.50, e: -0.25, el: 0.1, tL: -0.15, tR: -0.20, kL: 0.4, kR: 0.5, ft: 0.7, rl: 0.0 },
    { u: 0.90, w: 1.0, hp: 1.30, ch: 0.04, hd: -0.55, a: 1.50, e: -0.25, el: 0.2, tL: -0.10, tR: -0.15, kL: 0.5, kR: 0.5, ft: 0.7, rl: 0.0 },
    { u: 1.10, w: 1.0, hp: 1.36, ch: 0.04, hd: -0.50, a: 1.50, e: -0.25, el: 0.2, tL: -0.12, tR: -0.18, kL: 0.5, kR: 0.5, ft: 0.7, rl: -0.04 },
    { u: 1.85, w: 1.0, hp: 1.34, ch: 0.04, hd: -0.50, a: 1.50, e: -0.25, el: 0.2, tL: -0.12, tR: -0.18, kL: 0.5, kR: 0.5, ft: 0.7, rl: 0.04 },
    { u: 2.30, w: 1.0, hp: 1.00, ch: 0.00, hd: -0.55, a: 1.50, e: -0.10, el: 0.0, tL: -0.55, tR: -0.50, kL: 1.50, kR: 1.50, ft: 0.9, rl: 0.0 },
    { u: 2.75, w: 1.0, hp: 0.55, ch: 0.05, hd: -0.30, a: 1.20, e: -0.50, el: 0.3, tL: 0.30, tR: -0.20, kL: 1.30, kR: 1.20, ft: 0.4, rl: 0.0 },
    { u: 3.10, w: 0.7, hp: 0.26, ch: 0.10, hd: -0.10, a: 0.5, e: -0.2, el: 0.5, tL: 0.45, tR: -0.30, kL: 0.8, kR: 0.8, ft: 0.1, rl: 0.0 },
    { u: 3.40, w: 0.0, hp: 0.20, ch: 0.10, hd: 0.00, a: 0.3, e: -0.4, el: 0.5, tL: 0.3, tR: -0.3, kL: 0.5, kR: 0.8, ft: 0.0, rl: 0.0 }
  ];
  var KEYS = ['w', 'hp', 'ch', 'hd', 'a', 'e', 'el', 'tL', 'tR', 'kL', 'kR', 'ft', 'rl'];
  function sample(u, out) {
    var i = 0; while (i < KF.length - 2 && u > KF[i + 1].u) i++;
    var a = KF[i], b = KF[i + 1], t = M.clamp((u - a.u) / (b.u - a.u), 0, 1); t = t * t * (3 - 2 * t);
    KEYS.forEach(function (k) { out[k] = a[k] + (b[k] - a[k]) * t; });
    return out;
  }

  /* dựng các góc xương của dáng té (ghi đè vào q cho các xương có liên quan) với trọng số w */
  function pose(q, P) {
    var w = P.w, sg;
    q[IDX.hips] = nlerp(q[IDX.hips], qmul(qx(P.hp), qz(P.rl)), w);
    q[IDX.spine] = nlerp(q[IDX.spine], qx(P.ch * .5), w);
    q[IDX.chest] = nlerp(q[IDX.chest], qx(P.ch * .5), w);
    q[IDX.neck] = nlerp(q[IDX.neck], qx(P.hd * .4), w);
    q[IDX.head] = nlerp(q[IDX.head], qx(P.hd * .6), w);
    ['L', 'R'].forEach(function (s) {
      sg = s === 'L' ? 1 : -1;
      var ca = Math.cos(P.a), ce = Math.cos(P.e);
      var dU = nrm([sg * ca * ce, Math.sin(P.e), Math.sin(P.a) * ce]);
      var dF = nrm([dU[0] * (1 - P.el * .5), dU[1] - P.el * .15, dU[2] + P.el * .6]);
      var u = arc(D0['upperarm.' + s], dU), f = arc(D0['forearm.' + s], dF);
      q[IDX['upperarm.' + s]] = nlerp(q[IDX['upperarm.' + s]], u, w);
      q[IDX['forearm.' + s]] = nlerp(q[IDX['forearm.' + s]], qmul(qinv(u), f), w);
      q[IDX['hand.' + s]] = nlerp(q[IDX['hand.' + s]], [0, 0, 0, 1], w);
      var t1 = s === 'L' ? P.tL : P.tR, kn = s === 'L' ? P.kL : P.kR, t2 = t1 - kn;
      var tq = arc(D0['thigh.' + s], [0, -Math.cos(t1), Math.sin(t1)]), sa = arc(D0['shin.' + s], [0, -Math.cos(t2), Math.sin(t2)]);
      q[IDX['thigh.' + s]] = nlerp(q[IDX['thigh.' + s]], tq, w);
      q[IDX['shin.' + s]] = nlerp(q[IDX['shin.' + s]], qmul(qinv(tq), sa), w);
      q[IDX['foot.' + s]] = nlerp(q[IDX['foot.' + s]], qx(P.ft * 0.5), w);
    });
  }

  /* FK nhỏ để tìm điểm thấp nhất (đơn vị mô hình, root ở gốc) */
  function rot(q, v) {
    var t = [2 * (q[1] * v[2] - q[2] * v[1]), 2 * (q[2] * v[0] - q[0] * v[2]), 2 * (q[0] * v[1] - q[1] * v[0])];
    return [v[0] + q[3] * t[0] + (q[1] * t[2] - q[2] * t[1]), v[1] + q[3] * t[1] + (q[2] * t[0] - q[0] * t[2]), v[2] + q[3] * t[2] + (q[0] * t[1] - q[1] * t[0])];
  }
  var LP = B.map(function (b, i) { return R.localPos(i); });
  var PTS = [['hand.L', [.055, 0, 0]], ['hand.R', [-.055, 0, 0]], ['hand.L', [.0, -.03, 0]], ['hand.R', [.0, -.03, 0]],
    ['foot.L', [0, -.047, .105]], ['foot.R', [0, -.047, .105]], ['shin.L', [0, 0, 0]], ['shin.R', [0, 0, 0]],
    ['chest', [0, 0, .22]], ['spine', [0, 0, .22]], ['hips', [0, 0, .2]], ['head', [0, .1, .34]], ['head', [0, .38, 0]], ['head', [0, 0, .3]]];
  function fk(q) {
    var W = [], i, b, P, o;
    for (i = 0; i < B.length; i++) {
      b = B[i];
      if (b.p < 0) W[i] = { p: [0, 0, 0], q: q[i] };
      else { P = W[b.p]; o = rot(P.q, LP[i]); W[i] = { p: [P.p[0] + o[0], P.p[1] + o[1], P.p[2] + o[2]], q: qmul(P.q, q[i]) }; }
    }
    return W;
  }
  function lowest(q) {
    var W = fk(q), m = 1e9, i, w, o, y;
    for (i = 0; i < PTS.length; i++) { w = W[IDX[PTS[i][0]]]; o = rot(w.q, PTS[i][1]); y = w.p[1] + o[1]; if (y < m) m = y; }
    return m;
  }

  var tmp = {};
  /* áp dáng té lên pz (đã có dáng chạy). Trả về true nếu còn đang té (u trong [0, T_END]) */
  TR.fallApply = function (lane, pz, u) {
    if (u < 0 || u >= T_END) return false;
    sample(u, tmp);
    if (tmp.w <= 0.001) return false;
    pose(pz.q, tmp);
    var m = lowest(pz.q), ew = ss(0, 0.6, tmp.w);
    pz.y = pz.y + ((-m + 0.004) - pz.y) * ew;
    pz.x = 0; pz.z = pz.z * (1 - ew);
    return true;
  };
  /* móc vào R.solve + TR.pose để không phải sửa tiger-runtime.js: TR.pose đặt FU (giây kể từ lúc té) rồi gọi bản gốc; solve trả dáng chạy -> ta trộn dáng té lên */
  var FU = -1, solve0 = R.solve, pose0 = TR.pose;
  R.solve = function (p) { var pz = solve0(p); if (FU >= 0) TR.fallApply(null, pz, FU); return pz; };
  TR.pose = function (l, x, v, dt, i, rt, ctx) {
    FU = (ctx && ctx.fall >= 0) ? rt - ctx.fall : -1;
    try { return pose0.apply(this, arguments); } finally { FU = -1; }
  };
  TR.FALL_T = T_END; TR.FALL_KF = KF; TR._fall = { sample: sample, pose: pose, fk: fk, lowest: lowest, PTS: PTS };
})();
