/* TIGER EXTRAS – logo 9 SẠCH (đúng mẫu người dùng gửi) trước ngực, băng đô marathon, đuôi. Dữ liệu CHEST/BAND đo từ lưới tiger.bin nên ôm sát cơ thể; gắn vào xương chest/head/hips. Đơn vị game (mô hình x K=3). */
(function () {
  'use strict';
  var TR = window.TR, R = window.TigerRig;
  if (!TR || !R) return;
  var K = R.K, LOGO_URL = window.L9URL || 'logo-9sach.png?v=2';
  var CR = 0.26, CY = 1.46;
  var CHEST = [[0.26,0.263,0.266,0.269,0.272,0.276,0.277,0.276,0.272,0.269,0.265,0.264,0.262],[0.272,0.275,0.278,0.282,0.286,0.29,0.292,0.29,0.286,0.282,0.278,0.276,0.274],[0.288,0.291,0.296,0.302,0.308,0.313,0.315,0.314,0.309,0.303,0.297,0.293,0.291],[0.301,0.306,0.314,0.324,0.332,0.338,0.34,0.338,0.333,0.325,0.316,0.309,0.305],[0.312,0.32,0.332,0.345,0.355,0.361,0.363,0.362,0.356,0.347,0.335,0.323,0.315],[0.324,0.335,0.351,0.366,0.376,0.382,0.384,0.383,0.378,0.368,0.353,0.338,0.328],[0.338,0.35,0.367,0.384,0.395,0.4,0.402,0.401,0.396,0.386,0.37,0.354,0.342],[0.351,0.364,0.381,0.398,0.409,0.415,0.417,0.416,0.411,0.401,0.385,0.368,0.357],[0.363,0.375,0.392,0.408,0.42,0.427,0.429,0.428,0.422,0.412,0.397,0.381,0.369],[0.372,0.384,0.401,0.417,0.428,0.435,0.438,0.437,0.431,0.421,0.407,0.391,0.379],[0.379,0.391,0.407,0.422,0.433,0.44,0.443,0.442,0.436,0.427,0.413,0.397,0.385],[0.382,0.394,0.41,0.425,0.435,0.441,0.444,0.443,0.439,0.43,0.416,0.399,0.388],[0.382,0.394,0.41,0.424,0.434,0.441,0.443,0.443,0.438,0.43,0.416,0.399,0.388]];
  var BAND = [[0.75,0.75,0.745,0.735,0.723],[0.75,0.749,0.745,0.736,0.724],[0.751,0.751,0.747,0.738,0.725],[0.754,0.753,0.749,0.74,0.727],[0.756,0.756,0.752,0.742,0.73],[0.761,0.759,0.755,0.745,0.733],[0.765,0.763,0.759,0.749,0.737],[0.77,0.767,0.763,0.754,0.742],[0.775,0.772,0.768,0.759,0.748],[0.78,0.777,0.773,0.765,0.755],[0.787,0.783,0.78,0.772,0.761],[0.794,0.79,0.786,0.779,0.769],[0.801,0.796,0.791,0.785,0.772],[0.807,0.803,0.796,0.789,0.772],[0.813,0.807,0.799,0.791,0.768],[0.817,0.81,0.801,0.79,0.76],[0.818,0.81,0.8,0.789,0.749],[0.816,0.807,0.796,0.782,0.738],[0.811,0.802,0.786,0.77,0.726],[0.804,0.79,0.772,0.753,0.711],[0.788,0.772,0.752,0.73,0.693],[0.767,0.75,0.727,0.704,0.671],[0.745,0.726,0.701,0.676,0.648],[0.719,0.699,0.676,0.651,0.623],[0.692,0.675,0.654,0.628,0.6],[0.671,0.654,0.633,0.607,0.578],[0.653,0.637,0.616,0.59,0.56],[0.638,0.622,0.601,0.575,0.544],[0.625,0.61,0.589,0.562,0.534],[0.615,0.601,0.579,0.552,0.542],[0.607,0.593,0.572,0.558,0.533],[0.6,0.587,0.566,0.551,0.595],[0.595,0.581,0.561,0.603,0.514],[0.591,0.577,0.556,0.539,0.501],[0.588,0.574,0.561,0.533,0.474],[0.586,0.571,0.566,0.534,0.47],[0.585,0.569,0.565,0.548,0.496],[0.584,0.568,0.563,0.605,0.52],[0.585,0.568,0.564,0.552,0.612],[0.587,0.569,0.557,0.555,0.589],[0.59,0.573,0.551,0.54,0.538],[0.595,0.578,0.555,0.528,0.517],[0.602,0.584,0.562,0.534,0.504],[0.611,0.593,0.57,0.544,0.512],[0.622,0.604,0.582,0.555,0.524],[0.635,0.617,0.596,0.57,0.539],[0.651,0.634,0.612,0.586,0.556],[0.672,0.654,0.631,0.605,0.575],[0.694,0.676,0.654,0.627,0.597],[0.723,0.701,0.678,0.652,0.622],[0.749,0.73,0.705,0.678,0.656],[0.772,0.755,0.732,0.707,0.7],[0.793,0.778,0.757,0.732,0.752],[0.81,0.797,0.778,0.754,0.795],[0.818,0.81,0.794,0.771,0.882],[0.824,0.815,0.804,0.785,0.841],[0.828,0.82,0.809,0.791,0.836],[0.827,0.821,0.812,0.797,0.819],[0.824,0.819,0.811,0.8,0.805],[0.819,0.815,0.808,0.799,0.793],[0.811,0.808,0.802,0.794,0.783],[0.803,0.8,0.795,0.787,0.776],[0.794,0.791,0.786,0.778,0.767],[0.785,0.783,0.777,0.769,0.758],[0.778,0.775,0.77,0.761,0.75],[0.771,0.769,0.764,0.755,0.743],[0.766,0.764,0.759,0.75,0.738],[0.761,0.76,0.756,0.745,0.733],[0.757,0.756,0.753,0.742,0.73],[0.755,0.754,0.749,0.739,0.727],[0.753,0.752,0.747,0.736,0.725],[0.751,0.751,0.746,0.735,0.724]];
  var HZC = -0.06, HH = 0.11;
  function bandY(phi) { return 2.60 + 0.32 * Math.pow(Math.max(0, Math.cos(phi)), 0.8); }
  var logoImg = null;
  function getLogoImg(cb) {
    if (!logoImg) { logoImg = new Image(); logoImg._cb = []; logoImg.onload = function () { logoImg._cb.forEach(function (f) { try { f(); } catch (e) {} }); logoImg._cb = []; }; logoImg.src = LOGO_URL; window.L9IMG = logoImg; }
    if (logoImg.complete && logoImg.naturalWidth) { if (cb) cb(); } else if (cb) logoImg._cb.push(cb);
    return logoImg;
  }
  var chestTex = null, bandTex = null, mats = null;
  function chestMat(TH) {
    if (chestTex) return chestTex;
    var t = new TH.Texture(getLogoImg(function () { t.needsUpdate = true; }));
    if (logoImg.complete && logoImg.naturalWidth) t.needsUpdate = true;
    t.anisotropy = 4;
    chestTex = new TH.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.04, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    return chestTex;
  }
  function bandMat(TH) {
    if (bandTex) return bandTex;
    var c = document.createElement('canvas'); c.width = 2048; c.height = 128;
    var x = c.getContext('2d');
    function paint() {
      x.clearRect(0, 0, 2048, 128);
      var g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#f2203c'); g.addColorStop(.5, '#da0e2a'); g.addColorStop(1, '#b50a20');
      x.fillStyle = g; x.fillRect(0, 0, 2048, 128);
      x.fillStyle = '#fff'; x.fillRect(0, 10, 2048, 7); x.fillRect(0, 111, 2048, 7);
      x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(0, 22, 2048, 3); x.fillRect(0, 103, 2048, 3);
      var im = logoImg;
      if (im && im.complete && im.naturalWidth) x.drawImage(im, 1024 - 44, 8, 88, 112);
    }
    paint();
    var t = new TH.CanvasTexture(c); t.anisotropy = 4;
    getLogoImg(function () { paint(); t.needsUpdate = true; });
    bandTex = new TH.MeshStandardMaterial({ map: t, roughness: .7, metalness: 0, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .22, side: TH.DoubleSide });
    return bandTex;
  }
  function tailMats(TH) {
    if (mats) return mats;
    mats = [new TH.MeshStandardMaterial({ color: 0xf9cb1c, roughness: .8, emissive: 0xf9cb1c, emissiveIntensity: .22 }),
            new TH.MeshStandardMaterial({ color: 0x1b1410, roughness: .8, emissive: 0x1b1410, emissiveIntensity: .15 })];
    return mats;
  }
  var tailGeo = null;
  function rest(name) { var p = R.BONES[R.IDX[name]].t; return [p[0] * K, p[1] * K, p[2] * K]; }
  function makeChest(TH, bones) {
    var N = CHEST.length, pos = [], uv = [], idx = [], i, j, c0 = rest('chest'), off = 0.028;
    for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
      var x = -CR + 2 * CR * i / (N - 1), y = CY + CR - 2 * CR * j / (N - 1), z = CHEST[j][i] + off;
      pos.push(x - c0[0], y - c0[1], z - c0[2]); uv.push(i / (N - 1), 1 - j / (N - 1));
    }
    for (j = 0; j < N - 1; j++) for (i = 0; i < N - 1; i++) { var a = j * N + i, b = a + 1, d = a + N, e = d + 1; idx.push(a, d, b, b, d, e); }
    var g = new TH.BufferGeometry();
    g.setAttribute('position', new TH.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new TH.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    var m = new TH.Mesh(g, chestMat(TH)); m.frustumCulled = false; m.renderOrder = 2;
    bones[R.IDX.chest].add(m); return m;
  }
  function makeBand(TH, bones) {
    var NP = BAND.length, rows = 5, pos = [], uv = [], idx = [], i, r, h0 = rest('head'), prof = [0.012, 0.038, 0.05, 0.038, 0.012];
    for (i = 0; i <= NP; i++) {
      var ii = i % NP, phi = 2 * Math.PI * ii / NP - Math.PI, s = Math.sin(phi), co = Math.cos(phi), yc = bandY(phi);
      for (r = 0; r < rows; r++) {
        var y = yc + (r - 2) * 0.5 * HH, rad = BAND[ii][r] + prof[r];
        pos.push(s * rad - h0[0], y - h0[1], HZC + co * rad - h0[2]); uv.push(i / NP, r / (rows - 1));
      }
    }
    for (i = 0; i < NP; i++) for (r = 0; r < rows - 1; r++) { var a = i * rows + r, b = a + 1, d = a + rows, e = d + 1; idx.push(a, b, d, b, e, d); }
    var g = new TH.BufferGeometry();
    g.setAttribute('position', new TH.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new TH.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    var m = new TH.Mesh(g, bandMat(TH)); m.frustumCulled = false;
    bones[R.IDX.head].add(m); return m;
  }
  var TN = 10, TL = 0.15;
  function makeTail(TH, bones) {
    if (!tailGeo) tailGeo = new TH.SphereGeometry(1, 12, 8);
    var M = tailMats(TH), h0 = rest('hips'), root = new TH.Group(), parent = root, segs = [], k;
    root.position.set(0 - h0[0], 1.0 - h0[1], -0.40 - h0[2]);
    for (k = 0; k < TN; k++) {
      var g = new TH.Group(); if (k) g.position.set(0, 0, -TL);
      var rr = 0.19 - 0.105 * k / (TN - 1), black = (k >= TN - 2) || (k % 3 === 2);
      var m = new TH.Mesh(tailGeo, M[black ? 1 : 0]); m.scale.set(rr, rr, TL * 0.95); m.position.set(0, 0, -TL * 0.5); g.add(m);
      parent.add(g); segs.push(g); parent = g;
    }
    bones[R.IDX.hips].add(root);
    return { root: root, segs: segs };
  }
  TR.dress = function (tg, TH) {
    TH = TH || window.THREE; if (!tg || !tg.bones || tg.dressed) return tg;
    tg.dressed = 1; tg.chest = makeChest(TH, tg.bones); tg.band = makeBand(TH, tg.bones); tg.tail = makeTail(TH, tg.bones);
    tg.tseed = Math.random() * 6.283; TR.tail(tg, 0, 0, 0);
    return tg;
  };
  TR.tail = function (tg, tm, k, ph) {
    if (!tg || !tg.tail) return;
    var s = tg.tail.segs, n = s.length, kk = Math.min(1.2, k || 0), j, t = tm + (tg.tseed || 0);
    for (j = 0; j < n; j++) {
      var f = j / (n - 1);
      var up = (0.105 - 0.06 * Math.min(1, kk)) + 0.035 * Math.sin(ph * 1.0 - j * 0.55) * (0.3 + kk);
      var yaw = (0.10 + 0.14 * (1 - Math.min(1, kk))) * Math.sin(t * 1.5 - j * 0.5) * (0.35 + f) + 0.05 * kk * Math.sin(ph * 2 - j * 0.6);
      s[j].rotation.x = j === 0 ? 0.30 - 0.12 * Math.min(1, kk) + 0.04 * Math.sin(t * 1.5) : up;
      s[j].rotation.y = j === 0 ? 0 : yaw;
    }
  };
  var mk = TR.make, po = TR.pose;
  TR.make = function (TH) { var o = mk.apply(TR, arguments); if (o) TR.dress(o, TH || window.THREE); return o; };
  TR.pose = function (l, x, v, dt, i, rt, ctx) { po.apply(TR, arguments); TR.tail(l.tg, ctx.tm, l.kk || 0, l.ph || 0); };
})();
