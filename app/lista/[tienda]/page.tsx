import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Cargando } from '@/components/ui/Cargando'
import { VistaLista } from '@/components/lista/VistaLista'
import { obtenerTiendas } from '@/app/acciones/tiendas'

export async function generateMetadata({ params }: { params: Promise<{ tienda: string }> }) {
  const { tienda: slug } = await params
  const tiendas = await obtenerTiendas()
  const tienda = tiendas.find((t) => t.nombre === slug)
  return {
    title: tienda ? `${tienda.nombre} | MiLista` : 'Lista de la compra | MiLista',
  }
}

export default async function PaginaListaTienda({
  params,
}: {
  params: Promise<{ tienda: string }>
}) {
  const { tienda: slug } = await params
  const tiendas = await obtenerTiendas()
  const tienda = tiendas.find((t) => t.nombre === slug)

  if (!tienda) redirect('/lista')

  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <ShoppingCart size={22} />
        {tienda.nombre}
      </h1>
      <Suspense fallback={<Cargando />}>
        <VistaLista tiendaId={tienda.id} />
      </Suspense>
    </div>
  )
}
