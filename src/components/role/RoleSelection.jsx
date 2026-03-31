import { useAssessmentContext } from '../../context/AssessmentContext.jsx';
import { ROLES, ROLE_Q } from '../../data/index.js';
import { Button } from '../ui/Button.jsx';
import { motion } from 'framer-motion';
import styles from './RoleSelection.module.css';

export function RoleSelection() {
  const { role, setRole, allQ, goToQuestions, roleData } = useAssessmentContext();

  return (
    <div className={styles.wrapper} id="main-content">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.stepBadge}>Step 1 — Role Selection</div>
          <h2 className={styles.title}>Select Candidate Role</h2>
          <p className={styles.subtitle}>
            The selected role determines which role-specific competency questions are added to the universal assessment battery,
            ensuring precision-matched evaluation for every hire.
          </p>
        </div>

        <div className={styles.grid} role="radiogroup" aria-label="Select candidate role">
          {ROLES.map((r, i) => {
            const sel = role === r.id;
            return (
              <motion.button
                key={r.id}
                className={`${styles.roleCard} ${sel ? styles.selected : ''}`}
                onClick={() => setRole(r.id)}
                role="radio"
                aria-checked={sel}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className={styles.roleIcon}>{r.icon}</span>
                <div className={styles.roleInfo}>
                  <div className={styles.roleLabel}>{r.label}</div>
                  <div className={styles.roleSub}>{r.sub}</div>
                </div>
                {sel && <div className={styles.checkmark}>✓</div>}
              </motion.button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Button disabled={!role} onClick={goToQuestions}>
            {role ? `Begin Assessment — ${roleData?.label} →` : "Select a Role to Continue"}
          </Button>
          {role && (
            <p className={styles.questionCount}>
              {allQ.length} questions total · Universal battery + {(ROLE_Q[role] || []).length} role-specific questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
