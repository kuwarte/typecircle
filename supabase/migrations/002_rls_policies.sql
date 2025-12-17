-- Enable Row Level Security
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profile
CREATE POLICY "Users can view all profiles" ON user_profile FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profile FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for chat_room
CREATE POLICY "Anyone can view public rooms" ON chat_room FOR SELECT USING (is_public = true);
CREATE POLICY "Members can view joined rooms" ON chat_room FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM chat_room_member 
        WHERE chat_room_member.chat_room_id = chat_room.id 
        AND chat_room_member.member_id = auth.uid()
    )
);
CREATE POLICY "Authenticated users can create rooms" ON chat_room FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for chat_room_member
CREATE POLICY "Users can view room memberships" ON chat_room_member FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON chat_room_member FOR INSERT WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Users can leave rooms" ON chat_room_member FOR DELETE USING (auth.uid() = member_id);

-- RLS Policies for message
CREATE POLICY "Room members can view messages" ON message FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM chat_room_member 
        WHERE chat_room_member.chat_room_id = message.chat_room_id 
        AND chat_room_member.member_id = auth.uid()
    )
);
CREATE POLICY "Room members can send messages" ON message FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
        SELECT 1 FROM chat_room_member 
        WHERE chat_room_member.chat_room_id = message.chat_room_id 
        AND chat_room_member.member_id = auth.uid()
    )
);

-- RLS Policies for message_reactions
CREATE POLICY "Room members can view reactions" ON message_reactions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM message m
        JOIN chat_room_member crm ON m.chat_room_id = crm.chat_room_id
        WHERE m.id = message_reactions.message_id 
        AND crm.member_id = auth.uid()
    )
);
CREATE POLICY "Users can manage own reactions" ON message_reactions FOR ALL USING (auth.uid() = user_id);