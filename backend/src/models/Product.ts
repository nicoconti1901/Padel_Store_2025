import { RowDataPacket } from 'mysql2';
import { db } from '../config/database';

export type ProductCategory = 'paletas' | 'indumentaria' | 'accesorios';

export interface BaseProduct extends RowDataPacket {
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
    created_at: Date;
    updated_at: Date;
    marca_nombre?: string; // para joins
    categoria_nombre?: string; // para joins
}

export interface Paleta extends BaseProduct {
    // Si en el futuro hay campos específicos, agrégalos aquí
}

export interface Indumentaria extends BaseProduct {
    tipo: string;
    talle: string;
}

export interface Accesorio extends BaseProduct {
    tipo: string;
}

export type Product = Paleta | Indumentaria | Accesorio;

export class ProductModel {
    static async findAll(): Promise<Product[]> {
        // Traer todos los productos, incluyendo los datos específicos de cada categoría
        // Unir con marcas y categorías
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre,
                i.tipo as indumentaria_tipo, i.talle as indumentaria_talle,
                a.tipo as accesorio_tipo
            FROM productos p
            LEFT JOIN marcas m ON p.marca_id = m.id
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN indumentaria i ON p.id = i.producto_id
            LEFT JOIN accesorios a ON p.id = a.producto_id
            LEFT JOIN paletas pa ON p.id = pa.producto_id`
        );
        // Mapear los resultados para devolver el tipo correcto
        return rows.map((row: any) => {
            if (row.categoria_nombre === 'indumentaria') {
                return {
                    ...row,
                    tipo: row.indumentaria_tipo,
                    talle: row.indumentaria_talle
                };
            } else if (row.categoria_nombre === 'accesorios') {
                return {
                    ...row,
                    tipo: row.accesorio_tipo
                };
            } else {
                return row;
            }
        });
    }

    static async findById(id: number, categoria: ProductCategory): Promise<Product | null> {
        // Traer un producto por id, incluyendo los datos específicos de la categoría
        let query = `SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre`;
        let join = '';
        let selectExtras = '';
        if (categoria === 'indumentaria') {
            selectExtras = ', i.tipo, i.talle';
            join = 'LEFT JOIN indumentaria i ON p.id = i.producto_id';
        } else if (categoria === 'accesorios') {
            selectExtras = ', a.tipo';
            join = 'LEFT JOIN accesorios a ON p.id = a.producto_id';
        } else if (categoria === 'paletas') {
            join = 'LEFT JOIN paletas pa ON p.id = pa.producto_id';
        }
        const [rows] = await db.query<Product[]>(
            `${query}${selectExtras}
            FROM productos p
            LEFT JOIN marcas m ON p.marca_id = m.id
            LEFT JOIN categorias c ON p.categoria_id = c.id
            ${join}
            WHERE p.id = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const row: any = rows[0];
        if (categoria === 'indumentaria') {
            row.tipo = row.tipo;
            row.talle = row.talle;
        } else if (categoria === 'accesorios') {
            row.tipo = row.tipo;
        }
        return row;
    }

    static async findByCategory(categoria: ProductCategory): Promise<Product[]> {
        // Traer todos los productos de una categoría, incluyendo los datos específicos
        let query = `SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre`;
        let join = '';
        let selectExtras = '';
        if (categoria === 'indumentaria') {
            selectExtras = ', i.tipo, i.talle';
            join = 'LEFT JOIN indumentaria i ON p.id = i.producto_id';
        } else if (categoria === 'accesorios') {
            selectExtras = ', a.tipo';
            join = 'LEFT JOIN accesorios a ON p.id = a.producto_id';
        } else if (categoria === 'paletas') {
            join = 'LEFT JOIN paletas pa ON p.id = pa.producto_id';
        }
        const [rows] = await db.query<Product[]>(
            `${query}${selectExtras}
            FROM productos p
            LEFT JOIN marcas m ON p.marca_id = m.id
            LEFT JOIN categorias c ON p.categoria_id = c.id
            ${join}
            WHERE c.nombre = ?`,
            [categoria]
        );
        // Mapear los resultados para devolver el tipo correcto
        return rows.map((row: any) => {
            if (categoria === 'indumentaria') {
                return {
                    ...row,
                    tipo: row.tipo,
                    talle: row.talle
                };
            } else if (categoria === 'accesorios') {
                return {
                    ...row,
                    tipo: row.tipo
                };
            } else {
                return row;
            }
        });
    }

    static async create(productData: any, categoria: ProductCategory): Promise<Product> {
        // 1. Verificar que marca_id existe
        if (!productData.marca_id) {
            throw new Error('marca_id es requerido');
        }

        // 2. Buscar el id de la categoría
        let categoriaId: number;
        const [catRows] = await db.query<RowDataPacket[]>(
            'SELECT id FROM categorias WHERE nombre = ?',
            [categoria]
        );
        if (catRows.length === 0) {
            throw new Error('Categoría no encontrada');
        }
        categoriaId = catRows[0].id;

        // 3. Insertar en productos
        const [prodResult] = await db.query(
            `INSERT INTO productos (nombre, descripcion, precio, precio_original, imagen, en_oferta, descuento, es_nuevo, stock, marca_id, categoria_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                productData.nombre,
                productData.descripcion,
                productData.precio,
                productData.precio_original,
                productData.imagen,
                productData.en_oferta,
                productData.descuento,
                productData.es_nuevo,
                productData.stock,
                productData.marca_id,
                categoriaId
            ]
        );
        const productoId = (prodResult as any).insertId;

        // 4. Insertar en la tabla de la categoría
        if (categoria === 'paletas') {
            await db.query(
                'INSERT INTO paletas (producto_id) VALUES (?)',
                [productoId]
            );
        } else if (categoria === 'indumentaria') {
            await db.query(
                'INSERT INTO indumentaria (producto_id, tipo, talle) VALUES (?, ?, ?)',
                [productoId, productData.tipo, productData.talle]
            );
        } else if (categoria === 'accesorios') {
            await db.query(
                'INSERT INTO accesorios (producto_id, tipo) VALUES (?, ?)',
                [productoId, productData.tipo]
            );
        }

        // 5. Devolver el producto creado (con join para traer todos los datos)
        const [rows] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre
            FROM productos p
            LEFT JOIN marcas m ON p.marca_id = m.id
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ?`,
            [productoId]
        );
        // Agregar campos específicos si es necesario
        if (categoria === 'indumentaria' && rows[0]) {
            const [indRows] = await db.query<RowDataPacket[]>(
                'SELECT tipo, talle FROM indumentaria WHERE producto_id = ?',
                [productoId]
            );
            if (indRows.length > 0) {
                (rows[0] as any).tipo = indRows[0].tipo;
                (rows[0] as any).talle = indRows[0].talle;
            }
        } else if (categoria === 'accesorios' && rows[0]) {
            const [accRows] = await db.query<RowDataPacket[]>(
                'SELECT tipo FROM accesorios WHERE producto_id = ?',
                [productoId]
            );
            if (accRows.length > 0) {
                (rows[0] as any).tipo = accRows[0].tipo;
            }
        }
        return rows[0];
    }

    static async update(id: number, product: Partial<Product>, categoria: ProductCategory): Promise<Product | null> {
        // 1. Actualizar datos generales en productos
        const generalFields = [
            'nombre', 'descripcion', 'precio', 'precio_original', 'imagen',
            'en_oferta', 'descuento', 'es_nuevo', 'stock', 'marca_id', 'categoria_id'
        ];
        const setFields = Object.keys(product)
            .filter(key => generalFields.includes(key))
            .map(key => `${key} = ?`)
            .join(', ');
        const values = Object.entries(product)
            .filter(([key]) => generalFields.includes(key))
            .map(([, value]) => value);
        if (setFields.length > 0) {
            await db.query(
                `UPDATE productos SET ${setFields} WHERE id = ?`,
                [...values, id]
            );
        }
        // 2. Actualizar datos específicos en la tabla de la categoría
        if (categoria === 'indumentaria') {
            const indFields = [];
            const indValues = [];
            if ('tipo' in product) {
                indFields.push('tipo = ?');
                indValues.push((product as any).tipo);
            }
            if ('talle' in product) {
                indFields.push('talle = ?');
                indValues.push((product as any).talle);
            }
            if (indFields.length > 0) {
                await db.query(
                    `UPDATE indumentaria SET ${indFields.join(', ')} WHERE producto_id = ?`,
                    [...indValues, id]
                );
            }
        } else if (categoria === 'accesorios') {
            if ('tipo' in product) {
                await db.query(
                    `UPDATE accesorios SET tipo = ? WHERE producto_id = ?`,
                    [product.tipo, id]
                );
            }
        }
        return await this.findById(id, categoria);
    }

    static async delete(id: number, categoria: ProductCategory): Promise<boolean> {
        // 1. Eliminar en la tabla de la categoría primero
        if (categoria === 'paletas') {
            await db.query(`DELETE FROM paletas WHERE producto_id = ?`, [id]);
        } else if (categoria === 'indumentaria') {
            await db.query(`DELETE FROM indumentaria WHERE producto_id = ?`, [id]);
        } else if (categoria === 'accesorios') {
            await db.query(`DELETE FROM accesorios WHERE producto_id = ?`, [id]);
        }
        // 2. Eliminar en productos
        const [result] = await db.query(
            `DELETE FROM productos WHERE id = ?`,
            [id]
        );
        return (result as any).affectedRows > 0;
    }

    static async findFeatured(): Promise<Product[]> {
        // Traer productos destacados (nuevos o en oferta)
        const [rows] = await db.query<Product[]>(
            `SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre,
                i.tipo as indumentaria_tipo, i.talle as indumentaria_talle,
                a.tipo as accesorio_tipo
            FROM productos p
            LEFT JOIN marcas m ON p.marca_id = m.id
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN indumentaria i ON p.id = i.producto_id
            LEFT JOIN accesorios a ON p.id = a.producto_id
            LEFT JOIN paletas pa ON p.id = pa.producto_id
            WHERE p.es_nuevo = true OR p.en_oferta = true
            ORDER BY p.created_at DESC
            LIMIT 8`
        );
        // Mapear los resultados para devolver el tipo correcto
        return rows.map((row: any) => {
            const categoria = row.categoria_nombre?.toLowerCase();
            if (categoria === 'indumentaria') {
                return {
                    ...row,
                    categoria: 'indumentaria',
                    tipo: row.indumentaria_tipo,
                    talle: row.indumentaria_talle
                };
            } else if (categoria === 'accesorios') {
                return {
                    ...row,
                    categoria: 'accesorios',
                    tipo: row.accesorio_tipo
                };
            } else if (categoria === 'paletas') {
                return {
                    ...row,
                    categoria: 'paletas'
                };
            } else {
                throw new Error(`Categoría no válida: ${categoria}`);
            }
        });
    }
}