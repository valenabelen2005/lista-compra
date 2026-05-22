'use client'

import { useState, useEffect } from 'react'
import { obtenerLista, finalizarCompra, anadirALista, marcarTachado, eliminarItemsLista, actualizarItemLista } from '@/app/acciones/lista'
import { toast } from 'sonner'
import { usePolling } from './usePolling'
import type { ItemListaCompleto } from '@/lib/tipos'

function sortPorCategoria(arr: ItemListaCompleto[]): ItemListaCompleto[] {
  return [...arr].sort((a, b) => {
    const catA = a.articulo.categoria?.nombre ?? 'zzz'
    const catB = b.articulo.categoria?.nombre ?? 'zzz'
    if (catA !== catB) return catA.localeCompare(catB, 'es')
    return a.articulo.nombre.localeCompare(b.articulo.nombre, 'es')
  })
}

function sortPorNombre(arr: ItemListaCompleto[]): ItemListaCompleto[] {
  return [...arr].sort((a, b) =>
    a.articulo.nombre.localeCompare(b.articulo.nombre, 'es')
  )
}

export function useLista(busqueda: string = '', tiendaId: number | null = null) {
  const [todosItems, setTodosItems] = useState<ItemListaCompleto[]>([])
  const [idsTachadosLocal, setIdsTachadosLocal] = useState<Set<number>>(new Set())
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    const datos = await obtenerLista(tiendaId, busqueda || undefined)
    const items = datos as ItemListaCompleto[]

    setTodosItems((prev) => {
      if (prev.length !== items.length) return items
      const sinCambios = items.every((item) => {
        const anterior = prev.find((p) => p.id === item.id)
        return anterior && anterior.tachado === item.tachado && anterior.cantidad === item.cantidad
      })
      return sinCambios ? prev : items
    })

    setIdsTachadosLocal((prev) => {
      const enBD = new Set(items.filter((i) => i.tachado).map((i) => i.id))
      if (prev.size !== enBD.size) return enBD
      const igual = [...enBD].every((id) => prev.has(id))
      return igual ? prev : enBD
    })

    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendaId, busqueda])

  usePolling(cargar)

  const toggleTachado = async (id: number) => {
    const estaTachado = idsTachadosLocal.has(id)

    if (estaTachado) {
      setIdsTachadosLocal((prev) => {
        const nuevo = new Set(prev)
        nuevo.delete(id)
        return nuevo
      })
      setTodosItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, tachado: false } : i))
      )
      await marcarTachado(id, false)
    } else {
      setIdsTachadosLocal((prev) => new Set([...prev, id]))
      setTodosItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, tachado: true } : i))
      )
      await marcarTachado(id, true)
    }
  }

  const finalizar = async (): Promise<boolean> => {
    const resultado = await finalizarCompra(tiendaId)
    if (resultado.exito) {
      toast.success('Compra finalizada correctamente')
      setIdsTachadosLocal(new Set())
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al finalizar la compra')
      return false
    }
  }

  const anadirItem = async (
    articuloId: number,
    tiendaId: number | null,
    cantidad: number
  ): Promise<boolean> => {
    const resultado = await anadirALista(articuloId, tiendaId, cantidad)
    if (resultado.exito) {
      cargar()
      return true
    }
    return false
  }

  const eliminarItem = async (id: number): Promise<boolean> => {
    const resultado = await eliminarItemsLista([id])
    if (resultado.exito) {
      toast.success('Artículo eliminado de la lista')
      cargar()
      return true
    }
    toast.error(resultado.error || 'Error al eliminar')
    return false
  }

  const editarItem = async (
    id: number,
    tiendaId: number | null,
    cantidad: number
  ): Promise<boolean> => {
    const resultado = await actualizarItemLista(id, tiendaId, cantidad)
    if (resultado.exito) {
      toast.success('Artículo actualizado')
      cargar()
      return true
    }
    toast.error(resultado.error || 'Error al actualizar')
    return false
  }

  const tachadosAnteriores = todosItems.filter(
    (i) => i.tachado && !idsTachadosLocal.has(i.id)
  )

  const noTachados = todosItems.filter(
    (i) => !i.tachado && !idsTachadosLocal.has(i.id)
  )

  const tachadosLocal = todosItems.filter((i) => idsTachadosLocal.has(i.id))

  const itemsVisibles: ItemListaCompleto[] = [
    ...sortPorCategoria(noTachados),
    ...sortPorNombre(tachadosLocal),
  ]

  const tachados = idsTachadosLocal
  const cantidadTachados = idsTachadosLocal.size + tachadosAnteriores.length

  const totalEsperado = todosItems.reduce(
    (acc, i) => acc + i.articulo.precio * i.cantidad,
    0
  )
  const totalHastaAhora = [...tachadosLocal, ...tachadosAnteriores].reduce(
    (acc, i) => acc + i.articulo.precio * i.cantidad,
    0
  )

  return {
    items: itemsVisibles,
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
    recargar: cargar,
  }
}
