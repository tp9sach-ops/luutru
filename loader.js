/* LOADER v14 – nạp game.js rồi áp bản vá (find-and-replace) trước khi chạy. Vá không khớp bị bỏ qua. ?debug=1 hiển số vá áp được/hụt. ?classic=1 -> bản gốc. */
(function(){
var V='game.js?v=13';
function run(s){var e=document.createElement('script');e.text=s;document.body.appendChild(e)}
function plain(){var e=document.createElement('script');e.src=V;document.body.appendChild(e)}
if(/[?&]classic=1/.test(location.search))return plain();
var st=document.createElement('style');st.textContent='.box img{border-radius:18px;border:3px solid #ffd05a;box-shadow:0 10px 26px rgba(0,0,0,.35);margin:8px 0}'+
'.mc{font-size:clamp(28px,8.5vw,70px)!important;top:45%!important}.mcs{bottom:12%!important}.tvbar{background:linear-gradient(#010a06,#04180f)!important}'+
'.gt{filter:drop-shadow(0 0 34px rgba(255,205,90,.6)) drop-shadow(0 14px 20px rgba(0,0,0,.5))!important}#gate:after{background:radial-gradient(ellipse at 50% 0,#ffffff,#d6e2ff 55%,#9db1e8)!important;box-shadow:0 -10px 40px #fff9!important}'+
'select{font-weight:700!important;letter-spacing:.01em}'+
/* v13: cân màu điện ảnh (đỉnh sáng ấm góc trên phải, bóng tối xanh góc dưới trái) + popup trúng thưởng có tia sáng xoay phía sau */
'.stage:before{content:"";position:absolute;left:0;top:0;right:0;bottom:0;z-index:3;pointer-events:none;mix-blend-mode:soft-light;background:radial-gradient(ellipse at 78% 10%,rgba(255,196,96,.6),transparent 55%),radial-gradient(ellipse at 10% 95%,rgba(70,96,255,.5),transparent 60%)}'+
'.box{isolation:isolate}.box:before{content:"";position:absolute;left:50%;top:38%;width:170vmax;height:170vmax;margin:-85vmax 0 0 -85vmax;background:repeating-conic-gradient(rgba(255,214,90,.18) 0 6deg,transparent 6deg 14deg);animation:pspin 32s linear infinite;z-index:-1;pointer-events:none;-webkit-mask-image:radial-gradient(circle,#000,transparent 58%);mask-image:radial-gradient(circle,#000,transparent 58%)}';
document.head.appendChild(st);
window.L9D=[`M42 78L37.1 75.1L42.8 75L38.9 70.1L45.1 69.5L42.3 63.4L49 62.9L47.2 56L54.3 55.6L53.4 48.3L60.8 48.3L61 40.7L68.5 41.4L69.7 33.8L77.2 35.3L79.5 28L86.7 30.4L90 23.5L96.8 27L101.1 20.7L107.2 25.2L112.5 19.7L117.8 25.2L123.9 20.7L128.2 27L135 23.5L138.3 30.4L145.5 28L147.8 35.3L155.3 33.8L156.5 41.4L164 40.7L164.2 48.3L171.6 48.3L170.7 55.6L177.8 56L176 62.9L182.7 63.4L179.9 69.5L186.1 70.1L182.2 75L187.9 75.1L183 78L183 78L182.4 78.1L180.6 78.4L177.6 78.9L173.6 79.5L168.4 80.2L162.4 81L155.4 81.8L147.8 82.5L139.5 83.1L130.7 83.6L121.7 83.9L112.5 84L103.3 83.9L94.3 83.6L85.5 83.1L77.2 82.5L69.6 81.8L62.6 81L56.6 80.2L51.4 79.5L47.4 78.9L44.4 78.4L42.6 78.1L42 78Z`,`M42 78L37.1 75.1L42.8 75L38.9 70.1L45.1 69.5L42.3 63.4L49 62.9L47.2 56L54.3 55.6L53.4 48.3L60.8 48.3L61 40.7L68.5 41.4L69.7 33.8L77.2 35.3L79.5 28L86.7 30.4L90 23.5L96.8 27L101.1 20.7L107.2 25.2L112.5 19.7L117.8 25.2L123.9 20.7L128.2 27L135 23.5L138.3 30.4L145.5 28L147.8 35.3L155.3 33.8L156.5 41.4L164 40.7L164.2 48.3L171.6 48.3L170.7 55.6L177.8 56L176 62.9L182.7 63.4L179.9 69.5L186.1 70.1L182.2 75L187.9 75.1L183 78L183 78L182.4 75.8L180.6 71.8L177.6 66.9L173.6 61.4L168.4 55.7L162.4 50.1L155.4 44.8L147.8 40.1L139.5 36.3L130.7 33.4L121.7 31.6L112.5 31L103.3 31.6L94.3 33.4L85.5 36.3L77.2 40.1L69.6 44.8L62.6 50.1L56.6 55.7L51.4 61.4L47.4 66.9L44.4 71.8L42.6 75.8L42 78Z`,`M44.4 74.8L47.4 69.9L51.4 64.4L56.6 58.7L62.6 53.1L69.6 47.8L77.2 43.1L85.5 39.3L94.3 36.4L103.3 34.6L112.5 34L121.7 34.6L130.7 36.4L139.5 39.3L147.8 43.1L155.4 47.8L162.4 53.1L168.4 58.7L173.6 64.4L177.6 69.9L180.6 74.8L180.6 78.4L177.6 78.9L173.6 79.5L168.4 80.2L162.4 81L155.4 81.8L147.8 82.5L139.5 83.1L130.7 83.6L121.7 83.9L112.5 84L103.3 83.9L94.3 83.6L85.5 83.1L77.2 82.5L69.6 81.8L62.6 81L56.6 80.2L51.4 79.5L47.4 78.9L44.4 78.4Z`,`M89.2 38.9Q91.9 60.7 92.5 82.5M135.8 38.9Q133.1 60.7 132.5 82.5`];
/* v14: cổng vào – bỏ băng bụng cũ, thay bằng dây chuyền đỏ + logo 9 SẠCH thật */
try{var gt=document.querySelector('.gt');if(gt){['rect[y="188"]','circle[cy="200"]','text'].forEach(function(q){var e=gt.querySelector(q);if(e)e.remove()});
var L=window.L9D,G="<path d='M62 184Q100 204 138 184' fill='none' stroke='#da0e2a' stroke-width='7' stroke-linecap='round'/><g transform='translate(77.5 192) scale(.2)'><circle cx='112.5' cy='112.5' r='111.5' fill='#ffca05'/><circle cx='112.5' cy='112.5' r='99' fill='none' stroke='#2d6a35' stroke-width='2.4'/>";
[0,1].forEach(function(m){G+="<g"+(m?" transform='matrix(1 0 0 -1 0 225)'":"")+"><path d='"+L[0]+"' fill='#fff' stroke='#fff' stroke-width='6' stroke-linejoin='round'/><path d='"+L[1]+"' fill='#336532'/><path d='"+L[2]+"' fill='#f7c030'/><path d='"+L[3]+"' fill='none' stroke='#e39a10' stroke-width='1.8' stroke-linecap='round'/></g>"});
var TT="<text x='112.5' y='133' text-anchor='middle' font-size='54' font-weight='800' font-family='Baloo 2,Arial Black,sans-serif' textLength='150' lengthAdjust='spacingAndGlyphs'";
G+=TT+" fill='#fff' stroke='#fff' stroke-width='7' stroke-linejoin='round'>9 SẠCH</text>"+TT+" fill='#da0e2a'>9 SẠCH</text></g>";
gt.insertAdjacentHTML('beforeend',G)}}catch(e){}
var P=[
/* 1. ĐÊM NOËL: trời xanh chàm sâu, sương mù xanh tím, không tone mapping */
[`var HORIZON=0x9d8fd0;`,`var HORIZON=0x5a56b4;`],
[`g.addColorStop(.47,'#7d70c6');g.addColorStop(.5,'#9d8fd0');g.addColorStop(1,'#9d8fd0');`,`g.addColorStop(.47,'#4b49a6');g.addColorStop(.5,'#5a56b4');g.addColorStop(1,'#5a56b4');`],
[`S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,60,190);`,`R.toneMapping=TH.NoToneMapping;S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,90,230);`],
/* 2. ánh sáng dịu, nền tuyết xanh lạnh */
[`var l=new TH.DirectionalLight(0xbfcdff,.8);l.position.set(-14,26,22);S.add(l);`,`var l=new TH.DirectionalLight(0xffe2bc,.7);l.position.set(14,26,26);S.add(l);var rim=new TH.DirectionalLight(0x8fb8ff,.7);rim.position.set(-18,14,-24);S.add(rim);`],
[`new TH.HemisphereLight(0xfff0e6,0xbccaff,1.08)`,`new TH.HemisphereLight(0xdcd8ff,0x7f8fd8,.72)`],
[`LT1=new TH.PointLight(0xff9a40,1.3,46,2)`,`LT1=new TH.PointLight(0xff9a40,.5,46,2)`],
[`LT2=new TH.PointLight(0xffb060,1.1,40,2)`,`LT2=new TH.PointLight(0xffb060,.45,40,2)`],
[`new TH.MeshStandardMaterial({map:t,roughness:.55,metalness:0})`,`new TH.MeshStandardMaterial({map:t,roughness:.9,metalness:0})`],
[`bb(0xe4ecff,700,.2,700,40,-.1,0);`,`bb(0xa3b5e4,700,.2,700,40,-.1,0);`],
/* v13: vật liệu cọp/hộp quà/mũ tự phát sáng nhẹ (emissive) → màu rực rỡ, không bị xám tối dưới trời đêm */
[`new TH.MeshStandardMaterial({color:c,roughness:.5})`,`new TH.MeshStandardMaterial({color:c,roughness:.42,emissive:c,emissiveIntensity:.15})`],
/* 3. cọp */
[`YL=0xffd21f`,`YL=0xffc41c`],
[`[.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BR,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});`,`/* bo song bung */`],
[`ball(h,EY,.15,.22,.16,.97,.1,s*.37);ball(h,0x111111,.09,.14,.1,1.05,.1,s*.37);`,`ball(h,EY,.19,.28,.2,.95,.1,s*.37);ball(h,0x111111,.12,.18,.13,1.05,.1,s*.37);`],
[`ball(h,0xffffff,.065,.085,.065,1.08,.19,s*.34);`,`ball(h,0xffffff,.085,.105,.085,1.1,.2,s*.34);`],
[`ball(h,WH,.46,.36,.52,.8,-.3,0);`,`ball(h,WH,.5,.4,.58,.8,-.3,0);`],
[`ball(h,0x5a2d1a,.13,.09,.16,1.17,-.12,0);`,`ball(h,0x5a2d1a,.17,.12,.2,1.17,-.12,0);`],
[`o.t=grp(b,-.42,.62,0);`,`h.scale.setScalar(1.14);o.t=grp(b,-.42,.62,0);`],
[`mesh(hat,GT2,0xffffff,.93,.93,.8,0,0,0).rotation.x=Math.PI/2;`,`mesh(hat,GT2,0xffffff,.84,.84,.6,0,0,0).rotation.x=Math.PI/2;`],
[`mesh(ca,GK,SR,.86,1.5,.86,0,.72,0);ball(ca,0xffffff,.2,.2,.2,0,1.5,0);`,`mesh(ca,GK,SR,.86,.95,.86,0,.48,0);ball(ca,0xffffff,.24,.24,.24,0,.95,0);`],
[`ca.rotation.z=.62;`,`ca.rotation.z=.9;`],
[`gb.scale.setScalar(1.22);`,`gb.scale.setScalar(.85);`],
[`tg.g.scale.setScalar(1.02);`,`tg.g.scale.setScalar(1.18);`],
/* 4. nhãn quà (khớp lại với game.js đã sửa trực tiếp: vị trí so le i%3): mọc lên từ đỉnh hộp quà, cỡ cố định theo khoảng cách, chỉ hiện khi đua */
[`c.width=360;c.height=150;`,`c.width=320;c.height=110;`],
[`r=26,W=360,H=150;`,`r=22,W=320,H=110;`],
[`bold 38px`,`bold 46px`],
[`x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*42)`,`x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*48,W-36)`],
[`var sp=label(p.ten,col,2.6,1.08);sp.position.set(0,6.4+(i%3)*0.95,0);ln.add(sp);`,`var sp=label(p.ten,col,2.9,1);sp.center.set(.5,0);sp.position.set(0,6.1+(i%3)*.9,0);sp.renderOrder=10+i;ln.add(sp);`],
[`return {ln:ln,tg:tg,gb:gb,gl:gl,ph:Math.random()*6}}`,`return {ln:ln,tg:tg,gb:gb,gl:gl,sp:sp,ph:Math.random()*6}}`],
[`var last=performance.now();`,`var RV=new TH.Vector3();function relab(){var H=fh||600,px=Math.max(28,Math.min(44,H*.05)),k=2*px/H*Math.tan(C.fov*Math.PI/360),rt=plan?(performance.now()-plan.t0)/1000:0,rc=state=='race'||state=='done',a=rc?Math.max(0,Math.min(1,(rt-1.4)/1.2)):0,end=rc&&rt>DUR+.5;LN.forEach(function(l,i){if(!l.sp)return;var d=l.sp.getWorldPosition(RV).distanceTo(C.position),h=k*d*a;l.sp.scale.set(Math.max(h*2.9,.0001),Math.max(h,.0001),1);l.sp.visible=a>.01&&(!end||(plan&&i==plan.W))})}\nvar last=performance.now();`],
[`cam(now,dt);auTick(dt);`,`cam(now,dt);auTick(dt);relab();`],
[`label('XUẤT PHÁT',0x1f8f55,4.6,1.9)`,`label('XUẤT PHÁT',0x1f8f55,2.6,.9)`],
[`label('🏁 ĐÍCH',0xd8132f,5,2.1)`,`label('🏁 ĐÍCH',0xd8132f,2.8,1)`],
/* 5. hạt tròn mềm */
[`new TH.PointsMaterial({color:col,size:size,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})`,`new TH.PointsMaterial({color:col,size:size*2.2,map:TX.glowW,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})`],
[`new TH.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.9,depthWrite:false})`,`new TH.PointsMaterial({color:0xffffff,size:.6,map:TX.glowW,transparent:true,opacity:.95,depthWrite:false})`],
/* 6. góc quay 3/4 từ phía trước; cảnh về đích lùi xa + cao */
[`if(t<2.6){p=[cx-10,6+hw*.7,hw*1.5+13];l=[cx+3,.8,0];zt=1.04;k=2.2}`,`if(t<2.6){p=[cx+16,6+hw*.7,hw*1.5+13];l=[cx-2,.8,0];zt=1.04;k=2.2}`],
[`p=[cx-9,8+hw*.8,hw*1.25+14+Math.sin(tm*.5)*1.2];l=[cx-1,.5,0];k=1.8`,`p=[cx+15,7+hw*.8,hw*1.25+13+Math.sin(tm*.5)*1.2];l=[cx-3,.8,0];k=1.8`],
[`iP=[cx-3,8+hw*.8,hw*1.25+14],iL=[cx+4,.5,0]`,`iP=[cx+14,7+hw*.8,hw*1.25+13],iL=[cx-3,.8,0]`],
[`rr=8+hw*.2;p=[FIN-1+Math.cos(ph)*rr*1.2,6.2+Math.sin(u*.8)*.5+hw*.1,zW+Math.sin(ph)*rr];l=[FIN-1,3.2,zW];zt=.9;`,`rr=25+hw*.4;p=[FIN-1+Math.cos(ph)*rr*1.1,11+Math.sin(u*.8)*.6+hw*.2,zW+Math.sin(ph)*rr];l=[FIN-1,3.4,zW];zt=1;`],
/* 7. dải đen TVC mỏng lại, bỏ emoji trên nút */
[`BT.style.height=BB.style.height='9%'`,`BT.style.height=BB.style.height='6%'`],
[`'🐯 ĐUA CỌP'`,`'ĐUA CỌP'`],
[`'🏁 Đang đua...'`,`'Đang đua...'`],
[`'🎬 Đang vào cuộc đua...'`,`'Đang vào cuộc đua...'`],
[`$('sp').onclick=go;`,`$('sp').onclick=go;$('sp').textContent='ĐUA CỌP';`],
/* 8. v13 HIỆU ỨNG THẮNG: pháo giấy nổ lớn (460 hạt, toả rộng), mưa pháo giấy 3.4 giây từ trên cao, quầng sáng vàng phía sau cọp thắng */
[`CNF=mkPts(200,0xffffff,.55,1)`,`CNF=mkPts(620,0xffffff,.7,1)`],
[`for(i=0;i<170;i++)emit(CNF,FIN,2.5,zW,(Math.random()-.5)*10,7+Math.random()*8,(Math.random()-.5)*10,2.6+Math.random()*1.4,CCOL[i%CCOL.length]);`,`for(i=0;i<460;i++)emit(CNF,FIN-1+(Math.random()-.5)*6,2.5,zW+(Math.random()-.5)*4,(Math.random()-.5)*16,8+Math.random()*10,(Math.random()-.5)*16,2.8+Math.random()*1.6,CCOL[i%CCOL.length]);var sg=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowY,transparent:true,opacity:.8,depthWrite:false,blending:TH.AdditiveBlending}));sg.scale.set(26,26,1);sg.position.set(FIN-1,4.5,zW);world.add(sg);`],
[`ptsTick(PUF,dt,2.5);ptsTick(CNF,dt,9);bulbTick();smokeTick();`,`if(plan&&plan.win&&rt<DUR+3.4){var zw=(plan.W-(LP.length-1)/2)*LS;for(var qq=0;qq<6;qq++)emit(CNF,FIN-4+Math.random()*10,10+Math.random()*3,zw+(Math.random()-.5)*12,(Math.random()-.5)*3,-1-Math.random()*2,(Math.random()-.5)*3,3,CCOL[(Math.random()*6)|0])}ptsTick(PUF,dt,2.5);ptsTick(CNF,dt,9);bulbTick();smokeTick();`],
/* 9. v13 THƯƠNG HIỆU: biển “9 SẠCH” khổng lồ trên cổng về đích (camera quay về đích luôn thấy) */
[`fl.position.set(FIN+1.2,7.4,0);world.add(fl);`,`fl.position.set(FIN+1.2,7.4,0);world.add(fl);var bn=label('9 SẠCH',0xd8132f,5.6,2);bn.position.set(FIN+1.2,10.4,0);world.add(bn);`],
/* v14 LOGO 9 SẠCH THẬT (vẽ lại từ ảnh logo gốc): huy hiệu bụng, mặt dây chuyền vòng cổ, biển xuất phát + cổng đích. Hàm drawLogo9 dùng window.L9D (đường vẽ lát sầu riêng) */
[`function logoTex(){LOGOC=cv2(128,128);`,`function logoTex(){LOGOC=cv2(256,256);`],
[`function drawLogo(){`,`function drawLogo9(x){
var L=window.L9D,s=256/225,m;x.save();x.scale(s,s);
x.fillStyle='#ffca05';x.beginPath();x.arc(112.5,112.5,111.5,0,6.2832);x.fill();
x.strokeStyle='#2d6a35';x.lineWidth=2.4;x.beginPath();x.arc(112.5,112.5,99,0,6.2832);x.stroke();
var p1=new Path2D(L[0]),p2=new Path2D(L[1]),p3=new Path2D(L[2]),p4=new Path2D(L[3]);
for(m=0;m<2;m++){x.save();if(m){x.translate(0,225);x.scale(1,-1)}
var g=x.createLinearGradient(0,m?186:39,0,m?40:185);g.addColorStop(0,'#fcda5f');g.addColorStop(1,'#f3a814');
x.lineJoin='round';x.lineWidth=6;x.strokeStyle='#fff';x.fillStyle='#fff';x.fill(p1);x.stroke(p1);
x.fillStyle='#336532';x.fill(p2);x.fillStyle=g;x.fill(p3);
x.strokeStyle='#e39a10';x.lineWidth=1.8;x.lineCap='round';x.stroke(p4);x.restore()}
x.font='800 54px "Baloo 2",Arial Black,sans-serif';x.textAlign='center';x.textBaseline='alphabetic';x.lineJoin='round';x.lineWidth=7;x.strokeStyle='#fff';x.strokeText('9 SẠCH',112.5,133,150);x.fillStyle='#da0e2a';x.fillText('9 SẠCH',112.5,133,150);
x.font='700 15px Arial,sans-serif';x.fillText('®',191,90);
x.restore()}
\nfunction drawLogo(){`],
[`if(!LOGOC)return;var x=LOGOC.getContext('2d');x.clearRect(0,0,128,128);`,`if(!LOGOC)return;var x=LOGOC.getContext('2d');x.clearRect(0,0,256,256);try{drawLogo9(x);if(TX.logo)TX.logo.needsUpdate=true;return}catch(e){x.setTransform(2,0,0,2,0,0)}`],
[`var lg=new TH.Mesh(GP,LGM);lg.scale.set(.5,.5,1);lg.position.set(.605,.86,0);lg.rotation.y=Math.PI/2;b.add(lg);`,`var lg=new TH.Mesh(GP,LGM);lg.scale.set(.56,.56,1);lg.position.set(.62,.66,0);lg.rotation.y=Math.PI/2;b.add(lg);`],
[`mesh(b,GT2,col,.43,.43,.9,0,1.4,0).rotation.x=Math.PI/2;ball(b,0xffd54a,.11,.11,.11,.42,1.2,0);`,`mesh(b,GT2,0xda0e2a,.43,.43,.5,0,1.4,0).rotation.x=Math.PI/2;ball(b,0xffd54a,.07,.07,.07,.45,1.33,0);var pd=new TH.Mesh(GP,LGM);pd.scale.set(.3,.3,1);pd.position.set(.6,1.1,0);pd.rotation.y=Math.PI/2;b.add(pd);`],
[`var sg=label('9 SẠCH',0xd8132f,2.5,1.05);sg.position.set(-7,3.4,zf-2.05);`,`var sg=new TH.Sprite(new TH.SpriteMaterial({map:TX.logo,transparent:true}));sg.scale.set(2.2,2.2,1);sg.position.set(-7,3.9,zf-2.05);`],
[`var bn=label('9 SẠCH',0xd8132f,5.6,2);bn.position.set(FIN+1.2,10.4,0);world.add(bn);`,`var bn=new TH.Sprite(new TH.SpriteMaterial({map:TX.logo,transparent:true}));bn.scale.set(4.4,4.4,1);bn.position.set(FIN+1.2,10.6,0);world.add(bn);`],
[`st.position.set(3.4,6.9,0);world.add(st);`,`st.position.set(3.4,6.9,0);world.add(st);var sl=new TH.Sprite(new TH.SpriteMaterial({map:TX.logo,transparent:true}));sl.scale.set(3,3,1);sl.position.set(3.4,9.4,0);world.add(sl);`]
];
fetch(V).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(s){
 var ok=0,miss=[];
 P.forEach(function(q){if(s.indexOf(q[0])<0){miss.push(q[0].slice(0,28));return}ok++;s=s.split(q[0]).join(q[1])});
 if(/[?&]debug=1/.test(location.search)){var d=document.createElement('div');d.style.cssText='position:fixed;left:6px;top:6px;z-index:99999;background:#000c;color:#0f0;font:11px monospace;padding:6px;max-width:90vw;pointer-events:none';d.textContent='patch '+ok+'/'+P.length+(miss.length?' MISS: '+miss.join(' | '):'');document.body.appendChild(d)}
 run(s+'\n//# sourceURL=game.patched.js')}).catch(plain);
})();
