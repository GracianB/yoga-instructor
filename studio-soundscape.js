/* V36: One soundtrack for the whole site. Breathing owns UI, not audio. */
(() => {
  "use strict";
  const bus=window.YOGA_AUDIO_BUS;
  const root=document.getElementById("instructor-flow");
  const guided=root?.querySelector("#studio-guided");
  const controls=guided?.querySelector(".studio-guided-controls");
  if(!bus||!root||!guided||!controls)return;
  const ui=document.createElement("div");
  ui.className="studio-soundscape";
  ui.setAttribute("role","group");
  ui.innerHTML=[
    '<div class="studio-sound-copy"><span class="studio-sound-kicker"></span>',
    '<strong class="studio-sound-title"></strong><small class="studio-sound-track"></small></div>',
    '<div class="studio-sound-actions">',
    '<button type="button" class="studio-sound-toggle" aria-pressed="false"></button>',
    '<label class="studio-sound-volume-label" for="studio-sound-volume"></label>',
    '<input id="studio-sound-volume" class="studio-sound-volume" type="range" min="0" max="1" step=".05" value=".45">',
    '<button type="button" class="studio-sound-pick"></button>',
    '<button type="button" class="studio-sound-original"></button>',
    '<input type="file" accept="audio/*,.mp3" class="studio-sound-file" hidden>',
    '</div>'
  ].join("");
  controls.insertAdjacentElement("afterend",ui);
  const toggle=ui.querySelector(".studio-sound-toggle");
  const picker=ui.querySelector(".studio-sound-pick");
  const original=ui.querySelector(".studio-sound-original");
  const input=ui.querySelector(".studio-sound-file");
  const volume=ui.querySelector(".studio-sound-volume");
  const en=()=>document.documentElement.lang==="en";
  const syncText=()=>{
    const active=!bus.audio.paused;
    ui.querySelector(".studio-sound-kicker").textContent=en()?"ONE SOUNDTRACK":"UNA SOLA BANDA SONORA";
    ui.querySelector(".studio-sound-title").textContent=en()?"Breathe with music":"Respira con música";
    ui.querySelector(".studio-sound-track").textContent=bus.localName||"Silence Between Notes · 3:56";
    toggle.textContent=active?(en()?"Pause music":"Pausar música"):(en()?"Play music":"Escuchar música");
    toggle.setAttribute("aria-pressed",String(active&&bus.owner==="breath"));
    volume.setAttribute("aria-label",en()?"Music volume":"Volumen de la música");
    ui.querySelector(".studio-sound-volume-label").textContent=en()?"Volume":"Volumen";
    if(document.activeElement!==volume)volume.value=String(bus.audio.volume);
    picker.textContent=en()?"Choose another MP3":"Elegir otro MP3";
    original.textContent=en()?"Original track":"Canción original";
    original.hidden=!bus.localName;
    input.setAttribute("aria-label",en()?"Choose local music":"Elegir música local");
  };
  toggle.addEventListener("click",()=>{if(root.dataset.studioMode==="breath")void bus.toggle("breath");});
  volume.addEventListener("input",()=>{
    bus.audio.volume=Number(volume.value);
    if(bus.audio.muted&&bus.audio.volume>0)bus.audio.muted=false;
  });
  picker.addEventListener("click",()=>input.click());
  input.addEventListener("change",()=>{if(bus.selectFile(input.files?.[0]))syncText();});
  original.addEventListener("click",()=>bus.resetTrack());
  const syncMode=()=>{
    ui.hidden=root.dataset.studioMode!=="breath";
    if(ui.hidden&&bus.owner==="breath")bus.stop();
  };
  const modeObserver=new MutationObserver(syncMode);
  modeObserver.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
  const languageObserver=new MutationObserver(syncText);
  languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  window.addEventListener("yoga:audiochange",syncText);
  window.addEventListener("pagehide",()=>{
    modeObserver.disconnect();languageObserver.disconnect();
    window.removeEventListener("yoga:audiochange",syncText);
  });
  syncMode();syncText();
})();
