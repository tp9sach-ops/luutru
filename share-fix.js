/* v31: (1) nút CHIA SẺ LÊN FACEBOOK: chỉ sao chép nội dung + liên kết mở Facebook. (2) Tab sập ngay khi bấm ĐĂNG NHẬP FACEBOOK (trang WebGL quá nặng trên tablet): trước khi chuyển trang, giải phóng WebGL, ẩn game, rồi mới chạy xử lý cũ trong gate.js. */
(function(){var rs=document.getElementById('rs');if(!rs)return;
function rel(){try{document.querySelectorAll('canvas').forEach(function(c){try{var gl=c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl');var x=gl&&gl.getExtension('WEBGL_lose_context');if(x)x.loseContext()}catch(e){}try{c.width=1;c.height=1;c.style.display='none'}catch(e){}})}catch(e){}
 var a=document.querySelector('.app');if(a)a.style.display='none';var gt=document.getElementById('gate');if(gt)gt.style.display='none'}
rs.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('#cb');if(!b||b.__rel||!/FACEBOOK/i.test(b.textContent||''))return;
 b.__rel=1;ev.stopImmediatePropagation();ev.preventDefault();var h=b.onclick;b.disabled=true;b.textContent='⏳ Đang chuyển sang Facebook…';rel();
 setTimeout(function(){b.disabled=false;if(h)h.call(b)},400)},true);
function fix(){var sb=document.getElementById('sb');if(!sb||sb.__fx)return;sb.__fx=1;
 sb.onclick=function(){var b=rs.querySelector('.box'),h=b.querySelector('h1'),e=document.getElementById('se'),
  cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+(h?h.textContent:'quà')+'! #9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh',
  url=location.origin+location.pathname,hasImg=!!b.querySelector('img[src^="blob:"]'),
  fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&hashtag='+encodeURIComponent('#9sach');
  try{if(navigator.clipboard)navigator.clipboard.writeText(cap)}catch(x){}
  e.innerHTML='Đã sao chép nội dung. '+(hasImg?'Giữ ngón tay trên ảnh để lưu về máy. ':'')+'<a href="'+fb+'" target="_blank" rel="noopener" style="color:#1877f2;font-weight:800">Bấm đây để mở Facebook</a>, dán nội dung rồi đăng.'}}
new MutationObserver(fix).observe(rs,{childList:true,subtree:true});fix()})();
