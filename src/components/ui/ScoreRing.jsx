import { useAnimatedValue } from '../../hooks/useAnimatedValue.js';
import styles from './ScoreRing.module.css';

export function ScoreRing({ score, color, size = 120, strokeWidth = 10, label = "Overall" }) {
  const animatedScore = useAnimatedValue(score, 1500);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg className={styles.svg} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={styles.trackCircle}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.fillCircle}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.score} style={{ color }}>{animatedScore}</span>
        <span className={styles.sublabel}>{label}</span>
      </div>
    </div>
  );
}
