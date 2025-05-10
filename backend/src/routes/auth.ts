import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Ruta protegida accesible solo para administradores' });
});

export default router; 