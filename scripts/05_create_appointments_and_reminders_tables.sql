-- Creating appointment and reminder management tables
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    appointment_type VARCHAR(50) CHECK (appointment_type IN ('well_visit', 'vaccine', 'screening', 'specialist', 'therapy', 'other')) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    provider_name VARCHAR(200),
    location TEXT,
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
    notes TEXT,
    preparation_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminder_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    
    -- Notification channels
    push_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT false,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Reminder types
    checklist_reminders BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    tip_nudges BOOLEAN DEFAULT true,
    medication_reminders BOOLEAN DEFAULT false,
    
    -- Timing preferences
    reminder_advance_days INTEGER DEFAULT 1,
    reminder_time TIME DEFAULT '09:00:00',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, child_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for appointments and reminders
CREATE INDEX IF NOT EXISTS idx_appointments_user_child ON appointments(user_id, child_id);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
