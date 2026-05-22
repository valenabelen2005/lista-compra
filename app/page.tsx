import { redirect } from 'next/navigation'

// Redirigir la raíz a la vista de lista
export default function PaginaInicio() {
  redirect('/lista')
}
