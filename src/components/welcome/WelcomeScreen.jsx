import { useAssessmentContext } from '../../context/AssessmentContext.jsx';
import { Button } from '../ui/Button.jsx';
import { motion } from 'framer-motion';
import styles from './WelcomeScreen.module.css';

const DOMAINS = [
  ["⚖️", "Moral Compass & Ethics", "Values, integrity, and compliance behavior"],
  ["💬", "Communication Style", "Verbal, written, and interpersonal patterns"],
  ["🎯", "Professional Goals", "Motivation, ambition, and career alignment"],
  ["⚡", "Adaptability", "Resilience, change-readiness, pressure response"],
  ["🤖", "AI & Technology", "EHR proficiency, AI readiness, digital comfort"],
  ["🏥", "Technical Competency", "Role-specific clinical and operational skills"],
];

export function WelcomeScreen() {
  const { goToRole } = useAssessmentContext();

  return (
    <div className={styles.wrapper} id="main-content">
      <div className={styles.gradientMesh} />
      <div className={styles.content}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={styles.badge}>Happier Homes Comfort Care</div>
        </motion.div>

        <motion.h1 className={styles.heading} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Comprehensive Candidate<br />
          <span className={styles.headingAccent}>Personality Assessment</span>
        </motion.h1>

        <motion.p className={styles.subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          A clinically-informed, role-stratified hiring assessment grounded in
          <strong> Myers-Briggs, DISC, Big Five (OCEAN)</strong>,
          and healthcare-specific behavioral frameworks — engineered for post-acute care excellence.
        </motion.p>

        <motion.div className={styles.domainGrid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          {DOMAINS.map(([icon, label, desc], i) => (
            <motion.div
              key={i}
              className={styles.domainCard}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              <div className={styles.domainIcon}>{icon}</div>
              <div className={styles.domainLabel}>{label}</div>
              <div className={styles.domainDesc}>{desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className={styles.metaBar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <span><strong>⏱ Time:</strong> 18–22 minutes</span>
          <span className={styles.metaDot}>·</span>
          <span><strong>📋 Questions:</strong> 38–46 (role-adjusted)</span>
          <span className={styles.metaDot}>·</span>
          <span><strong>📊 Frameworks:</strong> MBTI · DISC · Big Five</span>
          <span className={styles.metaDot}>·</span>
          <span><strong>🔒</strong> Internal HR use only</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <Button onClick={goToRole}>Begin Assessment →</Button>
        </motion.div>

        <p className={styles.footer}>
          Powered by Happier Homes Comfort Care · Designed for post-acute care excellence
        </p>
      </div>
    </div>
  );
}
