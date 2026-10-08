import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const deploy=read('.github/workflows/deploy.yml');
const quality=read('.github/workflows/quality.yml');

test('Pages publication requires a successful main push Quality workflow',()=>{
  assert.match(deploy,/workflow_run:/);
  assert.match(deploy,/workflows: \[Yoga Quality\]/);
  assert.match(deploy,/types: \[completed\]/);
  for(const value of ["workflow_run.conclusion == 'success'","workflow_run.event == 'push'","workflow_run.head_branch == 'main'","workflow_run.head_repository.full_name == github.repository"]){
    assert.ok(deploy.includes(value),value);
  }
  assert.doesNotMatch(deploy,/workflow_dispatch:/);
});

test('Pages builds and verifies the exact SHA accepted by browser quality',()=>{
  assert.match(deploy,/ref: \$\{\{ github.event.workflow_run.head_sha \}\}/);
  assert.match(deploy,/Verify exact validated main commit/);
  assert.match(deploy,/git ls-remote/);
  assert.match(deploy,/npm run quality/);
  assert.match(deploy,/npm run build/);
  assert.match(deploy,/actions\/upload-pages-artifact@v4/);
  assert.match(deploy,/needs: \[node\]/);
  assert.match(deploy,/Verify production HTML and assets after deployment/);
  assert.match(deploy,/tools\/pages-smoke.mjs --attempts=30 --interval=5/);
});

test('Six real browser shards and quality gate remain mandatory, never duplicated by Pages',()=>{
  assert.match(quality,/browser:\s*\n/);
  assert.match(quality,/browser: \[chromium, firefox, webkit\]/);
  assert.match(quality,/shard: \[1, 2\]/);
  assert.match(quality,/name: Yoga Quality Gate/);
  assert.match(quality,/needs: \[quality, browser\]/);
  assert.match(quality,/needs.browser.result/);
  assert.doesNotMatch(deploy,/\n\s*browser:\s*\n/);
  assert.doesNotMatch(deploy,/playwright install --with-deps/);
  assert.match(deploy,/group: yoga-pages/);
  assert.match(deploy,/cancel-in-progress: true/);
});
