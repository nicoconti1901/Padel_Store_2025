'use client';

import { Product } from '@/types/product';
import ProductCard from '../card/ProductCard';
import styles from './productList.module.css';

interface ProductListProps {
    products: Product[];
    loading?: boolean;
    error?: string | null;
}

export default function ProductList({ products, loading, error }: ProductListProps) {
    if (loading) {
        return <div className={styles.loading}>Cargando productos...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (products.length === 0) {
        return <div className={styles.empty}>No se encontraron productos</div>;
    }

    return (
        <div className={styles.productList}>
            {products.map((product) => (
                <ProductCard 
                    key={`${product.categoria}-${product.id}`} 
                    product={product} 
                />
            ))}
        </div>
    );
} 