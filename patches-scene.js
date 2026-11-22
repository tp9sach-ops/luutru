/* PATCHES-SCENE (P24) – nâng cấp cảnh đua: khán đài, vòm đích, đèn chạy, chùm đèn pha, pháo hoa */
window.P24=[
[`function buildScene(){`,`function SCN(Ro,W,thF){
var i,j,a,r,y,k,sp,x,z,cols=[0xd32f2f,0xffd54a,0x1f8f55,0xffffff,0x2f6fd8,0xf4511e],skn=[0xffd9b0,0xf1c27d,0xd9a066,0xb98055],rows=3,span=.85,dA=.045,sl,yR,cab=function(q){var m,d;for(m=0;m<9;m++){d=Math.atan2(Math.sin(q-m*TWO/9-.2),Math.cos(q-m*TWO/9-.2));if(Math.abs(d)<.2)return 1}return 0};
for(j=0;j<rows;j++){r=Ro+9+j*2.2;y=.4+j*.9;sl=r*dA*1.05;
 for(a=thF-span;a<=thF+span;a+=dA){if(cab(a))continue;x=Math.cos(a)*r;z=Math.sin(a)*r;
  bb(j%2?0x8a1a2c:0x6b1424,sl,.45,2.1,x,y,z,0,-a-Math.PI/2,0);
  bb(0x3a2a30,sl,y,1.9,Math.cos(a)*(r+.2),y/2,Math.sin(a)*(r+.2),0,-a-Math.PI/2,0);
  if(Math.random()>.1){sp=cols[(Math.random()*6)|0];x=Math.cos(a)*(r-.2);z=Math.sin(a)*(r-.2);
   bb(sp,.55,.8,.5,x,y+.6,z,0,-a-Math.PI/2,0);bs(skn[(Math.random()*4)|0],.3,.3,.3,x,y+1.2,z);
   if(Math.random()>.7)bb(sp,.14,.5,.14,x+Math.sin(a)*.2,y+1.1,z-Math.cos(a)*.2,0,-a-Math.PI/2,Math.random()-.5)}}}
yR=.4+rows*.9;
for(a=thF-span;a<=thF+span;a+=dA){if(cab(a))continue;r=Ro+9;
 bb(0xffd54a,r*dA*1.05,.22,.25,Math.cos(a)*(Ro+8),1.1,Math.sin(a)*(Ro+8),0,-a-Math.PI/2,0);
 if(Math.round((a-thF+span)/dA)%2==0)bulbI(Math.cos(a)*(Ro+8),1.5,Math.sin(a)*(Ro+8),.15,BUL[(Math.abs((a*40)|0))%5]);
 if(Math.round((a-thF+span)/dA)%7==0){x=Math.cos(a)*(Ro+9.5);z=Math.sin(a)*(Ro+9.5);bc(0xe8e8f0,.08,4,.08,x,yR+1.6,z);bb(cols[(Math.round(a*60)&3)],.9,.5,.06,x+Math.sin(a)*.5,yR+3.4,z-Math.cos(a)*.5,0,-a,0)}}
var FA=window.FANS,GN=4,ga,m2,d,rF=Ro+11,rB=Ro+14.2,h1=.9,h2=2.2,PP=function(A,o,rr){return[Math.cos(A)*rr-Math.sin(A)*o,Math.sin(A)*rr+Math.cos(A)*o]},c1,c2,cf,ry;
if(FA&&window.TR&&TR.ready){FA.build(TH);FA.groups=[];
 for(m2=0;m2<GN;m2++){ga=thF+.95+(TWO-1.9)*(m2+.5)/GN;
  for(k=0;k<9;k++){d=Math.atan2(Math.sin(ga-k*TWO/9-.2),Math.cos(ga-k*TWO/9-.2));if(Math.abs(d)<.26)ga+=(d>=0?1:-1)*(.27-Math.abs(d))}
  FA.groups.push(ga);ry=-ga-Math.PI/2;c1=PP(ga,0,rF);c2=PP(ga,0,rB);cf=PP(ga,0,rF-1.28);
  bb(0x8a1a2c,5.8,h1,2.5,c1[0],h1/2,c1[1],0,ry,0);bb(0xd9a066,5.8,.14,2.5,c1[0],h1+.07,c1[1],0,ry,0);
  bb(0x8a1a2c,3.2,h2,2.5,c2[0],h2/2,c2[1],0,ry,0);bb(0xd9a066,3.2,.14,2.5,c2[0],h2+.07,c2[1],0,ry,0);
  bb(0xffd54a,5.8,.16,.12,cf[0],h1-.25,cf[1],0,ry,0);
  [-2.7,2.7].forEach(function(o){var pp=PP(ga,o,rF-1.3);bulbI(pp[0],h1+.4,pp[1],.16,BUL[m2%5])});
  [[-1.4,rF,h1],[1.4,rF,h1],[0,rB,h2]].forEach(function(q,j){var tg=FA.pool[(m2*3+j)%FA.pool.length],p3=PP(ga,q[0],q[1]);if(!tg)return;tg.g.position.set(p3[0],q[2]-.12,p3[1]);tg.g.rotation.y=Math.PI-ga;tg.g.scale.setScalar(1);world.add(tg.g)})}}
var p=WL(thF,0,0,0),R2=W/2+.6,t;bpush(p[0],0,p[2],1,Math.PI/2-thF);
for(k=0;k<=30;k++){t=k/30*Math.PI;bs(k%2?0xffd54a:0xd8132f,.27,.27,.27,.3,8.8+Math.sin(t)*R2*.3,Math.cos(t)*R2);if(k%2==0)bulbI(.6,9.1+Math.sin(t)*R2*.3,Math.cos(t)*R2,.14,BUL[k%5])}
bpop();
var bm2=function(th,lx,lean){var g=WL(th,lx,0,0),G=new TH.Group(),c=new TH.Mesh(new TH.ConeGeometry(3,70,14,1,true).translate(0,-35,0),new TH.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:.09,blending:TH.AdditiveBlending,depthWrite:false,side:TH.DoubleSide,fog:false}));c.rotation.x=Math.PI;G.add(c);G.position.set(g[0],0,g[2]);G.rotation.z=lean;G.rotation.x=lean*.6;world.add(G);glowS(TX.glowW,7,7,g[0],.4,g[2],.7)};
[[-1,-.22],[1,.22],[-1.5,-.3],[1.5,.3]].forEach(function(q){bm2(thF,q[0]*(W/2+6),q[1])});
[-.5,-.25,.25,.5].forEach(function(d){var g=WL(thF+d,0,0,Ro-RM+6);bm2(thF+d,Ro-RM+6,d>0?-.18:.18)});
BD.forEach(function(b){var rr=Math.sqrt(b.x*b.x+b.z*b.z);if(rr>RI-2&&rr<Ro+2)b.ph=-Math.atan2(b.z,b.x)*9})}
function buildScene(){`],
[`flush(world);flushBulbs();`,`SCN(Ro,W,thF);flush(world);flushBulbs();`],
[`setTimeout(function(){fin(plan.r)},3400)}`,`var fw0=[wo.x,wo.z],fk;for(fk=0;fk<9;fk++)(function(kk){setTimeout(function(){var cx=fw0[0]+(Math.random()-.5)*34,cz=fw0[1]+(Math.random()-.5)*34,cy=15+Math.random()*9,cc=CCOL[kk%CCOL.length],q,th,ph,sp;for(q=0;q<90;q++){th=Math.random()*6.283;ph=Math.acos(2*Math.random()-1);sp=8+Math.random()*5;emit(CNF,cx,cy,cz,Math.sin(ph)*Math.cos(th)*sp,Math.cos(ph)*sp,Math.sin(ph)*Math.sin(th)*sp,1.6+Math.random()*.9,cc)}},kk*330)})(fk);
setTimeout(function(){fin(plan.r)},3400)}`],
[`lineAt(thS,0,.5);lineAt(thF,1,1.1);`,`lineAt(thS,0,.5);lineAt(thF,1,1.1);
for(i=0;i<2600;i++){a=Math.random()*TWO;r=(RI+Math.random()*(Ro-RI))*u;x.fillStyle='rgba(70,8,12,'+(.1+Math.random()*.16)+')';x.fillRect(cx+Math.cos(a)*r,cx+Math.sin(a)*r,1+Math.random()*2,1+Math.random()*2)}
x.strokeStyle='#ffd54a';x.lineWidth=.16*u;[RI+.62,Ro-.62].forEach(function(rr){x.beginPath();x.arc(cx,cx,rr*u,0,TWO);x.stroke()});`],
[`m.userData.trk=1;world.add(m)}`,`m.userData.trk=1;world.add(m);
var apr=function(r0,r1,col,em){var mm=new TH.Mesh(new TH.RingGeometry(r0,r1,128,1),new TH.MeshStandardMaterial({color:col,roughness:.9,emissive:col,emissiveIntensity:em}));mm.rotation.x=-Math.PI/2;mm.position.y=.04;world.add(mm)};
apr(Ro+.3,Ro+3.7,0x1f5e45,.16);apr(Ro+3.7,Ro+3.95,0xffd54a,.5);apr(Math.max(2,RI-3.6),RI-.3,0x1f5e45,.16);apr(RI-3.85,RI-3.6,0xffd54a,.5)}`],
[`function bulbTick(){`,`function bulbTick(){if(window.FANS)FANS.tick(tm);`],
/* bỏ hộp quà quanh đường đua (vòng 20 hộp ngoài thảm xanh) – patches.js đã đổi 12 -> 20 nên khớp theo chuỗi sau vá đó */
[`for(k=0;k<20;k++){a=k*TWO/20+.4;r=Ro+3.8+(k%2)*1.6;bgift(`,`for(k=0;k<0;k++){a=k*TWO/20+.4;r=Ro+3.8+(k%2)*1.6;bgift(`]
];
