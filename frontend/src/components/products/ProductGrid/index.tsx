"use client"

import { Product } from "@/types/types"
import { ProductCard } from "../ProductCard"
import { useCart } from "@/hooks/use-cart"
import styles from "./productGrid.module.css"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        No se encontraron productos en esta categoría.
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={`${product.categoria}-${product.id}`}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
} 