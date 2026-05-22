'use client'

import { Tag, Store, Barcode, Plus, Pencil, Trash2 } from 'lucide-react'
import type { Articulo } from '@/lib/tipos'

interface FilaArticuloProps {
  articulo: Articulo
  onClickArticulo: (articulo: Articulo) => void
  onEditar: (articulo: Articulo) => void
  onEliminar: (id: number) => void
  onAnadirConOpciones: (articulo: Articulo) => void
}

// Fila de artículo en la lista de artículos
// - Clic en el artículo: añadir rápido a la lista con valores por defecto
// - Botón "+": abre modal para elegir cantidad y tienda
// - Botón "✏️": editar artículo
// - Botón "🗑️": eliminar artículo
export function FilaArticulo({
  articulo,
  onClickArticulo,
  onEditar,
  onEliminar,
  onAnadirConOpciones,
}: FilaArticuloProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
      {/* Información del artículo - clic para añadir rápido */}
      <button
        onClick={() => onClickArticulo(articulo)}
        className="flex flex-1 items-start gap-2 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{articulo.nombre}</span>
            {articulo.apuntado && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                En lista
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-500">
            {articulo.categoria && (
              <span className="flex items-center gap-1">
                <Tag size={11} />
                {articulo.categoria.nombre}
              </span>
            )}
            {articulo.tienda && (
              <span className="flex items-center gap-1">
                <Store size={11} />
                {articulo.tienda.nombre}
              </span>
            )}
            {articulo.precio > 0 && <span>{articulo.precio.toFixed(2)} €</span>}
            {articulo.codigoBarras && (
              <span className="flex items-center gap-1 font-mono">
                <Barcode size={11} />
                {articulo.codigoBarras}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onAnadirConOpciones(articulo)}
          title="Añadir a lista con opciones"
          className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => onEditar(articulo)}
          title="Editar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onEliminar(articulo.id)}
          title="Eliminar"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
