/* P0 anatomy foundation: pure geometry, no DOM or timers.
 * Coordinates: SVG viewBox 0 0 400 500; floor y=460.
 * Angles in radians. Pose interpolation preserves joint connectivity.
 */
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const point=(x,y)=>({x,y});
const segment=(origin,length,angle)=>point(origin.x+length*Math.sin(angle),origin.y+length*Math.cos(angle));
const mix=(a,b,t)=>a+(b-a)*t;
const mixPoint=(a,b,t)=>point(mix(a.x,b.x,t),mix(a.y,b.y,t));
const targets={
 tadasana:{hip:point(200,255),trunk:-Math.PI,neck:-Math.PI,arm:0.05,knee:0.015},
 uttanasana:{hip:point(200,255),trunk:Math.PI/2,neck:Math.PI/2+0.18,arm:0,knee:0.12}
};
/** A forward fold rotates around the hip, not around the neck.
 * Knee flexion and foot position are explicitly modelled.
 * Arms hang from shoulders as gravity-facing segments.
 */
export function solveAsana(id,{progress=1,kneeBend=0}={}){
 if(!targets[id])throw new RangeError("Unknown asana: "+id);
 const t=clamp(progress,0,1),p=targets.tadasana,q=targets[id];
 const hip=mixPoint(p.hip,q.hip,t);
 const torsoAngle=mix(p.trunk,q.trunk,t);
 const kneeAngle=clamp(mix(p.knee,q.knee,t)+kneeBend,0,0.7);
 const shoulder=segment(hip,108,torsoAngle);
 const neck=segment(shoulder,19,torsoAngle);
 const head=segment(neck,21,torsoAngle);
 const elbow=segment(shoulder,67,mix(p.arm,q.arm,t));
 const wrist=segment(elbow,62,mix(p.arm,q.arm,t));
 const knee=point(hip.x+Math.sin(kneeAngle)*12,hip.y+92);
 const ankle=point(knee.x-Math.sin(kneeAngle)*18,460);
 const toe=point(ankle.x+24,460);
 const joints={hip,shoulder,neck,head,elbow,wrist,knee,ankle,toe};
 for(const [name,v] of Object.entries(joints))if(!Number.isFinite(v.x)||!Number.isFinite(v.y))throw new Error("Invalid joint "+name);
 return {id,progress:t,joints,segments:[["hip","shoulder"],["shoulder","neck"],["neck","head"],["shoulder","elbow"],["elbow","wrist"],["hip","knee"],["knee","ankle"],["ankle","toe"]]};
}
export function svgSkeleton(pose){
 const {joints,segments}=pose;
 const line=([a,b])=>'<line x1="'+joints[a].x+'" y1="'+joints[a].y+'" x2="'+joints[b].x+'" y2="'+joints[b].y+'"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="'+pose.id+'"><g fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">'+segments.map(line).join("")+'</g><circle cx="'+joints.head.x+'" cy="'+joints.head.y+'" r="17" fill="currentColor"/></svg>';
}
