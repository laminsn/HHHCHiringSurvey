import { useAssessmentContext } from '../../context/AssessmentContext.jsx';
import { LikertQuestion } from './LikertQuestion.jsx';
import { ChoiceQuestion } from './ChoiceQuestion.jsx';

export function QuestionCard({ q, idx }) {
  const { answers, setAns } = useAssessmentContext();
  const ans = answers[q.id];

  if (q.type === "likert") {
    return <LikertQuestion q={q} ans={ans} onAns={d => setAns(q.id, d)} idx={idx} />;
  }
  return <ChoiceQuestion q={q} ans={ans} onAns={d => setAns(q.id, d)} idx={idx} />;
}
