-- Creating milestone tracking tables for developmental progress
CREATE TABLE IF NOT EXISTS milestone_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_key VARCHAR(10) NOT NULL,
    age_months_min INTEGER NOT NULL,
    age_months_max INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestone_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES milestone_checklists(id) ON DELETE CASCADE,
    category VARCHAR(20) CHECK (category IN ('social', 'language', 'cognitive', 'movement')) NOT NULL,
    label TEXT NOT NULL,
    help_text TEXT,
    is_key_item BOOLEAN DEFAULT false,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    media_src TEXT,
    media_alt TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestone_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    checklist_id UUID NOT NULL REFERENCES milestone_checklists(id),
    milestone_item_id UUID NOT NULL REFERENCES milestone_items(id),
    response VARCHAR(10) CHECK (response IN ('yes', 'not_yet', 'not_sure')) NOT NULL,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(child_id, milestone_item_id)
);

CREATE TABLE IF NOT EXISTS milestone_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_key VARCHAR(10) NOT NULL,
    category VARCHAR(20),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    activity_duration INTEGER, -- in minutes
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    materials_needed TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestone_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tip_id UUID NOT NULL REFERENCES milestone_tips(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, tip_id)
);

-- Indexes for milestones
CREATE INDEX IF NOT EXISTS idx_milestone_responses_child ON milestone_responses(child_id);
CREATE INDEX IF NOT EXISTS idx_milestone_responses_checklist ON milestone_responses(checklist_id);
CREATE INDEX IF NOT EXISTS idx_milestone_items_checklist ON milestone_items(checklist_id);
CREATE INDEX IF NOT EXISTS idx_milestone_tips_age ON milestone_tips(age_key);
CREATE INDEX IF NOT EXISTS idx_milestone_bookmarks_user ON milestone_bookmarks(user_id);
