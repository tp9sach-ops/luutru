/* v49: chia sẻ Facebook HOẶC nhập tên + SĐT (1 trong 2) đều hợp lệ để nhân viên trao quà. Bấm chia sẻ là ghi nhận quà ngay (claim share:1).
   v48: caption đổi sang LỜI CỦA KHÁCH chơi (ngôi "mình"), không còn là lời quảng cáo của 9 Sạch.
   v47: ảnh ghép = cọp chạm đích + HÌNH QUÀ (thay bục 1-2-3); caption mới hào hứng (window.DCcap) và HIỂN THỊ trong hộp caption + nút Sao chép (iOS/Facebook bỏ qua text khi chia sẻ ảnh nên trước đây khách không thấy caption). Tên mới THÊM 1K - ĐUA NGAY NHẬN QUÀ.
   v46: KHÔNG gửi link nữa. Nút chia sẻ: (1) máy cho phép -> menu chia sẻ của máy kèm ảnh + caption; (2) khung nhúng (Google Sites) chặn menu chia sẻ -> mở share.html ở THẺ MỚI (không bị khung chặn), ảnh + caption được chuyển sang bằng postMessage, khách bấm nút ở đó để mở menu chia sẻ kèm ảnh; (3) popup bị chặn -> tải ảnh về + sao chép caption.
   v44: ảnh tải về tên duongduaquagiangsinh.jpg. v42: không còn đăng nhập Facebook. Dự phòng: nhập Họ tên + SĐT để nhân viên trao quà (claim như cũ). */
try{window.CFG=window.CFG||{};window.CFG.FB_APP_ID=''}catch(e){}
/* v34: máy chủ cũ đòi họ tên -> claim không có tên thì tự thêm ten='Khách <4 số cuối>'. */
(function(){var a0=window.api;if(typeof a0==='function'&&!a0.__v34){window.api=function(a,d){if(a==='claim'&&d&&!d.fbt&&!d.ten&&d.sdt)d=Object.assign({},d,{ten:'Khách '+String(d.sdt).slice(-4)});return a0.call(this,a,d)};window.api.__v34=1}})();
(function(){
var HASH='#9sach #banhsaurieng9sach #duacop #them1k #duangaynhanqua';
var FILE='them1k-duangaynhanqua.jpg';
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function loadImg(src){return new Promise(function(ok){if(!src)return ok(null);var im=new Image();im.onload=function(){ok(im)};im.onerror=function(){ok(null)};im.src=src})}
function cover(x,im,X,Y,W,H){var k=Math.max(W/im.width,H/im.height),w=im.width*k,h=im.height*k;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.drawImage(im,X+(W-w)/2,Y+(H-h)/2,w,h);x.restore()}
/* caption chia sẻ (dùng chung: share-fix.js, zalo-open.js): viết bằng lời của KHÁCH chơi (ngôi 'mình'), không phải lời của 9 Sạch */
window.DCcap=function(prize){return '🐯🏆 Mình vừa chơi THÊM 1K - ĐUA NGAY NHẬN QUÀ ở 9 Sạch và cọp của mình về NHẤT, rinh ngay '+prize+' luôn nè! 🎁🎉\nHồi hộp muốn nổ tim, cọp nào đội quà về đích trước là quà đó thuộc về mình thật luôn! 🔥\n👉 Ai có hóa đơn từ 159k tại 9 Sạch là được đua, mọi người thử vận may như mình đi nha! 😍\n'+HASH};
function loadGift(src){return new Promise(function(ok){if(!src)return ok(null);var im=new Image();if(!/^data:/.test(src))im.crossOrigin='anonymous';im.onload=function(){ok(im)};im.onerror=function(){ok(null)};im.src=src})}
function fitText(x,txt,wt,max,maxW){var s=max;do{x.font=wt+' '+s+'px "Be Vietnam Pro",sans-serif';s-=2}while(s>20&&x.measureText(txt).width>maxW)}
function rrect(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
/* hộp quà vẽ bằng mã: dùng khi quà chưa có ảnh (hoặc ảnh không đọc được) */
function drawGiftBox(x,cx,cy,s){var w=s*.74,h=s*.5,X=cx-w/2,Y=cy-h/2+s*.1;
 x.fillStyle='#d4112e';x.fillRect(X,Y,w,h);x.fillStyle='#e8283f';rrect(x,X-s*.04,Y-s*.13,w+s*.08,s*.17,8);x.fill();
 x.fillStyle='#ffd54a';x.fillRect(cx-s*.05,Y-s*.13,s*.1,h+s*.13);
 x.strokeStyle='#ffd54a';x.lineWidth=s*.045;x.lineJoin='round';x.beginPath();x.moveTo(cx,Y-s*.13);x.bezierCurveTo(cx-s*.3,Y-s*.4,cx-s*.38,Y-s*.1,cx-s*.04,Y-s*.13);x.moveTo(cx,Y-s*.13);x.bezierCurveTo(cx+s*.3,Y-s*.4,cx+s*.38,Y-s*.1,cx+s*.04,Y-s*.13);x.stroke()}
/* ảnh chia sẻ 1080x1350: trên = khoảnh khắc cọp chạm đích, dưới = HÌNH QUÀ TẶNG khách trúng (thay cho bục 1-2-3 trước đây), dải chữ + hashtag */
function mkCollage(prize){
 var sn=(window.FIN&&window.FIN.snaps)||{},gsrc=null;
 try{gsrc=window.DC&&window.DC.img?window.DC.img(prize):null}catch(e){}
 return Promise.all([loadImg(sn.fin),loadImg(window.__snap),loadGift(gsrc)]).then(function(a){
  var top=a[0]||a[1],gift=a[2];
  function build(useGift){
   var W=1080,H=1350,TOPH=640,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),g,i;
   g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#145a41');g.addColorStop(1,'#06261b');x.fillStyle=g;x.fillRect(0,0,W,H);
   /* nửa trên: cọp chạm đích */
   if(top)cover(x,top,0,0,W,TOPH);
   else{x.fillStyle='#ffd05a';x.textAlign='center';x.font='900 90px "Be Vietnam Pro",sans-serif';x.fillText('VỀ NHẤT!',W/2,TOPH/2)}
   /* nửa dưới: nền xanh có tia sáng + thẻ quà */
   x.save();x.beginPath();x.rect(0,TOPH+8,W,H-TOPH-8);x.clip();
   g=x.createRadialGradient(W/2,880,20,W/2,880,620);g.addColorStop(0,'#2f9a6c');g.addColorStop(1,'#0a3524');x.fillStyle=g;x.fillRect(0,TOPH,W,H-TOPH);
   x.translate(W/2,880);for(i=0;i<18;i++){x.rotate(Math.PI/9);x.fillStyle='rgba(255,214,90,.10)';x.beginPath();x.moveTo(0,0);x.lineTo(900,-70);x.lineTo(900,70);x.closePath();x.fill()}
   x.restore();
   x.fillStyle='#ffd05a';x.fillRect(0,TOPH,W,8);
   x.textAlign='center';x.fillStyle='#ffe08a';fitText(x,'★ QUÀ TẶNG CỦA BẠN ★','800',40,W-120);x.fillText('★ QUÀ TẶNG CỦA BẠN ★',W/2,TOPH+62);
   var CX=W/2-190,CY=TOPH+86,CW=380,CH=330;
   x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=30;x.shadowOffsetY=12;rrect(x,CX,CY,CW,CH,34);x.fillStyle='#fffaf0';x.fill();x.restore();
   rrect(x,CX,CY,CW,CH,34);x.lineWidth=10;x.strokeStyle='#ffd05a';x.stroke();
   if(useGift&&gift){var k=Math.min((CW-44)/gift.width,(CH-44)/gift.height),w=gift.width*k,h=gift.height*k;x.save();rrect(x,CX+8,CY+8,CW-16,CH-16,28);x.clip();x.drawImage(gift,CX+(CW-w)/2,CY+(CH-h)/2,w,h);x.restore()}
   else drawGiftBox(x,CX+CW/2,CY+CH/2,250);
   /* dải chữ trên cùng + dưới cùng */
   g=x.createLinearGradient(0,0,0,150);g.addColorStop(0,'rgba(5,30,22,.9)');g.addColorStop(1,'rgba(5,30,22,0)');x.fillStyle=g;x.fillRect(0,0,W,150);
   g=x.createLinearGradient(0,H-250,0,H);g.addColorStop(0,'rgba(5,30,22,0)');g.addColorStop(1,'rgba(5,30,22,.94)');x.fillStyle=g;x.fillRect(0,H-250,W,250);
   x.textAlign='center';x.fillStyle='#ffe08a';var t1='9 SẠCH · THÊM 1K - ĐUA NGAY NHẬN QUÀ';fitText(x,t1,'800',44,W-80);x.fillText(t1,W/2,70);
   var t2='VỀ NHẤT! '+String(prize||'').slice(0,22);x.fillStyle='#fff';x.shadowColor='#000b';x.shadowBlur=10;fitText(x,t2,'900',72,W-80);x.fillText(t2,W/2,H-120);x.shadowBlur=0;
   x.fillStyle='#ffd05a';x.font='700 34px "Be Vietnam Pro",sans-serif';x.fillText('#9sach #banhsaurieng9sach #duacop #them1k',W/2,H-60);
   return new Promise(function(ok){try{c.toBlob(function(b){ok(b)},'image/jpeg',.9)}catch(e){ok(null)}})}
  /* ảnh quà khác nguồn (không CORS) làm canvas bị khóa -> toBlob lỗi: vẽ lại bằng hộp quà dựng bằng mã */
  return Promise.resolve().then(function(){return build(true)}).then(function(b){return b||(gift?build(false):null)}).catch(function(){return build(false)}).catch(function(){return null})})}
function copyText(t){
 try{var ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,t.length);document.execCommand('copy');ta.remove()}catch(e){}
 try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(function(){})}catch(e){}}
window.DCclaim=function(r,hd){
 var rs=$('rs');if(!rs)return;rs.hidden=false;var b=rs.querySelector('.box'),blob=null,
  cap=window.DCcap(r.ten);
 b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2><p>Đang chuẩn bị ảnh chiến thắng…</p><h1>"+esc(r.ten)+"</h1>";
 mkCollage(r.ten).then(function(bl){blob=bl;view()});
 function view(){
  var u=blob?URL.createObjectURL(blob):'';
  b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2>"+(u?"<img src='"+u+"' alt='' style='width:100%;max-width:330px;border-radius:14px'>":"")+"<p>Cọp của bạn đã đội quà về đích</p><h1>"+esc(r.ten)+"</h1><p id='se' class='ge'></p><p id='okm' style='font-weight:800;color:#0a7a2a'></p>"+
   "<button id='sb2' class='btn' type='button' style='background:#1877f2;color:#fff'>📣 CHIA SẺ LÊN FACEBOOK</button>"+
   "<div class='capbox'><div class='caph'>📝 Caption bài đăng (Facebook không tự điền)</div><textarea id='capt' readonly rows='6'></textarea><button id='cpb' class='btn capb' type='button'>📋 SAO CHÉP CAPTION</button><p class='caph2'>Trên Facebook: nhấn giữ ô viết bài → chọn <b>Dán</b> → Đăng.</p></div>"+
   "<button id='tg' class='btn' type='button' style='background:#fff;color:#7a0a1c;border:2px solid #d8132f'>🎁 Nhập tên &amp; SĐT để nhận quà</button>"+
   "<div id='fm' hidden><div class='fm'><input id='cn' type='text' maxlength='60' placeholder='Họ và tên' autocomplete='name'><input id='cp' type='tel' inputmode='numeric' maxlength='11' placeholder='Số điện thoại' autocomplete='tel'></div><p id='ce' class='ge'></p><button id='cb' class='btn' type='button'>🎁 NHẬN QUÀ</button></div>"+
   "<button id='sx' class='btn' type='button' style='background:#6b7280;margin-top:8px'>Đóng</button>";
  $('sx').onclick=function(){location.reload()};
  $('sb2').onclick=doShare;
  try{$('capt').value=cap}catch(x){}
  $('cpb').onclick=function(){copyText(cap);try{$('capt').focus();$('capt').select();$('capt').setSelectionRange(0,cap.length)}catch(x){}$('cpb').textContent='✅ ĐÃ SAO CHÉP – dán vào bài đăng'}
  $('tg').onclick=function(){$('fm').hidden=!$('fm').hidden};
  $('cb').onclick=doClaim}
 /* dự phòng cuối: tải ảnh + sao chép caption, khách tự đăng */
 function viaSave(){
  var e=$('se');
  if(blob){try{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=FILE;document.body.appendChild(a);a.click();a.remove()}catch(x){}}
  e.textContent='Đã sao chép caption'+(blob?' và tải ảnh về máy':'')+'. Mở Facebook, tạo bài viết, chọn ảnh vừa tải, dán caption rồi đăng.'}
 /* khung nhúng chặn menu chia sẻ: mở share.html ở thẻ mới (mở NGAY trong lúc bấm để không bị chặn popup), chuyển ảnh + caption sang bằng postMessage */
 function viaTab(){
  var e=$('se'),w=null,data=null,ready=false,sent=false;
  if(!blob){viaSave();return}
  try{w=window.open(new URL('share.html?v=2',location.href).href,'_blank')}catch(x){}
  if(!w){viaSave();return}
  function send(){if(sent||!data||!ready)return;sent=true;try{w.postMessage({t:'dcshare',img:data,cap:cap,name:FILE},'*')}catch(x){viaSave()}}
  window.addEventListener('message',function(ev){if(ev.source===w&&ev.data&&ev.data.t==='dcshare-ready'){ready=true;send()}});
  var rd=new FileReader();rd.onload=function(){data=rd.result;send()};rd.readAsDataURL(blob);
  e.textContent='Đã mở trang chia sẻ ở thẻ mới: bấm nút CHIA SẺ LÊN FACEBOOK ở đó. Caption và hashtag đã sao chép sẵn.'}
 var shared=false;
 function mark(){var m=$('okm');if(m)m.textContent='✅ Đã ghi nhận quà! Đưa màn hình này cho nhân viên để nhận quà.';var t=$('tg');if(t)t.hidden=true;var f=$('fm');if(f)f.hidden=true}
 function doShare(){
  var e=$('se');copyText(cap);
  /* chia sẻ = 1 trong 2 điều kiện hợp lệ: ghi nhận ngay để nhân viên trao quà (không chặn việc mở chia sẻ) */
  if(!shared){shared=true;window.api('claim',{share:1,hd:hd,tok:r.tok}).then(mark).catch(function(x){if(x&&/đã nhập thông tin/.test(x.message)){mark();return}shared=false})}
  var f=null,can=false;
  try{if(blob)f=new File([blob],FILE,{type:'image/jpeg'})}catch(x){}
  try{can=!!(f&&navigator.share&&navigator.canShare&&navigator.canShare({files:[f]}))}catch(x){}
  if(can){
   e.textContent='Đã sao chép caption. Chọn Facebook, nhấn giữ ô viết bài → Dán caption rồi bấm Đăng.';
   navigator.share({files:[f],text:cap}).catch(function(x){if(x&&x.name==='AbortError')return;viaSave()});return}
  viaTab()}
 function doClaim(){
  var ten=$('cn').value.trim().replace(/\s+/g,' '),sdt=$('cp').value.replace(/[^0-9]/g,''),e=$('ce'),btn=$('cb');
  if(ten.length<2){e.textContent='Vui lòng nhập họ tên';return}
  if(!/^0[0-9]{9}$/.test(sdt)){e.textContent='Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';return}
  e.textContent='';btn.disabled=true;btn.textContent='⏳ Đang gửi…';
  function okk(){shared=true;mark()}
  window.api('claim',{ten:ten,sdt:sdt,hd:hd,tok:r.tok}).then(okk).catch(function(x){
   if(/đã nhập thông tin/.test(x.message)){okk();return}
   e.textContent=x.message;btn.disabled=false;btn.textContent='🎁 NHẬN QUÀ'})}
};
})();
