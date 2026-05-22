# MiLista — Descripción técnica del proyecto

## Descripción general

**MiLista** es una Progressive Web App (PWA) para gestionar listas de la compra personales. Permite gestionar artículos, tiendas y categorías, y mantener listas de compra filtradas por tienda con actualización automática en tiempo real.

## Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.2.6 | Framework web (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos (configuración en CSS, no en tailwind.config.js) |
| Prisma | 6.x | ORM para base de datos |
| PostgreSQL | - | Base de datos |
| lucide-react | latest | Iconos SVG (sustituye emojis en todos los componentes) |
| sonner | latest | Notificaciones toast (`toast.success`, `toast.error`) |
| clsx | latest | Clases CSS condicionales en componentes |

## Arquitectura

### Patrón de datos

```
Base de datos (PostgreSQL)
    ↑↓ Server Actions (app/acciones/*.ts)  ← 'use server'
Custom Hooks (hooks/*.ts)
    ↑↓ Estado local React
Componentes UI (components/**/*.tsx)        ← 'use client'
```

### Reglas de arquitectura

- **Server Actions** (`'use server'`): único punto de acceso a la BD. Los componentes cliente los llaman directamente — Next.js los convierte en llamadas HTTP automáticamente.
- **Client Components** (`'use client'`): toda la interactividad. Necesario para useState, useEffect, eventos del usuario.
- **Hooks personalizados**: encapsulan la lógica de estado. Los componentes solo muestran UI.
- **Solo hooks básicos**: `useState`, `useEffect`, `useRef` (y custom hooks que los usen internamente).

### Polling en tiempo real y sincronización multi-dispositivo

Los hooks de datos usan `usePolling` para recargar datos cada **10 segundos**. Se usa un `useRef` para el callback para evitar recrear el intervalo innecesariamente.

En `useLista`, el polling está optimizado para dos objetivos:

1. **Sin re-renders innecesarios**: al recibir datos de la BD, se compara el nuevo estado con el anterior (ids, tachados, cantidades). Si nada cambió, los `setState` devuelven `prev` — React detecta que es la misma referencia y no re-renderiza. La vista no parpadea si no hay cambios.

2. **Sincronización multi-dispositivo**: `idsTachadosLocal` se reemplaza completamente con los IDs que tienen `tachado=true` en la BD. Así, si otro dispositivo marca o desmarca un artículo, el cambio llega al siguiente poll (en ≤ 10 segundos) sin necesidad de websockets.

### Acceso desde la red local

`next.config.ts` usa el módulo `os` de Node para detectar automáticamente las IPs locales de la máquina y las añade a `allowedDevOrigins`. Esto permite abrir la app desde cualquier dispositivo en la misma WiFi (`http://<ip>:3000`) sin que Next.js bloquee el HMR ni los Server Actions. No requiere configuración manual al cambiar de red.

### Modal de instalación PWA

`hooks/useInstalacionPWA.ts` detecta automáticamente la plataforma (`ios`, `android`, `windows`, `otro`) y decide si mostrar el modal:

- **iOS Safari**: no lanza `beforeinstallprompt`, así que el modal aparece siempre tras 3 s con instrucciones manuales paso a paso (botón Compartir → "Añadir a pantalla de inicio").
- **Android / Windows / otros**: escucha el evento `beforeinstallprompt`, lo almacena en un `useRef`, y muestra el modal tras 3 s. Al pulsar "Instalar" llama a `prompt()` y comprueba `userChoice.outcome`.
- En ambos casos, si la app ya está instalada (`display-mode: standalone` o `navigator.standalone` en iOS) o el usuario pulsó "Ahora no" (guardado en `localStorage`), no se muestra nada.

`components/pwa/ModalInstalacion.tsx`: bottom-sheet en móvil, centrado en desktop (`z-200`). El contenido cambia según la plataforma.

Los tipos globales `BeforeInstallPromptEvent` y `WindowEventMap` están declarados en `lib/tipos.ts`.

### Sistema de notificaciones Toast

Usa la librería **Sonner**. El componente `<Toaster position="bottom-center" richColors />` se monta en el layout raíz. Desde cualquier hook se llama directamente a `toast.success()` o `toast.error()` importando desde `'sonner'`. No se necesita Context ni props.

## Estructura de archivos

```
lista-compra/
├── prisma/
│   └── schema.prisma              # Esquema de BD (genera cliente en app/generated/prisma)
├── lib/
│   ├── prisma.ts                  # Cliente Prisma singleton (evita múltiples conexiones en dev)
│   └── tipos.ts                   # Interfaces TypeScript compartidas
├── app/
│   ├── acciones/
│   │   ├── categorias.ts          # Server Actions CRUD categorías
│   │   ├── tiendas.ts             # Server Actions CRUD tiendas
│   │   ├── articulos.ts           # Server Actions CRUD artículos + búsqueda por código de barras
│   │   └── lista.ts               # Server Actions lista (obtener, añadir, tachar, finalizar)
│   ├── generated/
│   │   └── prisma/                # Cliente Prisma generado (no editar manualmente)
│   ├── lista/page.tsx
│   ├── articulos/page.tsx
│   ├── tiendas/page.tsx
│   ├── categorias/page.tsx
│   ├── layout.tsx                 # Layout raíz con nav, toast, SW y modal de instalación
│   ├── page.tsx                   # Redirige a /lista
│   └── globals.css
├── hooks/
│   ├── usePolling.ts              # Polling silencioso con setInterval
│   ├── useBusqueda.ts             # Filtrado de listas por texto
│   ├── useCategorias.ts           # Estado + CRUD categorías
│   ├── useTiendas.ts              # Estado + CRUD tiendas
│   ├── useArticulos.ts            # Estado + CRUD artículos
│   ├── useLista.ts                # Lógica compleja: tachado optimista + persistencia
│   ├── useEscaner.ts              # Cámara + BarcodeDetector API
│   └── useInstalacionPWA.ts       # Detección de plataforma y lógica de instalación PWA
├── components/
│   ├── ui/
│   │   ├── Cargando.tsx           # Spinner animado
│   │   ├── BuscadorInput.tsx      # Input de búsqueda reutilizable
│   │   ├── ModalBase.tsx          # Modal base (bottom-sheet móvil / centrado desktop)
│   │   └── ModalConfirmacion.tsx  # Modal de confirmación con botón peligroso opcional
│   ├── nav/
│   │   └── MenuNav.tsx            # Navegación: inferior en móvil, superior en desktop
│   ├── pwa/
│   │   ├── RegistradorSW.tsx      # Registra el Service Worker al montar
│   │   └── ModalInstalacion.tsx   # Modal de instalación PWA (iOS/Android/Windows)
│   ├── categorias/
│   │   ├── VistaCategorias.tsx    # Vista completa con búsqueda + lista + modales
│   │   ├── FilaCategoria.tsx      # Fila individual con botones editar/eliminar
│   │   └── ModalCategoria.tsx     # Formulario crear/editar categoría
│   ├── tiendas/
│   │   ├── VistaTiendas.tsx
│   │   ├── FilaTienda.tsx
│   │   └── ModalTienda.tsx
│   ├── articulos/
│   │   ├── VistaArticulos.tsx
│   │   ├── FilaArticulo.tsx       # Clic=añadir rápido, Plus=con opciones, Pencil=editar, Trash2=eliminar
│   │   ├── ModalArticulo.tsx      # Formulario con escáner de código de barras integrado
│   │   └── ModalAnadirALista.tsx  # Selector de cantidad y tienda
│   └── lista/
│       ├── VistaLista.tsx         # Vista principal: filtros + lista + footer + modales
│       ├── ItemLista.tsx          # Elemento: clic=tachar, Pencil=editar, Trash2=borrar
│       ├── FooterLista.tsx        # Totales y botón finalizar (fijo encima de nav en móvil)
│       ├── ModalEditarItem.tsx    # Editar cantidad y tienda de un item de la lista
│       ├── ModalEscanerUnico.tsx  # Escáner de un solo código (para formulario de artículo)
│       └── ModalEscanearLista.tsx # Escáner continuo para añadir artículos a la lista
├── public/
│   ├── manifest.json              # Manifest PWA
│   ├── sw.js                      # Service Worker (Network First + Cache Fallback)
│   ├── icon-192.png               # Icono PWA
│   ├── icon-512.png               # Icono PWA
│   ├── favicon-16x16.png          # Favicon pestaña del navegador
│   ├── favicon-32x32.png          # Favicon pestaña del navegador
│   └── apple-touch-icon.png       # Icono para iOS al guardar en pantalla de inicio
├── CLAUDE.md                      # Instrucciones para Claude Code
├── pasos.md                       # Guía de construcción paso a paso con código completo
├── docs/
│   └── descripcion.md             # Este archivo
└── next.config.ts                 # Headers para Service Worker
```

## Modelos de datos

### Categoria
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int (PK) | Identificador único autoincremental |
| nombre | String (único) | Nombre de la categoría |

### Tienda
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int (PK) | Identificador único autoincremental |
| nombre | String (único) | Nombre de la tienda |

### Articulo
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int (PK) | Identificador único |
| nombre | String | Nombre del producto |
| precio | Float | Precio unitario (€), default 0 |
| cantidadPorDefecto | Int | Cantidad al añadir rápido, default 1 |
| categoriaId | Int? | FK a Categoria (opcional) |
| tiendaId | Int? | Tienda por defecto (opcional) |
| apuntado | Boolean | True si está actualmente en alguna lista |
| codigoBarras | String? | Código EAN/QR para el escáner |
| creadoEn | DateTime | Fecha de creación |
| actualizadoEn | DateTime | Fecha de última modificación |

### ListaCompraItem
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int (PK) | Identificador único |
| articuloId | Int (FK) | Artículo en la lista |
| tiendaId | Int? (FK) | Tienda donde comprarlo |
| cantidad | Int | Unidades a comprar, default 1 |
| **tachado** | Boolean | True si ya está en el carrito, default false |
| creadoEn | DateTime | Fecha de añadido |

> **Nota sobre `tachado`:** El campo `tachado` se persiste en la BD. Cuando el usuario marca un artículo, se llama a `marcarTachado()` en el servidor inmediatamente (actualización optimista). Al volver a la lista, los artículos siguen tachados. Solo desaparecen de la lista cuando se pulsa "Finalizar compra", que elimina todos los items con `tachado=true`.

## Lógica del tachado en `useLista`

```
BD carga → todosItems (todos los items, tachado=true y false)
         ↓
         idsTachadosLocal = Set con IDs cuyo tachado=true en BD (se inicializa al cargar)
         ↓
┌─── noTachados: tachado=false en BD y no en el Set local → se muestran primero
├─── tachadosLocal: están en el Set local → se muestran al final con tachado visual
└─── tachadosAnteriores: tachado=true en BD pero NO en Set → (vacío en práctica, se carga en Set)

Vista = sortPorCategoria(noTachados) + sortPorNombre(tachadosLocal)
```

Cuando el usuario toca un artículo:
1. Se actualiza `idsTachadosLocal` inmediatamente (optimista)
2. Se llama a `marcarTachado(id, valor)` en segundo plano
3. La UI refleja el cambio sin esperar al servidor

## Funcionalidades

### Vista Lista (`/lista`)
- Filtro por tienda (guardado en localStorage, persiste entre sesiones)
- Búsqueda en tiempo real por nombre y categoría
- Artículos ordenados: primero por categoría, luego por nombre
- Clic en artículo: marcar/desmarcar como en carrito (persiste en BD)
- Al volver a la vista: los artículos tachados siguen apareciendo tachados
- Botón editar (Pencil) por item: cambia cantidad y tienda con `actualizarItemLista`
- Botón eliminar (Trash2) por item: borra el item de la lista con confirmación modal
- Precio unitario visible en cada item (línea de metadatos, formato `X.XX €/ud`)
- Añadir un artículo ya presente suma la cantidad en vez de crear una entrada duplicada
- Botón "Añadir artículos": navega a /articulos
- Botón "Añadir rápido": escáner continuo de códigos de barras
- Footer fijo: totales del carrito y total esperado + botón finalizar
- Footer posicionado encima de la nav inferior en móvil (bottom-16, z-50)
- "Finalizar compra": elimina todos los items con tachado=true de la BD

### Vista Artículos (`/articulos`)
- CRUD completo
- Clic en artículo: añadir rápido a la lista con valores por defecto
- Botón ➕: añadir a la lista eligiendo cantidad y tienda
- Código de barras con captura por cámara (BarcodeDetector API)

### Vista Tiendas (`/tiendas`) y Categorías (`/categorias`)
- CRUD completo con búsqueda
- No se pueden eliminar si están en uso

### PWA
- Instalable en Android/iOS/desktop
- Funciona offline (caché de páginas con Network First)
- Escáner de códigos funciona en móviles Android con Chrome/Edge
- Modal de instalación adaptado por plataforma: instrucciones paso a paso en iOS, botón "Instalar" en Android/Windows
- Favicons configurados en `metadata.icons` (`favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`)

## Comandos de desarrollo

```bash
# Desarrollo
npm run dev

# Gestionar BD
npx prisma studio      # UI visual para ver y editar datos
npx prisma db push     # Aplicar cambios del schema a la BD (también regenera el cliente)
npx prisma generate    # Solo regenerar el cliente TypeScript

# Producción
npm run build
npm run start
```

## Consideraciones de posicionamiento CSS

En móvil hay dos elementos fijos superpuestos:
- `MenuNav`: `fixed bottom-0 z-40` (barra de nav inferior, ~56px de alto)
- `FooterLista`: `fixed bottom-16 z-50 sm:bottom-0` (encima de la nav, con z mayor)

El contenido principal en `VistaLista` tiene `pb-44 sm:pb-36` para no quedar tapado por ninguno de los dos.
