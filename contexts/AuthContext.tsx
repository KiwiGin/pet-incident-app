import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, LoginCredentials, SignupData } from '../types';
import { authService } from '../services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión activa al iniciar
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signup(data);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      // Map User fields to backend fields
      const backendUpdates: { photoURL?: string; fullName?: string; phone?: string } = {};

      if (updates.avatar !== undefined) {
        backendUpdates.photoURL = updates.avatar;
      }
      if (updates.name !== undefined) {
        backendUpdates.fullName = updates.name;
      }
      if (updates.phone !== undefined) {
        backendUpdates.phone = updates.phone;
      }

      const updatedUser = await authService.updateProfile(backendUpdates);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
