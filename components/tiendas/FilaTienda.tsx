'use client'

import { Store, Pencil, Trash2 } from 'lucide-react'
import type { Tienda } from '@/lib/tipos'

interface FilaTiendaProps {
  tienda: Tienda
  onEditar: (tienda: Tienda) => void
  onEliminar: (id: number) => void
}

export function FilaTienda({ tienda, onEditar, onEliminar }: FilaTiendaProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
      <span className="flex items-center gap-2 font-medium text-gray-800">
        <Store size={16} className="text-gray-400" />
        {tienda.nombre}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(tienda)}
          title="Editar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onEliminar(tienda.id)}
          title="Eliminar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
