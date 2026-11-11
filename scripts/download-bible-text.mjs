#!/usr/bin/env node
/* Desenvolvimento: baixe somente uma URL HTTPS direta e licenciada. */
import { writeFile } from 'node:fs/promises';
import { request } from 'node:https';
const [url, output = 'data/bible.json'] = process.argv.slice(2);
if (!url) throw new Error('Informe a URL direta de um arquivo licenciado.');
const parsed = new URL(url); if (parsed.protocol !== 'https:') throw new Error('Apenas HTTPS é aceito.');
const body = await new Promise((resolve, reject) => { const req=request(parsed,{headers:{'user-agent':'JornadaBiblica-dev-import/1.0'}},res=>{if(res.statusCode<200||res.statusCode>=300)return reject(new Error(`HTTP ${res.statusCode}`));let data='';res.setEncoding('utf8');res.on('data',c=>data+=c);res.on('end',()=>resolve(data))});req.on('error',reject);req.end() });
const value=JSON.parse(body), books=Array.isArray(value)?value:value.books;
if(!Array.isArray(books)||books.length!==66)throw new Error('O arquivo não contém exatamente 66 livros.');
const chapters=books.reduce((n,b)=>n+(Array.isArray(b)?b.length:(b.chapters||[]).length),0);if(chapters!==1189)throw new Error(`Esperados 1.189 capítulos; encontrados ${chapters}.`);
await writeFile(output,JSON.stringify(value,null,2)+'\n','utf8');console.log(`OK: ${output} (${books.length} livros, ${chapters} capítulos)`);
