/* PATCHES-FALL (P23) – cọp VẤP TÉ rồi đứng dậy chạy tiếp. Áp sau P22 (loader.js nối window.P23 vào P22).
   Té theo xác suất (cấu hình ở TIGER_FALL bên dưới), cọp trúng quà té xong vẫn về nhất (mkTab chuẩn hóa quãng đường nên giờ về đích không đổi). */
window.TIGER_FALL = {
  base: 0.18,            /* xác suất mỗi cọp té trong 1 ván (0..1) */
  row: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],   /* hệ số nhân theo HÀNG (làn) 1..12: 2 = dễ té gấp đôi, 0 = không bao giờ té. Hàng 1 là hàng đầu tiên theo thứ tự quà */
  maxFalls: 2,           /* tối đa mấy cọp té cùng 1 ván */
  tMin: 3.5,             /* không té trước giây này (sau xuất phát) */
  tEndGuard: 8.5         /* té xong phải còn ít nhất vậy giây trước khi cọp trúng quà về đích (DUR - số này = giây té muộn nhất) */
};
/* NHỊP ĐUA (v16): tốc độ mỗi cọp = nhiễu mượt ngẫu nhiên (mỗi cọp một nhịp riêng, không tuần hoàn) + vài cú bứt ngắn, có giới hạn độ dốc.
   amp = biên độ nhiễu (phần của tốc độ TB, 0.22 ≈ dao động hiệu dụng ~10%); burst = biên độ cú bứt; nb = số cú bứt tối đa/cọp/ván; kmin,kmax = khoảng cách nút nhiễu (giây, lớn = chậm/êm);
   amax = độ dốc tối đa của hệ số tốc độ (đơn vị: tốc độ TB mỗi giây); win = lợi thế tốc độ tăng dần tới giây 8 của cọp trúng quà (ĐỂ 0: đặt dương làm cọp trúng quà tụt đầu đua do mkTab chuẩn hóa quãng đường); spr = hệ số nhân cú nước rút cuối của cọp trúng quà (nhỏ = ít tụt giữa chặng).
   LƯU Ý TÊN BIẾN: trong game.js đã có biến PC (các hộp hạt) nên cấu hình nhịp trong game tên là TPC, KHÔNG đặt PC. */
window.TIGER_PACE = { amp: .22, burst: .18, nb: 3, kmin: 1.1, kmax: 2.6, amax: .5, win: 0, spr: .3 };
window.P23=[
/* hệ số tốc độ khi té: chậm dần lúc vấp, gần đứng yên lúc nằm, tăng lại khi đứng dậy */
[`function mkTab(f,c1,c2,p1,p2,WS){`,`var FSK=[[0,1],[.25,.6],[.6,.3],[1,.08],[2,.03],[2.6,.12],[3.2,.55],[3.9,1]];
function fallSpd(t,F){if(F<0)return 1;var u=t-F,i;if(u<=0)return 1;if(u>=3.9)return 1;
for(i=0;i<FSK.length-1;i++)if(u<=FSK[i+1][0]){var a=FSK[i],b=FSK[i+1],x=(u-a[0])/(b[0]-a[0]);x=x*x*(3-2*x);return a[1]+(b[1]-a[1])*x}return 1}
function pickFalls(n,wi){var C=window.TIGER_FALL||{},o=[],i,c=[],p,tm1,tmax,cnt=0;
for(i=0;i<n;i++)o.push(-1);
for(i=0;i<n;i++){p=(C.base==null?.18:C.base)*((C.row&&C.row[i]!=null)?C.row[i]:1);if(Math.random()<p)c.push(i)}
c.sort(function(){return Math.random()-.5});
tm1=C.tMin==null?3.5:C.tMin;tmax=DUR-(C.tEndGuard==null?8.5:C.tEndGuard);
c.forEach(function(i){if(cnt>=(C.maxFalls==null?2:C.maxFalls))return;o[i]=tm1+Math.random()*Math.max(0,tmax-tm1);cnt++});
return o}
var TPC=window.TIGER_PACE||{amp:.22,burst:.18,nb:3,kmin:1.1,kmax:2.6,amax:.5,win:0,spr:.3};
function mkPace(f){var dt=1/60,N=Math.ceil(f/dt)+3,A=new Float32Array(N),i,t,k0,k1,x,r=[],tt=-Math.random()*TPC.kmax,nbr,b,bt,bw,ba,u,v,prev,lim=TPC.amax*dt;
while(tt<f+TPC.kmax){r.push([tt,Math.random()*2-1]);tt+=TPC.kmin+Math.random()*(TPC.kmax-TPC.kmin)}
k0=0;for(i=0;i<N;i++){t=i*dt;while(k0<r.length-2&&r[k0+1][0]<=t)k0++;k1=k0+1;x=(t-r[k0][0])/(r[k1][0]-r[k0][0]);x=x*x*(3-2*x);A[i]=TPC.amp*(r[k0][1]+(r[k1][1]-r[k0][1])*x)}
nbr=Math.floor(Math.random()*(TPC.nb+1));
for(b=0;b<nbr;b++){bt=3+Math.random()*Math.max(.5,f-9);bw=.45+Math.random()*.4;ba=TPC.burst*(.6+Math.random()*.8);
for(i=0;i<N;i++){t=i*dt;u=(t-bt)/bw;if(u>0&&u<1){v=Math.sin(Math.PI*u);A[i]+=ba*v*v}else if(u>=1&&u<3.2){v=Math.sin(Math.PI*(u-1)/2.2);A[i]-=ba*.3*v*v}}}
prev=0;for(i=0;i<N;i++){x=A[i]-prev;if(x>lim)x=lim;else if(x<-lim)x=-lim;prev+=x;A[i]=prev}
return function(t){var q=t/dt,k=q|0;if(k<0)return 0;if(k>=N-1)return A[N-1];return A[k]+(A[k+1]-A[k])*(q-k)}}
function mkTab(f,c1,c2,p1,p2,WS,FT){var nz=mkPace(f);`],
[`m=1+g0*(.36*Math.sin(TWO*c1*3.2*t+p1)+.2*Math.sin(TWO*c2*2.2*t+p2)+.12*Math.sin(TWO*(c1+c2)*1.7*t+p1-p2));return e*m*(1+(WS||0)*sw)}`,`m=1+g0*nz(t);return e*m*(1+(WS||0)*sw*TPC.spr+(WS?TPC.win*Math.min(1,t/8):0))*fallSpd(t,FT===undefined?-1:FT)}`],
[`var f=[],tab=[],mx=DUR;`,`var f=[],tab=[],mx=DUR,FT=pickFalls(LP.length,wi);LN.forEach(function(l){l.dz=0});`],
[`Math.random()*TWO,Math.random()*TWO,i==wi?.22+Math.random()*.2:0))}`,`Math.random()*TWO,Math.random()*TWO,i==wi?.22+Math.random()*.2:0,FT[i]))}`],
[`plan={W:wi,f:f,tab:tab,mx:mx,t0:performance.now(),r:r,win:0};`,`plan={W:wi,f:f,tab:tab,mx:mx,t0:performance.now(),r:r,win:0,FT:FT};`],
[`mid:i==(LP.length>>1)});`,`mid:i==(LP.length>>1)&&state=='intro'&&performance.now()-introT0<2300,fall:(plan&&plan.FT&&state=='race'&&plan.FT[i]!==undefined)?plan.FT[i]:-1});`],
/* bụi tung lên đúng lúc cọp chạm đất */
[`l.v=v;pose(l,0,v,dt,i,rt);place(l,i,n,th)});`,`l.v=v;pose(l,0,v,dt,i,rt);place(l,i,n,th);
if(plan&&plan.FT&&state=='race'&&plan.FT[i]>=0&&!l.dz&&rt-plan.FT[i]>.5){l.dz=1;var fo=l.ln.position,fs=Math.sin(l.th),fc=Math.cos(l.th),fq;for(fq=0;fq<26;fq++)emit(PUF,fo.x+fs*(Math.random()-.5)*1.4,.3,fo.z-fc*(Math.random()-.5)*1.4,(Math.random()-.5)*4,.6+Math.random()*2.2,(Math.random()-.5)*4,.7+Math.random()*.6)}});`],
/* v17 */
[`l.sp.visible=a>.01&&(!end||(plan&&i==plan.W))})}`,`l.sp.visible=a>.01&&(!end||(plan&&i==plan.W))});
/* v17: GIÃN NHÃN – hiện ĐỦ mọi nhãn, nhãn chồng nhau trên màn hình thì đẩy lên (center.y) cho khỏi che nhau */
var Wd=fw||800,Hd=fh||600,L2=[],P2=[],q2,a2,b2,sh,ok,it,t2;
LN.forEach(function(l,i){var s=l.sp;if(!s||!s.visible)return;s.getWorldPosition(RV);RV.project(C);L2.push({s:s,i:i,x:(RV.x*.5+.5)*Wd,y:(.5-RV.y*.5)*Hd,w:px*2.9,h:px*(s.userData.hf||1)})});
L2.sort(function(a,b){return b.y-a.y||a.i-b.i});
L2.forEach(function(e){sh=0;for(it=0;it<14;it++){ok=1;for(q2=0;q2<P2.length;q2++){a2=P2[q2];if(Math.abs(e.x-a2.x)<(e.w+a2.w)/2&&e.y-e.h/2-sh<a2.y+a2.h/2-a2.sh&&e.y+e.h/2-sh>a2.y-a2.h/2-a2.sh){sh=e.y+e.h/2-(a2.y-a2.h/2-a2.sh)+3;ok=0}}if(ok)break}
sh=Math.min(sh,e.h*7);e.sh=sh;P2.push(e);t2=.5-sh/e.h;b2=e.s.userData.cy===undefined?.5:e.s.userData.cy;b2+=(t2-b2)*.3;e.s.userData.cy=b2;e.s.center.set(.5,b2)})}`]
];
