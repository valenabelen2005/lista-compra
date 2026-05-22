'use client'

import { useState, useEffect } from 'react'
import {
  obtenerTiendas,
  crearTienda,
  actualizarTienda,
  eliminarTienda,
} from '@/app/acciones/tiendas'
import { toast } from 'sonner'
import { usePolling } from './usePolling'
import type { Tienda } from '@/lib/tipos'

export function useTiendas(initialTiendas: Tienda[] = [], busqueda: string = '') {
  const [tiendas, setTiendas] = useState<Tienda[]>(initialTiendas)
  const [cargando, setCargando] = useState(initialTiendas.length === 0)

  const cargar = async () => {
    const datos = await obtenerTiendas(busqueda || undefined)
    setTiendas(datos)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda])

  usePolling(cargar)

  const crear = async (nombre: string): Promise<boolean> => {
    const resultado = await crearTienda(nombre)
    if (resultado.exito) {
      toast.success('Tienda creada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al crear la tienda')
      return false
    }
  }

  const actualizar = async (id: number, nombre: string): Promise<boolean> => {
    const resultado = await actualizarTienda(id, nombre)
    if (resultado.exito) {
      toast.success('Tienda actualizada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al actualizar la tienda')
      return false
    }
  }

  const eliminar = async (id: number): Promise<boolean> => {
    const resultado = await eliminarTienda(id)
    if (resultado.exito) {
      toast.success('Tienda eliminada correctamente')
      cargar()
      return true
    } else {
      toast.error(resultado.error || 'Error al eliminar la tienda')
      return false
    }
  }

  return { tiendas, cargando, crear, actualizar, eliminar }
}
