'use client'

import { useState, useEffect } from 'react'
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '@/app/acciones/categorias'
import { toast } from 'sonner'
import { usePolling } from './usePolling'
import type { Categoria } from '@/lib/tipos'

export function useCategorias(initialCategorias: Categoria[] = [], busqueda: string = '') {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias)
  const [cargando, setCargando] = useState(initialCategorias.length === 0)

  const cargar = async () => {
    const datos = await obtenerCategorias(busqueda || undefined)
    setCategorias(datos)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda])

  usePolling(cargar)

  const crear = async (nombre: string): Promise<boolean> => {
    const resultado = await crearCategoria(nombre)
    if (resultado.exito) {
      toast.success('Categoría creada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al crear la categoría')
      return false
    }
  }

  const actualizar = async (id: number, nombre: string): Promise<boolean> => {
    const resultado = await actualizarCategoria(id, nombre)
    if (resultado.exito) {
      toast.success('Categoría actualizada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al actualizar la categoría')
      return false
    }
  }

  const eliminar = async (id: number): Promise<boolean> => {
    const resultado = await eliminarCategoria(id)
    if (resultado.exito) {
      toast.success('Categoría eliminada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al eliminar la categoría')
      return false
    }
  }

  return { categorias, cargando, crear, actualizar, eliminar }
}
