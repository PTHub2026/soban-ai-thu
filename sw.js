/* So Ban AI - ban dung thu · service worker: cho phep mo lai khi mat mang */
const CACHE='sbai-thu-v3';
const ASSETS=['./','./index.html','./app.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;                       /* khong dung cho POST (gop y, dem luot) */
  if(new URL(r.url).origin!==location.origin)return; /* chi lo file cua chinh trang */
  e.respondWith(
    fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;})
            .catch(()=>caches.match(r).then(m=>m||caches.match('./app.html')))
  );
});
