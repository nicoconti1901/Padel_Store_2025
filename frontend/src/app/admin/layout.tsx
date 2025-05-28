"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './layout.module.css';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  Plus
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1>Admin Panel</h1>
          <p>Padel Store</p>
        </div>
        <nav>
          <ul className={styles.nav}>
            <li className={styles.navItem}>
              <Link href="/products" className={styles.navLink}>
                <Package />
                Productos
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/users" className={styles.navLink}>
                <Users />
                Usuarios
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/orders" className={styles.navLink}>
                <ShoppingCart />
                Pedidos
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/settings" className={styles.navLink}>
                <Settings />
                Configuración
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <button 
            className={styles.menuButton}
            onClick={toggleSidebar}
          >
            <Menu />
          </button>
          <h1>Panel de Administración</h1>
          <Link href="/admin/products/create" className={styles.createProductButton}>
            <Plus />
            Crear Producto
          </Link>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
} 