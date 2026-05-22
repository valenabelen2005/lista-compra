import { Suspense } from 'react'
import { Tag } from 'lucide-react'
import { Cargando } from '@/components/ui/Cargando'
import { VistaCategorias } from '@/components/categorias/VistaCategorias'
import { obtenerCategorias } from '@/app/acciones/categorias'

export const metadata = { title: 'Categorías | MiLista' }

export default async function PaginaCategorias({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const categorias = await obtenerCategorias(q)
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <Tag size={22} />
        Categorías
      </h1>
      <Suspense fallback={<Cargando />}>
        <VistaCategorias categorias={categorias} />
      </Suspense>
    </div>
  )
}
