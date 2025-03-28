import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import type { FeaturedProduct } from "@/types/types"
import styles from "./product-card.module.css"

interface ProductCardProps {
  product: FeaturedProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link href={`/producto/${product.categoria}/${product.id}`}>
          <Image
            src={product.imagen}
            alt={product.modelo}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        {product.en_oferta && (
          <span className={styles.discount}>-{product.descuento}%</span>
        )}
        {product.es_nuevo && (
          <span className={styles.newBadge}>Nuevo</span>
        )}
      </div>
      <div className={styles.content}>
        <Link href={`/producto/${product.categoria}/${product.id}`} className={styles.title}>
          {product.modelo}
        </Link>
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {product.precio.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR'
            })}
          </span>
          {product.en_oferta && product.precio_original && (
            <span className={styles.originalPrice}>
              {product.precio_original.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </span>
          )}
        </div>
        <button className={styles.addToCart}>
          <ShoppingCart className={styles.cartIcon} />
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

