"use client";

import { useEffect, useState } from 'react';
import { Product, ProductCategory } from '@/types/product';
import ProductList from '@/components/products/list/ProductList';
import { productService } from '@/services/api';
import styles from './page.module.css';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const categories: ProductCategory[] = ['paletas', 'indumentaria', 'accesorios'];
        const productsPromises = categories.map(category => 
          productService.getProductsByCategory(category)
        );
        
        const productsByCategory = await Promise.all(productsPromises);
        const allProducts = productsByCategory.flat();
        
        setProducts(allProducts);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todos los Productos</h1>
      <ProductList products={products} loading={loading} error={error} />
    </div>
  );
} 