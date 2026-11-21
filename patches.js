/* PATCHES v22 – MỤC 1: camera tự canh khung (cọp luôn nằm giữa, vừa khít, thấy đủ tên quà) + tên quà to rõ.
   Áp bằng find-and-replace lên game.js SAU các vá P của loader.js. Thêm mục mới: chỉ cần thêm cặp [tìm, thay] vào cuối mảng. */
window.P22=[
/* 1. hàm canh khung: tính vị trí từng cọp (theo tiến độ đua), căn tâm theo khung nhìn rồi lùi camera đúng bằng khoảng cần để mọi cọp + tên quà lọt khung */
[`function cam(now,dt){`,`var FZ=null;
function fitCam(t,asp){
var m=LN.length,rc=plan&&(state=='race'||state=='done'),PX=[],PZ=[],q,j,tq,rq,o,cx=0,cz=0,
tv=Math.tan(baseFov*Math.PI/360),th=tv*asp,el=.56,ph=asp<1?.75:.42,YS=[0,5.2,9.2],
a,ux,uz,ce=Math.cos(el),se=Math.sin(el),fx,fy,fz,rx,rz,rl,cux,cuy,cuz,
xmn=1e9,xmx=-1e9,ymn=1e9,ymx=-1e9,sx,sy,D=14,dx,dz,dy,xr,yu,zf,P=[];
for(q=0;q<m;q++){
if(rc){tq=TH0-pr(q,t+.22)*TOTA;rq=RM+lat(q,m);PX[q]=Math.cos(tq)*rq;PZ[q]=Math.sin(tq)*rq}
else{o=LN[q].ln.position;PX[q]=o.x;PZ[q]=o.z}
cx+=PX[q];cz+=PZ[q]}
cx/=m;cz/=m;
a=Math.atan2(cz,cx)-ph;ux=Math.cos(a);uz=Math.sin(a);
fx=-ux*ce;fy=-se;fz=-uz*ce;rx=-fz;rz=fx;rl=Math.sqrt(rx*rx+rz*rz)||1;rx/=rl;rz/=rl;
cux=-rz*fy;cuy=rz*fx-rx*fz;cuz=rx*fy;
for(q=0;q<m;q++)for(j=0;j<3;j++){
dx=PX[q]-cx;dz=PZ[q]-cz;dy=YS[j]-2.8;
xr=dx*rx+dz*rz;yu=dx*cux+dy*cuy+dz*cuz;zf=dx*fx+dy*fy+dz*fz;
P.push([xr,yu,zf]);
if(j<2){xmn=Math.min(xmn,xr);xmx=Math.max(xmx,xr);ymn=Math.min(ymn,yu);ymx=Math.max(ymx,yu)}}
sx=(xmn+xmx)/2;sy=(ymn+ymx)/2+.5;
P.forEach(function(w){D=Math.max(D,(Math.abs(w[0]-sx)+1.8)/(.86*th)-w[2],(Math.abs(w[1]-sy)+.9)/(.8*tv)-w[2])});
D=Math.min(D,130);
var tx=cx+rx*sx+cux*sy,ty=2.8+cuy*sy,tz=cz+rz*sx+cuz*sy;
return{p:[tx-fx*D,ty-fy*D,tz-fz*D],l:[tx,ty,tz]}}
function cam(now,dt){`],
/* 2. dùng canh khung cho mọi trạng thái trừ intro và cảnh quay cọp thắng */
[`baseFov=asp<1?62:(asp>2.2?34:44);`,`if(state!='intro'&&!(plan&&(state=='race'||state=='done')&&t>=DUR+.8)&&LN.length){FZ=fitCam(t,asp);p=FZ.p;l=FZ.l;zt=1;k=state=='race'?7:4;K=1;sh=(state=='race'&&t>DUR-2.4&&t<DUR+.8)?.006:0}baseFov=asp<1?62:(asp>2.2?34:44);`],
/* 3. cảnh quay cọp thắng bắt đầu từ đúng vị trí camera đang đứng (không giật) */
[`p=mw(WL(CAMA,3,12+hw*.9,hw*1.25+19),pO,u2);l=mw(WL(CAMA,2,.6,0),lO,u2)`,`p=mw(FZ?FZ.p:WL(CAMA,3,12+hw*.9,hw*1.25+19),pO,u2);l=mw(FZ?FZ.l:WL(CAMA,2,.6,0),lO,u2)`],
/* 4. tên quà: hiện cả lúc chờ + lúc đua, to hơn, chữ đậm hơn, hạ thấp sát đầu cọp */
[`px=Math.max(28,Math.min(44,H*.05))`,`px=Math.min(Math.max(38,Math.min(68,H*.07)),Math.max(34,(fw||800)*(LN.length>6?.1:.14)))`],
[`a=rc?Math.max(0,Math.min(1,(rt-1.4)/1.2)):0`,`a=state=='intro'?0:(rc?Math.max(0,Math.min(1,(rt-.4)/.8)):1)`],
[`x.font='bold 46px "Baloo 2",sans-serif'`,`x.font='800 52px "Be Vietnam Pro","Baloo 2",sans-serif'`],
[`(j-(L.length-1)/2)*48`,`(j-(L.length-1)/2)*54`],
[`if(s.length<=14)return[s]`,`if(s.length<=12)return[s]`],
[`sp.position.set(0,6.1+(i%3)*.9,0)`,`sp.position.set(0,5.7+(i%3)*.8,0)`]
];
