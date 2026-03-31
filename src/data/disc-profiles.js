const NAVY = "#1B4F72";
const TEAL = "#148F77";
const RED = "#DC2626";
const AMBER = "#D97706";

export const DISC_PROFILES = {
  D: { label: "Dominant", tagline: "Direct · Decisive · Results-Driven", color: RED, bg: "#FEF2F2",
    desc: "Candidates with a primary D profile are direct, assertive, and goal-oriented. They thrive in fast-paced, high-accountability environments and make excellent decisions under pressure. In healthcare leadership, D profiles drive census growth, hold teams accountable, and execute strategic change. They may need coaching on patience, active listening, and building consensus before acting.",
    strengths: ["Decisive under pressure", "Goal and outcome orientation", "Drives accountability", "Leads organizational change"],
    watch: ["May bypass process in urgency", "Can be perceived as abrasive under stress", "Needs active listening development"] },
  I: { label: "Influential", tagline: "Enthusiastic · Relational · Inspiring", color: AMBER, bg: "#FFFBEB",
    desc: "Influential profiles excel at building relationships with patients, families, referral sources, and staff. They energize teams, communicate with warmth, and are natural champions of culture and mission. In hospice and home health, I profiles are exceptional patient liaisons, community educators, and marketing professionals. They may need structure for documentation discipline and follow-through.",
    strengths: ["Relationship development", "Referral source cultivation", "Team morale and culture", "Patient and family engagement"],
    watch: ["May de-prioritize detail-heavy documentation", "Needs accountability structure", "Can overcommit capacity"] },
  S: { label: "Steady", tagline: "Patient · Reliable · Deeply Empathetic", color: TEAL, bg: "#E8FAF5",
    desc: "Steady profiles are the backbone of high-performing hospice and home health teams. Patient, loyal, and deeply empathetic, they provide the emotional consistency that end-of-life care demands. S profiles build extraordinary trust with patients and families over time. They are highly reliable in IDT settings but may need intentional support when navigating rapid organizational change.",
    strengths: ["Patient and family trust", "Team stability and consistency", "Empathetic clinical presence", "Long-term commitment"],
    watch: ["Change-averse without support", "May avoid difficult conversations", "Needs clarity on expectations"] },
  C: { label: "Conscientious", tagline: "Analytical · Precise · Quality-Focused", color: NAVY, bg: "#EBF5FB",
    desc: "Conscientious profiles are invaluable in compliance-heavy, documentation-intensive healthcare environments. They hold high standards for accuracy, follow regulatory protocol meticulously, and approach clinical and operational challenges with systematic rigor. C profiles excel as billing specialists, compliance officers, QA nurses, and analytics leads. They may need support with decisiveness in ambiguous situations.",
    strengths: ["Clinical and billing accuracy", "Regulatory and compliance orientation", "Process design and quality improvement", "Evidence-based practice"],
    watch: ["May over-analyze before acting", "Can struggle in ambiguous rapid-change environments", "Needs connection to mission beyond data"] },
};

export const DISC_COLORS = { D: RED, I: AMBER, S: TEAL, C: NAVY };
