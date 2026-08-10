// src/lib/types-data.ts

export type Triad = "head" | "heart" | "body";

const TRIAD_INFO: Record<Triad, string> = {
    head: "Head types navigate the world through thinking — anticipating, analyzing, and planning before they act.",
    heart: "Heart types navigate the world through feeling — image, connection, and how they're seen by others.",
    body: "Body types navigate the world through instinct — gut response, control, and a felt sense of right and wrong.",
};

export const TYPES = [
    {
        n: 1,
        name: "The Reformer",
        theme: "integrity",
        blurb: "Principled, purposeful, driven to do things the right way.",
        core: "Fears being wrong or corrupt; driven by the need to be good and improve things.",
        wing: "Leans toward either the loyalty of Type 9 or the empathy of Type 2.",
        coreFear: "Being corrupt, wrong, or defective.",
        coreDesire: "To be good, balanced, and have integrity.",
        growth:
            "Under growth, Type 1 loosens up like a healthy Type 7 — more spontaneous, less rigid about 'right.'",
        stress:
            "Under stress, Type 1 can turn moody and withdrawn like an unhealthy Type 4.",
        triad: "body" as Triad,
        longDescription:
            "Ones run on an internal sense of how things ought to be, and they hold themselves to that standard before they ever ask it of anyone else. There's a quiet, constant editor running in the background — noticing the typo, the shortcut, the thing left undone — which makes them exceptional at improving almost anything they touch, but exhausting to be that editor for yourself all day.",
        strengths: [
            "Reliable follow-through — if a One says they'll do it, it gets done properly",
            "Sharp eye for what's inefficient, unfair, or just not good enough yet",
            "Genuinely ethical under pressure, not just when it's convenient",
        ],
        challenges: [
            "Inner critic that rarely takes a day off",
            "Difficulty relaxing or feeling 'finished'",
            "Can come across as rigid or judgmental without meaning to",
        ],
        relationships:
            "Ones show love through consistency and doing things properly for the people they care about — but can struggle to voice needs of their own, or to let a partner's 'good enough' actually be good enough. They do best with people who can gently call out the inner critic instead of feeding it.",
        atWork:
            "Excellent at quality control, process, and follow-through. Thrives with clear standards and a real say in how things are done; struggles under sloppy leadership or when told to 'just wing it.'",
        growthTips: [
            "Practice calling something 'done' before it feels perfect",
            "Separate the mistake from your worth — one bad decision isn't corruption",
            "Schedule actual unstructured time, and protect it like a deadline",
        ],
    },
    {
        n: 2,
        name: "The Helper",
        theme: "connection",
        blurb: "Warm, attentive, finds meaning in being needed.",
        core: "Fears being unloved or unwanted; driven by the need to be needed.",
        wing: "Leans toward the idealism of Type 1 or the ambition of Type 3.",
        coreFear: "Being unloved or unwanted.",
        coreDesire: "To feel loved and needed.",
        growth:
            "Under growth, Type 2 becomes more self-aware like a healthy Type 4 — able to name their own needs.",
        stress:
            "Under stress, Type 2 can become aggressive or demanding like an unhealthy Type 8.",
        triad: "heart" as Triad,
        longDescription:
            "Twos read a room's emotional temperature almost automatically, and they move toward whoever needs something before it's even asked. That radar is a genuine gift — but it's easy for a Two to build an entire identity around being indispensable to everyone else, while quietly losing track of what they themselves actually want.",
        strengths: [
            "Intuitive read on what people need, often before they say it",
            "Generous, warm, and genuinely good at making others feel seen",
            "Builds deep, loyal relationships that last",
        ],
        challenges: [
            "Trouble asking for help or admitting a need",
            "Can overextend and quietly resent it later",
            "Ties self-worth too closely to being useful to others",
        ],
        relationships:
            "Twos love expressively — remembering details, showing up, anticipating needs — but can struggle when that generosity isn't reciprocated, or when they've given so much they've lost track of themselves in the relationship. They flourish with partners who ask 'what do you need?' first.",
        atWork:
            "Natural at anything relationship-facing — team glue, client care, mentoring. Best in roles where their support is actually valued, not just quietly expected; burns out fast in environments that take generosity for granted.",
        growthTips: [
            "Practice naming one personal need out loud each day",
            "Notice the moment you're helping to be liked, versus helping because you want to",
            "Let someone help you without immediately reciprocating",
        ],
    },
    {
        n: 3,
        name: "The Achiever",
        theme: "drive",
        blurb: "Ambitious, adaptable, measures worth through accomplishment.",
        core: "Fears being worthless; driven by the need to succeed and be admired.",
        wing: "Leans toward the warmth of Type 2 or the depth of Type 4.",
        coreFear: "Being worthless without achievement.",
        coreDesire: "To feel valuable and worthwhile.",
        growth:
            "Under growth, Type 3 becomes more cooperative and genuine like a healthy Type 6.",
        stress:
            "Under stress, Type 3 can withdraw and disengage like an unhealthy Type 9.",
        triad: "heart" as Triad,
        longDescription:
            "Threes are built for momentum — they read what a room or a goal requires and adapt to deliver it, fast. That adaptability makes them genuinely effective, but it can also mean the line between 'who I actually am' and 'who gets results here' gets blurry, especially if achievement has been the main source of approval for a long time.",
        strengths: [
            "Efficient, driven, and genuinely good at getting things across the finish line",
            "Reads what a situation calls for and adapts quickly",
            "Naturally motivating to be around when engaged",
        ],
        challenges: [
            "Worth feels conditional on the last accomplishment",
            "Can present a polished image instead of an honest one",
            "Struggles to slow down or sit with 'unproductive' feelings",
        ],
        relationships:
            "Threes bring energy and momentum to a relationship, but can default to performing the role of 'good partner' instead of being emotionally present in it. They do best with people who value them outside of what they're accomplishing, and who notice when the image is standing in for the real thing.",
        atWork:
            "Natural high performer — goal-oriented, adaptable, good under a deadline. Needs work that's actually meaningful to them, not just impressive on paper, or the drive curdles into burnout.",
        growthTips: [
            "Ask what you'd want to do if no one were watching or grading it",
            "Let people see you before you've 'earned' it with a result",
            "Practice resting without treating it as wasted time",
        ],
    },
    {
        n: 4,
        name: "The Individualist",
        theme: "identity",
        blurb: "Expressive, introspective, drawn to what feels authentic.",
        core: "Fears having no identity; driven by the need to be uniquely themselves.",
        wing: "Leans toward the drive of Type 3 or the caution of Type 5.",
        coreFear: "Having no identity or personal significance.",
        coreDesire: "To find themselves and their significance.",
        growth:
            "Under growth, Type 4 becomes more disciplined and grounded like a healthy Type 1.",
        stress:
            "Under stress, Type 4 can become clingy or overly dependent like an unhealthy Type 2.",
        triad: "heart" as Triad,
        longDescription:
            "Fours feel things at a depth that can be genuinely hard to translate into words for other people, so they often reach for creative or symbolic ways to express it instead. There's real richness in that inner world — but a persistent undertow too: a sense of being fundamentally different from everyone else, which can tip into isolation if it's not caught.",
        strengths: [
            "Emotionally honest and unusually self-aware",
            "Creative, often with a distinctive personal voice",
            "Deeply empathetic toward others' pain",
        ],
        challenges: [
            "Can romanticize longing over what's actually present",
            "Comparison — measuring their insides against someone else's outside",
            "Mood can swing the whole day's tone",
        ],
        relationships:
            "Fours want depth, not small talk — real emotional intimacy and a partner who can sit with the full range of what they feel. Idealizing what's absent (an ex, a fantasy version of the relationship) is a common trap; presence over longing is the growth edge.",
        atWork:
            "Strong in creative, expressive, or meaning-driven roles. Struggles with rigid structure or feeling like 'just another employee' — needs some room for their own voice in the work.",
        growthTips: [
            "Notice when you're romanticizing what's missing instead of engaging what's here",
            "Build small daily structure — it steadies mood more than it restricts it",
            "Share the feeling with someone before it fully takes over",
        ],
    },
    {
        n: 5,
        name: "The Investigator",
        theme: "insight",
        blurb: "Curious, self-contained, needs to understand before engaging.",
        core: "Fears being useless or overwhelmed; driven by the need to understand.",
        wing: "Leans toward the depth of Type 4 or the vigilance of Type 6.",
        coreFear: "Being useless, incapable, or overwhelmed.",
        coreDesire: "To be capable and competent.",
        growth:
            "Under growth, Type 5 becomes more decisive and engaged like a healthy Type 8.",
        stress:
            "Under stress, Type 5 can become scattered and reactive like an unhealthy Type 7.",
        triad: "head" as Triad,
        longDescription:
            "Fives conserve their energy carefully and spend it on understanding — going deep on the things that genuinely interest them, often alone, often for longer than most people would. That depth is real expertise, but it comes with a tendency to retreat into the head and away from people right when connection matters most.",
        strengths: [
            "Deep, independent thinker — genuinely good at complex problems",
            "Calm under pressure; doesn't panic easily",
            "Respects others' autonomy the way they want their own respected",
        ],
        challenges: [
            "Withdraws instead of engaging when overwhelmed",
            "Can intellectualize feelings instead of actually feeling them",
            "Guards time and energy so closely it can read as distant",
        ],
        relationships:
            "Fives need real alone time to recharge, and can misread as cold when they're actually just conserving. They love through shared understanding more than constant contact — a partner who doesn't take the need for space personally is a good match.",
        atWork:
            "Excellent for research, analysis, and deep-focus work. Struggles with constant interruptions, open floor plans, or being expected to think out loud in real time before they've processed.",
        growthTips: [
            "Share a half-formed thought instead of waiting until it's fully worked out",
            "Notice when withdrawing is protecting you versus just avoiding discomfort",
            "Let someone in on what's actually going on, not just the conclusion",
        ],
    },
    {
        n: 6,
        name: "The Loyalist",
        theme: "security",
        blurb: "Committed, vigilant, prepares for what could go wrong.",
        core: "Fears being without support or guidance; driven by the need for security.",
        wing: "Leans toward the caution of Type 5 or the spontaneity of Type 7.",
        coreFear: "Being without support or guidance.",
        coreDesire: "To have security and support.",
        growth:
            "Under growth, Type 6 becomes more relaxed and trusting like a healthy Type 9.",
        stress:
            "Under stress, Type 6 can become competitive and arrogant like an unhealthy Type 3.",
        triad: "head" as Triad,
        longDescription:
            "Sixes scan for what could go wrong so they can be ready for it — a habit that makes them genuinely excellent at troubleshooting, loyalty, and standing by people when it counts. The same scanning can also spiral into doubt, both of the world and of their own judgment, which is exhausting to run on repeat.",
        strengths: [
            "Sees risks and blind spots others miss",
            "Fiercely loyal once trust is earned",
            "Great in a crisis — has usually already thought it through",
        ],
        challenges: [
            "Chronic second-guessing, even after deciding",
            "Can project worst-case scenarios onto neutral situations",
            "Trust takes time to build and is easily shaken",
        ],
        relationships:
            "Sixes commit hard once they trust someone, and that loyalty runs deep — but reassurance-seeking or testing a partner's commitment can strain the relationship if the underlying anxiety isn't named directly. Consistency from a partner matters more than grand gestures.",
        atWork:
            "Strong in roles that need contingency planning, quality checks, or steady follow-through under pressure. Struggles with unclear authority or leadership that changes direction without explanation — ambiguity is the real stressor, not the risk itself.",
        growthTips: [
            "Name the specific fear out loud instead of letting it stay vague and huge",
            "Notice when you already know the answer and are just seeking reassurance",
            "Practice trusting your own read before checking it against everyone else's",
        ],
    },
    {
        n: 7,
        name: "The Enthusiast",
        theme: "possibility",
        blurb: "Spontaneous, optimistic, chases the next open door.",
        core: "Fears being trapped in pain; driven by the need to stay engaged and satisfied.",
        wing: "Leans toward the vigilance of Type 6 or the strength of Type 8.",
        coreFear: "Being trapped in pain or deprivation.",
        coreDesire: "To be satisfied and content.",
        growth:
            "Under growth, Type 7 becomes more focused and present like a healthy Type 5.",
        stress:
            "Under stress, Type 7 can become controlling and rigid like an unhealthy Type 1.",
        triad: "head" as Triad,
        longDescription:
            "Sevens keep multiple doors open at once — plans, interests, possibilities — because momentum feels like safety and stillness can feel like a trap. That appetite for life is genuinely infectious, but it's also a well-practiced way to outrun anything uncomfortable rather than actually sit with it.",
        strengths: [
            "Contagious optimism and energy",
            "Quick, creative thinker — connects ideas fast",
            "Resilient; bounces back from setbacks faster than most",
        ],
        challenges: [
            "Avoids difficult emotions by staying busy or moving on",
            "Can start more than they finish",
            "Restlessness can read as flakiness to others",
        ],
        relationships:
            "Sevens bring spontaneity and fun, but can flee conflict or heavy emotional moments instead of staying in them. Partners who can gently hold a Seven in the hard conversation — without shutting down the joy that makes them who they are — bring out their best.",
        atWork:
            "Great at brainstorming, pivoting, and keeping morale up. Struggles with repetitive tasks or long execution phases once the novelty wears off — needs a reason the follow-through still matters.",
        growthTips: [
            "Finish one thing before starting the next exciting idea",
            "Sit with a hard feeling for five extra minutes before distracting from it",
            "Notice the impulse to reframe pain as a joke, and let it just be hard sometimes",
        ],
    },
    {
        n: 8,
        name: "The Challenger",
        theme: "control",
        blurb: "Direct, decisive, protects what and who they care about.",
        core: "Fears being controlled or harmed; driven by the need for self-determination.",
        wing: "Leans toward the openness of Type 7 or the calm of Type 9.",
        coreFear: "Being controlled or harmed by others.",
        coreDesire: "To protect themselves and be in control of their own life.",
        growth:
            "Under growth, Type 8 becomes more open and vulnerable like a healthy Type 2.",
        stress:
            "Under stress, Type 8 can become withdrawn and secretive like an unhealthy Type 5.",
        triad: "body" as Triad,
        longDescription:
            "Eights move through the world assuming they'll need to protect themselves, so they get there first — leading, deciding, pushing back before anyone can push on them. That instinct makes them formidable allies and protectors, but it can also mean vulnerability gets buried so deep that even the Eight loses touch with it.",
        strengths: [
            "Decisive and unafraid to take charge when it's needed",
            "Fiercely protective of people they consider theirs",
            "Direct — you always know where you stand with them",
        ],
        challenges: [
            "Can dominate a room without meaning to",
            "Struggles to show vulnerability, even to people they trust",
            "Tests people's loyalty in ways that can feel confrontational",
        ],
        relationships:
            "Eights love with intensity and loyalty, and expect the same honesty back — soft, indirect communication tends to frustrate them. The real intimacy comes when they let themselves be seen as something other than strong, which takes real trust to offer.",
        atWork:
            "Natural leader — decisive, protective of the team, good in a crisis. Struggles with micromanagement from above or feeling like their authority is being quietly undermined.",
        growthTips: [
            "Practice naming a soft feeling out loud instead of converting it to anger or action",
            "Ask before assuming you need to take control of a situation",
            "Let someone help you without treating it as owing them something",
        ],
    },
    {
        n: 9,
        name: "The Peacemaker",
        theme: "harmony",
        blurb: "Easygoing, steady, seeks to keep things whole.",
        core: "Fears loss of connection or conflict; driven by the need for peace.",
        wing: "Leans toward the strength of Type 8 or the principle of Type 1.",
        coreFear: "Loss of connection or fragmentation.",
        coreDesire: "To have inner stability and peace of mind.",
        growth:
            "Under growth, Type 9 becomes more energized and decisive like a healthy Type 3.",
        stress:
            "Under stress, Type 9 can become anxious and worst-case-thinking like an unhealthy Type 6.",
        triad: "body" as Triad,
        longDescription:
            "Nines merge easily with the people and moods around them, which makes them exceptionally easy to be around and genuinely good at seeing every side of a disagreement. The cost is a quieter one: their own preferences and priorities can get buried under everyone else's, until even the Nine isn't sure what they actually want.",
        strengths: [
            "Genuinely sees and validates multiple perspectives",
            "Calm, steady presence that de-escalates tension",
            "Easy to work and live with — low ego, low friction",
        ],
        challenges: [
            "Avoids conflict even when it needs addressing",
            "Can lose track of their own priorities in others' agendas",
            "Procrastinates on things that feel effortful or stressful",
        ],
        relationships:
            "Nines are steady, accommodating partners, but can quietly withdraw or 'check out' rather than raise a real disagreement — which builds distance faster than the disagreement would have. Naming a preference out loud, even a small one, is real growth for a Nine in a relationship.",
        atWork:
            "Excellent mediator and team stabilizer — good at keeping a group aligned. Struggles with self-advocacy in review conversations and can under-sell their own contributions.",
        growthTips: [
            "Say your actual preference before defaulting to 'whatever works'",
            "Notice when 'staying calm' is actually avoiding something that needs saying",
            "Set one small daily priority for yourself before anyone else's agenda enters",
        ],
    },
] as const;

export function getType(n: number) {
    return TYPES.find((t) => t.n === n);
}

export function getTriadInfo(triad: Triad) {
    return TRIAD_INFO[triad];
}

export function getTriadLabel(triad: Triad) {
    return triad === "head" ? "Head" : triad === "heart" ? "Heart" : "Body";
}
