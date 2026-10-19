// Verify the real GitHub Pages response, not just that dist/ was assembled.
// CI on a PR compares the public site against the checked-out main baseline;
// the post-deploy check compares the public site against the deployed commit.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {verifyManifest} from './v100-manifest.mjs';

const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const arg = argv.find(value => value.startsWith('--' + name + '='));
  return arg ? arg.slice(name.length + 3) : fallback;
};
const root = resolve(option('root', '.'));
const attempts = Number(option('attempts', '24'));
const waitSeconds = Number(option('interval', '5'));
const base = new URL(process.env.YOGA_PAGES_BASE || 'https://gracianb.github.io/yoga-instructor/');
if (!Number.isInteger(attempts) || attempts < 1 || attempts > 40) throw Error('Invalid attempts');
if (!(waitSeconds >= 0 && waitSeconds <= 20)) throw Error('Invalid interval');
if (base.protocol !== 'https:') throw Error('HTTPS required');

const inventory=await verifyManifest(root);
console.log('V100_LOCAL_LEDGER_OK: '+inventory.assets+' assets');

// The post-release smoke test must compare every published byte listed in the
// deterministic ledger, not only a curated set of CSS, JS and HTML files.
// The local verification above already proves this ledger matches the built dist.
const manifestBytes=await readFile(resolve(root,'release-manifest-v100.json'));
const manifest=JSON.parse(manifestBytes.toString('utf8'));
const expectedIndex=await readFile(resolve(root,'index.html'),'utf8');
const localPages=[expectedIndex,await readFile(resolve(root,'cv.html'),'utf8'),
  await readFile(resolve(root,'404.html'),'utf8')];
const declaredStylesheets=localPages.flatMap(html=>
  [...html.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^"]*)?"/g)].map(([,name])=>name));
const declaredScripts=localPages.flatMap(html=>
  [...html.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)].map(([,name])=>name));
const ledgerPaths=new Set(manifest.files.map(file=>file.path));
const ownerSong='audio/silence-between-notes.mp3';
const ownerSongExists=ledgerPaths.has(ownerSong);
for(const name of [...declaredStylesheets, ...declaredScripts,'index.html','cv.html','404.html','yy-dragon-d10.css',ownerSong]){
  if(!ledgerPaths.has(name))throw Error('Public asset not in SHA-256 ledger: '+name);
}
// .nojekyll is a Pages build directive, never an HTTP-served resource.
// The complete local SHA-256 manifest above still verifies its exact bytes.
// Exclude only this known directive from remote GETs; all public assets
// (including the manifest itself) must match their published SHA-256.
if (!ledgerPaths.has('.nojekyll')) throw Error('Pages release missing .nojekyll directive');
const pagesDirectives=new Set(['.nojekyll']);
const expected=[
  {name:'release-manifest-v100.json',digest:createHash('sha256').update(manifestBytes).digest('hex')},
  ...manifest.files.filter(file=>!pagesDirectives.has(file.path))
    .map(file=>({name:file.path,digest:file.sha256}))
];
const files=expected.map(file=>file.name);
// Check the real PUBLIC portfolio rather than the hidden experimental art.
const publicScriptAllowlist=['runtime.js','boot.js','i18n.js','main.js','p2-navigation.js'];
const actualPublicScripts=[...expectedIndex.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)].map(m=>m[1]);
if(JSON.stringify(actualPublicScripts)!==JSON.stringify(publicScriptAllowlist))
  throw Error('Unexpected public portfolio script(s): '+actualPublicScripts.join(', '));
for(const id of ['instructor-flow','studio-asana-library','ritual','campo','soundtrack']){
  if(expectedIndex.includes('id="'+id+'"'))throw Error('Retired public module survived build: '+id);
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const digest = data => createHash('sha256').update(data).digest('hex');
const readPublished = async (name, attempt) => {
  // Bust intermediate caches without changing the asset contents.
  const url = new URL(name, base);
  url.searchParams.set('release-check', String(attempt));
  const response = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: { 'cache-control': 'no-cache', accept: '*/*' },
    redirect: 'follow'
  });
  if (!response.ok) throw Error(name + ': HTTP ' + response.status + ' ' + url);
  return new Uint8Array(await response.arrayBuffer());
};

// Never re-download an already verified asset while waiting for CDN propagation.
// Bound parallel requests; the first complete SHA-256 match is authoritative.
const pending = new Map(expected.map(file => [file.name, file]));
for (let attempt = 1; attempt <= attempts; attempt++) {
  const problems = [];
  const queue = [...pending.values()];
  let cursor = 0;
  const verify = async () => {
    while (cursor < queue.length) {
      const file = queue[cursor++];
      try {
        const published = await readPublished(file.name, attempt);
        const actual = digest(published);
        if (actual !== file.digest) {
          problems.push(file.name + ': content mismatch (' + actual.slice(0, 12) + ' != ' + file.digest.slice(0, 12) + ')');
          continue;
        }
        // The exact SHA-256 match above verifies every byte of index.html.
        pending.delete(file.name);
      } catch (error) {
        problems.push(file.name + ': ' + error.message);
      }
    }
  };
  await Promise.all(Array.from({length: Math.min(8, queue.length)}, () => verify()));
  if (pending.size === 0) {
    console.log('PUBLIC_RELEASE_OK: ' + base.toString() + ' [' + files.join(', ') + ']');
    console.log('Verified ' + files.length + ' exact SHA-256 asset matches against ' + root);
    process.exit(0);
  }
  console.log('PUBLIC_RELEASE_WAIT ' + attempt + '/' + attempts + ': ' + problems.join(' | '));
  if (attempt < attempts) await sleep(waitSeconds * 1000);
}
throw Error('PUBLIC_RELEASE_FAIL: GitHub Pages did not serve the expected version before the deadline');
