// Nome do cache
const CACHE_NAME = "app-cache-v1";

// Arquivos para cache (adicione os seus aqui)
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/index.css",
    "/calculator.js",
    "/icon-192.png",
    "/icon-256.png",
    "/icon-384.png",
    "/icon-512.png"
];

// INSTALAÇÃO
self.addEventListener("install", (event) => {
    console.log("[SW] Instalando...");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[SW] Fazendo pré-cache dos arquivos");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting(); // força ativação imediata
});

// ATIVAÇÃO
self.addEventListener("activate", (event) => {
    console.log("[SW] Ativado!");

    // Remove caches antigos
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => key !== CACHE_NAME && caches.delete(key))
            )
        )
    );

    self.clients.claim(); // controla páginas imediatamente
});

// FETCH — Fallback automático
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return (
                cached ||
                fetch(event.request).catch(() => {
                    // fallback opcional
                })
            );
        })
    );
});
