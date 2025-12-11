export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  image: string;
  description: string;
  status: 'lost' | 'found' | 'adoption';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  reportedBy: string;
  reportedAt: Date;
  isFavorite?: boolean;
  age?: string;
  gender?: 'male' | 'female';
}

// Backend Incident type (from real API)
export interface Incident {
  _id: string;
  userId: string;
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  locationName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'active' | 'resolved' | 'closed';
  user?: {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    photoURL?: string;
  };
  distance?: number; // Only in nearby searches
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean; // UI only field
}

export interface CreateIncidentData {
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  locationName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface UpdateIncidentData {
  petName?: string;
  description?: string;
  status?: 'active' | 'resolved' | 'closed';
  latitude?: number;
  longitude?: number;
  locationName?: string;
}
