/* V77: disclosure-first teaching CV explorer. No analytics, storage or external claims. */
(()=>{
 "use strict";
 const root=document.getElementById("trayectoria");if(!root)return;
 const data={
 es:{kicker:"03 / TRAYECTORIA EN CONTEXTO",titleA:"Más allá de las fechas.",titleB:"Así enseño.",
 lead:"Una línea de experiencia profesional que puedes explorar por tipo de enseñanza. Cada entrada distingue trayectoria declarada, método y documentación disponible.",
 honesty:"Trayectoria descrita por el instructor. Los CV son documentos propios; no sustituyen una verificación independiente de titulaciones o empleo.",
 filterGroup:"Sala",filterAll:"Todo",filterIndividual:"1:1",filterWorkplace:"Equipos",filterTraining:"Formación",
 moodType:"Docencia presencial · hasta junio de 2026",moodStory:"Clases para distintos niveles, usando alternativas, atención al movimiento y progresión dentro de un espacio compartido.",
 moodDetail:"La carga y las posturas se ajustan a la experiencia del grupo. Sin afirmar resultados medidos ni atribuir la actividad del centro a una sola persona.",
 oneTitle:"Clases individuales",oneType:"Personalización · atención particular",
 oneStory:"Conversar sobre el objetivo, observar el punto de partida y adaptar la propuesta sin imponer una práctica única.",
 oneDetail:"La sesión puede variar según movilidad, experiencia y comodidad. La práctica no sustituye orientación médica individualizada.",
 teamType:"Entorno corporativo · proyectos Google/YouTube",teamStory:"Apoyo al bienestar en un contexto de operaciones, con prácticas que se adaptan a pausas de trabajo y equipos diversos.",
 teamDetail:"Experiencia como profesional de Majorel en proyectos de Google/YouTube, no empleo directo por estas últimas empresas. Sin métricas clínicas ni testimonios atribuidos.",
 trainingTitle:"Formación de instructor · Madrid",trainingType:"Asanas · pranayama · filosofía",
 trainingStory:"Formación intensiva y prácticas de enseñanza como base para las posteriores clases individuales y en sala.",
 trainingDetail:"El portfolio recoge la formación declarada. Para comprobar entidad emisora y certificación específica es necesario consultar el certificado original.",
 approach:"Enfoque y límites",documents:"Documentos de referencia",documentNote:"El CV y la carta son documentos propios, sin aval externo implícito.",
 cv:"Consultar CV · ES",letter:"Carta de presentación",print:"Imprimir esta trayectoria",
 filterLabel:"Filtrar experiencia", count:n=>n===1?"1 experiencia":n+" experiencias"},
 en:{kicker:"03 / EXPERIENCE IN CONTEXT",titleA:"Beyond the dates.",titleB:"How I teach.",
 lead:"Explore a teaching career by practice setting. Each entry separates declared experience, approach and the documentation available.",
 honesty:"Professional background described by the instructor. CVs are self-authored; they are not independent employment or qualification verification.",
 filterGroup:"Group",filterAll:"All",filterIndividual:"1:1",filterWorkplace:"Teams",filterTraining:"Training",
 moodType:"In-person teaching · until June 2026",moodStory:"Classes for varied experience levels, with options, movement awareness and progressive work within a shared space.",
 moodDetail:"Load and posture choices are adjusted for the group. No fabricated outcome metrics or claims of sole ownership of the centre's work.",
 oneTitle:"Private yoga lessons",oneType:"One-to-one · personal attention",
 oneStory:"Start with a conversation about the goal, observe the starting point and adapt the session rather than prescribing a single routine.",
 oneDetail:"The session may change with mobility, experience and comfort. Yoga does not replace individual medical advice.",
 teamType:"Workplace environment · Google/YouTube projects",teamStory:"Wellbeing support in an operations environment, with practices suited to work breaks and mixed teams.",
 teamDetail:"Work performed as a Majorel professional on Google/YouTube projects, not as a direct employee of those companies. No clinical metrics or attributed testimonials.",
 trainingTitle:"Yoga instructor training · Madrid",trainingType:"Asana · pranayama · philosophy",
 trainingStory:"Intensive study and teaching practice underpinning later private and group classes.",
 trainingDetail:"The portfolio states the instructor's training history. Independent checks of the issuer and specific certificate require the original document.",
 approach:"Approach and limits",documents:"Reference documents",documentNote:"CV and cover letter are self-authored; no third-party endorsement is implied.",
 cv:"View CV · EN",letter:"Cover letter",print:"Print this experience record",
 filterLabel:"Filter experience",count:n=>n===1?"1 experience":n+" experiences"}
 };
 const buttons=[...root.querySelectorAll("[data-v77-filter]")];
 const cards=[...root.querySelectorAll(".v77-entry")];
 const count=root.querySelector("#v77-count");
 let selected="all";
 const language=()=>document.documentElement.lang==="en"?"en":"es";
 function render(){
  const lang=language(),words=data[lang];
  root.querySelectorAll("[data-v77-text]").forEach(el=>{const key=el.dataset.v77Text;if(typeof words[key]==="string")el.textContent=words[key]});
  root.querySelector("[data-v77-label]").setAttribute("aria-label",words.filterLabel);
  let visible=0;
  cards.forEach(card=>{const match=selected==="all"||selected===card.dataset.v77Role;card.hidden=!match;if(match)visible++});
  buttons.forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.v77Filter===selected)));
  count.textContent=words.count(visible);
  root.querySelector("#v77-cv").href="https://gracianb.github.io/GracianB/Gracian_Baena_CV_Yoga_"+lang.toUpperCase()+".pdf";
  root.querySelector("#v77-letter").href=lang==="en"?"https://gracianb.github.io/GracianB/Gracian_Baena_Cover_Letter_Yoga_EN.pdf":"https://gracianb.github.io/GracianB/Gracian_Baena_Carta_Yoga_ES.pdf";
 }
 buttons.forEach(btn=>btn.addEventListener("click",()=>{selected=btn.dataset.v77Filter;render()}));
 root.querySelector("#v77-print").addEventListener("click",()=>window.print());
 new MutationObserver(changes=>{if(changes.some(change=>change.attributeName==="lang"))render()})
 .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 render();
})();
