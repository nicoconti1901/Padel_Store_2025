'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './categoryFilter.module.css';

const categories = [
    { id: 'paletas', name: 'Paletas' },
    { id: 'indumentaria', name: 'Indumentaria' },
    { id: 'accesorios', name: 'Accesorios' }
];

export default function CategoryFilter() {
    const router = useRouter();
    const pathname = usePathname();

    const handleCategoryChange = (categoryId: string) => {
        router.push(`/${categoryId}`);
    };

    return (
        <div className={styles.filterContainer}>
            <h3 className={styles.title}>Categorías</h3>
            <div className={styles.categories}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryButton} ${
                            pathname === `/${category.id}` ? styles.active : ''
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
} 