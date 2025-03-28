export interface BaseProduct {
  id: number
  marca: string
  modelo: string
  precio: number
  caracteristicas: string
  stock: number
  imagen: string
  es_nuevo: boolean
  en_oferta: boolean
  descuento: number
  fecha_creacion: string
}

// Specific product types
export interface Paleta extends BaseProduct {
  categoria: "paletas"
}

export interface Indumentaria extends BaseProduct {
  categoria: "indumentaria"
  tipo: string
  talle: string
}

export interface Accesorio extends BaseProduct {
  categoria: "accesorios"
  tipo: string
}

// Union type for all products
export type Product = Paleta | Indumentaria | Accesorio

// For featured products display
export interface FeaturedProduct {
  id: number
  modelo: string
  caracteristicas: string
  precio: number
  precio_original: number
  imagen: string
  en_oferta: boolean
  descuento: number
  es_nuevo: boolean
  categoria: "Palas" | "Zapatillas" | "Ropa" | "Accesorios"
}

