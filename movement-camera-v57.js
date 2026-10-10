/* V57: camera framing for Nila. Pose-authored bounds, one SVG, no duplicate rig.
   The Flow engine owns phase timing. Only its 'pose-ready' event moves this camera. */
(() => {
 "use strict";
 const root=document.getElementById("flow-guide");
 const svg=root?.querySelector("svg.yy-svg");
 if(!root||!svg)return;
 const fallback="62 -4 618 440";
 let frame=0;
 const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
 const fixed=()=>root.dataset.status==="running"||root.dataset.status==="paused"||
   root.dataset.status==="finished"||
   (typeof window.matchMedia==="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
 const compute=()=>{
   if(fixed()){svg.setAttribute("viewBox",fallback);return;}
   const figure=root.querySelector(".yy-pose.is-current .movement-guardian");
   if(!figure||typeof figure.getBBox!=="function"){
     svg.setAttribute("viewBox",fallback);return;
   }
   let b;
   try{b=figure.getBBox();}catch(_){svg.setAttribute("viewBox",fallback);return;}
   if(![b.x,b.y,b.width,b.height].every(Number.isFinite)||b.width<40||b.height<55){
     svg.setAttribute("viewBox",fallback);return;
   }
   const ratio=618/440;
   const horizontalPad=58,verticalPad=52;
   const w=clamp(Math.max(b.width+horizontalPad,(b.height+verticalPad)*ratio),438,618);
   const h=w/ratio;
   // In unusually wide poses, the previous safe camera is preferable
   // to cropping the horns, toes or outstretched arms.
   if(b.width+26>w||b.height+26>h){
     svg.setAttribute("viewBox",fallback);return;
   }
   const x=clamp(b.x+b.width/2-w/2,8,720-w);
   const y=clamp(b.y+b.height/2-h/2,-35,462-h);
   if(b.x<x+13||b.x+b.width>x+w-13||b.y<y+13||b.y+b.height>y+h-13){
     svg.setAttribute("viewBox",fallback);return;
   }
   const view=[x,y,w,h].map(n=>n.toFixed(2)).join(" ");
   if(svg.getAttribute("viewBox")!==view)svg.setAttribute("viewBox",view);
 };
 const schedule=()=>{
   // Browsers without optional animation APIs still get correct framing.
   if(typeof requestAnimationFrame!=="function"){compute();return;}
   if(frame&&typeof cancelAnimationFrame==="function")cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{frame=0;compute();});
 };
 window.addEventListener("yoga:pose-ready",schedule);
 // The session starts before its first transition: lock one physical camera
 // for all ten phases, preventing any planted paws from sliding on screen.
 window.addEventListener("yoga:flow",()=>{
   if(fixed()){
     if(frame&&typeof cancelAnimationFrame==="function")cancelAnimationFrame(frame);
     frame=0;svg.setAttribute("viewBox",fallback);
   }else schedule();
 });
 window.addEventListener("resize",schedule,{passive:true});
 // Flow emits its initial ready event before this defer-loaded module.
 schedule();
 window.addEventListener("pagehide",()=>{if(frame&&typeof cancelAnimationFrame==="function")cancelAnimationFrame(frame);});
})();
