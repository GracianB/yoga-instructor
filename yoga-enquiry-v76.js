/* V76 · Professional yoga enquiry composer.
 * All fields stay in memory on this page. Nothing is transmitted by this site.
 * The only outbound action is the user's deliberate mailto activation. */
(() => {
  "use strict";
  const root=document.getElementById("v76-enquiry");
  if(!root)return;
  const form=root.querySelector("#v76-form");
  const preview=root.querySelector("#v76-preview");
  const email=root.querySelector("#v76-mail");
  const reset=root.querySelector("#v76-reset");
  const details=root.querySelector("#v76-details");
  const counter=root.querySelector("#v76-counter");
  const results=root.querySelector("#v76-results");
  const service=()=>form.querySelector('input[name="v76-service"]:checked')?.value||"sala";
  const targetEmail="gracianbaenagonzalez@gmail.com";
  const i18n={
    es:{
      kicker:"VAMOS A TRABAJAR JUNTOS",title:"Cuéntame qué necesitas.",
      lead:"Una conversación empieza mejor con un poco de contexto. Diseña tu consulta en tres pasos y abre tu correo cuando el mensaje te represente.",
      intro:"TU CONSULTA, SIN FORMULARIOS QUE ENVÍAN DATOS",
      step1:"01 / TIPO DE PRÁCTICA",step2:"02 / FORMATO Y OBJETIVO",step3:"03 / TU CONTEXTO",
      sala:"Clases en sala",salaSub:"Grupo y progresiones",
      individual:"Sesión individual",individualSub:"Atención personal",
      equipos:"Bienestar para equipos",equiposSub:"Pausas adaptables",
      formatLabel:"Modalidad preferida",formatDefault:"Sin preferencia",
      formatPresencial:"Presencial · Murcia",formatOnline:"En línea",formatEmpresa:"En la organización",
      focusLabel:"Objetivo principal",focusGeneral:"Conocer las posibilidades",
      focusMovilidad:"Movimiento y movilidad",focusRespiracion:"Respiración y pausa",
      focusAtencion:"Concentración y atención",focusEquipo:"Bienestar del equipo",
      sizeLabel:"Participantes orientativos",sizeUnsure:"Por concretar",
      sizeSolo:"Una persona",sizeSmall:"2–8 personas",sizeMedium:"9–20 personas",sizeLarge:"Más de 20",
      detailsLabel:"Qué te gustaría contarme",detailsPlaceholder:"Disponibilidad, experiencia previa, espacio, necesidades o dudas. No incluyas datos médicos sensibles.",
      privacy:"Tus respuestas no se guardan ni se envían desde esta página. Se incorporan solamente al mensaje que decides abrir en tu aplicación de correo.",
      compose:"Preparar mi mensaje",update:"Actualizar mensaje",
      previewTitle:"TU MENSAJE, A TU MANERA",previewLead:"Puedes revisar y editar este texto antes de enviar el correo.",
      mail:"Abrir mi correo ↗",copyTip:"El correo se abre en tu aplicación habitual; aquí no se envía automáticamente.",
      reset:"Limpiar selección",status:"Mensaje preparado. Revísalo antes de abrir tu correo.",
      empty:"Completa tus opciones para preparar un mensaje.",
      subjectSala:"Consulta sobre clases de yoga en sala",
      subjectIndividual:"Consulta sobre sesiones individuales de yoga",
      subjectEquipos:"Consulta sobre yoga para equipos",
      greeting:"Hola Gracián:",
      bodyIntro:"Me gustaría consultar una posible colaboración o clase de yoga.",
      bodyService:"Tipo de práctica",bodyFormat:"Modalidad",bodyFocus:"Objetivo",bodySize:"Participantes",
      bodyNotes:"Más información",bodyNoNotes:"Me gustaría conocer opciones y disponibilidad.",
      bodyClosing:"Gracias. Quedo pendiente de tu respuesta.",
      length:n=>n+" / 500 caracteres"
    },
    en:{
      kicker:"LET'S WORK TOGETHER",title:"Tell me what you need.",
      lead:"A conversation starts with a little context. Build your enquiry in three steps and open your email when the message feels right.",
      intro:"YOUR ENQUIRY, WITHOUT DATA-COLLECTING FORMS",
      step1:"01 / PRACTICE TYPE",step2:"02 / SETTING AND GOAL",step3:"03 / YOUR CONTEXT",
      sala:"Group yoga",salaSub:"Shared class and progressions",
      individual:"One-to-one",individualSub:"Personal attention",
      equipos:"Workplace wellbeing",equiposSub:"Adaptable breaks",
      formatLabel:"Preferred setting",formatDefault:"No preference",
      formatPresencial:"In person · Murcia",formatOnline:"Online",formatEmpresa:"At your workplace",
      focusLabel:"Main goal",focusGeneral:"Discuss the possibilities",
      focusMovilidad:"Movement and mobility",focusRespiracion:"Breath and rest",
      focusAtencion:"Focus and attention",focusEquipo:"Team wellbeing",
      sizeLabel:"Approximate participants",sizeUnsure:"To be agreed",
      sizeSolo:"One person",sizeSmall:"2–8 people",sizeMedium:"9–20 people",sizeLarge:"Over 20",
      detailsLabel:"What would you like to share?",detailsPlaceholder:"Availability, previous experience, space, needs or questions. Please do not include sensitive medical details.",
      privacy:"Your answers are not stored or transmitted by this website. They are only included in the email you deliberately choose to open.",
      compose:"Prepare my message",update:"Update message",
      previewTitle:"YOUR MESSAGE, YOUR WAY",previewLead:"You can review and edit this text before sending your email.",
      mail:"Open my email ↗",copyTip:"This opens your usual email app. Nothing is sent automatically from this website.",
      reset:"Clear choices",status:"Message ready. Review it before opening your email.",
      empty:"Choose your options to prepare a message.",
      subjectSala:"Enquiry about group yoga classes",subjectIndividual:"Enquiry about private yoga sessions",
      subjectEquipos:"Enquiry about workplace yoga",
      greeting:"Hello Gracián,",
      bodyIntro:"I'd like to enquire about a possible yoga class or collaboration.",
      bodyService:"Practice type",bodyFormat:"Setting",bodyFocus:"Goal",bodySize:"Participants",
      bodyNotes:"More information",bodyNoNotes:"I'd like to learn about options and availability.",
      bodyClosing:"Thank you. I look forward to hearing from you.",
      length:n=>n+" / 500 characters"
    }
  };
  const lang=()=>document.documentElement.lang==="en"?"en":"es";
  const t=()=>i18n[lang()];
  const valueOr=(selector,fallback)=>{
    const element=form.querySelector(selector);
    const key=element?.selectedOptions?.[0]?.dataset.v76Text;
    return key&&typeof t()[key]==="string"?t()[key]:fallback;
  };
  function paint(){
    const copy=t();
    root.querySelectorAll("[data-v76-text]").forEach(el=>{
      const key=el.dataset.v76Text;
      if(typeof copy[key]==="string")el.textContent=copy[key];
    });
    details.placeholder=copy.detailsPlaceholder;
    root.querySelectorAll("label.v76-service").forEach(label=>{
      const input=label.querySelector("input");
      label.classList.toggle("is-selected",Boolean(input.checked));
    });
    root.querySelectorAll("select").forEach(select=>{
      const selected=select.value;
      select.querySelectorAll("option").forEach(option=>{
        const key=option.dataset.v76Text;
        if(typeof copy[key]==="string")option.textContent=copy[key];
      });
      select.value=selected;
    });
    counter.textContent=copy.length(details.value.length);
    if(!results.hidden)compose(false);
  }
  function compose(announce=true){
    const copy=t();
    const subject={sala:copy.subjectSala,individual:copy.subjectIndividual,equipos:copy.subjectEquipos}[service()];
    const serviceLabel=copy[service()];
    const formatLabel=valueOr("#v76-format",copy.formatDefault);
    const focusLabel=valueOr("#v76-focus",copy.focusGeneral);
    const sizeLabel=valueOr("#v76-size",copy.sizeUnsure);
    const message=[
      copy.greeting,"",copy.bodyIntro,"",
      copy.bodyService+": "+serviceLabel,
      copy.bodyFormat+": "+formatLabel,
      copy.bodyFocus+": "+focusLabel,
      copy.bodySize+": "+sizeLabel,"",
      copy.bodyNotes+":",
      details.value.trim()||copy.bodyNoNotes,"",
      copy.bodyClosing
    ].join("\n");
    preview.value=message;
    email.href="mailto:"+targetEmail+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(message);
    results.hidden=false;
    root.querySelector("#v76-compose").textContent=copy.update;
    if(announce)root.querySelector("#v76-live").textContent=copy.status;
    return message;
  }
  form.addEventListener("submit",event=>{
    event.preventDefault();
    compose(true);
    results.scrollIntoView({behavior:"auto",block:"nearest"});
    preview.focus();
  });
  form.addEventListener("change",event=>{
    if(event.target.matches('input[name="v76-service"]'))paint();
    if(!results.hidden)compose(false);
  });
  details.addEventListener("input",()=>{
    counter.textContent=t().length(details.value.length);
    if(!results.hidden)compose(false);
  });
  // Editing the preview intentionally changes the outbound email body.
  preview.addEventListener("input",()=>{
    const subject={sala:t().subjectSala,individual:t().subjectIndividual,equipos:t().subjectEquipos}[service()];
    email.href="mailto:"+targetEmail+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(preview.value);
  });
  reset.addEventListener("click",()=>{
    form.reset();
    details.value="";
    preview.value="";
    email.href="mailto:"+targetEmail;
    results.hidden=true;
    root.querySelector("#v76-live").textContent=t().empty;
    root.querySelector("#v76-compose").textContent=t().compose;
    paint();
    form.querySelector('input[name="v76-service"]:checked')?.focus();
  });
  new MutationObserver(records=>{
    if(records.some(record=>record.attributeName==="lang"))paint();
  }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  paint();
})();
