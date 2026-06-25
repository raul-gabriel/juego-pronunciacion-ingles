import type { Ejercicio } from '../types/types'

// Ordenadas de fácil a difícil para hispanohablantes.
// Cada palabra trabaja al menos un sonido problemático típico.
export const palabrasNivel1: Ejercicio[] = [

  {
    id: 'n1-002',
    nivel: 1,
    texto: 'water',
    tipEscrito: 'uater',
    categoria: 'comida',
    sonidosDificiles: [
      {
        sonido: 'w',
        ejemplo: 'water, word, work',
        tip: 'Redondea los labios como para silbar antes de empezar el sonido',
        palabrasEnEjercicio: ['water'],
      },
    ],
  },
  {
    id: 'n1-003',
    nivel: 1,
    texto: 'very',
    tipEscrito: 'veri',
    categoria: 'adjetivos',
    sonidosDificiles: [
      {
        sonido: 'v vs b',
        ejemplo: 'very, vote, van',
        tip: 'Muerde levemente el labio inferior con los dientes superiores, no juntes los labios como en la "b"',
        palabrasEnEjercicio: ['very'],
      },
    ],
  },
  {
    id: 'n1-004',
    nivel: 1,
    texto: 'she',
    tipEscrito: 'shi',
    categoria: 'pronombres',
    sonidosDificiles: [
      {
        sonido: 'sh',
        ejemplo: 'she, show, shop',
        tip: 'Redondea un poco los labios y deja salir el aire sin tocar la lengua con los dientes',
        palabrasEnEjercicio: ['she'],
      },
    ],
  },
  {
    id: 'n1-005',
    nivel: 1,
    texto: 'chair',
    tipEscrito: 'cher',
    categoria: 'objetos',
    sonidosDificiles: [
      {
        sonido: 'ch vs sh',
        ejemplo: 'chair, cheese, choose',
        tip: 'Empieza tocando la lengua contra el paladar y suelta de golpe, como una pequeña explosión de aire',
        palabrasEnEjercicio: ['chair'],
      },
    ],
  },
  {
    id: 'n1-006',
    nivel: 1,
    texto: 'ship',
    tipEscrito: 'ship (con i corta)',
    categoria: 'objetos',
    sonidosDificiles: [
      {
        sonido: 'vowels',
        ejemplo: 'ship vs sheep, bit vs beat',
        tip: 'Es una "i" corta y relajada, no tan cerrada como la "i" del español',
        palabrasEnEjercicio: ['ship'],
      },
    ],
  },
  {
    id: 'n1-007',
    nivel: 1,
    texto: 'red',
    tipEscrito: 'red (r suave)',
    categoria: 'colores',
    sonidosDificiles: [
      {
        sonido: 'r americana',
        ejemplo: 'red, right, rain',
        tip: 'No vibres la lengua como en español. Curva la punta de la lengua hacia atrás sin tocar el paladar',
        palabrasEnEjercicio: ['red'],
      },
    ],
  },
  {
    id: 'n1-008',
    nivel: 1,
    texto: 'ball',
    tipEscrito: 'bol',
    categoria: 'objetos',
    sonidosDificiles: [
      {
        sonido: 'l final',
        ejemplo: 'ball, call, full',
        tip: 'Al final de la palabra, la lengua sube hacia atrás del paladar; suena más oscura que la "l" del español',
        palabrasEnEjercicio: ['ball'],
      },
    ],
  },
  {
    id: 'n1-009',
    nivel: 1,
    texto: 'talked',
    tipEscrito: 'tokt',
    categoria: 'verbos',
    sonidosDificiles: [
      {
        sonido: 'ed endings',
        ejemplo: 'talked, played, wanted',
        tip: 'Después de un sonido sordo como la "k", el "-ed" se pronuncia como "t", no como "ed"',
        palabrasEnEjercicio: ['talked'],
      },
    ],
  },
  {
    id: 'n1-010',
    nivel: 1,
    texto: 'think',
    tipEscrito: 'zink',
    categoria: 'verbos',
    sonidosDificiles: [
      {
        sonido: 'th',
        ejemplo: 'think, that, the',
        tip: 'Pon la lengua entre los dientes superiores e inferiores y sopla aire',
        palabrasEnEjercicio: ['think'],
      },
    ],
  },
]
