#!/usr/bin/env node
import { readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
const root=process.argv[2]||'audio'; const output=process.argv[3]||'data/owned-audio-manifest.json';
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await walk(p);else if(/\.mp3$/i.test(extname(e.name)))files.push(p)}}
try{await walk(root)}catch(e){if(e.code==='ENOENT'){console.log('Nenhum diretório de áudio encontrado; manifesto vazio.');process.exit(0)}throw e}
const tracks=await Promise.all(files.map(async file=>{const name=basename(file,'.mp3').toUpperCase();const m=name.match(/^([1-3]?)([A-Z]{3})[_-](\d+)$/);if(!m)throw new Error(`Nome inválido: ${file}. Use GEN-001.mp3 ou GEN_001.mp3.`);const bytes=await readFile(file);const s=await stat(file);return {id:`${m[2]}-${Number(m[3])}`,bookId:m[2],chapter:Number(m[3]),file:file.replaceAll('\\','/').replace(/^audio\//,''),bytes:s.size,sha256:createHash('sha256').update(bytes).digest('hex'),durationSeconds:null,audioStart:0,audioEnd:null,licenseStatus:'authorized-required',offlineAllowed:false}}));
await writeFile(output,JSON.stringify({version:1,licensePolicy:'only-authorized-recordings',offlineDefault:false,tracks},null,2)+'\n');console.log(`Manifesto gerado: ${tracks.length} faixa(s)`);
