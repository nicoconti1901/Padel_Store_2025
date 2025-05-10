"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/admin/products/ProductForm';
import { Product } from '@/types/types';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // Hook para obtener los parámetros de la ruta
  const productId = params.productId; // Obtener el ID del producto de la URL

  const [product, setProduct] = useState<Partial<Product> | null>(null); // Estado para guardar los datos del producto a editar
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return; // Si no hay ID, no hacer nada

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          } else {
            throw new Error(`Error al cargar datos del producto: ${response.status}`);
          }
        }
        const data: Product = await response.json();
        // Convertimos los campos numéricos y booleanos por si vienen como string
        const formattedData = {
          ...data,
          precio: Number(data.precio) || 0,
          stock: Number(data.stock) || 0,
          descuento: Number(data.descuento) || 0,
          es_nuevo: Boolean(data.es_nuevo),
          en_oferta: Boolean(data.en_oferta),
        }
        setProduct(formattedData);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]); // Ejecutar el efecto si el productId cambia

  const handleUpdateProduct = async (formData: Omit<Product, 'id' | 'fecha_creacion'>) => {
    if (!productId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      console.log(`Enviando datos para actualizar producto ${productId}:`, JSON.stringify(formData, null, 2));
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Añadir headers de autenticación si son necesarios
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
        throw new Error(errorData.message || `Error al actualizar el producto: ${response.status}`);
      }

      // Redirigir a la lista tras el éxito
      router.push('/admin/products');
      // Opcional: mostrar mensaje de éxito

    } catch (err) {
      console.error("Error updating product:", err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Cargando datos del producto...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Editar Producto {product?.modelo ? `(${product.modelo})` : ''}</h1>
        <Link href="/admin/products" style={{ textDecoration: 'none', color: '#1A4D3C', fontWeight: '500' }}>
          Volver a la lista
        </Link>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffebee' }}>
          Error: {error}
        </div>
      )}

      {/* Solo renderizar el form si tenemos los datos del producto y no hay error fatal al cargar */}
      {product && !error && (
        <ProductForm 
          initialData={product} // Pasamos los datos cargados
          onSubmit={handleUpdateProduct} 
          isSubmitting={isSubmitting} 
        />
      )}
      {!product && !loading && !error && (
        <p>No se pudieron cargar los datos del producto para editar.</p>
      )}
    </div>
  );
} 