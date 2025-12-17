-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profile table
CREATE TABLE user_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_url TEXT,
    enneagram_type INTEGER CHECK (enneagram_type >= 1 AND enneagram_type <= 9),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_room table
CREATE TABLE chat_room (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_room_member table
CREATE TABLE chat_room_member (
    chat_room_id UUID REFERENCES chat_room(id) ON DELETE CASCADE,
    member_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (chat_room_id, member_id)
);

-- Create message table
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    author_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    chat_room_id UUID REFERENCES chat_room(id) ON DELETE CASCADE,
    reply_to UUID REFERENCES message(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_reactions table
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES message(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Create indexes
CREATE INDEX idx_message_chat_room_id ON message(chat_room_id);
CREATE INDEX idx_message_created_at ON message(created_at DESC);
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_chat_room_member_member_id ON chat_room_member(member_id);