/* V55 · A single visual progress rail, never a second session engine.
   The canonical Yoga Flow snapshot owns phase and status. */
(() => {
  "use strict";
  const root=document.getElementById("instructor-flow");
  const consoleRoot=root?.querySelector(".flow-console");
  const footer=consoleRoot?.querySelector(".flow-console-foot");
  if(!root||!consoleRoot||!footer||footer.querySelector(".flow-steps"))return;
  const total=10;
  const rail=document.createElement("div");
  rail.className="flow-steps";
  rail.setAttribute("role","img");
  rail.setAttribute("aria-label","Progreso de la sesión: fase 1 de 10");
  const chips=[];
  for(let i=0;i<total;i++){
    const chip=document.createElement("span");
    chip.className="flow-step";
    chip.setAttribute("aria-hidden","true");
    rail.appendChild(chip);
    chips.push(chip);
  }
  const label=document.createElement("span");
  label.className="flow-step-label";
  label.setAttribute("aria-hidden","true");
  rail.appendChild(label);
  footer.appendChild(rail);
  const isEn=()=>document.documentElement.lang==="en";
  const update=(rawIndex=0)=>{
    const index=Math.max(0,Math.min(total-1,Number(rawIndex)||0));
    chips.forEach((chip,i)=>{
      chip.classList.toggle("is-complete",i<index);
      chip.classList.toggle("is-current",i===index);
    });
    label.textContent=String(index+1).padStart(2,"0")+" / "+total;
    const text=isEn()?"Session progress: phase ":"Progreso de la sesión: fase ";
    rail.setAttribute("aria-label",text+(index+1)+(isEn()?" of ":" de ")+total);
    consoleRoot.dataset.stageIndex=String(index+1);
  };
  let lastIndex=0;
  window.addEventListener("yoga:flow",event=>{
    if(!event.detail)return;
    lastIndex=event.detail.index??lastIndex;
    update(lastIndex);
  });
  document.addEventListener("click",event=>{
    if(event.target.closest("[data-set-lang]"))update(lastIndex);
    // The user explicitly chose a mode: show the selected stage, rather
    // than leaving them stranded above the practice configuration card.
    const target=event.target.closest("button[data-studio-mode]");
    if(!target||!event.isTrusted||target.disabled)return;
    const stage=target.dataset.studioMode==="asanas"?consoleRoot:document.getElementById("studio-guided");
    if(!stage)return;
    const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    // An actual click scrolls to the chosen stage; programmatic clicks in
    // regression tests never hijack the browser viewport.
    requestAnimationFrame(()=>stage.scrollIntoView({behavior:reduce?"instant":"smooth",block:"start"}));
  });
  update(0);
})();
