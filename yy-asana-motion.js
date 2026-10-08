/* YIN × YANG · Phase B. Each asana has its own controlled movement.
   Only Cat-Cow changes the spine's vector geometry. Feet stay anchored. */
(() => {
  "use strict";
  const root=document.getElementById("flow-guide");
  if(!root || !window.YOGA_RUNTIME || !window.YIN_YANG_ART)return;
  const rt=window.YOGA_RUNTIME;
  const spine=root.querySelector('[data-asana-spine]');
  const back=root.querySelector('[data-asana-back]');
  const belly=root.querySelector('[data-asana-belly]');
  const warmup=root.querySelector('.yy-pose[data-pose="warmup"]');
  const head=warmup?.querySelector(".yy-head-motion");
  const tail=warmup?.querySelector(".yy-tail-motion");
  const label=root.querySelector(".yy-asana-step");
  const fmt=n=>n.toFixed(1);
  const clock={phase:root.dataset.phase||"start",status:root.dataset.status||"idle",elapsed:0,last:0,frame:0,ready:root.dataset.ready==="true"};
  const motionReduced=()=>rt.mediaMatches("(prefers-reduced-motion: reduce)");
  const suspended=()=>document.hidden || document.body.classList.contains("quiet-mode") || motionReduced();
  const frame=(now)=>{
    clock.frame=0;
    if(clock.phase!=="warmup" || clock.status!=="running" || !clock.ready || suspended())return;
    const delta=clock.last ? Math.max(0,Math.min(80,now-clock.last)) : 0;
    clock.elapsed+=delta;
    clock.last=now;
    // One calm 8.4-second cycle; the cat rounds and the cow dips the spine.
    const angle=(clock.elapsed%8400)/8400*Math.PI*2;
    const curve=Math.cos(angle);
    // Cat: arched back + tucked abdomen. Cow: dipped back + released belly.
    // Both the DORSAL and VENTRAL surfaces move in opposite directions,
    // while shoulders, hips and the four paws remain grounded.
    const bend=-58-33*curve;
    const underside=57-21*curve;
    if(back)back.setAttribute("d",
      "M-98.3 -29.6Q-123.1 -2.6 -102.2 28.6Q0 "+fmt(underside)+" 98.3 28.6Q136.2 0 104.8 -28.6Q0 "+fmt(bend)+" -98.3 -29.6Z");
    if(spine)spine.setAttribute("d","M-105 -24Q0 "+fmt(bend-3)+" 104 -24");
    if(belly)belly.setAttribute("d","M-95 27Q0 "+fmt(underside-14)+" 95 27Q0 "+fmt(underside-1)+" -95 27Z");
    // Neck and tail follow the spinal flexion, not the other way around.
    if(head)head.setAttribute("transform","translate(0 "+fmt(curve*10)+") rotate("+fmt(curve*9)+" 223 236)");
    if(tail)tail.setAttribute("transform","rotate("+fmt(-curve*7)+" 461 238)");
    const next=curve>=0?"cat":"cow";
    if(root.dataset.asanaStep!==next){
      root.dataset.asanaStep=next;
      if(label)label.textContent=next==="cat"?(document.documentElement.lang==="en"?"CAT · EXHALE":"GATO · EXHALA"):
        (document.documentElement.lang==="en"?"COW · INHALE":"VACA · INHALA");
    }
    clock.frame=rt.frame(frame);
  };
  const stop=()=>{
    if(clock.frame)rt.cancel(clock.frame);
    clock.frame=0;clock.last=0;
  };
  function settle(){
    const active=clock.status==="running" && clock.phase==="warmup" && clock.ready && !suspended();
    root.dataset.asanaState=!clock.ready?"transition":
      suspended()?"reduced":
      clock.status==="paused"?"paused":clock.status==="running"?"running":clock.status;
    if(!active){stop();return;}
    if(!clock.frame){clock.last=0;clock.frame=rt.frame(frame);}
  }
  window.addEventListener("yoga:pose-changing",()=>{
    clock.ready=false;
    stop();settle();
  });
  window.addEventListener("yoga:pose-ready",({detail})=>{
    clock.ready=!!detail?.ok;
    clock.phase=detail?.phase||root.dataset.phase;
    settle();
  });
  window.addEventListener("yoga:flow",({detail})=>{
    const previous=clock.phase;
    clock.phase=detail.phase;
    clock.status=detail.status;
    if(previous!==clock.phase){clock.elapsed=0;root.dataset.asanaStep="";}
    settle();
  });
  window.addEventListener("yoga:breath",({detail})=>{
    root.dataset.breathStep=detail?.phase||"idle";
  });
  window.addEventListener("yoga:preview",settle);
  document.addEventListener("visibilitychange",settle);
  window.addEventListener("pagehide",stop);
  const media=window.matchMedia?.("(prefers-reduced-motion: reduce)");
  media?.addEventListener?.("change",settle);
  // Quiet-mode can change via a UI toggle without emitting a yoga:flow event.
  const observer=new MutationObserver(settle);
  observer.observe(document.body,{attributes:true,attributeFilter:["class"]});
  root.dataset.asanaStep="";
  settle();
})();
