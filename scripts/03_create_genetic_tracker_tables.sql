-- Creating genetic tracker tables for symptoms, nutrition, and medication tracking
CREATE TABLE IF NOT EXISTS tracker_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    emoji VARCHAR(10),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracker_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES tracker_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji VARCHAR(10),
    is_pinned BOOLEAN DEFAULT false,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracker_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES tracker_categories(id),
    type_id UUID REFERENCES tracker_types(id),
    
    -- Common fields
    entry_date DATE NOT NULL,
    entry_time TIME,
    notes TEXT,
    
    -- Symptom-specific fields
    symptom_name VARCHAR(200),
    symptom_severity INTEGER CHECK (symptom_severity >= 1 AND symptom_severity <= 10),
    symptom_duration INTEGER, -- in minutes
    symptom_location VARCHAR(100),
    symptom_triggers TEXT[],
    symptom_context VARCHAR(200),
    associated_symptoms TEXT[],
    impact_on_activities INTEGER CHECK (impact_on_activities >= 1 AND impact_on_activities <= 5),
    recovery_time INTEGER, -- in minutes
    
    -- Nutrition-specific fields
    food_items TEXT[],
    portion_size VARCHAR(50),
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'other')),
    hunger_before INTEGER CHECK (hunger_before >= 1 AND hunger_before <= 5),
    hunger_after INTEGER CHECK (hunger_after >= 1 AND hunger_after <= 5),
    preparation_method VARCHAR(100),
    eating_location VARCHAR(100),
    allergic_reactions TEXT[],
    food_preferences JSONB,
    
    -- Medication-specific fields
    medication_name VARCHAR(200),
    dosage VARCHAR(100),
    administration_route VARCHAR(50),
    reason_for_taking TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    side_effects TEXT[],
    missed_doses INTEGER DEFAULT 0,
    interaction_concerns TEXT[],
    prescriber VARCHAR(200),
    
    -- Genetic condition filtering
    genetic_conditions TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for genetic tracker
CREATE INDEX IF NOT EXISTS idx_tracker_entries_user_child ON tracker_entries(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_tracker_entries_category ON tracker_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_tracker_entries_date ON tracker_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_tracker_entries_conditions ON tracker_entries USING GIN(genetic_conditions);
CREATE INDEX IF NOT EXISTS idx_tracker_types_category ON tracker_types(category_id);
