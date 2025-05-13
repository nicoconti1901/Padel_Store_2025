"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './products.module.css';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original: number;
  imagen: string;
  en_oferta: boolean;
  descuento: number;
  es_nuevo: boolean;
  marca_id: number;
  categoria_id: number;
  marca_nombre?: string;
  categoria_nombre?: string;
}

export default function ProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, isAdmin, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar producto');

      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el producto');
    }
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Administración de Productos</h1>
      <div className={styles.actions}>
        <button 
          className={styles.createButton}
          onClick={() => router.push('/admin/products/create')}
        >
          Crear Nuevo Producto
        </button>
      </div>
      <div className={styles.productsList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <h3>{product.nombre}</h3>
            <p><strong>Categoría:</strong> {product.categoria_nombre}</p>
            <p><strong>Marca:</strong> {product.marca_nombre}</p>
            <p><strong>Precio:</strong> ${product.precio}</p>
            {product.en_oferta && (
              <p><strong>Precio Original:</strong> ${product.precio_original}</p>
            )}
            <p><strong>Descuento:</strong> {product.descuento}%</p>
            <p><strong>Estado:</strong> {product.es_nuevo ? 'Nuevo' : 'Usado'}</p>
            <div className={styles.productActions}>
              <button
                className={styles.editButton}
                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
              >
                Editar
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(product.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 