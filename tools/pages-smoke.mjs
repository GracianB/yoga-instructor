// Verify the real GitHub Pages response, not just that dist/ was assembled.
// CI on a PR compares the public site against the checked-out main baseline;
// the post-deploy check compares the public site against the deployed commit.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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

// Verify every root stylesheet declared by the release HTML, not a stale hand-maintained list.
const expectedIndex = await readFile(resolve(root, 'index.html'), 'utf8');
const localPages = [expectedIndex, await readFile(resolve(root, 'cv.html'), 'utf8'),
  await readFile(resolve(root, '404.html'), 'utf8')];
// A single missing JS can break an entire mode even while the HTML looks fine.
// Read local assets from all public pages, not just a hand-picked smoke list.
const declaredStylesheets = localPages.flatMap(html =>
  [...html.matchAll(/<link[^>]+href="\.\/([^"?#]+\.css)(?:\?[^"]*)?"/g)]
    .map(([,name]) => name).filter(name => !name.includes('/')));
const declaredScripts = localPages.flatMap(html =>
  [...html.matchAll(/<script\b[^>]*\bsrc="\.\/([^"?#]+\.js)(?:\?[^"]*)?"/g)]
    .map(([,name]) => name).filter(name => !name.includes('/')));
// Audio remains optional for older releases, but a committed owner soundtrack
// must be byte-identical on Pages. A 200 HTML fallback is not a valid MP3.
const ownerSong='audio/silence-between-notes.mp3';
const ownerSongExists=await readFile(resolve(root,ownerSong)).then(()=>true,()=>false);
const files = [...new Set(['index.html', 'cv.html', '404.html', 'favicon.svg',
  'yin-yang-art.js', 'yy-dragon-d9.css', 'yy-dragon-d10.css',
  ...declaredStylesheets, ...declaredScripts,
  ...(ownerSongExists?[ownerSong]:[])])];
const expected = await Promise.all(files.map(async name => {
  const data = await readFile(resolve(root, name));
  return { name, digest: createHash('sha256').update(data).digest('hex') };
}));

const expectedArtRef = expectedIndex.match(/yin-yang-art\.js\?v=[^"']+/)?.[0];
if (!expectedArtRef) throw Error('No versioned Yin/Yang art reference in release HTML');
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
        if (file.name === 'index.html') {
          const html = Buffer.from(published).toString('utf8');
          if (!html.includes(expectedArtRef)) {
            problems.push('index.html: missing expected art reference ' + expectedArtRef);
            continue;
          }
        }
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
