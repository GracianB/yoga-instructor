/* V79 · Shared truth between visible FAQ, page metadata and FAQPage JSON-LD.
 * No external API, fabricated pricing, tracking or hidden SEO-only content. */
(()=>{
"use strict";
const root=document.getElementById("preguntas");if(!root)return;
const entries={
es:{
 kicker:"05 / ANTES DE EMPEZAR",titleA:"Buenas preguntas.",titleB:"Respuestas claras.",
 lead:"Una práctica consciente también empieza por saber qué esperar. Sin promesas infladas, tarifas inventadas ni reservas ficticias.",
 contact:"Plantear otra pregunta ↗",catPractice:"La práctica",catPracticeNote:"Modalidades, niveles y el punto de partida.",
 catProfessional:"Colaborar",catProfessionalNote:"Contexto profesional y límites importantes.",
 experienceLink:"Ver trayectoria ↗",demoLink:"Probar la demostración ↗",studioLink:"Entrar en la sala ↗",
 title:"Gracián Baena | Instructor de yoga en Murcia | Clases y bienestar",
 description:"Gracián Baena, instructor de yoga en Murcia. Portfolio profesional, clases adaptables, experiencias individuales y bienestar para equipos. Explora una demostración guiada.",
 locale:"es_ES",
 faq:{
  services:["¿Qué modalidades de yoga puedo consultar?","Clases de grupo, sesiones individuales y propuestas de bienestar para equipos. La disponibilidad y el formato se acuerdan de forma individual."],
  levels:["¿Necesito experiencia previa?","No es imprescindible. La propuesta utiliza opciones y progresiones para diferentes puntos de partida; siempre puedes parar o elegir una alternativa cómoda."],
  locations:["¿Trabajas en Murcia o también en línea?","Mi base es Murcia. Puedo valorar propuestas presenciales, online o en una organización; cada colaboración depende de disponibilidad y condiciones concretas."],
  teams:["¿Qué es una propuesta de yoga para equipos?","Una práctica adaptable al contexto laboral, con atención a movilidad, pausas y concentración. No es terapia ni sustituye atención de salud profesional."],
  documents:["¿Dónde puedo consultar tu experiencia y formación?","En la trayectoria, los casos de enseñanza, el CV y la carta. Son documentos propios; las credenciales originales se deben contrastar por separado cuando sea necesario."],
  privacy:["¿Qué ocurre si preparo una consulta?","La web prepara un mensaje editable. No guarda el texto ni lo envía automáticamente. El mensaje se abre en tu programa de correo solo cuando tú lo decides."]
 }
},
en:{
 kicker:"05 / BEFORE WE BEGIN",titleA:"Good questions.",titleB:"Clear answers.",
 lead:"Mindful practice starts with knowing what to expect. No inflated promises, invented prices or imaginary bookings.",
 contact:"Ask something else ↗",catPractice:"The practice",catPracticeNote:"Formats, experience levels and where to start.",
 catProfessional:"Working together",catProfessionalNote:"Professional setting and important boundaries.",
 experienceLink:"View experience ↗",demoLink:"Explore the demonstration ↗",studioLink:"Enter the studio ↗",
 title:"Gracián Baena | Yoga instructor in Murcia | Classes and wellbeing",
 description:"Gracián Baena, yoga instructor based in Murcia, Spain. Professional portfolio, adaptable classes, one-to-one practice and workplace wellbeing. Try a guided demonstration.",
 locale:"en_GB",
 faq:{
  services:["What kinds of yoga sessions can I enquire about?","Group classes, one-to-one sessions and workplace wellbeing proposals. Availability and format are discussed individually."],
  levels:["Do I need previous yoga experience?","Not necessarily. Sessions allow options and gradual progress from different starting points. You can always pause or choose a comfortable alternative."],
  locations:["Do you teach in Murcia or online?","I'm based in Murcia, Spain. I'm open to considering in-person, online or workplace proposals depending on availability and agreed arrangements."],
  teams:["What does workplace yoga involve?","A practice adapted to a working environment, supporting movement, breaks and attention. It is not therapy or a substitute for professional healthcare."],
  documents:["Where can I read about your experience and training?","See the career record, teaching case studies, CV and cover letter. These are self-authored materials; original credentials should be checked independently when needed."],
  privacy:["What happens when I prepare an enquiry?","The website drafts an editable message. It does not store or send that message automatically. It opens in your email application only when you choose."]
 }
}
};
const lang=()=>document.documentElement.lang==="en"?"en":"es";
function setMeta(selector,content){const tag=document.querySelector(selector);if(tag)tag.setAttribute("content",content)}
function update(){
const content=entries[lang()];
root.querySelectorAll("[data-v79-copy]").forEach(el=>{const text=content[el.dataset.v79Copy];if(typeof text==="string")el.textContent=text});
root.querySelectorAll("[data-v79-faq]").forEach(details=>{
 const pair=content.faq[details.dataset.v79Faq];if(!pair)return;
 details.querySelector("[data-v79-q]").textContent=pair[0];
 details.querySelector("[data-v79-a]").textContent=pair[1];
});
document.title=content.title;
setMeta('meta[name="description"]',content.description);
setMeta('meta[property="og:title"]',content.title);
setMeta('meta[property="og:description"]',content.description);
setMeta('meta[property="og:locale"]',content.locale);
setMeta('meta[name="twitter:title"]',content.title);
setMeta('meta[name="twitter:description"]',content.description);
const faq=document.getElementById("v79-faq-schema");
if(faq){faq.textContent=JSON.stringify({
 "@context":"https://schema.org","@type":"FAQPage",
 "inLanguage":lang()==="en"?"en":"es",
 "mainEntity":Object.values(content.faq).map(([name,text])=>({
 "@type":"Question",name,"acceptedAnswer":{"@type":"Answer",text}
 }))
})}
}
new MutationObserver(records=>{if(records.some(r=>r.attributeName==="lang"))update()})
 .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
update();
})();
