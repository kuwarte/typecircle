// src/lib/types-data.ts
export const TYPES = [
  {
    n: 1,
    name: "The Reformer",
    theme: "integrity",
    blurb: "Principled, purposeful, driven to do things the right way.",
    core: "Fears being wrong or corrupt; driven by the need to be good and improve things.",
    wing: "Leans toward either the loyalty of Type 9 or the empathy of Type 2.",
  },
  {
    n: 2,
    name: "The Helper",
    theme: "connection",
    blurb: "Warm, attentive, finds meaning in being needed.",
    core: "Fears being unloved or unwanted; driven by the need to be needed.",
    wing: "Leans toward the idealism of Type 1 or the ambition of Type 3.",
  },
  {
    n: 3,
    name: "The Achiever",
    theme: "drive",
    blurb: "Ambitious, adaptable, measures worth through accomplishment.",
    core: "Fears being worthless; driven by the need to succeed and be admired.",
    wing: "Leans toward the warmth of Type 2 or the depth of Type 4.",
  },
  {
    n: 4,
    name: "The Individualist",
    theme: "identity",
    blurb: "Expressive, introspective, drawn to what feels authentic.",
    core: "Fears having no identity; driven by the need to be uniquely themselves.",
    wing: "Leans toward the drive of Type 3 or the caution of Type 5.",
  },
  {
    n: 5,
    name: "The Investigator",
    theme: "insight",
    blurb: "Curious, self-contained, needs to understand before engaging.",
    core: "Fears being useless or overwhelmed; driven by the need to understand.",
    wing: "Leans toward the depth of Type 4 or the vigilance of Type 6.",
  },
  {
    n: 6,
    name: "The Loyalist",
    theme: "security",
    blurb: "Committed, vigilant, prepares for what could go wrong.",
    core: "Fears being without support or guidance; driven by the need for security.",
    wing: "Leans toward the caution of Type 5 or the spontaneity of Type 7.",
  },
  {
    n: 7,
    name: "The Enthusiast",
    theme: "possibility",
    blurb: "Spontaneous, optimistic, chases the next open door.",
    core: "Fears being trapped in pain; driven by the need to stay engaged and satisfied.",
    wing: "Leans toward the vigilance of Type 6 or the strength of Type 8.",
  },
  {
    n: 8,
    name: "The Challenger",
    theme: "control",
    blurb: "Direct, decisive, protects what and who they care about.",
    core: "Fears being controlled or harmed; driven by the need for self-determination.",
    wing: "Leans toward the openness of Type 7 or the calm of Type 9.",
  },
  {
    n: 9,
    name: "The Peacemaker",
    theme: "harmony",
    blurb: "Easygoing, steady, seeks to keep things whole.",
    core: "Fears loss of connection or conflict; driven by the need for peace.",
    wing: "Leans toward the strength of Type 8 or the principle of Type 1.",
  },
] as const;

export function getType(n: number) {
  return TYPES.find((t) => t.n === n);
}
