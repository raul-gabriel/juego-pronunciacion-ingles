/**
 * Botón "Escuchar" que reproduce la frase con voz nativa.
 * Sin iconos ni emojis, solo texto y cambio de estado por color/borde.
 * Se deshabilita mientras el micrófono está activo (grabando o procesando),
 * para que el reconocimiento de voz no capte el audio reproducido por
 * los parlantes como si fuera la voz del usuario.
 */
interface BotonEscucharProps {
  onClick: () => void
  estaReproduciendo: boolean
  esCompatible: boolean
  micEstaActivo?: boolean
}

export function BotonEscuchar({
  onClick,
  estaReproduciendo,
  esCompatible,
  micEstaActivo,
}: BotonEscucharProps) {
  if (!esCompatible) {
    return (
      <p className="text-xs text-texto-terciario">
        Tu navegador no soporta reproducción de voz
      </p>
    )
  }

  const deshabilitado = estaReproduciendo || micEstaActivo

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={deshabilitado}
        className={
          estaReproduciendo
            ? 'rounded-lg border border-acento px-4 py-2 text-sm text-acento transition-colors duration-200'
            : micEstaActivo
              ? 'cursor-not-allowed rounded-lg border border-borde px-4 py-2 text-sm text-texto-terciario opacity-50 transition-colors duration-200'
              : 'rounded-lg border border-borde px-4 py-2 text-sm text-texto-principal transition-colors duration-200 hover:bg-hover-fondo'
        }
      >
        {estaReproduciendo ? 'Reproduciendo...' : 'Escuchar'}
      </button>
      {micEstaActivo && (
        <p className="text-xs text-texto-secundario">Detené la grabación para poder escuchar</p>
      )}
    </div>
  )
}
