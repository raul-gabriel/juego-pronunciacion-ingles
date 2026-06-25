import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Nivel, ProgresoUsuario, RegistroEjercicio } from '../types/types'
import { obtenerEjerciciosDeNivel } from '../datos'
import { LIMITES } from '../configuracion/limites'

const progresoInicial: ProgresoUsuario = {
  nivelActual: 1,
  nivelesDesbloqueados: [1],
  vidasRestantes: LIMITES.vidasIniciales,
  ejercicioActualIndex: 0,
  historial: [],
  sumaScoreIntentoActual: 0,
  cantidadEjerciciosIntentoActual: 0,
}

/**
 * Calcula si un nivel cumple el criterio para desbloquear el siguiente.
 * Umbrales configurables en configuracion/limites.ts.
 */
function calcularSiNivelEstaCompletado(nivel: Nivel, historial: RegistroEjercicio[]): boolean {
  const ejerciciosDelNivel = obtenerEjerciciosDeNivel(nivel)
  if (ejerciciosDelNivel.length === 0) return false

  const idsConBuenScore = new Set(
    historial
      .filter((registro) => registro.score >= LIMITES.scoreMinimoParaDesbloquearNivel)
      .map((registro) => registro.ejercicioId),
  )

  const cantidadCompletados = ejerciciosDelNivel.filter((ejercicio) =>
    idsConBuenScore.has(ejercicio.id),
  ).length

  return cantidadCompletados / ejerciciosDelNivel.length >= LIMITES.porcentajeMinimoParaDesbloquearNivel
}

interface ProgresoStore {
  progreso: ProgresoUsuario
  perderVida: () => void
  reiniciarVidas: () => void
  avanzarEjercicio: (ejercicioId: string, score: number) => void
  desbloquearNivel: (nivel: Nivel) => void
  seleccionarNivel: (nivel: Nivel) => void
}

/**
 * Store central de progreso del usuario. Persiste en localStorage vía el
 * middleware `persist` de Zustand.
 *
 * TODO_BACKEND: cuando haya API, reemplazar el storage de `persist` por
 * uno que sincronice contra el backend (o sacar `persist` y cargar/guardar
 * el progreso explícitamente con llamadas a la API).
 */
export const useProgresoStore = create<ProgresoStore>()(
  persist(
    (set) => ({
      progreso: progresoInicial,

      perderVida: () =>
        set((estado) => ({
          progreso: {
            ...estado.progreso,
            vidasRestantes: Math.max(0, estado.progreso.vidasRestantes - 1),
          },
        })),

      reiniciarVidas: () =>
        set((estado) => ({
          progreso: { ...estado.progreso, vidasRestantes: LIMITES.vidasIniciales },
        })),

      desbloquearNivel: (nivel) =>
        set((estado) => {
          if (estado.progreso.nivelesDesbloqueados.includes(nivel)) return estado
          return {
            progreso: {
              ...estado.progreso,
              nivelesDesbloqueados: [...estado.progreso.nivelesDesbloqueados, nivel].sort(),
            },
          }
        }),

      // Selecciona un nivel y reinicia por completo el intento: vidas,
      // índice de ejercicio y los puntos acumulados que se venían sumando.
      seleccionarNivel: (nivel) =>
        set((estado) => ({
          progreso: {
            ...estado.progreso,
            nivelActual: nivel,
            ejercicioActualIndex: 0,
            vidasRestantes: LIMITES.vidasIniciales,
            sumaScoreIntentoActual: 0,
            cantidadEjerciciosIntentoActual: 0,
          },
        })),

      /**
       * Registra el resultado de un ejercicio en el historial, suma el
       * score a los puntos acumulados del intento actual, avanza al
       * siguiente ejercicio del nivel, resetea las vidas y, si
       * corresponde, desbloquea el siguiente nivel.
       */
      avanzarEjercicio: (ejercicioId, score) =>
        set((estado) => {
          const actual = estado.progreso

          const nuevoRegistro: RegistroEjercicio = {
            ejercicioId,
            score,
            fecha: new Date().toISOString(),
            intentos: (actual.historial.filter((r) => r.ejercicioId === ejercicioId).length || 0) + 1,
          }

          const nuevoHistorial = [...actual.historial, nuevoRegistro]
          const ejerciciosDelNivel = obtenerEjerciciosDeNivel(actual.nivelActual)
          const siguienteIndex = actual.ejercicioActualIndex + 1
          const terminoElNivel = siguienteIndex >= ejerciciosDelNivel.length

          let nivelesDesbloqueados = actual.nivelesDesbloqueados
          if (terminoElNivel && calcularSiNivelEstaCompletado(actual.nivelActual, nuevoHistorial)) {
            const siguienteNivel = (actual.nivelActual + 1) as Nivel
            if (siguienteNivel <= 4 && !nivelesDesbloqueados.includes(siguienteNivel)) {
              nivelesDesbloqueados = [...nivelesDesbloqueados, siguienteNivel].sort()
            }
          }

          return {
            progreso: {
              ...actual,
              historial: nuevoHistorial,
              ejercicioActualIndex: terminoElNivel ? actual.ejercicioActualIndex : siguienteIndex,
              vidasRestantes: LIMITES.vidasIniciales,
              nivelesDesbloqueados,
              sumaScoreIntentoActual: actual.sumaScoreIntentoActual + score,
              cantidadEjerciciosIntentoActual: actual.cantidadEjerciciosIntentoActual + 1,
            },
          }
        }),
    }),
    {
      name: 'pronunciacion-app:progreso',
      // Solo persistimos el campo `progreso`, no las funciones de acción.
      partialize: (estado) => ({ progreso: estado.progreso }),
    },
  ),
)

/**
 * Promedio (0-100) de los puntos acumulados en la pasada ACTUAL del
 * nivel (se reinicia al seleccionar/reiniciar el nivel). null si todavía
 * no se completó ningún ejercicio en este intento.
 */
export function promedioIntentoActual(progreso: ProgresoUsuario): number | null {
  if (progreso.cantidadEjerciciosIntentoActual === 0) return null
  return Math.round(progreso.sumaScoreIntentoActual / progreso.cantidadEjerciciosIntentoActual)
}

/**
 * Calcula el porcentaje de ejercicios completados (con buen score) de un nivel.
 * Selector puro: no vive en el store para no recalcularse en cada set().
 */
export function porcentajeCompletadoDeNivel(nivel: Nivel, historial: RegistroEjercicio[]): number {
  const ejerciciosDelNivel = obtenerEjerciciosDeNivel(nivel)
  if (ejerciciosDelNivel.length === 0) return 0

  const idsCompletados = new Set(
    historial
      .filter((registro) => registro.score >= LIMITES.scoreMinimoParaDesbloquearNivel)
      .map((registro) => registro.ejercicioId),
  )

  const cantidadCompletados = ejerciciosDelNivel.filter((ejercicio) =>
    idsCompletados.has(ejercicio.id),
  ).length

  return Math.round((cantidadCompletados / ejerciciosDelNivel.length) * 100)
}

/**
 * Calcula las estrellas obtenidas (0-3) según el score promedio de los
 * ejercicios completados del nivel. Umbrales en configuracion/limites.ts.
 */
export function estrellasDeNivel(nivel: Nivel, historial: RegistroEjercicio[]): number {
  const ejerciciosDelNivel = obtenerEjerciciosDeNivel(nivel)
  const idsDelNivel = new Set(ejerciciosDelNivel.map((e) => e.id))

  const mejoresScores = new Map<string, number>()
  for (const registro of historial) {
    if (!idsDelNivel.has(registro.ejercicioId)) continue
    const mejorActual = mejoresScores.get(registro.ejercicioId) ?? 0
    mejoresScores.set(registro.ejercicioId, Math.max(mejorActual, registro.score))
  }

  if (mejoresScores.size === 0) return 0

  const scores = Array.from(mejoresScores.values())
  const promedio = scores.reduce((suma, s) => suma + s, 0) / scores.length

  if (promedio >= LIMITES.estrellas.tres) return 3
  if (promedio >= LIMITES.estrellas.dos) return 2
  if (promedio >= LIMITES.estrellas.una) return 1
  return 0
}
