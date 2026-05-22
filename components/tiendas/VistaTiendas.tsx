'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTiendas } from '@/hooks/useTiendas'
import { BuscadorInput } from '@/components/ui/BuscadorInput'
import { Cargando } from '@/components/ui/Cargando'
import { ModalTienda } from './ModalTienda'
import { FilaTienda } from './FilaTienda'
import { ModalConfirmacion } from '@/components/ui/ModalConfirmacion'
import type { Tienda } from '@/lib/tipos'

interface Props {
  tiendas: Tienda[]
}

export function VistaTiendas({ tiendas: initialTiendas }: Props) {
  const busqueda = useSearchParams().get('q') ?? ''
  const { tiendas, cargando, crear, actualizar, eliminar } = useTiendas(initialTiendas, busqueda)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [tiendaEditar, setTiendaEditar] = useState<Tienda | null>(null)
  const [idEliminar, setIdEliminar] = useState<number | null>(null)

  const abrirCrear = () => {
    setTiendaEditar(null)
    setModalAbierto(true)
  }

  const abrirEditar = (tienda: Tienda) => {
    setTiendaEditar(tienda)
    setModalAbierto(true)
  }

  const manejarGuardar = async (nombre: string): Promise<boolean> => {
    if (tiendaEditar) return actualizar(tiendaEditar.id, nombre)
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
          <BuscadorInput placeholder="Buscar tienda..." />
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
      ) : tiendas.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          {busqueda ? 'Sin resultados' : 'No hay tiendas. ¡Crea la primera!'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tiendas.map((tienda) => (
            <FilaTienda
              key={tienda.id}
              tienda={tienda}
              onEditar={abrirEditar}
              onEliminar={(id) => setIdEliminar(id)}
            />
          ))}
        </div>
      )}

      <ModalTienda
        abierto={modalAbierto}
        tiendaEditar={tiendaEditar}
        onGuardar={manejarGuardar}
        onCerrar={() => setModalAbierto(false)}
      />

      <ModalConfirmacion
        abierto={idEliminar !== null}
        titulo="Eliminar tienda"
        mensaje="¿Seguro que quieres eliminar esta tienda? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        peligroso
        onConfirmar={manejarEliminar}
        onCancelar={() => setIdEliminar(null)}
      />
    </div>
  )
}
