/* admin/patch.js – nạp SAU admin.js. (1) Poster A5 hiển thị sẵn ngay trong mục QR; (2) cảnh báo rủi ro trong Thống kê. */
(function(){var t=document.createElement('style');t.textContent='.alb{display:flex;flex-direction:column;gap:6px}.al{padding:9px 12px;border-radius:10px;background:#eef9f0;border:1px solid #bfe3c8;font-weight:700}.al.hi{background:#fdecec;border-color:#f3b4b4;color:#9b1c1c}.al.mid{background:#fff6e5;border-color:#f1d08a;color:#8a5a00}.pvbox img{box-shadow:0 2px 8px rgba(0,0,0,.15)}';document.head.appendChild(t)})();
/* ---------- Poster: dựng theo tỷ lệ sc (xem trước nhỏ, in/tải = 1) ---------- */
var PV={},PVT=0;
mkPoster=async function(store,sc){
 sc=sc||1;var img;try{img=await loadImg('poster-base.jpg?v=1')}catch(e){throw new Error('NOBASE')}
 try{await document.fonts.load('900 100px FiraBlack')}catch(e){}
 var W=img.naturalWidth,Hh=img.naturalHeight,k=W/2480,c=document.createElement('canvas');c.width=Math.round(W*sc);c.height=Math.round(Hh*sc);
 var x=c.getContext('2d');x.setTransform(sc,0,0,sc,0,0);x.drawImage(img,0,0);
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
};
async function dlPoster(i){var s=PS[+i];try{var u=PU[s]||(PU[s]=(await mkPoster(s)).toDataURL('image/jpeg',.92)),a=document.createElement('a');a.href=u;a.download='poster-a5-'+slug(s)+'.jpg';document.body.appendChild(a);a.click();a.remove()}catch(e){alert(e.message=='NOBASE'?'Chưa có file poster-base.jpg':e.message)}}
var _vQ=vQ;
vQ=async function(){
 await _vQ.apply(this,arguments);
 if(T!='q')return;
 var tk=++PVT,bs=document.querySelectorAll('[data-a="openPoster"]');
 var list=[];bs.forEach(function(b){list.push(b)});
 list.forEach(function(b){
  var i=b.getAttribute('data-i'),s=PS[+i];
  var box=document.createElement('div');box.className='pvbox';box.id='pvb'+i;box.innerHTML=PV[s]?"<img alt='Poster' src='"+PV[s]+"' style='width:100%;max-width:420px;border-radius:10px;border:1px solid #ddd;display:block;margin:6px 0'>":'<p class=hint>⏳ Đang dựng poster…</p>';
  b.parentNode.insertBefore(box,b);
  b.setAttribute('data-a','printOne');b.textContent='🖨️ In / lưu PDF (A5)';
  var d=document.createElement('button');d.className='sm';d.setAttribute('data-a','dlPoster');d.setAttribute('data-i',i);d.textContent='⬇️ Tải ảnh poster';b.parentNode.insertBefore(d,b.nextSibling)
 });
 for(var j=0;j<PS.length;j++){
  if(PVT!==tk||T!='q')return;
  var st=PS[j],bx=$('pvb'+j);if(!bx||PV[st])continue;
  try{PV[st]=(await mkPoster(st,.3)).toDataURL('image/jpeg',.85);bx.innerHTML="<img alt='Poster' src='"+PV[st]+"' style='width:100%;max-width:420px;border-radius:10px;border:1px solid #ddd;display:block;margin:6px 0'>"}
  catch(e){bx.innerHTML=e.message=='NOBASE'?"<p class=err>Chưa có file poster-base.jpg trong thư mục admin.</p>":"<p class=err>Không dựng được poster: "+esc(e.message)+"</p>"}
  await new Promise(function(r){setTimeout(r,30)})
 }
};
/* ---------- CẢNH BÁO RỦI RO (tính từ lịch sử đua + kho quà) ---------- */
var LOW=5;
function pt(t){var m=/^(\d\d)\/(\d\d)\/(\d{4}) (\d\d):(\d\d)/.exec(String(t));return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():0}
function isVip(p){return /vip|đặc biệt|dac biet|giải nhất|giai nhat/i.test(p.ten)||(p.tyle>0&&p.tyle<=5)}
function riskHtml(L){
 if(!AD)return '<p class=hint>⏳ Đang tải kho quà để phân tích rủi ro…</p>';
 var P=AD.prizes.filter(function(p){return !ST||p.store==ST}),res={},al=[],now=Date.now();
 var HH=H.filter(function(r){return !ST||r.ch===ST});
 HH.forEach(function(r){if(r.tt=='Chưa trao'||r.tt=='Chờ nhập thông tin'){var k=r.ch+'|'+r.qua;res[k]=(res[k]||0)+1}});
 var add=function(lv,txt){al.push({lv:lv,t:txt})};
 /* 1. Kho & tỷ lệ cấu hình */
 var by={};P.forEach(function(p){if(p.bat)(by[p.store]=by[p.store]||[]).push(p)});
 var rows=[],zero=[],low=[];
 Object.keys(by).forEach(function(s){
  var live=by[s].filter(function(p){return p.tyle>0&&p.sl-(res[s+'|'+p.ten]||0)>0}),tot=live.reduce(function(a,p){return a+p.tyle},0);
  if(!live.length)add('hi','🔴 '+s+': KHÔNG còn quà nào quay được → khách đua sẽ bị báo hết quà.');
  var n=L.filter(function(r){return r.ch===s}).length;
  by[s].forEach(function(p){
   var rv=res[s+'|'+p.ten]||0,av=p.sl-rv,why=[];
   if(p.tyle<=0)why.push('tỷ lệ cấu hình = 0');
   if(p.sl<1)why.push('kho = 0 (đã hết)');
   else if(av<=0)why.push('kho còn '+p.sl+' nhưng '+rv+' phần đang giữ chỗ cho khách trúng chưa trao');
   var eff=(!why.length&&tot)?Math.round(p.tyle*1000/tot)/10:0,w=L.filter(function(r){return r.ch===s&&r.qua===p.ten}).length,ob=n?Math.round(w*1000/n)/10:0;
   if(why.length)zero.push({s:s,p:p,why:why.join('; ')});
   else if(av<=LOW)low.push({s:s,p:p,av:av});
   rows.push({s:s,p:p,av:av,eff:eff,w:w,ob:ob,n:n,dev:(n>=30&&Math.abs(ob-eff)>10)})})});
 low.forEach(function(x){add(x.av<=2?'hi':'mid',(x.av<=2?'🔴':'🟠')+' '+x.s+': "'+x.p.ten+'" sắp hết – còn quay được '+x.av+' phần (kho '+x.p.sl+').')});
 rows.filter(function(r){return r.dev}).forEach(function(r){add('mid','🟠 '+r.s+': "'+r.p.ten+'" trúng thực tế '+r.ob+'% (trong '+r.n+' lượt) lệch nhiều so với tỷ lệ quay hiện tại '+r.eff+'%.')});
 /* 2. VIP đã trúng */
 var vp=P.filter(isVip),vw=[];
 vp.forEach(function(p){HH.filter(function(r){return r.ch===p.store&&r.qua===p.ten}).forEach(function(r){vw.push(r)})});
 vw.filter(function(r){return r.tt=='Chưa trao'}).forEach(function(r){add('hi','🔴 Quà VIP "'+r.qua+'" – '+r.ch+' đang CHỜ TRAO (khách '+r.ten+', '+r.t+'): cần kiểm tra và trao sớm.')});
 /* 3. Bất thường */
 var ph={},hdm={},hr={},run={};
 HH.forEach(function(r){var s=String(r.sdt||'').trim();if(/^0\d{9}$/.test(s))(ph[s]=ph[s]||[]).push(r);var h=String(r.hd).toUpperCase();(hdm[h]=hdm[h]||[]).push(r);var k=r.ch+'|'+String(r.t).slice(0,13);hr[k]=(hr[k]||0)+1});
 Object.keys(ph).forEach(function(s){if(ph[s].length>=3)add(ph[s].length>=5?'hi':'mid',(ph[s].length>=5?'🔴':'🟠')+' SĐT '+s+' tham gia '+ph[s].length+' lượt ('+ph[s].map(function(r){return r.ch}).filter(function(v,i,a){return a.indexOf(v)==i}).join(', ')+').')});
 Object.keys(hdm).forEach(function(h){if(hdm[h].length>1)add('hi','🔴 Số hóa đơn '+h+' xuất hiện '+hdm[h].length+' lần.')});
 Object.keys(hr).forEach(function(k){if(hr[k]>=15)add('mid','🟠 '+k.split('|')[0]+': '+hr[k]+' lượt đua trong 1 giờ ('+k.split('|')[1].slice(11)+'h) – cao bất thường.')});
 var old=HH.filter(function(r){return r.tt=='Chưa trao'&&pt(r.t)&&now-pt(r.t)>864e5});
 if(old.length)add('mid','🟠 '+old.length+' quà đã ghi nhận nhưng CHƯA TRAO quá 24 giờ.');
 var seq=HH.slice().reverse(),last={};seq.forEach(function(r){var o=last[r.ch]||(last[r.ch]={q:'',n:0});if(o.q===r.qua)o.n++;else{o.q=r.qua;o.n=1}if(o.n==3)add('mid','🟠 '+r.ch+': quà "'+r.qua+'" trúng 3 lượt liên tiếp.')});
 var ws=HH.filter(function(r){return r.tt=='Chờ nhập thông tin'}).length;
 if(ws>=10)add('mid','🟠 '+ws+' lượt đua chưa nhập thông tin / chưa chia sẻ (khách bỏ dở, quà đang bị giữ chỗ).');
 al.sort(function(a,b){return (a.lv=='hi'?0:1)-(b.lv=='hi'?0:1)});
 var h='<h3>🚨 Cảnh báo rủi ro</h3>'+(al.length?'<div class=alb>'+al.map(function(a){return '<div class="al '+a.lv+'">'+esc(a.t)+'</div>'}).join('')+'</div>':'<div class=al>✅ Chưa phát hiện bất thường.</div>');
 h+='<h3>⏳ Quà sắp hết (còn ≤ '+LOW+')</h3>'+(low.length?'<ul>'+low.map(function(x){return '<li><b>'+esc(x.s)+'</b> – '+esc(x.p.ten)+': còn '+x.av+'</li>'}).join('')+'</ul>':'<p class=hint>Không có.</p>');
 h+='<h3>⛔ Quà đang 0% (không thể trúng) và lý do</h3>'+(zero.length?'<div class=tbl><table><tr><th>Cửa hàng</th><th>Quà</th><th>Lý do</th></tr>'+zero.map(function(x){return '<tr><td>'+esc(x.s)+'</td><td>'+esc(x.p.ten)+'</td><td>'+esc(x.why)+'</td></tr>'}).join('')+'</table></div>':'<p class=hint>Không có.</p>');
 h+='<h3>👑 Quà VIP đã trúng</h3><p class=hint>VIP = tên có “VIP/đặc biệt/giải nhất” hoặc tỷ lệ cấu hình ≤ 5.</p>'+(vw.length?'<div class=tbl><table><tr><th>Thời gian</th><th>Cửa hàng</th><th>Quà</th><th>Khách</th><th>SĐT</th><th>Trạng thái</th></tr>'+vw.map(function(r){return '<tr><td>'+esc(r.t)+'</td><td>'+esc(r.ch)+'</td><td>'+esc(r.qua)+'</td><td>'+esc(r.ten)+'</td><td>'+esc(r.sdt)+'</td><td>'+esc(r.tt)+'</td></tr>'}).join('')+'</table></div>':'<p class=hint>Chưa có ai trúng quà VIP.</p>');
 h+='<h3>🎯 Tỷ lệ quay vs trúng thực tế</h3><div class=tbl><table><tr><th>Cửa hàng</th><th>Quà</th><th class=n>Còn quay</th><th class=n>Tỷ lệ quay</th><th class=n>Trúng thực tế</th></tr>'+rows.map(function(r){return '<tr'+(r.dev?' class=err':'')+'><td>'+esc(r.s)+'</td><td>'+esc(r.p.ten)+'</td><td class=n>'+Math.max(0,r.av)+'</td><td class=n>'+r.eff+'%</td><td class=n>'+r.w+' ('+r.ob+'%)</td></tr>'}).join('')+'</table></div><p class=hint>Cảnh báo lệch khi cửa hàng có ≥ 30 lượt và chênh &gt; 10 điểm %.</p>';
 return h
}

/* ---------- Gắn cảnh báo vào Thống kê ---------- */
var _vX=vX;
vX=function(){
 _vX.apply(this,arguments);
 if(!H||T!='x')return;
 var L=H.filter(function(r){var d=dk(r.t);return(!ST||r.ch===ST)&&(!X1||d>=X1)&&(!X2||d<=X2)});
 var hs=document.querySelectorAll('#v h3'),at=null;
 hs.forEach(function(h){if(!at&&h.textContent.indexOf('Theo cửa hàng')>=0)at=h});
 if(at)at.insertAdjacentHTML('beforebegin',riskHtml(L))
};
if(U&&T=='q')vQ();else if(U&&T=='x')vX();
