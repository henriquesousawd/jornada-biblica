import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('data/owned-audio-manifest.json','utf8'));
assert.equal(manifest.version,1);assert.ok(Array.isArray(manifest.tracks));
for(const t of manifest.tracks){assert.match(t.bookId,/^[A-Z0-9]{3}$/);assert.ok(Number.isInteger(t.chapter)&&t.chapter>0);assert.equal(t.licenseStatus,'authorized-required');assert.equal(t.offlineAllowed,false)}
const bible=JSON.parse(await readFile('data/bible.json','utf8'));assert.equal(bible.length,66);assert.equal(bible.reduce((n,b)=>n+b.length,0),1189);assert.equal(bible.flat(2).length,31102);
console.log('audio infrastructure: manifest policy and Bible preservation passed');
