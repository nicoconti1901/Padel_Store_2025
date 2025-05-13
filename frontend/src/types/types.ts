export type ProductCategory = 'paletas' | 'indumentaria' | 'accesorios';

export interface BaseProduct {
    id?: number;
    marca: string;
    modelo: string;
    precio: number;
    caracteristicas: string;
    stock: number;
    imagen: string;
    es_nuevo: boolean;
    en_oferta: boolean;
    descuento: number;
    fecha_creacion?: Date;
}

export interface Product extends BaseProduct {
    marca_nombre?: string;
    categoria_nombre?: string;
}

export interface Paleta extends Product {
    // Campos específicos para paletas
}

export interface Accesorio extends Product {
    tipo: string;
}

export interface Indumentaria extends Product {
    talle: string;
    tipo: string;
} 