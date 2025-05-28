'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './separator.module.css';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientación del separador
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Indica si el separador debe ocupar todo el espacio disponible
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Componente Separator que crea una línea divisoria horizontal o vertical
 * @component
 * @example
 * ```tsx
 * // Separador horizontal
 * <Separator />
 * 
 * // Separador vertical
 * <Separator orientation="vertical" />
 * 
 * // Separador con ancho personalizado
 * <Separator fullWidth={false} className="w-1/2" />
 * ```
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          styles.separator,
          styles[orientation],
          fullWidth && styles.fullWidth,
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator'; 