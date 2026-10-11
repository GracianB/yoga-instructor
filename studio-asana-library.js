/* D24 · An opt-in asana library, reusing the canonical D17 vector renderer.
   No new animation engine, no changes to the ten-phase guided journey. */
(() => {
  "use strict";
  const root=document.getElementById("instructor-flow");
  const guide=root?.querySelector("#flow-guide");
  const art=window.YIN_YANG_ART,library=window.YOGA_ASANA_LIBRARY;
  const guardian=window.YOGA_MOVEMENT_GUARDIAN;
  const source=guide?.querySelector("svg.yy-svg");
  const intro=root?.querySelector(".studio-entrance");
  if(!root||!guide||!source||!intro||!art?.drawPose||!guardian?.drawPose||!library?.poses?.length)return;
  const copy={
    es:{heading:"LIBRO DE ASANAS · 12 POSTURAS",title:"El libro de asanas",
      lead:"Explora cada postura, cómo prepararte, respirar y salir de ella. Un libro independiente, antes de empezar tu práctica.",
      contact:"APOYO",choose:"Elige una postura",foot:"Son propuestas suaves de exploración, no una exigencia de flexibilidad.",
      dockShow:"Mostrar música y respiración",dockHide:"Ocultar música y respiración",practice:"Ir a las sesiones guiadas ↗"},
    en:{heading:"ASANA BOOK · 12 POSTURES",title:"The asana book",
      lead:"Explore each posture, its setup, breathing and release. A separate guide before you begin your practice.",
      contact:"GROUNDING",choose:"Choose a posture",foot:"Gentle options for exploration, not a flexibility test.",
      dockShow:"Show music and breathing",dockHide:"Hide music and breathing",practice:"Explore guided sessions ↗"}
  };
  const language=()=>document.documentElement.lang==="en"?"en":"es";
  const section=document.createElement("section");
  section.id="studio-asana-library";
  section.className="section studio-asana-library studio-asana-book";
  section.dataset.bookStandalone="true";
  section.setAttribute("aria-labelledby","studio-library-title");
  section.innerHTML=
    '<div class="studio-library-heading"><span class="studio-library-eyebrow"></span>'+
    '<h3 id="studio-library-title"></h3><p class="studio-library-lead"></p>'+
    '<a class="studio-book-practice-link" href="#instructor-flow"></a>'+
    '<button type="button" class="studio-library-dock-toggle" aria-pressed="false"></button></div>'+
    '<div class="studio-library-body"><div class="studio-library-choices" role="group"></div>'+
    '<div class="studio-library-display"><div class="studio-library-stage yy-guide" data-asana-state="idle" aria-hidden="true"></div>'+
    '<h4 class="studio-library-name" aria-live="polite"></h4><p class="studio-library-cue"></p>'+
    '<p class="studio-library-ground"></p>'+
    '<section class="studio-library-coaching" aria-labelledby="studio-library-how-title">'+
      '<h5 id="studio-library-how-title"></h5>'+
      '<ol class="studio-library-steps">'+
        '<li><span class="studio-library-step-label"></span><p class="studio-library-step-text"></p></li>'+
        '<li><span class="studio-library-step-label"></span><p class="studio-library-step-text"></p></li>'+
        '<li><span class="studio-library-step-label"></span><p class="studio-library-step-text"></p></li>'+
      '</ol></section></div></div>'+
    '<p class="studio-library-foot"></p>';
  // A separate editorial chapter BEFORE the three-mode practice studio.
  // The book is not a Movement sub-tab and never starts the guided clock.
  root.before(section);
  const dockToggle=section.querySelector(".studio-library-dock-toggle");
  // The global floating dock obscured long asana coaching text. Keep its
  // controls available on demand, never permanently discard them.
  let dockOpen=false;
  section.dataset.dockOpen="false";
  dockToggle.addEventListener("click",()=>{
    dockOpen=!dockOpen;
    section.dataset.dockOpen=String(dockOpen);
    render();
  });
  const choices=section.querySelector(".studio-library-choices");
  // Filters only affect opt-in library, not the ten canonical Flow phases.
  const filters=document.createElement("div");
  filters.className="studio-library-filters";
  filters.setAttribute("role","group");
  for(const key of ["all","standing","seated","restorative"]){
    const chip=document.createElement("button");
    chip.type="button";chip.dataset.asanaFilter=key;
    chip.setAttribute("aria-pressed",String(key==="all"));
    filters.appendChild(chip);
  }
  choices.prepend(filters);
  let filter="all";
  const category=p=>p.category||
    (["mountain","warrior","tree","triangle","downward"].includes(p.kind)?"standing":
    (["rest","child"].includes(p.kind)?"restorative":"seated"));
  const stage=section.querySelector(".studio-library-stage");
  const display=section.querySelector(".studio-library-display");
  const svg=source.cloneNode(true);
  svg.querySelectorAll(".yy-pose").forEach(node=>node.remove());
  const container=svg.querySelector(".yy-pose-container");
  if(!container){section.remove();return;}
  // A cloned SVG has its own defs. ID rebasing prevents cross-document gradient
  // collisions with the original guide and with the D19 meditation companion.
  const ids=new Map();
  for(const node of svg.querySelectorAll("[id]")){
    const renamed="d24-"+node.id;
    ids.set(node.id,renamed);
    node.id=renamed;
  }
  for(const node of svg.querySelectorAll("*")){
    for(const attr of [...node.attributes]){
      if(attr.name==="id")continue;
      const value=attr.value.replace(/url\(#([^)]+)\)/g,(whole,id)=>
        ids.has(id)?"url(#"+ids.get(id)+")":whole);
      if(value!==attr.value)node.setAttribute(attr.name,value);
    }
  }
  // Parsing is confined to static, authored SVG from the application itself.
  for(const pose of library.poses){
    const xml=new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg">'+art.drawPose(pose)+'</svg>',
      "image/svg+xml");
    const group=xml.documentElement.firstElementChild;
    if(!group||group.tagName.toLowerCase()==="parsererror"){section.remove();return;}
    const imported=document.importNode(group,true);
    // V53: retain the D24 anatomy in DOM for existing regression contracts,
    // but show the same Nila drawing used in all ten guided Movement poses.
    const originalBody=imported.querySelector(".yy-character");
    const extra=new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg">'+guardian.drawPose(pose)+'</svg>',
      "image/svg+xml");
    const nila=extra.documentElement.firstElementChild;
    if(!originalBody||!nila||nila.tagName.toLowerCase()==="parsererror"){
      section.remove();return;
    }
    originalBody.appendChild(document.importNode(nila,true));
    // Newly authored poses also reference the cloned gradients. Rewrite
    // their links before insertion so they cannot borrow the main SVG defs.
    for(const node of [imported,...imported.querySelectorAll("*")]){
      for(const attr of [...node.attributes]){
        if(attr.name==="id")continue;
        const value=attr.value.replace(/url\(#([^)]+)\)/g,(whole,id)=>
          ids.has(id)?"url(#"+ids.get(id)+")":whole);
        if(value!==attr.value)node.setAttribute(attr.name,value);
      }
    }
    container.appendChild(imported);
    const button=document.createElement("button");
    button.type="button";
    button.dataset.libraryPose=pose.id;
    button.dataset.category=category(pose);
    button.setAttribute("aria-pressed","false");
    choices.appendChild(button);
  }
  svg.setAttribute("viewBox","100 -3 520 420");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("focusable","false");
  svg.setAttribute("role","presentation");
  stage.appendChild(svg);
  stage.dataset.libraryGuardian="nila";
  let current=library.poses[0].id;
  let busy=false;
  const render=()=>{
    const index=language()==="en"?1:0,w=copy[language()];
    const labels=index?{all:"All 12",standing:"Standing",seated:"Seated",restorative:"Rest"}:
      {all:"Las 12",standing:"De pie",seated:"Sentadas",restorative:"Descanso"};
    filters.setAttribute("aria-label",index?"Filter by posture family":"Filtrar por familia de posturas");
    for(const chip of filters.querySelectorAll("button[data-asana-filter]")){
      chip.textContent=labels[chip.dataset.asanaFilter];
      chip.setAttribute("aria-pressed",String(chip.dataset.asanaFilter===filter));
    }
    section.querySelector(".studio-library-eyebrow").textContent=w.heading;
    section.querySelector("#studio-library-title").textContent=w.title;
    section.querySelector(".studio-library-lead").textContent=w.lead;
    section.querySelector(".studio-book-practice-link").textContent=w.practice;
    dockToggle.textContent=dockOpen?w.dockHide:w.dockShow;
    dockToggle.setAttribute("aria-pressed",String(dockOpen));
    section.querySelector(".studio-library-foot").textContent=w.foot;
    choices.setAttribute("aria-label",w.choose);
    const active=library.byId(current);
    if(!active)return;
    for(const button of choices.querySelectorAll("button[data-library-pose]")){
      const pose=library.byId(button.dataset.libraryPose);
      button.hidden=filter!=="all" && category(pose)!==filter;
      button.textContent=pose.name[index];
      button.setAttribute("aria-pressed",String(current===pose.id));
    }
    for(const g of container.querySelectorAll(".yy-pose")){
      g.classList.toggle("is-current",g.dataset.pose===current);
    }
    section.querySelector(".studio-library-name").textContent=active.name[index];
    section.querySelector(".studio-library-cue").textContent=active.cue[index];
    section.querySelector(".studio-library-ground").textContent=w.contact+" · "+active.support[index];
    // V71: three short, practical steps give the selected posture a
    // meaningful start, calm breathing cue and deliberate finish.
    const coaching=active.coaching;
    const guideTitle=section.querySelector("#studio-library-how-title");
    guideTitle.textContent=index?"Explore the posture":"Explora la postura";
    const stepNames=index?["1 · Set up","2 · Breathe","3 · Release"]:
      ["1 · Prepárate","2 · Respira","3 · Sal"];
    for(const [i,key] of ["setup","breath","exit"].entries()){
      const item=section.querySelectorAll(".studio-library-steps li")[i];
      item.querySelector(".studio-library-step-label").textContent=stepNames[i];
      item.querySelector(".studio-library-step-text").textContent=coaching[key][index];
    }
    display.dataset.libraryCurrent=current;
    stage.dataset.spirit=guide.dataset.spirit==="yin"?"yin":"yang";
  };
  choices.addEventListener("click",event=>{
    const chip=event.target.closest("button[data-asana-filter]");
    if(chip){
      filter=chip.dataset.asanaFilter;
      const active=library.byId(current);
      if(filter!=="all" && category(active)!==filter)
        current=library.poses.find(p=>category(p)===filter)?.id||current;
      render();return;
    }
    const button=event.target.closest("button[data-library-pose]");
    if(!button||button.hidden)return;
    if(library.byId(button.dataset.libraryPose)){
      current=button.dataset.libraryPose;
      render();
    }
  });
  choices.addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key))return;
    if(!event.target.matches("button[data-library-pose]"))return;
    event.preventDefault();
    const buttons=[...choices.querySelectorAll("button[data-library-pose]:not([hidden])")];
    if(!buttons.length)return;
    const active=buttons.indexOf(document.activeElement);
    const offset=["ArrowRight","ArrowDown"].includes(event.key)?1:-1;
    const nextIndex=event.key==="Home"?0:event.key==="End"?buttons.length-1:
      (active+offset+buttons.length)%buttons.length;
    const next=buttons[nextIndex];
    next?.focus();
    next?.click();
  });
  const visible=()=>{section.hidden=false;};
  window.addEventListener("yoga:flow",({detail})=>{
    busy=["running","paused"].includes(detail?.status);
    visible();
  });
  // V72: the book is a standalone chapter. Do not depend on optional
  // IntersectionObserver (it can be undefined in privacy-restricted browsers).
  // A viewport check also avoids dock state lingering during anchor jumps.
  const syncBookVisibility=()=>{
    const bounds=section.getBoundingClientRect();
    const amount=Math.max(0,Math.min(bounds.bottom,window.innerHeight)-
      Math.max(bounds.top,0));
    const minimum=Math.min(48,window.innerHeight*.04);
    document.body.dataset.asanaBookVisible=String(amount>minimum);
  };
  const bookLink=section.querySelector(".studio-book-practice-link");
  bookLink?.addEventListener("click",event=>{
    // The page uses a cinematic anchor handler. Take responsibility for
    // this internal transition so the library doesn't overlap the console.
    event.preventDefault();
    event.stopPropagation();
    root.scrollIntoView({block:"start",behavior:"instant"});
    if(window.history?.replaceState)
      window.history.replaceState(window.history.state,"","#instructor-flow");
    syncBookVisibility();
  });
  window.addEventListener("scroll",syncBookVisibility,{passive:true});
  window.addEventListener("resize",syncBookVisibility,{passive:true});
  window.addEventListener("pagehide",()=>{
    window.removeEventListener("scroll",syncBookVisibility);
    window.removeEventListener("resize",syncBookVisibility);
    delete document.body.dataset.asanaBookVisible;
  },{once:true});
  new MutationObserver(()=>{stage.dataset.spirit=guide.dataset.spirit==="yin"?"yin":"yang";})
    .observe(guide,{attributes:true,attributeFilter:["data-spirit"]});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  render();
  visible();
  syncBookVisibility();
})();
