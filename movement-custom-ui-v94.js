/* V94 · One inline editor for the one V85 mini journey; no parallel clock. */
(()=>{
"use strict";
const model=window.YOGA_MOVEMENT_CUSTOM_V94,lib=window.YOGA_ASANA_LIBRARY,root=document.getElementById("movement-mini");
if(!model||!lib||!root)return;
const controls=root.querySelector(".v85-controls"),route=root.querySelector("#v85-route");
if(!controls||!route)return;
const option=document.createElement("option");option.value="custom";route.append(option);
const editor=document.createElement("details");editor.className="v94-editor";
editor.innerHTML='<summary class="v94-heading"></summary><div class="v94-body"><p class="v94-lead"></p>'+
'<div class="v94-steps"></div><div class="v94-actions">'+
'<button type="button" class="v94-apply"></button><button type="button" class="v94-reset"></button></div>'+
'<p class="v94-status" role="status" aria-live="polite"></p></div>';
controls.after(editor);
const steps=editor.querySelector(".v94-steps"),status=editor.querySelector(".v94-status");
const copy={
es:{option:"Mi secuencia",title:"Diseña tres pasos con Nila",lead:"Escoge tres asanas distintas. Puedes cambiar su orden; la biblioteca y los apoyos originales siguen siendo los mismos.",
 step:i=>"Postura "+i,up:"↑ Antes",down:"↓ Después",
 apply:"Usar esta secuencia",reset:"Recuperar ejemplo",
 ready:"Secuencia preparada. Usa Anterior y Siguiente para recorrerla.",
 duplicate:"Elige tres posturas diferentes antes de aplicar.",
 restored:"Ejemplo restaurado. Ningún temporizador ha comenzado."},
en:{option:"My sequence",title:"Design three steps with Nila",lead:"Choose three different asanas and change their order. The original library, drawings and supports remain unchanged.",
 step:i=>"Pose "+i,up:"↑ Earlier",down:"↓ Later",
 apply:"Use this sequence",reset:"Restore example",
 ready:"Sequence ready. Use Previous and Next to move through it.",
 duplicate:"Choose three different postures before applying.",
 restored:"Example restored. No timer has been started."}
};
const language=()=>document.documentElement.lang==="en"?"en":"es";
function refresh(){
 const words=copy[language()],ix=language()==="en"?1:0;
 option.textContent=words.option;
 editor.querySelector(".v94-heading").textContent=words.title;
 editor.querySelector(".v94-lead").textContent=words.lead;
 editor.querySelector(".v94-apply").textContent=words.apply;
 editor.querySelector(".v94-reset").textContent=words.reset;
 for(const row of steps.children){
  const i=Number(row.dataset.v94Index);
  row.querySelector("label").textContent=words.step(i+1);
  for(const opt of row.querySelector("select").options)opt.textContent=lib.byId(opt.value).name[ix];
  row.querySelector("[data-v94-direction=up]").textContent=words.up;
  row.querySelector("[data-v94-direction=down]").textContent=words.down;
  for(const button of row.querySelectorAll("[data-v94-direction]")){
   button.setAttribute("aria-label",words.step(i+1)+" · "+(button.dataset.v94Direction==="up"?words.up:words.down));
  }
 }
}
function draw(){
 steps.replaceChildren();
 model.current().forEach((poseId,index)=>{
  const row=document.createElement("div");row.className="v94-row";row.dataset.v94Index=String(index);
  const label=document.createElement("label");const id="v94-pose-"+index;
  label.htmlFor=id;
  const select=document.createElement("select");select.id=id;select.dataset.v94Position=String(index);
  for(const pose of lib.poses){
   const opt=document.createElement("option");opt.value=pose.id;
   select.append(opt);
  }
  select.value=poseId;
  const buttons=document.createElement("div");buttons.className="v94-reorder";
  for(const direction of ["up","down"]){
   const b=document.createElement("button");b.type="button";b.dataset.v94Direction=direction;
   if(direction==="up"&&index===0||direction==="down"&&index===2)b.disabled=true;
   buttons.append(b);
  }
  row.append(label,select,buttons);steps.append(row);
 });
 refresh();
}
function read(){
 return [...steps.querySelectorAll("select[data-v94-position]")].map(el=>el.value);
}
function setCustom(items){
 try{model.set(items);status.textContent=copy[language()].ready;route.value="custom";
 route.dispatchEvent(new Event("change",{bubbles:true}));return true;
 }catch(_){status.textContent=copy[language()].duplicate;return false}
}
steps.addEventListener("click",event=>{
 const b=event.target.closest("[data-v94-direction]");if(!b||b.disabled)return;
 const row=b.closest("[data-v94-index]"),index=Number(row.dataset.v94Index);
 const target=b.dataset.v94Direction==="up"?index-1:index+1;
 const data=read();[data[index],data[target]]=[data[target],data[index]];
 // Preserve uncommitted selections while reordering.
 if(new Set(data).size===3){model.set(data);draw()}
 else{const cells=[...steps.querySelectorAll("select")];cells.forEach((cell,i)=>cell.value=data[i])}
});
editor.querySelector(".v94-apply").addEventListener("click",()=>setCustom(read()));
editor.querySelector(".v94-reset").addEventListener("click",()=>{
 model.set(["d24-mountain","v68-warrior-ii","v68-tree"]);draw();setCustom(model.current());
 status.textContent=copy[language()].restored;
});
const observer=new MutationObserver(events=>{if(events.some(x=>x.attributeName==="lang"))refresh()});
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
window.addEventListener("yoga:v94-restore",()=>{
 draw();
 if(route.value==="custom")route.dispatchEvent(new Event("change",{bubbles:true}));
});
draw();
})();
