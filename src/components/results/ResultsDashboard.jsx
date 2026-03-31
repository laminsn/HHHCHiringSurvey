import { useAssessmentContext } from '../../context/AssessmentContext.jsx';
import { DOMAIN_META, DISC_PROFILES, MBTI_PROFILES, FOLLOW_UP_Q } from '../../data/index.js';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { Button } from '../ui/Button.jsx';
import { ScoreRing } from '../ui/ScoreRing.jsx';
import { AnimatedNumber } from '../ui/AnimatedNumber.jsx';
import { motion } from 'framer-motion';
import styles from './ResultsDashboard.module.css';

const RC_MAP = {
  green:  { bg: "var(--green-bg)", border: "#6EE7B7", color: "var(--green)", icon: "✅" },
  amber:  { bg: "var(--amber-bg)", border: "#FCD34D", color: "var(--amber)", icon: "⚠️" },
  purple: { bg: "var(--purple-bg)", border: "#C4B5FD", color: "var(--purple)", icon: "🔍" },
  red:    { bg: "var(--red-bg)", border: "#FCA5A5", color: "var(--red)", icon: "❌" },
};

const REC_TEXT = {
  green: "This candidate demonstrates strong alignment across all measured competency domains. Recommend advancing to offer stage with standard onboarding plan and 90-day check-in structure.",
  amber: "This candidate shows meaningful promise but warrants structured follow-up interviews in weaker competency areas before extending a conditional offer.",
  purple: "Significant competency gaps identified. Additional behavioral interviews, reference checks, and practical scenario exercises are strongly recommended before proceeding.",
  red: "Critical concerns identified in the Ethics & Moral Compass domain. Do not advance to offer without a formal in-person ethics review conducted by senior leadership and HR.",
};

const BF_COLORS = { Openness: "#2563EB", Conscientiousness: "#148F77", Extraversion: "#D97706", Agreeableness: "#059669", EmotionalStability: "#7C3AED" };
const BF_ICONS = { Openness: "💡", Conscientiousness: "📋", Extraversion: "🤝", Agreeableness: "🤲", EmotionalStability: "⚓" };
const BF_CONTEXT = {
  Openness: "High openness indicates strong adaptability, creative problem-solving, and AI/technology readiness — critical in evolving post-acute environments.",
  Conscientiousness: "High conscientiousness strongly predicts clinical accuracy, documentation discipline, compliance adherence, and patient safety outcomes.",
  Extraversion: "High extraversion supports family engagement, referral relationship-building, and IDT communication effectiveness.",
  Agreeableness: "High agreeableness correlates with compassionate patient care and collaborative IDT participation — essential in hospice and palliative settings.",
  EmotionalStability: "High emotional stability predicts performance under the intense emotional demands of end-of-life care and crisis situations.",
};

const stagger = (i) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.05 } });

export function ResultsDashboard() {
  const { scores, roleData, goToWelcome } = useAssessmentContext();
  if (!scores) return null;

  const { ds, discPct, mbtiType, bigFive, overall, rec, recType, primaryDisc, weakDomains } = scores;
  const RC = RC_MAP[recType];
  const discInfo = DISC_PROFILES[primaryDisc];
  const mbtiDesc = MBTI_PROFILES[mbtiType] || "Balanced profile — no single MBTI type is strongly dominant.";

  return (
    <div className={styles.wrapper} id="main-content">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <div className={styles.headerBrand}>Happier Homes Comfort Care — Candidate Assessment Report</div>
            <h1 className={styles.headerTitle}>Personality & Competency Report</h1>
            <div className={styles.headerMeta}>
              Role: {roleData?.label} · Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <Button variant="ghost" onClick={goToWelcome}>+ New Assessment</Button>
        </div>
      </header>

      <div className={styles.body}>
        {/* RECOMMENDATION BANNER */}
        <motion.div className={styles.recBanner} style={{ background: RC.bg, borderColor: RC.border }} {...stagger(0)}>
          <div className={styles.recIcon}>{RC.icon}</div>
          <div className={styles.recContent}>
            <div className={styles.recLabel} style={{ color: RC.color }}>HR Recommendation</div>
            <div className={styles.recTitle} style={{ color: RC.color }}>{rec}</div>
            <p className={styles.recText} style={{ color: RC.color }}>{REC_TEXT[recType]}</p>
            {weakDomains.length > 0 && recType !== "green" && (
              <div className={styles.recWeak} style={{ color: RC.color }}>
                <strong>Areas requiring follow-up:</strong>{" "}
                {weakDomains.map(d => DOMAIN_META[d]?.label).join(" · ")}
              </div>
            )}
          </div>
          <div className={styles.recScore}>
            <ScoreRing score={overall} color={RC.color} size={110} strokeWidth={9} />
          </div>
        </motion.div>

        {/* DOMAIN SCORES */}
        <motion.div {...stagger(1)}>
          <h3 className={styles.sectionTitle}>Competency Domain Scores</h3>
          <p className={styles.sectionSub}>Weighted scoring across 6 behavioral and technical competency domains</p>
        </motion.div>
        <div className={styles.domainGrid}>
          {Object.entries(DOMAIN_META).map(([key, { label, color, icon, weight }], i) => {
            const score = ds[key] || 0;
            const tier = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Developing" : "Needs Attention";
            const tc = score >= 80 ? "var(--green)" : score >= 65 ? "var(--teal)" : score >= 50 ? "var(--amber)" : "var(--red)";
            return (
              <motion.div key={key} className={styles.domainCard} {...stagger(i + 2)}>
                <div className={styles.domainHeader}>
                  <div>
                    <div className={styles.domainIcon}>{icon}</div>
                    <div className={styles.domainLabel}>{label}</div>
                    <div className={styles.domainWeight}>Weight: {Math.round(weight * 100)}%</div>
                  </div>
                  <div className={styles.domainScore} style={{ color }}><AnimatedNumber value={score} /></div>
                </div>
                <ProgressBar pct={score} color={color} height={9} />
                <div className={styles.domainFooter}>
                  <span className={styles.domainTier} style={{ color: tc }}>{tier}</span>
                  <span className={styles.domainOut}>{score}/100</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* DISC PROFILE */}
        <motion.div {...stagger(8)}>
          <h3 className={styles.sectionTitle}>DISC Behavioral Profile</h3>
          <p className={styles.sectionSub}>Reveals natural communication style, decision-making tendencies, and team dynamics fit</p>
        </motion.div>
        <motion.div className={styles.discWrapper} {...stagger(9)}>
          <div className={styles.discGrid}>
            {Object.entries(DISC_PROFILES).map(([key, info]) => (
              <div key={key} className={`${styles.discCard} ${primaryDisc === key ? styles.discPrimary : ''}`}
                style={{ borderColor: primaryDisc === key ? info.color : undefined }}>
                <div className={styles.discLetter} style={{ color: info.color }}>{key}</div>
                <div className={styles.discName}>{info.label}</div>
                <div className={styles.discTagline}>{info.tagline}</div>
                <ProgressBar pct={discPct[key]} color={info.color} height={8} />
                <div className={styles.discPct} style={{ color: info.color }}>{discPct[key]}%</div>
                {primaryDisc === key && <div className={styles.discPrimaryBadge} style={{ color: info.color, background: `${info.color}18` }}>PRIMARY</div>}
              </div>
            ))}
          </div>
          <div className={styles.discDetail} style={{ background: discInfo.bg, borderColor: `${discInfo.color}30` }}>
            <div className={styles.discDetailTitle} style={{ color: discInfo.color }}>
              Primary Type: {discInfo.label} ({primaryDisc}) — {discInfo.tagline}
            </div>
            <p className={styles.discDetailDesc}>{discInfo.desc}</p>
            <div className={styles.discColumns}>
              <div>
                <div className={styles.strengthsTitle}>Core Strengths</div>
                {discInfo.strengths.map((s, i) => (
                  <div key={i} className={styles.strengthItem}><span className={styles.checkIcon}>✓</span> {s}</div>
                ))}
              </div>
              <div>
                <div className={styles.watchTitle}>Watch For</div>
                {discInfo.watch.map((s, i) => (
                  <div key={i} className={styles.watchItem}><span className={styles.boltIcon}>⚡</span> {s}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* MBTI */}
        <motion.div {...stagger(10)}>
          <h3 className={styles.sectionTitle}>MBTI-Inspired Personality Type</h3>
          <p className={styles.sectionSub}>Cognitive style, decision-making preferences, and environmental fit</p>
        </motion.div>
        <motion.div className={styles.mbtiWrapper} {...stagger(11)}>
          <div className={styles.mbtiTop}>
            <div className={styles.mbtiTypeBox}>
              <div className={styles.mbtiType}>{mbtiType}</div>
              <div className={styles.mbtiTypeLabel}>TYPE</div>
            </div>
            <div className={styles.mbtiDesc}>
              <div className={styles.mbtiArchetype}>{mbtiDesc.split(" — ")[0]}</div>
              <p className={styles.mbtiText}>{mbtiDesc.split(" — ")[1] || mbtiDesc}</p>
            </div>
          </div>
          <div className={styles.mbtiDimensions}>
            {[
              { dim: "E/I", val: mbtiType[0], full: mbtiType[0] === "E" ? "Extroversion" : "Introversion", opp: mbtiType[0] === "E" ? "I" : "E" },
              { dim: "S/N", val: mbtiType[1], full: mbtiType[1] === "S" ? "Sensing" : "Intuition", opp: mbtiType[1] === "S" ? "N" : "S" },
              { dim: "T/F", val: mbtiType[2], full: mbtiType[2] === "T" ? "Thinking" : "Feeling", opp: mbtiType[2] === "T" ? "F" : "T" },
              { dim: "J/P", val: mbtiType[3], full: mbtiType[3] === "J" ? "Judging" : "Perceiving", opp: mbtiType[3] === "J" ? "P" : "J" },
            ].map(({ dim, val, full, opp }) => (
              <div key={dim} className={styles.mbtiDim}>
                <div className={styles.mbtiDimLabel}>{dim}</div>
                <div className={styles.mbtiDimVal}>{val}</div>
                <div className={styles.mbtiDimFull}>{full}</div>
                <div className={styles.mbtiDimOpp}>(vs. {opp})</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BIG FIVE */}
        <motion.div {...stagger(12)}>
          <h3 className={styles.sectionTitle}>Big Five (OCEAN) Model</h3>
          <p className={styles.sectionSub}>The gold-standard personality taxonomy used in validated organizational psychology research</p>
        </motion.div>
        <motion.div className={styles.bigFiveWrapper} {...stagger(13)}>
          {Object.entries(bigFive).map(([trait, score]) => {
            const color = BF_COLORS[trait];
            const tier = score >= 80 ? "High" : score >= 55 ? "Moderate" : "Low";
            return (
              <div key={trait} className={styles.bfRow}>
                <div className={styles.bfHeader}>
                  <span className={styles.bfIcon}>{BF_ICONS[trait]}</span>
                  <div className={styles.bfBarArea}>
                    <div className={styles.bfMeta}>
                      <span className={styles.bfTrait}>{trait}</span>
                      <span className={styles.bfScore} style={{ color }}>{score}/100 — {tier}</span>
                    </div>
                    <ProgressBar pct={score} color={color} height={10} />
                  </div>
                </div>
                <p className={styles.bfContext} style={{ borderColor: `${color}40` }}>{BF_CONTEXT[trait]}</p>
              </div>
            );
          })}
        </motion.div>

        {/* FOLLOW-UP QUESTIONS */}
        <motion.div {...stagger(14)}>
          <h3 className={styles.sectionTitle}>Recommended Follow-Up Interview Questions</h3>
          <p className={styles.sectionSub}>Targeted behavioral questions based on this candidate's assessment profile</p>
        </motion.div>
        <div className={styles.followUpGrid}>
          {Object.entries(FOLLOW_UP_Q).map(([domain, questions], i) => {
            const meta = DOMAIN_META[domain];
            const score = ds[domain] || 0;
            const isWeak = weakDomains.includes(domain);
            return (
              <motion.div key={domain} className={`${styles.followUpCard} ${isWeak ? styles.followUpWeak : ''}`}
                style={{ borderColor: isWeak ? `${meta.color}55` : undefined }}
                {...stagger(15 + i)}>
                <div className={styles.followUpHeader}>
                  <div className={styles.followUpMeta}>
                    <span>{meta.icon}</span>
                    <span className={styles.followUpLabel}>{meta.label}</span>
                    {isWeak && <span className={styles.priorityBadge}>PRIORITY</span>}
                  </div>
                  <div className={styles.followUpScore} style={{ color: meta.color }}>{score}</div>
                </div>
                <div className={styles.followUpQuestions}>
                  {questions.map((q, qi) => (
                    <div key={qi} className={styles.followUpQ} style={{ borderColor: meta.color }}>
                      <span className={styles.followUpQLabel} style={{ color: meta.color }}>Q{qi + 1}</span>
                      <span className={styles.followUpQText}>{q}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* HIRING FRAMEWORK */}
        <motion.div {...stagger(21)}>
          <h3 className={styles.sectionTitle}>Hiring Decision Framework</h3>
          <p className={styles.sectionSub}>Structured guidance for HR and hiring managers based on this assessment</p>
        </motion.div>
        <motion.div className={styles.frameworkWrapper} {...stagger(22)}>
          <div className={styles.frameworkGrid}>
            {[
              { label: "Strong Hire", color: "var(--green)", bg: "var(--green-bg)", threshold: "Overall ≥82 · Ethics ≥80 · Technical ≥75", action: "Advance to offer with standard 90-day onboarding plan and structured check-ins." },
              { label: "Proceed with Caution", color: "var(--amber)", bg: "var(--amber-bg)", threshold: "Overall 68–81 or any domain 50–64", action: "Schedule competency-specific behavioral interviews and obtain 3 professional references before offer." },
              { label: "Needs Further Review", color: "var(--purple)", bg: "var(--purple-bg)", threshold: "Overall <68 or 2+ domains below 50", action: "Conduct in-person practical assessment, peer panel interview, and thorough reference verification." },
              { label: "Do Not Recommend", color: "var(--red)", bg: "var(--red-bg)", threshold: "Ethics domain <55", action: "Ethics deficiencies are disqualifying without senior leadership review and formal ethics interview." },
            ].map(({ label, color, bg, threshold, action }) => (
              <div key={label} className={styles.frameworkCard} style={{ background: bg, borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}>
                <div className={styles.frameworkLabel} style={{ color }}>{label}</div>
                <div className={styles.frameworkThreshold}>{threshold}</div>
                <div className={styles.frameworkAction}>{action}</div>
              </div>
            ))}
          </div>
          <div className={styles.disclaimer}>
            <p>
              <strong>Important:</strong> This assessment is one data point in a comprehensive hiring process.
              It should always be used in conjunction with structured behavioral interviews, credential verification,
              OIG exclusion screening, reference checks, and clinical competency demonstrations where applicable.
              No single assessment score should be the sole basis for a hiring decision.
              HHCC assessments are designed to supplement — never replace — skilled HR judgment.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Happier Homes Comfort Care · Comprehensive Candidate Assessment System<br />
            Grounded in Myers-Briggs (MBTI), DISC, Big Five (OCEAN), and Post-Acute Care Behavioral Frameworks<br />
            For internal HR use only · {new Date().getFullYear()} · <strong>Confidential</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
