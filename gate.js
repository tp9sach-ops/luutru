/* Cổng vào game: chọn cửa hàng (tìm kiếm) + số hóa đơn -> đua; sau khi đua trúng quà mới nhập tên + SĐT. Cần window.DC do flow-patch.js tạo trong game.js. */
/* v6: nền xanh như cũ; thêm vật phẩm ĐỎ Noel làm điểm nhấn (không đổi nền): viền kẹo gậy, dây đèn bóng đỏ + nơ + quả ô rô, hộp quà đỏ, kẹo gậy, cây thông có ruy băng và bóng đỏ. Cọp lặp chu kỳ 10 s: chạy bộ tại chỗ (0-3.4 s) -> dừng khởi động xoay cổ tay/cổ chân (4.2-9 s) -> chạy tiếp, không vẫy chào. */
(function(){
var $=function(i){return document.getElementById(i)},ST='',g=$('gate');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fold(s){return String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d').toLowerCase().replace(/\s+/g,' ').trim()}
function D(){return window.DC?window.DC.d():null}
function has(d,s){return((d.prizes||{})[s]||[]).length>0||!!(d.unk&&d.unk[s])}
if(!g)return;
/* Cọp 3D ở cổng: dùng đúng mô hình có xương của game. Không còn logo/hình cũ làm placeholder: lần đầu hiện vầng sáng chờ, từ lần sau hiện ngay ảnh chụp cọp đã lưu trong máy (SK), rồi 3D thay vào. */
var SK='tg9snap1',snap=null,sty=document.createElement('style');
sty.textContent=".gt3{position:relative;width:min(56vw,42vh,250px);aspect-ratio:5/6;margin-bottom:4px!important}.gt3:before{content:'';position:absolute;left:12%;top:18%;width:76%;height:70%;border-radius:50%;background:radial-gradient(circle,rgba(255,214,110,.5),rgba(255,214,110,0) 68%);animation:gtp 1.6s ease-in-out infinite}.gt3.snap:before,.gt3.on:before{display:none}.gt3 img,.gt3 canvas{position:absolute;left:0;top:0;width:100%;height:100%;filter:drop-shadow(0 14px 18px rgba(0,0,0,.45))}.gt3.on img{display:none}@keyframes gtp{50%{opacity:.45;transform:scale(1.08)}}@media(max-height:480px){.gt3{display:none}}@media(prefers-reduced-motion:reduce){.gt3:before{animation:none}}"+
".gt3 .gtree{position:absolute;bottom:3%;height:auto;z-index:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.4))}.gt3 .gtree.l{left:-34%;width:46%}.gt3 .gtree.r{right:-32%;width:40%}.gtree .o{animation:gtw 1.5s ease-in-out infinite}.gtree .o:nth-of-type(2n){animation-delay:.5s}.gtree .o:nth-of-type(3n){animation-delay:.9s}@keyframes gtw{50%{opacity:.3}}";
document.head.appendChild(sty);
/* v6: chừa chỗ cho dây đèn trên cùng + kiểu hộp quà/kẹo gậy dưới chân cây (nền cổng giữ nguyên màu xanh của premium.css) */
var sty2=document.createElement('style');
sty2.textContent="#gate{padding-top:max(58px,calc(env(safe-area-inset-top) + 50px))}"+
".gt3 .ggift,.gt3 .gcane{position:absolute;height:auto;z-index:0;filter:drop-shadow(0 6px 6px rgba(0,0,0,.4))}";
document.head.appendChild(sty2);
var old=g.querySelector('.gt'),box=document.createElement('div');box.className='gt3';
/* 2 cây thông Noel (SVG) đứng hai bên cọp: 3 tầng lá, mũ tuyết, dây ruy băng đỏ, bóng đèn đỏ/vàng nhấp nháy, ngôi sao vàng */
var TREE="<svg class='gtree #' viewBox='0 0 100 150' aria-hidden='true'><defs><linearGradient id='gtg@' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#34b06c'/><stop offset='1' stop-color='#0f5a3a'/></linearGradient></defs><rect x='43' y='128' width='14' height='20' rx='2' fill='#6b3f1d'/><polygon points='50,70 97,134 3,134' fill='url(#gtg@)'/><polygon points='50,70 60,84 40,84' fill='#fff'/><polygon points='50,40 90,98 10,98' fill='url(#gtg@)'/><polygon points='50,40 60,54 40,54' fill='#fff'/><polygon points='50,16 80,64 20,64' fill='url(#gtg@)'/><polygon points='50,16 58,30 42,30' fill='#fff'/>"+
"<path d='M19 112Q50 128 81 112' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/><path d='M23 80Q50 93 77 80' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/><path d='M28 52Q50 63 72 52' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/>"+
"<circle class='o' cx='38' cy='122' r='4.4' fill='#e0243f'/><circle class='o' cx='62' cy='118' r='4' fill='#ffd54a'/><circle class='o' cx='80' cy='126' r='4' fill='#e0243f'/><circle class='o' cx='24' cy='127' r='3.8' fill='#ffd54a'/><circle class='o' cx='44' cy='100' r='4' fill='#e0243f'/><circle class='o' cx='62' cy='94' r='3.8' fill='#ffd54a'/><circle class='o' cx='36' cy='70' r='3.6' fill='#e0243f'/><circle class='o' cx='60' cy='66' r='3.6' fill='#e0243f'/><circle class='o' cx='46' cy='44' r='3.4' fill='#ffd54a'/><circle class='o' cx='55' cy='36' r='3.2' fill='#e0243f'/>"+
"<polygon points='50,1 52.4,6.8 58.6,7.2 53.8,11.2 55.3,17.3 50,14 44.7,17.3 46.2,11.2 41.4,7.2 47.6,6.8' fill='#ffd54a' stroke='#e8a317' stroke-width='.8'/></svg>";
/* hộp quà đỏ/trắng ruy băng vàng/đỏ + kẹo gậy đỏ-trắng đặt dưới chân cây */
function gift(b,l,r,st){return"<svg class='ggift' style='"+st+"' viewBox='0 0 60 60' aria-hidden='true'><rect x='5' y='25' width='50' height='33' rx='3' fill='"+b+"'/><rect x='3' y='17' width='54' height='11' rx='3' fill='"+l+"'/><rect x='26' y='17' width='8' height='41' fill='"+r+"'/><path d='M30 17C21 3 8 7 13 14C17 19 27 17 30 17ZM30 17C39 3 52 7 47 14C43 19 33 17 30 17Z' fill='none' stroke='"+r+"' stroke-width='3.6' stroke-linejoin='round'/></svg>"}
function cane(st){return"<svg class='gcane' style='"+st+"' viewBox='0 0 40 84' aria-hidden='true'><path d='M12 82V24C12 6 34 6 34 24' fill='none' stroke='#fff' stroke-width='9'/><path d='M12 82V24C12 6 34 6 34 24' fill='none' stroke='#d4112e' stroke-width='9' stroke-dasharray='7 7'/></svg>"}
box.innerHTML=TREE.replace(/#gtg@/g,'#gtgL').replace(/id='gtg@'/,"id='gtgL'").replace('#','l')+TREE.replace(/#gtg@/g,'#gtgR').replace(/id='gtg@'/,"id='gtgR'").replace('#','r')+
 gift('#d4112e','#e8283f','#ffd54a','left:-27%;bottom:0;width:21%')+gift('#f6efe2','#ffffff','#d4112e','left:-7%;bottom:-1%;width:15%')+gift('#d4112e','#e8283f','#ffd54a','right:-25%;bottom:0;width:19%')+gift('#f6efe2','#ffffff','#d4112e','right:-9%;bottom:-1%;width:13%')+
 cane('left:-19%;bottom:12%;width:6.5%;transform:rotate(-10deg)')+cane('right:-17%;bottom:11%;width:6%;transform:rotate(10deg)');
try{snap=localStorage.getItem(SK)}catch(e){}
if(snap&&/^data:image\/(webp|png);base64,/.test(snap)){var im=new Image();im.alt='';im.src=snap;box.appendChild(im);box.classList.add('snap')}
if(old)old.parentNode.replaceChild(box,old);else g.insertBefore(box,g.firstChild);
/* tuyết rơi phủ toàn màn hình cổng (dưới nội dung, trên nền) */
var sc=document.createElement('canvas');sc.style.cssText='position:absolute!important;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0!important;margin:0!important';g.insertBefore(sc,g.firstChild);
/* viền kẹo gậy đỏ-trắng trên cùng + dây đèn xanh có nơ đỏ, quả ô rô, bóng đỏ treo dưới viền */
var cane0=document.createElement('div');cane0.setAttribute('aria-hidden','true');cane0.style.cssText='position:absolute!important;left:0;top:0;width:100%;height:8px;z-index:0!important;margin:0!important;pointer-events:none;background:repeating-linear-gradient(-45deg,#fff 0 9px,#d4112e 9px 18px);box-shadow:0 2px 6px rgba(0,0,0,.35)';
var HOLLY=function(x){return"<ellipse cx='"+(x-6)+"' cy='14' rx='6' ry='2.4' fill='#1f9a55' transform='rotate(30 "+(x-6)+" 14)'/><ellipse cx='"+(x+6)+"' cy='14' rx='6' ry='2.4' fill='#1f9a55' transform='rotate(-30 "+(x+6)+" 14)'/><circle cx='"+(x-1)+"' cy='16' r='2.4' fill='#e0243f'/><circle cx='"+(x+2.5)+"' cy='17.5' r='2.4' fill='#e0243f'/><circle cx='"+x+"' cy='19.5' r='2.4' fill='#c8102e'/>"};
var GT="<svg xmlns='http://www.w3.org/2000/svg' width='84' height='46' viewBox='0 0 84 46'><path d='M-2 6Q42 40 86 6' fill='none' stroke='#14643a' stroke-width='8' stroke-linecap='round'/><path d='M-2 6Q42 40 86 6' fill='none' stroke='#2fae6a' stroke-width='3' stroke-dasharray='2 5' stroke-linecap='round'/><path d='M0 6L-10 -1L-10 13ZM0 6L10 -1L10 13Z' fill='#e0243f'/><circle cx='0' cy='6' r='3.4' fill='#a3102a'/><path d='M84 6L74 -1L74 13ZM84 6L94 -1L94 13Z' fill='#e0243f'/><circle cx='84' cy='6' r='3.4' fill='#a3102a'/>"+HOLLY(0)+HOLLY(84)+"<circle cx='20' cy='19' r='2.4' fill='#ffd54a'/><circle cx='64' cy='19' r='2.4' fill='#ffd54a'/><rect x='39' y='23.5' width='6' height='3.6' rx='1' fill='#ffd05a'/><circle cx='42' cy='34' r='7' fill='#e0243f'/><circle cx='39.4' cy='31.4' r='2' fill='#fff' fill-opacity='.65'/></svg>";
var gar=document.createElement('div');gar.setAttribute('aria-hidden','true');gar.style.cssText='position:absolute!important;left:0;top:8px;width:100%;height:46px;z-index:0!important;margin:0!important;pointer-events:none;filter:drop-shadow(0 4px 4px rgba(0,0,0,.3));background:url("data:image/svg+xml,'+encodeURIComponent(GT)+'") repeat-x 0 0/84px 46px';
g.insertBefore(gar,g.firstChild);g.insertBefore(cane0,g.firstChild);
var sx=sc.getContext('2d'),fl=[],SW=0,SH=0,fi;
function rs(){SW=sc.width=g.clientWidth||300;SH=sc.height=g.clientHeight||600}rs();window.addEventListener('resize',rs);
for(fi=0;fi<90;fi++)fl.push({x:Math.random(),y:Math.random(),r:1+Math.random()*2.6,v:.08+Math.random()*.12,p:Math.random()*6.3,w:.3+Math.random()*.7});
var lt=performance.now();
(function sn(now){if(!g.parentNode)return;requestAnimationFrame(sn);var dt=Math.min(.05,(now-lt)/1000);lt=now;sx.clearRect(0,0,SW,SH);sx.fillStyle='rgba(255,255,255,.88)';
 fl.forEach(function(f){f.y+=f.v*dt*(.6+f.r*.25);f.p+=dt*f.w;if(f.y>1.02){f.y=-.02;f.x=Math.random()}sx.beginPath();sx.arc((f.x+Math.sin(f.p)*.012)*SW,f.y*SH,f.r,0,6.283);sx.fill()})})(lt);
function tiger3d(){
 var T=window.THREE,TR=window.TR,R=window.TigerRig;if(!T||!TR||!TR.ready||!R)return 0;
 var cv=document.createElement('canvas');cv.width=500;cv.height=600;box.appendChild(cv);
 var r,sc=new T.Scene(),cam=new T.PerspectiveCamera(34,5/6,.1,60),tg=TR.make(T),t0=performance.now(),fr=0;
 try{r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){box.removeChild(cv);return 0}
 r.setPixelRatio(1);r.setSize(500,600,false);r.setClearColor(0,0);
 sc.add(new T.HemisphereLight(0xffffff,0x8a9bd8,1.05));var dl=new T.DirectionalLight(0xffe6c0,.9);dl.position.set(3,6,8);sc.add(dl);
 tg.g.rotation.y=-Math.PI/2+.28;sc.add(tg.g);cam.position.set(0,2.15,11.2);cam.lookAt(0,1.75,0);
 box.classList.add('on');
 var M=R.math,I=R.IDX;
 function qa(ax,ang){var s=Math.sin(ang/2);return[ax[0]*s,ax[1]*s,ax[2]*s,Math.cos(ang/2)]}
 function qe(x,y,z){return M.qmul(qa([0,1,0],y),M.qmul(qa([1,0,0],x),qa([0,0,1],z)))}
 function sst(a,b,x){var u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u)}
 (function loop(){if(!g.parentNode){try{r.forceContextLoss()}catch(e){}return}
  requestAnimationFrame(loop);var t=(performance.now()-t0)/1000;
  /* chu kỳ 10 s, KHÔNG vẫy chào: 0-3.4 chạy bộ tại chỗ | 3.4-4.2 giảm dần rồi dừng | 4.2-9 khởi động (xoay cổ tay + cổ chân, nhấc chân luân phiên) | 9-9.8 chạy lại */
  var cy=t%10,wj=Math.max(0,Math.min(1,1-sst(3.4,4.2,cy)+sst(9,9.8,cy))),wm=sst(4.2,5,cy)*(1-sst(8.4,9,cy));
  var pz=R.solve({ph:t*9,k:.55*wj,t:t,wave:0,cheer:0,jump:0,air:0,lean:0,look:0}),q=pz.q,om=t*9;
  if(wm>.001){['L','R'].forEach(function(s,j){var sg=j?-1:1,lf=Math.max(0,Math.sin(t*2.4+(j?Math.PI:0)));
   q[I['hand.'+s]]=M.nlerp(q[I['hand.'+s]],qe(.85*Math.sin(om),0,sg*.85*Math.cos(om)),wm);
   q[I['thigh.'+s]]=M.nlerp(q[I['thigh.'+s]],qa([1,0,0],-.7*lf),wm);
   q[I['shin.'+s]]=M.nlerp(q[I['shin.'+s]],qa([1,0,0],1.0*lf),wm);
   q[I['foot.'+s]]=M.nlerp(q[I['foot.'+s]],qe(.55*lf*Math.sin(om*.8),0,.55*lf*Math.cos(om*.8)),wm)})}
  TR.apply(tg,pz);
  if(TR.tail)TR.tail(tg,t,0,0);tg.g.position.y=Math.abs(Math.sin(t*3.2))*.1*(1-wj);tg.g.rotation.y=-Math.PI/2+.28+Math.sin(t*.9)*.18*(1-wj)+wj*.75;
  r.render(sc,cam);
  if(!snap&&++fr==30){try{localStorage.setItem(SK,cv.toDataURL('image/webp',.82))}catch(e){}}})();
 return 1}
var tries=0,iv=setInterval(function(){if(!g.parentNode||++tries>500){clearInterval(iv);return}
 try{if(tiger3d())clearInterval(iv)}catch(e){clearInterval(iv)}},80);
var bt=g.querySelector('button'),pp=g.querySelector('p');if(bt)bt.remove();if(pp)pp.textContent='Chọn cửa hàng, nhập số hóa đơn rồi bấm vào đua. Cọp nào đội quà về đích trước, quà đó là của bạn';
var f=document.createElement('div');f.className='gf';
f.innerHTML="<label for='gs'>Cửa hàng</label><div class='gsr'><input id='gs' placeholder='Gõ tên cửa hàng để tìm' autocomplete='off'><div id='gl' hidden></div></div><label for='gh'>Số hóa đơn</label><input id='gh' placeholder='Nhập số hóa đơn' autocomplete='off'><p id='ge' class='ge'></p><button id='gb' type='button' class='gbtn'>🐯 VÀO ĐUA</button>";
g.appendChild(f);
var gs=$('gs'),gl=$('gl'),gh=$('gh'),ge=$('ge'),gb=$('gb');
function err(m){ge.textContent=m||''}
function render(){var d=D(),q=fold(gs.value);if(!d){gl.innerHTML="<div class='gi none'>Đang tải danh sách cửa hàng…</div>";return}
 var l=(d.stores||[]).filter(function(s){return fold(s).indexOf(q)>=0});
 gl.innerHTML=l.length?l.map(function(s){var h=has(d,s);return"<div class='gi"+(h?"":" off")+"' data-s='"+esc(s)+"'>"+esc(s)+(h?'':" <small>(hết quà)</small>")+"</div>"}).join(''):"<div class='gi none'>Không tìm thấy cửa hàng</div>"}
function open(){render();gl.hidden=false}
function pick(s){var d=D();if(d&&!has(d,s)){err('Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác');return}ST=s;gs.value=s;gl.hidden=true;err('');window.DC.pick(s)}
gs.addEventListener('focus',open);gs.addEventListener('click',open);
gs.addEventListener('input',function(){ST='';open()});
gl.addEventListener('click',function(e){var t=e.target.closest('.gi');if(t&&t.dataset.s&&!t.classList.contains('off'))pick(t.dataset.s);else if(t&&t.classList.contains('off'))err('Cửa hàng này đã hết quà, vui lòng chọn cửa hàng khác')});
document.addEventListener('click',function(e){if(!e.target.closest('.gsr'))gl.hidden=true});
var ld=setInterval(function(){if(D()){clearInterval(ld);if(!gl.hidden)render()}},400);
gb.addEventListener('click',function(){
 var d=D();if(!d||!window.DC){err('Đang tải dữ liệu, vui lòng đợi vài giây rồi bấm lại');return}
 if(!ST){var m=(d.stores||[]).filter(function(s){return fold(s)===fold(gs.value)})[0];if(m)pick(m)}
 if(!ST){err('Vui lòng chọn cửa hàng (gõ tên rồi bấm vào tên cửa hàng)');return}
 var hd=gh.value.trim();if(!hd){err('Vui lòng nhập số hóa đơn');return}
 err('');gb.disabled=true;gb.textContent='⏳ Đang kiểm tra hóa đơn…';
 window.DC.start(hd,function(m){
  if(m){err(m);gb.disabled=false;gb.textContent='🐯 VÀO ĐUA';return}
  window.__gate=1;g.classList.add('out');setTimeout(function(){if(g.parentNode)g.parentNode.removeChild(g)},700)})});
gh.addEventListener('keydown',function(e){if(e.key==='Enter')gb.click()});
/* Sau khi đua xong: khách đăng nhập Facebook (lấy UID) -> nhận quà -> chia sẻ khoảnh khắc về nhất. Chưa cấu hình CFG.FB_APP_ID thì dùng form tên + SĐT như cũ. */
var HASH='#9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh';
function loadFB(){return new Promise(function(ok,no){
 if(window.FB&&window.__fbInit)return ok(window.FB);
 window.fbAsyncInit=function(){try{window.FB.init({appId:window.CFG.FB_APP_ID,version:'v19.0',cookie:false,xfbml:false});window.__fbInit=1;ok(window.FB)}catch(e){no(e)}};
 var s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/vi_VN/sdk.js';s.onerror=function(){no(new Error('Không tải được Facebook'))};document.head.appendChild(s);
 setTimeout(function(){if(!window.__fbInit)no(new Error('Facebook phản hồi quá lâu, vui lòng thử lại'))},12000)})}
/* Ảnh chia sẻ: khung hình cọp về đích chụp từ cảnh 3D + dải chữ quà */
function shareImg(prize){return new Promise(function(ok){
 var src=window.__snap;if(!src)return ok(null);
 var im=new Image();im.onload=function(){
  var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var k=Math.max(W/im.width,H/im.height),w=im.width*k,h=im.height*k;x.drawImage(im,(W-w)/2,(H-h)/2,w,h);
  var g=x.createLinearGradient(0,H-330,0,H);g.addColorStop(0,'rgba(5,30,22,0)');g.addColorStop(1,'rgba(5,30,22,.92)');x.fillStyle=g;x.fillRect(0,H-330,W,330);
  x.textAlign='center';x.fillStyle='#ffe08a';x.font='800 40px "Be Vietnam Pro",sans-serif';x.fillText('9 SẠCH · ĐUA CỌP GIÁNG SINH',W/2,H-200);
  x.fillStyle='#fff';x.font='900 78px "Be Vietnam Pro",sans-serif';x.fillText('VỀ NHẤT! '+String(prize||'').slice(0,22),W/2,H-110);
  x.fillStyle='#ffd05a';x.font='700 34px "Be Vietnam Pro",sans-serif';x.fillText(HASH.split(' ')[0]+' '+HASH.split(' ')[2],W/2,H-50);
  c.toBlob(function(b){ok(b)},'image/jpeg',.9)};
 im.onerror=function(){ok(null)};im.src=src})}
function shareStep(b,r,blob){
 var cap='Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng '+r.ten+'! '+HASH,url=location.origin+location.pathname,imgUrl=blob?URL.createObjectURL(blob):'';
 b.innerHTML="<div class='big'>✅</div><h2>Đã ghi nhận quà!</h2>"+(imgUrl?"<img src='"+imgUrl+"' alt='' style='max-width:62%;max-height:240px;border-radius:14px'>":"")+"<h1>"+esc(r.ten)+"</h1><p>Bấm chia sẻ lên Facebook, nội dung bài đăng đã được sao chép sẵn, chỉ cần dán và đăng.</p><p id='se' class='ge'></p><button id='sb' class='btn' type='button'>📣 CHIA SẺ LÊN FACEBOOK</button><button class='btn' type='button' id='sx' style='background:#6b7280'>Đóng, đưa màn hình cho nhân viên nhận quà</button>";
 $('sx').onclick=function(){location.reload()};
 $('sb').onclick=function(){
  var e=$('se');try{if(navigator.clipboard)navigator.clipboard.writeText(cap)}catch(x){}
  var f=blob?new File([blob],'9sach-duacop.jpg',{type:'image/jpeg'}):null;
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){
   navigator.share({files:[f],text:cap}).catch(function(){});e.textContent='Đã sao chép nội dung, hãy dán khi đăng.';return}
  if(blob){var a=document.createElement('a');a.href=imgUrl;a.download='9sach-duacop.jpg';document.body.appendChild(a);a.click();a.remove();e.textContent='Đã sao chép nội dung và tải ảnh về máy, hãy đính kèm ảnh khi đăng.'}
  else e.textContent='Đã sao chép nội dung, hãy dán khi đăng.';
  window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&hashtag='+encodeURIComponent('#9sach'),'_blank')}}
window.DCclaim=function(r,hd){
 var rs=$('rs'),b=rs.querySelector('.box'),im=window.DC.img(r.ten),fbOn=!!(window.CFG&&window.CFG.FB_APP_ID),imgP=shareImg(r.ten);
 rs.hidden=false;
 function head(extra){b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2>"+(im?"<img src='"+im+"' alt=''>":"")+"<p>Cọp của bạn đã đội quà về đích</p><h1>"+esc(r.ten)+"</h1>"+extra}
 function fin2(){imgP.then(function(bl){shareStep(b,r,bl)})}
 function fail(x,btn,label){var e=$('ce');if(/đã nhập thông tin/.test(x.message)){fin2();return}e.textContent=x.message;btn.disabled=false;btn.textContent=label}
 function phoneForm(note){
  head("<p>"+(note||"Nhập số điện thoại để nhận quà")+"</p><div class='fm'><input id='cp' type='tel' inputmode='numeric' maxlength='11' placeholder='Số điện thoại' autocomplete='tel'></div><p id='ce' class='ge'></p><button id='cb' class='btn' type='button'>🎁 NHẬN QUÀ</button>");
  $('cb').onclick=function(){
   var sdt=$('cp').value.replace(/[^0-9]/g,''),e=$('ce'),btn=$('cb');
   if(!/^0[0-9]{9}$/.test(sdt)){e.textContent='Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';return}
   e.textContent='';btn.disabled=true;btn.textContent='⏳ Đang gửi…';
   window.api('claim',{sdt:sdt,hd:hd,tok:r.tok}).then(fin2).catch(function(x){fail(x,btn,'🎁 NHẬN QUÀ')})}}
 if(fbOn){
  var L='📣 ĐĂNG NHẬP FACEBOOK & CHIA SẺ';
  head("<p>Đăng nhập Facebook để nhận quà và chia sẻ khoảnh khắc về nhất</p><p id='ce' class='ge'></p><button id='cb' class='btn' type='button' style='background:#1877f2;color:#fff'>"+L+"</button><p style='margin-top:10px'><a href='#' id='cs' style='color:#7a0a1c;font-weight:700'>Không dùng Facebook? Nhập số điện thoại</a></p>");
  $('cs').onclick=function(ev){ev.preventDefault();phoneForm()};
  loadFB().catch(function(){});
  $('cb').onclick=function(){var btn=$('cb');
   if(!window.FB||!window.__fbInit){$('ce').textContent='Đang tải Facebook, vui lòng bấm lại sau 1-2 giây';loadFB().catch(function(){phoneForm('Không mở được Facebook, vui lòng nhập số điện thoại để nhận quà')});return}
   btn.disabled=true;btn.textContent='⏳ Đang mở Facebook…';$('ce').textContent='';
   window.FB.login(function(res){
    if(!res||!res.authResponse){$('ce').textContent='Chưa đăng nhập được Facebook (mã: '+((res&&res.status)||'không phản hồi')+'). Nếu cửa sổ bị chặn, hãy cho phép cửa sổ bật lên rồi bấm lại.';try{console.warn('FB.login',JSON.stringify(res))}catch(e){}btn.disabled=false;btn.textContent=L;return}
    btn.textContent='⏳ Đang ghi nhận…';
    window.api('claim',{fbt:res.authResponse.accessToken,hd:hd,tok:r.tok}).then(fin2).catch(function(x){
     if(/Facebook/.test(x.message)){phoneForm('Đăng nhập Facebook chưa được, vui lòng nhập số điện thoại để nhận quà');return}
     fail(x,btn,L)})
   },{scope:'public_profile'})};
  return}
 phoneForm()};
})();
