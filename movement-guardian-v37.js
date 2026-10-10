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
  const limb=(curve,type,index)=>{
    // One continuous curved limb; the outer contour is the broad stroke,
    // the inset band shows muscle direction without an unattached joint.
    return '<g class="mg-limb mg-'+type+'" data-mg-limb="'+type+'-'+index+'">'+
      '<path class="mg-limb-shell" d="'+curve+'"/>'+
      '<path class="mg-limb-plane" d="'+curve+'"/></g>';
  };
  const head=(p)=>{
    const [x,y,scale,angle,expression]=p.head;
    return '<g class="mg-head" transform="translate('+esc(x)+' '+esc(y)+') rotate('+esc(angle)+') scale('+esc(scale)+')">'+
      '<path class="mg-ear" d="M-51-32C-87-59-93-102-81-117C-64-99-42-86-31-58Z"/>'+
      '<path class="mg-ear" d="M48-32C83-60 92-103 80-117C65-96 42-84 30-58Z"/>'+
      '<path class="mg-ear-mark" d="M-73-94Q-62-76-52-64 M72-95Q62-75 52-63"/>'+
      '<path class="mg-crown" d="M-28-60Q-5-102 17-80Q29-73 38-49Q5-62-28-60Z"/>'+
      '<path class="mg-face" d="M-61-39 C-50-68-18-73 2-68 C40-77 67-48 66-13 C75 19 61 53 32 64 C16 82-17 83-34 64 C-62 55-78 22-65-9Z"/>'+
      '<path class="mg-face-glaze" d="M-40-46Q-16-61 6-56M26-55Q42-49 48-35"/>'+
      '<path class="mg-snout" d="M-39 16 C-43 36-27 66-6 70 Q4 75 18 69 C38 63 45 38 32 16 C20 24 10 27-1 25 C-12 26-23 20-39 16Z"/>'+
      '<path class="mg-eye" d="M-53 -6 Q-37 4 -19-6 M17-6 Q35 4 51-6"/>'+
      '<path class="mg-nose" d="M-11 36Q-2 40 10 35Q6 47-1 46Q-7 45-11 36Z"/>'+
      '<path class="mg-mouth" d="'+(expression==="smile"?'M-14 57Q1 68 17 56':'M-12 57Q2 62 14 56')+'"/>'+
      '<path class="mg-cheek" d="M-56 24Q-49 31-41 25M42 24Q50 31 57 24"/>'+
      '<path class="mg-crest" d="M-39-50 Q-24-85-5-87 Q-18-61 4-65 Q21-88 35-65 L25-42Z"/>'+
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
    return '<path class="mg-neck" d="M'+point(topX,topY)+' Q'+point((topX+endX)/2,(topY+endY)/2-13)+' '+point(endX,endY)+'"/>';
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
    return '<g class="movement-guardian" data-guardian="nila" data-kind="'+p.kind+'" aria-hidden="true">'+
       shadows(p)+tail(p)+
       '<g class="mg-legs">'+legs+feet+'</g>'+
       neck(p)+trunk(p)+
       '<g class="mg-arms">'+arms+hands+'</g>'+
       head(p)+'</g>';
  };
  for(const p of art.poses){
    const node=svg.querySelector('.yy-pose[data-pose="'+p.id+'"] .yy-character');
    if(node)node.insertAdjacentHTML("beforeend",drawing(p));
  }
  root.dataset.movementGuardian="nila";
})();
