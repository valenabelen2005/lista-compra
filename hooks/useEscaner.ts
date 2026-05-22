'use client'

import { useState, useEffect, useRef } from 'react'

// Hook para escanear códigos de barras usando la cámara del dispositivo
// Usa la API nativa BarcodeDetector (Chrome/Edge) o muestra un error si no está disponible
export function useEscaner(
  activo: boolean,
  modo: 'unico' | 'continuo' = 'continuo'
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [codigoDetectado, setCodigoDetectado] = useState<string | null>(null)
  const deteniendoRef = useRef(false)

  useEffect(() => {
    if (!activo) {
      deteniendoRef.current = true
      return
    }

    deteniendoRef.current = false
    setError(null)
    setCodigoDetectado(null)

    if (typeof window === 'undefined' || !('BarcodeDetector' in window)) {
      setError('Tu navegador no soporta el escáner. Usa Chrome o Edge en Android.')
      return
    }

    let stream: MediaStream | null = null
    let animacionId: number | null = null
    let ultimoCodigoTiempo = 0

    const iniciar = async () => {
      try {
        setCargando(true)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        if (videoRef.current && !deteniendoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        const detector = new BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'qr_code', 'code_128', 'code_39'],
        })

        setCargando(false)

        const escanear = async () => {
          if (deteniendoRef.current) return

          if (videoRef.current) {
            try {
              const codigos = await detector.detect(videoRef.current)
              if (codigos.length > 0) {
                const ahora = Date.now()
                // Debounce de 2 segundos para no repetir el mismo código
                if (ahora - ultimoCodigoTiempo > 2000) {
                  ultimoCodigoTiempo = ahora
                  setCodigoDetectado(codigos[0].rawValue)
                  if (modo === 'unico') {
                    deteniendoRef.current = true
                    return
                  }
                }
              }
            } catch {
              // El detector puede fallar con frames en negro, es normal
            }
          }

          animacionId = requestAnimationFrame(escanear)
        }

        animacionId = requestAnimationFrame(escanear)
      } catch {
        setError('No se pudo acceder a la cámara. Comprueba los permisos.')
        setCargando(false)
      }
    }

    iniciar()

    return () => {
      deteniendoRef.current = true
      if (animacionId) cancelAnimationFrame(animacionId)
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [activo, modo])

  const limpiarCodigo = () => setCodigoDetectado(null)

  return { videoRef, error, cargando, codigoDetectado, limpiarCodigo }
}
