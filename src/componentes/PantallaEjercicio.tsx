import { useEffect, useState } from 'react'
import type { Ejercicio, ResultadoEjercicio } from '../types/types'
import { usarReconocimientoVoz } from '../hooks/usarReconocimientoVoz'
import { usarSintesisVoz } from '../hooks/usarSintesisVoz'
import { usarEvaluacion } from '../hooks/usarEvaluacion'
import { mensajePorScore } from '../utilidades/calcularScore'
import { useProgresoStore, promedioIntentoActual } from '../store/progresoStore'
import { LIMITES } from '../configuracion/limites'
import { TarjetaEjercicio } from './TarjetaEjercicio'
import { BotonMicrofono } from './BotonMicrofono'
import { BarraVidas } from './BarraVidas'
import { ProgresoNivel } from './ProgresoNivel'
import { ScoreCirculo } from './ScoreCirculo'
import { FeedbackPalabras } from './FeedbackPalabras'
import { PuntosAcumulados } from './PuntosAcumulados'

interface PantallaEjercicioProps {
  ejercicio: Ejercicio
  ejercicioActualIndex: number
  totalEjercicios: number
  vidasRestantes: number
  onPaso: (ejercicioId: string, score: number) => void
  onPerderVida: () => void
  onSinVidas: () => void
}

/**
 * Pantalla 2 del flujo: muestra el ejercicio actual, controla la grabación
 * de voz, evalúa el resultado contra el texto esperado y decide si el
 * usuario avanza, reintenta, o se queda sin vidas.
 */
export function PantallaEjercicio({
  ejercicio,
  ejercicioActualIndex,
  totalEjercicios,
  vidasRestantes,
  onPaso,
  onPerderVida,
  onSinVidas,
}: PantallaEjercicioProps) {
  const { estado, iniciarGrabacion, detenerGrabacion, reiniciar, alternativas, esCompatible, mensajeError } =
    usarReconocimientoVoz()
  const { reproducir, detener, estaReproduciendo, esCompatible: sintesisCompatible } = usarSintesisVoz()
  const { evaluar } = usarEvaluacion()

  const sumaScoreIntentoActual = useProgresoStore((state) => state.progreso.sumaScoreIntentoActual)
  const cantidadEjerciciosIntentoActual = useProgresoStore(
    (state) => state.progreso.cantidadEjerciciosIntentoActual,
  )
  const promedio = useProgresoStore((state) => promedioIntentoActual(state.progreso))
  const seleccionarNivel = useProgresoStore((state) => state.seleccionarNivel)

  const [resultado, setResultado] = useState<ResultadoEjercicio | null>(null)

  // Cuando el reconocimiento termina de procesar y hay alternativas,
  // evaluamos automáticamente.
  useEffect(() => {
    if (estado !== 'procesando' || alternativas.length === 0) return

    const transcripts = alternativas.map((a) => a.transcript)
    const resultadoEvaluado = evaluar(transcripts, ejercicio.texto, ejercicio.sonidosDificiles)
    setResultado(resultadoEvaluado)

    if (!resultadoEvaluado.pasoAlSiguiente) {
      onPerderVida()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, alternativas])

  // Al cambiar de ejercicio, limpiamos el resultado anterior y reseteamos
  // el hook de voz (si no, el estado queda pegado en 'procesando' o 'error'
  // del ejercicio anterior y el micrófono queda deshabilitado para siempre).
  useEffect(() => {
    setResultado(null)
    reiniciar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejercicio.id])

  function manejarClickMicrofono() {
    // Evitamos que el micrófono se active mientras se está reproduciendo
    // el audio del TTS: si no, el mic capta su propia voz por los parlantes
    // y el usuario puede "tramparse" sin darse cuenta (o el sistema se
    // confunde solo). Por las dudas, también cortamos el audio si llegara
    // a estar sonando.
    if (estaReproduciendo) {
      detener()
      return
    }

    if (estado === 'listo' || estado === 'error') {
      setResultado(null)
      iniciarGrabacion()
    } else if (estado === 'grabando') {
      detenerGrabacion()
    }
  }

  function manejarReintentar() {
    reiniciar()
    setResultado(null)
  }

  function manejarSiguiente() {
    if (!resultado) return
    onPaso(ejercicio.id, resultado.scoreGeneral)
    setResultado(null)
  }

  function manejarReiniciarDesdeCero() {
    seleccionarNivel(ejercicio.nivel)
    setResultado(null)
  }

  const seQuedoSinVidas = vidasRestantes <= 0 && resultado !== null && !resultado.pasoAlSiguiente

  return (
    <div className="mx-auto w-full max-w-xl space-y-12 px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="w-2/3">
          <ProgresoNivel ejercicioActualIndex={ejercicioActualIndex} totalEjercicios={totalEjercicios} />
        </div>
        <BarraVidas vidasRestantes={vidasRestantes} />
      </div>

      <PuntosAcumulados
        sumaScoreIntentoActual={sumaScoreIntentoActual}
        cantidadEjerciciosIntentoActual={cantidadEjerciciosIntentoActual}
        totalEjercicios={totalEjercicios}
        promedio={promedio}
        onReiniciar={manejarReiniciarDesdeCero}
      />

      <TarjetaEjercicio
        ejercicio={ejercicio}
        onEscuchar={() => reproducir(ejercicio.texto)}
        estaReproduciendo={estaReproduciendo}
        sintesisCompatible={sintesisCompatible}
        micEstaActivo={estado === 'grabando' || estado === 'procesando'}
      />

      {!esCompatible && (
        <p className="text-center text-sm text-error">
          Tu navegador no soporta reconocimiento de voz. Probá con Chrome o Edge.
        </p>
      )}

      {esCompatible && estado === 'error' && mensajeError && (
        <div className="space-y-3 text-center">
          <p className="text-sm text-error">{mensajeError}</p>
          <button
            type="button"
            onClick={manejarClickMicrofono}
            className="rounded-lg border border-borde px-4 py-2 text-sm text-texto-principal transition-colors duration-200 hover:bg-hover-fondo"
          >
            Reintentar
          </button>
        </div>
      )}

      {esCompatible && estado !== 'error' && !resultado && (
        <div className="flex flex-col items-center gap-2">
          <BotonMicrofono estado={estado} onClick={manejarClickMicrofono} deshabilitadoExtra={estaReproduciendo} />
          {estaReproduciendo && (
            <p className="text-xs text-texto-secundario">Esperá a que termine el audio para hablar</p>
          )}
        </div>
      )}

      {resultado && (
        <div className="space-y-8 border-t border-borde-sutil pt-8">
          <div className="flex flex-col items-center gap-2">
            <ScoreCirculo score={resultado.scoreGeneral} />
            <p className="text-sm text-texto-secundario">{mensajePorScore(resultado.scoreGeneral)}</p>
            {!resultado.pasoAlSiguiente && (
              <p className="text-xs text-texto-terciario">
                Necesitás {LIMITES.scoreMinimoParaPasarEjercicio} puntos para pasar
              </p>
            )}
          </div>

          <FeedbackPalabras palabras={resultado.palabras} sonidosDificiles={ejercicio.sonidosDificiles} />

          <div className="space-y-1 text-center text-sm">
            <p className="text-texto-secundario">
              Escuché: <span className="text-texto-principal">"{resultado.transcriptEscuchado || '(nada)'}"</span>
            </p>
            <p className="text-texto-secundario">
              Esperaba: <span className="text-texto-principal">"{resultado.transcriptEsperado}"</span>
            </p>
          </div>

          {seQuedoSinVidas ? (
            <div className="space-y-4 text-center">
              <p className="text-sm leading-relaxed text-texto-secundario">
                Sin vidas por ahora. No pasa nada — la práctica constante es lo que mejora la
                pronunciación. Reiniciá el ejercicio cuando quieras.
              </p>
              <button
                type="button"
                onClick={onSinVidas}
                className="rounded-lg border border-borde px-4 py-3 text-sm text-texto-principal transition-colors duration-200 hover:bg-hover-fondo"
              >
                Reiniciar ejercicio
              </button>
            </div>
          ) : resultado.pasoAlSiguiente ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={manejarSiguiente}
                className="rounded-lg border border-acento px-6 py-3 text-sm text-acento transition-colors duration-200 hover:bg-hover-fondo"
              >
                Siguiente
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={manejarReintentar}
                className="rounded-lg border border-borde px-6 py-3 text-sm text-texto-principal transition-colors duration-200 hover:bg-hover-fondo"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
