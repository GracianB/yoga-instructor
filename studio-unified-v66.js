/* V72 · One studio for three practices; Asana Book is an independent
 * chapter ABOVE this studio. No duplicate SVGs or extra animation clocks. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const entrance=root?.querySelector(".studio-entrance");
 const modes=entrance?.querySelector(".studio-modes");
 const sequence=root?.querySelector("#movement-stage");
 const guided=root?.querySelector("#studio-guided");
 if(!root||!entrance||!modes||!sequence||!guided)return;

 const workspace=document.createElement("div");
 workspace.className="studio-v66-workspace";
 workspace.id="studio-v66-workspace";
 workspace.setAttribute("aria-label","Sala de práctica");
 sequence.before(workspace);
 workspace.append(sequence,guided);

 const context=entrance.querySelector(".studio-path-context");
 if(context) modes.after(context);
 const plan=entrance.querySelector(".studio-plan");
 const adaptation=entrance.querySelector(".studio-adaptation");
 const controls=document.createElement("div");
 controls.className="studio-v66-control-pane";
 controls.setAttribute("aria-label","Controles de secuencia");
 controls.append(...[plan,adaptation,...[...sequence.children].filter(el=>!el.classList.contains("flow-theater"))].filter(Boolean));
 sequence.appendChild(controls);

 const guidedStage=guided.querySelector(".studio-guided-stage");
 const guidedTop=guidedStage?.querySelector(".studio-guided-top");
 if(guidedTop){
  const ordered=[".studio-guided-title",".studio-guided-cue",
   ".studio-breath-phase-detail",".studio-guided-countdown",
   ".studio-guided-progress",".studio-companion"].map(sel=>guidedStage.querySelector(sel)).filter(Boolean);
  guidedTop.after(...ordered);
 }
 // The three mode cards still use the original controller, including the
 // guided Movement sequence. Only the old Sequence/Asanas switch is gone.
 root.dataset.movementView="sequence";
 const observer=new MutationObserver(()=>{
  if(root.dataset.movementView!=="sequence")root.dataset.movementView="sequence";
  workspace.setAttribute("aria-label",document.documentElement.lang==="en"?"Practice studio":"Sala de práctica");
 });
 observer.observe(root,{attributes:true,attributeFilter:["data-movement-view"]});
 observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
})();
