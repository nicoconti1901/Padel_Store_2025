import CategoryFilter from "@/components/products/filter/CategoryFilter"
import ProductList from "@/components/products/list/ProductList"
import { productService } from "@/services/api"

export default async function AccesoriosPage() {
  const products = await productService.getProductsByCategory('accesorios')

  return (
    <main>
      <h1 className="text-3xl font-bold mb-8">Accesorios</h1>
      <CategoryFilter />
      <ProductList products={products} />
    </main>
  )
} 