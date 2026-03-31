import { DOMAIN_META } from '../data/index.js';

export function computeScores(answers, questions) {
  const domScores = { ethics: [], communication: [], goals: [], adaptability: [], tech: [], technical: [] };
  const disc = { D: 0, I: 0, S: 0, C: 0 };
  const mbti = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach(q => {
    const a = answers[q.id];
    if (!a) return;

    if (q.type === "disc" && a.disc) {
      disc[a.disc] = (disc[a.disc] || 0) + 1;
      return;
    }
    if (q.type === "mbti") {
      if (a.m && a.m !== "A") mbti[a.m] = (mbti[a.m] || 0) + 1;
      return;
    }
    if (a.v !== undefined && domScores[q.domain]) {
      domScores[q.domain].push((a.v / 5) * 100);
    }
  });

  const ds = {};
  Object.entries(domScores).forEach(([k, arr]) => {
    ds[k] = arr.length ? Math.min(100, Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)) : 0;
  });

  const dt = Object.values(disc).reduce((a, b) => a + b, 0);
  const discPct = dt > 0
    ? { D: Math.round((disc.D / dt) * 100), I: Math.round((disc.I / dt) * 100), S: Math.round((disc.S / dt) * 100), C: Math.round((disc.C / dt) * 100) }
    : { D: 25, I: 25, S: 25, C: 25 };

  const mbtiType = [
    mbti.E >= mbti.I ? "E" : "I",
    mbti.S >= mbti.N ? "S" : "N",
    mbti.T >= mbti.F ? "T" : "F",
    mbti.J >= mbti.P ? "J" : "P",
  ].join("");

  const bigFive = {
    Openness: Math.min(100, Math.round((ds.tech + ds.adaptability) / 2)),
    Conscientiousness: Math.min(100, Math.round(ds.ethics * 0.55 + ds.goals * 0.45)),
    Extraversion: Math.min(100, Math.round(ds.communication)),
    Agreeableness: Math.min(100, Math.round(ds.ethics * 0.4 + ds.goals * 0.6)),
    EmotionalStability: Math.min(100, Math.round(ds.adaptability)),
  };

  let overall = 0;
  let wTotal = 0;
  Object.entries(DOMAIN_META).forEach(([key, { weight }]) => {
    overall += (ds[key] || 0) * weight;
    wTotal += weight;
  });
  overall = Math.min(100, Math.round(overall / wTotal));

  let rec, recType;
  if (ds.ethics < 55) { rec = "Do Not Recommend"; recType = "red"; }
  else if (overall >= 82 && ds.ethics >= 80 && ds.technical >= 75) { rec = "Strong Hire"; recType = "green"; }
  else if (overall >= 68) { rec = "Proceed with Caution"; recType = "amber"; }
  else { rec = "Needs Further Review"; recType = "purple"; }

  const primaryDisc = Object.entries(discPct).sort((a, b) => b[1] - a[1])[0][0];
  const weakDomains = Object.entries(ds)
    .filter(([k]) => k !== "mbti")
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([k]) => k);

  return { ds, discPct, mbtiType, bigFive, overall, rec, recType, primaryDisc, weakDomains };
}
