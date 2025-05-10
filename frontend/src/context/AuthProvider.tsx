"use client";

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContext, AuthUser, AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para la carga inicial

  // Función para verificar el estado de autenticación (ej: al cargar la app)
  const checkAuthStatus = useCallback(async () => {
    console.log("Verificando estado de autenticación...");
    setIsLoading(true);
    try {
      // Asume que tienes un endpoint para verificar el estado de la sesión/token
      const response = await fetch('http://localhost:3001/api/auth/status'); 
      
      if (response.ok) {
        const userData: AuthUser = await response.json();
        console.log("Usuario autenticado:", userData);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin || false);
      } else {
        console.log("Usuario no autenticado (status check).");
        // Si la respuesta no es OK (ej: 401 No autorizado), limpia el estado
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error verificando estado de autenticación:", error);
      // En caso de error de red, etc., asume no autenticado
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false); // Termina la carga inicial
    }
  }, []);

  // Ejecuta la verificación al montar el componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Función de Login
  const login = async (credentials: {email?: string; username?: string; password?: string}) => {
    console.log("Intentando iniciar sesión con:", credentials.email || credentials.username);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
        throw new Error(errorData.message || 'Credenciales incorrectas o error del servidor');
      }

      const userData: AuthUser = await response.json();
      console.log("Login exitoso:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin || false);

    } catch (error) {
      console.error("Error en login:", error);
      // Limpia el estado en caso de error de login
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      // Relanza el error para que el componente que llama pueda manejarlo (mostrar mensaje)
      throw error;
    }
  };

  // Función de Logout
  const logout = async () => {
    console.log("Cerrando sesión...");
    try {
      // Llama al endpoint de logout del backend
      await fetch('http://localhost:3001/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Error en logout (llamada API):", error);
      // Continuar con el logout en el frontend incluso si falla la API
    } finally {
      // Limpia el estado del frontend
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      console.log("Estado de autenticación limpiado.");
    }
  };

  // Valor del contexto que se proporcionará
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isAdmin,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 