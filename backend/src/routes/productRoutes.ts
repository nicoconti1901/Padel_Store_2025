import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Middleware para validar categoría
const validateCategory = (req: any, res: any, next: any) => {
  const categoria = req.params.categoria?.toLowerCase();
  console.log('Validando categoría:', categoria);
  if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
    return res.status(400).json({ message: 'Categoría inválida' });
  }
  next();
};

// Middleware para validar ID
const validateId = (req: any, res: any, next: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }
  next();
};

// Rutas públicas específicas (deben ir primero)
router.get('/products/paletas', productController.getPaletas);
router.get('/products/indumentaria', productController.getIndumentaria);
router.get('/products/accesorios', productController.getAccesorios);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/all', productController.getAllProducts);

// Rutas con parámetros (deben ir después)
router.get('/products/:categoria/:id', validateCategory, validateId, productController.getProductById);
router.get('/products/:categoria', validateCategory, productController.getProductsByCategory);

// Rutas protegidas (requieren autenticación)
router.post('/products/:categoria', authMiddleware, validateCategory, productController.createProduct);
router.put('/products/:categoria/:id', authMiddleware, validateCategory, validateId, productController.updateProduct);
router.delete('/products/:categoria/:id', authMiddleware, validateCategory, validateId, productController.deleteProduct);

export default router; 