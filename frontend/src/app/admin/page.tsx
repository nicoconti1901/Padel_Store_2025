'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('AdminPage - Estado inicial:', { isAuthenticated, isAdmin, isLoading });
      
      // Verificar el estado de autenticación
      await checkAuthStatus();
      
      console.log('AdminPage - Estado después de verificación:', { isAuthenticated, isAdmin, isLoading });

      if (!isLoading) {
        if (!isAuthenticated) {
          console.log('AdminPage - Usuario no autenticado, redirigiendo a login');
          router.push('/login');
        } else if (!isAdmin) {
          console.log('AdminPage - Usuario no es admin, redirigiendo a home');
          router.push('/');
        } else {
          console.log('AdminPage - Usuario autenticado y es admin, redirigiendo a productos');
          router.replace('/admin/products');
        }
      }
    };

    verifyAuth();
  }, [isLoading, isAuthenticated, isAdmin, router, checkAuthStatus]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>Redirigiendo...</p>
    </div>
  );
} 