import styles from './Badge.module.css';

export function Badge({ label, color, bg }) {
  return (
    <span className={styles.badge} style={{ color, background: bg }}>
      {label}
    </span>
  );
}
