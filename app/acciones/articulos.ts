'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RespuestaAccion } from '@/lib/tipos'

export async function obtenerArticulos(busqueda?: string) {
  const articulos = await prisma.articulo.findMany({
    where: busqueda
      ? {
          OR: [
            { nombre: { contains: busqueda, mode: 'insensitive' } },
            { categoria: { nombre: { contains: busqueda, mode: 'insensitive' } } },
            { tienda: { nombre: { contains: busqueda, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    orderBy: [{ categoria: { nombre: 'asc' } }, { nombre: 'asc' }],
    include: {
      categoria: true,
      tienda: true,
    },
  })
  return articulos
}

export async function obtenerArticuloPorCodigoBarras(codigoBarras: string) {
  return prisma.articulo.findFirst({
    where: { codigoBarras },
    include: { tienda: true },
  })
}

export async function crearArticulo(datos: {
  nombre: string
  precio: number
  cantidadPorDefecto: number
  categoriaId: number | null
  tiendaId: number | null
  codigoBarras: string | null
}): Promise<RespuestaAccion> {
  if (!datos.nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  await prisma.articulo.create({
    data: {
      nombre: datos.nombre.trim(),
      precio: datos.precio,
      cantidadPorDefecto: datos.cantidadPorDefecto,
      categoriaId: datos.categoriaId,
      tiendaId: datos.tiendaId,
      codigoBarras: datos.codigoBarras?.trim() || null,
    },
  })
  revalidatePath('/articulos')
  return { exito: true }
}

export async function actualizarArticulo(
  id: number,
  datos: {
    nombre: string
    precio: number
    cantidadPorDefecto: number
    categoriaId: number | null
    tiendaId: number | null
    codigoBarras: string | null
  }
): Promise<RespuestaAccion> {
  if (!datos.nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  await prisma.articulo.update({
    where: { id },
    data: {
      nombre: datos.nombre.trim(),
      precio: datos.precio,
      cantidadPorDefecto: datos.cantidadPorDefecto,
      categoriaId: datos.categoriaId,
      tiendaId: datos.tiendaId,
      codigoBarras: datos.codigoBarras?.trim() || null,
    },
  })
  revalidatePath('/articulos')
  return { exito: true }
}

export async function eliminarArticulo(id: number): Promise<RespuestaAccion> {
  const articulo = await prisma.articulo.findUnique({ where: { id } })
  if (articulo?.apuntado) {
    return {
      exito: false,
      error: 'No se puede eliminar: el artículo está en la lista de compra',
    }
  }

  await prisma.articulo.delete({ where: { id } })
  revalidatePath('/articulos')
  return { exito: true }
}
