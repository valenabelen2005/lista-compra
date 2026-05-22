'use client'

import { Check } from 'lucide-react'

interface FooterListaProps {
  totalEsperado: number
  totalHastaAhora: number
  cantidadTachados: number
  onFinalizar: () => void
}

// Footer fijo en la vista de lista con totales y botón de finalizar compra
// En móvil se posiciona encima de la barra de navegación inferior (bottom-16)
// En desktop va al fondo de la pantalla (sm:bottom-0)
export function FooterLista({
  totalEsperado,
  totalHastaAhora,
  cantidadTachados,
  onFinalizar,
}: FooterListaProps) {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg sm:bottom-0">
      <div className="mx-auto flex max-w-4xl flex-col gap-2">
        {/* Totales */}
        <div className="flex justify-between text-sm">
          <div className="text-gray-500">
            <span>En carrito: </span>
            <span className="font-semibold text-green-700">
              {totalHastaAhora.toFixed(2)} €
            </span>
          </div>
          <div className="text-gray-500">
            <span>Total esperado: </span>
            <span className="font-semibold text-gray-800">
              {totalEsperado.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Botón finalizar compra */}
        <button
          onClick={onFinalizar}
          disabled={cantidadTachados === 0}
          className="w-full rounded-xl bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {cantidadTachados > 0 ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={16} strokeWidth={3} />
              {`Finalizar compra (${cantidadTachados} artículo${cantidadTachados > 1 ? 's' : ''})`}
            </span>
          ) : (
            'Toca artículos para marcarlos como comprados'
          )}
        </button>
      </div>
    </div>
  )
}
