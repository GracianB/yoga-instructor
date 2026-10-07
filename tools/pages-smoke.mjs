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

const files = ['index.html', 'flow-motion.js', 'flow-guide.css', 'styles.css', 'favicon.svg'];
const expected = await Promise.all(files.map(async name => {
  const data = await readFile(resolve(root, name));
  return { name, digest: createHash('sha256').update(data).digest('hex') };
}));
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

for (let attempt = 1; attempt <= attempts; attempt++) {
  const problems = [];
  for (const file of expected) {
    try {
      const published = await readPublished(file.name, attempt);
      const actual = digest(published);
      if (actual !== file.digest) {
        problems.push(file.name + ': content mismatch (' + actual.slice(0, 12) + ' != ' + file.digest.slice(0, 12) + ')');
      }
      if (file.name === 'index.html') {
        const html = Buffer.from(published).toString('utf8');
        if (!html.includes('flow-motion.js?v=atelier-3')) {
          problems.push('index.html: missing versioned articulated module reference');
        }
      }
    } catch (error) {
      problems.push(file.name + ': ' + error.message);
    }
  }
  if (!problems.length) {
    console.log('PUBLIC_RELEASE_OK: ' + base.toString() + ' [' + files.join(', ') + ']');
    console.log('Verified ' + files.length + ' exact SHA-256 asset matches against ' + root);
    process.exit(0);
  }
  console.log('PUBLIC_RELEASE_WAIT ' + attempt + '/' + attempts + ': ' + problems.join(' | '));
  if (attempt < attempts) await sleep(waitSeconds * 1000);
}
throw Error('PUBLIC_RELEASE_FAIL: GitHub Pages did not serve the expected version before the deadline');
