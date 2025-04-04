const API_URL = 'http://localhost:3001/api';

export async function getPaletas() {
  const response = await fetch(`${API_URL}/paletas`);
  if (!response.ok) {
    throw new Error('Error al obtener las paletas');
  }
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock),
    categoria: "paletas"
  }));
}

export async function getIndumentaria() {
  const response = await fetch(`${API_URL}/indumentaria`);
  if (!response.ok) {
    throw new Error('Error al obtener la indumentaria');
  }
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock),
    categoria: "indumentaria"
  }));
}

export async function getAccesorios() {
  const response = await fetch(`${API_URL}/accesorios`);
  if (!response.ok) {
    throw new Error('Error al obtener los accesorios');
  }
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock),
    categoria: "accesorios"
  }));
}

export async function getFeaturedProducts() {
  const response = await fetch(`${API_URL}/featured`);
  if (!response.ok) {
    throw new Error('Error al obtener los productos destacados');
  }
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    precio: Number(product.precio),
    precio_original: Number(product.precio_original) || Number(product.precio),
    descuento: Number(product.descuento) || 0,
    es_nuevo: Boolean(product.es_nuevo),
    en_oferta: Boolean(product.en_oferta),
    stock: Number(product.stock) || 0
  }));
} 