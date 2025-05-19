import { Product, ProductCategory } from '@/types/product';
import ProductList from './list/ProductList';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import styles from './category-page.module.css';

interface CategoryPageProps {
  products: Product[];
  category: ProductCategory;
  error?: Error | null;
}

export function CategoryPage({ products, category, error }: CategoryPageProps) {
  const categoryTitles = {
    paletas: 'Paletas',
    indumentaria: 'Indumentaria',
    accesorios: 'Accesorios'
  };

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Error al cargar los productos'} 
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{categoryTitles[category]}</h1>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.content}>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No hay productos disponibles en este momento.</p>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
} 