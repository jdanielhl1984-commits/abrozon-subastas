// Service Worker mínimo para aBROzon.subastas
// Como es una web "en vivo" (subastas y saldo en tiempo real), no guardamos
// nada en caché para evitar mostrar datos desactualizados sin querer.
// Este archivo solo existe para cumplir el requisito técnico que permite
// "Añadir a la pantalla de inicio" en el móvil.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Dejamos pasar todas las peticiones directamente a la red, sin caché.
  event.respondWith(fetch(event.request));
});
