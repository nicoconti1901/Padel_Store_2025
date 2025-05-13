'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './create.module.css';

export default function CreateProductPage() {
  const router = useRouter();
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'paletas',
    image: '',
    brand: '',
    talle: ''
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        console.error('Error al crear el producto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Crear Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="paletas">Paletas</option>
            <option value="indumentaria">Indumentaria</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">URL de la imagen</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        {formData.category === 'indumentaria' && (
          <div className={styles.formGroup}>
            <label htmlFor="talle">Talle</label>
            <input
              type="text"
              id="talle"
              name="talle"
              value={formData.talle}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          Crear Producto
        </button>
      </form>
    </div>
  );
} 