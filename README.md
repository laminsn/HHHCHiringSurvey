# HHCC Hiring Assessment

Comprehensive candidate personality and competency assessment tool built for **Happier Homes Comfort Care** — a hospice and comfort care organization.

## Features

- **8 Healthcare Roles**: Director, RN, LPN, HR, Accounting, Marketing, Social Work, Admin
- **38–46 Tailored Questions**: 31 universal + 6–10 role-specific per assessment
- **Multi-Framework Assessment**: Myers-Briggs (MBTI), DISC, Big Five (OCEAN)
- **6 Competency Domains**: Ethics (25%), Technical (20%), Adaptability (15%), Tech Readiness (15%), Goals (13%), Communication (12%)
- **4-Tier Hiring Recommendation**: Strong Hire, Proceed with Caution, Needs Review, Do Not Recommend
- **Ethics Gatekeeper**: Ethics score below 55 triggers automatic Do Not Recommend
- **Follow-Up Interview Questions**: Targeted behavioral questions based on assessment results

## Tech Stack

- React 19 + Vite
- Framer Motion (page transitions, staggered animations)
- CSS Modules + CSS Custom Properties
- Vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Deployment

Deploys automatically to GitHub Pages on push to `main` via GitHub Actions.

## Architecture

```
src/
├── data/           # Question batteries, role definitions, framework profiles
├── engine/         # Scoring algorithm (pure functions, fully tested)
├── hooks/          # useAssessment state machine, useAnimatedValue
├── context/        # React context provider
├── components/
│   ├── ui/         # ProgressBar, Button, GlassCard, Badge, ScoreRing
│   ├── welcome/    # Landing screen with domain overview
│   ├── role/       # Role selection grid
│   ├── questions/  # Paginated question flow (Likert + Choice)
│   └── results/    # 7-section results dashboard
└── styles/         # Design tokens, global reset, animations
```

## Scoring Engine

The scoring engine (`src/engine/scoring.js`) is a pure function with zero side effects:

- **Domain Scores**: Average of (answer_value / 5) x 100 per domain
- **Big Five Derivation**: Computed from domain scores (not asked directly)
- **DISC**: Count-based percentage of behavioral style selections
- **MBTI**: 4-dimension type from cognitive preference selections
- **Overall Score**: Weighted average across all 6 domains

---

*For internal HR use only. Designed for post-acute care hiring excellence.*
