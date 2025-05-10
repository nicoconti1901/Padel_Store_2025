"use client";

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se verifica el estado inicial
    if (isLoading) {
      return;
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      console.log("AdminGuard: Usuario no autenticado, redirigiendo a /login");
      router.push('/login');
      return; // Detener la ejecución del efecto
    }

    // Si está autenticado pero NO es admin, redirigir (ej: a la home)
    if (isAuthenticated && !isAdmin) {
      console.log("AdminGuard: Usuario autenticado pero NO es admin, redirigiendo a /");
      // Podrías redirigir a una página específica de "No autorizado"
      router.push('/'); 
    }
    
    // Si está autenticado y es admin, no hace nada y permite mostrar children
    // (la consola puede ser útil para depurar)
    if (isAuthenticated && isAdmin) {
        console.log("AdminGuard: Usuario autenticado y es admin. Acceso permitido.");
    }

  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Mostrar un estado de carga mientras se verifica la autenticación inicial
  if (isLoading) {
    return <p>Verificando acceso...</p>; // O un spinner, o null
  }

  // Si está autenticado y es admin (o la redirección aún no ha ocurrido),
  // renderiza el contenido protegido. La redirección se maneja en useEffect.
  // Solo mostramos el contenido si es admin para evitar un flash de contenido no autorizado.
  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  // Si no es admin o no está autenticado (y aún no ha redirigido), 
  // no muestra nada mientras espera la redirección del useEffect.
  // O podrías mostrar un mensaje genérico aquí también.
  return null; 
};

export default AdminRouteGuard; 