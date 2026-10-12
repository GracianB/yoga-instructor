/* V82 · Opt-in, calm per-posture variations beside the single live Asana Book. */
(()=>{
"use strict";
const book=document.getElementById("studio-asana-library");
const library=window.YOGA_ASANA_SAFETY_V82;
if(!book||!library)return;
const target=book.querySelector(".studio-library-coaching");
const display=book.querySelector(".studio-library-display");
if(!target||!display)return;
const root=document.createElement("section");
root.className="v82-options";
root.setAttribute("aria-labelledby","v82-title");
root.innerHTML='<div class="v82-heading"><h5 id="v82-title"></h5><p class="v82-lead"></p></div>'+
'<div class="v82-choice" role="group"><button type="button" data-v82-mode="soft" aria-pressed="true"></button>'+
'<button type="button" data-v82-mode="standard" aria-pressed="false"></button>'+
'<button type="button" data-v82-mode="supported" aria-pressed="false"></button></div>'+
'<p class="v82-advice" id="v82-advice" aria-live="polite"></p>'+
'<details class="v82-safety"><summary></summary><p></p></details>'+
'<p class="v82-disclaimer"></p>';
target.after(root);
let mode="soft";
const content={
es:{title:"Explora con opciones",lead:"Tres maneras de acercarte a la misma postura. La amplitud es opcional.",
 soft:"Suave",standard:"Base",supported:"Con apoyo",safety:"Cuándo reducir o detenerte",
 disclaimer:"Información general para explorar yoga, no evaluación médica. Si tienes lesiones o dudas de salud, solicita orientación profesional."},
en:{title:"Explore with options",lead:"Three approaches to the same pose. Depth is optional.",
 soft:"Gentle",standard:"Base",supported:"With support",safety:"When to ease back or stop",
 disclaimer:"General yoga exploration, not medical assessment. Seek qualified advice for injuries or health concerns."}};
const en=()=>document.documentElement.lang==="en";
function render(){
 const lex=content[en()?"en":"es"],index=en()?1:0;
 const id=display.dataset.libraryCurrent;
 const record=library.byId(id);if(!record)return;
 root.querySelector("#v82-title").textContent=lex.title;
 root.querySelector(".v82-lead").textContent=lex.lead;
 root.querySelector(".v82-choice").setAttribute("aria-label",lex.title);
 for(const button of root.querySelectorAll("[data-v82-mode]")){
  button.textContent=lex[button.dataset.v82Mode];
  button.setAttribute("aria-pressed",String(button.dataset.v82Mode===mode));
 }
 root.querySelector("#v82-advice").textContent=record[mode][index];
 root.querySelector(".v82-safety summary").textContent=lex.safety;
 root.querySelector(".v82-safety p").textContent=record.caution[index];
 root.querySelector(".v82-disclaimer").textContent=lex.disclaimer;
}
root.querySelector(".v82-choice").addEventListener("click",event=>{
 const button=event.target.closest("[data-v82-mode]");if(!button)return;
 mode=button.dataset.v82Mode;render();
});
new MutationObserver(records=>{if(records.some(r=>r.attributeName==="data-library-current"))render()})
.observe(display,{attributes:true,attributeFilter:["data-library-current"]});
new MutationObserver(records=>{if(records.some(r=>r.attributeName==="lang"))render()})
.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
render();
})();
