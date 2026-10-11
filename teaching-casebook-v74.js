/* V74 · Professional casebook and illustrative lesson architecture.
   Examples are prospective lesson designs, not historic session metrics. */
(() => {
  "use strict";
  const root = document.getElementById("casos");
  if (!root) return;
  const setting = root.querySelector("#v74-setting");
  const duration = root.querySelector("#v74-duration");
  const steps = root.querySelector("#v74-steps");
  const bar = root.querySelector("#v74-plan-bar");
  const sum = root.querySelector("#v74-total");
  const adaptation = root.querySelector("#v74-adaptation");
  const contact = root.querySelector("#v74-contact");
  const dict = {
    es: {
      kicker:"02 / EXPERIENCIA APLICADA", titleA:"No es solo",titleB:"enseñar posturas.",
      lead:"Es leer el contexto, ofrecer variantes y sostener la atención. Tres entornos en los que he enseñado y cómo planteo una sesión para cada uno.",
      trustTitle:"Experiencia y propuesta, sin cifras inventadas.",
      trustBody:"Los lugares y periodos proceden de mi trayectoria. Los guiones que siguen son ejemplos metodológicos, no métricas ni testimonios de antiguos alumnos.",
      contextLabel:"Contexto",approachLabel:"Intervención",judgmentLabel:"Criterio docente",transferLabel:"Qué aporto",
      salaTitle:"Una sala. Muchos puntos de partida.",salaSub:"Mood Fitness · clases multinivel",
      salaLead:"Un grupo comparte el mismo espacio, pero no necesariamente la misma movilidad, fuerza o experiencia. La clase necesita una arquitectura común sin volverse rígida.",
      salaContext:"Enseñanza grupal en un centro deportivo de Murcia hasta su cierre en junio de 2026.",
      salaApproach:"Diseño de secuencias progresivas, explicaciones breves y opciones para diferentes niveles.",
      salaJudgment:"Priorizar estabilidad, comodidad y adaptación frente a la forma visual de la postura.",
      salaTransfer:"Una estructura que permite participar sin convertir una sesión grupal en una competición.",
      salaFoot:"Clases reales · 2022–2026",
      oneTitle:"Escuchar primero. Proponer después.",oneSub:"Clases particulares · enseñanza individual",
      oneLead:"En una clase individual, la secuencia responde a la persona y al día. El progreso no se mide por hacer una postura más difícil.",
      oneContext:"Prácticas individuales adaptadas a objetivos de movilidad, hábitos y atención.",
      oneApproach:"Escucha inicial, variantes con apoyos y revisión gradual de la práctica.",
      oneJudgment:"Respetar límites personales y ofrecer descanso sin presentarlo como un fracaso.",
      oneTransfer:"Una práctica comprensible que la persona pueda integrar con autonomía.",
      oneFoot:"Clases particulares · 2019–2022",
      teamTitle:"Una pausa útil dentro del trabajo.",teamSub:"Majorel · entorno Google / YouTube",
      teamLead:"En un equipo, el yoga debe ser accesible, voluntario y respetuoso con el tiempo y la diversidad física de quienes participan.",
      teamContext:"Wellness Ambassador y yoga corporativo en Majorel para equipos vinculados al entorno Google / YouTube.",
      teamApproach:"Sesiones prácticas centradas en pausa, movilidad sencilla y atención, sin requerir experiencia previa.",
      teamJudgment:"Alternativas de pie o en silla, participación voluntaria y lenguaje sin presión.",
      teamTransfer:"Un formato adaptable a horarios, espacios y necesidades de un grupo profesional.",
      teamFoot:"Majorel · 2020–2021",
      planLink:"Ver ejemplo de clase ↗",caseLink:"Explorar los casos ↗", planKicker:"EL MÉTODO EN PRÁCTICA",
      planTitle:"Diseña una sesión de ejemplo.",
      planLead:"Selecciona el contexto y el tiempo. Verás un esquema orientativo, no una clase prescrita ni una reproducción de una sesión histórica.",
      settingLabel:"¿Para quién?", settingSala:"Grupo multinivel", settingOne:"Sesión individual",settingTeams:"Equipo de trabajo",
      durationLabel:"Duración total",totalLabel:"DURACIÓN PROPUESTA", planContact:"Consultar una sesión real ↗",
      tryStudio:"Explorar el estudio guiado ↗",
      safety:"El plan es educativo y orientativo. En presencia de dolor, lesión o condiciones médicas, consulta a un profesional sanitario antes de adaptar la práctica.",
      phases:{
        sala:{
          weights:[.14,.20,.51,.15],
          labels:["Llegada y escucha","Preparación progresiva","Asanas con variantes","Integración y descanso"],
          descriptions:["Tomar contacto con el grupo; invitar a elegir intensidad.","Movilizar articulaciones de forma gradual y ofrecer apoyos.","Secuencia flexible con progresiones y opciones para descansar.","Cerrar sin prisa; dejar tiempo para recuperar el ritmo natural."],
          adaptation:"Sala: progresiones para distintos niveles, apoyos y libertad de pausar.",
          subject:"Propuesta de clase de yoga multinivel"
        },
        individual:{
          weights:[.22,.22,.39,.17],
          labels:["Escucha y acuerdo","Movilidad orientativa","Exploración personal","Integración y siguientes pasos"],
          descriptions:["Preguntar objetivos, sensaciones y preferencias sin hacer diagnóstico.","Elegir movimientos accesibles; introducir soportes y pausas.","Explorar solo variantes cómodas y ajustar según respuesta de la persona.","Revisar lo aprendido y proponer continuidad realista."],
          adaptation:"Sesión individual: escuchar, adaptar y no convertir el esfuerzo en obligación.",
          subject:"Propuesta de sesión individual de yoga"
        },
        equipos:{
          weights:[.20,.23,.34,.23],
          labels:["Llegada sin exigencia","Respiración natural y movilidad","Pausa corporal accesible","Regreso al trabajo"],
          descriptions:["Presentar la sesión y recordar que cada paso es voluntario.","Respirar de forma cómoda y movilizar cuello, hombros y espalda sin forzar.","Alternativas de pie o sentados; atención al espacio y a las sensaciones.","Cerrar suavemente, sin prometer resultados clínicos."],
          adaptation:"Equipo: participación voluntaria, opciones sentadas y duración compatible con una pausa laboral.",
          subject:"Propuesta de bienestar con yoga para equipos"
        }
      }
    },
    en: {
      kicker:"02 / TEACHING IN PRACTICE",titleA:"It is not just",titleB:"teaching poses.",
      lead:"It is understanding context, offering options and supporting attention. Three settings where I have taught, and how I would structure a session for each.",
      trustTitle:"Experience and method, without invented numbers.",
      trustBody:"The places and dates come from my professional history. These lesson outlines are illustrative methods, not measured outcomes or former students' testimonials.",
      contextLabel:"Context",approachLabel:"What I did",judgmentLabel:"Teaching judgment",transferLabel:"What I bring",
      salaTitle:"One room. Many starting points.",salaSub:"Mood Fitness · multilevel group classes",
      salaLead:"A group shares a space, but not necessarily the same mobility, strength or experience. A class needs a shared structure without becoming rigid.",
      salaContext:"Group classes at a fitness centre in Murcia until its closure in June 2026.",
      salaApproach:"Progressive sequences, clear cues and alternatives for different levels.",
      salaJudgment:"Place stability, comfort and adaptation above the visual shape of a pose.",
      salaTransfer:"A structure that lets participants take part without turning the group into a competition.",
      salaFoot:"Group classes · 2022–2026",
      oneTitle:"Listen first. Offer options next.",oneSub:"Private yoga classes · one-to-one teaching",
      oneLead:"In an individual lesson, the sequence responds to the person and the day. Progress is not measured by the difficulty of a pose.",
      oneContext:"Individual practice adapted to mobility, consistency and attention goals.",
      oneApproach:"An initial conversation, props and gradual adjustment of the practice.",
      oneJudgment:"Respect personal limits and make rest an option rather than a failure.",
      oneTransfer:"An understandable practice people can learn to navigate independently.",
      oneFoot:"Private classes · 2019–2022",
      teamTitle:"A useful pause during the working day.",teamSub:"Majorel · Google / YouTube environment",
      teamLead:"For teams, yoga should be accessible, voluntary and respectful of people's time and physical differences.",
      teamContext:"Wellness Ambassador and workplace yoga at Majorel for teams in the Google / YouTube account environment.",
      teamApproach:"Practical sessions built around pauses, simple mobility and attention, with no yoga experience required.",
      teamJudgment:"Standing or seated options, voluntary participation and language without pressure.",
      teamTransfer:"A format adaptable to schedules, spaces and the needs of a professional team.",
      teamFoot:"Majorel · 2020–2021",
      planLink:"Explore a sample session ↗",caseLink:"Explore the case studies ↗",planKicker:"THE METHOD IN ACTION",
      planTitle:"Build a sample session.",
      planLead:"Choose a setting and a duration. This is an illustrative outline, not a prescribed class or a reconstruction of a historical session.",
      settingLabel:"Who is it for?",settingSala:"Multilevel group",settingOne:"One-to-one",settingTeams:"Workplace team",
      durationLabel:"Total duration",totalLabel:"SUGGESTED DURATION",planContact:"Enquire about a real session ↗",
      tryStudio:"Explore guided studio ↗",
      safety:"This plan is educational and illustrative. If you have pain, an injury or a medical condition, consult a healthcare professional before adapting your practice.",
      phases:{
        sala:{
          weights:[.14,.20,.51,.15],
          labels:["Arrive and listen","Progressive preparation","Asanas with options","Integration and rest"],
          descriptions:["Connect with the group and invite participants to choose intensity.","Mobilise gradually, introducing helpful props and options.","A flexible sequence with progressions and space to rest.","Close without rushing and return to natural breathing."],
          adaptation:"Group: options for different levels, props and permission to pause.",
          subject:"Enquiry about multilevel group yoga"
        },
        individual:{
          weights:[.22,.22,.39,.17],
          labels:["Listen and agree","Introductory mobility","Personal exploration","Integrate and plan"],
          descriptions:["Discuss goals and preferences without diagnosing.","Choose accessible movements and introduce support and pauses.","Explore comfortable variations and adjust based on feedback.","Reflect on learning and realistic consistency."],
          adaptation:"One-to-one: listen, adapt and never make effort mandatory.",
          subject:"Enquiry about one-to-one yoga"
        },
        equipos:{
          weights:[.20,.23,.34,.23],
          labels:["Arrive without pressure","Natural breath and mobility","Accessible body break","Return to work"],
          descriptions:["Introduce the session and emphasise voluntary participation.","Breathe comfortably and gently mobilise neck, shoulders and back.","Standing or seated alternatives; attention to space and sensation.","Close gently without making clinical promises."],
          adaptation:"Workplace: voluntary participation, seated options and a duration suitable for a work break.",
          subject:"Enquiry about workplace yoga"
        }
      }
    }
  };
  const lang = () => document.documentElement.lang === "en" ? "en" : "es";
  const t = () => dict[lang()];
  // Largest remainder ensures the four phase durations sum exactly to requested minutes.
  const allocate = (minutes, weights) => {
    const precise = weights.map(weight => weight * minutes);
    const parts = precise.map(Math.floor);
    let left = minutes - parts.reduce((sum, x) => sum + x, 0);
    const order = precise.map((number, index) => ({index, fraction:number - parts[index]}))
      .sort((a,b) => b.fraction - a.fraction || a.index - b.index);
    for (let i = 0; i < left; i++) parts[order[i].index]++;
    return parts;
  };
  function renderPlan() {
    const data = t().phases[setting.value] || t().phases.sala;
    const minutes = Number(duration.value);
    if (![15,30,45,60].includes(minutes)) return;
    const times = allocate(minutes, data.weights);
    sum.replaceChildren(String(minutes) + " ");
    const unit = document.createElement("small");
    unit.textContent = "min";
    sum.append(unit);
    sum.setAttribute("aria-label",String(minutes) + " minutes");
    adaptation.textContent = data.adaptation;
    const nodes = data.labels.map((label,index) => {
      const li = document.createElement("li");
      const number = document.createElement("b");
      number.textContent = String(index + 1).padStart(2,"0");
      const wrap = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = label;
      const detail = document.createElement("span");
      detail.textContent = data.descriptions[index];
      wrap.append(name,detail);
      const time = document.createElement("small");
      time.textContent = times[index] + " min";
      li.append(number,wrap,time);
      return li;
    });
    steps.replaceChildren(...nodes);
    bar.replaceChildren(...times.map((part,index) => {
      const piece = document.createElement("span");
      piece.style.flexGrow = String(part);
      piece.setAttribute("data-phase", String(index + 1));
      return piece;
    }));
    contact.href = "mailto:gracianbaenagonzalez@gmail.com?subject=" + encodeURIComponent(data.subject);
  }
  function paint() {
    const copy = t();
    root.querySelectorAll("[data-v74-text]").forEach(el => {
      const key = el.getAttribute("data-v74-text");
      if (typeof copy[key] === "string") el.textContent = copy[key];
    });
    steps.setAttribute("aria-label", lang()==="en"?"Session phases":"Fases de la sesión");
    renderPlan();
  }
  root.querySelectorAll("a[data-v74-choose]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    setting.value = link.dataset.v74Choose;
    renderPlan();
    // Keep both the selected teaching context and a real, shareable anchor.
    // Other site navigation scripts can otherwise consume the native jump.
    try {
      window.history.replaceState(window.history.state, "", "#programa");
    } catch (_) {
      window.location.hash = "programa";
    }
    document.getElementById("programa")?.scrollIntoView({block:"start",behavior:"instant"});
  }));
  setting.addEventListener("change", renderPlan);
  duration.addEventListener("change", renderPlan);
  new MutationObserver(changes => {
    if (changes.some(change => change.attributeName === "lang")) paint();
  }).observe(document.documentElement, {attributes:true,attributeFilter:["lang"]});
  paint();
})();
