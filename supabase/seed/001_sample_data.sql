-- Insert sample chat rooms
INSERT INTO chat_room (id, name, is_public, tags) VALUES
('3fc9aa8a-81b7-4a60-92ce-066dcd9baa45', 'General Discussion', true, '{"general", "welcome", "community"}'),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Type 1 - Perfectionist', true, '{"type-1", "perfectionist", "reformer"}'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Type 2 - Helper', true, '{"type-2", "helper", "giver"}'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Type 3 - Achiever', true, '{"type-3", "achiever", "performer"}'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Type 4 - Individualist', true, '{"type-4", "individualist", "artist"}'),
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Type 5 - Investigator', true, '{"type-5", "investigator", "thinker"}'),
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'Type 6 - Loyalist', true, '{"type-6", "loyalist", "skeptic"}'),
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 'Type 7 - Enthusiast', true, '{"type-7", "enthusiast", "adventurer"}'),
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 'Type 8 - Challenger', true, '{"type-8", "challenger", "leader"}'),
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 'Type 9 - Peacemaker', true, '{"type-9", "peacemaker", "mediator"}'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Wings & Subtypes', true, '{"wings", "subtypes", "advanced"}'),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Growth & Integration', true, '{"growth", "integration", "development"}');

-- Note: User profiles and memberships will be created when users sign up and join rooms
-- This seed file only creates the initial room structure