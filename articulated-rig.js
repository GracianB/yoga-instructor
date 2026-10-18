/* Independent 2D skeleton reference poses. Coordinates are illustrative, not medical motion capture. */
(function(root){
"use strict";
const names=Object.freeze(["pelvis","chest","neck","head","leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle","leftShoulder","rightShoulder","leftElbow","rightElbow","leftWrist","rightWrist"]);
const links=Object.freeze([["pelvis","chest"],["chest","neck"],["neck","head"],["pelvis","leftHip"],["pelvis","rightHip"],["leftHip","leftKnee"],["rightHip","rightKnee"],["leftKnee","leftAnkle"],["rightKnee","rightAnkle"],["chest","leftShoulder"],["chest","rightShoulder"],["leftShoulder","leftElbow"],["rightShoulder","rightElbow"],["leftElbow","leftWrist"],["rightElbow","rightWrist"]].map(Object.freeze));
function validate(joints){
 for(const name of names)if(!Array.isArray(joints?.[name])||joints[name].length!==2||!joints[name].every(Number.isFinite))throw TypeError("Invalid joint: "+name);
 return true;
}
function pose(id,joints){
 validate(joints);
 return Object.freeze({id,joints:Object.freeze(Object.fromEntries(names.map(n=>[n,Object.freeze([...joints[n]])]))),links});
}
const standing=pose("tadasana",{
 pelvis:[360,275],chest:[360,191],neck:[360,151],head:[360,115],
 leftHip:[343,278],rightHip:[377,278],leftKnee:[341,332],rightKnee:[379,332],leftAnkle:[340,390],rightAnkle:[380,390],
 leftShoulder:[328,190],rightShoulder:[392,190],leftElbow:[312,240],rightElbow:[408,240],leftWrist:[303,287],rightWrist:[417,287]
});
const fold=pose("uttanasana",{
 pelvis:[360,255],chest:[326,311],neck:[286,332],head:[258,350],
 leftHip:[343,261],rightHip:[377,261],leftKnee:[341,327],rightKnee:[379,327],leftAnkle:[340,390],rightAnkle:[380,390],
 leftShoulder:[310,315],rightShoulder:[334,309],leftElbow:[295,350],rightElbow:[343,350],leftWrist:[289,381],rightWrist:[350,381]
});
function interpolate(a,b,t){
 if(!Number.isFinite(t)||t<0||t>1)throw RangeError("Transition progress must be within [0,1]");
 validate(a?.joints);validate(b?.joints);
 const joints=Object.fromEntries(names.map(n=>[n,a.joints[n].map((v,i)=>v+(b.joints[n][i]-v)*t)]));
 return pose(a.id+"->"+b.id,joints);
}
const api=Object.freeze({names,links,validate,pose,standing,fold,interpolate});
if(root)root.YOGA_ARTICULATED_RIG=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
