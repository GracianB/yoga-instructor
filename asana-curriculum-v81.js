/* V81 · Original yoga learning taxonomy. Pure data, no independent clock. */
(function(global){
"use strict";
const families=Object.freeze({
 standing:Object.freeze({es:"De pie y equilibrio",en:"Standing and balance",intent:["Base, pies y orientación del peso.","Grounding, feet and weight distribution."]}),
 seated:Object.freeze({es:"Caderas y columna",en:"Hips and spine",intent:["Sentarse, inclinarse y girar sin forzar.","Sit, fold and turn without forcing."]}),
 restorative:Object.freeze({es:"Pausa y recuperación",en:"Rest and recovery",intent:["Opciones tranquilas con apoyos adaptables.","Unhurried options with adaptable supports."]})
});
const idFamilies=Object.freeze({
 "d24-mountain":"standing","d24-downward":"standing","d24-butterfly":"seated",
 "v68-warrior-ii":"standing","v68-tree":"standing","v68-triangle":"standing",
 "v68-easy-seat":"seated","v68-twist":"seated","v68-seated-fold":"seated",
 "v68-child":"restorative","v68-forward-fold":"standing","v68-gratitude":"restorative"
});
const learn=Object.freeze({
 roots:Object.freeze({name:["Enraizar","Find your base"],intro:["Tres aproximaciones a los apoyos.","Three ways to explore grounding."],
 poses:Object.freeze(["d24-mountain","v68-warrior-ii","v68-tree"])}),
 mobility:Object.freeze({name:["Movilidad amable","Gentle mobility"],intro:["De sentado a movimiento consciente.","From a seat to mindful movement."],
 poses:Object.freeze(["v68-easy-seat","v68-twist","d24-butterfly"])}),
 restore:Object.freeze({name:["Descanso activo","Active rest"],intro:["Pausar y volver con intención.","Rest and return with intention."],
 poses:Object.freeze(["v68-child","v68-gratitude","d24-mountain"])})
});
function family(pose){return idFamilies[typeof pose==="string"?pose:pose?.id]||null}
function route(id){return learn[id]||null}
function search(poses,query,language="es"){
const index=language==="en"?1:0;
const normalized=String(query||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
if(!normalized)return poses.slice();
return poses.filter(p=>[...p.name,...p.cue,...p.support].some(x=>x.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(normalized)));
}
const api=Object.freeze({families,idFamilies,learn,family,route,search});
if(global)global.YOGA_CURRICULUM_V81=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
