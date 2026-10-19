import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {MOVEMENT_STEPS,BREATH_PATTERNS,GUIDED_VIDEOS,BOOK_POSES,movementFrame,breathFrame,sumMovementSeconds,SessionClock} from "../apps/shared/core.mjs";
import {FIGURE_POSES} from "../apps/shared/figure.mjs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("App V1: Movement has exactly three fixed actions, no editor or customization",()=>{
 assert.equal(MOVEMENT_STEPS.length,3);
 assert.deepEqual(MOVEMENT_STEPS.map(x=>x.id),["mountain","fold","child"]);
 assert.deepEqual(MOVEMENT_STEPS.map(x=>x.seconds),[75,75,90]);
 assert.equal(sumMovementSeconds(),240);
 const a=movementFrame(0),b=movementFrame(75),c=movementFrame(150),z=movementFrame(240);
 assert.deepEqual([a.index,b.index,c.index,z.index],[0,1,2,2]);
 assert.equal(z.finished,true);
 assert.equal(z.totalProgress,1);
 for(let t=0;t<=240;t+=.2){
  const f=movementFrame(t);
  assert.ok(f.remaining>=0&&f.totalProgress>=0&&f.totalProgress<=1);
  assert.ok(FIGURE_POSES.includes(f.item.pose));
 }
 assert.throws(()=>movementFrame(-1),RangeError);
 assert.throws(()=>movementFrame(Infinity),RangeError);
 assert.doesNotMatch(read("apps/yoga-practice/index.html"),/data-customize|data-pose-select|data-reorder/);
});

test("App V1: 4·4·4, 4·7·8, 3·6·9 and optional natural/box rhythms stay deterministic",()=>{
 assert.deepEqual(BREATH_PATTERNS.map(x=>x.id),["natural","444","478","369","4444"]);
 for(const p of BREATH_PATTERNS){
  const total=p.inhale+p.hold+p.exhale+p.rest;
  assert.ok(total>0);
  for(let i=0;i<total*8;i++){
   const a=breathFrame(i/8,p.id),b=breathFrame(i/8+total,p.id);
   assert.equal(a.phase,b.phase);
   assert.ok(Math.abs(a.expansion-b.expansion)<1e-9);
   assert.ok(a.expansion>=0&&a.expansion<=1);
   assert.ok(a.remaining>0&&a.remaining<=total);
  }
 }
 const box=breathFrame(0,"444");
 assert.equal(box.phase,"inhale");
 assert.equal(breathFrame(4,"444").phase,"hold");
 assert.equal(breathFrame(8,"444").phase,"exhale");
 assert.equal(breathFrame(12,"444").phase,"inhale");
 assert.equal(breathFrame(4.01,"478").phase,"hold");
 assert.equal(breathFrame(11.01,"478").phase,"exhale");
 assert.equal(breathFrame(3.01,"369").phase,"hold");
 assert.equal(breathFrame(9.01,"369").phase,"exhale");
 assert.equal(breathFrame(13,"4444").phase,"rest");
 assert.equal(breathFrame(7,"natural").phase,"exhale");
 assert.throws(()=>breathFrame(NaN,"natural"),RangeError);
});

test("App V1: one monotonic clock starts, pauses, resumes, finishes and resets",()=>{
 let ms=0;
 const clock=new SessionClock(()=>ms);
 clock.reset(30);
 assert.equal(clock.snapshot().status,"idle");
 clock.start();ms+=3200;
 assert.equal(clock.snapshot().elapsed,3.2);
 clock.pause();ms+=15000;
 assert.equal(clock.snapshot().elapsed,3.2);
 clock.resume();ms+=900;
 assert.ok(Math.abs(clock.snapshot().elapsed-4.1)<1e-9);
 ms+=30000;
 assert.equal(clock.snapshot().status,"finished");
 assert.equal(clock.snapshot().remaining,0);
 clock.reset(120);
 assert.equal(clock.snapshot().elapsed,0);
 assert.throws(()=>clock.reset(0),RangeError);
 assert.throws(()=>clock.reset(100000),RangeError);
});

test("App V1: one human figure reused by all three modes and by the Asana Book",()=>{
 for(const p of BOOK_POSES)assert.ok(FIGURE_POSES.includes(p.pose),p.id);
 assert.equal(BOOK_POSES.length,6);
 assert.equal(new Set(BOOK_POSES.map(x=>x.id)).size,6);
 for(const p of BOOK_POSES)for(const key of ["es","en"]){
  assert.ok(p.name[key]&&p.cue[key]&&p.support[key],p.id+" "+key);
 }
 const figure=read("apps/shared/figure.mjs"),practice=read("apps/yoga-practice/app.mjs"),book=read("apps/yoga-asana-book/book.mjs");
 assert.match(figure,/createFigure/);
 assert.match(practice,/import \{createFigure,setFigurePose,setFigureBreath\}/);
 assert.match(book,/import \{createFigure,setFigurePose,setFigureBreath\}/);
 for(const id of ["mountain","fold","child","tree","warrior","seated"])assert.ok(figure.includes(id+":{"));
});

test("App V1: guided meditation uses verified explicit YouTube links, never autoplay",()=>{
 assert.deepEqual(GUIDED_VIDEOS.map(x=>x.minutes),[5,10,15]);
 for(const video of GUIDED_VIDEOS){
  const u=new URL(video.url);
  assert.equal(u.hostname,"www.youtube.com");
  assert.equal(u.pathname,"/watch");
  assert.match(u.searchParams.get("v"),/^[\w-]{11}$/);
 }
 const practice=read("apps/yoga-practice/app.mjs"),html=read("apps/yoga-practice/index.html");
 assert.match(practice,/video\.url/);
 assert.match(practice,/a\.target="_blank"/);
 assert.match(practice,/a\.rel="noopener noreferrer"/);
 assert.match(practice,/document\.hidden&&clock\.status==="running"/);
 assert.doesNotMatch(practice,/autoplay|speechSynthesis|new Audio\(|iframe|AudioContext|localStorage/);
 assert.doesNotMatch(html,/<iframe|<audio|<video/);
});

test("App V1: both standalone apps reference ONLY shared local assets and support reduced motion",()=>{
 for(const [app,script,css]of [["yoga-practice","app.mjs","app.css"],["yoga-asana-book","book.mjs","book.css"]]){
  const h=read("apps/"+app+"/index.html"),j=read("apps/"+app+"/"+script),s=read("apps/"+app+"/"+css);
  for(const asset of ["../shared/theme.css","../shared/figure.css","./"+css,"./"+script])assert.ok(h.includes(asset),app+" "+asset);
  assert.ok(j.includes('from "../shared/core.mjs"'),app);
  assert.ok(j.includes('from "../shared/figure.mjs"'),app);
  assert.match(h,/Content-Security-Policy/);
  assert.match(s,/@media\(max-width:/);
 }
 assert.match(read("apps/shared/theme.css"),/prefers-reduced-motion:reduce/);
 assert.match(read("apps/shared/figure.css"),/prefers-reduced-motion:reduce/);
});

test("App V1: human motion is paced, pose-specific and stops with the main practice",()=>{
 const style=read("apps/shared/figure.css"),app=read("apps/yoga-practice/app.mjs");
 for(const key of ["figureStand","figureFold","figureRest","figureSeat"])assert.match(style,new RegExp("@keyframes "+key));
 assert.match(style,/data-active="true"/);
 assert.match(style,/prefers-reduced-motion:reduce/);
 assert.match(app,/data-active",String\(snapshot\.status==="running"&&!guided\)/);
});
