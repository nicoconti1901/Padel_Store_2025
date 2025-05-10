"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/types'; // Asegúrate que la ruta es correcta
import styles from './admin-products.module.css';
import { useAuth } from '@/context/AuthContext';
import CreateProductForm from '@/components/admin/CreateProductForm';

export default function AdminProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!isAuthenticated || !isAdmin) {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/products"); // Endpoint para obtener TODOS los productos
        if (!response.ok) {
          throw new Error(`Error al cargar productos: ${response.status}`);
        }
        const data = await response.json();
        // Asegúrate de que la data tiene el formato esperado o transfórmala
        const formattedData = data.map((product: any, index: number) => ({
          ...product,
          id: product.id || `temp-id-${index}`, // Asegura un ID
          categoria: product.categoria || "Sin Categoria",
          precio: Number(product.precio) || 0,
          precio_original: Number(product.precio_original) || Number(product.precio) || 0,
          descuento: Number(product.descuento) || 0,
          es_nuevo: Boolean(product.es_nuevo),
          en_oferta: Boolean(product.en_oferta),
          marca: product.marca || "",
          modelo: product.modelo || "",
          caracteristicas: product.caracteristicas || "",
          stock: Number(product.stock) || 0,
          fecha_creacion: product.fecha_creacion || new Date().toISOString(),
          tipo: product.tipo || "",
          talle: product.talle || "",
          imagen: product.imagen || "",
          // Asegúrate de que todos los campos necesarios estén aquí
        }));
        setProducts(formattedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar productos");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreate = () => {
    router.push('/admin/products/new');
  };

  const handleEdit = (id: string | number) => {
    router.push(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        // Refrescar la lista de productos
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
        console.log(`Producto ${id} eliminado`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al eliminar");
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Gestión de Productos</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className={styles.createButton}
        >
          Crear Nuevo Producto
        </button>
      </div>

      {showCreateForm && (
        <CreateProductForm onClose={() => setShowCreateForm(false)} />
      )}

      
    </main>
  );
} 