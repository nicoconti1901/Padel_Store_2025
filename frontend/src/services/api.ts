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
  console.log('Transformando producto:', product.nombre, 'con categoría:', categoria);
  
  const baseProduct = {
    id: product.id,
    nombre: product.nombre,
    descripcion: product.descripcion,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock) || 0,
    imagen: product.imagen || '/placeholder.svg',
    marca_id: product.marca_id,
    categoria_id: product.categoria_id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    marca_nombre: product.marca_nombre,
    categoria_nombre: product.categoria_nombre
  };

  try {
    switch (categoria) {
      case 'paletas':
        return {
          ...baseProduct,
          categoria: 'paletas',
          forma: product.forma || '',
          nucleo: product.nucleo || '',
          marco: product.marco || '',
          peso: Number(product.peso) || 0,
          balance: product.balance || '',
          grosor: Number(product.grosor) || 0
        } as Paleta;
      case 'indumentaria':
        return {
          ...baseProduct,
          categoria: 'indumentaria',
          tipo: product.tipo || '',
          talle: product.talle || '',
          material: product.material || '',
          color: product.color || '',
          genero: product.genero || '',
          temporada: product.temporada || ''
        } as Indumentaria;
      case 'accesorios':
        return {
          ...baseProduct,
          categoria: 'accesorios',
          tipo: product.tipo || '',
          material: product.material || '',
          dimensiones: product.dimensiones || '',
          peso: Number(product.peso) || 0,
          color: product.color || ''
        } as Accesorio;
      default:
        console.warn('Categoría no reconocida:', categoria, 'para producto:', product.nombre);
        return {
          ...baseProduct,
          categoria: 'paletas' // Categoría por defecto
        } as Product;
    }
  } catch (error) {
    console.error('Error transformando producto:', product.nombre, error);
    return {
      ...baseProduct,
      categoria: 'paletas' // Categoría por defecto en caso de error
    } as Product;
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
  async createProduct(productData: Omit<Product, 'id'>, category: ProductCategory): Promise<Product> {
    try {
      const now = new Date().toISOString();
      const data = {
        ...productData,
        categoria: category,
        categoria_id: parseInt(category),
        precio_original: productData.precio,
        created_at: now,
        updated_at: now
      };

      const response = await fetch(`${API_URL}/products/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }
      const dataCreated = await response.json();
      return transformProduct(dataCreated, category);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id: string, productData: Partial<Product>, category: ProductCategory): Promise<Product> {
    try {
      const data = {
        ...productData,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/products/${category}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }
      const dataUpdated = await response.json();
      return transformProduct(dataUpdated, category);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id: string, category: ProductCategory): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/products/${category}/${id}`, {
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
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Llamando a getAllProducts...');
      const response = await fetch(`${API_URL}/products/all`);
      console.log('Respuesta recibida:', response.status);
      
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      
      const data = await response.json();
      console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));
      
      // Mapear los productos usando la categoría de la base de datos
      const products = data.map((product: any) => {
        // Usar la categoría de la base de datos
        const categoria = product.categoria_nombre?.toLowerCase() || 'paletas';
        console.log('Procesando producto:', product.nombre, 'con categoría de BD:', categoria);
        return transformProduct(product, categoria as ProductCategory);
      });

      console.log('Productos procesados:', JSON.stringify(products, null, 2));
      return products;
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      throw error;
    }
  },
}; 