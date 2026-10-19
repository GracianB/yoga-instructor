/* Yoga Apps V1 · shared deterministic practice models; DOM-free, reusable by both apps. */
export const BREATH_PATTERNS=Object.freeze([
 Object.freeze({id:"natural",name:"4 · 6",inhale:4,hold:0,exhale:6,rest:0,ease:true,description:"Sin retenciones"}),
 Object.freeze({id:"444",name:"4 · 4 · 4",inhale:4,hold:4,exhale:4,rest:0,description:"Inhala · Mantén · Exhala"}),
 Object.freeze({id:"478",name:"4 · 7 · 8",inhale:4,hold:7,exhale:8,rest:0,description:"Ritmo avanzado, siempre opcional"}),
 Object.freeze({id:"369",name:"3 · 6 · 9",inhale:3,hold:6,exhale:9,rest:0,description:"Exhalación prolongada"}),
 Object.freeze({id:"4444",name:"4 · 4 · 4 · 4",inhale:4,hold:4,exhale:4,rest:4,description:"Respiración cuadrada completa"})
]);
const freezeDeep=a=>Object.freeze(a.map(x=>Object.freeze(x)));
export const MOVEMENT_STEPS=freezeDeep([
 {id:"mountain",seconds:75,pose:"mountain",title:{es:"01 · Montaña",en:"01 · Mountain"},cue:{es:"Pies firmes, rodillas suaves, columna larga. Reparte el peso y afloja los hombros.",en:"Stand grounded, keep knees soft, lengthen the spine and relax the shoulders."},support:{es:"Puedes apoyarte en una pared.",en:"You can use a wall for support."}},
 {id:"fold",seconds:75,pose:"fold",title:{es:"02 · Flexión suave",en:"02 · Gentle fold"},cue:{es:"Flexiona las rodillas y deja que el torso descienda desde las caderas, sin buscar el suelo.",en:"Bend your knees and hinge at the hips, without trying to reach the floor."},support:{es:"Apoya las manos sobre una silla o bloques.",en:"Rest your hands on a chair or blocks."}},
 {id:"child",seconds:90,pose:"child",title:{es:"03 · Postura del niño",en:"03 · Child’s pose"},cue:{es:"Lleva el peso suavemente atrás, descansa el torso y respira a tu ritmo.",en:"Shift gently back, rest your torso and breathe naturally."},support:{es:"Una almohada bajo el torso ayuda; también puedes descansar sentado.",en:"A pillow under the torso may help; you can also rest seated."}}
]);
export const BOOK_POSES=freezeDeep([
 {id:"mountain",pose:"mountain",category:"standing",name:{es:"Montaña",en:"Mountain"},sanskrit:"Tadasana",cue:{es:"Siente el apoyo de los pies y alarga la columna.",en:"Feel both feet grounded and lengthen the spine."},support:{es:"Usa una pared si buscas estabilidad.",en:"Use a wall for stability."}},
 {id:"tree",pose:"tree",category:"standing",name:{es:"Árbol",en:"Tree"},sanskrit:"Vrksasana",cue:{es:"Equilibra el peso en un pie sin bloquear la rodilla.",en:"Balance on one foot without locking the knee."},support:{es:"Mantén la punta del otro pie en el suelo o usa una pared.",en:"Keep the other toes grounded or use a wall."}},
 {id:"warrior",pose:"warrior",category:"standing",name:{es:"Guerrero II",en:"Warrior II"},sanskrit:"Virabhadrasana II",cue:{es:"Flexiona la rodilla delantera y abre los brazos a una altura cómoda.",en:"Bend the front knee and open the arms at a comfortable height."},support:{es:"Acorta la zancada si lo necesitas.",en:"Shorten your stance if needed."}},
 {id:"fold",pose:"fold",category:"fold",name:{es:"Flexión hacia delante",en:"Forward fold"},sanskrit:"Uttanasana",cue:{es:"Flexiona las rodillas y pliega desde las caderas.",en:"Soften your knees and hinge from your hips."},support:{es:"Deja las manos en muslos, silla o bloques.",en:"Place hands on thighs, a chair or blocks."}},
 {id:"easy",pose:"seated",category:"seated",name:{es:"Postura fácil",en:"Easy seat"},sanskrit:"Sukhasana",cue:{es:"Siéntate sobre los isquiones y permite respirar sin rigidez.",en:"Sit comfortably with a tall, relaxed spine."},support:{es:"Una manta doblada bajo la pelvis puede ayudar.",en:"A folded blanket under the hips may help."}},
 {id:"child",pose:"child",category:"rest",name:{es:"Postura del niño",en:"Child’s pose"},sanskrit:"Balasana",cue:{es:"Desciende hasta encontrar un descanso cómodo; no fuerces las rodillas.",en:"Lower into a comfortable rest without forcing the knees."},support:{es:"Pon un cojín bajo el pecho o descansa sentado.",en:"Support your chest with a pillow, or rest seated."}}
,
 {id:"triangle",pose:"triangle",category:"standing",name:{es:"Triángulo",en:"Triangle"},sanskrit:"Trikonasana",cue:{es:"Abre el pecho y alarga ambos costados sin forzar el cuello.",en:"Open the chest and lengthen both sides without straining your neck."},support:{es:"La mano puede descansar en la espinilla o sobre un bloque.",en:"Rest your hand on your shin or a yoga block."}},
 {id:"downward",pose:"downward",category:"fold",name:{es:"Perro boca abajo",en:"Downward-facing dog"},sanskrit:"Adho Mukha Svanasana",cue:{es:"Reparte el peso entre manos y pies con las rodillas flexionadas si lo necesitas.",en:"Share your weight between hands and feet; bend your knees when needed."},support:{es:"Apoya las manos en una pared o una silla estable para reducir la carga.",en:"Place your hands on a wall or a sturdy chair to reduce the load."}},
 {id:"butterfly",pose:"butterfly",category:"seated",name:{es:"Mariposa",en:"Butterfly"},sanskrit:"Baddha Konasana",cue:{es:"Junta las plantas de los pies, siéntate erguido y deja descansar las rodillas.",en:"Bring the soles together, sit tall and let your knees relax."},support:{es:"Coloca cojines bajo las rodillas; evita empujarlas hacia el suelo.",en:"Support your knees with cushions. Never press them to the floor."}},
 {id:"sphinx",pose:"sphinx",category:"rest",name:{es:"Esfinge suave",en:"Gentle sphinx"},sanskrit:"Salamba Bhujangasana",cue:{es:"Boca abajo, apoya los antebrazos y alarga suavemente el pecho hacia delante.",en:"Lie on your front, rest on forearms and gently lengthen the chest forward."},support:{es:"Usa una manta bajo el abdomen o reduce la extensión si notas presión lumbar.",en:"Use a blanket under the belly or lower the stretch if the lower back feels compressed."}}

]);
export const GUIDED_VIDEOS=freezeDeep([
 {minutes:5,title:"Mindfulness 5 minutos",channel:"Meditación3",url:"https://www.youtube.com/watch?v=0sjVoX5ASwg"},
 {minutes:10,title:"Meditación guiada de 10 minutos",channel:"Meditación3",url:"https://www.youtube.com/watch?v=Q3zncqKCiEQ"},
 {minutes:15,title:"Meditación de la mañana · 15 minutos",channel:"Meditación3",url:"https://www.youtube.com/watch?v=rFLXCWOjb_Y"}
]);

export const between=(n,a,b)=>Math.max(a,Math.min(b,n));
const ease=t=>{const x=between(t,0,1);return x*x*(3-2*x);};
export const sumMovementSeconds=()=>MOVEMENT_STEPS.reduce((s,p)=>s+p.seconds,0);
export function movementFrame(elapsedSeconds){
 if(!Number.isFinite(elapsedSeconds)||elapsedSeconds<0)throw new RangeError("Invalid elapsed time");
 const total=sumMovementSeconds(),t=between(elapsedSeconds,0,total);
 let prior=0;
 for(let index=0;index<MOVEMENT_STEPS.length;index++){
  const item=MOVEMENT_STEPS[index],end=prior+item.seconds;
  if(t<end || index===MOVEMENT_STEPS.length-1){
   const inside=between(t-prior,0,item.seconds);
   return Object.freeze({index,item,elapsed:inside,remaining:Math.max(0,item.seconds-inside),progress:inside/item.seconds,totalProgress:t/total,finished:t>=total});
  }
  prior=end;
 }
}
export function breathFrame(elapsedSeconds,id="natural"){
 if(!Number.isFinite(elapsedSeconds)||elapsedSeconds<0)throw new RangeError("Invalid elapsed time");
 const p=BREATH_PATTERNS.find(x=>x.id===id)||BREATH_PATTERNS[0];
 const cycle=p.inhale+p.hold+p.exhale+p.rest;
 const t=elapsedSeconds%cycle;
 const parts=[["inhale",p.inhale],["hold",p.hold],["exhale",p.exhale],["rest",p.rest]];
 let start=0;
 for(const [phase,length]of parts){
  if(!length)continue;
  if(t<start+length){
   const fraction=between((t-start)/length,0,1);
   // During breath holds the body stops changing size; no forced motion.
   const expansion=phase==="inhale"?ease(fraction):phase==="hold"?1:phase==="exhale"?1-ease(fraction):0;
   return Object.freeze({pattern:p,phase,remaining:start+length-t,progress:fraction,cycle,expansion,cycleProgress:t/cycle});
  }
  start+=length;
 }
 throw Error("Breath phases do not sum to the cycle duration");
}
export class SessionClock{
 constructor(now=()=>performance.now()){this.now=now;this.reset(300);}
 reset(seconds=300){if(!Number.isFinite(seconds)||seconds<=0||seconds>7200)throw new RangeError("Invalid session duration");this.duration=seconds;this.elapsedBefore=0;this.startedAt=null;this.status="idle";return this.snapshot();}
 start(){this.elapsedBefore=0;this.status="running";this.startedAt=this.now();return this.snapshot();}
 pause(){if(this.status==="running"){this.elapsedBefore=this.snapshot().elapsed;this.startedAt=null;this.status=this.elapsedBefore>=this.duration?"finished":"paused";}return this.snapshot();}
 resume(){if(this.status==="paused"){this.startedAt=this.now();this.status="running";}return this.snapshot();}
 snapshot(){
  const current=this.status==="running"?this.elapsedBefore+Math.max(0,(this.now()-this.startedAt)/1000):this.elapsedBefore;
  const elapsed=between(current,0,this.duration);
  if(this.status==="running"&&elapsed>=this.duration){this.status="finished";this.elapsedBefore=this.duration;this.startedAt=null;}
  return Object.freeze({elapsed,remaining:this.duration-elapsed,progress:elapsed/this.duration,status:this.status,duration:this.duration});
 }
}
