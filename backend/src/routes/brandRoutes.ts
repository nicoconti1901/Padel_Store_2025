import { Router } from 'express';
import { brandController } from '../controllers/brandController';

const router = Router();

// Ruta pública para obtener todas las marcas
router.get('/', brandController.getBrands);

export default router; 