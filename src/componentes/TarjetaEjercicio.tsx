import type { Ejercicio } from '../types/types'
import { BotonEscuchar } from './BotonEscuchar'

interface TarjetaEjercicioProps {
  ejercicio: Ejercicio
  onEscuchar: () => void
  estaReproduciendo: boolean
  sintesisCompatible: boolean
  micEstaActivo?: boolean
}

/**
 * Muestra el texto en inglés del ejercicio actual junto con su
 * pronunciación aproximada en español y el botón para escucharlo.
 */
export function TarjetaEjercicio({
  ejercicio,
  onEscuchar,
  estaReproduciendo,
  sintesisCompatible,
  micEstaActivo,
}: TarjetaEjercicioProps) {
  return (
    <div className="rounded-lg border border-borde bg-fondo-tarjeta p-8">
      <p className="text-xs tracking-widest text-texto-terciario uppercase">{ejercicio.categoria}</p>

      <p className="mt-4 text-2xl leading-relaxed text-texto-principal">{ejercicio.texto}</p>

      <p className="mt-2 text-sm text-texto-secundario">{ejercicio.tipEscrito}</p>

      <div className="mt-6">
        <BotonEscuchar
          onClick={onEscuchar}
          estaReproduciendo={estaReproduciendo}
          esCompatible={sintesisCompatible}
          micEstaActivo={micEstaActivo}
        />
      </div>
    </div>
  )
}
