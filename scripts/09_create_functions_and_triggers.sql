-- Creating database functions and triggers for automated functionality
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracker_entries_updated_at BEFORE UPDATE ON tracker_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestone_responses_updated_at BEFORE UPDATE ON milestone_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate child age in months
CREATE OR REPLACE FUNCTION calculate_age_in_months(birth_date DATE, reference_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN (EXTRACT(YEAR FROM reference_date) - EXTRACT(YEAR FROM birth_date)) * 12 +
           (EXTRACT(MONTH FROM reference_date) - EXTRACT(MONTH FROM birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to update document search vector
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.searchable_content := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(NEW.extracted_text, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_search_vector 
    BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_document_search_vector();

-- Function to clean up old analytics events (data retention)
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM analytics_events 
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get child's current milestone checklist
CREATE OR REPLACE FUNCTION get_current_milestone_checklist(child_birth_date DATE)
RETURNS TABLE(checklist_id UUID, age_key VARCHAR, title VARCHAR) AS $$
DECLARE
    child_age_months INTEGER;
BEGIN
    child_age_months := calculate_age_in_months(child_birth_date);
    
    RETURN QUERY
    SELECT mc.id, mc.age_key, mc.title
    FROM milestone_checklists mc
    WHERE child_age_months >= mc.age_months_min 
      AND child_age_months < mc.age_months_max
    ORDER BY mc.age_months_min DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
