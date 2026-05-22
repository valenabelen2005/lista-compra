'use client'

import { useEffect } from 'react'

// Registra el Service Worker para habilitar las funcionalidades PWA
// Se monta en el layout raíz de forma invisible
export function RegistradorSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error)
        })
    }
  }, [])

  return null
}
