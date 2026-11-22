/* PATCHES-DRAMA (P25) – v22: cuộc đua sát nút hơn ở nhóm đầu + MC ông già Noel bình luận bằng giọng nói (speechSynthesis).
   Áp sau P24 (loader.js nối window.P25). Giọng: trầm (pitch thấp), chậm, tiếng Việt nếu máy có; máy không có giọng Việt thì im lặng, chữ bình luận vẫn hiện.
   Cấu hình ở window.MCV bên dưới: bật/tắt, cao độ, tốc độ. Nút 🔊/🔇 của game cũng tắt tiếng MC. */
window.MCV = { on: 1, pitch: .4, rate: .9, close: .005 };   /* close = khoảng cách (phần quãng đường, ~0,005 = chừng 1 thân cọp) giữa nhất và nhì coi là "kè sát" */
window.P25 = [
/* 1) khoảng cách về đích: 1-2 cọp "đối thủ" về sát cọp thắng (0,18-0,73 giây), còn lại cách xa hơn (0,95-2,45 giây) -> nhóm đầu quần nhau nhiều hơn */
[`function startRace(r){`,`var RV2=null;
function RGAP(i,wi){var n=LP.length,q,c=[];if(!RV2){RV2=[];for(q=0;q<n;q++)if(q!=wi)c.push(q);c.sort(function(){return Math.random()-.5});if(c.length>0)RV2[c[0]]=1;if(c.length>2&&Math.random()<.65)RV2[c[1]]=1}return RV2[i]?.18+Math.random()*.55:.95+Math.random()*1.5}
function startRace(r){RV2=null;`],
[`DUR+.6+Math.random()*1.7`,`DUR+RGAP(i,wi)`],
/* 2) hạng từng cọp mỗi khung hình -> cọp trong top 3 gắng sức hơn (xem tiger-runtime.js) */
[`l.v=v;pose(l,0,v,dt,i,rt);`,`var rk=0,qk;if(plan&&state=='race'&&rt>3){for(qk=0;qk<n;qk++)if(qk!=i&&pr(qk,rt)>pr(i,rt))rk++}else rk=9;l.rk=rk;l.v=v;pose(l,0,v,dt,i,rt);`],
/* 3) MC ông già Noel: giọng nói */
[`var CM={p:null,el:null,fl:null,hd:0};`,`var MCt=0;
function MCvoice(){var vs,i;try{vs=speechSynthesis.getVoices()}catch(e){return undefined}if(!vs||!vs.length)return null;for(i=0;i<vs.length;i++)if(/^vi/i.test(vs[i].lang))return vs[i];return false}
function MCsay(t,keep){try{var M=window.MCV||{};if(!M.on||mute||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;var v=MCvoice(),u,s=speechSynthesis;if(v===false||v===undefined)return;u=new SpeechSynthesisUtterance(t);if(v)u.voice=v;u.lang='vi-VN';u.pitch=M.pitch==null?.4:M.pitch;u.rate=M.rate==null?.9:M.rate;u.volume=1;if(!keep||!s.speaking){s.cancel();s.speak(u)}else s.speak(u);MCt=performance.now()}catch(e){}}
function MCprime(){try{if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;speechSynthesis.getVoices();var u=new SpeechSynthesisUtterance('Hô hô hô! Cuộc đua cọp may mắn bắt đầu!'),v=MCvoice();if(v===false||mute||!(window.MCV&&MCV.on))return;if(v)u.voice=v;u.lang='vi-VN';u.pitch=(window.MCV&&MCV.pitch)||.4;u.rate=(window.MCV&&MCV.rate)||.9;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
var CM={p:null,el:null,fl:null,hd:0};`],
[`function cmShow(t,ms){var e=cmEl();`,`function cmShow(t,ms,keep){MCsay(t,keep);var e=cmEl();`],
[`unlock();primeRace();`,`unlock();primeRace();MCprime();`],
[`$('mute').onclick=function(){mute=!mute;`,`$('mute').onclick=function(){mute=!mute;try{if(mute)speechSynthesis.cancel()}catch(e){}`],
/* 4) lời bình luận phong phú, thêm câu "kè sát" khi nhất nhì cách nhau rất ít */
[`cmShow('Xuất phát! Cả đoàn bứt đi!',1800)`,`cmShow('Hô hô hô! Xuất phát! Cả đoàn bứt đi!',2400)`],
[`CM.fl2={}}`,`CM.fl2={};CM.cl=-9;CM.ln=0}`],
[`rt-CM.last>2.4`,`rt-CM.last>1.9`],
[`if(!CM.sp&&rt>DUR-5){`,`var b2=-1,p2=-1,LNS;for(i=0;i<n;i++){if(i==b)continue;p=pr(i,rt);if(p>p2){p2=p;b2=i}}
if(b2>=0&&rt>4&&rt<DUR-1.2&&bp-p2<((window.MCV&&MCV.close)||.005)&&rt-CM.cl>3.4&&rt-CM.last>1.5){CM.cl=rt;CM.last=rt;LNS=['Cọp '+LP[b].ten+' và cọp '+LP[b2].ten+' kè sát từng bước!','Căng quá! Cọp '+LP[b2].ten+' bám sát cọp '+LP[b].ten+', không chịu thua!','Hai cọp ngang tài ngang sức, ai cũng gắng hết sức!'];cmShow(LNS[CM.ln++%3],2300)}
if(!CM.sp&&rt>DUR-5){`],
[`cmShow('Nước rút cuối! Sắp về đích!',2000)`,`cmShow('Nước rút cuối! Cố lên các cọp, sắp về đích rồi!',2400)`],
[`cmShow('Cọp '+LP[plan.W].ten+' về nhất!',2800)`,`cmShow('Hô hô hô! Cọp '+LP[plan.W].ten+' về nhất! Chúc mừng quý khách!',3600,1)`]
];
