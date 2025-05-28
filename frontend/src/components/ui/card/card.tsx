'use client';

import { ReactNode } from 'react';
import styles from './card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
} 