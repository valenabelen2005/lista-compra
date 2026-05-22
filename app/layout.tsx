import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { MenuNav } from '@/components/nav/MenuNav'
import { RegistradorSW } from '@/components/pwa/RegistradorSW'
import { ModalInstalacion } from '@/components/pwa/ModalInstalacion'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'MiLista - Lista de la compra',
  description: 'Tu lista de la compra inteligente',
  manifest:'/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple:[{url: '/apple-touch-icon.png'}],
  },
  appleWebApp:{
    capable:true,
    statusBarStyle: 'default',
    title: 'Mi Lista'
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <MenuNav />

        {/* Contenido principal - padding top en desktop por la nav fija, padding bottom en móvil por la nav inferior */}
        <main className="mx-auto max-w-4xl px-4 py-4 pb-24 sm:pb-6 sm:pt-4">
          {children}
        </main>

        <Toaster position="bottom-center" richColors />
        <RegistradorSW/>
        <ModalInstalacion/>
      </body>
    </html>
  )
}
