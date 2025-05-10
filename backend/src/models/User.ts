import { RowDataPacket } from 'mysql2';
import { db } from '../config/database';

export interface User extends RowDataPacket {
    id: number;
    email: string;
    username: string | null;
    password_hash: string;
    name: string | null;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
}

export class UserModel {
    static async findByEmail(email: string): Promise<User | null> {
        const [rows] = await db.query<User[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    static async findByUsername(username: string): Promise<User | null> {
        const [rows] = await db.query<User[]>(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0] || null;
    }

    static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const [result] = await db.query(
            'INSERT INTO users (email, username, password_hash, name, is_admin) VALUES (?, ?, ?, ?, ?)',
            [user.email, user.username, user.password_hash, user.name, user.is_admin]
        );
        const [newUser] = await db.query<User[]>(
            'SELECT * FROM users WHERE id = ?',
            [(result as any).insertId]
        );
        return newUser[0];
    }
} 