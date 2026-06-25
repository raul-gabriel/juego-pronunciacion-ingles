interface ProgresoNivelProps {
  ejercicioActualIndex: number
  totalEjercicios: number
}

/**
 * Línea delgada que muestra el avance dentro del nivel actual.
 * Sin colores llamativos, solo blanco sobre fondo de borde tenue.
 */
export function ProgresoNivel({ ejercicioActualIndex, totalEjercicios }: ProgresoNivelProps) {
  const porcentaje = totalEjercicios === 0 ? 0 : (ejercicioActualIndex / totalEjercicios) * 100

  return (
    <div className="w-full">
      <div className="h-px w-full bg-borde-sutil">
        <div
          className="h-px bg-acento transition-[width] duration-200"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="mt-2 text-xs tracking-widest text-texto-terciario uppercase">
        {ejercicioActualIndex} / {totalEjercicios}
      </p>
    </div>
  )
}
