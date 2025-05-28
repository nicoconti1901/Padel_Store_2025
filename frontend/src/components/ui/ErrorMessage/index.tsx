import React from 'react';
import styles from './errorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <div className={`${styles.errorMessage} ${className || ''}`}>
      {message}
    </div>
  );
}; 