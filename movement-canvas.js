/* Native Canvas2D renderer sharing all canonical authored pose geometry. */
(()=>{"use strict";
const art=window.YIN_YANG_ART,book=window.YOGA_ASANA_LIBRARY;if(!art||!book)return;
const poses=[...art.poses,...book.poses];
function mount(host,source){if(!host)return;const canvas=document.createElement('canvas');canvas.className='asana-canvas';canvas.setAttribute('role','img');let ctx;try{ctx=canvas.getContext('2d')}catch(_){return}if(!ctx)return;const controls=document.createElement('div');controls.className='canvas-view-controls';controls.innerHTML='<button type="button" class="canvas-silhouette-toggle" aria-pressed="false">Silueta</button><button type="button" aria-pressed="false"></button><span></span>';host.after(controls);host.append(canvas);let skeleton=false,silhouette=false,key='',scheduled=0;
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
 const defs=originalSvg.querySelector('defs')?.outerHTML||'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="450" viewBox="0 0 720 450">'+defs+new XMLSerializer().serializeToString(clone)+'</svg>';
 const picture=new Image(),requestKey=key;
 picture.onload=()=>{if(key!==requestKey)return;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);ctx.translate((w-720*scale)/2,(h-450*scale)/2);ctx.scale(scale,scale);ctx.drawImage(picture,0,0,720,450);if(skeleton){ctx.fillStyle=dark?'#fff1f8':'#163e34';for(const path of [...p.arms,...p.legs]){const n=path.match(/-?\d+(?:\.\d+)?/g)?.map(Number)||[];if(n.length===6)for(const [x,y] of [[n[0],n[1]],[(n[0]+2*n[2]+n[4])/4,(n[1]+2*n[3]+n[5])/4],[n[4],n[5]]])ellipse(x,y,5,5,dark?'#fff1f8':'#163e34');}}canvas.dataset.skin='anatomical';};
 picture.onerror=()=>{host.classList.remove('canvas-character-ready');canvas.hidden=true;};
 picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
if(skeleton){for(const path of [...p.arms,...p.legs]){ctx.strokeStyle=dark?'#fff1f8':'#133c2e';ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.stroke(new Path2D(path));ctx.setLineDash([]);const numbers=path.match(/-?\d+(?:\.\d+)?/g)?.map(Number)||[];const joints=numbers.length===6?[[numbers[0],numbers[1]],[(numbers[0]+2*numbers[2]+numbers[4])/4,(numbers[1]+2*numbers[3]+numbers[5])/4],[numbers[4],numbers[5]]]:[];for(const [jx,jy] of joints)ellipse(jx,jy,4,4,dark?'#fff1f8':'#133c2e');}}
canvas.setAttribute('aria-label',(en()?p.name[1]:p.name[0])+' · '+(en()?'full body':'cuerpo completo'));canvas.dataset.pose=p.id;host.classList.add('canvas-character-ready');controls.querySelector('button:not(.canvas-silhouette-toggle)').textContent=en()?'Show joints':'Ver articulaciones';controls.querySelector('button:not(.canvas-silhouette-toggle)').setAttribute('aria-pressed',String(skeleton));controls.querySelector('span').textContent=en()?'Full body · hands and feet visible':'Cuerpo completo · manos y pies visibles';}
controls.querySelector('.canvas-silhouette-toggle').addEventListener('click',()=>{silhouette=!silhouette;controls.querySelector('.canvas-silhouette-toggle').setAttribute('aria-pressed',String(silhouette));draw(true)});
function schedule(){if(!scheduled)scheduled=requestAnimationFrame(()=>draw());}controls.querySelector('button:not(.canvas-silhouette-toggle)').addEventListener('click',()=>{skeleton=!skeleton;draw(true)});new ResizeObserver(()=>draw(true)).observe(host);new MutationObserver(schedule).observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-spirit','data-pose']});new MutationObserver(()=>draw(true)).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme']});if(source)new MutationObserver(()=>draw(true)).observe(source,{attributes:true,attributeFilter:['data-spirit']});draw(true);}
mount(document.querySelector('#flow-guide .yy-stage'),document.getElementById('flow-guide'));mount(document.querySelector('#studio-asana-library .studio-library-stage'),document.getElementById('flow-guide'));
})();
