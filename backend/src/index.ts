import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPaletas, getIndumentaria, getAccesorios } from './config/db';
import authRoutes from './routes/auth';
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
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de la API
app.get('/api/paletas', async (req: Request, res: Response) => {
  try {
    const paletas = await getPaletas();
    res.json(paletas);
  } catch (error: unknown) {
    console.error('Error al obtener las paletas:', error);
    res.status(500).json({ error: 'Error al obtener las paletas' });
  }
});

app.get('/api/indumentaria', async (req: Request, res: Response) => {
  try {
    const indumentaria = await getIndumentaria();
    res.json(indumentaria);
  } catch (error: unknown) {
    console.error('Error al obtener la indumentaria:', error);
    res.status(500).json({ error: 'Error al obtener la indumentaria' });
  }
});

app.get('/api/accesorios', async (req: Request, res: Response) => {
  try {
    const accesorios = await getAccesorios();
    res.json(accesorios);
  } catch (error: unknown) {
    console.error('Error al obtener los accesorios:', error);
    res.status(500).json({ error: 'Error al obtener los accesorios' });
  }
});

app.get('/api/featured', async (req: Request, res: Response) => {
  try {
    // Obtener productos destacados de cada categoría
    const [paletas, indumentaria, accesorios] = await Promise.all([
      getPaletas(),
      getIndumentaria(),
      getAccesorios()
    ]);

    // Combinar y filtrar productos destacados
    const featuredProducts = [
      ...paletas.filter(p => p.es_nuevo || p.en_oferta),
      ...indumentaria.filter(i => i.es_nuevo || i.en_oferta),
      ...accesorios.filter(a => a.es_nuevo || a.en_oferta)
    ].slice(0, 8); // Limitar a 8 productos destacados

    res.json(featuredProducts);
  } catch (error: unknown) {
    console.error('Error al obtener los productos destacados:', error);
    res.status(500).json({ error: 'Error al obtener los productos destacados' });
  }
});

// Iniciar el servidor
app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Servidor backend corriendo en el puerto ${port}`);
    console.log('Configuración de la base de datos:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}); 