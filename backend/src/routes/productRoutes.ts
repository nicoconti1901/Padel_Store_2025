import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Middleware para validar categoría en rutas que lo requieran explícitamente
const validateCategoryInParams = (req: any, res: any, next: any) => {
  const categoria = req.params.categoria?.toLowerCase();
  if (categoria && !['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
    return res.status(400).json({ message: 'Categoría proporcionada en parámetros inválida' });
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

// Rutas Públicas
// Nota: El frontend llamará a /api/featured o /api/products/featured dependiendo de cómo montes estas rutas y tu API_URL
router.get('/featured', productController.getFeaturedProducts);
router.get('/all', productController.getAllProducts);

// Ruta para obtener productos por nombre de categoría
// ej: /api/paletas, /api/indumentaria (si productRoutes se monta en /api)
// o /api/products/paletas, /api/products/indumentaria (si productRoutes se monta en /api/products)
router.get('/:categoria', validateCategoryInParams, productController.getProductsByCategory);

// Ruta para obtener un producto específico por su ID (ID de la tabla 'productos')
// La :categoria aquí es opcional para el controlador, pero puede ser útil para el frontend
// para construir la URL o para que el modelo sepa qué JOIN específico hacer si fuera necesario.
// ej: /api/paletas/123 o /api/products/paletas/123
router.get('/:categoria/:id', validateCategoryInParams, validateId, productController.getProductById);

// Rutas Protegidas (requieren autenticación)
// La :categoria en la ruta indica en qué contexto se crea/actualiza (ej. para campos específicos)
router.post('/:categoria', authMiddleware, validateCategoryInParams, productController.createProduct);
router.put('/:categoria/:id', authMiddleware, validateCategoryInParams, validateId, productController.updateProduct);
router.delete('/:categoria/:id', authMiddleware, validateCategoryInParams, validateId, productController.deleteProduct);

export default router; 