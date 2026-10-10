/* V66 · Three modes, one studio. This layer only coordinates views.
 * Practice, breath timing, meditation and SVG rigs stay with their
 * existing controllers. No second clocks, duplicate guardians or polling. */
(() => {
  "use strict";
  const root=document.getElementById("instructor-flow");
  const entrance=root?.querySelector(".studio-entrance");
  const modes=entrance?.querySelector(".studio-modes");
  const tabs=entrance?.querySelector(".studio-v66-submodes");
  const sequence=root?.querySelector("#movement-stage");
  const gallery=root?.querySelector("#studio-asana-library");
  const guided=root?.querySelector("#studio-guided");
  if(!root||!entrance||!modes||!tabs||!sequence||!gallery||!guided)return;

  // All three activities now occupy the same DOM slot and share its
  // dimensions. Moving nodes preserves their registered event handlers.
  const workspace=document.createElement("div");
  workspace.className="studio-v66-workspace";
  workspace.id="studio-v66-workspace";
  workspace.setAttribute("aria-label","Sala de práctica");
  sequence.before(workspace);
  workspace.append(sequence,guided,gallery);
  const context=entrance.querySelector(".studio-path-context");
  const plan=entrance.querySelector(".studio-plan");
  const adaptation=entrance.querySelector(".studio-adaptation");
  modes.after(...[tabs,context].filter(Boolean));

  // The same two-column editorial skeleton for all modes. Group the
  // Movement controls, rather than leaving five autonomous grid tracks
  // stretching them apart across the character's tall canvas.
  const controls=document.createElement("div");
  controls.className="studio-v66-control-pane";
  controls.setAttribute("aria-label","Controles de secuencia");
  controls.append(...[plan,adaptation,...[...sequence.children].filter(el=>!el.classList.contains("flow-theater"))].filter(Boolean));
  sequence.appendChild(controls);

  // The old guided stage placed title and countdown below the portrait,
  // where a tall guardian pushed them out of view. Put instructions first
  // and keep the single SVG portrait underneath in both seated modes.
  const guidedStage=guided.querySelector(".studio-guided-stage");
  const guidedTop=guidedStage?.querySelector(".studio-guided-top");
  if(guidedTop){
    const ordered=[".studio-guided-title",".studio-guided-cue",
      ".studio-breath-phase-detail",".studio-guided-countdown",
      ".studio-guided-progress",".studio-companion"].map(sel=>guidedStage.querySelector(sel)).filter(Boolean);
    guidedTop.after(...ordered);
  }

  const copy={
    es:{
      label:"Opciones de movimiento",sequence:"Secuencia guiada",
      library:"Explorar asanas",room:"Sala de práctica",
      busy:"Finaliza o reinicia la sesión para explorar asanas."
    },
    en:{
      label:"Movement options",sequence:"Guided sequence",
      library:"Explore asanas",room:"Practice studio",
      busy:"Finish or reset the session before exploring asanas."
    }
  };
  const lang=()=>document.documentElement.lang==="en"?"en":"es";
  let busy=false;
  const buttons=[...tabs.querySelectorAll("button[data-movement-view]")];
  const render=()=>{
    const w=copy[lang()];
    tabs.setAttribute("aria-label",w.label);
    workspace.setAttribute("aria-label",w.room);
    for(const button of buttons){
      const selected=button.dataset.movementView===(root.dataset.movementView||"sequence");
      button.textContent=w[button.dataset.movementView];
      button.setAttribute("aria-pressed",String(selected));
      button.classList.toggle("is-selected",selected);
      button.setAttribute("aria-controls",button.dataset.movementView==="library"?"studio-asana-library":"movement-stage");
      // Keep the guided journey visible while a session is underway.
      button.disabled=busy && button.dataset.movementView==="library";
      button.title=button.disabled?w.busy:"";
    }
    const mode=root.dataset.studioMode||"asanas";
    const showingMovement=mode==="asanas";
    tabs.hidden=!showingMovement;
    // The library controller owns its own hidden state and knows about
    // movementView. CSS also hides the non-selected visual surface.
    if(mode!=="asanas"||root.dataset.movementView!=="library"){
      if(!gallery.hidden)gallery.hidden=true;
    }
  };
  const choose=view=>{
    if(view!=="sequence"&&view!=="library")return;
    if(busy&&view==="library")return;
    root.dataset.movementView=view;
    render();
  };
  // The site has its own cinematic smooth-scroll handler. On desktop,
  // pointerup/click can land after the viewport has already moved.
  // Capture the explicit mouse intent on pointerdown, before that motion.
  // Touch keeps click semantics so swipes never activate a tab.
  tabs.addEventListener("pointerdown",event=>{
    if(event.pointerType!=="mouse" || event.button!==0)return;
    const button=event.target.closest("button[data-movement-view]");
    if(button&&!button.disabled)choose(button.dataset.movementView);
  },true);
  tabs.addEventListener("click",event=>{
    const button=event.target.closest("button[data-movement-view]");
    if(button&&!button.disabled)choose(button.dataset.movementView);
  });
  tabs.addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const enabled=buttons.filter(button=>!button.disabled);
    if(!enabled.length)return;
    const i=enabled.indexOf(document.activeElement);
    let next=0;
    if(event.key==="End")next=enabled.length-1;
    else if(event.key==="ArrowRight")next=(i+1+enabled.length)%enabled.length;
    else if(event.key==="ArrowLeft")next=(i-1+enabled.length)%enabled.length;
    enabled[next].focus();
    enabled[next].click();
  });
  window.addEventListener("yoga:flow",event=>{
    busy=["running","paused"].includes(event.detail?.status);
    if(busy && root.dataset.movementView==="library")root.dataset.movementView="sequence";
    render();
  });
  const observer=new MutationObserver(render);
  observer.observe(root,{attributes:true,attributeFilter:["data-studio-mode","data-movement-view"]});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
  root.dataset.movementView="sequence";
  render();
})();
