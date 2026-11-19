(function(){
'use strict';
var $=function(i){return document.getElementById(i)},TH=window.THREE;
if(!TH){var e0=$('er');if(e0)e0.textContent='Không tải được thư viện 3D, vui lòng tải lại trang';return}
var LS=2.7,FIN=72,DUR=9,MAXL=12;
var COLS=[0xd32f2f,0x1f8f55,0xe8a317,0xb71c1c,0x2e7d32,0x8e1b3a,0x0f6b4a,0xf4511e,0xc2185b,0x388e3c,0xe53935,0x00796b];
var BUL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a,0xff8ad8];
var HORIZON=0x9d8fd0;
var D=null,P=[],LP=[],ST='',busy=0,mute=0,state='idle',plan=null,LN=[],IM={},CAMX=3,cdTok=0,fw=0,fh=0,tm=0,baseFov=40,zoom=1,
 R,S,C,world,GS,GL,GM,GB,GT,GT2,GC,GK,GP,GTri,MT={},MB={},TX={},MST=[],LT1,LT2,SNP=null,PUF=null,CNF=null,AUR=[],SMK=[],BI=null,BD=[],introT0=0,
 PC=[[],[]],MS=[new TH.Matrix4()],CP=new TH.Vector3(),CL=new TH.Vector3(),camSet=0,
 TMP=new TH.Matrix4(),QQ=new TH.Quaternion(),EU=new TH.Euler(),V1=new TH.Vector3(),V2=new TH.Vector3(),DM=new TH.Object3D(),
 CCOL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a,0xffffff,0xff8ad8].map(function(h){return new TH.Color(h)});

function ls(k,v){try{if(v===undefined)return localStorage.getItem('dc_'+k);localStorage.setItem('dc_'+k,v)}catch(e){}}
function beep(f,d){if(mute)return;try{var A=window.AC=window.AC||new (window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.value=.1;g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}

/* ================= ÂM THANH: nhạc nền + nhạc đua (file mp3 để cùng thư mục với index.html) ================= */
var AU={bgm:null,race:null,unl:0,mode:'idle'};
function mkAu(src,vol,fb){var a=new Audio();a.preload='auto';a.loop=true;a._v=vol;a._t=0;a._c=0;a._bad=0;a._fb=fb||'';a._rt=0;a._src=src;a._r=0;
  a.addEventListener('error',function(){
    if(a._fb){var u=a._fb;a._fb='';a.src=u;try{a.load()}catch(e){}return}
    /* lỗi tải (vd. trình duyệt còn nhớ lỗi 404 cũ): thử lại tối đa 4 lần với tham số mới để tránh cache */
    if(a._rt<4){a._rt++;setTimeout(function(){a.src=a._src+(a._src.indexOf('?')<0?'?':'&')+'r='+Date.now();try{a.load()}catch(e){}},1200*a._rt)}else a._bad=1});
  a.src=src;try{a.volume=0}catch(e){}return a}
function auSet(a,t,rs){
  if(!a)return;a._t=t;
  if(t>0&&!mute&&AU.unl&&!a._bad&&a.paused){
    if(rs){try{a.currentTime=0}catch(e){}}
    var p;try{p=a.play()}catch(e){}if(p&&p.catch)p.catch(function(){})}}
function auMode(m){AU.mode=m;auSet(AU.bgm,m=='race'?0:1,0);auSet(AU.race,m=='race'?1:0,1)}
function auTick(dt){[AU.bgm,AU.race].forEach(function(a){
  if(!a)return;var tg=mute?0:a._t*a._v,st=dt*1.1;
  /* tự phát lại nếu cần phát mà đang dừng (play bị từ chối / file tải chậm) */
  if(a._t>0&&!mute&&AU.unl&&!a._bad&&a.paused&&((a._r-=dt)<=0)){a._r=.5;auSet(a,a._t,0)}
  a._c+=Math.max(-st,Math.min(st,tg-a._c));
  try{a.volume=Math.max(0,Math.min(1,a._c))}catch(e){}
  if(a._c<.004&&tg===0&&!a.paused)a.pause()})}
function unlock(){
  if(AU.unl)return;AU.unl=1;var r=AU.race;
  if(r&&!r._bad){r.muted=true;var p;try{p=r.play()}catch(e){}
    if(p&&p.then)p.then(function(){r.pause();try{r.currentTime=0}catch(e){}r.muted=false}).catch(function(){r.muted=false});else r.muted=false}
  auMode(AU.mode)}
function auInit(){
  AU.bgm=mkAu('nhac-nen.mp3?v=6',.5,'https://tp9sach-ops.github.io/vongquay/nhac-nen.mp3');AU.race=mkAu('alex-morgan-car-car-music-545487.mp3?v=6',.8);
  ['pointerdown','touchend','click','keydown'].forEach(function(ev){document.addEventListener(ev,unlock,{passive:true})});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){[AU.bgm,AU.race].forEach(function(a){if(a&&!a.paused)a.pause()})}else if(AU.unl)auMode(AU.mode)});
  window.dcEnter=function(){if(AU.unl)auMode(AU.mode);else unlock()}}

/* ================= helper 3D (vật động: cọp, hộp quà, nhãn) ================= */
function mat(c){return MT[c]||(MT[c]=new TH.MeshStandardMaterial({color:c,roughness:.5}))}
function mb(c){return MB[c]||(MB[c]=new TH.MeshBasicMaterial({color:c}))}
function mesh(p,g,c,sx,sy,sz,x,y,z){var m=new TH.Mesh(g,mat(c));m.scale.set(sx,sy,sz);m.position.set(x,y,z);p.add(m);return m}
function ball(p,c,sx,sy,sz,x,y,z){return mesh(p,GS,c,sx,sy,sz,x,y,z)}
function grp(p,x,y,z){var g=new TH.Group();g.position.set(x,y,z);p.add(g);return g}
function two(s){s=String(s);if(s.length<=14)return[s];var m=s.length>>1,b=-1,i;for(i=0;i<s.length;i++)if(s[i]==' '&&(b<0||Math.abs(i-m)<Math.abs(b-m)))b=i;return b<0?[s.slice(0,14),s.slice(14,28)]:[s.slice(0,b),s.slice(b+1)]}
function label(txt,col,w,h){
  var c=document.createElement('canvas');c.width=360;c.height=150;
  var x=c.getContext('2d'),r=26,W=360,H=150;
  x.fillStyle='#fffdf5';x.strokeStyle='#'+('000000'+col.toString(16)).slice(-6);x.lineWidth=10;
  x.beginPath();x.moveTo(r,5);x.arcTo(W-5,5,W-5,H-5,r);x.arcTo(W-5,H-5,5,H-5,r);x.arcTo(5,H-5,5,5,r);x.arcTo(5,5,W-5,5,r);x.closePath();x.fill();x.stroke();
  x.fillStyle='#8e0b22';x.font='bold 38px "Baloo 2",sans-serif';x.textAlign='center';x.textBaseline='middle';
  var L=two(txt);L.forEach(function(l,j){x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*42)});
  var sp=new TH.Sprite(new TH.SpriteMaterial({map:new TH.CanvasTexture(c),transparent:true,depthTest:false}));
  sp.scale.set(w||3.4,h||1.42,1);sp.renderOrder=10;return sp}

/* ================= BATCH: gộp toàn bộ cảnh tĩnh (cây, nhà, đường...) thành vài draw call ================= */
function bpush(x,y,z,s,ry){TMP.compose(V1.set(x,y,z),QQ.setFromEuler(EU.set(0,ry||0,0)),V2.set(s,s,s));MS.push(MS[MS.length-1].clone().multiply(TMP))}
function bpop(){MS.pop()}
function bp(g,c,sx,sy,sz,x,y,z,rx,ry,rz,k){TMP.compose(V1.set(x,y,z),QQ.setFromEuler(EU.set(rx||0,ry||0,rz||0)),V2.set(sx,sy,sz));PC[k||0].push({g:g,c:c,m:MS[MS.length-1].clone().multiply(TMP)})}
function bb(c,sx,sy,sz,x,y,z,rx,ry,rz){bp(GB,c,sx,sy,sz,x,y,z,rx,ry,rz,0)}
function bs(c,sx,sy,sz,x,y,z){bp(GL,c,sx,sy,sz,x,y,z,0,0,0,0)}
function bm(c,sx,sy,sz,x,y,z){bp(GM,c,sx,sy,sz,x,y,z,0,0,0,0)}
function bc(c,sx,sy,sz,x,y,z,rx,ry,rz){bp(GC,c,sx,sy,sz,x,y,z,rx,ry,rz,0)}
function bk(c,sx,sy,sz,x,y,z){bp(GK,c,sx,sy,sz,x,y,z,0,0,0,0)}
function bg(c,sx,sy,sz,x,y,z){bp(GB,c,sx,sy,sz,x,y,z,0,0,0,1)}
function MSC(){return V2.setFromMatrixScale(MS[MS.length-1]).x}
function wp(x,y,z){return V1.set(x,y,z).applyMatrix4(MS[MS.length-1]).clone()}
function bulbI(x,y,z,s,c){var q=wp(x,y,z);BD.push({x:q.x,y:q.y,z:q.z,s:s*MSC(),ph:Math.random()*6.283,c:c})}
function flush(parent){
  [0,1].forEach(function(k){
    var L=PC[k];if(!L.length)return;
    var np=0,ni=0,i,j,o=0,oi=0;
    L.forEach(function(p){np+=p.g.attributes.position.count;ni+=p.g.index.count});
    var pos=new Float32Array(np*3),nor=new Float32Array(np*3),col=new Float32Array(np*3),idx=new Uint32Array(ni),nm=new TH.Matrix3(),cc=new TH.Color(),v=new TH.Vector3();
    L.forEach(function(p){
      var g=p.g,a=g.attributes.position,b=g.attributes.normal,n=a.count;nm.getNormalMatrix(p.m);cc.setHex(p.c);
      for(i=0;i<n;i++){
        v.fromBufferAttribute(a,i).applyMatrix4(p.m);pos[(o+i)*3]=v.x;pos[(o+i)*3+1]=v.y;pos[(o+i)*3+2]=v.z;
        v.fromBufferAttribute(b,i).applyMatrix3(nm).normalize();nor[(o+i)*3]=v.x;nor[(o+i)*3+1]=v.y;nor[(o+i)*3+2]=v.z;
        col[(o+i)*3]=cc.r;col[(o+i)*3+1]=cc.g;col[(o+i)*3+2]=cc.b}
      for(j=0;j<g.index.count;j++)idx[oi+j]=g.index.array[j]+o;
      o+=n;oi+=g.index.count});
    var G=new TH.BufferGeometry();
    G.setAttribute('position',new TH.BufferAttribute(pos,3));G.setAttribute('normal',new TH.BufferAttribute(nor,3));G.setAttribute('color',new TH.BufferAttribute(col,3));
    G.setIndex(new TH.BufferAttribute(idx,1));
    var M=new TH.Mesh(G,MST[k]);M.userData.own=1;M.frustumCulled=false;parent.add(M)});
  PC=[[],[]]}
function flushBulbs(){
  if(!BD.length)return;
  BI=new TH.InstancedMesh(GL,new TH.MeshBasicMaterial({color:0xffffff}),BD.length);BI.frustumCulled=false;
  var c=new TH.Color();
  BD.forEach(function(b,i){c.setHex(b.c);BI.setColorAt(i,c);DM.position.set(b.x,b.y,b.z);DM.scale.setScalar(b.s);DM.updateMatrix();BI.setMatrixAt(i,DM.matrix)});
  world.add(BI)}
function bulbTick(){
  if(!BI)return;
  BD.forEach(function(b,i){DM.position.set(b.x,b.y,b.z);DM.scale.setScalar(b.s*(.8+.38*Math.sin(tm*3.2+b.ph)));DM.updateMatrix();BI.setMatrixAt(i,DM.matrix)});
  BI.instanceMatrix.needsUpdate=true}
function glowS(map,w,h,x,y,z,op){
  var p=wp(x,y,z),k=MSC(),s=new TH.Sprite(new TH.SpriteMaterial({map:map,transparent:true,opacity:op,depthWrite:false,blending:TH.AdditiveBlending}));
  s.scale.set(w*k,h*k,1);s.position.copy(p);world.add(s);return s}
function groundGlow(x,z,w,d,op){
  var m=new TH.Mesh(GP,new TH.MeshBasicMaterial({map:TX.glowO,transparent:true,opacity:op,depthWrite:false,blending:TH.AdditiveBlending}));
  m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);m.position.set(x,.09,z);world.add(m)}

/* ================= Texture vẽ bằng canvas ================= */
function cv2(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}
function glowTex(rgb){var c=cv2(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba('+rgb+',1)');g.addColorStop(.3,'rgba('+rgb+',.5)');g.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new TH.CanvasTexture(c)}
function smokeTex(){var c=cv2(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);
  g.addColorStop(0,'rgba(235,235,250,.9)');g.addColorStop(.6,'rgba(220,220,240,.4)');g.addColorStop(1,'rgba(220,220,240,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new TH.CanvasTexture(c)}
function skyTex(){var c=cv2(8,512),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#070d3a');g.addColorStop(.22,'#17237a');g.addColorStop(.38,'#3d3a98');g.addColorStop(.47,'#7d70c6');g.addColorStop(.5,'#9d8fd0');g.addColorStop(1,'#9d8fd0');
  x.fillStyle=g;x.fillRect(0,0,8,512);return new TH.CanvasTexture(c)}
function aurTex(r,g,b){var c=cv2(256,128),x=c.getContext('2d'),i,a,gr;
  for(i=0;i<256;i++){a=.4+.35*Math.sin(i/256*6.283*3+1)+.25*Math.sin(i/256*6.283*7);a=Math.max(.06,Math.min(1,a));
    gr=x.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba('+r+','+g+','+b+',0)');gr.addColorStop(.55,'rgba('+r+','+g+','+b+','+(a*.85)+')');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
    x.fillStyle=gr;x.fillRect(i,0,1,128)}
  var t=new TH.CanvasTexture(c);t.wrapS=TH.RepeatWrapping;return t}

/* ================= Cọp con vàng (chibi) đội hộp quà trên đầu: vàng tươi, bụng/mõm trắng kem, tai tròn viền nâu, má hồng ================= */
function tiger(col){
  var YL=0xffd21f,WH=0xfffaf0,BR=0x6b3a1a,PK=0xff9bb0,EY=0x4a2410;
  var g=new TH.Group(),b=grp(g,0,.12,0),h=grp(b,0,2.2,0),o={g:g,b:b,h:h,al:[],ll:[]};
  ball(b,YL,.5,.62,.52,0,.95,0);ball(b,WH,.3,.42,.35,.3,.88,0);
  [.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BR,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});
  mesh(b,GT2,col,.43,.43,.9,0,1.4,0).rotation.x=Math.PI/2;ball(b,0xffd54a,.11,.11,.11,.42,1.2,0);
  /* đầu tròn to */
  ball(h,YL,1.1,.98,1.0,0,0,0);
  ball(h,WH,.46,.36,.52,.8,-.3,0);                         /* mõm trắng */
  ball(h,0x5a2d1a,.13,.09,.16,1.17,-.12,0);                /* mũi nâu */
  ball(h,0x7a2236,.1,.07,.19,1.12,-.4,0);ball(h,PK,.07,.04,.11,1.19,-.45,0); /* miệng cười + lưỡi hồng */
  [-1,1].forEach(function(s){
    ball(h,EY,.14,.21,.15,.97,.1,s*.37);ball(h,0x111111,.08,.13,.09,1.05,.1,s*.37);
    ball(h,0xffffff,.06,.08,.06,1.08,.18,s*.34);ball(h,0xffffff,.03,.03,.03,1.09,.02,s*.41);   /* mắt to có điểm sáng */
    ball(h,PK,.06,.1,.14,.9,-.2,s*.62);                    /* má hồng */
    ball(h,BR,.06,.04,.05,.9,.5,s*.22);                    /* lông mày */
    ball(h,BR,.14,.42,.42,-.05,.8,s*.78);ball(h,YL,.15,.35,.35,0,.8,s*.78);ball(h,PK,.16,.23,.23,.05,.8,s*.78); /* tai tròn: viền nâu, vàng, hồng */
    [.25,.04,-.17].forEach(function(y){var x=-.2,z=Math.sqrt(Math.max(0,1-Math.pow(y/.98,2)-Math.pow(x/1.1,2)));ball(h,BR,.36,.05,.12,x,y,s*(z-.01))});  /* sọc má */
    [0,1].forEach(function(j){mesh(h,GB,BR,.5,.012,.012,1.18,-.3+j*.07,s*.4).rotation.y=-s*.5});
    var ar=grp(b,.1,1.28,s*.52);ball(ar,YL,.17,.32,.17,0,-.26,0);ball(ar,WH,.15,.15,.15,0,-.52,0);ball(ar,PK,.09,.09,.06,.1,-.54,0);ar.rotation.x=-s*2.2;o.al.push(ar);
    var lg=grp(b,0,.42,s*.25);ball(lg,YL,.2,.32,.2,0,-.12,0);ball(lg,WH,.28,.1,.2,.09,-.4,0);o.ll.push(lg)});
  /* sọc trán */
  [-.45,-.15,.15].forEach(function(x){ball(h,BR,.07,.03,.2,x,.98*Math.sqrt(1-Math.pow(x/1.1,2))-.005,0)});
  o.t=grp(b,-.42,.62,0);for(var i=0;i<5;i++)ball(o.t,i%2?BR:(i==4?WH:YL),.1,.1,.1,-.1*i,.03*i*i,0);
  return o}

/* ================= Làn đua: mỗi cọp đội 1 hộp quà trên đầu ================= */
var BXC=[0xd32f2f,0x1f8f55,0x2f6fd8,0xe8a317,0x8e1b3a,0x0f8f8f,0x8e24aa];
function lane(i,n,p){
  var z=(i-(n-1)/2)*LS,ln=grp(world,0,0,z),col=COLS[i%COLS.length],tg=tiger(col);
  tg.g.scale.setScalar(1.02);ln.add(tg.g);
  var BX=BXC[i%BXC.length],RB=BX==0xe8a317?0xffffff:0xffd54a,gb=grp(tg.h,0,.76,0);
  mesh(gb,GB,BX,1.0,.9,.84,0,.45,0);mesh(gb,GB,BX,1.12,.2,.96,0,.98,0);
  mesh(gb,GB,RB,1.04,.94,.16,0,.45,0);mesh(gb,GB,RB,.16,.94,.88,0,.45,0);
  mesh(gb,GB,RB,1.16,.24,.16,0,.98,0);mesh(gb,GB,RB,.16,.24,1.0,0,.98,0);
  ball(gb,RB,.3,.2,.16,0,1.22,.2);ball(gb,RB,.3,.2,.16,0,1.22,-.2);ball(gb,RB,.14,.14,.14,0,1.2,0);
  gb.scale.setScalar(1.22);
  var gl=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowY,transparent:true,opacity:.5,depthWrite:false,blending:TH.AdditiveBlending}));gl.scale.set(3.4,3.4,1);gl.position.set(0,.7,0);gb.add(gl);
  var sp=label(p.ten,col,2.6,1.08);sp.position.set(0,6.2,0);ln.add(sp);
  return {ln:ln,tg:tg,gb:gb,gl:gl,ph:Math.random()*6}}

/* ================= Cây thông, nhà gỗ, quà, người tuyết (đều gộp batch) ================= */
var TIERS=[[2.1,2.3,1.9,0x0f5a3a],[1.8,2.2,3.2,0x146b45],[1.45,2.0,4.4,0x1b7d4d],[1.05,1.8,5.5,0x239457]];
function btree(x,z,s,full,glow){
  bpush(x,0,z,s,0);
  bc(0x5d3a1a,.5,1.2,.5,0,.6,0);
  TIERS.forEach(function(q,k){
    var r=q[0],h=q[1],y=q[2],ch=h*.5,j,a;
    bk(q[3],r,h,r,0,y,0);bk(0xf4f7ff,r*.52,ch,r*.52,0,y+h/2-ch/2+.02,0);
    if(full)for(j=0;j<3;j++){a=k*2.1+j*2.1+x*.7;bulbI(Math.cos(a)*r*.76,y-h/2+h*.3,Math.sin(a)*r*.76,.17,BUL[(k+j)%BUL.length])}});
  bulbI(0,6.55,0,.4,0xffd54a);
  if(glow)glowS(TX.glowY,4.5,4.5,0,6.5,0,.7);
  bpop()}
function bgift(x,y,z,sz,c,rb,ry){
  bpush(x,y,z,1,ry||0);
  bb(c,sz,sz*.8,sz,0,sz*.4,0);bb(rb,sz*1.03,sz*.82,sz*.18,0,sz*.4,0);bb(rb,sz*.18,sz*.82,sz*1.03,0,sz*.4,0);
  bs(rb,sz*.2,sz*.12,sz*.12,sz*.12,sz*.88,0);bs(rb,sz*.2,sz*.12,sz*.12,-sz*.12,sz*.88,0);
  bpop()}
function bsnowman(x,z,s,ry){
  bpush(x,0,z,s,ry||0);
  bm(0xf4f7ff,1,.9,1,0,.85,0);bm(0xf4f7ff,.75,.7,.75,0,2.0,0);bm(0xf4f7ff,.55,.55,.55,0,2.9,0);
  bp(GK,0xff7a1a,.1,.55,.1,0,2.9,.6,Math.PI/2,0,0,0);
  bs(0x111111,.07,.07,.07,-.2,3.05,.45);bs(0x111111,.07,.07,.07,.2,3.05,.45);
  bp(GT2,0xd8132f,.6,.6,.6,0,2.45,0,Math.PI/2,0,0,0);bb(0xd8132f,.16,.7,.12,.35,2.1,.5);
  bc(0x222222,.45,.5,.45,0,3.5,0);bc(0x222222,.7,.06,.7,0,3.28,0);bb(0xd8132f,.46,.1,.46,0,3.34,0);
  bpop()}
function bcabin(x,z,s){
  bpush(x,0,z,s,0);
  var WH=3.6,a=.62,rise=3.6*Math.tan(a),L=3.6/Math.cos(a),yc=WH+rise/2+.12,i,sx;
  bb(0x7d7f88,9.6,1.1,6.2,0,.55,0);
  bb(0x8a5c38,9,WH-1,6,0,1.1+(WH-1)/2,0);
  for(i=0;i<5;i++)bb(0x5a3a22,9.05,.09,6.05,0,1.5+i*.5,0);
  [-1,1].forEach(function(p){[-1,1].forEach(function(q){bb(0x4a2d1a,.4,WH-1,.4,p*4.5,1.1+(WH-1)/2,q*3)})});
  [-1,1].forEach(function(q){bb(0x3b2a22,9.9,.3,L,0,yc,q*1.8,q*a);bb(0xf6f9ff,9.8,.5,L*.98,0,yc+.32,q*1.8,q*a)});
  bb(0xf6f9ff,9.9,.5,.9,0,WH+rise+.38,0);
  bp(GTri,0x8a5c38,1,1,1,4.52,WH,0,0,Math.PI/2,0,0);bp(GTri,0x8a5c38,1,1,1,-4.52,WH,0,0,-Math.PI/2,0,0);
  bb(0x8a4b3a,1.1,3.4,1.1,2.4,WH+2.5,-1.2);bb(0xf6f9ff,1.4,.3,1.4,2.4,WH+4.3,-1.2);
  [-2.8,2.8].forEach(function(sx){
    bb(0x2a1a10,1.7,1.5,.14,sx,2.5,3.02);bg(0xffd27a,1.4,1.2,.16,sx,2.5,3.05);
    bb(0x2a1a10,1.4,.08,.18,sx,2.5,3.08);bb(0x2a1a10,.08,1.2,.18,sx,2.5,3.08);bb(0xf6f9ff,1.9,.18,.4,sx,1.7,3.15);
    glowS(TX.glowO,5,4,sx,2.5,4.2,.55)});
  bb(0x3b2a22,1.5,2.4,.1,0,1.2,3.12);bg(0xff9a3a,1.2,2.1,.12,0,1.05,3.17);
  bp(GC,0x3b2a22,.76,.1,.76,0,2.4,3.12,Math.PI/2,0,0,0);bp(GC,0xff9a3a,.6,.12,.6,0,2.1,3.18,Math.PI/2,0,0,1);
  bp(GT2,0x1f8f55,.34,.34,.34,0,1.55,3.3,0,0,0,0);bs(0xd8132f,.13,.13,.1,0,1.2,3.36);
  bb(0xf6f9ff,2.6,.25,1.2,0,.12,3.75);
  for(i=0;i<9;i++)bulbI(-4.8+i*1.2,3.45,3.72,.14,BUL[i%BUL.length]);
  [-1,1].forEach(function(q){[-1,1].forEach(function(p){for(i=0;i<5;i++){var t=i/4;bulbI(p*5.0,3.7+t*(WH+rise-3.7+.5),q*3.65*(1-t),.13,BUL[(i+(p>0?1:3))%BUL.length])}})});
  bsnowmound(-4.3,3.4);bsnowmound(4.4,3.5);bsnowmound(-4.9,-.5);bsnowmound(5.0,.4);
  var g=wp(0,0,7.2),k=MSC();groundGlow(g.x,g.z,13*k,9*k,.7);
  var sm=wp(2.4,WH+4.7,-1.2);
  for(i=0;i<8;i++){
    var sp=new TH.Sprite(new TH.SpriteMaterial({map:TX.smoke,transparent:true,opacity:0,depthWrite:false}));
    world.add(sp);SMK.push({s:sp,x:sm.x,y:sm.y,z:sm.z,ph:i/8,k:k})}
  bpop()}
function bsnowmound(x,z){bs(0xffffff,1.5,.6,1.1,x,.25,z)}

/* ================= Đường đua: texture vẽ sẵn (làn xanh thông / đỏ cherry bóng, mũi tên chạy, vạch vàng, kim tuyến) ================= */
function trackMesh(n,x0,len,cx,W){
  var Wc=2048,Hc=1024,c=cv2(Wc,Hc),x=c.getContext('2d'),lh=Hc/n,px=Wc/len,py=Hc/(n*LS),i,j,g,y0,a,u;
  for(i=0;i<n;i++){
    y0=i*lh;a=i%2?['#238a5e','#14583f']:['#d1364a','#9c1d2f'];
    g=x.createLinearGradient(0,y0,0,y0+lh);g.addColorStop(0,a[1]);g.addColorStop(.5,a[0]);g.addColorStop(1,a[1]);x.fillStyle=g;x.fillRect(0,y0,Wc,lh);
    /* mũi tên chạy (chỉ hướng đua) giữa vạch xuất phát và đích */
    x.fillStyle='rgba(255,246,224,.2)';
    for(u=7;u<FIN-1;u+=6){
      var cx0=(u-x0)*px,cy=y0+lh/2,hw=.8*px,hh=LS*.3*py;
      x.beginPath();x.moveTo(cx0-hw,cy-hh);x.lineTo(cx0,cy-hh);x.lineTo(cx0+hw,cy);x.lineTo(cx0,cy+hh);x.lineTo(cx0-hw,cy+hh);x.lineTo(cx0,cy);x.closePath();x.fill()}}
  /* kim tuyến lấp lánh */
  for(i=0;i<1400;i++){x.fillStyle='rgba(255,255,255,'+(.12+Math.random()*.3)+')';x.fillRect(Math.random()*Wc,Math.random()*Hc,1+Math.random()*2,1+Math.random()*2)}
  /* vạch ngăn làn trắng ngà, mép ngoài vàng */
  x.fillStyle='#fff6e0';for(j=1;j<n;j++)x.fillRect(0,j*lh-Math.max(2,py*.06),Wc,Math.max(4,py*.12));
  x.fillStyle='#ffd54a';x.fillRect(0,0,Wc,Math.max(5,py*.14));x.fillRect(0,Hc-Math.max(5,py*.14),Wc,Math.max(5,py*.14));
  /* vạch xuất phát */
  x.fillStyle='#ffffff';x.fillRect((3.1-x0)*px,0,px*.55,Hc);
  var t=new TH.CanvasTexture(c);try{t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy())}catch(e){}
  var m=new TH.Mesh(GP,new TH.MeshStandardMaterial({map:t,roughness:.55,metalness:0}));
  m.rotation.x=-Math.PI/2;m.scale.set(len,W,1);m.position.set(cx,.05,0);m.userData.trk=1;world.add(m)}
function blamp(x,z,s){
  bpush(x,0,z,s,0);
  bc(0x2b2538,.12,3.4,.12,0,1.7,0);bc(0x2b2538,.28,.2,.28,0,.1,0);
  bp(GL,0xffe08a,.34,.42,.34,0,3.6,0,0,0,0,1);bb(0x2b2538,.5,.1,.5,0,3.95,0);
  glowS(TX.glowO,4.2,4.2,0,3.6,0,.65);
  bpop()}

/* ================= Dựng cảnh theo số cọp ================= */
var CB=[[-4,1.3],[28,1.8],[64,1.5],[104,1.8]];
function clearX(x){return CB.every(function(c){return Math.abs(x-c[0])>c[1]*4.5+3})}
function buildScene(){
  while(world.children.length){var c=world.children[0];world.remove(c);c.traverse(function(o){
    if(o.userData&&o.userData.own&&o.geometry)o.geometry.dispose();
    if(o.userData&&o.userData.trk){if(o.material.map)o.material.map.dispose();o.material.dispose()}
    if(o.isSprite&&o.material&&o.material.map&&o.material.map!==TX.glowY&&o.material.map!==TX.glowO&&o.material.map!==TX.smoke)o.material.map.dispose()})}
  LN=[];SMK=[];BD=[];BI=null;PC=[[],[]];MS=[new TH.Matrix4()];
  var n=LP.length;if(!n)return;
  var W=n*LS,x0=-12,x1=FIN+36,len=x1-x0,cx=(x0+x1)/2,zf=-W/2,zn=W/2,i,j,k,s;
  LT1.position.set(28,6,zf-8);LT2.position.set(FIN+4,6,0);
  /* nền tuyết + đồi tuyết nhỏ */
  bb(0xe4ecff,700,.2,700,40,-.1,0);
  for(i=0;i<46;i++){var side=i%2?1:-1,mz=side*(W/2+7+Math.random()*14),mx=-20+Math.random()*170,r=1.5+Math.random()*3;bm(0xf8faff,r*1.8,r*.35,r*1.2,mx,0,mz)}
  /* đường đua: làn đỏ/xanh xen kẽ + vạch trắng + gờ tuyết */
  trackMesh(n,x0,len,cx,W);
  [-1,1].forEach(function(q){bb(0xffd54a,len,.1,.2,cx,.07,q*W/2)});
  for(i=0;i<n*2;i++)for(j=0;j<2;j++)bb((i+j)%2?0x222222:0xffffff,.6,.09,LS/2,FIN+.9+j*.6,.09,-W/2+LS/4+i*LS/2);
  [-1,1].forEach(function(q){bp(GS,0xf9fbff,len/2,.5,.9,cx,.1,q*(W/2+1.05),0,0,0,0)});
  /* cọc kẹo + dây đèn dọc 2 mép */
  for(k=0;x0+k*6<=x1;k++)[-1,1].forEach(function(q){
    var px=x0+k*6,pz=q*(W/2+.85),m;
    for(m=0;m<5;m++)bc(m%2?0xffffff:0xd8132f,.11,.36,.11,px,.18+m*.36,pz);
    bs(0xd8132f,.2,.2,.2,px,1.88,pz);
    for(m=1;m<5;m++){var f=m/5;bulbI(px+f*6,1.75-.6*Math.sin(Math.PI*f),pz,.13,BUL[(k+m+(q>0?2:0))%BUL.length])}});
  /* vòm xuất phát + cổng đích */
  [-1,1].forEach(function(q){
    for(k=0;k<7;k++)bc(k%2?0xffffff:0xd8132f,.19,.75,.19,3.4,.375+k*.75,q*(W/2+.5));
    bs(0xffd54a,.35,.35,.35,3.4,5.45,q*(W/2+.5))});
  bb(0xd8132f,.4,.55,W+1.4,3.4,5.0,0);bb(0xffd54a,.44,.1,W+1.5,3.4,4.7,0);
  for(k=0;k<=10;k++)bulbI(3.7,4.45-Math.sin(k/10*Math.PI)*.35,-W/2-.5+k*(W+1)/10,.13,BUL[k%BUL.length]);
  [-1,1].forEach(function(q){
    for(k=0;k<7;k++)bc(k%2?0xffffff:0xd8132f,.34,.75,.34,FIN+1.2,.375+k*.75,q*(W/2+.2));
    bs(0xffd54a,.5,.5,.5,FIN+1.2,5.5,q*(W/2+.2))});
  bb(0xd8132f,.35,1,W+.8,FIN+1.2,5.4,0);bb(0xffd54a,.4,.16,W+.9,FIN+1.2,4.85,0);
  for(k=0;k<=12;k++)bulbI(FIN+1.5,4.6-Math.sin(k/12*Math.PI)*.4,-W/2-.2+k*(W+.4)/12,.15,BUL[k%BUL.length]);
  /* cây thông */
  for(k=0;k<12;k++){var tx=-9+k*9.4;btree(tx,zf-3.8-(k%3)*.6,.85+(k%3)*.08,true,false);if(k%2==1&&tx>10&&tx<80)btree(tx+3,zf-9,.7,false,false)}
  for(k=0;k<11;k++){var bx=-6+k*11.5;if(clearX(bx))btree(bx,zf-8-(k%2)*2.5,1.25+(k%3)*.15,k%2==0,false)}
  btree(14,zf-7.5,2.3,true,true);btree(FIN+16,zf-7,2.1,true,true);
  for(k=0;k<8;k++)blamp(-2+k*14.5,zf-2.9,1);
  /* nhà gỗ */
  CB.forEach(function(c,ci){bcabin(c[0],zf-14-(ci%2)*2.5-c[1]*1.5,c[1])});
  /* quà, người tuyết, biển, xe trượt */
  [[6,.9],[20,1],[41,.9],[55,1.1],[88,1]].forEach(function(q,ci){
    bgift(q[0],0,zf-2.1,q[1],0xd32f2f,0xffd54a,ci*.7);bgift(q[0]+1.15,0,zf-2.4,q[1]*.7,0x1f8f55,0xffffff,-ci*.5);bgift(q[0]+.4,q[1]*.8,zf-2.3,q[1]*.55,0xffd54a,0xd32f2f,ci*.3);
    bgift(q[0]+3,0,zn+2.3,q[1]*.7,ci%2?0x1f8f55:0xd32f2f,ci%2?0xffffff:0xffd54a,ci)});
  bsnowman(FIN+8,zn+3,.5,-.5);bsnowman(-5,zn+3,.5,.4);bsnowman(FIN+5,zf-5,.9,.3);bsnowman(45,zf-4.5,.85,-.2);
  bc(0x5d3a1a,.14,3.6,.14,-7,1.8,zf-2.2);bb(0x8a5c38,2.4,.9,.12,-7,3.4,zf-2.2);
  var sg=label('9 SẠCH',0xd8132f,2.5,1.05);sg.position.set(-7,3.4,zf-2.05);world.add(sg);
  bpush(FIN+15,0,zf-3.2,1,-.5);
  bb(0xb71c1c,3.2,.9,1.6,0,.9,0);bb(0xffd54a,3.4,.12,1.8,0,1.4,0);bb(0xb71c1c,.3,1.2,1.6,-1.5,1.7,0);
  bb(0xffd54a,4,.12,.16,0,.2,.6);bb(0xffd54a,4,.12,.16,0,.2,-.6);bb(0xffd54a,.4,.7,.1,1.9,.55,.6,0,0,-.5);bb(0xffd54a,.4,.7,.1,1.9,.55,-.6,0,0,-.5);
  bm(0x6a3d9a,1.1,.9,1,.3,1.7,0);bgift(.4,1.4,.2,.7,0x1f8f55,0xffd54a,0);
  bpop();
  flush(world);flushBulbs();
  var fl=label('🏁 ĐÍCH',0xd8132f,5,2.1);fl.position.set(FIN+1.2,7.4,0);world.add(fl);
  var st=label('XUẤT PHÁT',0x1f8f55,4.6,1.9);st.position.set(3.4,6.9,0);world.add(st);
  glowS(TX.glowY,9,9,FIN+1.2,5.4,0,.35);
  LP.forEach(function(p,i){LN.push(lane(i,n,p))})}

/* ================= Diễn biến cuộc đua ================= */
function pr(i,t){
  var f=plan.f[i];
  if(t>=f)return 1+.035*(1-Math.exp(-(t-f)*2));
  var u=t/f;
  return Math.max(0,.65*u+.35*u*u*(3-2*u)+.045*Math.sin(6.283*plan.c[i]*t+plan.ph[i])*Math.sin(Math.PI*u))}

function pose(l,x,v,dt,i,rt){
  var g=l.tg,k=Math.min(1,v);l.ph+=dt*(3+11*k);var s=Math.sin(l.ph),base=.5+.45*k;
  l.ln.position.x=x;
  g.ll[0].rotation.z=s*.9*k;g.ll[1].rotation.z=-s*.9*k;
  g.al[0].rotation.z=base-s*.4*k;g.al[1].rotation.z=base+s*.4*k;
  g.b.position.y=.12+Math.abs(s)*.16*k+(1-k)*Math.sin(tm*2+i)*.02;
  g.t.rotation.y=Math.sin(l.ph*.7+i)*.5;
  g.h.rotation.z=Math.sin(l.ph)*.05*k-.03;
  g.al[0].rotation.x=2.2;g.al[1].rotation.x=-2.2;
  l.gb.rotation.z=Math.sin(l.ph)*.07*k;l.gb.rotation.x=Math.sin(l.ph*.5)*.04*k;
  l.gl.material.opacity=.42+.2*Math.sin(tm*3+i);
  var j=0,ry=0;
  if(plan&&i==plan.W&&rt>DUR){var q=rt-DUR;j=Math.abs(Math.sin(q*6))*.7;ry=Math.sin(q*3)*.6}
  g.g.position.y=j;g.g.rotation.y=ry;
  if(state=='intro'&&i==(LP.length>>1)){g.al[1].rotation.x=-2.2-Math.abs(Math.sin(tm*8))*.7;g.g.position.y=Math.abs(Math.sin(tm*4))*.22;g.g.rotation.y=-.3+Math.sin(tm*2)*.1}}

function fit(){
  var cv=$('cv'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
  if(w!==fw||h!==fh){fw=w;fh=h;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}}

var last=performance.now();
function loop(now){
  requestAnimationFrame(loop);
  var dt=Math.min(.05,(now-last)/1000);last=now;tm+=dt;fit();snowTick(dt);
  var rt=plan?(now-plan.t0)/1000:0,xs=[];
  LN.forEach(function(l,i){
    var x=0,v=0;
    if(state=='warm')v=.8;else if(state=='intro')v=.22;
    else if(plan&&(state=='race'||state=='done')){var p=pr(i,rt);x=p*FIN;v=Math.min(1.3,(pr(i,rt+.05)-p)*20*DUR*.9)}
    xs.push(x);pose(l,x,v,dt,i,rt)});
  if(xs.length){var mx=Math.max.apply(null,xs),mn=Math.min.apply(null,xs),tg=(state=='race'||state=='done')?mx*.6+mn*.4+4:3;CAMX+=(tg-CAMX)*Math.min(1,dt*3)}
  if(state=='race'&&plan&&LN.length){
    for(var q=0;q<3;q++){var li=(Math.random()*LN.length)|0;if(xs[li]>1&&xs[li]<FIN+8)emit(PUF,xs[li]-.9,.25,LN[li].ln.position.z+(Math.random()-.5)*.8,-2-Math.random()*2,1+Math.random()*1.6,(Math.random()-.5)*1.2,.55+Math.random()*.4)}}
  ptsTick(PUF,dt,2.5);ptsTick(CNF,dt,9);bulbTick();smokeTick();
  AUR.forEach(function(a,i){a.m.map.offset.x+=dt*a.sp;a.m.opacity=a.o*(.75+.25*Math.sin(tm*.4+i*2))});
  cam(now,dt);auTick(dt);
  if(state=='race'&&plan){
    if(rt>=DUR&&!plan.win){plan.win=1;celebrate()}
    if(rt>plan.mx+1)state='done'}
  R.render(S,C)}

/* ================= Camera điện ảnh + TVC mở đầu 4 giây ================= */
function ease(u){u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)}
function mix(a,b,u){return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
/* Đường đi của camera (hàm thuần, dễ kiểm tra): trả [vị trí, điểm nhìn, zoom, độ mượt, rung] */
function camShot(st,t,n,hw,cx,zW,zc){
  var p,l,zt=1,k=6,sh=0,u,ph,rr,iP=[cx-3,8+hw*.8,hw*1.25+14],iL=[cx+4,.5,0];
  if(st=='intro'){
    k=1000;
    if(t<1.5){u=ease(t/1.5);p=mix([-26,21,hw+44],[22,9+hw*.3,hw+22],u);l=mix([22,1,-3],[34,1.2,0],u);zt=1.12-.12*u}            /* toàn cảnh: bay dọc đường đua, nhà gỗ, cây thông */
    else if(t<2.6){u=ease((t-1.5)/1.1);p=mix([22,9+hw*.3,hw+22],[3.6,3.9,zc+7.4],u);l=mix([34,1.2,0],[0,3.1,zc],u);zt=1-.12*u}   /* lao vào cọp giữa (thấy rõ hộp quà trên đầu) */
    else{u=ease((t-2.6)/1.4);p=mix([3.6,3.9,zc+7.4],iP,u);l=mix([0,3.1,zc],iL,u);zt=.88+.12*u}                                    /* lùi lại + chữ Merry Christmas */
  }else if(st=='race'||st=='done'){
    if(t<2.6){p=[cx-10,6+hw*.7,hw*1.5+13];l=[cx+3,.8,0];zt=1.04;k=2.2}                                                    /* xuất phát: chếch cao, thấy cả hàng cọp */
    else if(t<DUR-2.4){p=[cx-9,8+hw*.8,hw*1.25+14+Math.sin(tm*.5)*1.2];l=[cx-1,.5,0];k=1.8}                               /* chạy: nhìn từ trên chếch nhẹ, rõ vị trí từng quà */
    else if(t<DUR+.8){u=Math.min(1,(t-(DUR-2.4))/3.2);l=[56+u*10,.3,0];p=[l[0]-8,11+hw*.85,hw*1.15+14];zt=1-.05*ease(u);k=2.4;sh=.008+.03*u}   /* về đích: góc cao chếch, nhìn rõ ai dẫn đầu */
    else{u=t-DUR-.8;ph=Math.PI*(.3+.08*u);rr=8+hw*.2;p=[FIN-1+Math.cos(ph)*rr*1.2,6.2+Math.sin(u*.8)*.5+hw*.1,zW+Math.sin(ph)*rr];l=[FIN-1,3.2,zW];zt=.9;k=2.4}  /* người thắng: xoay quanh từ trên cao nhìn cọp + hộp quà */
  }else{p=[iP[0],iP[1]+Math.sin(tm*.7)*.12,iP[2]];l=iL;k=4}
  return [p,l,zt,k,sh]}
function cam(now,dt){
  var n=Math.max(1,LP.length),hw=n*LS/2,asp=fw&&fh?fw/fh:1.6,K=asp<1?1+(1-asp)*.7:1,
   zc=((LP.length>>1)-(n-1)/2)*LS,zW=plan?(plan.W-(n-1)/2)*LS:0,
   t=state=='intro'?(now-introT0)/1000:(plan?(now-plan.t0)/1000:0),
   r=camShot(state,t,n,hw,CAMX,zW,zc),p=r[0],l=r[1],zt=r[2],k=r[3],sh=r[4];
  baseFov=asp<1?58:40;
  p=[l[0]+(p[0]-l[0])*K,l[1]+(p[1]-l[1])*K,l[2]+(p[2]-l[2])*K];
  if(!camSet){CP.set(p[0],p[1],p[2]);CL.set(l[0],l[1],l[2]);zoom=zt;camSet=1}
  var f=1-Math.exp(-dt*k);
  CP.x+=(p[0]-CP.x)*f;CP.y+=(p[1]-CP.y)*f;CP.z+=(p[2]-CP.z)*f;
  CL.x+=(l[0]-CL.x)*f;CL.y+=(l[1]-CL.y)*f;CL.z+=(l[2]-CL.z)*f;
  zoom+=(zt-zoom)*(k>500?1:1-Math.exp(-dt*3));
  C.position.set(CP.x+Math.sin(tm*43)*sh,CP.y+Math.cos(tm*37)*sh,CP.z);C.lookAt(CL);
  var fv=baseFov*zoom;if(Math.abs(C.fov-fv)>.01){C.fov=fv;C.updateProjectionMatrix()}}

function el(cls,html){var e=document.createElement('div');e.className=cls;if(html)e.innerHTML=html;return e}
var TV=el('tvc'),BT=el('tvbar t'),BB=el('tvbar b'),VG=el('tvvg'),MC=el('mc'),SB=el('mcs','9 SẠCH · ĐUA CỌP TRÚNG QUÀ');
function mcBuild(){['Merry','Christmas'].forEach(function(w,r){var d=document.createElement('div');d.className='mcw';w.split('').forEach(function(ch,i){var s=document.createElement('span');s.textContent=ch;s.className='mcl';s.style.transitionDelay=(r*5+i)*50+'ms';d.appendChild(s)});MC.appendChild(d)})}
mcBuild();[VG,BT,BB,MC,SB].forEach(function(e){TV.appendChild(e)});
(document.querySelector('.stage')||document.body).appendChild(TV);
function hideTvc(){TV.style.display='none';BT.style.height=BB.style.height='0';MC.classList.remove('show');SB.classList.remove('show')}
function intro(tk){
  state='intro';introT0=performance.now();TV.style.display='block';setTimeout(function(){BT.style.height=BB.style.height='9%'},30);
  return new Promise(function(res){
    setTimeout(function(){if(tk!==cdTok)return;MC.classList.add('show');[659,784,988,1319].forEach(function(f,k){setTimeout(function(){beep(f,.5)},k*140)})},2600);
    setTimeout(function(){if(tk===cdTok)SB.classList.add('show')},3200);
    setTimeout(function(){hideTvc();if(tk===cdTok)state='warm';res()},4000)})}

/* ================= Bầu trời, cực quang, sao, đồi xa, hạt tuyết ================= */
function mkSky(){
  var dome=new TH.Mesh(new TH.SphereGeometry(420,24,16),new TH.MeshBasicMaterial({map:TX.sky,side:TH.BackSide,fog:false,depthWrite:false}));dome.position.set(50,0,0);dome.renderOrder=-10;S.add(dome);
  var N=420,a=new Float32Array(N*3),i,th,ph;
  for(i=0;i<N;i++){th=Math.random()*6.283;ph=.12+Math.random()*1.1;a[i*3]=50+Math.cos(th)*Math.cos(ph)*400;a[i*3+1]=Math.sin(ph)*400;a[i*3+2]=Math.sin(th)*Math.cos(ph)*400}
  var sg=new TH.BufferGeometry();sg.setAttribute('position',new TH.BufferAttribute(a,3));
  var st=new TH.Points(sg,new TH.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,transparent:true,opacity:.9,fog:false,depthWrite:false}));st.frustumCulled=false;S.add(st);
  [[TX.aurG,380,80,50,70,-200,.8,.006],[TX.aurM,300,60,-10,55,-215,.5,-.004]].forEach(function(q){
    var m=new TH.MeshBasicMaterial({map:q[0],transparent:true,opacity:q[6],blending:TH.AdditiveBlending,depthWrite:false,fog:false,side:TH.DoubleSide}),
     pl=new TH.Mesh(new TH.PlaneGeometry(q[1],q[2]),m);pl.position.set(q[3],q[4],q[5]);pl.rotation.z=.04;S.add(pl);AUR.push({m:m,o:q[6],sp:q[7]})});
  var moon=new TH.Mesh(GS,new TH.MeshBasicMaterial({color:0xfff4d0,fog:false}));moon.scale.set(7,7,7);moon.position.set(120,78,-230);S.add(moon);
  var mg=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowW,transparent:true,opacity:.7,depthWrite:false,blending:TH.AdditiveBlending,fog:false}));mg.scale.set(60,60,1);mg.position.copy(moon.position);S.add(mg)}
function decor(){
  MS=[new TH.Matrix4()];PC=[[],[]];
  [[-30,-110,55],[40,-118,70],[110,-108,52],[-90,-105,45],[170,-114,62],[225,-100,50]].forEach(function(h){var r=h[2];
    bp(GS,0xc6cbec,r,r*.5,r*.7,h[0],-r*.18,h[1],0,0,0,0);bp(GS,0xf7f8ff,r*.58,r*.17,r*.42,h[0],r*.25,h[1],0,0,0,0)});
  for(var i=0;i<70;i++){var x=-80+i*4.6+Math.random()*3,z=-80-Math.random()*24,s=4+Math.random()*3.5;
    bp(GK,0x1c3d52,s*.9,s*2.2,s*.9,x,s*1.1,z,0,0,0,0);bp(GK,0xe8eefc,s*.5,s*1.0,s*.5,x,s*1.55,z,0,0,0,0)}
  flush(S)}
function mkSnow(){var N=700,g=new TH.BufferGeometry(),a=new Float32Array(N*3),i;
  for(i=0;i<N;i++){a[i*3]=-30+Math.random()*170;a[i*3+1]=Math.random()*30;a[i*3+2]=-45+Math.random()*90}
  g.setAttribute('position',new TH.BufferAttribute(a,3));
  SNP=new TH.Points(g,new TH.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.9,depthWrite:false}));SNP.frustumCulled=false;S.add(SNP)}
function snowTick(dt){if(!SNP)return;var a=SNP.geometry.attributes.position,d=a.array,i,N=d.length/3;
  for(i=0;i<N;i++){d[i*3+1]-=dt*(1.5+(i%5)*.35);d[i*3]+=Math.sin(tm+i)*dt*.4;if(d[i*3+1]<0)d[i*3+1]=30}a.needsUpdate=true}
function mkPts(N,col,size,vc){
  var g=new TH.BufferGeometry(),a=new Float32Array(N*3),i,o;for(i=0;i<N;i++)a[i*3+1]=-60;
  g.setAttribute('position',new TH.BufferAttribute(a,3));
  o={a:a,v:new Float32Array(N*3),l:new Float32Array(N),n:N,k:0,g:g};
  if(vc){o.c=new Float32Array(N*3);g.setAttribute('color',new TH.BufferAttribute(o.c,3))}
  var m=new TH.Points(g,new TH.PointsMaterial({color:col,size:size,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc}));m.frustumCulled=false;S.add(m);return o}
function emit(o,x,y,z,vx,vy,vz,life,c){
  var i=o.k++%o.n;o.a[i*3]=x;o.a[i*3+1]=y;o.a[i*3+2]=z;o.v[i*3]=vx;o.v[i*3+1]=vy;o.v[i*3+2]=vz;o.l[i]=life;
  if(o.c&&c){o.c[i*3]=c.r;o.c[i*3+1]=c.g;o.c[i*3+2]=c.b;o.g.attributes.color.needsUpdate=true}}
function ptsTick(o,dt,gr){
  if(!o)return;var i,d=o.a;
  for(i=0;i<o.n;i++)if(o.l[i]>0){
    o.l[i]-=dt;d[i*3]+=o.v[i*3]*dt;d[i*3+1]+=o.v[i*3+1]*dt;d[i*3+2]+=o.v[i*3+2]*dt;o.v[i*3+1]-=gr*dt;
    if(o.l[i]<=0||d[i*3+1]<0){d[i*3+1]=-60;o.l[i]=0}}
  o.g.attributes.position.needsUpdate=true}
function smokeTick(){
  SMK.forEach(function(o){var t=(tm*.2+o.ph)%1;o.s.position.set(o.x+t*5,o.y+t*10,o.z+t*1.2);var sc=(1.2+t*5.5)*o.k;o.s.scale.set(sc,sc,1);o.s.material.opacity=Math.min(1,t*6)*(1-t)*.5})}

function celebrate(){
  [523,659,784,1047].forEach(function(f,k){setTimeout(function(){beep(f,.45)},k*170)});
  snow();auMode('win');
  var zW=(plan.W-(LP.length-1)/2)*LS,i;
  for(i=0;i<170;i++)emit(CNF,FIN,2.5,zW,(Math.random()-.5)*10,7+Math.random()*8,(Math.random()-.5)*10,2.6+Math.random()*1.4,CCOL[i%CCOL.length]);
  setTimeout(function(){fin(plan.r)},3400)}

function fin(r){
  $('rn').textContent=$('nm').value;$('rp').textContent=r.ten;
  var im=IM[r.ten];$('ri').hidden=!im;if(im)$('ri').src=im;
  $('rs').hidden=false}

/* ================= Luồng chơi (máy chủ quyết định quà trúng, game chỉ dàn cảnh) ================= */
function chk(){var ph=$('ph').value.replace(/[^0-9]/g,'');return !P.length?(unkNow()?'Đang tải quà của cửa hàng, vui lòng đợi vài giây rồi bấm lại':'Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác'):!$('nm').value.trim()?'Vui lòng nhập họ tên':!/^0[0-9]{9}$/.test(ph)?'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)':!$('hd').value.trim()?'Vui lòng nhập số hóa đơn':''}

function countdown(){
  var tok=++cdTok,el=$('cd');
  return new Promise(function(res){var k=3;(function step(){
    if(tok!==cdTok)return res();
    if(k>0){el.hidden=false;el.textContent=k;beep(440,.2);k--;setTimeout(step,800)}
    else{el.textContent='ĐUA!';beep(880,.4);auMode('race');setTimeout(function(){el.hidden=true;res()},500)}})()})}

function reset(msg){
  cdTok++;hideTvc();state='idle';busy=0;document.body.classList.remove('racing');auMode('idle');
  $('cd').hidden=true;$('sp').disabled=!LP.length;$('sp').textContent='🐯 ĐUA CỌP';$('er').textContent=msg||''}

function startRace(r){
  var wi=-1,i;LP.forEach(function(p,k){if(p.id==r.id)wi=k});
  if(wi<0){if(LP.length>=MAXL)LP[LP.length-1]={id:r.id,ten:r.ten};else LP.push({id:r.id,ten:r.ten});wi=LP.length-1;buildScene()}
  var f=[],c=[],ph=[],mx=DUR;
  for(i=0;i<LP.length;i++){
    if(i==wi)f.push(DUR);else{var g=DUR+.7+Math.random()*1.8;f.push(g);mx=Math.max(mx,g)}
    c.push(.22+Math.random()*.2);ph.push(Math.random()*6.283)}
  plan={W:wi,f:f,c:c,ph:ph,mx:mx,t0:performance.now(),r:r,win:0};
  state='race';$('info').textContent='';$('sp').textContent='🏁 Đang đua...'}

function go(){
  if(busy)return;var e=chk();$('er').textContent=e;if(e)return;
  busy=1;$('sp').disabled=true;$('sp').textContent='🎬 Đang vào cuộc đua...';plan=null;
  document.body.classList.add('racing');window.scrollTo(0,0);
  unlock();auMode('tvc');
  var tk=++cdTok,cd=intro(tk).then(function(){return tk===cdTok?countdown():0});
  api('spin',{store:ST,ten:$('nm').value,sdt:$('ph').value,hd:$('hd').value})
    .then(function(r){return cd.then(function(){return r})})
    .then(startRace)
    .catch(function(e){reset(e.message)})}

/* ================= Dữ liệu quà theo cửa hàng ================= */
function build(){
  if(busy)return;
  P=(D&&D.prizes[ST])||[];LP=P.slice(0,MAXL);buildScene();
  $('empty').hidden=!!LP.length||unkNow();$('sp').disabled=!LP.length;
  $('info').textContent=LP.length?'Có '+LP.length+' cọp – mỗi cọp đội 1 món quà':(unkNow()?'Đang tải quà của cửa hàng…':'')}
function unkNow(){return !!(D&&D.unk&&D.unk[ST])}
function lazy(){
  if(!unkNow())return;var s=ST;
  storePrizes(s).then(function(a){
    delete D.unk[s];D.prizes[s]=a;ls('pub2',JSON.stringify(D));
    $('st').dataset.k='';apply(D)
  }).catch(function(){
    if(ST===s)$('info').textContent='Chưa tải được quà, vui lòng chọn lại cửa hàng hoặc tải lại trang'})}

function apply(d){
  D=d;var c=d.cfg||{},pz=d.prizes=d.prizes||{};
  if(c.Logo){$('logo').src=c.Logo;$('logo').hidden=false}
  $('mn').textContent=money(c.MinTien);
  var has=function(s){return(pz[s]||[]).length>0||!!(d.unk&&d.unk[s])};
  var k=d.stores.map(function(x){return x+(has(x)?1:0)}).join('|');
  if($('st').dataset.k!=k){
    $('st').innerHTML=d.stores.map(function(x){return '<option value="'+esc(x)+'"'+(has(x)?'':' disabled')+'>'+esc(x)+(has(x)?'':' (hết quà)')+'</option>'}).join('');
    $('st').dataset.k=k}
  var want=ST||ls('st');
  ST=d.stores.indexOf(want)>=0&&has(want)?want:(d.stores.filter(has)[0]||d.stores[0]||'');
  $('st').value=ST;
  var im=d.imgs||{};for(var n in im)IM[n]=im[n];
  build();lazy()}

function init(){
  R=new TH.WebGLRenderer({canvas:$('cv'),antialias:true});
  R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,60,190);
  C=new TH.PerspectiveCamera(40,1.6,.1,900);
  GS=new TH.SphereGeometry(1,20,14);GL=new TH.SphereGeometry(1,8,6);GM=new TH.SphereGeometry(1,12,8);GB=new TH.BoxGeometry(1,1,1);
  GT=new TH.TorusGeometry(1,.1,8,22);GT2=new TH.TorusGeometry(1,.22,8,22);GC=new TH.CylinderGeometry(1,1,1,10);GK=new TH.ConeGeometry(1,1,10);GP=new TH.PlaneGeometry(1,1);
  var sh=new TH.Shape();sh.moveTo(-3,0);sh.lineTo(3,0);sh.lineTo(0,3.6*Math.tan(.62));sh.closePath();GTri=new TH.ShapeGeometry(sh);
  MST=[new TH.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0}),new TH.MeshBasicMaterial({vertexColors:true})];
  TX={glowY:glowTex('255,214,90'),glowO:glowTex('255,160,70'),glowW:glowTex('255,244,210'),smoke:smokeTex(),sky:skyTex(),aurG:aurTex(90,255,170),aurM:aurTex(200,110,255)};
  S.add(new TH.HemisphereLight(0xfff0e6,0xbccaff,1.02));
  var l=new TH.DirectionalLight(0xbfcdff,.75);l.position.set(-14,26,22);S.add(l);
  LT1=new TH.PointLight(0xff9a40,1.3,46,2);S.add(LT1);LT2=new TH.PointLight(0xffb060,1.1,40,2);S.add(LT2);
  world=new TH.Group();S.add(world);
  mkSky();decor();mkSnow();PUF=mkPts(180,0xffffff,.6,0);CNF=mkPts(200,0xffffff,.55,1)}

try{init()}catch(e){$('er').textContent='Thiết bị không hỗ trợ hiển thị 3D';return}
auInit();snow();if(window.__gate)window.dcEnter();
$('sp').onclick=go;
$('st').onchange=function(){ST=this.value;ls('st',ST);build();lazy()};
$('mute').onclick=function(){mute=!mute;this.textContent=mute?'🔇':'🔊';auMode(AU.mode)};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!busy)buildScene()});
try{var c0=ls('pub2');if(c0)apply(JSON.parse(c0))}catch(e){}
api('pub').then(function(d){ls('pub2',JSON.stringify(d));apply(d)}).catch(function(e){if(!D)$('er').textContent=e.message});
requestAnimationFrame(loop);
})();
