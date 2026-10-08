/* Future practice pathways. Pure data: no extra timers or UI side effects.
   This is the seed of an optional app, NOT a replacement for Yoga Flow. */
(() => {
  "use strict";
  const steps=(items)=>Object.freeze(items.map(([id,seconds])=>Object.freeze({id,seconds})));
  const modes=Object.freeze({
    asanas:Object.freeze({
      id:"asanas",name:Object.freeze({es:"Yoga y asanas",en:"Yoga and asanas"}),
      cue:Object.freeze({es:"Movimiento consciente",en:"Mindful movement"}),
      status:"current",
      phases:steps([["start",30],["centering",60],["breath",90],["warmup",120],
        ["pose-1",180],["transition",45],["pose-2",180],["cooldown",90],["savasana",180],["finish",30]])
    }),
    breath:Object.freeze({
      id:"breath",name:Object.freeze({es:"Solo respirar",en:"Just breathe"}),
      cue:Object.freeze({es:"Práctica guiada 4 · 7 · 8",en:"Guided 4 · 7 · 8"}),
      status:"future",
      phases:steps([["settle",60],["inhale",4],["hold",7],["exhale",8],["integrate",60]])
    }),
    meditation:Object.freeze({
      id:"meditation",name:Object.freeze({es:"Meditar",en:"Meditate"}),
      cue:Object.freeze({es:"Silencio, presencia y calma",en:"Silence, presence and ease"}),
      status:"future",
      phases:steps([["arrive",60],["anchor",120],["observe",300],["release",60]])
    })
  });
  const api=Object.freeze({
    ids:Object.freeze(Object.keys(modes)),
    get(id){return modes[id]||null},
    list(){return Object.freeze(Object.values(modes))},
    isAvailable(id){return modes[id]?.status==="current"}
  });
  if(typeof window!=="undefined")window.YOGA_PATHWAYS=api;
  if(typeof module!=="undefined" && module.exports)module.exports=api;
})();
