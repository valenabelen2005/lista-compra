'use client'

import { useState, useEffect } from 'react'
import { ModalBase } from '@/components/ui/ModalBase'
import type { ItemListaCompleto, Tienda } from '@/lib/tipos'

interface ModalEditarItemProps {
  abierto: boolean
  item: ItemListaCompleto | null
  tiendas: Tienda[]
  onGuardar: (id: number, tiendaId: number | null, cantidad: number) => Promise<boolean>
  onCerrar: () => void
}

export function ModalEditarItem({ abierto, item, tiendas, onGuardar, onCerrar }: ModalEditarItemProps) {
  const [cantidad, setCantidad] = useState(1)
  const [tiendaId, setTiendaId] = useState<number | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (abierto && item) {
      setCantidad(item.cantidad)
      setTiendaId(item.tiendaId)
    }
  }, [abierto, item])

  const manejarGuardar = async () => {
    if (!item) return
    setGuardando(true)
    const exito = await onGuardar(item.id, tiendaId, cantidad)
    setGuardando(false)
    if (exito) onCerrar()
  }

  if (!item) return null

  return (
    <ModalBase abierto={abierto} onCerrar={onCerrar} titulo="Editar artículo en lista">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-gray-50 px-4 py-3">
          <p className="font-semibold text-gray-800">{item.articulo.nombre}</p>
        </div>

        {/* Cantidad */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Cantidad</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad((v) => Math.max(1, v - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-xl font-bold text-gray-600 hover:bg-gray-100"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-center focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <button
              onClick={() => setCantidad((v) => v + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-xl font-bold text-green-600 hover:bg-green-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Tienda */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tienda</label>
          <select
            value={tiendaId ?? ''}
            onChange={(e) => setTiendaId(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">Sin tienda</option>
            {tiendas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={manejarGuardar}
          disabled={guardando}
          className="w-full rounded-xl bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </ModalBase>
  )
}
