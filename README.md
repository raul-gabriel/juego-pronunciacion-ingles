# Acento Cero

Juego web para practicar pronunciación de inglés, pensado para hispanohablantes. Usa el reconocimiento y la síntesis de voz nativos del navegador para evaluar tu pronunciación palabra por palabra, con niveles progresivos, vidas, puntos acumulados y feedback inmediato.

Sin backend (por ahora) y sin librerías de pago — corre 100% en el navegador.

## Cómo funciona

1. Elegís un nivel: palabras → frases cortas → frases largas → párrafos.
2. Tocás **Escuchar** para oír la pronunciación nativa (Web Speech API / `SpeechSynthesis`).
3. Tocás **Hablar** y repetís la frase (Web Speech API / `SpeechRecognition`).
4. La app compara lo que dijiste contra el texto esperado, palabra por palabra, y te muestra un score (0-100) con tips de pronunciación para los sonidos que más cuestan al pasar del español al inglés (`th`, `r`, vocales, etc).
5. Tenés 3 vidas por intento y vas acumulando puntos; si tu promedio no alcanza para desbloquear el siguiente nivel, te avisa y podés reiniciar desde cero.

## Algoritmos / lógica

- **Distancia de Levenshtein** (implementada a mano, sin librerías): mide cuántas ediciones (insertar/borrar/sustituir caracteres) hacen falta para convertir la palabra escuchada en la esperada. Esa distancia se normaliza por longitud y se convierte en un score 0-100.
- **Alineación por posición**: la frase se separa en palabras y se compara cada palabra esperada contra la palabra en la misma posición de lo que dijo el usuario.
- **Score ponderado**: el score general de una frase no es un promedio simple — las palabras con sonidos difíciles pesan x1.5, las palabras funcionales (`the`, `a`, `is`...) pesan x0.5, el resto pesa x1.
- **Web Speech API** nativa del navegador para reconocimiento (`SpeechRecognition` / `webkitSpeechRecognition`) y síntesis de voz (`SpeechSynthesis`), en inglés `en-US`.
- Todos los umbrales del juego (score para pasar un ejercicio, score para desbloquear nivel, vidas, pesos, etc) están centralizados en `src/configuracion/limites.ts` — es el único archivo que hay que tocar para ajustar la dificultad.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (estado del progreso del usuario y navegación entre pantallas, con persistencia en `localStorage`)
- Web Speech API (sin librerías externas de voz)

## Estructura

```
src/
  componentes/      — UI (NivelSelector, PantallaEjercicio, BotonMicrofono, etc)
  hooks/            — lógica de voz y evaluación (usarReconocimientoVoz, usarSintesisVoz, usarEvaluacion)
  store/            — estado global con Zustand (progresoStore, pantallaStore)
  configuracion/    — límites/umbrales del juego en un solo archivo (limites.ts)
  utilidades/        — Levenshtein, normalización de texto, cálculo de score
  datos/            — ejercicios de cada nivel
  types/            — tipos de TypeScript del proyecto
```

## Correr el proyecto

```bash
npm install
npm run dev
```

## Roadmap / pendiente de backend

El progreso se guarda en `localStorage`. Los puntos de conexión a una futura API están marcados con comentarios `TODO_BACKEND` en `src/store/progresoStore.ts` y `src/datos/index.ts`.

## Créditos

Raúl Hacho Cutipa
