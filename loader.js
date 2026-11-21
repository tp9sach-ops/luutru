/* LOADER v17: nạp cọp 3D có xương (+ logo ngực, băng đô, đuôi) song song với game.js. game.js đã gộp sẵn các bản vá cũ (không còn find-and-replace). */
(function(){
var V='game.js?v=14';
function run(s){var e=document.createElement('script');e.text=s+'\n//# sourceURL=game.js';document.body.appendChild(e)}
function plain(){var e=document.createElement('script');e.src=V;document.body.appendChild(e)}
var st=document.createElement('style');st.textContent='.box img{border-radius:18px;border:3px solid #ffd05a;box-shadow:0 10px 26px rgba(0,0,0,.35);margin:8px 0}'+
'.mc{font-size:clamp(28px,8.5vw,70px)!important;top:45%!important}.mcs{bottom:12%!important}.tvbar{background:linear-gradient(#010a06,#04180f)!important}'+
'.gt{filter:drop-shadow(0 0 34px rgba(255,205,90,.6)) drop-shadow(0 14px 20px rgba(0,0,0,.5))!important}#gate:after{background:radial-gradient(ellipse at 50% 0,#ffffff,#d6e2ff 55%,#9db1e8)!important;box-shadow:0 -10px 40px #fff9!important}'+
'select{font-weight:700!important;letter-spacing:.01em}'+
/* v13: cân màu điện ảnh (đỉnh sáng ấm góc trên phải, bóng tối xanh góc dưới trái) + popup trúng thưởng có tia sáng xoay phía sau */
'.stage:before{content:"";position:absolute;left:0;top:0;right:0;bottom:0;z-index:3;pointer-events:none;mix-blend-mode:soft-light;background:radial-gradient(ellipse at 78% 10%,rgba(255,196,96,.6),transparent 55%),radial-gradient(ellipse at 10% 95%,rgba(70,96,255,.5),transparent 60%)}'+
'.box{isolation:isolate}.box:before{content:"";position:absolute;left:50%;top:38%;width:170vmax;height:170vmax;margin:-85vmax 0 0 -85vmax;background:repeating-conic-gradient(rgba(255,214,90,.18) 0 6deg,transparent 6deg 14deg);animation:pspin 32s linear infinite;z-index:-1;pointer-events:none;-webkit-mask-image:radial-gradient(circle,#000,transparent 58%);mask-image:radial-gradient(circle,#000,transparent 58%)}';
document.head.appendChild(st);
function loadJS(u){return new Promise(function(ok,bad){var e=document.createElement('script');e.src=u;e.onload=ok;e.onerror=function(){bad(new Error(u))};document.head.appendChild(e)})}
var tgr=loadJS('tiger/tiger-rig.js?v=1').then(function(){return loadJS('tiger/tiger-runtime.js?v=1')}).then(function(){return loadJS('tiger/tiger-extras.js?v=1')}).then(function(){return window.TR.load('tiger/')}).catch(function(e){try{console.warn('Cọp có xương chưa nạp được, dùng cọp dựng bằng mã',e)}catch(_){}});
Promise.all([fetch(V).then(function(r){if(!r.ok)throw 0;return r.text()}),tgr]).then(function(a){run(a[0])}).catch(plain);
})();
