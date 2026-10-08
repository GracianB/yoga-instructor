/* YIN × YANG | original, pose-authored vector mascot. Zero limb morphing. */
(() => {
  "use strict";
  const poses = [
    {id:"start",name:["Soltar el peso","Let the weight go"],cue:["Apoya el cuerpo y baja el ritmo.","Rest your body and slow down."],kind:"rest",body:[349,315,119,47,-8],head:[222,293,.79,-22,"closed"],arms:["M282 325Q254 348 226 356","M320 336Q290 359 274 368"],legs:["M425 322Q485 329 523 346","M423 300Q487 296 532 317"],hands:[[226,356],[274,368]],feet:[[523,346],[532,317]],tail:[439,291,1,-8]},
    {id:"centering",name:["Volver al centro","Find your centre"],cue:["Cierra los ojos y encuentra apoyo.","Close your eyes and find your ground."],kind:"seat",body:[360,266,65,87,0],head:[360,145,.87,0,"closed"],arms:["M310 231Q288 282 316 304","M409 231Q432 283 402 304"],legs:["M328 324Q278 354 244 337","M390 324Q441 354 477 337"],hands:[[315,301],[404,301]],feet:[[244,337],[477,337]],tail:[426,290,.65,5]},
    {id:"breath",name:["Respirar 4 · 7 · 8","Breathe 4 · 7 · 8"],cue:["Inhala cuatro, sostén siete, exhala ocho.","Inhale four, hold seven, exhale eight."],kind:"breath",body:[360,260,67,87,0],head:[361,141,.86,0,"closed"],arms:["M305 227Q266 243 250 282","M414 227Q450 243 470 282"],legs:["M324 321Q282 352 245 335","M394 321Q440 352 476 335"],hands:[[250,282],[470,282]],feet:[[245,335],[476,335]],tail:[433,276,.64,-8]},
    {id:"warmup",name:["Despertar el cuerpo","Wake your body"],cue:["A cuatro apoyos, moviliza suavemente la columna.","On all fours, move your spine gently."],kind:"table",body:[364,267,131,52,-5],head:[223,236,.73,-18,"open"],arms:["M292 283Q270 325 258 367","M329 290Q319 337 316 366"],legs:["M429 279Q455 318 451 368","M461 252Q509 287 505 363"],hands:[[258,367],[316,366]],feet:[[451,368],[505,363]],tail:[461,238,.83,-24]},
    {id:"pose-1",name:["Guerrero II","Warrior II"],cue:["Abre los brazos, afianza tus pies y mira al frente.","Open your arms, ground your feet and look ahead."],kind:"warrior",body:[357,230,62,86,-3],head:[358,123,.79,-13,"focus"],arms:["M309 190Q239 183 155 190","M407 195Q484 184 562 192"],legs:["M322 299Q275 324 253 378","M391 304Q467 331 536 383"],hands:[[155,190],[562,192]],feet:[[253,378],[536,383]],tail:[426,261,.68,10]},
    {id:"transition",name:["Fluir con presencia","Flow with presence"],cue:["Cambia de postura sin prisa, con una exhalación.","Move into the next pose with a long exhale."],kind:"flow",body:[372,238,67,87,19],head:[338,131,.81,-18,"open"],arms:["M326 189Q269 138 257 95","M415 201Q461 235 504 253"],legs:["M351 304Q291 335 240 378","M415 306Q468 350 520 381"],hands:[[257,95],[504,253]],feet:[[240,378],[520,381]],tail:[437,256,.63,27]},
    {id:"pose-2",name:["Árbol del equilibrio","Tree of balance"],cue:["Busca un punto estable y sostén tu equilibrio.","Find a steady point and hold your balance."],kind:"tree",body:[359,223,63,85,0],head:[358,115,.79,0,"focus"],arms:["M311 186Q280 117 333 83","M407 186Q445 118 384 83"],legs:["M343 298Q350 351 353 387","M391 302Q452 310 386 322"],hands:[[333,83],[384,83]],feet:[[353,387],[386,322]],tail:[426,260,.75,-6]},
    {id:"cooldown",name:["Postura del niño","Child's pose"],cue:["Recoge la energía y descansa la frente.","Fold inward and let your forehead rest."],kind:"child",body:[376,304,117,58,8],head:[264,319,.68,-43,"closed"],arms:["M309 333Q242 357 185 366","M340 344Q269 376 214 379"],legs:["M429 320Q446 364 400 369","M447 304Q489 350 454 365"],hands:[[185,366],[214,379]],feet:[[400,369],[454,365]],tail:[452,280,.66,28]},
    {id:"savasana",name:["Savasana","Savasana"],cue:["Afloja el cuerpo. No hay nada que conseguir.","Release your body. There is nothing to achieve."],kind:"savasana",body:[362,311,128,45,-3],head:[225,294,.79,-72,"closed"],arms:["M288 309Q270 344 253 365","M360 339Q357 369 331 379"],legs:["M438 310Q495 304 546 319","M445 326Q498 342 555 345"],hands:[[253,365],[331,379]],feet:[[546,319],[555,345]],tail:[455,283,.72,-6]},
    {id:"finish",name:["Un instante de gratitud","A moment of gratitude"],cue:["Junta las manos. Llévate esta calma contigo.","Bring your hands together. Carry this calm with you."],kind:"finish",body:[359,263,65,88,0],head:[359,142,.87,0,"smile"],arms:["M309 231Q300 268 346 263","M411 231Q425 268 373 263"],legs:["M323 326Q280 354 243 338","M395 326Q440 354 476 338"],hands:[[346,263],[373,263]],feet:[[243,338],[476,338]],tail:[425,283,.67,10]}
  ];
  const fmt=n=>Number(n).toFixed(1).replace(/\.0$/,"");
  const circle=(x,y,r,cls)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+cls+'"/>';
  const path=(d,cls)=>'<path d="'+d+'" class="'+cls+'"/>';
  const limb=(d,type,i)=>'<path d="'+d+'" class="yy-limb yy-'+type+'" data-limb="'+type+'-'+i+'" fill="none"/>';
  const point=(xy,cls)=>'<ellipse cx="'+xy[0]+'" cy="'+xy[1]+'" rx="13" ry="11" class="'+cls+'"/>';
  const toTransform=(x,y,s,r)=>'translate('+x+' '+y+') rotate('+r+') scale('+s+')';
  const face=(p)=>{
    const [x,y,s,r,eye]=p.head;
    const shut=eye==="closed";
    const focused=eye==="focus";
    return '<g class="yy-head" transform="'+toTransform(x,y,s,r)+'">'+
      path('M-66-22Q-94-99-39-76L-29-42Z','yy-fur yy-outline')+
      path('M43-44Q78-111 90-61L62-11Z','yy-fur yy-outline')+
      path('M-61-34Q-77-82-49-68L-41-31Z','yy-ear-inner')+
      path('M55-42Q76-88 78-65L64-27Z','yy-ear-inner')+
      path('M-76-20Q-93-58-66-77Q-39-80-17-56Q18-91 68-55Q91-26 79 30Q70 75 25 86Q-27 94-65 55Q-89 32-76-20Z','yy-fur yy-outline')+
      path('M-75-13Q-56-59-31-57L-15-34Q9-74 42-48Q59-39 77-14Q42-23 17-13Q-16-22-48 3Z','yy-mane yy-outline')+
      path('M-63 10Q-49-8-28-3Q-13 9-11 34Q-31 58-57 43Z','yy-cheek')+
      path('M19 29Q29-3 48-2Q68-6 73 22Q72 54 43 62Z','yy-cheek')+
      (shut?
        path('M-50 17Q-35 32-18 17M21 17Q39 30 53 12','yy-eye-closed') :
        '<ellipse cx="-36" cy="16" rx="17" ry="'+(focused?15:20)+'" class="yy-eye-white"/>'+
        '<ellipse cx="37" cy="15" rx="17" ry="'+(focused?15:20)+'" class="yy-eye-white"/>'+
        '<ellipse cx="-34" cy="17" rx="12" ry="'+(focused?11:15)+'" class="yy-iris"/>'+
        '<ellipse cx="39" cy="15" rx="12" ry="'+(focused?11:15)+'" class="yy-iris"/>'+
        circle(-40,10,4,'yy-spark-eye')+circle(34,8,4,'yy-spark-eye')+
        path('M-57 1Q-41-9-22 0M19-1Q37-12 55-2','yy-brow'))+
      '<ellipse cx="5" cy="48" rx="28" ry="21" class="yy-muzzle"/>'+
      path('M-4 42Q5 36 14 42L6 51Z','yy-nose')+
      path(eye==="smile"?'M-10 55Q5 69 22 54':'M-7 55Q7 61 18 53','yy-smile')+
      path('M-70-16Q-58-51-36-50M16-59Q54-59 73-24','yy-hairline')+
      '<path d="M-2-57L12-78L22-50Z" class="yy-crown-mark"/>'+
      '</g>';
  };
  const torso=p=>{
    const [x,y,rx,ry,r]=p.body;
    return '<g class="yy-torso" transform="translate('+x+' '+y+') rotate('+r+')">'+
      '<ellipse rx="'+rx+'" ry="'+ry+'" class="yy-fur yy-outline"/>'+
      path('M-'+fmt(rx*.43)+' -'+fmt(ry*.65)+'Q0 -'+fmt(ry*.96)+' '+fmt(rx*.42)+' -'+fmt(ry*.65),'yy-ruff')+
      (p.kind==="rest"||p.kind==="savasana"||p.kind==="child"?'':
        '<path d="M0 -21L20 1L0 22L-20 1Z" class="yy-gem"/><path d="M0 -14L10 1L0 13Z" class="yy-gem-shine"/>')+
      '</g>';
  };
  const tail=p=>{
    const [x,y,s,r]=p.tail;
    return '<g transform="'+toTransform(x,y,s,r)+'" class="yy-tail">'+
      path('M-11 2Q33-28 87 15Q123 57 77 94Q37 113 12 82Q51 87 69 55Q81 30 43 24Z','yy-tail-main yy-outline')+
      path('M38 0Q75 6 89 38M47 83Q70 82 77 62','yy-tail-stripe')+
      '</g>';
  };
  const drawing=p=>{
    const twoLegs=p.legs.map((d,i)=>limb(d,'leg',i)).join('');
    const twoArms=p.arms.map((d,i)=>limb(d,'arm',i)).join('');
    const feet=p.feet.map(pos=>point(pos,'yy-paw yy-foot')).join('');
    const hands=p.hands.map(pos=>point(pos,'yy-paw yy-hand')).join('');
    return '<g data-pose="'+p.id+'" class="yy-pose yy-pose-'+p.kind+'" aria-hidden="true">'+
      '<g class="yy-character">'+tail(p)+
      '<g class="yy-legs">'+twoLegs+feet+'</g>'+torso(p)+
      '<g class="yy-arms">'+twoArms+hands+'</g>'+face(p)+
      '</g></g>';
  };
  const markup=()=>'<svg class="yy-svg" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Yin Yang yoga character">'+
    '<defs>'+
      '<radialGradient id="yy-pool"><stop offset="0" stop-color="#6bcbff" stop-opacity=".32"/><stop offset="1" stop-color="#6bcbff" stop-opacity="0"/></radialGradient>'+
      '<linearGradient id="yy-lotus" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a8f4ff"/><stop offset="1" stop-color="#778ef4"/></linearGradient>'+
    '</defs>'+
    '<ellipse cx="360" cy="404" rx="267" ry="43" fill="url(#yy-pool)"/>'+
    '<path d="M130 397Q232 364 359 392Q495 362 590 397Q466 433 359 410Q248 429 130 397Z" class="yy-lotus"/>'+
    '<path d="M201 397Q293 347 359 391Q430 347 523 397Q435 423 359 407Q287 424 201 397Z" class="yy-lotus-inner"/>'+
    '<ellipse cx="360" cy="401" rx="208" ry="10" fill="#102945" opacity=".26"/>'+
    '<g class="yy-pose-container">'+poses.map(drawing).join('')+'</g>'+
    '<g class="yy-stars" aria-hidden="true"><path d="M150 135l7 17 18 5-18 6-7 17-6-17-17-6 17-5Z"/><path d="M582 99l5 13 14 5-14 4-5 13-5-13-14-4 14-5Z"/><circle cx="544" cy="222" r="3"/><circle cx="182" cy="240" r="2.5"/></g>'+
  '</svg>';
  window.YIN_YANG_ART=Object.freeze({poses:Object.freeze(poses),markup});
})();
