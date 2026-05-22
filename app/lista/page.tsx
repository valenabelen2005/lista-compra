import { Suspense } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Cargando } from '@/components/ui/Cargando'
import { VistaLista } from '@/components/lista/VistaLista'

export const metadata = { title: 'Lista de la compra | MiLista' }

export default function PaginaLista() {
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <ShoppingCart size={22} />
        Lista de la compra
      </h1>
      <Suspense fallback={<Cargando />}>
        <VistaLista tiendaId={null} />
      </Suspense>
    </div>
  )
}
