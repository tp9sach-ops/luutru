/* v37: BỎ Facebook JS SDK (FB.login trả "unknown" sau 1ms, không rõ vì sao). Tự mở cửa sổ bật lên bằng window.open rồi dẫn tới facebook.com/dialog/oauth (response_type=token, redirect_uri = chính trang game). Trang game trong cửa sổ bật lên đọc #access_token và postMessage về khung, rồi tự đóng. Nếu window.open trả null thì báo rõ "popup-null". Không phụ thuộc "Allowed Domains for the JavaScript SDK"; cần "Valid OAuth Redirect URIs" có địa chỉ trang game. Tắt FB: thêm try{window.CFG.FB_APP_ID=''}catch(e){} ngay dưới. */
/* PHÍA CỬA SỔ BẬT LÊN: vừa quay về từ Facebook với #access_token -> báo cho khung rồi đóng */
(function(){try{var H=location.hash||'',Q=location.search||'';if(!window.opener||window.opener===window)return;
 var mt=/[#&]access_token=([^&]+)/.exec(H),st=/[#&]state=([^&]+)/.exec(H)||/[?&]state=([^&]+)/.exec(Q),er=/[?&#]error(_reason|_description)?=([^&]*)/.exec(Q+H);
 if(!(st&&(mt||er)))return;
 window.opener.postMessage({dcfb:decodeURIComponent(st[1]),tk:mt?decodeURIComponent(mt[1]):'',err:er?decodeURIComponent((er[2]||'').replace(/\+/g,' ')).slice(0,80):''},'*');
 document.body.innerHTML='<p style="font:700 18px sans-serif;text-align:center;margin-top:30vh">Đã xong, đang đóng cửa sổ…</p>';
 setTimeout(function(){try{window.close()}catch(e){}},400)}catch(e){}})();
/* v34: máy chủ đang chạy bản cũ đòi họ tên khi nhận quà bằng SĐT -> bọc window.api: claim không có tên/Facebook thì tự thêm ten='Khách <4 số cuối>'. */
(function(){var a0=window.api;if(typeof a0==='function'&&!a0.__v34){window.api=function(a,d){if(a==='claim'&&d&&!d.fbt&&!d.ten&&d.sdt)d=Object.assign({},d,{ten:'Khách '+String(d.sdt).slice(-4)});return a0.call(this,a,d)};window.api.__v34=1}})();
/* v37: đăng nhập Facebook bằng cửa sổ bật lên tự mở (không dùng SDK) */
(function(){
var orig=window.DCclaim;
if(typeof orig==='function'&&!orig.__v37){
 window.DCclaim=function(r,hd,tk,em){
  var res=orig.apply(this,arguments);
  try{
   if(tk||!(window.CFG&&window.CFG.FB_APP_ID))return res;
   var cb=document.getElementById('cb');
   if(!cb||!/FACEBOOK/i.test(cb.textContent))return res;
   cb.onclick=function(){
    var e=document.getElementById('ce'),st=Math.random().toString(36).slice(2),RU=location.origin+location.pathname,fr=(window.self!==window.top?'trong khung':'toàn trang'),w=null;
    try{w=window.open('about:blank','fbl_'+st,'width=520,height=700')}catch(x){}
    if(!w){e.textContent='Khung nhúng không cho mở cửa sổ Facebook. Hãy nhập số điện thoại để nhận quà. [mã: popup-null, '+fr+']';return}
    var t0=cb.textContent,done=0,iv=0,onm=null;
    cb.disabled=true;cb.textContent='⏳ Đang chờ đăng nhập Facebook…';e.textContent='';
    function stop(m){if(done)return;done=1;clearInterval(iv);window.removeEventListener('message',onm);cb.disabled=false;cb.textContent=t0;if(m)e.textContent=m}
    onm=function(ev){var d=ev.data;if(!d||d.dcfb!==st)return;
     if(d.tk){stop();try{w.close()}catch(x){}window.DCclaim(r,hd,d.tk,'')}
     else{stop('Facebook không cho đăng nhập'+(d.err?' ('+d.err+')':'')+'. Bấm thử lại hoặc nhập số điện thoại. [địa chỉ quay về: '+RU+']')}};
    window.addEventListener('message',onm);
    var cl=0;iv=setInterval(function(){if(done)return;if(w.closed){if(++cl>3)stop('Chưa đăng nhập được Facebook (bạn đã đóng cửa sổ hoặc Facebook từ chối). Bấm thử lại hoặc nhập số điện thoại. [mã: closed, '+fr+', địa chỉ quay về: '+RU+']')}},500);
    setTimeout(function(){if(!done)stop('Facebook chưa phản hồi. Bấm thử lại hoặc nhập số điện thoại.')},180000);
    try{w.location.href='https://www.facebook.com/v19.0/dialog/oauth?client_id='+encodeURIComponent(window.CFG.FB_APP_ID)+'&redirect_uri='+encodeURIComponent(RU)+'&response_type=token&scope=public_profile&display=popup&state='+st}
    catch(x){stop('Không mở được trang Facebook. Hãy nhập số điện thoại để nhận quà. [mã: nav-fail]')}}
  }catch(x){}
  return res};
 window.DCclaim.__v37=1}
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
