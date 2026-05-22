'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalBaseProps {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  children: React.ReactNode
}

// Modal base reutilizable con overlay y animación
export function ModalBase({ abierto, onCerrar, titulo, children }: ModalBaseProps) {
  const fondoRef = useRef<HTMLDivElement>(null)

  // Cerrar con la tecla Escape
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    if (abierto) {
      document.addEventListener('keydown', manejarTecla)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', manejarTecla)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      ref={fondoRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => {
        if (e.target === fondoRef.current) onCerrar()
      }}
    >
      <div className="w-full max-w-lg rounded-t-2xl bg-white sm:rounded-2xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        {/* Contenido */}
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
