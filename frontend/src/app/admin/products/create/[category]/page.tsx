"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './create.module.css';
import { ProductCategory } from '@/types/product';
import { productService } from '@/services/api';
import Input from '@/components/ui/input/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox/checkbox';

type PageProps = {
  params: Promise<{
    category: ProductCategory;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function CreateProductPage({ params }: PageProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    marca_id: '',
    es_nuevo: false,
    en_oferta: false,
    descuento: '0'
  });

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setCategory(resolvedParams.category);
      } catch (error) {
        console.error('Error al resolver parámetros:', error);
        setError('Error al cargar la categoría');
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    
    setLoading(true);
    setError(null);

    try {
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        imagen: formData.imagen,
        marca_id: parseInt(formData.marca_id),
        es_nuevo: formData.es_nuevo,
        en_oferta: formData.en_oferta,
        descuento: parseInt(formData.descuento),
        categoria: category,
        categoria_id: parseInt(category),
        precio_original: parseFloat(formData.precio),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await productService.createProduct(productData, category);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error al crear producto:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isAuthenticated || !isAdmin || !category) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Producto</h1>
      <h2 className={styles.subtitle}>Categoría: {category}</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre</label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descripcion">Descripción</label>
          <Input
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precio">Precio</label>
          <Input
            id="precio"
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Stock</label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imagen">URL de la imagen</label>
          <Input
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="marca_id">ID de la marca</label>
          <Input
            id="marca_id"
            name="marca_id"
            type="number"
            value={formData.marca_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <Checkbox
            id="es_nuevo"
            name="es_nuevo"
            checked={formData.es_nuevo}
            onChange={handleChange}
            label="Es nuevo"
          />
        </div>

        <div className={styles.checkboxGroup}>
          <Checkbox
            id="en_oferta"
            name="en_oferta"
            checked={formData.en_oferta}
            onChange={handleChange}
            label="En oferta"
          />
        </div>

        {formData.en_oferta && (
          <div className={styles.formGroup}>
            <label htmlFor="descuento">Descuento (%)</label>
            <Input
              id="descuento"
              name="descuento"
              type="number"
              value={formData.descuento}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Producto'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
} 