/* YIN × YANG | original, pose-authored vector mascot. Zero limb morphing. */
(() => {
  "use strict";
  const poses = [
    {id:"start",name:["Soltar el peso","Let the weight go"],cue:["Apoya el cuerpo y baja el ritmo.","Rest your body and slow down."],kind:"rest",body:[357,320,123,40,-2],head:[222,306,.77,-64,"closed"],arms:["M282 322Q256 342 232 358","M318 333Q296 359 281 364"],legs:["M430 324Q475 335 518 348","M433 309Q486 315 535 334"],hands:[[232,358],[281,364]],feet:[[518,348],[535,334]],tail:[449,297,.79,-13]},
    {id:"centering",name:["Volver al centro","Find your centre"],cue:["Baja la mirada y encuentra apoyo.","Lower your gaze and find your ground."],kind:"seat",body:[360,266,65,87,0],head:[360,145,.87,0,"soft"],arms:["M310 231Q288 282 316 304","M409 231Q432 283 402 304"],legs:["M328 324Q278 354 244 337","M390 324Q441 354 477 337"],hands:[[316,304],[402,304]],feet:[[244,337],[477,337]],tail:[426,290,.65,5]},
    {id:"breath",name:["Respirar 4 · 7 · 8","Breathe 4 · 7 · 8"],cue:["Inhala cuatro, sostén siete, exhala ocho.","Inhale four, hold seven, exhale eight."],kind:"breath",body:[360,260,67,87,0],head:[361,141,.86,0,"soft"],arms:["M305 227Q266 243 250 282","M414 227Q450 243 470 282"],legs:["M324 321Q282 352 245 335","M394 321Q440 352 476 335"],hands:[[250,282],[470,282]],feet:[[245,335],[476,335]],tail:[433,276,.64,-8]},
    {id:"warmup",name:["Despertar el cuerpo","Wake your body"],cue:["A cuatro apoyos, moviliza suavemente la columna.","On all fours, move your spine gently."],kind:"table",body:[364,267,131,52,-5],head:[223,236,.73,-18,"open"],arms:["M292 283Q270 325 258 367","M329 290Q319 337 316 366"],legs:["M429 279Q455 318 451 368","M461 252Q509 287 505 363"],hands:[[258,367],[316,366]],feet:[[451,368],[505,363]],tail:[461,238,.83,-24]},
    {id:"pose-1",name:["Guerrero II","Warrior II"],cue:["Abre los brazos, afianza tus pies y mira al frente.","Open your arms, ground your feet and look ahead."],kind:"warrior",body:[357,230,62,86,-3],head:[358,123,.79,-13,"focus"],arms:["M309 190Q239 183 155 190","M407 195Q484 184 562 192"],legs:["M322 299Q298 308 272 325Q264 355 253 378","M391 304Q460 311 474 343Q495 360 536 383"],hands:[[155,190],[562,192]],feet:[[253,378],[536,383]],tail:[426,261,.68,10]},
    {id:"transition",name:["Fluir con presencia","Flow with presence"],cue:["Abre el pecho, juega con el ritmo y mantén los pies enraizados.","Open your chest, feel the rhythm and keep both feet grounded."],kind:"flow",body:[365,237,69,86,11],head:[345,125,.80,-9,"smile"],arms:["M318 193Q269 148 237 109","M417 199Q464 150 514 164"],legs:["M349 305Q294 335 240 378","M410 302Q466 346 520 381"],hands:[[237,109],[514,164]],feet:[[240,378],[520,381]],tail:[437,253,.59,16]},
    {id:"pose-2",name:["Árbol del equilibrio","Tree of balance"],cue:["Busca un punto estable y sostén tu equilibrio.","Find a steady point and hold your balance."],kind:"tree",body:[359,223,63,85,0],head:[358,115,.79,0,"focus"],arms:["M311 186Q280 117 333 83","M407 186Q445 118 384 83"],legs:["M343 298Q349 339 353 387","M391 302Q450 310 423 336Q402 342 355 313"],hands:[[333,83],[384,83]],feet:[[353,387],[355,313]],tail:[426,260,.75,-6]},
    {id:"cooldown",name:["Postura del niño","Child's pose"],cue:["Recoge la energía y descansa la frente.","Fold inward and let your forehead rest."],kind:"child",body:[376,304,117,58,8],head:[264,319,.68,-43,"closed"],arms:["M309 333Q242 357 185 366","M340 344Q269 376 214 379"],legs:["M429 320Q446 364 400 369","M447 304Q489 350 454 365"],hands:[[185,366],[214,379]],feet:[[400,369],[454,365]],tail:[452,280,.66,28]},
    {id:"savasana",name:["Savasana","Savasana"],cue:["Afloja el cuerpo. No hay nada que conseguir.","Release your body. There is nothing to achieve."],kind:"savasana",body:[363,320,132,39,-1],head:[220,304,.76,-70,"closed"],arms:["M282 319Q262 348 243 366","M352 338Q353 365 332 375"],legs:["M439 322Q491 325 539 344","M444 308Q495 316 546 334"],hands:[[243,366],[332,375]],feet:[[539,344],[546,334]],tail:[452,291,.66,-14]},
    {id:"finish",name:["Un instante de gratitud","A moment of gratitude"],cue:["Junta las manos. Llévate esta calma contigo.","Bring your hands together. Carry this calm with you."],kind:"finish",body:[359,263,65,88,0],head:[359,142,.87,0,"smile"],arms:["M309 231Q300 268 346 263","M411 231Q425 268 373 263"],legs:["M323 326Q280 354 243 338","M395 326Q440 354 476 338"],hands:[[346,263],[373,263]],feet:[[243,338],[476,338]],tail:[425,283,.67,10]}
  ];
  const fmt=n=>Number(n).toFixed(1).replace(/\.0$/,"");
  const circle=(x,y,r,cls)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+cls+'"/>';
  const path=(d,cls)=>'<path d="'+d+'" class="'+cls+'"/>';
  const limb=(d,type,i)=>{
    const n=(d.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    if(n.length!==6 && n.length!==10)throw Error("Pose limb must have one or two quadratic sections: "+d);
    const pieces=[n.slice(0,6)];
    if(n.length===10)pieces.push([n[4],n[5],n[6],n[7],n[8],n[9]]);
    const radius=type==="leg"?31:22;
    const a=[],b=[];
    for(let section=0;section<pieces.length;section++){
      const [x0,y0,cx,cy,x1,y1]=pieces[section];
      for(let j=0;j<=16;j++){
        if(section && !j)continue;
        const t=j/16,u=1-t;
        const x=u*u*x0+2*u*t*cx+t*t*x1,y=u*u*y0+2*u*t*cy+t*t*y1;
        let dx=2*u*(cx-x0)+2*t*(x1-cx),dy=2*u*(cy-y0)+2*t*(y1-cy);
        const mag=Math.max(.001,Math.hypot(dx,dy));dx/=mag;dy/=mag;
        const progress=(section+t)/pieces.length;
        const w=radius*(1.09-.29*progress+.095*Math.sin(progress*Math.PI));
        a.push([x-dy*w,y+dx*w]);b.push([x+dy*w,y-dx*w]);
      }
    }
    const f=pt=>fmt(pt[0])+","+fmt(pt[1]);
    const first=pieces[0],last=pieces[pieces.length-1];
    const start=[first[0],first[1]],finish=[last[4],last[5]];
    // An interpolated outer contour rather than straight lines joining
    // each sampled joint normal. This rounds knees and the axillary tuck
    // while preserving every authored endpoint and foot contact.
    const side=pts=>pts.slice(1).map((point,i)=>{
      const next=pts[i+2];
      return next?'Q'+f(point)+' '+f([(point[0]+next[0])/2,(point[1]+next[1])/2]):
        'L'+f(point);
    }).join("");
    const silhouette="M"+f(a[0])+side(a)+
      "Q"+f(finish)+" "+f(b[b.length-1])+
      side(b.slice().reverse())+
      "Q"+f(start)+" "+f(a[0])+"Z";
    // Socket and taper share the authored limb coordinates, so the shoulder/
    // hip overlaps the torso and cannot become a detached animated badge.
    const [sx,sy,cx,cy]=first;
    const angle=fmt(Math.atan2(cy-sy,cx-sx)*180/Math.PI);
    const major=type==="leg"?34:28,minor=type==="leg"?24:17;
    const socket='<g class="yy-d15-socket yy-d15-'+type+'-socket" transform="translate('+fmt(sx)+' '+fmt(sy)+') rotate('+angle+')">'+
      path('M-'+fmt(major*.94)+' -'+fmt(minor*.44)+
        'C-'+fmt(major*.50)+' -'+fmt(minor*1.05)+' '+fmt(major*.37)+' -'+fmt(minor*.91)+' '+fmt(major*.86)+' -'+fmt(minor*.36)+
        'Q'+fmt(major*1.03)+' 0 '+fmt(major*.86)+' '+fmt(minor*.36)+
        'C'+fmt(major*.37)+' '+fmt(minor*.91)+' -'+fmt(major*.50)+' '+fmt(minor*1.05)+' -'+fmt(major*.94)+' '+fmt(minor*.44)+'Z','yy-d15-socket-flesh yy-d17-root-blend')+
      path('M'+fmt(major*.2)+' -'+fmt(minor*.79)+'Q'+fmt(major*.76)+' 0 '+fmt(major*.2)+' '+fmt(minor*.79),'yy-d15-socket-relief')+
      '</g>';
    // Two-section limbs (bent Warrior II / Tree) get a real knee/elbow fold.
    // Single-section limbs keep a quiet sinew line and no false hinge.
    const joint=pieces.length===2?
      '<g class="yy-d15-joint yy-d15-'+type+'-joint" transform="translate('+fmt(pieces[1][0])+' '+fmt(pieces[1][1])+')">'+
        '<ellipse rx="'+fmt(radius*.61)+'" ry="'+fmt(radius*.47)+'" class="yy-d15-joint-shell"/>'+
        path('M-'+fmt(radius*.30)+' -'+fmt(radius*.08)+'Q0 -'+fmt(radius*.32)+' '+fmt(radius*.31)+' -'+fmt(radius*.07),'yy-d15-joint-fold')+
      '</g>':
      path('M'+fmt(a[Math.min(10,a.length-1)][0])+' '+fmt(a[Math.min(10,a.length-1)][1])+
        'Q'+fmt(n[2])+' '+fmt(n[3])+' '+fmt(b[Math.min(10,b.length-1)][0])+' '+fmt(b[Math.min(10,b.length-1)][1]),'yy-d15-sinew');
    return '<g class="yy-limb-unit yy-d15-limb-unit">'+
      socket+
      '<path d="'+silhouette+'" class="yy-limb yy-'+type+'" data-limb="'+type+'-'+i+'"/>'+
      '<path d="'+d+'" class="yy-limb-lustre yy-'+type+'-lustre"/>'+
      joint+
      '</g>';
  };
  // Blended underarm and pelvic membranes reach inside the torso.
  const attachments=(p,type)=>{
    const body=p.body,limbs=type==="arm"?p.arms:p.legs;
    return '<g class="yy-d17-attachments yy-d17-'+type+'-attachments">'+limbs.map((d)=>{
      const c=(d.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
      const [sx,sy,cx,cy]=c,dx=cx-sx,dy=cy-sy;
      const mag=Math.max(1,Math.hypot(dx,dy)),nx=-dy/mag,ny=dx/mag;
      const wide=type==="arm"?20:27,bx=body[0],by=body[1];
      const qx=sx+(bx-sx)*.53,qy=sy+(by-sy)*.53;
      const d2='M'+fmt(sx+nx*wide)+' '+fmt(sy+ny*wide)+
        'C'+fmt(qx+nx*wide*.7)+' '+fmt(qy+ny*wide*.7)+' '+fmt(qx+nx*wide*.2)+' '+fmt(qy+ny*wide*.2)+' '+fmt(bx)+' '+fmt(by)+
        'C'+fmt(qx-nx*wide*.2)+' '+fmt(qy-ny*wide*.2)+' '+fmt(qx-nx*wide*.7)+' '+fmt(qy-ny*wide*.7)+' '+fmt(sx-nx*wide)+' '+fmt(sy-ny*wide)+'Z';
      return path(d2,'yy-d17-attachment yy-d17-'+type+'-attachment');
    }).join('')+'</g>';
  };
  const point=(xy,cls)=>{
    const [x,y]=xy;
    return '<g transform="translate('+x+' '+y+')" class="yy-paw-group">'+
      '<path d="M-17-2Q-16-12-4-14Q12-15 18-5Q21 8 10 14Q-2 17-14 10Q-19 6-17-2Z" class="'+cls+'"/>'+
      '<path d="M-10-8Q-5-14 1-11M3-11Q10-13 13-6" class="yy-paw-toes"/>'+
      '<path d="M-12 5Q-4 12 5 10" class="yy-paw-gloss"/>'+
      '<ellipse cx="-8" cy="-8" rx="3.2" ry="2.4" class="yy-toe"/>'+
      '<ellipse cx="0" cy="-10" rx="3.2" ry="2.4" class="yy-toe"/>'+
      '<ellipse cx="8" cy="-7" rx="3.2" ry="2.4" class="yy-toe"/>'+
      '<ellipse cx="1" cy="4" rx="6" ry="4.2" class="yy-pad"/>'+
      '<path d="M-6 2Q0 8 7 2Q4 12 -2 11Q-8 10-6 2Z" class="yy-pad"/>'+
      '<path d="M-12-9Q-9-14-5-11M2-12Q7-15 10-9" class="yy-toe"/>'+
      '</g>';
  };
  const toTransform=(x,y,s,r)=>'translate('+x+' '+y+') rotate('+r+') scale('+s+')';
  // D9: flowing muzzle integrated into the skull, never a sticker or forehead eye.
  const face=p=>{
    const [x,y,s,r,expression]=p.head;
    const eyes='<g class="yy-anim-eyes yy-closed-gaze">'+
      path('M-50 6Q-35 18-18 6','yy-eye-closed yy-eye-left')+
      path('M18 6Q35 18 50 6','yy-eye-closed yy-eye-right')+'</g>';
    return '<g class="yy-head yy-dragon-head" transform="'+toTransform(x,y,s,r)+'">'+
      '<g class="yy-d12-unicorn-horn">'+
        path('M-20-66C-14-88-11-115-5-137C8-117 13-93 19-66Q0-54-20-66Z','yy-d12-unicorn-core')+
        path('M-12-83Q0-78 13-83M-9-96Q0-92 10-98M-7-110Q0-108 6-113M-5-122Q0-119 2-124','yy-d12-unicorn-spiral')+
        path('M-4-131C-2-114 1-91 3-72','yy-d12-unicorn-glint')+
        path('M-24-65Q0-78 23-65','yy-d12-unicorn-root')+
      '</g>'+
      path('M-61-49C-78-68-77-97-67-111C-63-94-48-78-37-64L-43-53Z','yy-dragon-horn yy-horn-left')+
      path('M43-64C55-81 64-95 70-111C82-98 80-68 62-48L43-53Z','yy-dragon-horn yy-horn-right')+
      path('M-65-101Q-64-80-49-59M66-101Q67-81 54-59','yy-dragon-horn-ridge')+
      path('M-73-93Q-71-83-66-74M73-93Q71-83 66-74M-62-67L-57-59M62-67L57-59','yy-d11-horn-engraving')+
      path('M-59-43C-79-66-95-88-103-108C-111-78-93-48-76-27Z','yy-dragon-sidefin yy-fin-left')+
      path('M59-43C79-66 95-88 103-108C111-78 93-48 76-27Z','yy-dragon-sidefin yy-fin-right')+
      path('M-77-48Q-90-75-97-92M78-48Q90-75 97-92','yy-dragon-fin-vein')+
      path('M-71-43C-54-83-19-86 0-82C39-87 67-68 76-43C89-21 86 7 78 29C85 51 73 73 48 79C30 94 13 99 0 101C-13 99-31 93-48 79C-73 73-85 51-78 28C-87 7-85-21-71-43Z','yy-fur yy-outline yy-head-shell')+
      path('M-71-37Q-49-76-19-66L-28-89Q-7-77 4-74Q37-89 72-47Q42-56 28-38Q2-48-23-37L-48-21Z','yy-crest yy-outline yy-dragon-crest')+
      path('M-60-34Q-42-58-24-57M26-60Q52-62 63-36','yy-mane-light')+
      path('M-65-25Q-58-15-58 0M65-25Q58-15 58 0','yy-d12-temple-relief')+
      path('M-50-37Q-41-52-27-50M24-54Q43-54 53-40','yy-d11-crest-engraving')+
      '<g class="yy-dragon-forelock">'+
        path('M-24-68Q-6-92 8-79Q18-68 27-51Q7-62-13-48Z','yy-dragon-forelock-fill')+
        path('M-13-72Q0-78 10-70','yy-dragon-forelock-sheen')+'</g>'+
      path('M-72 12C-63 2-48-2-34 7C-22 17-23 43-34 56Q-57 70-73 49Z','yy-cheek yy-dragon-cheek')+
      path('M72 12C63 2 48-2 34 7C22 17 23 43 34 56Q57 70 73 49Z','yy-cheek yy-dragon-cheek')+
      path('M-78 27Q-91 20-103 23L-85 42L-97 54L-74 57M78 27Q91 20 103 23L85 42L97 54L74 57','yy-dragon-cheek-fins')+
      '<g class="yy-dragon-bridge-layer">'+
        path('M-27 0C-33 15-43 30-47 44C-54 65-36 81-18 89Q0 99 19 89C37 81 54 65 47 44C43 30 33 15 27 0C17 13 11 17 0 17C-11 17-17 13-27 0Z','yy-dragon-snout yy-dragon-face-plane')+
        path('M-27 28Q-43 36-43 56Q-33 77-14 84M27 28Q43 36 43 56Q33 77 14 84','yy-dragon-snout-contour')+
        path('M-27 47C-22 41-13 41-2 44Q0 46 2 44C13 41 22 41 27 47C33 57 25 67 13 72Q0 77-13 72C-25 67-33 57-27 47Z','yy-dragon-nose-pad')+
        path('M-14 23C-7 27 7 27 14 23','yy-dragon-snout-light')+
        path('M-24 54Q-18 49-12 55M12 55Q18 49 24 54','yy-nostril yy-dragon-nostril')+
        path(expression==='smile'?'M-15 70Q0 83 16 70':'M-13 72Q0 77 14 72','yy-smile yy-dragon-mouth')+
        path('M-18 77Q0 84 19 77','yy-dragon-lower-lip')+'</g>'+
      '<g class="yy-dragon-beard-assembly">'+
        path('M-28 75Q-34 91-18 104Q-12 122 0 128Q13 121 18 104Q34 91 28 75Q14 92 0 91Q-15 92-28 75Z','yy-dragon-beard')+
        path('M-12 98Q-8 118 0 122M11 98Q8 115 0 122','yy-dragon-beard-line')+
        path('M-18 95Q-18 104-10 110M18 95Q18 104 10 110','yy-d11-beard-engraving')+
        path('M-30 80Q-41 92-38 105M30 80Q41 92 38 105','yy-dragon-beard-wisps')+'</g>'+
      path('M-53-7Q-36-17-18-9M18-9Q36-17 53-7','yy-sleep-brow')+
      // Two closed eyes are immutable. Expression is in the lateral brow/
      // cheek muscles: focused / receptive / resting, never a third eye.
      '<g class="yy-d15-expression yy-d15-expression-'+expression+'">'+
        path(expression==="focus"?'M-56-9Q-40-19-27-11M27-11Q40-19 56-9':
          expression==="closed"?'M-54-6Q-41-10-27-6M27-6Q41-10 54-6':
          expression==="smile"?'M-53-5Q-42-13-28-8M28-8Q42-13 53-5':
          'M-55-8Q-41-16-27-8M27-8Q41-16 55-8','yy-d15-brow-gesture')+
        path(expression==="smile"?'M-61 29Q-54 35-47 29M47 29Q54 35 61 29':
          expression==="focus"?'M-60 28Q-54 25-47 29M47 29Q54 25 60 28':
          'M-59 29Q-53 32-47 29M47 29Q53 32 59 29','yy-d15-cheek-gesture')+
      '</g>'+eyes+
      path('M-63-11Q-60-21-47-18M47-18Q60-21 63-11','yy-dragon-temple-scales')+
      path('M-57 34Q-53 29-46 30M46 30Q53 29 57 34','yy-dragon-cheek-light')+
      path('M-58 18Q-47 15-41 19M58 18Q47 15 41 19','yy-d11-cheek-engraving')+
      path('M-41 0Q-29-5-22 1M41 0Q29-5 22 1','yy-d12-cheek-bone')+
      circle(-57,42,2.8,'yy-dragon-freckle')+circle(-65,46,1.6,'yy-dragon-freckle')+
      circle(57,42,2.8,'yy-dragon-freckle')+circle(65,46,1.6,'yy-dragon-freckle')+
      path('M-34 49Q-72 35-105 43','yy-whisker yy-dragon-whisker yy-whisker-left yy-whisker-high')+
      path('M-34 61Q-66 63-98 84','yy-whisker yy-dragon-whisker yy-whisker-left yy-whisker-low')+
      path('M34 49Q72 35 105 43','yy-whisker yy-dragon-whisker yy-whisker-right yy-whisker-high')+
      path('M34 61Q66 63 98 84','yy-whisker yy-dragon-whisker yy-whisker-right yy-whisker-low')+'</g>';
  };
  // Connection between the skull and shoulder. It lives behind the chest and
  // head and is never an independent floating sticker.
  const neck=p=>{
    const [x,y,rx,ry]=p.body,[hx,hy,scale]=p.head;
    if(p.kind==="table"){
      return '<g class="yy-d14-neck-assembly">'+
        path('M265 244C277 237 298 239 312 251L315 270C297 261 282 262 267 278Z','yy-d14-neck-bridge yy-d14-neck-table')+
        path('M274 253Q294 247 309 258','yy-d14-throat-line')+'</g>';
    }
    if(ry<60){
      const x0=hx+57*scale,y0=hy+12*scale,x1=x-rx*.57,y1=y-ry*.1;
      return '<g class="yy-d14-neck-assembly">'+
        path('M'+fmt(x0)+' '+fmt(y0-15)+'Q'+fmt((x0+x1)/2)+' '+fmt(y1-23)+' '+fmt(x1+9)+' '+fmt(y1-12)+
          'L'+fmt(x1+9)+' '+fmt(y1+16)+'Q'+fmt((x0+x1)/2)+' '+fmt(y1+15)+' '+fmt(x0)+' '+fmt(y0+17)+'Z','yy-d14-neck-bridge')+'</g>';
    }
    const top=hy+74*scale,base=y-ry*.46;
    return '<g class="yy-d14-neck-assembly">'+
      path('M'+fmt(hx-22*scale)+' '+fmt(top-18)+'Q'+fmt(hx)+' '+fmt(top-26)+' '+fmt(hx+22*scale)+' '+fmt(top-18)+
        'L'+fmt(x+19)+' '+fmt(base+16)+'Q'+fmt(x)+' '+fmt(base+27)+' '+fmt(x-19)+' '+fmt(base+16)+'Z','yy-d14-neck-bridge')+'</g>';
  };
  // D16: two restrained shoulder-mounted wings, tucked BEHIND the ribcage.
  // A full spread during balance practice would fight the anatomy and crowd
  // the mobile view, so each pose owns a compact, proportional folded form.
  const wings=p=>{
    const [x,y,rx,ry,r]=p.body;
    const grounded=["rest","savasana","child","table"].includes(p.kind);
    const h=Math.min(ry*1.04,91)*(grounded?.58:.90);
    const w=Math.min(rx*1.8,126)*(grounded?.56:1);
    const base=-ry*.38,peak=base-h;
    const membrane='M12 '+fmt(base+9)+
      'Q'+fmt(w*.31)+' '+fmt(base-h*.66)+' '+fmt(w*.85)+' '+fmt(peak)+
      'Q'+fmt(w*.94)+' '+fmt(base-h*.62)+' '+fmt(w*.79)+' '+fmt(base-h*.30)+
      'Q'+fmt(w*.54)+' '+fmt(base-h*.18)+' '+fmt(rx*.24)+' '+fmt(base+ry*.14)+
      'Q'+fmt(w*.14)+' '+fmt(base+ry*.22)+' 12 '+fmt(base+9)+'Z';
    const vein='M18 '+fmt(base+5)+
      'Q'+fmt(w*.58)+' '+fmt(base-h*.5)+' '+fmt(w*.83)+' '+fmt(peak+5);
    const struts='M'+fmt(w*.36)+' '+fmt(base-h*.30)+
      'Q'+fmt(w*.60)+' '+fmt(base-h*.29)+' '+fmt(w*.80)+' '+fmt(base-h*.36)+
      'M'+fmt(w*.55)+' '+fmt(base-h*.53)+
      'Q'+fmt(w*.72)+' '+fmt(base-h*.55)+' '+fmt(w*.88)+' '+fmt(base-h*.63);
    return '<g class="yy-d16-wings" data-fold="'+(grounded?'rest':'raised')+
      '" transform="translate('+x+' '+y+') rotate('+r+')">'+
      [-1,1].map((dir,i)=>
        '<g class="yy-d16-wing yy-d16-wing-'+(i?'right':'left')+'" transform="scale('+dir+' 1)">'+
          path(membrane,'yy-d16-wing-membrane')+
          path(vein,'yy-d16-wing-vein')+
          path(struts,'yy-d16-wing-struts')+'</g>').join('')+'</g>';
  };
  const torso=p=>{
    const [x,y,rx,ry,r]=p.body;
    const horizontal=ry<60;
    return '<g class="yy-torso" data-kind="'+p.kind+'" transform="translate('+x+' '+y+') rotate('+r+')">'+
      '<path d="'+(p.kind==="table"?
        ('M-'+fmt(rx*.86)+' -'+fmt(ry*.57)+
         'Q-'+fmt(rx*.94)+' -'+fmt(ry*.05)+' -'+fmt(rx*.9)+' '+fmt(ry*.55)+
         'Q0 '+fmt(ry*1.15)+' '+fmt(rx*.86)+' '+fmt(ry*.55)+
         'Q'+fmt(rx*1.04)+' 0 '+fmt(rx*.92)+' -'+fmt(ry*.55)+
         'Q0 -'+fmt(ry*1.1)+' -'+fmt(rx*.86)+' -'+fmt(ry*.57)+'Z'):
        (horizontal?
          ('M-'+fmt(rx*.91)+' -'+fmt(ry*.14)+
           'C-'+fmt(rx*.87)+' -'+fmt(ry*.84)+' -'+fmt(rx*.40)+' -'+fmt(ry*1.01)+' -'+fmt(rx*.05)+' -'+fmt(ry*.86)+
           'C'+fmt(rx*.39)+' -'+fmt(ry*1.02)+' '+fmt(rx*.85)+' -'+fmt(ry*.66)+' '+fmt(rx*.94)+' -'+fmt(ry*.16)+
           'C'+fmt(rx*1.01)+' '+fmt(ry*.18)+' '+fmt(rx*.80)+' '+fmt(ry*.65)+' '+fmt(rx*.43)+' '+fmt(ry*.73)+
           'Q0 '+fmt(ry*.84)+' -'+fmt(rx*.45)+' '+fmt(ry*.68)+
           'C-'+fmt(rx*.81)+' '+fmt(ry*.59)+' -'+fmt(rx*.98)+' '+fmt(ry*.24)+' -'+fmt(rx*.91)+' -'+fmt(ry*.14)+'Z'):
        ('M-'+fmt(rx*.83)+' -'+fmt(ry*.42)+
         'C-'+fmt(rx*.96)+' -'+fmt(ry*.83)+' -'+fmt(rx*.47)+' -'+fmt(ry*1.13)+' 0 -'+fmt(ry*.98)+
         'C'+fmt(rx*.57)+' -'+fmt(ry*1.13)+' '+fmt(rx*.98)+' -'+fmt(ry*.70)+' '+fmt(rx*.92)+' -'+fmt(ry*.37)+
         'C'+fmt(rx*1.05)+' '+fmt(ry*.01)+' '+fmt(rx*.79)+' '+fmt(ry*.61)+' '+fmt(rx*.43)+' '+fmt(ry*.79)+
         'Q0 '+fmt(ry*.98)+' -'+fmt(rx*.45)+' '+fmt(ry*.79)+
         'C-'+fmt(rx*.77)+' '+fmt(ry*.54)+' -'+fmt(rx*.98)+' '+fmt(ry*.02)+' -'+fmt(rx*.83)+' -'+fmt(ry*.42)+'Z')))+
        '" class="yy-fur yy-outline yy-d12-body-shell"'+(p.kind==="table"?' data-asana-back="true"':'')+'/>'+
      (p.kind==="table"?
        '<path d="M-95 27Q0 42 95 27Q0 56 -95 27Z" class="yy-belly-shade" data-asana-belly="true"/>'+
        '<path d="M-105 -24Q0 -58 104 -24" class="yy-back-highlight" data-asana-spine="true"/>':
      '<path d="M-'+fmt(rx*.71)+' -'+fmt(ry*.34)+'Q0 -'+fmt(ry*.78)+' '+fmt(rx*.67)+' -'+fmt(ry*.25)+'" class="yy-shoulder-shine"/>')+
      '<ellipse class="yy-belly" cx="0" cy="'+fmt(ry*.18)+'" rx="'+fmt(rx*.42)+'" ry="'+fmt(ry*.34)+'"/>'+
      '<g class="yy-d16-body-meridian">'+
        '<path d="M0 -'+fmt(ry*.83)+'Q-'+fmt(rx*.08)+' -'+fmt(ry*.27)+' 0 '+fmt(ry*.24)+
          'Q'+fmt(rx*.08)+' '+fmt(ry*.57)+' 0 '+fmt(ry*.75)+'" class="yy-d16-meridian-line"/>'+
        '<path d="M-'+fmt(rx*.35)+' -'+fmt(ry*.14)+'Q-'+fmt(rx*.25)+' '+fmt(ry*.14)+' 0 '+fmt(ry*.31)+
          'Q'+fmt(rx*.25)+' '+fmt(ry*.14)+' '+fmt(rx*.35)+' -'+fmt(ry*.14)+'" class="yy-d16-breath-arch"/>'+
      '</g>'+
      '<g class="yy-d14-rib-cage">'+
        '<path d="M-'+fmt(rx*.42)+' -'+fmt(ry*.32)+'Q0 -'+fmt(ry*.55)+' '+fmt(rx*.45)+' -'+fmt(ry*.30)+'" class="yy-d14-rib-line"/>'+
        '<path d="M-'+fmt(rx*.26)+' '+fmt(ry*.30)+'Q0 '+fmt(ry*.44)+' '+fmt(rx*.27)+' '+fmt(ry*.29)+'" class="yy-d14-breath-line"/>'+
      '</g>'+
      '<g class="yy-d12-body-relief">'+
        '<path d="M-'+fmt(rx*.62)+' -'+fmt(ry*.23)+'Q-'+fmt(rx*.35)+' -'+fmt(ry*.79)+' 0 -'+fmt(ry*.71)+
        'Q'+fmt(rx*.32)+' -'+fmt(ry*.78)+' '+fmt(rx*.61)+' -'+fmt(ry*.26)+'" class="yy-d12-shoulder-arc"/>'+
        '<path d="M-'+fmt(rx*.56)+' '+fmt(ry*.35)+'Q0 '+fmt(ry*.75)+' '+fmt(rx*.56)+' '+fmt(ry*.35)+'" class="yy-d12-ventral-arc"/>'+
        '</g>'+
      '<g class="yy-d14-scapula">'+
        '<path d="M-'+fmt(rx*.72)+' -'+fmt(ry*.14)+'Q-'+fmt(rx*.54)+' -'+fmt(ry*.52)+' -'+fmt(rx*.33)+' -'+fmt(ry*.56)+
          'M'+fmt(rx*.72)+' -'+fmt(ry*.14)+'Q'+fmt(rx*.54)+' -'+fmt(ry*.52)+' '+fmt(rx*.33)+' -'+fmt(ry*.56)+'" class="yy-d14-shoulder-blade"/>'+
      '</g>'+
      '<g class="yy-dragon-body-scales">'+
      '<path d="M-'+fmt(rx*.74)+' -'+fmt(ry*.04)+'q'+fmt(rx*.08)+' -'+fmt(ry*.18)+' '+fmt(rx*.19)+' -'+fmt(ry*.10)+
      'm-'+fmt(rx*.22)+' '+fmt(ry*.37)+'q'+fmt(rx*.11)+' -'+fmt(ry*.14)+' '+fmt(rx*.20)+' -'+fmt(ry*.06)+
      'M'+fmt(rx*.74)+' -'+fmt(ry*.04)+'q-'+fmt(rx*.08)+' -'+fmt(ry*.18)+' -'+fmt(rx*.19)+' -'+fmt(ry*.10)+
      'm'+fmt(rx*.22)+' '+fmt(ry*.37)+'q-'+fmt(rx*.11)+' -'+fmt(ry*.14)+' -'+fmt(rx*.20)+' -'+fmt(ry*.06)+'"/>'+'</g>'+
      (horizontal?'':
        '<path d="M-'+fmt(rx*.55)+' -'+fmt(ry*.64)+
          'Q-'+fmt(rx*.66)+' -'+fmt(ry*.24)+' -'+fmt(rx*.34)+' -'+fmt(ry*.14)+
          'L-'+fmt(rx*.14)+' -'+fmt(ry*.35)+'Q0 -'+fmt(ry*.13)+
          ' '+fmt(rx*.14)+' -'+fmt(ry*.35)+'L'+fmt(rx*.34)+' -'+fmt(ry*.14)+
          'Q'+fmt(rx*.65)+' -'+fmt(ry*.24)+' '+fmt(rx*.55)+' -'+fmt(ry*.64)+
          'Z" class="yy-chest-fur"/>')+
      (p.kind==="rest"||p.kind==="savasana"||p.kind==="child"?'': 
        '<path d="M-24 -12Q-30-31 0-37Q29-29 24-11L0 28Z" class="yy-medallion"/>'+
        '<path d="M0 -23L16 -5L0 17L-16 -5Z" class="yy-gem"/>'+
        '<path d="M0 -17L9 -6L0 12Z" class="yy-gem-shine"/>'+
        '<path d="M-30 -24Q-16-39 0-35Q20-39 30-24" class="yy-necklace"/>'+
        '<path d="M-36 6L-44 2M36 6L45 2" class="yy-sigil-lines"/>')+
      '<ellipse class="yy-belly" cx="0" cy="'+fmt(ry*.22)+'" rx="'+fmt(rx*.34)+'" ry="'+fmt(ry*.28)+'"/>'+
      '<path d="M0 -'+fmt(ry*.62)+'Q'+fmt(rx*.08)+' 0 0 '+fmt(ry*.7)+'" class="yy-spine"/>'+
      '<path d="M-'+fmt(rx*.42)+' -'+fmt(ry*.2)+'Q0 -'+fmt(ry*.34)+' '+fmt(rx*.42)+' -'+fmt(ry*.18)+'" class="yy-collar"/>'+
      '<path d="M-'+fmt(rx*.5)+' '+fmt(ry*.42)+'Q0 '+fmt(ry*.62)+' '+fmt(rx*.5)+' '+fmt(ry*.4)+'" class="yy-hip"/>'+
      '</g>';
  };
  const tail=p=>{
    const [x,y,s,r]=p.tail;
    // This is a different anatomical silhouette, not the same large coiled
    // tail squeezed smaller. Its compact arc follows the grounded cat/cow spine.
    const table=p.kind==="table";
    const reach=s*(p.kind==="rest"?.78:table?.82:p.kind==="savasana"?.84:1);
    return '<g transform="'+toTransform(x,y,reach,r)+'" class="yy-tail yy-d12-tail'+(table?' yy-d13-table-tail':'')+'">'+
      (table?
        path('M-24-10C2-25 34-30 58-16C82-2 90 20 76 36C64 49 49 43 42 33C56 38 66 28 64 16C60-1 28-5 5 8Q-12 18-24 10Z','yy-tail-main yy-outline yy-d12-tail-shell')+
        path('M-12-4Q25-20 54-8Q74 4 74 22','yy-d12-tail-ridge')+
        path('M47 32Q61 46 73 34','yy-d12-tail-flow')+
        path('M70 31Q83 25 86 12Q96 29 87 43Q79 44 70 31Z','yy-dragon-tail-fin yy-d12-tail-plume')+
        path('M77 34Q87 25 87 19','yy-dragon-tail-fin-vein yy-d12-tail-plume-veins')+
        path('M24-15Q31-23 39-19L40-6M52-8Q61-17 67-10L64 4','yy-dragon-tail-spines yy-d12-tail-spines'):
        path('M-23-13C10-25 58-21 88 0C116 23 124 55 100 78C88 88 74 90 62 82C78 105 113 106 138 79C153 62 154 37 142 17C173 53 165 95 136 117C102 142 55 119 46 90C41 73 52 61 64 62C64 82 80 87 91 70C105 45 88 29 57 25C27 21 2 30-23 15Z','yy-tail-main yy-outline yy-d12-tail-shell')+
        path('M-10-3C31-11 76-11 100 17C119 40 113 62 94 77','yy-d12-tail-ridge')+
        path('M53 86Q80 116 112 110M132 91Q151 73 147 49','yy-d12-tail-flow')+
        path('M126 99C145 88 161 66 162 43C181 72 171 108 151 121C142 115 132 108 126 99Z','yy-dragon-tail-fin yy-d12-tail-plume')+
        path('M142 108Q162 88 163 64M150 113Q161 103 167 89','yy-dragon-tail-fin-vein yy-d12-tail-plume-veins')+
        path('M40-10Q46-21 52-22L60 0M79 3Q89-12 98-9L99 19M117 27Q129 13 136 17L126 45','yy-dragon-tail-spines yy-d12-tail-spines'))+
      '</g>';
  };
  const stance=p=>{
    // Contact narrative is pose-specific. No decorative ground glow is
    // attached to a raised hand in Warrior, Flow or the Tree.
    const grounded=p.kind==="table"||p.kind==="rest"||p.kind==="child"||p.kind==="savasana"?
       p.hands.concat(p.feet):
      (p.kind==="warrior"||p.kind==="flow"||p.kind==="seat"||
       p.kind==="breath"||p.kind==="finish")?p.feet:
      p.kind==="tree"?p.feet.slice(0,1):[];
    if(!grounded.length)return "";
    const pressure=p.kind==="tree"?.92:p.kind==="warrior"?.84:p.kind==="table"?.78:p.kind==="flow"?.68:.46;
    return '<g class="yy-stance yy-d15-stance" data-contact="'+p.kind+'">'+grounded.map(([x,y])=>
      '<ellipse class="yy-stance-shadow" cx="'+x+'" cy="'+(y+16)+
      '" rx="26" ry="6"/>'+
      '<ellipse class="yy-d15-pressure-mark" cx="'+x+'" cy="'+(y+13)+
      '" rx="'+fmt(21+pressure*4)+'" ry="'+fmt(3+pressure*1.7)+'"/>').join('')+'</g>';
  };
  const drawing=p=>{
    const twoLegs=p.legs.map((d,i)=>limb(d,'leg',i)).join('');
    const twoArms=p.arms.map((d,i)=>limb(d,'arm',i)).join('');
    const feet=p.feet.map(pos=>point(pos,'yy-paw yy-foot')).join('');
    const hands=p.hands.map(pos=>point(pos,'yy-paw yy-hand')).join('');
    return '<g data-pose="'+p.id+'" class="yy-pose yy-pose-'+p.kind+'">'+
      stance(p)+'<g class="yy-dragon-motes">'+
      circle(p.head[0]-114,p.head[1]+5,2.4,'yy-mote yy-mote-a')+
      circle(p.head[0]+115,p.head[1]-28,2.0,'yy-mote yy-mote-b')+
      circle(p.head[0]+79,p.head[1]+89,1.5,'yy-mote yy-mote-c')+'</g>'+
      '<g class="yy-character" data-weight="'+p.kind+'"><g class="yy-tail-motion">'+tail(p)+'</g>'+
      '<g class="yy-legs">'+twoLegs+feet+'</g>'+attachments(p,'leg')+wings(p)+neck(p)+torso(p)+
      attachments(p,'arm')+'<g class="yy-arms">'+twoArms+hands+'</g>'+
      '<g class="yy-head-motion">'+face(p)+'</g>'+
      '</g></g>';
  };
  const markup=()=>'<svg class="yy-svg" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yin Yang yoga character">'+
    '<defs>'+
      '<linearGradient id="yy-fur-grad" x1="0" y1="0" x2=".9" y2="1"><stop class="yy-fur-stop-hi" offset="0"/><stop class="yy-fur-stop-mid" offset=".55"/><stop class="yy-fur-stop-low" offset="1"/></linearGradient>'+
      '<linearGradient id="yy-mane-grad" x1="0" y1="0" x2="1" y2="1"><stop class="yy-mane-stop-hi" offset="0"/><stop class="yy-mane-stop-low" offset="1"/></linearGradient>'+
      '<radialGradient id="yy-gaze-grad" cx="40%" cy="35%"><stop offset="0" stop-color="#c9e6cf"/><stop offset=".55" stop-color="#3f6d52"/><stop offset="1" stop-color="#1c3328"/></radialGradient>'+
      '<linearGradient id="yy-d9-skin" x1="12%" y1="5%" x2="88%" y2="100%"><stop offset="0" class="yy-d9-skin-hi"/><stop offset=".49" class="yy-d9-skin-mid"/><stop offset="1" class="yy-d9-skin-low"/></linearGradient>'+
      '<linearGradient id="yy-d16-wing" x1="0" y1="0" x2=".86" y2="1"><stop offset="0" class="yy-d16-wing-hi"/><stop offset=".56" class="yy-d16-wing-mid"/><stop offset="1" class="yy-d16-wing-low"/></linearGradient>'+
      '<linearGradient id="yy-d12-tail" x1="5%" y1="5%" x2="90%" y2="90%"><stop offset="0" class="yy-d12-tail-hi"/><stop offset=".52" class="yy-d12-tail-mid"/><stop offset="1" class="yy-d12-tail-low"/></linearGradient>'+
      '<linearGradient id="yy-d12-unicorn" x1="5%" y1="0%" x2="92%" y2="100%"><stop offset="0" class="yy-d12-horn-hi"/><stop offset=".58" class="yy-d12-horn-mid"/><stop offset="1" class="yy-d12-horn-low"/></linearGradient>'+
      '<linearGradient id="yy-d9-muzzle" x1="15%" y1="0%" x2="78%" y2="100%"><stop offset="0" class="yy-d9-muzzle-hi"/><stop offset="1" class="yy-d9-muzzle-low"/></linearGradient>'+
      '<linearGradient id="yy-lotus" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a8f4ff"/><stop offset="1" stop-color="#778ef4"/></linearGradient>'+
    '</defs>'+
    '<g>'+
      '<ellipse cx="360" cy="404" rx="280" ry="46" class="yy-grove"/>'+
      '<path d="M120 392Q168 348 214 390Q250 338 300 388Q338 342 392 390Q430 336 492 388Q530 350 600 394Q500 430 360 412Q220 430 120 392Z" class="yy-petal yy-petal-a"/>'+
      '<path d="M168 398Q214 360 258 396Q300 354 360 398Q414 352 468 396Q508 366 552 400Q470 424 360 410Q250 424 168 398Z" class="yy-petal yy-petal-b"/>'+
      '<path d="M250 386Q300 352 360 388Q420 350 470 388Q410 404 360 398Q310 404 250 386Z" class="yy-petal yy-petal-c"/>'+
      '<path d="M80 360Q110 330 132 362M588 356Q612 328 636 360" class="yy-frond"/>'+
    '</g>'+
    '<g class="yy-pose-container">'+poses.map(drawing).join('')+'</g>'+
  '</svg>';
  window.YIN_YANG_ART=Object.freeze({poses:Object.freeze(poses),markup});
})();
