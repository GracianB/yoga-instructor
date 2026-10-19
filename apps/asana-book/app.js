/* Yoga Asana Book: original authored geometry and bilingual coaching. */
(()=>{
"use strict";
const root=document.getElementById("asana-app"),domain=window.YOGA_ASANA_DOMAIN;
if(!root||!domain?.lessons?.length||!domain.drawing){const e=document.getElementById("asana-status");if(e)e.textContent="No se pudo cargar el catálogo de asanas.";return}
const $=s=>root.querySelector(s);
const ui={list:$("#asana-list"),query:$("#asana-search"),filters:[...root.querySelectorAll("[data-filter]")],count:$("#asana-count"),category:$("#asana-category"),stage:$("#asana-stage"),name:$("#asana-name"),cue:$("#asana-cue"),setup:$("#asana-setup"),breath:$("#asana-breath"),exit:$("#asana-exit"),support:$("#asana-support"),previous:$("#asana-previous"),next:$("#asana-next"),status:$("#asana-status"),language:$("#switch-language"),theme:$("#switch-theme")};
const lessons=domain.lessons,kinds={mountain:"standing",downward:"standing",butterfly:"seated"};
const categoryOf=p=>p.category||kinds[p.kind]||"restorative";
const copy={
 es:{all:"Todas",standing:"De pie",seated:"Sentadas",restorative:"Descanso",empty:"No hay posturas con esos filtros.",search:"Buscar postura",shown:n=>n+" / "+lessons.length,support:"Apoyo",stage:"Diagrama de",selected:"Postura seleccionada"},
 en:{all:"All",standing:"Standing",seated:"Seated",restorative:"Restorative",empty:"No postures match these filters.",search:"Search postures",shown:n=>n+" / "+lessons.length,support:"Support",stage:"Diagram of",selected:"Selected posture"}
};
let lang="es",filter="all",query="",activeId=lessons[0].id;
const index=()=>lang==="es"?0:1;
const t=()=>copy[lang];
const norm=text=>String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();
const filtered=()=>lessons.filter(lesson=>{
 if(filter!=="all"&&categoryOf(lesson)!==filter)return false;
 return norm([...lesson.name,...lesson.cue,...lesson.support].join(" ")).includes(norm(query.trim()));
});
const NS="http://www.w3.org/2000/svg";
function svgElement(tag,attrs={}){
 const el=document.createElementNS(NS,tag);
 for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));
 return el;
}
const circle=(x,y,r,klass)=>svgElement("circle",{cx:x,cy:y,r,class:klass});
function paint(id){
 const d=domain.drawing(id);
 ui.stage.replaceChildren();if(!d)return;
 const svg=svgElement("svg",{viewBox:"0 0 720 430",xmlns:NS,"aria-hidden":"true",focusable:"false"});
 svg.append(svgElement("path",{d:"M66 394H654",class:"stage-floor"}));
 // Limbs follow the 12 original independently-authored SVG path definitions.
 for(const path of [...d.legs,...d.arms])svg.append(svgElement("path",{d:path,class:"stage-limb"}));
 const [bx,by,rx,ry,angle]=d.body;
 svg.append(svgElement("ellipse",{cx:bx,cy:by,rx,ry,transform:"rotate("+(angle||0)+" "+bx+" "+by+")",class:"stage-body"}));
 const [hx,hy,scale]=d.head;
 svg.append(circle(hx,hy,Math.max(15,40*(Number(scale)||1)),"stage-head"));
 for(const [x,y]of [...d.hands,...d.feet])svg.append(circle(x,y,8,"stage-joint"));
 ui.stage.append(svg);
}
function empty(){
 ui.stage.replaceChildren();ui.name.textContent=t().empty;
 for(const field of ["cue","setup","breath","exit","support"])ui[field].textContent="";
 ui.category.textContent="—";ui.stage.setAttribute("aria-label",t().empty);
 ui.previous.disabled=true;ui.next.disabled=true;
}
function renderDetail(){
 const p=activeId?domain.lesson(activeId):null;
 if(!p){empty();return}
 const i=index(),list=filtered(),position=list.findIndex(x=>x.id===activeId);
 ui.name.textContent=p.name[i];ui.cue.textContent=p.cue[i];
 ui.support.textContent=t().support+": "+p.support[i];
 ui.setup.textContent=p.coaching.setup[i];
 ui.breath.textContent=p.coaching.breath[i];
 ui.exit.textContent=p.coaching.exit[i];
 ui.category.textContent=t()[categoryOf(p)];
 ui.stage.setAttribute("aria-label",t().stage+" "+p.name[i]);
 paint(p.id);
 ui.previous.disabled=position<=0;
 ui.next.disabled=position===list.length-1||position<0;
 for(const b of ui.list.querySelectorAll("[data-asana-id]"))b.setAttribute("aria-current",String(b.dataset.asanaId===activeId));
}
function renderList(){
 const items=filtered();
 ui.count.textContent=t().shown(items.length);
 if(!items.some(p=>p.id===activeId))activeId=items[0]?.id||null;
 const fragment=document.createDocumentFragment();
 items.forEach((p,i)=>{
  const row=document.createElement("div");row.setAttribute("role","listitem");
  const button=document.createElement("button");
  button.type="button";button.className="asana-item";
  button.dataset.asanaId=p.id;button.setAttribute("aria-current",String(p.id===activeId));
  const number=document.createElement("span");number.className="number";number.textContent=String(i+1).padStart(2,"0");
  const label=document.createElement("span");
  const title=document.createElement("b");title.textContent=p.name[index()];
  const category=document.createElement("small");category.textContent=t()[categoryOf(p)];
  label.append(title,category);
  const arrow=document.createElement("span");arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");
  button.append(number,label,arrow);
  button.addEventListener("click",()=>{activeId=p.id;renderDetail();ui.status.textContent=t().selected+": "+p.name[index()]});
  row.append(button);fragment.append(row);
 });
 if(!items.length){const p=document.createElement("p");p.className="asana-empty";p.textContent=t().empty;fragment.append(p)}
 ui.list.replaceChildren(fragment);
 renderDetail();
}
function move(step){
 const list=filtered(),i=list.findIndex(p=>p.id===activeId),next=i+step;
 if(next<0||next>=list.length)return;
 activeId=list[next].id;renderDetail();
 ui.list.querySelector('[data-asana-id="'+activeId+'"]')?.scrollIntoView({block:"nearest"});
 ui.status.textContent=t().selected+": "+domain.lesson(activeId).name[index()];
}
ui.previous.addEventListener("click",()=>move(-1));
ui.next.addEventListener("click",()=>move(1));
ui.query.addEventListener("input",()=>{query=ui.query.value;renderList();ui.status.textContent=""});
ui.filters.forEach(b=>b.addEventListener("click",()=>{
 filter=b.dataset.filter;ui.filters.forEach(el=>el.setAttribute("aria-pressed",String(el===b)));
 renderList();ui.status.textContent="";
}));
ui.language.addEventListener("click",()=>{
 lang=lang==="es"?"en":"es";document.documentElement.lang=lang;
 ui.language.textContent=lang==="es"?"EN":"ES";
 ui.language.setAttribute("aria-label",lang==="es"?"Cambiar idioma a inglés":"Switch language to Spanish");
 ui.query.placeholder=t().search;ui.query.setAttribute("aria-label",t().search);
 document.title=lang==="es"?"Yoga Asana Book · 12 posturas":"Yoga Asana Book · 12 postures";
 renderList();ui.status.textContent="";
});
ui.theme.addEventListener("click",()=>{
 const dark=document.body.dataset.theme!=="dark";
 document.body.dataset.theme=dark?"dark":"light";
 ui.theme.setAttribute("aria-pressed",String(dark));ui.theme.textContent=dark?"☀":"☾";
});
root.addEventListener("keydown",event=>{
 if(event.target instanceof HTMLInputElement||event.target instanceof HTMLButtonElement)return;
 if(event.key==="ArrowLeft"){event.preventDefault();move(-1)}
 if(event.key==="ArrowRight"){event.preventDefault();move(1)}
});
renderList();
})();