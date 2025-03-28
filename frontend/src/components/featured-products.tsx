import ProductCard from "./product-card"
import styles from "./featured-products.module.css"
import type { FeaturedProduct } from "@/types/types"

async function getFeaturedProducts() {
  try {
    const res = await fetch("http://localhost:3001/api/featured", {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Error al cargar los productos destacados: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products || products.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.noProducts}>
            <p>No hay productos destacados disponibles en este momento.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Productos Destacados</h2>
        <div className={styles.grid}>
          {products.map((product: FeaturedProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

