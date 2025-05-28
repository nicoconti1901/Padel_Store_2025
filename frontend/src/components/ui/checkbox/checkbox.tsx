'use client';

import React from 'react';
import styles from './checkbox.module.css';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}; 