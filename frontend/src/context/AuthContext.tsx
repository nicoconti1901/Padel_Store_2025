"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '@/config/env';

// Define la estructura del usuario
export interface AuthUser {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  is_admin: boolean;
}

// Define la forma del contexto
export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Valor por defecto del contexto
const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  isLoading: true,
  login: async () => { throw new Error('Función login no implementada'); },
  logout: async () => { throw new Error('Función logout no implementada'); },
  checkAuthStatus: async () => { throw new Error('Función checkAuthStatus no implementada'); },
};

// Crear el contexto
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('Iniciando petición de login a:', `${config.apiUrl}/auth/login`);
      
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      const data = await response.json();
      console.log('Login exitoso, guardando token...');
      
      if (!data.token) {
        throw new Error('No se recibió token en la respuesta');
      }

      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      
      // Actualizar el estado del usuario
      setUser(data.user);
      setIsLoading(false);

      // Verificar el estado de autenticación inmediatamente
      await checkAuthStatus();
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al conectar con el servidor. Por favor, verifica tu conexión a internet.');
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${config.apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Verificando estado de autenticación...');
      console.log('Token presente:', !!token);

      if (!token) {
        console.log('No hay token, usuario no autenticado');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('Enviando petición de verificación de estado...');
      const response = await fetch(`${config.apiUrl}/auth/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Respuesta recibida:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token válido, usuario autenticado:', data);
        if (data.user) {
          setUser(data.user);
        } else {
          console.log('No se recibió información del usuario');
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('Token inválido o expirado');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider montado, verificando estado inicial...');
    const initializeAuth = async () => {
      await checkAuthStatus();
    };
    initializeAuth();
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    isAdmin: user?.is_admin || false,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  console.log('Estado actual del contexto:', {
    isAuthenticated: value.isAuthenticated,
    isAdmin: value.isAdmin,
    user: value.user,
    isAdminFromUser: user?.is_admin,
    isLoading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 