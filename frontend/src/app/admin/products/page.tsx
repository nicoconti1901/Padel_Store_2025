"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './products.module.css';
import { productService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory } from '@/types/product';
import Input from '@/components/ui/input/input';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<{ id: number; value: number } | null>(null);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de productos...');
      const data = await productService.getAllProducts();
      console.log('Productos cargados:', data.map(p => ({ nombre: p.nombre, categoria: p.categoria })));
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    console.log('Filtrando productos. Categoría seleccionada:', selectedCategory);
    console.log('Total de productos:', products.length);
    console.log('Productos disponibles:', products.map(p => ({ nombre: p.nombre, categoria: p.categoria })));
    
    if (selectedCategory === 'todas') {
      console.log('Mostrando todos los productos');
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        console.log('Comparando producto:', product.nombre, 'categoría:', product.categoria, 'con:', selectedCategory);
        return product.categoria === selectedCategory;
      });
      console.log(`Productos filtrados para categoría ${selectedCategory}:`, filtered);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleDelete = async (id: number, category: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await productService.deleteProduct(id.toString(), category as any);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('Error al eliminar el producto');
    }
  };

  const handleStockChange = async (id: number, category: string, newStock: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      await productService.updateProduct(id.toString(), { stock: newStock }, category as any);
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: newStock } : p
      ));
      setEditingStock(null);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      setError('Error al actualizar el stock');
    }
  };

  const handleImageError = (productId: number) => {
    console.log('Error al cargar imagen para producto:', productId);
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  if (isLoading || !isAuthenticated || !isAdmin) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button 
          className={styles.retryButton}
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchProducts();
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Productos</h1>
        <Link href="/products/new" className={styles.addButton}>
          Agregar Producto
        </Link>
      </div>

      <div className={styles.filters}>
        <select 
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'todas')}
        >
          <option value="todas">Todas las categorías</option>
          <option value="paletas">Paletas</option>
          <option value="indumentaria">Indumentaria</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noProducts}>
                  No hay productos disponibles en la categoría seleccionada
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.imageContainer}>
                      {!imageError[product.id] ? (
                        <Image
                          src={product.imagen || '/placeholder.svg'}
                          alt={product.nombre}
                          width={50}
                          height={50}
                          className={styles.productImage}
                          onError={() => handleImageError(product.id)}
                          unoptimized={true}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <span>Imagen no disponible</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{product.nombre}</td>
                  <td>{product.categoria}</td>
                  <td>${product.precio}</td>
                  <td>
                    <div className={styles.stockContainer}>
                      <Input
                        type="number"
                        value={editingStock?.id === product.id ? editingStock.value : product.stock}
                        onChange={(e) => setEditingStock({ id: product.id, value: parseInt(e.target.value) || 0 })}
                        min="0"
                        className={styles.stockInput}
                      />
                      {editingStock?.id === product.id && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleStockChange(product.id, product.categoria, editingStock.value)}
                          >
                            ✓
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingStock(null)}
                          >
                            ✕
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/products/${product.id}`} className={styles.editButton}>
                        Editar
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(product.id, product.categoria)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 