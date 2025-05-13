'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/api';
import styles from './paletas.module.css';

export default function PaletasPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productService.getProductsByCategory('paletas');
                setProducts(data);
            } catch (error) {
                console.error('Error al cargar paletas:', error);
                setError(error instanceof Error ? error.message : 'Error al cargar las paletas');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Cargando paletas...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Paletas</h1>
            <div className={styles.productsGrid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                        <img src={product.imagen} alt={product.modelo} className={styles.productImage} />
                        <div className={styles.productInfo}>
                            <h2>{product.marca} {product.modelo}</h2>
                            <p className={styles.price}>
                                {product.en_oferta ? (
                                    <>
                                        <span className={styles.originalPrice}>
                                            ${product.precio}
                                        </span>
                                        <span className={styles.discountPrice}>
                                            ${(product.precio * (1 - product.descuento / 100)).toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span>${product.precio}</span>
                                )}
                            </p>
                            <p className={styles.stock}>
                                {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                            </p>
                            {product.es_nuevo && <span className={styles.newBadge}>Nuevo</span>}
                            {product.en_oferta && <span className={styles.discountBadge}>{product.descuento}% OFF</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 