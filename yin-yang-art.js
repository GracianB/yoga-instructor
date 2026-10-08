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
      path('M-61-49C-79-66-84-103-70-126C-64-102-48-81-37-64L-43-53Z','yy-dragon-horn yy-horn-left')+
      path('M43-64C55-84 65-105 73-126C86-102 81-66 62-48L43-53Z','yy-dragon-horn yy-horn-right')+
      path('M-65-108Q-64-78-49-59M66-109Q67-81 54-59','yy-dragon-horn-ridge')+
      path('M-73-93Q-71-83-66-74M73-93Q71-83 66-74M-62-67L-57-59M62-67L57-59','yy-d11-horn-engraving')+
      path('M-59-43C-79-66-95-88-103-108C-111-78-93-48-76-27Z','yy-dragon-sidefin yy-fin-left')+
      path('M59-43C79-66 95-88 103-108C111-78 93-48 76-27Z','yy-dragon-sidefin yy-fin-right')+
      path('M-77-48Q-90-75-97-92M78-48Q90-75 97-92','yy-dragon-fin-vein')+
      path('M-72-45C-52-83-17-84 1-80C40-88 71-66 78-45C96-22 91 8 83 29C93 53 76 75 52 79C31 94 15 102 0 102C-15 102-34 94-53 78C-78 73-94 51-83 27C-93 4-91-25-72-45Z','yy-fur yy-outline yy-head-shell')+
      path('M-71-37Q-49-76-19-66L-28-89Q-7-77 4-74Q37-89 72-47Q42-56 28-38Q2-48-23-37L-48-21Z','yy-crest yy-outline yy-dragon-crest')+
      path('M-60-34Q-42-58-24-57M26-60Q52-62 63-36','yy-mane-light')+
      path('M-50-37Q-41-52-27-50M24-54Q43-54 53-40','yy-d11-crest-engraving')+
      '<g class="yy-dragon-forelock">'+
        path('M-24-68Q-6-92 8-79Q18-68 27-51Q7-62-13-48Z','yy-dragon-forelock-fill')+
        path('M-13-72Q0-78 10-70','yy-dragon-forelock-sheen')+'</g>'+
      path('M-75 14C-69 3-52-4-35 2C-15 15-18 42-27 57Q-57 81-78 50Z','yy-cheek yy-dragon-cheek')+
      path('M75 14C69 3 52-4 35 2C15 15 18 42 27 57Q57 81 78 50Z','yy-cheek yy-dragon-cheek')+
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
      path('M-53-7Q-36-17-18-9M18-9Q36-17 53-7','yy-sleep-brow')+eyes+
      path('M-63-11Q-60-21-47-18M47-18Q60-21 63-11','yy-dragon-temple-scales')+
      path('M-57 34Q-53 29-46 30M46 30Q53 29 57 34','yy-dragon-cheek-light')+
      path('M-58 18Q-47 15-41 19M58 18Q47 15 41 19','yy-d11-cheek-engraving')+
      circle(-57,42,2.8,'yy-dragon-freckle')+circle(-65,46,1.6,'yy-dragon-freckle')+
      circle(57,42,2.8,'yy-dragon-freckle')+circle(65,46,1.6,'yy-dragon-freckle')+
      path('M-34 49Q-72 35-105 43','yy-whisker yy-dragon-whisker yy-whisker-left yy-whisker-high')+
      path('M-34 61Q-66 63-98 84','yy-whisker yy-dragon-whisker yy-whisker-left yy-whisker-low')+
      path('M34 49Q72 35 105 43','yy-whisker yy-dragon-whisker yy-whisker-right yy-whisker-high')+
      path('M34 61Q66 63 98 84','yy-whisker yy-dragon-whisker yy-whisker-right yy-whisker-low')+'</g>';
  };
  const torso=p=>{
    const [x,y,rx,ry,r]=p.body;
    const horizontal=ry<60;
    return '<g class="yy-torso" data-kind="'+p.kind+'" transform="translate('+x+' '+y+') rotate('+r+')">'+
      '<path d="M-'+fmt(rx*.86)+' -'+fmt(ry*.57)+
      'Q-'+fmt(rx*.94)+' -'+fmt(ry*.05)+' -'+fmt(rx*.9)+' '+fmt(ry*.55)+
      'Q0 '+fmt(ry*1.15)+' '+fmt(rx*.86)+' '+fmt(ry*.55)+
      'Q'+fmt(rx*1.04)+' 0 '+fmt(rx*.92)+' -'+fmt(ry*.55)+
      'Q0 -'+fmt(ry*1.1)+' -'+fmt(rx*.86)+' -'+fmt(ry*.57)+'Z" class="yy-fur yy-outline"'+(p.kind==="table"?' data-asana-back="true"':'')+'/>'+
      (p.kind==="table"?
        '<path d="M-95 27Q0 42 95 27Q0 56 -95 27Z" class="yy-belly-shade" data-asana-belly="true"/>'+
        '<path d="M-105 -24Q0 -58 104 -24" class="yy-back-highlight" data-asana-spine="true"/>':
      '<path d="M-'+fmt(rx*.71)+' -'+fmt(ry*.34)+'Q0 -'+fmt(ry*.78)+' '+fmt(rx*.67)+' -'+fmt(ry*.25)+'" class="yy-shoulder-shine"/>')+
      '<ellipse class="yy-belly" cx="0" cy="'+fmt(ry*.18)+'" rx="'+fmt(rx*.42)+'" ry="'+fmt(ry*.34)+'"/>'+
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
    return '<g transform="'+toTransform(x,y,s,r)+'" class="yy-tail">'+
      path('M-8 0Q48-35 96-4Q133 25 125 71Q120 106 83 110Q37 113 8 82Q38 96 68 73Q102 45 64 31Q24 17-8 0Z','yy-tail-main yy-outline')+
      path('M32 3Q70-12 100 20Q114 44 99 70','yy-tail-band')+
      path('M23 79Q57 105 81 92','yy-tail-band')+
      path('M31 14Q57 12 72 27M91 61Q87 77 75 80','yy-tail-glint')+
      path('M81 107Q113 98 132 73Q142 105 117 126Q98 134 81 107Z','yy-dragon-tail-fin')+
      path('M91 110Q117 112 126 94','yy-dragon-tail-fin-vein')+
      path('M32 2L42-14L49 8M58 9L71-12L77 19M91 31L108 20L108 47','yy-dragon-tail-spines')+
      '<path d="M9 78L-3 70L13 91Q40 118 83 110Q48 111 9 78Z" class="yy-tail-fur"/>'+
      '</g>';
  };
  const stance=p=>{
    const grounded=p.kind==="table"?p.hands.concat(p.feet):
      p.kind==="warrior"?p.feet:
      p.kind==="tree"?p.feet.slice(0,1):[];
    if(!grounded.length)return "";
    return '<g class="yy-stance">'+grounded.map(([x,y])=>
      '<ellipse class="yy-stance-shadow" cx="'+x+'" cy="'+(y+16)+
      '" rx="26" ry="6"/>').join('')+'</g>';
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
      '<g class="yy-legs">'+twoLegs+feet+'</g>'+torso(p)+
      '<g class="yy-arms">'+twoArms+hands+'</g>'+
      '<g class="yy-head-motion">'+face(p)+'</g>'+
      '</g></g>';
  };
  const markup=()=>'<svg class="yy-svg" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yin Yang yoga character">'+
    '<defs>'+
      '<linearGradient id="yy-fur-grad" x1="0" y1="0" x2=".9" y2="1"><stop class="yy-fur-stop-hi" offset="0"/><stop class="yy-fur-stop-mid" offset=".55"/><stop class="yy-fur-stop-low" offset="1"/></linearGradient>'+
      '<linearGradient id="yy-mane-grad" x1="0" y1="0" x2="1" y2="1"><stop class="yy-mane-stop-hi" offset="0"/><stop class="yy-mane-stop-low" offset="1"/></linearGradient>'+
      '<radialGradient id="yy-gaze-grad" cx="40%" cy="35%"><stop offset="0" stop-color="#c9e6cf"/><stop offset=".55" stop-color="#3f6d52"/><stop offset="1" stop-color="#1c3328"/></radialGradient>'+
      '<linearGradient id="yy-d9-skin" x1="12%" y1="5%" x2="88%" y2="100%"><stop offset="0" class="yy-d9-skin-hi"/><stop offset=".49" class="yy-d9-skin-mid"/><stop offset="1" class="yy-d9-skin-low"/></linearGradient>'+
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
