(function(){
'use strict';
var $=function(i){return document.getElementById(i)},TH=window.THREE;
var LS=2.7,FIN=72,DUR=9,MAXL=12;
var COLS=[0xe53935,0x1e88e5,0x43a047,0x8e24aa,0xfdb813,0x00acc1,0xf4511e,0xd81b60,0x6d4c41,0x3949ab,0x7cb342,0x00897b];
var D=null,P=[],LP=[],ST='',busy=0,mute=0,state='idle',plan=null,LN=[],IM={},CAMX=3,cdTok=0,fw=0,fh=0,tm=0;
var R,S,C,world,GS,GB,GT,GT2,GC,GK,MT={};

function ls(k,v){try{if(v===undefined)return localStorage.getItem('dc_'+k);localStorage.setItem('dc_'+k,v)}catch(e){}}
function beep(f,d){if(mute)return;try{var A=window.AC=window.AC||new (window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.value=.12;g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}

/* ---------- 3D helpers ---------- */
function mat(c){return MT[c]||(MT[c]=new TH.MeshStandardMaterial({color:c,roughness:.5}))}
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

/* ---------- Cọp con đeo sừng hưu ---------- */
function tiger(col){
  var OR=0xff7a1a,CR=0xffe6b8,BK=0x241a17,BR=0x5a3320,AN=0x8a5a2b;
  var g=new TH.Group(),b=grp(g,0,.12,0),h=grp(b,0,2.2,0),o={g:g,b:b,h:h,al:[],ll:[]};
  ball(b,OR,.5,.62,.52,0,.95,0);ball(b,CR,.28,.4,.33,.3,.88,0);
  [.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BK,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});
  mesh(b,GT2,col,.43,.43,.9,0,1.4,0).rotation.x=Math.PI/2;
  ball(h,OR,1.05,.9,.95,0,0,0);ball(h,CR,.42,.34,.5,.78,-.28,0);ball(h,0x6b3a26,.13,.09,.16,1.14,-.12,0);
  [-1,1].forEach(function(s){
    ball(h,0x111111,.13,.17,.13,.95,.08,s*.36);ball(h,0xffffff,.04,.05,.04,1.06,.15,s*.34);
    ball(h,BR,.06,.04,.05,.86,.48,s*.22);
    ball(h,BR,.12,.3,.3,-.05,.74,s*.68);ball(h,CR,.08,.2,.2,.07,.74,s*.66);
    [.2,0,-.2].forEach(function(y){var x=-.25,z=.95*Math.sqrt(Math.max(0,1-Math.pow(y/.9,2)-Math.pow(x/1.05,2)));ball(h,BK,.38,.05,.12,x,y,s*(z-.01))});
    [0,1].forEach(function(j){mesh(h,GB,BK,.5,.012,.012,1.1,-.22+j*.07,s*.38).rotation.y=-s*.5});
    var a=grp(h,-.1,.8,s*.32);a.rotation.x=s*.3;
    mesh(a,GC,AN,.05,.8,.05,0,.4,0);
    mesh(a,GC,AN,.04,.35,.04,.14,.41,0).rotation.z=-.9;
    mesh(a,GC,AN,.035,.3,.035,.12,.67,0).rotation.z=-.9;
    var ar=grp(b,.1,1.28,s*.52);ball(ar,OR,.17,.32,.17,0,-.26,0);ball(ar,CR,.13,.13,.13,0,-.52,0);o.al.push(ar);
    var lg=grp(b,0,.42,s*.25);ball(lg,OR,.2,.32,.2,0,-.12,0);ball(lg,CR,.28,.1,.2,.09,-.4,0);o.ll.push(lg)});
  [-.4,-.1,.2].forEach(function(x){ball(h,BK,.07,.03,.2,x,.9*Math.sqrt(1-Math.pow(x/1.05,2))-.005,0)});
  o.t=grp(b,-.42,.62,0);for(var i=0;i<5;i++)ball(o.t,i%2?BK:OR,.1,.1,.1,-.1*i,.03*i*i,0);
  return o}

/* ---------- Làn đua: cọp + xe trượt + quà ---------- */
function lane(i,n,p){
  var z=(i-(n-1)/2)*LS,ln=grp(world,0,0,z),col=COLS[i%COLS.length],tg=tiger(col);
  tg.g.scale.setScalar(.78);ln.add(tg.g);
  var sl=grp(ln,-3,0,0);mesh(sl,GB,0x7a4a24,1.5,.12,1.1,0,.1,0);
  var gb=grp(sl,0,.14,0);mesh(gb,GB,col,.9,.8,.9,0,.5,0);mesh(gb,GB,0xffd54a,.94,.84,.16,0,.5,0);mesh(gb,GB,0xffd54a,.16,.84,.94,0,.5,0);ball(gb,0xffd54a,.2,.14,.2,0,.95,0);
  mesh(ln,GC,0xf5e6c8,.03,2.55,.03,-.97,.65,0).rotation.z=Math.PI/2;
  var sp=label(p.ten,col);sp.position.set(-3,2.4,0);ln.add(sp);
  return {ln:ln,tg:tg,sl:sl,gb:gb,ph:Math.random()*6}}

function buildScene(){
  while(world.children.length){var c=world.children[0];world.remove(c);c.traverse(function(o){if(o.material&&o.material.map)o.material.map.dispose()})}
  LN=[];var n=LP.length;if(!n)return;
  var W=n*LS,x0=-10,x1=FIN+30,len=x1-x0,cx=(x0+x1)/2,i,j;
  mesh(world,GB,0xf4f9ff,500,.2,500,40,-.1,0);
  for(i=0;i<n;i++)mesh(world,GB,i%2?0xf2dcb8:0xe9cd9f,len,.06,LS,cx,.03,(i-(n-1)/2)*LS);
  for(j=0;j<=n;j++)mesh(world,GB,0xffffff,len,.07,.12,cx,.07,(j-n/2)*LS);
  mesh(world,GB,0xffffff,.25,.08,W,1,.08,0);
  for(i=0;i<n*2;i++)for(j=0;j<2;j++)mesh(world,GB,(i+j)%2?0x222222:0xffffff,.6,.09,LS/2,FIN+.9+j*.6,.09,-W/2+LS/4+i*LS/2);
  [-1,1].forEach(function(s){mesh(world,GC,0xd8132f,.3,5,.3,FIN+1.2,2.5,s*(W/2+.2))});
  mesh(world,GB,0xd8132f,.3,1,W+.8,FIN+1.2,5.2,0);
  var fl=label('🏁 ĐÍCH',0xd8132f,5,2.1);fl.position.set(FIN+1.2,7,0);world.add(fl);
  for(var k=0;k<14;k++){var tr=grp(world,-8+k*8.5,0,-(W/2+3+(k*37%5)));mesh(tr,GC,0x6d4c41,.25,1.2,.25,0,.6,0);mesh(tr,GK,0x1f7a4d,1.5,2.6,1.5,0,2.3,0);mesh(tr,GK,0x2e9a62,1.15,2.1,1.15,0,3.5,0);ball(tr,0xffffff,.25,.25,.25,0,4.5,0)}
  LP.forEach(function(p,i){LN.push(lane(i,n,p))})}

/* ---------- Diễn biến cuộc đua ---------- */
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
  l.sl.position.y=Math.abs(Math.sin(l.ph*.5))*.06*k;
  var j=0,ry=0;
  if(plan&&i==plan.W&&rt>DUR){var q=rt-DUR;j=Math.abs(Math.sin(q*6))*.7;ry=Math.sin(q*3)*.6}
  g.g.position.y=j;g.g.rotation.y=ry}

function fit(){
  var cv=$('cv'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
  if(w!==fw||h!==fh){fw=w;fh=h;R.setSize(w,h,false);C.aspect=w/h;C.fov=w/h<1?58:40;C.updateProjectionMatrix()}}

var last=performance.now();
function loop(now){
  requestAnimationFrame(loop);
  var dt=Math.min(.05,(now-last)/1000);last=now;tm+=dt;fit();
  var rt=plan?(now-plan.t0)/1000:0,xs=[];
  LN.forEach(function(l,i){
    var x=0,v=0;
    if(state=='warm')v=.8;
    else if(plan&&(state=='race'||state=='done')){var p=pr(i,rt);x=p*FIN;v=Math.min(1.3,(pr(i,rt+.05)-p)*20*DUR*.9)}
    xs.push(x);pose(l,x,v,dt,i,rt)});
  if(xs.length){var mx=Math.max.apply(null,xs),mn=Math.min.apply(null,xs),tg=(state=='race'||state=='done')?mx*.6+mn*.4+4:3;CAMX+=(tg-CAMX)*Math.min(1,dt*3)}
  var n=Math.max(1,LP.length),hw=n*LS/2;
  C.position.set(CAMX-3,6+hw*1.15,hw+8+hw*1.35);C.lookAt(CAMX+5,0,0);
  if(state=='race'&&plan){
    if(rt>=DUR&&!plan.win){plan.win=1;celebrate()}
    if(rt>plan.mx+1)state='done'}
  R.render(S,C)}

function celebrate(){
  [523,659,784,1047].forEach(function(f,k){setTimeout(function(){beep(f,.45)},k*170)});
  snow();setTimeout(function(){fin(plan.r)},1600)}

function fin(r){
  $('rn').textContent=$('nm').value;$('rp').textContent=r.ten;
  var im=IM[r.ten];$('ri').hidden=!im;if(im)$('ri').src=im;
  $('rs').hidden=false}

/* ---------- Luồng chơi (giống vòng quay: máy chủ quyết định quà trúng) ---------- */
function chk(){var ph=$('ph').value.replace(/[^0-9]/g,'');return !$('nm').value.trim()?'Vui lòng nhập họ tên':!/^0[0-9]{9}$/.test(ph)?'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)':!$('hd').value.trim()?'Vui lòng nhập số hóa đơn':!P.length?'Cửa hàng này đã hết quà':''}

function countdown(){
  var tok=++cdTok,el=$('cd');
  return new Promise(function(res){var k=3;(function step(){
    if(tok!==cdTok)return res();
    if(k>0){el.hidden=false;el.textContent=k;beep(440,.2);k--;setTimeout(step,800)}
    else{el.textContent='ĐUA!';beep(880,.4);setTimeout(function(){el.hidden=true;res()},500)}})()})}

function reset(msg){cdTok++;state='idle';busy=0;$('cd').hidden=true;$('sp').disabled=false;$('sp').textContent='🐯 ĐUA CỌP';$('er').textContent=msg||''}

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
  busy=1;$('sp').disabled=true;$('sp').textContent='⏳ Chuẩn bị xuất phát...';state='warm';plan=null;
  var cd=countdown();
  api('spin',{store:ST,ten:$('nm').value,sdt:$('ph').value,hd:$('hd').value})
    .then(function(r){return cd.then(function(){return r})})
    .then(startRace)
    .catch(function(e){reset(e.message)})}

/* ---------- Dữ liệu quà theo cửa hàng ---------- */
function build(){
  if(busy)return;
  P=(D&&D.prizes[ST])||[];LP=P.slice(0,MAXL);buildScene();
  $('info').textContent=LP.length?'Có '+LP.length+' cọp – mỗi cọp kéo 1 món quà':'Cửa hàng này đã hết quà'}

function apply(d){
  D=d;var c=d.cfg||{};
  if(c.Logo){$('logo').src=c.Logo;$('logo').hidden=false}
  $('mn').textContent=money(c.MinTien);
  var k=d.stores.join('|');
  if($('st').dataset.k!=k){$('st').innerHTML=d.stores.map(function(x){return '<option>'+esc(x)+'</option>'}).join('');$('st').dataset.k=k}
  if(d.stores.indexOf(ST)<0)ST=d.stores.indexOf(ls('st'))>=0?ls('st'):(d.stores[0]||'');
  $('st').value=ST;
  var im=d.imgs||{};for(var n in im)IM[n]=im[n];
  build()}

function init(){
  R=new TH.WebGLRenderer({canvas:$('cv'),antialias:true});
  R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  S=new TH.Scene();S.background=new TH.Color(0xcdeeff);S.fog=new TH.Fog(0xcdeeff,70,170);
  C=new TH.PerspectiveCamera(40,1.6,.1,400);
  S.add(new TH.HemisphereLight(0xffffff,0xaec4d8,.9));
  var l=new TH.DirectionalLight(0xffffff,.85);l.position.set(-12,28,20);S.add(l);
  GS=new TH.SphereGeometry(1,20,14);GB=new TH.BoxGeometry(1,1,1);GT=new TH.TorusGeometry(1,.1,8,22);GT2=new TH.TorusGeometry(1,.22,8,22);
  GC=new TH.CylinderGeometry(1,1,1,10);GK=new TH.ConeGeometry(1,1,10);
  world=new TH.Group();S.add(world)}

try{init()}catch(e){$('er').textContent='Thiết bị không hỗ trợ hiển thị 3D';return}
snow();
$('sp').onclick=go;
$('st').onchange=function(){ST=this.value;ls('st',ST);build()};
$('mute').onclick=function(){mute=!mute;this.textContent=mute?'🔇':'🔊'};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!busy)buildScene()});
try{var c0=ls('pub');if(c0)apply(JSON.parse(c0))}catch(e){}
api('pub').then(function(d){ls('pub',JSON.stringify(d));apply(d)}).catch(function(e){if(!D)$('er').textContent=e.message});
requestAnimationFrame(loop);
})();
