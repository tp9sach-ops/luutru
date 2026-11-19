(function(){
'use strict';
var $=function(i){return document.getElementById(i)},TH=window.THREE;
var LS=2.7,FIN=72,DUR=9,MAXL=12;
var COLS=[0xd32f2f,0x1f8f55,0xe8a317,0xb71c1c,0x2e7d32,0x8e1b3a,0x0f6b4a,0xf4511e,0xc2185b,0x388e3c,0xe53935,0x00796b];
var D=null,P=[],LP=[],ST='',busy=0,mute=0,state='idle',plan=null,LN=[],IM={},CAMX=3,cdTok=0,fw=0,fh=0,tm=0;
var R,S,C,world,GS,GB,GT,GT2,GC,GK,MT={},MB={},SNP=null,introT0=0;

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
  var OR=0xff7a1a,CR=0xffe6b8,BK=0x241a17,BR=0x5a3320,AN=0xc58a3c;
  var g=new TH.Group(),b=grp(g,0,.12,0),h=grp(b,0,2.2,0),o={g:g,b:b,h:h,al:[],ll:[]};
  ball(b,OR,.5,.62,.52,0,.95,0);ball(b,CR,.28,.4,.33,.3,.88,0);
  [.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BK,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});
  mesh(b,GT2,col,.43,.43,.9,0,1.4,0).rotation.x=Math.PI/2;ball(b,0xffd54a,.11,.11,.11,.42,1.2,0);
  ball(h,OR,1.05,.9,.95,0,0,0);ball(h,CR,.42,.34,.5,.78,-.28,0);ball(h,0x6b3a26,.13,.09,.16,1.14,-.12,0);
  [-1,1].forEach(function(s){
    ball(h,0x111111,.13,.17,.13,.95,.08,s*.36);ball(h,0xffffff,.04,.05,.04,1.06,.15,s*.34);
    ball(h,BR,.06,.04,.05,.86,.48,s*.22);
    ball(h,BR,.12,.3,.3,-.05,.74,s*.68);ball(h,CR,.08,.2,.2,.07,.74,s*.66);
    [.2,0,-.2].forEach(function(y){var x=-.25,z=.95*Math.sqrt(Math.max(0,1-Math.pow(y/.9,2)-Math.pow(x/1.05,2)));ball(h,BK,.38,.05,.12,x,y,s*(z-.01))});
    [0,1].forEach(function(j){mesh(h,GB,BK,.5,.012,.012,1.1,-.22+j*.07,s*.38).rotation.y=-s*.5});
    var a=grp(h,-.1,.8,s*.32);a.rotation.x=s*.3;
    mesh(a,GC,AN,.075,.8,.075,0,.4,0);ball(a,0xd8132f,.1,.1,.1,0,.82,0);
    mesh(a,GC,AN,.06,.35,.06,.14,.41,0).rotation.z=-.9;
    mesh(a,GC,AN,.05,.3,.05,.12,.67,0).rotation.z=-.9;
    var ar=grp(b,.1,1.28,s*.52);ball(ar,OR,.17,.32,.17,0,-.26,0);ball(ar,CR,.13,.13,.13,0,-.52,0);o.al.push(ar);
    var lg=grp(b,0,.42,s*.25);ball(lg,OR,.2,.32,.2,0,-.12,0);ball(lg,CR,.28,.1,.2,.09,-.4,0);o.ll.push(lg)});
  [-.4,-.1,.2].forEach(function(x){ball(h,BK,.07,.03,.2,x,.9*Math.sqrt(1-Math.pow(x/1.05,2))-.005,0)});
  o.t=grp(b,-.42,.62,0);for(var i=0;i<5;i++)ball(o.t,i%2?BK:OR,.1,.1,.1,-.1*i,.03*i*i,0);
  return o}

/* ---------- Làn đua: cọp + xe trượt đỏ + hộp quà ---------- */
function mb(c){return MB[c]||(MB[c]=new TH.MeshBasicMaterial({color:c}))}
function bulb(p,c,x,y,z,s){var m=new TH.Mesh(GS,mb(c));m.scale.set(s,s,s);m.position.set(x,y,z);p.add(m);return m}
function lane(i,n,p){
  var z=(i-(n-1)/2)*LS,ln=grp(world,0,0,z),col=COLS[i%COLS.length],tg=tiger(col);
  tg.g.scale.setScalar(.95);ln.add(tg.g);
  var sl=grp(ln,-3.4,0,0);mesh(sl,GB,0xa3262a,1.8,.14,1.3,0,.16,0);
  [-1,1].forEach(function(s){mesh(sl,GB,0xffd54a,2.1,.07,.1,0,.05,s*.6)});
  var gb=grp(sl,0,.24,0),RB=i%2?0xffffff:0xffd54a,BX=i%2?0x1f8f55:0xd32f2f;
  mesh(gb,GB,BX,1.1,.95,1.1,0,.5,0);mesh(gb,GB,BX,1.25,.22,1.25,0,1.05,0);
  mesh(gb,GB,RB,1.14,.99,.2,0,.5,0);mesh(gb,GB,RB,.2,.99,1.14,0,.5,0);
  mesh(gb,GB,RB,1.28,.26,.2,0,1.05,0);mesh(gb,GB,RB,.2,.26,1.28,0,1.05,0);
  ball(gb,RB,.3,.2,.16,0,1.32,.18);ball(gb,RB,.3,.2,.16,0,1.32,-.18);ball(gb,RB,.14,.14,.14,0,1.27,0);
  mesh(ln,GC,0xf5e6c8,.03,2.4,.03,-1.3,.65,0).rotation.z=Math.PI/2;
  var sp=label(p.ten,col);sp.position.set(-3.4,2.9,0);ln.add(sp);
  return {ln:ln,tg:tg,sl:sl,gb:gb,ph:Math.random()*6}}

/* cây thông Noel: thân + 3 tầng xanh có mũ tuyết + sao vàng + bóng đèn */
function xtree(p,x,z,s,full){
  var t=grp(p,x,0,z),T=[[1.9,2.4,2.2,0x14683f],[1.5,2.1,3.7,0x1b7d4d],[1.1,1.8,5.0,0x239457]],a;
  t.scale.setScalar(s);mesh(t,GC,0x5d3a1a,.45,1.2,.45,0,.6,0);
  T.forEach(function(q,k){var r=q[0],h=q[1],y=q[2],ch=h*.46;
    mesh(t,GK,q[3],r,h,r,0,y,0);mesh(t,GK,0xffffff,r*.48,ch,r*.48,0,y+h/2-ch/2,0);
    if(full)for(var j=0;j<2;j++){a=k*2.1+j*3.3+(x*.7);bulb(t,BUL[(k+j)%4],Math.cos(a)*r*.62,y-h/2+h*.3,Math.sin(a)*r*.62,.17)}});
  bulb(t,0xffd54a,0,6.15,0,.36);return t}
var BUL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a];

function buildScene(){
  while(world.children.length){var c=world.children[0];world.remove(c);c.traverse(function(o){if(o.material&&o.material.map)o.material.map.dispose()})}
  LN=[];var n=LP.length;if(!n)return;
  var W=n*LS,x0=-10,x1=FIN+30,len=x1-x0,cx=(x0+x1)/2,i,j,k,s;
  mesh(world,GB,0xf3efe6,500,.2,500,40,-.1,0);
  for(i=0;i<n;i++)mesh(world,GB,i%2?0x1f7a4f:0xc9323a,len,.06,LS,cx,.03,(i-(n-1)/2)*LS);
  for(j=0;j<=n;j++)mesh(world,GB,0xffffff,len,.07,.12,cx,.07,(j-n/2)*LS);
  mesh(world,GB,0xffffff,.25,.08,W,1,.08,0);
  for(i=0;i<n*2;i++)for(j=0;j<2;j++)mesh(world,GB,(i+j)%2?0x222222:0xffffff,.6,.09,LS/2,FIN+.9+j*.6,.09,-W/2+LS/4+i*LS/2);
  /* cổng đích: cột sọc kẹo + xà đỏ viền vàng + đèn */
  [-1,1].forEach(function(s){for(k=0;k<7;k++)mesh(world,GC,k%2?0xffffff:0xd8132f,.34,.75,.34,FIN+1.2,.375+k*.75,s*(W/2+.2));bulb(world,0xffd54a,FIN+1.2,5.5,s*(W/2+.2),.5)});
  mesh(world,GB,0xd8132f,.35,1,W+.8,FIN+1.2,5.4,0);mesh(world,GB,0xffd54a,.4,.16,W+.9,FIN+1.2,4.85,0);
  for(k=0;k<=12;k++)bulb(world,BUL[k%4],FIN+1.5,4.6-Math.sin(k/12*Math.PI)*.4,-W/2-.2+k*(W+.4)/12,.15);
  var fl=label('🏁 ĐÍCH',0xd8132f,5,2.1);fl.position.set(FIN+1.2,7.4,0);world.add(fl);
  /* đèn dọc hai mép đường đua */
  for(k=0;x0+k*3<x1;k++)[-1,1].forEach(function(s){bulb(world,BUL[(k+(s>0?2:0))%4],x0+k*3,.3,s*(W/2+.7),.17)});
  /* hai hàng cây thông */
  for(k=0;k<12;k++)[-1,1].forEach(function(s){xtree(world,-9+k*9.4,s*(W/2+3.6+(k%3)*.5),1+(k%3)*.08,true);if(k<11)xtree(world,-4+k*9.4,s*(W/2+9+(k%2)*1.5),1.25,false)});
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
  g.g.position.y=j;g.g.rotation.y=ry;
  if(state=='intro'&&i==(LP.length>>1)){g.al[0].rotation.z=2.5+Math.sin(tm*10)*.35;g.g.position.y=Math.abs(Math.sin(tm*4))*.22;g.g.rotation.y=-.3+Math.sin(tm*2)*.1}}

function fit(){
  var cv=$('cv'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
  if(w!==fw||h!==fh){fw=w;fh=h;R.setSize(w,h,false);C.aspect=w/h;C.fov=w/h<1?58:40;C.updateProjectionMatrix()}}

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
  cam(now);
  if(state=='race'&&plan){
    if(rt>=DUR&&!plan.win){plan.win=1;celebrate()}
    if(rt>plan.mx+1)state='done'}
  R.render(S,C)}


/* ---------- Camera điện ảnh + TVC mở đầu 4 giây ---------- */
function ease(u){u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)}
function mix(a,b,u){return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
function cam(now){
  var n=Math.max(1,LP.length),hw=n*LS/2,iP=[CAMX-5,4.4+hw*.5,hw*.85+11+hw*.5],iL=[CAMX+7,1,0],p,l,t,u,zc;
  if(state=='intro'){
    t=(now-introT0)/1000;zc=((LP.length>>1)-(n-1)/2)*LS;
    if(t<1.5){u=ease(t/1.5);p=mix([-16,15,hw+36],[34,8.5,hw+24],u);l=mix([28,0,0],[52,1.5,0],u)}
    else if(t<2.6){u=ease((t-1.5)/1.1);p=mix([4.4,2.8,zc+9.6],[2.5,2.3,zc+5.8],u);l=[0,2.2,zc]}
    else{u=ease((t-2.6)/1.4);p=mix([2.5,2.3,zc+5.8],iP,u);l=mix([0,2.2,zc],iL,u)}
  }else{p=iP;l=iL;p[1]+=Math.sin(tm*.7)*.12}
  C.position.set(p[0],p[1],p[2]);C.lookAt(l[0],l[1],l[2])}
function el(css,html){var e=document.createElement('div');e.style.cssText=css;if(html)e.innerHTML=html;return e}
var TV=el('position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:50;display:none'),
 BT=el('position:absolute;left:0;right:0;top:0;height:0;background:#000;transition:height .5s'),
 BB=el('position:absolute;left:0;right:0;bottom:0;height:0;background:#000;transition:height .5s'),
 MC=el('position:absolute;left:0;right:0;top:46%;text-align:center;font:800 15vmin/.95 \"Baloo 2\",cursive,sans-serif;opacity:0;transform:translateY(-50%) scale(.5) rotate(-5deg);transition:opacity .45s,transform .8s cubic-bezier(.2,1.5,.4,1);background:linear-gradient(#fff7cf,#f7c948 55%,#c4801c);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;filter:drop-shadow(0 5px 0 #7a1020) drop-shadow(0 10px 14px rgba(0,0,0,.6))','Merry<br>Christmas');
[BT,BB,MC].forEach(function(e){TV.appendChild(e)});document.body.appendChild(TV);
function hideTvc(){TV.style.display='none';BT.style.height=BB.style.height='0';MC.style.opacity=0;MC.style.transform='translateY(-50%) scale(.5) rotate(-5deg)'}
function intro(tk){
  state='intro';introT0=performance.now();TV.style.display='block';setTimeout(function(){BT.style.height=BB.style.height='9vh'},30);
  return new Promise(function(res){
    setTimeout(function(){if(tk!==cdTok)return;MC.style.opacity=1;MC.style.transform='translateY(-50%) scale(1) rotate(-3deg)';[659,784,988,1319].forEach(function(f,k){setTimeout(function(){beep(f,.5)},k*140)})},2600);
    setTimeout(function(){hideTvc();if(tk===cdTok)state='warm';res()},4000)})}
function mkSnow(){var N=520,g=new TH.BufferGeometry(),a=new Float32Array(N*3),i;
  for(i=0;i<N;i++){a[i*3]=-30+Math.random()*150;a[i*3+1]=Math.random()*30;a[i*3+2]=-45+Math.random()*90}
  g.setAttribute('position',new TH.BufferAttribute(a,3));
  SNP=new TH.Points(g,new TH.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.9,depthWrite:false}));S.add(SNP)}
function snowTick(dt){if(!SNP)return;var a=SNP.geometry.attributes.position,d=a.array,i,N=d.length/3;
  for(i=0;i<N;i++){d[i*3+1]-=dt*(1.5+(i%5)*.35);d[i*3]+=Math.sin(tm+i)*dt*.4;if(d[i*3+1]<0)d[i*3+1]=30}a.needsUpdate=true}
function decor(){
  [[-30,-95,50],[30,-100,64],[95,-92,48],[-85,-90,40],[150,-98,56]].forEach(function(h){var r=h[2];
    ball(S,0x155c3f,r,r*.5,r*.7,h[0],-r*.18,h[1]);ball(S,0xf3efe6,r*.55,r*.16,r*.4,h[0],r*.24,h[1])});
  var m=new TH.Mesh(GS,new TH.MeshBasicMaterial({color:0xfff4c8,fog:false}));m.scale.set(6,6,6);m.position.set(50,46,-110);S.add(m)}

function celebrate(){
  [523,659,784,1047].forEach(function(f,k){setTimeout(function(){beep(f,.45)},k*170)});
  snow();setTimeout(function(){fin(plan.r)},1600)}

function fin(r){
  $('rn').textContent=$('nm').value;$('rp').textContent=r.ten;
  var im=IM[r.ten];$('ri').hidden=!im;if(im)$('ri').src=im;
  $('rs').hidden=false}

/* ---------- Luồng chơi (giống vòng quay: máy chủ quyết định quà trúng) ---------- */
function chk(){var ph=$('ph').value.replace(/[^0-9]/g,'');return !P.length?(unkNow()?'Đang tải quà của cửa hàng, vui lòng đợi vài giây rồi bấm lại':'Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác'):!$('nm').value.trim()?'Vui lòng nhập họ tên':!/^0[0-9]{9}$/.test(ph)?'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)':!$('hd').value.trim()?'Vui lòng nhập số hóa đơn':''}

function countdown(){
  var tok=++cdTok,el=$('cd');
  return new Promise(function(res){var k=3;(function step(){
    if(tok!==cdTok)return res();
    if(k>0){el.hidden=false;el.textContent=k;beep(440,.2);k--;setTimeout(step,800)}
    else{el.textContent='ĐUA!';beep(880,.4);setTimeout(function(){el.hidden=true;res()},500)}})()})}

function reset(msg){
  cdTok++;hideTvc();state='idle';busy=0;document.body.classList.remove('racing');
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
  var tk=++cdTok,cd=intro(tk).then(function(){return tk===cdTok?countdown():0});
  api('spin',{store:ST,ten:$('nm').value,sdt:$('ph').value,hd:$('hd').value})
    .then(function(r){return cd.then(function(){return r})})
    .then(startRace)
    .catch(function(e){reset(e.message)})}

/* ---------- Dữ liệu quà theo cửa hàng ---------- */
function build(){
  if(busy)return;
  P=(D&&D.prizes[ST])||[];LP=P.slice(0,MAXL);buildScene();
  $('empty').hidden=!!LP.length||unkNow();$('sp').disabled=!LP.length;
  $('info').textContent=LP.length?'Có '+LP.length+' cọp – mỗi cọp kéo 1 món quà':(unkNow()?'Đang tải quà của cửa hàng…':'')}
function unkNow(){return !!(D&&D.unk&&D.unk[ST])}
/* Cửa hàng lúc mở trang chưa tải được quà (lỗi mạng) -> tải lại riêng cửa hàng đó, không báo hết quà */
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
  S=new TH.Scene();S.background=new TH.Color(0x0e4231);S.fog=new TH.Fog(0x0e4231,55,150);
  C=new TH.PerspectiveCamera(40,1.6,.1,400);
  S.add(new TH.HemisphereLight(0xfff0d2,0x2a6b4c,1.0));
  var l=new TH.DirectionalLight(0xffe0b0,.95);l.position.set(-14,26,22);S.add(l);
  GS=new TH.SphereGeometry(1,20,14);GB=new TH.BoxGeometry(1,1,1);GT=new TH.TorusGeometry(1,.1,8,22);GT2=new TH.TorusGeometry(1,.22,8,22);
  GC=new TH.CylinderGeometry(1,1,1,10);GK=new TH.ConeGeometry(1,1,10);
  world=new TH.Group();S.add(world);decor();mkSnow()}

try{init()}catch(e){$('er').textContent='Thiết bị không hỗ trợ hiển thị 3D';return}
snow();
$('sp').onclick=go;
$('st').onchange=function(){ST=this.value;ls('st',ST);build();lazy()};
$('mute').onclick=function(){mute=!mute;this.textContent=mute?'🔇':'🔊'};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!busy)buildScene()});
try{var c0=ls('pub2');if(c0)apply(JSON.parse(c0))}catch(e){}
api('pub').then(function(d){ls('pub2',JSON.stringify(d));apply(d)}).catch(function(e){if(!D)$('er').textContent=e.message});
requestAnimationFrame(loop);
})();

