/* =====================================================================
   TIGER RIG – khung xương + chuyển động cho cọp 9 Sạch (mô hình người dùng gửi)
   Một tệp dùng chung cho: (1) trình duyệt/game, (2) Node (xuất GLB, dựng trọng số da).
   Quy ước trục MÔ HÌNH: x = ngang (bên TRÁI của cọp là +x), y = lên, z = phía trước (mặt cọp nhìn về +z).
   Game dựng cọp trong nhóm xoay y=+90° để mặt nhìn về +x của đường đua.
   Mọi số đo ở đây là đơn vị mô hình gốc (cao 1.142); K là hệ số phóng sang đơn vị game.
   v21: sửa nhịp chạy – tay và xoay hông/vai trước đây lệch pha 90° so với chân (cực trị phải trùng lúc hai chân dạng rộng nhất, tức ph = 0 và π).
   ===================================================================== */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.TigerRig = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var K = 3.0;

  /* ---------------- 1. BỘ XƯƠNG (tên, cha, vị trí khớp ở tư thế gốc) ---------------- */
  var BONES = [
    ['root', -1, [0, 0, 0]],
    ['hips', 0, [0, 0.31, -0.02]],
    ['spine', 1, [0, 0.40, -0.025]],
    ['chest', 2, [0, 0.50, -0.03]],
    ['neck', 3, [0, 0.60, -0.03]],
    ['head', 4, [0, 0.645, -0.035]],
    ['ear.L', 5, [0.255, 0.965, -0.06]],
    ['ear.R', 5, [-0.255, 0.965, -0.06]],
    ['hair', 5, [0, 1.05, 0.02]],
    ['upperarm.L', 3, [0.17, 0.555, -0.035]],
    ['forearm.L', 9, [0.245, 0.485, -0.035]],
    ['hand.L', 10, [0.30, 0.47, -0.03]],
    ['upperarm.R', 3, [-0.17, 0.555, -0.035]],
    ['forearm.R', 12, [-0.245, 0.485, -0.035]],
    ['hand.R', 13, [-0.30, 0.47, -0.03]],
    ['thigh.L', 1, [0.10, 0.31, -0.02]],
    ['shin.L', 15, [0.10, 0.145, -0.02]],
    ['foot.L', 16, [0.108, 0.062, -0.015]],
    ['thigh.R', 1, [-0.10, 0.31, -0.02]],
    ['shin.R', 18, [-0.10, 0.145, -0.02]],
    ['foot.R', 19, [-0.108, 0.062, -0.015]]
  ].map(function (b) { return { n: b[0], p: b[1], t: b[2] }; });
  var IDX = {};
  BONES.forEach(function (b, i) { IDX[b.n] = i; });
  /* đầu mút (không có xương riêng): đầu ngón găng, mũi giày */
  var TIP = { 'hand.L': [0.355, 0.47, -0.03], 'hand.R': [-0.355, 0.47, -0.03], 'foot.L': [0.108, 0.015, 0.105], 'foot.R': [-0.108, 0.015, 0.105] };

  /* ---------------- 2. TOÁN QUATERNION/VECTƠ NHỎ ---------------- */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function nrm(a) { var l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function qmul(a, b) {
    return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
      a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
  }
  function qinv(a) { return [-a[0], -a[1], -a[2], a[3]]; }
  function qnorm(q) { var l = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
  function qax(ax, ang) { var s = Math.sin(ang / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(ang / 2)]; }
  function qx(a) { return qax([1, 0, 0], a); }
  function qy(a) { return qax([0, 1, 0], a); }
  function qz(a) { return qax([0, 0, 1], a); }
  function qeul(px, py, pz) { return qmul(qy(py), qmul(qx(px), qz(pz))); }   /* yaw * pitch * roll */
  /* phép quay ngắn nhất đưa vectơ đơn vị a về b */
  function arc(a, b) {
    var d = dot(a, b);
    if (d > 0.999999) return [0, 0, 0, 1];
    if (d < -0.999999) { var ax = nrm(cross(a, Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])); return [ax[0], ax[1], ax[2], 0]; }
    var c = cross(a, b);
    return qnorm([c[0], c[1], c[2], 1 + d]);
  }
  function nlerp(a, b, t) {
    var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], s = d < 0 ? -1 : 1;
    return qnorm([a[0] + (b[0] * s - a[0]) * t, a[1] + (b[1] * s - a[1]) * t, a[2] + (b[2] * s - a[2]) * t, a[3] + (b[3] * s - a[3]) * t]);
  }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  var ID = [0, 0, 0, 1];

  /* ---------------- 3. HƯỚNG XƯƠNG Ở TƯ THẾ GỐC ---------------- */
  function piv(n) { return BONES[IDX[n]].t; }
  var D0 = {};
  ['L', 'R'].forEach(function (s) {
    D0['upperarm.' + s] = nrm(sub(piv('forearm.' + s), piv('upperarm.' + s)));
    D0['forearm.' + s] = nrm(sub(piv('hand.' + s), piv('forearm.' + s)));
    D0['hand.' + s] = nrm(sub(TIP['hand.' + s], piv('hand.' + s)));
    D0['thigh.' + s] = nrm(sub(piv('shin.' + s), piv('thigh.' + s)));
    D0['shin.' + s] = nrm(sub(piv('foot.' + s), piv('shin.' + s)));
    D0['foot.' + s] = nrm(sub(TIP['foot.' + s], piv('foot.' + s)));
  });
  var L1 = 0.165, L2 = 0.083, HIP_Y = 0.31, ANK_Y = 0.062, REACH = L1 + L2;   /* đùi, cẳng chân, độ cao hông/cổ chân */

  /* ---------------- 4. TÍNH TƯ THẾ ----------------
     p = {
       ph   : pha bước (rad), tăng theo thời gian
       k    : tốc độ 0..1.3 (0 = đứng yên, ~0.45 = chạy chỗ chuẩn bị, 1 = nước rút)
       t    : thời gian (s) cho các chuyển động nhẹ (thở, nhìn quanh)
       wave : 0..1 vẫy tay (tay phải của cọp = -x, hướng về phía camera giới thiệu)
       cheer: 0..1 giơ hai tay ăn mừng (kèm nhảy: jump = độ cao nhảy, mô hình)
       jump : độ cao nhảy (đơn vị mô hình) ; air: 0..1 đang trên không (co chân)
       look : liếc đầu thêm (rad)
       lean : nghiêng thêm về trước (rad)
     }
     Trả về { x, y, z (dịch chuyển root, đơn vị mô hình), q: [[x,y,z,w] mỗi xương], dbg } */
  function solve(p) {
    var k = p.k || 0, kk = clamp(k, 0, 1.25), kn = clamp(k, 0, 1), t = p.t || 0, ph = p.ph || 0;
    var q = BONES.map(function () { return ID.slice(); });
    var out = { x: 0, y: 0, z: 0, q: q };
    var gw = sstep(0.02, 0.4, k);            /* trọng số lớp CHẠY so với lớp ĐỨNG */
    var bounceDy = 0;

    /* ---- lớp ĐỨNG (thở, đổi trọng tâm, nhìn quanh, tai/tóc đung đưa) ---- */
    var br = Math.sin(t * 2.3), sw = Math.sin(t * 0.9), lk = Math.sin(t * 0.55) * Math.sin(t * 1.3 + 1);
    var idle = {};
    idle.hips = qeul(0, 0.03 * sw, 0.018 * sw);
    idle.spine = qeul(0.012 * br, -0.02 * sw, -0.012 * sw);
    idle.chest = qeul(0.014 * br, 0, 0);
    idle.head = qeul(0.04 * Math.sin(t * 1.1) + (p.lean ? 0 : 0), 0.22 * lk, 0.02 * Math.sin(t * 0.7));
    idle['ear.L'] = qeul(0.04 * Math.sin(t * 3.1), 0, 0.05 * Math.sin(t * 2.3 + 1));
    idle['ear.R'] = qeul(0.04 * Math.sin(t * 3.1 + 2), 0, -0.05 * Math.sin(t * 2.3));
    idle.hair = qeul(0.05 * Math.sin(t * 2.0), 0, 0.04 * Math.sin(t * 1.6));
    var armAmp = 0.05;
    idle['upperarm.L'] = qz(armAmp * Math.sin(t * 2.3 + 0.4)); idle['upperarm.R'] = qz(-armAmp * Math.sin(t * 2.3 + 0.4));
    var oy = 0.003 * br;                     /* lên xuống nhẹ khi thở */

    /* ---- lớp CHẠY (khung dáng chạy với IK 2 xương cho chân) ---- */
    var g = {};
    var sf = lerp(0.62, 0.36, kn);           /* tỷ lệ thời gian chân chạm đất */
    var F = 0.105 * Math.pow(kk, 1.15);      /* nửa sải bước */
    var LIFT = 0.075 * Math.pow(kk, 0.9);    /* độ nâng gót khi vung chân */
    var uf = (sf + 0.5) / 2;
    var bn = Math.pow(0.5 + 0.5 * Math.cos(4 * Math.PI * ((ph / (2 * Math.PI)) - uf)), 1.4);   /* 1 = đỉnh bay, 0 = giữa pha chống */
    var dy = -0.06 * kk * (1 - bn) - 0.018 * kk;                  /* hạ khung chậu (gối gập), nảy lên khi bay */
    bounceDy = dy;
    var lean = 0.06 + 0.15 * kk + (p.lean || 0);                   /* chạy càng nhanh càng chúi về trước */
    /* Chân TRÁI ở phía trước nhất khi ph = 0 (và chân phải khi ph = π). Hông/vai/tay cũng đạt cực trị đúng lúc đó (cos, không phải sin):
       hông trái đưa ra trước (xoay y âm) nên yawS = -cos(ph); vai xoay ngược lại. */
    var yawS = -Math.cos(ph);
    g.hips = qeul(0.02 * kk * Math.cos(2 * ph), 0.14 * kk * yawS, 0.05 * kk * Math.sin(ph + 0.4));
    g.spine = qeul(lean * 0.35, -0.10 * kk * yawS, -0.03 * kk * Math.sin(ph + 0.4));
    g.chest = qeul(lean * 0.65, -0.12 * kk * yawS, 0);
    g.neck = qeul(-lean * 0.3 + 0.03 * kk * Math.cos(2 * ph), 0.05 * kk * yawS, 0);          /* đầu giữ hướng nhìn thẳng: tổng xoay y hông+ngực+cổ+đầu ≈ 0 */
    g.head = qeul(-lean * 0.6 + 0.05 * kk * Math.cos(2 * ph + 0.6) + (p.look ? 0 : 0), 0.03 * kk * yawS, 0.02 * kk * Math.sin(ph));
    g['ear.L'] = qeul(0.30 * kk * Math.sin(2 * ph - 0.9), 0, 0.10 * kk * Math.sin(ph));
    g['ear.R'] = qeul(0.30 * kk * Math.sin(2 * ph - 0.9), 0, -0.10 * kk * Math.sin(ph));
    g.hair = qeul(0.35 * kk * Math.sin(2 * ph - 1.4) - 0.15 * kk, 0, 0.05 * kk * Math.sin(ph));
    out.x = 0.012 * kk * Math.sin(ph + 0.3);

    /* chân */
    var hipsQ = g.hips;                      /* chân tính trong hệ quy chiếu hông; hông xoay nhẹ nên bỏ qua */
    ['L', 'R'].forEach(function (s) {
      var sg = s === 'L' ? 1 : -1;
      var u = (((ph + (sg > 0 ? 0 : Math.PI)) / (2 * Math.PI)) % 1 + 1) % 1;
      var fx, lift, pitch;
      if (u < sf) {                          /* chống: bàn chân trượt từ trước ra sau trên mặt đất */
        var st = u / sf;
        fx = lerp(F * 0.85, -F * 1.15, st); lift = 0;
        pitch = lerp(0.18, -0.55, st * st * (3 - 2 * st) * 0.6 + st * 0.4);
      } else {                               /* vung: gót hất lên, đưa chân ra trước */
        var sv = (u - sf) / (1 - sf);
        var e = sv * sv * (3 - 2 * sv);
        fx = lerp(-F * 1.15, F * 0.85, e);
        lift = LIFT * Math.pow(Math.sin(Math.PI * Math.pow(sv, 0.62)), 1.0);
        pitch = lerp(-0.55, 0.18, sstep(0.0, 1.0, sv)) + 0.25 * Math.sin(Math.PI * sv);
      }
      /* mục tiêu cổ chân so với khớp hông (mặt phẳng dọc thân) */
      var fy = (ANK_Y + lift) - (HIP_Y + dy);
      var d = Math.sqrt(fx * fx + fy * fy), dc = Math.min(d, REACH * 0.9985);
      var sc = d > 0 ? dc / d : 1, tx = fx * sc, ty = fy * sc;
      /* IK 2 xương: gối luôn gập về phía trước */
      var dd = Math.sqrt(tx * tx + ty * ty);
      var alpha = Math.atan2(tx, -ty);                               /* hướng từ hông tới cổ chân, tính từ phương thẳng đứng */
      var beta = Math.acos(clamp((L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd), -1, 1));
      var th1 = alpha + beta;                                        /* đùi vung ra trước */
      var knee = Math.acos(clamp((L1 * L1 + L2 * L2 - dd * dd) / (2 * L1 * L2), -1, 1));   /* góc trong gối */
      var flex = Math.PI - knee;
      var th2 = th1 - flex;                                          /* hướng tuyệt đối của cẳng chân */
      g['thigh.' + s] = { dir: [0, -Math.cos(th1), Math.sin(th1)] };
      g['shin.' + s] = { dir: [0, -Math.cos(th2), Math.sin(th2)] };
      g['foot.' + s] = { pitch: pitch, th2: th2 };
    });
    /* tay: vung ngược chân cùng bên (tay trái ra trước khi chân phải ra trước), khuỷu gập ~80° */
    ['L', 'R'].forEach(function (s) {
      var sg = s === 'L' ? 1 : -1, pa = ph + (sg > 0 ? Math.PI : 0);
      var sh = 0.1 * kk + 0.85 * kk * Math.cos(pa);                    /* vai vung trước/sau: cực đại cùng lúc chân đối bên ra trước nhất */
      var ab = lerp(0.82, 0.38, kn);                                   /* độ dạng tay (rad) – chạy thì khép bớt */
      var el = lerp(0.2, 1.25, kn) + 0.32 * kk * Math.cos(pa - 0.2);   /* gập khuỷu thêm khi tay ở phía trước */
      g['arm.' + s] = { sh: sh, ab: ab, el: el, sg: sg };
    });

    /* ---- trộn ĐỨNG ↔ CHẠY cho thân/đầu ---- */
    ['hips', 'spine', 'chest', 'neck', 'head', 'ear.L', 'ear.R', 'hair'].forEach(function (n) {
      var a = idle[n] || ID, b = g[n] || ID;
      q[IDX[n]] = nlerp(a, b, gw);
    });
    q[IDX['upperarm.L']] = idle['upperarm.L'];
    q[IDX['upperarm.R']] = idle['upperarm.R'];

    /* chân – dựng bằng hướng tuyệt đối trong hệ hông */
    ['L', 'R'].forEach(function (s) {
      var tq = arc(D0['thigh.' + s], g['thigh.' + s].dir);
      var sAbs = arc(D0['shin.' + s], g['shin.' + s].dir);
      var pf = g['foot.' + s];
      /* bàn chân: chúc mũi xuống = pitch âm; quay quanh trục ngang x (âm = mũi lên? kiểm bằng arc) */
      var d0 = D0['foot.' + s];
      var fd = nrm([d0[0], d0[1] * Math.cos(-pf.pitch) - d0[2] * Math.sin(-pf.pitch), d0[1] * Math.sin(-pf.pitch) + d0[2] * Math.cos(-pf.pitch)]);
      var fAbs = arc(d0, fd);
      /* chân đỡ phải phẳng so với mặt đất: bù xoay của hông-đùi-cẳng khi tính cao độ tuyệt đối */
      var thL = qmul(qinv(tq), ID);                       /* (giữ cho rõ ràng) */
      q[IDX['thigh.' + s]] = nlerp(ID, tq, gw);
      var sLoc = qmul(qinv(tq), sAbs), fLoc = qmul(qinv(sAbs), fAbs);
      q[IDX['shin.' + s]] = nlerp(ID, sLoc, gw);
      q[IDX['foot.' + s]] = nlerp(ID, fLoc, gw);
    });
    /* tay – dựng bằng hướng tuyệt đối trong hệ ngực */
    ['L', 'R'].forEach(function (s) {
      var a = g['arm.' + s], sg = a.sg;
      var dU = nrm([sg * Math.sin(a.ab), -Math.cos(a.ab) * Math.cos(a.sh), Math.cos(a.ab) * Math.sin(a.sh)]);
      var dF = nrm([sg * Math.sin(a.ab * 0.55), -Math.cos(a.sh + a.el), Math.sin(a.sh + a.el)]);
      var dH = nrm([sg * Math.sin(a.ab * 0.55) * 0.8, -Math.cos(a.sh + a.el + 0.25), Math.sin(a.sh + a.el + 0.25)]);
      var uq = arc(D0['upperarm.' + s], dU), fq = arc(D0['forearm.' + s], dF), hq = arc(D0['hand.' + s], dH);
      var runU = uq, runF = qmul(qinv(uq), fq), runH = qmul(qinv(fq), hq);
      var iU = q[IDX['upperarm.' + s]];
      q[IDX['upperarm.' + s]] = nlerp(iU, runU, gw);
      q[IDX['forearm.' + s]] = nlerp(ID, runF, gw);
      q[IDX['hand.' + s]] = nlerp(ID, runH, gw);
    });

    out.y = lerp(oy, dy, gw);

    /* ---- VẪY TAY (tay phải = -x, quay về phía camera) ---- */
    if (p.wave > 0.001) {
      var w = p.wave, ws = Math.sin(t * 9);
      var dU2 = nrm([-Math.sin(2.35), -Math.cos(2.35), 0.1]);
      var dF2 = nrm([-Math.sin(2.35 + 0.55 * ws), -Math.cos(2.35 + 0.55 * ws), 0.12]);
      var u2 = arc(D0['upperarm.R'], dU2), f2 = arc(D0['forearm.R'], dF2);
      q[IDX['upperarm.R']] = nlerp(q[IDX['upperarm.R']], u2, w);
      q[IDX['forearm.R']] = nlerp(q[IDX['forearm.R']], qmul(qinv(u2), f2), w);
      q[IDX['hand.R']] = nlerp(q[IDX['hand.R']], qz(-0.35 * ws), w);
      q[IDX['chest']] = nlerp(q[IDX['chest']], qmul(qeul(0, 0.12, 0.05 * ws), q[IDX['chest']]), w);
      q[IDX['head']] = nlerp(q[IDX['head']], qeul(-0.05, 0.28, -0.12 + 0.03 * ws), w);
    }
    /* ---- ĂN MỪNG: hai tay giơ cao, thân ưỡn, chân co/duỗi theo nhịp nhảy ---- */
    if (p.cheer > 0.001) {
      var c = p.cheer, ar = p.air || 0, cs = Math.sin(t * 11);
      ['L', 'R'].forEach(function (s) {
        var sg = s === 'L' ? 1 : -1;
        var aa = 2.75 + 0.10 * cs;
        var dU3 = nrm([sg * Math.sin(aa), -Math.cos(aa), 0.05]);
        var dF3 = nrm([sg * Math.sin(aa + 0.12 + 0.12 * cs * sg), -Math.cos(aa + 0.12), 0.05]);
        var u3 = arc(D0['upperarm.' + s], dU3), f3 = arc(D0['forearm.' + s], dF3);
        q[IDX['upperarm.' + s]] = nlerp(q[IDX['upperarm.' + s]], u3, c);
        q[IDX['forearm.' + s]] = nlerp(q[IDX['forearm.' + s]], qmul(qinv(u3), f3), c);
        q[IDX['hand.' + s]] = nlerp(q[IDX['hand.' + s]], qz(sg * 0.15 * cs), c);
        /* chân: tiếp đất thì gập gối đón, trên không thì co lên */
        var cy = -0.045 * (1 - ar) - 0.01;
        var fyy = (ANK_Y + 0.045 * ar) - (HIP_Y + cy);
        var fxx = -0.03 * ar - 0.015 * sg * 0;
        var dd2 = Math.min(Math.sqrt(fxx * fxx + fyy * fyy), REACH * 0.9985);
        var al2 = Math.atan2(fxx, -fyy), be2 = Math.acos(clamp((L1 * L1 + dd2 * dd2 - L2 * L2) / (2 * L1 * dd2), -1, 1));
        var t1 = al2 + be2, kn2 = Math.PI - Math.acos(clamp((L1 * L1 + L2 * L2 - dd2 * dd2) / (2 * L1 * L2), -1, 1));
        var tq2 = arc(D0['thigh.' + s], [0, -Math.cos(t1), Math.sin(t1)]);
        var sq2 = arc(D0['shin.' + s], [0, -Math.cos(t1 - kn2), Math.sin(t1 - kn2)]);
        var d0f = D0['foot.' + s], pit = lerp(0, -0.5, ar);
        var fq2 = arc(d0f, nrm([d0f[0], d0f[1] * Math.cos(-pit) - d0f[2] * Math.sin(-pit), d0f[1] * Math.sin(-pit) + d0f[2] * Math.cos(-pit)]));
        q[IDX['thigh.' + s]] = nlerp(q[IDX['thigh.' + s]], tq2, c);
        q[IDX['shin.' + s]] = nlerp(q[IDX['shin.' + s]], qmul(qinv(tq2), sq2), c);
        q[IDX['foot.' + s]] = nlerp(q[IDX['foot.' + s]], qmul(qinv(sq2), fq2), c);
        out.y = lerp(out.y, cy, c);
      });
      q[IDX['chest']] = nlerp(q[IDX['chest']], qeul(-0.16, 0.0, 0.05 * cs), c);
      q[IDX['head']] = nlerp(q[IDX['head']], qeul(-0.18, 0.12 * cs, 0.04 * cs), c);
      q[IDX['ear.L']] = nlerp(q[IDX['ear.L']], qeul(0.35 * ar - 0.1, 0, 0.15), c);
      q[IDX['ear.R']] = nlerp(q[IDX['ear.R']], qeul(0.35 * ar - 0.1, 0, -0.15), c);
    }
    out.y += (p.jump || 0);
    if (p.look) q[IDX.head] = qmul(qeul(0, p.look, 0), q[IDX.head]);
    return out;
  }

  /* ---------------- 5. CÔNG CỤ DÙNG CHUNG ---------------- */
  /* vị trí cục bộ của xương (đơn vị mô hình) = khớp con − khớp cha */
  function localPos(i) {
    var b = BONES[i], p = b.p < 0 ? [0, 0, 0] : BONES[b.p].t;
    return [b.t[0] - p[0], b.t[1] - p[1], b.t[2] - p[2]];
  }

  var api = {
    K: K, BONES: BONES, IDX: IDX, TIP: TIP, D0: D0, solve: solve, localPos: localPos,
    math: { qmul: qmul, qinv: qinv, arc: arc, nlerp: nlerp, clamp: clamp, lerp: lerp, sstep: sstep }
  };
  return api;
});
