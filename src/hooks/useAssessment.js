import { useState, useMemo, useCallback } from 'react';
import { UNIVERSAL, ROLE_Q, ROLES } from '../data/index.js';
import { computeScores } from '../engine/scoring.js';

const PER_PAGE = 4;

export function useAssessment() {
  const [phase, setPhase] = useState("welcome");
  const [role, setRole] = useState(null);
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(0);

  const allQ = useMemo(() => {
    if (!role) return [];
    return [...UNIVERSAL, ...(ROLE_Q[role] || [])];
  }, [role]);

  const totalPages = Math.ceil(allQ.length / PER_PAGE);
  const pageQ = allQ.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const answered = Object.keys(answers).length;
  const progress = allQ.length ? answered / allQ.length : 0;
  const pageDone = pageQ.every(q => answers[q.id] !== undefined);
  const roleData = ROLES.find(r => r.id === role);

  const setAns = useCallback((id, data) => {
    setAnswers(prev => ({ ...prev, [id]: data }));
  }, []);

  const scores = useMemo(() => {
    if (phase !== "results") return null;
    return computeScores(answers, allQ);
  }, [phase, answers, allQ]);

  const goToWelcome = useCallback(() => {
    setPhase("welcome");
    setRole(null);
    setAnswers({});
    setPage(0);
  }, []);

  const goToRole = useCallback(() => setPhase("role"), []);

  const goToQuestions = useCallback(() => {
    setPhase("questions");
    setPage(0);
  }, []);

  const goToResults = useCallback(() => setPhase("results"), []);

  const nextPage = useCallback(() => {
    if (page < totalPages - 1) setPage(p => p + 1);
    else setPhase("results");
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 0) setPage(p => p - 1);
    else setPhase("role");
  }, [page]);

  return {
    phase, role, setRole, answers, page, setPage,
    allQ, totalPages, pageQ, answered, progress, pageDone, roleData, scores,
    setAns, goToWelcome, goToRole, goToQuestions, goToResults, nextPage, prevPage,
    PER_PAGE,
  };
}
