import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/productRoutes';
import brandRoutes from './routes/brandRoutes';
import { testConnection } from './config/database';

// Cargar variables de entorno
dotenv.config();

// Verificar configuración
console.log('Configuración del servidor:');
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'No configurado');

const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);

// Ruta de prueba
app.get('/api/paletas', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(port, async () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  try {
    await testConnection();
    console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}); 