/* সময় সোপান — সার্ভিস ওয়ার্কার। শুধু পাতার কাঠামো (HTML/আইকন) অফলাইনে রাখে।
   API/Google/Firebase অনুরোধ কখনো ক্যাশ হয় না — তাই ব্যক্তিগত তথ্য কোথাও জমা থাকে না। */
const V = "ss-v1", FILES = ["./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;       // বাইরের সব অনুরোধ সরাসরি নেটওয়ার্কে
  if (r.mode === "navigate") {                                          // পাতা: আগে নেটওয়ার্ক, না পেলে সংরক্ষিত
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
    return;
  }
  if (/\.(png|webmanifest)$/.test(u.pathname)) e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
