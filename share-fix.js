/* v44: SỬA LỖI chia sẻ FB hiện thẻ link "gstatic.com - Error 404": trước đây link chia sẻ lấy từ document.referrer, trong khung Google Sites referrer là địa chỉ gstatic.com nên bị 404. Nay dùng link cố định SHARE_URL. Ảnh tải về tên duongduaquagiangsinh.jpg.
   v42: KHÔNG còn đăng nhập Facebook (không lấy UID nữa). Màn chúc mừng: ảnh ghép (khoảnh khắc chạm đích + bục vinh quang 1-2-3 từ finale.js) + nút CHIA SẺ LÊN FACEBOOK (1 chạm): sao chép sẵn caption + hashtag, mở menu chia sẻ của máy kèm ảnh (Android/iOS), khách chọn Facebook rồi dán caption và đăng. Máy/khung không hỗ trợ menu chia sẻ (vd khung nhúng Google Sites): tải ảnh + mở trang chia sẻ Facebook có sẵn caption. Dự phòng bên dưới: nút nhập Họ tên + SĐT để nhân viên trao quà (claim như cũ). */
try{window.CFG=window.CFG||{};window.CFG.FB_APP_ID=''}catch(e){}
/* v34: máy chủ cũ đòi họ tên -> claim không có tên thì tự thêm ten='Khách <4 số cuối>'. */
(function(){var a0=window.api;if(typeof a0==='function'&&!a0.__v34){window.api=function(a,d){if(a==='claim'&&d&&!d.fbt&&!d.ten&&d.sdt)d=Object.assign({},d,{ten:'Khách '+String(d.sdt).slice(-4)});return a0.call(this,a,d)};window.api.__v34=1}})();
(function(){
var HASH='#9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh';
var SHARE_URL='https://www.baocaonoibo.io.vn/duacop',FILE='duongduaquagiangsinh.jpg';
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function loadImg(src){return new Promise(function(ok){if(!src)return ok(null);var im=new Image();im.onload=function(){ok(im)};im.onerror=function(){ok(null)};im.src=src})}
function cover(x,im,X,Y,W,H){var k=Math.max(W/im.width,H/im.height),w=im.width*k,h=im.height*k;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.drawImage(im,X+(W-w)/2,Y+(H-h)/2,w,h);x.restore()}
/* ảnh chia sẻ 1080x1350: trên = khoảnh khắc chạm đích, dưới = bục vinh quang 1-2-3, dải chữ + hashtag */
function mkCollage(prize){
 var sn=(window.FIN&&window.FIN.snaps)||{};
 return Promise.all([loadImg(sn.fin),loadImg(sn.pod),loadImg(window.__snap)]).then(function(a){
  try{
   var fin=a[0],pod=a[1],any=a[2],W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),g;
   g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#145a41');g.addColorStop(1,'#06261b');x.fillStyle=g;x.fillRect(0,0,W,H);
   var top=fin||any,bot=pod;
   if(top&&bot){cover(x,top,0,0,W,660);cover(x,bot,0,664,W,686);x.fillStyle='#ffd05a';x.fillRect(0,658,W,8)}
   else if(top||bot){cover(x,top||bot,0,0,W,H)}
   else{x.fillStyle='#ffd05a';x.textAlign='center';x.font='900 90px "Be Vietnam Pro",sans-serif';x.fillText('🐯 VỀ NHẤT!',W/2,H/2)}
   g=x.createLinearGradient(0,0,0,150);g.addColorStop(0,'rgba(5,30,22,.9)');g.addColorStop(1,'rgba(5,30,22,0)');x.fillStyle=g;x.fillRect(0,0,W,150);
   g=x.createLinearGradient(0,H-300,0,H);g.addColorStop(0,'rgba(5,30,22,0)');g.addColorStop(1,'rgba(5,30,22,.94)');x.fillStyle=g;x.fillRect(0,H-300,W,300);
   x.textAlign='center';x.fillStyle='#ffe08a';x.font='800 44px "Be Vietnam Pro",sans-serif';x.fillText('9 SẠCH · ĐUA CỌP GIÁNG SINH',W/2,70);
   x.fillStyle='#fff';x.font='900 72px "Be Vietnam Pro",sans-serif';x.shadowColor='#000b';x.shadowBlur=10;x.fillText('VỀ NHẤT! '+String(prize||'').slice(0,22),W/2,H-120);x.shadowBlur=0;
   x.fillStyle='#ffd05a';x.font='700 34px "Be Vietnam Pro",sans-serif';x.fillText('#9sach #banhsaurieng9sach #duacop',W/2,H-60);
   return new Promise(function(ok){c.toBlob(function(b){ok(b)},'image/jpeg',.9)})
  }catch(e){return null}})}
function copyText(t){
 try{var ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,t.length);document.execCommand('copy');ta.remove()}catch(e){}
 try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(function(){})}catch(e){}}
window.DCclaim=function(r,hd){
 var rs=$('rs');if(!rs)return;rs.hidden=false;var b=rs.querySelector('.box'),blob=null,
  cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+r.ten+'! 🐯🎄\n'+HASH,
  url=SHARE_URL;
 b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2><p>Đang chuẩn bị ảnh chiến thắng…</p><h1>"+esc(r.ten)+"</h1>";
 mkCollage(r.ten).then(function(bl){blob=bl;view()});
 function view(){
  var u=blob?URL.createObjectURL(blob):'';
  b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2>"+(u?"<img src='"+u+"' alt='' style='width:100%;max-width:330px;border-radius:14px'>":"")+"<p>Cọp của bạn đã đội quà về đích</p><h1>"+esc(r.ten)+"</h1><p id='se' class='ge'></p>"+
   "<button id='sb2' class='btn' type='button' style='background:#1877f2;color:#fff'>📣 CHIA SẺ LÊN FACEBOOK</button>"+
   "<p style='font-size:13px;margin:6px 0 10px'>Bấm 1 lần: caption + hashtag được sao chép sẵn, ảnh gửi kèm. Chọn Facebook, dán caption rồi bấm Đăng.</p>"+
   "<button id='tg' class='btn' type='button' style='background:#fff;color:#7a0a1c;border:2px solid #d8132f'>🎁 Nhập tên &amp; SĐT để nhận quà</button>"+
   "<div id='fm' hidden><div class='fm'><input id='cn' type='text' maxlength='60' placeholder='Họ và tên' autocomplete='name'><input id='cp' type='tel' inputmode='numeric' maxlength='11' placeholder='Số điện thoại' autocomplete='tel'></div><p id='ce' class='ge'></p><button id='cb' class='btn' type='button'>🎁 NHẬN QUÀ</button></div>"+
   "<button id='sx' class='btn' type='button' style='background:#6b7280;margin-top:8px'>Đóng</button>";
  $('sx').onclick=function(){location.reload()};
  $('sb2').onclick=doShare;
  $('tg').onclick=function(){$('fm').hidden=!$('fm').hidden};
  $('cb').onclick=doClaim}
 function viaLink(){
  var e=$('se'),fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&quote='+encodeURIComponent(cap)+'&hashtag='+encodeURIComponent('#9sach'),w=null;
  if(blob){try{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=FILE;document.body.appendChild(a);a.click();a.remove()}catch(x){}}
  try{w=window.open(fb,'_blank')}catch(x){}
  e.innerHTML='Đã sao chép caption'+(blob?' và tải ảnh về máy':'')+'. '+(w?'':'<a href="'+fb+'" target="_blank" rel="noopener" style="color:#1877f2;font-weight:800">Bấm đây để mở Facebook</a>. ')+'Trên Facebook: đính kèm ảnh vừa tải (hoặc giữ ảnh ở trên để lưu), dán caption rồi đăng.'}
 function doShare(){
  var e=$('se');copyText(cap);
  var f=null,can=false;
  try{if(blob)f=new File([blob],FILE,{type:'image/jpeg'})}catch(x){}
  try{can=!!(f&&navigator.share&&navigator.canShare&&navigator.canShare({files:[f]}))}catch(x){}
  if(can){
   e.textContent='Đã sao chép caption. Chọn Facebook, dán caption rồi bấm Đăng.';
   navigator.share({files:[f],text:cap}).catch(function(x){if(x&&x.name==='AbortError')return;viaLink()});return}
  viaLink()}
 function doClaim(){
  var ten=$('cn').value.trim().replace(/\s+/g,' '),sdt=$('cp').value.replace(/[^0-9]/g,''),e=$('ce'),btn=$('cb');
  if(ten.length<2){e.textContent='Vui lòng nhập họ tên';return}
  if(!/^0[0-9]{9}$/.test(sdt)){e.textContent='Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';return}
  e.textContent='';btn.disabled=true;btn.textContent='⏳ Đang gửi…';
  function okk(){$('fm').innerHTML="<p style='font-weight:800'>✅ Đã ghi nhận quà! Đưa màn hình này cho nhân viên để nhận quà.</p>";$('tg').hidden=true}
  window.api('claim',{ten:ten,sdt:sdt,hd:hd,tok:r.tok}).then(okk).catch(function(x){
   if(/đã nhập thông tin/.test(x.message)){okk();return}
   e.textContent=x.message;btn.disabled=false;btn.textContent='🎁 NHẬN QUÀ'})}
};
})();
