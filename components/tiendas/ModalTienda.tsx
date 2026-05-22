'use client'

import { useState, useEffect } from 'react'
import { ModalBase } from '@/components/ui/ModalBase'
import type { Tienda } from '@/lib/tipos'

interface ModalTiendaProps {
  abierto: boolean
  tiendaEditar: Tienda | null
  onGuardar: (nombre: string) => Promise<boolean>
  onCerrar: () => void
}

export function ModalTienda({ abierto, tiendaEditar, onGuardar, onCerrar }: ModalTiendaProps) {
  const [nombre, setNombre] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (abierto) {
      setNombre(tiendaEditar?.nombre ?? '')
    }
  }, [abierto, tiendaEditar])

  const manejarGuardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    const exito = await onGuardar(nombre)
    setGuardando(false)
    if (exito) onCerrar()
  }

  return (
    <ModalBase
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={tiendaEditar ? 'Editar tienda' : 'Nueva tienda'}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && manejarGuardar()}
            placeholder="Ej: Mercadona"
            autoFocus
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
        <button
          onClick={manejarGuardar}
          disabled={!nombre.trim() || guardando}
          className="w-full rounded-xl bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </ModalBase>
  )
}
