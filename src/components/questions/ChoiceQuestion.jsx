import { Badge } from '../ui/Badge.jsx';
import styles from './ChoiceQuestion.module.css';

const DISC_COLORS = { D: "#DC2626", I: "#D97706", S: "#148F77", C: "#1B4F72" };

const TAG_MAP = {
  disc: { label: "DISC", color: "#1B4F72", bg: "#EBF5FB" },
  mbti: { label: "MBTI", color: "#7C3AED", bg: "#F5F3FF" },
  scenario: { label: "Scenario", color: "#D97706", bg: "#FFFBEB" },
  choice: { label: "Choice", color: "#148F77", bg: "#E8FAF5" },
};

export function ChoiceQuestion({ q, ans, onAns, idx }) {
  const opts = q.opts || [];
  const tag = TAG_MAP[q.type] || TAG_MAP.choice;

  return (
    <div className={`${styles.card} ${ans !== undefined ? styles.answered : ''}`}>
      <div className={styles.header}>
        <div className={styles.number}>{idx}</div>
        <div className={styles.meta}>
          <div className={styles.sectionRow}>
            <span className={styles.section}>{q.section}</span>
            <Badge label={tag.label} color={tag.color} bg={tag.bg} />
          </div>
          <p className={styles.text}>{q.text}</p>
        </div>
      </div>
      <div className={styles.options} role="radiogroup" aria-label={q.text}>
        {opts.map((opt, i) => {
          const selected = ans?.idx === i;
          const accent = q.type === "disc" && opt.disc ? DISC_COLORS[opt.disc] : "#148F77";
          return (
            <button
              key={i}
              className={`${styles.optBtn} ${selected ? styles.optSelected : ''}`}
              style={{
                borderColor: selected ? accent : undefined,
                background: selected ? `${accent}12` : undefined,
              }}
              onClick={() => {
                const d = { idx: i };
                if (opt.disc) d.disc = opt.disc;
                if (opt.m) d.m = opt.m;
                if (opt.v !== undefined) d.v = opt.v;
                onAns(d);
              }}
              role="radio"
              aria-checked={selected}
            >
              <div
                className={styles.radio}
                style={{
                  borderColor: selected ? accent : undefined,
                  background: selected ? accent : undefined,
                }}
              >
                {selected && <div className={styles.radioDot} />}
              </div>
              <span className={`${styles.optText} ${selected ? styles.optTextSelected : ''}`}>
                {opt.t}
              </span>
              {opt.disc && (
                <span className={styles.discBadge} style={{ color: DISC_COLORS[opt.disc], background: `${DISC_COLORS[opt.disc]}18` }}>
                  {opt.disc}
                </span>
              )}
              {opt.m && opt.m !== "A" && (
                <span className={styles.mbtiBadge}>{opt.m}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
