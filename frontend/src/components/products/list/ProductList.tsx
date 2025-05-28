'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import ProductCard from '../card/ProductCard';
import ProductFilter from '../filter/ProductFilter';
import styles from './productList.module.css';

type SortOption = 'default' | 'price_asc' | 'price_desc';

interface ProductListProps {
    products: Product[];
    loading?: boolean;
    error?: string | null;
}

export default function ProductList({ products, loading, error }: ProductListProps) {
    const [filters, setFilters] = useState<{
        search: string;
        category: number | '';
        sortBy: SortOption;
    }>({ 
        search: '', 
        category: '',
        sortBy: 'default'
    });

    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                                (product.marca_nombre?.toLowerCase() || '').includes(filters.search.toLowerCase());
            const matchesCategory = !filters.category || product.categoria_id === filters.category;
            return matchesSearch && matchesCategory;
        });

        // Aplicar ordenamiento
        if (filters.sortBy !== 'default') {
            result.sort((a, b) => {
                const priceA = a.en_oferta ? a.precio * (1 - a.descuento / 100) : a.precio;
                const priceB = b.en_oferta ? b.precio * (1 - b.descuento / 100) : b.precio;
                
                return filters.sortBy === 'price_asc' 
                    ? priceA - priceB 
                    : priceB - priceA;
            });
        }

        return result;
    }, [products, filters]);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(product => product.categoria_id));
        return Array.from(uniqueCategories).map(id => id.toString());
    }, [products]);

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
        <div className={styles.container}>
            <ProductFilter 
                onFilterChange={setFilters}
                categories={categories}
            />
            <div className={styles.productList}>
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={`${product.categoria_id}-${product.id}`} 
                        product={product} 
                    />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className={styles.noResults}>
                    No se encontraron productos que coincidan con los filtros
                </div>
            )}
        </div>
    );
} 