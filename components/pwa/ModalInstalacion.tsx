'use client'

import { ShoppingCart } from 'lucide-react'
import { useInstalacionPWA } from '@/hooks/useInstalacionPWA'

function InstruccionesIOS() {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p className="font-medium">Para instalar MiLista en tu iPhone o iPad:</p>
      <ol className="space-y-2">
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 font-bold text-green-600">1.</span>
          <span>
            Pulsa el botón <strong>Compartir</strong>{' '}
            <span className="inline-block rounded bg-gray-100 px-1">⎙</span> en la barra de Safari
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 font-bold text-green-600">2.</span>
          <span>
            Desplázate y pulsa <strong>"Añadir a pantalla de inicio"</strong>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 font-bold text-green-600">3.</span>
          <span>
            Pulsa <strong>"Añadir"</strong> para confirmar
          </span>
        </li>
      </ol>
    </div>
  )
}

function InstruccionesOtros({ plataforma }: { plataforma: string }) {
  const texto =
    plataforma === 'android'
      ? 'Instala MiLista en tu Android para acceder rápido desde la pantalla de inicio, sin abrir el navegador.'
      : plataforma === 'windows'
        ? 'Instala MiLista en Windows para acceder desde el escritorio o el menú Inicio.'
        : 'Instala MiLista para acceder más rápido desde tu dispositivo.'

  return <p className="text-sm text-gray-700">{texto}</p>
}

export function ModalInstalacion() {
  const { visible, plataforma, instalar, descartar } = useInstalacionPWA()

  if (!visible) return null

  const esIOS = plataforma === 'ios'

  return (
    <div className="fixed inset-0 z-200 flex items-end justify-center sm:items-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={descartar}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        {/* Cabecera */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">MiLista</p>
            <p className="text-xs text-gray-500">Lista de la compra</p>
          </div>
        </div>

        {/* Contenido según plataforma */}
        <div className="mb-6">
          {esIOS ? (
            <InstruccionesIOS />
          ) : (
            <InstruccionesOtros plataforma={plataforma} />
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={descartar}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Ahora no
          </button>
          <button
            onClick={esIOS ? descartar : instalar}
            className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700"
          >
            {esIOS ? 'Entendido' : 'Instalar'}
          </button>
        </div>
      </div>
    </div>
  )
}
