window.CFG={API:'https://script.google.com/macros/s/AKfycbx80zKKqUsDDv-zvfspmSgk5rMYwvBQwVO7LOzRh_9a_W9S3QTjsjwBHRm4IHllR1kp/exec'};
async function raw(a,d){try{var r=await fetch(CFG.API,{method:'POST',body:JSON.stringify(Object.assign({a:a},d||{}))});var j=await r.json()}catch(e){throw new Error('Không kết nối được máy chủ, vui lòng thử lại')}if(!j.ok)throw new Error(j.m);return j.d}
async function api(a,d){var x=await raw(a,d);return a=='pub'?fixPub(x):x}
function nk(s){return String(s==null?'':s).normalize('NFC').replace(/\s+/g,' ').trim().toLowerCase()}
async function fixPub(d){
  var st=d.stores||[];
  /* Apps Script bản cũ trả quà của MỘT cửa hàng dạng mảng: hỏi riêng từng cửa hàng rồi ghép lại */
  if(Array.isArray(d.prizes)){
    var arr=await Promise.all(st.map(function(s){return raw('pub',{store:s}).then(function(x){return x&&Array.isArray(x.prizes)?x.prizes:[]}).catch(function(){return[]})})),
        j0=JSON.stringify(arr[0]),same=st.length>1&&arr.every(function(x){return JSON.stringify(x)===j0}),pz0={};
    st.forEach(function(s,i){if(!same||i==0)pz0[s]=arr[i]});
    d.prizes=pz0;d.legacy=same?'ignore':'per-store'}
  var raws=JSON.stringify(d.prizes),pz=d.prizes=(d.prizes&&!Array.isArray(d.prizes))?d.prizes:{},keys=Object.keys(pz);
  st.forEach(function(s){if(!pz[s]){var k=keys.filter(function(x){return nk(x)===nk(s)})[0];if(k)pz[s]=pz[k]}});
  var n=st.filter(function(s){return(pz[s]||[]).length}).length;
  if(st.length&&!n){var m='Chẩn đoán: '+st.length+' cửa hàng, nhóm quà='+keys.length+', prizes='+String(raws).slice(0,160),er=document.getElementById('er'),sp=document.querySelector('#empty span');if(er)er.textContent=m;if(sp)sp.textContent=m}
  return d}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return Number(n||0).toLocaleString('vi-VN')}
function snow(){for(var i=0;i<24;i++){var s=document.createElement('i');s.className='sn';s.textContent='❄';s.style.cssText='left:'+Math.random()*100+'vw;animation-duration:'+(6+Math.random()*8)+'s;animation-delay:-'+Math.random()*10+'s;font-size:'+(10+Math.random()*16)+'px';document.body.appendChild(s)}}
