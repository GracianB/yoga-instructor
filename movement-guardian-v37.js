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
    // V83: A sculpted inverted-V torso joins shoulders to an elevated pelvis.
    if(p.kind==="downward")return "M274 264 C300 242 341 183 418 183 C451 184 466 218 461 239 C442 248 431 236 409 229 C360 220 344 282 290 284 Z";
    // All four contour quadrants share tangents; no overlapping ovals or hip stickers.
    return [
      "M",point(x-rx*.92,y-ry*.29),
      "C",point(x-rx*.98,y-ry*.78),point(x-rx*.50,y-ry*1.07),point(x-rx*.02,y-ry*.95),
      "C",point(x+rx*.58,y-ry*1.08),point(x+rx*.98,y-ry*.66),point(x+rx*.90,y-ry*.21),
      "C",point(x+rx*1.03,y+ry*.31),point(x+rx*.61,y+ry*.91),point(x+rx*.07,y+ry*.91),
      "C",point(x-rx*.58,y+ry*.88),point(x-rx*1.00,y+ry*.30),point(x-rx*.92,y-ry*.29),"Z"
    ].join(" ");
  };
  // V71: limbs and paws share an authored terminal tangent. A palm
  // should follow an elevated arm, while weight-bearing contacts stay
  // flat on the mat. Prayer palms have a recognizable joined silhouette.
  const paw=(xy,kind,index,curve,atHeart)=>{
    const [x,y]=xy,vertical=kind==="foot";
    const parts=curveSections(curve);
    const tip=sample(parts[parts.length-1],.985);
    const degrees=Math.atan2(tip.dy,tip.dx)*180/Math.PI;
    const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
    const orientation=atHeart?(index===0?-18:18):
      vertical&&y<350?-27:vertical||y>=346?0:clamp(degrees,-66,66);
    const palm=atHeart
      ?'M-12 -12 Q-9 -24 1 -20 Q15 -16 16 -2 Q17 13 4 17 Q-11 17 -15 6 Q-17 -6 -12 -12Z'
      :vertical
        ?'M-24 -8 Q-13 -20 3 -15 Q22 -11 26 4 Q26 17 9 17 Q-13 18 -24 8Z'
        :'M-18 -10 Q-7 -20 7 -13 Q20 -7 18 7 Q11 18 -5 16 Q-19 13 -18 -10Z';
    const crease=atHeart
      ?'M-6 -5Q0 0 7 -5 M-6 3Q0 8 7 3'
      :vertical
        ?'M-16 4Q-10 9 -4 5 M1 7Q6 12 11 6 M15 4Q19 7 21 3'
        :'M-12 1Q-8 7 -4 2 M0 5Q4 10 8 4 M11 2Q14 6 16 2';
    return '<g class="mg-paw mg-'+kind+(atHeart?' mg-prayer-palm':'')+
      '" data-contact="'+kind+'-'+index+
      '" transform="translate('+esc(x)+' '+esc(y)+') rotate('+esc(orientation)+')">'+
      '<path d="'+palm+'" class="mg-paw-shell"/>'+
      '<path d="'+crease+'" class="mg-paw-toes"/>'+
      '<path d="M-10 -2Q-7 -6 -3 -6" class="mg-wrist-crease"/>'+
      (vertical?'<path d="M-12 -8Q-3 -12 6 -8" class="mg-paw-shine"/>':'')+'</g>';
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
  // P0: every limb has a real, stable joint on its OWN centreline.
  // A one-curve pose is split mathematically (de Casteljau), not redrawn:
  // the exact silhouette and the original hand/foot anchors are preserved.
  // Author-specified two-curve joints remain precisely where authored.
  const jointSections=sections=>{
    if(sections.length===2)return sections;
    const [x0,y0,cx,cy,x1,y1]=sections[0],t=.54,u=1-t;
    const ax=u*x0+t*cx,ay=u*y0+t*cy;
    const bx=u*cx+t*x1,by=u*cy+t*y1;
    const mx=u*ax+t*bx,my=u*ay+t*by;
    return [[x0,y0,ax,ay,mx,my],[mx,my,bx,by,x1,y1]];
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
    const original=curveSections(curve);
    const sections=jointSections(original);
    const root=sample(sections[0],0),hinge=sample(sections[0],1);
    const degree=Math.atan2(hinge.dy,hinge.dx)*180/Math.PI;
    const before=sample(sections[0],.25),after=sample(sections[1],.75);
    const turn=Math.atan2(before.dx*after.dy-before.dy*after.dx,
      before.dx*after.dx+before.dy*after.dy)*180/Math.PI;
    const flex=Math.abs(turn);
    const wide=type==="leg"?22:19;
    // These overlapping membranes bridge the visible hinge and root,
    // while the uninterrupted limb silhouette preserves grounded contacts.
    const joint='<g class="mg-hinge mg-'+(type==="arm"?"elbow":"knee")+
      '" data-joint="'+type+'-'+index+
      '" data-rig-source="'+(original.length===2?'authored':'derived')+
      '" data-flex-deg="'+esc(flex)+'" transform="translate('+
      point(hinge.x,hinge.y)+') rotate('+esc(degree)+')">'+
      '<path class="mg-hinge-shell" d="M-'+wide+' -9 Q-13 -18 1 -16 Q'+wide+
      ' -12 '+wide+' 0 Q'+(wide-5)+' 13 0 16 Q-'+wide+' 11 -'+wide+' -9Z"/>'+
      (type==="leg"
        ?'<path class="mg-p0-kneecap" d="M-14 -12Q-1 -20 13 -12Q20 -1 12 11Q-1 19 -14 9Q-19 -1 -14 -12Z"/>'+
         '<path class="mg-p0-patella-light" d="M-9 -6Q-1 -11 8 -6"/>'
        :'<path class="mg-p0-elbow-fold" d="M-9 6Q1 12 10 5"/>')+
      '</g>';
    const socket='<g class="mg-socket mg-'+(type==="arm"?"shoulder":"hip")+
      '" data-socket="'+type+'-'+index+'" transform="translate('+
      point(root.x,root.y)+') rotate('+
      esc(Math.atan2(root.dy,root.dx)*180/Math.PI)+')">'+
      '<path class="mg-socket-shape" d="M-25 -16Q-8 -29 14 -17Q29 -3 16 17Q-7 25 -25 13Q-31 2 -25 -16Z"/>'+
      '<path class="mg-socket-light" d="M-13 -13Q0 -20 12 -10"/>'+
      '</g>';
    const ankle=type==="leg"?sample(sections[1],.80):null;
    const ankleMark=ankle?
      '<g class="mg-p0-ankle" data-ankle="'+index+'" transform="translate('+
      point(ankle.x,ankle.y)+') rotate('+
      esc(Math.atan2(ankle.dy,ankle.dx)*180/Math.PI)+')">'+
      '<path class="mg-p0-ankle-crease" d="M-9 5Q0 9 9 5"/></g>':"";
    return '<g class="mg-limb mg-'+type+'" data-mg-limb="'+type+'-'+index+'">'+
      '<path class="mg-limb-volume" d="'+limbVolume(sections,type)+'"/>'+
      '<path class="mg-limb-shell" d="'+curve+'"/>'+
      '<path class="mg-limb-plane" d="'+curve+'"/>'+
      socket+joint+ankleMark+'</g>';
  };
  // V54: Nila is a DRAGON, not a woolly lamb: crest, swept horns, angular
  // temple fins, almond eyes, long muzzle and a distinct chin silhouette.
  const head=(p)=>{
    const [x,y,scale,angle,expression]=p.head;
    const awake=["open","focus","smile"].includes(expression);
    // V62: pose-authored emotion, not an independent blinking timer.
    // Gentle brows communicate attention; a soft cheek lift reads as joy.
    const brows=expression==="focus"
      ?'<path class="mg-brow" d="M-52 -30Q-36 -39 -20 -30 M20 -30Q36 -39 52 -30"/>'
      :expression==="smile"
        ?'<path class="mg-brow" d="M-50 -32Q-35 -42 -20 -34 M20 -34Q35 -42 50 -32"/>'
        :'';
    // V66: eyes are expressive strokes, not almond masks and pupils.
    // The same paths rotate with the authored head in every asana.
    const eyes=awake
      ?'<path class="mg-eye mg-eye-line" d="'+
        (expression==="focus"
          ?'M-52 -10Q-37 -16 -23 -11 M23 -11Q37 -16 52 -10'
          :expression==="smile"
            ?'M-52 -12Q-37 1 -22 -12 M22 -12Q37 1 52 -12'
            :'M-52 -10Q-37 -4 -22 -10 M22 -10Q37 -4 52 -10')+'"/>'
      :'<path class="mg-eye mg-eye-line" d="M-52 -12Q-37 -2 -22 -12 M22 -12Q37 -2 52 -12"/>';
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
      '<path class="mg-forehead-mark" d="M-10 -48Q0 -55 10 -48"/>'+
      brows+
      '<path class="mg-cheek-fin" d="M-58 13Q-86 16-91 37Q-72 34-56 28 M58 13Q84 16 90 37Q71 34 55 29"/>'+
      '<path class="mg-snout" d="M-49 19Q-35 9-15 19Q-6 24 0 29Q6 24 15 19Q36 9 49 19Q61 43 39 60Q23 74 1 74Q-24 75-40 60Q-60 43-49 19Z"/>'+
      '<path class="mg-muzzle-ridge" d="M-36 27Q-17 37-1 34Q18 37 37 27"/>'+
      '<path class="mg-nasal-bridge" d="M-1 3Q-7 18 0 29"/>'+
      eyes+
      '<path class="mg-nose" d="M-12 43Q-2 46 11 42Q7 52-2 52Q-10 50-12 43Z"/>'+
      '<path class="mg-mouth" d="'+(expression==="smile"?'M-15 57Q1 66 17 56':'M-13 57Q1 61 15 57')+'"/>'+
      '<path class="mg-chin" d="M-19 63Q0 78 20 63Q8 83-1 85Q-11 79-19 63Z"/>'+
      '<path class="mg-cheek" d="M-56 26Q-47 32-39 27 M40 27Q48 32 56 26"/>'+
      '</g>';
  };
  const trunk=(p)=>{
    const [x,y,rx,ry,r]=p.body;
    const torsoAngle=p.kind==="downward"?0:r;
    return '<g class="mg-torso" data-pose-kind="'+p.kind+'" transform="rotate('+esc(torsoAngle)+' '+esc(x)+' '+esc(y)+')">'+
      '<path class="mg-body" d="'+bodyPath(p)+'"/>'+
      '<path class="mg-body-light" d="'+(p.kind==="downward"?
        "M318 246Q362 202 420 207":
        "M"+point(x-rx*.53,y-ry*.30)+" Q"+point(x-rx*.37,y-ry*.72)+" "+point(x+rx*.18,y-ry*.72))+'"/>'+
      '<path class="mg-breath-plane" d="M'+point(x-rx*.40,y+ry*.13)+' Q'+point(x,y+ry*.71)+' '+point(x+rx*.40,y+ry*.13)+' Q'+point(x,y+ry*.38)+' '+point(x-rx*.40,y+ry*.13)+'Z"/>'+
      '</g>';
  };
  // V63: one sculpted cervical silhouette, sampled from the existing
  // pose-authored cubic. No second moving neck or independent animation.
  const neck=(p)=>{
    const [hx,hy,scale,angle]=p.head;
    const [x,y,rx,ry]=p.body;
    const lateral=Math.abs(angle)>35||Math.abs(x-hx)>85;
    const topX=lateral?x-rx*.63:x;
    const topY=lateral?y-ry*.18:y-ry*.75;
    const endX=lateral?hx+46*scale:hx;
    const endY=lateral?hy+12*scale:hy+54*scale;
    const dx=endX-topX,dy=endY-topY;
    const bend=Math.min(22,Math.abs(dx)*.12+9);
    const c1x=topX+dx*.28,c1y=topY+dy*.24-bend;
    const c2x=topX+dx*.74,c2y=topY+dy*.77-bend*.35;
    const left=[],right=[];
    for(let i=0;i<=20;i++){
      const t=i/20,u=1-t;
      const cx=u*u*u*topX+3*u*u*t*c1x+3*u*t*t*c2x+t*t*t*endX;
      const cy=u*u*u*topY+3*u*u*t*c1y+3*u*t*t*c2y+t*t*t*endY;
      let tx=3*u*u*(c1x-topX)+6*u*t*(c2x-c1x)+3*t*t*(endX-c2x);
      let ty=3*u*u*(c1y-topY)+6*u*t*(c2y-c1y)+3*t*t*(endY-c2y);
      // A zero-length pose never turns a cervical cross-section into NaN.
      if(Math.hypot(tx,ty)<.001){tx=dx;ty=dy;}
      const len=Math.max(.001,Math.hypot(tx,ty));
      const radius=(28*(1-t)+27*scale*t)-4*Math.sin(Math.PI*t);
      const nx=-ty/len,ny=tx/len;
      left.push(point(cx+nx*radius,cy+ny*radius));
      right.push(point(cx-nx*radius,cy-ny*radius));
    }
    return '<path class="mg-neck" d="M'+left.join(' L')+' L'+right.reverse().join(' L')+'Z"/>';
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
    const contacts=p.kind==="table"||p.kind==="child"||p.kind==="downward"||p.kind==="savasana"||p.kind==="rest"?
      p.hands.concat(p.feet):p.kind==="tree"?p.feet.slice(0,1):p.feet;
    return '<g class="mg-contact-shadows">'+contacts.map(([x,y])=>
      '<ellipse cx="'+esc(x)+'" cy="'+esc(y+15)+'" rx="28" ry="7" class="mg-shadow"/>').join("")+'</g>';
  };
  const grounding=p=>{
    const engine=window.YOGA_NILA_KINEMATICS_V84;
    if(!engine)return "";
    const measured=engine.support(p);
    const floor=measured.floor;
    // Contacts are drawn in the same native 720x420 coordinate space as limbs.
    // Their position is derived from the actual palm/sole anchors, not CSS.
    const marks=measured.load.map(item=>
      '<g class="mg-ground-contact" data-ground="'+item.kind+'-'+item.index+
      '" transform="translate('+esc(item.x)+' '+esc(item.y)+')">'+
      '<ellipse class="mg-ground-outer" rx="32" ry="11"/>'+
      '<ellipse class="mg-ground-inner" rx="19" ry="6"/>'+
      '<circle class="mg-ground-pin" cx="0" cy="0" r="2.5"/></g>').join("");
    return '<g class="mg-grounding" aria-hidden="true">'+
      '<path class="mg-ground-line" d="M'+esc(floor.minX-24)+' '+esc(floor.maxY+13)+
      ' H'+esc(floor.maxX+24)+'"/>'+marks+'</g>';
  };
  // V102: pelvic web + underarm membranes, derived from authored body roots.
  const joins=p=>{
    const [x,y,rx,ry]=p.body;
    const horizontal=ry<60||p.kind==="downward";
    const cx=horizontal?x+rx*.54:x,cy=horizontal?y+ry*.20:y+ry*.67;
    const w=horizontal?rx*.44:rx*.68,h=horizontal?Math.max(25,ry*.60):Math.max(22,ry*.35);
    const pelvis='M'+point(cx-w,cy)+' Q'+point(cx-w*.95,cy-h)+
      ' '+point(cx,cy-h)+' Q'+point(cx+w*.95,cy-h)+
      ' '+point(cx+w,cy)+' Q'+point(cx+w*.86,cy+h)+
      ' '+point(cx,cy+h)+' Q'+point(cx-w*.86,cy+h)+
      ' '+point(cx-w,cy)+'Z';
    const underarms=p.arms.map((d,i)=>{
      const [sx,sy]=curveSections(d)[0];
      const tx=sx+(x-sx)*.58,ty=sy+(y-sy)*.58;
      const dx=x-sx,dy=y-sy,mag=Math.max(1,Math.hypot(dx,dy));
      const nx=-dy/mag,ny=dx/mag;
      const membrane='M'+point(sx+nx*23,sy+ny*23)+
        ' Q'+point(tx+nx*16,ty+ny*16)+' '+point(x,y)+
        ' Q'+point(tx-nx*16,ty-ny*16)+' '+point(sx-nx*23,sy-ny*23)+'Z';
      return '<path class="mg-v102-underarm" data-axilla="'+i+'" d="'+membrane+'"/>';
    }).join('');
    return {pelvis:'<path class="mg-v102-pelvis" d="'+pelvis+'"/>',underarms};
  };
  // Forearm layer follows the exact same curve as the rear arm.
  // Its tapered visible surface prevents the chest from hiding whole limbs.
  const frontArms=p=>p.arms.map((d,i)=>{
    const sections=curveSections(d),left=[],right=[];
    for(let k=0;k<=18;k++){
      const u=.21+.79*k/18,scaled=u*sections.length;
      const index=Math.min(sections.length-1,Math.floor(scaled));
      const at=sample(sections[index],Math.min(1,scaled-index));
      const mag=Math.max(.001,Math.hypot(at.dx,at.dy));
      const nx=-at.dy/mag,ny=at.dx/mag,width=21-(k/18)*7;
      left.push(point(at.x+nx*width,at.y+ny*width));
      right.push(point(at.x-nx*width,at.y-ny*width));
    }
    return '<path class="mg-v102-forearm" data-visible-arm="'+i+'" d="M'+
      left.join(' L')+' L'+right.reverse().join(' L')+'Z"/>';
  }).join('');
  const drawing=p=>{
    const legs=p.legs.map((d,i)=>limb(d,"leg",i)).join("");
    const arms=p.arms.map((d,i)=>limb(d,"arm",i)).join("");
    // V56: arm roots live BEHIND the same torso that joins the hip sockets.
    // Previously the entire shoulder socket sat over the chest like a sticker.
    // Only the hands and a soft joining-gesture forearm pass in FRONT.
    const anatomy=joins(p);
    const joined=p.kind==="finish"||p.id==="v68-gratitude";
    const feet=p.feet.map((pt,i)=>paw(pt,"foot",i,p.legs[i],false)).join("");
    const hands=p.hands.map((pt,i)=>paw(pt,"hand",i,p.arms[i],joined)).join("");
    const front=joined?'<g class="mg-gesture-forearms">'+
      p.arms.map(d=>'<path class="mg-gesture-forearm" d="'+d+'"/>').join("")+'</g>':"";
    return '<g class="movement-guardian" data-guardian="nila" data-kind="'+p.kind+'" aria-hidden="true">'+
       grounding(p)+shadows(p)+tail(p)+
       '<g class="mg-legs">'+legs+feet+'</g>'+
       '<g class="mg-arms mg-arms-behind">'+arms+'</g>'+
       '<g class="mg-v102-hip-web">'+anatomy.pelvis+'</g>'+

       neck(p)+
       '<g class="mg-v102-axillary-web">'+anatomy.underarms+'</g>'+
       trunk(p)+ 
       '<g class="mg-v102-arms-front">'+frontArms(p)+'</g>'+
       front+'<g class="mg-hands">'+hands+'</g>'+
       head(p)+'</g>';
  };
  // V68: all twelve optional asanas use exactly the same anatomical renderer.
  // A single drawing function eliminates the second, visually unrelated dragon.
  window.YOGA_MOVEMENT_GUARDIAN=Object.freeze({drawPose:drawing});
  for(const p of art.poses){
    const node=svg.querySelector('.yy-pose[data-pose="'+p.id+'"] .yy-character');
    if(node)node.insertAdjacentHTML("beforeend",drawing(p));
  }
  root.dataset.movementGuardian="nila";
})();
