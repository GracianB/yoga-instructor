/* V36 · One soundtrack, one HTMLAudioElement and one explicit listener.
   The hero, studio and corner controls share transport and state.
   A remote Vortex iframe cannot be volume-controlled cross-origin; therefore
   it is mounted only on request and is unloaded if the soundtrack starts. */
(() => {
  "use strict";
  const audio = document.getElementById("focus-audio");
  const iframe = document.querySelector(".campo-vortex-full iframe");
  const vortexStart = document.getElementById("vortex-activate");
  const vortexStop = document.getElementById("vortex-stop");
  if (!audio) return;
  const originalSrc = "./audio/silence-between-notes.mp3";
  audio.setAttribute("src", originalSrc);
  let owner = null;
  let localUrl = null;
  let localName = "";
  let vortexActive = false;
  const language = () => document.documentElement.lang === "en" ? "en" : "es";
  const send = () => window.dispatchEvent(new CustomEvent("yoga:audiochange", {
    detail:{playing:!audio.paused, owner, name: localName || "Silence Between Notes", volume:audio.volume}
  }));
  function updateVortex() {
    if (vortexStart) {
      vortexStart.setAttribute("aria-pressed", String(vortexActive));
      vortexStart.textContent = language()==="en" ? "Enter Vortex" : "Entrar en Vortex";
      vortexStart.hidden=vortexActive;
    }
    if (vortexStop) {
      vortexStop.hidden=!vortexActive;
      vortexStop.textContent = language()==="en" ? "Exit Vortex" : "Salir de Vortex";
    }
    iframe?.parentElement?.classList.toggle("is-vortex-active",vortexActive);
  }
  const deactivateVortex=()=>{
    if (!vortexActive) return;
    vortexActive=false;
    if (iframe) iframe.src="about:blank"; // unload its independent sound and context
    updateVortex();
  };
  const activateVortex=()=>{
    if (!iframe || vortexActive) return;
    audio.pause(); // One audible source at a time; remote iframe is isolated
    owner=null;
    vortexActive=true;
    iframe.src=iframe.dataset.vortexSrc;
    updateVortex(); send();
  };
  const stop = () => {audio.pause();send();};
  const play = async (source) => {
    deactivateVortex();
    owner=source;
    try {await audio.play();send();return true;}catch(_){send();return false;}
  };
  const toggle = async (source) => {
    if(!audio.paused && owner===source){stop();return false;}
    return play(source);
  };
  const selectFile = (file) => {
    if(!file || !(file.type.startsWith("audio/") || /\.mp3$/i.test(file.name)))return false;
    if(file.size>20000000)return false;
    stop();
    const next=URL.createObjectURL(file);
    if(localUrl)URL.revokeObjectURL(localUrl);
    localUrl=next;localName=file.name;
    audio.src=localUrl;
    audio.load();
    owner=null;send();
    return true;
  };
  const resetTrack=()=>{
    stop(); if(localUrl)URL.revokeObjectURL(localUrl);
    localUrl=null;localName="";audio.src=originalSrc;audio.load();owner=null;send();
  };
  // One native player covers every public control. Refuse any surprise
  // playback by other media elements within this document.
  document.addEventListener("play",event=>{
    if(!(event.target instanceof HTMLMediaElement))return;
    if(event.target!==audio){
      audio.pause();
      for(const other of document.querySelectorAll("audio,video"))
        if(other!==event.target&&!other.paused)other.pause();
    }else{
      deactivateVortex();
      for(const other of document.querySelectorAll("audio,video"))
        if(other!==audio&&!other.paused)other.pause();
    }
    send();
  },true);
  audio.addEventListener("pause",send);
  audio.addEventListener("volumechange",send);
  audio.addEventListener("ended",send);
  vortexStart?.addEventListener("click",activateVortex);
  vortexStop?.addEventListener("click",deactivateVortex);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&vortexActive)deactivateVortex();});
  const languageObserver=new MutationObserver(updateVortex);
  languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  window.addEventListener("pagehide",()=>{languageObserver.disconnect();audio.pause();deactivateVortex();if(localUrl)URL.revokeObjectURL(localUrl);});
  window.YOGA_AUDIO_BUS=Object.freeze({audio,toggle,play,stop,selectFile,resetTrack,
    deactivateVortex,activateVortex,get owner(){return owner;},
    get localName(){return localName;},get vortexActive(){return vortexActive;}});
  // A native track needs an explicit click; no autoplay, including restore.
  updateVortex();send();
})();
