-- Inserting seed data for categories, checklists, and initial configuration
-- Insert tracker categories
INSERT INTO tracker_categories (name, description, emoji, color) VALUES
('symptom', 'Track symptoms and health issues', '🩺', '#ef4444'),
('nutrition', 'Monitor food intake and nutrition', '🍎', '#22c55e'),
('medication', 'Log medication usage and effects', '💊', '#3b82f6')
ON CONFLICT (name) DO NOTHING;

-- Insert document categories
INSERT INTO document_categories (name, description, icon, color, sort_order) VALUES
('Medical Records', 'Doctor visits, test results, diagnoses', 'medical', '#ef4444', 1),
('Therapy Reports', 'Speech, occupational, physical therapy', 'therapy', '#8b5cf6', 2),
('Educational', 'IEP, school reports, assessments', 'education', '#f59e0b', 3),
('Insurance', 'Insurance cards, claims, coverage', 'insurance', '#06b6d4', 4),
('Legal', 'Guardianship, power of attorney, wills', 'legal', '#64748b', 5),
('Personal', 'Photos, journals, personal documents', 'personal', '#ec4899', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert milestone checklists (sample data)
INSERT INTO milestone_checklists (age_key, age_months_min, age_months_max, title, description) VALUES
('2m', 0, 3, '2 Month Milestones', 'Developmental milestones for 2-month-old children'),
('4m', 3, 5, '4 Month Milestones', 'Developmental milestones for 4-month-old children'),
('6m', 5, 7, '6 Month Milestones', 'Developmental milestones for 6-month-old children'),
('9m', 7, 10, '9 Month Milestones', 'Developmental milestones for 9-month-old children'),
('12m', 10, 14, '12 Month Milestones', 'Developmental milestones for 12-month-old children'),
('15m', 14, 17, '15 Month Milestones', 'Developmental milestones for 15-month-old children'),
('18m', 17, 20, '18 Month Milestones', 'Developmental milestones for 18-month-old children'),
('2y', 20, 30, '2 Year Milestones', 'Developmental milestones for 2-year-old children'),
('30m', 28, 32, '30 Month Milestones', 'Developmental milestones for 30-month-old children'),
('3y', 32, 42, '3 Year Milestones', 'Developmental milestones for 3-year-old children'),
('4y', 42, 54, '4 Year Milestones', 'Developmental milestones for 4-year-old children'),
('5y', 54, 66, '5 Year Milestones', 'Developmental milestones for 5-year-old children')
ON CONFLICT (age_key) DO NOTHING;
