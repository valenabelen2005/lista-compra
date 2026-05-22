import { Suspense } from 'react'
import { Store } from 'lucide-react'
import { Cargando } from '@/components/ui/Cargando'
import { VistaTiendas } from '@/components/tiendas/VistaTiendas'
import { obtenerTiendas } from '@/app/acciones/tiendas'

export const metadata = { title: 'Tiendas | MiLista' }

export default async function PaginaTiendas({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const tiendas = await obtenerTiendas(q)
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <Store size={22} />
        Tiendas
      </h1>
      <Suspense fallback={<Cargando />}>
        <VistaTiendas tiendas={tiendas} />
      </Suspense>
    </div>
  )
}
