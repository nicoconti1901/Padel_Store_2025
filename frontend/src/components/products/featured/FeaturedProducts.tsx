'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/api';
import styles from './featuredProducts.module.css';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

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
        console.log('Fetching featured products...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/featured`);
        if (!response.ok) {
          throw new Error('Error al obtener productos destacados');
        }
        const data = await response.json();
        console.log('Featured products data:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar productos si no es administrador
    if (!isAdmin) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Si es administrador, no mostrar nada
  if (isAdmin) {
    return null;
  }

  if (loading) {
    return <div className={styles.loading}>Cargando productos destacados...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <p>Por favor, asegúrate de que el servidor backend esté corriendo en http://localhost:3001</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <p>No hay productos destacados disponibles</p>
        <p>Verifica que el servidor backend esté funcionando correctamente</p>
      </div>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Productos Destacados</h2>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={`${product.categoria}-${product.id}`} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <Image
                src={product.imagen || '/placeholder.svg'}
                alt={`${product.marca} ${product.modelo}`}
                width={300}
                height={300}
                className={styles.productImage}
                priority
              />
              {product.es_nuevo && <span className={styles.newBadge}>Nuevo</span>}
              {product.en_oferta && <span className={styles.saleBadge}>Oferta</span>}
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.marca} {product.modelo}</h3>
              <div className={styles.priceContainer}>
                {product.en_oferta ? (
                  <>
                    <span className={styles.originalPrice}>${product.precio}</span>
                    <span className={styles.discountedPrice}>
                      ${(product.precio * (1 - product.descuento / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className={styles.price}>${product.precio}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}; 