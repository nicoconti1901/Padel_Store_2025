'use client';

import { cn } from '@/utils/cn';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <span className={cn(styles.errorMessage, className)}>
      {message}
    </span>
  );
} 