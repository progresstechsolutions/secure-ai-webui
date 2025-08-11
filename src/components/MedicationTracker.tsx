import React, { useState, useEffect, useCallback } from 'react';

// Back arrow icon component
const BackArrowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

interface MedicationEntry {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeTaken: string;
  date: string;
  icon: string;
  status: 'taken' | 'missed' | 'scheduled';
  notes?: string;
}

interface Reminder {
  id: string;
  type: 'medication' | 'appointment';
  name: string;
  dose?: string;
  time: string;
  icon: string;
  status: 'pending' | 'taken' | 'missed';
  notes?: string;
  location?: string;
  repeatSchedule: string;
  timesPerDay: string[];
  startDate: string;
  endDate: string;
  method: string;
  nextDose: string;
  everyXHours?: string;
}

const MedicationTracker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(true);
  const [currentStep, setCurrentStep] = useState<'search' | 'log' | 'confirm'>('search');
  const [selectedMedication, setSelectedMedication] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<string>('');
  const [historyTimeFilter, setHistoryTimeFilter] = useState('7days');
  
  // Search dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // History section state
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [showMoreHistory, setShowMoreHistory] = useState(false);
  
  // AI Suggestions state
  const [currentSuggestion, setCurrentSuggestion] = useState<{
    id: string;
    type: 'refill' | 'appointment' | 'compliance' | 'interaction' | 'general';
    message: string;
    icon: string;
    action?: string;
    priority: 'low' | 'medium' | 'high';
  } | null>(null);
  const [suggestionQueue, setSuggestionQueue] = useState<Array<{
    id: string;
    type: 'refill' | 'appointment' | 'compliance' | 'interaction' | 'general';
    message: string;
    icon: string;
    action?: string;
    priority: 'low' | 'medium' | 'high';
  }>>([]);
  
  // Enhanced logging modal state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [dosage, setDosage] = useState<string>('');
  const [dosageUnit, setDosageUnit] = useState<string>('mg');
  const [medicationForm, setMedicationForm] = useState<string>('pill');
  const [schedule, setSchedule] = useState<string>('once_daily');
  const [customSchedule, setCustomSchedule] = useState<string>('');
  const [asNeeded, setAsNeeded] = useState<boolean>(false);
  const [timeOfLastDose, setTimeOfLastDose] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [instructions, setInstructions] = useState<string>('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);

  // Set Reminder modal state
  const [showSetReminderModal, setShowSetReminderModal] = useState(false);
  const [reminderMedication, setReminderMedication] = useState<string>('');
  const [reminderRepeatSchedule, setReminderRepeatSchedule] = useState<string>('daily');
  const [reminderSpecificDays, setReminderSpecificDays] = useState<string[]>([]);
  const [reminderEveryXHours, setReminderEveryXHours] = useState<string>('24');
  const [reminderTimesPerDay, setReminderTimesPerDay] = useState<string[]>(['breakfast']);
  const [reminderCustomTime, setReminderCustomTime] = useState<string>('');
  const [reminderStartDate, setReminderStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [reminderEndDate, setReminderEndDate] = useState<string>('');
  const [reminderMethod, setReminderMethod] = useState<string>('in_app');
  const [reminderNotes, setReminderNotes] = useState<string>('');
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Mock AI suggestions - would be provided by backend/AI
  const mockSuggestions = [
    {
      id: '1',
      type: 'refill' as const,
      message: "You're due for a refill on Clobazam.",
      icon: '🔔',
      action: 'Request refill',
      priority: 'high' as const
    },
    {
      id: '2',
      type: 'compliance' as const,
      message: "Great job! You've taken Levetiracetam (Keppra) consistently for 7 days.",
      icon: '💡',
      action: 'View progress',
      priority: 'low' as const
    },
    {
      id: '3',
      type: 'appointment' as const,
      message: "Don't forget your follow-up appointment tomorrow at 2:30 PM.",
      icon: '📅',
      action: 'View details',
      priority: 'high' as const
    },
    {
      id: '4',
      type: 'interaction' as const,
      message: "Consider taking Clobazam with food to reduce stomach upset.",
      icon: '💊',
      action: 'Learn more',
      priority: 'medium' as const
    }
  ];

  // Mock medication data
  const [medicationHistory, setMedicationHistory] = useState<MedicationEntry[]>([
    {
      id: '1',
      medicationName: 'Clobazam',
      dosage: '10mg',
      frequency: 'Twice daily',
      timeTaken: '9:00 AM',
      date: '2024-01-15',
      icon: '💊',
      status: 'taken',
      notes: 'Taken with breakfast'
    },
    {
      id: '2',
      medicationName: 'Levetiracetam (Keppra)',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeTaken: '9:00 AM',
      date: '2024-01-15',
      icon: '💊',
      status: 'taken'
    },
    {
      id: '3',
      medicationName: 'Melatonin',
      dosage: '3mg',
      frequency: 'Once daily at bedtime',
      timeTaken: '9:00 PM',
      date: '2024-01-14',
      icon: '🌙',
      status: 'taken'
    },
    {
      id: '4',
      medicationName: 'Clobazam',
      dosage: '10mg',
      frequency: 'Twice daily',
      timeTaken: '9:00 AM',
      date: '2024-01-14',
      icon: '💊',
      status: 'missed',
      notes: 'Forgot to take'
    }
  ]);

  // Mock medication database - Complete 50 medications list
  const medicationDatabase = [
    // Antiepileptic / Seizure Medications
    { name: 'Clobazam', dosage: '10mg', frequency: 'Twice daily' },
    { name: 'Levetiracetam (Keppra)', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Valproic Acid (Depakote)', dosage: '250mg', frequency: 'Twice daily' },
    { name: 'Lamotrigine (Lamictal)', dosage: '25mg', frequency: 'Once daily' },
    { name: 'Topiramate (Topamax)', dosage: '25mg', frequency: 'Twice daily' },
    { name: 'Oxcarbazepine (Trileptal)', dosage: '300mg', frequency: 'Twice daily' },
    { name: 'Carbamazepine (Tegretol)', dosage: '200mg', frequency: 'Twice daily' },
    { name: 'Gabapentin (Neurontin)', dosage: '300mg', frequency: 'Three times daily' },
    { name: 'Lacosamide (Vimpat)', dosage: '50mg', frequency: 'Twice daily' },
    { name: 'Ethosuximide (Zarontin)', dosage: '250mg', frequency: 'Twice daily' },
    
    // Sleep Aids / Melatonin Modulators
    { name: 'Melatonin', dosage: '3mg', frequency: 'Once daily at bedtime' },
    { name: 'Clonidine', dosage: '0.1mg', frequency: 'Twice daily' },
    { name: 'Trazodone', dosage: '25mg', frequency: 'Once daily at bedtime' },
    { name: 'Mirtazapine', dosage: '15mg', frequency: 'Once daily at bedtime' },
    { name: 'Hydroxyzine', dosage: '25mg', frequency: 'As needed' },
    
    // Behavioral / Mood Stabilizers
    { name: 'Risperidone (Risperdal)', dosage: '0.5mg', frequency: 'Twice daily' },
    { name: 'Aripiprazole (Abilify)', dosage: '2mg', frequency: 'Once daily' },
    { name: 'Quetiapine (Seroquel)', dosage: '25mg', frequency: 'Twice daily' },
    { name: 'Olanzapine (Zyprexa)', dosage: '2.5mg', frequency: 'Once daily' },
    { name: 'Lithium', dosage: '300mg', frequency: 'Twice daily' },
    { name: 'Ziprasidone', dosage: '20mg', frequency: 'Twice daily' },
    { name: 'Lurasidone (Latuda)', dosage: '20mg', frequency: 'Once daily' },
    
    // Stimulants / ADHD-Related
    { name: 'Methylphenidate (Ritalin, Concerta)', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Amphetamine/Dextroamphetamine (Adderall)', dosage: '5mg', frequency: 'Once daily' },
    { name: 'Lisdexamfetamine (Vyvanse)', dosage: '20mg', frequency: 'Once daily' },
    { name: 'Atomoxetine (Strattera)', dosage: '25mg', frequency: 'Once daily' },
    { name: 'Guanfacine', dosage: '1mg', frequency: 'Once daily' },
    
    // Anxiety / Depression / OCD
    { name: 'Sertraline (Zoloft)', dosage: '25mg', frequency: 'Once daily' },
    { name: 'Fluoxetine (Prozac)', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Citalopram (Celexa)', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Escitalopram (Lexapro)', dosage: '5mg', frequency: 'Once daily' },
    { name: 'Buspirone', dosage: '5mg', frequency: 'Twice daily' },
    { name: 'Duloxetine (Cymbalta)', dosage: '20mg', frequency: 'Once daily' },
    
    // GI & Motility Support (Common in PMS)
    { name: 'Polyethylene Glycol (MiraLAX)', dosage: '17g', frequency: 'Once daily' },
    { name: 'Lactulose', dosage: '15ml', frequency: 'Twice daily' },
    { name: 'Senna', dosage: '8.6mg', frequency: 'Once daily' },
    { name: 'Docusate Sodium', dosage: '100mg', frequency: 'Once daily' },
    { name: 'Ranitidine', dosage: '75mg', frequency: 'Twice daily' },
    { name: 'Famotidine (Pepcid)', dosage: '10mg', frequency: 'Twice daily' },
    { name: 'Omeprazole (Prilosec)', dosage: '20mg', frequency: 'Once daily' },
    { name: 'Esomeprazole (Nexium)', dosage: '20mg', frequency: 'Once daily' },
    
    // Other Neurological / Supportive Medications
    { name: 'Baclofen', dosage: '10mg', frequency: 'Three times daily' },
    { name: 'Diazepam', dosage: '2mg', frequency: 'As needed' },
    { name: 'Clonazepam', dosage: '0.25mg', frequency: 'Twice daily' },
    { name: 'Midazolam', dosage: '5mg', frequency: 'Emergency use only' },
    { name: 'Propranolol', dosage: '10mg', frequency: 'Twice daily' },
    
    // Targeted / Investigational
    { name: 'Insulin-like Growth Factor-1 (IGF-1)', dosage: 'Varies', frequency: 'As prescribed' },
    { name: 'Ketamine', dosage: 'Varies', frequency: 'As prescribed' },
    { name: 'Bumetanide', dosage: '0.5mg', frequency: 'Once daily' },
    { name: 'Cannabidiol (Epidiolex)', dosage: '5mg/kg', frequency: 'Twice daily' }
  ];

  // Quick log items - Show only 3-4 medications initially
  const quickLogItems = [
    { id: '1', name: 'Clobazam', icon: '💊', type: 'medication', recentlyUsed: true, popular: true },
    { id: '2', name: 'Levetiracetam (Keppra)', icon: '💊', type: 'medication', recentlyUsed: true, popular: false },
    { id: '3', name: 'Melatonin', icon: '🌙', type: 'medication', recentlyUsed: false, popular: true },
    { id: '4', name: 'Risperidone (Risperdal)', icon: '💊', type: 'medication', recentlyUsed: true, popular: false }
  ];

  // Reminders data - would be provided by backend/AI
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      type: 'medication',
      name: 'Clobazam',
      dose: '10mg',
      time: '8:00 AM',
      icon: '💊',
      status: 'pending',
      notes: 'Take with breakfast',
      repeatSchedule: 'daily',
      timesPerDay: ['breakfast'],
      startDate: '2024-01-01',
      endDate: '',
      method: 'in_app',
      nextDose: '8:00 AM'
    },
    {
      id: '2',
      type: 'medication',
      name: 'Levetiracetam (Keppra)',
      dose: '500mg',
      time: '9:00 AM',
      icon: '💊',
      status: 'pending',
      notes: 'Take with food',
      repeatSchedule: 'daily',
      timesPerDay: ['breakfast', 'dinner'],
      startDate: '2024-01-01',
      endDate: '',
      method: 'in_app',
      nextDose: '9:00 AM'
    },
    {
      id: '3',
      type: 'appointment',
      name: 'Dr. Smith - Follow-up',
      time: '2:30 PM',
      icon: '📅',
      status: 'pending',
      location: 'Medical Center, Room 205',
      repeatSchedule: 'as_needed',
      timesPerDay: [],
      startDate: '2024-01-01',
      endDate: '',
      method: 'in_app',
      nextDose: '2:30 PM'
    },
    {
      id: '4',
      type: 'medication',
      name: 'Melatonin',
      dose: '3mg',
      time: '9:00 PM',
      icon: '🌙',
      status: 'taken',
      notes: 'Taken at bedtime',
      repeatSchedule: 'daily',
      timesPerDay: ['bedtime'],
      startDate: '2024-01-01',
      endDate: '',
      method: 'in_app',
      nextDose: '9:00 PM'
    }
  ]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get filtered medications based on debounced search
  const filteredMedications = debouncedSearchQuery.trim() === '' ? [] : 
    medicationDatabase.filter(med =>
      med.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    ).slice(0, 8);

  // Enhanced search suggestions with descriptors from new medication database
  const searchSuggestions = [
    // Antiepileptic / Seizure Medications
    { name: 'Clobazam', icon: '💊', descriptor: 'Antiepileptic medication' },
    { name: 'Levetiracetam (Keppra)', icon: '💊', descriptor: 'Seizure control medication' },
    { name: 'Valproic Acid (Depakote)', icon: '💊', descriptor: 'Mood stabilizer & anticonvulsant' },
    { name: 'Lamotrigine (Lamictal)', icon: '💊', descriptor: 'Bipolar & epilepsy treatment' },
    { name: 'Topiramate (Topamax)', icon: '💊', descriptor: 'Migraine & seizure prevention' },
    { name: 'Oxcarbazepine (Trileptal)', icon: '💊', descriptor: 'Anticonvulsant medication' },
    { name: 'Carbamazepine (Tegretol)', icon: '💊', descriptor: 'Epilepsy & nerve pain treatment' },
    { name: 'Gabapentin (Neurontin)', icon: '💊', descriptor: 'Nerve pain & seizure control' },
    { name: 'Lacosamide (Vimpat)', icon: '💊', descriptor: 'Partial seizure treatment' },
    { name: 'Ethosuximide (Zarontin)', icon: '💊', descriptor: 'Absence seizure medication' },
    
    // Sleep Aids / Melatonin Modulators
    { name: 'Melatonin', icon: '🌙', descriptor: 'Sleep regulation hormone' },
    { name: 'Clonidine', icon: '💊', descriptor: 'Blood pressure & sleep aid' },
    { name: 'Trazodone', icon: '💊', descriptor: 'Antidepressant & sleep aid' },
    { name: 'Mirtazapine', icon: '💊', descriptor: 'Antidepressant with sedating effects' },
    { name: 'Hydroxyzine', icon: '💊', descriptor: 'Antihistamine for anxiety & sleep' },
    
    // Behavioral / Mood Stabilizers
    { name: 'Risperidone (Risperdal)', icon: '💊', descriptor: 'Antipsychotic medication' },
    { name: 'Aripiprazole (Abilify)', icon: '💊', descriptor: 'Atypical antipsychotic' },
    { name: 'Quetiapine (Seroquel)', icon: '💊', descriptor: 'Antipsychotic & mood stabilizer' },
    { name: 'Olanzapine (Zyprexa)', icon: '💊', descriptor: 'Antipsychotic medication' },
    { name: 'Lithium', icon: '💊', descriptor: 'Classic mood stabilizer' },
    { name: 'Ziprasidone', icon: '💊', descriptor: 'Antipsychotic medication' },
    { name: 'Lurasidone (Latuda)', icon: '💊', descriptor: 'Atypical antipsychotic' },
    
    // Stimulants / ADHD-Related
    { name: 'Methylphenidate (Ritalin, Concerta)', icon: '💊', descriptor: 'ADHD treatment medication' },
    { name: 'Amphetamine/Dextroamphetamine (Adderall)', icon: '💊', descriptor: 'ADHD stimulant medication' },
    { name: 'Lisdexamfetamine (Vyvanse)', icon: '💊', descriptor: 'ADHD treatment medication' },
    { name: 'Atomoxetine (Strattera)', icon: '💊', descriptor: 'Non-stimulant ADHD treatment' },
    { name: 'Guanfacine', icon: '💊', descriptor: 'ADHD & blood pressure medication' },
    
    // Anxiety / Depression / OCD
    { name: 'Sertraline (Zoloft)', icon: '💊', descriptor: 'SSRI antidepressant' },
    { name: 'Fluoxetine (Prozac)', icon: '💊', descriptor: 'SSRI antidepressant' },
    { name: 'Citalopram (Celexa)', icon: '💊', descriptor: 'SSRI antidepressant' },
    { name: 'Escitalopram (Lexapro)', icon: '💊', descriptor: 'SSRI antidepressant' },
    { name: 'Buspirone', icon: '💊', descriptor: 'Anti-anxiety medication' },
    { name: 'Duloxetine (Cymbalta)', icon: '💊', descriptor: 'SNRI antidepressant' },
    
    // GI & Motility Support
    { name: 'Polyethylene Glycol (MiraLAX)', icon: '💊', descriptor: 'Laxative medication' },
    { name: 'Lactulose', icon: '💊', descriptor: 'Laxative medication' },
    { name: 'Senna', icon: '💊', descriptor: 'Natural laxative' },
    { name: 'Docusate Sodium', icon: '💊', descriptor: 'Stool softener' },
    { name: 'Famotidine (Pepcid)', icon: '💊', descriptor: 'Acid reducer' },
    { name: 'Omeprazole (Prilosec)', icon: '💊', descriptor: 'Proton pump inhibitor' },
    { name: 'Esomeprazole (Nexium)', icon: '💊', descriptor: 'Proton pump inhibitor' },
    
    // Other Neurological / Supportive
    { name: 'Baclofen', icon: '💊', descriptor: 'Muscle relaxant for spasticity' },
    { name: 'Diazepam', icon: '💊', descriptor: 'Benzodiazepine for anxiety' },
    { name: 'Clonazepam', icon: '💊', descriptor: 'Benzodiazepine for seizures' },
    { name: 'Propranolol', icon: '💊', descriptor: 'Beta blocker for anxiety' },
    
    // Targeted / Investigational
    { name: 'Cannabidiol (Epidiolex)', icon: '💊', descriptor: 'CBD medication for epilepsy' }
  ].filter(suggestion =>
    suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.descriptor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get filtered history based on time filter
  const getFilteredHistory = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (historyTimeFilter) {
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return medicationHistory;
    }
    
    return medicationHistory.filter(entry => new Date(entry.date) >= filterDate);
  };

  // Get display text for time filter
  const getTimeFilterDisplay = () => {
    switch (historyTimeFilter) {
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case '6months': return 'Last 6 months';
      case '1year': return 'Last 1 year';
      default: return 'All time';
    }
  };

  // Get history entries to display (with progressive disclosure)
  const getDisplayHistory = () => {
    const filtered = getFilteredHistory();
    return showMoreHistory ? filtered : filtered.slice(0, 5);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.trim() !== '');
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || filteredMedications.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredMedications.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredMedications.length) {
          handleMedicationSelect(filteredMedications[selectedIndex].name);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showDropdown, filteredMedications, selectedIndex]);

  // Handle medication selection from dropdown
  const handleMedicationSelect = (medication: string) => {
    setSelectedMedication(medication);
    const med = medicationDatabase.find(m => m.name === medication);
    if (med) {
      // Parse dosage to extract numeric value and unit
      const dosageMatch = med.dosage.match(/(\d+(?:\.\d+)?)\s*(.+)/);
      if (dosageMatch) {
        setDosage(dosageMatch[1]);
        setDosageUnit(dosageMatch[2].toLowerCase());
      }
    }
    setSearchQuery(medication);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setShowLogModal(true);
    setCurrentStep('log');
    setErrors({});
  };

  // Handle logging medication
  const handleLogMedication = () => {
    // Set loading state
    setIsSaving(true);
    
    // Validate required fields
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedMedication.trim()) {
      newErrors.medication = 'Medication name is required';
    } else if (selectedMedication.trim().length < 2) {
      newErrors.medication = 'Medication name must be at least 2 characters';
    }
    
    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    } else if (isNaN(Number(dosage)) || Number(dosage) <= 0) {
      newErrors.dosage = 'Dosage must be a positive number';
    }
    
    if (schedule === 'custom' && !customSchedule.trim()) {
      newErrors.customSchedule = 'Custom schedule is required when "Custom" is selected';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    // Format schedule display
    let scheduleDisplay = '';
    if (asNeeded) {
      scheduleDisplay = 'As needed';
    } else if (schedule === 'custom') {
      scheduleDisplay = customSchedule || 'Custom schedule';
    } else {
      scheduleDisplay = schedule.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    const newEntry: MedicationEntry = {
      id: Date.now().toString(),
      medicationName: selectedMedication,
      dosage: `${dosage} ${dosageUnit}`,
      frequency: scheduleDisplay,
      timeTaken: timeOfLastDose,
      date: startDate,
      icon: '💊',
      status: 'taken',
      notes: instructions || selectedNotes
    };

    setMedicationHistory(prev => [newEntry, ...prev]);
    setShowLogModal(false);
    setCurrentStep('search');
    
    // Reset form
    setSelectedMedication('');
    setDosage('');
    setMedicationForm('pill');
    setSchedule('once_daily');
    setCustomSchedule('');
    setAsNeeded(false);
    setTimeOfLastDose(() => {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    });
    setStartDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    setInstructions('');
    setSelectedNotes('');
    setUniqueIdentifier('');
    setShowAdvancedOptions(false);
    setErrors({});
    
    // Show confirmation
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
    
    // Reset loading state
    setIsSaving(false);
  };

  // Handle history time filter change
  const handleHistoryTimeFilterChange = (value: string) => {
    setHistoryTimeFilter(value);
    setShowMoreHistory(false); // Reset show more when filter changes
  };

  // Handle marking reminder as taken
  const handleMarkAsTaken = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, status: 'taken' }
        : reminder
    ));
    
    // Add to medication history
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder && reminder.type === 'medication') {
      const newEntry: MedicationEntry = {
        id: Date.now().toString(),
        medicationName: reminder.name,
        dosage: reminder.dose || '',
        frequency: 'Once daily',
        timeTaken: reminder.time,
        date: new Date().toISOString().split('T')[0],
        icon: reminder.icon,
        status: 'taken',
        notes: reminder.notes
      };
      setMedicationHistory(prev => [newEntry, ...prev]);
    }
  };

  // Handle viewing appointment details
  const handleViewAppointmentDetails = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      // Handle appointment details view
      console.log('View appointment details:', reminder);
    }
  };

  // Get today's reminders
  const getTodayReminders = () => {
    return reminders.filter(reminder => reminder.status === 'pending');
  };

  // Determine if medication is supplement or medication
  const getMedicationType = (name: string) => {
    const supplementKeywords = ['vitamin', 'supplement', 'omega', 'probiotic', 'magnesium', 'zinc', 'calcium'];
    return supplementKeywords.some(keyword => name.toLowerCase().includes(keyword)) ? 'supplement' : 'medication';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Initialize AI suggestions (simulate backend/AI providing suggestions)
  React.useEffect(() => {
    // Simulate backend/AI providing suggestions
    setSuggestionQueue(mockSuggestions);
    // Always show the Clobazam refill message as the first suggestion
    const clobazamRefillSuggestion = mockSuggestions.find(s => s.message.includes('Clobazam'));
    if (clobazamRefillSuggestion) {
      setCurrentSuggestion(clobazamRefillSuggestion);
    } else if (mockSuggestions.length > 0) {
      setCurrentSuggestion(mockSuggestions[0]);
    }
  }, []);

  // Handle dismissing current suggestion
  const handleDismissSuggestion = () => {
    if (currentSuggestion) {
      // Remove current suggestion from queue
      const updatedQueue = suggestionQueue.filter(s => s.id !== currentSuggestion.id);
      setSuggestionQueue(updatedQueue);
      
      // Show next suggestion if available
      if (updatedQueue.length > 0) {
        setCurrentSuggestion(updatedQueue[0]);
      } else {
        // If no more suggestions, always show the Clobazam refill message
        const clobazamRefillSuggestion = mockSuggestions.find(s => s.message.includes('Clobazam'));
        if (clobazamRefillSuggestion) {
          setCurrentSuggestion(clobazamRefillSuggestion);
          setSuggestionQueue([clobazamRefillSuggestion]);
        } else {
          setCurrentSuggestion(null);
        }
      }
    }
  };

  // Handle suggestion action (optional tap on banner)
  const handleSuggestionAction = () => {
    if (currentSuggestion?.action) {
      // For MVP, just show an alert. In production, this would trigger specific actions
      alert(`Action: ${currentSuggestion.action}\nSuggestion: ${currentSuggestion.message}`);
    }
  };

  // Get suggestion background color based on type and priority
  const getSuggestionBackground = () => {
    if (!currentSuggestion) return '';
    
    const { type, priority } = currentSuggestion;
    
    if (priority === 'high') {
      return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
    }
    
    switch (type) {
      case 'refill':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      case 'appointment':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200';
      case 'compliance':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'interaction':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  // Helper function to check if form is valid
  const isFormValid = () => {
    const hasRequiredFields = selectedMedication.trim().length >= 2 && 
                             dosage.trim() !== '' && 
                             !isNaN(Number(dosage)) && 
                             Number(dosage) > 0;
    
    const hasValidCustomSchedule = schedule !== 'custom' || customSchedule.trim() !== '';
    
    return hasRequiredFields && hasValidCustomSchedule;
  };

  // Reminder management functions
  const handleCreateReminder = () => {
    if (!reminderMedication.trim()) {
      setErrors(prev => ({ ...prev, reminderMedication: 'Medication name is required' }));
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      type: 'medication' as const,
      name: reminderMedication,
      dose: '',
      time: reminderTimesPerDay.length > 0 ? reminderTimesPerDay[0] : 'Custom',
      icon: '💊',
      status: 'pending' as const,
      notes: reminderNotes,
      repeatSchedule: reminderRepeatSchedule,
      timesPerDay: reminderTimesPerDay,
      startDate: reminderStartDate,
      endDate: reminderEndDate,
      method: reminderMethod,
      nextDose: reminderTimesPerDay.length > 0 ? reminderTimesPerDay[0] : 'Custom'
    };

    setReminders(prev => [...prev, newReminder]);
    handleCloseSetReminderModal();
  };

  const handleEditReminder = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      setEditingReminderId(reminderId);
      setReminderMedication(reminder.name);
      setReminderRepeatSchedule(reminder.repeatSchedule || 'daily');
      setReminderSpecificDays(reminder.timesPerDay || []);
      setReminderTimesPerDay(reminder.timesPerDay || ['breakfast']);
      setReminderStartDate(reminder.startDate || '');
      setReminderEndDate(reminder.endDate || '');
      setReminderMethod(reminder.method || 'in_app');
      setReminderNotes(reminder.notes || '');
      setShowSetReminderModal(true);
    }
  };

  const handleUpdateReminder = () => {
    if (!reminderMedication.trim()) {
      setErrors(prev => ({ ...prev, reminderMedication: 'Medication name is required' }));
      return;
    }

    setReminders(prev => prev.map(reminder => 
      reminder.id === editingReminderId 
        ? {
            ...reminder,
            name: reminderMedication,
            notes: reminderNotes,
            repeatSchedule: reminderRepeatSchedule,
            timesPerDay: reminderTimesPerDay,
            startDate: reminderStartDate,
            endDate: reminderEndDate,
            method: reminderMethod
          }
        : reminder
    ));

    handleCloseSetReminderModal();
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const handleCloseSetReminderModal = () => {
    setShowSetReminderModal(false);
    setEditingReminderId(null);
    setReminderMedication('');
    setReminderRepeatSchedule('daily');
    setReminderSpecificDays([]);
    setReminderEveryXHours('24');
    setReminderTimesPerDay(['breakfast']);
    setReminderCustomTime('');
    setReminderStartDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    setReminderEndDate('');
    setReminderMethod('in_app');
    setReminderNotes('');
    setErrors({});
  };

  const handleReminderTimeToggle = (time: string) => {
    setReminderTimesPerDay(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleReminderDayToggle = (day: string) => {
    setReminderSpecificDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Fixed Top Bar */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button and title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Go back to previous screen"
              >
                <BackArrowIcon />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Medication</h1>
                <p className="text-sm text-gray-500">Track and manage medications & appointments</p>
              </div>
            </div>
            {/* Future settings icon placeholder */}
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-40">
        <div className="px-4 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search medications or supplements…"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(searchQuery.trim() !== '')}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              aria-label="Search medications or supplements"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
                        {/* Autosuggest Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredMedications.length > 0 ? (
                  filteredMedications.map((medication, index) => (
                    <button
                      key={index}
                      onClick={() => handleMedicationSelect(medication.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset transition-colors ${
                        selectedIndex === index ? 'bg-indigo-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💊</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                          <p className="text-xs text-gray-500">{medication.dosage} • {medication.frequency}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No medications found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-[144px] pb-6 sm:pb-8 lg:max-w-7xl lg:px-8 lg:pt-8 lg:pb-12">
        {/* Desktop Layout - Two Column Grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
          {/* Left Column - Quick Log and Reminders */}
          <div className="lg:col-span-1">
            {/* Quick Log Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 lg:text-xl">Quick Log</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full lg:text-sm">Recently Used</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full lg:text-sm">Popular</span>
                </div>
              </div>
              
              {/* Horizontal Scrollable Chips - Mobile */}
              <div className="lg:hidden relative">
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
                  {quickLogItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedMedication(item.name);
                        const med = medicationDatabase.find(m => m.name === item.name);
                        if (med) {
                          // Parse dosage to extract numeric value and unit
                          const dosageMatch = med.dosage.match(/(\d+(?:\.\d+)?)\s*(.+)/);
                          if (dosageMatch) {
                            setDosage(dosageMatch[1]);
                            setDosageUnit(dosageMatch[2].toLowerCase());
                          }
                        }
                        setShowLogModal(true);
                        setCurrentStep('log');
                      }}
                      className="flex-shrink-0 flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-indigo-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{item.name}</span>
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </button>
                  ))}
                  
                  {/* Add New Chip */}
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="flex-shrink-0 flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 hover:bg-indigo-100 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="text-lg">➕</span>
                    <span className="text-sm font-medium text-indigo-700">Add New</span>
                  </button>
                </div>
                
                {/* Scroll Indicators */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none rounded-l-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none rounded-r-full"></div>
              </div>

              {/* Desktop Vertical Layout */}
              <div className="hidden lg:block space-y-3">
                {quickLogItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMedication(item.name);
                      const med = medicationDatabase.find(m => m.name === item.name);
                      if (med) {
                        const dosageMatch = med.dosage.match(/(\d+(?:\.\d+)?)\s*(.+)/);
                        if (dosageMatch) {
                          setDosage(dosageMatch[1]);
                          setDosageUnit(dosageMatch[2].toLowerCase());
                        }
                      }
                      setShowLogModal(true);
                      setCurrentStep('log');
                    }}
                    className="w-full flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-900 flex-1 text-left">{item.name}</span>
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                ))}
                
                {/* Show "Add New Medication" only when search has no results */}
                {searchQuery && filteredMedications.length === 0 && (
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="w-full flex items-center space-x-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 hover:bg-indigo-100 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="text-xl">➕</span>
                    <span className="text-sm font-medium text-indigo-700">Add New Medication</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reminders Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 lg:text-xl">Reminders</h2>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowSetReminderModal(true)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    aria-label="Add new reminder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors lg:text-base">
                    View all reminders
                  </button>
                </div>
              </div>
              
              {/* Reminders List */}
              <div className="space-y-3 lg:space-y-4">
                {/* Today's Schedule Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Today's Schedule</h3>
                  <div className="space-y-2">
                    {getTodayReminders().length > 0 ? (
                      getTodayReminders().map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">{reminder.icon}</span>
                            <span className="text-blue-800 font-medium">{reminder.name}</span>
                            {reminder.dose && (
                              <span className="text-blue-600">({reminder.dose})</span>
                            )}
                          </div>
                          <span className="text-blue-600 font-medium">{reminder.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-blue-600 text-sm">No reminders scheduled for today</p>
                    )}
                  </div>
                </div>

                {getTodayReminders().length > 0 ? (
                  getTodayReminders().map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className={`bg-white border rounded-lg p-4 transition-all lg:p-5 ${
                        reminder.type === 'medication' 
                          ? 'border-gray-200 hover:border-indigo-200' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center lg:w-12 lg:h-12 ${
                            reminder.type === 'medication' ? 'bg-indigo-100' : 'bg-blue-100'
                          }`}>
                            <span className="text-lg lg:text-xl">{reminder.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate lg:text-base">
                              {reminder.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 lg:text-sm">
                              <span>{reminder.time}</span>
                              {reminder.type === 'medication' && reminder.dose && (
                                <>
                                  <span>•</span>
                                  <span>{reminder.dose}</span>
                                </>
                              )}
                            </div>
                            {reminder.repeatSchedule && (
                              <div className="text-xs text-gray-400 mt-1">
                                {reminder.repeatSchedule === 'daily' && 'Daily'}
                                {reminder.repeatSchedule === 'specific_days' && `Every ${reminder.timesPerDay.join(', ')}`}
                                {reminder.repeatSchedule === 'every_x_hours' && `Every ${reminder.everyXHours || '24'} hours`}
                                {reminder.repeatSchedule === 'as_needed' && 'As needed'}
                              </div>
                            )}
                            {reminder.notes && (
                              <p className="text-xs text-gray-400 mt-1">{reminder.notes}</p>
                            )}
                            {reminder.startDate && (
                              <div className="text-xs text-gray-400 mt-1">
                                From: {new Date(reminder.startDate).toLocaleDateString()}
                                {reminder.endDate && ` To: ${new Date(reminder.endDate).toLocaleDateString()}`}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {reminder.type === 'medication' ? (
                            <button
                              onClick={() => handleMarkAsTaken(reminder.id)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            >
                              Mark as taken
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewAppointmentDetails(reminder.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                              View details
                            </button>
                          )}
                          <button
                            onClick={() => handleEditReminder(reminder.id)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            aria-label="Edit reminder"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Delete reminder"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No reminders scheduled for today.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Search, AI Suggestion, and History */}
          <div className="lg:col-span-2">
            {/* AI-Powered Suggestion/Tip Banner */}
            {showAISuggestion && (
              <div className="mb-8 lg:mb-12">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 relative">
                  <button
                    onClick={() => setShowAISuggestion(false)}
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 transition-colors"
                    aria-label="Dismiss suggestion"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center" aria-hidden="true">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Medication Reminder</h4>
                      <p className="text-sm text-blue-800">
                        Set up medication reminders to ensure consistent dosing. You can also track side effects and effectiveness over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Medication Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 lg:text-xl">Search Medication</h2>
                <button
                  onClick={() => setCurrentStep('search')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors lg:text-base"
                >
                  View all medications
                </button>
              </div>
              
              {/* Search functionality moved to main search bar above */}
            </div>

            {/* History Section - Collapsible at bottom */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
              {/* Collapsible Header */}
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-expanded={isHistoryExpanded}
                aria-label="Toggle history section"
              >
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900">History</h2>
                  <span className="text-sm text-gray-500">({getTimeFilterDisplay()})</span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Time Filter Dropdown - Only visible when expanded */}
                  {isHistoryExpanded && (
                    <div className="relative">
                      <select 
                        value={historyTimeFilter}
                        onChange={(e) => handleHistoryTimeFilterChange(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:border-gray-400 transition-colors"
                        aria-label="Filter history by time period"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="6months">Last 6 months</option>
                        <option value="1year">Last 1 year</option>
                        <option value="custom">Custom</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Expand/Collapse Icon */}
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded History Content */}
              {isHistoryExpanded && (
                <>
                  {/* History Entries List */}
                  <div className="border-t border-gray-100">
                    {getDisplayHistory().length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {getDisplayHistory().map((entry) => (
                          <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3">
                              {/* Date */}
                              <div className="flex-shrink-0">
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(entry.date)}
                                </span>
                              </div>
                              
                              {/* Entry Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-lg">{entry.icon}</span>
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {entry.medicationName}
                                  </h5>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span>{entry.dosage}</span>
                                  <span>•</span>
                                  <span>{entry.timeTaken}</span>
                                  {entry.notes && (
                                    <>
                                      <span>•</span>
                                      <span className="text-gray-400">{entry.notes}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="flex-shrink-0">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  entry.status === 'taken' ? 'bg-green-100 text-green-700' :
                                  entry.status === 'missed' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {entry.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-6 py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">No medication entries for this period</h4>
                        <p className="text-sm text-gray-500">Start logging medications to see your history here</p>
                      </div>
                    )}
                  </div>

                  {/* Show More Button */}
                  {getFilteredHistory().length > 5 && !showMoreHistory && (
                    <div className="px-6 py-3 border-t border-gray-100">
                      <button
                        onClick={() => setShowMoreHistory(true)}
                        className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        Show more ({getFilteredHistory().length - 5} more entries)
                      </button>
                    </div>
                  )}

                  {/* Show Less Button */}
                  {showMoreHistory && getFilteredHistory().length > 5 && (
                    <div className="px-6 py-3 border-t border-gray-100">
                      <button
                        onClick={() => setShowMoreHistory(false)}
                        className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

             {/* Enhanced Medication Logging Modal/Drawer */}
       {showLogModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
           <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-semibold text-gray-900">
                   Log {selectedMedication ? getMedicationType(selectedMedication) : 'Medication'}
                 </h2>
                 <button
                   onClick={() => {
                     setShowLogModal(false);
                     setErrors({});
                     setIsSaving(false);
                   }}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                   aria-label="Close modal"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>

               {currentStep === 'search' && (
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Search Medication
                     </label>
                     <input
                       type="text"
                       placeholder="Type medication name..."
                       value={searchQuery}
                       onChange={handleSearchChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     />
                   </div>
                   
                   {searchQuery && (
                     <div className="space-y-2">
                       {filteredMedications.map((medication) => (
                         <button
                           key={medication.name}
                           onClick={() => handleMedicationSelect(medication.name)}
                           className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-gray-50 transition-colors"
                         >
                           <div className="flex items-center space-x-3">
                             <span className="text-xl">💊</span>
                             <div>
                               <p className="font-medium text-gray-900">{medication.name}</p>
                               <p className="text-sm text-gray-500">{medication.dosage} • {medication.frequency}</p>
                             </div>
                           </div>
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {currentStep === 'log' && (
                 <div className="space-y-6">
                   {/* Required Fields Section */}
                   <div className="space-y-4">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                       <h3 className="text-sm font-semibold text-gray-900">Required Information</h3>
                     </div>
                     
                     {/* Medication Name */}
                     <div>
                       <label htmlFor="medication-name" className="block text-sm font-medium text-gray-700 mb-2">
                         Medication Name *
                       </label>
                       <input
                         id="medication-name"
                         type="text"
                         value={selectedMedication}
                         onChange={(e) => {
                           setSelectedMedication(e.target.value);
                           if (errors.medication) {
                             setErrors(prev => ({ ...prev, medication: '' }));
                           }
                         }}
                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                           errors.medication ? 'border-red-300' : 'border-gray-300'
                         }`}
                         placeholder="Start typing medication or supplement name..."
                         aria-describedby={errors.medication ? "medication-error" : undefined}
                         aria-invalid={!!errors.medication}
                       />
                       {errors.medication && (
                         <p id="medication-error" className="text-sm text-red-600 mt-1" role="alert">{errors.medication}</p>
                       )}
                     </div>

                     {/* Dosage */}
                     <div>
                       <label htmlFor="dosage-input" className="block text-sm font-medium text-gray-700 mb-2">
                         Dosage *
                       </label>
                       <div className="flex space-x-3">
                         <input
                           id="dosage-input"
                           type="number"
                           value={dosage}
                           onChange={(e) => {
                             setDosage(e.target.value);
                             if (errors.dosage) {
                               setErrors(prev => ({ ...prev, dosage: '' }));
                             }
                           }}
                           className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                             errors.dosage ? 'border-red-300' : 'border-gray-300'
                           }`}
                           placeholder="500"
                           min="0"
                           step="0.1"
                           aria-describedby={errors.dosage ? "dosage-error" : undefined}
                           aria-invalid={!!errors.dosage}
                         />
                         <select
                           id="dosage-unit"
                           value={dosageUnit}
                           onChange={(e) => setDosageUnit(e.target.value)}
                           className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-base min-w-[100px]"
                           aria-label="Dosage unit"
                         >
                           <option value="mg">mg</option>
                           <option value="ml">mL</option>
                           <option value="iu">IU</option>
                           <option value="drops">drops</option>
                           <option value="tablets">tablets</option>
                           <option value="capsules">capsules</option>
                           <option value="puffs">puffs</option>
                           <option value="units">units</option>
                           <option value="mcg">mcg</option>
                           <option value="g">g</option>
                         </select>
                       </div>
                       {errors.dosage && (
                         <p id="dosage-error" className="text-sm text-red-600 mt-1" role="alert">{errors.dosage}</p>
                       )}
                     </div>

                     {/* Form */}
                     <div>
                       <label htmlFor="medication-form" className="block text-sm font-medium text-gray-700 mb-2">
                         Form *
                       </label>
                       <select
                         id="medication-form"
                         value={medicationForm}
                         onChange={(e) => setMedicationForm(e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-base"
                         aria-label="Medication form"
                       >
                         <option value="pill">Pill</option>
                         <option value="capsule">Capsule</option>
                         <option value="liquid">Liquid</option>
                         <option value="injection">Injection</option>
                         <option value="patch">Patch</option>
                         <option value="inhaler">Inhaler</option>
                         <option value="drops">Drops</option>
                         <option value="cream">Cream</option>
                         <option value="suppository">Suppository</option>
                         <option value="other">Other</option>
                       </select>
                     </div>

                     {/* Schedule */}
                     <div>
                       <label htmlFor="medication-schedule" className="block text-sm font-medium text-gray-700 mb-2">
                         Schedule *
                       </label>
                       <div className="space-y-3">
                         <select
                           id="medication-schedule"
                           value={schedule}
                           onChange={(e) => setSchedule(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-base"
                           aria-label="Medication schedule"
                         >
                           <option value="once_daily">Once daily</option>
                           <option value="twice_daily">Twice daily</option>
                           <option value="three_times_daily">Three times daily</option>
                           <option value="every_6_hours">Every 6 hours</option>
                           <option value="every_8_hours">Every 8 hours</option>
                           <option value="every_12_hours">Every 12 hours</option>
                           <option value="weekly">Weekly</option>
                           <option value="monthly">Monthly</option>
                           <option value="custom">Custom</option>
                         </select>
                         
                         {schedule === 'custom' && (
                           <div>
                             <input
                               type="text"
                               value={customSchedule}
                               onChange={(e) => {
                                 setCustomSchedule(e.target.value);
                                 if (errors.customSchedule) {
                                   setErrors(prev => ({ ...prev, customSchedule: '' }));
                                 }
                               }}
                               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                                 errors.customSchedule ? 'border-red-300' : 'border-gray-300'
                               }`}
                               placeholder="e.g., 8AM, 2PM, 8PM"
                               aria-describedby={errors.customSchedule ? "custom-schedule-error" : undefined}
                               aria-invalid={!!errors.customSchedule}
                             />
                             {errors.customSchedule && (
                               <p id="custom-schedule-error" className="text-sm text-red-600 mt-1" role="alert">{errors.customSchedule}</p>
                             )}
                           </div>
                         )}
                         
                         <div className="flex items-center space-x-2">
                           <input
                             type="checkbox"
                             id="asNeeded"
                             checked={asNeeded}
                             onChange={(e) => setAsNeeded(e.target.checked)}
                             className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                             aria-label="Take medication as needed"
                           />
                           <label htmlFor="asNeeded" className="text-sm text-gray-700 cursor-pointer">
                             As needed
                           </label>
                         </div>
                       </div>
                     </div>

                     {/* Time of Last Dose */}
                     <div>
                       <label htmlFor="time-last-dose" className="block text-sm font-medium text-gray-700 mb-2">
                         Time of Last Dose
                       </label>
                       <input
                         id="time-last-dose"
                         type="time"
                         value={timeOfLastDose}
                         onChange={(e) => setTimeOfLastDose(e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                         aria-label="Time of last dose"
                       />
                     </div>

                     {/* Start Date */}
                     <div>
                       <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                         Start Date
                       </label>
                       <input
                         id="start-date"
                         type="date"
                         value={startDate}
                         onChange={(e) => setStartDate(e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                         aria-label="Start date"
                       />
                     </div>

                     {/* Instructions */}
                     <div>
                       <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                         Instructions
                       </label>
                       <textarea
                         id="instructions"
                         value={instructions}
                         onChange={(e) => setInstructions(e.target.value)}
                         rows={3}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none"
                         placeholder="E.g., Take with food, avoid dairy..."
                         aria-label="Medication instructions"
                       />
                     </div>
                   </div>

                   {/* Divider */}
                   <div className="border-t border-gray-200"></div>

                   {/* Advanced Options Section */}
                   <div className="space-y-4">
                     <button
                       onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                       className="flex items-center justify-between w-full text-left p-0 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                       aria-expanded={showAdvancedOptions}
                       aria-controls="advanced-options-content"
                       aria-label="Toggle advanced options"
                     >
                       <div className="flex items-center space-x-2">
                         <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                         <h3 className="text-sm font-semibold text-gray-900">Advanced Options</h3>
                       </div>
                       <svg 
                         className={`w-5 h-5 text-gray-400 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                         fill="none" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24"
                         aria-hidden="true"
                       >
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </button>

                     {/* Advanced options content */}
                     {showAdvancedOptions && (
                       <div id="advanced-options-content" className="space-y-4 pl-4 border-l-2 border-gray-100">
                         {/* Unique identifier */}
                         <div>
                           <label htmlFor="unique-identifier" className="block text-sm font-medium text-gray-700 mb-2">
                             Unique Identifier
                           </label>
                           <input
                             id="unique-identifier"
                             type="text"
                             value={uniqueIdentifier}
                             onChange={(e) => setUniqueIdentifier(e.target.value)}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                             placeholder="e.g., Lot number, Batch ID"
                             aria-label="Unique identifier"
                           />
                         </div>

                         {/* Notes */}
                         <div>
                           <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                             Notes
                           </label>
                           <textarea
                             id="notes"
                             value={selectedNotes}
                             onChange={(e) => setSelectedNotes(e.target.value)}
                             rows={3}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none"
                             placeholder="Any side effects, observations, or additional notes..."
                             aria-label="Additional notes"
                           />
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Action buttons */}
                   <div className="pt-6 border-t border-gray-200 space-y-3">
                     <button
                       onClick={handleLogMedication}
                       disabled={!isFormValid() || isSaving}
                       className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                       aria-label="Save medication entry"
                     >
                       {isSaving ? (
                         <div className="flex items-center justify-center space-x-2">
                           <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           <span>Saving...</span>
                         </div>
                       ) : (
                         'Save'
                       )}
                     </button>
                     <button
                       onClick={() => {
                         setCurrentStep('search');
                         setErrors({});
                         setIsSaving(false);
                       }}
                       className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors font-medium text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                       aria-label="Go back to search"
                     >
                       Cancel
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

               {/* AI-Powered Suggestions Banner - Fixed at bottom */}
        {currentSuggestion && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className={`max-w-2xl mx-auto rounded-lg border shadow-lg ${getSuggestionBackground()} transition-all duration-300 ease-in-out`}>
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Suggestion Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">{currentSuggestion.icon}</span>
                  </div>
                  
                  {/* Suggestion Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {currentSuggestion.message}
                    </p>
                    {currentSuggestion.action && (
                      <button
                        onClick={handleSuggestionAction}
                        className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        {currentSuggestion.action} →
                      </button>
                    )}
                  </div>
                  
                  {/* Dismiss Button */}
                  <button
                    onClick={handleDismissSuggestion}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white hover:bg-opacity-50"
                    aria-label="Dismiss suggestion"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Toast */}
        {showConfirmation && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50" role="alert" aria-live="polite">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Medication logged!</span>
            </div>
          </div>
        )}

        {/* Set Reminder Modal */}
        {showSetReminderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingReminderId ? 'Edit Reminder' : 'Set Reminder'}
                </h2>
                <button
                  onClick={handleCloseSetReminderModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Medication Name */}
                <div>
                  <label htmlFor="reminder-medication" className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <div className="relative">
                    <input
                      id="reminder-medication"
                      type="text"
                      value={reminderMedication}
                      onChange={(e) => {
                        const value = e.target.value;
                        setReminderMedication(value);
                        if (errors.reminderMedication) {
                          setErrors(prev => ({ ...prev, reminderMedication: '' }));
                        }
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base ${
                        errors.reminderMedication ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Search medications or enter custom name..."
                      aria-describedby={errors.reminderMedication ? "reminder-medication-error" : undefined}
                      aria-invalid={!!errors.reminderMedication}
                    />
                    
                    {/* Medication Search Dropdown */}
                    {showDropdown && reminderMedication.trim() !== '' && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {medicationDatabase
                          .filter(med => 
                            med.name.toLowerCase().includes(reminderMedication.toLowerCase())
                          )
                          .slice(0, 8)
                          .map((medication, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setReminderMedication(medication.name);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">💊</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                                  <p className="text-xs text-gray-500">{medication.dosage} • {medication.frequency}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  {errors.reminderMedication && (
                    <p id="reminder-medication-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.reminderMedication}
                    </p>
                  )}
                </div>

                {/* Repeat Schedule */}
                <div>
                  <label htmlFor="repeat-schedule" className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat Schedule
                  </label>
                  <select
                    id="repeat-schedule"
                    value={reminderRepeatSchedule}
                    onChange={(e) => setReminderRepeatSchedule(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  >
                    <option value="daily">Daily</option>
                    <option value="specific_days">Specific days</option>
                    <option value="every_x_hours">Every X hours</option>
                    <option value="as_needed">As needed</option>
                  </select>
                </div>

                {/* Specific Days (conditional) */}
                {reminderRepeatSchedule === 'specific_days' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Days
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleReminderDayToggle(day)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            reminderSpecificDays.includes(day)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Every X Hours (conditional) */}
                {reminderRepeatSchedule === 'every_x_hours' && (
                  <div>
                    <label htmlFor="every-x-hours" className="block text-sm font-medium text-gray-700 mb-2">
                      Every X Hours
                    </label>
                    <input
                      id="every-x-hours"
                      type="number"
                      value={reminderEveryXHours}
                      onChange={(e) => setReminderEveryXHours(e.target.value)}
                      min="1"
                      max="168"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      placeholder="24"
                    />
                  </div>
                )}

                {/* Multiple Times Per Day */}
                {reminderRepeatSchedule !== 'every_x_hours' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Times Per Day
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {['breakfast', 'lunch', 'dinner', 'bedtime'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleReminderTimeToggle(time)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                            reminderTimesPerDay.includes(time)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="custom-time" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Time
                      </label>
                      <input
                        id="custom-time"
                        type="time"
                        value={reminderCustomTime}
                        onChange={(e) => setReminderCustomTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      />
                      {reminderCustomTime && (
                        <button
                          type="button"
                          onClick={() => handleReminderTimeToggle(reminderCustomTime)}
                          className={`mt-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                            reminderTimesPerDay.includes(reminderCustomTime)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                          }`}
                        >
                          Add {reminderCustomTime}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Start Date */}
                <div>
                  <label htmlFor="reminder-start-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    id="reminder-start-date"
                    type="date"
                    value={reminderStartDate}
                    onChange={(e) => setReminderStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                {/* End Date (optional) */}
                <div>
                  <label htmlFor="reminder-end-date" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    id="reminder-end-date"
                    type="date"
                    value={reminderEndDate}
                    onChange={(e) => setReminderEndDate(e.target.value)}
                    min={reminderStartDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                {/* Reminder Method */}
                <div>
                  <label htmlFor="reminder-method" className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Method
                  </label>
                  <select
                    id="reminder-method"
                    value={reminderMethod}
                    onChange={(e) => setReminderMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  >
                    <option value="in_app">In-app notification</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="reminder-notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="reminder-notes"
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none"
                    placeholder="Additional notes about this reminder..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCloseSetReminderModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={editingReminderId ? handleUpdateReminder : handleCreateReminder}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  {editingReminderId ? 'Update Reminder' : 'Save Reminder'}
                </button>
              </div>
            </div>
          </div>
        )}
     </div>
   );
 };

export default MedicationTracker; 