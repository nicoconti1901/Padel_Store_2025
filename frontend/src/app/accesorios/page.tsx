import { CategoryFilter } from "@/components/products/CategoryFilter"
import { ProductList } from "@/components/products/ProductList"
import type { Product } from "@/types/types"
import { getAccesorios } from "@/lib/api"

export default async function AccesoriosPage() {
  const products = await getAccesorios()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Accesorios</h1>
      <CategoryFilter />
      <ProductList products={products} />
    </div>
  )
} 