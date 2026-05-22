'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCategorias } from '@/hooks/useCategorias'
import { BuscadorInput } from '@/components/ui/BuscadorInput'
import { Cargando } from '@/components/ui/Cargando'
import { ModalCategoria } from './ModalCategoria'
import { FilaCategoria } from './FilaCategoria'
import { ModalConfirmacion } from '@/components/ui/ModalConfirmacion'
import type { Categoria } from '@/lib/tipos'

interface Props {
  categorias: Categoria[]
}

export function VistaCategorias({ categorias: initialCategorias }: Props) {
  const busqueda = useSearchParams().get('q') ?? '';
  const { categorias, cargando, crear, actualizar, eliminar } = useCategorias(initialCategorias, busqueda)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null)
  const [idEliminar, setIdEliminar] = useState<number | null>(null)

  const abrirCrear = () => {
    setCategoriaEditar(null)
    setModalAbierto(true)
  }

  const abrirEditar = (categoria: Categoria) => {
    setCategoriaEditar(categoria)
    setModalAbierto(true)
  }

  const manejarGuardar = async (nombre: string): Promise<boolean> => {
    if (categoriaEditar) {
      return actualizar(categoriaEditar.id, nombre)
    }
    return crear(nombre)
  }

  const manejarEliminar = async () => {
    if (idEliminar === null) return
    await eliminar(idEliminar)
    setIdEliminar(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <BuscadorInput placeholder="Buscar categoría..." />
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <span>+</span>
          <span className="hidden sm:inline">Nueva</span>
        </button>
      </div>

      {cargando ? (
        <Cargando />
      ) : categorias.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          {busqueda ? 'Sin resultados' : 'No hay categorías. ¡Crea la primera!'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {categorias.map((categoria) => (
            <FilaCategoria
              key={categoria.id}
              categoria={categoria}
              onEditar={abrirEditar}
              onEliminar={(id) => setIdEliminar(id)}
            />
          ))}
        </div>
      )}

      <ModalCategoria
        abierto={modalAbierto}
        categoriaEditar={categoriaEditar}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalAbierto(false)}
      />

      <ModalConfirmacion
        abierto={idEliminar !== null}
        titulo="Eliminar categoría"
        mensaje="¿Seguro que quieres eliminar esta categoría? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        peligroso
        onConfirmar={manejarEliminar}
        onCancelar={() => setIdEliminar(null)}
      />
    </div>
  )
}
