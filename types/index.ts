export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
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
