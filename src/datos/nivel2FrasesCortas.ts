import type { Ejercicio } from '../types/types'

// 10 frases cortas (3-6 palabras) cubriendo saludos, pedir ayuda,
// preguntas básicas, números, colores y comida.
export const frasesNivel2: Ejercicio[] = [
  {
    id: 'n2-001',
    nivel: 2,
    texto: 'Hello, how are you?',
    tipEscrito: 'Jelou, jau ar yu?',
    categoria: 'saludo',
    sonidosDificiles: [
      {
        sonido: 'w',
        ejemplo: 'how',
        tip: 'Redondea los labios antes de empezar el sonido',
        palabrasEnEjercicio: ['how'],
      },
    ],
  },
  {
    id: 'n2-002',
    nivel: 2,
    texto: 'Can you help me?',
    tipEscrito: 'Kan yu jelp mi?',
    categoria: 'ayuda',
    sonidosDificiles: [],
  },
  {
    id: 'n2-003',
    nivel: 2,
    texto: 'Where is the bathroom?',
    tipEscrito: 'Uer is de bazrum?',
    categoria: 'pregunta',
    sonidosDificiles: [
      {
        sonido: 'th',
        ejemplo: 'the, bathroom',
        tip: 'Pon la lengua entre los dientes y sopla aire suavemente',
        palabrasEnEjercicio: ['the', 'bathroom'],
      },
    ],
  },
  {
    id: 'n2-004',
    nivel: 2,
    texto: 'What time is it?',
    tipEscrito: 'Uat taim is it?',
    categoria: 'pregunta',
    sonidosDificiles: [
      {
        sonido: 'w',
        ejemplo: 'what',
        tip: 'Redondea los labios antes de empezar el sonido',
        palabrasEnEjercicio: ['what'],
      },
    ],
  },
  {
    id: 'n2-005',
    nivel: 2,
    texto: 'I would like three coffees',
    tipEscrito: 'Ai wud laik zri cofis',
    categoria: 'comida',
    sonidosDificiles: [
      {
        sonido: 'th',
        ejemplo: 'three',
        tip: 'Pon la lengua entre los dientes y sopla aire',
        palabrasEnEjercicio: ['three'],
      },
    ],
  },
  {
    id: 'n2-006',
    nivel: 2,
    texto: 'This is very good',
    tipEscrito: 'Dis is veri gud',
    categoria: 'comida',
    sonidosDificiles: [
      {
        sonido: 'th',
        ejemplo: 'this',
        tip: 'Pon la lengua entre los dientes y vibra suavemente (sonido sonoro)',
        palabrasEnEjercicio: ['this'],
      },
      {
        sonido: 'v vs b',
        ejemplo: 'very',
        tip: 'Muerde levemente el labio inferior, no juntes los labios',
        palabrasEnEjercicio: ['very'],
      },
    ],
  },
  {
    id: 'n2-007',
    nivel: 2,
    texto: 'She likes the color red',
    tipEscrito: 'Shi laiks de color red',
    categoria: 'colores',
    sonidosDificiles: [
      {
        sonido: 'sh',
        ejemplo: 'she',
        tip: 'Redondea los labios y deja salir el aire sin tocar los dientes con la lengua',
        palabrasEnEjercicio: ['she'],
      },
      {
        sonido: 'r americana',
        ejemplo: 'red',
        tip: 'Curva la punta de la lengua hacia atrás sin tocar el paladar',
        palabrasEnEjercicio: ['red'],
      },
    ],
  },
  {
    id: 'n2-008',
    nivel: 2,
    texto: 'I have two brothers',
    tipEscrito: 'Ai jav tu broders',
    categoria: 'familia',
    sonidosDificiles: [
      {
        sonido: 'th',
        ejemplo: 'brothers',
        tip: 'Pon la lengua entre los dientes y vibra suavemente',
        palabrasEnEjercicio: ['brothers'],
      },
    ],
  },
  {
    id: 'n2-009',
    nivel: 2,
    texto: 'We are working today',
    tipEscrito: 'Ui ar uorking tudei',
    categoria: 'trabajo',
    sonidosDificiles: [
      {
        sonido: 'w',
        ejemplo: 'we, working',
        tip: 'Redondea los labios antes de empezar el sonido',
        palabrasEnEjercicio: ['we', 'working'],
      },
      {
        sonido: 'ing',
        ejemplo: 'working',
        tip: 'El sonido final es nasal, la lengua toca el paladar blando, no se pronuncia como "in"',
        palabrasEnEjercicio: ['working'],
      },
    ],
  },
  {
    id: 'n2-010',
    nivel: 2,
    texto: 'I want a full glass',
    tipEscrito: 'Ai uant a ful glas',
    categoria: 'comida',
    sonidosDificiles: [
      {
        sonido: 'w',
        ejemplo: 'want',
        tip: 'Redondea los labios antes de empezar el sonido',
        palabrasEnEjercicio: ['want'],
      },
      {
        sonido: 'l final',
        ejemplo: 'full',
        tip: 'La lengua sube hacia atrás del paladar al final, suena más oscura que en español',
        palabrasEnEjercicio: ['full'],
      },
    ],
  },
]
