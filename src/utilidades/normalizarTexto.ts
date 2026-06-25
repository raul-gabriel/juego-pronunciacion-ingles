/**
 * Normaliza un texto para poder compararlo de forma justa:
 * - minúsculas
 * - quita puntuación (signos, comas, puntos, signos de interrogación, etc)
 * - colapsa espacios múltiples
 * - quita espacios al inicio/final
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[.,!?¿¡;:"'()«»\-_/\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normaliza y separa un texto en un arreglo de palabras.
 * Útil para evaluar frase por frase, palabra por palabra.
 */
export function normalizarYSepararPalabras(texto: string): string[] {
  const normalizado = normalizarTexto(texto)
  if (normalizado === '') return []
  return normalizado.split(' ')
}
