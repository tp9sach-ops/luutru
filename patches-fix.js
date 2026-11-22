/* PATCHES-FIX (v41) – nối vào cuối window.P25 (loader.js áp bằng tìm-và-thay lên game.js). Nạp TRƯỚC loader.js trong index.html.
   Lỗi: mới vào trang / chọn cửa hàng, cọp đơ hoặc biến mất ~1 giây không ở tư thế chạy.
   Nguyên nhân (suy luận từ mã, chưa đo trên máy thật): game gọi buildScene() (dựng lại TOÀN BỘ cảnh: gộp hàng trăm vật thể) nhiều lần liên tiếp
   khi mở trang (dữ liệu lưu cache -> dữ liệu mới từ máy chủ -> logo tải xong -> font tải xong), và cọp mới dựng ở tư thế gốc cho tới khung hình kế.
   Sửa: (1) build() bỏ qua việc dựng lại khi danh sách cọp + ảnh quà không đổi; (2) logo tải xong chỉ cần cập nhật texture, không dựng lại cảnh;
   (3) dựng xong đặt tư thế sẵn sàng cho mọi cọp ngay lập tức. */
(function(){
var mine=[
[`.slice(0,MAXL);buildScene();`,`.slice(0,MAXL);var sg0=ST+'|'+LP.map(function(p){return p.id+':'+p.ten+':'+(IM[p.ten]?1:0)}).join(',');if(sg0!==window.__bsg||!LN.length){window.__bsg=sg0;buildScene()}`],
[`try{drawLogo();if(!busy)buildScene()}catch(e){}`,`try{drawLogo()}catch(e){}`],
[`LP.forEach(function(p,i){LN.push(lane(i,n,p))})}`,`LP.forEach(function(p,i){LN.push(lane(i,n,p))});try{LN.forEach(function(l,i){pose(l,0,0,.016,i,0);place(l,i,n,TH0)})}catch(e){}}`]
],cur=[];
try{Object.defineProperty(window,'P25',{configurable:true,get:function(){return cur.concat(mine)},set:function(a){cur=a||[]}})}catch(e){}
})();
