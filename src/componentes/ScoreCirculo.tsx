import { LIMITES } from '../configuracion/limites'

interface ScoreCirculoProps {
  score: number
}

const RADIO = 54
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

function colorPorScore(score: number): string {
  if (score >= LIMITES.colorCirculo.exito) return 'var(--color-exito)'
  if (score >= LIMITES.colorCirculo.advertencia) return 'var(--color-advertencia)'
  return 'var(--color-error)'
}

/**
 * Círculo SVG con trazo fino que representa el score general (0-100).
 * Sin relleno de fondo colorido, solo el trazo del progreso y el número.
 */
export function ScoreCirculo({ score }: ScoreCirculoProps) {
  const scoreClamp = Math.max(0, Math.min(100, score))
  const desplazamiento = CIRCUNFERENCIA - (scoreClamp / 100) * CIRCUNFERENCIA
  const color = colorPorScore(scoreClamp)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={RADIO}
          fill="none"
          stroke="#222222"
          strokeWidth="2"
        />
        <circle
          cx="64"
          cy="64"
          r={RADIO}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={desplazamiento}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 200ms ease, stroke 200ms ease' }}
        />
      </svg>
      <span className="absolute text-5xl font-medium text-texto-principal">{scoreClamp}</span>
    </div>
  )
}
