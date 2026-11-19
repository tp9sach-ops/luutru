window.CFG={API:'https://script.google.com/macros/s/AKfycbx80zKKqUsDDv-zvfspmSgk5rMYwvBQwVO7LOzRh_9a_W9S3QTjsjwBHRm4IHllR1kp/exec'};
async function api(a,d){try{var r=await fetch(CFG.API,{method:'POST',body:JSON.stringify(Object.assign({a:a},d||{}))});var j=await r.json()}catch(e){throw new Error('Không kết nối được máy chủ, vui lòng thử lại')}if(!j.ok)throw new Error(j.m);return j.d}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return Number(n||0).toLocaleString('vi-VN')}
function snow(){for(var i=0;i<24;i++){var s=document.createElement('i');s.className='sn';s.textContent='❄';s.style.cssText='left:'+Math.random()*100+'vw;animation-duration:'+(6+Math.random()*8)+'s;animation-delay:-'+Math.random()*10+'s;font-size:'+(10+Math.random()*16)+'px';document.body.appendChild(s)}}
