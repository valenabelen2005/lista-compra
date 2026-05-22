'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RespuestaAccion } from '@/lib/tipos'

// Devuelve TODOS los items de la lista (tachados y no tachados)
// ordenados: primero por categoría, luego por nombre
export async function obtenerLista(tiendaId: number | null = null, busqueda?: string) {
  const items = await prisma.listaCompraItem.findMany({
    where: {
      ...(tiendaId ? { tiendaId } : {}),
      ...(busqueda
        ? {
            OR: [
              {
                articulo: {
                  OR: [
                    { nombre: { contains: busqueda, mode: 'insensitive' } },
                    { categoria: { nombre: { contains: busqueda, mode: 'insensitive' } } },
                  ],
                },
              },
              { tienda: { nombre: { contains: busqueda, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
    include: {
      articulo: {
        include: { categoria: true },
      },
      tienda: true,
    },
    orderBy: [
      { articulo: { categoria: { nombre: 'asc' } } },
      { articulo: { nombre: 'asc' } },
    ],
  })
  return items
}

export async function anadirALista(
  articuloId: number,
  tiendaId: number | null,
  cantidad: number
): Promise<RespuestaAccion> {
  if (cantidad < 1) {
    return { exito: false, error: 'La cantidad debe ser al menos 1' }
  }

  const itemExistente = await prisma.listaCompraItem.findFirst({
    where: { articuloId, tiendaId },
  })

  if (itemExistente) {
    await prisma.listaCompraItem.update({
      where: { id: itemExistente.id },
      data: { cantidad: itemExistente.cantidad + cantidad },
    })
  } else {
    await prisma.listaCompraItem.create({
      data: { articuloId, tiendaId, cantidad },
    })
  }

  await prisma.articulo.update({
    where: { id: articuloId },
    data: { apuntado: true },
  })

  revalidatePath('/lista')
  return { exito: true }
}

export async function anadirArticuloRapido(articuloId: number): Promise<RespuestaAccion> {
  const articulo = await prisma.articulo.findUnique({ where: { id: articuloId } })
  if (!articulo) {
    return { exito: false, error: 'Artículo no encontrado' }
  }

  const itemExistente = await prisma.listaCompraItem.findFirst({
    where: { articuloId, tiendaId: articulo.tiendaId },
  })

  if (itemExistente) {
    await prisma.listaCompraItem.update({
      where: { id: itemExistente.id },
      data: { cantidad: itemExistente.cantidad + articulo.cantidadPorDefecto },
    })
  } else {
    await prisma.listaCompraItem.create({
      data: {
        articuloId,
        tiendaId: articulo.tiendaId,
        cantidad: articulo.cantidadPorDefecto,
      },
    })
  }

  await prisma.articulo.update({
    where: { id: articuloId },
    data: { apuntado: true },
  })

  revalidatePath('/lista')
  return { exito: true }
}

export async function actualizarItemLista(
  id: number,
  tiendaId: number | null,
  cantidad: number
): Promise<RespuestaAccion> {
  if (cantidad < 1) {
    return { exito: false, error: 'La cantidad debe ser al menos 1' }
  }
  await prisma.listaCompraItem.update({
    where: { id },
    data: { tiendaId, cantidad },
  })
  revalidatePath('/lista')
  return { exito: true }
}

// Marca o desmarca un item de la lista como tachado en la base de datos
export async function marcarTachado(id: number, tachado: boolean): Promise<RespuestaAccion> {
  await prisma.listaCompraItem.update({
    where: { id },
    data: { tachado },
  })
  return { exito: true }
}

// Elimina todos los items tachados (tachado=true) del filtro de tienda dado
// y actualiza el campo "apuntado" de los artículos correspondientes
export async function finalizarCompra(tiendaId: number | null = null): Promise<RespuestaAccion> {
  const filtro = {
    tachado: true,
    ...(tiendaId ? { tiendaId } : {}),
  }

  // Obtener articuloIds antes de eliminar
  const itemsAEliminar = await prisma.listaCompraItem.findMany({
    where: filtro,
    select: { articuloId: true },
  })

  if (itemsAEliminar.length === 0) {
    return { exito: false, error: 'No hay artículos marcados para finalizar' }
  }

  await prisma.listaCompraItem.deleteMany({ where: filtro })

  // Actualizar "apuntado" para cada artículo cuya última lista haya desaparecido
  const articuloIds = [...new Set(itemsAEliminar.map((i) => i.articuloId))]
  for (const articuloId of articuloIds) {
    const quedan = await prisma.listaCompraItem.count({ where: { articuloId } })
    if (quedan === 0) {
      await prisma.articulo.update({
        where: { id: articuloId },
        data: { apuntado: false },
      })
    }
  }

  revalidatePath('/lista')
  return { exito: true }
}

export async function eliminarItemsLista(ids: number[]): Promise<RespuestaAccion> {
  if (ids.length === 0) return { exito: true }

  const items = await prisma.listaCompraItem.findMany({
    where: { id: { in: ids } },
    select: { articuloId: true },
  })

  await prisma.listaCompraItem.deleteMany({ where: { id: { in: ids } } })

  const articuloIds = [...new Set(items.map((i) => i.articuloId))]
  for (const articuloId of articuloIds) {
    const quedan = await prisma.listaCompraItem.count({ where: { articuloId } })
    if (quedan === 0) {
      await prisma.articulo.update({
        where: { id: articuloId },
        data: { apuntado: false },
      })
    }
  }

  revalidatePath('/lista')
  return { exito: true }
}
