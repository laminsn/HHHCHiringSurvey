import styles from './GlassCard.module.css';

export function GlassCard({ children, className = '', highlighted = false, style = {}, ...props }) {
  return (
    <div
      className={`${styles.card} ${highlighted ? styles.highlighted : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
