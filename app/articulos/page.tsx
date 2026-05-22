import { Suspense } from 'react'
import { Package } from 'lucide-react'
import { Cargando } from '@/components/ui/Cargando'
import { VistaArticulos } from '@/components/articulos/VistaArticulos'
import { obtenerArticulos } from '@/app/acciones/articulos'

export const metadata = { title: 'Artículos | MiLista' }

export default async function PaginaArticulos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const articulos = await obtenerArticulos(q)
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <Package size={22} />
        Artículos
      </h1>
      <Suspense fallback={<Cargando />}>
        <VistaArticulos articulos={articulos} />
      </Suspense>
    </div>
  )
}
