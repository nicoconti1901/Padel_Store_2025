import { Router } from 'express';
import { getFeaturedProducts } from '../config/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
});

export default router; 