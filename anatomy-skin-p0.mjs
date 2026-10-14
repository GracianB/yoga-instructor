/* P0 articulated vector skin for the side-view geometry.
 * Skin is derived from solved joints on every frame; no disjoint CSS transforms.
 * Pure SVG serialization. Nothing here affects the original yoga mascots.
 */
const xy=p=>Number(p.x.toFixed(2))+","+Number(p.y.toFixed(2));
const pair=p=>Number(p.x.toFixed(2))+" "+Number(p.y.toFixed(2));
const outline='#705d94';
function line(a,b,width,color,opacity=1){
 return '<path d="M'+pair(a)+' L'+pair(b)+'" fill="none" stroke="'+outline+'" stroke-width="'+(width+3)+'" stroke-linecap="round" opacity="'+opacity+'"/>'+
  '<path d="M'+pair(a)+' L'+pair(b)+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" opacity="'+opacity+'"/>';
}
const circle=(p,r,fill,stroke=outline)=>'<circle cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
function foot(a,toe,opacity){
 return '<g opacity="'+opacity+'">'+line(a,toe,15,'#9f88d4')+circle(toe,7,'#b7a3e2')+'</g>';
}
export function renderSkinnedAsana(pose,{showJoints=false}={}){
 if(!pose||!pose.joints||!pose.segments)throw new TypeError("Solved pose required");
 const j=pose.joints;
 const skin=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="Nila, '+
  (pose.progress===0?'Tadasana':pose.progress===1?'Uttanasana':'transición entre Tadasana y Uttanasana')+'">',
  '<defs><linearGradient id="bodygrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5c5f3"/><stop offset="1" stop-color="#a891dc"/></linearGradient>'+
  '<radialGradient id="headgrad"><stop stop-color="#efe5ff"/><stop offset="1" stop-color="#c1a9ec"/></radialGradient></defs>',
  '<path d="M45 460 H355" stroke="#c8b8ce" stroke-width="3" stroke-linecap="round"/>',
  '<ellipse cx="200" cy="468" rx="65" ry="5" fill="#cec0d6" opacity=".55"/>'
 ];
 // Far side first to preserve foreground contour. IK fixes both ankles.
 for(const [side,opacity] of [['left',.78],['right',1]]){
  const h=j[side+'Hip'],k=j[side+'Knee'],a=j[side+'Ankle'];
  const shoulder=j[side+'Shoulder'],elbow=j[side+'Elbow'],wrist=j[side+'Wrist'];
  skin.push('<g opacity="'+opacity+'">');
  skin.push(line(h,k,31,'#ae99db'));
  skin.push(circle(k,15,'#bca9e6'));
  skin.push(line(k,a,23,'#a48ed6'));
  skin.push(foot(a,j[side+'Toe'],1));
  skin.push(line(shoulder,elbow,23,'#b7a2e3'));
  skin.push(circle(elbow,12,'#c2adea'));
  skin.push(line(elbow,wrist,19,'#ae95df'));
  skin.push(circle(wrist,12,'#d1baf0'));
  skin.push('</g>');
 }
 skin.push(circle(j.hip,28,'#a890d5'));
 skin.push('<path d="M'+pair(j.hip)+' Q'+pair(j.lumbar)+' '+pair(j.shoulder)+'" fill="none" stroke="'+outline+'" stroke-width="79" stroke-linecap="round" stroke-linejoin="round"/>');
 skin.push('<path d="M'+pair(j.hip)+' Q'+pair(j.lumbar)+' '+pair(j.shoulder)+'" fill="none" stroke="url(#bodygrad)" stroke-width="74" stroke-linecap="round" stroke-linejoin="round"/>');
 skin.push('<path d="M'+pair(j.shoulder)+' L'+pair(j.neck)+'" fill="none" stroke="#bda6e6" stroke-width="22" stroke-linecap="round"/>');
 const angle=(pose.headAngle-Math.PI)*180/Math.PI;
 skin.push('<g transform="translate('+pair(j.head)+') rotate('+angle.toFixed(2)+')">');
 skin.push('<ellipse cx="-23" cy="-23" rx="13" ry="30" fill="#9a7bcb" stroke="'+outline+'" stroke-width="2"/>');
 skin.push('<ellipse cx="23" cy="-23" rx="13" ry="30" fill="#9a7bcb" stroke="'+outline+'" stroke-width="2"/>');
 skin.push('<circle cx="0" cy="0" r="31" fill="url(#headgrad)" stroke="'+outline+'" stroke-width="3"/>');
 skin.push('<path d="M-29 -4 Q-28 -37 0 -34 Q29 -37 30 -4 Q15 -13 11 -21 Q0 -10 -29 -4" fill="#8066ac"/>');
 skin.push('<ellipse cx="-12" cy="2" rx="4.5" ry="6" fill="#544266"/><ellipse cx="12" cy="2" rx="4.5" ry="6" fill="#544266"/>');
 skin.push('<path d="M-7 15 Q0 22 7 15" fill="none" stroke="#8a628b" stroke-width="2.4" stroke-linecap="round"/>');
 skin.push('</g>');
 // Expose actual IK joins when validating rigging.
 if(showJoints){
  skin.push('<g fill="#f5d78e" stroke="#715e91" stroke-width="1.5">');
  for(const name of ['hip','lumbar','shoulder','neck','head','leftHip','leftKnee','leftAnkle','leftElbow','leftWrist','rightHip','rightKnee','rightAnkle','rightElbow','rightWrist']){
   const v=j[name];skin.push('<circle data-joint="'+name+'" cx="'+v.x.toFixed(2)+'" cy="'+v.y.toFixed(2)+'" r="4"/>');
  }
  skin.push('</g>');
 }
 skin.push('</svg>');
 return skin.join('');
}
