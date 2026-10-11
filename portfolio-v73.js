/* Yoga V73 · Portfolio editorial and teaching-path selector.
   No tracking, autoplay, external calls or duplicate practice clock. */
(() => {
  "use strict";
  const root = document.getElementById("portfolio");
  if (!root) return;
  const buttons = [...root.querySelectorAll("[data-v73-track]")];
  const panel = document.getElementById("portfolio-v73-panel");
  const copy = {
    es: {
      nav: "Portfolio",
      overline: "01 / PORTFOLIO DEL INSTRUCTOR",
      titleFirst: "Enseñar yoga es",
      titleSecond: "saber acompañar.",
      intro: "Una práctica clara, adaptable y humana. Del primer minuto de atención al último momento de descanso, cada clase tiene un porqué.",
      eyebrow: "MI ENFOQUE",
      journeyQuote: "Atención al principio. Opciones durante la clase. Calma al final.",
      principle1: "Escuchar antes de proponer",
      principle2: "Dar opciones, no imponer formas",
      principle3: "Cerrar con integración, no con prisa",
      proofTitle: "Una trayectoria que se puede comprobar",
      proofLead: "Formación y experiencia de sala, enseñanza individual y bienestar corporativo. Sin cifras inventadas ni promesas milagrosas.",
      proof1Period: "2019 · Madrid",
      proof1Title: "Formación en yoga",
      proof1Text: "Asanas, pranayama, filosofía y práctica docente.",
      proof2Period: "2022–jun. 2026 · Murcia",
      proof2Title: "Mood Fitness",
      proof2Text: "Clases de yoga multinivel en un centro deportivo.",
      proof3Period: "2020–2021",
      proof3Title: "Majorel · Google / YouTube",
      proof3Text: "Wellness Ambassador y sesiones para equipos en un contexto corporativo.",
      proofLink: "Ver experiencia detallada ↗",
      routesTitle: "Elige cómo trabajar conmigo",
      routesLead: "Tres contextos distintos. Una misma idea: adaptar la práctica a las personas, no al revés.",
      routeSala: "En sala",
      routeOne: "Individual",
      routeWork: "Equipos",
      routeLabel: "Modalidad de enseñanza",
      studyLabel: "ASÍ DISEÑO UNA CLASE",
      studyTitle: "Una estructura con espacio para las personas",
      study1: "01 · Llegar",
      study1Body: "Observamos el estado del grupo y damos tiempo para aterrizar.",
      study2: "02 · Explorar",
      study2Body: "Progresiones, movilidad y opciones reales para distintos niveles.",
      study3: "03 · Integrar",
      study3Body: "Respiración, pausa y salida consciente antes de volver al día.",
      curriculum: "Ver CV completo",
      studio: "Entrar al estudio guiado",
      contact: "Consultar disponibilidad",
      offerTag: "FORMATO DE ENSEÑANZA",
      detailTag: "CÓMO LO TRABAJO",
      sourceTag: "EXPERIENCIA RELACIONADA",
      tracks: {
        sala: {
          eyebrow: "MOVIMIENTO · CONEXIÓN · ADAPTACIÓN",
          title: "Clases colectivas con atención individual.",
          description: "Una sesión compartida no debería ser una coreografía obligatoria. Ofrezco progresiones y variantes para que cada persona participe desde su punto de partida.",
          detail: ["Lectura del grupo antes de establecer la intensidad.", "Opciones para movilidad, equilibrio y descanso.", "Transiciones explicadas con calma y sentido."],
          source: "Mood Fitness · Murcia, 2022 a junio de 2026.",
          subject: "Consulta de clases de yoga en sala"
        },
        individual: {
          eyebrow: "ESCUCHA · MOVILIDAD · CONSTANCIA",
          title: "Un espacio para construir tu propia práctica.",
          description: "Partimos de objetivos realistas y adaptamos intensidad, ritmo y propuestas. La técnica acompaña el proceso; no se convierte en una competición.",
          detail: ["Punto de partida, experiencia y preferencias.", "Secuencias adaptables con alternativas claras.", "Hábitos sencillos para sostener la continuidad."],
          source: "Clases particulares · 2019 a 2022.",
          subject: "Consulta de sesión individual de yoga"
        },
        equipos: {
          eyebrow: "PRESENCIA · PAUSA · EQUIPO",
          title: "Bienestar corporativo sin fórmulas vacías.",
          description: "Sesiones accesibles para crear pausas con intención, respirar y recuperar atención en la jornada, sin exigir experiencia previa en yoga.",
          detail: ["Prácticas inclusivas y adaptables a las personas.", "Movimiento consciente, respiración y descanso.", "Formatos que respetan el contexto de trabajo."],
          source: "Wellness Ambassador · Majorel (entorno Google / YouTube), 2020–2021.",
          subject: "Consulta de yoga y bienestar para equipos"
        }
      }
    },
    en: {
      nav: "Portfolio",
      overline: "01 / YOGA TEACHING PORTFOLIO",
      titleFirst: "Teaching yoga means",
      titleSecond: "knowing how to support.",
      intro: "A clear, adaptable, human practice. From the first moment of attention to the last moment of rest, every part of a class has a purpose.",
      eyebrow: "MY APPROACH",
      journeyQuote: "Attention at the start. Options throughout. Calm at the end.",
      principle1: "Listen before proposing",
      principle2: "Offer choices rather than impose shapes",
      principle3: "Close with integration, never in a rush",
      proofTitle: "Experience you can explore",
      proofLead: "Training and experience in group classes, one-to-one teaching and workplace wellbeing. No invented figures or miracle claims.",
      proof1Period: "2019 · Madrid",
      proof1Title: "Yoga training",
      proof1Text: "Asanas, pranayama, philosophy and teaching practice.",
      proof2Period: "2022–Jun 2026 · Murcia",
      proof2Title: "Mood Fitness",
      proof2Text: "Multilevel yoga classes in a fitness studio.",
      proof3Period: "2020–2021",
      proof3Title: "Majorel · Google / YouTube",
      proof3Text: "Wellness Ambassador and sessions for teams in a corporate setting.",
      proofLink: "Explore experience ↗",
      routesTitle: "Choose how to work with me",
      routesLead: "Three different settings. One principle: adapt the practice to the people, not the people to the practice.",
      routeSala: "Group classes",
      routeOne: "One-to-one",
      routeWork: "Teams",
      routeLabel: "Teaching format",
      studyLabel: "HOW I DESIGN A CLASS",
      studyTitle: "A structure that leaves space for people",
      study1: "01 · Arrive",
      study1Body: "Observe the group's energy and allow time to settle.",
      study2: "02 · Explore",
      study2Body: "Progressions, mobility and meaningful options for different levels.",
      study3: "03 · Integrate",
      study3Body: "Breath, pause and a conscious transition back to the day.",
      curriculum: "View full CV",
      studio: "Enter guided studio",
      contact: "Ask about availability",
      offerTag: "TEACHING FORMAT",
      detailTag: "HOW WE WORK",
      sourceTag: "RELEVANT EXPERIENCE",
      tracks: {
        sala: {
          eyebrow: "MOVEMENT · CONNECTION · ADAPTATION",
          title: "Group classes with space for individuals.",
          description: "A shared session should not become a mandatory choreography. I offer progressions and alternatives so each person can participate from their own starting point.",
          detail: ["Read the group before choosing intensity.", "Options for mobility, balance and rest.", "Clear, thoughtful transitions."],
          source: "Mood Fitness · Murcia, 2022 to June 2026.",
          subject: "Enquiry about group yoga classes"
        },
        individual: {
          eyebrow: "LISTENING · MOBILITY · CONSISTENCY",
          title: "A space to build your own practice.",
          description: "We begin with realistic goals and adapt intensity, pace and suggestions. Technique supports the journey rather than becoming a competition.",
          detail: ["Starting point, experience and preferences.", "Adaptable sequences with clear alternatives.", "Simple habits to support consistency."],
          source: "Private yoga classes · 2019 to 2022.",
          subject: "Enquiry about a private yoga session"
        },
        equipos: {
          eyebrow: "PRESENCE · PAUSE · TEAM",
          title: "Workplace wellbeing without empty formulas.",
          description: "Accessible sessions to make intentional pauses, breathe and return to attention during the working day, with no prior yoga experience required.",
          detail: ["Inclusive options suited to real participants.", "Mindful movement, breath and rest.", "Formats that respect the working environment."],
          source: "Wellness Ambassador · Majorel (Google / YouTube environment), 2020–2021.",
          subject: "Enquiry about yoga and wellbeing for teams"
        }
      }
    }
  };
  let selected = "sala";
  function paint() {
    const lang = document.documentElement.lang === "en" ? "en" : "es";
    const t = copy[lang], item = t.tracks[selected];
    root.querySelectorAll("[data-v73-text]").forEach(el => {
      const key = el.getAttribute("data-v73-text");
      if (typeof t[key] === "string") el.textContent = t[key];
    });
    document.querySelectorAll("[data-v73-nav]").forEach(el => { el.textContent = t.nav; });
    buttons.forEach(button => {
      const active = button.getAttribute("data-v73-track") === selected;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    tablist.setAttribute("aria-label", t.routeLabel);
    panel.setAttribute("aria-labelledby", "portfolio-v73-tab-" + selected);
    root.querySelector("#portfolio-v73-eyebrow").textContent = item.eyebrow;
    root.querySelector("#portfolio-v73-offer").textContent = item.title;
    root.querySelector("#portfolio-v73-description").textContent = item.description;
    root.querySelector("#portfolio-v73-source").textContent = item.source;
    const list = root.querySelector("#portfolio-v73-details");
    list.replaceChildren(...item.detail.map(value => {
      const li = document.createElement("li");
      li.textContent = value;
      return li;
    }));
    const mail = root.querySelector("#portfolio-v73-contact");
    mail.href = "mailto:gracianbaenagonzalez@gmail.com?subject=" + encodeURIComponent(item.subject);
  }
  function activate(button, moveFocus = false) {
    if (!button) return;
    selected = button.getAttribute("data-v73-track");
    paint();
    if (moveFocus) button.focus();
  }
  const tablist = root.querySelector('[role="tablist"]');
  tablist.addEventListener("click", event => {
    const button = event.target.closest("[data-v73-track]");
    if (button && tablist.contains(button)) activate(button);
  });
  tablist.addEventListener("keydown", event => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const current = buttons.findIndex(button => button.getAttribute("data-v73-track") === selected);
    const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 :
      (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault();
    activate(buttons[index], true);
  });
  new MutationObserver((records) => {
    if (records.some(record => record.attributeName === "lang")) paint();
  }).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});
  paint();
})();
