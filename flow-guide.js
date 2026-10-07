(() => {
  'use strict';
  const mount = document.getElementById('flow-guide');
  if (!mount || !window.YOGA_FLOW) return;
  const head = (x, y, angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle})"><path class="guide-neck" d="M-2 15L0 31"/><ellipse class="guide-skin" rx="17" ry="21"/><path class="guide-hair" d="M-17 1C-23-31 25-31 17 1L11-10Q-3-3-13-10Z"/><path class="guide-face" d="M-8 4Q-4 7 0 4M6 12Q2 15-2 12"/></g>`;
  const limb = (d, type = 'arm') => `<path class="guide-${type}" d="${d}"/>`;
  const shirt = d => `<path class="guide-shirt" d="${d}"/>`;
  const seated = prayer => `${limb('M310 259Q267 246 250 276Q278 294 350 281','leg')}${limb('M332 259Q374 249 387 277Q351 299 284 286','leg')}${shirt('M299 178Q320 169 341 178L345 252Q320 264 295 252Z')}${prayer ? limb('M300 188Q286 221 311 228L320 210') + limb('M340 188Q354 221 330 228L320 210') : limb('M300 188Q291 220 270 254L258 260') + limb('M340 188Q349 220 369 254L380 260')}${head(320,146)}<path class="guide-fold" d="M307 244Q322 251 334 244"/>`;
  const resting = `${limb('M330 275Q393 270 463 285','leg')}${limb('M328 284Q390 287 452 299','leg')}${shirt('M207 255Q268 248 337 268L334 290Q267 289 210 285Z')}${limb('M223 265Q247 291 298 296')}${head(181,270,-82)}${limb('M456 285L478 279','foot')}${limb('M448 299L470 299','foot')}`;
  const warrior = `${limb('M320 217L249 225L239 297','leg')}${limb('M328 219L389 254L441 298','leg')}${limb('M240 299L213 299','foot')}${limb('M440 299L462 299','foot')}${shirt('M298 135Q320 128 342 135L338 216Q320 230 298 216Z')}${limb('M299 144L222 149L156 145')}${limb('M341 144L411 148L476 142')}${head(320,104)}<path class="guide-fold" d="M307 207Q320 215 332 207"/>`;
  const mountain = `${limb('M310 214L306 299','leg')}${limb('M330 214L336 299','leg')}${limb('M304 300L286 300','foot')}${limb('M335 300L353 300','foot')}${shirt('M299 129Q320 122 341 129L338 216Q320 226 300 216Z')}${limb('M299 138Q287 173 285 210')}${limb('M341 138Q353 173 355 210')}${head(320,97)}`;
  const table = `${limb('M357 226L380 280L428 289','leg')}${limb('M346 228L357 294L406 299','leg')}${shirt('M253 205Q304 187 357 213L354 239Q303 223 253 232Z')}${limb('M261 219L247 292L226 299')}${head(232,213,-30)}`;
  const child = `${limb('M364 253L324 282L404 293','leg')}${shirt('M361 231Q315 220 273 258L288 278Q323 268 376 272Z')}${limb('M283 259Q242 278 204 289L183 289')}${head(255,275,-70)}`;
  const phases = [
    ['start', resting, 'Rest on the earth', 'Let the day settle.'],
    ['centering', seated(false), 'Find your centre', 'A place to return to: here.'],
    ['breath', seated(false), 'Listen to your breath', 'Nothing to achieve. Simply breathe.'],
    ['warmup', table, 'Awaken the body', 'A gentle movement makes room.'],
    ['pose-1', warrior, 'Warrior II · left side', 'Rooted in the earth. Open at heart.'],
    ['transition', mountain, 'Return to standing', 'Between two gestures, a breath.'],
    ['pose-2', `<g transform="translate(640 0) scale(-1 1)">${warrior}</g>`, 'Warrior II · right side', 'The same presence, on the other side.'],
    ['cooldown', child, 'Child’s pose', 'You can soften what you carry.'],
    ['savasana', resting, 'Savasana · rest', 'The earth holds you. You may rest.'],
    ['finish', seated(true), 'A moment of gratitude', 'Carry this calm with you.']
  ];
  const spanish = [
    ['Soltar el peso','Deja que el día se pose.'],['Volver al centro','Un lugar al que volver: aquí.'],
    ['Escuchar la respiración','Nada que conseguir. Solo respirar.'],['Despertar el cuerpo','Un movimiento suave abre espacio.'],
    ['Guerrero II · lado izquierdo','Raíces en la tierra. Espacio en el corazón.'],['Volver de pie','Entre dos gestos, una respiración.'],
    ['Guerrero II · lado derecho','La misma presencia, al otro lado.'],['Postura del niño','Puedes soltar lo que llevas contigo.'],
    ['Savasana · descanso','El suelo te sostiene. Puedes descansar.'],['Un instante de gratitud','Llévate esta calma contigo.']
  ];
  mount.innerHTML = `<div class="guide-heading"><span data-guide-eyebrow></span><span class="guide-mode"></span></div>
    <svg class="guide-scene" viewBox="0 0 640 360" role="img" aria-labelledby="guide-svg-title">
    <title id="guide-svg-title"></title><defs><radialGradient id="guide-halo"><stop stop-color="#dbb5bd" stop-opacity=".3"/><stop offset="1" stop-color="#dbb5bd" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="guide-halo" cx="320" cy="193" rx="183" ry="157" fill="url(#guide-halo)"/>
    <path class="guide-ground" d="M93 309Q320 293 547 309M134 320Q320 308 506 320"/>
    <ellipse class="guide-shadow" cx="320" cy="300" rx="153" ry="8"/>
    ${phases.map(([id, drawing]) => `<g class="guide-pose" data-pose="${id}" aria-hidden="true"><g class="guide-body">${drawing}</g></g>`).join('')}
    </svg><figcaption><strong id="guide-pose-name"></strong><p id="guide-pose-message"></p></figcaption>`;
  let snapshot = window.YOGA_FLOW.create().snapshot();
  let demo = false;
  const render = () => {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    const index = phases.findIndex(item => item[0] === snapshot.phase);
    if (index < 0) return;
    const name = lang === 'en' ? phases[index][2] : spanish[index][0];
    const message = lang === 'en' ? phases[index][3] : spanish[index][1];
    mount.dataset.status = snapshot.status;
    mount.dataset.phase = snapshot.phase;
    mount.dataset.hidden = String(document.hidden);
    mount.querySelectorAll('[data-pose]').forEach(pose => pose.classList.toggle('is-current', pose.dataset.pose === snapshot.phase));
    mount.querySelector('#guide-svg-title').textContent = name;
    mount.querySelector('#guide-pose-name').textContent = name;
    mount.querySelector('#guide-pose-message').textContent = message;
    mount.querySelector('[data-guide-eyebrow]').textContent = lang === 'en' ? 'ONE GESTURE AT A TIME' : 'UN GESTO A LA VEZ';
    mount.querySelector('.guide-mode').textContent = demo ? (lang === 'en' ? 'QUICK PREVIEW' : 'VISTA RÁPIDA') : (lang === 'en' ? 'AT YOUR OWN PACE' : 'A TU RITMO');
  };
  window.addEventListener('yoga:flow', event => { snapshot = event.detail; render(); });
  window.addEventListener('yoga:preview', event => { demo = event.detail; render(); });
  document.addEventListener('visibilitychange', render);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-set-lang]')) window.YOGA_RUNTIME.frame(render);
  });
  render();
})();
