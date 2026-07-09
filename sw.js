/* 1001 Classical — service worker（网络优先，保证内容更新即时生效、离线可用）。
 * 只处理同源 GET；跨域封面(iTunes)/肖像(维基)交由浏览器直取（本站已用 localStorage 缓存其 URL）。
 * 更新 SHELL 版本号即可让旧缓存失效。 */
const SHELL = "cls-shell-v2";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js",
  "./data.js", "./composers.js", "./portraits.js", "./favicon.svg", "./manifest.webmanifest"
];

self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener("activate", e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==SHELL).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return; // 跨域资源不拦截
  // 网络优先：拿最新，成功即回写缓存；离线时回退缓存，导航兜底 index.html
  e.respondWith((async()=>{
    try{
      const res = await fetch(req);
      const cache = await caches.open(SHELL);
      cache.put(req, res.clone());
      return res;
    }catch(err){
      const cached = await caches.match(req);
      if(cached) return cached;
      if(req.mode === "navigate") return caches.match("./index.html");
      throw err;
    }
  })());
});
