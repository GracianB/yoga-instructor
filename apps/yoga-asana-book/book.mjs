import {BOOK_POSES} from "../shared/core.mjs";
import {createFigure,setFigurePose,setFigureBreath} from "../shared/figure.mjs";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let lang="es",category="all",selected=BOOK_POSES[0].id;
const figure=createFigure($("#figure-root"),{pose:selected,label:"Postura vectorial de yoga"});
setFigureBreath(figure,.42);
const names={standing:{es:"DE PIE",en:"STANDING"},fold:{es:"FLEXIÓN",en:"FOLD"},seated:{es:"SENTADO",en:"SEATED"},rest:{es:"DESCANSO",en:"REST"}};
function translate(next){
 lang=next==="en"?"en":"es";document.documentElement.lang=lang;
 for(const el of $$("[data-es][data-en]")){
  const val=el.getAttribute("data-"+lang);
  if(val.includes("<br>"))el.innerHTML=val;else el.textContent=val;
 }
 for(const btn of $$("[data-lang]"))btn.setAttribute("aria-pressed",String(btn.dataset.lang===lang));
 populate();showPose();
}
function visible(){return BOOK_POSES.filter(p=>category==="all"||p.category===category);}
function populate(){
 const list=$("#pose-list");list.replaceChildren();
 visible().forEach(p=>{
  const btn=document.createElement("button");btn.type="button";btn.dataset.poseId=p.id;
  btn.setAttribute("aria-pressed",String(selected===p.id));
  const ordinal=document.createElement("span");ordinal.className="ordinal";ordinal.textContent=String(BOOK_POSES.indexOf(p)+1).padStart(2,"0");
  const body=document.createElement("span");const strong=document.createElement("strong");strong.textContent=p.name[lang];
  const small=document.createElement("small");small.textContent=p.sanskrit;
  body.append(strong,small);const arrow=document.createElement("span");arrow.className="arrow";arrow.textContent="↗";
  btn.append(ordinal,body,arrow);
  btn.addEventListener("click",()=>choose(p.id));list.append(btn);
 });
}
function choose(id){
 if(!BOOK_POSES.some(p=>p.id===id))return;
 selected=id;populate();showPose();
}
function showPose(){
 const p=BOOK_POSES.find(p=>p.id===selected);
 $("#pose-id").textContent="ASANA / "+String(BOOK_POSES.indexOf(p)+1).padStart(2,"0");
 $("#pose-kind").textContent=names[p.category][lang];
 $("#pose-name").textContent=p.name[lang];
 $("#pose-sanskrit").textContent=p.sanskrit;
 $("#pose-cue").textContent=p.cue[lang];
 $("#pose-support").textContent=p.support[lang];
 setFigurePose(figure,p.pose);
 figure.setAttribute("aria-label",p.name[lang]+": ilustración estilizada");
 const index=visible().findIndex(x=>x.id===p.id);
 $("#previous").disabled=index<=0;$("#next").disabled=index===visible().length-1;
}
function next(delta){
 const list=visible(),idx=list.findIndex(p=>p.id===selected);
 if(idx+delta>=0&&idx+delta<list.length)choose(list[idx+delta].id);
}
for(const b of $$("[data-category]")){
 b.addEventListener("click",()=>{
  category=b.dataset.category;
  $$("[data-category]").forEach(el=>el.setAttribute("aria-pressed",String(el===b)));
  if(!visible().some(p=>p.id===selected))selected=visible()[0].id;
  populate();showPose();
 });
}
for(const b of $$("[data-lang]"))b.addEventListener("click",()=>translate(b.dataset.lang));
$("#previous").addEventListener("click",()=>next(-1));
$("#next").addEventListener("click",()=>next(1));
translate("es");
