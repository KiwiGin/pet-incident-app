import { Pet } from '../types';

const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Rocky',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'El otro día cuando salimos a pasear, se asustó y salió corriendo. Si alguien lo ha visto necesito que se contacte conmigo por favor!',
    status: 'lost',
    location: {
      latitude: -12.088284,
      longitude: -77.073992,
      address: 'Jirón Ayacucho 750, Magdalena del Mar, Lima'
    },
    reportedBy: '1',
    reportedAt: new Date('2024-01-15'),
    isFavorite: false
  },
  {
    id: '2',
    name: 'Mauricio',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    description: 'El otro día cuando salimos a pasear, se asustó y salió corriendo. Si alguien lo ha visto necesito que se contacte conmigo por favor!',
    status: 'lost',
    location: {
      latitude: -12.086195,
      longitude: -77.052352,
      address: 'San Isidro, Lima'
    },
    reportedBy: 'user2',
    reportedAt: new Date('2024-01-14'),
    isFavorite: false
  },
  {
    id: '3',
    name: 'Raúl',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    description: 'El otro día cuando salimos a pasear, se asustó y salió corriendo. Si alguien lo ha visto necesito que se contacte conmigo por favor!',
    status: 'lost',
    location: {
      latitude: -12.0464,
      longitude: -77.0428,
      address: 'Barranco, Lima'
    },
    reportedBy: '1',
    reportedAt: new Date('2024-01-13'),
    isFavorite: false
  },
  {
    id: '4',
    name: 'Luna',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Se escapó por un hueco en la cerca del jardín. Es muy tímida con extraños pero responde a su nombre. Usa collar rosa con mi número de teléfono.',
    status: 'lost',
    location: {
      latitude: -12.1050,
      longitude: -77.0350,
      address: 'Surco, Lima'
    },
    reportedBy: 'user4',
    reportedAt: new Date('2024-01-12'),
    isFavorite: false
  },
  {
    id: '5',
    name: 'Simba',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    description: 'No ha regresado a casa desde hace 2 días. Es naranja con rayas blancas. Muy sociable y le encanta la comida. Si lo ven por favor avísenme!',
    status: 'lost',
    location: {
      latitude: -12.0700,
      longitude: -77.0500,
      address: 'La Molina, Lima'
    },
    reportedBy: 'user5',
    reportedAt: new Date('2024-01-11'),
    isFavorite: false
  },
  {
    id: '6',
    name: 'Max',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Se perdió en el parque mientras jugábamos. Es un golden retriever muy amigable. Tiene microchip. Recompensa por información.',
    status: 'lost',
    location: {
      latitude: -12.0800,
      longitude: -77.0300,
      address: 'San Borja, Lima'
    },
    reportedBy: 'user6',
    reportedAt: new Date('2024-01-10'),
    isFavorite: false
  },
  {
    id: '7',
    name: 'Michi',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
    description: 'Salió por la ventana y no regresó. Es gato persa blanco, muy peludo. Necesita medicación diaria. Por favor ayúdenme a encontrarlo.',
    status: 'lost',
    location: {
      latitude: -12.0600,
      longitude: -77.0450,
      address: 'Pueblo Libre, Lima'
    },
    reportedBy: 'user7',
    reportedAt: new Date('2024-01-09'),
    isFavorite: false
  },
  {
    id: '8',
    name: 'Toby',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Desapareció después de los fuegos artificiales. Es beagle tricolor, muy asustadizo. Lleva placa de identificación azul.',
    status: 'lost',
    location: {
      latitude: -12.0900,
      longitude: -77.0200,
      address: 'Jesús María, Lima'
    },
    reportedBy: 'user8',
    reportedAt: new Date('2024-01-08'),
    isFavorite: false
  },
  {
    id: '9',
    name: 'Pelusa',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
    description: 'Gata pequeña de pelo largo gris. Muy cariñosa. Se escapó cuando abrieron la puerta. Está esterilizada. La extrañamos mucho.',
    status: 'lost',
    location: {
      latitude: -12.0500,
      longitude: -77.0600,
      address: 'Magdalena, Lima'
    },
    reportedBy: 'user9',
    reportedAt: new Date('2024-01-07'),
    isFavorite: false
  },
  {
    id: '10',
    name: 'Bobby',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Perro mestizo mediano, color café. Se perdió cerca del mercado. Es muy amigable pero puede estar asustado. Cualquier información es útil.',
    status: 'lost',
    location: {
      latitude: -12.1100,
      longitude: -77.0100,
      address: 'San Juan de Miraflores, Lima'
    },
    reportedBy: 'user10',
    reportedAt: new Date('2024-01-06'),
    isFavorite: false
  },
  {
    id: '11',
    name: 'Zeus',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    description: 'Pastor alemán grande. Se escapó durante una tormenta. Tiene collar negro con placa de identificación. Es muy leal pero asustadizo.',
    status: 'lost',
    location: {
      latitude: -12.0950,
      longitude: -77.0280,
      address: 'Lince, Lima'
    },
    reportedBy: 'user11',
    reportedAt: new Date('2024-01-05'),
    isFavorite: false
  },
  {
    id: '12',
    name: 'Coco',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400',
    description: 'Gato siamés con ojos azules. Muy vocal. Se salió por la puerta principal. Responde a su nombre cuando escucha comida.',
    status: 'lost',
    location: {
      latitude: -12.0720,
      longitude: -77.0380,
      address: 'San Miguel, Lima'
    },
    reportedBy: 'user12',
    reportedAt: new Date('2024-01-04'),
    isFavorite: false
  },
  {
    id: '13',
    name: 'Canela',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
    description: 'Cocker spaniel color canela. Muy dócil y cariñosa. Se perdió en el parque Kennedy. Tiene chip de identificación.',
    status: 'lost',
    location: {
      latitude: -12.1200,
      longitude: -77.0320,
      address: 'Miraflores, Lima'
    },
    reportedBy: 'user13',
    reportedAt: new Date('2024-01-03'),
    isFavorite: false
  },
  {
    id: '14',
    name: 'Oreo',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400',
    description: 'Gato blanco y negro, patrón tipo vaca. Muy juguetón. Se escapó por el balcón. Usa collar rojo con cascabel.',
    status: 'lost',
    location: {
      latitude: -12.0580,
      longitude: -77.0420,
      address: 'Breña, Lima'
    },
    reportedBy: 'user14',
    reportedAt: new Date('2024-01-02'),
    isFavorite: false
  },
  {
    id: '15',
    name: 'Dante',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    description: 'Dóberman negro y marrón. Muy protector. Se perdió durante un paseo. Tiene tatuaje de identificación en la oreja.',
    status: 'lost',
    location: {
      latitude: -12.0850,
      longitude: -77.0150,
      address: 'La Victoria, Lima'
    },
    reportedBy: 'user15',
    reportedAt: new Date('2024-01-01'),
    isFavorite: false
  },
  {
    id: '16',
    name: 'Manchitas',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400',
    description: 'Gato atigrado con manchas. Muy tímido con extraños. Se escondió después de escuchar fuegos artificiales. Lo extrañamos.',
    status: 'lost',
    location: {
      latitude: -12.0640,
      longitude: -77.0520,
      address: 'Callao, Lima'
    },
    reportedBy: 'user16',
    reportedAt: new Date('2023-12-31'),
    isFavorite: false
  },
  {
    id: '17',
    name: 'Princesa',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    description: 'Chihuahua color crema. Muy pequeña y frágil. Se escapó por un hueco en la reja. Usa vestido rosa y collar con brillantes.',
    status: 'lost',
    location: {
      latitude: -12.1150,
      longitude: -77.0250,
      address: 'Surquillo, Lima'
    },
    reportedBy: 'user17',
    reportedAt: new Date('2023-12-30'),
    isFavorite: false
  },
  {
    id: '18',
    name: 'Tigre',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400',
    description: 'Gato naranja con rayas oscuras. Cazador experto. No ha vuelto desde hace 3 días. Suele estar en techos y árboles.',
    status: 'lost',
    location: {
      latitude: -12.0980,
      longitude: -77.0420,
      address: 'San Isidro, Lima'
    },
    reportedBy: 'user18',
    reportedAt: new Date('2023-12-29'),
    isFavorite: false
  },
  {
    id: '19',
    name: 'Chucho',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400',
    description: 'Perro callejero adoptado. Color marrón claro. Muy noble. Se asustó con una moto y salió corriendo. Por favor ayúdenme.',
    status: 'lost',
    location: {
      latitude: -12.0530,
      longitude: -77.0580,
      address: 'Bellavista, Callao'
    },
    reportedBy: 'user19',
    reportedAt: new Date('2023-12-28'),
    isFavorite: false
  },
  {
    id: '20',
    name: 'Nieve',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400',
    description: 'Gata persa completamente blanca. Pelo largo y esponjoso. Se salió durante la limpieza de la casa. Muy asustadiza.',
    status: 'lost',
    location: {
      latitude: -12.1080,
      longitude: -77.0380,
      address: 'Santiago de Surco, Lima'
    },
    reportedBy: 'user20',
    reportedAt: new Date('2023-12-27'),
    isFavorite: false
  },
  {
    id: '21',
    name: 'Chispa',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
    description: 'Jack Russell Terrier blanco con manchas negras. Muy energético. Se escapó persiguiendo una pelota. Collar verde.',
    status: 'lost',
    location: {
      latitude: -12.0420,
      longitude: -77.0620,
      address: 'Ventanilla, Callao'
    },
    reportedBy: 'user21',
    reportedAt: new Date('2023-12-26'),
    isFavorite: false
  },
  {
    id: '22',
    name: 'Sombra',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=400',
    description: 'Gato negro de pelo corto. Ojos verdes brillantes. Se escapó por la ventana del segundo piso. Muy ágil y rápido.',
    status: 'lost',
    location: {
      latitude: -12.0760,
      longitude: -77.0440,
      address: 'Jesús María, Lima'
    },
    reportedBy: 'user22',
    reportedAt: new Date('2023-12-25'),
    isFavorite: false
  },
  {
    id: '23',
    name: 'Firulais',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Perro mestizo mediano. Color café con blanco. El mejor amigo de la familia. Se perdió en Año Nuevo. Recompensa.',
    status: 'lost',
    location: {
      latitude: -12.1020,
      longitude: -77.0180,
      address: 'San Luis, Lima'
    },
    reportedBy: 'user23',
    reportedAt: new Date('2023-12-24'),
    isFavorite: false
  },
  {
    id: '24',
    name: 'Minina',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0ed?w=400',
    description: 'Gata tricolor pequeña. Muy cariñosa. Salió y no regresó. Está embarazada. Por favor ayúdenme a encontrarla.',
    status: 'lost',
    location: {
      latitude: -12.0890,
      longitude: -77.0330,
      address: 'Pueblo Libre, Lima'
    },
    reportedBy: 'user24',
    reportedAt: new Date('2023-12-23'),
    isFavorite: false
  },
  {
    id: '25',
    name: 'Duke',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=400',
    description: 'Bulldog inglés. Color blanco con manchas marrones. Ronca mucho. Se perdió cerca del veterinario. Tiene problemas respiratorios.',
    status: 'lost',
    location: {
      latitude: -12.0670,
      longitude: -77.0490,
      address: 'Magdalena del Mar, Lima'
    },
    reportedBy: 'user25',
    reportedAt: new Date('2023-12-22'),
    isFavorite: false
  },
  {
    id: '26',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Golden retriever color dorado. Se perdió en el parque. Muy amigable con niños. Responde a su nombre.',
    status: 'lost',
    location: {
      latitude: -12.0780,
      longitude: -77.0320,
      address: 'San Isidro, Lima'
    },
    reportedBy: 'user26',
    reportedAt: new Date('2023-12-21'),
    isFavorite: false
  },
  {
    id: '27',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Labrador negro. Se escapó del jardín. Le encanta jugar con pelotas. Collar azul con placa.',
    status: 'lost',
    location: {
      latitude: -12.0920,
      longitude: -77.0450,
      address: 'Miraflores, Lima'
    },
    reportedBy: 'user27',
    reportedAt: new Date('2023-12-20'),
    isFavorite: false
  },
  {
    id: '28',
    name: 'Felix',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    description: 'Gato naranja con rayas. Muy astuto. Se escapó por la ventana. Le gusta la comida de atún.',
    status: 'lost',
    location: {
      latitude: -12.1050,
      longitude: -77.0280,
      address: 'Surco, Lima'
    },
    reportedBy: 'user28',
    reportedAt: new Date('2023-12-19'),
    isFavorite: false
  },
  {
    id: '29',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Cocker spaniel. Color café claro. Perdido cerca del mercado. Muy dócil y cariñoso.',
    status: 'lost',
    location: {
      latitude: -12.0560,
      longitude: -77.0540,
      address: 'Callao, Lima'
    },
    reportedBy: 'user29',
    reportedAt: new Date('2023-12-18'),
    isFavorite: false
  },
  {
    id: '30',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Beagle tricolor. Se perdió persiguiendo un gato. Usa collar rojo. Recompensa por encontrarlo.',
    status: 'lost',
    location: {
      latitude: -12.0850,
      longitude: -77.0380,
      address: 'Jesús María, Lima'
    },
    reportedBy: 'user30',
    reportedAt: new Date('2023-12-17'),
    isFavorite: false
  },
  {
    id: '31',
    name: 'Misha',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    description: 'Gata siamesa. Ojos azules intensos. Se salió durante una mudanza. Muy vocal y cariñosa.',
    status: 'lost',
    location: {
      latitude: -12.0690,
      longitude: -77.0410,
      address: 'Pueblo Libre, Lima'
    },
    reportedBy: 'user31',
    reportedAt: new Date('2023-12-16'),
    isFavorite: false
  },
  {
    id: '32',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Bulldog francés. Color crema. Se escapó del auto. Problemas respiratorios, necesita cuidados.',
    status: 'lost',
    location: {
      latitude: -12.1180,
      longitude: -77.0150,
      address: 'San Luis, Lima'
    },
    reportedBy: 'user32',
    reportedAt: new Date('2023-12-15'),
    isFavorite: false
  },
  {
    id: '33',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Pastor alemán. Muy leal y protector. Se perdió durante un paseo nocturno. Collar negro.',
    status: 'lost',
    location: {
      latitude: -12.0430,
      longitude: -77.0630,
      address: 'Ventanilla, Callao'
    },
    reportedBy: 'user33',
    reportedAt: new Date('2023-12-14'),
    isFavorite: false
  },
  {
    id: '34',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Husky siberiano. Ojos azules. Se escapó saltando la cerca. Muy activo y juguetón.',
    status: 'lost',
    location: {
      latitude: -12.0980,
      longitude: -77.0220,
      address: 'Lince, Lima'
    },
    reportedBy: 'user34',
    reportedAt: new Date('2023-12-13'),
    isFavorite: false
  },
  {
    id: '35',
    name: 'Mittens',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
    description: 'Gato gris con patas blancas. Le encantan los juguetes con plumas. Desapareció hace 4 días.',
    status: 'lost',
    location: {
      latitude: -12.0820,
      longitude: -77.0350,
      address: 'San Borja, Lima'
    },
    reportedBy: 'user35',
    reportedAt: new Date('2023-12-12'),
    isFavorite: false
  },
  {
    id: '36',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Dálmata con manchas negras. Se perdió en el malecón. Muy amigable. Chip de identificación.',
    status: 'lost',
    location: {
      latitude: -12.1120,
      longitude: -77.0340,
      address: 'Miraflores, Lima'
    },
    reportedBy: 'user36',
    reportedAt: new Date('2023-12-11'),
    isFavorite: false
  },
  {
    id: '37',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Poodle blanco pequeño. Pelo rizado. Se perdió cerca del veterinario. Esterilizado.',
    status: 'lost',
    location: {
      latitude: -12.0740,
      longitude: -77.0480,
      address: 'Magdalena, Lima'
    },
    reportedBy: 'user37',
    reportedAt: new Date('2023-12-10'),
    isFavorite: false
  },
  {
    id: '38',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Boxer color atigrado. Muy enérgico. Salió por la puerta abierta. Collar amarillo.',
    status: 'lost',
    location: {
      latitude: -12.0520,
      longitude: -77.0570,
      address: 'Bellavista, Callao'
    },
    reportedBy: 'user38',
    reportedAt: new Date('2023-12-09'),
    isFavorite: false
  },
  {
    id: '39',
    name: 'Whiskers',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
    description: 'Gato persa blanco. Pelo largo y esponjoso. Necesita cepillado diario. Se escapó asustado.',
    status: 'lost',
    location: {
      latitude: -12.1090,
      longitude: -77.0310,
      address: 'Surco, Lima'
    },
    reportedBy: 'user39',
    reportedAt: new Date('2023-12-08'),
    isFavorite: false
  },
  {
    id: '40',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Schnauzer miniatura. Gris con barba blanca. Perdido en el centro comercial. Muy obediente.',
    status: 'lost',
    location: {
      latitude: -12.0870,
      longitude: -77.0290,
      address: 'San Isidro, Lima'
    },
    reportedBy: 'user40',
    reportedAt: new Date('2023-12-07'),
    isFavorite: false
  },
  {
    id: '41',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Border collie. Blanco y negro. Muy inteligente. Se perdió en el parque corriendo tras un frisbee.',
    status: 'lost',
    location: {
      latitude: -12.0610,
      longitude: -77.0520,
      address: 'San Miguel, Lima'
    },
    reportedBy: 'user41',
    reportedAt: new Date('2023-12-06'),
    isFavorite: false
  },
  {
    id: '42',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Pitbull color café. Muy noble a pesar de su apariencia. Collar de cuero. Tatuaje en oreja.',
    status: 'lost',
    location: {
      latitude: -12.0950,
      longitude: -77.0190,
      address: 'La Victoria, Lima'
    },
    reportedBy: 'user42',
    reportedAt: new Date('2023-12-05'),
    isFavorite: false
  },
  {
    id: '43',
    name: 'Luna',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400',
    description: 'Gata angora blanca. Ojos dispares: uno azul y otro verde. Muy hermosa. La extrañamos.',
    status: 'lost',
    location: {
      latitude: -12.0760,
      longitude: -77.0390,
      address: 'Breña, Lima'
    },
    reportedBy: 'user43',
    reportedAt: new Date('2023-12-04'),
    isFavorite: false
  },
  {
    id: '44',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Chihuahua color café con blanco. Muy pequeño y asustadizo. Usa suéter azul. Tiembla mucho.',
    status: 'lost',
    location: {
      latitude: -12.1010,
      longitude: -77.0360,
      address: 'Surquillo, Lima'
    },
    reportedBy: 'user44',
    reportedAt: new Date('2023-12-03'),
    isFavorite: false
  },
  {
    id: '45',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Shih Tzu blanco y dorado. Pelo largo. Se perdió en la peluquería canina. Recién bañado.',
    status: 'lost',
    location: {
      latitude: -12.1140,
      longitude: -77.0260,
      address: 'Barranco, Lima'
    },
    reportedBy: 'user45',
    reportedAt: new Date('2023-12-02'),
    isFavorite: false
  },
  {
    id: '46',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Rottweiler grande. A pesar de su tamaño es muy dócil. Collar con pinchos. Microchip.',
    status: 'lost',
    location: {
      latitude: -12.0490,
      longitude: -77.0600,
      address: 'Callao, Lima'
    },
    reportedBy: 'user46',
    reportedAt: new Date('2023-12-01'),
    isFavorite: false
  },
  {
    id: '47',
    name: 'Simba',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    description: 'Gato naranja con melena tipo león. Muy territorial. No regresó hace 5 días. Le gusta cazar.',
    status: 'lost',
    location: {
      latitude: -12.0830,
      longitude: -77.0420,
      address: 'Jesús María, Lima'
    },
    reportedBy: 'user47',
    reportedAt: new Date('2023-11-30'),
    isFavorite: false
  },
  {
    id: '48',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Yorkshire terrier. Muy pequeño con pelo largo. Usa moño rosado. Perdido en el centro.',
    status: 'lost',
    location: {
      latitude: -12.0460,
      longitude: -77.0300,
      address: 'Centro de Lima, Lima'
    },
    reportedBy: 'user48',
    reportedAt: new Date('2023-11-29'),
    isFavorite: false
  },
  {
    id: '49',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Samoyedo blanco esponjoso. Parece un oso polar. Se perdió en el parque. Siempre sonriendo.',
    status: 'lost',
    location: {
      latitude: -12.1070,
      longitude: -77.0330,
      address: 'La Molina, Lima'
    },
    reportedBy: 'user49',
    reportedAt: new Date('2023-11-28'),
    isFavorite: false
  },
  {
    id: '50',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Doberman negro y marrón. Orejas paradas. Se escapó por un hueco. Muy protector con familia.',
    status: 'lost',
    location: {
      latitude: -12.0720,
      longitude: -77.0460,
      address: 'Pueblo Libre, Lima'
    },
    reportedBy: 'user50',
    reportedAt: new Date('2023-11-27'),
    isFavorite: false
  },
  {
    id: '51',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Basset hound. Orejas largas. Muy tranquilo. Se perdió siguiendo un rastro. Collar marrón.',
    status: 'lost',
    location: {
      latitude: -12.0910,
      longitude: -77.0250,
      address: 'San Borja, Lima'
    },
    reportedBy: 'user51',
    reportedAt: new Date('2023-11-26'),
    isFavorite: false
  },
  {
    id: '52',
    name: 'Midnight',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=400',
    description: 'Gato completamente negro. Ojos amarillos brillantes. Salió en la noche y no volvió. Muy elegante.',
    status: 'lost',
    location: {
      latitude: -12.1160,
      longitude: -77.0290,
      address: 'Surco, Lima'
    },
    reportedBy: 'user52',
    reportedAt: new Date('2023-11-25'),
    isFavorite: false
  },
  {
    id: '53',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Gran danés arlequín. Enorme pero gentil. Se perdió cerca del parque. Collar XXL azul.',
    status: 'lost',
    location: {
      latitude: -12.0590,
      longitude: -77.0510,
      address: 'San Miguel, Lima'
    },
    reportedBy: 'user53',
    reportedAt: new Date('2023-11-24'),
    isFavorite: false
  },
  {
    id: '54',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Akita inu. Color crema. Muy leal. Se escapó durante fuegos artificiales. Cola enrollada.',
    status: 'lost',
    location: {
      latitude: -12.0810,
      longitude: -77.0370,
      address: 'Lince, Lima'
    },
    reportedBy: 'user54',
    reportedAt: new Date('2023-11-23'),
    isFavorite: false
  },
  {
    id: '55',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Pomerania naranja esponjoso. Parece un zorrito. Se perdió en el centro comercial. Muy pequeño.',
    status: 'lost',
    location: {
      latitude: -12.1030,
      longitude: -77.0340,
      address: 'Surquillo, Lima'
    },
    reportedBy: 'user55',
    reportedAt: new Date('2023-11-22'),
    isFavorite: false
  }
];

// Mock data de mascotas en adopción
const ADOPTION_PETS: Pet[] = [
  {
    id: 'a1',
    name: 'Charlie',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Cachorro juguetón y cariñoso buscando familia. Le encanta jugar y es muy sociable con niños y otros perros. Ya tiene sus vacunas al día.',
    status: 'adoption',
    age: '3 meses',
    gender: 'male',
    location: {
      latitude: -12.0464,
      longitude: -77.0428,
      address: 'Refugio Lima Norte'
    },
    reportedBy: 'refugio1',
    reportedAt: new Date('2024-01-15'),
    isFavorite: false
  },
  {
    id: 'a2',
    name: 'Luna',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Perra adulta muy tranquila y obediente. Perfecta para familias o personas mayores. Esterilizada y con todas sus vacunas.',
    status: 'adoption',
    age: '2 años',
    gender: 'female',
    location: {
      latitude: -12.0700,
      longitude: -77.0500,
      address: 'Albergue Miraflores'
    },
    reportedBy: 'refugio2',
    reportedAt: new Date('2024-01-14'),
    isFavorite: false
  },
  {
    id: 'a3',
    name: 'Mimi',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    description: 'Gatita dulce y cariñosa. Le gusta dormir y recibir mimos. Ideal para apartamento. Esterilizada y desparasitada.',
    status: 'adoption',
    age: '6 meses',
    gender: 'female',
    location: {
      latitude: -12.0600,
      longitude: -77.0450,
      address: 'Refugio Barranco'
    },
    reportedBy: 'refugio3',
    reportedAt: new Date('2024-01-13'),
    isFavorite: false
  },
  {
    id: 'a4',
    name: 'Thor',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Perro guardián leal y protector. Necesita espacio y ejercicio diario. Excelente con su familia, requiere dueño con experiencia.',
    status: 'adoption',
    age: '1 año',
    gender: 'male',
    location: {
      latitude: -12.0800,
      longitude: -77.0300,
      address: 'Albergue San Borja'
    },
    reportedBy: 'refugio4',
    reportedAt: new Date('2024-01-12'),
    isFavorite: false
  },
  {
    id: 'a5',
    name: 'Nala',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
    description: 'Gata independiente pero cariñosa. Perfecta para personas que trabajan. Le gusta explorar y jugar con juguetes. Esterilizada.',
    status: 'adoption',
    age: '1 año',
    gender: 'female',
    location: {
      latitude: -12.0900,
      longitude: -77.0200,
      address: 'Refugio Surco'
    },
    reportedBy: 'refugio5',
    reportedAt: new Date('2024-01-11'),
    isFavorite: false
  },
  {
    id: 'a6',
    name: 'Bruno',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Golden retriever hermoso y amigable. Ama a todos y es perfecto para familias con niños. Entrenado y muy inteligente.',
    status: 'adoption',
    age: '3 años',
    gender: 'male',
    location: {
      latitude: -12.1050,
      longitude: -77.0350,
      address: 'Albergue La Molina'
    },
    reportedBy: 'refugio6',
    reportedAt: new Date('2024-01-10'),
    isFavorite: false
  },
  {
    id: 'a7',
    name: 'Bella',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
    description: 'Perra mestiza muy cariñosa. Rescatada de la calle. Se lleva bien con otros animales. Busca un hogar donde la mimen.',
    status: 'adoption',
    age: '4 años',
    gender: 'female',
    location: {
      latitude: -12.0820,
      longitude: -77.0280,
      address: 'Refugio San Isidro'
    },
    reportedBy: 'refugio7',
    reportedAt: new Date('2024-01-09'),
    isFavorite: false
  },
  {
    id: 'a8',
    name: 'Garfield',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    description: 'Gato naranja gordito. Le encanta comer y dormir. Muy tranquilo. Perfecto compañero para ver series. Castrado.',
    status: 'adoption',
    age: '5 años',
    gender: 'male',
    location: {
      latitude: -12.0550,
      longitude: -77.0480,
      address: 'Albergue Magdalena'
    },
    reportedBy: 'refugio8',
    reportedAt: new Date('2024-01-08'),
    isFavorite: false
  },
  {
    id: 'a9',
    name: 'Rex',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Pastor alemán joven. Muy activo y leal. Necesita familia que le de mucho ejercicio. Entrenamiento básico completado.',
    status: 'adoption',
    age: '1.5 años',
    gender: 'male',
    location: {
      latitude: -12.0920,
      longitude: -77.0240,
      address: 'Refugio Lima Sur'
    },
    reportedBy: 'refugio9',
    reportedAt: new Date('2024-01-07'),
    isFavorite: false
  },
  {
    id: 'a10',
    name: 'Peluchín',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
    description: 'Gato persa de pelo largo. Requiere cepillado diario. Muy tranquilo y cariñoso. Ideal para personas tranquilas.',
    status: 'adoption',
    age: '3 años',
    gender: 'male',
    location: {
      latitude: -12.1100,
      longitude: -77.0320,
      address: 'Albergue Surco'
    },
    reportedBy: 'refugio10',
    reportedAt: new Date('2024-01-06'),
    isFavorite: false
  },
  {
    id: 'a11',
    name: 'Daisy',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Labrador color miel. Muy juguetona y sociable. Perfecta para familias activas. Adora nadar y jugar a la pelota.',
    status: 'adoption',
    age: '2 años',
    gender: 'female',
    location: {
      latitude: -12.0480,
      longitude: -77.0620,
      address: 'Refugio Callao'
    },
    reportedBy: 'refugio11',
    reportedAt: new Date('2024-01-05'),
    isFavorite: false
  },
  {
    id: 'a12',
    name: 'Salem',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=400',
    description: 'Gato negro elegante. Muy inteligente y juguetón. Le encanta cazar juguetes. Esterilizado y vacunado.',
    status: 'adoption',
    age: '8 meses',
    gender: 'male',
    location: {
      latitude: -12.0650,
      longitude: -77.0510,
      address: 'Refugio Pueblo Libre'
    },
    reportedBy: 'refugio12',
    reportedAt: new Date('2024-01-04'),
    isFavorite: false
  },
  {
    id: 'a13',
    name: 'Pancho',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    description: 'Beagle adulto. Muy amigable con todos. Le encanta seguir rastros. Necesita paseos largos. Castrado.',
    status: 'adoption',
    age: '4 años',
    gender: 'male',
    location: {
      latitude: -12.0880,
      longitude: -77.0190,
      address: 'Albergue San Luis'
    },
    reportedBy: 'refugio13',
    reportedAt: new Date('2024-01-03'),
    isFavorite: false
  },
  {
    id: 'a14',
    name: 'Kiara',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
    description: 'Gatita gris de pelo corto. Muy cariñosa y ronroneadora. Le gusta dormir en el regazo. Esterilizada.',
    status: 'adoption',
    age: '7 meses',
    gender: 'female',
    location: {
      latitude: -12.1180,
      longitude: -77.0210,
      address: 'Refugio Miraflores'
    },
    reportedBy: 'refugio14',
    reportedAt: new Date('2024-01-02'),
    isFavorite: false
  },
  {
    id: 'a15',
    name: 'Rocky',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Pitbull muy noble y cariñoso. Desmintiendo estereotipos. Excelente con niños. Necesita dueño responsable.',
    status: 'adoption',
    age: '3 años',
    gender: 'male',
    location: {
      latitude: -12.0740,
      longitude: -77.0360,
      address: 'Albergue Breña'
    },
    reportedBy: 'refugio15',
    reportedAt: new Date('2024-01-01'),
    isFavorite: false
  },
  {
    id: 'a16',
    name: 'Mittens',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    description: 'Gata blanca con manchas. Muy juguetona. Le encantan las cajas y las ventanas. Esterilizada y desparasitada.',
    status: 'adoption',
    age: '1 año',
    gender: 'female',
    location: {
      latitude: -12.0960,
      longitude: -77.0330,
      address: 'Refugio Lince'
    },
    reportedBy: 'refugio16',
    reportedAt: new Date('2023-12-31'),
    isFavorite: false
  },
  {
    id: 'a17',
    name: 'Toby',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Schnauzer miniatura. Muy alerta y protector. Perfecto perro guardián para apartamento. Educado y limpio.',
    status: 'adoption',
    age: '2.5 años',
    gender: 'male',
    location: {
      latitude: -12.0590,
      longitude: -77.0550,
      address: 'Albergue San Miguel'
    },
    reportedBy: 'refugio17',
    reportedAt: new Date('2023-12-30'),
    isFavorite: false
  },
  {
    id: 'a18',
    name: 'Whiskers',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    description: 'Gato atigrado. Muy independiente pero cariñoso a su manera. Le gusta explorar. Castrado y con chip.',
    status: 'adoption',
    age: '4 años',
    gender: 'male',
    location: {
      latitude: -12.0830,
      longitude: -77.0410,
      address: 'Refugio Jesús María'
    },
    reportedBy: 'refugio18',
    reportedAt: new Date('2023-12-29'),
    isFavorite: false
  },
  {
    id: 'a19',
    name: 'Lola',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Poodle toy blanco. Muy juguetona y cariñosa. No suelta pelo. Perfecta para personas alérgicas. Vacunada.',
    status: 'adoption',
    age: '1 año',
    gender: 'female',
    location: {
      latitude: -12.1020,
      longitude: -77.0390,
      address: 'Albergue Surco'
    },
    reportedBy: 'refugio19',
    reportedAt: new Date('2023-12-28'),
    isFavorite: false
  },
  {
    id: 'a20',
    name: 'Oliver',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400',
    description: 'Gato naranja con personalidad única. Muy sociable. Le encanta la compañía. Ideal para familias. Esterilizado.',
    status: 'adoption',
    age: '2 años',
    gender: 'male',
    location: {
      latitude: -12.0700,
      longitude: -77.0460,
      address: 'Refugio Magdalena'
    },
    reportedBy: 'refugio20',
    reportedAt: new Date('2023-12-27'),
    isFavorite: false
  },
  {
    id: 'a21',
    name: 'Maya',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    description: 'Husky siberiano. Muy activa. Necesita mucho ejercicio. Hermosos ojos azules. Ideal para familias deportistas.',
    status: 'adoption',
    age: '2 años',
    gender: 'female',
    location: {
      latitude: -12.1130,
      longitude: -77.0290,
      address: 'Albergue La Molina'
    },
    reportedBy: 'refugio21',
    reportedAt: new Date('2023-12-26'),
    isFavorite: false
  },
  {
    id: 'a22',
    name: 'Cleo',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0ed?w=400',
    description: 'Gata calicó. Muy dulce y tranquila. Le gusta tomar sol. Perfecta para personas mayores. Esterilizada.',
    status: 'adoption',
    age: '6 años',
    gender: 'female',
    location: {
      latitude: -12.0510,
      longitude: -77.0590,
      address: 'Refugio Callao'
    },
    reportedBy: 'refugio22',
    reportedAt: new Date('2023-12-25'),
    isFavorite: false
  },
  {
    id: 'a23',
    name: 'Buddy',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    description: 'Perro mestizo mediano. Muy fiel y agradecido. Rescatado de la calle. Busca una segunda oportunidad.',
    status: 'adoption',
    age: '3 años',
    gender: 'male',
    location: {
      latitude: -12.0990,
      longitude: -77.0160,
      address: 'Albergue San Borja'
    },
    reportedBy: 'refugio23',
    reportedAt: new Date('2023-12-24'),
    isFavorite: false
  },
  {
    id: 'a24',
    name: 'Luna',
    type: 'cat',
    image: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400',
    description: 'Gata blanca de pelo largo. Muy elegante. Necesita cepillado regular. Cariñosa y tranquila. Esterilizada.',
    status: 'adoption',
    age: '3 años',
    gender: 'female',
    location: {
      latitude: -12.0810,
      longitude: -77.0350,
      address: 'Refugio Pueblo Libre'
    },
    reportedBy: 'refugio24',
    reportedAt: new Date('2023-12-23'),
    isFavorite: false
  },
  {
    id: 'a25',
    name: 'Max',
    type: 'dog',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    description: 'Golden retriever senior. Muy tranquilo. Perfecto para personas que buscan compañía sin mucha energía. Amoroso.',
    status: 'adoption',
    age: '8 años',
    gender: 'male',
    location: {
      latitude: -12.1200,
      longitude: -77.0300,
      address: 'Albergue Miraflores'
    },
    reportedBy: 'refugio25',
    reportedAt: new Date('2023-12-22'),
    isFavorite: false
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PAGE_SIZE = 20; // Number of items per page

export const petsService = {
  async getLostPets(page: number = 1, pageSize: number = PAGE_SIZE): Promise<Pet[]> {
    await delay(500);
    const allLostPets = MOCK_PETS.filter(pet => pet.status === 'lost');
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allLostPets.slice(startIndex, endIndex);
  },

  async getAdoptionPets(page: number = 1, pageSize: number = PAGE_SIZE): Promise<Pet[]> {
    await delay(500);
    const allAdoptionPets = ADOPTION_PETS.filter(pet => pet.status === 'adoption');
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allAdoptionPets.slice(startIndex, endIndex);
  },

  async getTotalLostPetsCount(): Promise<number> {
    await delay(100);
    return MOCK_PETS.filter(pet => pet.status === 'lost').length;
  },

  async getTotalAdoptionPetsCount(): Promise<number> {
    await delay(100);
    return ADOPTION_PETS.filter(pet => pet.status === 'adoption').length;
  },

  async searchPets(query: string, page: number = 1, pageSize: number = PAGE_SIZE): Promise<Pet[]> {
    await delay(500);
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return MOCK_PETS;
    }

    // Translation map for Spanish to English
    const translations: Record<string, string[]> = {
      'perro': ['dog'],
      'perros': ['dog'],
      'gato': ['cat'],
      'gatos': ['cat'],
      'otro': ['other'],
      'otros': ['other'],
    };

    const filteredPets = MOCK_PETS.filter(pet => {
      const nameMatch = pet.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = pet.description.toLowerCase().includes(lowerQuery);
      const locationMatch = pet.location?.address?.toLowerCase().includes(lowerQuery) || false;

      // Match type in both English and Spanish
      const petTypeLower = pet.type.toLowerCase();
      const directTypeMatch = petTypeLower.includes(lowerQuery);
      const translatedTypeMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petTypeLower === eng);
      });

      return nameMatch || descriptionMatch || locationMatch || directTypeMatch || translatedTypeMatch;
    });

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPets.slice(startIndex, endIndex);
  },

  async getSearchPetsCount(query: string): Promise<number> {
    await delay(100);
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return MOCK_PETS.length;
    }

    // Translation map for Spanish to English
    const translations: Record<string, string[]> = {
      'perro': ['dog'],
      'perros': ['dog'],
      'gato': ['cat'],
      'gatos': ['cat'],
      'outro': ['other'],
      'outros': ['other'],
    };

    return MOCK_PETS.filter(pet => {
      const nameMatch = pet.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = pet.description.toLowerCase().includes(lowerQuery);
      const locationMatch = pet.location?.address?.toLowerCase().includes(lowerQuery) || false;

      const petTypeLower = pet.type.toLowerCase();
      const directTypeMatch = petTypeLower.includes(lowerQuery);
      const translatedTypeMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petTypeLower === eng);
      });

      return nameMatch || descriptionMatch || locationMatch || directTypeMatch || translatedTypeMatch;
    }).length;
  },

  async searchAdoptionPets(query: string, page: number = 1, pageSize: number = PAGE_SIZE): Promise<Pet[]> {
    await delay(500);
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return ADOPTION_PETS;
    }

    // Translation map for Spanish to English
    const translations: Record<string, string[]> = {
      'perro': ['dog'],
      'perros': ['dog'],
      'gato': ['cat'],
      'gatos': ['cat'],
      'otro': ['other'],
      'otros': ['other'],
      'macho': ['male'],
      'machos': ['male'],
      'hembra': ['female'],
      'hembras': ['female'],
    };

    const filteredPets = ADOPTION_PETS.filter(pet => {
      const nameMatch = pet.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = pet.description.toLowerCase().includes(lowerQuery);
      const locationMatch = pet.location?.address?.toLowerCase().includes(lowerQuery) || false;
      const ageMatch = pet.age?.toLowerCase().includes(lowerQuery) || false;

      // Match type in both English and Spanish
      const petTypeLower = pet.type.toLowerCase();
      const directTypeMatch = petTypeLower.includes(lowerQuery);
      const translatedTypeMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petTypeLower === eng);
      });

      // Match gender in both English and Spanish
      const petGenderLower = pet.gender?.toLowerCase() || '';
      const directGenderMatch = petGenderLower.includes(lowerQuery);
      const translatedGenderMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petGenderLower === eng);
      });

      return nameMatch || descriptionMatch || locationMatch || ageMatch ||
             directTypeMatch || translatedTypeMatch ||
             directGenderMatch || translatedGenderMatch;
    });

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPets.slice(startIndex, endIndex);
  },

  async getSearchAdoptionPetsCount(query: string): Promise<number> {
    await delay(100);
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return ADOPTION_PETS.length;
    }

    // Translation map for Spanish to English
    const translations: Record<string, string[]> = {
      'perro': ['dog'],
      'perros': ['dog'],
      'gato': ['cat'],
      'gatos': ['cat'],
      'otro': ['other'],
      'outros': ['other'],
      'macho': ['male'],
      'machos': ['male'],
      'hembra': ['female'],
      'hembras': ['female'],
    };

    return ADOPTION_PETS.filter(pet => {
      const nameMatch = pet.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = pet.description.toLowerCase().includes(lowerQuery);
      const locationMatch = pet.location?.address?.toLowerCase().includes(lowerQuery) || false;
      const ageMatch = pet.age?.toLowerCase().includes(lowerQuery) || false;

      const petTypeLower = pet.type.toLowerCase();
      const directTypeMatch = petTypeLower.includes(lowerQuery);
      const translatedTypeMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petTypeLower === eng);
      });

      const petGenderLower = pet.gender?.toLowerCase() || '';
      const directGenderMatch = petGenderLower.includes(lowerQuery);
      const translatedGenderMatch = Object.entries(translations).some(([spanish, english]) => {
        return lowerQuery.includes(spanish) && english.some(eng => petGenderLower === eng);
      });

      return nameMatch || descriptionMatch || locationMatch || ageMatch ||
             directTypeMatch || translatedTypeMatch ||
             directGenderMatch || translatedGenderMatch;
    }).length;
  },

  async toggleFavorite(petId: string): Promise<Pet> {
    await delay(300);
    let pet = MOCK_PETS.find(p => p.id === petId);
    if (!pet) {
      pet = ADOPTION_PETS.find(p => p.id === petId);
    }
    if (!pet) {
      throw new Error('Pet not found');
    }
    pet.isFavorite = !pet.isFavorite;
    return pet;
  },

  async getPetById(id: string): Promise<Pet | null> {
    await delay(300);
    let pet = MOCK_PETS.find(p => p.id === id);
    if (!pet) {
      pet = ADOPTION_PETS.find(p => p.id === id);
    }
    return pet || null;
  },

  async getUserIncidents(userId: string, type?: 'lost' | 'adoption'): Promise<Pet[]> {
    await delay(500);
    const allPets = [...MOCK_PETS, ...ADOPTION_PETS];
    let userPets = allPets.filter(pet => pet.reportedBy === userId);

    if (type) {
      userPets = userPets.filter(pet => pet.status === type);
    }

    return userPets;
  }
};
