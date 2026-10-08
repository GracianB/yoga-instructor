/* ZENICORN FLOW · 10 authored cartoon illustrations, zero skeletal morphing. */
(() => {
  "use strict";
  const root=document.getElementById("flow-guide");
  if (!root || !window.YOGA_FLOW) return;
  const phases = [
    ["start","01-inicio","Soltar el peso","Lie down and arrive","Descansa sobre el loto. El viaje empieza sin prisa.","Rest on the lotus. There is no rush."],
    ["centering","02-centrado","Encuentra tu centro","Find your centre","Estabilidad, presencia y una sonrisa pequeña.","Feel steady, present and gently at ease."],
    ["breath","03-respiracion","Respira con Zenicorn","Breathe with Zenicorn","Inhala cuatro. Sostén siete. Exhala ocho.","Inhale for four. Hold for seven. Exhale for eight."],
    ["warmup","04-calentamiento","Despierta tu cuerpo","Wake up your body","Estira suavemente la espalda, como un gato curioso.","Gently stretch your back, like a curious cat."],
    ["pose-1","05-guerrero","Guerrero de la calma","Warrior of calm","Abre el pecho. Encuentra fuerza sin perder suavidad.","Open your chest. Stay strong without losing softness."],
    ["transition","06-transicion","Fluir también es practicar","Movement is practice","Cambiar de postura puede ser un momento de magia.","Changing pose can be a moment of magic."],
    ["pose-2","07-arbol","Árbol mágico","Magic tree","Encuentra tu equilibrio y mantén una mirada tranquila.","Find balance and keep a soft, steady gaze."],
    ["cooldown","08-calma","Vuelve a ti","Return to calm","Recógete. Deja que el esfuerzo se desvanezca.","Fold inward. Let the effort softly dissolve."],
    ["savasana","09-savasana","Un descanso profundo","Deep rest","No tienes nada que demostrar. Quédate aquí.","Nothing to prove. Simply be here."],
    ["finish","10-cierre","Llévate esta magia","Carry this magic","Una última respiración. Gracias por practicar.","One last breath. Thank you for practising."]
  ];
  const base="./assets/zenicorn/poses/";
  const uri=entry=>base+entry[1]+".svg";
  const byId=Object.fromEntries(phases.map(p=>[p[0],p]));
  root.classList.add("zenicorn-flow");
  root.innerHTML=
    '<div class="guide-heading"><span data-guide-eyebrow>UN GESTO A LA VEZ</span><span class="guide-mode">ZENICORN · FLOW</span></div>'+
    '<div class="zenicorn-world" role="img" aria-label="Zenicorn, unicornio mágico realizando la postura actual">'+
    '<div class="zenicorn-sky" aria-hidden="true"></div>'+
    '<div class="zenicorn-mountain zenicorn-mountain-a" aria-hidden="true"></div>'+
    '<div class="zenicorn-mountain zenicorn-mountain-b" aria-hidden="true"></div>'+
    '<div class="zenicorn-water" aria-hidden="true"></div>'+
    '<div class="zenicorn-orbit" aria-hidden="true"></div>'+
    '<div class="zenicorn-lotus-flare" aria-hidden="true"></div>'+
    '<img class="zenicorn-pose zenicorn-pose-a" alt="" draggable="false" decoding="async">'+
    '<img class="zenicorn-pose zenicorn-pose-b" alt="" draggable="false" decoding="async">'+
    '<div class="zenicorn-petals" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
    '<div class="zenicorn-breath-ritual" aria-live="off" aria-hidden="true">'+
    '<small class="zenicorn-breath-title">RESPIRACIÓN 4 · 7 · 8</small>'+
    '<strong class="zenicorn-breath-number">4</strong>'+
    '<span class="zenicorn-breath-word">INHALA</span>'+
    '<span class="zenicorn-breath-track"><span class="zenicorn-breath-fill"></span></span>'+
    '</div><div class="zenicorn-world-signature" aria-hidden="true">ZENICORN <span>✧</span> FLOW</div>'+
    '</div>'+
    '<figcaption><strong id="guide-pose-name"></strong><p id="guide-pose-message"></p></figcaption>';
  const layers=[root.querySelector(".zenicorn-pose-a"),root.querySelector(".zenicorn-pose-b")];
  const title=root.querySelector("#guide-pose-name");
  const message=root.querySelector("#guide-pose-message");
  const world=root.querySelector(".zenicorn-world");
  const ritual=root.querySelector(".zenicorn-breath-ritual");
  const number=root.querySelector(".zenicorn-breath-number");
  const word=root.querySelector(".zenicorn-breath-word");
  const bar=root.querySelector(".zenicorn-breath-fill");
  const loaded = new Map();
  let activeLayer=0, token=0, snapshot=window.YOGA_FLOW.create().snapshot(), preview=false;
  const reduced=()=>window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const quiet=()=>document.body.classList.contains("quiet-mode");
  const isStill=()=>reduced() || quiet() || document.hidden;
  const lang=()=>document.documentElement.lang==="en"?"en":"es";
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function awaitImage(src) {
    if (loaded.has(src)) return loaded.get(src);
    const promise=new Promise((resolve,reject)=>{
      const image=new Image();
      image.decoding="async";
      image.onload=()=>resolve(src);
      image.onerror=()=>reject(new Error("Zenicorn asset failed: "+src));
      image.src=src;
    });
    loaded.set(src,promise);
    return promise;
  }
  function setCopy() {
    const p=byId[snapshot.phase]||phases[0], isEnglish=lang()==="en";
    root.dataset.phase=p[0];
    root.dataset.status=snapshot.status;
    title.textContent=p[isEnglish?3:2];
    message.textContent=p[isEnglish?5:4];
    root.querySelector("[data-guide-eyebrow]").textContent=isEnglish?"A LITTLE MAGIC AT A TIME":"UN POCO DE MAGIA A LA VEZ";
    root.querySelector(".guide-mode").textContent=preview?(isEnglish?"QUICK TOUR":"VISTA RÁPIDA"):"ZENICORN · FLOW";
    world.setAttribute("aria-label",(isEnglish?"Zenicorn yoga pose: ":"Postura de yoga de Zenicorn: ")+title.textContent);
  }
  function lock() {
    root.dataset.ready="false";
    window.dispatchEvent(new CustomEvent("yoga:pose-changing",{detail:{phase:snapshot.phase}}));
  }
  function release(ok=true) {
    root.dataset.ready=ok?"true":"error";
    root.dataset.motion="still";
    root.dataset.morph="1.000";
    window.dispatchEvent(new CustomEvent("yoga:pose-ready",{detail:{phase:snapshot.phase,ok}}));
  }
  async function showPose(phase,instant=false) {
    const own=++token, current=byId[phase]||phases[0], src=uri(current);
    lock();
    try {
      await awaitImage(src);
      if(own!==token)return;
      const first=!layers[activeLayer].getAttribute("src");
      const next=first?activeLayer:1-activeLayer;
      const incoming=layers[next],outgoing=layers[activeLayer];
      incoming.src=src;
      incoming.dataset.pose=phase;
      incoming.classList.remove("is-visible");
      const fast=instant||isStill()||first;
      if(!fast) {
        root.dataset.motion="transition";
        root.dataset.morph="0.000";
        world.classList.remove("zenicorn-bloom");
        void world.offsetWidth;
        world.classList.add("zenicorn-bloom");
        // Fade the old finished pose away before revealing the next one.
        outgoing.classList.remove("is-visible");
        await sleep(190);
        if(own!==token)return;
      } else outgoing.classList.remove("is-visible");
      if (fast) incoming.classList.add("is-visible");
      else {
        void incoming.offsetWidth;
        incoming.classList.add("is-visible");
        await sleep(400);
        if(own!==token)return;
      }
      if(own!==token)return;
      activeLayer=next;
      release();
    } catch(error) {
      if(own!==token)return;
      console.error(error);
      title.textContent=lang()==="en"?"Illustration unavailable":"Ilustración no disponible";
      message.textContent=lang()==="en"?"Please retry the practice.":"Prueba a reiniciar la práctica.";
      release(false);
    }
  }
  function setPhase(s,instant=false) {
    const previous=snapshot.phase;
    snapshot=s;
    setCopy();
    const active=s.phase==="breath"&&(s.status==="running"||s.status==="paused");
    world.classList.toggle("zenicorn-breath-active",active);
    ritual.setAttribute("aria-hidden",String(!active));
    if(previous!==s.phase || root.dataset.ready!=="true") showPose(s.phase,instant);
  }
  window.addEventListener("yoga:flow",ev=>setPhase(ev.detail));
  window.addEventListener("yoga:preview",ev=>{preview=!!ev.detail;setCopy();});
  window.addEventListener("yoga:breath",ev=>{
    const d=ev.detail||{};
    if(snapshot.phase!=="breath")return;
    world.dataset.breath=d.phase||"idle";
    const words={es:{inhale:"INHALA",hold:"SOSTÉN",exhale:"EXHALA",idle:"RESPIRA"},en:{inhale:"INHALE",hold:"HOLD",exhale:"EXHALE",idle:"BREATHE"}};
    const durations={inhale:4,hold:7,exhale:8};
    const v=d.phase||"idle";
    number.textContent=String(d.remaining??durations[v]??4);
    word.textContent=words[lang()][v]||words[lang()].idle;
    bar.style.transform="scaleX("+Math.max(0,Math.min(1,Number(d.progress)||0))+")";
  });
  document.addEventListener("visibilitychange",()=>{root.dataset.hidden=String(document.hidden);});
  document.addEventListener("click",event=>{
    if(event.target.closest("[data-set-lang]"))requestAnimationFrame(setCopy);
  });
  setCopy();showPose("start",true);
  // Preload one upcoming pose, not every high-resolution illustration on mobile.
  window.addEventListener("yoga:pose-ready",ev=>{
    if(!ev.detail?.ok)return;
    const i=phases.findIndex(p=>p[0]===snapshot.phase);
    if(i>=0&&i<phases.length-1)awaitImage(uri(phases[i+1])).catch(()=>{});
  });
})();
