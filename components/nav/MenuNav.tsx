'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Package, Store, Tag, ShoppingBag, type LucideIcon } from 'lucide-react'

const ENLACES: { href: string; etiqueta: string; icono: LucideIcon }[] = [
  { href: '/lista', etiqueta: 'Lista', icono: ShoppingCart },
  { href: '/articulos', etiqueta: 'Artículos', icono: Package },
  { href: '/tiendas', etiqueta: 'Tiendas', icono: Store },
  { href: '/categorias', etiqueta: 'Categorías', icono: Tag },
]

// Barra de navegación inferior (mobile) / superior (desktop)
export function MenuNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Barra superior en desktop */}
      {/* <div className="h-40"></div> */}
      {/* este div de arriba es para explicar el position sticky en el header */}
      <header className="hidden sm:block sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <nav className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-2">
          <span className="mr-4 flex items-center gap-1.5 text-lg font-bold text-green-700">
            <ShoppingBag size={20} />
            MiLista
          </span>
          {ENLACES.map((enlace) => {
            const activo = pathname === enlace.href
            const Icono = enlace.icono
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={clsx(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  activo ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icono size={16} />
                <span>{enlace.etiqueta}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Barra de navegación inferior en móvil */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white sm:hidden">
        {ENLACES.map((enlace) => {
          const activo = pathname === enlace.href
          const Icono = enlace.icono
          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={clsx(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                activo ? 'text-green-700' : 'text-gray-500'
              )}
            >
              <Icono size={22} />
              <span>{enlace.etiqueta}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
