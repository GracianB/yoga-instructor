/* YIN × YANG | original, pose-authored vector mascot. Zero limb morphing. */
(() => {
  "use strict";
  const poses = [
    {id:"start",name:["Soltar el peso","Let the weight go"],cue:["Apoya el cuerpo y baja el ritmo.","Rest your body and slow down."],kind:"rest",body:[349,315,119,47,-8],head:[222,293,.79,-22,"closed"],arms:["M282 325Q254 348 226 356","M320 336Q290 359 274 368"],legs:["M425 322Q485 329 523 346","M423 300Q487 296 532 317"],hands:[[226,356],[274,368]],feet:[[523,346],[532,317]],tail:[439,291,1,-8]},
    {id:"centering",name:["Volver al centro","Find your centre"],cue:["Baja la mirada y encuentra apoyo.","Lower your gaze and find your ground."],kind:"seat",body:[360,266,65,87,0],head:[360,145,.87,0,"soft"],arms:["M310 231Q288 282 316 304","M409 231Q432 283 402 304"],legs:["M328 324Q278 354 244 337","M390 324Q441 354 477 337"],hands:[[316,304],[402,304]],feet:[[244,337],[477,337]],tail:[426,290,.65,5]},
    {id:"breath",name:["Respirar 4 · 7 · 8","Breathe 4 · 7 · 8"],cue:["Inhala cuatro, sostén siete, exhala ocho.","Inhale four, hold seven, exhale eight."],kind:"breath",body:[360,260,67,87,0],head:[361,141,.86,0,"soft"],arms:["M305 227Q266 243 250 282","M414 227Q450 243 470 282"],legs:["M324 321Q282 352 245 335","M394 321Q440 352 476 335"],hands:[[250,282],[470,282]],feet:[[245,335],[476,335]],tail:[433,276,.64,-8]},
    {id:"warmup",name:["Despertar el cuerpo","Wake your body"],cue:["A cuatro apoyos, moviliza suavemente la columna.","On all fours, move your spine gently."],kind:"table",body:[364,267,131,52,-5],head:[223,236,.73,-18,"open"],arms:["M292 283Q270 325 258 367","M329 290Q319 337 316 366"],legs:["M429 279Q455 318 451 368","M461 252Q509 287 505 363"],hands:[[258,367],[316,366]],feet:[[451,368],[505,363]],tail:[461,238,.83,-24]},
    {id:"pose-1",name:["Guerrero II","Warrior II"],cue:["Abre los brazos, afianza tus pies y mira al frente.","Open your arms, ground your feet and look ahead."],kind:"warrior",body:[357,230,62,86,-3],head:[358,123,.79,-13,"focus"],arms:["M309 190Q239 183 155 190","M407 195Q484 184 562 192"],legs:["M322 299Q298 308 272 325Q264 355 253 378","M391 304Q460 311 474 343Q495 360 536 383"],hands:[[155,190],[562,192]],feet:[[253,378],[536,383]],tail:[426,261,.68,10]},
    {id:"transition",name:["Fluir con presencia","Flow with presence"],cue:["Cambia de postura sin prisa, con una exhalación.","Move into the next pose with a long exhale."],kind:"flow",body:[372,238,67,87,19],head:[338,131,.81,-18,"open"],arms:["M326 189Q269 138 257 95","M415 201Q461 235 504 253"],legs:["M351 304Q291 335 240 378","M415 306Q468 350 520 381"],hands:[[257,95],[504,253]],feet:[[240,378],[520,381]],tail:[437,256,.63,27]},
    {id:"pose-2",name:["Árbol del equilibrio","Tree of balance"],cue:["Busca un punto estable y sostén tu equilibrio.","Find a steady point and hold your balance."],kind:"tree",body:[359,223,63,85,0],head:[358,115,.79,0,"focus"],arms:["M311 186Q280 117 333 83","M407 186Q445 118 384 83"],legs:["M343 298Q349 339 353 387","M391 302Q450 310 423 336Q402 342 355 313"],hands:[[333,83],[384,83]],feet:[[353,387],[355,313]],tail:[426,260,.75,-6]},
    {id:"cooldown",name:["Postura del niño","Child's pose"],cue:["Recoge la energía y descansa la frente.","Fold inward and let your forehead rest."],kind:"child",body:[376,304,117,58,8],head:[264,319,.68,-43,"closed"],arms:["M309 333Q242 357 185 366","M340 344Q269 376 214 379"],legs:["M429 320Q446 364 400 369","M447 304Q489 350 454 365"],hands:[[185,366],[214,379]],feet:[[400,369],[454,365]],tail:[452,280,.66,28]},
    {id:"savasana",name:["Savasana","Savasana"],cue:["Afloja el cuerpo. No hay nada que conseguir.","Release your body. There is nothing to achieve."],kind:"savasana",body:[362,311,128,45,-3],head:[225,294,.79,-72,"closed"],arms:["M288 309Q270 344 253 365","M360 339Q357 369 331 379"],legs:["M438 310Q495 304 546 319","M445 326Q498 342 555 345"],hands:[[253,365],[331,379]],feet:[[546,319],[555,345]],tail:[455,283,.72,-6]},
    {id:"finish",name:["Un instante de gratitud","A moment of gratitude"],cue:["Junta las manos. Llévate esta calma contigo.","Bring your hands together. Carry this calm with you."],kind:"finish",body:[359,263,65,88,0],head:[359,142,.87,0,"smile"],arms:["M309 231Q300 268 346 263","M411 231Q425 268 373 263"],legs:["M323 326Q280 354 243 338","M395 326Q440 354 476 338"],hands:[[346,263],[373,263]],feet:[[243,338],[476,338]],tail:[425,283,.67,10]}
  ];
  const fmt=n=>Number(n).toFixed(1).replace(/\.0$/,"");
  const circle=(x,y,r,cls)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+cls+'"/>';
  const path=(d,cls)=>'<path d="'+d+'" class="'+cls+'"/>';
  // Organic, tapered limb meshes from authored Bézier pose paths.
  // Exactly two arm meshes + two leg meshes per pose, never generated extra limbs.
  const limb=(d,type,i)=>{
    const n=(d.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    // One or two hand-authored quadratic sections. The latter creates an actual
    // joint without smoothing an anatomical knee into a rubber-hose diagonal.
    if(n.length!==6 && n.length!==10)throw Error("Pose limb must have one or two quadratic sections: "+d);
    const pieces=[n.slice(0,6)];
    if(n.length===10)pieces.push([n[4],n[5],n[6],n[7],n[8],n[9]]);
    const radius=type==="leg"?23:17;
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
    const silhouette="M"+f(a[0])+"L"+a.slice(1).map(f).join("L")+
      "Q"+f(finish)+" "+f(b[b.length-1])+
      "L"+b.slice(0,-1).reverse().map(f).join("L")+
      "Q"+f(start)+" "+f(a[0])+"Z";
    return '<g class="yy-limb-unit">'+
      '<path d="'+silhouette+'" class="yy-limb yy-'+type+'" data-limb="'+type+'-'+i+'"/>'+
      '<path d="'+d+'" class="yy-limb-lustre yy-'+type+'-lustre"/>'+
      '</g>';
  };
  const point=(xy,cls)=>{
    const [x,y]=xy;
    return '<g transform="translate('+x+' '+y+')" class="yy-paw-group">'+
      '<path d="M-18-3Q-16-15-4-15Q15-18 20-5Q24 11 12 17Q-2 22-15 12Q-22 6-18-3Z" class="'+cls+'"/>'+
      '<path d="M-10-8Q-5-14 1-11M3-11Q10-13 13-6" class="yy-paw-toes"/>'+
      '<path d="M-12 5Q-4 12 5 10" class="yy-paw-gloss"/>'+
      '</g>';
  };
  const toTransform=(x,y,s,r)=>'translate('+x+' '+y+') rotate('+r+') scale('+s+')';
  const face=(p)=>{
    const [x,y,s,r,eye]=p.head;
    const shut=eye==="closed",focus=eye==="focus",soft=eye==="soft";
    // A living botanical gaze: soft matte almond, visible iris and tiny glint.
    // No bright white eyeball, rings or oversized cartoon pupils.
    const almondLeft=soft?'M-60 12Q-38 6-16 12Q-37 22-60 12Z':
      focus?'M-60 13Q-40 4-17 12Q-35 24-60 13Z':
            'M-60 12Q-39-2-16 11Q-32 29-60 12Z';
    const almondRight=soft?'M17 12Q40 6 62 12Q44 22 17 12Z':
      focus?'M17 12Q39 3 61 11Q45 24 17 12Z':
            'M17 11Q39-3 62 12Q46 28 17 11Z';
    const gx = focus ? 3.2 : soft ? -1.6 : 0.4;
    const gy = focus ? -0.6 : soft ? 2.4 : 0.8;
    const lid = shut ? 18 : soft ? 7 : focus ? 1 : 3;
    const eyeUnit = (cx, side) => {
      const id = "yy-clip-"+p.id+"-"+side;
      return '<g class="yy-eye-unit" transform="translate('+cx+' 8)">'+
        '<clipPath id="'+id+'"><path d="M-20 3Q-11-13 0-11Q12-14 21 2Q11 15 0 15Q-12 15-20 3Z"/></clipPath>'+
        '<g clip-path="url(#'+id+')">'+
          '<ellipse cx="'+gx+'" cy="'+(2+gy)+'" rx="10.5" ry="11.5" class="yy-iris"/>'+
          '<ellipse cx="'+gx+'" cy="'+(4+gy)+'" rx="3.6" ry="6.4" class="yy-pupil"/>'+
          '<circle cx="'+(gx-3.2)+'" cy="'+(gy-1.4)+'" r="1.15" class="yy-glint"/>'+
          '<path d="M-24 -16Q0 '+(-18+lid)+' 24 -14L24 22L-24 22Z" class="yy-lid"/>'+
        '</g>'+
        '<path d="M-20 3Q-8-15 0-12Q11-16 21 2" class="yy-lid-line"/>'+
        '<path d="M-16 -1Q-6-8 2-2" class="yy-brow"/>'+
      '</g>';
    };
    const eyes = shut
      ? path('M-58 12Q-36 24-16 11M16 11Q38 24 58 10','yy-eye-closed')+path('M-54 4Q-36 0-20 7M20 6Q38 0 54 5','yy-sleep-brow')
      : '<g class="yy-anim-eyes">'+eyeUnit(-38,"l")+eyeUnit(38,"r")+'</g>';
    return '<g class="yy-head" transform="'+toTransform(x,y,s,r)+'">'+
      // Strong ear silhouette with contrasting inner pattern.
      path('M-54-35Q-96-55-100-116Q-49-108-20-63Z','yy-fur yy-outline')+
      path('M33-64Q62-114 100-113Q104-60 64-31Z','yy-fur yy-outline')+
      path('M-57-51Q-82-74-85-99Q-53-87-37-60Z','yy-ear-inner')+
      path('M51-62Q70-91 87-98Q83-70 61-47Z','yy-ear-inner')+
      path('M-77-56Q-63-102-38-78L-20-44','yy-ear-light')+
      path('M45-72Q69-101 85-91','yy-ear-light')+
      // Furred head and sculpted cheeks, not an oval or disconnected discs.
      path('M-69-37Q-48-84-6-82Q51-91 79-42Q95-17 80 20Q98 43 70 63L56 56Q42 86 4 88Q-38 94-57 66L-78 72Q-101 53-84 23Q-93-6-69-37Z','yy-fur yy-outline')+
      path('M-80 28L-108 22Q-92 44-102 53L-81 47Q-86 66-70 70L-51 52','yy-fur-fringe')+
      path('M78 27L103 24Q92 44 108 54L82 48Q93 66 72 73L52 50','yy-fur-fringe')+
      path('M-58-31Q-25-66 4-57Q28-69 56-34Q80-19 73-1Q54-9 43 7Q21-6 10-4Q-22-15-42 8Q-57-7-72 4Q-81-14-58-31Z','yy-face-mask')+
      path('M-61-39Q-27-82-8-67L3-87L19-65Q52-77 76-37Q52-42 29-21L7-35L-17-15L-38-23L-64-9Q-72-26-61-39Z','yy-crest yy-outline')+
      path('M-58-31Q-45-63-22-56M17-63Q44-65 60-40','yy-mane-light')+
      // A sliver of the other form's energy lives in the forelock.
      path('M-13-64Q1-80 11-64L16-45L1-33L-13-45Z','yy-opposite-lock')+
      path('M-63 13Q-49-7-29 0Q-11 18-20 48Q-42 70-66 53Z','yy-cheek')+
      path('M27 15Q48-9 68 6Q84 26 64 56Q36 73 17 50Z','yy-cheek')+
      path('M-60 42Q-45 51-29 48M35 48Q51 53 65 40','yy-cheek-shine')+
      eyes+
      '<path d="M-23 44Q-18 33 3 33Q27 32 32 43Q34 59 9 66Q-21 66-23 44Z" class="yy-muzzle"/>'+
      '<path d="M0 42Q6 38 13 42Q11 49 6 49Q0 47 0 42Z" class="yy-nose"/>'+
      path(eye==="smile"?'M-9 53Q6 65 21 53':'M-7 54Q7 59 19 53','yy-smile')+
      path('M6 48L5 56','yy-mouth-mark')+
      path('M-68 11L-75 19L-65 20M65 11L74 19L64 21','yy-face-streak')+
      path('M-51-2L-44-8L-36 0M43-2L50-8L58 0','yy-temple-mark')+
      path('M-5-51L7-74L24-51L7-40Z','yy-crown-mark')+
      path('M6-66L16-52L7-45Z','yy-crown-shine')+
      '</g>';
  };
  const torso=p=>{
    const [x,y,rx,ry,r]=p.body;
    const horizontal=ry<60;
    return '<g class="yy-torso" transform="translate('+x+' '+y+') rotate('+r+')">'+
      // broad shoulders / taper into hips. The lower centre stays connected to the legs.
      '<path d="M-'+fmt(rx*.75)+' -'+fmt(ry*.57)+
      'Q-'+fmt(rx*.94)+' -'+fmt(ry*.05)+' -'+fmt(rx*.78)+' '+fmt(ry*.55)+
      'Q0 '+fmt(ry*1.15)+' '+fmt(rx*.75)+' '+fmt(ry*.55)+
      'Q'+fmt(rx*1.04)+' 0 '+fmt(rx*.8)+' -'+fmt(ry*.55)+
      'Q0 -'+fmt(ry*1.1)+' -'+fmt(rx*.75)+' -'+fmt(ry*.57)+'Z" class="yy-fur yy-outline"'+(p.kind==="table"?' data-asana-back="true"':'')+'/>'+
      (p.kind==="table"?
        '<path d="M-95 27Q0 42 95 27Q0 56 -95 27Z" class="yy-belly-shade" data-asana-belly="true"/>'+
        '<path d="M-105 -24Q0 -58 104 -24" class="yy-back-highlight" data-asana-spine="true"/>':
      '<path d="M-'+fmt(rx*.71)+' -'+fmt(ry*.34)+'Q0 -'+fmt(ry*.78)+' '+fmt(rx*.67)+' -'+fmt(ry*.25)+'" class="yy-shoulder-shine"/>')+
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
      '</g>';
  };
  const tail=p=>{
    const [x,y,s,r]=p.tail;
    return '<g transform="'+toTransform(x,y,s,r)+'" class="yy-tail">'+
      path('M-8 0Q48-35 96-4Q133 25 125 71Q120 106 83 110Q37 113 8 82Q38 96 68 73Q102 45 64 31Q24 17-8 0Z','yy-tail-main yy-outline')+
      path('M32 3Q70-12 100 20Q114 44 99 70','yy-tail-band')+
      path('M23 79Q57 105 81 92','yy-tail-band')+
      path('M31 14Q57 12 72 27M91 61Q87 77 75 80','yy-tail-glint')+
      '<path d="M9 78L-3 70L13 91Q40 118 83 110Q48 111 9 78Z" class="yy-tail-fur"/>'+
      '</g>';
  };
  // Contact shadows are attached only to load-bearing paws, not floating feet.
  // They make the Cat-Cow, Warrior and Tree poses read as balanced and grounded.
  const stance=p=>{
    const grounded=p.kind==="table"?p.hands.concat(p.feet):
      p.kind==="warrior"?p.feet:
      p.kind==="tree"?p.feet.slice(0,1):[];
    if(!grounded.length)return "";
    return '<g class="yy-stance" aria-hidden="true">'+grounded.map(([x,y])=>
      '<ellipse class="yy-stance-shadow" cx="'+x+'" cy="'+(y+16)+
      '" rx="26" ry="6"/>').join('')+'</g>';
  };
  const drawing=p=>{
    const twoLegs=p.legs.map((d,i)=>limb(d,'leg',i)).join('');
    const twoArms=p.arms.map((d,i)=>limb(d,'arm',i)).join('');
    const feet=p.feet.map(pos=>point(pos,'yy-paw yy-foot')).join('');
    const hands=p.hands.map(pos=>point(pos,'yy-paw yy-hand')).join('');
    return '<g data-pose="'+p.id+'" class="yy-pose yy-pose-'+p.kind+'" aria-hidden="true">'+
      stance(p)+'<g class="yy-character"><g class="yy-tail-motion">'+tail(p)+'</g>'+
      '<g class="yy-legs">'+twoLegs+feet+'</g>'+torso(p)+
      '<g class="yy-arms">'+twoArms+hands+'</g>'+
      '<g class="yy-head-motion">'+face(p)+'</g>'+
      '</g></g>';
  };
  const markup=()=>'<svg class="yy-svg" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yin Yang yoga character">'+
    '<defs>'+
      '<linearGradient id="yy-fur-grad" x1="0" y1="0" x2=".9" y2="1"><stop class="yy-fur-stop-hi" offset="0"/><stop class="yy-fur-stop-mid" offset=".55"/><stop class="yy-fur-stop-low" offset="1"/></linearGradient>'+
      '<linearGradient id="yy-mane-grad" x1="0" y1="0" x2="1" y2="1"><stop class="yy-mane-stop-hi" offset="0"/><stop class="yy-mane-stop-low" offset="1"/></linearGradient>'+
      '<radialGradient id="yy-iris-grad" cx="40%" cy="35%"><stop offset="0" stop-color="#c9e6cf"/><stop offset=".55" stop-color="#3f6d52"/><stop offset="1" stop-color="#1c3328"/></radialGradient>'+
      '<linearGradient id="yy-lotus" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a8f4ff"/><stop offset="1" stop-color="#778ef4"/></linearGradient>'+
    '</defs>'+
    '<g class="yy-forest" aria-hidden="true">'+
      '<ellipse cx="360" cy="404" rx="280" ry="46" class="yy-grove"/>'+
      '<path d="M120 392Q168 348 214 390Q250 338 300 388Q338 342 392 390Q430 336 492 388Q530 350 600 394Q500 430 360 412Q220 430 120 392Z" class="yy-petal yy-petal-a"/>'+
      '<path d="M168 398Q214 360 258 396Q300 354 360 398Q414 352 468 396Q508 366 552 400Q470 424 360 410Q250 424 168 398Z" class="yy-petal yy-petal-b"/>'+
      '<path d="M250 386Q300 352 360 388Q420 350 470 388Q410 404 360 398Q310 404 250 386Z" class="yy-petal yy-petal-c"/>'+
      '<path d="M80 360Q110 330 132 362M588 356Q612 328 636 360" class="yy-frond"/>'+
    '</g>'+
    '<g class="yy-pose-container">'+poses.map(drawing).join('')+'</g>'+
    '<g class="yy-stars" aria-hidden="true"><path d="M150 135l7 17 18 5-18 6-7 17-6-17-17-6 17-5Z"/><path d="M582 99l5 13 14 5-14 4-5 13-5-13-14-4 14-5Z"/><circle cx="544" cy="222" r="3"/><circle cx="182" cy="240" r="2.5"/></g>'+
  '</svg>';
  window.YIN_YANG_ART=Object.freeze({poses:Object.freeze(poses),markup});
})();
