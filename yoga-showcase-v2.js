/* Yoga Instructor · public portfolio chapter. No practice app or third-party data.
   The teaching journey is a conceptual timeline, not a geographic coordinate map. */
(() => {
  "use strict";
  const $=selector=>document.querySelector(selector);
  const lang=()=>document.documentElement.dataset.lang==="en"?"en":"es";
  const copy={
    es:{
      route:{
        projects:"Clases online, individuales, grupos y empresas. Encuentra el formato que se adapta a ti.",
        experience:"Experiencia en sala, sesiones individuales y bienestar corporativo; formación y recorrido incluidos.",
        method:"Presencia, respiración y movimiento: tres principios con ejemplos concretos.",
        contact:"Consulta disponibilidad o prepara un mensaje sin enviar datos desde la web."
      },
      journey:{
        madrid:["01 / 03 · MADRID 2019","Aprender a enseñar","Formación de instructor de yoga: asanas, pranayama, fundamentos filosóficos y práctica docente."],
        lisboa:["02 / 03 · LISBOA 2020–2021","Acompañar a equipos","Como Wellness Ambassador en Majorel, en el entorno Google/YouTube, facilité sesiones de yoga y bienestar para equipos internacionales."],
        murcia:["03 / 03 · MURCIA 2022–2026","Adaptar a cada persona","En Mood Fitness dirigí clases multinivel hasta junio de 2026; trabajé con progresiones, alternativas y escucha del grupo."]
      },
      inhale:"Inhala",exhale:"Exhala",rest:"Presencia",start:"Comenzar pausa",stop:"Detener pausa",listen:"Escuchar música",silence:"Pausar música",unavailable:"Audio no disponible"
    },
    en:{
      route:{
        projects:"Online, one-to-one, group and workplace yoga. Find the format that suits you.",
        experience:"Teaching in studios, one-to-one sessions and workplaces, with training and personal journey.",
        method:"Presence, breath and movement: three principles with concrete examples.",
        contact:"Enquire about availability or prepare an email without submitting data on this site."
      },
      journey:{
        madrid:["01 / 03 · MADRID 2019","Learning to teach","Yoga instructor training covering asanas, pranayama, philosophical foundations and practical teaching."],
        lisboa:["02 / 03 · LISBON 2020–2021","Supporting teams","As a Wellness Ambassador at Majorel, in the Google/YouTube environment, I facilitated yoga and wellbeing sessions for international teams."],
        murcia:["03 / 03 · MURCIA 2022–2026","Adapting to each person","At Mood Fitness I led mixed-level classes through June 2026, focusing on progressions, adaptations and listening to the group."]
      },
      inhale:"Inhale",exhale:"Exhale",rest:"Presence",start:"Start pause",stop:"Stop pause",listen:"Play music",silence:"Pause music",unavailable:"Audio unavailable"
    }
  };
  const routes=[...document.querySelectorAll('[data-p2-route]')];
  const routeText=$('[data-yoga-route-insight] .yoga-route-insight-copy');
  let chosenRoute=null;
  function paintRoute(key){
    const values=copy[lang()].route;
    const text=values[key]|| (lang()==="en"?"Choose one of the four paths. Go directly to what matters to you.":"Elige uno de los cuatro caminos. Te llevará directamente al contenido que buscas.");
    const es=routeText?.querySelector('[data-p2-lang="es"]'),en=routeText?.querySelector('[data-p2-lang="en"]');
    if(es)es.textContent=copy.es.route[key]||"Elige uno de los cuatro caminos. Te llevará directamente al contenido que buscas.";
    if(en)en.textContent=copy.en.route[key]||"Choose one of the four paths. Go directly to what matters to you.";
  }
  routes.forEach(route=>{
    const key=route.dataset.p2Route;
    route.addEventListener('pointerenter',()=>paintRoute(key));
    route.addEventListener('focus',()=>paintRoute(key));
    route.addEventListener('click',()=>{chosenRoute=key;paintRoute(key)});
    route.addEventListener('pointerleave',()=>paintRoute(chosenRoute));
    route.addEventListener('blur',()=>paintRoute(chosenRoute));
  });
  const stops=[...document.querySelectorAll('[data-journey-stop]')];
  const number=$('[data-journey-number]'),title=$('[data-journey-title]'),body=$('[data-journey-body]');
  let currentStop='madrid';
  function selectStop(key){
    const entry=copy[lang()].journey[key];
    if(!entry)return;
    currentStop=key;
    for(const stop of stops){
      const active=stop.dataset.journeyStop===key;
      stop.setAttribute('aria-pressed',String(active));
      stop.classList.toggle('is-active',active);
    }
    if(number)number.textContent=entry[0];
    if(title)title.textContent=entry[1];
    if(body)body.textContent=entry[2];
  }
  stops.forEach((stop,index)=>{
    stop.addEventListener('click',()=>selectStop(stop.dataset.journeyStop));
    stop.addEventListener('keydown',event=>{
      const delta={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
      const next=event.key==='Home'?0:event.key==='End'?stops.length-1:delta==null?null:(index+delta+stops.length)%stops.length;
      if(next===null)return;
      event.preventDefault();
      stops[next].focus();
      selectStop(stops[next].dataset.journeyStop);
    });
  });
  selectStop(currentStop);
  // Draw the conceptual route from the *actual* responsive waypoint positions.
  // No invented geographic coordinates and no loose connector lines.
  function alignJourneyPath(){
    const map=$('[data-journey-map]'),svg=map?.querySelector('svg');
    if(!svg||stops.length!==3||map.getBoundingClientRect().width===0)return;
    const box=map.getBoundingClientRect(),w=560,h=270;
    const coords=stops.map(stop=>{
      const rect=stop.getBoundingClientRect();
      return {
        x:Math.max(0,Math.min(w,((rect.left+rect.width/2)-box.left)/box.width*w)),
        y:Math.max(0,Math.min(h,(rect.top-4-box.top)/box.height*h))
      };
    });
    const [a,c,d]=coords;
    const path='M'+a.x.toFixed(2)+' '+a.y.toFixed(2)+
      ' C'+a.x.toFixed(2)+' '+((a.y+c.y)/2).toFixed(2)+
      ' '+c.x.toFixed(2)+' '+((a.y+c.y)/2).toFixed(2)+
      ' '+c.x.toFixed(2)+' '+c.y.toFixed(2)+
      ' S'+d.x.toFixed(2)+' '+((c.y+d.y)/2).toFixed(2)+
      ' '+d.x.toFixed(2)+' '+d.y.toFixed(2);
    svg.querySelectorAll('path').forEach(node=>node.setAttribute('d',path));
    svg.dataset.calibrated='true';
  }
  if(typeof ResizeObserver==='function'){
    const map=$('[data-journey-map]');
    if(map)new ResizeObserver(alignJourneyPath).observe(map);
  }
  window.addEventListener('resize',alignJourneyPath,{passive:true});
  requestAnimationFrame(alignJourneyPath);

  // Brief optional practice. Animations do not dictate or constrain breathing.
  const pause=$('#pausa'),toggle=pause?.querySelector('[data-pause-toggle]'),counter=pause?.querySelector('[data-pause-counter]');
  const art=pause?.querySelector('.yoga-pause-art'),phase=pause?.querySelector('[data-pause-phase]');
  const music=pause?.querySelector('[data-pause-sound]'),volume=pause?.querySelector('[data-pause-volume]'),audio=pause?.querySelector('[data-pause-audio]');
  let interval=0,until=0,remaining=30000,lastPhase='rest',active=false;
  function paintButtons(){
    if(toggle){
      toggle.setAttribute('aria-pressed',String(active));
      toggle.querySelector('[data-p2-lang="es"]').textContent=active?copy.es.stop:copy.es.start;
      toggle.querySelector('[data-p2-lang="en"]').textContent=active?copy.en.stop:copy.en.start;
    }
    if(music && audio){
      const playing=!audio.paused;
      music.setAttribute('aria-pressed',String(playing));
      music.querySelector('[data-p2-lang="es"]').textContent=playing?copy.es.silence:copy.es.listen;
      music.querySelector('[data-p2-lang="en"]').textContent=playing?copy.en.silence:copy.en.listen;
    }
  }
  function stop(reset=true){
    if(interval)clearInterval(interval);
    interval=0;active=false;
    if(reset)remaining=30000;
    lastPhase='rest';
    if(phase)phase.textContent=copy[lang()].rest;
    if(art)delete art.dataset.breathPhase;
    if(counter)counter.textContent='00:'+String(Math.ceil(remaining/1000)).padStart(2,'0');
    paintButtons();
  }
  function tick(){
    remaining=Math.max(0,until-performance.now());
    if(remaining<=0){stop();return}
    const passed=30000-remaining;
    const cycle=passed%10000;
    const next=cycle<4000?'inhale':'exhale';
    if(next!==lastPhase){
      lastPhase=next;
      if(art)art.dataset.breathPhase=next;
      if(phase)phase.textContent=copy[lang()][next];
    }
    if(counter)counter.textContent='00:'+String(Math.ceil(remaining/1000)).padStart(2,'0');
  }
  toggle?.addEventListener('click',()=>{
    if(active){stop();return}
    active=true;remaining=30000;until=performance.now()+remaining;
    lastPhase='rest';paintButtons();tick();interval=setInterval(tick,220);
  });
  if(audio){
    audio.volume=.35;
    volume?.addEventListener('input',()=>{audio.volume=Number(volume.value);audio.muted=false});
    audio.addEventListener('play',paintButtons);
    audio.addEventListener('pause',paintButtons);
    audio.addEventListener('ended',paintButtons);
    audio.addEventListener('error',()=>{
      if(music)music.title=copy[lang()].unavailable;
      paintButtons();
    });
    music?.addEventListener('click',async()=>{
      if(!audio.paused){audio.pause();return}
      try{await audio.play()}catch{
        music.title=copy[lang()].unavailable;
        music.setAttribute('aria-pressed','false');
      }
    });
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(active)stop(false);audio?.pause()}
  });
  // No sound or timer when another chapter is selected and this panel is hidden.
  const observer=typeof MutationObserver==='function'?new MutationObserver(()=>{
    if(pause && pause.getClientRects().length===0){if(active)stop(false);audio?.pause()}
  }):null;
  if(observer)observer.observe($('#main')||document.body,{attributes:true,attributeFilter:['data-p2-focus','data-p2-mode']});
  if(typeof MutationObserver==='function'){
    new MutationObserver(()=>{
      selectStop(currentStop);
      if(phase)phase.textContent=copy[lang()][lastPhase];
      paintButtons();
    }).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  }
  paintButtons();
})();