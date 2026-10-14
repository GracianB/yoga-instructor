/* Breath companion is opt-in, scoped to Breath, with compact floating view. */
(()=>{"use strict";
function init(){const dock=document.querySelector('.sanctuary-dock'),root=document.getElementById('instructor-flow'),guided=document.getElementById('studio-guided');if(!dock||!root||!guided)return false;
const entry=document.createElement('div');entry.className='breath-extension-entry';entry.innerHTML='<button type="button" class="breath-extension-open" aria-expanded="false"></button><p></p>';guided.querySelector('.studio-guided-controls')?.after(entry);
const toolbar=document.createElement('div');toolbar.className='breath-extension-toolbar';toolbar.innerHTML='<button type="button" data-companion="minimize"></button><button type="button" data-companion="close"></button>';dock.prepend(toolbar);dock.classList.add('breath-extension');dock.hidden=true;
const open=entry.querySelector('button');let enabled=false,small=false;
const en=()=>document.documentElement.lang==='en';
function paint(){entry.hidden=root.dataset.studioMode!=='breath';open.textContent=enabled?(en()?'Show breathing companion':'Mostrar respiración'):(en()?'Activate breathing companion':'Activar respiración');open.setAttribute('aria-expanded',String(enabled&&!small));entry.querySelector('p').textContent=en()?'Optional floating guide. Minimize it while exploring the page.':'Guía flotante opcional. Puedes minimizarla mientras exploras la página.';toolbar.querySelector('[data-companion="minimize"]').textContent=small?(en()?'Expand':'Ampliar'):(en()?'Minimize':'Minimizar');toolbar.querySelector('[data-companion="close"]').textContent=en()?'Close':'Cerrar';dock.hidden=!enabled;dock.classList.toggle('is-minimized',small);}
const transport=guided.querySelector('[data-studio-action="primary"]');
const breathControl=dock.querySelector('.sanctuary-breath');
// The companion follows the selected Breath session, never the legacy 19-second timer.
breathControl.addEventListener('click',event=>{event.stopImmediatePropagation();if(root.dataset.studioMode==='breath')transport?.click();},true);
function syncSession(){if(root.dataset.studioMode!=='breath')return;
const label=guided.querySelector('#studio-breath-phase-detail')?.textContent;
const phase=dock.querySelector('#breath-phase'),time=dock.querySelector('.breath-time');
if(phase)phase.textContent=label|| (en()?'Ready to breathe':'Listo para respirar');
if(time)time.textContent=guided.querySelector('.studio-guided-countdown')?.textContent||'';
breathControl.setAttribute('aria-pressed',String(guided.dataset.studioStatus==='running'));
dock.dataset.sessionPhase=guided.dataset.breathPhase||'rest';
const ring=dock.querySelector('.breath-ring-fill');if(ring)ring.style.transform='scale('+(guided.style.getPropertyValue('--studio-breath-scale')||'1')+')';}
new MutationObserver(syncSession).observe(guided,{attributes:true,childList:true,subtree:true});
open.addEventListener('click',()=>{enabled=true;small=false;paint();if(!['running','paused'].includes(guided.dataset.studioStatus))transport?.click();syncSession();});
toolbar.addEventListener('click',event=>{const action=event.target.closest('[data-companion]')?.dataset.companion;if(action==='minimize'){small=!small;paint()}if(action==='close'){enabled=false;small=false;const control=dock.querySelector('.sanctuary-breath');if(root.dataset.studioMode==='breath'&&guided.dataset.studioStatus==='running')transport?.click();paint();open.focus();}});
new MutationObserver(paint).observe(root,{attributes:true,attributeFilter:['data-studio-mode']});new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});paint();return true;}
if(!init()){const observer=new MutationObserver(()=>{if(init())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true});}
})();
