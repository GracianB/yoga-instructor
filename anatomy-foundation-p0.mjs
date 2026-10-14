/* P0 · 2D articulated side-view foundation. No DOM, timers or hidden poses.
 * Coordinates: SVG viewBox 0 0 400 500; ground y=460.
 * Mathematical rig, not a final mesh-skinned character or yoga instruction.
 */
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const pt=(x,y)=>({x,y});
const mix=(a,b,t)=>a+(b-a)*t;
const move=(origin,length,angle)=>pt(origin.x+length*Math.sin(angle),origin.y+length*Math.cos(angle));
const mixPoint=(a,b,t)=>pt(mix(a.x,b.x,t),mix(a.y,b.y,t));
const angleMix=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
const EARTH=460;
const ASANAS=Object.freeze({
 tadasana:{hip:pt(200,241),lumbar:Math.PI,thorax:Math.PI,arm:0.03},
 uttanasana:{hip:pt(184,245),lumbar:1.1,thorax:0.1,arm:0.03}
});
/* Two-segment planar IK with fixed bone lengths and fixed ankle target.
 * Bend toward the front (+x) on this side-view coordinate system.
 */
export function solveLeg(hip,ankle,{thigh=112,shin=111}={}){
 if(!(thigh>0&&shin>0))throw new RangeError("Bone length must be positive");
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y,original=Math.hypot(dx,dy);
 if(original<1e-6)throw new RangeError("Leg target coincides with hip");
 const d=clamp(original,Math.abs(thigh-shin)+.0001,thigh+shin-.0001);
 const ux=dx/original,uy=dy/original;
 const advance=(thigh*thigh-shin*shin+d*d)/(2*d);
 const offset=Math.sqrt(Math.max(0,thigh*thigh-advance*advance));
 const knee=pt(hip.x+ux*advance+uy*offset,hip.y+uy*advance-ux*offset);
 return {hip,knee,ankle,thigh,shin,requestedDistance:original,reachable:original<=thigh+shin&&original>=Math.abs(thigh-shin)};
}
export function solveAsana(id,{progress=1,kneeBend=0}={}){
 const target=ASANAS[id];
 if(!target)throw new RangeError("Unknown asana: "+id);
 const t=clamp(Number.isFinite(progress)?progress:0,0,1);
 const bend=clamp(Number.isFinite(kneeBend)?kneeBend:0,0,1);
 const from=ASANAS.tadasana;
 const hip=mixPoint(from.hip,target.hip,t);
 hip.y+=28*bend; // Lower the centre of mass; knees flex without changing bone lengths.
 // A real forward fold needs pelvic rotation plus a continuous lumbar/toracic chain.
 const lumbarAngle=angleMix(from.lumbar,target.lumbar,t);
 const thoraxAngle=angleMix(from.thorax,target.thorax,t);
 const lumbar=move(hip,45,lumbarAngle);
 const shoulder=move(lumbar,63,thoraxAngle);
 const neck=move(shoulder,19,thoraxAngle);
 const head=move(neck,21,thoraxAngle);
 const armAngle=angleMix(from.arm,target.arm,t);
 const joints={hip,lumbar,shoulder,neck,head};
 const segments=[["hip","lumbar"],["lumbar","shoulder"],["shoulder","neck"],["neck","head"]];
 for(const [side,shift] of [["left",-9],["right",9]]){
  const name=side[0].toUpperCase()+side.slice(1);
  const sideHip=pt(hip.x+shift,hip.y);
  const sideShoulder=pt(shoulder.x+shift*1.3,shoulder.y);
  const elbow=move(sideShoulder,53,armAngle);
  const wrist=move(elbow,55,armAngle);
  const ankle=pt(200+shift,EARTH);
  const {knee,reachable}=solveLeg(sideHip,ankle);
  const toe=pt(ankle.x+25,EARTH);
  joints[side+"Hip"]=sideHip;
  joints[side+"Shoulder"]=sideShoulder;
  joints[side+"Elbow"]=elbow;
  joints[side+"Wrist"]=wrist;
  joints[side+"Knee"]=knee;
  joints[side+"Ankle"]=ankle;
  joints[side+"Toe"]=toe;
  if(!reachable)throw new RangeError("Leg target unreachable: "+side);
  segments.push(["hip",side+"Hip"],["shoulder",side+"Shoulder"],
   [side+"Shoulder",side+"Elbow"],[side+"Elbow",side+"Wrist"],
   [side+"Hip",side+"Knee"],[side+"Knee",side+"Ankle"],
   [side+"Ankle",side+"Toe"]);
 }
 // Legacy single-side aliases are retained for existing first-phase tests.
 Object.assign(joints,{elbow:joints.rightElbow,wrist:joints.rightWrist,
  knee:joints.rightKnee,ankle:joints.rightAnkle,toe:joints.rightToe});
 for(const [name,v] of Object.entries(joints))if(!Number.isFinite(v.x)||!Number.isFinite(v.y))throw new Error("Invalid joint "+name);
 return {id,progress:t,joints,segments,floor:EARTH,headAngle:thoraxAngle,anatomicalStatus:"side-view prototype"};
}
export function svgSkeleton(pose){
 const {joints,segments}=pose;
 const line=([a,b])=>'<line x1="'+joints[a].x.toFixed(3)+'" y1="'+joints[a].y.toFixed(3)+'" x2="'+joints[b].x.toFixed(3)+'" y2="'+joints[b].y.toFixed(3)+'"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="'+pose.id+'"><g fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">'+segments.map(line).join("")+'</g><circle cx="'+joints.head.x.toFixed(3)+'" cy="'+joints.head.y.toFixed(3)+'" r="17" fill="currentColor"/></svg>';
}
