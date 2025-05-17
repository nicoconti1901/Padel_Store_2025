'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import styles from './featuredProducts.module.css';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/api';
import ProductCard from '../card/ProductCard';

/**
 * Componente que muestra los productos destacados o el panel de administración
 */
export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getFeaturedProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        if (error instanceof Error) {
          if (error.message.includes('conectar con el backend')) {
            setError('No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo en http://localhost:3001');
          } else {
            setError(error.message);
          }
        } else {
          setError('Error al cargar productos destacados');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <p>No hay productos destacados disponibles</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Productos Destacados</h2>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard 
            key={`${product.categoria}-${product.id}`} 
            product={product} 
          />
        ))}
      </div>
    </section>
  );
}; 