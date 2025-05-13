import { ProductList } from '@/components/products';
import { productService } from '@/services/api';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default async function IndumentariaPage() {
  try {
    const products = await productService.getProductsByCategory('indumentaria');
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Indumentaria</h1>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No hay productos disponibles en este momento.</p>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error en IndumentariaPage:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Error al cargar los productos'} 
        />
      </div>
    );
  }
} 