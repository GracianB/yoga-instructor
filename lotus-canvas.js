/* Botanical canvas. Decorative only; the Movement engine owns posture and time. */
(()=>{"use strict";
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
function mount(host,kind){if(!host)return;const canvas=document.createElement("canvas");canvas.className="living-lotus living-lotus-"+kind;canvas.setAttribute("aria-hidden","true");host.append(canvas);let ctx;try{ctx=canvas.getContext("2d")}catch(_){return}if(!ctx){canvas.remove();return;}host.classList.add("has-living-lotus");
let width=0,height=0,raf=0,visible=false,last=0,progress=0,active=false,pointer=0;
const dark=()=>document.documentElement.dataset.theme==="dark";
function resize(){const box=host.getBoundingClientRect();width=box.width;height=box.height;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,width*d);canvas.height=Math.max(1,height*d);ctx.setTransform(d,0,0,d,0,0);draw(0);}
function petal(cx,cy,size,angle,spread,color){ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-size*spread,-size*.32,-size*.28,-size*.88,0,-size);ctx.bezierCurveTo(size*.28,-size*.88,size*spread,-size*.32,0,0);const wash=ctx.createLinearGradient(0,0,0,-size);wash.addColorStop(0,dark()?"#8b667422":"#c894a322");wash.addColorStop(.65,color);wash.addColorStop(1,dark()?"#f3c4d666":"#efd2db99");ctx.fillStyle=wash;ctx.fill();ctx.strokeStyle=dark()?"#efbfd580":"#98657880";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-size*.06,-size*.4,0,-size*.88);ctx.strokeStyle=dark()?"#f5d6e838":"#90627a38";ctx.stroke();ctx.restore();}
function draw(time){ctx.clearRect(0,0,width,height);const scale=Math.min(width/560,height/400),cx=width*.5+(reduce.matches?0:Math.sin(time/5300)*5),cy=height*(kind==="hero"?.57:.72)+(reduce.matches?0:Math.sin(time/4200)*6);const movement=kind==="movement";const breath=reduce.matches?0:Math.sin(time/2200)*.075;const bloom=1+breath+(movement&&active?progress*.035:0);const radius=(kind==="hero"?205:150)*scale*bloom;
ctx.save();ctx.globalAlpha=movement?.48:1;const halo=ctx.createRadialGradient(cx,cy-radius*.5,0,cx,cy-radius*.5,radius*1.8);halo.addColorStop(0,dark()?"#e3a1bf20":"#cc8ca524");halo.addColorStop(1,"#b68ea800");ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,cy+17*scale+i*9*scale,radius*(1.08+i*.13+(reduce.matches?0:Math.sin(time/1900-i*.8)*.08)),8*scale+i*3*scale,0,0,Math.PI*2);ctx.strokeStyle=dark()?"#c3b0d333":"#8e718f33";ctx.lineWidth=1;ctx.stroke();}
for(let layer=0;layer<3;layer++){const count=layer===0?7:5;for(let i=0;i<count;i++){const spread=(i-(count-1)/2)*(layer===0?.30:.34);petal(cx,cy,radius*(1-layer*.16),spread*(1+(reduce.matches?0:Math.sin(time/2200+layer*.4)*.13))+pointer*.12+(reduce.matches?0:Math.sin(time/4100+i*.8)*.018),.29+layer*.06,dark()?(layer===0?"#ba91bd35":"#e6b0c255"):(layer===0?"#bb99b440":"#d7a0b955"));}}
ctx.restore();canvas.dataset.motion=reduce.matches?"static":"animated";}
function tick(t){raf=0;if(!visible||document.hidden||reduce.matches||(kind==="movement"&&!active))return;if(t-last>40){draw(t);last=t}raf=requestAnimationFrame(tick);}
function sync(){if(raf)cancelAnimationFrame(raf);raf=0;draw(performance.now());if(visible&&!document.hidden&&!reduce.matches&&(kind!=="movement"||active))raf=requestAnimationFrame(tick);}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(host);
new ResizeObserver(resize).observe(host);
new MutationObserver(()=>draw(performance.now())).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
reduce.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
host.addEventListener("pointermove",event=>{const box=host.getBoundingClientRect();pointer=(event.clientX-box.left)/Math.max(1,box.width)-.5;if(reduce.matches)draw(0);});host.addEventListener("pointerleave",()=>{pointer=0});
if(kind==="movement")window.addEventListener("yoga:flow",event=>{const state=event.detail||{};const before=active;active=state.status==="running";progress=Math.max(0,Math.min(1,Number(state.progress)||0));if(before!==active)sync();});
window.addEventListener("pagehide",()=>{if(raf)cancelAnimationFrame(raf)});resize();}
mount(document.querySelector(".mandala-parallax"),"hero");mount(document.querySelector("#flow-guide .yy-stage"),"movement");
})();
