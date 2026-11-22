(function(){
'use strict';
var $=function(i){return document.getElementById(i)},TH=window.THREE;
if(!TH){var e0=$('er');if(e0)e0.textContent='Không tải được thư viện 3D, vui lòng tải lại trang';return}
var LS=2.7,DUR=16,MAXL=12,RI=14,TWO=Math.PI*2,TH0=Math.PI/2,TOTA=Math.PI*3,RM=26,TAIL=1.8,CAMA=Math.PI/2;
function lat(i,n){return(i-(n-1)/2)*LS}
function WL(th,x,y,z){var c=Math.cos(th),s=Math.sin(th),r=RM+z;return[c*r+s*x,y,s*r-c*x]}
function place(l,i,n,th){var r=RM+lat(i,n),o=l.ln;l.th=th;o.position.set(Math.cos(th)*r,0,Math.sin(th)*r);o.rotation.y=Math.PI/2-th}
var COLS=[0xd32f2f,0x1f8f55,0xe8a317,0xb71c1c,0x2e7d32,0x8e1b3a,0x0f6b4a,0xf4511e,0xc2185b,0x388e3c,0xe53935,0x00796b];
var BUL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a,0xff8ad8];
var HORIZON=0x5a56b4;
var D=null,P=[],LP=[],ST='',busy=0,mute=0,state='idle',plan=null,LN=[],IM={},CAMX=3,cdTok=0,fw=0,fh=0,tm=0,baseFov=40,zoom=1,
 R,S,C,world,GS,GL,GM,GB,GT,GT2,GC,GK,GP,GTri,MT={},MB={},TX={},MST=[],LT1,LT2,SNP=null,PUF=null,CNF=null,AUR=[],SMK=[],BI=null,BD=[],introT0=0,
 PC=[[],[]],MS=[new TH.Matrix4()],CP=new TH.Vector3(),CL=new TH.Vector3(),camSet=0,LOGOC=null,SHM=null,LGM=null,
 TMP=new TH.Matrix4(),QQ=new TH.Quaternion(),EU=new TH.Euler(),V1=new TH.Vector3(),V2=new TH.Vector3(),DM=new TH.Object3D(),
 CCOL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a,0xffffff,0xff8ad8].map(function(h){return new TH.Color(h)});

function ls(k,v){try{if(v===undefined)return localStorage.getItem('dc_'+k);localStorage.setItem('dc_'+k,v)}catch(e){}}
function ac(){var A=window.AC=window.AC||new (window.AudioContext||window.webkitAudioContext)();if(A.state=='suspended'){try{A.resume()}catch(e){}}return A}
function beep(f,d){if(mute)return;try{var A=ac(),o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.value=.1;g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}

/* ================= ÂM THANH: nhạc nền + nhạc đua (file mp3 để cùng thư mục với index.html) =================
   Sửa lỗi mất tiếng nhạc đua: (1) chỉ mở khóa âm thanh ở các sự kiện chạm THẬT (touchend/click/pointerup), không dùng pointerdown;
   (2) lúc bấm nút ĐUA CỌP (một lần chạm thật) cho nhạc đua bắt đầu chạy NGẦM (tắt tiếng) rồi mở tiếng khi chữ "ĐUA!" hiện,
   vì trình duyệt điện thoại chỉ cho phát tiếng ở phần tử đã được khởi động bằng thao tác chạm. */
var AU={bgm:null,race:null,unl:0,mode:'idle',hold:0};
function mkAu(src,vol,fb){var a=new Audio();a.preload='auto';a.loop=true;a.setAttribute('playsinline','');a._v=vol;a._t=0;a._c=0;a._bad=0;a._fb=fb||'';a._rt=0;a._src=src;a._r=0;
  a.addEventListener('error',function(){
    if(a._fb){var u=a._fb;a._fb='';a.src=u;try{a.load()}catch(e){}return}
    if(a._rt<4){a._rt++;setTimeout(function(){a.src=a._src+(a._src.indexOf('?')<0?'?':'&')+'r='+Date.now();try{a.load()}catch(e){}},1200*a._rt)}else a._bad=1});
  a.src=src;try{a.volume=0}catch(e){}return a}
function auPlay(a){var p;try{p=a.play()}catch(e){}if(p&&p.catch)p.catch(function(){})}
function auSet(a,t,rs){
  if(!a)return;var was=a._t;a._t=t;
  if(t>0&&!mute&&AU.unl&&!a._bad){
    if(rs&&was<=0){try{a.currentTime=0}catch(e){}}
    a.muted=false;
    if(a.paused)auPlay(a)}}
function auMode(m){AU.mode=m;auSet(AU.bgm,m=='race'?0:1,0);auSet(AU.race,m=='race'?1:0,1)}
function auTick(dt){[AU.bgm,AU.race].forEach(function(a){
  if(!a)return;var tg=mute?0:a._t*a._v,st=dt*1.1;
  /* tự phát lại nếu cần phát mà đang dừng (play bị từ chối / file tải chậm) */
  if(a._t>0&&!mute&&AU.unl&&!a._bad&&a.paused&&((a._r-=dt)<=0)){a._r=.5;auSet(a,a._t,0)}
  a._c+=Math.max(-st,Math.min(st,tg-a._c));
  try{a.volume=Math.max(0,Math.min(1,a._c))}catch(e){}
  if(a._c<.004&&tg===0&&!a.paused){if(a===AU.race&&AU.hold)a.muted=true;else a.pause()}})}
/* mở khóa âm thanh trong một lần chạm thật */
function unlock(){
  if(AU.unl)return;AU.unl=1;try{ac()}catch(e){}
  var r=AU.race;
  if(r&&!r._bad){r.muted=true;var p;try{p=r.play()}catch(e){}
    if(p&&p.then)p.then(function(){if(!AU.hold){r.pause();try{r.currentTime=0}catch(e){}}}).catch(function(){})}
  auMode(AU.mode)}
/* gọi ngay trong lần chạm vào nút ĐUA CỌP: cho nhạc đua chạy ngầm (tắt tiếng) để sau đó mở tiếng được */
function primeRace(){
  AU.hold=1;var r=AU.race;
  if(r&&!r._bad){r.muted=true;if(r.paused)auPlay(r)}}
function onGesture(){if(!AU.unl)unlock();else auMode(AU.mode);try{ac()}catch(e){}}
function auInit(){
  AU.bgm=mkAu('nhac-nen.mp3?v=6',.5,'https://tp9sach-ops.github.io/vongquay/nhac-nen.mp3');AU.race=mkAu('alex-morgan-car-car-music-545487.mp3?v=6',.8);
  ['touchend','click','pointerup','keydown'].forEach(function(ev){document.addEventListener(ev,onGesture,{passive:true})});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){[AU.bgm,AU.race].forEach(function(a){if(a&&!a.paused)a.pause()})}else if(AU.unl)auMode(AU.mode)});
  window.dcEnter=function(){if(AU.unl)auMode(AU.mode);else unlock()}}

/* ================= helper 3D (vật động: cọp, hộp quà, nhãn) ================= */
function mat(c){return MT[c]||(MT[c]=new TH.MeshStandardMaterial({color:c,roughness:.42,emissive:c,emissiveIntensity:.15}))}
function mb(c){return MB[c]||(MB[c]=new TH.MeshBasicMaterial({color:c}))}
function mesh(p,g,c,sx,sy,sz,x,y,z){var m=new TH.Mesh(g,mat(c));m.scale.set(sx,sy,sz);m.position.set(x,y,z);p.add(m);return m}
function ball(p,c,sx,sy,sz,x,y,z){return mesh(p,GS,c,sx,sy,sz,x,y,z)}
function grp(p,x,y,z){var g=new TH.Group();g.position.set(x,y,z);p.add(g);return g}
function two(s){s=String(s);if(s.length<=14)return[s];var m=s.length>>1,b=-1,i;for(i=0;i<s.length;i++)if(s[i]==' '&&(b<0||Math.abs(i-m)<Math.abs(b-m)))b=i;return b<0?[s.slice(0,14),s.slice(14,28)]:[s.slice(0,b),s.slice(b+1)]}
function label(txt,col,w,h){
  var c=document.createElement('canvas');c.width=320;c.height=110;
  var x=c.getContext('2d'),r=22,W=320,H=110;
  var gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#145a41');gr.addColorStop(1,'#06261b');x.fillStyle=gr;x.strokeStyle='#ffd05a';x.lineWidth=8;
  x.beginPath();x.moveTo(r,5);x.arcTo(W-5,5,W-5,H-5,r);x.arcTo(W-5,H-5,5,H-5,r);x.arcTo(5,H-5,5,5,r);x.arcTo(5,5,W-5,5,r);x.closePath();x.fill();x.stroke();
  x.fillStyle='#fff3c4';x.shadowColor='#000a';x.shadowBlur=4;x.font='bold 46px "Baloo 2",sans-serif';x.textAlign='center';x.textBaseline='middle';
  var L=two(txt);L.forEach(function(l,j){x.fillText(l.slice(0,16),W/2,H/2+(j-(L.length-1)/2)*48,W-36)});
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
function shadowTex(){var c=cv2(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(20,10,50,.62)');g.addColorStop(.6,'rgba(20,10,50,.28)');g.addColorStop(1,'rgba(20,10,50,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new TH.CanvasTexture(c)}
function skyTex(){var c=cv2(8,512),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#070d3a');g.addColorStop(.22,'#17237a');g.addColorStop(.38,'#3d3a98');g.addColorStop(.47,'#4b49a6');g.addColorStop(.5,'#5a56b4');g.addColorStop(1,'#5a56b4');
  x.fillStyle=g;x.fillRect(0,0,8,512);return new TH.CanvasTexture(c)}
function aurTex(r,g,b){var c=cv2(256,128),x=c.getContext('2d'),i,a,gr;
  for(i=0;i<256;i++){a=.4+.35*Math.sin(i/256*6.283*3+1)+.25*Math.sin(i/256*6.283*7);a=Math.max(.06,Math.min(1,a));
    gr=x.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba('+r+','+g+','+b+',0)');gr.addColorStop(.55,'rgba('+r+','+g+','+b+','+(a*.85)+')');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
    x.fillStyle=gr;x.fillRect(i,0,1,128)}
  var t=new TH.CanvasTexture(c);t.wrapS=TH.RepeatWrapping;return t}
/* huy hiệu tròn "9 SẠCH" in trên áo cọp (vẽ lại khi font tải xong) */
var L9=new Image();L9.onload=function(){try{drawLogo();if(!busy)buildScene()}catch(e){}};L9.src=window.L9URL||'logo-9sach.png?v=2';
function drawLogo9(x){if(!L9.complete||!L9.naturalWidth)throw 0;x.drawImage(L9,0,0,256,256)}
function drawLogo(){
  if(!LOGOC)return;var x=LOGOC.getContext('2d');x.clearRect(0,0,256,256);try{drawLogo9(x);if(TX.logo)TX.logo.needsUpdate=true;return}catch(e){x.setTransform(2,0,0,2,0,0)}
  x.fillStyle='#ffc72c';x.beginPath();x.arc(64,64,60,0,6.283);x.fill();
  x.lineWidth=8;x.strokeStyle='#e8a317';x.stroke();
  x.fillStyle='#7a2b0a';x.textAlign='center';x.textBaseline='middle';
  x.font='800 58px "Baloo 2",sans-serif';x.fillText('9',64,50);
  x.fillStyle='#c4122f';x.font='800 27px "Baloo 2",sans-serif';x.fillText('SẠCH',64,90);
  if(TX.logo)TX.logo.needsUpdate=true}
function logoTex(){LOGOC=cv2(256,256);TX.logo=new TH.CanvasTexture(LOGOC);drawLogo();return TX.logo}

/* ================= Cọp con vàng (chibi) theo mascot 9 Sạch: đầu tròn to, tai tròn viền nâu lòng hồng, mắt to nâu có điểm sáng,
   má hồng, mõm trắng, mũi nâu, miệng nhỏ, 3 sọc trán, áo kem có huy hiệu 9 SẠCH, mũ ông già Noel đội lệch ================= */
function tiger(col){var _r=window.TR&&TR.ready&&TR.make(TH,col);if(_r)return _r;
  var YL=0xf9cb1c,WH=0xfffaf0,BK=0x1b1410,PK=0xf2909f,BL=0xf49aa6,GR=0x2e8b2a,BT=0xffd23a;
  var g=new TH.Group(),b=grp(g,0,.12,0),u=grp(b,0,-.12,0),h=grp(u,0,2.3,0),o={g:g,b:b,h:h,al:[],ll:[],top:.58,bx:-.4},s,i;
  h.userData.sep=1;
  function sb(p,c,sx,sy,sz,x,y,z){return mesh(p,GM,c,sx,sy,sz,x,y,z)}
  /* điểm trên mặt hộp sọ (bán kính .88/.8/.94, tâm y=.08): dùng để dán sọc, tóc đúng bề mặt */
  function sk(y,z,sg){var q=1-Math.pow((y-.08)/.8,2)-Math.pow(z/.94,2);return sg*.88*Math.sqrt(Math.max(0,q))}
  function lock(pts,r0,r1){var cu=new TH.CatmullRomCurve3(pts.map(function(p){return new TH.Vector3(p[0],p[1],p[2])})).getPoints(14),k,r;
    for(k=0;k<cu.length;k++){r=r0+(r1-r0)*k/(cu.length-1);sb(h,BK,r,r*1.05,r,cu[k].x,cu[k].y,cu[k].z)}}
  /* THÂN: áo vàng + yếm xanh lá + huy hiệu 9 SẠCH */
  ball(u,YL,.38,.36,.48,0,1.5,0);
  ball(u,GR,.48,.62,.54,0,1.0,0);ball(u,GR,.5,.28,.56,0,.68,0);
  var lg=new TH.Mesh(GP,LGM);lg.scale.set(.38,.38,1);lg.position.set(.49,1.1,0);lg.rotation.y=Math.PI/2;u.add(lg);
  [-1,1].forEach(function(s){sb(u,GR,.07,.28,.07,.3,1.52,s*.26);sb(u,BT,.05,.05,.05,.37,1.36,s*.26)});
  /* TAY dang ra: tay áo vàng sọc đen, găng trắng */
  [-1,1].forEach(function(s){var ar=grp(u,0,1.44,s*.46);ar.userData.sep=1;
    ball(ar,YL,.16,.3,.16,0,-.25,0);
    [-.3,-.42].forEach(function(y){mesh(ar,GT2,BK,.14,.14,.12,0,y,0).rotation.x=Math.PI/2});
    ball(ar,WH,.18,.17,.15,0,-.64,0);sb(ar,WH,.07,.1,.07,.12,-.58,0);
    o.al.push(ar)});
  /* CHÂN: ống chân vàng sọc đen, giày trắng */
  [-1,1].forEach(function(s){var lg2=grp(u,0,.52,s*.22);lg2.userData.sep=1;
    ball(lg2,GR,.22,.16,.24,0,-.02,0);
    sb(lg2,YL,.14,.2,.14,0,-.2,0);
    [-.19,-.3].forEach(function(y){mesh(lg2,GT2,BK,.145,.145,.14,0,y,0).rotation.x=Math.PI/2});
    ball(lg2,WH,.32,.13,.23,.1,-.38,0);
    o.ll.push(lg2)});
  /* ĐUÔI: vàng khoang đen, vòng ra sau rồi cuộn lên, chóp đen */
  var tb=[-.4,.7,-.05];o.t=grp(u,tb[0],tb[1],tb[2]);o.t.userData.sep=1;
  var tc=new TH.CatmullRomCurve3([[-.4,.7,-.05],[-.72,.62,-.4],[-.92,.72,-.85],[-.85,1.05,-1.15],[-.6,1.28,-1.1],[-.42,1.18,-.9],[-.5,1.02,-.78]].map(function(p){return new TH.Vector3(p[0],p[1],p[2])})).getPoints(17);
  for(i=0;i<tc.length;i++){var tr=.15-.045*i/17;sb(o.t,(i>=15||Math.floor(i/3)%2)?BK:YL,tr,tr,tr,tc[i].x-tb[0],tc[i].y-tb[1],tc[i].z-tb[2])}
  /* ĐẦU: đỉnh vàng, nửa dưới trắng */
  ball(h,YL,.88,.8,.94,0,.08,0);
  ball(h,WH,.7,.5,.64,.2,-.34,0);
  ball(h,WH,.3,.34,.2,.62,-.12,0);
  sb(h,PK,.07,.05,.09,.88,-.3,0);
  sb(h,0x7a2236,.06,.07,.14,.82,-.49,0);sb(h,0xff8aa0,.05,.05,.1,.86,-.54,0);
  [-1,1].forEach(function(s){
    ball(h,0x2a1610,.16,.27,.23,.7,-.09,s*.37);ball(h,0x0d0d0d,.15,.24,.2,.72,-.09,s*.37);
    sb(h,0xffffff,.05,.075,.075,.845,.02,s*.37+.06);sb(h,0xffffff,.03,.04,.04,.845,-.2,s*.37-.07);
    sb(h,BK,.04,.03,.14,.8,.22,s*.38);
    sb(h,BL,.04,.1,.14,.68,-.46,s*.47);
    /* 3 sọc má dán trên mặt sọ */
    [[.16,.0],[.0,.04],[-.16,.1]].forEach(function(q){var zz=Math.sqrt(Math.max(0,1-Math.pow((q[0]-.08)/.8,2)-Math.pow(q[1]/.88,2)))*.94;
      var st=sb(h,BK,.3,.04,.075,q[1]-.02,q[0],s*zz*.99);st.rotation.z=q[0]*.5});
    /* tai tròn: viền vàng sọc đen, lòng hồng lớn */
    var er=grp(h,-.08,.64,s*.74);er.rotation.x=s*.3;er.rotation.y=-s*.45;
    ball(er,YL,.15,.38,.38,0,0,0);ball(er,PK,.1,.27,.27,.09,0,0);
    [-.9,-.4,.1,.6].forEach(function(a){sb(er,BK,.07,.05,.13,0,.33*Math.cos(a),.33*Math.sin(a)).rotation.x=-a})});
  /* sọc lưng đầu: 3 thanh ngang + các sọc dọc trên đỉnh sau */
  [[.12,.62],[-.08,.56],[-.28,.46]].forEach(function(q){sb(h,BK,.05,.05,q[1],sk(q[0],0,-1)-.005,q[0],0)});
  [-.4,-.2,0,.2,.4].forEach(function(z,k){var y=.58-Math.abs(z)*.2;sb(h,BK,.05,.17,.05,sk(y,z,-1),y,z)});
  /* TÓC: nhúm đen vuốt cong, bám vào đỉnh đầu */
  ball(h,BK,.2,.12,.26,.14,.84,0);
  lock([[.16,.82,0],[.1,.98,-.06],[.02,1.1,-.18],[-.1,1.12,-.36]],.17,.05);
  lock([[.2,.82,.08],[.22,.97,.16],[.14,1.07,.28],[.0,1.08,.4]],.15,.05);
  lock([[.08,.84,-.02],[-.05,1.0,.0],[-.2,1.04,.1]],.14,.05);
  lock([[.3,.8,0],[.4,.9,-.06],[.44,.96,-.18]],.1,.04);
  /* gộp mesh cùng vật liệu theo từng bộ phận để giảm draw call */
  function merge(gr){var list=[],bk={},inv,k;
    gr.updateMatrixWorld(true);inv=new TH.Matrix4().copy(gr.matrixWorld).invert();
    (function col(n){n.children.forEach(function(c){if(c.isMesh&&c.material&&c.material.isMeshStandardMaterial)list.push(c);else if(c.isGroup&&!c.userData.sep)col(c)})})(gr);
    list.forEach(function(m){var id=m.material.uuid;(bk[id]=bk[id]||{m:m.material,a:[]}).a.push(m)});
    for(k in bk){var B=bk[k],np=0,ni=0,o1=0,oi=0;B.a.forEach(function(m){np+=m.geometry.attributes.position.count;ni+=m.geometry.index.count});
      var pos=new Float32Array(np*3),nor=new Float32Array(np*3),idx=new Uint32Array(ni),v=new TH.Vector3(),nm=new TH.Matrix3(),M=new TH.Matrix4(),a,n,j;
      B.a.forEach(function(m){M.multiplyMatrices(inv,m.matrixWorld);nm.getNormalMatrix(M);a=m.geometry.attributes;n=a.position.count;
        for(j=0;j<n;j++){v.fromBufferAttribute(a.position,j).applyMatrix4(M);pos[(o1+j)*3]=v.x;pos[(o1+j)*3+1]=v.y;pos[(o1+j)*3+2]=v.z;
          v.fromBufferAttribute(a.normal,j).applyMatrix3(nm).normalize();nor[(o1+j)*3]=v.x;nor[(o1+j)*3+1]=v.y;nor[(o1+j)*3+2]=v.z}
        for(j=0;j<m.geometry.index.count;j++)idx[oi+j]=m.geometry.index.array[j]+o1;
        o1+=n;oi+=m.geometry.index.count;m.parent.remove(m)});
      var G=new TH.BufferGeometry();G.setAttribute('position',new TH.BufferAttribute(pos,3));G.setAttribute('normal',new TH.BufferAttribute(nor,3));G.setIndex(new TH.BufferAttribute(idx,1));
      var MM=new TH.Mesh(G,B.m);MM.userData.own=1;gr.add(MM)}}
  merge(h);o.ll.forEach(merge);o.al.forEach(merge);merge(o.t);merge(u);
  return o}
function tigerOld(col){
  var YL=0xffd21f,WH=0xfffaf0,BR=0x6b3a1a,PK=0xff9bb0,EY=0x4a2410,SR=0xd8132f;
  var g=new TH.Group(),b=grp(g,0,.12,0),h=grp(b,0,2.2,0),o={g:g,b:b,h:h,al:[],ll:[]};
  ball(b,YL,.5,.62,.52,0,.95,0);ball(b,WH,.3,.46,.38,.3,.86,0);
  [.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BR,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});
  /* huy hiệu 9 SẠCH trên bụng áo */
  var lg=new TH.Mesh(GP,LGM);lg.scale.set(.5,.5,1);lg.position.set(.605,.86,0);lg.rotation.y=Math.PI/2;b.add(lg);
  /* khăn quàng theo màu từng cọp */
  mesh(b,GT2,col,.43,.43,.9,0,1.4,0).rotation.x=Math.PI/2;ball(b,0xffd54a,.11,.11,.11,.42,1.2,0);
  /* đầu tròn to */
  ball(h,YL,1.1,.98,1.0,0,0,0);
  ball(h,WH,.46,.36,.52,.8,-.3,0);                         /* mõm trắng */
  ball(h,0x5a2d1a,.13,.09,.16,1.17,-.12,0);                /* mũi nâu */
  ball(h,0x7a2236,.1,.07,.19,1.12,-.4,0);ball(h,PK,.07,.04,.11,1.19,-.45,0); /* miệng nhỏ + lưỡi hồng */
  [-1,1].forEach(function(s){
    ball(h,EY,.15,.22,.16,.97,.1,s*.37);ball(h,0x111111,.09,.14,.1,1.05,.1,s*.37);
    ball(h,0xffffff,.065,.085,.065,1.08,.19,s*.34);ball(h,0xffffff,.035,.035,.035,1.09,.02,s*.41);   /* mắt to có điểm sáng */
    ball(h,PK,.06,.11,.15,.9,-.2,s*.63);                   /* má hồng */
    ball(h,BR,.06,.04,.05,.9,.5,s*.22);                    /* lông mày */
    ball(h,BR,.14,.42,.42,-.05,.8,s*.78);ball(h,YL,.15,.35,.35,0,.8,s*.78);ball(h,PK,.16,.23,.23,.05,.8,s*.78); /* tai tròn: viền nâu, vàng, hồng */
    [.25,.04,-.17].forEach(function(y){var x=-.2,z=Math.sqrt(Math.max(0,1-Math.pow(y/.98,2)-Math.pow(x/1.1,2)));ball(h,BR,.36,.05,.12,x,y,s*(z-.01))});  /* sọc má */
    [0,1].forEach(function(j){mesh(h,GB,BR,.5,.012,.012,1.18,-.3+j*.07,s*.4).rotation.y=-s*.5});
    var ar=grp(b,.1,1.28,s*.52);ball(ar,YL,.17,.32,.17,0,-.26,0);ball(ar,WH,.15,.15,.15,0,-.52,0);ball(ar,PK,.09,.09,.06,.1,-.54,0);ar.rotation.x=-s*2.2;o.al.push(ar);
    var lg2=grp(b,0,.42,s*.25);ball(lg2,YL,.2,.32,.2,0,-.12,0);ball(lg2,WH,.28,.1,.2,.09,-.4,0);o.ll.push(lg2)});
  /* sọc trán */
  [-.45,-.15,.15].forEach(function(x){ball(h,BR,.07,.03,.2,x,.98*Math.sqrt(1-Math.pow(x/1.1,2))-.005,0)});
  /* mũ ông già Noel: vành lông trắng, thân đỏ rủ ra sau, bông tròn ở chóp */
  var hat=grp(h,-.1,.66,0);hat.rotation.z=-.16;
  mesh(hat,GT2,0xffffff,.93,.93,.8,0,0,0).rotation.x=Math.PI/2;
  var ca=grp(hat,0,.04,0);ca.rotation.z=.62;
  mesh(ca,GK,SR,.86,1.5,.86,0,.72,0);ball(ca,0xffffff,.2,.2,.2,0,1.5,0);
  o.t=grp(b,-.42,.62,0);for(var i=0;i<5;i++)ball(o.t,i%2?BR:(i==4?WH:YL),.1,.1,.1,-.1*i,.03*i*i,0);
  return o}

/* ================= Làn đua: mỗi cọp đội 1 hộp quà trên đầu ================= */
var BXC=[0xd32f2f,0x1f8f55,0x2f6fd8,0xe8a317,0x8e1b3a,0x0f8f8f,0x8e24aa];
function lane(i,n,p){
  var z=(i-(n-1)/2)*LS,ln=grp(world,0,0,z),col=COLS[i%COLS.length],tg=tiger(col);
  var sh=new TH.Mesh(GP,SHM);sh.rotation.x=-Math.PI/2;sh.scale.set(2.9,1.9,1);sh.position.set(0,.1,0);ln.add(sh);
  tg.g.scale.setScalar(tg.rig?1.1:1.18);ln.add(tg.g);
  var BX=BXC[i%BXC.length],RB=BX==0xe8a317?0xffffff:0xffd54a,gb=grp(tg.h,tg.bx,tg.top,0);
  mesh(gb,GB,BX,1.0,.9,.84,0,.45,0);mesh(gb,GB,BX,1.12,.2,.96,0,.98,0);
  mesh(gb,GB,RB,1.04,.94,.16,0,.45,0);mesh(gb,GB,RB,.16,.94,.88,0,.45,0);
  mesh(gb,GB,RB,1.16,.24,.16,0,.98,0);mesh(gb,GB,RB,.16,.24,1.0,0,.98,0);
  ball(gb,RB,.3,.2,.16,0,1.22,.2);ball(gb,RB,.3,.2,.16,0,1.22,-.2);ball(gb,RB,.14,.14,.14,0,1.2,0);
  gb.scale.setScalar(tg.rig?1.05:.85);
  var gl=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowY,transparent:true,opacity:.5,depthWrite:false,blending:TH.AdditiveBlending}));gl.scale.set(3.4,3.4,1);gl.position.set(0,.7,0);gb.add(gl);
  var sp=label(p.ten,col,2.9,1);sp.center.set(.5,0);sp.position.set(0,6.1+(i%3)*.9,0);sp.renderOrder=10+i;ln.add(sp);
  return {ln:ln,tg:tg,gb:gb,gl:gl,sp:sp,ph:Math.random()*6}}

/* ================= Cây thông, nhà gỗ, quà, người tuyết (đều gộp batch) ================= */
var TIERS=[[2.1,2.3,1.9,0x0f5a3a],[1.8,2.2,3.2,0x146b45],[1.45,2.0,4.4,0x1b7d4d],[1.05,1.8,5.5,0x239457]];
var ORN=[0xd8132f,0xffd54a,0x2f6fd8,0xffffff];
function btree(x,z,s,full,glow){
  bpush(x,0,z,s,0);
  bc(0x5d3a1a,.5,1.2,.5,0,.6,0);
  TIERS.forEach(function(q,k){
    var r=q[0],h=q[1],y=q[2],ch=h*.5,j,a;
    bk(q[3],r,h,r,0,y,0);bk(0xf4f7ff,r*.52,ch,r*.52,0,y+h/2-ch/2+.02,0);
    if(full)for(j=0;j<3;j++){a=k*2.1+j*2.1+x*.7;bulbI(Math.cos(a)*r*.76,y-h/2+h*.3,Math.sin(a)*r*.76,.17,BUL[(k+j)%BUL.length]);
      /* bóng trang trí */
      var a2=a+1.05;bs(ORN[(k+j)%ORN.length],.15,.15,.15,Math.cos(a2)*r*.7,y-h/2+h*.22,Math.sin(a2)*r*.7)}});
  bulbI(0,6.55,0,.4,0xffd54a);
  bs(0xfff2a0,.34,.34,.34,0,6.85,0);bp(GK,0xffd54a,.2,.55,.2,0,7.2,0,0,0,0,1);
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
function bcabin(x,z,s,ry,ns){
  bpush(x,0,z,s,ry||0);
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
  if(!ns)for(i=0;i<8;i++){
    var sp=new TH.Sprite(new TH.SpriteMaterial({map:TX.smoke,transparent:true,opacity:0,depthWrite:false}));
    world.add(sp);SMK.push({s:sp,x:sm.x,y:sm.y,z:sm.z,ph:i/8,k:k})}
  bpop()}
function bsnowmound(x,z){bs(0xffffff,1.5,.6,1.1,x,.25,z)}

/* ================= Đường đua TRÒN ================= */
function trackMesh(n,Ro,thS,thF){
  var Sz=2048,c=cv2(Sz,Sz),x=c.getContext('2d'),u=Sz/2/Ro,cx=Sz/2,i,j,g,a,r;
  for(i=0;i<n;i++){
    var r0=(RI+i*LS)*u,r1=(RI+(i+1)*LS)*u,cc=i%2?['#b3dbf3','#d4edfb']:['#97c8e8','#bde2f6'];
    g=x.createRadialGradient(cx,cx,r0,cx,cx,r1);g.addColorStop(0,cc[0]);g.addColorStop(.5,cc[1]);g.addColorStop(1,cc[0]);
    x.fillStyle=g;x.beginPath();x.arc(cx,cx,r1,0,TWO);x.arc(cx,cx,r0,0,TWO,true);x.fill()}
  x.lineCap='round';
  for(i=0;i<650;i++){r=(RI+Math.random()*(Ro-RI))*u;a=Math.random()*TWO;x.strokeStyle='rgba(255,255,255,'+(.15+Math.random()*.3)+')';x.lineWidth=1+Math.random()*1.6;x.beginPath();x.arc(cx,cx,r,a,a+.03+Math.random()*.16);x.stroke()}
  for(i=0;i<900;i++){a=Math.random()*TWO;r=(RI+Math.random()*(Ro-RI))*u;x.fillStyle='rgba(255,255,255,'+(.2+Math.random()*.5)+')';x.fillRect(cx+Math.cos(a)*r,cx+Math.sin(a)*r,1+Math.random()*2,1+Math.random()*2)}
  x.strokeStyle='#ffffff';x.lineWidth=Math.max(3,.13*u);
  for(j=1;j<n;j++){x.beginPath();x.arc(cx,cx,(RI+j*LS)*u,0,TWO);x.stroke()}
  [RI,Ro].forEach(function(rr){var rp=rr*u,seg=Math.round(TWO*rr/1.6),L=TWO*rp/seg;
    x.lineWidth=.45*u;x.strokeStyle='#fff';x.beginPath();x.arc(cx,cx,rp,0,TWO);x.stroke();
    x.setLineDash([L,L]);x.strokeStyle='#d8132f';x.beginPath();x.arc(cx,cx,rp,0,TWO);x.stroke();x.setLineDash([])});
  function lineAt(th,chk,w){x.save();x.translate(cx,cx);x.rotate(th);var sq=.55*u,k,m;
    if(chk){for(k=0;k<Math.ceil((Ro-RI)/.55);k++)for(m=0;m<2;m++){x.fillStyle=(k+m)%2?'#111':'#fff';x.fillRect(RI*u+k*sq,(m-1)*sq,sq,sq)}}
    else{x.fillStyle='#fff';x.fillRect(RI*u,-w*u/2,(Ro-RI)*u,w*u)}x.restore()}
  lineAt(thS,0,.5);lineAt(thF,1,1.1);
  var t=new TH.CanvasTexture(c);try{t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy())}catch(e){}
  var m=new TH.Mesh(GP,new TH.MeshStandardMaterial({map:t,roughness:.32,metalness:.1,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.28,alphaTest:.4}));
  m.rotation.x=-Math.PI/2;m.scale.set(Ro*2,Ro*2,1);m.position.set(0,.05,0);m.userData.trk=1;world.add(m)}
function ringBar(r){var N=Math.max(24,Math.round(TWO*r/2.2)),L=TWO*r/N*1.03,i,a;
  for(i=0;i<N;i++){a=(i+.5)*TWO/N;bb(i%2?0xffffff:0xd8132f,L,.55,.5,Math.cos(a)*r,.28,Math.sin(a)*r,0,-a-Math.PI/2,0)}}
function ringPosts(r){var np=Math.max(8,Math.round(TWO*r/6.5)),k,m,a,a2,px,pz,f;
  for(k=0;k<np;k++){a=k*TWO/np;px=Math.cos(a)*r;pz=Math.sin(a)*r;
    for(m=0;m<5;m++)bc(m%2?0xffffff:0xd8132f,.11,.36,.11,px,.18+m*.36,pz);
    bs(0xd8132f,.2,.2,.2,px,1.88,pz);
    for(m=1;m<5;m++){f=m/5;a2=a+f*TWO/np;bulbI(Math.cos(a2)*r,1.75-.6*Math.sin(Math.PI*f),Math.sin(a2)*r,.13,BUL[(k+m)%BUL.length])}}}
function blamp(x,z,s){
  bpush(x,0,z,s,0);
  bc(0x2b2538,.12,3.4,.12,0,1.7,0);bc(0x2b2538,.28,.2,.28,0,.1,0);
  bp(GL,0xffe08a,.34,.42,.34,0,3.6,0,0,0,0,1);bb(0x2b2538,.5,.1,.5,0,3.95,0);
  glowS(TX.glowO,4.2,4.2,0,3.6,0,.65);
  bpop()}

/* ================= Dựng cảnh quanh vòng đua ================= */
function gateAt(th,W){
  var p=WL(th,0,0,0),k;
  bpush(p[0],0,p[2],1,Math.PI/2-th);
  [-1,1].forEach(function(q){
    for(k=0;k<7;k++)bc(k%2?0xffffff:0xd8132f,.34,.75,.34,0,.375+k*.75,q*(W/2+.4));
    bs(0xffd54a,.5,.5,.5,0,5.5,q*(W/2+.4))});
  bb(0xd8132f,.35,1,W+1.2,0,5.4,0);bb(0xffd54a,.4,.16,W+1.3,0,4.85,0);
  for(k=0;k<=12;k++)bulbI(.3,4.6-Math.sin(k/12*Math.PI)*.4,-W/2-.4+k*(W+.8)/12,.15,BUL[k%BUL.length]);
  bpop()}
function buildScene(){
  while(world.children.length){var c=world.children[0];world.remove(c);c.traverse(function(o){
    if(o.userData&&o.userData.own&&o.geometry)o.geometry.dispose();
    if(o.userData&&o.userData.trk){if(o.material.map)o.material.map.dispose();o.material.dispose()}
    if(o.isSprite&&o.material&&o.material.map&&o.material.map!==TX.glowY&&o.material.map!==TX.glowO&&o.material.map!==TX.smoke&&o.material.map!==TX.logo)o.material.map.dispose()})}
  LN=[];SMK=[];BD=[];BI=null;PC=[[],[]];MS=[new TH.Matrix4()];
  var n=LP.length;if(!n)return;
  var W=n*LS,Ro=RI+W,i,j,k,a,r,px,pz;
  RM=RI+W/2;
  var thS=TH0-3.1/RM,thF=TH0-TOTA-1.2/RM;
  LT1.position.set(0,14,0);var fp=WL(thF,0,6,0);LT2.position.set(fp[0],6,fp[2]);
  bb(0xa3b5e4,900,.2,900,0,-.1,0);
  for(i=0;i<60;i++){a=Math.random()*TWO;r=Ro+10+Math.random()*60;var rr=1.5+Math.random()*3;bm(0xf8faff,rr*1.8,rr*.35,rr*1.2,Math.cos(a)*r,0,Math.sin(a)*r)}
  trackMesh(n,Ro,thS,thF);
  ringBar(RI);ringBar(Ro);ringPosts(RI-.3);ringPosts(Ro+.3);
  gateAt(thS,W);gateAt(thF,W);
  bc(0xeef3ff,RI-.5,.3,RI-.5,0,.1,0);
  btree(0,0,3.1,true,true);groundGlow(0,0,RI*2.4,RI*2.4,.5);
  for(k=0;k<6;k++){a=k*TWO/6+.3;bcabin(Math.cos(a)*10.3,Math.sin(a)*10.3,.34,Math.atan2(Math.cos(a),Math.sin(a)),1)}
  for(k=0;k<44;k++){a=k*2.399;r=4.6+((k*37)%50)/50*5;px=Math.cos(a)*r;pz=Math.sin(a)*r;
    bc([0xd32f2f,0x1f8f55,0x2f6fd8,0xe8a317,0x8e24aa,0x333333][k%6],.32,.9,.32,px,.5,pz);bs(0xffd9b0,.3,.3,.3,px,1.15,pz);bk(k%3?0xd8132f:0xffffff,.3,.45,.3,px,1.55,pz)}
  for(k=0;k<8;k++){a=k*TWO/8+.2;blamp(Math.cos(a)*(RI-1.6),Math.sin(a)*(RI-1.6),.9)}
  for(k=0;k<16;k++){a=k*TWO/16+.1;blamp(Math.cos(a)*(Ro+3.2),Math.sin(a)*(Ro+3.2),1)}
  for(k=0;k<26;k++){a=k*TWO/26+.05;r=Ro+5.5+(k%3)*2.2;btree(Math.cos(a)*r,Math.sin(a)*r,.85+(k%3)*.1,k%2==0,false)}
  for(k=0;k<22;k++){a=k*TWO/22+.12;r=Ro+24+(k%4)*3;btree(Math.cos(a)*r,Math.sin(a)*r,1.5+(k%3)*.25,k%3==0,false)}
  for(k=0;k<9;k++){a=k*TWO/9+.2;r=Ro+36;bcabin(Math.cos(a)*r,Math.sin(a)*r,1.3+(k%2)*.4,Math.atan2(-Math.cos(a),-Math.sin(a)))}
  for(k=0;k<12;k++){a=k*TWO/12+.4;r=Ro+3.8+(k%2)*1.6;bgift(Math.cos(a)*r,0,Math.sin(a)*r,.8+(k%3)*.12,k%2?0x1f8f55:0xd32f2f,k%2?0xffffff:0xffd54a,k)}
  for(k=0;k<5;k++){a=k*TWO/5+.9;r=Ro+6;bsnowman(Math.cos(a)*r,Math.sin(a)*r,.9,-a)}
  var gp=WL(thF,0,0,0),gs=WL(thS,0,0,0);
  var fl=label('🏁 ĐÍCH',0xd8132f,2.8,1);fl.position.set(gp[0],7.4,gp[2]);world.add(fl);
  var bn=new TH.Sprite(new TH.SpriteMaterial({map:TX.logo,transparent:true}));bn.scale.set(4.4,4.4,1);bn.position.set(gp[0],10.6,gp[2]);world.add(bn);
  var st=label('XUẤT PHÁT',0x1f8f55,2.6,.9);st.position.set(gs[0],6.9,gs[2]);world.add(st);
  var sl=new TH.Sprite(new TH.SpriteMaterial({map:TX.logo,transparent:true}));sl.scale.set(3,3,1);sl.position.set(gs[0],9.4,gs[2]);world.add(sl);
  flush(world);flushBulbs();
  glowS(TX.glowY,9,9,gp[0],5.4,gp[2],.35);
  LP.forEach(function(p,i){LN.push(lane(i,n,p))})}

/* ================= Diễn biến cuộc đua ================= */
function mkTab(f,c1,c2,p1,p2){
  var dt=1/60,iF=Math.round(f/dt),NT=Math.round(TAIL/dt),N=iF+NT+2,c=new Float32Array(N),i,S=0,k,vf,s2;
  function sp(t){var a=Math.min(1,t/2.4);return(a*a*(3-2*a)*.9+.1*a)*(1+.1*Math.sin(TWO*c1*t+p1)+.06*Math.sin(TWO*c2*t+p2))}
  for(i=1;i<=iF;i++)S+=sp((i-.5)*dt)*dt;
  k=1/S;vf=sp((iF-.5)*dt)*k;
  for(i=1;i<N;i++){if(i<=iF)c[i]=c[i-1]+sp((i-.5)*dt)*k*dt;else{s2=Math.min(1,(i-iF)/NT);c[i]=c[i-1]+vf*(1-s2)*(1-s2)*dt}}
  return{c:c,n:N,dt:dt}}
function pr(i,t){var T=plan.tab[i],x=t/T.dt,k=x|0;if(x<=0)return 0;if(k>=T.n-1)return T.c[T.n-1];return T.c[k]+(T.c[k+1]-T.c[k])*(x-k)}

function pose(l,x,v,dt,i,rt){if(l.tg&&l.tg.rig)return TR.pose(l,x,v,dt,i,rt,{state:state,tm:tm,win:(plan&&i==plan.W&&rt>DUR+1.2)?rt-DUR-1.2:-1,mid:i==(LP.length>>1)});
  var g=l.tg,k=Math.min(1,v);l.ph+=dt*(3+11*k);var s=Math.sin(l.ph),base=.12+.75*k;
  l.ln.position.x=x;
  g.ll[0].rotation.z=s*.9*k;g.ll[1].rotation.z=-s*.9*k;
  g.al[0].rotation.z=base-s*.4*k;g.al[1].rotation.z=base+s*.4*k;
  g.b.position.y=.12+Math.abs(s)*.16*k+(1-k)*Math.sin(tm*2+i)*.02;
  g.t.rotation.y=Math.sin(l.ph*.7+i)*.5;
  g.h.rotation.z=Math.sin(l.ph)*.05*k-.03;
  g.al[0].rotation.x=.95;g.al[1].rotation.x=-.95;
  l.gb.rotation.z=Math.sin(l.ph)*.07*k;l.gb.rotation.x=Math.sin(l.ph*.5)*.04*k;
  l.gl.material.opacity=.42+.2*Math.sin(tm*3+i);
  var j=0,ry=0;
  if(plan&&i==plan.W&&rt>DUR+1.2){var q=rt-DUR-1.2;j=Math.abs(Math.sin(q*6))*.7;ry=Math.sin(q*3)*.6}
  g.g.position.y=j;g.g.rotation.y=ry;
  if(state=='intro'&&i==(LP.length>>1)){g.al[1].rotation.x=-2.3-Math.abs(Math.sin(tm*8))*.5;g.g.position.y=Math.abs(Math.sin(tm*4))*.22;g.g.rotation.y=-.3+Math.sin(tm*2)*.1}}

/* khớp kích thước khung vẽ với màn hình (mọi tỷ lệ, xoay ngang/dọc, thanh địa chỉ thu/phóng); giảm độ nét trên màn rất lớn cho đỡ giật */
function fit(){
  var cv=$('cv'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
  if(w!==fw||h!==fh){fw=w;fh=h;
    var dpr=Math.min(window.devicePixelRatio||1,w*h>900000?1.5:2);
    if(Math.abs(R.getPixelRatio()-dpr)>.01)R.setPixelRatio(dpr);
    R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}}

var RV=new TH.Vector3();function relab(){var H=fh||600,px=Math.max(28,Math.min(44,H*.05)),k=2*px/H*Math.tan(C.fov*Math.PI/360),rt=plan?(performance.now()-plan.t0)/1000:0,rc=state=='race'||state=='done',a=rc?Math.max(0,Math.min(1,(rt-1.4)/1.2)):0,end=rc&&rt>DUR+.5;LN.forEach(function(l,i){if(!l.sp)return;var d=l.sp.getWorldPosition(RV).distanceTo(C.position),h=k*d*a;l.sp.scale.set(Math.max(h*2.9,.0001),Math.max(h,.0001),1);l.sp.visible=a>.01&&(!end||(plan&&i==plan.W))})}
var last=performance.now();
function loop(now){
  requestAnimationFrame(loop);
  var dt=Math.min(.05,(now-last)/1000);last=now;tm+=dt;fit();snowTick(dt);
  var rt=plan?(now-plan.t0)/1000:0,n=LN.length;
  LN.forEach(function(l,i){
    var th=TH0,v=0;
    if(state=='warm')v=.8;else if(state=='intro')v=.22;
    else if(plan&&(state=='race'||state=='done')){var p=pr(i,rt),p2=pr(i,rt+.06);th=TH0-p*TOTA;v=Math.max(0,Math.min(1.3,(p2-p)/.06*DUR*.9))}
    l.v=v;pose(l,0,v,dt,i,rt);place(l,i,n,th)});
  if(state=='race'&&plan&&n){
    for(var q=0;q<3;q++){var li=(Math.random()*n)|0,L=LN[li];if(L.v>.3){var sn=Math.sin(L.th),cs=Math.cos(L.th),o=L.ln.position;
      emit(PUF,o.x-sn*.9,.25,o.z+cs*.9+(Math.random()-.5)*.8,-sn*(2+Math.random()*2),1+Math.random()*1.6,cs*(2+Math.random()*2),.55+Math.random()*.4)}}}
  if(plan&&plan.win&&rt<DUR+4.3){var wo=LN[plan.W].ln.position;for(var qq=0;qq<6;qq++)emit(CNF,wo.x+(Math.random()-.5)*12,10+Math.random()*3,wo.z+(Math.random()-.5)*12,(Math.random()-.5)*3,-1-Math.random()*2,(Math.random()-.5)*3,3,CCOL[(Math.random()*6)|0])}
  ptsTick(PUF,dt,2.5);ptsTick(CNF,dt,9);bulbTick();smokeTick();
  AUR.forEach(function(a,i){a.m.map.offset.x+=dt*a.sp;a.m.opacity=a.o*(.75+.25*Math.sin(tm*.4+i*2))});
  cam(now,dt);auTick(dt);relab();
  if(state=='race'&&plan){
    if(rt>=DUR+.9&&!plan.win){plan.win=1;celebrate()}
    if(rt>plan.mx+1)state='done'}
  R.render(S,C)}

/* ================= Camera điện ảnh + TVC mở đầu 4 giây ================= */
function ease(u){u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)}
function mix(a,b,u){return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
function packA(t){var s=0,m=0,i,p,n=LN.length;for(i=0;i<n;i++){p=pr(i,t);s+=p;if(p>m)m=p}return[s/Math.max(1,n),m]}
function mw(a,b,u){return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
function cam(now,dt){
  var n=Math.max(1,LP.length),hw=n*LS/2,asp=fw&&fh?fw/fh:1.6,K=asp<1?1+(1-asp)*.7:1,
   t=state=='intro'?(now-introT0)/1000:(plan?(now-plan.t0)/1000:0),zc=lat(n>>1,n),
   iP=WL(TH0,17,7+hw*.8,hw*1.25+13),iL=WL(TH0,0,.8,0),p,l,zt=1,k=4,sh=0,u,
   thF=TH0-TOTA;
  if(state=='intro'){
    k=1000;
    if(t<1.5){u=ease(t/1.5);p=mw([0,70+hw*1.6,95+hw*2],WL(TH0,22,9+hw*.3,hw+22),u);l=mw([0,0,0],WL(TH0,10,1,0),u);zt=1.12-.12*u}
    else if(t<2.6){u=ease((t-1.5)/1.1);p=mw(WL(TH0,22,9+hw*.3,hw+22),WL(TH0,3.6,3.9,zc+7.4),u);l=mw(WL(TH0,10,1,0),WL(TH0,0,3.1,zc),u);zt=1-.12*u}
    else{u=ease((t-2.6)/1.4);p=mw(WL(TH0,3.6,3.9,zc+7.4),iP,u);l=mw(WL(TH0,0,3.1,zc),iL,u);zt=.88+.12*u}
  }else if((state=='race'||state=='done')&&plan){
    var lead=1/2.5,pa=packA(t+lead),ta=TH0-(t<DUR-2.4?pa[0]:(pa[0]+pa[1])/2)*TOTA;
    CAMA+=(ta-CAMA)*(1-Math.exp(-dt*2.5));
    if(t<2.6){p=WL(CAMA,16,6+hw*.7,hw*1.5+13);l=WL(CAMA,-2,.8,0);zt=1.04;k=7}
    else if(t<DUR-2.4){p=WL(CAMA,15,7+hw*.8,hw*1.25+13+Math.sin(tm*.5)*1.2);l=WL(CAMA,-3,.8,0);k=7}
    else if(t<DUR+.8){u=Math.min(1,(t-(DUR-2.4))/3.2);p=WL(CAMA,3,12+hw*.9,hw*1.25+19);l=WL(CAMA,2,.6,0);zt=1-.03*ease(u);k=3.5;sh=.008+.03*u}
    else{var wo=LN[plan.W].ln.position,thW=Math.atan2(wo.z,wo.x),fx=Math.sin(thW),fz=-Math.cos(thW),ox=Math.cos(thW),oz=Math.sin(thW),a=1+.07*(t-DUR-.8),rr=20+hw*.35;
      var pO=[wo.x+(fx*Math.sin(a)+ox*Math.cos(a))*rr,8+hw*.2+Math.sin((t-DUR)*.8)*.6,wo.z+(fz*Math.sin(a)+oz*Math.cos(a))*rr],lO=[wo.x,3.4,wo.z],u2=ease((t-DUR-.8)/2.4);
      p=mw(WL(CAMA,3,12+hw*.9,hw*1.25+19),pO,u2);l=mw(WL(CAMA,2,.6,0),lO,u2);zt=1-.03*(1-u2);k=4}
  }else{CAMA=TH0;p=[iP[0],iP[1]+Math.sin(tm*.7)*.12,iP[2]];l=iL;k=4}
  baseFov=asp<1?58:(asp>2.2?34:40);
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
  state='intro';introT0=performance.now();TV.style.display='block';setTimeout(function(){BT.style.height=BB.style.height='6%'},30);
  return new Promise(function(res){
    setTimeout(function(){if(tk!==cdTok)return;MC.classList.add('show');[659,784,988,1319].forEach(function(f,k){setTimeout(function(){beep(f,.5)},k*140)})},2600);
    setTimeout(function(){if(tk===cdTok)SB.classList.add('show')},3200);
    setTimeout(function(){hideTvc();if(tk===cdTok)state='warm';res()},4000)})}

/* ================= Bầu trời, cực quang, sao, đồi xa, hạt tuyết ================= */
function mkSky(){
  var dome=new TH.Mesh(new TH.SphereGeometry(420,24,16),new TH.MeshBasicMaterial({map:TX.sky,side:TH.BackSide,fog:false,depthWrite:false}));dome.position.set(0,0,0);dome.renderOrder=-10;S.add(dome);
  var N=420,a=new Float32Array(N*3),i,th,ph;
  for(i=0;i<N;i++){th=Math.random()*6.283;ph=.12+Math.random()*1.1;a[i*3]=Math.cos(th)*Math.cos(ph)*400;a[i*3+1]=Math.sin(ph)*400;a[i*3+2]=Math.sin(th)*Math.cos(ph)*400}
  var sg=new TH.BufferGeometry();sg.setAttribute('position',new TH.BufferAttribute(a,3));
  var st=new TH.Points(sg,new TH.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,transparent:true,opacity:.9,fog:false,depthWrite:false}));st.frustumCulled=false;S.add(st);
  [[TX.aurG,380,80,50,70,-200,.8,.006],[TX.aurM,300,60,-10,55,-215,.5,-.004]].forEach(function(q){
    var m=new TH.MeshBasicMaterial({map:q[0],transparent:true,opacity:q[6],blending:TH.AdditiveBlending,depthWrite:false,fog:false,side:TH.DoubleSide}),
     pl=new TH.Mesh(new TH.PlaneGeometry(q[1],q[2]),m);pl.position.set(q[3],q[4],q[5]);pl.rotation.z=.04;S.add(pl);AUR.push({m:m,o:q[6],sp:q[7]})});
  var moon=new TH.Mesh(GS,new TH.MeshBasicMaterial({color:0xfff4d0,fog:false}));moon.scale.set(7,7,7);moon.position.set(120,78,-230);S.add(moon);
  var mg=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowW,transparent:true,opacity:.7,depthWrite:false,blending:TH.AdditiveBlending,fog:false}));mg.scale.set(60,60,1);mg.position.copy(moon.position);S.add(mg)}
function decor(){
  MS=[new TH.Matrix4()];PC=[[],[]];
  var i,a,r,s;
  for(i=0;i<16;i++){a=i*TWO/16+.2;r=330+(i%3)*30;s=45+(i%4)*14;
    bp(GS,0xc6cbec,s,s*.5,s*.7,Math.cos(a)*r,-s*.18,Math.sin(a)*r,0,0,0,0);bp(GS,0xf7f8ff,s*.58,s*.17,s*.42,Math.cos(a)*r,s*.25,Math.sin(a)*r,0,0,0,0)}
  for(i=0;i<150;i++){a=Math.random()*TWO;r=165+Math.random()*60;s=4+Math.random()*3.5;
    bp(GK,0x1c3d52,s*.9,s*2.2,s*.9,Math.cos(a)*r,s*1.1,Math.sin(a)*r,0,0,0,0);bp(GK,0xe8eefc,s*.5,s*1.0,s*.5,Math.cos(a)*r,s*1.55,Math.sin(a)*r,0,0,0,0)}
  flush(S)}
function mkSnow(){var N=900,g=new TH.BufferGeometry(),a=new Float32Array(N*3),i;
  for(i=0;i<N;i++){a[i*3]=-100+Math.random()*200;a[i*3+1]=Math.random()*30;a[i*3+2]=-100+Math.random()*200}
  g.setAttribute('position',new TH.BufferAttribute(a,3));
  SNP=new TH.Points(g,new TH.PointsMaterial({color:0xffffff,size:.6,map:TX.glowW,transparent:true,opacity:.95,depthWrite:false}));SNP.frustumCulled=false;S.add(SNP)}
function snowTick(dt){if(!SNP)return;var a=SNP.geometry.attributes.position,d=a.array,i,N=d.length/3;
  for(i=0;i<N;i++){d[i*3+1]-=dt*(1.5+(i%5)*.35);d[i*3]+=Math.sin(tm+i)*dt*.4;if(d[i*3+1]<0)d[i*3+1]=30}a.needsUpdate=true}
function mkPts(N,col,size,vc){
  var g=new TH.BufferGeometry(),a=new Float32Array(N*3),i,o;for(i=0;i<N;i++)a[i*3+1]=-60;
  g.setAttribute('position',new TH.BufferAttribute(a,3));
  o={a:a,v:new Float32Array(N*3),l:new Float32Array(N),n:N,k:0,g:g};
  if(vc){o.c=new Float32Array(N*3);g.setAttribute('color',new TH.BufferAttribute(o.c,3))}
  var m=new TH.Points(g,new TH.PointsMaterial({color:col,size:size*2.2,map:TX.glowW,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc}));m.frustumCulled=false;S.add(m);return o}
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
  snow();AU.hold=0;auMode('win');
  var wo=LN[plan.W].ln.position,i;
  for(i=0;i<460;i++)emit(CNF,wo.x+(Math.random()-.5)*6,2.5,wo.z+(Math.random()-.5)*6,(Math.random()-.5)*16,8+Math.random()*10,(Math.random()-.5)*16,2.8+Math.random()*1.6,CCOL[i%CCOL.length]);
  var sg=new TH.Sprite(new TH.SpriteMaterial({map:TX.glowY,transparent:true,opacity:.8,depthWrite:false,blending:TH.AdditiveBlending}));sg.scale.set(26,26,1);sg.position.set(wo.x,4.5,wo.z);world.add(sg);
  setTimeout(function(){fin(plan.r)},3400)}

function fin(r){if(window.DCclaim&&window.__dcHd){window.__snapReq=1;return setTimeout(function(){window.DCclaim(r,window.__dcHd)},120)}
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
  cdTok++;hideTvc();state='idle';busy=0;AU.hold=0;document.body.classList.remove('racing');auMode('idle');
  $('cd').hidden=true;$('sp').disabled=!LP.length;$('sp').textContent='ĐUA CỌP';$('er').textContent=msg||''}

function startRace(r){
  var wi=-1,i;LP.forEach(function(p,k){if(p.id==r.id)wi=k});
  if(wi<0){if(LP.length>=MAXL)LP[LP.length-1]={id:r.id,ten:r.ten};else LP.push({id:r.id,ten:r.ten});wi=LP.length-1;buildScene()}
  var f=[],tab=[],mx=DUR;
  for(i=0;i<LP.length;i++){
    var fi=i==wi?DUR:DUR+.6+Math.random()*1.7;f.push(fi);if(i!=wi)mx=Math.max(mx,fi);
    tab.push(mkTab(fi,.05+Math.random()*.04,.11+Math.random()*.06,Math.random()*TWO,Math.random()*TWO))}
  plan={W:wi,f:f,tab:tab,mx:mx,t0:performance.now(),r:r,win:0};
  state='race';$('info').textContent='';$('sp').textContent='Đang đua...'}

function go(){
  if(busy)return;var e=chk();$('er').textContent=e;if(e)return;
  busy=1;$('sp').disabled=true;$('sp').textContent='Đang vào cuộc đua...';plan=null;
  document.body.classList.add('racing');window.scrollTo(0,0);
  unlock();primeRace();auMode('tvc');
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
  $('logo').src=window.L9URL||'logo-9sach.png?v=2';$('logo').hidden=false
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
  try{R=new TH.WebGLRenderer({canvas:$('cv'),antialias:true,powerPreference:'high-performance'})}
  catch(e1){R=new TH.WebGLRenderer({canvas:$('cv'),antialias:false})}
  R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  R.toneMapping=TH.NoToneMapping;S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,150,380);
  C=new TH.PerspectiveCamera(40,1.6,.1,900);
  GS=new TH.SphereGeometry(1,20,14);GL=new TH.SphereGeometry(1,8,6);GM=new TH.SphereGeometry(1,12,8);GB=new TH.BoxGeometry(1,1,1);
  GT=new TH.TorusGeometry(1,.1,8,22);GT2=new TH.TorusGeometry(1,.22,8,22);GC=new TH.CylinderGeometry(1,1,1,10);GK=new TH.ConeGeometry(1,1,10);GP=new TH.PlaneGeometry(1,1);
  var sh=new TH.Shape();sh.moveTo(-3,0);sh.lineTo(3,0);sh.lineTo(0,3.6*Math.tan(.62));sh.closePath();GTri=new TH.ShapeGeometry(sh);
  MST=[new TH.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0}),new TH.MeshBasicMaterial({vertexColors:true})];
  TX={glowY:glowTex('255,214,90'),glowO:glowTex('255,160,70'),glowW:glowTex('255,244,210'),smoke:smokeTex(),sky:skyTex(),aurG:aurTex(90,255,170),aurM:aurTex(200,110,255),shadow:shadowTex()};
  LGM=new TH.MeshBasicMaterial({map:logoTex(),transparent:true});
  SHM=new TH.MeshBasicMaterial({map:TX.shadow,transparent:true,depthWrite:false});
  S.add(new TH.HemisphereLight(0xdcd8ff,0x7f8fd8,.72));
  var l=new TH.DirectionalLight(0xffe2bc,.7);l.position.set(14,26,26);S.add(l);var rim=new TH.DirectionalLight(0x8fb8ff,.7);rim.position.set(-18,14,-24);S.add(rim);
  LT1=new TH.PointLight(0xff9a40,.8,80,2);S.add(LT1);LT2=new TH.PointLight(0xffb060,.45,40,2);S.add(LT2);
  world=new TH.Group();S.add(world);
  mkSky();decor();mkSnow();PUF=mkPts(180,0xffffff,.6,0);CNF=mkPts(620,0xffffff,.7,1)}

try{init()}catch(e){$('er').textContent='Thiết bị không hỗ trợ hiển thị 3D';return}
/* mất bối cảnh WebGL (điện thoại thiếu bộ nhớ / chuyển app): báo người chơi, tự dựng lại khi khôi phục */
$('cv').addEventListener('webglcontextlost',function(e){e.preventDefault();$('er').textContent='Màn hình 3D bị gián đoạn, vui lòng chờ hoặc tải lại trang'},false);
$('cv').addEventListener('webglcontextrestored',function(){$('er').textContent='';buildScene()},false);
auInit();snow();if(window.__gate)window.dcEnter();
$('sp').onclick=go;$('sp').textContent='ĐUA CỌP';
window.DC={d:function(){return D},pick:function(s){ST=s;ls('st',ST);build();lazy()},img:function(n){return IM[n]},
start:function(hd,cb){if(busy)return;
 if(!P.length)return cb(unkNow()?'Đang tải quà của cửa hàng, vui lòng đợi vài giây rồi bấm lại':'Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác');
 busy=1;
 api('race',{store:ST,hd:hd}).then(function(r){
  window.__dcHd=hd;plan=null;document.body.classList.add('racing');window.scrollTo(0,0);
  unlock();primeRace();auMode('tvc');cb();
  var tk=++cdTok;return intro(tk).then(function(){return tk===cdTok?countdown():0}).then(function(){startRace(r)})
 },function(e){busy=0;var m=e.message||'Lỗi kết nối';cb(m==='Yêu cầu không hợp lệ'?'Máy chủ chưa được cập nhật (quản trị viên cần triển khai lại Apps Script)':m)})
 .catch(function(e){alert(e.message||'Có lỗi xảy ra');location.reload()})}};
$('st').onchange=function(){ST=this.value;ls('st',ST);build();lazy()};
$('mute').onclick=function(){mute=!mute;this.textContent=mute?'🔇':'🔊';auMode(AU.mode)};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){drawLogo();if(!busy)buildScene()});
try{var c0=ls('pub2');if(c0)apply(JSON.parse(c0))}catch(e){}
api('pub').then(function(d){ls('pub2',JSON.stringify(d));apply(d)}).catch(function(e){if(!D)$('er').textContent=e.message});
requestAnimationFrame(loop);
})();