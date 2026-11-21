/* Cổng vào game: chọn cửa hàng (tìm kiếm) + số hóa đơn -> đua; sau khi đua trúng quà mới nhập tên + SĐT. Cần window.DC do flow-patch.js tạo trong game.js. */
(function(){
var $=function(i){return document.getElementById(i)},ST='',g=$('gate');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fold(s){return String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d').toLowerCase().replace(/\s+/g,' ').trim()}
function D(){return window.DC?window.DC.d():null}
function has(d,s){return((d.prizes||{})[s]||[]).length>0||!!(d.unk&&d.unk[s])}
if(!g)return;
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
