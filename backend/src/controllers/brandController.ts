import { Request, Response } from 'express';
import { pool } from '../config/db';

export const brandController = {
  async getBrands(req: Request, res: Response) {
    try {
      const [brands] = await pool.query('SELECT id, nombre FROM marcas ORDER BY nombre');
      res.json(brands);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      res.status(500).json({ message: 'Error al obtener marcas' });
    }
  }
}; 