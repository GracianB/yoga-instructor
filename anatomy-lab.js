/* Laboratory-only renderer; no dependency on the production studio. */
(()=>{
"use strict";
const rig=window.YOGA_ARTICULATED_RIG,solver=window.YOGA_RIG_CONSTRAINTS;
const svg=document.getElementById("stage"),slider=document.getElementById("progress"),status=document.getElementById("status");
const NS="http://www.w3.org/2000/svg";
const links=rig.links.map(()=>{const node=document.createElementNS(NS,"line");svg.append(node);return node});
const dots=rig.names.map(()=>{const node=document.createElementNS(NS,"circle");node.setAttribute("r","6");svg.append(node);return node});
const reference=rig.links.map(([a,b])=>{const node=document.createElementNS(NS,"line");node.setAttribute("class","reference");const A=rig.standing.joints[a],B=rig.standing.joints[b];Object.entries({x1:A[0],y1:A[1],x2:B[0],y2:B[1]}).forEach(([k,v])=>node.setAttribute(k,String(v)));svg.insertBefore(node,links[0]);return node});
let playing=false,reversed=false,raf=null,last=0,position=0;
const play=document.getElementById("play"),reverse=document.getElementById("reverse"),overlay=document.getElementById("overlay"),compare=document.getElementById("compare");
const sets=(n,attrs)=>Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));
function render(){
 const t=Number(slider.value)/100;
 const result=solver.solve(rig.standing,rig.interpolate(rig.standing,rig.fold,t),{iterations:150,tolerance:.75});
 for(let i=0;i<rig.links.length;i++){const [a,b]=rig.links[i];const A=result.joints[a],B=result.joints[b];sets(links[i],{x1:A[0],y1:A[1],x2:B[0],y2:B[1]})}
 for(let i=0;i<rig.names.length;i++){const A=result.joints[rig.names[i]];sets(dots[i],{cx:A[0],cy:A[1]})}
 dots.forEach(dot=>dot.style.display=overlay.checked?"":"none");
 reference.forEach(line=>line.style.display=compare.checked?"":"none");
 document.getElementById("value").textContent=Math.round(t*100)+"%";
 status.textContent="Error máximo de segmento: "+result.maxError.toFixed(2)+" px · "+(result.converged?"Convergente":"Requiere revisión");
 document.getElementById("stand").setAttribute("aria-pressed",String(t===0));
 document.getElementById("fold").setAttribute("aria-pressed",String(t===1));
}
function stop(){playing=false;play.setAttribute("aria-pressed","false");play.textContent="Reproducir transición";if(raf!==null)cancelAnimationFrame(raf);raf=null;last=0}
function tick(now){
 if(!playing)return;
 if(last===0)last=now;
 const elapsed=Math.min(100,Math.max(0,(now-last)/35));
 last=now;
 let v=position+(reversed?-elapsed:elapsed);
 if(v<=0||v>=100){v=Math.max(0,Math.min(100,v));position=v;slider.value=String(v);render();stop();return}
 position=v;slider.value=String(v);render();raf=requestAnimationFrame(tick);
}
play.addEventListener("click",()=>{if(playing){stop();return}if((!reversed&&Number(slider.value)>=100)||(reversed&&Number(slider.value)<=0))slider.value=reversed?"100":"0";position=Number(slider.value);playing=true;play.setAttribute("aria-pressed","true");play.textContent="Pausar";raf=requestAnimationFrame(tick)});
reverse.addEventListener("click",()=>{reversed=!reversed;reverse.setAttribute("aria-pressed",String(reversed))});
overlay.addEventListener("change",render);compare.addEventListener("change",render);
slider.addEventListener("input",()=>{stop();position=Number(slider.value);render()});
document.getElementById("stand").addEventListener("click",()=>{stop();slider.value=0;render()});
document.getElementById("fold").addEventListener("click",()=>{stop();slider.value=100;render()});
render();
})();
