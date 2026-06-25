import { LIMITES } from '../configuracion/limites'

/**
 * Convierte una distancia Levenshtein en un score de 0 a 100.
 * Se compara la distancia contra la longitud de la palabra más larga
 * (esperada vs escuchada), ya que es la cantidad máxima de ediciones
 * posibles para llegar de una palabra a la otra.
 *
 * Si ambas palabras son idénticas, distancia = 0 → score = 100.
 * Si son completamente distintas, distancia ≈ longitud máxima → score ≈ 0.
 */
export function distanciaAScore(distancia: number, longitudMaxima: number): number {
  if (longitudMaxima === 0) return 100

  const proporcionDeError = distancia / longitudMaxima
  const score = (1 - proporcionDeError) * 100

  // Aseguramos el rango 0-100 y redondeamos a entero
  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Clasifica un score numérico en una categoría cualitativa,
 * usada para colorear la palabra en la UI. Umbrales en configuracion/limites.ts.
 */
export function clasificarScore(score: number): 'bien' | 'regular' | 'mal' {
  if (score >= LIMITES.clasificacionPalabra.bien) return 'bien'
  if (score >= LIMITES.clasificacionPalabra.regular) return 'regular'
  return 'mal'
}

/**
 * Devuelve el mensaje corto asociado a un score. Umbrales en configuracion/limites.ts.
 */
export function mensajePorScore(score: number): string {
  if (score >= LIMITES.mensajePorScore.perfecto) return '¡Perfecto!'
  if (score >= LIMITES.mensajePorScore.muyBien) return '¡Muy bien!'
  if (score >= LIMITES.mensajePorScore.casi) return 'Casi, practica más'
  return 'Necesita práctica'
}
