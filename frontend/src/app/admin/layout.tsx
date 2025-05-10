import React, { ReactNode } from 'react';
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

// Este layout se aplica a todas las rutas dentro de /admin
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminRouteGuard>
      {/* Aquí podrías tener un sub-layout específico para admin si quisieras, */} 
      {/* como una barra lateral de navegación de admin */} 
      {/* Por ahora, simplemente renderizamos el contenido protegido */} 
      <div style={{ padding: '2rem' }}> {/* Añade algo de padding base para las páginas admin */} 
        {children}
      </div>
    </AdminRouteGuard>
  );
} 