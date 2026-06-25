// Niveles disponibles en la aplicación
export type Nivel = 1 | 2 | 3 | 4

// Estado del reconocimiento de voz (micrófono)
export type EstadoMic = 'listo' | 'grabando' | 'procesando' | 'error'

// Clasificación cualitativa del score de una palabra
export type EstadoPalabra = 'bien' | 'regular' | 'mal'

// Sonido difícil de pronunciar para hispanohablantes, con su tip asociado
export interface SonidoDificil {
  sonido: string // ej: "th"
  ejemplo: string // ej: "think, that, the"
  tip: string // ej: "Pon la lengua entre los dientes y sopla"
  palabrasEnEjercicio: string[] // qué palabras del ejercicio tienen este sonido
}

// Ejercicio de cualquier nivel: una palabra, frase o párrafo a pronunciar
export interface Ejercicio {
  id: string
  nivel: Nivel
  texto: string // texto en inglés a pronunciar
  tipEscrito: string // pronunciación aproximada en español: "Jelou! Jau ar yu?"
  sonidosDificiles: SonidoDificil[]
  categoria: string // 'saludo' | 'viaje' | 'comida' | 'trabajo' | etc
}

// Resultado de evaluación de una palabra individual dentro de un ejercicio
export interface ResultadoPalabra {
  palabraEsperada: string
  palabraEscuchada: string
  score: number // 0-100
  estado: EstadoPalabra
  tip?: string // consejo de pronunciación si salió mal
}

// Resultado general de haber intentado un ejercicio completo
export interface ResultadoEjercicio {
  scoreGeneral: number
  palabras: ResultadoPalabra[]
  transcriptEscuchado: string
  transcriptEsperado: string
  pasoAlSiguiente: boolean // true si score >= 60
}

// Registro histórico de un ejercicio ya completado (o intentado)
export interface RegistroEjercicio {
  ejercicioId: string
  score: number
  fecha: string
  intentos: number
}

// Estado de progreso general del usuario, persistido en localStorage
export interface ProgresoUsuario {
  nivelActual: Nivel
  nivelesDesbloqueados: Nivel[]
  vidasRestantes: number // 0-3, se resetea al cambiar de ejercicio
  ejercicioActualIndex: number
  historial: RegistroEjercicio[]
  // Puntos acumulados en la pasada ACTUAL por el nivel (se reinicia cada
  // vez que se selecciona/reinicia un nivel). Sirve para mostrar el
  // promedio en vivo y alertar si no alcanza para desbloquear el siguiente.
  sumaScoreIntentoActual: number
  cantidadEjerciciosIntentoActual: number
}
