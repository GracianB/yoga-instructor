import {writeManifest,verifyManifest} from "./v100-manifest.mjs";
import { mkdir, rm, copyFile, cp, readFile, writeFile } from 'node:fs/promises';
import {compileProductionStyles} from "./p4-production-css.mjs";
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
const rootFiles = ['anatomy-lab.html', 'anatomy-lab.css', 'anatomy-lab.js', 'index.html', 'cv.html', 'cv.js', '404.html', 'styles.css', 'yoga-public-final.css', 'favicon.svg', 'og-cover.svg', 'og-cover.png', 'runtime.js', 'boot.js', 'main.js', 'i18n.js', 'flow-event-bridge.js', 'flow-engine.js', 'flow-session.js', 'flow-phase.js', 'instructor-ui.js', 'yin-yang-art.js', 'flow-guide.js', 'flow-guide.css', 'yy-asana-motion.js', 'yy-asana-motion.css', 'yy-premium-stage.css', 'yy-phase-d2-d3.css', 'yy-phase-d4-polish.css', 'yy-guardian-soul.css', 'yy-practice-d6.css', 'yy-phase-d7-polish.css', 'yy-dragon-d9.css', 'yy-dragon-d10.css', 'yy-dragon-d11.css', 'yy-dragon-d12.css', 'yy-dragon-d13.css', 'yy-dragon-d14.css', 'yy-dragon-d15.css', 'yy-dragon-d16.css', 'yy-dragon-d17.css', 'yy-dragon-d23.css', 'yy-asana-library.css', 'asana-library.js', 'asana-domain.js', 'studio-asana-library.js', 'asana-curriculum-v81.js', 'asana-curriculum-v81.css', 'asana-safety-v82.js', 'asana-options-v82.js', 'asana-options-v82.css', 'nila-kinematics-v84.js', 'anatomy-diagnostics.js', 'articulated-rig.js', 'rig-constraints.js', 'rig-ik.js', 'rig-motion.js', 'nila-kinematics-v84.css', 'movement-journey-v85.js', 'movement-journey-ui-v85.js', 'movement-custom-v94.js', 'movement-custom-ui-v94.js', 'movement-custom-v94.css', 'movement-flow-v103.js', 'movement-flow-ui-v103.js', 'movement-flow-v103.css', 'studio-personalization-v95.js', 'studio-personalization-ui-v95.js', 'studio-personalization-v95.css', 'movement-journey-v85.css', 'studio-unified-v66.js', 'studio-guardian-identities-v67.js', 'session-design.js', 'session-design-ui.js', 'yy-session-design.css', 'practice-pathways.js', 'practice-time-core.js', 'studio-clock.js', 'studio-render-policy-v96.js', 'studio-keyboard-v97.js', 'studio-keyboard-v97.css', 'studio-coherence-v98.js', 'studio-coherence-ui-v98.js', 'studio-coherence-v98.css', 'studio-wayfinder-v101.js', 'studio-wayfinder-ui-v101.js', 'studio-wayfinder-v101.css', 'guardian-motion-v102.js', 'yy-guardian-reconstruction-v102.css', 'practice-ritual-v104.js', 'practice-ritual-ui-v104.js', 'practice-ritual-v104.css', 'p2-navigation.js', 'studio-breath-engine.js', 'breath-articulation-v86.js', 'breath-articulation-v86.css', 'breath-guidance-v87.js', 'breath-guidance-ui-v87.js', 'breath-guidance-v87.css', 'breath-atmospheres-v88.js', 'breath-atmospheres-v88.css', 'uma-focus-ritual-v89.js', 'uma-focus-ritual-ui-v89.js', 'uma-focus-ritual-v89.css', 'uma-audio-v90.js', 'uma-audio-v90.css', 'uma-expression-v91.css', 'guardian-identities-v92.css', 'guardian-identities-v92.js', 'studio-preferences-v93.js', 'studio-preferences-ui-v93.js', 'studio-preferences-v93.css', 'yy-studio-breath-d26.css', 'studio-meditation-d27.js', 'yy-studio-meditation-d27.css', 'studio-anatomy-d28.js', 'yy-dragon-d28.css', 'yy-studio-d29.css', 'practice-studio.js', 'studio-companion.js', 'yy-studio-companion.css', 'movement-guardian-v37.js', 'yy-three-guardians-v38.css', 'studio-meditation-guardian-v42.js', 'yy-meditation-guardian-v43.css', 'yy-movement-bridge-v44.css', 'yy-guardian-atelier-v54.css', 'yy-movement-stage-v55.css', 'yy-anatomy-depth-v56.css', 'yy-immersive-practice-v57.css', 'yy-guardian-finish-v58.css', 'yy-guardian-art-v63.css', 'yy-unified-practice-v66.css', 'yy-guardian-identities-v67.css', 'yy-console-legibility-v69.css', 'yy-clock-legibility-v70.css', 'yy-asana-atelier-v71.css', 'yy-practice-journey-v72.css', 'studio-presence-v72.js', 'portfolio-v73.css', 'portfolio-v73.js', 'teaching-casebook-v74.js', 'teaching-casebook-v74.css', 'editorial-atlas-v75.css', 'editorial-atlas-v75.js', 'yoga-enquiry-v76.css', 'yoga-enquiry-v76.js', 'credential-ledger-v77.js', 'credential-ledger-v77.css', 'professional-demo-v78.css', 'professional-demo-v78.js', 'discoverability-v79.css', 'discoverability-v79.js', 'visitor-gateway-v80.css', 'visitor-gateway-v80.js', 'movement-camera-v57.js', 'practice-mode-context-v57.js', 'movement-cockpit-v55.js', 'yy-unified-gallery-v53.css', 'yoga-audio-bus.js', 'music-playlist.js', 'yy-unified-audio-v36.css', 'studio-breath-dragon.js', 'yy-breath-revival.css', 'studio-soundscape.js', 'yy-studio-soundscape.css', 'studio-plans.js', 'studio-plan-ui.js', 'yy-studio-plan.css', 'studio-immersion.js', 'yy-studio-immersion.css', 'studio-finale.js', 'yy-studio-finale.css', 'yy-practice-studio.css', 'sanctuary-experience.js', 'robots.txt', 'sitemap.xml', '.nojekyll', 'Gracian_Baena_Carta_Yoga_ES.pdf', 'Gracian_Baena_Cover_Letter_Yoga_EN.pdf'];
// Release contract: every root stylesheet referenced by HTML must be deployed.
// New visual layers must not silently disappear from GitHub Pages.
const html = await readFile('index.html', 'utf8');
for (const page of [html, await readFile('cv.html', 'utf8'), await readFile('404.html', 'utf8')]) {
  for (const [, sheet] of page.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^\"]*)?"/g)) {
    if (!sheet.includes('/') && !rootFiles.includes(sheet)) throw Error('Missing stylesheet from Pages bundle: ' + sheet);
  }
  for (const [, script] of page.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)) {
    if (!script.includes('/') && !rootFiles.includes(script)) throw Error('Missing script from Pages bundle: ' + script);
  }
}
for (const file of rootFiles) await copyFile(file, `dist/${file}`);
for (const directory of ['assets', 'audio']) await cp(directory, `dist/${directory}`, { recursive: true });
// Preserve the source index and 77 independent CSS files in GitHub.
// Only the assembled Pages HTML uses one content-hashed, ordered stylesheet.
const optimized=await compileProductionStyles(html,path=>readFile(path,"utf8"));
await writeFile("dist/"+optimized.filename,optimized.css);
// Keep historical engines in the source repository for their legacy test suite.
// The PUBLIC Pages document must contain only the actual professional portfolio.
function stripRetiredSections(document){
  const stack=[],spans=[];
  const tokens=/<\/?section\b[^>]*>/gi;
  for(const match of document.matchAll(tokens)){
    if(/^<\/section/i.test(match[0])){
      const frame=stack.pop();
      if(!frame)throw Error("Unbalanced section closing tag in production");
      if(frame.retired&&!stack.some(parent=>parent.retired)){
        spans.push([frame.offset,match.index+match[0].length]);
      }
    }else{
      stack.push({offset:match.index,retired:/\bhidden\s+inert\b/.test(match[0])});
    }
  }
  if(stack.length)throw Error("Unbalanced section opening tag in production");
  let result=document;
  for(const [start,end] of spans.reverse())result=result.slice(0,start)+result.slice(end);
  for(const id of ["instructor-flow","studio-asana-library","orientacion","atlas","ritual","campo","soundtrack"]){
    if(result.includes('id="'+id+'"'))throw Error("Retired public module still present: "+id);
  }
  for(const id of ["inicio","explora","proyectos","experiencia","contacto"]){
    if(!result.includes('id="'+id+'"'))throw Error("Public module missing: "+id);
  }
  return result;
}
// No legacy studio or book script is loaded by the PUBLIC document.
// Keep source bundles in the repository for historical/standalone tests.
const publicScripts=new Set(["runtime.js","boot.js","i18n.js","main.js","p2-navigation.js"]);
function stripRetiredPublicScripts(html){
  return html.replace(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"[^>]*><\/script>/gi,
    (tag,file)=>publicScripts.has(file)?tag:"");
}
function stripRetiredPublicSkipLinks(html){
  return html.replace(/<a\b[^>]*class="skip v97-skip"[^>]*>[\s\S]*?<\/a>/gi,"");
}
const publicHtml=stripRetiredPublicSkipLinks(
  stripRetiredPublicScripts(stripRetiredSections(optimized.html)));
const publicIncluded=[...publicHtml.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)/gi)].map(m=>m[1]);
if(publicIncluded.length!==publicScripts.size||publicIncluded.some(file=>!publicScripts.has(file))){
  throw Error("Public script allowlist integrity failed: "+publicIncluded.join(", "));
}
await writeFile("dist/index.html",publicHtml);
console.log("PUBLIC_JS_ONLY: "+publicIncluded.join(", "));
console.log("PUBLIC_PORTFOLIO_ONLY: "+Buffer.byteLength(optimized.html)+" -> "+Buffer.byteLength(publicHtml)+" bytes");
console.log("P4_PRODUCTION_CSS "+JSON.stringify({sourceSheets:optimized.sourceCount,
  productionSheets:1,requestsAvoided:optimized.sourceCount-1,
  originalBytes:Buffer.byteLength(optimized.css),sha256:optimized.digest}));
const release=await writeManifest("dist");
await verifyManifest("dist");
console.log("V100_SHA256_LEDGER_OK: "+release.manifest.assets+" files; "+release.sha256);
console.log('Pages artifact ready');
