/* V75 · Editorial atlas of Yoga Instructor.
   Anchor links remain native; observer only adds context, never hijacks scroll. */
(() => {
  "use strict";
  const root = document.getElementById("atlas");
  if (!root) return;
  const nav = root.querySelector("#v75-atlas-nav");
  const links = [...nav.querySelectorAll("a[data-v75-step]")];
  const targets = links.map(link => document.getElementById(link.getAttribute("data-v75-step"))).filter(Boolean);
  const output = root.querySelector("#v75-current");
  const copy = {
    es:{
      eyebrow:"UNA VISITA CON SENTIDO · 2026",
      titleFirst:"Del propósito",titleSecond:"a la presencia.",
      lead:"Conoce mi forma de enseñar, descubre la experiencia que la sostiene y entra al estudio cuando quieras. Sin rodeos y sin perderte en la interfaz.",
      signature:"Gracián Baena",signatureRole:"Instructor de yoga · Murcia · ES / EN",
      stop1:"Mi enfoque",stop1sub:"El método y las opciones",
      stop2:"Casos reales",stop2sub:"Tres escenarios de enseñanza",
      stop3:"Estudio guiado",stop3sub:"Movement · Breath · Meditation",
      stop4:"Trayectoria",stop4sub:"Experiencia y formación",
      stop5:"Hablemos",stop5sub:"Una propuesta concreta",
      chapterNote:"PORTFOLIO PROFESIONAL / ESTUDIO INTERACTIVO",
      navigationLabel:"Mapa de este portfolio",
      activeLabel:"Capítulo activo"
    },
    en:{
      eyebrow:"A THOUGHTFUL VISIT · 2026",
      titleFirst:"From intention",titleSecond:"to presence.",
      lead:"Meet my teaching approach, explore the experience behind it and enter the studio whenever you like. A clear path, without getting lost in the interface.",
      signature:"Gracián Baena",signatureRole:"Yoga instructor · Murcia · ES / EN",
      stop1:"My approach",stop1sub:"Method and meaningful options",
      stop2:"Teaching cases",stop2sub:"Three real teaching settings",
      stop3:"Guided studio",stop3sub:"Movement · Breath · Meditation",
      stop4:"Background",stop4sub:"Experience and education",
      stop5:"Get in touch",stop5sub:"A concrete proposal",
      chapterNote:"PROFESSIONAL PORTFOLIO / INTERACTIVE STUDIO",
      navigationLabel:"Yoga portfolio chapter map",
      activeLabel:"Current chapter"
    }
  };
  let current = "portfolio";
  let requestedChapter = null;
  const getLanguage = () => document.documentElement.lang === "en" ? "en" : "es";
  function activate(id) {
    if (!links.some(link => link.dataset.v75Step === id)) return;
    current = id;
    links.forEach(link => {
      if (link.dataset.v75Step === current) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    const number = links.findIndex(link => link.dataset.v75Step === current) + 1;
    output.textContent = String(number).padStart(2,"0");
  }
  function paint() {
    const t = copy[getLanguage()];
    root.querySelectorAll("[data-v75-text]").forEach(element => {
      const key = element.dataset.v75Text;
      if (typeof t[key] === "string") element.textContent = t[key];
    });
    nav.setAttribute("aria-label",t.navigationLabel);
    root.querySelector(".v75-atlas-progress").setAttribute("aria-label",t.activeLabel);
  }
  // The observer sees sections as they cross the reading region.
  // Clicking an anchor immediately reflects the user's explicit choice.
  // A smooth anchor jump crosses earlier chapters. Do not overwrite the
  // chapter explicitly requested by the user during that transition.
  links.forEach(link => link.addEventListener("click",() => {
    requestedChapter = link.dataset.v75Step;
    activate(requestedChapter);
  }));
  // An interrupted jump returns control to real viewport observation.
  ["wheel","touchstart"].forEach(event =>
    window.addEventListener(event, () => { requestedChapter = null; }, {passive:true}));
  if (typeof IntersectionObserver === "function" && targets.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      if (requestedChapter) {
        const requested = visible.find(entry => entry.target.id === requestedChapter);
        if (!requested) return;
        requestedChapter = null;
        activate(requested.target.id);
        return;
      }
      visible.sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      activate(visible[0].target.id);
    }, {threshold:0,rootMargin:"-12% 0px -62% 0px"});
    targets.forEach(target => observer.observe(target));
    window.addEventListener("pagehide",() => observer.disconnect(),{once:true});
  }
  new MutationObserver(changes => {
    if (changes.some(change=>change.attributeName==="lang")) paint();
  }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  paint();
  activate(current);
})();
