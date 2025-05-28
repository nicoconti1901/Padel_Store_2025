"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './edit.module.css';
import { Product, ProductCategory } from '@/types/product';
import { productService } from '@/services/api';
import Input from '@/components/ui/input/input';
import { Button } from '@/components/ui/button/button';
import { Checkbox } from '@/components/ui/checkbox/checkbox';

export default function EditProductPage({ 
  params 
}: { 
  params: { 
    category: ProductCategory;
    id: string;
  } 
}) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const product = await productService.getProductById(params.id, params.category);
        setFormData({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio.toString(),
          stock: product.stock.toString(),
          imagen: product.imagen || '',
          marca_id: product.marca_id.toString(),
          es_nuevo: product.es_nuevo,
          en_oferta: product.en_oferta,
          descuento: product.descuento?.toString() || '0'
        });
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isAuthenticated, isAdmin, router, params.id, params.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
        descuento: parseInt(formData.descuento)
      };

      await productService.updateProduct(params.id, productData, params.category);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Cargando producto...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Producto</h1>
      <h2 className={styles.subtitle}>Categoría: {params.category}</h2>

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
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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