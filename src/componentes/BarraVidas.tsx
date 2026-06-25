interface BarraVidasProps {
  vidasRestantes: number
  vidasTotales?: number
}

/**
 * Muestra las vidas restantes del ejercicio actual como círculos pequeños:
 * lleno (blanco) si queda la vida, vacío (borde tenue) si se perdió.
 */
export function BarraVidas({ vidasRestantes, vidasTotales = 3 }: BarraVidasProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${vidasRestantes} de ${vidasTotales} vidas restantes`}>
      {Array.from({ length: vidasTotales }).map((_, indice) => {
        const tieneVida = indice < vidasRestantes
        return (
          <span
            key={indice}
            className={
              tieneVida
                ? 'h-2.5 w-2.5 rounded-full bg-acento'
                : 'h-2.5 w-2.5 rounded-full border border-acento opacity-30'
            }
          />
        )
      })}
    </div>
  )
}
