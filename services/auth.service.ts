import * as SecureStore from 'expo-secure-store';
import { LoginCredentials, SignupData, User } from '../types';
import { API_ENDPOINTS } from '../constants/api';

const TOKEN_KEY = 'auth_token';

interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string;
      photoURL?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

async function deleteToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

function mapBackendUserToUser(backendUser: AuthResponse['data']['user']): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.fullName,
    phone: backendUser.phone,
    avatar: backendUser.photoURL
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid email or password');
      }

      const data: AuthResponse = await response.json();

      await saveToken(data.data.token);

      return {
        user: mapBackendUserToUser(data.data.user),
        token: data.data.token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.name,
          phone: data.phone || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const responseData: AuthResponse = await response.json();

      await saveToken(responseData.data.token);

      return {
        user: mapBackendUserToUser(responseData.data.user),
        token: responseData.data.token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async logout(): Promise<void> {
    await deleteToken();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await getToken();

      if (!token) {
        return null;
      }

      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        await deleteToken();
        return null;
      }

      const data = await response.json();

      return mapBackendUserToUser(data.data.user);
    } catch (error) {
      await deleteToken();
      return null;
    }
  },

  async getToken(): Promise<string | null> {
    return await getToken();
  }
};
