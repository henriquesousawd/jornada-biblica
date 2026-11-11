#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
const [input='data/almeida-livre-source.json', output='data/bible.json'] = process.argv.slice(2);
const source=JSON.parse(await readFile(input,'utf8'));
if(!Array.isArray(source.books)||source.books.length!==66) throw new Error('Fonte sem 66 livros.');
const converted=source.books.map(book=>book.chapters.map(chapter=>chapter.verses.map(verse=>String(verse.text))));
const chapterCount=converted.reduce((n,b)=>n+b.length,0), verseCount=converted.flat(2).length;
if(chapterCount!==1189||verseCount!==31102) throw new Error(`Estrutura inválida: ${chapterCount} capítulos, ${verseCount} versículos.`);
await writeFile(output,JSON.stringify(converted)+'\n','utf8');
console.log(`OK: ${output}; livros=${converted.length}; capítulos=${chapterCount}; versículos=${verseCount}`);
