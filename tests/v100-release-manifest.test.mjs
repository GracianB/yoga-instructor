import test from"node:test";import assert from"node:assert/strict";
import{mkdtemp,mkdir,writeFile,readFile,rm}from"node:fs/promises";
import{tmpdir}from"node:os";import{join}from"node:path";
import{writeManifest,verifyManifest}from"../tools/v100-manifest.mjs";
import{readFileSync}from"node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("V100 deterministic SHA-256 manifest lists every shipped byte and rejects tampering",async()=>{
const dir=await mkdtemp(join(tmpdir(),"yoga-v100-"));
try{
 await mkdir(join(dir,"audio"));
 await writeFile(join(dir,"index.html"),"<!doctype html><title>Yoga</title>");
 await writeFile(join(dir,"studio-render-policy-v96.js"),"/* actual engine */");
 await writeFile(join(dir,"audio","sample.mp3"),Buffer.from([0,255,74,10]));
 const first=await writeManifest(dir);
 assert.equal(first.manifest.assets,3);
 assert.ok(first.manifest.files.some(x=>x.path==="audio/sample.mp3"&&x.bytes===4));
 assert.equal((await verifyManifest(dir)).assets,3);
 const snapshot=await readFile(join(dir,"release-manifest-v100.json"),"utf8");
 await writeManifest(dir);
 assert.equal(await readFile(join(dir,"release-manifest-v100.json"),"utf8"),snapshot,"repeated builds must not change the release ledger");
 await writeFile(join(dir,"audio","sample.mp3"),Buffer.from([0,255,74,11]));
 await assert.rejects(()=>verifyManifest(dir),/does not match production bytes/);
}finally{await rm(dir,{recursive:true,force:true})}
});
test("V100 build produces manifest and published Pages verification checks its SHA-256",()=>{
const build=read("tools/build.mjs"),smoke=read("tools/pages-smoke.mjs"),deploy=read(".github/workflows/deploy.yml");
for(const t of ["writeManifest","verifyManifest",'V100_SHA256_LEDGER_OK'])assert.ok(build.includes(t),t);
for(const t of ["release-manifest-v100.json","verifyManifest(root)","content mismatch","sha256"])assert.ok(smoke.toLowerCase().includes(t.toLowerCase()),t);
assert.ok(deploy.includes("npm run build"));
assert.ok(deploy.includes("pages-smoke.mjs --root=dist"));
assert.ok(deploy.includes("workflow_run.head_sha"));
assert.ok(deploy.includes("needs: [node]"));
});
