'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/api';
import { ProductCategory } from '@/types/product';
import styles from './create.module.css';

interface Brand {
  id: number;
  nombre: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState({
    modelo: '',
    caracteristicas: '',
    precio: '',
    precio_original: '',
    descuento: '0',
    stock: '',
    categoria: 'paletas' as ProductCategory,
    imagen: '',
    marca_id: '',
    es_nuevo: true,
    en_oferta: false,
    tipo: '',
    talle: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await productService.getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
        setError('Error al cargar las marcas');
      }
    };
    fetchBrands();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const productData = {
        ...formData,
        nombre: formData.modelo,
        precio: Number(formData.precio),
        precio_original: Number(formData.precio_original),
        descuento: Number(formData.descuento),
        stock: Number(formData.stock),
        marca_id: Number(formData.marca_id),
        fecha_creacion: new Date().toISOString()
      };

      await productService.createProduct(productData, formData.categoria);
      setSuccess('Producto agregado correctamente');
      
      // Esperar 2 segundos antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Crear Nuevo Producto</h1>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="caracteristicas">Características</label>
          <textarea
            id="caracteristicas"
            name="caracteristicas"
            value={formData.caracteristicas}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precio_original">Precio Original</label>
          <input
            type="number"
            id="precio_original"
            name="precio_original"
            value={formData.precio_original}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descuento">Descuento (%)</label>
          <input
            type="number"
            id="descuento"
            name="descuento"
            value={formData.descuento}
            onChange={handleChange}
            min="0"
            max="100"
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
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="paletas">Paletas</option>
            <option value="indumentaria">Indumentaria</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="marca_id">Marca</label>
          <select
            id="marca_id"
            name="marca_id"
            value={formData.marca_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imagen">URL de la imagen</label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="es_nuevo"
              checked={formData.es_nuevo}
              onChange={handleChange}
            />
            Es nuevo
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="en_oferta"
              checked={formData.en_oferta}
              onChange={handleChange}
            />
            En oferta
          </label>
        </div>

        {formData.categoria === 'indumentaria' && (
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

        {(formData.categoria === 'indumentaria' || formData.categoria === 'accesorios') && (
          <div className={styles.formGroup}>
            <label htmlFor="tipo">Tipo</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              value={formData.tipo}
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