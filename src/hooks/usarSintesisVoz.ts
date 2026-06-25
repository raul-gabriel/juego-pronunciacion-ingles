import { useCallback, useEffect, useRef, useState } from 'react'

interface UsarSintesisVozResultado {
  reproducir: (texto: string) => void
  detener: () => void
  estaReproduciendo: boolean
  esCompatible: boolean
}

/**
 * Hook que encapsula SpeechSynthesis del navegador para reproducir
 * texto en inglés (en-US) con una voz nativa.
 */
export function usarSintesisVoz(): UsarSintesisVozResultado {
  const [estaReproduciendo, setEstaReproduciendo] = useState(false)
  const vozEnInglesRef = useRef<SpeechSynthesisVoice | null>(null)
  const esCompatibleRef = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window)

  useEffect(() => {
    if (!esCompatibleRef.current) return

    function elegirVozEnIngles() {
      const voces = window.speechSynthesis.getVoices()
      // Preferimos una voz en-US; si no hay, cualquier voz en inglés
      const vozPreferida =
        voces.find((voz) => voz.lang === 'en-US') ?? voces.find((voz) => voz.lang.startsWith('en'))
      vozEnInglesRef.current = vozPreferida ?? null
    }

    elegirVozEnIngles()
    // Algunos navegadores cargan las voces de forma asíncrona
    window.speechSynthesis.onvoiceschanged = elegirVozEnIngles

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const reproducir = useCallback((texto: string) => {
    if (!esCompatibleRef.current) return

    // Cancelamos cualquier reproducción anterior antes de empezar una nueva
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'en-US'
    if (vozEnInglesRef.current) {
      utterance.voice = vozEnInglesRef.current
    }
    utterance.rate = 0.9 // un poco más lento, ayuda a la comprensión

    // IMPORTANTE: marcamos estaReproduciendo=true ACÁ, de forma sincrónica,
    // y no solo en utterance.onstart. El evento "onstart" del navegador es
    // asíncrono y puede tardar unos ms en llegar; si el usuario aprieta el
    // micrófono justo en esa ventana, el estado todavía decía "false" y el
    // bloqueo anti-trampa no llegaba a tiempo (el mic arrancaba a grabar
    // mientras el audio ya estaba sonando).
    setEstaReproduciendo(true)

    utterance.onstart = () => setEstaReproduciendo(true)
    utterance.onend = () => setEstaReproduciendo(false)
    utterance.onerror = () => setEstaReproduciendo(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const detener = useCallback(() => {
    if (!esCompatibleRef.current) return
    window.speechSynthesis.cancel()
    setEstaReproduciendo(false)
  }, [])

  return {
    reproducir,
    detener,
    estaReproduciendo,
    esCompatible: esCompatibleRef.current,
  }
}
