import type { ResultadoPalabra } from '../types/types'
import { normalizarYSepararPalabras } from './normalizarTexto'
import { distanciaAScore, clasificarScore } from './calcularScore'

/**
 * Distancia Levenshtein entre dos strings: cantidad mínima de operaciones
 * (insertar, borrar, sustituir un carácter) para convertir `a` en `b`.
 *
 * Implementación con programación dinámica, matriz de tamaño
 * (a.length + 1) x (b.length + 1).
 */
export function distanciaLevenshtein(a: string, b: string): number {
  const filas = a.length + 1
  const columnas = b.length + 1

  // matriz[i][j] = distancia entre los primeros i caracteres de `a`
  // y los primeros j caracteres de `b`
  const matriz: number[][] = Array.from({ length: filas }, () => new Array(columnas).fill(0))

  for (let i = 0; i < filas; i++) matriz[i][0] = i
  for (let j = 0; j < columnas; j++) matriz[0][j] = j

  for (let i = 1; i < filas; i++) {
    for (let j = 1; j < columnas; j++) {
      if (a[i - 1] === b[j - 1]) {
        matriz[i][j] = matriz[i - 1][j - 1]
      } else {
        const costoSustitucion = matriz[i - 1][j - 1] + 1
        const costoInsercion = matriz[i][j - 1] + 1
        const costoBorrado = matriz[i - 1][j] + 1
        matriz[i][j] = Math.min(costoSustitucion, costoInsercion, costoBorrado)
      }
    }
  }

  return matriz[filas - 1][columnas - 1]
}

/**
 * Score 0-100 de una palabra escuchada respecto a la esperada,
 * basado en la distancia Levenshtein normalizada por longitud.
 */
export function scoreLevenshtein(palabraEsperada: string, palabraEscuchada: string): number {
  const distancia = distanciaLevenshtein(palabraEsperada, palabraEscuchada)
  const longitudMaxima = Math.max(palabraEsperada.length, palabraEscuchada.length)
  return distanciaAScore(distancia, longitudMaxima)
}

/**
 * Evalúa una frase completa palabra por palabra, alineando el texto
 * esperado contra el texto escuchado.
 *
 * Alineación simple por posición: se recorre la cantidad de palabras
 * esperadas y se compara cada una con la palabra escuchada en la misma
 * posición. Si el usuario dijo menos palabras que las esperadas, las
 * palabras faltantes se evalúan contra string vacío (score 0, "mal"),
 * penalizando al usuario por no haberlas dicho.
 */
export function evaluarFrase(esperado: string, escuchado: string): ResultadoPalabra[] {
  const palabrasEsperadas = normalizarYSepararPalabras(esperado)
  const palabrasEscuchadas = normalizarYSepararPalabras(escuchado)

  return palabrasEsperadas.map((palabraEsperada, indice) => {
    // Si el usuario dijo menos palabras, aquí no hay nada que comparar
    const palabraEscuchada = palabrasEscuchadas[indice] ?? ''

    const score = scoreLevenshtein(palabraEsperada, palabraEscuchada)

    return {
      palabraEsperada,
      palabraEscuchada,
      score,
      estado: clasificarScore(score),
    }
  })
}
