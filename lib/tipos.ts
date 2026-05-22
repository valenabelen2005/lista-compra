// Tipos TypeScript para la aplicación Lista de la Compra

export interface Categoria {
  id: number
  nombre: string
}

export interface Tienda {
  id: number
  nombre: string
}

export interface Articulo {
  id: number
  nombre: string
  precio: number
  cantidadPorDefecto: number
  categoriaId: number | null
  tiendaId: number | null
  apuntado: boolean
  codigoBarras: string | null
  categoria?: Categoria | null
  tienda?: Tienda | null
}

export interface ItemListaCompleto {
  id: number
  articuloId: number
  tiendaId: number | null
  cantidad: number
  tachado: boolean
  articulo: {
    id: number
    nombre: string
    precio: number
    codigoBarras: string | null
    categoria: Categoria | null
  }
  tienda: Tienda | null
}

export interface RespuestaAccion {
  exito: boolean
  error?: string
  datos?: unknown
}

// Declaraciones de tipos para APIs nativas del navegador no incluidas en TypeScript por defecto
declare global {
  class BarcodeDetector {
    constructor(opciones?: { formats: string[] })
    detect(
      imagen: HTMLVideoElement | HTMLCanvasElement | ImageBitmap
    ): Promise<Array<{ rawValue: string; format: string }>>
    static getSupportedFormats(): Promise<string[]>
  }
}
