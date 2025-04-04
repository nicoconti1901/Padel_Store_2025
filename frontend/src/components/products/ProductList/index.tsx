"use client"

import { Product } from "@/types/types"
import { ProductCard } from "../ProductCard"
import { useCart } from "@/hooks/use-cart"
import styles from "./productList.module.css"

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { addItem } = useCart()

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
          onAddToCart={addItem}
        />
      ))}
    </div>
  )
} 