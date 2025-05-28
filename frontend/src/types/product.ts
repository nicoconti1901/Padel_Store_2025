export type ProductCategory = 'paletas' | 'indumentaria' | 'accesorios';

export interface BaseProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original: number;
  imagen: string;
  en_oferta: boolean;
  descuento: number;
  es_nuevo: boolean;
  stock: number;
  marca_id: number;
  categoria_id: number;
  created_at: string;
  updated_at: string;
  marca_nombre?: string;
  categoria_nombre?: string;
}

export interface Paleta extends BaseProduct {
  categoria: 'paletas';
  forma: string;
  nucleo: string;
  marco: string;
  peso: number;
  balance: string;
  grosor: number;
}

export interface Indumentaria extends BaseProduct {
  categoria: 'indumentaria';
  tipo: string;
  talle: string;
  material: string;
  color: string;
  genero: string;
  temporada: string;
}

export interface Accesorio extends BaseProduct {
  categoria: 'accesorios';
  tipo: string;
  material: string;
  dimensiones: string;
  peso: number;
  color: string;
}

export type Product = Paleta | Indumentaria | Accesorio; 