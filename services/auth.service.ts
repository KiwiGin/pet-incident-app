import { LoginCredentials, SignupData, User } from '../types';

const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    avatar: undefined
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000);

    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userData } = user;
    return userData;
  },

  async signup(data: SignupData): Promise<User> {
    await delay(1000);

    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      password: data.password,
      name: data.name,
      avatar: undefined
    };

    MOCK_USERS.push(newUser);

    const { password, ...userData } = newUser;
    return userData;
  },

  async logout(): Promise<void> {
    await delay(500);
    // aquí se limpiaría el token
  },

  async getCurrentUser(): Promise<User | null> {
    // aquí se verificaría el token almacenado
    return null;
  }
};
