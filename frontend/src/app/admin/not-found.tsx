'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default function NotFound() {
  return (
    <div className={styles.adminLayout}>
      <div className={styles.adminContent}>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <Link href="/admin/products" className={styles.adminLink}>
          Volver a Productos
        </Link>
      </div>
    </div>
  );
} 