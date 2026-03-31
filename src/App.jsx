import { AssessmentProvider, useAssessmentContext } from './context/AssessmentContext.jsx';
import { WelcomeScreen } from './components/welcome/WelcomeScreen.jsx';
import { RoleSelection } from './components/role/RoleSelection.jsx';
import { QuestionPage } from './components/questions/QuestionPage.jsx';
import { ResultsDashboard } from './components/results/ResultsDashboard.jsx';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { phase } = useAssessmentContext();

  return (
    <AnimatePresence mode="wait">
      {phase === "welcome" && (
        <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <WelcomeScreen />
        </motion.div>
      )}
      {phase === "role" && (
        <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <RoleSelection />
        </motion.div>
      )}
      {phase === "questions" && (
        <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <QuestionPage />
        </motion.div>
      )}
      {phase === "results" && (
        <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <ResultsDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AssessmentProvider>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <AppContent />
    </AssessmentProvider>
  );
}
