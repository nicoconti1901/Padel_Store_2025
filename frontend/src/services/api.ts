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
    id: product._id || product.id,
    marca: product.marca_nombre || product.marca?.nombre || product.marca || '',
    modelo: product.nombre || product.modelo || '',
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock) || 0,
    imagen: product.imagen || '/placeholder.svg',
    caracteristicas: product.caracteristicas || '',
    categoria: product.categoria || categoria,
    marca_id: product.marca?._id || product.marca_id,
    categoria_id: product.categoria?._id || product.categoria_id,
    fecha_creacion: product.fecha_creacion || new Date().toISOString()
  };

  const productCategoria = baseProduct.categoria.toLowerCase();
  switch (productCategoria) {
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
      throw new Error(`Categoría no válida: ${productCategoria}`);
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
      return transformProduct(data, categoria);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/${category}`);
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      return response.data.map((product: any) => transformProduct(product, category));
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
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      return response.data.map((product: any) => transformProduct(product, product.categoria));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de conexión:', error.message);
        throw new Error(`Error al conectar con el backend: ${error.message}`);
      }
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(product: Omit<Product, 'id'>, categoria: ProductCategory): Promise<Product> {
    try {
      // Transformar los datos para que coincidan con el backend
      const productData = {
        nombre: product.modelo, // Siempre usar modelo como nombre
        descripcion: product.caracteristicas, // Convertir caracteristicas a descripcion
        precio: product.precio,
        precio_original: product.precio_original,
        descuento: product.descuento,
        es_nuevo: product.es_nuevo,
        en_oferta: product.en_oferta,
        stock: product.stock,
        imagen: product.imagen,
        marca_id: product.marca_id, // Usar marca_id directamente
        tipo: product.tipo,
        talle: product.talle
      };

      console.log('Datos a enviar al backend:', productData); // Agregar log para debug

      const response = await fetch(`${API_URL}/products/${categoria}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }
      const data = await response.json();
      return transformProduct(data, categoria);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(product),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }
      const data = await response.json();
      return transformProduct(data, categoria);
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
  },

  // Obtener todas las marcas
  async getBrands(): Promise<{ id: number; nombre: string }[]> {
    try {
      const response = await fetch(`${API_URL}/brands`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener marcas');
      }
      return response.json();
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  }
}; 