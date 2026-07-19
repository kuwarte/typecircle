// src/lib/quiz-data.ts

export type QuizQuestion = {
  id: string;
  statement: string;
  type: number; // which Enneagram type (1-9) this statement reflects
};

// 3 statements per type = 27 questions total, rated 1-5 agreement
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "q1", statement: "I hold myself to very high standards.", type: 1 },
  {
    id: "q2",
    statement: "I notice what's wrong before what's right.",
    type: 1,
  },
  {
    id: "q3",
    statement: "I feel responsible for doing things the 'correct' way.",
    type: 1,
  },

  {
    id: "q4",
    statement: "I go out of my way to help people close to me.",
    type: 2,
  },
  { id: "q5", statement: "I struggle to ask for help myself.", type: 2 },
  { id: "q6", statement: "I feel most valued when I'm needed.", type: 2 },

  {
    id: "q7",
    statement: "I'm driven to succeed and be recognized for it.",
    type: 3,
  },
  {
    id: "q8",
    statement: "I adapt my image depending on who I'm with.",
    type: 3,
  },
  { id: "q9", statement: "I measure my worth by what I accomplish.", type: 3 },

  {
    id: "q10",
    statement: "I feel like I'm missing something others have.",
    type: 4,
  },
  {
    id: "q11",
    statement: "I'm drawn to deep, intense emotional experiences.",
    type: 4,
  },
  {
    id: "q12",
    statement: "I want to be seen as unique, not ordinary.",
    type: 4,
  },

  { id: "q13", statement: "I need time alone to recharge and think.", type: 5 },
  { id: "q14", statement: "I prefer observing before participating.", type: 5 },
  {
    id: "q15",
    statement: "I feel uncomfortable when others expect too much of my energy.",
    type: 5,
  },

  { id: "q16", statement: "I plan for what could go wrong.", type: 6 },
  {
    id: "q17",
    statement: "I value loyalty and trust above almost everything.",
    type: 6,
  },
  {
    id: "q18",
    statement: "I second-guess decisions even after making them.",
    type: 6,
  },

  {
    id: "q19",
    statement: "I look for the upside in most situations.",
    type: 7,
  },
  {
    id: "q20",
    statement: "I get restless doing the same thing for too long.",
    type: 7,
  },
  { id: "q21", statement: "I avoid dwelling on pain or discomfort.", type: 7 },

  {
    id: "q22",
    statement: "I speak my mind directly, even if it's blunt.",
    type: 8,
  },
  {
    id: "q23",
    statement: "I feel the need to protect people I care about.",
    type: 8,
  },
  { id: "q24", statement: "I don't like being told what to do.", type: 8 },

  {
    id: "q25",
    statement: "I go along to keep the peace, even when I disagree.",
    type: 9,
  },
  {
    id: "q26",
    statement: "I have trouble knowing what I really want.",
    type: 9,
  },
  { id: "q27", statement: "I avoid conflict whenever I can.", type: 9 },
];

export function scoreQuiz(answers: Record<string, number>) {
  const totals: Record<number, number> = {};
  for (let t = 1; t <= 9; t++) totals[t] = 0;

  for (const q of QUIZ_QUESTIONS) {
    totals[q.type] += answers[q.id] ?? 0;
  }

  const sorted = Object.entries(totals)
    .map(([type, score]) => ({ type: Number(type), score }))
    .sort((a, b) => b.score - a.score);

  const primary = sorted[0].type;
  const left = primary === 1 ? 9 : primary - 1;
  const right = primary === 9 ? 1 : primary + 1;
  const wing = totals[left] >= totals[right] ? left : right;

  return { primary_type: primary, wing, totals };
}
