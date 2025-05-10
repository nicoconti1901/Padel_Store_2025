"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// API URL
const API_URL = 'http://localhost:3001/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para probar la conexión
  const testConnection = async () => {
    try {
      console.log('Probando conexión con el backend...');
      const response = await fetch(`${API_URL}/paletas`);
      console.log('Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('Datos recibidos:', data);
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('Iniciando petición de login a:', `${API_URL}/auth/login`);
      console.log('Credenciales:', { ...credentials, password: '***' });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      console.log('Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('Datos recibidos:', { ...data, token: data.token ? '***' : null });

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      console.log('Login exitoso, guardando token...');
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al conectar con el servidor');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    console.log('Verificando estado de autenticación...');
    console.log('Token presente:', !!token);

    if (!token) {
      console.log('No hay token, usuario no autenticado');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token válido, usuario autenticado:', data);
        setUser(data.user);
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
    checkAuthStatus();
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