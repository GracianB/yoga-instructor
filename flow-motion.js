/* Articulated Yoga Flow · original vector character, no dependencies. */
(() => {
  'use strict';
  const root = document.getElementById('flow-guide');
  const svg = root && root.querySelector('.guide-scene');
  if (!svg || !window.YOGA_RUNTIME) return;
  // 16 anatomical points: head, neck, left/right shoulder, elbow, wrist,
  // hip, knee, ankle and foot. Same topology in every posture.
  const pose = (points, angle = 0) => ({
    j: points.split(' ').map(v => v.split(',').map(Number)), angle
  });
  const p = {
    rest: pose('174,272 207,273 220,262 221,285 258,263 260,293 290,264 297,298 326,265 326,285 394,272 393,294 460,281 456,304 486,282 480,304', -80),
    sit: pose('320,129 320,165 290,171 350,171 275,220 365,220 253,259 390,259 301,253 339,253 245,276 395,273 301,289 342,289 285,299 355,299'),
    prayer: pose('320,129 320,165 290,171 350,171 295,211 348,211 315,217 325,217 301,253 339,253 245,276 395,273 301,289 342,289 285,299 355,299'),
    table: pose('233,214 259,215 264,204 268,231 251,258 275,258 224,298 263,298 355,211 355,235 380,277 362,285 420,295 398,301 443,298 418,301', -30),
    warrior: pose('319,91 319,124 284,136 354,135 220,140 416,140 157,143 481,136 302,222 341,222 240,232 400,267 240,302 452,302 210,303 479,303'),
    mountain: pose('320,94 320,128 285,140 354,140 280,180 364,183 282,217 367,215 305,222 338,222 306,264 339,265 305,304 340,304 285,307 365,307'),
    child: pose('249,276 279,261 292,245 297,265 249,277 265,286 185,296 210,301 363,240 377,263 325,280 335,287 402,293 414,298 430,299 439,302', -68),
    kneel: pose('318,156 319,184 299,188 339,188 294,228 344,231 280,269 356,270 311,258 336,259 289,288 371,286 297,304 374,302 279,306 402,306'),
    recline: pose('242,222 269,231 276,222 278,245 299,241 310,273 324,259 341,285 333,259 348,275 386,280 405,290 442,291 459,302 458,296 475,303', -46)
  };
  p.right = { j: p.warrior.j.map(([x,y]) => [640-x,y]), angle: 0 };
  const shapes = { start:'rest', centering:'sit', breath:'sit', warmup:'table',
    'pose-1':'warrior', transition:'mountain', 'pose-2':'right',
    cooldown:'child', savasana:'rest', finish:'prayer' };
  const bridges = { 'start>centering':'recline', 'breath>warmup':'kneel',
    'warmup>pose-1':'mountain', 'pose-2>cooldown':'kneel',
    'cooldown>savasana':'recline', 'savasana>finish':'recline' };

  // Bespoke editorial character: OHANA-level layered drawing, but a calm yoga identity.
  // All decorations are hand-authored vectors that follow the rig, not static sprites.
  svg.insertAdjacentHTML('beforeend',
    '<defs>' +
    '<linearGradient id="yoga-skin" x1="0" y1="0" x2=".83" y2="1"><stop offset="0" stop-color="#fae2c8"/><stop offset=".47" stop-color="#d9a987"/><stop offset="1" stop-color="#bd856f"/></linearGradient>' +
    '<linearGradient id="yoga-hair" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#6d6154"/><stop offset=".48" stop-color="#403d3b"/><stop offset="1" stop-color="#272d2b"/></linearGradient>' +
    '<linearGradient id="yoga-shirt" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stop-color="#bdd4c1"/><stop offset=".35" stop-color="#789d8c"/><stop offset="1" stop-color="#42685e"/></linearGradient>' +
    '<linearGradient id="yoga-pants" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#899ca8"/><stop offset=".48" stop-color="#5a7680"/><stop offset="1" stop-color="#354d5d"/></linearGradient>' +
    '<linearGradient id="yoga-rug" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8cfb6" stop-opacity=".64"/><stop offset="1" stop-color="#719889" stop-opacity=".18"/></linearGradient>' +
    '</defs>' +
    '<g class="guide-garden" aria-hidden="true">' +
      '<path class="guide-branch" d="M100 286Q132 220 182 192M540 280Q514 207 463 185"/>' +
      '<path class="guide-leaf" d="M119 244Q94 214 104 193Q133 210 119 244ZM142 219Q138 183 161 169Q172 207 142 219ZM159 201Q166 169 187 160Q191 192 159 201Z"/>' +
      '<path class="guide-leaf" d="M519 240Q540 208 532 190Q501 211 519 240ZM500 216Q494 181 475 168Q468 204 500 216ZM477 197Q469 171 445 161Q446 191 477 197Z"/>' +
      '<circle class="guide-pollen" cx="160" cy="131" r="3"/><circle class="guide-pollen" cx="483" cy="131" r="2.5"/>' +
    '</g>' +
    '<path class="guide-mat" d="M158 316Q320 299 482 316L502 325Q320 344 138 325Z"/>' +
    '<g class="guide-articulated" transform="translate(320 300) scale(1.15) translate(-320 -300)" aria-hidden="true">' +
      '<path class="guide-character-silhouette" d="M0 0"/>' +
      '<path data-bone="rleg" class="guide-leg"/><path class="guide-leg-lustre" data-detail="rleg"/>' +
      '<path data-bone="rfoot" class="guide-foot"/>' +
      '<path data-bone="lleg" class="guide-leg"/><path class="guide-leg-lustre" data-detail="lleg"/>' +
      '<path data-bone="lfoot" class="guide-foot"/>' +
      '<path data-bone="torso" class="guide-shirt"/>' +
      '<path class="guide-shirt-panel" data-detail="panel"/><path class="guide-waistline" data-detail="waist"/>' +
      '<path data-bone="neck" class="guide-neck"/>' +
      '<path class="guide-collar" data-detail="collar"/>' +
      '<path data-bone="rarm" class="guide-arm"/><path data-bone="larm" class="guide-arm"/>' +
      '<path class="guide-sleeve" data-detail="rsleeve"/><path class="guide-sleeve" data-detail="lsleeve"/>' +
      '<path class="guide-hand" data-detail="rhand"/>' +
      '<path class="guide-hand" data-detail="lhand"/>' +
      '<g class="guide-head">' +
        '<path class="guide-hair-back" d="M-23-4Q-34-28-13-34Q4-40 19-26Q30-12 23 10L13 19Q18-3 8-15Q-10-4-19 9Z"/>' +
        '<path class="guide-ear" d="M-17-1Q-24-7-24 2Q-24 9-17 7Z"/>' +
        '<path class="guide-skin" d="M-20-9Q-16-31 1-29Q22-27 23-7L20 16Q12 30 0 31Q-12 27-20 13Z"/>' +
        '<path class="guide-face-shade" d="M13-10Q21 8 7 20Q18 17 18 2Q19-6 13-10Z"/>' +
        '<path class="guide-hair" d="M-22-6Q-26-35-2-38Q18-38 25-18Q12-25-3-18Q-10-8-22-6Z"/>' +
        '<path class="guide-hair-strand" d="M-13-18Q-19-9-18 0"/>' +
        '<path class="guide-brow" d="M-13-2Q-10-5-5-3M6-3Q10-5 14-2"/>' +
        '<path class="guide-eyes" d="M-13 4Q-9 6-5 4M6 4Q11 6 15 3"/>' +
        '<path class="guide-nose" d="M0 3Q-3 12 3 14"/>' +
        '<path class="guide-smile" d="M-3 20Q2 22 6 19"/>' +
        '<path class="guide-beard" d="M-13 19Q-6 30 1 30Q12 26 17 17L11 23Q0 26-10 21Z"/>' +
        '<path class="guide-hair-shine" d="M-19-20Q-8-35 8-29"/>' +
        '<path class="guide-forehead-light" d="M-15-11Q-8-19 1-18"/>' +
      '<g class="guide-profile" aria-hidden="true">' +
        '<path class="guide-profile-nose" d="M14 0L28 5Q29 7 19 10"/>' +
        '<path class="guide-profile-lid" d="M10 3Q14 5 17 2"/>' +
      '</g>' +
      '</g>' +
    '</g>');
  const bones = {};
  svg.querySelectorAll('[data-bone]').forEach(el => { bones[el.dataset.bone] = el; });
  const head = svg.querySelector('.guide-head');
  const details = {};
  svg.querySelectorAll('[data-detail]').forEach(el => { details[el.dataset.detail] = el; });
  const motion = window.YOGA_RUNTIME;
  let snapshot = { phase: 'start', status:'idle' }, phase = 'start';
  let shape = p.rest, move = null, preview = false, frame = 0, lastDraw = 0;
  const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const noMotion = () => document.hidden || document.body.classList.contains('quiet-mode') || (media && media.matches);
  const active = () => snapshot.status === 'running' || (snapshot.status === 'finished' && Boolean(move));
  const f = n => Number(n).toFixed(1);
  const lerp = (a,b,t) => a+(b-a)*t;
  const easing = t => t*t*(3-2*t);
  const blend = (a,b,t) => ({
    angle: lerp(a.angle,b.angle,t),
    j: a.j.map((v,i) => v.map((n,k) => lerp(n,b.j[i][k],t)))
  });
  const line = (a,b) => 'M'+f(a[0])+' '+f(a[1])+'L'+f(b[0])+' '+f(b[1]);
  const bent = (a,b,c) => line(a,b)+'L'+f(c[0])+' '+f(c[1]);
  // Silhouette geometry with gradually changing widths, not jointless thick strokes.
  const normal = (a,b) => {
    const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.max(1,Math.hypot(dx,dy));
    return [-dy/len,dx/len];
  };
  const offset=(p,n,w,dir=1)=>[p[0]+n[0]*w*dir,p[1]+n[1]*w*dir];
  const xy=p=>f(p[0])+' '+f(p[1]);
  const limbShape=(a,b,c,w1,w2,w3)=>{
    const na=normal(a,b), nb=normal(a,c), nc=normal(b,c);
    const al=offset(a,na,w1), ar=offset(a,na,w1,-1);
    const bl=offset(b,nb,w2), br=offset(b,nb,w2,-1);
    const cl=offset(c,nc,w3), cr=offset(c,nc,w3,-1);
    const bend=(p,q,t)=>[lerp(p[0],q[0],t),lerp(p[1],q[1],t)];
    return 'M'+xy(al)+'L'+xy(bend(al,bl,.72))+'Q'+xy(bl)+' '+xy(bend(bl,cl,.22))+
      'L'+xy(cl)+'Q'+xy(c)+' '+xy(cr)+'L'+xy(bend(cr,br,.78))+
      'Q'+xy(br)+' '+xy(bend(br,ar,.28))+'L'+xy(ar)+'Z';
  };
  const flatShape=(a,b,wa,wb)=>{
    const n=normal(a,b);
    const al=offset(a,n,wa),ar=offset(a,n,wa,-1),
      bl=offset(b,n,wb),br=offset(b,n,wb,-1);
    return 'M'+xy(al)+'L'+xy(bl)+'Q'+xy(b)+' '+xy(br)+'L'+xy(ar)+'Z';
  };
  function render(s, inhale = 0) {
    const j=s.j.map(([x,y],i) => [x,y-(i<4?inhale:i<8?inhale*0.45:0)]);
    bones.rleg.setAttribute('d',limbShape(j[9],j[11],j[13],15,12,9));
    bones.rfoot.setAttribute('d',flatShape(j[13],j[15],6,7));
    bones.lleg.setAttribute('d',limbShape(j[8],j[10],j[12],15,12,9));
    bones.lfoot.setAttribute('d',flatShape(j[12],j[14],6,7));
    const [sl,sr,hl,hr]=[j[2],j[3],j[8],j[9]];
    // Curved neck, relaxed shoulders, tapered waist and rounded hem.
    const neck=j[1], midHip=[(hl[0]+hr[0])/2,(hl[1]+hr[1])/2];
    bones.torso.setAttribute('d',
      'M'+xy([sl[0]-4,sl[1]+1])+
      'Q'+xy([sl[0]+2,sl[1]-13])+' '+xy([neck[0]-9,neck[1]+8])+
      'Q'+xy([neck[0],neck[1]+14])+' '+xy([neck[0]+9,neck[1]+8])+
      'Q'+xy([sr[0]-2,sr[1]-13])+' '+xy([sr[0]+4,sr[1]+1])+
      'C'+xy([sr[0]+8,sr[1]+29])+' '+xy([hr[0]+10,hr[1]-22])+' '+xy([hr[0]+5,hr[1]+2])+
      'Q'+xy([midHip[0],midHip[1]+9])+' '+xy([hl[0]-5,hl[1]+2])+
      'C'+xy([hl[0]-10,hl[1]-22])+' '+xy([sl[0]-8,sl[1]+29])+' '+xy([sl[0]-4,sl[1]+1])+'Z');
    bones.neck.setAttribute('d',line([(sl[0]+sr[0])/2,(sl[1]+sr[1])/2],j[1]));
    bones.rarm.setAttribute('d',limbShape(j[3],j[5],j[7],8.5,6.7,4.1));
    bones.larm.setAttribute('d',limbShape(j[2],j[4],j[6],8.5,6.7,4.1));
    head.setAttribute('transform','translate('+f(j[0][0])+' '+f(j[0][1])+') rotate('+f(s.angle)+')');

    // Follow the changing joints: seams, highlights, short sleeves and small hands.
    details.rleg.setAttribute('d', bent(j[9],j[11],j[13]));
    details.lleg.setAttribute('d', bent(j[8],j[10],j[12]));
    const edge=(from,to,t)=>[lerp(from[0],to[0],t),lerp(from[1],to[1],t)];
    details.rsleeve.setAttribute('d',flatShape(j[3],edge(j[3],j[5],.43),10,7.9));
    details.lsleeve.setAttribute('d',flatShape(j[2],edge(j[2],j[4],.43),10,7.9));
    // Palms follow the forearm direction; extended fingers replace circular mittens.
    const hand = (wrist, elbow) => {
      const dx=wrist[0]-elbow[0], dy=wrist[1]-elbow[1], len=Math.max(1,Math.hypot(dx,dy));
      const dir=[dx/len,dy/len], side=[-dir[1],dir[0]];
      const pt=(d,l)=>[wrist[0]+dir[0]*d+side[0]*l,wrist[1]+dir[1]*d+side[1]*l];
      return 'M'+xy(pt(-4,-5))+'Q'+xy(pt(1,-8))+' '+xy(pt(7,-4))+
        'L'+xy(pt(14,-3.2))+'Q'+xy(pt(18,-1))+' '+xy(pt(15,1.5))+
        'L'+xy(pt(7,4.1))+'Q'+xy(pt(2,8))+' '+xy(pt(-4,5))+'Z';
    };
    details.rhand.setAttribute('d',hand(j[7],j[5]));
    details.lhand.setAttribute('d',hand(j[6],j[4]));
    details.collar.setAttribute('d','M'+f(sl[0]+5)+' '+f(sl[1]+2)+
      'Q'+f(j[1][0])+' '+f(j[1][1]+12)+' '+f(sr[0]-5)+' '+f(sr[1]+2));
    const middle=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
    details.panel.setAttribute('d',line(middle(sl,sr),middle(hl,hr)));
    details.waist.setAttribute('d','M'+xy([hl[0]-4,hl[1]])+
      'Q'+xy([(hl[0]+hr[0])/2,(hl[1]+hr[1])/2+5])+' '+xy([hr[0]+4,hr[1]]));

    shape=s;
  }
  function stopFrame() { if(frame) motion.cancel(frame); frame=0; }
  function progress(now) {
    if (!move) return shape;
    const t=Math.min(1,(move.elapsed+Math.max(0,now-move.start))/move.duration);
    root.dataset.morph=t.toFixed(3);
    if(t>=1) { const end=move.frames[move.frames.length-1]; move=null; return end; }
    const v=t*(move.frames.length-1), i=Math.min(move.frames.length-2,Math.floor(v));
    return blend(move.frames[i],move.frames[i+1],easing(v-i));
  }
  function freeze() {
    if(move) {
      const now=performance.now(), value=progress(now);
      if(move) { move.elapsed+=Math.max(0,now-move.start); move.start=now; }
      render(value);
    }
    stopFrame();
    root.dataset.motion='still';
  }
  // Asana-specific movement, not a generic full-body bob.
  // In each pose the rig carries a different and anatomically restrained gesture.
  function gesture(base, now) {
    const b = Math.sin(now / 1850), j = base.j.map(point => [...point]);
    if (phase === 'warmup') {
      // Cat/cow: flex the spine while hands and knees stay on the floor.
      j[0][1] += 8*b; j[1][1] += 5*b;
      j[8][1] += 3*b; j[9][1] += 3*b;
      j[2][1] += 2*b; j[3][1] += 2*b;
    } else if (phase === 'pose-1' || phase === 'pose-2') {
      // Hold Warrior II: grounded ankles, controlled knee and open chest.
      j[10][1] += 1.7*b; j[11][1] += 1.7*b;
      j[2][1] -= 1*b; j[3][1] -= 1*b;
      j[6][1] -= 1.5*b; j[7][1] -= 1.5*b;
    } else if (phase === 'centering' || phase === 'breath' || phase === 'finish') {
      j[0][1] -= 1.6*b; j[1][1] -= 1*b;
      j[4][1] += 1.3*b; j[5][1] += 1.3*b;
    } else if (phase === 'start' || phase === 'savasana') {
      j[2][1] -= 1*b; j[3][1] -= 1*b;
    }
    return { j, angle: base.angle };
  }
  function tick(now) {
    frame=0;
    if(noMotion() || !active()) { freeze(); return; }
    if(move || now-lastDraw>=32) {
      const current=move ? progress(now) : p[shapes[phase]];
      const performed=!move && snapshot.status==='running' ? gesture(current, now) : current;
      render(performed,!move && snapshot.status==='running' ? (Math.sin(now/1600)+1)*.6 : 0);
      root.dataset.motion=move?'transition':(snapshot.status==='running'?'breathing':'still');
      lastDraw=now;
    }
    if(move || snapshot.status==='running') frame=motion.frame(tick);
  }
  function resume() {
    if(noMotion() || !active()) { freeze(); return; }
    if(move) move.start=performance.now();
    if(!frame) frame=motion.frame(tick);
  }
  function onFlow(next) {
    if(move) freeze();
    const prior=phase;
    phase=next.phase;
    snapshot=next;
    root.dataset.look=(phase==='pose-1'?'left':phase==='pose-2'?'right':'front');
    if(phase!==prior) {
      const target=p[shapes[phase]];
      const bridge=bridges[prior+'>'+phase];
      if(!noMotion() && (next.status==='running'||next.status==='finished')) {
        move={ frames:[shape,...(bridge?[p[bridge]]:[]),target],
          elapsed:0,start:performance.now(),duration:preview?1250:2400 };
        root.dataset.morph='0.000';
      } else { move=null; render(target); root.dataset.morph='1.000'; }
    } else if(next.status==='idle') {
      move=null;render(p[shapes[phase]]);root.dataset.morph='1.000';
    }
    if(noMotion() || !active()) freeze(); else resume();
  }
  window.addEventListener('yoga:flow', e => onFlow(e.detail));
  window.addEventListener('yoga:preview', e => {preview=Boolean(e.detail);});
  document.addEventListener('visibilitychange', () => { if(noMotion()) freeze();else resume(); });
  document.addEventListener('yoga:quiet', () => { if(noMotion()) freeze();else resume(); });
  if(media && typeof media.addEventListener==='function') media.addEventListener('change', () => {
    if(media.matches) {move=null;render(p[shapes[phase]]);root.dataset.morph='1.000';freeze();}
    else resume();
  });
  render(shape);
  root.classList.add('guide-animated');
  root.dataset.motion='still';
  root.dataset.morph='1.000';
  root.dataset.look='front';
})();