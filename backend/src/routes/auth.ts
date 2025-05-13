import express from 'express';
import { register, login, logout, getAuthStatus } from '../controllers/authController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/status', authMiddleware, getAuthStatus);

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Ruta protegida accesible solo para administradores' });
});

export default router; 