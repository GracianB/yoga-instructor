/* V33 · Session soundscape.
 * Opt-in audio only; the visitor may select their own MP3 without uploading it.
 * Default is the already-shipped sustained-focus.mp3 until the new soundtrack
 * is committed under audio/silence-between-notes.mp3. */
(() => {
 "use strict";
 const root=document.getElementById("instructor-flow");
 const guided=root?.querySelector("#studio-guided");
 const controls=guided?.querySelector(".studio-guided-controls");
 if(!root||!guided||!controls)return;
 const ui=document.createElement("div");
 ui.className="studio-soundscape";
 ui.setAttribute("role","group");
 ui.innerHTML=[
  '<div class="studio-sound-copy"><span class="studio-sound-kicker"></span>',
  '<strong class="studio-sound-title"></strong><small class="studio-sound-track"></small></div>',
  '<div class="studio-sound-actions">',
  '<button type="button" class="studio-sound-toggle" aria-pressed="false"></button>',
  '<label class="studio-sound-volume-label" for="studio-sound-volume"></label>',
  '<input id="studio-sound-volume" class="studio-sound-volume" type="range" min="0" max="1" step=".05" value=".32">',
  '<button type="button" class="studio-sound-pick"></button>',
  '<input type="file" accept="audio/*,.mp3" class="studio-sound-file" hidden>',
  '</div>',
  '<audio class="studio-sound-audio" preload="none" loop src="./audio/sustained-focus.mp3"></audio>'
 ].join("");
 controls.insertAdjacentElement("afterend",ui);
 const sound=ui.querySelector("audio");
 const toggle=ui.querySelector(".studio-sound-toggle");
 const picker=ui.querySelector(".studio-sound-pick");
 const input=ui.querySelector(".studio-sound-file");
 const volume=ui.querySelector(".studio-sound-volume");
 let objectUrl=null;
 let custom=false;
 let ownerTrack=false;
 let checkedOwnerTrack=false;
 sound.volume=.32;
 const en=()=>document.documentElement.lang==="en";
 const syncText=()=>{
   ui.querySelector(".studio-sound-kicker").textContent=en()?"SOUND OF THE SANCTUARY":"SONIDO DEL SANTUARIO";
   ui.querySelector(".studio-sound-title").textContent=en()?"Your breathing soundtrack":"Tu música para respirar";
   ui.querySelector(".studio-sound-track").textContent=custom?input.files?.[0]?.name||"Silence Between Notes":
     ownerTrack?"Silence Between Notes · 3:56":
     en()?"Sustained Focus · included track":"Sustained Focus · pista incluida";
   toggle.textContent=sound.paused?(en()?"Play music":"Escuchar música"):(en()?"Pause music":"Pausar música");
   toggle.setAttribute("aria-pressed",String(!sound.paused));
   volume.setAttribute("aria-label",en()?"Soundtrack volume":"Volumen de la música");
   ui.querySelector(".studio-sound-volume-label").textContent=en()?"Volume":"Volumen";
   picker.textContent=en()?"Choose your MP3":"Elegir mi MP3";
   input.setAttribute("aria-label",en()?"Choose soundtrack audio file":"Elegir archivo de música");
 };
 const stop=()=>{if(!sound.paused)sound.pause();syncText();};
 const resolveOwnerTrack=async()=>{
   if(checkedOwnerTrack||custom)return;
   checkedOwnerTrack=true;
   // Probe only after a real user click. Before the MP3 is committed, the
   // existing included song remains available and no startup 404 is raised.
   try{
     const url=new URL("./audio/silence-between-notes.mp3",document.baseURI);
     const reply=await fetch(url,{method:"HEAD",cache:"no-store"});
     if(reply.ok){
       sound.src=url.href;
       sound.load();
       ownerTrack=true;
     }
   }catch(_){ /* Offline sessions retain the bundled fallback. */ }
 };
 toggle.addEventListener("click",async()=>{
   if(root.dataset.studioMode!=="breath")return;
   if(!sound.paused){stop();return;}
   // Never trigger the existing Vortex player or spoken guide.
   const other=document.querySelector("#focus-audio");
   if(other&&!other.paused)other.pause();
   await resolveOwnerTrack();
   try{await sound.play();}
   catch(_){stop();}
   syncText();
 });
 volume.addEventListener("input",()=>{sound.volume=Number(volume.value);});
 picker.addEventListener("click",()=>input.click());
 input.addEventListener("change",()=>{
   const file=input.files?.[0];
   if(!file||!(file.type.startsWith("audio/")||/\.mp3$/i.test(file.name)))return;
   stop();
   if(objectUrl)URL.revokeObjectURL(objectUrl);
   objectUrl=URL.createObjectURL(file);
   sound.src=objectUrl;
   custom=true;
   checkedOwnerTrack=true;
   ownerTrack=false;
   sound.load();
   syncText();
 });
 sound.addEventListener("ended",syncText);
 sound.addEventListener("pause",syncText);
 sound.addEventListener("play",syncText);
 const sync=()=>{
   ui.hidden=root.dataset.studioMode!=="breath";
   const status=guided.dataset.studioStatus;
   if(ui.hidden||status==="paused"||status==="finished"||status==="idle")stop();
 };
 const observer=new MutationObserver(sync);
 observer.observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
 observer.observe(guided,{attributes:true,attributeFilter:["data-studio-status"]});
 const language=new MutationObserver(syncText);
 language.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 window.addEventListener("pagehide",()=>{
   stop();
   if(objectUrl)URL.revokeObjectURL(objectUrl);
   observer.disconnect();language.disconnect();
 });
 sync();syncText();
})();
