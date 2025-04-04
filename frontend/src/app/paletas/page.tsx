import { CategoryFilter } from "@/components/products/CategoryFilter"
import { ProductList } from "@/components/products/ProductList"
import { getPaletas } from "@/lib/api"

export default async function PaletasPage() {
  const products = await getPaletas()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paletas</h1>
      <CategoryFilter />
      <ProductList products={products} />
    </div>
  )
} 