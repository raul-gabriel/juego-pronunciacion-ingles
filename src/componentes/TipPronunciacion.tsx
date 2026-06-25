import type { SonidoDificil } from '../types/types'

interface TipPronunciacionProps {
  sonido: SonidoDificil
}

/**
 * Muestra el tip de cómo pronunciar un sonido difícil para hispanohablantes.
 * Diseño sobrio: solo texto, borde superior fino para separar del contexto.
 */
export function TipPronunciacion({ sonido }: TipPronunciacionProps) {
  return (
    <div className="border-t border-borde-sutil pt-4">
      <p className="text-xs tracking-widest text-texto-terciario uppercase">
        Sonido: {sonido.sonido} — {sonido.ejemplo}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-texto-secundario">{sonido.tip}</p>
    </div>
  )
}
