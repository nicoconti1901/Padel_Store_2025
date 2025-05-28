'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Variante visual del badge
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'destructive';
  
  /**
   * Tamaño del badge
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Componente Badge que muestra una etiqueta o estado
 * @component
 * @example
 * ```tsx
 * // Badge por defecto
 * <Badge>Nuevo</Badge>
 * 
 * // Badge primario
 * <Badge variant="primary">Destacado</Badge>
 * 
 * // Badge pequeño
 * <Badge size="sm">Promo</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          styles.badge,
          styles[variant],
          styles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge'; 