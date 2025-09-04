-- Creating health journal tables for comprehensive health tracking
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_time TIME,
    mode VARCHAR(10) CHECK (mode IN ('voice', 'text')) DEFAULT 'text',
    transcript TEXT,
    summary TEXT,
    content TEXT,
    free_notes TEXT,
    event_type VARCHAR(50),
    
    -- Health metrics
    mood INTEGER CHECK (mood >= 1 AND mood <= 5),
    sleep_hours DECIMAL(4,2),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
    
    -- Arrays for symptoms and medications
    symptoms TEXT[],
    medications TEXT[],
    tags TEXT[],
    
    -- File attachments
    attachments TEXT[],
    images TEXT[],
    
    -- Metadata
    is_voice_entry BOOLEAN DEFAULT false,
    confidence_score DECIMAL(3,2),
    processing_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    period VARCHAR(20) CHECK (period IN ('week', 'month', 'quarter')),
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    highlights TEXT[],
    trends TEXT[],
    anomalies TEXT[],
    correlations JSONB DEFAULT '[]',
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for health journal
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_child ON journal_entries(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_symptoms ON journal_entries USING GIN(symptoms);
CREATE INDEX IF NOT EXISTS idx_journal_entries_medications ON journal_entries USING GIN(medications);
CREATE INDEX IF NOT EXISTS idx_journal_insights_user_child ON journal_insights(user_id, child_id);
