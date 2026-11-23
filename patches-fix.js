/* PATCHES-FIX (v48) – nối vào cuối window.P25 (loader.js áp bằng tìm-và-thay lên game.js). Nạp TRƯỚC loader.js trong index.html.
   v48 (giảm giật lag): (1) độ nét tối đa 1,5 (màn lớn 1,25) thay vì 2: màn điện thoại 3x vẽ ít điểm ảnh hơn nhiều; (2) cọp đua + cọp khán giả bật frustumCulled (trước đây luôn vẽ cả 24 con 24.000 tam giác dù nằm ngoài màn hình), hình cầu bao rộng 5 đơn vị để không bị cắt nhầm.
   v41 (lỗi mới vào trang cọp đơ/mất ~1 giây): game gọi buildScene() (dựng lại TOÀN BỘ cảnh) nhiều lần liên tiếp khi mở trang (cache -> dữ liệu mới -> logo -> font), cọp mới dựng ở tư thế gốc cho tới khung kế.
   Sửa: (1) build() bỏ qua dựng lại khi danh sách cọp + ảnh quà không đổi; (2) logo tải xong chỉ cập nhật texture; (3) dựng xong đặt tư thế sẵn sàng ngay.
   v42: móc finale.js: DC.x() lấy biến trong game; FIN.tick() mỗi khung hình (sau relab); cọp trên bục dùng tư thế ăn mừng; bảng chúc mừng chờ hết cảnh bục. */
(function(){
var mine=[
[`.slice(0,MAXL);buildScene();`,`.slice(0,MAXL);var sg0=ST+'|'+LP.map(function(p){return p.id+':'+p.ten+':'+(IM[p.ten]?1:0)}).join(',');if(sg0!==window.__bsg||!LN.length){window.__bsg=sg0;buildScene()}`],
[`try{drawLogo();if(!busy)buildScene()}catch(e){}`,`try{drawLogo()}catch(e){}`],
[`LP.forEach(function(p,i){LN.push(lane(i,n,p))})}`,`LP.forEach(function(p,i){LN.push(lane(i,n,p))});try{LN.forEach(function(l,i){pose(l,0,0,.016,i,0);place(l,i,n,TH0)})}catch(e){}}`],
/* v42: lấy biến trong game cho finale.js */
[`window.DC={d:function(){return D},`,`window.DC={x:function(){return{S:S,C:C,LN:LN,LP:LP,plan:plan,state:state,emit:emit,PUF:PUF,CNF:CNF,CCOL:CCOL,TH0:TH0,DUR:DUR,TOTA:TOTA,RM:RM,TX:TX,fw:fw,fh:fh,beep:beep,TV:TV,BT:BT,BB:BB,hideTvc:hideTvc}},d:function(){return D},`],
[`cam(now,dt);auTick(dt);relab();`,`cam(now,dt);auTick(dt);relab();try{window.FIN&&window.FIN.tick(now,dt)}catch(e){}`],
[`win:(plan&&i==plan.W&&rt>DUR+1.2)?rt-DUR-1.2:-1,`,`win:(window.FIN&&window.FIN.pw(i)>=0)?window.FIN.pw(i):((plan&&i==plan.W&&rt>DUR+1.2)?rt-DUR-1.2:-1),`],
[`setTimeout(function(){fin(plan.r)},3400)}`,`setTimeout(function(){fin(plan.r)},window.FIN?window.FIN.finDelay():3400)}`],
/* v48: giảm giật lag */
[`w*h>900000?1.5:2`,`w*h>400000?1.25:1.5`],
[`tg.g.scale.setScalar(tg.rig?1.1:1.18);ln.add(tg.g);`,`tg.g.scale.setScalar(tg.rig?1.1:1.18);ln.add(tg.g);if(tg.mesh){tg.mesh.frustumCulled=true;if(window.TR&&TR.geo&&TR.geo.boundingSphere)TR.geo.boundingSphere.radius=5}`],
[`tg.g.scale.setScalar(1);world.add(tg.g)`,`tg.g.scale.setScalar(1);if(tg.mesh)tg.mesh.frustumCulled=true;world.add(tg.g)`]
],cur=[];
try{Object.defineProperty(window,'P25',{configurable:true,get:function(){return cur.concat(mine)},set:function(a){cur=a||[]}})}catch(e){}
})();
