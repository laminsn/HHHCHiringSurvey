import { useState, useMemo } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const NAVY="#1B4F72", NAVY_D="#154360", TEAL="#148F77", TEAL_L="#1ABC9C";
const GOLD="#F0B429", WHITE="#FFFFFF", BG="#F0F4F8";
const TEXT="#1E293B", TEXT_M="#475569", TEXT_L="#94A3B8", BORDER="#E2E8F0";
const RED="#DC2626", RED_BG="#FEF2F2";
const GREEN="#059669", GREEN_BG="#ECFDF5";
const AMBER="#D97706", AMBER_BG="#FFFBEB";
const PURPLE="#7C3AED", PURPLE_BG="#F5F3FF";
const BLUE="#2563EB";

// ── Role catalogue ────────────────────────────────────────────
const ROLES = [
  { id:"director",  icon:"🏛",  label:"Director / Executive",        sub:"DON · Medical Director · Administrator · Executive Director" },
  { id:"rn",        icon:"💙",  label:"Registered Nurse (RN)",        sub:"Staff RN · Case Manager · Charge Nurse" },
  { id:"lpn",       icon:"🩺",  label:"Licensed Practical Nurse (LPN)", sub:"LPN · LVN · Visiting Nurse" },
  { id:"hr",        icon:"👥",  label:"Human Resources",              sub:"HR Generalist · HR Manager · Recruiter · Payroll" },
  { id:"accounting",icon:"📊",  label:"Accounting & Finance",         sub:"Billing Specialist · Finance Manager · AR/AP" },
  { id:"marketing", icon:"📣",  label:"Marketing & Business Dev.",    sub:"Liaison · Marketing Coordinator · BD Manager" },
  { id:"social",    icon:"🤝",  label:"Social Work & Chaplaincy",     sub:"LCSW · MSW · Chaplain · Bereavement Coordinator" },
  { id:"admin",     icon:"🗂",  label:"Administrative Support",       sub:"Scheduler · Receptionist · Office Coordinator" },
];

// ── Universal question battery (all roles) ────────────────────
const UNIVERSAL = [
  // ETHICS / MORALS ───────────────────────────────────────────
  { id:"e1", section:"Moral Compass & Ethics", domain:"ethics", type:"scenario",
    text:"You witness a colleague make a documentation error that could negatively impact a patient's care plan. You:",
    opts:[
      {t:"Report it to a supervisor immediately without first speaking to the colleague.", v:3},
      {t:"Speak privately with the colleague first; escalate if unresolved.", v:5},
      {t:"Wait to see if the colleague self-corrects before acting.", v:1},
      {t:"Document your observation in the chart and notify the care team.", v:4},
    ]},
  { id:"e2", section:"Moral Compass & Ethics", domain:"ethics", type:"scenario",
    text:"A patient's family member offers you a $100 gift card as a heartfelt thank-you. You:",
    opts:[
      {t:"Accept — it's a sincere token of appreciation.", v:1},
      {t:"Politely decline and reference your organization's gift policy.", v:5},
      {t:"Accept since it seems harmless and you don't want to cause discomfort.", v:2},
      {t:"Decline and report the offer to your supervisor per policy.", v:5},
    ]},
  { id:"e3", section:"Moral Compass & Ethics", domain:"ethics", type:"likert",
    text:"I follow organizational policy and procedure even when I personally disagree, unless it violates ethical or legal standards." },
  { id:"e4", section:"Moral Compass & Ethics", domain:"ethics", type:"likert",
    text:"I prioritize doing what is ethically correct over what is socially convenient or popular among my peers." },
  { id:"e5", section:"Moral Compass & Ethics", domain:"ethics", type:"scenario",
    text:"You discover a billing discrepancy that financially benefits your organization but may not serve a patient's interest. You:",
    opts:[
      {t:"Report immediately to your compliance officer with full documentation.", v:5},
      {t:"Research the issue thoroughly yourself before escalating.", v:4},
      {t:"Discuss with a trusted colleague to validate your concern first.", v:3},
      {t:"Wait to see if internal audit surfaces it in a routine review.", v:1},
    ]},
  { id:"e6", section:"Moral Compass & Ethics", domain:"ethics", type:"likert",
    text:"Maintaining patient confidentiality is absolute for me — even in casual conversations outside of work." },

  // COMMUNICATION ─────────────────────────────────────────────
  { id:"c1", section:"Communication Style", domain:"communication", type:"disc",
    text:"In team meetings, your most natural tendency is to:",
    opts:[
      {t:"Drive the conversation toward decisions and measurable outcomes.", disc:"D"},
      {t:"Energize the group with enthusiasm, ideas, and inclusive engagement.", disc:"I"},
      {t:"Listen carefully and contribute thoughtfully when the time is right.", disc:"S"},
      {t:"Bring data, structured analysis, and probing questions to the discussion.", disc:"C"},
    ]},
  { id:"c2", section:"Communication Style", domain:"communication", type:"disc",
    text:"When you receive critical feedback on your work, your typical response is:",
    opts:[
      {t:"Challenge it directly if I believe my approach was sound.", disc:"D"},
      {t:"Take it in stride — feedback is part of growth.", disc:"I"},
      {t:"Internalize it thoughtfully and genuinely work to address the concern.", disc:"S"},
      {t:"Analyze it objectively, ask clarifying questions, and evaluate on its merits.", disc:"C"},
    ]},
  { id:"c3", section:"Communication Style", domain:"communication", type:"likert",
    text:"I actively adapt my communication style depending on my audience — patient, family, physician, or executive." },
  { id:"c4", section:"Communication Style", domain:"communication", type:"likert",
    text:"I am confident and effective presenting information verbally to groups of 10 or more people." },
  { id:"c5", section:"Communication Style", domain:"communication", type:"likert",
    text:"When workplace conflicts arise, I prefer to address them directly and in person rather than avoid them or defer to email." },
  { id:"c6", section:"Communication Style", domain:"communication", type:"disc",
    text:"When communicating urgent, time-sensitive information to a colleague, you prefer to:",
    opts:[
      {t:"Call or speak face-to-face immediately to ensure prompt action.", disc:"D"},
      {t:"Send a quick message and follow up conversationally to confirm understanding.", disc:"I"},
      {t:"Use the channel the colleague prefers to respect their style.", disc:"S"},
      {t:"Put it in writing first for accountability, then verify receipt verbally.", disc:"C"},
    ]},

  // PROFESSIONAL GOALS ────────────────────────────────────────
  { id:"g1", section:"Professional Goals & Motivation", domain:"goals", type:"choice",
    text:"Five years from now, you most strongly see yourself:",
    opts:[
      {t:"In the same core role — having achieved mastery and deep clinical expertise.", v:3},
      {t:"In a leadership, management, or director-level position.", v:5},
      {t:"Operating my own practice, agency, or entrepreneurial venture.", v:4},
      {t:"In whatever role allows me the greatest impact on patients and communities.", v:4},
    ]},
  { id:"g2", section:"Professional Goals & Motivation", domain:"goals", type:"likert",
    text:"I actively pursue continuing education, certifications, and professional development beyond what my role requires." },
  { id:"g3", section:"Professional Goals & Motivation", domain:"goals", type:"likert",
    text:"I willingly take on responsibilities outside my formal job description when it serves the team or organization's mission." },
  { id:"g4", section:"Professional Goals & Motivation", domain:"goals", type:"choice",
    text:"Your single strongest motivation for working in healthcare is:",
    opts:[
      {t:"A deep, intrinsic passion for caring for people and serving those in need.", v:5},
      {t:"Career stability, professional growth trajectory, and competitive compensation.", v:3},
      {t:"The intellectual complexity and ever-evolving challenge of the field.", v:4},
      {t:"A personal or family healthcare experience that sparked a lasting sense of purpose.", v:5},
    ]},
  { id:"g5", section:"Professional Goals & Motivation", domain:"goals", type:"likert",
    text:"I actively seek feedback from supervisors and peers as a mechanism for continuous improvement." },

  // ADAPTABILITY ──────────────────────────────────────────────
  { id:"a1", section:"Adaptability & Resilience", domain:"adaptability", type:"choice",
    text:"When your organization implements a major unexpected process change, your natural response is to:",
    opts:[
      {t:"Adapt quickly and proactively help colleagues navigate the transition.", v:5},
      {t:"Take a few days to recalibrate, then fully engage with the change.", v:3},
      {t:"Find frequent or abrupt change draining — I strongly prefer stability.", v:1},
      {t:"Constructively question the rationale but comply and give it a fair trial.", v:3},
    ]},
  { id:"a2", section:"Adaptability & Resilience", domain:"adaptability", type:"likert",
    text:"I consistently perform at a high level even under pressure, competing priorities, or uncertain conditions." },
  { id:"a3", section:"Adaptability & Resilience", domain:"adaptability", type:"likert",
    text:"I genuinely view professional setbacks and failures as valuable learning experiences, not defeats." },
  { id:"a4", section:"Adaptability & Resilience", domain:"adaptability", type:"likert",
    text:"I have meaningfully changed a long-held professional belief or clinical practice based on new evidence or updated training." },
  { id:"a5", section:"Adaptability & Resilience", domain:"adaptability", type:"likert",
    text:"I am comfortable and effective working in ambiguous situations where roles, expectations, or processes are not fully defined." },
  { id:"a6", section:"Adaptability & Resilience", domain:"adaptability", type:"scenario",
    text:"Your team's workflow is disrupted by an unexpected staff shortage mid-week. Your immediate response:",
    opts:[
      {t:"Take charge, assess coverage gaps, and build an immediate contingency plan.", v:5},
      {t:"Bring the team together to collaboratively redistribute responsibilities.", v:4},
      {t:"Notify leadership and await direction before acting independently.", v:3},
      {t:"Focus on managing your own caseload as effectively as possible.", v:2},
    ]},

  // TECH / AI READINESS ───────────────────────────────────────
  { id:"t1", section:"Technology & AI Readiness", domain:"tech", type:"choice",
    text:"Your current competency level with healthcare software (EHR/EMR, scheduling, billing platforms) is:",
    opts:[
      {t:"Expert — I have trained or supported others in using these systems.", v:5},
      {t:"Proficient — I navigate and utilize these systems independently with confidence.", v:4},
      {t:"Intermediate — I manage effectively with occasional support or reference.", v:3},
      {t:"Beginner — I would require substantial onboarding and technology training.", v:1},
    ]},
  { id:"t2", section:"Technology & AI Readiness", domain:"tech", type:"choice",
    text:"Your current awareness and hands-on use of AI tools in a professional healthcare context is:",
    opts:[
      {t:"Advanced — I actively use AI tools in my current or most recent work environment.", v:5},
      {t:"Moderate — I have explored AI tools and understand their practical applications.", v:4},
      {t:"Basic — I am aware they exist but have not used them professionally.", v:2},
      {t:"Minimal — AI tools in healthcare are largely new territory for me.", v:1},
    ]},
  { id:"t3", section:"Technology & AI Readiness", domain:"tech", type:"likert",
    text:"I am genuinely excited about AI's potential to improve patient outcomes, reduce documentation burden, and combat clinician burnout." },
  { id:"t4", section:"Technology & AI Readiness", domain:"tech", type:"likert",
    text:"I would be comfortable using AI-generated clinical or administrative documentation drafts that I review, verify, and approve." },
  { id:"t5", section:"Technology & AI Readiness", domain:"tech", type:"likert",
    text:"Learning and mastering new technology systems is something I genuinely embrace and find intellectually engaging." },
  { id:"t6", section:"Technology & AI Readiness", domain:"tech", type:"choice",
    text:"When a new software system is introduced at your organization, you typically:",
    opts:[
      {t:"Volunteer as a super-user, trainer, or implementation lead.", v:5},
      {t:"Learn it independently using tutorials, documentation, and available resources.", v:4},
      {t:"Attend required training sessions and ask questions as they arise naturally.", v:3},
      {t:"Prefer hands-on, step-by-step guidance from a trainer throughout the process.", v:2},
    ]},
  { id:"t7", section:"Technology & AI Readiness", domain:"tech", type:"likert",
    text:"I understand that AI tools in healthcare require human oversight, and I am prepared to serve as that critical oversight layer." },

  // MBTI-INSPIRED ─────────────────────────────────────────────
  { id:"m1", section:"Personality Profile (MBTI-Inspired)", domain:"mbti", type:"mbti", dim:"EI",
    text:"After a particularly demanding workday, you most naturally recharge by:",
    opts:[
      {t:"Socializing with friends, family, or colleagues — connection energizes me.", m:"E"},
      {t:"Enjoying quiet, uninterrupted personal time — solitude restores me.", m:"I"},
      {t:"A blend of both, depending on my energy and what the day required.", m:"A"},
    ]},
  { id:"m2", section:"Personality Profile (MBTI-Inspired)", domain:"mbti", type:"mbti", dim:"SN",
    text:"When approaching a clinical or operational problem, you naturally prefer to:",
    opts:[
      {t:"Follow established protocols and proven, tested methods I trust.", m:"S"},
      {t:"Explore innovative approaches, question assumptions, and generate new solutions.", m:"N"},
      {t:"Review what has worked historically and thoughtfully adapt it to the situation.", m:"A"},
    ]},
  { id:"m3", section:"Personality Profile (MBTI-Inspired)", domain:"mbti", type:"mbti", dim:"TF",
    text:"When making a difficult decision involving staff, patients, or families, you rely more on:",
    opts:[
      {t:"Objective data, consistent logic, and established standards applied fairly.", m:"T"},
      {t:"The human impact — the relationships, feelings, and wellbeing of those involved.", m:"F"},
      {t:"A deliberate integration of both objective analysis and human impact.", m:"A"},
    ]},
  { id:"m4", section:"Personality Profile (MBTI-Inspired)", domain:"mbti", type:"mbti", dim:"JP",
    text:"Your ideal work environment is best described as:",
    opts:[
      {t:"Structured with clear plans, defined schedules, and predictable workflows.", m:"J"},
      {t:"Flexible and responsive — I thrive when adapting to what the day brings.", m:"P"},
      {t:"A thoughtful balance of structure with room for responsive pivots.", m:"A"},
    ]},
];

// ── Role-specific question batteries ─────────────────────────
const ROLE_Q = {
  director: [
    { id:"dr1", section:"Leadership & Executive Competency", domain:"technical", type:"disc",
      text:"As a leader, your predominant management style is:",
      opts:[
        {t:"Results-Driven: I set ambitious expectations and hold people accountable to outcomes.", disc:"D"},
        {t:"Collaborative: I build consensus, inspire ownership, and bring the team along.", disc:"I"},
        {t:"Supportive: I invest deeply in team morale, wellbeing, and psychological safety.", disc:"S"},
        {t:"Analytical: I focus on data, process fidelity, and systematic quality improvement.", disc:"C"},
      ]},
    { id:"dr2", section:"Leadership & Executive Competency", domain:"technical", type:"scenario",
      text:"A direct report is consistently underperforming after 90 days in role. Your initial response:",
      opts:[
        {t:"Initiate a formal performance improvement plan (PIP) and document all interactions.", v:3},
        {t:"Have a candid, private conversation to understand underlying root causes first.", v:5},
        {t:"Continue monitoring for 2–3 more weeks before taking any formal action.", v:2},
        {t:"Involve HR from the very first performance-related conversation.", v:4},
      ]},
    { id:"dr3", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I am fully prepared to make and stand behind unpopular decisions when they serve the organization's mission and patient welfare." },
    { id:"dr4", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I proactively invest in the professional development and mentorship of my direct reports." },
    { id:"dr5", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I have direct experience with CMS Conditions of Participation (CoPs) or state licensure compliance in a hospice or post-acute care setting." },
    { id:"dr6", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I have successfully managed an operating budget of $500,000 or greater." },
    { id:"dr7", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I am confident leading, preparing for, or navigating a regulatory survey (ACHC, CHAP, Joint Commission, or state health department)." },
    { id:"dr8", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I routinely analyze operational and clinical performance data to identify actionable improvement opportunities." },
    { id:"dr9", section:"Leadership & Executive Competency", domain:"technical", type:"scenario",
      text:"Your agency's census has dropped 18% over 60 days. As Director, your most critical immediate priority is:",
      opts:[
        {t:"Deep-dive analysis of referral source data to identify pipeline gaps.", v:5},
        {t:"Convene an emergency leadership meeting to build a strategic recovery plan.", v:4},
        {t:"Review clinical quality metrics and QAPI data for systemic care issues.", v:4},
        {t:"Immediately activate marketing and liaison team with a targeted outreach campaign.", v:5},
      ]},
    { id:"dr10", section:"Leadership & Executive Competency", domain:"technical", type:"likert",
      text:"I have direct experience developing, revising, or implementing organizational policies, procedures, or quality improvement initiatives." },
  ],

  rn: [
    { id:"rn1", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I am confident and competent conducting comprehensive patient assessments independently in home or community-based settings." },
    { id:"rn2", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I actively and meaningfully contribute to interdisciplinary care planning conferences." },
    { id:"rn3", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I have hands-on experience with OASIS documentation, hospice-specific clinical tools, or CMS Electronic Visit Verification (EVV)." },
    { id:"rn4", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I am comfortable managing 10 or more complex, high-acuity patient cases simultaneously." },
    { id:"rn5", section:"Clinical Competency — RN", domain:"technical", type:"scenario",
      text:"During a home visit, a hospice patient deteriorates rapidly. The caregiver is distressed. Your immediate response:",
      opts:[
        {t:"Complete a rapid assessment, notify the attending physician, comfort the family, and document thoroughly.", v:5},
        {t:"Call your supervisor for guidance before taking any independent clinical action.", v:2},
        {t:"Stabilize and comfort the patient and family first, then notify the physician promptly.", v:4},
        {t:"Execute the existing care plan protocol precisely and escalate per standing physician orders.", v:4},
      ]},
    { id:"rn6", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I am clinically and emotionally prepared to lead direct conversations with patients and families about end-of-life care goals and advance directives." },
    { id:"rn7", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I regularly review and apply evidence-based clinical practice guidelines in my patient care decision-making." },
    { id:"rn8", section:"Clinical Competency — RN", domain:"technical", type:"likert",
      text:"I am proficient in hospice or palliative pain management and symptom control protocols for complex patient presentations." },
  ],

  lpn: [
    { id:"lp1", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I am confident administering medications, completing skilled procedures, and documenting accurately within my state-defined scope of practice." },
    { id:"lp2", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I have a clear, thorough understanding of LPN scope of practice and consistently recognize when escalation to an RN or physician is required." },
    { id:"lp3", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I am confident providing skilled nursing care independently in a patient's home, including navigating complex safety or family dynamics." },
    { id:"lp4", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I have hands-on experience with wound care, catheter care, ostomy care, and other advanced skilled nursing procedures." },
    { id:"lp5", section:"Clinical Competency — LPN", domain:"technical", type:"scenario",
      text:"A hospice patient tells you their pain is 9/10 and their current medication isn't providing relief. Your response:",
      opts:[
        {t:"Document the pain score and immediately notify the supervising RN and attending physician.", v:5},
        {t:"Implement non-pharmacological comfort measures and reassess in 60 minutes before escalating.", v:2},
        {t:"Check the care plan for PRN orders, administer if applicable, then notify the supervising RN.", v:5},
        {t:"Contact the family to explore additional comfort measures while awaiting physician guidance.", v:1},
      ]},
    { id:"lp6", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I proactively communicate all significant patient changes and observations to my supervising nurse and the interdisciplinary care team." },
    { id:"lp7", section:"Clinical Competency — LPN", domain:"technical", type:"likert",
      text:"I am skilled at providing emotional support to patients and families during home visits — not just clinical care." },
  ],

  hr: [
    { id:"hr1", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I am comprehensively knowledgeable in FLSA, ADA, FMLA, Title VII, and HIPAA as they apply to healthcare workforce management." },
    { id:"hr2", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I am confident designing and conducting structured behavioral interviews using the STAR method." },
    { id:"hr3", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I have hands-on experience with HRIS platforms such as ADP, Paylocity, BambooHR, Rippling, or equivalent systems." },
    { id:"hr4", section:"HR Competency — Healthcare", domain:"technical", type:"scenario",
      text:"An employee files a formal complaint alleging discriminatory treatment by their direct supervisor. Your immediate first step:",
      opts:[
        {t:"Open a formal, documented investigation immediately following established HR protocol.", v:5},
        {t:"Hold informal, separate conversations with both parties to gather initial context.", v:3},
        {t:"Escalate directly to your employment attorney or legal counsel immediately.", v:3},
        {t:"Follow your organization's written grievance policy precisely from the first interaction.", v:5},
      ]},
    { id:"hr5", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I have substantial experience developing and delivering staff training, onboarding programs, or LMS-based learning content." },
    { id:"hr6", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I understand healthcare-specific hiring compliance: OIG exclusion checks, background screening, license verification, and TB/vaccination requirements." },
    { id:"hr7", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I manage sensitive employee relations matters with consistent discretion, emotional intelligence, and procedural rigor." },
    { id:"hr8", section:"HR Competency — Healthcare", domain:"technical", type:"likert",
      text:"I have direct experience designing or significantly improving employee retention strategies in a healthcare or high-turnover environment." },
  ],

  accounting: [
    { id:"ac1", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I am proficient in healthcare billing and coding frameworks, including ICD-10, CPT, HCPCS, and their clinical documentation requirements." },
    { id:"ac2", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I have direct experience preparing or supporting Medicare and/or Medicaid cost reports." },
    { id:"ac3", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I have hands-on experience managing accounts receivable in a hospice, home health, or post-acute care setting." },
    { id:"ac4", section:"Finance & Billing Competency", domain:"technical", type:"scenario",
      text:"You identify a recurring billing pattern that appears to involve systemic overcoding of high-acuity diagnoses. You:",
      opts:[
        {t:"Compile documented evidence and escalate immediately to the compliance officer.", v:5},
        {t:"Conduct additional research to fully confirm the pattern before escalating.", v:4},
        {t:"Raise the concern with your direct supervisor to determine the escalation path.", v:3},
        {t:"Wait for the next internal audit cycle to see if the issue surfaces independently.", v:1},
      ]},
    { id:"ac5", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I am proficient with healthcare revenue cycle software such as MatrixCare, WellSky, Axxess, PointClickCare, or Homecare Homebase." },
    { id:"ac6", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I have a working knowledge of the False Claims Act and its direct implications for healthcare billing practices and compliance." },
    { id:"ac7", section:"Finance & Billing Competency", domain:"technical", type:"likert",
      text:"I am confident generating financial reports and presenting data-driven findings to non-financial organizational leadership." },
  ],

  marketing: [
    { id:"mk1", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I have direct experience developing and executing healthcare marketing strategies targeting physicians, hospital discharge teams, or SNF social workers." },
    { id:"mk2", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I am proficient with CRM platforms — Salesforce, GoHighLevel, HubSpot, or equivalent — for tracking referral pipelines and BD metrics." },
    { id:"mk3", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I have a working understanding of the Anti-Kickback Statute and Stark Law as they apply to healthcare marketing and referral relationships." },
    { id:"mk4", section:"Marketing & Business Dev. Competency", domain:"technical", type:"scenario",
      text:"A hospital discharge planner says she refers to your competitor because they bring her team lunch more often. You:",
      opts:[
        {t:"Offer comparable hospitality within your organization's policy and compliance guidelines.", v:3},
        {t:"Redirect the conversation to clinical outcomes, patient experience, and agency differentiators.", v:5},
        {t:"Ask thoughtful questions to uncover other referral drivers beyond hospitality.", v:5},
        {t:"Present unique value-add services and capabilities your agency offers that competitors can't match.", v:4},
      ]},
    { id:"mk5", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I am confident and skilled producing content for LinkedIn, email campaigns, community education events, and digital platforms." },
    { id:"mk6", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I have hands-on experience using AI-powered marketing tools for content creation, lead generation, analytics, or campaign personalization." },
    { id:"mk7", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I understand key hospice and home health operational metrics — referral conversion rate, average LOS, payer mix — and how marketing drives them." },
    { id:"mk8", section:"Marketing & Business Dev. Competency", domain:"technical", type:"likert",
      text:"I have experience building community education programs, speaker series, or CEU events as part of a referral development strategy." },
  ],

  social: [
    { id:"sw1", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"likert",
      text:"I have direct experience conducting psychosocial assessments in a hospice, palliative care, or home health setting." },
    { id:"sw2", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"likert",
      text:"I am clinically and emotionally prepared to facilitate difficult conversations about end-of-life care goals, advance directives, and legacy planning." },
    { id:"sw3", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"scenario",
      text:"During a home visit, the primary family caregiver breaks down and says they cannot continue providing care. You:",
      opts:[
        {t:"Practice active listening, validate their experience, and collaboratively explore respite and community resources.", v:5},
        {t:"Notify the IDT immediately and request an urgent emergency care plan review.", v:4},
        {t:"Document the caregiver distress and request an urgent social work reassessment.", v:3},
        {t:"Provide crisis counseling and connect them with community bereavement and caregiver support resources.", v:4},
      ]},
    { id:"sw4", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"likert",
      text:"I am formally trained in grief counseling methodologies and bereavement follow-up protocols in a clinical setting." },
    { id:"sw5", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"likert",
      text:"I am skilled in serving a faith-diverse patient population with genuine cultural humility and spiritual sensitivity." },
    { id:"sw6", section:"Social Work & Chaplaincy Competency", domain:"technical", type:"likert",
      text:"I contribute meaningfully and proactively to the IDT in developing and updating comprehensive care plans." },
  ],

  admin: [
    { id:"ad1", section:"Administrative Competency", domain:"technical", type:"likert",
      text:"I am proficient with scheduling platforms, calendar management tools, and organizational workflow software." },
    { id:"ad2", section:"Administrative Competency", domain:"technical", type:"likert",
      text:"I am comfortable managing high call volume and serving as the professional first point of contact for patients, families, referral sources, and staff." },
    { id:"ad3", section:"Administrative Competency", domain:"technical", type:"scenario",
      text:"A visibly distressed family member calls demanding to speak immediately with the Director during a busy intake period. You:",
      opts:[
        {t:"Acknowledge their distress warmly, collect key information, and escalate promptly to the appropriate leader.", v:5},
        {t:"Transfer them immediately to the Director's voicemail without additional context.", v:2},
        {t:"Attempt to address their concern yourself before involving leadership.", v:3},
        {t:"Inform them the Director is unavailable and ask them to call back later.", v:1},
      ]},
    { id:"ad4", section:"Administrative Competency", domain:"technical", type:"likert",
      text:"I understand HIPAA requirements as they apply to front-office and administrative staff, including minimum necessary standards." },
    { id:"ad5", section:"Administrative Competency", domain:"technical", type:"likert",
      text:"I am skilled at managing confidential patient and organizational documents with meticulous organization and attention to detail." },
    { id:"ad6", section:"Administrative Competency", domain:"technical", type:"likert",
      text:"I actively identify and propose improvements to administrative workflows to reduce manual effort and improve team efficiency." },
  ],
};

// ── Framework reference data ──────────────────────────────────
const DISC_PROFILES = {
  D:{ label:"Dominant", tagline:"Direct · Decisive · Results-Driven", color:RED, bg:RED_BG,
    desc:"Candidates with a primary D profile are direct, assertive, and goal-oriented. They thrive in fast-paced, high-accountability environments and make excellent decisions under pressure. In healthcare leadership, D profiles drive census growth, hold teams accountable, and execute strategic change. They may need coaching on patience, active listening, and building consensus before acting.",
    strengths:["Decisive under pressure","Goal and outcome orientation","Drives accountability","Leads organizational change"],
    watch:["May bypass process in urgency","Can be perceived as abrasive under stress","Needs active listening development"] },
  I:{ label:"Influential", tagline:"Enthusiastic · Relational · Inspiring", color:AMBER, bg:AMBER_BG,
    desc:"Influential profiles excel at building relationships with patients, families, referral sources, and staff. They energize teams, communicate with warmth, and are natural champions of culture and mission. In hospice and home health, I profiles are exceptional patient liaisons, community educators, and marketing professionals. They may need structure for documentation discipline and follow-through.",
    strengths:["Relationship development","Referral source cultivation","Team morale and culture","Patient and family engagement"],
    watch:["May de-prioritize detail-heavy documentation","Needs accountability structure","Can overcommit capacity"] },
  S:{ label:"Steady", tagline:"Patient · Reliable · Deeply Empathetic", color:TEAL, bg:"#E8FAF5",
    desc:"Steady profiles are the backbone of high-performing hospice and home health teams. Patient, loyal, and deeply empathetic, they provide the emotional consistency that end-of-life care demands. S profiles build extraordinary trust with patients and families over time. They are highly reliable in IDT settings but may need intentional support when navigating rapid organizational change.",
    strengths:["Patient and family trust","Team stability and consistency","Empathetic clinical presence","Long-term commitment"],
    watch:["Change-averse without support","May avoid difficult conversations","Needs clarity on expectations"] },
  C:{ label:"Conscientious", tagline:"Analytical · Precise · Quality-Focused", color:NAVY, bg:"#EBF5FB",
    desc:"Conscientious profiles are invaluable in compliance-heavy, documentation-intensive healthcare environments. They hold high standards for accuracy, follow regulatory protocol meticulously, and approach clinical and operational challenges with systematic rigor. C profiles excel as billing specialists, compliance officers, QA nurses, and analytics leads. They may need support with decisiveness in ambiguous situations.",
    strengths:["Clinical and billing accuracy","Regulatory and compliance orientation","Process design and quality improvement","Evidence-based practice"],
    watch:["May over-analyze before acting","Can struggle in ambiguous rapid-change environments","Needs connection to mission beyond data"] },
};

const MBTI_PROFILES = {
  ESTJ:"The Executive — Organized, decisive, and systematic. Thrives with clear structure, defined processes, and measurable outcomes.",
  ESFJ:"The Caregiver — Warm, conscientious, and socially attuned. Prioritizes team harmony and excels in patient-facing, relationship-driven roles.",
  ENTJ:"The Commander — Bold strategic leader who excels at long-term planning, organizational change, and driving results through others.",
  ENFJ:"The Protagonist — Charismatic and deeply empathetic. Inspires and develops others; exceptional in leadership and patient advocacy.",
  ESTP:"The Entrepreneur — Action-oriented and pragmatic. Thrives in dynamic healthcare environments requiring rapid clinical decision-making.",
  ESFP:"The Performer — Enthusiastic and warm. Creates natural connection with patients and families; energizes any care team.",
  ENTP:"The Debater — Inventive and strategic. Challenges assumptions and drives process innovation in clinical and operational settings.",
  ENFP:"The Champion — Creative, empathetic, and driven by possibility. Excels in patient advocacy, marketing, and community engagement.",
  ISTJ:"The Inspector — Reliable, meticulous, and thorough. Excels in compliance-intensive, documentation-heavy clinical and administrative roles.",
  ISFJ:"The Protector — Caring, conscientious, and mission-driven. A dependable, steadfast cornerstone of any care team.",
  INTJ:"The Architect — Strategic, independent, and analytically rigorous. Excellent for quality improvement, systems design, and data-driven leadership.",
  INFJ:"The Advocate — Visionary and principled. Deeply committed to patient dignity, mission alignment, and meaningful impact.",
  ISTP:"The Virtuoso — Calm under pressure with exceptional hands-on problem-solving. Thrives in skilled clinical environments.",
  ISFP:"The Adventurer — Gentle, flexible, and present-focused. Naturally attuned to patient comfort, dignity, and lived experience.",
  INTP:"The Thinker — Deeply analytical and intellectually curious. Excellent for clinical research, data analysis, and compliance work.",
  INFP:"The Mediator — Idealistic and empathetic. Guided by values and purpose; exceptional in social work, chaplaincy, and patient support.",
};

const DOMAIN_META = {
  ethics:       { label:"Moral Compass & Ethics",      color:TEAL,   icon:"⚖️",  weight:0.25 },
  communication:{ label:"Communication",               color:NAVY,   icon:"💬",  weight:0.12 },
  goals:        { label:"Professional Goals",          color:GOLD,   icon:"🎯",  weight:0.13 },
  adaptability: { label:"Adaptability & Resilience",   color:PURPLE, icon:"⚡",  weight:0.15 },
  tech:         { label:"AI & Technology Readiness",   color:BLUE,   icon:"🤖",  weight:0.15 },
  technical:    { label:"Role-Specific Competency",    color:RED,    icon:"🏥",  weight:0.20 },
};

const FOLLOW_UP_Q = {
  ethics:[
    "Describe a time you witnessed a colleague or superior act unethically in a patient care or billing context. What did you do, and what was the outcome?",
    "Tell me about a situation where following policy directly conflicted with your personal judgment. How did you navigate it?",
  ],
  communication:[
    "Walk me through a time you had to communicate difficult news to a patient's family. How did you prepare, and what was the outcome?",
    "Describe a significant workplace conflict. How did you resolve it, and what would you do differently today?",
  ],
  goals:[
    "Where do you see your career in 3–5 years, and how does this specific role fit that trajectory?",
    "What is the most significant professional development investment you have made in the past 12 months?",
  ],
  adaptability:[
    "Describe a major organizational change you had to navigate. What was your approach, and what did you learn?",
    "Tell me about a time you had to perform at a high level under significant pressure or ambiguity. How did you manage?",
  ],
  tech:[
    "What AI or technology tools have you used in clinical or administrative work? Walk me through a specific use case and its results.",
    "How do you typically approach learning a new software system? Describe your most recent experience.",
  ],
  technical:[
    "Walk me through a specific clinical or operational challenge in your previous role and how you resolved it.",
    "What aspect of this role do you feel least prepared for, and what is your plan to get up to speed?",
  ],
};

// ── Scoring engine ────────────────────────────────────────────
function computeScores(answers, questions) {
  const domScores = { ethics:[], communication:[], goals:[], adaptability:[], tech:[], technical:[] };
  const disc = { D:0, I:0, S:0, C:0 };
  const mbti = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };

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
    ds[k] = arr.length ? Math.min(100, Math.round(arr.reduce((a,b) => a+b, 0) / arr.length)) : 0;
  });

  const dt = Object.values(disc).reduce((a,b) => a+b, 0);
  const discPct = dt > 0
    ? { D:Math.round((disc.D/dt)*100), I:Math.round((disc.I/dt)*100), S:Math.round((disc.S/dt)*100), C:Math.round((disc.C/dt)*100) }
    : { D:25, I:25, S:25, C:25 };

  const mbtiType = [
    mbti.E >= mbti.I ? "E" : "I",
    mbti.S >= mbti.N ? "S" : "N",
    mbti.T >= mbti.F ? "T" : "F",
    mbti.J >= mbti.P ? "J" : "P",
  ].join("");

  const bigFive = {
    Openness:          Math.min(100, Math.round((ds.tech + ds.adaptability) / 2)),
    Conscientiousness: Math.min(100, Math.round(ds.ethics * 0.55 + ds.goals * 0.45)),
    Extraversion:      Math.min(100, Math.round(ds.communication)),
    Agreeableness:     Math.min(100, Math.round(ds.ethics * 0.4 + ds.goals * 0.6)),
    EmotionalStability:Math.min(100, Math.round(ds.adaptability)),
  };

  let overall = 0;
  let wTotal = 0;
  Object.entries(DOMAIN_META).forEach(([key, { weight }]) => {
    overall += (ds[key] || 0) * weight;
    wTotal += weight;
  });
  overall = Math.min(100, Math.round(overall / wTotal * 1));

  let rec, recType;
  if (ds.ethics < 55) { rec = "Do Not Recommend"; recType = "red"; }
  else if (overall >= 82 && ds.ethics >= 80 && ds.technical >= 75) { rec = "Strong Hire"; recType = "green"; }
  else if (overall >= 68) { rec = "Proceed with Caution"; recType = "amber"; }
  else { rec = "Needs Further Review"; recType = "purple"; }

  const primaryDisc = Object.entries(discPct).sort((a,b) => b[1]-a[1])[0][0];
  const weakDomains = Object.entries(ds)
    .filter(([k]) => k !== "mbti")
    .sort((a,b) => a[1]-b[1])
    .slice(0,2)
    .map(([k]) => k);

  return { ds, discPct, mbtiType, bigFive, overall, rec, recType, primaryDisc, weakDomains };
}

// ── UI Helpers ────────────────────────────────────────────────
const css = (s) => Object.entries(s).map(([k,v])=>`${k.replace(/([A-Z])/g,'-$1').toLowerCase()}:${v}`).join(';');

function ProgressBar({ pct, color, h=8 }) {
  return (
    <div style={{ background:"#E2E8F0", borderRadius:h, height:h, overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:h, transition:"width 0.8s ease" }} />
    </div>
  );
}

const DISC_COLORS = { D:RED, I:AMBER, S:TEAL, C:NAVY };

function QCard({ q, ans, onAns, idx }) {
  const opts = q.opts || [];
  const isLikert = q.type === "likert";

  if (isLikert) {
    const colors = [RED, "#F97316", AMBER, "#84CC16", GREEN];
    const labels = ["Strongly Disagree","Disagree","Neutral","Agree","Strongly Agree"];
    return (
      <div style={{ background:WHITE, borderRadius:20, padding:"26px 28px", marginBottom:16,
        border:`1.5px solid ${ans ? TEAL+"66" : BORDER}`,
        boxShadow:"0 2px 12px rgba(0,0,0,0.05)", transition:"border-color 0.2s" }}>
        <div style={{ display:"flex", gap:14, marginBottom:18 }}>
          <div style={{ background:NAVY, color:WHITE, borderRadius:"50%", width:30, height:30,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, fontSize:13, flexShrink:0 }}>{idx}</div>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:TEAL, letterSpacing:"0.1em",
              textTransform:"uppercase", marginBottom:5 }}>{q.section}</div>
            <p style={{ color:TEXT, fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{q.text}</p>
          </div>
        </div>
        <div style={{ paddingLeft:44 }}>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            {[1,2,3,4,5].map(val => {
              const sel = ans?.v === val;
              return (
                <button key={val} onClick={() => onAns({ v:val })} title={labels[val-1]}
                  style={{ flex:1, padding:"12px 0", border:`2px solid ${sel ? colors[val-1] : BORDER}`,
                    borderRadius:12, background:sel ? `${colors[val-1]}1A` : WHITE,
                    cursor:"pointer", display:"flex", flexDirection:"column",
                    alignItems:"center", gap:4, transition:"all 0.15s" }}
                  onMouseEnter={e => { if(!sel){ e.currentTarget.style.borderColor=colors[val-1]; e.currentTarget.style.background=`${colors[val-1]}0D`; }}}
                  onMouseLeave={e => { if(!sel){ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background=WHITE; }}}>
                  <span style={{ fontSize:20, fontWeight:900, color:sel?colors[val-1]:TEXT_L }}>{val}</span>
                  <span style={{ fontSize:9, color:sel?colors[val-1]:TEXT_L, fontWeight:600, textAlign:"center", lineHeight:1.2, letterSpacing:"0.04em" }}>
                    {labels[val-1].split(" ").map((w,i) => <span key={i} style={{ display:"block" }}>{w}</span>)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const isDisc = q.type === "disc";
  const isMbti = q.type === "mbti";
  const isScenario = q.type === "scenario";
  const accentFn = (opt) => {
    if (isDisc && opt.disc) return DISC_COLORS[opt.disc];
    return TEAL;
  };
  const tagFor = (type) => {
    if (type === "disc") return { label:"DISC", color:NAVY, bg:"#EBF5FB" };
    if (type === "mbti") return { label:"MBTI", color:PURPLE, bg:PURPLE_BG };
    if (type === "scenario") return { label:"Scenario", color:AMBER, bg:AMBER_BG };
    return { label:"Choice", color:TEAL, bg:"#E8FAF5" };
  };
  const tag = tagFor(q.type);

  return (
    <div style={{ background:WHITE, borderRadius:20, padding:"26px 28px", marginBottom:16,
      border:`1.5px solid ${ans !== undefined ? TEAL+"66" : BORDER}`,
      boxShadow:"0 2px 12px rgba(0,0,0,0.05)", transition:"border-color 0.2s" }}>
      <div style={{ display:"flex", gap:14, marginBottom:18 }}>
        <div style={{ background:NAVY, color:WHITE, borderRadius:"50%", width:30, height:30,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:800, fontSize:13, flexShrink:0 }}>{idx}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, fontWeight:800, color:TEAL, letterSpacing:"0.1em", textTransform:"uppercase" }}>{q.section}</span>
            <span style={{ fontSize:10, fontWeight:700, color:tag.color, background:tag.bg,
              borderRadius:4, padding:"2px 8px", letterSpacing:"0.05em" }}>{tag.label}</span>
          </div>
          <p style={{ color:TEXT, fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{q.text}</p>
        </div>
      </div>
      <div style={{ paddingLeft:44, display:"flex", flexDirection:"column", gap:10 }}>
        {opts.map((opt, i) => {
          const selected = ans?.idx === i;
          const accent = accentFn(opt);
          const discLabel = isDisc && opt.disc ? opt.disc : null;
          const mbtiLabel = isMbti && opt.m ? opt.m : null;
          return (
            <button key={i} onClick={() => {
              const d = { idx:i };
              if (opt.disc) d.disc = opt.disc;
              if (opt.m)    d.m    = opt.m;
              if (opt.v !== undefined) d.v = opt.v;
              onAns(d);
            }} style={{ textAlign:"left", padding:"14px 16px", cursor:"pointer",
              border:`2px solid ${selected ? accent : BORDER}`,
              borderRadius:13, background:selected ? `${accent}12` : WHITE,
              display:"flex", alignItems:"center", gap:12, transition:"all 0.15s" }}
              onMouseEnter={e => { if(!selected){ e.currentTarget.style.borderColor=`${accent}80`; e.currentTarget.style.background=`${accent}07`; }}}
              onMouseLeave={e => { if(!selected){ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background=WHITE; }}}>
              <div style={{ width:22, height:22, border:`2px solid ${selected ? accent : "#CBD5E1"}`,
                borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, background:selected ? accent : WHITE, transition:"all 0.15s" }}>
                {selected && <div style={{ width:8, height:8, background:WHITE, borderRadius:"50%" }} />}
              </div>
              <span style={{ flex:1, color:selected ? TEXT : TEXT_M, fontSize:14,
                lineHeight:1.6, fontWeight:selected ? 600 : 400 }}>{opt.t}</span>
              {discLabel && (
                <span style={{ fontSize:11, fontWeight:800, color:DISC_COLORS[discLabel],
                  background:`${DISC_COLORS[discLabel]}18`, borderRadius:6,
                  padding:"3px 10px", flexShrink:0 }}>{discLabel}</span>
              )}
              {mbtiLabel && mbtiLabel !== "A" && (
                <span style={{ fontSize:11, fontWeight:800, color:PURPLE,
                  background:PURPLE_BG, borderRadius:6, padding:"3px 10px", flexShrink:0 }}>{mbtiLabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("welcome");
  const [role, setRole] = useState(null);
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(0);
  const PER_PAGE = 4;

  const allQ = useMemo(() => {
    if (!role) return [];
    return [...UNIVERSAL, ...(ROLE_Q[role] || [])];
  }, [role]);

  const totalPages = Math.ceil(allQ.length / PER_PAGE);
  const pageQ = allQ.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const answered = Object.keys(answers).length;
  const progress = allQ.length ? answered / allQ.length : 0;
  const pageDone = pageQ.every(q => answers[q.id] !== undefined);
  const setAns = (id, data) => setAnswers(p => ({ ...p, [id]: data }));
  const roleData = ROLES.find(r => r.id === role);

  const scores = useMemo(() => {
    if (phase !== "results") return null;
    return computeScores(answers, allQ);
  }, [phase]);

  // ═══════════════════════════════════════════════
  // WELCOME SCREEN
  // ═══════════════════════════════════════════════
  if (phase === "welcome") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${NAVY} 0%, #0E2840 60%, #071520 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"40px 20px", fontFamily:"Georgia, serif" }}>
      <div style={{ maxWidth:720, width:"100%", textAlign:"center" }}>
        <div style={{ display:"inline-block", background:TEAL, borderRadius:8, padding:"6px 18px", marginBottom:20 }}>
          <span style={{ color:WHITE, fontSize:11, fontFamily:"system-ui,sans-serif",
            letterSpacing:"0.16em", textTransform:"uppercase", fontWeight:800 }}>
            Healthcare AI Academy
          </span>
        </div>
        <h1 style={{ fontSize:"clamp(26px,5vw,50px)", color:WHITE, fontWeight:700,
          lineHeight:1.2, marginBottom:12, margin:"0 0 12px" }}>
          Comprehensive Candidate<br />
          <span style={{ color:GOLD }}>Personality Assessment</span>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.68)", fontSize:16, lineHeight:1.8, margin:"16px auto 36px",
          fontFamily:"system-ui,sans-serif", maxWidth:580 }}>
          A clinically-informed, role-stratified hiring assessment grounded in
          <strong style={{ color:"rgba(255,255,255,0.9)" }}> Myers-Briggs, DISC, Big Five (OCEAN)</strong>,
          and healthcare-specific behavioral frameworks — engineered for post-acute care excellence.
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:36 }}>
          {[
            ["⚖️","Moral Compass & Ethics","Values, integrity, and compliance behavior"],
            ["💬","Communication Style","Verbal, written, and interpersonal patterns"],
            ["🎯","Professional Goals","Motivation, ambition, and career alignment"],
            ["⚡","Adaptability","Resilience, change-readiness, pressure response"],
            ["🤖","AI & Technology","EHR proficiency, AI readiness, digital comfort"],
            ["🏥","Technical Competency","Role-specific clinical and operational skills"],
          ].map(([ic,lb,desc],i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.07)",
              border:"1px solid rgba(255,255,255,0.13)", borderRadius:14, padding:"18px 14px" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{ic}</div>
              <div style={{ color:GOLD, fontSize:12, fontFamily:"system-ui,sans-serif",
                fontWeight:800, marginBottom:4 }}>{lb}</div>
              <div style={{ color:"rgba(255,255,255,0.52)", fontSize:11,
                fontFamily:"system-ui,sans-serif", lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:12, padding:"14px 24px", marginBottom:36, fontFamily:"system-ui,sans-serif" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:0, lineHeight:1.8 }}>
            <span style={{ color:GOLD, fontWeight:800 }}>⏱ Time:</span> 18–22 minutes &nbsp;·&nbsp;
            <span style={{ color:GOLD, fontWeight:800 }}>📋 Questions:</span> 38–46 (role-adjusted) &nbsp;·&nbsp;
            <span style={{ color:GOLD, fontWeight:800 }}>📊 Frameworks:</span> MBTI · DISC · Big Five &nbsp;·&nbsp;
            <span style={{ color:GOLD, fontWeight:800 }}>🔒</span> Internal HR use only
          </p>
        </div>

        <button onClick={() => setPhase("role")}
          style={{ background:`linear-gradient(135deg,${TEAL},#0D7A65)`, color:WHITE,
            border:"none", borderRadius:50, padding:"17px 54px", fontSize:17, fontWeight:700,
            cursor:"pointer", fontFamily:"system-ui,sans-serif", letterSpacing:"0.02em",
            boxShadow:`0 8px 32px rgba(20,143,119,0.45)`, transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 14px 40px rgba(20,143,119,0.55)`; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 8px 32px rgba(20,143,119,0.45)`; }}>
          Begin Assessment →
        </button>

        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12, marginTop:22,
          fontFamily:"system-ui,sans-serif" }}>
          Powered by Healthcare AI Academy · Designed for post-acute care excellence
        </p>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  // ROLE SELECTION
  // ═══════════════════════════════════════════════
  if (phase === "role") return (
    <div style={{ minHeight:"100vh", background:BG, padding:"40px 20px", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-block", background:NAVY, borderRadius:8, padding:"6px 18px", marginBottom:14 }}>
            <span style={{ color:WHITE, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", fontWeight:800 }}>
              Step 1 — Role Selection
            </span>
          </div>
          <h2 style={{ fontSize:32, color:NAVY, fontWeight:700, margin:"0 0 10px", fontFamily:"Georgia,serif" }}>
            Select Candidate Role
          </h2>
          <p style={{ color:TEXT_M, fontSize:15, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            The selected role determines which role-specific competency questions are added to the universal assessment battery,
            ensuring precision-matched evaluation for every hire.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))", gap:14, marginBottom:36 }}>
          {ROLES.map(r => {
            const sel = role === r.id;
            return (
              <button key={r.id} onClick={() => setRole(r.id)}
                style={{ background:sel ? `linear-gradient(135deg,${NAVY},${NAVY_D})` : WHITE,
                  border:`2px solid ${sel ? NAVY : BORDER}`, borderRadius:16,
                  padding:"18px 22px", cursor:"pointer", textAlign:"left",
                  display:"flex", alignItems:"center", gap:16, transition:"all 0.2s",
                  boxShadow:sel ? `0 8px 28px rgba(27,79,114,0.25)` : "0 1px 8px rgba(0,0,0,0.05)" }}
                onMouseEnter={e => { if(!sel){ e.currentTarget.style.borderColor=TEAL; e.currentTarget.style.transform="translateY(-1px)"; }}}
                onMouseLeave={e => { if(!sel){ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.transform=""; }}}>
                <span style={{ fontSize:30, minWidth:38 }}>{r.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:sel?WHITE:TEXT, marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:12, color:sel?"rgba(255,255,255,0.6)":TEXT_L, lineHeight:1.5 }}>{r.sub}</div>
                </div>
                {sel && <div style={{ color:GOLD, fontSize:20, fontWeight:900 }}>✓</div>}
              </button>
            );
          })}
        </div>

        <div style={{ textAlign:"center" }}>
          <button disabled={!role}
            onClick={() => { setPhase("questions"); setPage(0); }}
            style={{ background:role ? `linear-gradient(135deg,${TEAL},#0D7A65)` : BORDER,
              color:role ? WHITE : TEXT_L, border:"none", borderRadius:50,
              padding:"15px 52px", fontSize:16, fontWeight:700,
              cursor:role ? "pointer" : "not-allowed", transition:"all 0.2s",
              boxShadow:role ? `0 6px 24px rgba(20,143,119,0.35)` : "none" }}>
            {role ? `Begin Assessment — ${roleData?.label} →` : "Select a Role to Continue"}
          </button>
          {role && (
            <p style={{ color:TEXT_L, fontSize:13, marginTop:12 }}>
              {allQ.length} questions total · Universal battery + {(ROLE_Q[role]||[]).length} role-specific questions
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  // QUESTION PAGES
  // ═══════════════════════════════════════════════
  if (phase === "questions") {
    const sections = [...new Set(pageQ.map(q => q.section))];
    return (
      <div style={{ minHeight:"100vh", background:BG, fontFamily:"system-ui,sans-serif" }}>
        {/* Header */}
        <div style={{ background:NAVY, padding:"16px 28px", display:"flex", alignItems:"center",
          justifyContent:"space-between", position:"sticky", top:0, zIndex:10,
          boxShadow:"0 2px 16px rgba(0,0,0,0.25)" }}>
          <div>
            <div style={{ color:GOLD, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:800 }}>
              Healthcare AI Academy
            </div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginTop:2 }}>
              Personality Assessment · {roleData?.label}
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:WHITE, fontSize:15, fontWeight:800 }}>Page {page+1} / {totalPages}</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>
              {answered} of {allQ.length} answered
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:TEAL, fontSize:22, fontWeight:900 }}>
              {Math.round(progress * 100)}%
            </div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:5, background:"rgba(27,79,114,0.15)" }}>
          <div style={{ height:"100%", width:`${progress*100}%`,
            background:`linear-gradient(90deg,${TEAL},${TEAL_L})`,
            transition:"width 0.5s ease" }} />
        </div>

        <div style={{ maxWidth:800, margin:"0 auto", padding:"30px 20px" }}>
          {sections.length > 1 && (
            <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
              {sections.map(s => (
                <span key={s} style={{ fontSize:11, fontWeight:700, color:TEAL,
                  background:"rgba(20,143,119,0.1)", borderRadius:6,
                  padding:"4px 12px", letterSpacing:"0.06em", textTransform:"uppercase" }}>{s}</span>
              ))}
            </div>
          )}

          {pageQ.map((q, qi) => (
            <QCard key={q.id} q={q} ans={answers[q.id]}
              onAns={d => setAns(q.id, d)}
              idx={page * PER_PAGE + qi + 1} />
          ))}

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            marginTop:16, paddingTop:16 }}>
            <button
              onClick={() => { if(page > 0) setPage(p=>p-1); else setPhase("role"); }}
              style={{ background:"transparent", border:`2px solid ${BORDER}`, borderRadius:50,
                padding:"11px 26px", fontSize:14, fontWeight:600, cursor:"pointer",
                color:TEXT_M, transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=NAVY; e.currentTarget.style.color=NAVY; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.color=TEXT_M; }}>
              ← Back
            </button>

            {!pageDone && (
              <span style={{ fontSize:13, color:TEXT_L, textAlign:"center", lineHeight:1.5 }}>
                Answer all {pageQ.length} questions on this page to continue
              </span>
            )}

            <button disabled={!pageDone}
              onClick={() => { if(page < totalPages-1) setPage(p=>p+1); else setPhase("results"); }}
              style={{ background:pageDone ? `linear-gradient(135deg,${TEAL},#0D7A65)` : BORDER,
                color:pageDone ? WHITE : TEXT_L, border:"none", borderRadius:50,
                padding:"11px 30px", fontSize:14, fontWeight:700,
                cursor:pageDone ? "pointer" : "not-allowed", transition:"all 0.2s",
                boxShadow:pageDone ? `0 4px 18px rgba(20,143,119,0.32)` : "none" }}>
              {page < totalPages-1 ? "Next Page →" : "View Full Results →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════
  if (phase === "results" && scores) {
    const { ds, discPct, mbtiType, bigFive, overall, rec, recType, primaryDisc, weakDomains } = scores;

    const RC_MAP = {
      green:  { bg:GREEN_BG,  border:"#6EE7B7", color:GREEN,  icon:"✅", iconBig:"🟢" },
      amber:  { bg:AMBER_BG,  border:"#FCD34D", color:AMBER,  icon:"⚠️", iconBig:"🟡" },
      purple: { bg:PURPLE_BG, border:"#C4B5FD", color:PURPLE, icon:"🔍", iconBig:"🔵" },
      red:    { bg:RED_BG,    border:"#FCA5A5", color:RED,    icon:"❌", iconBig:"🔴" },
    };
    const RC = RC_MAP[recType];
    const discInfo = DISC_PROFILES[primaryDisc];
    const mbtiDesc = MBTI_PROFILES[mbtiType] || "Balanced profile — no single MBTI type is strongly dominant.";

    const BF_COLORS = { Openness:BLUE, Conscientiousness:TEAL, Extraversion:AMBER, Agreeableness:GREEN, EmotionalStability:PURPLE };
    const BF_ICONS  = { Openness:"💡", Conscientiousness:"📋", Extraversion:"🤝", Agreeableness:"🤲", EmotionalStability:"⚓" };

    const sectionHead = (title, sub) => (
      <div style={{ marginBottom:20, marginTop:32 }}>
        <h3 style={{ fontSize:22, fontWeight:700, color:NAVY, margin:"0 0 4px", fontFamily:"Georgia,serif" }}>{title}</h3>
        {sub && <p style={{ color:TEXT_M, fontSize:14, margin:0 }}>{sub}</p>}
      </div>
    );

    return (
      <div style={{ minHeight:"100vh", background:BG, fontFamily:"system-ui,sans-serif" }}>
        {/* Header */}
        <div style={{ background:NAVY, padding:"22px 28px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ color:GOLD, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:800 }}>
                Healthcare AI Academy — Candidate Assessment Report
              </div>
              <div style={{ color:WHITE, fontSize:26, fontWeight:700, marginTop:4, fontFamily:"Georgia,serif" }}>
                Personality & Competency Report
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:3 }}>
                Role: {roleData?.label} · Generated {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
              </div>
            </div>
            <button onClick={() => { setPhase("welcome"); setRole(null); setAnswers({}); setPage(0); }}
              style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                color:WHITE, borderRadius:50, padding:"10px 24px", fontSize:13,
                fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
              + New Assessment
            </button>
          </div>
        </div>

        <div style={{ maxWidth:960, margin:"0 auto", padding:"32px 20px" }}>

          {/* ── RECOMMENDATION BANNER ── */}
          <div style={{ background:RC.bg, border:`2.5px solid ${RC.border}`, borderRadius:20,
            padding:"26px 32px", marginBottom:28, display:"flex", alignItems:"center",
            gap:24, flexWrap:"wrap" }}>
            <div style={{ fontSize:52 }}>{RC.icon}</div>
            <div style={{ flex:1, minWidth:220 }}>
              <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.12em",
                textTransform:"uppercase", color:RC.color, marginBottom:4 }}>
                HR Recommendation
              </div>
              <div style={{ fontSize:32, fontWeight:900, color:RC.color, fontFamily:"Georgia,serif", lineHeight:1.1, marginBottom:8 }}>
                {rec}
              </div>
              <p style={{ color:RC.color, opacity:0.8, fontSize:14, margin:0, lineHeight:1.65 }}>
                {recType==="green" && "This candidate demonstrates strong alignment across all measured competency domains. Recommend advancing to offer stage with standard onboarding plan and 90-day check-in structure."}
                {recType==="amber" && "This candidate shows meaningful promise but warrants structured follow-up interviews in weaker competency areas before extending a conditional offer."}
                {recType==="purple" && "Significant competency gaps identified. Additional behavioral interviews, reference checks, and practical scenario exercises are strongly recommended before proceeding."}
                {recType==="red" && "Critical concerns identified in the Ethics & Moral Compass domain. Do not advance to offer without a formal in-person ethics review conducted by senior leadership and HR."}
              </p>
              {weakDomains.length > 0 && recType !== "green" && (
                <div style={{ marginTop:10, fontSize:13, color:RC.color, opacity:0.75 }}>
                  <strong>Areas requiring follow-up:</strong>{" "}
                  {weakDomains.map(d => DOMAIN_META[d]?.label).join(" · ")}
                </div>
              )}
            </div>
            <div style={{ background:"rgba(255,255,255,0.6)", borderRadius:16, padding:"18px 26px", textAlign:"center", minWidth:110 }}>
              <div style={{ fontSize:10, color:RC.color, fontWeight:800, letterSpacing:"0.1em",
                textTransform:"uppercase", marginBottom:4 }}>Overall</div>
              <div style={{ fontSize:52, fontWeight:900, color:RC.color, lineHeight:1 }}>{overall}</div>
              <div style={{ fontSize:13, color:RC.color, opacity:0.6 }}>/ 100</div>
            </div>
          </div>

          {/* ── COMPETENCY DOMAIN SCORES ── */}
          {sectionHead("Competency Domain Scores", "Weighted scoring across 6 behavioral and technical competency domains")}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14, marginBottom:8 }}>
            {Object.entries(DOMAIN_META).map(([key, {label, color, icon, weight}]) => {
              const score = ds[key] || 0;
              const tier = score>=80?"Excellent":score>=65?"Good":score>=50?"Developing":"Needs Attention";
              const tc = score>=80?GREEN:score>=65?TEAL:score>=50?AMBER:RED;
              return (
                <div key={key} style={{ background:WHITE, borderRadius:16, padding:"22px",
                  border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:18, marginBottom:4 }}>{icon}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:NAVY, lineHeight:1.3, marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:11, color:TEXT_L }}>Weight: {Math.round(weight*100)}%</div>
                    </div>
                    <div style={{ fontSize:36, fontWeight:900, color, lineHeight:1 }}>{score}</div>
                  </div>
                  <ProgressBar pct={score} color={color} h={9} />
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:tc }}>{tier}</span>
                    <span style={{ fontSize:11, color:TEXT_L }}>{score}/100</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DISC PROFILE ── */}
          {sectionHead("DISC Behavioral Profile", "Reveals natural communication style, decision-making tendencies, and team dynamics fit")}
          <div style={{ background:WHITE, borderRadius:20, padding:"28px", marginBottom:4,
            border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", gap:14, marginBottom:24, flexWrap:"wrap" }}>
              {Object.entries(DISC_PROFILES).map(([key, info]) => (
                <div key={key} style={{ flex:1, minWidth:120, borderRadius:14,
                  padding:"16px 14px", border:`2px solid ${primaryDisc===key ? info.color : BORDER}`,
                  background:primaryDisc===key ? `${info.color}0E` : WHITE,
                  textAlign:"center", transition:"all 0.2s" }}>
                  <div style={{ fontSize:28, fontWeight:900, color:info.color, marginBottom:4 }}>{key}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:4 }}>{info.label}</div>
                  <div style={{ fontSize:11, color:TEXT_L, marginBottom:10, lineHeight:1.4 }}>{info.tagline}</div>
                  <ProgressBar pct={discPct[key]} color={info.color} h={8} />
                  <div style={{ fontSize:16, fontWeight:800, color:info.color, marginTop:6 }}>{discPct[key]}%</div>
                  {primaryDisc===key && (
                    <div style={{ fontSize:10, fontWeight:800, color:info.color,
                      background:`${info.color}18`, borderRadius:6, padding:"3px 8px",
                      marginTop:6, letterSpacing:"0.06em" }}>PRIMARY</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ background:discInfo.bg, borderRadius:14, padding:"20px 24px",
              border:`1px solid ${discInfo.color}30` }}>
              <div style={{ fontSize:18, fontWeight:700, color:discInfo.color, marginBottom:8 }}>
                Primary Type: {discInfo.label} ({primaryDisc}) — {discInfo.tagline}
              </div>
              <p style={{ color:TEXT, fontSize:14, lineHeight:1.75, margin:"0 0 14px" }}>{discInfo.desc}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:GREEN, textTransform:"uppercase",
                    letterSpacing:"0.08em", marginBottom:8 }}>Core Strengths</div>
                  {discInfo.strengths.map((s,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8,
                      fontSize:13, color:TEXT, marginBottom:5 }}>
                      <span style={{ color:GREEN, fontWeight:700 }}>✓</span> {s}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:AMBER, textTransform:"uppercase",
                    letterSpacing:"0.08em", marginBottom:8 }}>Watch For</div>
                  {discInfo.watch.map((s,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8,
                      fontSize:13, color:TEXT, marginBottom:5 }}>
                      <span style={{ color:AMBER, fontWeight:700 }}>⚡</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── MBTI ── */}
          {sectionHead("MBTI-Inspired Personality Type", "Cognitive style, decision-making preferences, and environmental fit")}
          <div style={{ background:WHITE, borderRadius:20, padding:"28px",
            border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20, flexWrap:"wrap" }}>
              <div style={{ background:NAVY, color:WHITE, borderRadius:16, padding:"18px 28px", textAlign:"center" }}>
                <div style={{ fontSize:46, fontWeight:900, letterSpacing:4, lineHeight:1 }}>{mbtiType}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4, letterSpacing:"0.1em" }}>TYPE</div>
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontSize:16, fontWeight:700, color:NAVY, marginBottom:6 }}>
                  {mbtiDesc.split(" — ")[0]}
                </div>
                <p style={{ color:TEXT_M, fontSize:14, lineHeight:1.7, margin:0 }}>
                  {mbtiDesc.split(" — ")[1] || mbtiDesc}
                </p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[
                {dim:"E/I", val:mbtiType[0], full:mbtiType[0]==="E"?"Extroversion":"Introversion", opp:mbtiType[0]==="E"?"I":"E"},
                {dim:"S/N", val:mbtiType[1], full:mbtiType[1]==="S"?"Sensing":"Intuition",         opp:mbtiType[1]==="S"?"N":"S"},
                {dim:"T/F", val:mbtiType[2], full:mbtiType[2]==="T"?"Thinking":"Feeling",          opp:mbtiType[2]==="T"?"F":"T"},
                {dim:"J/P", val:mbtiType[3], full:mbtiType[3]==="J"?"Judging":"Perceiving",        opp:mbtiType[3]==="J"?"P":"J"},
              ].map(({dim,val,full,opp}) => (
                <div key={dim} style={{ background:BG, borderRadius:12, padding:"14px", textAlign:"center" }}>
                  <div style={{ fontSize:12, color:TEXT_L, fontWeight:700, letterSpacing:"0.08em",
                    textTransform:"uppercase", marginBottom:8 }}>{dim}</div>
                  <div style={{ fontSize:30, fontWeight:900, color:NAVY, lineHeight:1, marginBottom:4 }}>{val}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:4 }}>{full}</div>
                  <div style={{ fontSize:11, color:TEXT_L }}>(vs. {opp})</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BIG FIVE / OCEAN ── */}
          {sectionHead("Big Five (OCEAN) Model", "The gold-standard personality taxonomy used in validated organizational psychology research")}
          <div style={{ background:WHITE, borderRadius:20, padding:"28px",
            border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", marginBottom:4 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {Object.entries(bigFive).map(([trait, score]) => {
                const color = BF_COLORS[trait];
                const icon = BF_ICONS[trait];
                const tier = score>=80?"High":score>=55?"Moderate":"Low";
                const HEALTHCARE_CONTEXT = {
                  Openness:"High openness indicates strong adaptability, creative problem-solving, and AI/technology readiness — critical in evolving post-acute environments.",
                  Conscientiousness:"High conscientiousness strongly predicts clinical accuracy, documentation discipline, compliance adherence, and patient safety outcomes.",
                  Extraversion:"High extraversion supports family engagement, referral relationship-building, and IDT communication effectiveness.",
                  Agreeableness:"High agreeableness correlates with compassionate patient care and collaborative IDT participation — essential in hospice and palliative settings.",
                  EmotionalStability:"High emotional stability predicts performance under the intense emotional demands of end-of-life care and crisis situations.",
                };
                return (
                  <div key={trait}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
                      <span style={{ fontSize:18 }}>{icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                          <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>{trait}</span>
                          <span style={{ fontWeight:800, fontSize:14, color }}>{score}/100 — {tier}</span>
                        </div>
                        <ProgressBar pct={score} color={color} h={10} />
                      </div>
                    </div>
                    <p style={{ margin:"0 0 0 32px", fontSize:12, color:TEXT_M, lineHeight:1.6,
                      borderLeft:`3px solid ${color}40`, paddingLeft:12 }}>
                      {HEALTHCARE_CONTEXT[trait]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── INTERVIEW FOLLOW-UP QUESTIONS ── */}
          {sectionHead("Recommended Follow-Up Interview Questions", "Targeted behavioral questions based on this candidate's assessment profile")}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(440px,1fr))", gap:14, marginBottom:4 }}>
            {Object.entries(FOLLOW_UP_Q).map(([domain, questions]) => {
              const meta = DOMAIN_META[domain];
              const score = ds[domain] || 0;
              const isWeak = weakDomains.includes(domain);
              return (
                <div key={domain} style={{ background:WHITE, borderRadius:16, padding:"22px",
                  border:`1.5px solid ${isWeak ? meta.color+"55" : BORDER}`,
                  boxShadow:isWeak ? `0 4px 18px ${meta.color}15` : "0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:16 }}>{meta.icon}</span>
                        <span style={{ fontWeight:700, fontSize:14, color:NAVY }}>{meta.label}</span>
                        {isWeak && (
                          <span style={{ fontSize:10, fontWeight:800, color:AMBER,
                            background:AMBER_BG, borderRadius:4, padding:"2px 8px",
                            letterSpacing:"0.06em" }}>PRIORITY</span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize:20, fontWeight:900, color:meta.color }}>{score}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {questions.map((q, i) => (
                      <div key={i} style={{ background:BG, borderRadius:10, padding:"12px 14px",
                        borderLeft:`4px solid ${meta.color}` }}>
                        <span style={{ fontSize:11, fontWeight:800, color:meta.color,
                          letterSpacing:"0.06em", textTransform:"uppercase", marginRight:6 }}>Q{i+1}</span>
                        <span style={{ fontSize:13, color:TEXT, lineHeight:1.65 }}>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── HIRING DECISION GUIDE ── */}
          {sectionHead("Hiring Decision Framework", "Structured guidance for HR and hiring managers based on this assessment")}
          <div style={{ background:WHITE, borderRadius:20, padding:"28px",
            border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", marginBottom:32 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
              {[
                { label:"Strong Hire", color:GREEN, bg:GREEN_BG, threshold:"Overall ≥82 · Ethics ≥80 · Technical ≥75", action:"Advance to offer with standard 90-day onboarding plan and structured check-ins." },
                { label:"Proceed with Caution", color:AMBER, bg:AMBER_BG, threshold:"Overall 68–81 or any domain 50–64", action:"Schedule competency-specific behavioral interviews and obtain 3 professional references before offer." },
                { label:"Needs Further Review", color:PURPLE, bg:PURPLE_BG, threshold:"Overall <68 or 2+ domains below 50", action:"Conduct in-person practical assessment, peer panel interview, and thorough reference verification." },
                { label:"Do Not Recommend", color:RED, bg:RED_BG, threshold:"Ethics domain <55", action:"Ethics deficiencies are disqualifying without senior leadership review and formal ethics interview." },
              ].map(({label,color,bg,threshold,action}) => (
                <div key={label} style={{ background:bg, borderRadius:14, padding:"18px 16px",
                  border:`1.5px solid ${color}30` }}>
                  <div style={{ fontSize:13, fontWeight:800, color, marginBottom:8 }}>{label}</div>
                  <div style={{ fontSize:11, color:TEXT_M, marginBottom:8, fontStyle:"italic" }}>{threshold}</div>
                  <div style={{ fontSize:12, color:TEXT, lineHeight:1.6 }}>{action}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, padding:"14px 18px", background:BG, borderRadius:12,
              borderLeft:`4px solid ${NAVY}` }}>
              <p style={{ margin:0, fontSize:13, color:TEXT_M, lineHeight:1.7 }}>
                <strong style={{ color:NAVY }}>Important:</strong> This assessment is one data point in a comprehensive hiring process.
                It should always be used in conjunction with structured behavioral interviews, credential verification,
                OIG exclusion screening, reference checks, and clinical competency demonstrations where applicable.
                No single assessment score should be the sole basis for a hiring decision.
                Healthcare AI Academy assessments are designed to supplement — never replace — skilled HR judgment.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign:"center", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
            <p style={{ color:TEXT_L, fontSize:12, lineHeight:1.7 }}>
              Healthcare AI Academy · Comprehensive Candidate Assessment System<br />
              Grounded in Myers-Briggs (MBTI), DISC, Big Five (OCEAN), and Post-Acute Care Behavioral Frameworks<br />
              For internal HR use only · {new Date().getFullYear()} · <strong style={{ color:TEAL }}>Confidential</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
