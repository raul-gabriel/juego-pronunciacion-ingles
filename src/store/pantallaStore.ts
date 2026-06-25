import { create } from 'zustand'

export type Pantalla = 'selector' | 'ejercicio' | 'resultado'

interface PantallaStore {
  pantalla: Pantalla
  irASelector: () => void
  irAEjercicio: () => void
  irAResultado: () => void
}

/**
 * Store de navegación entre las 3 pantallas del juego. Antes era un
 * useState<Pantalla> dentro de App.tsx; se saca a un store porque es
 * estado del juego (no UI puramente local de un solo componente) y así
 * cualquier pantalla puede navegar sin pasar callbacks por props.
 */
export const usePantallaStore = create<PantallaStore>((set) => ({
  pantalla: 'selector',
  irASelector: () => set({ pantalla: 'selector' }),
  irAEjercicio: () => set({ pantalla: 'ejercicio' }),
  irAResultado: () => set({ pantalla: 'resultado' }),
}))
