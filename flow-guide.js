/* Yin / Yang yoga guide. Finished static drawings transition by fade, never limb interpolation. */
(() => {
  "use strict";
  const root=document.getElementById("flow-guide"),art=window.YIN_YANG_ART;
  if(!root||!art||!window.YOGA_FLOW)return;
  const phases=art.poses;
  const byId=Object.fromEntries(phases.map(p=>[p.id,p]));
  let snapshot=window.YOGA_FLOW.create().snapshot();
  let preview=false,epoch=0,settle=null,formManual=false;
  let shown="start";
  const language=()=>document.documentElement.lang==="en"?"en":"es";
  const still=()=>window.YOGA_RUNTIME?.mediaMatches?.("(prefers-reduced-motion: reduce)") ||
    document.body.classList.contains("quiet-mode") || document.hidden;
  const wait=ms=>new Promise(done=>{settle=setTimeout(done,ms);});
  root.classList.add("yy-guide");
  root.innerHTML=
   '<div class="guide-heading"><span data-guide-eyebrow>YIN · YANG YOGA</span>'+
   '<div class="yy-form-choice" role="group" aria-label="Elige la energía del personaje">'+
   '<button type="button" data-yy-form="yang" aria-pressed="true"><span aria-hidden="true">☼</span> YANG</button>'+
   '<button type="button" data-yy-form="yin" aria-pressed="false"><span aria-hidden="true">☾</span> YIN</button></div></div>'+
   '<div class="yy-stage"><div class="yy-sky" aria-hidden="true"></div><div class="yy-scene-breadcrumb" aria-hidden="true"><strong class="yy-count">01 / 10</strong><span class="yy-current-asana">Soltar el peso</span></div>'+
    '<div class="yy-energy yy-energy-a" aria-hidden="true"></div><div class="yy-energy yy-energy-b" aria-hidden="true"></div>'+
    art.markup()+
    '<div class="yy-asana-step" aria-hidden="true">GATO · EXHALA</div>'+
    '<div class="yy-bloom" aria-hidden="true"><span>✧</span></div>'+
    '<div class="yy-breath-panel" aria-live="off" aria-hidden="true"><small>RESPIRACIÓN · 4 / 7 / 8</small>'+
    '<strong class="yy-breath-count">4</strong><span class="yy-breath-label">INHALA</span>'+
    '<div class="yy-breath-rail"><i class="yy-breath-progress"></i></div></div>'+
    '<div class="yy-watermark" aria-hidden="true">YIN <span>☯</span> YANG</div>'+
   '</div><figcaption><strong id="guide-pose-name"></strong><p id="guide-pose-message"></p></figcaption>';
  const artSvg=root.querySelector(".yy-svg");
  const adaptViewBox=()=>{
    const mobile=window.YOGA_RUNTIME.mediaMatches("(max-width: 700px)");
    // Crop the illustration's empty margins, never the limbs.
    artSvg.setAttribute("viewBox",mobile?"120 0 480 435":"0 0 720 460");
  };
  window.addEventListener("resize",adaptViewBox,{passive:true});
  adaptViewBox();
  const current=()=>root.querySelector('.yy-pose.is-current');
  const stage=root.querySelector(".yy-stage");
  const title=root.querySelector("#guide-pose-name");
  const text=root.querySelector("#guide-pose-message");
  const breathPanel=root.querySelector(".yy-breath-panel");
  const titleFor=phase=>byId[phase]?.name[language()==="en"?1:0]||"";
  const showText=()=>{
    const pose=byId[snapshot.phase];
    if(!pose)return;
    root.dataset.status=snapshot.status;
    root.dataset.phase=snapshot.phase;
    root.querySelector(".yy-count").textContent=String(snapshot.index+1).padStart(2,"0")+" / 10";
    root.querySelector(".yy-current-asana").textContent=titleFor(snapshot.phase);
    title.textContent=pose.name[language()==="en"?1:0];
    text.textContent=pose.cue[language()==="en"?1:0];
    root.querySelector("[data-guide-eyebrow]").textContent=preview?
      (language()==="en"?"QUICK TOUR · TEN POSES":"RECORRIDO · DIEZ POSTURAS"):
      (language()==="en"?"TWO ENERGIES · ONE PRACTICE":"DOS ENERGÍAS · UNA PRÁCTICA");
    root.querySelector(".yy-svg").setAttribute("aria-label",titleFor(snapshot.phase));
    const active=snapshot.phase==="breath" && (snapshot.status==="running"||snapshot.status==="paused");
    stage.classList.toggle("yy-breath-active",active);
    breathPanel.setAttribute("aria-hidden",String(!active));
    if(!active)stage.dataset.breath="idle";
  };
  const signal=(type,ok)=>window.dispatchEvent(new CustomEvent(type,{detail:{phase:snapshot.phase,ok}}));
  const reveal=()=>{
    root.dataset.ready="true";
    root.dataset.motion="still";
    root.dataset.morph="1.000";
    stage.classList.remove("yy-blooming");
    signal("yoga:pose-ready",true);
  };
  const renderPose=async(phase,immediate=false)=>{
    const mine=++epoch;
    clearTimeout(settle);
    root.dataset.ready="false";
    root.dataset.motion="transition";
    root.dataset.morph="0.000";
    signal("yoga:pose-changing",false);
    const old=current();
    const next=root.querySelector('.yy-pose[data-pose="'+phase+'"]');
    if(!next){root.dataset.ready="error";return;}
    if(old===next){reveal();return;}
    const instant=immediate||still();
    if(instant){
      if(old)old.classList.remove("is-current");
      next.classList.add("is-current");
      shown=phase;reveal();return;
    }
    stage.classList.add("yy-blooming");
    if(old)old.classList.remove("is-current");
    await wait(220);
    if(mine!==epoch)return;
    next.classList.add("is-current");
    shown=phase;
    await wait(400);
    if(mine!==epoch)return;
    reveal();
  };
  function selectForm(form,manual=true){
    if(form!=="yin"&&form!=="yang")return;
    formManual=manual||formManual;
    if(manual) { try{localStorage.setItem("yy-yoga-form",form);}catch(_){} }
    root.dataset.spirit=form;
    for(const button of root.querySelectorAll("[data-yy-form]"))
      button.setAttribute("aria-pressed",String(button.dataset.yyForm===form));
    stage.setAttribute("aria-label",(form==="yin"?"Yin":"Yang")+" · "+titleFor(snapshot.phase));
  }
  root.addEventListener("click",event=>{
    const button=event.target.closest("[data-yy-form]");
    if(button)selectForm(button.dataset.yyForm);
  });
  window.addEventListener("yoga:flow",event=>{
    const old=snapshot.phase;
    snapshot=event.detail;
    showText();
    if(old!==snapshot.phase || root.dataset.ready==="error")renderPose(snapshot.phase);
  });
  window.addEventListener("yoga:preview",event=>{preview=!!event.detail;showText();});
  window.addEventListener("yoga:breath",event=>{
    const data=event.detail||{};
    if(snapshot.phase!=="breath")return;
    const labels={es:{inhale:"INHALA",hold:"SOSTÉN",exhale:"EXHALA"},en:{inhale:"INHALE",hold:"HOLD",exhale:"EXHALE"}};
    stage.dataset.breath=data.phase||"idle";
    root.querySelector(".yy-breath-count").textContent=String(data.remaining??4);
    root.querySelector(".yy-breath-label").textContent=labels[language()][data.phase]||"";
    root.querySelector(".yy-breath-progress").style.transform="scaleX("+Math.max(0,Math.min(1,Number(data.progress)||0))+")";
  });
  document.addEventListener("click",event=>{
    if(event.target.closest("[data-set-lang]"))window.YOGA_RUNTIME.frame(showText);
    if(event.target.closest("[data-set-theme]")&&!formManual)
      window.YOGA_RUNTIME.frame(()=>selectForm(document.documentElement.dataset.theme==="dark"?"yin":"yang",false));
  });
  document.addEventListener("visibilitychange",()=>{root.dataset.hidden=String(document.hidden);});
  const initial=root.querySelector('[data-pose="start"]');
  if(initial)initial.classList.add("is-current");
  let preferred;
  try{preferred=localStorage.getItem("yy-yoga-form");}catch(_){}
  selectForm(preferred==="yin"||preferred==="yang"?preferred:(document.documentElement.dataset.theme==="dark"?"yin":"yang"),!!preferred);
  showText();
  // Notify UI on next turn, after all deferred modules have installed their listeners.
  window.YOGA_RUNTIME.frame(reveal);
})();
