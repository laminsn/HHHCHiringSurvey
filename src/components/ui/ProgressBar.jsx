import styles from './ProgressBar.module.css';

export function ProgressBar({ pct, color, height = 8, shimmer = false, className = '' }) {
  return (
    <div className={`${styles.track} ${className}`} style={{ height }} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`${styles.fill} ${shimmer ? styles.shimmer : ''}`}
        style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: height }}
      />
    </div>
  );
}
