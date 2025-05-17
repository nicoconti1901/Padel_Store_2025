import { ProductCategory } from '@/types/product';
import { productService } from '@/services/api';
import { CategoryPage } from './CategoryPage';

export function withCategoryData(category: ProductCategory) {
  return async function CategoryPageWithData() {
    try {
      const products = await productService.getProductsByCategory(category);
      return <CategoryPage products={products} category={category} />;
    } catch (error) {
      console.error(`Error en ${category}Page:`, error);
      return <CategoryPage products={[]} category={category} error={error as Error} />;
    }
  };
} 