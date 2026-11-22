/* v32: Tắt đăng nhập Facebook (CFG.FB_APP_ID rỗng) -> khách nhập SĐT nhận quà rồi bấm chia sẻ. Lý do: game nhúng trong khung Google Sites (iframe) nên Facebook bị chặn khi chuyển trang/cửa sổ bật lên; bản GitHub thì app Facebook báo "Sự cố tải". Bật lại: xoá dòng ngay dưới. */
try{window.CFG.FB_APP_ID=''}catch(e){}
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
