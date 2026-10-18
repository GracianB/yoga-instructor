/* Anatomical diagnostics, independent from the SVG renderer and practice clock. */
(function(root){
"use strict";
const finite=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const angle=(a,b,c)=>{
 if(!finite(a)||!finite(b)||!finite(c))throw TypeError("Three valid points required");
 const u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];
 const d=Math.hypot(...u)*Math.hypot(...v);
 if(d<1e-9)return null;
 return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/d)))*180/Math.PI;
};
function inspect(p,kinematics){
 if(!p||!kinematics?.support||!kinematics?.curve)throw TypeError("Pose and kinematics required");
 const supports=kinematics.support(p);
 const legs=p.legs.map(path=>kinematics.curve(path));
 const arms=p.arms.map(path=>kinematics.curve(path));
 const knees=legs.map(l=>angle(l.start,l.joint,l.end));
 const elbows=arms.map(l=>angle(l.start,l.joint,l.end));
 const spread=Math.max(...p.feet.map(x=>x[0]))-Math.min(...p.feet.map(x=>x[0]));
 const findings=[];
 if(knees.some(x=>x===null))findings.push("degenerate-knee");
 if(elbows.some(x=>x===null))findings.push("degenerate-elbow");
 if(p.kind==="mountain"){
  if(supports.feet.filter(f=>f.grounded).length!==2)findings.push("mountain-requires-two-feet");
  if(spread<1)findings.push("feet-overlap");
 }
 if(p.kind==="forward"||p.kind==="fold"){
  if(supports.feet.filter(f=>f.grounded).length<2)findings.push("fold-support-review");
 }
 return Object.freeze({id:p.id,kind:p.kind,knees:Object.freeze(knees),
  elbows:Object.freeze(elbows),grounded:Object.freeze(supports.load.map(x=>x.kind+":"+x.index)),
  footSpan:spread,findings:Object.freeze(findings)});
}
const api=Object.freeze({angle,distance,inspect});
if(root)root.YOGA_ANATOMY_DIAGNOSTICS=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
