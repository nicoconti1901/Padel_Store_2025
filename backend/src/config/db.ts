import mysql, { RowDataPacket } from "mysql2/promise"

// Create a connection pool
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3308"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "nico1901",
  database: process.env.MYSQL_DATABASE || "padel_store",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Define tipos de valores SQL permitidos
type SqlValue = string | number | boolean | Date | null | undefined;

export async function executeQuery<T extends RowDataPacket[]>({ 
  query, 
  values = [] 
}: { 
  query: string; 
  values?: SqlValue[] 
}): Promise<T> {
  try {
    const [results] = await pool.execute<T>(query, values)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    // Mostrar más detalles sobre el error
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Paletas
export async function getPaletas() {
  return executeQuery({
    query: "SELECT * FROM paletas ORDER BY fecha_creacion DESC",
  })
}

export async function getPaletaById(id: string) {
  return executeQuery({
    query: "SELECT * FROM paletas WHERE id = ?",
    values: [id],
  })
}

// Indumentaria
export async function getIndumentaria() {
  return executeQuery({
    query: "SELECT * FROM indumentaria ORDER BY fecha_creacion DESC",
  })
}

export async function getIndumentariaById(id: string) {
  return executeQuery({
    query: "SELECT * FROM indumentaria WHERE id = ?",
    values: [id],
  })
}

// Accesorios
export async function getAccesorios() {
  return executeQuery({
    query: "SELECT * FROM accesorios ORDER BY fecha_creacion DESC",
  })
}

export async function getAccesorioById(id: string) {
  return executeQuery({
    query: "SELECT * FROM accesorios WHERE id = ?",
    values: [id],
  })
}

// Featured products
export async function getFeaturedProducts() {
  return executeQuery({
    query: `
      SELECT 
        p.id,
        p.nombre as modelo,
        p.descripcion as caracteristicas,
        p.precio,
        p.precio_original,
        p.imagen,
        p.en_oferta,
        p.descuento,
        p.es_nuevo,
        c.nombre as categoria
      FROM productos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.es_nuevo = TRUE OR p.en_oferta = TRUE 
      ORDER BY p.es_nuevo DESC, p.en_oferta DESC
      LIMIT 4
    `
  })
}

