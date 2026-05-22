'use client'

import { useState, useEffect } from 'react'
import {
  obtenerArticulos,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo,
} from '@/app/acciones/articulos'
import { anadirArticuloRapido, anadirALista } from '@/app/acciones/lista'
import { toast } from 'sonner'
import { usePolling } from './usePolling'
import type { Articulo } from '@/lib/tipos'

export function useArticulos(initialArticulos: Articulo[] = [], busqueda: string = '') {
  const [articulos, setArticulos] = useState<Articulo[]>(initialArticulos)
  const [cargando, setCargando] = useState(initialArticulos.length === 0)

  const cargar = async () => {
    const datos = await obtenerArticulos(busqueda || undefined)
    setArticulos(datos as Articulo[])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda])

  usePolling(cargar)

  const crear = async (datos: {
    nombre: string
    precio: number
    cantidadPorDefecto: number
    categoriaId: number | null
    tiendaId: number | null
    codigoBarras: string | null
  }): Promise<boolean> => {
    const resultado = await crearArticulo(datos)
    if (resultado.exito) {
      toast.success('Artículo creado correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al crear el artículo')
      return false
    }
  }

  const actualizar = async (
    id: number,
    datos: {
      nombre: string
      precio: number
      cantidadPorDefecto: number
      categoriaId: number | null
      tiendaId: number | null
      codigoBarras: string | null
    }
  ): Promise<boolean> => {
    const resultado = await actualizarArticulo(id, datos)
    if (resultado.exito) {
      toast.success('Artículo actualizado correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al actualizar el artículo')
      return false
    }
  }

  const eliminar = async (id: number): Promise<boolean> => {
    const resultado = await eliminarArticulo(id)
    if (resultado.exito) {
      toast.success('Artículo eliminado correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al eliminar el artículo')
      return false
    }
  }

  const anadirRapido = async (id: number): Promise<boolean> => {
    const resultado = await anadirArticuloRapido(id)
    if (resultado.exito) {
      toast.success('Artículo añadido a la lista')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al añadir a la lista')
      return false
    }
  }

  const anadirConOpciones = async (
    articuloId: number,
    tiendaId: number | null,
    cantidad: number
  ): Promise<boolean> => {
    const resultado = await anadirALista(articuloId, tiendaId, cantidad)
    if (resultado.exito) {
      toast.success('Artículo añadido a la lista')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al añadir a la lista')
      return false
    }
  }

  return { articulos, cargando, crear, actualizar, eliminar, anadirRapido, anadirConOpciones }
}
