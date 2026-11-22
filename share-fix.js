/* v38: (1) Thông báo cũ [mã: unknown...] chứng tỏ trình duyệt vẫn giữ share-fix.js cũ (index.html chưa tăng ?v=) -> index.html nay gọi share-fix.js?v=38. (2) Khi Facebook lỗi/không dùng: hiện khung nhập HỌ TÊN + SĐT -> ghi nhận quà (claim) -> nút CHIA SẺ KHOẢNH KHẮC ĐUA: sao chép nội dung + hashtag, gửi kèm hình (menu chia sẻ của máy, chọn Facebook) hoặc tải hình + mở Facebook. Tắt FB hoàn toàn: thêm try{window.CFG.FB_APP_ID=''}catch(e){} ngay dưới. */
/* PHÍA CỬA SỔ BẬT LÊN: vừa quay về từ Facebook với #access_token -> báo cho khung rồi đóng */
(function(){try{var H=location.hash||'',Q=location.search||'';if(!window.opener||window.opener===window)return;
 var mt=/[#&]access_token=([^&]+)/.exec(H),st=/[#&]state=([^&]+)/.exec(H)||/[?&]state=([^&]+)/.exec(Q),er=/[?&#]error(_reason|_description)?=([^&]*)/.exec(Q+H);
 if(!(st&&(mt||er)))return;
 window.opener.postMessage({dcfb:decodeURIComponent(st[1]),tk:mt?decodeURIComponent(mt[1]):'',err:er?decodeURIComponent((er[2]||'').replace(/\+/g,' ')).slice(0,80):''},'*');
 document.body.innerHTML='<p style="font:700 18px sans-serif;text-align:center;margin-top:30vh">Đã xong, đang đóng cửa sổ…</p>';
 setTimeout(function(){try{window.close()}catch(e){}},400)}catch(e){}})();
/* v34: máy chủ đang chạy bản cũ đòi họ tên -> bọc window.api: claim không có tên/Facebook thì tự thêm ten='Khách <4 số cuối>'. */
(function(){var a0=window.api;if(typeof a0==='function'&&!a0.__v34){window.api=function(a,d){if(a==='claim'&&d&&!d.fbt&&!d.ten&&d.sdt)d=Object.assign({},d,{ten:'Khách '+String(d.sdt).slice(-4)});return a0.call(this,a,d)};window.api.__v34=1}})();
(function(){
var HASH='#9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh';
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
/* ảnh chia sẻ: khung hình cọp về đích + dải chữ quà */
function mkImg(prize){return new Promise(function(ok){var src=window.__snap;if(!src)return ok(null);
 var im=new Image();im.onload=function(){try{var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var k=Math.max(W/im.width,H/im.height),w=im.width*k,h=im.height*k;x.drawImage(im,(W-w)/2,(H-h)/2,w,h);
  var g=x.createLinearGradient(0,H-330,0,H);g.addColorStop(0,'rgba(5,30,22,0)');g.addColorStop(1,'rgba(5,30,22,.92)');x.fillStyle=g;x.fillRect(0,H-330,W,330);
  x.textAlign='center';x.fillStyle='#ffe08a';x.font='800 40px "Be Vietnam Pro",sans-serif';x.fillText('9 SẠCH · ĐUA CỌP GIÁNG SINH',W/2,H-200);
  x.fillStyle='#fff';x.font='900 78px "Be Vietnam Pro",sans-serif';x.fillText('VỀ NHẤT! '+String(prize||'').slice(0,22),W/2,H-110);
  x.fillStyle='#ffd05a';x.font='700 34px "Be Vietnam Pro",sans-serif';x.fillText('#9sach #duacop',W/2,H-50);
  c.toBlob(function(b){ok(b)},'image/jpeg',.9)}catch(e){ok(null)}};
 im.onerror=function(){ok(null)};im.src=src})}
/* Khung nhập HỌC TÊN + SĐT -> ghi nhận quà -> nút chia sẻ khoảnh khắc đua */
function myForm(r,hd,note){
 var rs=$('rs');if(!rs)return;rs.hidden=false;var b=rs.querySelector('.box'),im='';try{im=window.DC&&window.DC.img?window.DC.img(r.ten):''}catch(e){}
 var imgP=mkImg(r.ten);
 function head(x){b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2>"+(im?"<img src='"+im+"' alt=''>":"")+"<p>Cọp của bạn đã đội quà về đích</p><h1>"+esc(r.ten)+"</h1>"+x}
 head("<p>"+esc(note||'Nhập tên và số điện thoại để nhận quà')+"</p><div class='fm'><input id='cn' type='text' maxlength='60' placeholder='Họ và tên' autocomplete='name'><input id='cp' type='tel' inputmode='numeric' maxlength='11' placeholder='Số điện thoại' autocomplete='tel'></div><p id='ce' class='ge'></p><button id='cb' class='btn' type='button'>🎁 NHẬN QUÀ</button>");
 function shareView(){imgP.then(function(bl){var u=bl?URL.createObjectURL(bl):'';
  head("<h2 style='margin:4px 0'>✅ Đã ghi nhận quà!</h2>"+(u?"<img src='"+u+"' alt='' style='max-width:62%;max-height:220px;border-radius:14px'>":"")+"<p>Bấm nút dưới: nội dung và hashtag được sao chép sẵn, hình về đích gửi kèm, chọn Facebook rồi dán nội dung và đăng.</p><p id='se' class='ge'></p><button id='sb2' class='btn' type='button'>📣 CHIA SẺ KHOẢNH KHẮC ĐUA</button><button id='sx' class='btn' type='button' style='background:#6b7280'>Đóng, đưa màn hình cho nhân viên nhận quà</button>");
  $('sx').onclick=function(){location.reload()};
  $('sb2').onclick=function(){
   var e=$('se'),cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+r.ten+'! '+HASH,
    url=(document.referrer&&/^https?:/.test(document.referrer)?document.referrer:location.origin+location.pathname),
    fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&hashtag='+encodeURIComponent('#9sach'),
    link='<a href="'+fb+'" target="_blank" rel="noopener" style="color:#1877f2;font-weight:800">Bấm đây để mở Facebook</a>';
   try{if(navigator.clipboard)navigator.clipboard.writeText(cap)}catch(x){}
   var f=bl?new File([bl],'9sach-duacop.jpg',{type:'image/jpeg'}):null;
   function viaLink(){if(bl){var a=document.createElement('a');a.href=u;a.download='9sach-duacop.jpg';document.body.appendChild(a);a.click();a.remove()}
    var w=null;try{w=window.open(fb,'_blank')}catch(x){}
    e.innerHTML='Đã sao chép nội dung'+(bl?' và tải hình về máy (đính kèm hình khi đăng)':'')+'. '+(w?'':link+'. ')+'Dán nội dung rồi đăng.'}
   if(f&&navigator.canShare&&navigator.canShare({files:[f]})){
    e.textContent='Đã sao chép nội dung. Chọn Facebook, dán nội dung rồi đăng.';
    navigator.share({files:[f],text:cap}).catch(function(x){if(x&&x.name==='AbortError')return;viaLink()});return}
   viaLink()}})}
 $('cb').onclick=function(){
  var ten=$('cn').value.trim().replace(/\s+/g,' '),sdt=$('cp').value.replace(/[^0-9]/g,''),e=$('ce'),btn=$('cb');
  if(ten.length<2){e.textContent='Vui lòng nhập họ tên';return}
  if(!/^0[0-9]{9}$/.test(sdt)){e.textContent='Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';return}
  e.textContent='';btn.disabled=true;btn.textContent='⏳ Đang gửi…';
  window.api('claim',{ten:ten,sdt:sdt,hd:hd,tok:r.tok}).then(shareView).catch(function(x){
   if(/đã nhập thông tin/.test(x.message)){shareView();return}
   e.textContent=x.message;btn.disabled=false;btn.textContent='🎁 NHẬN QUÀ'})}}
/* Bọc DCclaim: không có Facebook -> khung tên + SĐT; có Facebook -> cửa sổ bật lên, lỗi -> khung tên + SĐT */
var orig=window.DCclaim;
if(typeof orig==='function'&&!orig.__v38){
 window.DCclaim=function(r,hd,tk,em){
  if(tk)return orig.apply(this,arguments);
  if(!(window.CFG&&window.CFG.FB_APP_ID))return myForm(r,hd,'');
  var res=orig.apply(this,arguments);
  try{
   var cb=$('cb');if(!cb||!/FACEBOOK/i.test(cb.textContent))return res;
   var cs=$('cs');if(cs)cs.onclick=function(ev){ev.preventDefault();myForm(r,hd,'')};
   cb.onclick=function(){
    var st=Math.random().toString(36).slice(2),RU=location.origin+location.pathname,fr=(window.self!==window.top?'trong khung':'toàn trang'),w=null;
    try{w=window.open('about:blank','fbl_'+st,'width=520,height=700')}catch(x){}
    if(!w){myForm(r,hd,'Không mở được Facebook [popup-null, '+fr+']. Vui lòng nhập tên và số điện thoại để nhận quà.');return}
    var done=0,iv=0,onm=null,cl=0;
    cb.disabled=true;cb.textContent='⏳ Đang chờ đăng nhập Facebook…';
    function stop(){if(done)return false;done=1;clearInterval(iv);window.removeEventListener('message',onm);return true}
    function fail(code){if(stop()){try{w.close()}catch(x){}myForm(r,hd,'Đăng nhập Facebook chưa được ['+code+']. Vui lòng nhập tên và số điện thoại để nhận quà.')}}
    onm=function(ev){var d=ev.data;if(!d||d.dcfb!==st)return;
     if(d.tk){if(stop()){try{w.close()}catch(x){}window.DCclaim(r,hd,d.tk,'')}}
     else fail('facebook-tu-choi '+(d.err||'')+' '+RU)};
    window.addEventListener('message',onm);
    iv=setInterval(function(){if(done)return;if(w.closed&&++cl>3)fail('closed, '+fr+', '+RU)},500);
    setTimeout(function(){fail('timeout')},180000);
    try{w.location.href='https://www.facebook.com/v19.0/dialog/oauth?client_id='+encodeURIComponent(window.CFG.FB_APP_ID)+'&redirect_uri='+encodeURIComponent(RU)+'&response_type=token&scope=public_profile&display=popup&state='+st}
    catch(x){fail('nav-fail')}}
  }catch(x){}
  return res};
 window.DCclaim.__v38=1}
})();
