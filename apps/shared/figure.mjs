/* Shared articulated silhouette. Same restrained human style in all modes and Asana Book. */
const SHAPES=Object.freeze({
 mountain:{head:[210,100],torso:"M210 140Q211 201 210 270",leftArm:"M177 159Q158 199 151 278",rightArm:"M243 159Q263 201 270 278",leftLeg:"M196 270Q189 325 184 367",rightLeg:"M224 270Q232 327 237 367",leftHand:[151,278],rightHand:[270,278],leftFoot:[172,367],rightFoot:[249,367]},
 fold:{head:[139,218],torso:"M160 236Q193 216 235 259",leftArm:"M166 248Q150 282 139 333",rightArm:"M178 252Q192 289 184 329",leftLeg:"M226 260Q231 314 224 370",rightLeg:"M245 260Q261 315 260 370",leftHand:[139,333],rightHand:[184,329],leftFoot:[212,370],rightFoot:[273,370]},
 child:{head:[139,293],torso:"M163 301Q218 279 286 281",leftArm:"M170 319Q134 340 106 363",rightArm:"M192 326Q160 349 145 375",leftLeg:"M280 281Q318 313 291 349",rightLeg:"M291 280Q338 296 342 349",leftHand:[106,363],rightHand:[145,375],leftFoot:[300,367],rightFoot:[351,362]},
 tree:{head:[210,105],torso:"M210 144Q212 215 211 266",leftArm:"M178 164Q150 116 192 80",rightArm:"M242 164Q270 116 228 80",leftLeg:"M197 266Q192 328 190 367",rightLeg:"M222 266Q270 260 239 300Q226 318 210 303",leftHand:[192,80],rightHand:[228,80],leftFoot:[179,367],rightFoot:[208,303]},
 warrior:{head:[209,103],torso:"M210 141Q210 206 210 258",leftArm:"M174 160Q117 162 81 162",rightArm:"M245 160Q300 162 340 162",leftLeg:"M197 261Q147 288 135 318Q134 342 134 366",rightLeg:"M225 261Q276 287 318 366",leftHand:[81,162],rightHand:[340,162],leftFoot:[122,366],rightFoot:[330,366]},
 seated:{head:[210,131],torso:"M210 169Q207 226 210 280",leftArm:"M179 183Q159 246 153 290",rightArm:"M241 183Q261 246 267 290",leftLeg:"M195 279Q152 310 119 336",rightLeg:"M225 279Q268 310 301 336",leftHand:[153,290],rightHand:[267,290],leftFoot:[114,337],rightFoot:[306,337]},
 triangle:{head:[152,159],torso:"M174 191Q216 216 248 230",leftArm:"M186 196Q157 244 144 322",rightArm:"M208 182Q268 141 308 108",leftLeg:"M238 235Q184 295 129 368",rightLeg:"M250 238Q297 302 339 367",leftHand:[144,322],rightHand:[308,108],leftFoot:[120,368],rightFoot:[350,367]},
 downward:{head:[114,294],torso:"M151 277Q213 213 263 131",leftArm:"M155 269Q123 316 101 368",rightArm:"M170 260Q155 313 147 367",leftLeg:"M261 135Q292 246 304 370",rightLeg:"M270 138Q330 242 352 370",leftHand:[101,368],rightHand:[147,367],leftFoot:[304,370],rightFoot:[352,370]},
 butterfly:{head:[210,135],torso:"M210 175Q211 231 210 283",leftArm:"M179 188Q167 242 187 320",rightArm:"M242 188Q255 243 234 320",leftLeg:"M194 283Q120 296 161 351",rightLeg:"M226 283Q299 296 260 351",leftHand:[187,320],rightHand:[234,320],leftFoot:[161,351],rightFoot:[260,351]},
 sphinx:{head:[116,203],torso:"M145 231Q218 271 290 304",leftArm:"M166 235Q178 285 155 362",rightArm:"M194 246Q223 291 217 363",leftLeg:"M288 304Q308 322 343 359",rightLeg:"M294 316Q328 341 360 368",leftHand:[155,362],rightHand:[217,363],leftFoot:[343,359],rightFoot:[360,368]}
});
const CHEST=Object.freeze({
 mountain:[210,204,43,58],fold:[190,242,46,34],child:[225,285,57,31],
 tree:[210,202,42,56],warrior:[210,202,43,55],seated:[210,225,41,53],
 triangle:[212,211,47,34],downward:[207,220,45,37],butterfly:[210,228,43,50],
 sphinx:[219,269,53,32]
});
const round=v=>Math.round(v*10)/10;
const blendNumber=(a,b,t)=>round(a+(b-a)*t);
const NUMBER=/[-+]?(?:\\d*\\.)?\\d+/g;
function blendPath(a,b,t){
 const from=[...a.matchAll(NUMBER)].map(x=>Number(x[0]));
 const to=[...b.matchAll(NUMBER)].map(x=>Number(x[0]));
 if(from.length!==to.length||a.replace(NUMBER,"#")!==b.replace(NUMBER,"#"))return t<.5?a:b;
 let i=0;
 return a.replace(NUMBER,()=>String(blendNumber(from[i],to[i++],t)));
}
export function figurePoseFrame(from,to,progress){
 const start=SHAPES[from]||SHAPES.mountain,end=SHAPES[to]||SHAPES.mountain;
 const t=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:1));
 const frame={};
 for(const key of ["torso","leftArm","rightArm","leftLeg","rightLeg"])frame[key]=blendPath(start[key],end[key],t);
 for(const key of ["head","leftHand","rightHand","leftFoot","rightFoot"])
  frame[key]=start[key].map((n,i)=>blendNumber(n,end[key][i],t));
 const a=CHEST[from]||CHEST.mountain,b=CHEST[to]||CHEST.mountain;
 frame.chest=a.map((n,i)=>blendNumber(n,b[i],t));
 return Object.freeze(frame);
}
function paintFrame(svg,frame){
 for(const key of ["torso","leftArm","rightArm","leftLeg"])
  svg.querySelector('[data-figure-part="'+key+'"]').setAttribute("d",frame[key]);
 svg.querySelector('[data-figure-part="rightLeg"]').setAttribute("d",frame.rightLeg);
 const head=svg.querySelector("[data-figure-head]");
 head.setAttribute("cx",frame.head[0]);head.setAttribute("cy",frame.head[1]);
 for(const side of ["left","right"])for(const [part,xy]of [["hand",frame[side+"Hand"]],["foot",frame[side+"Foot"]]]){
  const node=svg.querySelector('[data-figure-'+part+'="'+side+'"]');
  node.setAttribute("cx",xy[0]);node.setAttribute("cy",xy[1]);
 }
 const zone=svg.querySelector(".figure-breath-zone");
 for(const [attribute,value]of [["cx",frame.chest[0]],["cy",frame.chest[1]],["rx",frame.chest[2]],["ry",frame.chest[3]]])zone.setAttribute(attribute,value);
}
export function setFigureTransition(svg,from,to,progress){
 if(!SHAPES[to])to="mountain";
 svg.dataset.pose=to;
 paintFrame(svg,figurePoseFrame(from,to,progress));
 return svg;
}

export const FIGURE_POSES=Object.freeze(Object.keys(SHAPES));
const FIGURE_MARKUP="<svg class=\"yoga-figure\" viewBox=\"0 0 420 420\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Figura humana abstracta realizando una postura de yoga\">\n  <defs><radialGradient id=\"humanAura\"><stop offset=\"0\" stop-color=\"currentColor\" stop-opacity=\".19\"/><stop offset=\"1\" stop-color=\"currentColor\" stop-opacity=\"0\"/></radialGradient></defs>\n  <circle class=\"figure-aura\" cx=\"210\" cy=\"215\" r=\"158\" fill=\"url(#humanAura)\"/>\n  <circle class=\"figure-guide figure-guide-one\" cx=\"210\" cy=\"215\" r=\"133\"/>\n  <circle class=\"figure-guide figure-guide-two\" cx=\"210\" cy=\"215\" r=\"104\"/>\n  <path class=\"figure-floor\" d=\"M66 376H354\"/>\n  <g class=\"figure-human\">\n    <path class=\"figure-torso\" data-figure-part=\"torso\"/>\n    <ellipse class=\"figure-breath-zone\" cx=\"210\" cy=\"204\" rx=\"43\" ry=\"58\"/>\n    <path class=\"figure-shoulders\" d=\"M177 165Q210 143 243 165\"/>\n    <path data-figure-part=\"leftArm\"/><path data-figure-part=\"rightArm\"/>\n    <path data-figure-part=\"leftLeg\"/><path data-figure-part=\"rightLeg\"/>\n    <circle class=\"figure-head\" data-figure-head r=\"27\"/>\n    <circle class=\"figure-joint\" data-figure-hand=\"left\" r=\"6\"/>\n    <circle class=\"figure-joint\" data-figure-hand=\"right\" r=\"6\"/>\n    <circle class=\"figure-contact\" data-figure-foot=\"left\" r=\"7\"/>\n    <circle class=\"figure-contact\" data-figure-foot=\"right\" r=\"7\"/>\n  </g>\n  <g class=\"figure-measure\" fill=\"none\"><path d=\"M210 20V47M210 383V402M19 215H47M373 215H401\"/></g>\n </svg>";

export function createFigure(host,{pose="mountain",label="Figura humana en movimiento"}={}){
 if(!(host instanceof Element))throw TypeError("Figure needs a DOM element");
 host.innerHTML=FIGURE_MARKUP;
 const svg=host.querySelector(".yoga-figure");
 svg.setAttribute("aria-label",label);
 setFigurePose(svg,pose);
 setFigureBreath(svg,.5);
 return svg;
}
export function setFigurePose(svg,pose){
 return setFigureTransition(svg,pose,pose,1);
}
export function setFigureBreath(svg,expansion){
 const value=Math.max(0,Math.min(1,Number.isFinite(expansion)?expansion:.5));
 svg.style.setProperty("--figure-breath",value.toFixed(3));
 svg.style.setProperty("--figure-lift",(-4*value).toFixed(2)+"px");
 return value;
}
