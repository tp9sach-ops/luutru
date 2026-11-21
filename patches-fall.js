/* PATCHES-FALL (P23) – cọp VẤP TÉ rồi đứng dậy chạy tiếp. Áp sau P22 (loader.js nối window.P23 vào P22).
   Té theo xác suất (cấu hình ở TIGER_FALL bên dưới), cọp trúng quà té xong vẫn về nhất (mkTab chuẩn hóa quãng đường nên giờ về đích không đổi). */
window.TIGER_FALL = {
  base: 0.18,            /* xác suất mỗi cọp té trong 1 ván (0..1) */
  row: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],   /* hệ số nhân theo HÀNG (làn) 1..12: 2 = dễ té gấp đôi, 0 = không bao giờ té. Hàng 1 là hàng đầu tiên theo thứ tự quà */
  maxFalls: 2,           /* tối đa mấy cọp té cùng 1 ván */
  tMin: 3.5,             /* không té trước giây này (sau xuất phát) */
  tEndGuard: 8.5         /* té xong phải còn ít nhất vậy giây trước khi cọp trúng quà về đích (DUR - số này = giây té muộn nhất) */
};
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
function mkTab(f,c1,c2,p1,p2,WS,FT){`],
[`return e*m*(1+(WS||0)*sw)}`,`return e*m*(1+(WS||0)*sw)*fallSpd(t,FT===undefined?-1:FT)}`],
[`var f=[],tab=[],mx=DUR;`,`var f=[],tab=[],mx=DUR,FT=pickFalls(LP.length,wi);LN.forEach(function(l){l.dz=0});`],
[`Math.random()*TWO,Math.random()*TWO,i==wi?.22+Math.random()*.2:0))}`,`Math.random()*TWO,Math.random()*TWO,i==wi?.22+Math.random()*.2:0,FT[i]))}`],
[`plan={W:wi,f:f,tab:tab,mx:mx,t0:performance.now(),r:r,win:0};`,`plan={W:wi,f:f,tab:tab,mx:mx,t0:performance.now(),r:r,win:0,FT:FT};`],
[`mid:i==(LP.length>>1)});`,`mid:i==(LP.length>>1),fall:(plan&&plan.FT&&state=='race'&&plan.FT[i]!==undefined)?plan.FT[i]:-1});`],
/* bụi tung lên đúng lúc cọp chạm đất */
[`l.v=v;pose(l,0,v,dt,i,rt);place(l,i,n,th)});`,`l.v=v;pose(l,0,v,dt,i,rt);place(l,i,n,th);
if(plan&&plan.FT&&state=='race'&&plan.FT[i]>=0&&!l.dz&&rt-plan.FT[i]>.5){l.dz=1;var fo=l.ln.position,fs=Math.sin(l.th),fc=Math.cos(l.th),fq;for(fq=0;fq<26;fq++)emit(PUF,fo.x+fs*(Math.random()-.5)*1.4,.3,fo.z-fc*(Math.random()-.5)*1.4,(Math.random()-.5)*4,.6+Math.random()*2.2,(Math.random()-.5)*4,.7+Math.random()*.6)}});`]
];
