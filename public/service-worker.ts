const CACHE_NAME = "planner-v1"
const urlsToCache = ["/", "/manifest.json", "/offline.html"]

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event: any) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
