import {BOOK_POSES} from "../shared/core.mjs";
import {createFigure,setFigurePose,setFigureBreath} from "../shared/figure.mjs";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const initialParams=new URLSearchParams(location.search);
const sharedPose=initialParams.get("pose");
let lang="es",category="all",selected=BOOK_POSES.find(p=>p.id===sharedPose)?.id||BOOK_POSES[0].id;
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
 $(".bar-right>a").href="../yoga-practice/"+(lang==="en"?"?lang=en":"");
 const url=new URL(location.href);
 if(lang==="en")url.searchParams.set("lang","en");else url.searchParams.delete("lang");
 history.replaceState(null,"",url.pathname+url.search+url.hash);
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
 selected=id;
 // Direct links remain shareable without exposing invalid identifiers.
 const url=new URL(location.href);
 url.searchParams.set("pose",selected);
 history.replaceState(null,"",url.pathname+url.search+url.hash);
 showPose();
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
 const list=visible(),index=list.findIndex(x=>x.id===p.id);
 for(const button of $$("#pose-list button")){
  const active=button.dataset.poseId===selected;
  button.setAttribute("aria-pressed",String(active));
  if(active)button.setAttribute("aria-current","true");else button.removeAttribute("aria-current");
 }
 $("#previous").disabled=index<=0;$("#next").disabled=index===list.length-1;
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
  const url=new URL(location.href);
  url.searchParams.set("pose",selected);
  history.replaceState(null,"",url.pathname+url.search+url.hash);
  populate();showPose();
 });
}
for(const b of $$("[data-lang]"))b.addEventListener("click",()=>translate(b.dataset.lang));
$("#previous").addEventListener("click",()=>next(-1));
$("#next").addEventListener("click",()=>next(1));
$("#pose-list").addEventListener("keydown",event=>{
 if(!["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
 const list=visible(),target=event.target.closest("button[data-pose-id]");
 if(!target)return;
 event.preventDefault();
 const at=list.findIndex(p=>p.id===target.dataset.poseId);
 const index=event.key==="Home"?0:event.key==="End"?list.length-1:(at+(["ArrowDown","ArrowRight"].includes(event.key)?1:-1)+list.length)%list.length;
 choose(list[index].id);
 $("#pose-list").querySelector('[data-pose-id="'+list[index].id+'"]').focus();
});
window.addEventListener("popstate",()=>{
 const params=new URLSearchParams(location.search);
 const pose=BOOK_POSES.find(p=>p.id===params.get("pose"));
 if(pose){category="all";$$("[data-category]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.category==="all")));selected=pose.id;}
 translate(params.get("lang"));
});
translate(initialParams.get("lang"));
