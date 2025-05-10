import React from 'react';
import styles from './separator.module.css';

interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return (
    <div className={`${styles.separator} ${className || ''}`}>
      <div className={styles.line}></div>
      <div className={styles.dot}></div>
      <div className={styles.line}></div>
    </div>
  );
};

export default Separator; 