import type { Ejercicio, RegistroEjercicio } from '../types/types'

interface PantallaResultadoProps {
  ejerciciosDelNivel: Ejercicio[]
  historialDelNivel: RegistroEjercicio[]
  siguienteNivelDesbloqueado: boolean
  onRepetirNivel: () => void
  onIrASiguienteNivel: () => void
  onVolverASelector: () => void
}

/**
 * Calcula, para cada ejercicio del nivel, su mejor score obtenido,
 * y retorna los 3 ejercicios con el score más bajo (los más difíciles
 * para el usuario).
 */
function calcularEjerciciosMasDificiles(
  ejerciciosDelNivel: Ejercicio[],
  historialDelNivel: RegistroEjercicio[],
): { ejercicio: Ejercicio; mejorScore: number }[] {
  const mejorScorePorEjercicio = new Map<string, number>()

  for (const registro of historialDelNivel) {
    const actual = mejorScorePorEjercicio.get(registro.ejercicioId) ?? 0
    mejorScorePorEjercicio.set(registro.ejercicioId, Math.max(actual, registro.score))
  }

  return ejerciciosDelNivel
    .map((ejercicio) => ({
      ejercicio,
      mejorScore: mejorScorePorEjercicio.get(ejercicio.id) ?? 0,
    }))
    .sort((a, b) => a.mejorScore - b.mejorScore)
    .slice(0, 3)
}

function calcularScorePromedio(historialDelNivel: RegistroEjercicio[]): number {
  if (historialDelNivel.length === 0) return 0
  const suma = historialDelNivel.reduce((acumulado, r) => acumulado + r.score, 0)
  return Math.round(suma / historialDelNivel.length)
}

export function PantallaResultado({
  ejerciciosDelNivel,
  historialDelNivel,
  siguienteNivelDesbloqueado,
  onRepetirNivel,
  onIrASiguienteNivel,
  onVolverASelector,
}: PantallaResultadoProps) {
  const scorePromedio = calcularScorePromedio(historialDelNivel)
  const ejerciciosDificiles = calcularEjerciciosMasDificiles(ejerciciosDelNivel, historialDelNivel)

  return (
    <div className="mx-auto w-full max-w-xl space-y-12 px-6 py-12">
      <header>
        <p className="text-xs tracking-widest text-texto-terciario uppercase">Nivel completado</p>
        <h1 className="mt-2 text-2xl text-texto-principal">Resultado final</h1>
      </header>

      <div className="rounded-lg border border-borde bg-fondo-tarjeta p-8 text-center">
        <p className="text-xs tracking-widest text-texto-terciario uppercase">Score promedio</p>
        <p className="mt-4 text-5xl font-medium text-texto-principal">{scorePromedio}</p>
      </div>

      {ejerciciosDificiles.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs tracking-widest text-texto-terciario uppercase">
            Lo que más te costó
          </p>
          <ul className="space-y-3">
            {ejerciciosDificiles.map(({ ejercicio, mejorScore }) => (
              <li
                key={ejercicio.id}
                className="flex items-center justify-between border-t border-borde-sutil pt-3"
              >
                <span className="text-sm text-texto-principal">{ejercicio.texto}</span>
                <span className="text-sm text-texto-secundario">{mejorScore}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3 border-t border-borde-sutil pt-8">
        {siguienteNivelDesbloqueado && (
          <button
            type="button"
            onClick={onIrASiguienteNivel}
            className="w-full rounded-lg border border-acento px-4 py-3 text-sm text-acento transition-colors duration-200 hover:bg-hover-fondo"
          >
            Ir al siguiente nivel
          </button>
        )}

        <button
          type="button"
          onClick={onRepetirNivel}
          className="w-full rounded-lg border border-borde px-4 py-3 text-sm text-texto-principal transition-colors duration-200 hover:bg-hover-fondo"
        >
          Repetir este nivel
        </button>

        <button
          type="button"
          onClick={onVolverASelector}
          className="w-full rounded-lg border border-borde-sutil px-4 py-3 text-sm text-texto-secundario transition-colors duration-200 hover:bg-hover-fondo"
        >
          Volver a la selección de niveles
        </button>
      </div>
    </div>
  )
}
