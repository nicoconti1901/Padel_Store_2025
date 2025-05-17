import { Product, ProductCategory } from '@/types/product';
import ProductList from './list/ProductList';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

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
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Error al cargar los productos'} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryTitles[category]}</h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No hay productos disponibles en este momento.</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
} 