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
    es:{heading:"EXPLORA A TU RITMO",title:"Otras formas de habitar el cuerpo",
      lead:"Tres posturas adicionales de Nila, el personaje de Movimiento. Explóralas sin empezar una sesión.",
      contact:"APOYO",choose:"Elige una postura",foot:"Son propuestas suaves de exploración, no una exigencia de flexibilidad."},
    en:{heading:"EXPLORE AT YOUR PACE",title:"More ways to inhabit your body",
      lead:"Three extra poses for Nila, your Movement guardian. Explore without starting a session.",
      contact:"GROUNDING",choose:"Choose a posture",foot:"Gentle options for exploration, not a flexibility test."}
  };
  const language=()=>document.documentElement.lang==="en"?"en":"es";
  const section=document.createElement("section");
  section.id="studio-asana-library";
  section.className="studio-asana-library";
  section.setAttribute("aria-labelledby","studio-library-title");
  section.innerHTML=
    '<div class="studio-library-heading"><span class="studio-library-eyebrow"></span>'+
    '<h3 id="studio-library-title"></h3><p class="studio-library-lead"></p></div>'+
    '<div class="studio-library-body"><div class="studio-library-choices" role="group"></div>'+
    '<div class="studio-library-display"><div class="studio-library-stage yy-guide" data-asana-state="idle" aria-hidden="true"></div>'+
    '<h4 class="studio-library-name" aria-live="polite"></h4><p class="studio-library-cue"></p>'+
    '<p class="studio-library-ground"></p></div></div>'+
    '<p class="studio-library-foot"></p>';
  intro.insertAdjacentElement("afterend",section);
  const choices=section.querySelector(".studio-library-choices");
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
    section.querySelector(".studio-library-eyebrow").textContent=w.heading;
    section.querySelector("#studio-library-title").textContent=w.title;
    section.querySelector(".studio-library-lead").textContent=w.lead;
    section.querySelector(".studio-library-foot").textContent=w.foot;
    choices.setAttribute("aria-label",w.choose);
    const active=library.byId(current);
    if(!active)return;
    for(const button of choices.querySelectorAll("button")){
      const pose=library.byId(button.dataset.libraryPose);
      button.textContent=pose.name[index];
      button.setAttribute("aria-pressed",String(current===pose.id));
    }
    for(const g of container.querySelectorAll(".yy-pose")){
      g.classList.toggle("is-current",g.dataset.pose===current);
    }
    section.querySelector(".studio-library-name").textContent=active.name[index];
    section.querySelector(".studio-library-cue").textContent=active.cue[index];
    section.querySelector(".studio-library-ground").textContent=w.contact+" · "+active.support[index];
    display.dataset.libraryCurrent=current;
    stage.dataset.spirit=guide.dataset.spirit==="yin"?"yin":"yang";
  };
  choices.addEventListener("click",event=>{
    const button=event.target.closest("button[data-library-pose]");
    if(!button)return;
    if(library.byId(button.dataset.libraryPose)){
      current=button.dataset.libraryPose;
      render();
    }
  });
  choices.addEventListener("keydown",event=>{
    if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
    event.preventDefault();
    const buttons=[...choices.querySelectorAll("button")];
    const active=buttons.indexOf(document.activeElement);
    const offset=event.key==="ArrowRight"?1:-1;
    const next=buttons[(active+offset+buttons.length)%buttons.length];
    next?.focus();
    next?.click();
  });
  const visible=()=>{section.hidden=busy || (root.dataset.studioMode||"asanas")!=="asanas";};
  window.addEventListener("yoga:flow",({detail})=>{
    busy=["running","paused"].includes(detail?.status);
    visible();
  });
  new MutationObserver(visible).observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
  new MutationObserver(()=>{stage.dataset.spirit=guide.dataset.spirit==="yin"?"yin":"yang";})
    .observe(guide,{attributes:true,attributeFilter:["data-spirit"]});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  render();
  visible();
})();
