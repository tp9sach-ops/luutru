/* v34: (1) Máy chủ đang chạy bản cũ đòi họ tên khi nhận quà bằng SĐT -> bọc window.api: lệnh claim không có tên/Facebook thì tự thêm ten='Khách <4 số cuối>'. (2) Báo thêm mã chẩn đoán khi FB.login thất bại. */
(function(){var a0=window.api;if(typeof a0==='function'&&!a0.__v34){window.api=function(a,d){if(a==='claim'&&d&&!d.fbt&&!d.ten&&d.sdt)d=Object.assign({},d,{ten:'Khách '+String(d.sdt).slice(-4)});return a0.call(this,a,d)};window.api.__v34=1}})();
/* v33: Đăng nhập Facebook bằng CỬA SỔ BẬT LÊN (FB.login) thay cho chuyển trang. Lý do: game nhúng trong khung (iframe) Google Sites, Facebook cấm hiện trang đăng nhập BÊN TRONG khung nhưng vẫn cho mở ở cửa sổ riêng. Thất bại/bị chặn -> tự về nhập SĐT. Quay về bản v32 (chỉ SĐT): thêm lại dòng try{window.CFG.FB_APP_ID=''}catch(e){} ngay dưới đây. */
(function(){
var fbErr='';
function loadSDK(){
 if(window.FB&&window.__fbInit)return;
 if(document.getElementById('fb-sdk'))return;
 window.fbAsyncInit=function(){try{window.FB.init({appId:window.CFG.FB_APP_ID,version:'v19.0',cookie:false,xfbml:false});window.__fbInit=1}catch(e){fbErr='init'}};
 var s=document.createElement('script');s.id='fb-sdk';s.async=true;s.src='https://connect.facebook.net/vi_VN/sdk.js';s.onerror=function(){fbErr='load'};document.head.appendChild(s)}
var orig=window.DCclaim;
if(typeof orig==='function'&&!orig.__v33){
 window.DCclaim=function(r,hd,tk,em){
  var res=orig.apply(this,arguments);
  try{
   if(tk||!(window.CFG&&window.CFG.FB_APP_ID))return res;
   var cb=document.getElementById('cb');
   if(!cb||!/FACEBOOK/i.test(cb.textContent))return res;
   loadSDK();
   cb.onclick=function(){
    var e=document.getElementById('ce');
    if(fbErr){e.textContent='Không tải được Facebook trên máy này (mã: '+fbErr+'). Hãy nhập số điện thoại để nhận quà.';return}
    if(!window.__fbInit||!window.FB){e.textContent='Đang kết nối Facebook, vui lòng bấm lại sau 2-3 giây';loadSDK();return}
    e.textContent='';cb.disabled=true;var t0=cb.textContent;cb.textContent='⏳ Đang mở Facebook…';
    var done=0,rs=function(m){if(done)return;done=1;cb.disabled=false;cb.textContent=t0;if(m)e.textContent=m};
    var to=setTimeout(function(){rs('Facebook chưa phản hồi. Bấm thử lại hoặc nhập số điện thoại.')},90000);
    var t1=Date.now();
    try{window.FB.login(function(x){clearTimeout(to);var a=x&&x.authResponse;
     if(a&&a.accessToken){done=1;window.DCclaim(r,hd,a.accessToken,'')}
     else rs('Chưa đăng nhập được Facebook (bạn đã hủy hoặc cửa sổ bị chặn). Bấm thử lại hoặc nhập số điện thoại. [mã: '+((x&&x.status)||'none')+', '+(window.self!==window.top?'trong khung':'toàn trang')+', '+(Date.now()-t1)+'ms]')},{scope:'public_profile'})}
    catch(x){clearTimeout(to);rs('Không mở được cửa sổ Facebook ('+String(x&&x.message||x).slice(0,60)+'). Hãy nhập số điện thoại để nhận quà.')}}
  }catch(x){}
  return res};
 window.DCclaim.__v33=1}
})();
/* nút CHIA SẺ LÊN FACEBOOK: chỉ sao chép nội dung + liên kết mở Facebook (tab mới), không tự tải ảnh/mở tab. */
(function(){var rs=document.getElementById('rs');if(!rs)return;
function fix(){var sb=document.getElementById('sb');if(!sb||sb.__fx)return;sb.__fx=1;
 sb.onclick=function(){var b=rs.querySelector('.box'),h=b.querySelector('h1'),e=document.getElementById('se'),
  cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+(h?h.textContent:'quà')+'! #9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh',
  url=(document.referrer&&/^https?:/.test(document.referrer)?document.referrer:location.origin+location.pathname),hasImg=!!b.querySelector('img[src^="blob:"]'),
  fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&hashtag='+encodeURIComponent('#9sach');
  try{if(navigator.clipboard)navigator.clipboard.writeText(cap)}catch(x){}
  e.innerHTML='Đã sao chép nội dung. '+(hasImg?'Giữ ngón tay trên ảnh để lưu về máy. ':'')+'<a href="'+fb+'" target="_blank" rel="noopener" style="color:#1877f2;font-weight:800">Bấm đây để mở Facebook</a>, dán nội dung rồi đăng.'}}
new MutationObserver(fix).observe(rs,{childList:true,subtree:true});fix()})();
