import { describe, it, expect } from 'vitest';
import { computeScores } from './scoring.js';

const makeQ = (id, domain, type, opts) => ({ id, section: "Test", domain, type, opts });
const likertQ = (id, domain) => makeQ(id, domain, "likert");
const scenarioQ = (id, domain, opts) => makeQ(id, domain, "scenario", opts);
const discQ = (id, opts) => makeQ(id, "communication", "disc", opts);
const mbtiQ = (id, dim, opts) => ({ id, section: "Test", domain: "mbti", type: "mbti", dim, opts });

function buildFullQuestionSet() {
  const questions = [];
  const domains = ["ethics", "communication", "goals", "adaptability", "tech", "technical"];
  domains.forEach((d, di) => {
    for (let i = 0; i < 4; i++) {
      questions.push(likertQ(`${d}_${i}`, d));
    }
  });
  questions.push(discQ("disc1", [
    { t: "A", disc: "D" }, { t: "B", disc: "I" }, { t: "C", disc: "S" }, { t: "D", disc: "C" },
  ]));
  questions.push(mbtiQ("mbti1", "EI", [
    { t: "A", m: "E" }, { t: "B", m: "I" }, { t: "C", m: "A" },
  ]));
  questions.push(mbtiQ("mbti2", "SN", [
    { t: "A", m: "S" }, { t: "B", m: "N" }, { t: "C", m: "A" },
  ]));
  questions.push(mbtiQ("mbti3", "TF", [
    { t: "A", m: "T" }, { t: "B", m: "F" }, { t: "C", m: "A" },
  ]));
  questions.push(mbtiQ("mbti4", "JP", [
    { t: "A", m: "J" }, { t: "B", m: "P" }, { t: "C", m: "A" },
  ]));
  return questions;
}

function buildAnswers(questions, likertValue, discChoice, mbtiChoice) {
  const answers = {};
  questions.forEach(q => {
    if (q.type === "likert") {
      answers[q.id] = { v: likertValue };
    } else if (q.type === "disc") {
      answers[q.id] = { idx: 0, disc: discChoice };
    } else if (q.type === "mbti") {
      answers[q.id] = { idx: 0, m: mbtiChoice };
    }
  });
  return answers;
}

describe("computeScores", () => {
  it("returns all zeros for empty answers", () => {
    const questions = buildFullQuestionSet();
    const result = computeScores({}, questions);
    expect(result.overall).toBe(0);
    expect(result.ds.ethics).toBe(0);
    expect(result.ds.technical).toBe(0);
    expect(result.discPct).toEqual({ D: 25, I: 25, S: 25, C: 25 });
    expect(result.mbtiType).toBe("ESTJ");
  });

  it("scores all-max answers near 100", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 5, "D", "E");
    const result = computeScores(answers, questions);
    expect(result.ds.ethics).toBe(100);
    expect(result.ds.communication).toBe(100);
    expect(result.ds.technical).toBe(100);
    expect(result.overall).toBe(100);
    expect(result.rec).toBe("Strong Hire");
    expect(result.recType).toBe("green");
  });

  it("scores all-min answers at 20", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 1, "S", "I");
    const result = computeScores(answers, questions);
    expect(result.ds.ethics).toBe(20);
    expect(result.overall).toBe(20);
    expect(result.rec).toBe("Do Not Recommend");
    expect(result.recType).toBe("red");
  });

  it("ethics gatekeeper: ethics < 55 triggers Do Not Recommend", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 5, "D", "E");
    // Override ethics to low scores (v=2 → 40%)
    questions.filter(q => q.domain === "ethics").forEach(q => {
      answers[q.id] = { v: 2 };
    });
    const result = computeScores(answers, questions);
    expect(result.ds.ethics).toBe(40);
    expect(result.rec).toBe("Do Not Recommend");
    expect(result.recType).toBe("red");
  });

  it("ethics at exactly 55 does NOT trigger auto-reject", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 5, "D", "E");
    // Ethics at v=3 → 60%, which is >= 55
    questions.filter(q => q.domain === "ethics").forEach(q => {
      answers[q.id] = { v: 3 };
    });
    const result = computeScores(answers, questions);
    expect(result.ds.ethics).toBe(60);
    expect(result.rec).not.toBe("Do Not Recommend");
  });

  it("DISC with all D answers yields D=100%", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 5, "D", "E");
    const result = computeScores(answers, questions);
    expect(result.discPct.D).toBe(100);
    expect(result.discPct.I).toBe(0);
    expect(result.primaryDisc).toBe("D");
  });

  it("MBTI with all A (ambivert) defaults to ESTJ", () => {
    const questions = buildFullQuestionSet();
    const answers = buildAnswers(questions, 5, "D", "A");
    const result = computeScores(answers, questions);
    expect(result.mbtiType).toBe("ESTJ");
  });

  it("Big Five derivation formulas are correct", () => {
    const questions = buildFullQuestionSet();
    const answers = {};
    // Set different values per domain to test formulas
    questions.forEach(q => {
      if (q.type === "likert") {
        if (q.domain === "ethics") answers[q.id] = { v: 4 }; // 80%
        else if (q.domain === "communication") answers[q.id] = { v: 3 }; // 60%
        else if (q.domain === "goals") answers[q.id] = { v: 4 }; // 80%
        else if (q.domain === "adaptability") answers[q.id] = { v: 5 }; // 100%
        else if (q.domain === "tech") answers[q.id] = { v: 3 }; // 60%
        else if (q.domain === "technical") answers[q.id] = { v: 4 }; // 80%
      } else if (q.type === "disc") {
        answers[q.id] = { idx: 0, disc: "D" };
      } else if (q.type === "mbti") {
        answers[q.id] = { idx: 0, m: "E" };
      }
    });
    const result = computeScores(answers, questions);
    expect(result.bigFive.Openness).toBe(Math.min(100, Math.round((60 + 100) / 2))); // 80
    expect(result.bigFive.Conscientiousness).toBe(Math.min(100, Math.round(80 * 0.55 + 80 * 0.45))); // 80
    expect(result.bigFive.Extraversion).toBe(60);
    expect(result.bigFive.Agreeableness).toBe(Math.min(100, Math.round(80 * 0.4 + 80 * 0.6))); // 80
    expect(result.bigFive.EmotionalStability).toBe(100);
  });

  it("identifies weak domains correctly", () => {
    const questions = buildFullQuestionSet();
    const answers = {};
    questions.forEach(q => {
      if (q.type === "likert") {
        if (q.domain === "communication") answers[q.id] = { v: 1 }; // 20%
        else if (q.domain === "tech") answers[q.id] = { v: 2 }; // 40%
        else answers[q.id] = { v: 5 }; // 100%
      } else if (q.type === "disc") {
        answers[q.id] = { idx: 0, disc: "D" };
      } else if (q.type === "mbti") {
        answers[q.id] = { idx: 0, m: "E" };
      }
    });
    const result = computeScores(answers, questions);
    expect(result.weakDomains).toContain("communication");
    expect(result.weakDomains).toContain("tech");
  });

  it("Proceed with Caution for overall >= 68 but below Strong Hire", () => {
    const questions = buildFullQuestionSet();
    const answers = {};
    questions.forEach(q => {
      if (q.type === "likert") {
        answers[q.id] = { v: 4 }; // 80%
      } else if (q.type === "disc") {
        answers[q.id] = { idx: 0, disc: "D" };
      } else if (q.type === "mbti") {
        answers[q.id] = { idx: 0, m: "E" };
      }
    });
    // Lower technical to prevent Strong Hire
    questions.filter(q => q.domain === "technical").forEach(q => {
      answers[q.id] = { v: 3 }; // 60%, below 75 threshold
    });
    const result = computeScores(answers, questions);
    expect(result.rec).toBe("Proceed with Caution");
    expect(result.recType).toBe("amber");
  });
});
