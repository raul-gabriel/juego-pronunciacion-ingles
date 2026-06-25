import type { EstadoMic } from '../types/types'

interface BotonMicrofonoProps {
  estado: EstadoMic
  onClick: () => void
  deshabilitadoExtra?: boolean
}

const TEXTO_POR_ESTADO: Record<EstadoMic, string> = {
  listo: 'Hablar',
  grabando: 'Detener',
  procesando: 'Procesando',
  error: 'No disponible',
}

// Clases por estado: cada uno con su propio color para que se distingan
// de un vistazo, no solo por el grosor del borde.
const CLASES_POR_ESTADO: Record<EstadoMic, string> = {
  listo:
    'border-borde text-texto-principal hover:bg-hover-fondo',
  grabando:
    'border-grabando text-grabando bg-red-50',
  procesando:
    'border-procesando text-procesando bg-blue-50 cursor-not-allowed',
  error:
    'border-error text-error bg-red-50 opacity-60 cursor-not-allowed',
}

/**
 * Botón principal de grabación. Cambia de apariencia según el estado:
 * - listo: borde neutro
 * - grabando: borde y texto rojo + animación de ondas de sonido
 * - procesando: borde y texto azul + spinner
 * - error: borde y texto rojo apagado, deshabilitado
 */
export function BotonMicrofono({ estado, onClick, deshabilitadoExtra }: BotonMicrofonoProps) {
  const deshabilitado = estado === 'procesando' || estado === 'error' || deshabilitadoExtra

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={deshabilitado}
        className={`relative flex h-20 w-20 items-center justify-center rounded-lg border-2 transition-colors duration-200 ${CLASES_POR_ESTADO[estado]} ${
          deshabilitadoExtra ? 'cursor-not-allowed opacity-40' : ''
        }`}
        aria-label={TEXTO_POR_ESTADO[estado]}
      >
        {estado === 'procesando' ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-procesando" />
        ) : (
          <MicIcono estado={estado} />
        )}

        {estado === 'grabando' && <OndasDeSonido />}
      </button>

      <p
        className={`text-xs font-medium tracking-widest uppercase ${
          estado === 'grabando'
            ? 'text-grabando'
            : estado === 'procesando'
              ? 'text-procesando'
              : estado === 'error'
                ? 'text-error'
                : 'text-texto-secundario'
        }`}
      >
        {TEXTO_POR_ESTADO[estado]}
      </p>
    </div>
  )
}

function MicIcono({ estado }: { estado: EstadoMic }) {
  const color =
    estado === 'grabando'
      ? '#dc2626'
      : estado === 'error'
        ? '#dc2626'
        : '#1c1c1a'

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

/**
 * Animación simple de ondas de sonido alrededor del botón mientras graba.
 */
function OndasDeSonido() {
  return (
    <span className="pointer-events-none absolute inset-0 rounded-lg">
      <span className="absolute inset-0 animate-ping rounded-lg border-2 border-grabando opacity-30" />
    </span>
  )
}
