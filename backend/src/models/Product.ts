import { RowDataPacket } from 'mysql2';
import { db } from '../config/database';

export type ProductCategory = 'paletas' | 'indumentaria' | 'accesorios';

export interface BaseProduct extends RowDataPacket {
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
    fecha_creacion: Date;
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

export class ProductModel {
    static async findAll(): Promise<Product[]> {
        const [rows] = await db.query<Product[]>(`
            SELECT p.*, m.nombre as marca_nombre, 'paletas' as categoria
            FROM paletas p
            LEFT JOIN marcas m ON p.marca = m.nombre
            UNION ALL
            SELECT i.*, m.nombre as marca_nombre, 'indumentaria' as categoria
            FROM indumentaria i
            LEFT JOIN marcas m ON i.marca = m.nombre
            UNION ALL
            SELECT a.*, m.nombre as marca_nombre, 'accesorios' as categoria
            FROM accesorios a
            LEFT JOIN marcas m ON a.marca = m.nombre
        `);
        return rows;
    }

    static async findById(id: number, categoria: ProductCategory): Promise<Product | null> {
        const table = categoria === 'paletas' ? 'paletas' : 
                     categoria === 'indumentaria' ? 'indumentaria' : 'accesorios';
        const [rows] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, ? as categoria
            FROM ${table} p
            LEFT JOIN marcas m ON p.marca = m.nombre
            WHERE p.id = ?`,
            [categoria, id]
        );
        return rows[0] || null;
    }

    static async findByCategory(categoria: ProductCategory): Promise<Product[]> {
        const table = categoria === 'paletas' ? 'paletas' : 
                     categoria === 'indumentaria' ? 'indumentaria' : 'accesorios';
        const [rows] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, ? as categoria
            FROM ${table} p
            LEFT JOIN marcas m ON p.marca = m.nombre`,
            [categoria]
        );
        return rows;
    }

    static async create(product: Omit<Product, 'id' | 'fecha_creacion'>, categoria: ProductCategory): Promise<Product> {
        const table = categoria === 'paletas' ? 'paletas' : 
                     categoria === 'indumentaria' ? 'indumentaria' : 'accesorios';
        
        const fields = Object.keys(product)
            .filter(key => key !== 'id' && key !== 'fecha_creacion' && key !== 'categoria')
            .join(', ');
        
        const placeholders = Object.keys(product)
            .filter(key => key !== 'id' && key !== 'fecha_creacion' && key !== 'categoria')
            .map(() => '?')
            .join(', ');
        
        const values = Object.entries(product)
            .filter(([key]) => key !== 'id' && key !== 'fecha_creacion' && key !== 'categoria')
            .map(([, value]) => value);

        const [result] = await db.query(
            `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`,
            values
        );

        const [newProduct] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, ? as categoria
            FROM ${table} p
            LEFT JOIN marcas m ON p.marca = m.nombre
            WHERE p.id = ?`,
            [categoria, (result as any).insertId]
        );
        return newProduct[0];
    }

    static async update(id: number, product: Partial<Product>, categoria: ProductCategory): Promise<Product | null> {
        const table = categoria === 'paletas' ? 'paletas' : 
                     categoria === 'indumentaria' ? 'indumentaria' : 'accesorios';
        
        const fields = Object.keys(product)
            .filter(key => key !== 'id' && key !== 'fecha_creacion' && key !== 'categoria')
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.entries(product)
            .filter(([key]) => key !== 'id' && key !== 'fecha_creacion' && key !== 'categoria')
            .map(([, value]) => value);

        if (fields.length === 0) return null;

        await db.query(
            `UPDATE ${table} SET ${fields} WHERE id = ?`,
            [...values, id]
        );

        const [updatedProduct] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, ? as categoria
            FROM ${table} p
            LEFT JOIN marcas m ON p.marca = m.nombre
            WHERE p.id = ?`,
            [categoria, id]
        );
        return updatedProduct[0] || null;
    }

    static async delete(id: number, categoria: ProductCategory): Promise<boolean> {
        const table = categoria === 'paletas' ? 'paletas' : 
                     categoria === 'indumentaria' ? 'indumentaria' : 'accesorios';
        const [result] = await db.query(
            `DELETE FROM ${table} WHERE id = ?`,
            [id]
        );
        return (result as any).affectedRows > 0;
    }
} 