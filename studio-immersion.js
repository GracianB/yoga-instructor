/* D21 · Immersive practice room and opt-in, device-native voice guidance.
   Nothing plays automatically. Focus returns to the invoking control. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const intro=root?.querySelector(".studio-entrance .studio-intro");
 const guided=root?.querySelector("#studio-guided");
 if(!root||!intro||!guided)return;
 const toolbar=document.createElement("div");
 toolbar.className="studio-immersive-tools";
 const focus=document.createElement("button");
 const voice=document.createElement("button");
 for(const button of [focus,voice])button.type="button";
 focus.dataset.studioFocusToggle="";
 voice.dataset.studioVoiceToggle="";
 focus.setAttribute("aria-pressed","false");
 voice.setAttribute("aria-pressed","false");
 toolbar.append(focus,voice);
 intro.insertAdjacentElement("afterend",toolbar);
 const canSpeak=typeof window.speechSynthesis!=="undefined" && typeof window.SpeechSynthesisUtterance==="function";
 if(!canSpeak){voice.disabled=true;voice.title="Voice guidance unavailable in this browser";}
 let immersive=false,speaking=false,lastFlow="",lastGuided="",returnFocus=null;
 const background=[...document.querySelectorAll("body > header,body > footer,main > section:not(#instructor-flow)")];
 const inertBefore=new Map();
 const lang=()=>document.documentElement.lang==="en"?"en":"es";
 const update=()=>{
  focus.textContent=immersive?(lang()==="en"?"Leave practice room":"Salir de la sala"):
    (lang()==="en"?"Immersive view":"Vista inmersiva");
  voice.textContent=speaking?(lang()==="en"?"Silence voice":"Silenciar voz"):
    (lang()==="en"?"Device voice":"Guía por voz");
  focus.setAttribute("aria-pressed",String(immersive));
  voice.setAttribute("aria-pressed",String(speaking));
 };
 const cancel=()=>{
  if(canSpeak)try{window.speechSynthesis.cancel();}catch(_){}
 };
 const say=text=>{
  if(!speaking||!canSpeak||!text)return;
  try{
   cancel();
   const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang=lang()==="en"?"en-GB":"es-ES";
   utterance.rate=.88;
   utterance.pitch=1;
   window.speechSynthesis.speak(utterance);
  }catch(_){}
 };
 const guidedCopy=(status,mode)=>{
  if(lang()==="en"){
   return status==="finished"?"The practice is complete. Take a moment before moving on.":
    mode==="breath"?"Breathe in gently, breathe out easily. Follow only if comfortable.":
    "Settle in. Notice the breath and allow the mind to rest.";
  }
  return status==="finished"?"La práctica ha terminado. Tómate un instante antes de continuar.":
   mode==="breath"?"Inhala suavemente y exhala sin esfuerzo. Sigue el ritmo solo si te resulta cómodo.":
   "Encuentra una postura cómoda. Observa la respiración sin forzar nada.";
 };
 const syncGuided=()=>{
  const mode=root.dataset.studioMode||"asanas";
  const status=guided.dataset.studioStatus||"idle";
  const token=mode+":"+status;
  if(token===lastGuided)return;
  lastGuided=token;
  if(mode==="asanas"||status==="paused"||status==="idle"){cancel();return;}
  if(status==="running"||status==="finished")say(guidedCopy(status,mode));
 };
 const toggleFocus=on=>{
  if(on===immersive)return;
  immersive=on;
  if(on){
   returnFocus=document.activeElement;
   inertBefore.clear();
   for(const node of background){inertBefore.set(node,node.inert);node.inert=true;}
   root.setAttribute("role","dialog");
   root.setAttribute("aria-modal","true");
   document.body.classList.add("studio-focus");
   root.scrollTop=0;
   focus.focus();
  }else{
   document.body.classList.remove("studio-focus");
   for(const [node,previous] of inertBefore)node.inert=previous;
   inertBefore.clear();
   root.removeAttribute("role");
   root.removeAttribute("aria-modal");
   (returnFocus?.isConnected?returnFocus:focus).focus();
  }
  update();
 };
 focus.addEventListener("click",()=>toggleFocus(!immersive));
 voice.addEventListener("click",()=>{
  if(!canSpeak)return;
  speaking=!speaking;
  if(!speaking)cancel();
  else{
   const mode=root.dataset.studioMode||"asanas";
   const status=guided.dataset.studioStatus||"idle";
   if(mode!=="asanas")say(guidedCopy(status,mode));
   else say(lang()==="en"?"Your practice. Your pace.":"Tu práctica, a tu ritmo.");
  }
  update();
 });
 document.addEventListener("keydown",event=>{
  if(!immersive)return;
  if(event.key==="Escape"){event.preventDefault();toggleFocus(false);return;}
  if(event.key!=="Tab")return;
  const elements=[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')]
   .filter(el=>el.getClientRects().length && !el.closest("[hidden]"));
  if(!elements.length)return;
  const first=elements[0],last=elements[elements.length-1],active=document.activeElement;
  if(event.shiftKey && (active===first||!root.contains(active))){event.preventDefault();last.focus();}
  else if(!event.shiftKey && (active===last||!root.contains(active))){event.preventDefault();first.focus();}
 },true);
 window.addEventListener("yoga:flow",({detail})=>{
  if(detail.status!=="running"){
   if(detail.status==="paused"||detail.status==="idle")cancel();
   return;
  }
  if(lastFlow===detail.phase)return;
  lastFlow=detail.phase;
  say(root.querySelector("#guide-pose-message")?.textContent||detail.cue);
 });
 new MutationObserver(syncGuided).observe(guided,{attributes:true,attributeFilter:["data-studio-status"]});
 new MutationObserver(syncGuided).observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 window.addEventListener("pagehide",()=>{cancel();if(immersive)toggleFocus(false);});
 update();
})();
