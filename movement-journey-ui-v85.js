/* V85 · Movement mini-journey in the existing Asana Book; native clicks reuse Nila. */
(()=>{
"use strict";
const book=document.getElementById("studio-asana-library");
const model=window.YOGA_MOVEMENT_JOURNEY_V85;
if(!book||!model||!window.YOGA_ASANA_LIBRARY)return;
const root=document.createElement("section");root.id="movement-mini";
root.className="v85-mini";root.setAttribute("aria-labelledby","v85-title");
root.innerHTML='<div class="v85-intro"><div><span class="v85-kicker"></span><h4 id="v85-title"></h4></div><p class="v85-intro-copy"></p></div>'+
'<div class="v85-controls"><label for="v85-route"></label><select id="v85-route">'+
'<option value="roots"></option><option value="mobility"></option><option value="restore"></option></select></div>'+
'<div class="v85-progress"><span class="v85-step-label"></span><progress max="3" value="1"></progress></div>'+
'<div class="v85-current"><strong class="v85-asana-title"></strong><h5 class="v85-heading"></h5><p class="v85-cue"></p></div>'+
'<div class="v85-actions"><button type="button" data-v85-action="previous"></button>'+
'<button type="button" data-v85-action="next"></button>'+
'<button type="button" data-v85-action="restart"></button></div>'+
'<p class="v85-status" aria-live="polite" role="status"></p>'+
'<p class="v85-footnote"></p><a class="v85-main-link" href="#instructor-flow"></a>';
const foot=book.querySelector(".studio-library-foot");
if(!foot)return;foot.before(root);
const select=root.querySelector("#v85-route"),buttons={};
for(const b of root.querySelectorAll("[data-v85-action]"))buttons[b.dataset.v85Action]=b;
const dict={
es:{kicker:"MOVIMIENTO · MINI SECUENCIA",title:"Tres posturas. Una intención.",
 intro:"Recorre tres posiciones sin prisa, con controles manuales. Nila utiliza el mismo dibujo del libro.",
 select:"Recorrido",routes:{roots:"Enraizar",mobility:"Movilidad amable",restore:"Descanso activo",custom:"Mi secuencia"},
 step:n=>"ETAPA "+n+" / 03",prev:"← Anterior",next:"Siguiente →",finish:"Recorrido completo",
 restart:"↶ Volver al principio",footnote:"Sin tiempo impuesto ni reproducción automática. Puedes salir en cualquier momento.",
 link:"Abrir la sesión completa de Movement ↗",aria:"Progreso del recorrido",
 selected:"Postura seleccionada",noClock:"Este recorrido no pone en marcha la práctica guiada."},
en:{kicker:"MOVEMENT · MINI SEQUENCE",title:"Three postures. One intention.",
 intro:"Explore three positions at your own pace, using manual controls. Nila reuses the same drawings as the book.",
 select:"Journey",routes:{roots:"Find your base",mobility:"Gentle mobility",restore:"Active rest",custom:"My sequence"},
 step:n=>"STAGE "+n+" / 03",prev:"← Previous",next:"Next →",finish:"Journey complete",
 restart:"↶ Back to start",footnote:"No imposed timing or automatic playback. You can leave at any moment.",
 link:"Open the complete Movement session ↗",aria:"Journey progress",
 selected:"Posture selected",noClock:"This journey does not start the guided practice."}
};
const lang=()=>document.documentElement.lang==="en"?"en":"es";
let route="roots",index=0,activated=false;
const custom=window.YOGA_MOVEMENT_CUSTOM_V94;
const getPlan=(name,language)=>name==="custom"&&custom?custom.plan(language):model.plan(name,language);
function useExistingBook(poseId){
 // The book remains the sole selector and renderer of Nila.
 if(route==="custom")book.querySelector(".v81-clear")?.click();
 const routeButton=book.querySelector('[data-v81-route="'+route+'"]');
 if(routeButton?.getAttribute("aria-pressed")!=="true")routeButton?.click();
 const poseButton=book.querySelector('button[data-library-pose="'+poseId+'"]');
 if(poseButton&&!poseButton.hidden)poseButton.click();
}
function render(){
 const w=dict[lang()],steps=getPlan(route,lang()),current=steps[index];
 root.querySelector(".v85-kicker").textContent=w.kicker;
 root.querySelector("#v85-title").textContent=w.title;
 root.querySelector(".v85-intro-copy").textContent=w.intro;
 root.querySelector('label[for="v85-route"]').textContent=w.select;
 for(const option of select.options)option.textContent=w.routes[option.value];
 select.value=route;
 root.querySelector(".v85-step-label").textContent=w.step(index+1);
 root.querySelector("progress").value=index+1;
 root.querySelector("progress").setAttribute("aria-label",w.aria);
 root.querySelector(".v85-asana-title").textContent=window.YOGA_ASANA_LIBRARY.byId(current.id).name[lang()==="en"?1:0];
 root.querySelector(".v85-heading").textContent=current.title;
 root.querySelector(".v85-cue").textContent=current.cue;
 buttons.previous.textContent=w.prev;
 buttons.previous.disabled=index===0;
 buttons.next.textContent=index===steps.length-1?w.finish:w.next;
 buttons.next.disabled=index===steps.length-1;
 buttons.restart.textContent=w.restart;
 root.querySelector(".v85-footnote").textContent=w.footnote;
 root.querySelector(".v85-main-link").textContent=w.link;
 root.querySelector(".v85-status").textContent=activated?w.selected+": "+(index+1)+"/3. "+w.noClock:"";
 root.dataset.v85Step=String(index);
 book.dataset.v85Active=String(activated);
}
select.addEventListener("change",()=>{route=select.value;index=0;activated=true;useExistingBook(getPlan(route,lang())[0].id);render()});
root.querySelector(".v85-actions").addEventListener("click",event=>{
 const b=event.target.closest("[data-v85-action]");if(!b)return;
 if(b.dataset.v85Action==="next")index=model.clampStep(index+1);
 if(b.dataset.v85Action==="previous")index=model.clampStep(index-1);
 if(b.dataset.v85Action==="restart")index=0;
 activated=true;useExistingBook(getPlan(route,lang())[index].id);render();
});
new MutationObserver(records=>{if(records.some(r=>r.attributeName==="lang"))render()})
 .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
render();
})();
