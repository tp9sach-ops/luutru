/* LOADER v8 – nạp game.js rồi áp bản vá (find-and-replace) trước khi chạy. Vá nào không khớp sẽ bị bỏ qua (có cảnh báo trong console). Nếu lỗi mạng thì chạy game.js gốc. Thêm ?classic=1 để chạy bản gốc không vá. */
(function(){
var V='game.js?v=8';
function run(s){var e=document.createElement('script');e.text=s;document.body.appendChild(e)}
function plain(){var e=document.createElement('script');e.src=V;document.body.appendChild(e)}
if(/[?&]classic=1/.test(location.search))return plain();
var P=[
/* A. tắt tone mapping (làm cảnh xám, nhãn thành hộp xám); sương mù xa hơn cho cảnh sắc nét */
['S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,60,190);','R.toneMapping=TH.NoToneMapping;S=new TH.Scene();S.background=new TH.Color(HORIZON);S.fog=new TH.Fog(HORIZON,95,240);'],
/* B. ánh sáng: đèn chính ấm từ phía trước cho thấy mặt cọp + đèn viền (rim) xanh lạnh tách cọp khỏi nền */
['var l=new TH.DirectionalLight(0xbfcdff,.8);l.position.set(-14,26,22);S.add(l);','var l=new TH.DirectionalLight(0xffe6c0,1.2);l.position.set(14,26,26);S.add(l);var rim=new TH.DirectionalLight(0x9fd4ff,.8);rim.position.set(-18,14,-24);S.add(rim);'],
['new TH.HemisphereLight(0xfff0e6,0xbccaff,1.08)','new TH.HemisphereLight(0xfff0e6,0x9fb0e8,.82)'],
/* C. cọp: bỏ 2 vòng sọc quanh bụng (nhìn như lò xo), to hơn để thấy rõ mặt */
['[.72,1.02].forEach(function(y){var k=Math.sqrt(1-Math.pow((y-.95)/.62,2)),t=mesh(b,GT,BR,.5*k*1.03,.52*k*1.03,1,0,y,0);t.rotation.x=Math.PI/2});','/* bo song bung */'],
['tg.g.scale.setScalar(1.02);','tg.g.scale.setScalar(1.18);'],
/* D. nhãn quà: cao hơn, cọp gần camera đè lên trên (hết xếp cột chồng lên nhau) */
['var sp=label(p.ten,col,2.6,1.08);sp.position.set(0,6.4,0);ln.add(sp);','var sp=label(p.ten,col,2.5,1.04);sp.position.set(0,7.1,0);sp.renderOrder=10+i;ln.add(sp);'],
/* E. hạt tuyết/bụi/pháo giấy: tròn mềm thay vì ô vuông */
['new TH.PointsMaterial({color:col,size:size,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})','new TH.PointsMaterial({color:col,size:size*2.2,map:TX.glowW,transparent:true,opacity:.9,depthWrite:false,vertexColors:!!vc})'],
['new TH.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.9,depthWrite:false})','new TH.PointsMaterial({color:0xffffff,size:.6,map:TX.glowW,transparent:true,opacity:.95,depthWrite:false})'],
/* F. góc quay: nhìn 3/4 từ phía trước để thấy mặt cọp thay vì lưng */
['if(t<2.6){p=[cx-10,6+hw*.7,hw*1.5+13];l=[cx+3,.8,0];zt=1.04;k=2.2}','if(t<2.6){p=[cx+9,6+hw*.7,hw*1.5+13];l=[cx-1,.8,0];zt=1.04;k=2.2}'],
['p=[cx-9,8+hw*.8,hw*1.25+14+Math.sin(tm*.5)*1.2];l=[cx-1,.5,0];k=1.8','p=[cx+8,7+hw*.8,hw*1.25+13+Math.sin(tm*.5)*1.2];l=[cx-2,.8,0];k=1.8'],
['iP=[cx-3,8+hw*.8,hw*1.25+14],iL=[cx+4,.5,0]','iP=[cx+8,7+hw*.8,hw*1.25+13],iL=[cx-2,.8,0]']
];
fetch(V).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(s){
 P.forEach(function(q){if(s.indexOf(q[0])<0){try{console.warn('patch miss:',q[0].slice(0,50))}catch(e){}return}s=s.split(q[0]).join(q[1])});
 run(s+'\n//# sourceURL=game.patched.js')}).catch(plain);
})();
