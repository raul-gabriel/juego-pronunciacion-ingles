import { useMemo } from 'react'
import { useProgresoStore, porcentajeCompletadoDeNivel, estrellasDeNivel } from './store/progresoStore'
import { usePantallaStore } from './store/pantallaStore'
import { obtenerEjerciciosDeNivel } from './datos'
import { NivelSelector } from './componentes/NivelSelector'
import { PantallaEjercicio } from './componentes/PantallaEjercicio'
import { PantallaResultado } from './componentes/PantallaResultado'
import type { Nivel } from './types/types'

function App() {
  const progreso = useProgresoStore((estado) => estado.progreso)
  const perderVida = useProgresoStore((estado) => estado.perderVida)
  const reiniciarVidas = useProgresoStore((estado) => estado.reiniciarVidas)
  const avanzarEjercicio = useProgresoStore((estado) => estado.avanzarEjercicio)
  const seleccionarNivel = useProgresoStore((estado) => estado.seleccionarNivel)

  const pantalla = usePantallaStore((estado) => estado.pantalla)
  const irASelector = usePantallaStore((estado) => estado.irASelector)
  const irAEjercicio = usePantallaStore((estado) => estado.irAEjercicio)
  const irAResultado = usePantallaStore((estado) => estado.irAResultado)

  const ejerciciosDelNivelActual = useMemo(
    () => obtenerEjerciciosDeNivel(progreso.nivelActual),
    [progreso.nivelActual],
  )

  const ejercicioActual = ejerciciosDelNivelActual[progreso.ejercicioActualIndex]

  const historialDelNivelActual = useMemo(() => {
    const idsDelNivel = new Set(ejerciciosDelNivelActual.map((ejercicio) => ejercicio.id))
    return progreso.historial.filter((registro) => idsDelNivel.has(registro.ejercicioId))
  }, [progreso.historial, ejerciciosDelNivelActual])

  function manejarSeleccionarNivel(nivel: Nivel) {
    seleccionarNivel(nivel)
    irAEjercicio()
  }

  function manejarPaso(ejercicioId: string, score: number) {
    const esElUltimoEjercicio = progreso.ejercicioActualIndex + 1 >= ejerciciosDelNivelActual.length
    avanzarEjercicio(ejercicioId, score)

    if (esElUltimoEjercicio) {
      irAResultado()
    }
  }

  function manejarRepetirNivel() {
    seleccionarNivel(progreso.nivelActual)
    irAEjercicio()
  }

  function manejarIrASiguienteNivel() {
    const siguienteNivel = (progreso.nivelActual + 1) as Nivel
    seleccionarNivel(siguienteNivel)
    irAEjercicio()
  }

  function manejarSinVidas() {
    reiniciarVidas()
  }

  if (pantalla === 'selector') {
    return (
      <NivelSelector
        nivelesDesbloqueados={progreso.nivelesDesbloqueados}
        onSeleccionarNivel={manejarSeleccionarNivel}
        porcentajeCompletadoDeNivel={(nivel) => porcentajeCompletadoDeNivel(nivel, progreso.historial)}
        estrellasDeNivel={(nivel) => estrellasDeNivel(nivel, progreso.historial)}
      />
    )
  }

  if (pantalla === 'resultado') {
    const siguienteNivel = (progreso.nivelActual + 1) as Nivel
    return (
      <PantallaResultado
        ejerciciosDelNivel={ejerciciosDelNivelActual}
        historialDelNivel={historialDelNivelActual}
        siguienteNivelDesbloqueado={progreso.nivelesDesbloqueados.includes(siguienteNivel)}
        onRepetirNivel={manejarRepetirNivel}
        onIrASiguienteNivel={manejarIrASiguienteNivel}
        onVolverASelector={irASelector}
      />
    )
  }

  // pantalla === 'ejercicio'
  if (!ejercicioActual) {
    // Caso límite: el índice quedó fuera de rango (no debería pasar en flujo normal)
    return (
      <NivelSelector
        nivelesDesbloqueados={progreso.nivelesDesbloqueados}
        onSeleccionarNivel={manejarSeleccionarNivel}
        porcentajeCompletadoDeNivel={(nivel) => porcentajeCompletadoDeNivel(nivel, progreso.historial)}
        estrellasDeNivel={(nivel) => estrellasDeNivel(nivel, progreso.historial)}
      />
    )
  }

  return (
    <PantallaEjercicio
      ejercicio={ejercicioActual}
      ejercicioActualIndex={progreso.ejercicioActualIndex}
      totalEjercicios={ejerciciosDelNivelActual.length}
      vidasRestantes={progreso.vidasRestantes}
      onPaso={manejarPaso}
      onPerderVida={perderVida}
      onSinVidas={manejarSinVidas}
    />
  )
}

export default App
