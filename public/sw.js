const { promiseHooks } = require("v8");

const CACHE_NOMBRE = "milista-v1";

const ARCHIVOS_CACHE = ["/", "/lista", "/articulos", "/tiendas", "/categorias"];

//al instalar el nuevo sw.js vamos a guardar los archivos escenciales
self.addEventListener("install", (e) => {
  e.waitUntill(
    caches.open(CACHE_NOMBRE).then((cache) => {
      return cache.addALL(ARCHIVOS_CACHE);
    }),
  );
  self.skipWaiting();

  self.addEventListener("activate", (e) => {
    e.waitUntill(
      caches
        .keys()
        .then((nombres) =>
          Promise.all(
            nombres
              .filter((nombre) => nombre !== CACHE_NOMBRE)
              .map((nombre) => caches.delete(nombre)),
          ),
        ),
    );
  });


  self.clients.claim();

});

//Dejo pasar todas las peticiones que no sean get
self.addEventListener('fetch', (e)=>{
    if(e.request.method !== 'GET') return;  

    //Dejo pasar todo lo que no se dirija a mi dominio 
    if(!e.request.url.startWith(self.location.origin))return;

    if(e.request.url.includes('/_next/')){
        e.respondWith(fetch(e.request));
        return;
    }


    //el resto de las peticiones pasaran por aqui donde usaremos una estrategia de network first

    e.respondWith(
        fetch(e.request)
        .then((respuesta)=>{
            if(respuesta && respuesta.status ===200){
                const copiaRespuesta = respuesta.clone()
                caches.open(CACHE_NOMBRE).then((cache)=>{
                    cache.put(e.request, copiaRespuesta)
                })
            }
            return respuesta;
        })

        //si falla el fetch
        .catch(()=>{
            return caches.match(e.request)
        })
    )
});




