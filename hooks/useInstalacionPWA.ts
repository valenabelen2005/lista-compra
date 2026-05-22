'use client'

import { useState, useEffect, useRef } from 'react'

type Plataforma = 'ios' | 'android' | 'windows' | 'otro'

function detectarPlataforma(): Plataforma {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  if (/windows/i.test(ua)) return 'windows'
  return 'otro'
}

function estaInstalada(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    !!(navigator as Navigator & { standalone?: boolean }).standalone
  )
}

export function useInstalacionPWA() {
  const [visible, setVisible] = useState(false)
  const [plataforma, setPlataforma] = useState<Plataforma>('otro')
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (estaInstalada()) return
    if (localStorage.getItem('pwa-descartada') === '1') return

    const plat = detectarPlataforma()
    setPlataforma(plat)

    if (plat === 'ios') {
      // iOS Safari no lanza beforeinstallprompt — mostramos instrucciones manuales
      const timer = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(timer)
    }

    // Android, Windows y otros: esperar el evento del navegador
    const onPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      promptRef.current = e
      const timer = setTimeout(() => setVisible(true), 3000)
      // No podemos limpiar este timer fácilmente aquí; no es crítico
      return timer
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const instalar = async () => {
    if (!promptRef.current) {
      setVisible(false)
      return
    }
    await promptRef.current.prompt()
    const { outcome } = await promptRef.current.userChoice
    promptRef.current = null
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-descartada', '1')
    }
    setVisible(false)
  }

  const descartar = () => {
    localStorage.setItem('pwa-descartada', '1')
    setVisible(false)
  }

  return { visible, plataforma, instalar, descartar }
}
