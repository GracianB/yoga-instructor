/* V84 · One support-and-joint model for the shared Nila vector renderer.
 * Authored coordinates are the source of truth. This module never animates. */
(function(global){
"use strict";
const bounded=n=>Number.isFinite(n)&&n>=0&&n<=720;
function curve(curveText){
 const values=(String(curveText).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
 if(values.length!==6&&values.length!==10)throw new RangeError("A limb needs one or two quadratic segments");
 const start=[values[0],values[1]],end=values.slice(-2);
 const joint=values.length===10?[values[4],values[5]]:[
   (values[0]+2*values[2]+values[4])/4,
   (values[1]+2*values[3]+values[5])/4
 ];
 if(![...start,...end,...joint].every(bounded))throw new RangeError("Anatomical waypoint outside viewBox");
 return Object.freeze({start:Object.freeze(start),end:Object.freeze(end),joint:Object.freeze(joint)});
}
function support(p){
 if(!p||!Array.isArray(p.hands)||!Array.isArray(p.feet))throw new TypeError("Asana shape required");
 const palms=p.hands.map((xy,i)=>({kind:"hand",index:i,x:xy[0],y:xy[1]}));
 const soles=p.feet.map((xy,i)=>({kind:"foot",index:i,x:xy[0],y:xy[1]}));
 let load=[];
 if(["downward","table","child"].includes(p.kind))load=palms.concat(soles);
 else if(p.kind==="tree")load=soles.slice(0,1);
 else if(["rest","savasana"].includes(p.kind))load=palms.concat(soles);
 else load=soles;
 if(!load.every(item=>bounded(item.x)&&bounded(item.y)))throw new RangeError("Support outside mat");
 const xs=load.map(a=>a.x),ys=load.map(a=>a.y);
 const feet=soles.map(x=>Object.freeze({kind:x.kind,index:x.index,x:x.x,y:x.y,grounded:load.some(a=>a.kind==="foot"&&a.index===x.index)}));
 const hands=palms.map(x=>Object.freeze({kind:x.kind,index:x.index,x:x.x,y:x.y,grounded:load.some(a=>a.kind==="hand"&&a.index===x.index)}));
 return Object.freeze({
  id:p.id,load:Object.freeze(load.map(a=>Object.freeze(a))),
  hands:Object.freeze(hands),feet:Object.freeze(feet),
  floor:Object.freeze({minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)}),
  joints:Object.freeze({
   elbows:Object.freeze(p.arms.map(s=>curve(s).joint)),
   knees:Object.freeze(p.legs.map(s=>curve(s).joint))
  })
 });
}
const api=Object.freeze({curve,support});
if(global)global.YOGA_NILA_KINEMATICS_V84=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
