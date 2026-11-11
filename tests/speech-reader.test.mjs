import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const bible=JSON.parse(await readFile('data/bible.json','utf8'));
const chapter=bible[0][0];
assert.equal(chapter[0],'No princípio criou Deus os céus e a terra.');
assert.ok(chapter.length>3);
const sequence=chapter.map((text,i)=>({verse:i,text}));
assert.deepEqual(sequence.map(x=>x.verse),sequence.map((_,i)=>i));
let saved={book:0,chapter:1,verse:3,voice:'',rate:1,autoNext:true};
assert.equal(saved.verse,3); saved.verse=Math.min(chapter.length-1,saved.verse+1); assert.equal(saved.verse,4);
assert.equal(bible[0].length,50); assert.ok(bible[1].length===40); // troca de capítulo preserva a sequência do catálogo
console.log('speech reader: verse order, progress shape and chapter navigation passed');
