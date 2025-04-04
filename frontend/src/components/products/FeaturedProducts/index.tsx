"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Product } from "@/types/types"
import { ProductCard } from "../ProductCard"
import styles from "./featured-products.module.css"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/featured")
        if (!response.ok) {
          throw new Error(`Error al cargar los productos: ${response.status}`)
        }
        const data = await response.json()
        console.log("Datos recibidos:", data) // Para depuración
        
        // Asegurarnos de que los datos tienen el formato correcto
        const formattedData = data.map((product: any, index: number) => ({
          ...product,
          categoria: product.categoria || "Accesorios", // Valor por defecto
          precio: Number(product.precio) || 0,
          precio_original: Number(product.precio_original) || Number(product.precio) || 0,
          descuento: Number(product.descuento) || 0,
          es_nuevo: Boolean(product.es_nuevo),
          en_oferta: Boolean(product.en_oferta),
          marca: product.marca || "",
          stock: Number(product.stock) || 0,
          fecha_creacion: product.fecha_creacion || new Date().toISOString(),
          tipo: product.tipo || "",
          talle: product.talle || "",
          uniqueId: `${product.categoria}-${product.id}-${index}` // Añadimos un índice único
        }))
        
        setProducts(formattedData)
      } catch (err) {
        console.error("Error en fetchProducts:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    // TODO: Implementar la lógica del carrito
    console.log("Añadir al carrito:", product)
  }

  if (loading) return null;

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <h2 className={styles.title}>Productos Destacados</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={`${product.categoria}-${product.id}`}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
      <Image
        src="/img/fondo2.webp"
        alt="Pádel"
        width={1920}
        height={1580}
        className={styles.backgroundImage}
        priority
      />
    </section>
  )
} 