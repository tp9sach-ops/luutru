/* PATCHES v22 – MỤC 1: camera tự canh khung (cọp luôn nằm giữa, vừa khít, thấy đủ tên quà) + tên quà to rõ. MỤC 4: nhịp đua hồi hộp, vượt mặt tự nhiên. MỤC 5: quà hết (0%) vẫn có cọp trên đường đua nhưng không bao giờ trúng. MỤC 6: hình quà hiện phía trên bảng tên quà (v2: ô vuông nhỏ). MỤC 7: nhãn "Hóa đơn từ 155k". MỤC 8: xuất phát chạy luôn (tốc độ vào đà ngay, không đứng đơ rồi bị kéo); tư thế sẵn sàng nằm ở tiger/tiger-runtime.js. MỤC 9: cọp to hơn, hình quà nhỏ, logo đích nâng cao, nhạc đua không ngắt khi về đích. MỤC 10: thêm nhiều vật phẩm ĐỎ Noel vào cảnh đua (không đổi nền). MỤC 11: sửa logo bị cắt còn 1/4 (canvas logo bị phóng 2x), tên quà nhỏ lại, camera ôm sát cọp.
   Áp bằng find-and-replace lên game.js SAU các vá P của loader.js. Thêm mục mới: chỉ cần thêm cặp [tìm, thay] vào cuối mảng. */
window.P22=[
/* 1. hàm canh khung: tính vị trí từng cọp (theo tiến độ đua), căn tâm theo khung nhìn rồi lùi camera đúng bằng khoảng cần để mọi cọp + tên quà (+ hình quà nếu có) lọt khung */
[`function cam(now,dt){`,`var FZ=null;
function fitCam(t,asp){
var m=LN.length,rc=plan&&(state=='race'||state=='done'),PX=[],PZ=[],q,j,tq,rq,o,cx=0,cz=0,
tv=Math.tan(baseFov*Math.PI/360),th=tv*asp,el=.56,ph=asp<1?.75:.42,YS=[0,5.2,(LN.some(function(l){return l.sp&&l.sp.userData&&l.sp.userData.hf})?10.6:9.2)],
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
P.forEach(function(w){D=Math.max(D,(Math.abs(w[0]-sx)+1.2)/(.94*th)-w[2],(Math.abs(w[1]-sy)+.5)/(.88*tv)-w[2])});
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
[`sp.position.set(0,6.1+(i%3)*.9,0)`,`sp.position.set(0,5.7+(i%3)*.8,0)`],
/* MỤC 4 – nhịp đua hồi hộp. Tốc độ mỗi cọp = 3 sóng sin chậm chồng nhau (chu kỳ ~3-6 s, mượt, không bậc thang) nên cọp lúc dẫn lúc tụt, vượt mặt qua lại;
   mkTab vẫn chuẩn hóa để cọp về đích đúng giờ định sẵn (cọp thắng luôn về trước). Cọp thắng có thêm cú nước rút cuối (WS) nên hay "lội ngược dòng". */
[`function mkTab(f,c1,c2,p1,p2){`,`function mkTab(f,c1,c2,p1,p2,WS){`],
[`function sp(t){var a=Math.min(1,t/2.4);return(a*a*(3-2*a)*.9+.1*a)*(1+.1*Math.sin(TWO*c1*t+p1)+.06*Math.sin(TWO*c2*t+p2))}`,`function sp(t){var a=Math.min(1,t/2.4),e=a*a*(3-2*a)*.9+.1*a,u=Math.max(0,Math.min(1,(t-(f-7))/6)),sw=u*u*(3-2*u),m=1+.36*Math.sin(TWO*c1*3.2*t+p1)+.2*Math.sin(TWO*c2*2.2*t+p2)+.12*Math.sin(TWO*(c1+c2)*1.7*t+p1-p2);return e*m*(1+(WS||0)*sw)}`],
[`tab.push(mkTab(fi,.05+Math.random()*.04,.11+Math.random()*.06,Math.random()*TWO,Math.random()*TWO))}`,`tab.push(mkTab(fi,.05+Math.random()*.04,.11+Math.random()*.06,Math.random()*TWO,Math.random()*TWO,i==wi?.22+Math.random()*.2:0))}`],
/* MỤC 5 – quà hết (0%) vẫn xuất hiện trên đường đua. Máy chủ gửi thêm D.show[cửa hàng] = mọi quà đang bật (kể cả hết kho / tỷ lệ 0%); D.prizes[cửa hàng] vẫn chỉ gồm quà còn quay được
   (dùng để kiểm tra cửa hàng hết quà và để khách chỉ trúng quà còn kho). Cửa hàng không còn quà nào quay được thì giữ nguyên hành vi cũ (báo hết quà). Máy chủ cũ không có D.show thì dùng danh sách cũ. */
[`P=(D&&D.prizes[ST])||[];LP=P.slice(0,MAXL);buildScene();`,`P=(D&&D.prizes[ST])||[];LP=(P.length&&D.show&&D.show[ST]&&D.show[ST].length?D.show[ST]:P).slice(0,MAXL);buildScene();`],
/* MỤC 6 (v2, mục 9) – hình quà hiện phía TRÊN bảng tên quà, nay là ô VUÔNG NHỎ (96x96 trên bảng tên rộng 320) viền vàng. labelI() dựng sprite cao hơn: bảng tên giữ nguyên ở dưới, ô hình ở trên giữa, ảnh lấy từ IM[tên quà] (ảnh quản trị tải lên tab AnhQua).
   Quà chưa có ảnh thì vẫn là bảng tên như cũ. relab() nhân chiều cao sprite theo sp.userData.hf để bảng tên không đổi cỡ. */
[`function label(txt,col,w,h){`,`function labelI(txt,col,w,h,src){
var sp=label(txt,col,w,h);if(!src)return sp;
var pl=sp.material.map.image,c=document.createElement('canvas'),W=320,H=210,x=c.getContext('2d'),im=new Image(),tx=new TH.CanvasTexture(c),bx=112,by=4,bw=96,bh=96,r=16;
c.width=W;c.height=H;
function rr(){x.beginPath();x.moveTo(bx+r,by);x.arcTo(bx+bw,by,bx+bw,by+bh,r);x.arcTo(bx+bw,by+bh,bx,by+bh,r);x.arcTo(bx,by+bh,bx,by,r);x.arcTo(bx,by,bx+bw,by,r);x.closePath()}
function dr(g){x.clearRect(0,0,W,H);x.drawImage(pl,0,100,W,110);
if(g){var s=Math.min((bw-12)/g.width,(bh-12)/g.height);
x.save();rr();x.fillStyle='#fffaf0';x.fill();x.clip();x.drawImage(g,bx+(bw-g.width*s)/2,by+(bh-g.height*s)/2,g.width*s,g.height*s);x.restore();
rr();x.lineWidth=6;x.strokeStyle='#ffd05a';x.stroke()}}
dr(0);tx.needsUpdate=true;
sp.material.map.dispose();sp.material.map=tx;sp.material.needsUpdate=true;sp.userData.hf=H/110;
im.onload=function(){try{dr(im);tx.needsUpdate=true}catch(e){}};im.src=src;return sp}
function label(txt,col,w,h){`],
[`var sp=label(p.ten,col,2.9,1);`,`var sp=labelI(p.ten,col,2.9,1,IM[p.ten]);`],
[`l.sp.scale.set(Math.max(h*2.9,.0001),Math.max(h,.0001),1);`,`l.sp.scale.set(Math.max(h*2.9,.0001),Math.max(h*(l.sp.userData.hf||1),.0001),1);`],
/* MỤC 7 – dòng "Hóa đơn từ 155k được tham gia đường đua": game.js apply() trước đây ghi đè #mn bằng MinTien của máy chủ (199.000), giờ cố định 155k. Kiểu nhãn vàng nằm trong skin2.css. */
[`$('mn').textContent=money(c.MinTien)`,`$('mn').textContent='155k'`],
/* MỤC 8 – xuất phát chạy luôn, không đơ rồi bị kéo. Trước: tốc độ vị trí vào đà theo smoothstep 2.4 s từ 0 (đầu đua gần như đứng yên) và 3 sóng nhịp đua có biên độ đầy đủ ngay giây 0, nên chân cọp (đọc theo vận tốc) đứng đơ rồi vị trí mới kéo đi.
   Giờ: tốc độ khởi đầu = 55% tốc độ chạy, tăng mượt lên 100% trong 1.2 s; biên độ sóng vượt mặt tăng dần trong 2.5 s đầu. mkTab vẫn chuẩn hóa nên cọp về đích đúng giờ. Phần chân chạy ngay + tư thế sẵn sàng: tiger/tiger-runtime.js. */
[`var a=Math.min(1,t/2.4),e=a*a*(3-2*a)*.9+.1*a,u=`,`var a=Math.min(1,t/1.2),e=.55+.45*a*a*(3-2*a),g0=Math.min(1,t/2.5),u=`],
[`m=1+.36*Math.sin(TWO*c1*3.2*t+p1)`,`m=1+g0*(.36*Math.sin(TWO*c1*3.2*t+p1)`],
[`+.12*Math.sin(TWO*(c1+c2)*1.7*t+p1-p2);return e*m`,`+.12*Math.sin(TWO*(c1+c2)*1.7*t+p1-p2));return e*m`],
/* MỤC 9 – (a) nhạc đua liền mạch: lúc cọp về đích (celebrate) trước đây chuyển sang chế độ 'win' làm nhạc đua mờ dần rồi dừng, nhạc nền vào thay; giờ giữ nhạc đua chạy tiếp (không đổi chế độ, không phát lại từ đầu).
   (b) logo đích (biển 9 SẠCH sau cổng) nâng cao hơn để cây phía sau/trước không che mất một nửa. */
[`snow();AU.hold=0;auMode('win')`,`snow();AU.hold=0;auMode('race')`],
[`bn.position.set(gp[0],13.2,gp[2])`,`bn.position.set(gp[0],15.6,gp[2])`],
/* MỤC 10 – thêm vật phẩm ĐỎ Noel vào cảnh đua, KHÔNG đổi nền/đường đua: (a) bóng trang trí trên cây thông: 3/5 là đỏ; (b) bóng đèn nhấp nháy: 3/5 là đỏ, còn lại vàng/trắng;
   (c) hộp quà ngoài đường đua: 12 -> 20 hộp, phần lớn đỏ ruy băng vàng, xen hộp trắng ruy băng đỏ (trước là xanh lá/đỏ xen kẽ). */
[`var ORN=[0xd8132f,0xffd54a,0x2f6fd8,0xffffff]`,`var ORN=[0xd8132f,0xd8132f,0xffd54a,0xd8132f,0xffffff]`],
[`var BUL=[0xff3b3b,0xffd54a,0x4fc3f7,0x7cfc8a,0xff8ad8]`,`var BUL=[0xff3b3b,0xffd54a,0xff3b3b,0xffffff,0xff3b3b]`],
[`for(k=0;k<12;k++){a=k*TWO/12+.4;r=Ro+3.8+(k%2)*1.6;bgift(`,`for(k=0;k<20;k++){a=k*TWO/20+.4;r=Ro+3.8+(k%2)*1.6;bgift(`],
[`k%2?0x1f8f55:0xd32f2f,k%2?0xffffff:0xffd54a,k)}`,`k%3?0xd32f2f:0xffffff,k%3?0xffd54a:0xd32f2f,k)}`],
/* MỤC 11 – (a) LỖI LOGO: drawLogo() có nhánh vẽ dự phòng gọi x.setTransform(2,0,0,2,0,0) khi ảnh logo chưa tải; phép phóng 2x này KHÔNG được đặt lại nên các lần vẽ sau (ảnh tải xong / font tải xong) vẽ ảnh to gấp đôi, canvas 256 chỉ còn 1/4 góc trên trái của logo
   (đúng như ảnh chụp: biển đích và huy hiệu bị cắt thành 1/4). Sửa: đặt lại ma trận về đơn vị trước mỗi lần vẽ.
   (b) tên quà nhỏ lại (cao ~3.8% màn hình thay vì 7%, tối đa ~40px) để cọp là trọng tâm; (c) camera ôm sát hơn: góc nhìn dọc màn hình hẹp (ph .75 -> .5, hàng cọp xuôi hướng nhìn hơn nên hẹp lại), ngang .42 -> .35; chừa chiều cao nhãn thấp hơn. */
[`var x=LOGOC.getContext('2d');x.clearRect(0,0,256,256);`,`var x=LOGOC.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,256,256);`],
[`px=Math.min(Math.max(38,Math.min(68,H*.07)),Math.max(34,(fw||800)*(LN.length>6?.1:.14)))`,`px=Math.min(Math.max(24,Math.min(40,H*.038)),Math.max(22,(fw||800)*(LN.length>6?.065:.09)))`],
[`ph=asp<1?.75:.42`,`ph=asp<1?.5:.35`],
[`?10.6:9.2)]`,`?9:7.6)]`]
];
