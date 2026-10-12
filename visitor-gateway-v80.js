/* V80 visitor wayfinding. No personal profiling, persistence or navigation trap. */
(()=>{
"use strict";
const root=document.getElementById("orientacion");if(!root)return;
const buttons=[...root.querySelectorAll("[data-v80-route]")],steps=root.querySelector("#v80-route-steps"),
primary=root.querySelector("#v80-primary"),panel=root.querySelector("#v80-route-content"),
title=root.querySelector("#v80-route-title"),description=root.querySelector("#v80-route-description"),
status=root.querySelector("#v80-status");
const copy={
es:{
 eyebrow:"V80 / UN PORTFOLIO, TRES CAMINOS",editorial:"GUÍA INTERACTIVA · SIN CUENTAS",
 titleFirst:"Encuentra tu",titleSecond:"punto de partida.",
 lead:"No necesitas explorar toda la web para saber si esto es para ti. Elige qué te trae aquí y descubre una ruta breve por las piezas importantes.",
 practice:"Quiero practicar",practiceSub:"Conocer la experiencia guiada",
 studio:"Busco un instructor",studioSub:"Experiencia, metodología y CV",
 teams:"Organizo bienestar",teamsSub:"Propuestas para equipos",
 group:"Elegir recorrido",routeCaption:"TU RUTA",routeTime:"3 pasos claros",
 fineprint:"Navegación libre. Sin registro, sin pasos obligatorios y sin recogida de preferencias.",
 begin:"Comenzar el recorrido ↗",
 routes:{
 practice:{title:"Explora tu práctica.",description:"Empieza con una demostración breve, entra en la sala interactiva y aclara tus dudas.",
 links:[["#demostracion","Una demostración en un minuto"],["#instructor-flow","Prueba la sala interactiva"],["#preguntas","Resuelve tus preguntas"]]},
 studio:{title:"Conoce el trabajo detrás de la clase.",description:"Mira experiencia contextualizada, observa casos y consulta el CV antes de escribir.",
 links:[["#trayectoria","Trayectoria y enfoque"],["#casos","Tres contextos reales de enseñanza"],["#cv","CV y carta en tu idioma"]]},
 teams:{title:"Diseñemos una propuesta útil.",description:"Revisa experiencia corporativa, un ejemplo de programación y prepara una consulta adaptada a tu equipo.",
 links:[["#casos","Experiencia de bienestar en equipos"],["#programa","Ejemplo de sesión adaptable"],["#v76-enquiry","Preparar una consulta corporativa"]]}
 }
},
en:{
 eyebrow:"V80 / ONE PORTFOLIO, THREE PATHS",editorial:"INTERACTIVE GUIDE · NO ACCOUNT",
 titleFirst:"Find your",titleSecond:"starting point.",
 lead:"You don't have to explore the whole website to see whether it's for you. Choose why you're here and take a short journey through what matters.",
 practice:"I want to practise",practiceSub:"Discover the guided experience",
 studio:"I'm hiring an instructor",studioSub:"Experience, approach and CV",
 teams:"I organise wellbeing",teamsSub:"Proposals for teams",
 group:"Choose your journey",routeCaption:"YOUR ROUTE",routeTime:"3 clear steps",
 fineprint:"Free navigation. No registration, mandatory steps or stored preferences.",
 begin:"Start this journey ↗",
 routes:{
 practice:{title:"Discover your practice.",description:"Start with a short demonstration, enter the interactive studio and find answers.",
 links:[["#demostracion","One-minute demonstration"],["#instructor-flow","Try the interactive studio"],["#preguntas","Your questions answered"]]},
 studio:{title:"Meet the work behind the class.",description:"Read contextual experience, explore teaching cases and review the CV before contacting me.",
 links:[["#trayectoria","Professional experience and approach"],["#casos","Three real teaching contexts"],["#cv","CV and cover letter in your language"]]},
 teams:{title:"Let's design something useful.",description:"Explore workplace practice, a sample class plan and a message composer tailored to your team.",
 links:[["#casos","Experience with workplace wellbeing"],["#programa","Adaptable sample session"],["#v76-enquiry","Prepare a workplace enquiry"]]}
 }
}
};
const language=()=>document.documentElement.lang==="en"?"en":"es";
let current="practice";
function prepareCorporateContext(){
 const input=document.querySelector('#v76-enquiry input[name="v76-service"][value="equipos"]');
 if(input&&!input.checked)input.click();
}
function render(){
 const w=copy[language()],data=w.routes[current];
 root.querySelectorAll("[data-v80-text]").forEach(el=>{const v=w[el.dataset.v80Text];if(typeof v==="string")el.textContent=v});
 root.querySelector("[data-v80-label]").setAttribute("aria-label",w.group);
 buttons.forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.v80Route===current)));
 panel.dataset.v80Active=current;
 title.textContent=data.title;description.textContent=data.description;
 steps.replaceChildren(...data.links.map(([href,text],index)=>{
  const li=document.createElement("li"),a=document.createElement("a");
  a.href=href;
  const number=document.createElement("span");number.textContent=String(index+1).padStart(2,"0");
  const label=document.createElement("strong");label.textContent=text;
  const arrow=document.createElement("span");arrow.setAttribute("aria-hidden","true");arrow.textContent="↗";
  a.append(number,label,arrow);
  a.addEventListener("click",()=>{
   if(current==="teams"&&href==="#v76-enquiry")prepareCorporateContext();
   if(current==="studio"&&href==="#trayectoria"){
    document.querySelector('#trayectoria [data-v77-filter="all"]')?.click();
   }
  });
  li.append(a);return li;
 }));
 primary.href=data.links[0][0];primary.textContent=w.begin;
 // For workplace enquiries choose the real contact workspace, rather than
 // diverting the visitor through the earlier casebook.
 if(current==="teams")primary.href="#v76-enquiry";
 status.textContent="";
}
buttons.forEach(btn=>btn.addEventListener("click",()=>{current=btn.dataset.v80Route;render()}));
primary.addEventListener("click",()=>{if(current==="teams")prepareCorporateContext()});
new MutationObserver(records=>{if(records.some(r=>r.attributeName==="lang"))render()})
.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
render();
})();
