/* flow-patch v1: chèn luồng mới (chọn cửa hàng -> số hóa đơn -> đua -> nhập tên/SĐT) vào game.js. Chạy TRƯỚC loader.js: bọc fetch để thêm các bản vá find-and-replace vào mã game.js vừa tải, rồi loader.js áp tiếp các bản vá của nó. ?debug=1 hiện số bản vá áp được. */
(function(){
var of=window.fetch,X=[
[`$('sp').onclick=go;`,`$('sp').onclick=go;
window.DC={d:function(){return D},pick:function(s){ST=s;ls('st',ST);build();lazy()},img:function(n){return IM[n]},
start:function(hd,cb){if(busy)return;
 if(!P.length)return cb(unkNow()?'Đang tải quà của cửa hàng, vui lòng đợi vài giây rồi bấm lại':'Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác');
 busy=1;
 api('race',{store:ST,hd:hd}).then(function(r){
  window.__dcHd=hd;plan=null;document.body.classList.add('racing');window.scrollTo(0,0);
  unlock();primeRace();auMode('tvc');cb();
  var tk=++cdTok;return intro(tk).then(function(){return tk===cdTok?countdown():0}).then(function(){startRace(r)})
 },function(e){busy=0;var m=e.message||'Lỗi kết nối';cb(m==='Yêu cầu không hợp lệ'?'Máy chủ chưa được cập nhật (quản trị viên cần triển khai lại Apps Script)':m)})
 .catch(function(e){alert(e.message||'Có lỗi xảy ra');location.reload()})}};`],
[`function fin(r){`,`function fin(r){if(window.DCclaim&&window.__dcHd)return window.DCclaim(r,window.__dcHd);`]
];
window.fetch=function(u){var p=of.apply(this,arguments);if(String(u).indexOf('game.js')<0)return p;
 return p.then(function(r){return r.text().then(function(s){var ok=0;X.forEach(function(q){if(s.indexOf(q[0])>=0){ok++;s=s.split(q[0]).join(q[1])}});window.__flowPatch=ok+'/'+X.length;
  if(/[?&]debug=1/.test(location.search)){var d=document.createElement('div');d.style.cssText='position:fixed;left:6px;bottom:6px;z-index:99999;background:#000c;color:#0f0;font:11px monospace;padding:4px';d.textContent='flow-patch '+ok+'/'+X.length;(document.body||document.documentElement).appendChild(d)}
  return new Response(s,{status:200,headers:{'Content-Type':'application/javascript'}})})})};
})();
