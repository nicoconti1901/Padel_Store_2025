"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import type { FeaturedProduct } from "@/types/types"
import styles from "./product-grid.module.css"

export default function ProductGrid() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.precio - b.precio
      case "price-high":
        return b.precio - a.precio
      case "newest":
        return a.es_nuevo ? -1 : 1
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.productCount}>Mostrando {products.length} productos</div>
        <div className={styles.sortContainer}>
          <label htmlFor="sort" className={styles.sortLabel}>
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="featured">Destacados</option>
            <option value="newest">Más nuevos</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

