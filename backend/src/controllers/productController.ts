import { Request, Response } from 'express';
import { ProductModel, ProductCategory } from '../models/Product';

export const productController = {
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

  // Obtener un producto por ID y categoría
  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const categoria = req.params.categoria as ProductCategory;
      if (isNaN(id) || !categoria) {
        return res.status(400).json({ message: 'ID o categoría inválidos' });
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
      if (!categoria) {
        return res.status(400).json({ message: 'Categoría no especificada' });
      }
      const products = await ProductModel.findByCategory(categoria);
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      res.status(500).json({ message: 'Error al obtener los productos por categoría' });
    }
  },

  // Crear un nuevo producto
  async createProduct(req: Request, res: Response) {
    try {
      const categoria = req.params.categoria as ProductCategory;
      if (!categoria) {
        return res.status(400).json({ message: 'Categoría no especificada' });
      }
      const productData = req.body;
      const newProduct = await ProductModel.create(productData, categoria);
      res.status(201).json(newProduct);
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Error al crear producto' });
    }
  },

  // Actualizar un producto
  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const categoria = req.params.categoria as ProductCategory;
      if (isNaN(id) || !categoria) {
        return res.status(400).json({ message: 'ID o categoría inválidos' });
      }
      const productData = req.body;
      const updatedProduct = await ProductModel.update(id, productData, categoria);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar' });
      }
      res.json(updatedProduct);
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Error al actualizar producto' });
    }
  },

  // Eliminar un producto
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const categoria = req.params.categoria as ProductCategory;
      if (isNaN(id) || !categoria) {
        return res.status(400).json({ message: 'ID o categoría inválidos' });
      }
      const success = await ProductModel.delete(id, categoria);
      if (!success) {
        return res.status(404).json({ message: 'Producto no encontrado o no se pudo eliminar' });
      }
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Error al eliminar producto' });
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.findFeatured();
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      res.status(500).json({ message: 'Error al obtener productos destacados' });
    }
  }
}; 