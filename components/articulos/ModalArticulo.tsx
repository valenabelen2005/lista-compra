'use client'

import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { ModalBase } from '@/components/ui/ModalBase'
import { ModalEscanerUnico } from '@/components/lista/ModalEscanerUnico'
import type { Articulo, Categoria, Tienda } from '@/lib/tipos'

interface ModalArticuloProps {
  abierto: boolean
  articuloEditar: Articulo | null
  categorias: Categoria[]
  tiendas: Tienda[]
  onGuardar: (datos: {
    nombre: string
    precio: number
    cantidadPorDefecto: number
    categoriaId: number | null
    tiendaId: number | null
    codigoBarras: string | null
  }) => Promise<boolean>
  onCerrar: () => void
}

const estadoInicial = {
  nombre: '',
  precio: 0,
  cantidadPorDefecto: 1,
  categoriaId: null as number | null,
  tiendaId: null as number | null,
  codigoBarras: '',
}

// Modal para crear o editar un artículo
export function ModalArticulo({
  abierto,
  articuloEditar,
  categorias,
  tiendas,
  onGuardar,
  onCerrar,
}: ModalArticuloProps) {
  const [datos, setDatos] = useState(estadoInicial)
  const [guardando, setGuardando] = useState(false)
  const [escanerAbierto, setEscanerAbierto] = useState(false)

  useEffect(() => {
    if (abierto) {
      if (articuloEditar) {
        setDatos({
          nombre: articuloEditar.nombre,
          precio: articuloEditar.precio,
          cantidadPorDefecto: articuloEditar.cantidadPorDefecto,
          categoriaId: articuloEditar.categoriaId,
          tiendaId: articuloEditar.tiendaId,
          codigoBarras: articuloEditar.codigoBarras ?? '',
        })
      } else {
        setDatos(estadoInicial)
      }
    }
  }, [abierto, articuloEditar])

  const actualizar = (campo: keyof typeof estadoInicial, valor: unknown) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const manejarGuardar = async () => {
    if (!datos.nombre.trim()) return
    setGuardando(true)
    const exito = await onGuardar({
      nombre: datos.nombre,
      precio: datos.precio,
      cantidadPorDefecto: datos.cantidadPorDefecto,
      categoriaId: datos.categoriaId,
      tiendaId: datos.tiendaId,
      codigoBarras: datos.codigoBarras || null,
    })
    setGuardando(false)
    if (exito) onCerrar()
  }

  return (
    <>
      <ModalBase
        abierto={abierto && !escanerAbierto}
        onCerrar={onCerrar}
        titulo={articuloEditar ? 'Editar artículo' : 'Nuevo artículo'}
      >
        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => actualizar('nombre', e.target.value)}
              placeholder="Ej: Leche entera"
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* Precio y Cantidad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Precio (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={datos.precio}
                onChange={(e) => actualizar('precio', parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Cantidad por defecto
              </label>
              <input
                type="number"
                min="1"
                value={datos.cantidadPorDefecto}
                onChange={(e) =>
                  actualizar('cantidadPorDefecto', parseInt(e.target.value) || 1)
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              value={datos.categoriaId ?? ''}
              onChange={(e) =>
                actualizar('categoriaId', e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tienda por defecto */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tienda por defecto
            </label>
            <select
              value={datos.tiendaId ?? ''}
              onChange={(e) =>
                actualizar('tiendaId', e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Sin tienda</option>
              {tiendas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Código de barras */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Código de barras (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={datos.codigoBarras}
                onChange={(e) => actualizar('codigoBarras', e.target.value)}
                placeholder="Ej: 8410000624754"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <button
                type="button"
                onClick={() => setEscanerAbierto(true)}
                title="Escanear con cámara"
                className="rounded-xl border border-gray-200 px-3 py-2.5 hover:bg-gray-50"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={manejarGuardar}
            disabled={!datos.nombre.trim() || guardando}
            className="w-full rounded-xl bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </ModalBase>

      {/* Modal de escáner para el código de barras del artículo */}
      <ModalEscanerUnico
        abierto={escanerAbierto}
        onCodigo={(codigo) => {
          actualizar('codigoBarras', codigo)
          setEscanerAbierto(false)
        }}
        onCerrar={() => setEscanerAbierto(false)}
      />
    </>
  )
}
