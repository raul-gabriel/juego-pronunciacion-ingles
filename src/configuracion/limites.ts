/**
 * Configuración central del juego: todos los números "mágicos" que
 * definen las reglas (cuándo pasás un ejercicio, cuándo desbloqueás
 * un nivel, cuántas vidas tenés, etc) viven en este único archivo.
 *
 * Si querés ajustar la dificultad del juego, este es el único lugar
 * que tenés que tocar.
 */

export const LIMITES = {
  /** Cantidad de vidas con las que arrancás cada nivel. */
  vidasIniciales: 3,

  /**
   * Score mínimo (0-100) para considerar que pasaste UN ejercicio
   * y avanzar al siguiente.
   */
  scoreMinimoParaPasarEjercicio: 60,

  /**
   * Score mínimo (0-100) que necesita un ejercicio para contar como
   * "completado" a la hora de evaluar si desbloqueás el siguiente nivel.
   */
  scoreMinimoParaDesbloquearNivel: 70,

  /**
   * Porcentaje (0-1) de ejercicios del nivel que necesitás completar
   * con buen score (ver scoreMinimoParaDesbloquearNivel) para desbloquear
   * el siguiente nivel.
   */
  porcentajeMinimoParaDesbloquearNivel: 0.8,

  /** Umbrales de score (0-100) para clasificar una palabra individual. */
  clasificacionPalabra: {
    bien: 70, // score >= 70 -> "bien"
    regular: 50, // score >= 50 -> "regular" (si no, "mal")
  },

  /** Umbrales de score (0-100) para el mensaje motivacional al terminar un ejercicio. */
  mensajePorScore: {
    perfecto: 90, // score >= 90 -> "¡Perfecto!"
    muyBien: 70, // score >= 70 -> "¡Muy bien!"
    casi: 50, // score >= 50 -> "Casi, practica más" (si no, "Necesita práctica")
  },

  /** Umbrales de score PROMEDIO (0-100) para las estrellas (0-3) de un nivel. */
  estrellas: {
    tres: 90,
    dos: 70,
    una: 60,
  },

  /** Pesos relativos usados al calcular el score general de una frase. */
  pesosPalabra: {
    sonidoDificil: 1.5, // palabras con un sonido difícil pesan más
    palabraFuncional: 0.5, // "the", "a", "is", etc pesan menos
    normal: 1,
  },

  colorCirculo: {
    exito: 80,
    advertencia: 60,
  },

  /**
   * Si el promedio del intento actual cae por debajo de este score,
   * se muestra la alerta de "no vas a desbloquear el siguiente nivel
   * con este promedio".
   */
  scoreMinimoParaAlertaDePromedio: 70,
} as const
