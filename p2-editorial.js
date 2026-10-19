/* P2 | One clear entrance and one movement canvas at a time.
 * This pass only re-parents established components; no second renderers,
 * clocks, audio elements or generated asanas are introduced. */
(()=>{
"use strict";
const main=document.getElementById("main");
const hero=document.getElementById("inicio");
const studio=document.getElementById("instructor-flow");
const portfolio=document.getElementById("portfolio");
const book=document.getElementById("studio-asana-library");
if(!main||!hero||!studio||!book||!portfolio)return;

const lang=()=>document.documentElement.lang==="en"?"en":"es";
const short={
 es:{lotus:"Abrir respiración",book:"Explorar las 12 asanas",closeBook:"Volver a la sesión",audio:"Música (opcional)",advanced:"Buscar, filtrar y crear rutas",more:"Explorar detalles y recursos",note:"Contenido adicional, sin interrumpir la práctica"},
 en:{lotus:"Open breathing practice",book:"Explore the 12 asanas",closeBook:"Return to the session",audio:"Music (optional)",advanced:"Search, filter and build routes",more:"Explore details and resources",note:"Extra information, without interrupting your practice"}
};
const t=(key)=>short[lang()][key];
function insertAfter(node,anchor){if(node&&anchor&&node!==anchor)anchor.after(node);}

// The studio is the main product: no book, atlas, or multi-step guide before it.
insertAfter(studio,hero);
insertAfter(portfolio,studio);

// The book is available inside the Movement experience, not as a second
// page-sized app. Preserve its pose controls, search, renderer and coaching.
if(book.parentElement!==studio)studio.append(book);
book.dataset.bookStandalone="false";
book.dataset.p2BookOpen="false";
const heading=book.querySelector(".studio-library-heading");
// Curriculum, filters and search are optional, not another entry screen.
const choicePanel=book.querySelector(".studio-library-choices");
const curriculum=choicePanel?.querySelector(".v81-atlas");
const categoryFilters=choicePanel?.querySelector(".studio-library-filters");
let advancedSummary;
if(choicePanel && (curriculum||categoryFilters)){
 const advanced=document.createElement("details");
 advanced.id="p2-asana-advanced";advanced.className="p2-asana-advanced";
 advancedSummary=document.createElement("summary");advanced.append(advancedSummary);
 choicePanel.prepend(advanced);
 if(curriculum)advanced.append(curriculum);
 if(categoryFilters)advanced.append(categoryFilters);
}
const toggle=document.createElement("button");
toggle.type="button";
toggle.id="p2-asana-toggle";
toggle.className="p2-book-toggle";
toggle.setAttribute("aria-expanded","false");
toggle.setAttribute("aria-controls","p2-book-content");
const body=document.createElement("div");
body.id="p2-book-content";
body.className="p2-book-content";
for(const element of [...book.children].filter(x=>x!==heading))body.append(element);
heading?.after(toggle,body);
function setBook(open,focus=false){
  // An invisible running movement session would be unsafe and confusing.
  // Pause through the existing controller before switching to study mode.
  if(open && studio.dataset.studioMode==="asanas" &&
     studio.querySelector("#flow-guide")?.dataset.status==="running"){
    studio.querySelector('[data-flow-action="pause"]')?.click();
  }
  book.dataset.p2BookOpen=String(open);
  studio.dataset.p2Book=open?"open":"closed";
  toggle.setAttribute("aria-expanded",String(open));
  toggle.textContent=t(open?"closeBook":"book");
  window.dispatchEvent(new Event("yoga:p2-book-change"));
  if(open && studio.dataset.studioMode!=="asanas"){
    studio.querySelector('[data-studio-mode="asanas"]')?.click();
  }
  if(focus)toggle.focus({preventScroll:true});
}
toggle.addEventListener("click",()=>setBook(book.dataset.p2BookOpen!=="true",true));
book.addEventListener("click",event=>{
  if(event.target.closest("[data-library-pose], [data-v81-route]"))setBook(true);
});
studio.querySelectorAll('[data-studio-mode]').forEach(button=>{
  button.addEventListener("click",()=>{
    if(button.dataset.studioMode!=="asanas")setBook(false);
  });
});

// Keep one canvas visible: Flow for practice, the original Book renderer for study.
// The original ten-step clock is neither duplicated nor reset.

// One compact optional music disclosure, in logical reading order AFTER practice.
const soundtrack=document.getElementById("soundtrack");
let audioDetails;
if(soundtrack){
  audioDetails=document.createElement("details");
  audioDetails.className="p2-disclosure p2-audio";
  audioDetails.id="p2-audio";
  const summary=document.createElement("summary");
  summary.id="p2-audio-summary";
  audioDetails.append(summary,soundtrack);
  insertAfter(audioDetails,studio);
}

// Full evidence and experimental extras become optional, while the primary
// professional story remains readable in Portfolio and Trajectory.
const extraIds=["orientacion","atlas","ritual","campo","sobre","oferta","camino",
  "casos","trayectoria","demostracion","experiencia","formacion","filosofia","cv"];
const extras=document.createElement("details");
extras.className="p2-disclosure p2-extras";
extras.id="p2-extras";
const extrasSummary=document.createElement("summary");
extrasSummary.id="p2-extras-summary";
const extrasNote=document.createElement("p");
extrasNote.className="p2-extras-note";
extras.append(extrasSummary,extrasNote);
for(const id of extraIds){
 const element=document.getElementById(id);
 if(element)extras.append(element);
}
const faq=document.getElementById("preguntas");
const contact=document.getElementById("contacto");
insertAfter(extras,portfolio);
if(faq)insertAfter(faq,extras);
if(contact)insertAfter(contact,faq||extras);

// The lotus is a real focusable affordance, not a gigantic decorative layer.
// SVG is physically moved outside aria-hidden hero-atmosphere.
const lotus=hero.querySelector("svg.hero-mandala");
if(lotus){
 const focus=document.createElement("button");
 focus.type="button";
 focus.id="p2-lotus-focus";
 focus.className="p2-lotus-focus";
 lotus.setAttribute("aria-hidden","true");
 lotus.setAttribute("focusable","false");
 focus.append(lotus);
 hero.insertBefore(focus,hero.querySelector(".hero-stage"));
 focus.addEventListener("click",()=>{
  setBook(false);
  studio.querySelector('[data-studio-mode="breath"]')?.click();
  studio.scrollIntoView({block:"start",behavior:"instant"});
  if(window.history?.replaceState)window.history.replaceState(window.history.state,"","#instructor-flow");
 });
}

// Advanced case study and the 60-second illustrated demo are not separate
// landing pages. Anchor visits reopen their real parent disclosure.
const auxiliaryIds=new Set(extraIds);
function revealAnchor(hash){
 const id=decodeURIComponent((hash||"").replace(/^#/,""));
 if(!id)return;
 const target=document.getElementById(id);
 if(!target)return;
 if(id==="studio-asana-library" || book.contains(target))setBook(true);
 if(extras.contains(target) || auxiliaryIds.has(id))extras.open=true;
 if(audioDetails?.contains(target))audioDetails.open=true;
}
document.addEventListener("click",event=>{
 const anchor=event.target.closest("a[href^='#']");
 if(anchor)revealAnchor(anchor.getAttribute("href"));
});
window.addEventListener("hashchange",()=>revealAnchor(location.hash));
revealAnchor(location.hash);
const update=()=>{
 if(lotus)document.getElementById("p2-lotus-focus").setAttribute("aria-label",t("lotus"));
 if(advancedSummary)advancedSummary.textContent=t("advanced");
 extrasSummary.textContent=t("more");
 extrasNote.textContent=t("note");
 if(audioDetails)document.getElementById("p2-audio-summary").textContent=t("audio");
 setBook(book.dataset.p2BookOpen==="true");
};
new MutationObserver(changes=>{if(changes.some(x=>x.attributeName==="lang"))update()})
 .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
update();

// The global sanctuary controls remain accessible, but do not cover the
// page until requested. The breathing action itself remains directly usable.
const dock=document.querySelector(".sanctuary-dock");
if(dock){
 dock.dataset.p2Open="false";
 const expand=document.createElement("button");
 expand.type="button";
 expand.id="p2-dock-expand";
 expand.className="p2-dock-expand";
 expand.setAttribute("aria-controls","p2-dock-tools");
 expand.setAttribute("aria-expanded","false");
 dock.querySelector(".sanctuary-dock-tools")?.setAttribute("id","p2-dock-tools");
 dock.prepend(expand);
 const setDock=(open)=>{
  dock.dataset.p2Open=String(open);
  expand.setAttribute("aria-expanded",String(open));
  expand.textContent=open?"×":"+";
  expand.setAttribute("aria-label",open?
   (lang()==="en"?"Close quick controls":"Cerrar controles rápidos"):
   (lang()==="en"?"Open quick controls":"Abrir controles rápidos"));
 };
 expand.addEventListener("click",()=>setDock(dock.dataset.p2Open!=="true"));
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape" && dock.dataset.p2Open==="true"){
   setDock(false);expand.focus({preventScroll:true});
  }
 });
 document.addEventListener("pointerdown",event=>{
  if(dock.dataset.p2Open==="true" && !dock.contains(event.target))setDock(false);
 });
 const currentUpdate=update;
 new MutationObserver(changes=>{
  if(changes.some(x=>x.attributeName==="lang"))setDock(dock.dataset.p2Open==="true");
 }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 setDock(false);
}

})();
