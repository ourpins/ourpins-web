import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
function landing(query,ua){
 const nodes=new Map();const get=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,dataset:{title:'Invalid',description:'Check link'},setAttribute(k,v){this[k]=v;}});return nodes.get(id);};
 vm.runInNewContext(fs.readFileSync(new URL('invite/invite-v1.js',root),'utf8'),{URLSearchParams,location:{search:query},navigator:{userAgent:ua,maxTouchPoints:0},document:{getElementById:get}});
 return get;
}
test('a mobile invitation opens the code understood by installed legacy apps, without automatic navigation',()=>{
 for(const ua of ['iPhone Line/14.0','Android']){const get=landing('?code=abc123',ua);assert.equal(get('invite-code').textContent,'ABC123');assert.equal(get('invite-open').href,'ourpins://join/ABC123');assert.equal(get('invite-open').hidden,false);assert.equal(get('invite-valid').hidden,false);}
 assert.equal(landing('?code=abc123','iPhone Line/14.0')('invite-line').hidden,false);
 assert.equal(landing('?code=abc123','Windows')('invite-open').hidden,true);
});
test('invalid or ambiguous invitations never show a join action or interpolate untrusted content',()=>{
 for(const query of ['','?code=abc123&code=DEF456','?code=%3Cscript%3E','?code=123']){const get=landing(query,'iPhone');assert.equal(get('invite-invalid').hidden,false);assert.equal(get('invite-valid').hidden,true);assert.equal(get('invite-open').href,undefined);}
});
test('five static pages expose opaque 1200 by 630 cards without replacing the incoming query URL',()=>{
 for(const locale of ['ja','en','zh-Hans','zh-Hant','ko']){
  const html=fs.readFileSync(new URL('invite/'+(locale==='ja'?'':locale+'/')+'index.html',root),'utf8');
  assert.match(html,/<meta property="og:image" content="https:\/\/ourpins.app\/assets\/invite-card-/);
  assert.match(html,/summary_large_image/);assert.doesNotMatch(html,/property="og:url"|rel="canonical"/);
  const png=fs.readFileSync(new URL(`assets/invite-card-${locale}-v1.png`,root));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
 }
});
