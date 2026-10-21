const CACHE='heelraise-v2';
const FILES=['./','index.html','heelraise.webmanifest','icons/heelraise-180.png','icons/heelraise-192.png','icons/heelraise-512.png','icons/heelraise-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(new Promise(res=>{
    let done=false;
    const fallback=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>{if(!done){done=true;res(r||Response.error())}});
    const t=setTimeout(fallback,2500);
    fetch(e.request).then(r=>{clearTimeout(t);const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t);fallback()});
  }));
});
