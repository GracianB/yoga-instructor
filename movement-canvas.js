/* Native Canvas2D renderer sharing all canonical authored pose geometry. */
(()=>{"use strict";
const art=window.YIN_YANG_ART,book=window.YOGA_ASANA_LIBRARY;if(!art||!book)return;
const poses=[...art.poses,...book.poses];
function mount(host,source){if(!host)return;const canvas=document.createElement('canvas');canvas.className='asana-canvas';canvas.setAttribute('role','img');let ctx;try{ctx=canvas.getContext('2d')}catch(_){return}if(!ctx)return;const controls=document.createElement('div');controls.className='canvas-view-controls';controls.innerHTML='<button type="button" class="canvas-silhouette-toggle" aria-pressed="false">Silueta</button><button type="button" class="canvas-joints-toggle" aria-pressed="false"></button><button type="button" class="canvas-expand-toggle"></button><span></span>';host.after(controls);host.append(canvas);let skeleton=false,silhouette=false,key='',scheduled=0,revision=0;
const en=()=>document.documentElement.lang==='en';
function resolve(){const active=host.querySelector('.yy-pose.is-current');const id=active?.dataset.pose;return poses.find(p=>p.id===id)||poses.find(p=>p.kind===active?.querySelector('.movement-guardian')?.dataset.kind)||poses[0];}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function limb(path,width,coat,ink){const shape=new Path2D(path);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=ink;ctx.lineWidth=width+4;ctx.stroke(shape);ctx.strokeStyle=coat;ctx.lineWidth=width;ctx.stroke(shape);}
function draw(force=false){scheduled=0;const p=resolve(),spirit=source?.dataset.spirit||host.dataset.spirit||'yin',dark=document.documentElement.dataset.theme==='dark';const next=p.id+spirit+dark+skeleton+silhouette+en();if(next===key&&!force)return;key=next;const box=host.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height),d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);const scale=Math.min(w/720,h/450);ctx.translate((w-720*scale)/2,(h-450*scale)/2);ctx.scale(scale,scale);
const coat=spirit==='yin'?'#d7b0c5':'#c591aa',ink=dark?'#f0d1df':'#31594b',chest=dark?'#eed5df':'#fae9ef';
// Preserve the authored anatomical skin: sockets, axillae, pelvis and joint volumes.
const active=host.querySelector('.yy-pose.is-current .movement-guardian');
const originalSvg=host.querySelector('svg.yy-svg');
if(active&&originalSvg){
 const clone=active.cloneNode(true),originals=[active,...active.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
 originals.forEach((node,i)=>{const computed=getComputedStyle(node);for(const property of ['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','opacity','fill-rule'])copies[i].style.setProperty(property,computed.getPropertyValue(property));});
 if(silhouette)for(const node of copies){if(node.style.fill!=='none')node.style.fill=dark?'#edbfd2':'#234e40';if(node.style.stroke!=='none')node.style.stroke=dark?'#edbfd2':'#234e40';}
 const points=[...p.hands,...p.feet,[p.head[0]-100*p.head[2],p.head[1]-100*p.head[2]],[p.head[0]+100*p.head[2],p.head[1]+100*p.head[2]],[p.body[0]-p.body[2]-p.body[3]*.15,p.body[1]-p.body[3]],[p.body[0]+p.body[2]+p.body[3]*.15,p.body[1]+p.body[3]],[p.tail[0]-45,p.tail[1]-110*p.tail[2]],[p.tail[0]+165*p.tail[2],p.tail[1]+80*p.tail[2]]];
 const left=Math.min(...points.map(v=>v[0]))-32,top=Math.min(...points.map(v=>v[1]))-32,right=Math.max(...points.map(v=>v[0]))+32,bottom=Math.max(...points.map(v=>v[1]))+32;
 const frameWidth=right-left,frameHeight=bottom-top,fit=Math.min(720/frameWidth,450/frameHeight);
 const defs=originalSvg.querySelector('defs')?.outerHTML||'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="450" viewBox="'+left+' '+top+' '+frameWidth+' '+frameHeight+'">'+defs+new XMLSerializer().serializeToString(clone)+'</svg>';
 canvas.dataset.skin='loading';const picture=new Image(),requestKey=key,requestRevision=++revision;
 picture.onload=()=>{if(key!==requestKey||revision!==requestRevision)return;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);ctx.translate((w-720*scale)/2,(h-450*scale)/2);ctx.scale(scale,scale);ctx.drawImage(picture,0,0,720,450);ctx.save();ctx.translate((720-frameWidth*fit)/2,(450-frameHeight*fit)/2);ctx.scale(fit,fit);ctx.translate(-left,-top);if(skeleton&&window.YOGA_NILA_KINEMATICS_V84){
 const model=window.YOGA_NILA_KINEMATICS_V84;
 const names=en()?['Shoulder','Elbow','Wrist','Hip','Knee','Ankle']:['Hombro','Codo','Muñeca','Cadera','Rodilla','Tobillo'];
 const chains=[...p.arms,...p.legs].map(path=>model.curve(path));
 ctx.strokeStyle=dark?'#fff4fa':'#123b2d';ctx.lineWidth=3;
 chains.forEach((chain,index)=>{const points=[chain.start,chain.joint,chain.end];ctx.beginPath();ctx.moveTo(...points[0]);ctx.lineTo(...points[1]);ctx.lineTo(...points[2]);ctx.stroke();points.forEach(([x,y],joint)=>{ellipse(x,y,7,7,dark?'#edbfd2':'#234e40');ellipse(x,y,3,3,dark?'#123b2d':'#fff7fa');if(index===0||index===2){const lx=index===0?left+22:right-118,ly=top+24+joint*25;ctx.font='bold 13px system-ui';ctx.strokeStyle=dark?'#edbfd280':'#234e4060';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(lx+45,ly+4);ctx.stroke();ctx.fillStyle=dark?'#123b2d':'#fff7fa';ctx.fillRect(lx-5,ly-14,104,20);ctx.fillStyle=dark?'#fff4fa':'#123b2d';ctx.fillText(names[(index===0?0:3)+joint],lx,ly);}});});
}
ctx.restore();canvas.dataset.framing='full-body';canvas.hidden=false;host.classList.add('canvas-character-ready');canvas.dataset.skin='anatomical';};
 picture.onerror=()=>{if(revision!==requestRevision)return;host.classList.remove('canvas-character-ready');canvas.hidden=true;};
 picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
canvas.setAttribute('aria-label',(en()?p.name[1]:p.name[0])+' · '+(en()?'full body':'cuerpo completo'));canvas.dataset.pose=p.id;controls.querySelector('.canvas-joints-toggle').textContent=en()?'Show joints':'Ver articulaciones';controls.querySelector('.canvas-joints-toggle').setAttribute('aria-pressed',String(skeleton));controls.querySelector('.canvas-silhouette-toggle').textContent=en()?'Silhouette':'Silueta';controls.querySelector('.canvas-expand-toggle').textContent=en()?'Full-screen view':'Ver en grande';controls.querySelector('span').textContent=en()?'Full body · hands and feet visible':'Cuerpo completo · manos y pies visibles';}
controls.querySelector('.canvas-silhouette-toggle').addEventListener('click',()=>{silhouette=!silhouette;controls.querySelector('.canvas-silhouette-toggle').setAttribute('aria-pressed',String(silhouette));draw(true)});
const close=document.createElement('button');close.type='button';close.className='canvas-expanded-close';close.textContent='×';close.setAttribute('aria-label',en()?'Close large view':'Cerrar vista ampliada');host.append(close);
const collapse=()=>{if(document.fullscreenElement===host)document.exitFullscreen?.().catch(()=>{});host.classList.remove('canvas-expanded');controls.querySelector('.canvas-expand-toggle').focus();};
close.addEventListener('click',collapse);host.addEventListener('keydown',event=>{if(event.key==='Escape'&&host.classList.contains('canvas-expanded')){event.preventDefault();collapse();}});
controls.querySelector('.canvas-expand-toggle').addEventListener('click',async()=>{host.classList.add('canvas-expanded');try{await host.requestFullscreen?.();}catch(_){}close.focus();draw(true);});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)host.classList.remove('canvas-expanded');});
function schedule(){if(!scheduled)scheduled=requestAnimationFrame(()=>draw());}controls.querySelector('.canvas-joints-toggle').addEventListener('click',()=>{skeleton=!skeleton;draw(true)});new ResizeObserver(()=>draw(true)).observe(host);new MutationObserver(schedule).observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-spirit','data-pose']});new MutationObserver(()=>draw(true)).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme']});if(source)new MutationObserver(()=>draw(true)).observe(source,{attributes:true,attributeFilter:['data-spirit']});draw(true);}
mount(document.querySelector('#flow-guide .yy-stage'),document.getElementById('flow-guide'));mount(document.querySelector('#studio-asana-library .studio-library-stage'),document.getElementById('flow-guide'));
})();
