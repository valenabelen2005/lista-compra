'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RespuestaAccion } from '@/lib/tipos'

export async function obtenerCategorias(busqueda?: string) {
  const categorias = await prisma.categoria.findMany({
    where: busqueda ? { nombre: { contains: busqueda, mode: 'insensitive' } } : undefined,
    orderBy: { nombre: 'asc' },
  })
  return categorias
}

export async function crearCategoria(nombre: string): Promise<RespuestaAccion> {
  if (!nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  const yaExiste = await prisma.categoria.findUnique({ where: { nombre: nombre.trim() } })
  if (yaExiste) {
    return { exito: false, error: 'Ya existe una categoría con ese nombre' }
  }

  await prisma.categoria.create({ data: { nombre: nombre.trim() } })
  revalidatePath('/categorias')
  return { exito: true }
}

export async function actualizarCategoria(
  id: number,
  nombre: string
): Promise<RespuestaAccion> {
  if (!nombre.trim()) {
    return { exito: false, error: 'El nombre es obligatorio' }
  }

  const yaExiste = await prisma.categoria.findFirst({
    where: { nombre: nombre.trim(), NOT: { id } },
  })
  if (yaExiste) {
    return { exito: false, error: 'Ya existe una categoría con ese nombre' }
  }

  await prisma.categoria.update({ where: { id }, data: { nombre: nombre.trim() } })
  revalidatePath('/categorias')
  return { exito: true }
}

export async function eliminarCategoria(id: number): Promise<RespuestaAccion> {
  const enUso = await prisma.articulo.findFirst({ where: { categoriaId: id } })
  if (enUso) {
    return {
      exito: false,
      error: 'No se puede eliminar: hay artículos usando esta categoría',
    }
  }

  await prisma.categoria.delete({ where: { id } })
  revalidatePath('/categorias')
  return { exito: true }
}
