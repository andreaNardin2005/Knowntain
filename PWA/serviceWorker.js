// nome della cache (fondamentale per l'installazione anche se non si salva nulla in cache)
const CACHE_NAME = 'knowntain-static-v1';

// elenco dei file da mettere in cache (durante lo sviluppo meglio evitare altrimenti non si vedono le modifiche)
const urlsToCache = [
//  '/', 
//  '/index.html',
//  '/css/map.css',
//  '/scripts/map.js',
//  '/PWA/manifest.json',
//  '/icons/forest.svg', 

// dipendenze esterne (CDN) - !!sono fondamentali per la mappa
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet/dist/leaflet.css'
];

// evento install: si scatena quando il browser rileva il serviceWorker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // metto in cache tutti i file che ho definito in urlsToCache (inclusi i CDN di Leaflet)
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // forzo l'evento activate
      /*
        NOTA: se non skippo l'attesa il serviceWorker rimane in "waiting" senza prendere il controllo della pagina fino al
        ricaricamento della pagina. (nulla di pericoloso se viene tolto, ma scomodo soprattutto durante lo sviluppo)
      */
    );
});

// evento activate: elimina tutte le cache che non sono definite in CACHE_NAME
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => clients.claim()) // il serviceWorker prende il controllo (intercetta tutte le richieste dal client vengono intercettate dal serviceWorker)
  );
});

// evento fetch: scatenato ogni volta che il client cerca di accedere ad una risorsa via rete (eg: quando carico i geojson)
self.addEventListener('fetch', event => {
  event.respondWith(
    // prima cerca la risorsa nella sua cache
    caches.match(event.request)
      .then(response => {
        // se c'è la restituisco direttamente
        if (response) {
          return response;
        }
        
        // se non c'è eseguo la richiesta originale (richiedo la risorsa via rete)
        return fetch(event.request);
      })
      .catch(error => {
        // richiesta fallita
        // TODO: potrei mostrare al client una pagina per dirgli che è offline ma ancora non so come fare, devo approfondire
        //per ora non faccio nulla
      })
  );
});