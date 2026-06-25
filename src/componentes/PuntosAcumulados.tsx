import { LIMITES } from '../configuracion/limites'

interface PuntosAcumuladosProps {
  sumaScoreIntentoActual: number
  cantidadEjerciciosIntentoActual: number
  totalEjercicios: number
  promedio: number | null
  onReiniciar: () => void
}

/**
 * Muestra los puntos acumulados en el intento actual del nivel contra el
 * objetivo total necesario para desbloquear el siguiente nivel (objetivo =
 * cantidad de ejercicios del nivel x scoreMinimoParaDesbloquearNivel).
 *
 * Si el promedio cae por debajo de `LIMITES.scoreMinimoParaAlertaDePromedio`,
 * avisa que con ese ritmo no se va a llegar al objetivo y ofrece reiniciar
 * el intento desde cero.
 */
export function PuntosAcumulados({
  sumaScoreIntentoActual,
  cantidadEjerciciosIntentoActual,
  totalEjercicios,
  promedio,
  onReiniciar,
}: PuntosAcumuladosProps) {
  if (cantidadEjerciciosIntentoActual === 0) return null

  const objetivoTotal = totalEjercicios * LIMITES.scoreMinimoParaDesbloquearNivel
  const vaMal = promedio !== null && promedio < LIMITES.scoreMinimoParaAlertaDePromedio

  return (
    <div className="flex items-center justify-between rounded-lg border border-borde-sutil px-4 py-3">
      <div>
        <p className="text-xs tracking-widest text-texto-terciario uppercase">Puntos acumulados</p>
        <p className={`mt-1 text-lg ${vaMal ? 'text-error' : 'text-texto-principal'}`}>
          {sumaScoreIntentoActual} / {objetivoTotal} para pasar de nivel
        </p>
      </div>

      {vaMal && (
        <div className="text-right">
          <p className="max-w-[14rem] text-xs leading-relaxed text-error">
            Con este promedio ({promedio} pts) no vas a llegar al objetivo.
          </p>
          <button
            type="button"
            onClick={onReiniciar}
            className="mt-2 rounded-lg border border-error px-3 py-1.5 text-xs text-error transition-colors duration-200 hover:bg-hover-fondo"
          >
            Reiniciar desde cero
          </button>
        </div>
      )}
    </div>
  )
}
