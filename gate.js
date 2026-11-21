/* Cổng vào game: chọn cửa hàng (tìm kiếm) + số hóa đơn -> đua; sau khi đua trúng quà mới nhập tên + SĐT. Cần window.DC do flow-patch.js tạo trong game.js. */
/* v4 (mục 2): cọp ở cổng lặp chu kỳ 12 giây: vẫy chào -> khởi động (xoay cổ tay, xoay cổ chân, nhấc chân luân phiên) -> chạy bộ tại chỗ; thêm 2 cây thông Noel hai bên cọp + tuyết rơi toàn màn hình. */
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
var old=g.querySelector('.gt'),box=document.createElement('div');box.className='gt3';
/* 2 cây thông Noel (SVG) đứng hai bên cọp: 3 tầng lá, mũ tuyết, bóng đèn nhấp nháy, ngôi sao vàng */
var TREE="<svg class='gtree #' viewBox='0 0 100 150' aria-hidden='true'><defs><linearGradient id='gtg@' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#34b06c'/><stop offset='1' stop-color='#0f5a3a'/></linearGradient></defs><rect x='43' y='128' width='14' height='20' rx='2' fill='#6b3f1d'/><polygon points='50,70 97,134 3,134' fill='url(#gtg@)'/><polygon points='50,70 60,84 40,84' fill='#fff'/><polygon points='50,40 90,98 10,98' fill='url(#gtg@)'/><polygon points='50,40 60,54 40,54' fill='#fff'/><polygon points='50,16 80,64 20,64' fill='url(#gtg@)'/><polygon points='50,16 58,30 42,30' fill='#fff'/><circle class='o' cx='38' cy='118' r='4' fill='#ff3b3b'/><circle class='o' cx='62' cy='110' r='4' fill='#ffd54a'/><circle class='o' cx='78' cy='124' r='3.6' fill='#4fc3f7'/><circle class='o' cx='24' cy='126' r='3.6' fill='#ffd54a'/><circle class='o' cx='44' cy='86' r='3.6' fill='#ff8ad8'/><circle class='o' cx='62' cy='80' r='3.6' fill='#ff3b3b'/><circle class='o' cx='34' cy='58' r='3.2' fill='#4fc3f7'/><circle class='o' cx='56' cy='50' r='3.2' fill='#ffd54a'/><circle class='o' cx='48' cy='34' r='3' fill='#ff3b3b'/><polygon points='50,1 52.4,6.8 58.6,7.2 53.8,11.2 55.3,17.3 50,14 44.7,17.3 46.2,11.2 41.4,7.2 47.6,6.8' fill='#ffd54a' stroke='#e8a317' stroke-width='.8'/></svg>";
box.innerHTML=TREE.replace(/#gtg@/g,'#gtgL').replace(/id='gtg@'/,"id='gtgL'").replace('#','l')+TREE.replace(/#gtg@/g,'#gtgR').replace(/id='gtg@'/,"id='gtgR'").replace('#','r');
try{snap=localStorage.getItem(SK)}catch(e){}
if(snap&&/^data:image\/(webp|png);base64,/.test(snap)){var im=new Image();im.alt='';im.src=snap;box.appendChild(im);box.classList.add('snap')}
if(old)old.parentNode.replaceChild(box,old);else g.insertBefore(box,g.firstChild);
/* tuyết rơi phủ toàn màn hình cổng (dưới nội dung, trên nền) */
var sc=document.createElement('canvas');sc.style.cssText='position:absolute!important;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0!important;margin:0!important';g.insertBefore(sc,g.firstChild);
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
  /* chu kỳ 12 s: 0-2.4 vẫy chào | 3-7 khởi động (xoay cổ tay + cổ chân, nhấc chân luân phiên) | 7-11 chạy bộ tại chỗ */
  var cy=t%12,wW=Math.max(0,Math.min(1,1-sst(2.4,3.2,cy)+sst(11.2,12,cy))),wm=sst(2.8,3.6,cy)*(1-sst(6.6,7.4,cy)),wj=sst(6.8,7.8,cy)*(1-sst(10.6,11.4,cy));
  var pz=R.solve({ph:t*9,k:.55*wj,t:t,wave:wW,cheer:0,jump:0,air:0,lean:0,look:0}),q=pz.q,om=t*9;
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
