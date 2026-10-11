/* V92 · Three identities live in three native mode buttons.
 * No additional guardians, images or active timers. */
(()=>{
"use strict";
const root=document.getElementById("instructor-flow"),modes=root?.querySelectorAll(".studio-modes button[data-studio-mode]");
if(!root||!modes?.length)return;
const descriptors={
 es:{asanas:"TIERRA · FUERZA CON CALMA",breath:"AGUA · RESPIRAR SIN PRISA",meditation:"LUNA · ATENCIÓN AMABLE"},
 en:{asanas:"EARTH · GROUNDED STRENGTH",breath:"WATER · UNHURRIED BREATH",meditation:"MOON · GENTLE ATTENTION"}
};
modes.forEach(button=>{
 const label=document.createElement("span");
 label.className="v92-identity-signature";label.setAttribute("aria-hidden","true");
 button.querySelector(".studio-mode-copy")?.appendChild(label);
});
function paint(){
 const en=document.documentElement.lang==="en";
 modes.forEach(button=>{
 const mode=button.dataset.studioMode;
 const signature=button.querySelector(".v92-identity-signature");
 if(signature)signature.textContent=descriptors[en?"en":"es"][mode];
 });
}
const observer=new MutationObserver(paint);
observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("pagehide",()=>observer.disconnect(),{once:true});
paint();
})();
