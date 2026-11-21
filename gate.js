/* Cổng vào game: chọn cửa hàng (tìm kiếm) + số hóa đơn -> đua; sau khi đua trúng quà mới nhập tên + SĐT. Cần window.DC do flow-patch.js tạo trong game.js. */
(function(){
var $=function(i){return document.getElementById(i)},ST='',g=$('gate');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fold(s){return String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d').toLowerCase().replace(/\s+/g,' ').trim()}
function D(){return window.DC?window.DC.d():null}
function has(d,s){return((d.prizes||{})[s]||[]).length>0||!!(d.unk&&d.unk[s])}
if(!g)return;
/* Cọp 3D ở cổng: dùng đúng mô hình có xương của game (logo 9 SẠCH trước ngực, băng đô marathon, đuôi). Trong lúc chờ nạp, hiện logo. */
var sty=document.createElement('style');sty.textContent=".gt3{position:relative;width:min(56vw,42vh,250px);aspect-ratio:5/6;margin-bottom:4px!important}.gt3 img{position:absolute;left:20%;top:22%;width:60%;filter:drop-shadow(0 10px 16px rgba(0,0,0,.4))}.gt3 canvas{position:absolute;left:0;top:0;width:100%;height:100%;filter:drop-shadow(0 14px 18px rgba(0,0,0,.45))}.gt3.on img{display:none}@media(max-height:480px){.gt3{display:none}}";document.head.appendChild(sty);
var old=g.querySelector('.gt'),box=document.createElement('div');box.className='gt3';box.innerHTML="<img alt='9 Sạch'>";box.firstChild.src=window.L9URL||'logo-9sach.png?v=2';
if(old)old.parentNode.replaceChild(box,old);else g.insertBefore(box,g.firstChild);
function tiger3d(){
 var T=window.THREE,TR=window.TR,R=window.TigerRig;if(!T||!TR||!TR.ready||!R)return 0;
 var cv=document.createElement('canvas');cv.width=500;cv.height=600;box.appendChild(cv);
 var r,sc=new T.Scene(),cam=new T.PerspectiveCamera(34,5/6,.1,60),tg=TR.make(T),t0=performance.now();
 try{r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){box.removeChild(cv);return 0}
 r.setPixelRatio(1);r.setSize(500,600,false);r.setClearColor(0,0);
 sc.add(new T.HemisphereLight(0xffffff,0x8a9bd8,1.05));var dl=new T.DirectionalLight(0xffe6c0,.9);dl.position.set(3,6,8);sc.add(dl);
 tg.g.rotation.y=-Math.PI/2+.28;sc.add(tg.g);cam.position.set(0,2.15,11.2);cam.lookAt(0,1.75,0);
 box.classList.add('on');
 (function loop(){if(!g.parentNode){try{r.forceContextLoss()}catch(e){}return}
  requestAnimationFrame(loop);var t=(performance.now()-t0)/1000;
  TR.apply(tg,R.solve({ph:0,k:0,t:t,wave:1,cheer:0,jump:0,air:0,lean:0,look:0}));
  if(TR.tail)TR.tail(tg,t,0,0);tg.g.position.y=Math.abs(Math.sin(t*3.2))*.1;tg.g.rotation.y=-Math.PI/2+.28+Math.sin(t*.9)*.18;
  r.render(sc,cam)})();
 return 1}
var tries=0,iv=setInterval(function(){if(!g.parentNode||++tries>160){clearInterval(iv);return}
 try{if(tiger3d())clearInterval(iv)}catch(e){clearInterval(iv)}},250);
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
