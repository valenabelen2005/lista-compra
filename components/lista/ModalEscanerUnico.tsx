'use client'

import { useEscaner } from '@/hooks/useEscaner'
import { ModalBase } from '@/components/ui/ModalBase'

interface ModalEscanerUnicoProps {
  abierto: boolean
  onCodigo: (codigo: string) => void
  onCerrar: () => void
}

// Modal para escanear UN SOLO código de barras (usado en el formulario de artículo)
export function ModalEscanerUnico({ abierto, onCodigo, onCerrar }: ModalEscanerUnicoProps) {
  const { videoRef, error, cargando, codigoDetectado } = useEscaner(abierto, 'unico')

  // Cuando se detecta un código, lo entregamos al padre
  if (codigoDetectado && abierto) {
    onCodigo(codigoDetectado)
  }

  return (
    <ModalBase abierto={abierto} onCerrar={onCerrar} titulo="Escanear código de barras">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <>
            {cargando && (
              <p className="text-sm text-gray-500">Iniciando cámara...</p>
            )}
            <div className="relative w-full overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                className="w-full"
                muted
                playsInline
              />
              {/* Guía de encuadre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-64 rounded-lg border-2 border-green-400 opacity-70" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Apunta la cámara al código de barras del producto
            </p>
          </>
        )}
      </div>
    </ModalBase>
  )
}
