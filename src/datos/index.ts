import type { Ejercicio, Nivel } from '../types/types'
import { palabrasNivel1 } from './nivel1Palabras'
import { frasesNivel2 } from './nivel2FrasesCortas'
import { frasesNivel3 } from './nivel3FrasesLargas'
import { parrafosNivel4 } from './nivel4Parrafos'

// TODO_BACKEND: reemplazar este mapa estático con una llamada a la API:
// const ejercicios = await api.get(`/ejercicios?nivel=${nivel}`)
export const ejerciciosPorNivel: Record<Nivel, Ejercicio[]> = {
  1: palabrasNivel1,
  2: frasesNivel2,
  3: frasesNivel3,
  4: parrafosNivel4,
}

export function obtenerEjerciciosDeNivel(nivel: Nivel): Ejercicio[] {
  return ejerciciosPorNivel[nivel]
}

export const nombreDeNivel: Record<Nivel, string> = {
  1: 'Palabras',
  2: 'Frases cortas',
  3: 'Frases largas',
  4: 'Párrafos',
}

export const descripcionDeNivel: Record<Nivel, string> = {
  1: 'Practica sonidos individuales con palabras simples',
  2: 'Construye frases cortas de uso cotidiano',
  3: 'Practica frases más largas y completas',
  4: 'Lee párrafos completos con fluidez',
}
