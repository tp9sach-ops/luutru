/* v30: nút CHIA SẺ LÊN FACEBOOK làm sập tab trên Chrome tablet (vừa chia sẻ file, vừa tải ảnh, vừa mở tab trong 1 lần bấm). Thay bằng: chỉ sao chép nội dung + hiện liên kết để khách tự bấm mở Facebook. Ảnh: giữ ngón tay để lưu. */
(function(){var rs=document.getElementById('rs');if(!rs)return;
function fix(){var sb=document.getElementById('sb');if(!sb||sb.__fx)return;sb.__fx=1;
 sb.onclick=function(){var b=rs.querySelector('.box'),h=b.querySelector('h1'),e=document.getElementById('se'),
  cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+(h?h.textContent:'quà')+'! #9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh',
  url=location.origin+location.pathname,hasImg=!!b.querySelector('img[src^="blob:"]'),
  fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&hashtag='+encodeURIComponent('#9sach');
  try{if(navigator.clipboard)navigator.clipboard.writeText(cap)}catch(x){}
  e.innerHTML='Đã sao chép nội dung. '+(hasImg?'Giữ ngón tay trên ảnh để lưu về máy. ':'')+'<a href="'+fb+'" target="_blank" rel="noopener" style="color:#1877f2;font-weight:800">Bấm đây để mở Facebook</a>, dán nội dung rồi đăng.'}}
new MutationObserver(fix).observe(rs,{childList:true,subtree:true});fix()})();
