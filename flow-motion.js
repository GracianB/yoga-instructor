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
    sit: pose('320,147 320,177 302,183 338,183 288,221 354,221 258,263 383,263 308,253 332,253 256,274 383,275 309,292 330,292 295,298 346,298'),
    prayer: pose('320,147 320,177 302,183 338,183 288,220 352,220 318,209 322,209 308,253 332,253 256,274 383,275 309,292 330,292 295,298 346,298'),
    table: pose('233,214 259,215 264,204 268,231 251,258 275,258 224,298 263,298 355,211 355,235 380,277 362,285 420,295 398,301 443,298 418,301', -30),
    warrior: pose('320,100 320,128 303,137 337,137 227,143 410,143 158,143 478,143 307,215 333,215 244,224 385,251 240,292 446,296 215,299 468,299'),
    mountain: pose('320,100 320,127 303,135 337,135 291,174 350,174 285,215 355,215 307,216 333,216 305,257 336,258 305,296 337,296 284,301 358,301'),
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

  svg.insertAdjacentHTML('beforeend',
    '<g class="guide-articulated" aria-hidden="true">' +
    '<path data-bone="rleg" class="guide-leg"/><path data-bone="rfoot" class="guide-foot"/>' +
    '<path data-bone="lleg" class="guide-leg"/><path data-bone="lfoot" class="guide-foot"/>' +
    '<path data-bone="torso" class="guide-shirt"/><path data-bone="neck" class="guide-neck"/>' +
    '<path data-bone="rarm" class="guide-arm"/><path data-bone="larm" class="guide-arm"/>' +
    '<g class="guide-head"><ellipse class="guide-skin" rx="17" ry="21"/>' +
    '<path class="guide-hair" d="M-17 1C-23-31 25-31 17 1L11-10Q-3-3-13-10Z"/>' +
    '<path class="guide-face" d="M-8 4Q-4 7 0 4M6 12Q2 15-2 12"/></g></g>');
  const bones = {};
  svg.querySelectorAll('[data-bone]').forEach(el => { bones[el.dataset.bone] = el; });
  const head = svg.querySelector('.guide-head');
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
  function render(s, inhale = 0) {
    const j=s.j.map(([x,y],i) => [x,y-(i<4?inhale:i<8?inhale*0.45:0)]);
    bones.rleg.setAttribute('d',bent(j[9],j[11],j[13]));
    bones.rfoot.setAttribute('d',line(j[13],j[15]));
    bones.lleg.setAttribute('d',bent(j[8],j[10],j[12]));
    bones.lfoot.setAttribute('d',line(j[12],j[14]));
    const [sl,sr,hl,hr]=[j[2],j[3],j[8],j[9]];
    bones.torso.setAttribute('d',
      'M'+f(sl[0])+' '+f(sl[1])+'Q'+f((sl[0]+sr[0])/2)+' '+f((sl[1]+sr[1])/2-5)+
      ' '+f(sr[0])+' '+f(sr[1])+'L'+f(hr[0])+' '+f(hr[1])+
      'Q'+f((hl[0]+hr[0])/2)+' '+f((hl[1]+hr[1])/2+5)+' '+f(hl[0])+' '+f(hl[1])+'Z');
    bones.neck.setAttribute('d',line([(sl[0]+sr[0])/2,(sl[1]+sr[1])/2],j[1]));
    bones.rarm.setAttribute('d',bent(j[3],j[5],j[7]));
    bones.larm.setAttribute('d',bent(j[2],j[4],j[6]));
    head.setAttribute('transform','translate('+f(j[0][0])+' '+f(j[0][1])+') rotate('+f(s.angle)+')');
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
  function tick(now) {
    frame=0;
    if(noMotion() || !active()) { freeze(); return; }
    if(move || now-lastDraw>=32) {
      const current=progress(now);
      render(current,!move && snapshot.status==='running' ? (Math.sin(now/1400)+1)*0.8 : 0);
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
})();