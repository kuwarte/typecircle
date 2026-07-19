-- supabase/migrations/20260719000001_create_enneagram_types.sql

create table public.enneagram_types (
  id            int primary key check (id between 1 and 9),
  name          text not null,
  theme         text not null,
  blurb         text not null,
  wing_label    text not null,
  core_fear     text not null,
  core_desire   text not null,
  color_hex     text not null
);

alter table public.enneagram_types enable row level security;

create policy "Enneagram types are viewable by everyone"
  on public.enneagram_types for select
  using (true);

insert into public.enneagram_types (id, name, theme, blurb, wing_label, core_fear, core_desire, color_hex) values
(1, 'The Reformer', 'the perfectionist',
  'Principled and purposeful, driven by a deep sense of right and wrong.',
  '1w9 / 1w2', 'Being corrupt, wrong, or defective', 'To be good, balanced, and have integrity',
  '#C97B4A'),
(2, 'The Helper', 'the giver',
  'Warm and attentive, finding meaning in showing up for others.',
  '2w1 / 2w3', 'Being unloved or unwanted', 'To feel loved and needed',
  '#D65D6E'),
(3, 'The Achiever', 'the driver',
  'Adaptive and image-conscious, motivated by accomplishment and recognition.',
  '3w2 / 3w4', 'Being worthless without achievement', 'To feel valuable and worthwhile',
  '#D9A73B'),
(4, 'The Individualist', 'the romantic',
  'Introspective and expressive, searching for identity and meaning.',
  '4w3 / 4w5', 'Having no identity or personal significance', 'To find themselves and their significance',
  '#7B5EA7'),
(5, 'The Investigator', 'the observer',
  'Curious and self-sufficient, seeking understanding before engagement.',
  '5w4 / 5w6', 'Being useless, incapable, or overwhelmed', 'To be capable and competent',
  '#4C6B8A'),
(6, 'The Loyalist', 'the guardian',
  'Committed and vigilant, valuing security and trustworthy connection.',
  '6w5 / 6w7', 'Being without support or guidance', 'To have security and support',
  '#4A7A8C'),
(7, 'The Enthusiast', 'the explorer',
  'Spontaneous and upbeat, chasing new experiences and possibilities.',
  '7w6 / 7w8', 'Being trapped in pain or deprivation', 'To be satisfied and content',
  '#E08A3E'),
(8, 'The Challenger', 'the protector',
  'Assertive and self-reliant, driven to control their own life and protect others.',
  '8w7 / 8w9', 'Being controlled or harmed by others', 'To protect themselves and be in control of their own life',
  '#A23B3B'),
(9, 'The Peacemaker', 'the mediator',
  'Easygoing and accommodating, seeking harmony above all else.',
  '9w8 / 9w1', 'Loss of connection or fragmentation', 'To have inner stability and peace of mind',
  '#5B8C5A');