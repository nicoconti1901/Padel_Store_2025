'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo a login');
        router.push('/login');
      } else if (!isAdmin) {
        console.log('Usuario no es admin, redirigiendo a home');
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <h1>Panel de Administración</h1>
        <ul>
          <li>
            <Link href="/admin/products" className={styles.adminLink}>
              Productos
            </Link>
          </li>
          <li>
            <Link href="/admin/products/create" className={styles.adminLink}>
              Crear Producto
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.adminContent}>
        {children}
      </div>
    </div>
  );
} 