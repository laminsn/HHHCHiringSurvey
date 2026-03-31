import { createContext, useContext } from 'react';
import { useAssessment } from '../hooks/useAssessment.js';

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const assessment = useAssessment();
  return (
    <AssessmentContext.Provider value={assessment}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessmentContext must be used within AssessmentProvider");
  return ctx;
}
