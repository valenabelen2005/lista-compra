'use client'

import { Pencil, Trash2 } from 'lucide-react'
import type { Categoria } from '@/lib/tipos'

interface FilaCategoriaProps {
  categoria: Categoria
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

// Fila de categoría en la tabla
export function FilaCategoria({ categoria, onEditar, onEliminar }: FilaCategoriaProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
      <span className="font-medium text-gray-800">{categoria.nombre}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(categoria)}
          title="Editar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onEliminar(categoria.id)}
          title="Eliminar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
