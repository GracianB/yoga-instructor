/* Laboratory-only renderer; no dependency on the production studio. */
(()=>{
"use strict";
const rig=window.YOGA_ARTICULATED_RIG,solver=window.YOGA_RIG_CONSTRAINTS;
const svg=document.getElementById("stage"),slider=document.getElementById("progress"),status=document.getElementById("status");
const NS="http://www.w3.org/2000/svg";
const links=rig.links.map(()=>{const node=document.createElementNS(NS,"line");svg.append(node);return node});
const dots=rig.names.map(()=>{const node=document.createElementNS(NS,"circle");node.setAttribute("r","6");svg.append(node);return node});
const sets=(n,attrs)=>Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));
function render(){
 const t=Number(slider.value)/100;
 const result=solver.solve(rig.standing,rig.interpolate(rig.standing,rig.fold,t),{iterations:150,tolerance:.75});
 for(let i=0;i<rig.links.length;i++){const [a,b]=rig.links[i];const A=result.joints[a],B=result.joints[b];sets(links[i],{x1:A[0],y1:A[1],x2:B[0],y2:B[1]})}
 for(let i=0;i<rig.names.length;i++){const A=result.joints[rig.names[i]];sets(dots[i],{cx:A[0],cy:A[1]})}
 document.getElementById("value").textContent=Math.round(t*100)+"%";
 status.textContent="Error máximo de segmento: "+result.maxError.toFixed(2)+" px · "+(result.converged?"Convergente":"Requiere revisión");
 document.getElementById("stand").setAttribute("aria-pressed",String(t===0));
 document.getElementById("fold").setAttribute("aria-pressed",String(t===1));
}
slider.addEventListener("input",render);
document.getElementById("stand").addEventListener("click",()=>{slider.value=0;render()});
document.getElementById("fold").addEventListener("click",()=>{slider.value=100;render()});
render();
})();
