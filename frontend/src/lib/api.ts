const API_URL = 'http://localhost:3001/api';

export async function getPaletas() {
  const response = await fetch(`${API_URL}/paletas`);
  if (!response.ok) {
    throw new Error('Error al obtener las paletas');
  }
  return response.json();
}

export async function getIndumentaria() {
  const response = await fetch(`${API_URL}/indumentaria`);
  if (!response.ok) {
    throw new Error('Error al obtener la indumentaria');
  }
  return response.json();
}

export async function getAccesorios() {
  const response = await fetch(`${API_URL}/accesorios`);
  if (!response.ok) {
    throw new Error('Error al obtener los accesorios');
  }
  return response.json();
}

export async function getFeaturedProducts() {
  const response = await fetch(`${API_URL}/featured`);
  if (!response.ok) {
    throw new Error('Error al obtener los productos destacados');
  }
  return response.json();
} 