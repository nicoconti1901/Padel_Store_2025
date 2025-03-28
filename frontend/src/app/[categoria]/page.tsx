import { getPaletas, getIndumentaria, getAccesorios } from "@/lib/api"
import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import type { FeaturedProduct } from "@/lib/types"
import { RowDataPacket } from "mysql2/promise"

interface CategoryPageProps {
  params: Promise<{
    categoria: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoria } = await params

  let products: FeaturedProduct[] = []
  let categoryTitle = ""

  // Fetch products based on category
  if (categoria === "paletas") {
    products = await getPaletas()
    categoryTitle = "Paletas de Pádel"
  } else if (categoria === "indumentaria") {
    products = await getIndumentaria()
    categoryTitle = "Indumentaria"
  } else if (categoria === "accesorios") {
    products = await getAccesorios()
    categoryTitle = "Accesorios"
  } else {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <CategoryFilter />
        </div>

        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos en esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

