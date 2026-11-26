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
/* 3) v36: DUR 22 -> 17 (áp sau vá cũ trong loader.js đã đổi 16 -> 22) */
[`DUR=22,MAXL=12`,`DUR=17,MAXL=12`],
/* 4) v36: rút thời gian mở đầu 4,0 s -> 2,6 s (tổng ~34 s từ lúc bấm BẮT ĐẦU ĐUA) */
[`k*140)})},2600);`,`k*140)})},1500);`],
[`SB.classList.add('show')},3200);`,`SB.classList.add('show')},2000);`],
[`state='warm';res()},4000)})}`,`state='warm';window.__wt=1;res()},2600)})}`],
/* 5) v37: nút BẮT ĐẦU ĐUA có sẵn (#go trong patches-fix.js, hiện sau phần mở đầu). Trong lúc chờ bấm, cọp ĐỨNG YÊN (window.__wt=1); bắt đầu đua thì cọp chạy */
[`function intro(tk){
  state='intro';`,`function intro(tk){
  window.__wt=0;state='intro';`],
[`function startRace(r){RV2=null;`,`function startRace(r){window.__wt=0;RV2=null;`],
[`if(state=='warm')v=.8;`,`if(state=='warm')v=window.__wt?0:.8;`]
];
