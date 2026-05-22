'use client'

import { useState, useEffect } from 'react'
import { useEscaner } from '@/hooks/useEscaner'
import { obtenerArticuloPorCodigoBarras } from '@/app/acciones/articulos'
import { toast } from 'sonner'
import { ModalBase } from '@/components/ui/ModalBase'
import { ModalConfirmacion } from '@/components/ui/ModalConfirmacion'
import type { Tienda } from '@/lib/tipos'

interface ModalEscanearListaProps {
  abierto: boolean
  tiendas: Tienda[]
  onAnadirItem: (articuloId: number, tiendaId: number | null, cantidad: number) => Promise<boolean>
  onCerrar: () => void
}

// Modal de escáner continuo para añadir artículos a la lista desde la vista Lista
// Escanea continuamente y añade artículos automáticamente
export function ModalEscanearLista({
  abierto,
  onAnadirItem,
  onCerrar,
}: ModalEscanearListaProps) {
  const { videoRef, error, cargando, codigoDetectado, limpiarCodigo } = useEscaner(
    abierto,
    'continuo'
  )

  const [articulosAnadidos, setArticulosAnadidos] = useState<string[]>([])
  const [preguntarAniadir, setPreguntarAniadir] = useState(false)
  const [codigoNoEncontrado, setCodigoNoEncontrado] = useState('')

  // Procesar cada código detectado
  useEffect(() => {
    if (!codigoDetectado || !abierto) return

    const procesar = async () => {
      const articulo = await obtenerArticuloPorCodigoBarras(codigoDetectado)

      if (articulo) {
        const exito = await onAnadirItem(
          articulo.id,
          articulo.tiendaId,
          articulo.cantidadPorDefecto
        )
        if (exito) {
          setArticulosAnadidos((prev) => [
            `✓ ${articulo.nombre} (x${articulo.cantidadPorDefecto})`,
            ...prev.slice(0, 4),
          ])
          toast.success(`Añadido: ${articulo.nombre}`)
        }
      } else {
        setCodigoNoEncontrado(codigoDetectado)
        setPreguntarAniadir(true)
      }

      limpiarCodigo()
    }

    procesar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoDetectado])

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!abierto) {
      setArticulosAnadidos([])
      setPreguntarAniadir(false)
      setCodigoNoEncontrado('')
    }
  }, [abierto])

  return (
    <>
      <ModalBase abierto={abierto && !preguntarAniadir} onCerrar={onCerrar} titulo="Añadir rápido con escáner">
        <div className="flex flex-col gap-4">
          {error ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          ) : (
            <>
              {cargando && (
                <p className="text-center text-sm text-gray-500">Iniciando cámara...</p>
              )}

              {/* Visor de cámara */}
              <div className="relative overflow-hidden rounded-xl bg-black">
                <video ref={videoRef} className="w-full" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-56 rounded-lg border-2 border-green-400 opacity-70" />
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Apunta a los productos para añadirlos automáticamente
              </p>

              {/* Registro de artículos añadidos */}
              {articulosAnadidos.length > 0 && (
                <div className="rounded-xl bg-green-50 px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-green-700">Artículos añadidos:</p>
                  {articulosAnadidos.map((texto, i) => (
                    <p key={i} className="text-sm text-green-800">
                      {texto}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          <button
            onClick={onCerrar}
            className="w-full rounded-xl bg-gray-800 py-2.5 font-medium text-white hover:bg-gray-900"
          >
            Finalizar
          </button>
        </div>
      </ModalBase>

      {/* Modal: artículo no encontrado, preguntar si se quiere crear */}
      <ModalConfirmacion
        abierto={preguntarAniadir}
        titulo="Artículo no encontrado"
        mensaje={`El código "${codigoNoEncontrado}" no existe en tu lista de artículos. ¿Quieres ir a crearla?`}
        textoConfirmar="Ir a Artículos"
        textoCancelar="Ignorar"
        onConfirmar={() => {
          setPreguntarAniadir(false)
          limpiarCodigo()
          onCerrar()
          window.location.href = '/articulos'
        }}
        onCancelar={() => {
          setPreguntarAniadir(false)
          limpiarCodigo()
        }}
      />
    </>
  )
}
