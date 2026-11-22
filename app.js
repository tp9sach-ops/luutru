(function(){try{var d=document,l=d.createElement('link');l.rel='stylesheet';l.href='premium.css?v=1';d.head.appendChild(l);var T=window.THREE;if(T&&T.WebGLRenderer&&!/[?&]classic=1/.test(location.search)){var O=T.WebGLRenderer,W=function(p){var r=new O(p);var _r=r.render;r.render=function(){_r.apply(this,arguments);if(window.__snapReq){window.__snapReq=0;try{window.__snap=r.domElement.toDataURL('image/jpeg',.9)}catch(e){}}};r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1;return r};W.prototype=O.prototype;T.WebGLRenderer=W}}catch(e){}})();
window.CFG={FB_APP_ID:'',API:'https://script.google.com/macros/s/AKfycbx80zKKqUsDDv-zvfspmSgk5rMYwvBQwVO7LOzRh_9a_W9S3QTjsjwBHRm4IHllR1kp/exec'};
var DBG=typeof location!=='undefined'&&/[?&]debug=1/.test(location.search);
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
async function raw(a,d){try{var r=await fetch(CFG.API,{method:'POST',body:JSON.stringify(Object.assign({a:a},d||{}))});var j=await r.json()}catch(e){throw new Error('Không kết nối được máy chủ, vui lòng thử lại')}if(!j.ok)throw new Error(j.m);return j.d}
/* Chỉ thử lại lệnh ĐỌC dữ liệu (pub). Tuyệt đối không thử lại spin để khỏi trừ quà 2 lần. */
async function pubTry(d,n){var e;for(var i=0;i<=n;i++){try{return await raw('pub',d)}catch(x){e=x;if(i<n)await sleep(700*(i+1))}}throw e}
async function api(a,d){return a=='pub'?fixPub(await pubTry(d,2)):raw(a,d)}
/* Quà của MỘT cửa hàng (dùng khi cửa hàng đó chưa tải được lúc mở trang) */
async function storePrizes(s){var x=await pubTry({store:s},2);if(x&&Array.isArray(x.prizes))return x.prizes;var p=(x&&x.prizes)||{},k=Object.keys(p).filter(function(y){return nk(y)===nk(s)})[0];return k?p[k]:[]}
function nk(s){return String(s==null?'':s).normalize('NFC').replace(/\s+/g,' ').trim().toLowerCase()}
/* Chuẩn hóa dữ liệu 'pub' về dạng {prizes:{tênCửaHàng:[quà...]}, unk:{cửaHàngChưaTảiĐược:1}}
   - Máy chủ mới: prizes đã là object theo cửa hàng.
   - Máy chủ cũ: prizes là MẢNG quà của 1 cửa hàng -> hỏi riêng từng cửa hàng còn lại.
   Cửa hàng hỏi lỗi mạng KHÔNG bị coi là hết quà: đánh dấu unk để tải lại khi khách chọn. */
async function fixPub(d){
  var st=d.stores||[],unk={},pz={};
  if(Array.isArray(d.prizes)){
    var first=d.store||st[0];
    if(first)pz[first]=d.prizes;
    var rest=st.filter(function(s){return s!==first});
    var res=await Promise.all(rest.map(function(s){return pubTry({store:s},2).then(function(x){return x&&Array.isArray(x.prizes)?x.prizes:null}).catch(function(){return null})}));
    rest.forEach(function(s,i){if(res[i])pz[s]=res[i];else{pz[s]=[];unk[s]=1}});
    /* Nếu máy chủ bỏ qua tham số store (mọi cửa hàng trả y hệt nhau) thì chỉ tin cửa hàng đầu */
    var js=rest.filter(function(s,i){return res[i]&&res[i].length}).map(function(s,i){return JSON.stringify(pz[s])}),j0=JSON.stringify(d.prizes);
    if(rest.length>1&&js.length==rest.length&&d.prizes.length&&js.every(function(x){return x===j0}))rest.forEach(function(s){pz[s]=[];unk[s]=1})
  }else{
    var src=d.prizes||{},keys=Object.keys(src);
    st.forEach(function(s){var k=src[s]?s:keys.filter(function(x){return nk(x)===nk(s)})[0];pz[s]=k?src[k]:[]})
  }
  d.prizes=pz;d.unk=unk;
  var n=st.filter(function(s){return(pz[s]||[]).length||unk[s]}).length;
  if(st.length&&!n){var m='Chẩn đoán: '+st.length+' cửa hàng, không cửa hàng nào có quà';try{console.warn(m)}catch(e){}if(DBG){var er=document.getElementById('er');if(er)er.textContent=m}}
  return d}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return Number(n||0).toLocaleString('vi-VN')}
function snow(){for(var i=0;i<24;i++){var s=document.createElement('i');s.className='sn';s.textContent='❄';s.style.cssText='left:'+Math.random()*100+'vw;animation-duration:'+(6+Math.random()*8)+'s;animation-delay:-'+Math.random()*10+'s;font-size:'+(10+Math.random()*16)+'px';document.body.appendChild(s)}}
