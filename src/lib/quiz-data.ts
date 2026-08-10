// src/lib/quiz-data.ts
//
// SCORING METHODOLOGY (documented here since it's the source of truth):
// - Each statement is rated on a 1-5 Likert scale (1 = "Not me", 5 = "Very me").
// - 6 statements per Enneagram type = 54 questions total.
// - Question order is shuffled per quiz attempt (see shuffleQuestions) so
//   type-grouped statements don't appear back-to-back, which reduces
//   order/priming effects and straight-lining (picking the same rating
//   repeatedly without reading).
// - Scores are normalized per-person: each type's average rating is compared
//   against that person's own average rating across all answered questions.
//   This corrects for acquiescence bias — people who tend to rate everything
//   high (or low) don't just win on raw totals. See scoreQuiz() below.
// - If the top two types are within a narrow margin on the normalized scale,
//   the result is flagged as "close" rather than presented as a confident,
//   singular type.

export type QuizQuestion = {
    id: string;
    statement: string;
    type: number; // which Enneagram type (1-9) this statement reflects
};

// 6 statements per type = 54 questions total, rated 1-5 agreement
export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // Type 1 — The Reformer
    { id: "q1", statement: "I hold myself to very high standards.", type: 1 },
    { id: "q2", statement: "I notice what's wrong before what's right.", type: 1 },
    {
        id: "q3",
        statement: "I feel responsible for doing things the 'correct' way.",
        type: 1,
    },
    {
        id: "q28",
        statement: "I get frustrated when others cut corners.",
        type: 1,
    },
    {
        id: "q29",
        statement: "I have a strong inner voice that critiques my own actions.",
        type: 1,
    },
    {
        id: "q30",
        statement: "I believe there's usually a 'right' way to do things.",
        type: 1,
    },

    // Type 2 — The Helper
    { id: "q4", statement: "I go out of my way to help people close to me.", type: 2 },
    { id: "q5", statement: "I struggle to ask for help myself.", type: 2 },
    { id: "q6", statement: "I feel most valued when I'm needed.", type: 2 },
    {
        id: "q31",
        statement: "I can tell what someone needs before they say it.",
        type: 2,
    },
    {
        id: "q32",
        statement: "I sometimes give more than I have to give.",
        type: 2,
    },
    {
        id: "q33",
        statement: "My relationships are one of the first things I think about in my day.",
        type: 2,
    },

    // Type 3 — The Achiever
    {
        id: "q7",
        statement: "I'm driven to succeed and be recognized for it.",
        type: 3,
    },
    { id: "q8", statement: "I adapt my image depending on who I'm with.", type: 3 },
    { id: "q9", statement: "I measure my worth by what I accomplish.", type: 3 },
    {
        id: "q34",
        statement: "I keep a mental scoreboard of my achievements.",
        type: 3,
    },
    {
        id: "q35",
        statement: "I find it hard to slow down or do nothing.",
        type: 3,
    },
    {
        id: "q36",
        statement: "I present a polished version of myself in most settings.",
        type: 3,
    },

    // Type 4 — The Individualist
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
    { id: "q12", statement: "I want to be seen as unique, not ordinary.", type: 4 },
    {
        id: "q37",
        statement: "I often compare my inner life to other people's outer life.",
        type: 4,
    },
    {
        id: "q38",
        statement: "I express myself through what I make, wear, or create.",
        type: 4,
    },
    {
        id: "q39",
        statement: "I can dwell in a feeling longer than most people would.",
        type: 4,
    },

    // Type 5 — The Investigator
    { id: "q13", statement: "I need time alone to recharge and think.", type: 5 },
    { id: "q14", statement: "I prefer observing before participating.", type: 5 },
    {
        id: "q15",
        statement: "I feel uncomfortable when others expect too much of my energy.",
        type: 5,
    },
    {
        id: "q40",
        statement: "I'd rather understand something deeply than talk about it casually.",
        type: 5,
    },
    {
        id: "q41",
        statement: "I keep my personal life fairly private.",
        type: 5,
    },
    {
        id: "q42",
        statement: "I feel drained by too much social contact, even with people I like.",
        type: 5,
    },

    // Type 6 — The Loyalist
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
        id: "q43",
        statement: "I look to trusted people or systems before acting alone.",
        type: 6,
    },
    {
        id: "q44",
        statement: "I notice risks that other people seem to miss.",
        type: 6,
    },
    {
        id: "q45",
        statement: "I feel steadier when I know what to expect.",
        type: 6,
    },

    // Type 7 — The Enthusiast
    { id: "q19", statement: "I look for the upside in most situations.", type: 7 },
    {
        id: "q20",
        statement: "I get restless doing the same thing for too long.",
        type: 7,
    },
    { id: "q21", statement: "I avoid dwelling on pain or discomfort.", type: 7 },
    {
        id: "q46",
        statement: "I like keeping my options open rather than committing early.",
        type: 7,
    },
    {
        id: "q47",
        statement: "I turn hard moments into a story or a joke pretty quickly.",
        type: 7,
    },
    {
        id: "q48",
        statement: "I have several interests or plans going at once.",
        type: 7,
    },

    // Type 8 — The Challenger
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
        id: "q49",
        statement: "I take charge naturally in group situations.",
        type: 8,
    },
    {
        id: "q50",
        statement: "I test people to see if they can handle being challenged.",
        type: 8,
    },
    {
        id: "q51",
        statement: "I'd rather confront a problem head-on than let it simmer.",
        type: 8,
    },

    // Type 9 — The Peacemaker
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
    {
        id: "q52",
        statement: "I can see multiple sides of an argument almost too easily.",
        type: 9,
    },
    {
        id: "q53",
        statement: "I procrastinate on things that feel stressful or urgent.",
        type: 9,
    },
    {
        id: "q54",
        statement: "I settle into routines that keep life comfortable.",
        type: 9,
    },
];

export type ScoredQuizResult = {
    primary_type: number;
    wing: number;
    totals: Record<number, number>;
    /** Per-type average rating, centered against this person's own average
     *  rating across all answered questions. Corrects for people who rate
     *  everything high (or low) so raw totals don't just crown whichever
     *  type's statements happened to get the highest numbers. */
    normalized: Record<number, number>;
    /** True when the top two types are within a small margin of each
     *  other on the normalized scale — i.e. the "winner" is close enough
     *  that it shouldn't be presented as a confident, singular result. */
    isClose: boolean;
    secondaryType?: number;
};

const CLOSE_MARGIN = 0.15;

export function scoreQuiz(answers: Record<string, number>): ScoredQuizResult {
    const totals: Record<number, number> = {};
    const counts: Record<number, number> = {};
    for (let t = 1; t <= 9; t++) {
        totals[t] = 0;
        counts[t] = 0;
    }

    for (const q of QUIZ_QUESTIONS) {
        const raw = answers[q.id] ?? 0;
        totals[q.type] += raw;
        counts[q.type] += raw > 0 ? 1 : 0;
    }

    const answeredValues = Object.values(answers).filter((v) => v > 0);
    const personMean = answeredValues.length
        ? answeredValues.reduce((a, b) => a + b, 0) / answeredValues.length
        : 3;

    const normalized: Record<number, number> = {};
    for (let t = 1; t <= 9; t++) {
        const avg = counts[t] ? totals[t] / counts[t] : 0;
        normalized[t] = avg - personMean;
    }

    const sorted = Object.entries(normalized)
        .map(([type, score]) => ({ type: Number(type), score }))
        .sort((a, b) => b.score - a.score);

    const primary = sorted[0].type;
    const secondary = sorted[1]?.type;
    const isClose =
        sorted.length > 1 && Math.abs(sorted[0].score - sorted[1].score) < CLOSE_MARGIN;

    const left = primary === 1 ? 9 : primary - 1;
    const right = primary === 9 ? 1 : primary + 1;
    const wing = totals[left] >= totals[right] ? left : right;

    return {
        primary_type: primary,
        wing,
        totals,
        normalized,
        isClose,
        secondaryType: isClose ? secondary : undefined,
    };
}

/** Fisher-Yates shuffle. Used to randomize question order per quiz attempt
 *  so type-grouped statements aren't shown back-to-back — this reduces
 *  order effects and makes straight-lining (rating everything the same
 *  without reading) more noticeable to the person taking it. */
export function shuffleQuestions(
    questions: QuizQuestion[] = QUIZ_QUESTIONS,
): QuizQuestion[] {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/** Rebuilds an ordered question list from a saved array of ids (used to
 *  resume a shuffled quiz from sessionStorage with the same order it was
 *  started in). Falls back to a fresh shuffle if ids don't match. */
export function orderQuestionsById(ids: string[]): QuizQuestion[] {
    const byId = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as QuizQuestion[];
    return ordered.length === QUIZ_QUESTIONS.length ? ordered : shuffleQuestions();
}
