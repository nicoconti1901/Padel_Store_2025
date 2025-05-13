import { Product, ProductCategory, Paleta, Indumentaria, Accesorio } from '@/types/product';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Función auxiliar para manejar las respuestas de la API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`);
  }
  return response.json();
}

// Función auxiliar para transformar los datos del producto
const transformProduct = (product: any, categoria: ProductCategory): Product => {
  const baseProduct = {
    ...product,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock) || 0,
    categoria
  };

  switch (categoria) {
    case 'paletas':
      return baseProduct as Paleta;
    case 'indumentaria':
      return {
        ...baseProduct,
        tipo: product.tipo || '',
        talle: product.talle || ''
      } as Indumentaria;
    case 'accesorios':
      return {
        ...baseProduct,
        tipo: product.tipo || ''
      } as Accesorio;
    default:
      throw new Error('Categoría no válida');
  }
};

// Servicios de productos
export const productService = {
  // Obtener un producto por ID
  async getProductById(id: string, categoria: ProductCategory): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${categoria}/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener producto');
      }
      const data = await response.json();
      return {
        ...data,
        categoria
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/${category}`);
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      const transformedProducts = response.data.map((product: any) => ({
        id: product._id || product.id,
        marca: product.marca || product.name,
        modelo: product.modelo || '',
        precio: product.precio || product.price,
        caracteristicas: product.caracteristicas || product.description || '',
        stock: product.stock || 0,
        imagen: product.imagen || product.image || '/placeholder.svg',
        es_nuevo: product.es_nuevo || false,
        en_oferta: product.en_oferta || false,
        descuento: product.descuento || 0,
        categoria: category as ProductCategory,
        tipo: product.tipo || '',
        talle: product.talle || ''
      }));
      return transformedProducts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de conexión:', error.message);
        throw new Error(`Error al conectar con el backend: ${error.message}`);
      }
      throw error;
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/featured`);
    const data = await handleResponse<any[]>(response);
    return data.map(product => transformProduct(product, product.categoria));
  },

  // Crear un nuevo producto
  async createProduct(product: Omit<Product, 'id'>, categoria: ProductCategory): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${categoria}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }
      const data = await response.json();
      return {
        ...data,
        categoria
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id: string, product: Partial<Product>, categoria: ProductCategory): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${categoria}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }
      const data = await response.json();
      return {
        ...data,
        categoria
      };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id: string, categoria: ProductCategory): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/products/${categoria}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
}; 