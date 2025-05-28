'use client';

import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './slider.module.css';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * Etiqueta que se muestra encima del slider
   */
  label?: string;
  
  /**
   * Función que se ejecuta cuando el valor cambia
   */
  onValueChange?: (value: number[]) => void;
}

/**
 * Componente Slider que permite seleccionar un valor dentro de un rango
 * @component
 * @example
 * ```tsx
 * <Slider
 *   label="Precio máximo"
 *   defaultValue={[500]}
 *   max={1000}
 *   step={10}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const Slider = forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      label,
      onValueChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <SliderPrimitive.Root
          ref={ref}
          className={cn(styles.slider, className)}
          onValueChange={onValueChange}
          {...props}
        >
          <SliderPrimitive.Track className={styles.track}>
            <SliderPrimitive.Range className={styles.range} />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className={styles.thumb} />
        </SliderPrimitive.Root>
        <div className={styles.valueDisplay}>
          {props.defaultValue?.[0] || props.value?.[0] || 0}
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider'; 