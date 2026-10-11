/* Yoga V72 · Uma's Presence Journey.
 * A guided attention practice, not a second meditation clock.
 * The existing studio sets meditationStep at meaningful progress landmarks.
 * Quiet/silent practice remains quiet: no extra sounds or forced breathing. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const guided=root?.querySelector("#studio-guided");
 const focus=guided?.querySelector(".studio-meditation-focus");
 if(!root||!guided||!focus)return;

 const journey=document.createElement("section");
 journey.className="studio-presence-journey";
 journey.setAttribute("aria-labelledby","studio-presence-title");
 journey.hidden=true;
 journey.innerHTML=[
  '<div class="studio-presence-overline"></div>',
  '<h4 id="studio-presence-title"></h4>',
  '<p class="studio-presence-invitation"></p>',
  '<ol class="studio-presence-steps">',
  ...[0,1,2].map(i=>'<li data-presence-step="'+i+'"><strong></strong><span></span></li>'),
  '</ol>',
  '<p class="studio-presence-return" aria-live="off"></p>'
 ].join("");
 focus.after(journey);
 const copy={
  es:{
   label:"ANTES DE EMPEZAR · UNA INTENCIÓN, NO UNA META",
   status:{
    prepare:"Prepara tu atención · puedes cambiar de ancla",
    arrive:"Llega a este momento",
    anchor:"Encuentra tu ancla",
    return:"Regresa con amabilidad",
    complete:"Lleva esta calma contigo"
   },
   silent:"Puedes permanecer en silencio. Las indicaciones son opcionales.",
   guided:"Cuando la mente se vaya, reconocerlo y regresar también forma parte de meditar.",
   sets:{
    breath:{
     title:"Respiración · un lugar al que regresar",
     invitation:"No necesitas respirar de una forma especial. Percibe una respiración tal como es.",
     steps:[
      ["1 · Llega","Siente el contacto del cuerpo con el asiento y deja que los hombros descansen."],
      ["2 · Atiende","Observa el aire en la nariz, el pecho o el vientre. Elige solo una sensación."],
      ["3 · Regresa","Si llegan pensamientos, nótalos sin luchar y vuelve al siguiente aliento."]
     ],
     return:"La atención no consiste en no distraerse. Consiste en poder regresar."
    },
    body:{
     title:"Cuerpo · sentir antes que corregir",
     invitation:"Elige un lugar donde el cuerpo tenga apoyo. No hay una postura perfecta que conseguir.",
     steps:[
      ["1 · Llega","Nota los pies, las piernas o el peso de la pelvis sobre la superficie."],
      ["2 · Atiende","Recorre mandíbula, hombros y manos. Observa lo que sientes sin cambiarlo."],
      ["3 · Regresa","Cuando te pierdas en ideas, vuelve a la presión, al calor o al contacto."]
     ],
     return:"Tu cuerpo puede ser un punto de referencia incluso cuando la mente se mueve."
    },
    space:{
     title:"Entorno · escuchar sin perseguir",
     invitation:"Sin buscar silencio absoluto, permite que los sonidos formen parte del momento.",
     steps:[
      ["1 · Llega","Abre suavemente la atención a los sonidos cercanos y lejanos."],
      ["2 · Atiende","Observa cada sonido aparecer y desaparecer, sin ponerle una historia."],
      ["3 · Regresa","Si un ruido te distrae, reconócelo y vuelve a escuchar el espacio."]
     ],
     return:"No hace falta controlar el entorno para practicar presencia."
    }
   }
  },
  en:{
   label:"BEFORE YOU BEGIN · AN INTENTION, NOT A TARGET",
   status:{
    prepare:"Prepare your attention · choose your anchor",
    arrive:"Arrive in this moment",
    anchor:"Find your anchor",
    return:"Return with kindness",
    complete:"Carry this calm with you"
   },
   silent:"You can remain in silence. Guidance is always optional.",
   guided:"When attention wanders, noticing and returning is part of meditation.",
   sets:{
    breath:{
     title:"Breath · a place to return to",
     invitation:"You don't need to breathe in a special way. Notice a breath as it is.",
     steps:[
      ["1 · Arrive","Feel your body supported and allow the shoulders to settle."],
      ["2 · Attend","Notice air at the nose, chest or belly. Choose just one sensation."],
      ["3 · Return","When thoughts arrive, notice gently and return to the next breath."]
     ],
     return:"Attention isn't never wandering. It is having a way back."
    },
    body:{
     title:"Body · feel before you fix",
     invitation:"Choose a place where your body is supported. There is no perfect pose to achieve.",
     steps:[
      ["1 · Arrive","Notice your feet, legs or the weight of your hips on the seat."],
      ["2 · Attend","Explore jaw, shoulders and hands. Notice sensation without fixing it."],
      ["3 · Return","When thoughts take over, come back to pressure, warmth or contact."]
     ],
     return:"Your body can be an anchor even when the mind is moving."
    },
    space:{
     title:"Space · listen without chasing",
     invitation:"You needn't find perfect quiet. Let sounds be part of the moment.",
     steps:[
      ["1 · Arrive","Notice sounds nearby and farther away."],
      ["2 · Attend","Hear each sound arise and fade without attaching a story."],
      ["3 · Return","If a noise catches you, acknowledge it and listen to the space again."]
     ],
     return:"You needn't control the room to practice presence."
    }
   }
  }
 };
 const render=()=>{
  const mode=guided.dataset.studioActive;
  journey.hidden=mode!=="meditation";
  if(journey.hidden)return;
  const w=copy[document.documentElement.lang==="en"?"en":"es"];
  const focusId=["breath","body","space"].includes(guided.dataset.meditationFocus)
    ?guided.dataset.meditationFocus:"breath";
  const current=w.sets[focusId];
  const step=guided.dataset.meditationStep||"prepare";
  const style=guided.dataset.meditationStyle||"guided";
  journey.dataset.activeStep=step;
  journey.dataset.focus=focusId;
  journey.dataset.style=style;
  journey.querySelector(".studio-presence-overline").textContent=w.label;
  journey.querySelector("#studio-presence-title").textContent=current.title;
  journey.querySelector(".studio-presence-invitation").textContent=current.invitation;
  const active=step==="arrive"?0:step==="anchor"?1:step==="return"||step==="complete"?2:-1;
  for(const [i,item] of [...journey.querySelectorAll(".studio-presence-steps li")].entries()){
    item.querySelector("strong").textContent=current.steps[i][0];
    item.querySelector("span").textContent=current.steps[i][1];
    item.classList.toggle("is-current",i===active);
    if(i===active)item.setAttribute("aria-current","step");
    else item.removeAttribute("aria-current");
  }
  journey.querySelector(".studio-presence-return").textContent=
    w.status[step]+". "+(style==="silent"?w.silent:
      step==="complete"?current.return:w.guided);
 };
 const observer=new MutationObserver(render);
 observer.observe(guided,{attributes:true,attributeFilter:[
  "data-studio-active","data-meditation-focus","data-meditation-style","data-meditation-step"]});
 observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
 render();
})();
