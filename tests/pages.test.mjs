import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('portal.html',root),'utf8');
const js=readFileSync(new URL('portal.js',root),'utf8');
test('client page entries select only implemented workspace views',()=>{
 const views=new Set([...html.matchAll(/data-view="([^"]+)"/g)].map(x=>x[1]));
 const panels=new Set([...html.matchAll(/data-panel="([^"]+)"/g)].map(x=>x[1]));assert.deepEqual(views,panels);
 for(const file of readdirSync(root).filter(x=>x.endsWith('.html'))){
  const text=readFileSync(new URL(file,root),'utf8');
  for(const x of text.matchAll(/portal\.html\?view=([a-z-]+)/g))assert.ok(views.has(x[1]),file);
 }
});
test('every static DOM lookup resolves to a unique element',()=>{
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size);
 for(const x of js.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(x[1]),x[1]);
});
test('drafts cannot be discarded through refresh or venture switching',()=>{
 const controls={purpose:{value:'Purpose'},audience:{value:''},offer:{value:''},milestone:{value:''},'edit-stage':{value:'Idea'},'task-title':{value:''},'business-form':{hidden:true},'business-name':{value:''},'document-file':{files:[]}};
 const fields=['project','request','integration'].map(()=>[{value:''}]);['project','request','integration'].forEach((k,i)=>controls[k+'-form']={querySelectorAll:()=>fields[i]});
 let choices=[];
 const c=vm.createContext({businesses:[{id:'a',purpose:'Purpose',audience:'',offer:'',milestone:'',stage:'Idea',services:[]}],selected:'a',$:id=>controls[id],document:{querySelectorAll:()=>choices}});
 vm.runInContext(js.slice(js.indexOf('function ensureSaved(){'),js.indexOf("$('refresh').onclick")),c);
 assert.doesNotThrow(()=>c.ensureSaved());
 for(const id of ['purpose','task-title']){const old=controls[id].value;controls[id].value='Unsaved';assert.throws(()=>c.ensureSaved(),/Save your changes/);controls[id].value=old;}
 for(const group of fields){group[0].value='Unsubmitted';assert.throws(()=>c.ensureSaved(),/Save your changes/);group[0].value='';}
 controls['document-file'].files=[{}];assert.throws(()=>c.ensureSaved(),/Save your changes/);controls['document-file'].files=[];
 choices=[{value:'New service'}];assert.throws(()=>c.ensureSaved(),/Save your changes/);
});
test('only verified authenticator sessions enter the real dashboard',()=>{
 const gate=js.indexOf('if(!mayOpenWorkspace(aal.currentLevel))');
 const dashboard=js.indexOf("show('dashboard');$('identity').textContent=user.email");
 const actual=js.indexOf("show('dashboard');selectView(");
 assert.ok(gate>0 && actual>gate);assert.ok(js.indexOf("client.from('agency_businesses').select('*')")>gate);
 assert.match(js,/auth:\{storage:sessionStorage/);
});
test('extension records and file storage enforce ownership and MFA',()=>{
 const sql=readFileSync(new URL('backend/002-client-pages.sql',root),'utf8');
 for(const table of ['agency_records','agency_documents'])assert.match(sql,new RegExp(`alter table public.${table} enable row level security`));
 assert.equal((sql.match(/'aal2'/g)||[]).length,7);
 assert.match(sql,/'agency-private','agency-private',false,10485760/);
 assert.equal((sql.match(/b\.owner_id=\(select auth.uid\(\)\)/g)||[]).length,7);
 assert.match(sql,/Record identity cannot change/);
 assert.doesNotMatch(sql,/for update to authenticated/);
});
test('public files do not publish a personal contact or executable paid feature',()=>{
 for(const file of readdirSync(root).filter(x=>/\.(html|js|mjs)$/.test(x))){const text=readFileSync(new URL(file,root),'utf8');assert.doesNotMatch(text,/[\w.+-]+@gmail\.com/i);}
 assert.match(js,/createSignedUrl\(d.path,60\)/);
 assert.match(html,/No paid subscription, AI usage or payment collection is active/);
});

test('direct preview initialisation avoids the busy-click guard',()=>{
 assert.match(js,/if\(new URLSearchParams\(location.search\).get\('preview'\)==='1'\)\{await startPreview\(\);return;\}/);
 assert.match(js,/async function startPreview\(\)\{demo=true;samples.clear\(\)/);
 assert.match(js,/\$\('demo'\).onclick=\(\)=>run\(startPreview/);
});
test('new task controls constrain changes to the selected venture',()=>{
 assert.match(js,/update\(\{title\}\).eq\('id',t.id\).eq\('business_id',b.id\).select\('id'\).single\(\)/);
 assert.match(js,/delete\(\).eq\('id',t.id\).eq\('business_id',b.id\).select\('id'\).single\(\)/);
 assert.match(js,/window.confirm\('Delete this task/);
 assert.match(js,/window.addEventListener\('beforeunload'/);
});
