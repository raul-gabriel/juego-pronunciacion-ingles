import { useCallback, useRef, useState } from 'react'
import type { EstadoMic } from '../types/types'

// La Web Speech API no tiene tipos oficiales en TypeScript (es experimental),
// así que declaramos lo mínimo necesario para usarla de forma tipada.
interface ResultadoReconocimiento {
  transcript: string
  confianza: number
}

interface EventoResultadoReconocimiento extends Event {
  results: {
    [indice: number]: {
      [indiceAlternativa: number]: { transcript: string; confidence: number }
      length: number
      isFinal: boolean
    }
    length: number
  }
  resultIndex: number
}

interface ReconocimientoVozNativo extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((evento: EventoResultadoReconocimiento) => void) | null
  onerror: ((evento: Event) => void) | null
  onend: (() => void) | null
}

interface VentanaConReconocimiento extends Window {
  SpeechRecognition?: new () => ReconocimientoVozNativo
  webkitSpeechRecognition?: new () => ReconocimientoVozNativo
}

function obtenerClaseReconocimiento() {
  const ventana = window as VentanaConReconocimiento
  return ventana.SpeechRecognition ?? ventana.webkitSpeechRecognition ?? null
}

const MENSAJES_POR_CODIGO: Record<string, string> = {
  'not-allowed': 'Necesitas dar permiso de micrófono en el navegador',
  'no-speech': 'No se detectó voz, intenta de nuevo',
  'audio-capture': 'No se encontró un micrófono disponible',
  network: 'Error de red al procesar el audio',
  aborted: 'Grabación cancelada',
}

interface UsarReconocimientoVozResultado {
  estado: EstadoMic
  iniciarGrabacion: () => void
  detenerGrabacion: () => void
  reiniciar: () => void
  transcript: string
  alternativas: ResultadoReconocimiento[]
  esCompatible: boolean
  mensajeError: string | null
}

/**
 * Hook que encapsula la Web Speech API (SpeechRecognition) del navegador.
 */
export function usarReconocimientoVoz(): UsarReconocimientoVozResultado {
  const [estado, setEstado] = useState<EstadoMic>('listo')
  const [transcript, setTranscript] = useState('')
  const [alternativas, setAlternativas] = useState<ResultadoReconocimiento[]>([])
  const [mensajeError, setMensajeError] = useState<string | null>(null)

  const reconocimientoActualRef = useRef<ReconocimientoVozNativo | null>(null)

  // OJO: se obtiene la clase DENTRO del componente, no a nivel de módulo,
  // igual que en la versión que sabemos que funciona.
  const ClaseReconocimiento = typeof window !== 'undefined' ? obtenerClaseReconocimiento() : null
  const esCompatible = !!ClaseReconocimiento

  const iniciarGrabacion = useCallback(() => {
    if (!ClaseReconocimiento) {
      setEstado('error')
      setMensajeError('Este navegador no soporta reconocimiento de voz')
      return
    }

    // Si había una grabación anterior viva, la detenemos con stop() (no abort()).
    if (reconocimientoActualRef.current) {
      try {
        reconocimientoActualRef.current.stop()
      } catch {
        // ignoramos si ya estaba detenida
      }
    }

    const reconocimiento = new ClaseReconocimiento()
    reconocimiento.lang = 'en-US'
    // Escuchamos también resultados interinos (parciales): con palabras
    // sueltas muy cortas ("cat", "she") Chrome a veces nunca llega a
    // confirmar un resultado FINAL y termina sin decir nada (onend vacío).
    // Si pasa eso, usamos como respaldo el último resultado interino visto.
    reconocimiento.interimResults = true
    reconocimiento.maxAlternatives = 1
    reconocimientoActualRef.current = reconocimiento

    let ultimoInterino: ResultadoReconocimiento | null = null

    setTranscript('')
    setAlternativas([])
    setMensajeError(null)
    setEstado('grabando')

    reconocimiento.onresult = (evento: EventoResultadoReconocimiento) => {
      const resultado = evento.results[evento.resultIndex]
      const esFinal = resultado.isFinal
      const listaAlternativas: ResultadoReconocimiento[] = []

      for (let i = 0; i < resultado.length; i++) {
        listaAlternativas.push({
          transcript: resultado[i].transcript,
          confianza: resultado[i].confidence,
        })
      }

      if (esFinal) {
        console.log('[usarReconocimientoVoz] ✅ resultado FINAL', listaAlternativas)
        setAlternativas(listaAlternativas)
        setTranscript(listaAlternativas[0]?.transcript ?? '')
        setEstado('procesando')
      } else {
        // Guardamos el interino más reciente como respaldo, por si nunca
        // llega un resultado final (pasa seguido con palabras cortas).
        console.log('[usarReconocimientoVoz] ⏳ interino (parcial)', listaAlternativas[0]?.transcript)
        ultimoInterino = listaAlternativas[0] ?? null
      }
    }

    reconocimiento.onerror = (evento: Event) => {
      const codigoError = (evento as unknown as { error?: string }).error ?? 'desconocido'
      console.error('[usarReconocimientoVoz] ❌ Error:', codigoError)
      setMensajeError(MENSAJES_POR_CODIGO[codigoError] ?? `Error de reconocimiento: ${codigoError}`)
      setEstado('error')
    }

    reconocimiento.onend = () => {
      console.log('[usarReconocimientoVoz] ⏹ onend')
      setEstado((estadoActual) => {
        // Si terminó sin haber llegado a un resultado final, pero sí
        // tenemos un interino guardado, lo usamos como resultado.
        if (estadoActual === 'grabando' && ultimoInterino) {
          console.log('[usarReconocimientoVoz] 🔁 usando interino como respaldo:', ultimoInterino.transcript)
          setAlternativas([ultimoInterino])
          setTranscript(ultimoInterino.transcript)
          return 'procesando'
        }
        if (estadoActual === 'grabando') return 'listo'
        return estadoActual
      })
    }

    reconocimiento.start()
  }, [ClaseReconocimiento])

  const detenerGrabacion = useCallback(() => {
    if (!reconocimientoActualRef.current) return
    reconocimientoActualRef.current.stop()
  }, [])

  // Resetea el estado del hook a 'listo', limpiando transcript/alternativas.
  // Hace falta llamarla al reintentar un ejercicio, porque si no el estado
  // se queda pegado en 'procesando' (o 'error') y el botón de micrófono
  // queda deshabilitado para siempre.
  const reiniciar = useCallback(() => {
    if (reconocimientoActualRef.current) {
      try {
        reconocimientoActualRef.current.stop()
      } catch {
        // ignoramos
      }
    }
    setTranscript('')
    setAlternativas([])
    setMensajeError(null)
    setEstado('listo')
  }, [])

  return {
    estado,
    iniciarGrabacion,
    detenerGrabacion,
    reiniciar,
    transcript,
    alternativas,
    esCompatible,
    mensajeError,
  }
}
