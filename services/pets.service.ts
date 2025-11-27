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
      latitude: -12.0464,
      longitude: -77.0428,
      address: 'Miraflores, Lima'
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
      latitude: -12.0464,
      longitude: -77.0428,
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
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const petsService = {
  async getLostPets(): Promise<Pet[]> {
    await delay(500);
    return MOCK_PETS.filter(pet => pet.status === 'lost');
  },

  async getAdoptionPets(): Promise<Pet[]> {
    await delay(500);
    return ADOPTION_PETS.filter(pet => pet.status === 'adoption');
  },

  async searchPets(query: string): Promise<Pet[]> {
    await delay(500);
    const lowerQuery = query.toLowerCase();
    return MOCK_PETS.filter(pet =>
      pet.name.toLowerCase().includes(lowerQuery) ||
      pet.description.toLowerCase().includes(lowerQuery)
    );
  },

  async searchAdoptionPets(query: string): Promise<Pet[]> {
    await delay(500);
    const lowerQuery = query.toLowerCase();
    return ADOPTION_PETS.filter(pet =>
      pet.name.toLowerCase().includes(lowerQuery) ||
      pet.description.toLowerCase().includes(lowerQuery)
    );
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
