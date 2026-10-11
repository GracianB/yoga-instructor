/* V67 · Guardian identity, one shared practice engine.
 * Only static editorial content changes by mode and language. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const controls=root?.querySelector(".studio-v66-control-pane");
 const guided=root?.querySelector("#studio-guided");
 const gallery=root?.querySelector("#studio-asana-library .studio-library-heading");
 if(!root||!controls||!guided||!gallery)return;
 const copy={
  es:{
   asanas:["✺","NILA · MOVIMIENTO","Tierra y fuego suave · Fuerza con calma"],
   breath:["≈","DRAGÓN · RESPIRACIÓN","Agua y aire · Espacio en cada exhalación"],
   meditation:["☾","UMA · MEDITACIÓN","Luna y quietud · Descansar en el presente"],
   library:["✺","NILA · 12 ASANAS","Posturas individuales para explorar a tu ritmo"]
  },
  en:{
   asanas:["✺","NILA · MOVEMENT","Earth and gentle fire · Grounded strength"],
   breath:["≈","DRAGON · BREATH","Water and air · Space in every exhale"],
   meditation:["☾","UMA · MEDITATION","Moon and stillness · Rest in the present"],
   library:["✺","NILA · 12 ASANAS","Independent postures, your own pace"]
  }
 };
 const signature=()=>{
  const tag=document.createElement("div");
  tag.className="studio-v67-identity";
  tag.setAttribute("role","note");
  const mark=document.createElement("span");
  mark.className="studio-v67-identity-symbol";
  mark.setAttribute("aria-hidden","true");
  const body=document.createElement("div");
  const title=document.createElement("strong"),caption=document.createElement("small");
  body.append(title,caption);tag.append(mark,body);
  return {tag,mark,title,caption};
 };
 const movement=signature(),rest=signature(),lib=signature();
 controls.prepend(movement.tag);
 guided.prepend(rest.tag);
 gallery.prepend(lib.tag);
 const paint=(view,arr)=>{
  view.mark.textContent=arr[0];
  view.title.textContent=arr[1];
  view.caption.textContent=arr[2];
 };
 const update=()=>{
  const locale=document.documentElement.lang==="en"?"en":"es";
  const mode=root.dataset.studioMode==="breath"?"breath":
    root.dataset.studioMode==="meditation"?"meditation":"asanas";
  paint(movement,copy[locale].asanas);
  paint(rest,copy[locale][mode==="asanas"?"breath":mode]);
  paint(lib,copy[locale].library);
  rest.tag.hidden=mode==="asanas";
  movement.tag.setAttribute("aria-label",copy[locale].asanas[1]);
  rest.tag.setAttribute("aria-label",copy[locale][mode==="asanas"?"breath":mode][1]);
 };
 const watch=new MutationObserver(update);
 watch.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 watch.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 window.addEventListener("pagehide",()=>watch.disconnect(),{once:true});
 update();
})();
