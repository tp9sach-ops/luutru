/* PATCHES-DRAMA (P25) – v24: cuộc đua sát nút hơn ở nhóm đầu. (Phần giọng MC ông già Noel đã gỡ bỏ hoàn toàn theo yêu cầu.)
   Áp sau P24 (loader.js nối window.P25). */
window.P25 = [
/* 1) khoảng cách về đích: 1-2 cọp "đối thủ" về sát cọp thắng (0,18-0,73 giây), còn lại cách xa hơn (0,95-2,45 giây) -> nhóm đầu quần nhau nhiều hơn */
[`function startRace(r){`,`var RV2=null;
function RGAP(i,wi){var n=LP.length,q,c=[];if(!RV2){RV2=[];for(q=0;q<n;q++)if(q!=wi)c.push(q);c.sort(function(){return Math.random()-.5});if(c.length>0)RV2[c[0]]=1;if(c.length>2&&Math.random()<.65)RV2[c[1]]=1}return RV2[i]?.18+Math.random()*.45:.7+Math.random()*1.0}
function startRace(r){RV2=null;`],
[`DUR+.6+Math.random()*1.7`,`DUR+RGAP(i,wi)`],
/* 2) hạng từng cọp mỗi khung hình -> cọp trong top 3 gắng sức hơn (xem tiger-runtime.js) */
[`l.v=v;pose(l,0,v,dt,i,rt);`,`var rk=0,qk;if(plan&&state=='race'&&rt>3){for(qk=0;qk<n;qk++)if(qk!=i&&pr(qk,rt)>pr(i,rt))rk++}else rk=9;l.rk=rk;l.v=v;pose(l,0,v,dt,i,rt);`],
/* 3) v36: DUR 22 -> 18 (áp sau vá cũ trong loader.js đã đổi 16 -> 22) */
[`DUR=22,MAXL=12`,`DUR=18,MAXL=12`],
/* 4) v36: rút thời gian mở đầu 4,0 s -> 2,6 s và đếm ngược 2,9 s -> 2,5 s (tổng cuộc đua ~34 s) */
[`k*140)})},2600);`,`k*140)})},1500);`],
[`SB.classList.add('show')},3200);`,`SB.classList.add('show')},2000);`],
[`state='warm';res()},4000)})}`,`state='warm';res()},2600)})}`],
[`k--;setTimeout(step,800)}`,`k--;setTimeout(step,700)}`],
[`el.hidden=true;res()},500)}})()})}`,`el.hidden=true;res()},400)}})()})}`],
/* 5) v37: nút BẮT ĐẦU trong màn đua: sau mở đầu, cọp đứng yên chờ; bấm nút mới đếm ngược 3-2-1 rồi cọp chạy (áp cho cả go() và DC.start()) */
[`function intro(tk){`,`function waitStart(tk){return new Promise(function(res){
  if(tk!==cdTok)return res();
  var b=document.getElementById('bd'),iv;
  if(!b){var st=document.createElement('style');st.textContent='@keyframes bdp{50%{transform:translateX(-50%) scale(1.07)}}#bd{position:fixed;left:50%;bottom:15%;transform:translateX(-50%);z-index:9999;padding:16px 38px;border:0;border-radius:18px;font:800 24px "Baloo 2",system-ui,sans-serif;color:#7a0a1c;background:linear-gradient(#ffd95a,#ffb300);box-shadow:0 6px 0 #b37a00,0 10px 24px #0008;cursor:pointer;touch-action:manipulation;animation:bdp 1.1s infinite;white-space:nowrap}#bd:active{box-shadow:0 2px 0 #b37a00}';document.head.appendChild(st);
   b=document.createElement('button');b.id='bd';b.type='button';document.body.appendChild(b)}
  b.textContent='▶ BẮT ĐẦU';b.hidden=false;window.__wt=1;
  function done(){clearInterval(iv);b.hidden=true;window.__wt=0;b.onclick=null;res()}
  b.onclick=function(){try{beep(784,.15)}catch(e){}done()};
  iv=setInterval(function(){if(tk!==cdTok)done()},300)})}
function intro(tk){`],
[`return tk===cdTok?countdown():0})`,`return tk===cdTok?waitStart(tk).then(function(){return tk===cdTok?countdown():0}):0})`],
[`if(state=='warm')v=.8;`,`if(state=='warm')v=window.__wt?0:.8;`]
];
