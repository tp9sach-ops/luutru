/* admin/vip.js – nạp SAU patch.js. Mục "👑 Cập nhật quà VIP" trong Quà tặng:
   số quà ban đầu, đã tặng, thời gian chạy, TB ra/ngày, số ra trong ngày (nhập), % nhập, % tự động, gợi ý %, diễn giải.
   Cần Code.gs mới (vongquay) đã triển khai lại: máy chủ trả adminAll.v>=2 và tự chặn quà VIP khi đủ số trong ngày. */
(function(){var t=document.createElement('style');t.textContent='.vipc{border:2px solid #e0b100;border-radius:12px;padding:12px;margin:12px 0;background:#fffdf2}.vipc h4{margin:0 0 6px;font-size:17px}.vg{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:6px;margin:8px 0}.vg>div{background:#fff;border:1px solid #eadfa6;border-radius:8px;padding:6px 8px;font-size:12.5px;color:#555}.vg b{display:block;font-size:17px;color:#111}.vg small{display:block;color:#888}.vf{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:8px 0}.vf label{font-size:12.5px;font-weight:700;display:block}.vf input{width:100%;box-sizing:border-box}.vx{background:#eef6ff;border:1px solid #b9d6f5;border-radius:8px;padding:8px 10px;margin:8px 0;font-size:13.5px;line-height:1.55}.vx.cur{background:#f6f6f6;border-color:#ddd}.vwarn{background:#fff6e5;border:1px solid #f1d08a;color:#8a5a00;border-radius:8px;padding:8px 10px;margin:8px 0;font-weight:700}';document.head.appendChild(t)})();

/* ---------- Tính toán ---------- */
function dd(a,b){return Math.round((Date.parse(b)-Date.parse(a))/864e5)}
function f1(x){return Math.round(x*10)/10}
function pendOf(q){return Math.max(0,(q.won||0)-(q.given||0))}          /* trúng nhưng chưa trao: đang giữ chỗ trong kho */
function availOf(q){return (q.sl||0)-pendOf(q)}                          /* còn quay được */
/* Lý do quà VIP đang bị chặn (rỗng = đang mở). Khớp đúng logic vipOpen() của máy chủ. */
function vipClosed(q){
 if(!q||!q.vip)return '';var t=(AD&&AD.today)||'';
 if(q.bd&&t&&t<q.bd)return 'chưa tới ngày bắt đầu ('+q.bd+')';
 if(q.kt&&t&&t>q.kt)return 'đã hết thời gian chạy ('+q.kt+')';
 if(q.sln>0&&(q.td||0)>=q.sln)return 'đã ra đủ '+q.sln+' quà trong hôm nay → tự động 0% đến hết ngày';
 return ''
}
function liveSet(store){return AD.prizes.filter(function(q){return q.store==store&&q.bat&&q.tyle>0&&availOf(q)>0&&!vipClosed(q)})}
function autoPct(p){var L=liveSet(p.store),tot=L.reduce(function(a,q){return a+q.tyle},0);return(L.indexOf(p)>=0&&tot)?p.tyle*100/tot:0}
function shopOf(store){return AD.stores.find(function(s){return s.ten==store})||{n:0,d0:'',nt:0}}
function findP(i){return AD.prizes.find(function(x){return x.id==i&&x.store==ST})}
function mergeP(r){var o=AD.prizes.find(function(x){return x.id==r.id&&x.store==r.store});if(o)Object.assign(o,r);else AD.prizes.push(Object.assign({won:0,given:0,td:0},r))}

/* Số liệu của 1 quà VIP */
function vipInfo(p){
 var t=AD.today,S=shopOf(p.store),given=p.given||0,won=p.won||0,pend=pendOf(p),
  init=p.sb>0?p.sb:(p.sl+given),av=Math.max(0,availOf(p)),
  start=p.bd||S.d0||t,el=t>=start?dd(start,t)+1:0,
  total=(p.bd&&p.kt)?dd(p.bd,p.kt)+1:0,
  left=p.kt?(t<(p.bd||t)?total:Math.max(0,dd(t,p.kt)+1)):0,
  avg=el>0?won/el:0,
  se=(S.d0&&t>=S.d0)?dd(S.d0,t)+1:1,N=S.n?S.n/se:0,   /* lượt đua TB/ngày của cửa hàng */
  L=liveSet(p.store).filter(function(q){return q!==p}),others=L.reduce(function(a,q){return a+q.tyle},0),
  sug=null;
 if(left>0&&N>0&&av>0){
  var g=av/left;if(p.sln>0)g=Math.min(g,p.sln);
  var s=Math.min(99.9,g/N*100),w=others>0?f1(s*others/(100-s)):100;
  sug={s:f1(s),w:w,g:g}
 }
 return{t:t,given:given,pend:pend,init:init,av:av,el:el,total:total,left:left,avg:avg,N:N,nS:S.n||0,others:others,sug:sug}
}
/* Dự báo nếu dùng trọng số w (giả sử quà luôn mở, các quà khác như hiện tại) */
function proj(p,w,I){
 var eff=w>0?(I.others>0?w*100/(w+I.others):100):0,perDay=I.N*eff/100;
 if(p.sln>0)perDay=Math.min(perDay,p.sln);
 var toEnd=I.left>0?Math.min(I.av,perDay*I.left):null;
 return{eff:eff,perDay:perDay,toEnd:toEnd}
}
function projHtml(p,w,lab){
 var I=vipInfo(p),r=proj(p,w,I);
 if(!(I.N>0))return '<b>'+lab+'</b>: chưa đủ dữ liệu lượt đua của cửa hàng này để dự báo.';
 var h='<b>'+lab+'</b> (nhập '+f1(w)+' → % tự động ≈ <b>'+f1(r.eff)+'%</b>): với ~'+f1(I.N)+' lượt đua/ngày ⇒ ra ≈ <b>'+f1(r.perDay)+' quà/ngày</b>'+(p.sln>0?' (tối đa '+p.sln+'/ngày)':'');
 if(r.toEnd!=null){
  h+=', còn '+I.left+' ngày ⇒ ≈ <b>'+f1(r.toEnd)+' quà đến hết chương trình</b>. Kho còn '+I.av+' → ';
  var d=I.av-r.toEnd;h+=d>=1?'<b>dư ≈ '+f1(d)+'</b> (không ra hết kho).':'<b>vừa đủ</b> hết kho đúng hạn.'
 }else h+='. (Chưa nhập ngày kết thúc nên chưa tính được tổng đến hết chương trình.)';
 return h
}

/* ---------- Giao diện Quà tặng (thay vG) ---------- */
function vipCard(p){
 var I=vipInfo(p),ap=autoPct(p),why=vipClosed(p),i=p.id;
 var reason=why?why:(p.bat?(p.tyle<=0?'tỷ lệ nhập = 0':(availOf(p)<=0?'hết kho / đang giữ chỗ':'')):'đang tắt');
 var time=(p.bd||p.kt)?esc(p.bd||'?')+' → '+esc(p.kt||'?'):'chưa nhập';
 var sub=I.total?'ngày '+Math.min(Math.max(I.el,0),I.total)+'/'+I.total+(I.left?' · còn '+I.left+' ngày':''):(I.el?'đã chạy '+I.el+' ngày':'');
 var h="<div class=vipc><h4>👑 "+esc(p.ten)+"</h4><div class=vg>"
 +"<div>Số quà ban đầu<b>"+I.init+"</b></div>"
 +"<div>Đã tặng (đã trao)<b>"+I.given+"</b><small>"+(I.pend?'+ '+I.pend+' chờ trao':'')+"</small></div>"
 +"<div>Còn quay được<b>"+I.av+"</b><small>kho "+p.sl+"</small></div>"
 +"<div>Thời gian chạy<b style='font-size:14px'>"+time+"</b><small>"+sub+"</small></div>"
 +"<div>TB ra / ngày<b>"+f1(I.avg)+"</b><small>"+(p.won||0)+" lượt trúng</small></div>"
 +"<div>Ra hôm nay<b>"+(p.td||0)+(p.sln>0?' / '+p.sln:'')+"</b><small>"+(p.sln>0?'giới hạn/ngày':'không giới hạn')+"</small></div>"
 +"<div>% nhập vào<b>"+p.tyle+"</b></div>"
 +"<div>% tự động<b style='color:"+(ap>0?'#0a7a2f':'#b00020')+"'>"+f1(ap)+"%</b><small>"+esc(ap>0?'đã chia lại theo quà còn hàng':reason)+"</small></div>"
 +"<div>Gợi ý %<b>"+(I.sug?f1(I.sug.s)+'%':'—')+"</b><small>"+(I.sug?'nhập '+I.sug.w:(I.left>0?(I.N>0?'':'chưa có lượt đua'):'cần ngày kết thúc'))+"</small></div></div>"
 +"<div class=vf>"
 +"<div><label>Số lượng ban đầu</label><input id='vb"+i+"' type=number min=0 value='"+I.init+"'></div>"
 +"<div><label>Số lượng ra trong ngày (nhập)</label><input id='vn"+i+"' type=number min=0 value='"+(p.sln||'')+"' placeholder='0 = không giới hạn'></div>"
 +"<div><label>% nhập vào</label><input id='vt"+i+"' type=number min=0 step=0.1 value='"+p.tyle+"'></div>"
 +"<div><label>Từ ngày</label><input id='vd1"+i+"' type=date value='"+esc(p.bd)+"'></div>"
 +"<div><label>Đến ngày</label><input id='vd2"+i+"' type=date value='"+esc(p.kt)+"'></div></div>"
 +"<p class=hint style='margin:2px 0'>Ra đủ số lượng trong ngày thì tỷ lệ tự động = 0% đến hết ngày, sáng hôm sau mở lại. Kho còn thì chỉnh ở bảng quà phía trên.</p>";
 if(I.sug)h+="<div class=vx>💡 "+projHtml(p,I.sug.w,'Nếu chọn % gợi ý '+I.sug.s+'%')+"</div>";
 h+="<div class='vx cur' id='vx"+i+"'>"+projHtml(p,p.tyle,'Với % đang nhập')+"</div>"
 +"<button id='vs"+i+"' class=btn data-a='saveVip' data-i='"+i+"'>💾 Lưu quà VIP</button> "
 +(I.sug?"<button class=sm data-a='useSug' data-i='"+i+"'>Dùng % gợi ý ("+I.sug.w+")</button>":'')
 +"</div>";
 return h
}
vG=function(){
 if(!ST){$('v').innerHTML='<h3 style="margin-top:0">👆 Chọn cửa hàng cần chỉnh quà</h3><p class=hint>Bấm vào tên cửa hàng, hoặc chọn ở ô "Cửa hàng" phía trên.</p>'+U.stores.map(function(s){return "<button class=cs data-a='pickS' data-i='"+esc(s)+"'>🏬 "+esc(s)+'</button>'}).join('');return}
 var P=AD.prizes.filter(function(p){return p.store==ST}),old=!(AD.v>=2);
 var row=function(p){var im=AD.imgs[p.ten],n=p.id=='new';return "<tr><td>"+(!n&&im?"<img src='"+im+"' style='width:44px;height:44px;object-fit:contain;vertical-align:middle'> ":'')+"<input id='n"+p.id+"' value='"+esc(p.ten)+"'></td><td><input id='t"+p.id+"' type=number value='"+p.tyle+"' style='width:70px'></td><td><input id='q"+p.id+"' type=number value='"+p.sl+"' style='width:70px'></td><td><input id='b"+p.id+"' type=checkbox "+(p.bat?'checked':'')+"></td><td><input id='vv"+p.id+"' type=checkbox "+(p.vip?'checked':'')+"></td><td>"+(n?'':(p.sl<1?'<b>Hết</b> ':'')+"<label class=sm style='display:inline-block;margin:0'>📷 Ảnh<input type=file accept='image/*' data-p='"+p.id+"' hidden></label> ")+"<button id='s"+p.id+"' class=sm data-a='sp' data-i='"+p.id+"'>Lưu</button>"+(n?'':" <button class=sm data-a='dp' data-i='"+p.id+"'>Xóa</button>")+'</td></tr>'};
 var vips=P.filter(function(p){return p.vip});
 $('v').innerHTML='<h3 style="margin-top:0">🎄 Quà tặng – '+esc(ST)+'</h3>'
 +(old?'<div class=vwarn>⚠️ Máy chủ chưa cập nhật Code.gs mới: tích VIP / giới hạn quà VIP theo ngày sẽ CHƯA có tác dụng. Hãy dán Code.gs mới vào Apps Script và triển khai lại (phiên bản mới).</div>':'')
 +'<p class=hint>Sửa xong bấm <b>Lưu</b> ở cuối dòng. Dòng trống cuối bảng dùng để <b>thêm quà mới</b>. Tích <b>VIP</b> để quà đó có mục cập nhật VIP bên dưới. Tỷ lệ là trọng số, hệ thống tự chia lại cho đủ 100% theo các quà còn hàng. Quà hết số lượng tự tính 0%. Ảnh gắn theo TÊN quà.</p>'
 +'<div class=tbl><table><tr><th>Tên quà</th><th>Tỷ lệ %</th><th>Số lượng</th><th>Bật</th><th>VIP</th><th></th></tr>'+P.map(row).join('')+row({id:'new',ten:'',tyle:10,sl:10,bat:true,vip:false})+'</table></div>'
 +'<h3>👑 Cập nhật quà VIP</h3>'+(vips.length?vips.map(vipCard).join(''):'<p class=hint>Chưa có quà VIP. Tích ô <b>VIP</b> ở dòng quà rồi bấm Lưu.</p>')
};
sp=async function(i){
 var b=$('s'+i);b.textContent='⏳';
 try{
  var want=$('vv'+i).checked,r=await call('savePrize',{store:ST,id:i=='new'?'':i,ten:$('n'+i).value,tyle:$('t'+i).value,sl:$('q'+i).value,bat:$('b'+i).checked,vip:want});
  if(want&&!r.vip){b.textContent='Lưu';alert('Máy chủ chưa cập nhật Code.gs mới nên chưa lưu được VIP. Đã lưu phần còn lại.')}
  mergeP(r);R()
 }catch(e){b.textContent='Lưu';alert(e.message)}
};
async function saveVip(i){
 var p=findP(i),b=$('vs'+i);if(!p)return;b.textContent='⏳';
 try{
  var r=await call('savePrize',{store:ST,id:i,ten:p.ten,tyle:$('vt'+i).value,sl:p.sl,bat:p.bat,vip:true,slNgay:$('vn'+i).value,ngayBD:$('vd1'+i).value,ngayKT:$('vd2'+i).value,slBanDau:$('vb'+i).value});
  if(r.sln===undefined){b.textContent='💾 Lưu quà VIP';alert('Máy chủ chưa cập nhật Code.gs mới nên chưa lưu được các mục VIP.');return}
  mergeP(r);R()
 }catch(e){b.textContent='💾 Lưu quà VIP';alert(e.message)}
}
function useSug(i){var p=findP(i),I=vipInfo(p);if(!I.sug)return;var el=$('vt'+i);el.value=I.sug.w;$('vx'+i).innerHTML=projHtml(p,I.sug.w,'Với % đang nhập')}
/* Gõ % nhập → cập nhật dự báo ngay */
$('v').addEventListener('input',function(e){var m=/^vt(.+)$/.exec(e.target.id||'');if(!m)return;var p=findP(m[1]),x=$('vx'+m[1]);if(p&&x)x.innerHTML=projHtml(p,parseFloat(e.target.value)||0,'Với % đang nhập')});
/* Cảnh báo rủi ro / Thống kê: ưu tiên cờ VIP do admin tích */
var _isVip0=isVip;isVip=function(p){return !!p.vip||_isVip0(p)};
if(U&&T=='g'&&AD)vG();
