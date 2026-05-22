'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RespuestaAccion } from '@/lib/tipos'

export async function obtenerTiendas(busqueda?: string) {
  const tiendas = await prisma.tienda.findMany({
    where: busqueda ? { nombre: { contains: busqueda, mode: 'insensitive' } } : undefined,
    orderBy: { nombre: 'asc' },
  })
  return tiendas
}

export async function crearTienda(nombre: string): Promise<RespuestaAccion> {
  if (!nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  const yaExiste = await prisma.tienda.findUnique({ where: { nombre: nombre.trim() } })
  if (yaExiste) {
    return { exito: false, error: 'Ya existe una tienda con ese nombre' }
  }

  await prisma.tienda.create({ data: { nombre: nombre.trim() } })
  revalidatePath('/tiendas')
  return { exito: true }
}

export async function actualizarTienda(id: number, nombre: string): Promise<RespuestaAccion> {
  if (!nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  const yaExiste = await prisma.tienda.findFirst({
    where: { nombre: nombre.trim(), NOT: { id } },
  })
  if (yaExiste) {
    return { exito: false, error: 'Ya existe una tienda con ese nombre' }
  }

  await prisma.tienda.update({ where: { id }, data: { nombre: nombre.trim() } })
  revalidatePath('/tiendas')
  return { exito: true }
}

export async function eliminarTienda(id: number): Promise<RespuestaAccion> {
  const enUso = await prisma.listaCompraItem.findFirst({ where: { tiendaId: id } })
  if (enUso) {
    return {
      exito: false,
      error: 'No se puede eliminar: esta tienda tiene artículos en la lista de compra',
    }
  }

  await prisma.tienda.delete({ where: { id } })
  revalidatePath('/tiendas')
  return { exito: true }
}
