'use client'

import clsx from 'clsx'
import { Check, Pencil, Trash2 } from 'lucide-react'
import type { ItemListaCompleto } from '@/lib/tipos'

interface ItemListaProps {
  item: ItemListaCompleto
  tachado: boolean
  onToggle: (id: number) => void
  onEditar: (item: ItemListaCompleto) => void
  onEliminar: (id: number) => void
}

export function ItemLista({ item, tachado, onToggle, onEditar, onEliminar }: ItemListaProps) {
  return (
    <div
      className={clsx(
        'flex w-full items-center gap-2 rounded-xl border px-3 py-3 transition-all',
        tachado ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-200 bg-white'
      )}
    >
      <button onClick={() => onToggle(item.id)} className="flex flex-1 items-center gap-3 text-left">
        <span
          className={clsx(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
            tachado ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
          )}
        >
          {tachado ? <Check size={14} strokeWidth={3} /> : null}
        </span>

        <div className="flex-1">
          <span className={clsx('block font-medium', tachado ? 'text-gray-400 line-through' : 'text-gray-800')}>
            {item.articulo.nombre}
            {item.cantidad > 1 && (
              <span className="ml-1.5 text-sm font-normal text-gray-500">x{item.cantidad}</span>
            )}
          </span>
          <div className="flex gap-2 text-xs text-gray-400">
            {item.articulo.categoria && <span>{item.articulo.categoria.nombre}</span>}
            {item.tienda && <span>· {item.tienda.nombre}</span>}
            {item.articulo.precio > 0 && <span>· {item.articulo.precio.toFixed(2)} €/ud</span>}
          </div>
        </div>

        {item.articulo.precio > 0 && (
          <span className={clsx('shrink-0 text-sm font-medium', tachado ? 'text-gray-400' : 'text-gray-600')}>
            {(item.articulo.precio * item.cantidad).toFixed(2)} €
          </span>
        )}
      </button>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onEditar(item)}
          title="Editar"
          className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-blue-500"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onEliminar(item.id)}
          title="Eliminar de la lista"
          className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-red-500"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
