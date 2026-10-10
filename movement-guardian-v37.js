/* V37–V40 · NILA, a new agile guardian for Movement only.
 * Artwork is pose-authored using the existing ten anatomical waypoints.
 * The Flow engine and legacy regression art remain intact but unseen.
 * No timers, observers or parallel pose state machines. */
(() => {
  "use strict";
  const root=document.getElementById("flow-guide");
  const svg=root?.querySelector("svg.yy-svg");
  const art=window.YIN_YANG_ART;
  if(!root||!svg||!art||svg.querySelector(".movement-guardian"))return;
  const esc=n=>Number(n).toFixed(1);
  const point=(x,y)=>esc(x)+" "+esc(y);
  const bodyPath=(p)=>{
    const [x,y,rx,ry]=p.body;
    // All four contour quadrants share tangents; no overlapping ovals or hip stickers.
    return [
      "M",point(x-rx*.92,y-ry*.29),
      "C",point(x-rx*.98,y-ry*.78),point(x-rx*.50,y-ry*1.07),point(x-rx*.02,y-ry*.95),
      "C",point(x+rx*.58,y-ry*1.08),point(x+rx*.98,y-ry*.66),point(x+rx*.90,y-ry*.21),
      "C",point(x+rx*1.03,y+ry*.31),point(x+rx*.61,y+ry*.91),point(x+rx*.07,y+ry*.91),
      "C",point(x-rx*.58,y+ry*.88),point(x-rx*1.00,y+ry*.30),point(x-rx*.92,y-ry*.29),"Z"
    ].join(" ");
  };
  const paw=(xy,kind,index)=>{
    const [x,y]=xy,vertical=kind==="foot";
    return '<g class="mg-paw mg-'+kind+'" data-contact="'+kind+'-'+index+
      '" transform="translate('+esc(x)+' '+esc(y)+')">'+
      '<path d="M-20 -8 Q-9 -18 5 -12 Q20 -8 19 5 Q14 15 -3 14 Q-21 14 -20 -8Z" class="mg-paw-shell"/>'+
      '<path d="M-10 4 Q-3 9 3 4 M4 2 Q10 7 14 1" class="mg-paw-toes"/>'+
      (vertical?'<path d="M-11 -8Q-5 -12 1 -9" class="mg-paw-shine"/>':'')+'</g>';
  };
  // V47: every shoulder, elbow, hip and knee is derived from the SAME
  // quadratic centreline as its paw. No separately positioned joint stickers.
  const curveSections=curve=>{
    const n=(curve.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    if(n.length!==6&&n.length!==10)throw Error("Invalid Nila limb: "+curve);
    const a=[n.slice(0,6)];
    if(n.length===10)a.push([n[4],n[5],n[6],n[7],n[8],n[9]]);
    return a;
  };
  const sample=(section,t)=>{
    const [x0,y0,cx,cy,x1,y1]=section,u=1-t;
    return {
      x:u*u*x0+2*u*t*cx+t*t*x1,
      y:u*u*y0+2*u*t*cy+t*t*y1,
      dx:2*u*(cx-x0)+2*t*(x1-cx),
      dy:2*u*(cy-y0)+2*t*(y1-cy)
    };
  };
  // V54: tapered muscular silhouettes replace parallel-width "hose" limbs.
  // Normals are evaluated on the same authored curves as paws and joints.
  const limbVolume=(sections,type)=>{
    const count=sections.length*18,left=[],right=[];
    for(let i=0;i<=count;i++){
      const seg=Math.min(sections.length-1,Math.floor(i/18));
      const t=seg===sections.length-1?Math.min(1,(i-seg*18)/18):(i%18)/18;
      const pos=sample(sections[seg],t);
      const u=i/count;
      const base=type==="leg"?27:23;
      // V59: organic volume instead of a straight truncated tube.
      // Keep both endpoints broad enough to meet torso and paws; gently
      // widen the muscle belly, then narrow towards the wrist/ankle.
      const muscle=Math.sin(Math.PI*u)**2;
      const taper=1-.29*u+.13*muscle;
      const width=base*taper;
      // Average adjoining tangent vectors at the segment seam.
      // This avoids a sharp normal flip (visible as a kinked elbow).
      let dx=pos.dx,dy=pos.dy;
      if(sections.length>1 && u>.41 && u<.59){
        const a=sample(sections[0],1),b=sample(sections[1],0);
        const v=(u-.41)/.18;
        const blend=v*v*(3-2*v);
        // Smooth tangent rotation through the anatomical joint while
        // keeping the actual Bézier centerline and both endpoints fixed.
        dx=a.dx*(1-blend)+b.dx*blend;
        dy=a.dy*(1-blend)+b.dy*blend;
      }
      const tangentMag=Math.max(.001,Math.hypot(dx,dy));
      const nx=-dy/tangentMag,ny=dx/tangentMag;
      left.push(point(pos.x+nx*width,pos.y+ny*width));
      right.push(point(pos.x-nx*width,pos.y-ny*width));
    }
    return "M"+left.join(" L")+" L"+right.reverse().join(" L")+"Z";
  };
  const limb=(curve,type,index)=>{
    const sections=curveSections(curve);
    const root=sample(sections[0],0),hinge=sections.length>1?
      sample(sections[0],1):sample(sections[0],.54);
    const degree=Math.atan2(hinge.dy,hinge.dx)*180/Math.PI;
    const wide=type==="leg"?22:19;
    // These overlapping membranes bridge the visible hinge and root,
    // while the uninterrupted limb silhouette preserves grounded contacts.
    const joint='<g class="mg-hinge mg-'+(type==="arm"?"elbow":"knee")+
      '" data-joint="'+type+'-'+index+'" transform="translate('+
      point(hinge.x,hinge.y)+') rotate('+esc(degree)+')">'+
      '<path class="mg-hinge-shell" d="M-'+wide+' -9 Q-13 -18 1 -16 Q'+wide+
      ' -12 '+wide+' 0 Q'+(wide-5)+' 13 0 16 Q-'+wide+' 11 -'+wide+' -9Z"/>'+
      '<path class="mg-hinge-crease" d="M-10 4Q0 10 11 4"/>'+
      '</g>';
    const socket='<g class="mg-socket mg-'+(type==="arm"?"shoulder":"hip")+
      '" data-socket="'+type+'-'+index+'" transform="translate('+
      point(root.x,root.y)+') rotate('+
      esc(Math.atan2(root.dy,root.dx)*180/Math.PI)+')">'+
      '<path class="mg-socket-shape" d="M-25 -16Q-8 -29 14 -17Q29 -3 16 17Q-7 25 -25 13Q-31 2 -25 -16Z"/>'+
      '<path class="mg-socket-light" d="M-13 -13Q0 -20 12 -10"/>'+
      '</g>';
    return '<g class="mg-limb mg-'+type+'" data-mg-limb="'+type+'-'+index+'">'+
      '<path class="mg-limb-volume" d="'+limbVolume(sections,type)+'"/>'+
      '<path class="mg-limb-shell" d="'+curve+'"/>'+
      '<path class="mg-limb-plane" d="'+curve+'"/>'+
      socket+joint+'</g>';
  };
  // V54: Nila is a DRAGON, not a woolly lamb: crest, swept horns, angular
  // temple fins, almond eyes, long muzzle and a distinct chin silhouette.
  const head=(p)=>{
    const [x,y,scale,angle,expression]=p.head;
    const awake=["open","focus","smile"].includes(expression);
    const eyes=awake
      ?'<path class="mg-eye" d="M-51 -10Q-37 -23 -18 -11Q-33 0 -51 -10Z M17 -11Q35 -23 52 -10Q35 0 17 -11Z"/>'+
        '<path class="mg-pupil" d="M-36-15Q-30-11-35-5M35-15Q40-11 35-5"/>'
      :'<path class="mg-eye" d="M-53 -11Q-36 -2 -20 -13 M18 -13Q35 -2 52 -11"/>';
    return '<g class="mg-head" transform="translate('+esc(x)+' '+esc(y)+') rotate('+esc(angle)+') scale('+esc(scale)+')">'+
      // Horns sweep backwards. Short side fins make a recognizable draconic profile.
      '<path class="mg-horn mg-horn-left" d="M-37-50Q-66-76-66-110Q-40-91-18-70Z"/>'+
      '<path class="mg-horn mg-horn-right" d="M34-51Q62-75 70-113Q73-80 54-58Z"/>'+
      '<path class="mg-horn-shine" d="M-57-99Q-48-75-34-67M62-99Q53-77 44-67"/>'+
      '<path class="mg-ear" d="M-54-29Q-78-47-91-62Q-89-35-68-13Z"/>'+
      '<path class="mg-ear" d="M53-29Q79-47 91-62Q89-35 67-13Z"/>'+
      '<path class="mg-ear-mark" d="M-78-47Q-72-35-62-29M79-47Q72-35 62-29"/>'+
      '<path class="mg-crest" d="M-25-57Q-18-82-3-93L3-71Q22-92 34-65L29-45Z"/>'+
      '<path class="mg-face" d="M-60-37Q-53-65-19-70Q10-78 40-60Q70-46 67-15Q76 15 55 42Q41 64 14 73Q-13 76-42 55Q-68 35-68 4Q-72-20-60-37Z"/>'+
      '<path class="mg-face-glaze" d="M-48-40Q-36-57-15-54M28-57Q47-45 51-32"/>'+
      '<path class="mg-cheek-fin" d="M-58 13Q-86 16-91 37Q-72 34-56 28 M58 13Q84 16 90 37Q71 34 55 29"/>'+
      '<path class="mg-snout" d="M-47 21Q-33 12-10 23Q0 30 10 23Q31 10 47 21Q52 50 24 62Q3 74-20 63Q-50 53-47 21Z"/>'+
      '<path class="mg-muzzle-ridge" d="M-32 28Q-9 36 7 31Q28 24 37 29"/>'+
      eyes+
      '<path class="mg-nose" d="M-12 43Q-2 46 11 42Q7 52-2 52Q-10 50-12 43Z"/>'+
      '<path class="mg-mouth" d="'+(expression==="smile"?'M-18 56Q1 72 21 55':'M-16 57Q1 63 17 56')+'"/>'+
      '<path class="mg-chin" d="M-19 63Q0 78 20 63Q8 83-1 85Q-11 79-19 63Z"/>'+
      '<path class="mg-cheek" d="M-56 26Q-47 32-39 27 M40 27Q48 32 56 26"/>'+
      '</g>';
  };
  const trunk=(p)=>{
    const [x,y,rx,ry,r]=p.body;
    return '<g class="mg-torso" data-pose-kind="'+p.kind+'" transform="rotate('+esc(r)+' '+esc(x)+' '+esc(y)+')">'+
      '<path class="mg-body" d="'+bodyPath(p)+'"/>'+
      '<path class="mg-body-light" d="M'+point(x-rx*.53,y-ry*.30)+' Q'+point(x-rx*.37,y-ry*.72)+' '+point(x+rx*.18,y-ry*.72)+'"/>'+
      '<path class="mg-breath-plane" d="M'+point(x-rx*.40,y+ry*.13)+' Q'+point(x,y+ry*.71)+' '+point(x+rx*.40,y+ry*.13)+' Q'+point(x,y+ry*.38)+' '+point(x-rx*.40,y+ry*.13)+'Z"/>'+
      '</g>';
  };
  const neck=(p)=>{
    const [hx,hy,scale,angle]=p.head;
    const [x,y,rx,ry]=p.body;
    const lateral=Math.abs(angle)>35||Math.abs(x-hx)>85;
    const topX=lateral?x-rx*.63:x;
    const topY=lateral?y-ry*.18:y-ry*.75;
    const endX=lateral?hx+46*scale:hx;
    const endY=lateral?hy+12*scale:hy+54*scale;
    const dx=endX-topX,dy=endY-topY;
    // V60: curved cervical bridge follows the pose angle instead of
    // a rigid straight tube; preserve authored head and torso endpoints.
    const bend=Math.min(22,Math.abs(dx)*.12+9);
    const c1x=topX+dx*.28,c1y=topY+dy*.24-bend;
    const c2x=topX+dx*.74,c2y=topY+dy*.77-bend*.35;
    return '<path class="mg-neck" d="M'+point(topX,topY)+' C'+point(c1x,c1y)+' '+point(c2x,c2y)+' '+point(endX,endY)+'"/>';
  };
  const tail=(p)=>{
    const [x,y,rx,ry]=p.body;
    const [tx,ty,s]=p.tail;
    const sx=x+rx*.65,sy=y+ry*.31;
    const ex=Math.min(648,tx+112*s),ey=ty+67*s;
    const outline='M'+point(sx,sy)+' C'+point(tx+rx*.40,ty+20)+' '+point(ex+17,ty-34)+' '+point(ex,ey);
    return '<g class="mg-tail"><path class="mg-tail-shell" d="'+outline+'"/>'+
      '<path class="mg-tail-stripe" d="'+outline+'"/>'+
      '<path class="mg-tail-leaf" d="M'+point(ex-8,ey-16)+' Q'+point(ex+16,ey-43)+' '+point(ex+29,ey-8)+' Q'+point(ex+13,ey+12)+' '+point(ex-8,ey-16)+'Z"/></g>';
  };
  const shadows=p=>{
    const contacts=p.kind==="table"||p.kind==="child"||p.kind==="savasana"||p.kind==="rest"?
      p.hands.concat(p.feet):p.kind==="tree"?p.feet.slice(0,1):p.feet;
    return '<g class="mg-contact-shadows">'+contacts.map(([x,y])=>
      '<ellipse cx="'+esc(x)+'" cy="'+esc(y+15)+'" rx="28" ry="7" class="mg-shadow"/>').join("")+'</g>';
  };
  const drawing=p=>{
    const legs=p.legs.map((d,i)=>limb(d,"leg",i)).join("");
    const arms=p.arms.map((d,i)=>limb(d,"arm",i)).join("");
    const feet=p.feet.map((pt,i)=>paw(pt,"foot",i)).join("");
    const hands=p.hands.map((pt,i)=>paw(pt,"hand",i)).join("");
    // V56: arm roots live BEHIND the same torso that joins the hip sockets.
    // Previously the entire shoulder socket sat over the chest like a sticker.
    // Only the hands and a soft joining-gesture forearm pass in FRONT.
    const joined=p.kind==="finish";
    const front=joined?'<g class="mg-gesture-forearms">'+
      p.arms.map(d=>'<path class="mg-gesture-forearm" d="'+d+'"/>').join("")+'</g>':"";
    return '<g class="movement-guardian" data-guardian="nila" data-kind="'+p.kind+'" aria-hidden="true">'+
       shadows(p)+tail(p)+
       '<g class="mg-legs">'+legs+feet+'</g>'+
       '<g class="mg-arms mg-arms-behind">'+arms+'</g>'+
       neck(p)+trunk(p)+
       front+'<g class="mg-hands">'+hands+'</g>'+
       head(p)+'</g>';
  };
  // V53: the three optional asanas use exactly the same anatomical renderer.
  // A single drawing function eliminates the second, visually unrelated dragon.
  window.YOGA_MOVEMENT_GUARDIAN=Object.freeze({drawPose:drawing});
  for(const p of art.poses){
    const node=svg.querySelector('.yy-pose[data-pose="'+p.id+'"] .yy-character');
    if(node)node.insertAdjacentHTML("beforeend",drawing(p));
  }
  root.dataset.movementGuardian="nila";
})();
