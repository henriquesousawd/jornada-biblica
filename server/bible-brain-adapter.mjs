import http from 'node:http';

const port=Number(process.env.PORT||8787), apiKey=process.env.BIBLE_BRAIN_API_KEY;
const baseUrl=process.env.BIBLE_BRAIN_API_BASE||'https://4.dbt.io/api';

function json(res,status,body){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body))}
async function api(path){if(!apiKey)throw Object.assign(new Error('BIBLE_BRAIN_API_KEY não configurada no servidor'),{status:503});const r=await fetch(baseUrl.replace(/\/$/,'')+path,{headers:{'api-key':apiKey,accept:'application/json'}});if(!r.ok)throw Object.assign(new Error(`Bible Brain respondeu HTTP ${r.status}`),{status:502});return r.json()}
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,`http://${req.headers.host}`);if(req.method!=='GET')return json(res,405,{error:'method_not_allowed'});if(u.pathname==='/api/audio/health')return json(res,200,{provider:'bible-brain',configured:Boolean(apiKey)});if(u.pathname==='/api/audio/catalog')return json(res,200,await api('/bibles'));if(u.pathname==='/api/audio/chapter'){const bible=u.searchParams.get('bible');const book=u.searchParams.get('book');const chapter=u.searchParams.get('chapter');if(!bible||!book||!chapter)return json(res,400,{error:'bible, book e chapter são obrigatórios'});return json(res,200,await api(`/bibles/${encodeURIComponent(bible)}/books/${encodeURIComponent(book)}/chapters/${encodeURIComponent(chapter)}/audio`))}return json(res,404,{error:'not_found'})}catch(e){json(res,e.status||500,{error:e.message})}});
server.listen(port,()=>console.log(`Audio adapter listening on ${port}`));
