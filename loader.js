/* LOADER v10 – nạp game.js rồi áp bản vá (find-and-replace) trước khi chạy. Vá không khớp bị bỏ qua. Thêm ?debug=1 để xem số vá áp được/hụt trên màn hình. ?classic=1 -> bản gốc. */
(function(){
var V='game.js?v=8';
function run(s){var e=document.createElement('script');e.text=s;document.body.appendChild(e)}
function plain(){var e=document.createElement('script');e.src=V;document.body.appendChild(e)}
if(/[?&]classic=1/.test(location.search))return plain();
var st=document.createElement('style');st.textContent='.box img{border-radius:18px;border:3px solid #ffd05a;box-shadow:0 10px 26px rgba(0,0,0,.35);margin:8px 0}';document.head.appendChild(st);
var P=[
/* 1. không tone mapping, sương mù xa */
[`S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,60,190);`,`R.toneMapping=TH.NoToneMapping;S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,95,240);`],
/* 2. ánh sáng: đèn chính dịu, hai đèn điểm cố định giảm mạnh (nguyên nhân loang hồng/xanh trên đường) */
[`var l=new TH.DirectionalLight(0xbfcdff,.8);l.position.set(-14,26,22);S.add(l);`,`var l=new TH.DirectionalLight(0xffe9cc,.78);l.position.set(14,26,26);S.add(l);var rim=new TH.DirectionalLight(0x9fd4ff,.6);rim.position.set(-18,14,-24);S.add(rim);`],
[`new TH.HemisphereLight(0xfff0e6,0xbccaff,1.08)`,`new TH.HemisphereLight(0xfff0e6,0x9fb0e8,.8)`],
[`LT1=new TH.PointLight(0xff9a40,1.3,46,2)`,`LT1=new TH.PointLight(0xff9a40,.5,46,2)`],
[`LT2=new TH.PointLight(0xffb060,1.1,40,2)`,`LT2=new TH.PointLight(0xffb060,.45,40,2)`],
[`new TH.MeshStandardMaterial({map:t,roughness:.55,metalness:0})`,`new TH.MeshStandardMaterial({map:t,roughness:.9,metalness:0})`],
/* 3. nền tuyết xanh lạnh hơn (bớt trắng xóa) để đường đua nổi */
[`bb(0xe4ecff,700,.2,700,40,-.1,0);`,`bb(0xc6d3f2,700,.2,700,40,-.1,0);`],
/* 4. cọp: vàng ấm, bỏ sọc lò xo, mắt/mõm/mũi to, đầu to hơn (chibi), hộp quà + viền mũ nhỏ lại để lộ mặt */
[`YL=0xffd21f`,`YL=0xffc41c`],
[`[.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BR,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});`,`/* bo song bung */`],
[`ball(h,EY,.15,.22,.16,.97,.1,s*.37);ball(h,0x111111,.09,.14,.1,1.05,.1,s*.37);`,`ball(h,EY,.19,.28,.2,.95,.1,s*.37);ball(h,0x111111,.12,.18,.13,1.05,.1,s*.37);`],
[`ball(h,0xffffff,.065,.085,.065,1.08,.19,s*.34);`,`ball(h,0xffffff,.085,.105,.085,1.1,.2,s*.34);`],
[`ball(h,WH,.46,.36,.52,.8,-.3,0);`,`ball(h,WH,.5,.4,.58,.8,-.3,0);`],
[`ball(h,0x5a2d1a,.13,.09,.16,1.17,-.12,0);`,`ball(h,0x5a2d1a,.17,.12,.2,1.17,-.12,0);`],
[`o.t=grp(b,-.42,.62,0);`,`h.scale.setScalar(1.14);o.t=grp(b,-.42,.62,0);`],
[`mesh(hat,GT2,0xffffff,.93,.93,.8,0,0,0).rotation.x=Math.PI/2;`,`mesh(hat,GT2,0xffffff,.84,.84,.6,0,0,0).rotation.x=Math.PI/2;`],
[`gb.scale.setScalar(1.22);`,`gb.scale.setScalar(.85);`],
[`tg.g.scale.setScalar(1.02);`,`tg.g.scale.setScalar(1.18);`],
/* 5. nhãn quà: chữ to rõ, kích thước cố định trên màn hình (tính theo khoảng cách camera), chỉ hiện khi đang đua; khi về đích chỉ giữ nhãn cọp thắng */
[`c.width=360;c.height=150;`,`c.width=320;c.height=110;`],
[`r=26,W=360,H=150;`,`r=22,W=320,H=110;`],
[`bold 38px`,`bold 46px`],
[`x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*42)`,`x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*48,W-36)`],
[`var sp=label(p.ten,col,2.6,1.08);sp.position.set(0,6.4,0);ln.add(sp);`,`var sp=label(p.ten,col,2.9,1);sp.position.set(0,6.6,0);sp.renderOrder=10+i;ln.add(sp);`],
[`return {ln:ln,tg:tg,gb:gb,gl:gl,ph:Math.random()*6}}`,`return {ln:ln,tg:tg,gb:gb,gl:gl,sp:sp,ph:Math.random()*6}}`],
[`var last=performance.now();`,`var RV=new TH.Vector3();function relab(){var H=fh||600,px=Math.max(32,Math.min(50,H*.058)),k=2*px/H*Math.tan(C.fov*Math.PI/360),rt=plan?(performance.now()-plan.t0)/1000:0,rc=state=='race'||state=='done',a=rc?Math.max(0,Math.min(1,(rt-1.4)/1.2)):0,end=rc&&rt>DUR+.5;LN.forEach(function(l,i){if(!l.sp)return;var d=l.sp.getWorldPosition(RV).distanceTo(C.position),h=k*d*a;l.sp.scale.set(Math.max(h*2.9,.0001),Math.max(h,.0001),1);l.sp.visible=a>.01&&(!end||(plan&&i==plan.W))})}\nvar last=performance.now();`],
[`cam(now,dt);auTick(dt);`,`cam(now,dt);auTick(dt);relab();`],
[`label('XUẤT PHÁT',0x1f8f55,4.6,1.9)`,`label('XUẤT PHÁT',0x1f8f55,2.6,.9)`],
[`label('🏁 ĐÍCH',0xd8132f,5,2.1)`,`label('🏁 ĐÍCH',0xd8132f,2.8,1)`],
/* 6. hạt tròn mềm */
[`new TH.PointsMaterial({color:col,size:size,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})`,`new TH.PointsMaterial({color:col,size:size*2.2,map:TX.glowW,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})`],
[`new TH.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.9,depthWrite:false})`,`new TH.PointsMaterial({color:0xffffff,size:.6,map:TX.glowW,transparent:true,opacity:.95,depthWrite:false})`],
/* 7. góc quay 3/4 từ phía trước */
[`if(t<2.6){p=[cx-10,6+hw*.7,hw*1.5+13];l=[cx+3,.8,0];zt=1.04;k=2.2}`,`if(t<2.6){p=[cx+16,6+hw*.7,hw*1.5+13];l=[cx-2,.8,0];zt=1.04;k=2.2}`],
[`p=[cx-9,8+hw*.8,hw*1.25+14+Math.sin(tm*.5)*1.2];l=[cx-1,.5,0];k=1.8`,`p=[cx+15,7+hw*.8,hw*1.25+13+Math.sin(tm*.5)*1.2];l=[cx-3,.8,0];k=1.8`],
[`iP=[cx-3,8+hw*.8,hw*1.25+14],iL=[cx+4,.5,0]`,`iP=[cx+14,7+hw*.8,hw*1.25+13],iL=[cx-3,.8,0]`]
];
fetch(V).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(s){
 var ok=0,miss=[];
 P.forEach(function(q){if(s.indexOf(q[0])<0){miss.push(q[0].slice(0,28));return}ok++;s=s.split(q[0]).join(q[1])});
 if(/[?&]debug=1/.test(location.search)){var d=document.createElement('div');d.style.cssText='position:fixed;left:6px;top:6px;z-index:99999;background:#000c;color:#0f0;font:11px monospace;padding:6px;max-width:90vw;pointer-events:none';d.textContent='patch '+ok+'/'+P.length+(miss.length?' MISS: '+miss.join(' | '):'');document.body.appendChild(d)}
 run(s+'\n//# sourceURL=game.patched.js')}).catch(plain);
})();
