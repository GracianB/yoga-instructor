import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('music transport shares pause across owners, selects both tracks, and stops on another tab',async()=>{
 const listeners={};let remote,claims=0;
 const audio={paused:true,volume:.45,setAttribute(k,v){this[k]=v},addEventListener(k,fn){listeners[k]=fn},pause(){this.paused=true},async play(){this.paused=false},load(){}};
 const window={dispatchEvent(){},addEventListener(){},speechSynthesis:{cancel(){}}};
 const context={window,document:{getElementById:id=>id==='focus-audio'?audio:null,querySelector:()=>null,documentElement:{lang:'es'},addEventListener(){},querySelectorAll:()=>[audio]},BroadcastChannel:class{addEventListener(_,fn){remote=fn}postMessage(){claims++}close(){}},MutationObserver:class{observe(){}disconnect(){}},CustomEvent:class{},HTMLMediaElement:class{},URL};
 vm.runInNewContext(readFileSync(new URL('../yoga-audio-bus.js',import.meta.url),'utf8'),context);
 const bus=window.YOGA_AUDIO_BUS;
 await bus.play('hero');assert.equal(audio.paused,false);
 await bus.toggle('dock');assert.equal(audio.paused,true);
 await bus.selectTrack(1);assert.equal(bus.trackName,'Sustained Focus');assert.match(audio.src,/sustained-focus/);
 await bus.play('breath');await bus.selectTrack(0);assert.equal(audio.paused,false);assert.equal(bus.trackName,'Silence Between Notes');
 remote();assert.equal(audio.paused,true);assert.ok(claims>=2);
 assert.equal(await bus.selectTrack(99),false);
});
