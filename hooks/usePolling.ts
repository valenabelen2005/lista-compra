'use client'

import { useEffect, useRef } from 'react'

// Hook para hacer polling silencioso a la base de datos
// Llama al callback cada "intervaloMs" milisegundos
export function usePolling(callback: () => void, intervaloMs: number = 10000) {
  // Guardamos el callback en un ref para evitar re-crear el intervalo
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const intervalo = setInterval(() => {
      callbackRef.current()
    }, intervaloMs)

    return () => clearInterval(intervalo)
  }, [intervaloMs])
}
