import styles from './Button.module.css';

export function Button({ children, variant = 'primary', disabled = false, onClick, className = '', ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
