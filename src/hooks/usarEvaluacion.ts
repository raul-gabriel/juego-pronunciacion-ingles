import { useCallback } from 'react'
import type { ResultadoEjercicio, ResultadoPalabra, SonidoDificil } from '../types/types'
import { evaluarFrase } from '../utilidades/levenshtein'
import { normalizarYSepararPalabras } from '../utilidades/normalizarTexto'
import { mensajePorScore } from '../utilidades/calcularScore'
import { LIMITES } from '../configuracion/limites'

// Palabras funcionales del inglés: pesan menos en el score general
// porque no son el foco de la práctica de pronunciación.
const PALABRAS_FUNCIONALES = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'am',
  'was',
  'were',
  'to',
  'of',
  'in',
  'on',
  'at',
  'it',
  'i',
  'you',
  'he',
  'she',
  'we',
  'they',
])

interface UsarEvaluacionResultado {
  evaluar: (
    alternativasTranscript: string[],
    textoEsperado: string,
    sonidosDificiles: SonidoDificil[],
  ) => ResultadoEjercicio
}

/**
 * Busca si una palabra forma parte de algún SonidoDificil del ejercicio,
 * y de ser así retorna ese sonido (para sacar el tip y aplicar el peso).
 */
function buscarSonidoDificilDeLaPalabra(
  palabra: string,
  sonidosDificiles: SonidoDificil[],
): SonidoDificil | undefined {
  return sonidosDificiles.find((sonido) =>
    sonido.palabrasEnEjercicio.some((p) => p.toLowerCase() === palabra.toLowerCase()),
  )
}

/**
 * Calcula el peso de una palabra según las reglas de evaluación:
 * sonidos difíciles pesan x1.5, palabras funcionales pesan x0.5,
 * el resto pesa x1.
 */
function calcularPeso(palabra: string, sonidoAsociado: SonidoDificil | undefined): number {
  if (sonidoAsociado) return LIMITES.pesosPalabra.sonidoDificil
  if (PALABRAS_FUNCIONALES.has(palabra.toLowerCase())) return LIMITES.pesosPalabra.palabraFuncional
  return LIMITES.pesosPalabra.normal
}

/**
 * Calcula el score general ponderado de un conjunto de resultados por palabra.
 */
function calcularScoreGeneral(
  resultadosPalabras: ResultadoPalabra[],
  sonidosDificiles: SonidoDificil[],
): number {
  if (resultadosPalabras.length === 0) return 0

  let sumaPonderada = 0
  let sumaPesos = 0

  for (const resultado of resultadosPalabras) {
    const sonidoAsociado = buscarSonidoDificilDeLaPalabra(resultado.palabraEsperada, sonidosDificiles)
    const peso = calcularPeso(resultado.palabraEsperada, sonidoAsociado)
    sumaPonderada += resultado.score * peso
    sumaPesos += peso
  }

  return Math.round(sumaPonderada / sumaPesos)
}

/**
 * Enriquece los resultados por palabra con el tip de pronunciación,
 * solo para las palabras que salieron mal y tienen un sonido difícil asociado.
 */
function agregarTipsAPalabrasMal(
  resultadosPalabras: ResultadoPalabra[],
  sonidosDificiles: SonidoDificil[],
): ResultadoPalabra[] {
  return resultadosPalabras.map((resultado) => {
    if (resultado.estado === 'bien') return resultado

    const sonidoAsociado = buscarSonidoDificilDeLaPalabra(resultado.palabraEsperada, sonidosDificiles)
    if (!sonidoAsociado) return resultado

    return { ...resultado, tip: sonidoAsociado.tip }
  })
}

/**
 * Hook de evaluación: compara el transcript escuchado (o sus alternativas)
 * contra el texto esperado, usando Levenshtein palabra por palabra,
 * y arma el ResultadoEjercicio completo con scores, estados y tips.
 */
export function usarEvaluacion(): UsarEvaluacionResultado {
  const evaluar = useCallback(
    (
      alternativasTranscript: string[],
      textoEsperado: string,
      sonidosDificiles: SonidoDificil[],
    ): ResultadoEjercicio => {
      // Si no hay alternativas, evaluamos contra string vacío (score 0)
      const transcriptsAEvaluar = alternativasTranscript.length > 0 ? alternativasTranscript : ['']

      let mejorResultado: ResultadoEjercicio | null = null

      for (const transcriptCandidato of transcriptsAEvaluar) {
        const resultadosPalabras = evaluarFrase(textoEsperado, transcriptCandidato)
        const scoreGeneral = calcularScoreGeneral(resultadosPalabras, sonidosDificiles)

        if (!mejorResultado || scoreGeneral > mejorResultado.scoreGeneral) {
          mejorResultado = {
            scoreGeneral,
            palabras: agregarTipsAPalabrasMal(resultadosPalabras, sonidosDificiles),
            transcriptEscuchado: transcriptCandidato,
            transcriptEsperado: normalizarYSepararPalabras(textoEsperado).join(' '),
            pasoAlSiguiente: scoreGeneral >= LIMITES.scoreMinimoParaPasarEjercicio,
          }
        }
      }

      // mejorResultado nunca es null porque transcriptsAEvaluar siempre tiene al menos un elemento
      return mejorResultado as ResultadoEjercicio
    },
    [],
  )

  return { evaluar }
}

// Se re-exporta para que los componentes puedan mostrar el mensaje
// correspondiente sin tener que importar directamente de utilidades.
export { mensajePorScore }
