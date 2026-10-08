/* D25 · Time and rest adapted to people, not a performance score.
   A deterministic distribution across the EXISTING ten poses. No timers. */
(() => {
  "use strict";
  const order=["start","centering","breath","warmup","pose-1","transition","pose-2","cooldown","savasana","finish"];
  const minimum=Object.freeze({
    start:15,centering:25,breath:35,warmup:45,"pose-1":40,
    transition:20,"pose-2":40,cooldown:35,savasana:65,finish:20
  });
  const targets=Object.freeze({auto:null,short:600,balanced:1020,extended:1440});
  const profiles=Object.freeze({
    steady:Object.freeze({}),
    gentle:Object.freeze({
      start:1.06,centering:1.15,breath:1.10,warmup:1.22,
      "pose-1":.70,transition:.93,"pose-2":.70,cooldown:1.29,savasana:1.22,finish:1.08
    })
  });
  const recoveryWeights=Object.freeze({
    start:1.08,centering:1.13,breath:1.04,warmup:1.06,
    "pose-1":.87,transition:.96,"pose-2":.87,cooldown:1.34,savasana:1.30,finish:1.07
  });
  const normalize=(input={})=>Object.freeze({
    level:input.level==="gentle"?"gentle":"steady",
    length:Object.prototype.hasOwnProperty.call(targets,input.length)?input.length:"auto",
    recovery:input.recovery===true,
    pace:["gentle","balanced","deep"].includes(input.pace)?input.pace:"balanced"
  });
  const build=(phases,raw={})=>{
    const settings=normalize(raw);
    if(!Array.isArray(phases)||phases.length!==order.length||
      phases.some((p,i)=>p.id!==order[i]||!Number.isFinite(p.durationSeconds)||p.durationSeconds<=0))
      throw Error("D25 requires the ten canonical yoga phases in order");
    const pace=({gentle:.8,balanced:1,deep:1.2})[settings.pace];
    // Default leaves D20 precisely unchanged, including its per-pose rounding.
    if(settings.length==="auto"&&settings.level==="steady"&&!settings.recovery){
      const durations=Object.freeze(Object.fromEntries(phases.map(p=>[p.id,Math.max(1,Math.round(p.durationSeconds*pace))])));
      return Object.freeze({settings,durations,totalSeconds:Object.values(durations).reduce((sum,v)=>sum+v,0)});
    }
    const base=phases.map(p=>Math.max(minimum[p.id],Math.round(p.durationSeconds*pace)));
    const target=targets[settings.length]??base.reduce((sum,x)=>sum+x,0);
    const reserved=order.map(id=>minimum[id]),floor=reserved.reduce((sum,x)=>sum+x,0);
    if(target<floor)throw Error("Yoga plan is shorter than the safe minimum");
    const weighted=base.map((x,i)=>{
      const id=order[i],level=profiles[settings.level][id]??1;
      const rest=settings.recovery?(recoveryWeights[id]??1):1;
      return Math.max(1,x*level*rest);
    });
    const total=weighted.reduce((sum,x)=>sum+x,0),remaining=target-floor;
    const rawExtra=weighted.map(w=>remaining*w/total);
    const result=reserved.map((min,i)=>min+Math.floor(rawExtra[i]));
    // Largest-remainder method: sum is the exact requested length, no drift.
    let toShare=target-result.reduce((sum,x)=>sum+x,0);
    const ranking=order.map((_,i)=>i).sort((a,b)=>
      (rawExtra[b]%1)-(rawExtra[a]%1)||a-b);
    for(let i=0;i<toShare;i++)result[ranking[i]]++;
    const durations=Object.freeze(Object.fromEntries(order.map((id,i)=>[id,result[i]])));
    return Object.freeze({settings,durations,totalSeconds:target});
  };
  const cue=(id,language,settings)=>{
    const es=language!=="en";
    if(!settings?.recovery && settings?.level!=="gentle")return null;
    if(id==="cooldown")return es?
      "Descansa en la postura del niño. Puedes permanecer aquí más tiempo; no fuerces la espalda.":
      "Rest in child's pose. Stay a little longer if you wish, without forcing the back.";
    if(id==="savasana")return es?
      "Apoya cómodamente la espalda. Descansa sin exigencias; dobla las rodillas si lo prefieres.":
      "Make the back comfortable. Rest without effort; bend the knees if you prefer.";
    if(id==="pose-1"&&settings.level==="gentle")return es?
      "Adapta Guerrero II a tu cuerpo; flexiona menos las rodillas y descansa cuando lo necesites.":
      "Adapt Warrior II to your body; bend less deeply and pause whenever needed.";
    if(id==="pose-2"&&settings.level==="gentle")return es?
      "En Árbol, apóyate en una pared o deja los dedos del pie en el suelo.":
      "In Tree, use a wall or keep the toes of the lifted foot on the floor.";
    return null;
  };
  const api=Object.freeze({order:Object.freeze(order),minimum,targets,normalize,build,cue});
  if(typeof window!=="undefined")window.YOGA_SESSION_DESIGN=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})();
