/* P5 · V105 — magia de Uma y consola sin solapes. Sin sonido ni autoarranque. */
(() => {
 "use strict";
 const NS="http://www.w3.org/2000/svg";
 const MAGIC='<radialGradient id="v105-aura-grad"><stop offset="0" stop-color="#efe6ff" stop-opacity=".95"/>'+
  '<stop offset=".55" stop-color="#a48bf2" stop-opacity=".38"/><stop offset="1" stop-color="#b9a6ff" stop-opacity="0"/></radialGradient>';
 function sparks(r,n,size){let s="";for(let i=0;i<n;i++){const a=i/n*Math.PI*2;
  s+='<circle class="v105-spark" cx="'+(280+Math.cos(a)*r).toFixed(1)+'" cy="'+(238+Math.sin(a)*r*.8).toFixed(1)+'" r="'+size+'"/>';}return s}
 function enchant(svg){
  if(!svg||svg.querySelector(".v105-magic"))return false;
  const defs=svg.querySelector("defs")||svg.insertBefore(document.createElementNS(NS,"defs"),svg.firstChild);
  defs.insertAdjacentHTML("beforeend",MAGIC);
  const g=document.createElementNS(NS,"g");
  g.setAttribute("class","v105-magic");g.setAttribute("aria-hidden","true");
  g.innerHTML='<ellipse class="v105-aura" cx="280" cy="238" rx="190" ry="150" fill="url(#v105-aura-grad)"/>'+
   '<ellipse class="v105-ring" cx="280" cy="238" rx="176" ry="140"/>'+
   '<ellipse class="v105-ring is-inner" cx="280" cy="238" rx="150" ry="118"/>'+
   '<g class="v105-orbit">'+sparks(168,8,3.6)+'</g><g class="v105-orbit is-b">'+sparks(128,6,2.8)+'</g>'+
   '<g class="v105-rises"><circle class="v105-rise" cx="232" cy="330" r="2.4"/><circle class="v105-rise" cx="330" cy="322" r="2"/><circle class="v105-rise" cx="282" cy="340" r="1.8"/></g>';
  // Detrás de Uma: justo después de la luna (o de defs).
  const moon=svg.querySelector(".uma-moon");
  svg.insertBefore(g,moon?moon.nextSibling:defs.nextSibling);
  // Unas pocas estrellas por delante, para que la magia se vea sobre las alas.
  const front=document.createElementNS(NS,"g");
  front.setAttribute("class","v105-magic v105-front");front.setAttribute("aria-hidden","true");
  const star=(x,y,k)=>'<path class="v105-star" transform="translate('+x+' '+y+') scale('+k+')" d="M0 -10Q1.6 -1.6 10 0Q1.6 1.6 0 10Q-1.6 1.6 -10 0Q-1.6 -1.6 0 -10Z"/>';
  front.innerHTML=star(150,120,.9)+star(420,150,.7)+star(130,300,.6)+star(440,290,.85)+star(300,70,.55);
  svg.appendChild(front);
  return true;
 }
 function scan(){document.querySelectorAll("#instructor-flow .meditation-guardian").forEach(enchant)}
 function watchConsole(){
  const target=document.querySelector("#instructor-flow");
  if(!target||!("IntersectionObserver" in window))return;
  new IntersectionObserver(entries=>{for(const e of entries)
   document.body.dataset.v105Console=e.isIntersecting?"in-view":"away";},{threshold:.15}).observe(target);
 }
 function init(){
  scan();watchConsole();
  const root=document.querySelector("#instructor-flow");
  if(root)new MutationObserver(()=>scan()).observe(root,{attributes:true,attributeFilter:["data-studio-mode"]});
  window.YOGA_PRACTICE_POLISH_V105={version:"v105",enchant,scan};
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
