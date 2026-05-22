'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Lightbulb, Plus } from 'lucide-react'
import { useArticulos } from '@/hooks/useArticulos'
import { useTiendas } from '@/hooks/useTiendas'
import { useCategorias } from '@/hooks/useCategorias'
import { BuscadorInput } from '@/components/ui/BuscadorInput'
import { Cargando } from '@/components/ui/Cargando'
import { ModalConfirmacion } from '@/components/ui/ModalConfirmacion'
import { FilaArticulo } from './FilaArticulo'
import { ModalArticulo } from './ModalArticulo'
import { ModalAnadirALista } from './ModalAnadirALista'
import type { Articulo } from '@/lib/tipos'

interface Props {
  articulos: Articulo[]
}

export function VistaArticulos({ articulos: initialArticulos }: Props) {
  const busqueda = useSearchParams().get('q') ?? ''
  const { articulos, cargando, crear, actualizar, eliminar, anadirRapido, anadirConOpciones } =
    useArticulos(initialArticulos, busqueda)
  const { tiendas } = useTiendas()
  const { categorias } = useCategorias()

  const [modalArticuloAbierto, setModalArticuloAbierto] = useState(false)
  const [articuloEditar, setArticuloEditar] = useState<Articulo | null>(null)
  const [articuloAnadir, setArticuloAnadir] = useState<Articulo | null>(null)
  const [idEliminar, setIdEliminar] = useState<number | null>(null)

  const abrirCrear = () => {
    setArticuloEditar(null)
    setModalArticuloAbierto(true)
  }

  const abrirEditar = (articulo: Articulo) => {
    setArticuloEditar(articulo)
    setModalArticuloAbierto(true)
  }

  const manejarGuardar = async (datos: {
    nombre: string
    precio: number
    cantidadPorDefecto: number
    categoriaId: number | null
    tiendaId: number | null
    codigoBarras: string | null
  }): Promise<boolean> => {
    if (articuloEditar) return actualizar(articuloEditar.id, datos)
    return crear(datos)
  }

  const manejarEliminar = async () => {
    if (idEliminar === null) return
    await eliminar(idEliminar)
    setIdEliminar(null)
  }

  const manejarClickArticulo = async (articulo: Articulo) => {
    await anadirRapido(articulo.id)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <BuscadorInput placeholder="Buscar artículo..." />
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <span>+</span>
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      <p className="flex items-start gap-1.5 text-xs text-gray-400">
        <Lightbulb size={14} className="mt-0.5 shrink-0" />
        <span>
          Toca un artículo para añadirlo directamente con valores por defecto. Usa{' '}
          <Plus size={12} className="inline align-middle" /> para elegir cantidad y tienda.
        </span>
      </p>

      {cargando ? (
        <Cargando />
      ) : articulos.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          {busqueda ? 'Sin resultados' : 'No hay artículos. ¡Crea el primero!'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {articulos.map((articulo) => (
            <FilaArticulo
              key={articulo.id}
              articulo={articulo}
              onClickArticulo={manejarClickArticulo}
              onEditar={abrirEditar}
              onEliminar={(id) => setIdEliminar(id)}
              onAnadirConOpciones={(a) => setArticuloAnadir(a)}
            />
          ))}
        </div>
      )}

      <ModalArticulo
        abierto={modalArticuloAbierto}
        articuloEditar={articuloEditar}
        categorias={categorias}
        tiendas={tiendas}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalArticuloAbierto(false)}
      />

      <ModalAnadirALista
        abierto={articuloAnadir !== null}
        articulo={articuloAnadir}
        tiendas={tiendas}
        onAnadir={anadirConOpciones}
        onCerrar={() => setArticuloAnadir(null)}
      />

      <ModalConfirmacion
        abierto={idEliminar !== null}
        titulo="Eliminar artículo"
        mensaje="¿Seguro que quieres eliminar este artículo? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        peligroso
        onConfirmar={manejarEliminar}
        onCancelar={() => setIdEliminar(null)}
      />
    </div>
  )
}
