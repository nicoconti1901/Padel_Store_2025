import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const password_hash = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await UserModel.create({
            email,
            username: username || null,
            password_hash,
            name: name || null,
            is_admin: false // Por defecto, los nuevos usuarios no son administradores
        });

        // Generar token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                is_admin: user.is_admin 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login para email:', email);

        // Buscar usuario
        const user = await UserModel.findByEmail(email);
        if (!user) {
            console.log('Usuario no encontrado:', email);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado:', {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        });

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('¿Contraseña válida?', isValidPassword);

        if (!isValidPassword) {
            console.log('Contraseña inválida para usuario:', email);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                is_admin: user.is_admin 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login exitoso para usuario:', email);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el login' });
    }
}; 