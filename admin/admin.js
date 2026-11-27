/* Trang quản lý Đua Cọp 9 Sạch – gom: trao thưởng, thống kê, QR + link cửa hàng, poster A5, quà tặng, ảnh quà, cửa hàng, cài đặt.
   Dùng CHUNG máy chủ Google Apps Script với game (không sửa Code.gs, không đụng file nào của game). */
var API='https://script.google.com/macros/s/AKfycbx80zKKqUsDDv-zvfspmSgk5rMYwvBQwVO7LOzRh_9a_W9S3QTjsjwBHRm4IHllR1kp/exec';
var DEFB='https://duacop.vercel.app';
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var enc=encodeURIComponent;
var TN={h:'trao-thuong',x:'thong-ke',q:'qr',g:'qua-tang',i:'anh-qua',c:'cua-hang',s:'cai-dat'},TR={};
Object.keys(TN).forEach(function(k){TR[TN[k]]=k});
/* Đường dẫn: #thong-ke | #qr | #mk=MÃ&t=thong-ke | #ch=TÊN&k=MÃ[&t=qr] */
var HP=(function(){var h=location.hash.slice(1),o={};if(!h)return o;if(h.indexOf('=')<0){o.t=h;return o}new URLSearchParams(h).forEach(function(v,k){o[k]=v});return o})();
var AU={sdt:'',ten:''};if(HP.ch&&HP.k){AU.ch=HP.ch;AU.k=HP.k}else if(HP.mk)AU.mk=HP.mk;
var KEYS=null,U=null,H=null,AD=null,ST='',T='h',NM=[],HT=0,HL=0,FD='',FQ='',FT='p',AL=0,LT=0,PN=-1,PT=0,LK=[],PS=[],PU={},X1='',X2='',TT='Quản lý Đua Cọp – 9 Sạch';

function base(){var b='';try{b=localStorage.dc_base||''}catch(e){}return(b||DEFB).replace(/\/+$/,'')}
function hashFor(n){return AU.mk?'#mk='+enc(AU.mk)+'&t='+n:'#'+n}
function custLink(s){return base()+'/?ch='+enc(s)}
function adminLink(s,k){return base()+'/admin/#ch='+enc(s)+'&k='+enc(k)}

/* ---------- Gọi máy chủ ---------- */
async function call(a,d){
 var body=JSON.stringify(Object.assign({a:a,au:AU},d||{})),n=(a=='login'||a=='hist'||a=='adminAll')?2:1,err;
 for(var k=0;k<n;k++){
  var ac=new AbortController(),tm=setTimeout(function(){ac.abort()},30000);
  try{
   var r=await fetch(API,{method:'POST',body:body,signal:ac.signal}),j=await r.json();clearTimeout(tm);
   if(!j.ok){var se=new Error(j.m);se.srv=1;throw se}
   return j.d
  }catch(e){clearTimeout(tm);if(e.srv)throw e;err=new Error('Máy chủ phản hồi quá chậm hoặc mất kết nối, bấm Thử lại')}
 }
 throw err
}
function ld(){var t0=Date.now();clearInterval(LT);$('v').innerHTML='<p>⏳ Đang tải... <span id=lt></span></p>';LT=setInterval(function(){var s=$('lt');if(!s){clearInterval(LT);return}s.textContent=Math.round((Date.now()-t0)/1000)+' giây'},1000)}
function er(e){clearInterval(LT);$('v').innerHTML='<p class=err>'+esc(e.message)+'</p><button class=sm data-a="retry">🔄 Thử lại</button>'}
function retry(){if(T=='h'||T=='x'){H=null;ld();loadH()}else{AD=null;ld();loadA()}}

/* ---------- Vào trang ---------- */
async function boot(){
 $('bm').className='';$('bm').textContent='⏳ Đang vào trang quản lý...';$('bb').hidden=true;
 try{U=await call('login');start()}
 catch(e){$('bm').className='err';$('bm').textContent=e.message;$('bb').hidden=false}
}
function allowed(t){
 if(t=='h'||t=='x')return true;
 if(t=='q')return !!(U.mgr||U.own);
 if(t=='g')return !!(U.mgr||U.own);
 return !!U.mgr
}
function start(){
 $('bx').hidden=true;$('ad').hidden=false;
 document.querySelectorAll('.tabs button').forEach(function(b){b.hidden=!allowed(b.dataset.t)});
 $('wn').hidden=!!(U.mgr||U.own);
 if(U.own){TT='Admin – '+U.own;document.title=TT;$('h1').textContent='🐯 Admin – '+U.own}
 var sv='';try{sv=localStorage.dc_store||''}catch(e){}
 ST=U.own?U.own:(U.stores.indexOf(sv)>=0?sv:'');
 fillS();
 var t0=TR[HP.t]||'h';if(!allowed(t0))t0='h';
 tab(t0);poll();clearInterval(PT);PT=setInterval(poll,20000)
}

/* ---------- Chọn cửa hàng (dùng chung mọi mục) ---------- */
function fillS(){$('gs').innerHTML=(U.own?'':'<option value="">🌐 Tất cả cửa hàng</option>')+U.stores.map(function(s){return '<option value="'+esc(s)+'"'+(s==ST?' selected':'')+'>🏬 '+esc(s)+'</option>'}).join('')}
function setS(v){ST=v;if(!U.own){try{localStorage.dc_store=v}catch(e){}}R()}
function pickS(n){setS(n);fillS()}
$('gs').onchange=function(){setS(this.value)};

/* ---------- Thông báo quà chờ trao ---------- */
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.setValueAtTime(.2,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.6);o.start();o.stop(a.currentTime+.6)}catch(e){}}
async function poll(){
 if(!U)return;
 try{
  var r=await call('pending'),b=$('nt');
  if(r.n>0){
   b.hidden=false;
   b.innerHTML='🔔 Có '+r.n+' lượt trúng quà đang chờ trao<br><u>👉 Bấm vào đây để đi tới phần TRAO THƯỞNG</u><small>'+r.latest.map(function(x){return esc(x.ch)+': '+esc(x.ten||'')+' – '+esc(x.qua)}).join(' • ')+'</small>';
   document.title='('+r.n+') '+TT;
   if(PN>=0&&r.n>PN){beep();loadH()}
  }else{b.hidden=true;document.title=TT}
  PN=r.n
 }catch(e){}
}
function goPend(){FT='p';FQ='';FD='';ST=U.own||'';$('gs').value=ST;T='h';H=null;R();loadH();try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}}

/* ---------- Chuyển mục ---------- */
function tab(t){
 T=t;
 try{if(!AU.ch)history.replaceState(null,'',location.pathname+location.search+hashFor(TN[t]))}catch(e){}
 R();
 if(t=='h'||t=='x'){if(!H||Date.now()-HT>30000)loadH()}
 if('gicsx'.indexOf(t)>=0&&U&&(U.mgr||U.own))ensureA()
}
function R(){
 document.querySelectorAll('.tabs button').forEach(function(b){b.classList.toggle('on',b.dataset.t==T)});
 if(T=='h')vH();else if(T=='x')vX();else if(T=='q')vQ();else if(!AD)ld();else({g:vG,c:vC,s:vS,i:vI})[T]()
}
document.querySelectorAll('.tabs button').forEach(function(b){b.onclick=function(){tab(b.dataset.t)}});
document.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(b&&typeof window[b.dataset.a]=='function')window[b.dataset.a](b.dataset.i)});
$('v').onchange=function(e){var f=e.target;if(f.type!='file')return;if(f.dataset.p)pimg(f.dataset.p,f.files[0]);else if(f.dataset.n)nimg(f.dataset.n,f.files[0]);else cimg(f.dataset.k,f.files[0],+f.dataset.w)};
async function loadA(){AL=1;try{AD=await call('adminAll');if(T!='h'&&T!='q')R()}catch(e){if(T!='h'&&T!='x'&&T!='q')er(e)}AL=0}
function ensureA(){if(!AD&&!AL)loadA()}

/* ---------- Dữ liệu lịch sử đua (dùng cho Trao thưởng + Thống kê) ---------- */
async function loadH(){
 if(HL)return;HL=1;
 try{
  H=await call('hist');HT=Date.now();
  if(T=='h'){if($('ht'))hr();else vH()}else if(T=='x')vX()
 }catch(e){if((T=='h'||T=='x')&&!H)er(e)}
 HL=0;
 if(U&&(U.mgr||U.own))ensureA()
}

/* ---------- TRAO THƯỞNG ---------- */
function fT(x){FT=x||'';vH()}
function vH(){
 if(!H){ld();return}
 $('v').innerHTML="<div class='fl'>"+[['p','⏳ Chờ trao'],['d','✅ Đã trao'],['','📋 Tất cả']].map(function(x){return "<button class='"+(FT==x[0]?'on':'')+"' data-a='fT' data-i='"+x[0]+"'>"+x[1]+'</button>'}).join('')+"</div><input id='fq' value='"+esc(FQ)+"' placeholder='🔍 Tìm số hóa đơn / SĐT / tên khách' oninput='FQ=this.value;hr()'><label>Lọc theo ngày (không bắt buộc)</label><input id='fd' type='date' value='"+esc(FD)+"' onchange='FD=this.value;hr()'><button class=sm data-a='refreshH'>🔄 Làm mới</button><div id='ht'></div>";
 hr()
}
function refreshH(){H=null;HL=0;ld();loadH()}
function card(r){
 var done=r.tt=='Đã trao',wait=r.tt=='Chờ nhập thông tin';
 return "<div class='rc "+(done?'d':wait?'':'w')+"'><div class='rt'><b>🎁 "+esc(r.qua)+'</b><span>'+esc(r.t)+'</span></div><div>🏬 '+esc(r.ch)+'</div><div>👤 '+esc(r.ten)+' · '+esc(r.sdt)+'</div><div>🧾 Hóa đơn: <b>'+esc(r.hd)+'</b></div>'
  +(done?"<div class=ok>✅ Đã trao"+(r.ng?' – '+esc(r.ng):'')+'</div>':wait?'<div class=hint><i>⏳ Khách đang nhập thông tin…</i></div>':"<button class='go' data-a='cf' data-i='"+r.r+"'>🎁 TRAO QUÀ</button>")
  +'</div>'
}
function hr(){
 var q=FQ.trim().toLowerCase(),dd=FD?FD.split('-').reverse().join('/'):'';
 var L=H.filter(function(r){return(!ST||r.ch===ST)&&(!FT||(FT=='p'?r.tt!='Đã trao':r.tt=='Đã trao'))&&(!dd||r.t.indexOf(dd)==0)&&(!q||(r.hd+r.sdt+r.ten).toLowerCase().indexOf(q)>=0)});
 $('ht').innerHTML='<p><b>'+L.length+'</b> lượt – '+(ST?esc(ST):'tất cả cửa hàng')+'</p>'
  +(L.length?L.map(card).join(''):'<p class=hint>'+(FT=='p'?'🎉 Không có quà nào đang chờ trao.':'Không có kết quả.')+'</p>')
  +'<p class=hint>Lịch sử được giữ vĩnh viễn, không thể xóa. Quà chỉ bị trừ khỏi kho khi bấm TRAO QUÀ.</p>'
}
async function cf(r){
 var x=H.find(function(y){return y.r==r});
 if(!confirm('Đối chiếu hóa đơn '+x.hd+' - quà: '+x.qua+'. Xác nhận ĐÃ TRAO QUÀ (quà sẽ bị trừ khỏi kho cửa hàng)?'))return;
 try{await call('confirm',{r:+r,hd:x.hd});x.tt='Đã trao';x.ng=U.ten;PN=-1;poll();hr()}
 catch(e){alert(e.message)}
}

/* ---------- THỐNG KÊ ---------- */
function dk(t){var p=String(t).slice(0,10).split('/');return p[2]+'-'+p[1]+'-'+p[0]}
function cnt(o,k,f){var x=o[k]||(o[k]={n:0,d:0,p:0,w:0});x.n++;if(f=='Đã trao')x.d++;else if(f=='Chưa trao')x.p++;else x.w++;return x}
function setX(){X1=$('x1').value;X2=$('x2').value;vX()}
function clrX(){X1='';X2='';vX()}
function vX(){
 if(!H){ld();loadH();return}
 var L=H.filter(function(r){var d=dk(r.t);return(!ST||r.ch===ST)&&(!X1||d>=X1)&&(!X2||d<=X2)});
 var tot={n:0,d:0,p:0,w:0},bs={},bp={},bd={};
 L.forEach(function(r){var x=cnt({t:tot},'t',r.tt);cnt(bs,r.ch,r.tt);cnt(bp,r.qua,r.tt);cnt(bd,dk(r.t),r.tt)});
 var pct=tot.n?Math.round(tot.d*100/tot.n):0;
 var trs=function(o,lab){return Object.keys(o).sort(function(a,b){return o[b].n-o[a].n}).map(function(k){var x=o[k];return '<tr><td>'+esc(k)+'</td><td class=n>'+x.n+'</td><td class=n>'+x.d+'</td><td class=n>'+x.p+'</td><td class=n>'+x.w+'</td></tr>'}).join('')||'<tr><td colspan=5 class=hint>Chưa có dữ liệu</td></tr>'};
 var th='<tr><th>@</th><th class=n>Lượt</th><th class=n>Đã trao</th><th class=n>Chờ trao</th><th class=n>Chờ nhập</th></tr>';
 var days=Object.keys(bd).sort().slice(-14),mx=Math.max.apply(null,days.map(function(d){return bd[d].n}).concat([1]));
 var bars=days.map(function(d){var x=bd[d];return "<div class=bar><span>"+d.split('-').reverse().slice(0,2).join('/')+"</span><i style='width:"+Math.max(2,Math.round(x.n*100/mx*.7))+"%'></i><span>"+x.n+' ('+x.d+' đã trao)</span></div>'}).join('')||'<p class=hint>Chưa có dữ liệu</p>';
 var stock='';
 if(AD){
  var P=AD.prizes.filter(function(p){return !ST||p.store==ST});
  stock='<h3>📦 Kho quà còn lại'+(ST?' – '+esc(ST):'')+'</h3><div class=tbl><table><tr><th>Cửa hàng</th><th>Quà</th><th class=n>Còn</th><th class=n>Tỷ lệ</th><th>Bật</th></tr>'+(P.map(function(p){return '<tr><td>'+esc(p.store)+'</td><td>'+esc(p.ten)+'</td><td class=n>'+(p.sl<1?'<b class=err>Hết</b>':p.sl)+'</td><td class=n>'+p.tyle+'</td><td>'+(p.bat?'✅':'—')+'</td></tr>'}).join('')||'<tr><td colspan=5 class=hint>Chưa có quà</td></tr>')+'</table></div>'
 }else if(U.mgr||U.own)stock='<p class=hint>⏳ Đang tải kho quà…</p>';
 $('v').innerHTML='<h3 style="margin-top:0">📊 Thống kê – '+(ST?esc(ST):'tổng hợp tất cả cửa hàng')+'</h3>'
  +"<div style='display:flex;gap:8px'><div style='flex:1'><label>Từ ngày</label><input id='x1' type='date' value='"+esc(X1)+"' onchange='setX()'></div><div style='flex:1'><label>Đến ngày</label><input id='x2' type='date' value='"+esc(X2)+"' onchange='setX()'></div></div>"
  +"<button class=sm data-a='clrX'>Xóa lọc ngày</button><button class=sm data-a='refreshH'>🔄 Làm mới</button><button class=sm data-a='csvX'>⬇️ Tải Excel (CSV)</button>"
  +"<div class=kp><div><b>"+tot.n+"</b><span>Tổng lượt đua</span></div><div><b>"+tot.d+"</b><span>Đã trao quà</span></div><div><b>"+tot.p+"</b><span>Chờ trao</span></div><div><b>"+tot.w+"</b><span>Chờ khách nhập</span></div><div><b>"+pct+"%</b><span>Tỷ lệ đã trao</span></div></div>"
  +'<h3>🏬 Theo cửa hàng</h3><div class=tbl><table>'+th.replace('@','Cửa hàng')+trs(bs)+'</table></div>'
  +'<h3>🎁 Theo loại quà</h3><div class=tbl><table>'+th.replace('@','Quà')+trs(bp)+'</table></div>'
  +'<h3>📅 Theo ngày (14 ngày gần nhất có dữ liệu)</h3>'+bars+stock
  +'<p class=hint>Số liệu tính trên các lượt đua gần nhất mà máy chủ trả về (tối đa 500 lượt mới nhất).</p>'
}
function csvX(){
 var L=H.filter(function(r){var d=dk(r.t);return(!ST||r.ch===ST)&&(!X1||d>=X1)&&(!X2||d<=X2)});
 var q=function(s){return '"'+String(s==null?'':s).replace(/"/g,'""')+'"'};
 var rows=[['Thời gian','Cửa hàng','Khách','SĐT','Số hóa đơn','Quà','Trạng thái','Người trao']].concat(L.map(function(r){return[r.t,r.ch,r.ten,r.sdt,r.hd,r.qua,r.tt,r.ng||'']}));
 var blob=new Blob(['\ufeff'+rows.map(function(r){return r.map(q).join(',')}).join('\r\n')],{type:'text/csv;charset=utf-8'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='thong-ke-dua-cop.csv';document.body.appendChild(a);a.click();document.body.removeChild(a)
}

/* ---------- QR & LINK & POSTER ---------- */
function qrData(t,sz){
 var d=document.createElement('div'),u='';d.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(d);
 try{new QRCode(d,{text:t,width:sz,height:sz,correctLevel:QRCode.CorrectLevel.M});var c=d.querySelector('canvas');u=c?c.toDataURL('image/png'):'';if(!u){var im=d.querySelector('img');u=im?im.src:''}}catch(e){}
 document.body.removeChild(d);return u
}
function lk(title,url,fname,cls,extra){
 var i=LK.push(url)-1,q=qrData(url,300);
 return "<div class='lk "+(cls||'')+"'><img class=qr alt='QR' src='"+q+"'><div class=lkb><b>"+title+"</b><code>"+esc(url)+"</code><button class=sm data-a='cp' data-i='"+i+"'>📋 Sao chép</button><a class=sm target=_blank rel=noopener href='"+esc(url)+"'>🔗 Mở</a><a class=sm download='"+slug(fname)+".png' href='"+q+"'>⬇️ Tải QR</a>"+(extra||'')+"</div></div>"
}
function cp(i){var t=LK[+i];if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){alert('Đã sao chép link')},function(){prompt('Sao chép link:',t)});else prompt('Sao chép link:',t)}
function saveBase(){var v=$('bs').value.trim();if(v&&!/^https?:\/\//.test(v)){alert('Tên miền phải bắt đầu bằng https://');return}try{if(v&&v.replace(/\/+$/,'')!==DEFB)localStorage.dc_base=v;else localStorage.removeItem('dc_base')}catch(e){}PU={};vQ()}
async function vQ(){
 if(!U.mgr&&!U.own){$('v').innerHTML='<p class=hint>Chỉ quản lý hoặc admin cửa hàng mới xem được mục này.</p>';return}
 var names=U.own?[U.own]:(ST?[ST]:U.stores.slice());
 if(U.mgr&&!KEYS){
  $('v').innerHTML='<p>⏳ Đang tạo link & mã QR...</p>';
  try{var a=await call('storeLinks');KEYS={};a.forEach(function(x){KEYS[x.ten]=x.k})}catch(e){return er(e)}
  if(T!='q')return
 }
 LK=[];PS=names.slice();
 var h='<h3 style="margin-top:0">📱 QR & link cửa hàng</h3>'
  +'<label>Tên miền dùng cho link/QR (mặc định '+esc(DEFB)+')</label><div style="display:flex;gap:6px"><input id="bs" value="'+esc(base())+'" style="margin:0"><button class=sm data-a="saveBase" style="margin:0">Lưu</button></div><p class=hint>Link của khách dạng <b>'+esc(base())+'/?ch=TÊN CỬA HÀNG</b>. Đổi tên miền ở đây chỉ áp dụng cho máy này.</p>';
 if(U.mgr){
  h+='<div class=sc><h3>🧭 Link quản lý chung</h3></div>'
   +lk('🔐 Admin tổng (quản lý mọi cửa hàng)',base()+'/admin/'+(AU.mk?'#mk='+enc(AU.mk):''),'qr-admin-tong','a')
   +lk('📊 Thống kê tổng hợp',base()+'/admin/'+hashFor('thong-ke'),'qr-thong-ke-tong','a')
   +'<div class=warn>🔒 Link admin/thống kê là chìa khóa quản lý: chỉ gửi cho người có quyền, không dán nơi khách nhìn thấy.</div>'
 }
 h+='<div class=sc><h3>🏬 Từng cửa hàng ('+names.length+')</h3></div>';
 if(names.length>1)h+='<button class=btn data-a="printAll">🖨️ IN / LƯU PDF TẤT CẢ POSTER A5 ('+names.length+' cửa hàng)</button>';
 names.forEach(function(s,i){
  var k=U.own?AU.k:(KEYS&&KEYS[s]);
  h+='<div class=sc><h3>🏬 '+esc(s)+'</h3></div>'
   +lk('1️⃣ QR cho KHÁCH – vào trang đua cọp của cửa hàng này',custLink(s),'qr-khach-'+s)
   +(k?lk('2️⃣ Link ADMIN của cửa hàng (nhân viên)',adminLink(s,k),'qr-admin-'+s,'a'):'')
   +'<button class=sm data-a="openPoster" data-i="'+i+'">🖼️ Poster A5 – '+esc(s)+'</button>'
   +(U.mgr?'<button class=sm data-a="rk" data-i="'+i+'">🔑 Đổi mã admin (link admin cũ hết hiệu lực)</button>':'')
 });
 $('v').innerHTML=h
}
async function rk(i){var s=PS[+i];if(!confirm('Đổi mã admin của '+s+'? Link/QR admin đã gửi trước đó sẽ không dùng được nữa.'))return;try{var k=await call('resetKey',{ten:s});if(!KEYS)KEYS={};KEYS[s]=k;vQ()}catch(e){alert(e.message)}}

/* ---------- POSTER A5 (nền = ảnh poster-base.jpg do Giang cung cấp; vẽ đè tên cửa hàng + QR riêng) ---------- */
/* Tọa độ tính theo ảnh gốc 2480x3508: QR = (1741,2857) cỡ 410; tên cửa hàng nằm dưới bảng "THÊM 1K – ĐUA NGAY NHẬN QUÀ", tâm (1240,1085) */
function loadImg(src){return new Promise(function(ok,no){var i=new Image();i.onload=function(){ok(i)};i.onerror=function(){no(new Error('img'))};i.src=src})}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
async function mkPoster(store){
 var img;try{img=await loadImg('poster-base.jpg?v=1')}catch(e){throw new Error('NOBASE')}
 try{await document.fonts.load('900 100px FiraBlack')}catch(e){}
 var W=img.naturalWidth,Hh=img.naturalHeight,k=W/2480,c=document.createElement('canvas');c.width=W;c.height=Hh;
 var x=c.getContext('2d');x.drawImage(img,0,0);
 var qi=await loadImg(qrData(custLink(store),820));
 x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(qi,1741*k,2857*k,410*k,410*k);
 var nm=String(store),fs=120*k,F=function(){x.font='900 '+fs+'px FiraBlack,"Fira Sans",Arial,sans-serif'};F();
 var mx=1500*k,w=x.measureText(nm).width;while(w>mx&&fs>40*k){fs-=2*k;F();w=x.measureText(nm).width}
 var pw=w+150*k,ph=fs+90*k,cx=1240*k,cy=1085*k;
 x.save();x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=22*k;x.shadowOffsetY=8*k;
 var g=x.createLinearGradient(0,cy-ph/2,0,cy+ph/2);g.addColorStop(0,'#26b04a');g.addColorStop(1,'#0b6b2a');
 rr(x,cx-pw/2,cy-ph/2,pw,ph,ph/2);x.fillStyle=g;x.fill();x.restore();
 rr(x,cx-pw/2,cy-ph/2,pw,ph,ph/2);x.lineWidth=11*k;x.strokeStyle='#fff';x.stroke();
 x.textAlign='center';x.textBaseline='middle';F();x.lineJoin='round';x.lineWidth=9*k;x.strokeStyle='#0a4d1e';x.strokeText(nm,cx,cy+fs*.04);x.fillStyle='#fff';x.fillText(nm,cx,cy+fs*.04);
 return c
}
function pov(h){$('povb').innerHTML=h;$('pov').classList.add('on')}
function closePoster(){$('pov').classList.remove('on')}
function slug(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()}
function noBase(){pov("<h3>⚠️ Chưa có ảnh nền poster</h3><p>Cần tải file <b>poster-base.jpg</b> vào thư mục <b>admin</b> của repo luutru (cùng chỗ với index.html của trang này), rồi tải lại trang.</p><button class=btn data-a='closePoster'>Đóng</button>")}
async function openPoster(i){
 var s=PS[+i];pov('<p>⏳ Đang dựng poster '+esc(s)+'...</p>');
 try{
  var u=PU[s]||(PU[s]=(await mkPoster(s)).toDataURL('image/jpeg',.92));
  pov("<h3 style='margin-top:0'>🖼️ Poster A5 – "+esc(s)+"</h3><img alt='Poster' src='"+u+"'><button class=btn data-a='printOne' data-i='"+i+"'>🖨️ IN / LƯU PDF (khổ A5)</button><a class=btn style='text-decoration:none;text-align:center;background:#fff;color:#0b6b3a;border:2px solid #0b6b3a' download='poster-a5-"+slug(s)+".jpg' href='"+u+"'>⬇️ Tải ảnh poster</a><button class=sm data-a='closePoster' style='margin-top:10px'>Đóng</button>")
 }catch(e){if(e.message=='NOBASE')noBase();else pov('<p class=err>Không dựng được poster: '+esc(e.message)+"</p><button class=btn data-a='closePoster'>Đóng</button>")}
}
function printImgs(urls){
 $('pw').innerHTML=urls.map(function(u){return "<img alt='' src='"+u+"'>"}).join('');
 document.body.classList.add('pp');
 var done=function(){document.body.classList.remove('pp');window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(done,180000);
 setTimeout(function(){window.print()},350)
}
async function printOne(i){var s=PS[+i];try{printImgs([PU[s]||(PU[s]=(await mkPoster(s)).toDataURL('image/jpeg',.92))])}catch(e){alert(e.message=='NOBASE'?'Chưa có file poster-base.jpg':e.message)}}
async function printAll(){
 var out=[];pov('<p id=pg>⏳ Đang dựng poster…</p>');
 try{
  for(var j=0;j<PS.length;j++){var s=PS[j];$('pg').textContent='⏳ Đang dựng poster '+(j+1)+'/'+PS.length+' – '+s;await new Promise(function(r){setTimeout(r,20)});out.push(PU[s]||(PU[s]=(await mkPoster(s)).toDataURL('image/jpeg',.92)))}
  closePoster();printImgs(out)
 }catch(e){if(e.message=='NOBASE')noBase();else pov('<p class=err>'+esc(e.message)+"</p><button class=btn data-a='closePoster'>Đóng</button>")}
}

/* ---------- QUÀ TẶNG ---------- */
function shrink(f,w,mx,ok,bad){if(!f)return;var im=new Image();im.onload=function(){var s=Math.min(1,w/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));var x=c.getContext('2d');x.drawImage(im,0,0,c.width,c.height);var q=.85,t='image/webp',v=c.toDataURL(t,q);if(v.indexOf('image/webp')<0){x.globalCompositeOperation='destination-over';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);t='image/jpeg';v=c.toDataURL(t,q)}while(v.length>mx&&q>.2){q-=.1;v=c.toDataURL(t,q)}v.length>mx?bad():ok(v)};im.src=URL.createObjectURL(f)}
function vG(){
 if(!ST){$('v').innerHTML='<h3 style="margin-top:0">👆 Chọn cửa hàng cần chỉnh quà</h3><p class=hint>Bấm vào tên cửa hàng, hoặc chọn ở ô "Cửa hàng" phía trên.</p>'+U.stores.map(function(s){return "<button class=cs data-a='pickS' data-i='"+esc(s)+"'>🏬 "+esc(s)+'</button>'}).join('');return}
 var row=function(p){var im=AD.imgs[p.ten],n=p.id=='new';return "<tr><td>"+(!n&&im?"<img src='"+im+"' style='width:44px;height:44px;object-fit:contain;vertical-align:middle'> ":'')+"<input id='n"+p.id+"' value='"+esc(p.ten)+"'></td><td><input id='t"+p.id+"' type=number value='"+p.tyle+"' style='width:70px'></td><td><input id='q"+p.id+"' type=number value='"+p.sl+"' style='width:70px'></td><td><input id='b"+p.id+"' type=checkbox "+(p.bat?'checked':'')+"></td><td>"+(n?'':(p.sl<1?'<b>Hết</b> ':'')+"<label class=sm style='display:inline-block;margin:0'>📷 Ảnh<input type=file accept='image/*' data-p='"+p.id+"' hidden></label> ")+"<button id='s"+p.id+"' class=sm data-a='sp' data-i='"+p.id+"'>Lưu</button>"+(n?'':" <button class=sm data-a='dp' data-i='"+p.id+"'>Xóa</button>")+'</td></tr>'};
 $('v').innerHTML='<h3 style="margin-top:0">🎄 Quà tặng – '+esc(ST)+'</h3><p class=hint>Sửa xong bấm <b>Lưu</b> ở cuối dòng. Dòng trống cuối bảng dùng để <b>thêm quà mới</b>. Tỷ lệ là trọng số, hệ thống tự chia lại cho đủ 100% theo các quà còn hàng. Quà hết số lượng tự tính 0%. Ảnh gắn theo TÊN quà (dùng chung các cửa hàng).</p><div class=tbl><table><tr><th>Tên quà</th><th>Tỷ lệ %</th><th>Số lượng</th><th>Bật</th><th></th></tr>'+AD.prizes.filter(function(p){return p.store==ST}).map(row).join('')+row({id:'new',ten:'',tyle:10,sl:10,bat:true})+'</table></div>'
}
async function sp(i){var b=$('s'+i);b.textContent='⏳';try{var r=await call('savePrize',{store:ST,id:i=='new'?'':i,ten:$('n'+i).value,tyle:$('t'+i).value,sl:$('q'+i).value,bat:$('b'+i).checked});var k=AD.prizes.findIndex(function(x){return x.id==r.id&&x.store==ST});if(k<0)AD.prizes.push(r);else AD.prizes[k]=r;R()}catch(e){b.textContent='Lưu';alert(e.message)}}
async function dp(i){if(!confirm('Xóa quà này?'))return;try{await call('delPrize',{id:i,store:ST});AD.prizes=AD.prizes.filter(function(x){return!(x.id==i&&x.store==ST)});R()}catch(e){alert(e.message)}}
function pimg(id,f){var p=AD.prizes.find(function(x){return x.id==id&&x.store==ST});shrink(f,180,16000,async function(v){try{await call('saveImg',{ten:p.ten,v:v});AD.imgs[p.ten]=v;R()}catch(e){alert(e.message)}},function(){alert('Ảnh quá phức tạp, hãy chọn ảnh khác')})}

/* ---------- ẢNH QUÀ ---------- */
function vI(){NM=Object.keys(AD.prizes.reduce(function(o,p){o[p.ten]=1;return o},{}));$('v').innerHTML="<p>Bấm <b>Tải ảnh lên</b> ở từng sản phẩm. Nên chọn ảnh vuông, nền trắng hoặc trong suốt. Ảnh gắn theo TÊN quà nên dùng chung cho mọi cửa hàng.</p><div class=gal>"+NM.map(function(n,i){var im=AD.imgs[n];return "<div class=it><div class=th>"+(im?"<img src='"+im+"'>":'<span>Chưa có ảnh</span>')+"</div><b>"+esc(n)+"</b><br><label class=sm style='margin:4px 0'>📷 "+(im?'Đổi ảnh':'Tải ảnh lên')+"<input type=file accept='image/*' data-n='"+i+"' hidden></label>"+(im?"<button class=sm data-a='di' data-i='"+i+"'>Xóa ảnh</button>":'')+'</div>'}).join('')+'</div>'}
function nimg(i,f){var n=NM[i];shrink(f,180,16000,async function(v){try{await call('saveImg',{ten:n,v:v});AD.imgs[n]=v;R()}catch(e){alert(e.message)}},function(){alert('Ảnh quá phức tạp, hãy chọn ảnh khác')})}
async function di(i){var n=NM[i];if(!confirm('Xóa ảnh của '+n+'?'))return;try{await call('saveImg',{ten:n,v:''});delete AD.imgs[n];R()}catch(e){alert(e.message)}}

/* ---------- CỬA HÀNG ---------- */
function vC(){$('v').innerHTML='<table>'+AD.stores.map(function(s){return '<tr><td>'+esc(s.ten)+'</td><td>'+(s.bat?'<span class=ok>Đang bật</span>':'Đang ẩn')+"</td><td><button class=sm data-a='tg' data-i='"+esc(s.ten)+"'>"+(s.bat?'Ẩn':'Bật')+'</button></td></tr>'}).join('')+"</table><label>Thêm cửa hàng</label><input id='ns' placeholder='Tên cửa hàng'><button class=btn data-a='addShop'>THÊM</button>"}
async function tg(i){var s=AD.stores.find(function(x){return x.ten==i});s.bat=!s.bat;R();try{await call('saveStore',{ten:i,toggle:1})}catch(e){s.bat=!s.bat;R();alert(e.message)}}
async function addShop(){var t=$('ns').value.trim();if(!t)return;try{await call('saveStore',{ten:t,bat:true});AD.stores.push({ten:t,bat:true});U.stores.push(t);KEYS=null;fillS();R()}catch(e){alert(e.message)}}

/* ---------- CÀI ĐẶT ---------- */
function vS(){var c=AD.cfg;$('v').innerHTML="<label>Tiêu đề trang</label><input id='cT' value='"+esc(c.TieuDe)+"'><label>Mức hóa đơn áp dụng (chỉ hiển thị trên trang khách, đ)</label><input id='cM' type=number value='"+esc(c.MinTien)+"'><button class=btn data-a='sc'>LƯU</button><label>Logo (ảnh vuông)</label><input type=file accept='image/*' data-k='Logo' data-w='300'><label>Ảnh nền (không bắt buộc)</label><input type=file accept='image/*' data-k='Nen' data-w='480'>"}
async function sc(){try{await call('saveCfg',{k:'TieuDe',v:$('cT').value});await call('saveCfg',{k:'MinTien',v:$('cM').value});AD.cfg.TieuDe=$('cT').value;AD.cfg.MinTien=$('cM').value;alert('Đã lưu')}catch(e){alert(e.message)}}
function cimg(k,f,w){shrink(f,w,45000,async function(v){try{await call('saveCfg',{k:k,v:v});alert('Đã lưu ảnh')}catch(e){alert(e.message)}},function(){alert('Ảnh quá phức tạp, hãy chọn ảnh khác')})}

boot();
