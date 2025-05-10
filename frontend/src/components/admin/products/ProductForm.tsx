"use client";

import React, { useState, useEffect } from 'react';
import { Product, Paleta, Indumentaria, Accesorio, BaseProduct } from '@/types/types'; // Import specific types
import styles from './product-form.module.css';

interface ProductFormProps {
  initialData?: Partial<Product>; 
  onSubmit: (formData: Omit<Product, 'id' | 'fecha_creacion'>) => Promise<void>;
  isSubmitting: boolean;
}

// Define a more specific initial state type that includes optional category-specific fields
type FormDataType = Partial<BaseProduct & { categoria: Product['categoria']; tipo?: string; talle?: string }>;

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  
  const getInitialState = (): FormDataType => ({
    marca: '',
    modelo: '',
    categoria: 'paletas', // Default category
    precio: 0,
    caracteristicas: '',
    stock: 0,
    imagen: '',
    es_nuevo: false,
    en_oferta: false,
    descuento: 0,
    tipo: '', // Initialize even if not always used
    talle: '', // Initialize even if not always used
    ...(initialData ? initialData : {}), // Spread initialData if provided
  });

  const [formData, setFormData] = useState<FormDataType>(getInitialState());

  useEffect(() => {
    // Reset form state when initialData changes significantly (e.g., switching edit item)
    setFormData(getInitialState());
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      // Allow empty string for temporary state, convert to 0 if submitted empty
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData((prev: FormDataType) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure numeric fields are numbers (or 0 if empty string was allowed)
    const numericPrice = typeof formData.precio === 'string' && formData.precio === '' ? 0 : Number(formData.precio);
    const numericStock = typeof formData.stock === 'string' && formData.stock === '' ? 0 : Number(formData.stock);
    const numericDescuento = typeof formData.descuento === 'string' && formData.descuento === '' ? 0 : Number(formData.descuento);
    
    // Prepare data for submission, omitting fields based on category if needed
    const baseDataToSend = {
        ...formData,
        precio: numericPrice || 0,
        stock: numericStock || 0,
        descuento: numericDescuento || 0,
        es_nuevo: Boolean(formData.es_nuevo),
        en_oferta: Boolean(formData.en_oferta),
    };

    let dataToSend: Omit<Product, 'id' | 'fecha_creacion'>;

    switch (formData.categoria) {
        case 'indumentaria':
            dataToSend = baseDataToSend as Omit<Indumentaria, 'id' | 'fecha_creacion'>;
            break;
        case 'accesorios':
             dataToSend = { ...baseDataToSend } as Omit<Accesorio, 'id' | 'fecha_creacion'>;
             delete (dataToSend as any).talle; // Remove talle if it exists
             break;
        case 'paletas':
        default:
            dataToSend = { ...baseDataToSend } as Omit<Paleta, 'id' | 'fecha_creacion'>;
            delete (dataToSend as any).tipo; // Remove tipo if it exists
            delete (dataToSend as any).talle; // Remove talle if it exists
            break;
    }

    onSubmit(dataToSend);
  };

  const showTipo = ['indumentaria', 'accesorios'].includes(formData.categoria || '');
  const showTalle = formData.categoria === 'indumentaria';

  return (
    <form onSubmit={handleSubmit} className={styles.productForm}>
      <div className={styles.formGrid}>
        {/* Columna 1 */}
        <div className={styles.formColumn}>
          <div className={styles.formGroup}>
            <label htmlFor="marca">Marca</label>
            <input type="text" id="marca" name="marca" value={formData.marca || ''} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modelo">Modelo</label>
            <input type="text" id="modelo" name="modelo" value={formData.modelo || ''} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
              <option value="paletas">Paletas</option>
              <option value="indumentaria">Indumentaria</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          {showTipo && (
            <div className={styles.formGroup}>
              <label htmlFor="tipo">Tipo</label>
              <input type="text" id="tipo" name="tipo" value={formData.tipo || ''} onChange={handleChange} />
            </div>
          )}

          {showTalle && (
            <div className={styles.formGroup}>
              <label htmlFor="talle">Talle</label>
              <input type="text" id="talle" name="talle" value={formData.talle || ''} onChange={handleChange} />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="precio">Precio</label>
            <input type="number" id="precio" name="precio" value={formData.precio === undefined ? '' : formData.precio} onChange={handleChange} required step="0.01" min="0" />
          </div>

           <div className={styles.formGroup}>
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={formData.stock === undefined ? '' : formData.stock} onChange={handleChange} required min="0" />
          </div>
        </div>

        {/* Columna 2 */}
        <div className={styles.formColumn}>
          <div className={styles.formGroup}>
            <label htmlFor="caracteristicas">Características</label>
            <textarea id="caracteristicas" name="caracteristicas" value={formData.caracteristicas || ''} onChange={handleChange} rows={4}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imagen">URL de Imagen</label>
            <input type="text" id="imagen" name="imagen" value={formData.imagen || ''} onChange={handleChange} />
            {/* Considera usar un input type="file" y manejar la subida de archivos */} 
          </div>

          <div className={styles.formGroupRow}>
            <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
              <input type="checkbox" id="es_nuevo" name="es_nuevo" checked={!!formData.es_nuevo} onChange={handleChange} />
              <label htmlFor="es_nuevo">¿Es Nuevo?</label>
            </div>
            <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
              <input type="checkbox" id="en_oferta" name="en_oferta" checked={!!formData.en_oferta} onChange={handleChange} />
              <label htmlFor="en_oferta">¿En Oferta?</label>
            </div>
          </div>

          {formData.en_oferta && (
            <div className={styles.formGroup}>
              <label htmlFor="descuento">Descuento (%)</label>
              <input type="number" id="descuento" name="descuento" value={formData.descuento === undefined ? '' : formData.descuento} onChange={handleChange} min="0" max="100" />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 