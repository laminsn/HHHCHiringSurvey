import styles from './LikertQuestion.module.css';

const COLORS = ["#DC2626", "#F97316", "#D97706", "#84CC16", "#059669"];
const LABELS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export function LikertQuestion({ q, ans, onAns, idx }) {
  return (
    <div className={`${styles.card} ${ans ? styles.answered : ''}`}>
      <div className={styles.header}>
        <div className={styles.number}>{idx}</div>
        <div>
          <div className={styles.section}>{q.section}</div>
          <p className={styles.text}>{q.text}</p>
        </div>
      </div>
      <div className={styles.options} role="radiogroup" aria-label={q.text}>
        {[1, 2, 3, 4, 5].map(val => {
          const sel = ans?.v === val;
          const color = COLORS[val - 1];
          return (
            <button
              key={val}
              className={`${styles.likertBtn} ${sel ? styles.likertSelected : ''}`}
              style={{
                borderColor: sel ? color : undefined,
                background: sel ? `${color}1A` : undefined,
              }}
              onClick={() => onAns({ v: val })}
              role="radio"
              aria-checked={sel}
              aria-label={LABELS[val - 1]}
              title={LABELS[val - 1]}
            >
              <span className={styles.likertValue} style={{ color: sel ? color : undefined }}>{val}</span>
              <span className={styles.likertLabel} style={{ color: sel ? color : undefined }}>
                {LABELS[val - 1].split(" ").map((w, i) => <span key={i} className={styles.likertWord}>{w}</span>)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
