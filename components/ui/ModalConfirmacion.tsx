'use client'

import clsx from 'clsx'
import { ModalBase } from './ModalBase'

interface ModalConfirmacionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  peligroso?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

// Modal de confirmación reutilizable para acciones destructivas
export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligroso = false,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  return (
    <ModalBase abierto={abierto} onCerrar={onCancelar} titulo={titulo}>
      <p className="mb-6 text-gray-600">{mensaje}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancelar}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
        >
          {textoCancelar}
        </button>
        <button
          onClick={onConfirmar}
          className={clsx(
            'flex-1 rounded-xl px-4 py-2.5 font-medium text-white',
            peligroso ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
          )}
        >
          {textoConfirmar}
        </button>
      </div>
    </ModalBase>
  )
}
