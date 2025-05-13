import { Request, Response } from 'express';
import { ProductModel, ProductCategory } from '../models/Product';
import { executeQuery } from '../config/db';

export const productController = {
  // Obtener todas las paletas
  async getPaletas(req: Request, res: Response) {
    try {
      const paletas = await ProductModel.findByCategory('paletas');
      res.json(paletas);
    } catch (error) {
      console.error('Error al obtener paletas:', error);
      res.status(500).json({ message: 'Error al obtener las paletas' });
    }
  },

  // Obtener toda la indumentaria
  async getIndumentaria(req: Request, res: Response) {
    try {
      const indumentaria = await ProductModel.findByCategory('indumentaria');
      res.json(indumentaria);
    } catch (error) {
      console.error('Error al obtener indumentaria:', error);
      res.status(500).json({ message: 'Error al obtener la indumentaria' });
    }
  },

  // Obtener todos los accesorios
  async getAccesorios(req: Request, res: Response) {
    try {
      const accesorios = await ProductModel.findByCategory('accesorios');
      res.json(accesorios);
    } catch (error) {
      console.error('Error al obtener accesorios:', error);
      res.status(500).json({ message: 'Error al obtener los accesorios' });
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const query = `
        SELECT 
          p.id,
          p.marca,
          p.modelo,
          p.precio,
          p.caracteristicas,
          p.stock,
          p.imagen,
          p.es_nuevo,
          p.en_oferta,
          p.descuento,
          NULL as tipo,
          NULL as talle,
          'paletas' as categoria
        FROM paletas p
        WHERE p.es_nuevo = TRUE OR p.en_oferta = TRUE
        UNION ALL
        SELECT 
          i.id,
          i.marca,
          i.modelo,
          i.precio,
          i.caracteristicas,
          i.stock,
          i.imagen,
          i.es_nuevo,
          i.en_oferta,
          i.descuento,
          i.tipo,
          i.talle,
          'indumentaria' as categoria
        FROM indumentaria i
        WHERE i.es_nuevo = TRUE OR i.en_oferta = TRUE
        UNION ALL
        SELECT 
          a.id,
          a.marca,
          a.modelo,
          a.precio,
          a.caracteristicas,
          a.stock,
          a.imagen,
          a.es_nuevo,
          a.en_oferta,
          a.descuento,
          a.tipo,
          NULL as talle,
          'accesorios' as categoria
        FROM accesorios a
        WHERE a.es_nuevo = TRUE OR a.en_oferta = TRUE
        ORDER BY es_nuevo DESC, en_oferta DESC
        LIMIT 6
      `;

      const products = await executeQuery({ query });
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      res.status(500).json({ message: 'Error al obtener los productos destacados' });
    }
  },

  // Obtener todos los productos
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.findAll();
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  },

  // Obtener un producto por ID
  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
      }

      const categoria = req.params.categoria as ProductCategory;
      if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoría inválida' });
      }

      const product = await ProductModel.findById(id, categoria);
      
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ message: 'Error al obtener producto' });
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const categoria = req.params.categoria as ProductCategory;
      if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoría inválida' });
      }
      const products = await ProductModel.findByCategory(categoria);
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  },

  // Crear un nuevo producto
  async createProduct(req: Request, res: Response) {
    try {
      const {
        marca,
        modelo,
        precio,
        caracteristicas,
        stock,
        imagen,
        es_nuevo,
        en_oferta,
        descuento,
        tipo,
        talle
      } = req.body;

      const categoria = req.params.categoria as ProductCategory;
      if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoría inválida' });
      }

      // Validaciones básicas
      if (!marca || !modelo || !precio || !stock) {
        return res.status(400).json({ 
          message: 'Faltan campos requeridos' 
        });
      }

      // Validaciones específicas por categoría
      if (categoria === 'indumentaria' && (!tipo || !talle)) {
        return res.status(400).json({
          message: 'La indumentaria requiere tipo y talle'
        });
      }

      if (categoria === 'accesorios' && !tipo) {
        return res.status(400).json({
          message: 'Los accesorios requieren tipo'
        });
      }

      const product = await ProductModel.create({
        marca,
        modelo,
        precio: parseFloat(precio),
        caracteristicas,
        stock: parseInt(stock),
        imagen,
        es_nuevo: es_nuevo || false,
        en_oferta: en_oferta || false,
        descuento: descuento ? parseFloat(descuento) : 0,
        tipo,
        talle
      }, categoria);

      res.status(201).json(product);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: 'Error al crear producto' });
    }
  },

  // Actualizar un producto
  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
      }

      const categoria = req.params.categoria as ProductCategory;
      if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoría inválida' });
      }

      const {
        marca,
        modelo,
        precio,
        caracteristicas,
        stock,
        imagen,
        es_nuevo,
        en_oferta,
        descuento,
        tipo,
        talle
      } = req.body;

      const updateData: any = {};
      if (marca) updateData.marca = marca;
      if (modelo) updateData.modelo = modelo;
      if (precio) updateData.precio = parseFloat(precio);
      if (caracteristicas) updateData.caracteristicas = caracteristicas;
      if (stock) updateData.stock = parseInt(stock);
      if (imagen) updateData.imagen = imagen;
      if (es_nuevo !== undefined) updateData.es_nuevo = es_nuevo;
      if (en_oferta !== undefined) updateData.en_oferta = en_oferta;
      if (descuento !== undefined) updateData.descuento = parseFloat(descuento);
      if (tipo !== undefined) updateData.tipo = tipo;
      if (talle !== undefined) updateData.talle = talle;

      // Validaciones específicas por categoría
      if (categoria === 'indumentaria' && updateData.tipo === '' || updateData.talle === '') {
        return res.status(400).json({
          message: 'La indumentaria requiere tipo y talle'
        });
      }

      if (categoria === 'accesorios' && updateData.tipo === '') {
        return res.status(400).json({
          message: 'Los accesorios requieren tipo'
        });
      }

      const updatedProduct = await ProductModel.update(id, updateData, categoria);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto' });
    }
  },

  // Eliminar un producto
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
      }

      const categoria = req.params.categoria as ProductCategory;
      if (!['paletas', 'indumentaria', 'accesorios'].includes(categoria)) {
        return res.status(400).json({ message: 'Categoría inválida' });
      }

      const success = await ProductModel.delete(id, categoria);
      
      if (!success) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error al eliminar producto' });
    }
  }
}; 