import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiples clases de CSS de manera inteligente, resolviendo conflictos
 * y permitiendo clases condicionales
 * @param inputs - Clases CSS a combinar
 * @returns String con las clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 