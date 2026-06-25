import type { ResultadoPalabra } from '../types/types'
import { TipPronunciacion } from './TipPronunciacion'
import type { SonidoDificil } from '../types/types'

interface FeedbackPalabrasProps {
  palabras: ResultadoPalabra[]
  sonidosDificiles: SonidoDificil[]
}

const COLOR_POR_ESTADO: Record<ResultadoPalabra['estado'], string> = {
  bien: 'text-exito',
  regular: 'text-advertencia',
  mal: 'text-error',
}

/**
 * Resalta cada palabra de la frase evaluada con su color correspondiente.
 * Solo cambio de color en el texto, sin fondo coloreado.
 * Debajo, muestra los tips de las palabras que salieron mal.
 */
export function FeedbackPalabras({ palabras, sonidosDificiles }: FeedbackPalabrasProps) {
  const tipsAMostrar = new Map<string, SonidoDificil>()

  for (const palabra of palabras) {
    if (palabra.estado === 'bien') continue
    const sonido = sonidosDificiles.find((s) =>
      s.palabrasEnEjercicio.some((p) => p.toLowerCase() === palabra.palabraEsperada.toLowerCase()),
    )
    if (sonido) tipsAMostrar.set(sonido.sonido, sonido)
  }

  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed">
        {palabras.map((palabra, indice) => (
          <span key={indice} className={`${COLOR_POR_ESTADO[palabra.estado]} transition-colors duration-200`}>
            {palabra.palabraEsperada}
            {indice < palabras.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>

      {tipsAMostrar.size > 0 && (
        <div className="space-y-3">
          {Array.from(tipsAMostrar.values()).map((sonido) => (
            <TipPronunciacion key={sonido.sonido} sonido={sonido} />
          ))}
        </div>
      )}
    </div>
  )
}
