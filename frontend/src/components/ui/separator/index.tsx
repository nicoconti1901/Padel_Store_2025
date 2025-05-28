import React from 'react';
import styles from './separator.module.css';

interface SeparatorProps {
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return (
    <div className={`${styles.separator} ${className || ''}`} />
  );
}; 