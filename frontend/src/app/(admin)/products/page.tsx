"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './products.module.css';
import { Product, ProductCategory } from '@/types/product';
import { productService } from '@/services/api';

export default function ProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('paletas');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductsByCategory(selectedCategory);
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, isAdmin, router, selectedCategory]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      await productService.deleteProduct(id, selectedCategory);
      setProducts(products.filter(product => product.id.toString() !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando productos...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Administración de Productos</h1>
      
      <div className={styles.categorySelector}>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
          className={styles.select}
        >
          <option value="paletas">Paletas</option>
          <option value="indumentaria">Indumentaria</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img 
              src={product.imagen} 
              alt={product.modelo} 
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h3>{product.marca} - {product.modelo}</h3>
              <p>Precio: ${product.precio}</p>
              <p>Stock: {product.stock}</p>
              <div className={styles.actions}>
                <button 
                  onClick={() => router.push(`/admin/products/edit/${selectedCategory}/${product.id}`)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(product.id.toString())}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 