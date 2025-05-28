'use client';

import { useState } from 'react';
import styles from './productFilter.module.css';

interface ProductFilterProps {
    onFilterChange: (filters: { 
        search: string; 
        category: number | '';
        sortBy: 'default' | 'price_asc' | 'price_desc';
    }) => void;
    categories: string[];
}

export default function ProductFilter({ onFilterChange, categories }: ProductFilterProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<number | ''>('');
    const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        onFilterChange({ search: newSearch, category, sortBy });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value ? parseInt(e.target.value) : '';
        setCategory(newCategory);
        onFilterChange({ search, category: newCategory, sortBy });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value as 'default' | 'price_asc' | 'price_desc';
        setSortBy(newSort);
        onFilterChange({ search, category, sortBy: newSort });
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>
            
            <div className={styles.sortContainer}>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className={styles.sortSelect}
                >
                    <option value="default">Ordenar por</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                </select>
            </div>
        </div>
    );
} 