import type { Nivel } from '../types/types'
import { nombreDeNivel, descripcionDeNivel } from '../datos'

interface NivelSelectorProps {
  nivelesDesbloqueados: Nivel[]
  onSeleccionarNivel: (nivel: Nivel) => void
  porcentajeCompletadoDeNivel: (nivel: Nivel) => number
  estrellasDeNivel: (nivel: Nivel) => number
}

const TODOS_LOS_NIVELES: Nivel[] = [1, 2, 3, 4]

/**
 * Pantalla principal de selección de nivel. Cada tarjeta muestra
 * nombre, descripción y porcentaje de progreso. Los niveles bloqueados
 * (excepto el Nivel 1) muestran un candado y no son seleccionables.
 */
export function NivelSelector({
  nivelesDesbloqueados,
  onSeleccionarNivel,
  porcentajeCompletadoDeNivel,
  estrellasDeNivel,
}: NivelSelectorProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-12 px-6 py-12">
      <header>
        <p className="text-xs tracking-widest text-texto-terciario uppercase">Práctica de pronunciación</p>
        <h1 className="mt-2 text-2xl text-texto-principal">Selecciona un nivel</h1>
      </header>

      <div className="space-y-4">
        {TODOS_LOS_NIVELES.map((nivel) => {
          const desbloqueado = nivelesDesbloqueados.includes(nivel)
          const porcentaje = porcentajeCompletadoDeNivel(nivel)

          return (
            <button
              key={nivel}
              type="button"
              disabled={!desbloqueado}
              onClick={() => onSeleccionarNivel(nivel)}
              className={
                desbloqueado
                  ? 'w-full rounded-lg border border-borde bg-fondo-tarjeta p-8 text-left transition-colors duration-200 hover:bg-hover-fondo'
                  : 'w-full rounded-lg border border-borde-sutil bg-fondo-tarjeta p-8 text-left opacity-40'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest text-texto-terciario uppercase">Nivel {nivel}</p>
                  <p className="mt-1 text-lg text-texto-principal">{nombreDeNivel[nivel]}</p>
                  <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
                    {descripcionDeNivel[nivel]}
                  </p>
                </div>

                {desbloqueado ? (
                  <EstrellasIndicador cantidad={estrellasDeNivel(nivel)} />
                ) : (
                  <CandadoIcono />
                )}
              </div>

              {desbloqueado && (
                <div className="mt-6">
                  <div className="h-px w-full bg-borde-sutil">
                    <div
                      className="h-px bg-acento transition-[width] duration-200"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-texto-terciario">{porcentaje}% completado</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function EstrellasIndicador({ cantidad }: { cantidad: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 3 }).map((_, indice) => (
        <svg
          key={indice}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={indice < cantidad ? '#f5f5f5' : 'none'}
          stroke={indice < cantidad ? '#f5f5f5' : '#555555'}
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z" />
        </svg>
      ))}
    </div>
  )
}

function CandadoIcono() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
