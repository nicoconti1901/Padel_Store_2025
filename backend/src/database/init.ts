import { db } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function initializeDatabase() {
    try {
        // Leer el archivo schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Dividir el schema en sentencias individuales
        const statements = schema
            .split(';')
            .filter(statement => statement.trim())
            .map(statement => statement + ';');

        // Ejecutar cada sentencia
        for (const statement of statements) {
            await db.query(statement);
        }

        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
}

// Ejecutar la inicialización
initializeDatabase(); 