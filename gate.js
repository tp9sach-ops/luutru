/* Cổng vào game: chọn cửa hàng (tìm kiếm) + số hóa đơn -> đua; sau khi đua trúng quà mới nhập tên + SĐT. Cần window.DC do flow-patch.js tạo trong game.js. */
/* v5: bỏ vẫy chào. Cọp ở cổng lặp chu kỳ 10 giây: chạy bộ tại chỗ (0-3.4 s) -> dừng lại khởi động: xoay cổ tay, xoay cổ chân, nhấc chân luân phiên (4.2-9 s) -> chạy tiếp. Nền đỏ Noel, dây đèn bóng đỏ trên đầu, viền kẹo gậy, hộp quà đỏ, cây thông có dây ruy băng + bóng đỏ, tuyết rơi. */
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
/* v5: giao diện đỏ Noel cho cổng (nạp sau premium.css/flow.css nên thắng cùng độ ưu tiên) */
var sty2=document.createElement('style');
sty2.textContent="#gate{padding-top:max(58px,calc(env(safe-area-inset-top) + 50px));background:radial-gradient(circle,rgba(255,255,255,.14) 2px,transparent 2.5px) 0 0/30px 30px,radial-gradient(ellipse at 50% 24%,#e8283f 0,#b5112c 40%,#5a0716 78%,#2a030b 100%)}"+
"#gate:before{background:repeating-conic-gradient(rgba(255,214,120,.17) 0 7deg,transparent 7deg 18deg)}"+
"#gate h2{filter:drop-shadow(0 2px 0 #4a0512) drop-shadow(0 8px 14px rgba(0,0,0,.65))}"+
"#gate p{color:#ffe9dc}#gate .gf label{color:#fff0c2;text-shadow:0 1px 3px rgba(0,0,0,.5)}"+
"#gate .ge{color:#fff;background:rgba(0,0,0,.4)}"+
"#gate .gf input{border-color:#ffd27a;box-shadow:0 4px 10px rgba(0,0,0,.25)}"+
".gt3 .ggift{position:absolute;height:auto;z-index:0;filter:drop-shadow(0 6px 6px rgba(0,0,0,.4))}";
document.head.appendChild(sty2);
var old=g.querySelector('.gt'),box=document.createElement('div');box.className='gt3';
/* 2 cây thông Noel (SVG) đứng hai bên cọp: 3 tầng lá, mũ tuyết, dây ruy băng đỏ, bóng đèn đỏ/vàng nhấp nháy, ngôi sao vàng */
var TREE="<svg class='gtree #' viewBox='0 0 100 150' aria-hidden='true'><defs><linearGradient id='gtg@' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#34b06c'/><stop offset='1' stop-color='#0f5a3a'/></linearGradient></defs><rect x='43' y='128' width='14' height='20' rx='2' fill='#6b3f1d'/><polygon points='50,70 97,134 3,134' fill='url(#gtg@)'/><polygon points='50,70 60,84 40,84' fill='#fff'/><polygon points='50,40 90,98 10,98' fill='url(#gtg@)'/><polygon points='50,40 60,54 40,54' fill='#fff'/><polygon points='50,16 80,64 20,64' fill='url(#gtg@)'/><polygon points='50,16 58,30 42,30' fill='#fff'/>"+
"<path d='M19 112Q50 128 81 112' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/><path d='M23 80Q50 93 77 80' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/><path d='M28 52Q50 63 72 52' fill='none' stroke='#e0243f' stroke-width='3.4' stroke-linecap='round'/>"+
"<circle class='o' cx='38' cy='122' r='4.4' fill='#e0243f'/><circle class='o' cx='62' cy='118' r='4' fill='#ffd54a'/><circle class='o' cx='80' cy='126' r='4' fill='#e0243f'/><circle class='o' cx='24' cy='127' r='3.8' fill='#ffd54a'/><circle class='o' cx='44' cy='100' r='4' fill='#e0243f'/><circle class='o' cx='62' cy='94' r='3.8' fill='#ffd54a'/><circle class='o' cx='36' cy='70' r='3.6' fill='#e0243f'/><circle class='o' cx='60' cy='66' r='3.6' fill='#e0243f'/><circle class='o' cx='46' cy='44' r='3.4' fill='#ffd54a'/><circle class='o' cx='55' cy='36' r='3.2' fill='#e0243f'/>"+
"<polygon points='50,1 52.4,6.8 58.6,7.2 53.8,11.2 55.3,17.3 50,14 44.7,17.3 46.2,11.2 41.4,7.2 47.6,6.8' fill='#ffd54a' stroke='#e8a317' stroke-width='.8'/></svg>";
/* hộp quà đỏ/trắng ruy băng vàng đặt dưới chân cây */
function gift(b,l,r,st){return"<svg class='ggift' style='"+st+"' viewBox='0 0 60 60' aria-hidden='true'><rect x='5' y='25' width='50' height='33' rx='3' fill='"+b+"'/><rect x='3' y='17' width='54' height='11' rx='3' fill='"+l+"'/><rect x='26' y='17' width='8' height='41' fill='"+r+"'/><path d='M30 17C21 3 8 7 13 14C17 19 27 17 30 17ZM30 17C39 3 52 7 47 14C43 19 33 17 30 17Z' fill='none' stroke='"+r+"' stroke-width='3.6' stroke-linejoin='round'/></svg>"}
box.innerHTML=TREE.replace(/#gtg@/g,'#gtgL').replace(/id='gtg@'/,"id='gtgL'").replace('#','l')+TREE.replace(/#gtg@/g,'#gtgR').replace(/id='gtg@'/,"id='gtgR'").replace('#','r')+
 gift('#d4112e','#e8283f','#ffd54a','left:-27%;bottom:0;width:21%')+gift('#f6efe2','#ffffff','#d4112e','left:-7%;bottom:-1%;width:15%')+gift('#d4112e','#e8283f','#ffd54a','right:-25%;bottom:0;width:19%')+gift('#f6efe2','#ffffff','#d4112e','right:-9%;bottom:-1%;width:13%');
try{snap=localStorage.getItem(SK)}catch(e){}
if(snap&&/^data:image\/(webp|png);base64,/.test(snap)){var im=new Image();im.alt='';im.src=snap;box.appendChild(im);box.classList.add('snap')}
if(old)old.parentNode.replaceChild(box,old);else g.insertBefore(box,g.firstChild);
/* tuyết rơi phủ toàn màn hình cổng (dưới nội dung, trên nền) */
var sc=document.createElement('canvas');sc.style.cssText='position:absolute!important;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0!important;margin:0!important';g.insertBefore(sc,g.firstChild);
/* v5: viền kẹo gậy đỏ-trắng trên cùng + dây đèn/bóng đỏ treo dưới viền */
var cane=document.createElement('div');cane.setAttribute('aria-hidden','true');cane.style.cssText='position:absolute!important;left:0;top:0;width:100%;height:8px;z-index:0!important;margin:0!important;pointer-events:none;background:repeating-linear-gradient(-45deg,#fff 0 9px,#d4112e 9px 18px);box-shadow:0 2px 6px rgba(0,0,0,.35)';
var GT="<svg xmlns='http://www.w3.org/2000/svg' width='84' height='46' viewBox='0 0 84 46'><path d='M-2 6Q42 40 86 6' fill='none' stroke='#14643a' stroke-width='8' stroke-linecap='round'/><path d='M-2 6Q42 40 86 6' fill='none' stroke='#2fae6a' stroke-width='3' stroke-dasharray='2 5' stroke-linecap='round'/><path d='M0 6L-10 -1L-10 13ZM0 6L10 -1L10 13Z' fill='#e0243f'/><circle cx='0' cy='6' r='3.4' fill='#a3102a'/><path d='M84 6L74 -1L74 13ZM84 6L94 -1L94 13Z' fill='#e0243f'/><circle cx='84' cy='6' r='3.4' fill='#a3102a'/><circle cx='20' cy='19' r='2.4' fill='#ffd54a'/><circle cx='64' cy='19' r='2.4' fill='#ffd54a'/><rect x='39' y='23.5' width='6' height='3.6' rx='1' fill='#ffd05a'/><circle cx='42' cy='34' r='7' fill='#e0243f'/><circle cx='39.4' cy='31.4' r='2' fill='#fff' fill-opacity='.65'/></svg>";
var gar=document.createElement('div');gar.setAttribute('aria-hidden','true');gar.style.cssText='position:absolute!important;left:0;top:8px;width:100%;height:46px;z-index:0!important;margin:0!important;pointer-events:none;filter:drop-shadow(0 4px 4px rgba(0,0,0,.3));background:url("data:image/svg+xml,'+encodeURIComponent(GT)+'") repeat-x 0 0/84px 46px';
g.insertBefore(gar,g.firstChild);g.insertBefore(cane,g.firstChild);
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
/* Sau khi đua xong: khách nhập tên + SĐT để nhận quà */
window.DCclaim=function(r,hd){
 var rs=$('rs'),b=rs.querySelector('.box'),im=window.DC.img(r.ten);
 b.innerHTML="<div class='big'>🎉</div><h2>Chúc mừng bạn!</h2>"+(im?"<img src='"+im+"' alt=''>":"")+"<p>Cọp của bạn đã đội quà về đích</p><h1>"+esc(r.ten)+"</h1><p>Nhập thông tin để nhận quà</p><div class='fm'><input id='cn' placeholder='Họ tên' autocomplete='name'><input id='cp' type='tel' inputmode='numeric' maxlength='11' placeholder='Số điện thoại' autocomplete='tel'></div><p id='ce' class='ge'></p><button id='cb' class='btn' type='button'>🎁 NHẬN QUÀ</button>";
 rs.hidden=false;
 function done(ch){b.innerHTML="<div class='big'>✅</div><h2>Đã ghi nhận!</h2><h1>"+esc(r.ten)+"</h1><p>Vui lòng đưa màn hình này cho nhân viên"+(ch?" tại <b>"+esc(ch)+"</b>":"")+" để nhận quà. 🎅</p><button class='btn' onclick='location.reload()'>Đóng</button>"}
 $('cb').onclick=function(){
  var ten=$('cn').value.trim(),sdt=$('cp').value.replace(/[^0-9]/g,''),e=$('ce');
  if(!ten){e.textContent='Vui lòng nhập họ tên';return}
  if(!/^0[0-9]{9}$/.test(sdt)){e.textContent='Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';return}
  e.textContent='';$('cb').disabled=true;$('cb').textContent='⏳ Đang gửi…';
  window.api('claim',{ten:ten,sdt:sdt,hd:hd,tok:r.tok}).then(function(x){done(x&&x.ch)}).catch(function(x){
   if(/đã nhập thông tin/.test(x.message)){done('');return}
   e.textContent=x.message;$('cb').disabled=false;$('cb').textContent='🎁 NHẬN QUÀ'})}};
})();
