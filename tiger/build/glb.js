/* Xuất tiger_rigged.glb: lưới + xương + trọng số + texture + 4 clip (Idle, Run, Wave, Cheer). node glb.js <dir tiger> <ảnh color.jpg> <ảnh normal.jpg> */
const fs=require('fs'),path=require('path');const R=require('../tiger-rig.js');
const [,,dir,colJ,norJ]=process.argv;
const meta=JSON.parse(fs.readFileSync(path.join(dir,'tiger.json')));const bin=fs.readFileSync(path.join(dir,'tiger.bin'));
const K=R.K,B=R.BONES,nb=B.length,n=meta.n;
const chunks=[];let off=0;const bv=[],acc=[];
function add(buf,target){const pad=(4-off%4)%4;if(pad){chunks.push(Buffer.alloc(pad));off+=pad}const i=bv.length;bv.push({buffer:0,byteOffset:off,byteLength:buf.length,...(target?{target}:{})});chunks.push(buf);off+=buf.length;return i}
function accr(view,ct,count,type,extra){acc.push({bufferView:view,componentType:ct,count,type,...extra});return acc.length-1}
const P=meta.parts,sl=k=>bin.subarray(P[k][0],P[k][0]+P[k][1]);
const pos=new Float32Array(sl('pos').buffer.slice(sl('pos').byteOffset,sl('pos').byteOffset+P.pos[1]));
let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<n;i++)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],pos[i*3+k]);mx[k]=Math.max(mx[k],pos[i*3+k])}
const n4=sl('nor'),nf=new Float32Array(n*3);for(let i=0;i<n;i++)for(let k=0;k<3;k++){const v=n4.readInt8(i*4+k)/127;nf[i*3+k]=v}
const aPos=accr(add(Buffer.from(pos.buffer,pos.byteOffset,n*12),34962),5126,n,'VEC3',{min:mn,max:mx});
const aNor=accr(add(Buffer.from(nf.buffer),34962),5126,n,'VEC3');
const aUv=accr(add(Buffer.from(sl('uv')),34962),5123,n,'VEC2',{normalized:true});
const aJ=accr(add(Buffer.from(sl('sidx')),34962),5121,n,'VEC4');
const aW=accr(add(Buffer.from(sl('sw')),34962),5121,n,'VEC4',{normalized:true});
const aI=accr(add(Buffer.from(sl('idx')),34963),5123,meta.tris*3,'SCALAR');
/* nút: 0..nb-1 xương (vị trí cục bộ ×K), nb = mesh */
const nodes=B.map((b,i)=>{const lp=R.localPos(i);return{name:b.n,translation:lp.map(v=>v*K),...(false?{}:{})}});
B.forEach((b,i)=>{if(b.p>=0){(nodes[b.p].children=nodes[b.p].children||[]).push(i)}});
/* ma trận nghịch đảo bind: tịnh tiến -(vị trí khớp thế giới ×K) , cột-chính */
const ibm=new Float32Array(nb*16);B.forEach((b,i)=>{const m=[1,0,0,0,0,1,0,0,0,0,1,0,-b.t[0]*K,-b.t[1]*K,-b.t[2]*K,1];ibm.set(m,i*16)});
const aIbm=accr(add(Buffer.from(ibm.buffer),null),5126,nb,'MAT4');
/* clip */
const clips={Idle:{dur:4,fps:30,p:t=>({k:0,t})},Run:{dur:2*Math.PI/14.5*2,fps:30,p:(t,d)=>({k:1,ph:t/d*Math.PI*2*2*0.5*2/2,t:0})},Wave:{dur:2,fps:30,p:t=>({k:0,wave:1,t})},Cheer:{dur:1.0472,fps:30,p:(t,d)=>{const q=t;const h=Math.abs(Math.sin(q*6));return{k:0,cheer:1,jump:h*.7/K,air:Math.min(1,h*2.4),t}}}};
clips.Run.p=(t,d)=>({k:1,ph:t/d*Math.PI*2,t:0});
const anims=[];
for(const [name,c] of Object.entries(clips)){
  const N=Math.round(c.dur*c.fps),times=new Float32Array(N+1);const rot=B.map(()=>new Float32Array((N+1)*4));const tr=new Float32Array((N+1)*3);
  for(let f=0;f<=N;f++){times[f]=f/c.fps;const s=R.solve(c.p(f/c.fps,c.dur));B.forEach((b,i)=>rot[i].set(s.q[i],f*4));tr.set([s.x*K,s.y*K,s.z*K],f*3)}
  const aT=accr(add(Buffer.from(times.buffer),null),5126,N+1,'SCALAR',{min:[0],max:[times[N]]});
  const samplers=[],channels=[];
  B.forEach((b,i)=>{const a=accr(add(Buffer.from(rot[i].buffer),null),5126,N+1,'VEC4');samplers.push({input:aT,output:a,interpolation:'LINEAR'});channels.push({sampler:samplers.length-1,target:{node:i,path:'rotation'}})});
  const aR=accr(add(Buffer.from(tr.buffer),null),5126,N+1,'VEC3');samplers.push({input:aT,output:aR,interpolation:'LINEAR'});channels.push({sampler:samplers.length-1,target:{node:0,path:'translation'}});
  anims.push({name,samplers,channels});
}
const imgs=[],texs=[];
const i0=add(fs.readFileSync(colJ),null),i1=add(fs.readFileSync(norJ),null);
nodes.push({name:'TigerMesh',mesh:0,skin:0});
const gltf={asset:{version:'2.0',generator:'tiger-rig glb.js'},scene:0,scenes:[{nodes:[0,nb]}],nodes,
 meshes:[{name:'Tiger',primitives:[{attributes:{POSITION:aPos,NORMAL:aNor,TEXCOORD_0:aUv,JOINTS_0:aJ,WEIGHTS_0:aW},indices:aI,material:0}]}],
 skins:[{joints:B.map((_,i)=>i),inverseBindMatrices:aIbm,skeleton:0}],
 materials:[{name:'TigerMat',pbrMetallicRoughness:{baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:.8},normalTexture:{index:1}}],
 textures:[{source:0,sampler:0},{source:1,sampler:0}],samplers:[{magFilter:9729,minFilter:9987}],
 images:[{bufferView:i0,mimeType:'image/jpeg'},{bufferView:i1,mimeType:'image/jpeg'}],
 animations:anims,accessors:acc,bufferViews:bv,buffers:[{byteLength:0}]};
const body=Buffer.concat(chunks);const padB=Buffer.concat([body,Buffer.alloc((4-body.length%4)%4)]);gltf.buffers[0].byteLength=padB.length;
let js=Buffer.from(JSON.stringify(gltf));js=Buffer.concat([js,Buffer.alloc((4-js.length%4)%4,0x20)]);
const hd=Buffer.alloc(12);hd.write('glTF',0);hd.writeUInt32LE(2,4);hd.writeUInt32LE(12+8+js.length+8+padB.length,8);
const c1=Buffer.alloc(8);c1.writeUInt32LE(js.length,0);c1.writeUInt32LE(0x4E4F534A,4);const c2=Buffer.alloc(8);c2.writeUInt32LE(padB.length,0);c2.writeUInt32LE(0x004E4942,4);
fs.writeFileSync(path.join(dir,'tiger_rigged.glb'),Buffer.concat([hd,c1,js,c2,padB]));console.log('GLB ok',12+8+js.length+8+padB.length);
