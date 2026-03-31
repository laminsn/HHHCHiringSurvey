import { useAssessmentContext } from '../../context/AssessmentContext.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { Button } from '../ui/Button.jsx';
import { QuestionCard } from './QuestionCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './QuestionPage.module.css';

export function QuestionPage() {
  const { page, totalPages, pageQ, answered, allQ, progress, pageDone, roleData, nextPage, prevPage, PER_PAGE } = useAssessmentContext();
  const sections = [...new Set(pageQ.map(q => q.section))];

  return (
    <div className={styles.wrapper} id="main-content">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerBrand}>Happier Homes Comfort Care</div>
          <div className={styles.headerRole}>Personality Assessment · {roleData?.label}</div>
        </div>
        <div className={styles.headerCenter}>
          <div className={styles.pageCounter}>Page {page + 1} / {totalPages}</div>
          <div className={styles.answerCounter}>{answered} of {allQ.length} answered</div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.percentage}>{Math.round(progress * 100)}%</div>
          <div className={styles.percentageLabel}>Complete</div>
        </div>
      </header>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
      </div>

      <div className={styles.body}>
        {sections.length > 1 && (
          <div className={styles.sectionTags}>
            {sections.map(s => (
              <span key={s} className={styles.sectionTag}>{s}</span>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {pageQ.map((q, qi) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qi * 0.06 }}
              >
                <QuestionCard q={q} idx={page * PER_PAGE + qi + 1} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className={styles.nav}>
          <Button variant="secondary" onClick={prevPage}>← Back</Button>
          {!pageDone && (
            <span className={styles.hint}>
              Answer all {pageQ.length} questions on this page to continue
            </span>
          )}
          <Button disabled={!pageDone} onClick={nextPage}>
            {page < totalPages - 1 ? "Next Page →" : "View Full Results →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
