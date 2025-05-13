export type ProductCategory = 'paletas' | 'indumentaria' | 'accesorios';

export interface BaseProduct {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  caracteristicas: string;
  stock: number;
  imagen: string;
  es_nuevo: boolean;
  en_oferta: boolean;
  descuento: number;
  fecha_creacion: string;
  categoria: ProductCategory;
  tipo?: string;
  talle?: string;
}

export interface Paleta extends BaseProduct {
  categoria: 'paletas';
}

export interface Indumentaria extends BaseProduct {
  categoria: 'indumentaria';
  tipo: string;
  talle: string;
}

export interface Accesorio extends BaseProduct {
  categoria: 'accesorios';
  tipo: string;
}

export type Product = Paleta | Indumentaria | Accesorio; 