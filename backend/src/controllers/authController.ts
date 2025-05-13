import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
    username: string | null;
    name: string | null;
    is_admin: boolean;
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name } = req.body;

        // Verificar si el usuario ya existe
        const [existingUsers] = await pool.query<User[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const [result] = await pool.query(
            'INSERT INTO users (email, username, password_hash, name, is_admin) VALUES (?, ?, ?, ?, ?)',
            [email, username || null, hashedPassword, name || null, false]
        );

        const userId = (result as any).insertId;

        // Generar token
        const token = jwt.sign(
            { 
                id: userId, 
                email: email, 
                is_admin: false 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: userId,
                email,
                username: username || null,
                name: name || null,
                is_admin: false
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login para:', email);

        // Buscar usuario por email
        const [users] = await pool.query<User[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = users[0];
        console.log('Usuario encontrado:', user ? {
            id: user.id,
            email: user.email,
            hasPassword: !!user.password_hash,
            isAdmin: user.is_admin
        } : 'No');

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar que la contraseña exista
        if (!user.password_hash) {
            console.error('Error: La contraseña del usuario es undefined o null');
            return res.status(500).json({ 
                message: 'Error en la configuración del usuario',
                details: 'La contraseña no está configurada correctamente'
            });
        }

        try {
            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            console.log('¿Contraseña válida?', isValidPassword);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } catch (bcryptError) {
            console.error('Error al comparar contraseñas:', bcryptError);
            return res.status(500).json({ 
                message: 'Error al verificar la contraseña',
                details: 'Error interno del servidor'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar respuesta sin la contraseña
        const { password_hash: _, ...userWithoutPassword } = user;
        res.json({
            token,
            user: {
                ...userWithoutPassword,
                is_admin: Boolean(user.is_admin)
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // En una implementación real, podrías invalidar el token aquí
        // Por ahora, simplemente enviamos una respuesta exitosa
        res.json({ message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getAuthStatus = async (req: Request, res: Response) => {
    try {
        // El middleware de autenticación ya verificó el token
        // y agregó el usuario a req.user
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Obtener información actualizada del usuario
        const [users] = await pool.query<User[]>(
            'SELECT id, email, username, name, is_admin FROM users WHERE id = ?',
            [userId]
        );

        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ 
            user: {
                ...user,
                is_admin: Boolean(user.is_admin)
            }
        });
    } catch (error) {
        console.error('Error al obtener estado de autenticación:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 