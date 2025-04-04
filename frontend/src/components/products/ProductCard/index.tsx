"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/types/types"
import styles from "./productCard.module.css"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getCategoriaUrl = (categoria: string | undefined) => {
    if (!categoria) return "accesorios" // Valor por defecto

    const categoriaMap: Record<string, string> = {
      "Palas": "paletas",
      "Zapatillas": "indumentaria",
      "Ropa": "indumentaria",
      "Accesorios": "accesorios",
      "paletas": "paletas",
      "indumentaria": "indumentaria",
      "accesorios": "accesorios"
    }
    return categoriaMap[categoria] || "accesorios"
  }

  const categoriaUrl = getCategoriaUrl(product.categoria)

  return (
    <div className={styles.card}>
      <Link href={`/producto/${categoriaUrl}/${product.id}`}>
        <div className={styles.imageContainer}>
          <Image
            src={product.imagen}
            alt={product.modelo}
            width={300}
            height={300}
            className={styles.image}
          />
          {product.es_nuevo && (
            <span className={styles.newBadge}>Nuevo</span>
          )}
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/producto/${categoriaUrl}/${product.id}`} className={styles.title}>
          {product.modelo}
        </Link>

        <div className={styles.priceContainer}>
          <div className={styles.price}>
            {'precio_original' in product && product.precio_original && (
              <span className={styles.originalPrice}>
                {product.precio_original.toFixed(2)}€
              </span>
            )}
            <span className={styles.currentPrice}>
              {product.precio.toFixed(2)}€
            </span>
            {product.descuento > 0 && (
              <span className={styles.discount}>
                -{product.descuento}%
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={styles.addToCart}
          >
            <ShoppingCart className={styles.cartIcon} />
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
} 