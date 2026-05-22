'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, Barcode } from 'lucide-react'
import { useLista } from '@/hooks/useLista'
import { useTiendas } from '@/hooks/useTiendas'
import { BuscadorInput } from '@/components/ui/BuscadorInput'
import { Cargando } from '@/components/ui/Cargando'
import { ModalConfirmacion } from '@/components/ui/ModalConfirmacion'
import { ItemLista } from './ItemLista'
import { FooterLista } from './FooterLista'
import { ModalEscanearLista } from './ModalEscanearLista'
import { ModalEditarItem } from './ModalEditarItem'
import type { ItemListaCompleto } from '@/lib/tipos'

interface Props {
  tiendaId: number | null
}

export function VistaLista({ tiendaId }: Props) {
  const busqueda = useSearchParams().get('q') ?? ''
  const router = useRouter()
  const { tiendas } = useTiendas()
  const {
    items,
    tachados,
    cantidadTachados,
    toggleTachado,
    finalizar,
    anadirItem,
    eliminarItem,
    editarItem,
    cargando,
    totalEsperado,
    totalHastaAhora,
  } = useLista(busqueda, tiendaId)

  const [escanerAbierto, setEscanerAbierto] = useState(false)
  const [confirmarFinalizar, setConfirmarFinalizar] = useState(false)
  const [itemEditar, setItemEditar] = useState<ItemListaCompleto | null>(null)
  const [idEliminar, setIdEliminar] = useState<number | null>(null)

  const manejarCambioTienda = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? Number(e.target.value) : null
    if (!id) {
      router.push('/lista')
    } else {
      const tienda = tiendas.find((t) => t.id === id)
      if (tienda) router.push(`/lista/${encodeURIComponent(tienda.nombre)}`)
    }
  }

  const manejarFinalizar = async () => {
    await finalizar()
    setConfirmarFinalizar(false)
  }

  const manejarEliminar = async () => {
    if (idEliminar === null) return
    await eliminarItem(idEliminar)
    setIdEliminar(null)
  }

  return (
    <>
      <div className="flex flex-col gap-3 pb-44 sm:pb-36">
        <div className="flex flex-col gap-2">
          {/* Filtro de tienda — navega a /lista/[slug] al seleccionar */}
          <select
            value={tiendaId ?? ''}
            onChange={manejarCambioTienda}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">Todas las tiendas</option>
            {tiendas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          <BuscadorInput placeholder="Buscar en la lista..." />

          <div className="flex gap-2">
            <Link
              href="/articulos"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Package size={16} /> <span>Añadir artículos</span>
            </Link>
            <button
              onClick={() => setEscanerAbierto(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-800 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
            >
              <Barcode size={16} /> <span>Añadir rápido</span>
            </button>
          </div>
        </div>

        {cargando ? (
          <Cargando />
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {busqueda
              ? 'Sin resultados para tu búsqueda'
              : 'La lista está vacía. ¡Añade artículos!'}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <ItemLista
                key={item.id}
                item={item}
                tachado={tachados.has(item.id)}
                onToggle={toggleTachado}
                onEditar={setItemEditar}
                onEliminar={setIdEliminar}
              />
            ))}
          </div>
        )}
      </div>

      <FooterLista
        totalEsperado={totalEsperado}
        totalHastaAhora={totalHastaAhora}
        cantidadTachados={cantidadTachados}
        onFinalizar={() => setConfirmarFinalizar(true)}
      />

      <ModalEscanearLista
        abierto={escanerAbierto}
        tiendas={tiendas}
        onAnadirItem={anadirItem}
        onCerrar={() => setEscanerAbierto(false)}
      />

      <ModalConfirmacion
        abierto={confirmarFinalizar}
        titulo="Finalizar compra"
        mensaje={`¿Quieres finalizar la compra? Se eliminarán ${cantidadTachados} artículo${cantidadTachados !== 1 ? 's' : ''} marcado${cantidadTachados !== 1 ? 's' : ''} de la lista.`}
        textoConfirmar="Sí, finalizar"
        onConfirmar={manejarFinalizar}
        onCancelar={() => setConfirmarFinalizar(false)}
      />

      <ModalEditarItem
        abierto={itemEditar !== null}
        item={itemEditar}
        tiendas={tiendas}
        onGuardar={editarItem}
        onCerrar={() => setItemEditar(null)}
      />

      <ModalConfirmacion
        abierto={idEliminar !== null}
        titulo="Eliminar de la lista"
        mensaje="¿Seguro que quieres eliminar este artículo de la lista?"
        textoConfirmar="Eliminar"
        peligroso
        onConfirmar={manejarEliminar}
        onCancelar={() => setIdEliminar(null)}
      />
    </>
  )
}
