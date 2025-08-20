import React, { useState, useEffect } from 'react';

const CareTeamScreen: React.FC = () => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [showShareConfirmationModal, setShowShareConfirmationModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSchoolIEPBuilder, setShowSchoolIEPBuilder] = useState(false);
  const [showEmergencyInfoBuilder, setShowEmergencyInfoBuilder] = useState(false);
  const [showVisitPacketBuilder, setShowVisitPacketBuilder] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('general');
  const [preSelectedRecipient, setPreSelectedRecipient] = useState<string>('');
  const [preSelectedAppointment, setPreSelectedAppointment] = useState<string>('');
  const [showLinkToAppointmentModal, setShowLinkToAppointmentModal] = useState(false);
  const [selectedDocumentForLinking, setSelectedDocumentForLinking] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'contacts' | 'appointments' | 'shareCenter' | 'packets' | 'documents'>('contacts');
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamGroups, setSelectedTeamGroups] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'usage'>('name');
  const [showFilters, setShowFilters] = useState(false);
  
  // Appointments state
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  
  // Add Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    timezone: 'America/New_York',
    providerId: '',
    providerName: '',
    clinicName: '',
    location: '',
    isVirtual: false,
    teleheathUrl: '',
    purpose: '',
    prepTemplate: ''
  });
  
  const [appointmentFormErrors, setAppointmentFormErrors] = useState<{[key: string]: string}>({});
  const [showPrepChecklist, setShowPrepChecklist] = useState(false);
  const [selectedAppointmentForPrep, setSelectedAppointmentForPrep] = useState<Appointment | null>(null);
  
  // Prep template options
  const prepTemplates = [
    { value: 'neurology', label: 'Neurology', specialties: ['Neurology'] },
    { value: 'gi', label: 'GI', specialties: ['GI'] },
    { value: 'genetics', label: 'Genetics', specialties: ['Genetics'] },
    { value: 'therapy', label: 'Therapy', specialties: ['PT/OT/SLP', 'Early Intervention'] },
    { value: 'school_iep', label: 'School/IEP', specialties: ['School'] }
  ];
  
  // Prep checklist data
  const prepChecklistData = {
    neurology: {
      questions: [
        'How have seizures been controlled since last visit?',
        'Any new seizure types or patterns?',
        'Side effects from current medications?',
        'Changes in sleep patterns?',
        'Any new developmental concerns?'
      ],
      items: [
        'Insurance card',
        'Current medication list',
        'Seizure log/diary',
        'School packet copy',
        'Recent EEG results (if available)'
      ],
      documents: [
        'Medication log',
        'Seizure diary',
        'School reports',
        'Previous visit notes'
      ]
    },
    gi: {
      questions: [
        'How is feeding tube functioning?',
        'Any skin irritation around tube site?',
        'Current nutrition tolerance?',
        'Bowel movement patterns?',
        'Weight changes?'
      ],
      items: [
        'Insurance card',
        'Feeding tube supplies',
        'Nutrition logs',
        'Weight records',
        'School packet copy'
      ],
      documents: [
        'Feeding logs',
        'Weight charts',
        'Nutrition plan',
        'Previous visit notes'
      ]
    },
    genetics: {
      questions: [
        'Any new family medical history?',
        'Changes in symptoms or development?',
        'Questions about genetic testing?',
        'Impact on family planning?',
        'Educational needs?'
      ],
      items: [
        'Insurance card',
        'Family medical history',
        'Previous genetic reports',
        'School packet copy',
        'Photos of any physical features'
      ],
      documents: [
        'Genetic test results',
        'Family history',
        'Previous evaluations',
        'School reports'
      ]
    },
    therapy: {
      questions: [
        'Progress on current goals?',
        'Any new challenges or concerns?',
        'How are exercises working at home?',
        'Changes in daily activities?',
        'Equipment needs?'
      ],
      items: [
        'Insurance card',
        'Current therapy goals',
        'Home exercise logs',
        'Equipment (if applicable)',
        'School packet copy'
      ],
      documents: [
        'Therapy goals',
        'Home exercise logs',
        'Progress reports',
        'Equipment manuals'
      ]
    },
    school_iep: {
      questions: [
        'How is current IEP working?',
        'Any new academic challenges?',
        'Social/behavioral concerns?',
        'Progress on current goals?',
        'Transition planning needs?'
      ],
      items: [
        'Current IEP document',
        'School progress reports',
        'Teacher communications',
        'Behavior logs (if applicable)',
        'Insurance card'
      ],
      documents: [
        'Current IEP',
        'Progress reports',
        'Teacher notes',
        'Behavior logs'
      ]
    }
  };
  
  // Add Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    role: '',
    specialties: [] as string[],
    organization: '',
    phone: '',
    email: '',
    portalUrl: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    preferredContact: '',
    teamGroups: [] as string[]
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Available options
  const roleOptions = ['Physician', 'Nurse', 'Therapist', 'School staff', 'Case manager', 'Other'];
  const specialtyOptions = ['Neurology', 'GI', 'Genetics', 'PT/OT/SLP', 'School', 'Early Intervention', 'Cardiology', 'Pulmonology', 'Endocrinology', 'Psychology', 'Nutrition'];
  const contactMethodOptions = ['Phone', 'Email', 'Portal', 'Text'];
  const teamGroupOptions = ['Medical', 'School', 'Therapy', 'Emergency'];
  
  // Click outside handler for more menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu && !(event.target as Element).closest('.more-menu-container')) {
        setShowMoreMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);
  
  // Toast handler
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Form handlers
  const handleFormChange = (field: string, value: string | string[]) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = contactForm.specialties.includes(specialty)
      ? contactForm.specialties.filter(s => s !== specialty)
      : [...contactForm.specialties, specialty];
    handleFormChange('specialties', newSpecialties);
  };
  
  const toggleTeamGroup = (group: string) => {
    const newGroups = contactForm.teamGroups.includes(group)
      ? contactForm.teamGroups.filter(g => g !== group)
      : [...contactForm.teamGroups, group];
    handleFormChange('teamGroups', newGroups);
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!contactForm.role) {
      errors.role = 'Role is required';
    }
    if (!contactForm.phone.trim() && !contactForm.email.trim()) {
      errors.contact = 'At least one contact method (phone or email) is required';
    }
    if (contactForm.email && !/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    
    // Focus on first invalid field
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`contact-${firstErrorField}`);
      if (element) {
        element.focus();
      }
      return false;
    }
    
    return true;
  };
  
  const handleSaveContact = () => {
    if (!validateForm()) return;
    
    const newContact: Contact = {
      id: Date.now().toString(),
      name: contactForm.name,
      role: contactForm.role,
      organization: contactForm.organization,
      specialties: contactForm.specialties,
      phone: contactForm.phone,
      email: contactForm.email,
      portalLink: contactForm.portalUrl || undefined,
      address: `${contactForm.street}${contactForm.city ? ', ' + contactForm.city : ''}${contactForm.state ? ', ' + contactForm.state : ''}${contactForm.zip ? ' ' + contactForm.zip : ''}`.trim(),
      notes: '',
      lastContact: new Date().toISOString().split('T')[0],
      careNotes: [],
      upcomingAppointments: [],
      shareAccess: { visitPackets: false, milestones: false, medications: false },
      teamGroups: contactForm.teamGroups
    };
    
    setContacts(prev => [...prev, newContact]);
    setShowAddContactModal(false);
    setContactForm({
      name: '', role: '', specialties: [], organization: '', phone: '', email: '', 
      portalUrl: '', street: '', city: '', state: '', zip: '', preferredContact: '', teamGroups: []
    });
    setFormErrors({});
    showToastMessage('Contact added');
  };
  
  const handleCancelContact = () => {
    setShowAddContactModal(false);
    setContactForm({
      name: '', role: '', specialties: [], organization: '', phone: '', email: '', 
      portalUrl: '', street: '', city: '', state: '', zip: '', preferredContact: '', teamGroups: []
    });
    setFormErrors({});
  };
  
  // Contact drawer handlers
  const openContactDrawer = (contactId: string) => {
    setSelectedContactId(contactId);
    setShowContactDrawer(true);
  };
  
  const closeContactDrawer = () => {
    setShowContactDrawer(false);
    setSelectedContactId(null);
    setNewNote('');
  };
  
  const addCareNote = () => {
    if (!newNote.trim() || !selectedContactId) return;
    
    const noteId = Date.now().toString();
    const timestamp = new Date().toISOString();
    
    setContacts(prev => prev.map(contact => 
      contact.id === selectedContactId 
        ? {
            ...contact,
            careNotes: [
              { id: noteId, text: newNote.trim(), timestamp },
              ...(contact.careNotes || [])
            ]
          }
        : contact
    ));
    
    setNewNote('');
    showToastMessage('Note added');
  };
  
  // Contact interface
  interface Contact {
    id: string;
    name: string;
    role: string;
    organization: string;
    specialties: string[];
    phone: string;
    email: string;
    portalLink?: string;
    address: string;
    notes?: string;
    lastContact?: string;
    careNotes?: Array<{
      id: string;
      text: string;
      timestamp: string;
    }>;
    upcomingAppointments?: Array<{
      id: string;
      date: string;
      time: string;
      type: string;
      location: string;
    }>;
          shareAccess?: {
        visitPackets: boolean;
        milestones: boolean;
        medications: boolean;
      };
            teamGroups?: string[];
    }

  // Appointment interface
  interface Appointment {
    id: string;
    dateTime: string; // ISO string
    contactId: string;
    contactName: string;
    clinicName: string;
    location: string;
    isVirtual: boolean;
    teleheathLink?: string;
    purpose: string;
    prepStatus: 'not_started' | 'in_progress' | 'ready';
    attachedDocs?: string[];
    notes?: string;
    timezone: string;
    prepTemplate?: string;
  }
 
  // Mock data - will be replaced with real data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Neurologist',
      organization: 'Children\'s Neurology Center',
      specialties: ['Neurology', 'Genetics'],
      phone: '(555) 123-4567',
      email: 'schen@neurocenter.com',
      portalLink: 'https://patient.portal.com/schen',
      address: '123 Medical Plaza, Suite 200, Anytown, ST 12345',
      notes: 'Familiar with Emma\'s seizure history. Prefers email communication.',
      lastContact: '2024-03-15',
      careNotes: [
        { id: '1', text: 'Discussed new seizure medication options', timestamp: '2024-03-15T10:30:00Z' },
        { id: '2', text: 'Recommended EEG follow-up in 3 months', timestamp: '2024-03-10T14:15:00Z' }
      ],
      upcomingAppointments: [
        { id: '1', date: '2024-03-25', time: '10:00 AM', type: 'Follow-up', location: 'Neurology Clinic' }
      ],
      shareAccess: { visitPackets: true, milestones: true, medications: true },
      teamGroups: ['Medical', 'Emergency']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Physical Therapist',
      organization: 'Pediatric Therapy Associates',
      specialties: ['PT/OT/SLP'],
      phone: '(555) 234-5678',
      email: 'mrodriguez@therapycenter.com',
      portalLink: 'https://patient.portal.com/mrodriguez',
      address: '456 Therapy Lane, Anytown, ST 12345',
      notes: 'Working on gross motor skills. Sessions twice weekly.',
      lastContact: '2024-03-12',
      careNotes: [
        { id: '3', text: 'Emma showed improvement in balance exercises', timestamp: '2024-03-12T11:00:00Z' }
      ],
      upcomingAppointments: [
        { id: '2', date: '2024-03-20', time: '2:00 PM', type: 'PT Session', location: 'Therapy Center' },
        { id: '3', date: '2024-03-22', time: '2:00 PM', type: 'PT Session', location: 'Therapy Center' }
      ],
      shareAccess: { visitPackets: false, milestones: true, medications: false },
      teamGroups: ['Therapy']
    },
    {
      id: '3',
      name: 'Lisa Thompson',
      role: 'Speech-Language Pathologist',
      organization: 'Communication First Clinic',
      specialties: ['PT/OT/SLP', 'Early Intervention'],
      phone: '(555) 345-6789',
      email: 'lthompson@speechtherapy.com',
      portalLink: 'https://patient.portal.com/lthompson',
      address: '789 Speech Street, Anytown, ST 12345',
      notes: 'Introduced new communication device last month. Great progress.',
      lastContact: '2024-03-10',
      careNotes: [
        { id: '4', text: 'Emma is making progress with "th" sounds', timestamp: '2024-03-08T15:30:00Z' }
      ],
      upcomingAppointments: [
        { id: '4', date: '2024-03-19', time: '3:00 PM', type: 'SLP Session', location: 'Therapy Center' }
      ],
      shareAccess: { visitPackets: false, milestones: true, medications: false },
      teamGroups: ['Therapy', 'Early Intervention']
    },
    {
      id: '4',
      name: 'Nurse Jennifer Wilson',
      role: 'School Nurse',
      organization: 'Anytown Elementary School',
      specialties: ['School'],
      phone: '(555) 456-7890',
      email: 'jwilson@schools.edu',
      address: '321 Education Ave, Anytown, ST 12345',
      notes: 'Monitors Emma\'s medication schedule during school hours.',
      lastContact: '2024-03-08',
      careNotes: [
        { id: '5', text: 'Updated medication schedule for new school year', timestamp: '2024-03-08T09:00:00Z' }
      ],
      upcomingAppointments: [],
      shareAccess: { visitPackets: true, milestones: false, medications: true },
      teamGroups: ['School']
    },
    {
      id: '5',
      name: 'Dr. Robert Kim',
      role: 'Gastroenterologist',
      organization: 'Pediatric GI Specialists',
      specialties: ['GI'],
      phone: '(555) 567-8901',
      email: 'rkim@gispecialists.com',
      portalLink: 'https://patient.portal.com/rkim',
      address: '654 Digestive Drive, Anytown, ST 12345',
      notes: 'Managing Emma\'s feeding tube and nutritional needs.',
      lastContact: '2024-03-05',
      careNotes: [
        { id: '6', text: 'Reviewed feeding tube placement and nutrition plan', timestamp: '2024-03-05T11:15:00Z' }
      ],
      upcomingAppointments: [
        { id: '5', date: '2024-04-02', time: '1:00 PM', type: 'Follow-up', location: 'GI Clinic' }
      ],
      shareAccess: { visitPackets: true, milestones: false, medications: true },
      teamGroups: ['Medical']
    }
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      dateTime: '2024-03-25T10:00:00.000Z',
      contactId: '1',
      contactName: 'Dr. Sarah Chen',
      clinicName: 'Children\'s Neurology Center',
      location: '123 Medical Plaza, Suite 200, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Quarterly seizure management review and EEG results',
      prepStatus: 'in_progress',
      attachedDocs: ['recent_seizure_log.pdf'],
      notes: 'Bring list of current medications and recent seizure episodes',
      timezone: 'America/New_York'
    },
    {
      id: '2',
      dateTime: '2024-03-20T14:00:00.000Z',
      contactId: '2',
      contactName: 'Michael Rodriguez',
      clinicName: 'Pediatric Therapy Associates',
      location: '456 Therapy Lane, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Physical therapy session - balance and coordination',
      prepStatus: 'ready',
      attachedDocs: [],
      notes: 'Wear comfortable clothes and sneakers',
      timezone: 'America/New_York'
    },
    {
      id: '3',
      dateTime: '2024-03-22T14:00:00.000Z',
      contactId: '2',
      contactName: 'Michael Rodriguez',
      clinicName: 'Pediatric Therapy Associates',
      location: '456 Therapy Lane, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Physical therapy session - strength building',
      prepStatus: 'not_started',
      attachedDocs: [],
      notes: '',
      timezone: 'America/New_York'
    },
    {
      id: '4',
      dateTime: '2024-03-19T15:00:00.000Z',
      contactId: '3',
      contactName: 'Lisa Thompson',
      clinicName: 'Communication First Clinic',
      location: 'Virtual Session',
      isVirtual: true,
      teleheathLink: 'https://zoom.us/j/123456789',
      purpose: 'Speech therapy - communication device training',
      prepStatus: 'ready',
      attachedDocs: ['communication_goals.pdf'],
      notes: 'Have communication device charged and ready',
      timezone: 'America/New_York'
    },
    {
      id: '5',
      dateTime: '2024-04-02T13:00:00.000Z',
      contactId: '5',
      contactName: 'Dr. Robert Kim',
      clinicName: 'Pediatric GI Specialists',
      location: '654 Digestive Drive, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Feeding tube follow-up and nutrition assessment',
      prepStatus: 'not_started',
      attachedDocs: [],
      notes: 'Bring feeding logs from past month',
      timezone: 'America/New_York'
    },
    // Past appointments
    {
      id: '6',
      dateTime: '2024-03-15T10:30:00.000Z',
      contactId: '1',
      contactName: 'Dr. Sarah Chen',
      clinicName: 'Children\'s Neurology Center',
      location: '123 Medical Plaza, Suite 200, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Medication adjustment consultation',
      prepStatus: 'ready',
      attachedDocs: ['medication_log.pdf'],
      notes: 'Discussed new seizure medication options',
      timezone: 'America/New_York'
    },
    {
      id: '7',
      dateTime: '2024-03-12T11:00:00.000Z',
      contactId: '2',
      contactName: 'Michael Rodriguez',
      clinicName: 'Pediatric Therapy Associates',
      location: '456 Therapy Lane, Anytown, ST 12345',
      isVirtual: false,
      purpose: 'Physical therapy evaluation',
      prepStatus: 'ready',
      attachedDocs: [],
      notes: 'Emma showed improvement in balance exercises',
      timezone: 'America/New_York'
    }
  ]);
  
    const selectedContact = selectedContactId ? contacts.find(c => c.id === selectedContactId) : null;
  
  // Filter and search logic
  const filteredContacts = contacts.filter(contact => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Team group filter
    const matchesTeamGroups = selectedTeamGroups.length === 0 || 
      selectedTeamGroups.some(group => contact.teamGroups?.includes(group));
    
    // Specialty filter
    const matchesSpecialties = selectedSpecialties.length === 0 || 
      selectedSpecialties.some(specialty => contact.specialties.includes(specialty));
    
    // Role filter
    const matchesRoles = selectedRoles.length === 0 || 
      selectedRoles.some(role => contact.role === role);
    
    return matchesSearch && matchesTeamGroups && matchesSpecialties && matchesRoles;
  });
  
  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.lastContact || '1970-01-01').getTime() - new Date(a.lastContact || '1970-01-01').getTime();
      case 'usage':
        // Mock usage data - in real app this would come from actual usage tracking
        const aUsage = (a.careNotes?.length || 0) + (a.upcomingAppointments?.length || 0);
        const bUsage = (b.careNotes?.length || 0) + (b.upcomingAppointments?.length || 0);
        return bUsage - aUsage;
      default:
        return 0;
    }
  });
  
  // Get unique values for filter options
  const allTeamGroups = Array.from(new Set(contacts.flatMap(c => c.teamGroups || [])));
  const allSpecialties = Array.from(new Set(contacts.flatMap(c => c.specialties)));
  const allRoles = Array.from(new Set(contacts.map(c => c.role)));
  
  // Filter toggle handlers
  const toggleFilterTeamGroup = (group: string) => {
    setSelectedTeamGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };
  
  const toggleFilterSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };
  
  const toggleFilterRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTeamGroups([]);
    setSelectedSpecialties([]);
    setSelectedRoles([]);
    setSortBy('name');
  };
  
  // Appointment helper functions
  const now = new Date();
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const pastAppointments = appointments
    .filter(apt => new Date(apt.dateTime) < now)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  
  const formatAppointmentDateTime = (dateTime: string, timezone: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };
  
  const getPrepStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPrepStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not started';
      case 'in_progress':
        return 'In progress';
      case 'ready':
        return 'Ready';
      default:
        return 'Unknown';
    }
  };
  
  const updateAppointmentPrepStatus = (appointmentId: string, newStatus: 'not_started' | 'in_progress' | 'ready') => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, prepStatus: newStatus } : apt
    ));
    showToastMessage(`Prep status updated to ${getPrepStatusText(newStatus)}`);
  };
  
  // Appointment form handlers
  const handleAppointmentFormChange = (field: string, value: any) => {
    setAppointmentForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (appointmentFormErrors[field]) {
      setAppointmentFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Auto-select prep template based on provider specialty
    if (field === 'providerId' && value) {
      const selectedContact = contacts.find(c => c.id === value);
      if (selectedContact) {
        const matchingTemplate = prepTemplates.find(template => 
          template.specialties.some(specialty => 
            selectedContact.specialties.includes(specialty)
          )
        );
        if (matchingTemplate) {
          setAppointmentForm(prev => ({ 
            ...prev, 
            providerId: value,
            providerName: selectedContact.name,
            clinicName: selectedContact.organization,
            prepTemplate: matchingTemplate.value 
          }));
        } else {
          setAppointmentForm(prev => ({ 
            ...prev, 
            providerId: value,
            providerName: selectedContact.name,
            clinicName: selectedContact.organization
          }));
        }
      }
    }
  };
  
  const validateAppointmentForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!appointmentForm.date) {
      errors.date = 'Date is required';
    }
    if (!appointmentForm.time) {
      errors.time = 'Time is required';
    }
    if (!appointmentForm.providerName && !appointmentForm.clinicName) {
      errors.provider = 'Provider or clinic is required';
    }
    if (!appointmentForm.purpose) {
      errors.purpose = 'Purpose is required';
    }
    if (!appointmentForm.location && !appointmentForm.teleheathUrl) {
      errors.location = 'Location or telehealth URL is required';
    }
    
    setAppointmentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveAppointment = () => {
    if (!validateAppointmentForm()) return;
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      dateTime: new Date(`${appointmentForm.date}T${appointmentForm.time}`).toISOString(),
      contactId: appointmentForm.providerId || 'adhoc',
      contactName: appointmentForm.providerName || 'Ad hoc provider',
      clinicName: appointmentForm.clinicName || 'Ad hoc clinic',
      location: appointmentForm.isVirtual ? 'Virtual Session' : appointmentForm.location,
      isVirtual: appointmentForm.isVirtual,
      teleheathLink: appointmentForm.isVirtual ? appointmentForm.teleheathUrl : undefined,
      purpose: appointmentForm.purpose,
      prepStatus: 'not_started',
      attachedDocs: [],
      notes: '',
      timezone: appointmentForm.timezone,
      prepTemplate: appointmentForm.prepTemplate
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setShowAddAppointmentModal(false);
    
    // Reset form
    setAppointmentForm({
      date: '', time: '', timezone: 'America/New_York', providerId: '', providerName: '', 
      clinicName: '', location: '', isVirtual: false, teleheathUrl: '', purpose: '', prepTemplate: ''
    });
    setAppointmentFormErrors({});
    
    // Show success toast and offer prep checklist
    showToastMessage('Appointment added');
    setTimeout(() => {
      if (window.confirm('Open prep checklist now?')) {
        openPrepChecklist(newAppointment);
      }
    }, 1000);
  };
  
  const handleCancelAppointment = () => {
    setShowAddAppointmentModal(false);
    setAppointmentForm({
      date: '', time: '', timezone: 'America/New_York', providerId: '', providerName: '', 
      clinicName: '', location: '', isVirtual: false, teleheathUrl: '', purpose: '', prepTemplate: ''
    });
    setAppointmentFormErrors({});
  };
  
  // Prep checklist handlers
  const openPrepChecklist = (appointment: Appointment) => {
    setSelectedAppointmentForPrep(appointment);
    setShowPrepChecklist(true);
  };

  // ICS Calendar file generation
  const generateICSFile = (appointment: Partial<Appointment>) => {
    if (!appointment.dateTime || !appointment.contactName || !appointment.purpose) {
      return;
    }

    const startDate = new Date(appointment.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CareGene//Appointment Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appointment.id || 'appointment'}-${Date.now()}@caregene.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${appointment.purpose}`,
      `DESCRIPTION:Appointment with ${appointment.contactName}${appointment.clinicName ? ` at ${appointment.clinicName}` : ''}`,
      `LOCATION:${appointment.location || 'TBD'}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${appointment.purpose}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${appointment.contactName?.replace(/\s+/g, '-')}-${startDate.toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success toast
    setToastMessage('Calendar event added successfully!');
    setShowToast(true);
  };
  
  const closePrepChecklist = () => {
    setShowPrepChecklist(false);
    setSelectedAppointmentForPrep(null);
  };
  
  const getPrepTemplate = (appointment: Appointment) => {
    // Try to get template from appointment prepTemplate field
    if (appointment.prepTemplate) {
      return appointment.prepTemplate;
    }
    
    // Fall back to inferring from contact specialty
    const contact = contacts.find(c => c.id === appointment.contactId);
    if (contact) {
      const matchingTemplate = prepTemplates.find(template => 
        template.specialties.some(specialty => 
          contact.specialties.includes(specialty)
        )
      );
      return matchingTemplate?.value || 'neurology'; // Default fallback
    }
    
    return 'neurology'; // Default fallback
  };
  
  const getPrepProgress = (appointment: Appointment) => {
    const template = getPrepTemplate(appointment);
    const data = prepChecklistData[template as keyof typeof prepChecklistData];
    if (!data) return 0;
    
    const totalItems = data.questions.length + data.items.length + data.documents.length;
    // For now, return a mock progress - in real app this would track actual completion
    return Math.floor(Math.random() * 100); // Mock progress
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Care Team Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Care Team</h1>
              <p className="mt-1 text-sm text-gray-600">Contacts, sharing, and visit prep all in one place.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Primary Action */}
          <button 
                onClick={() => setShowAddContactModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Contact
              </button>
              
              {/* Secondary Action */}
              <button
                onClick={() => setShowAddAppointmentModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Appointment
              </button>
              
              {/* Overflow Menu */}
              <div className="relative">
          <button 
                  onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                
                {showOverflowMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          setActiveTab('shareCenter');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Share Center
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          setActiveTab('packets');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Packets
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          setActiveTab('documents');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Documents
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: Horizontal tabs */}
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('shareCenter')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shareCenter'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Share Center
              </button>
              <button
                onClick={() => setActiveTab('packets')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'packets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Packets
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          {/* Mobile: Scrollable pills */}
          <div className="sm:hidden">
            <div className="flex space-x-4 overflow-x-auto py-4">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'contacts'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'appointments'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('shareCenter')}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'shareCenter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Share Center
              </button>
              <button
                onClick={() => setActiveTab('packets')}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'packets'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Packets
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'documents'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'contacts' && (
          <div>
            {contacts.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M34 20a6 6 0 11-12 0 6 6 0 0112 0zM14 20a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No contacts yet</h3>
                <p className="mt-2 text-sm text-gray-500">Add your first contact to get started.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddContactModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Contact
                  </button>
                </div>
              </div>
            ) : (
              // Contacts Directory
              <div>
                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts by name, organization, or specialty..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Filters and Sort Row */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Filter Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                      {(selectedTeamGroups.length > 0 || selectedSpecialties.length > 0 || selectedRoles.length > 0) && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedTeamGroups.length + selectedSpecialties.length + selectedRoles.length}
                        </span>
                      )}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'recent' | 'usage')}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="name">A–Z</option>
                        <option value="recent">Recently added</option>
                        <option value="usage">Most used</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchQuery || selectedTeamGroups.length > 0 || selectedSpecialties.length > 0 || selectedRoles.length > 0) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Filters Panel */}
                  {showFilters && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                      {/* Team Groups */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Team Groups</h4>
                        <div className="flex flex-wrap gap-2">
                          {allTeamGroups.map((group) => (
                            <button
                              key={group}
                              onClick={() => toggleFilterTeamGroup(group)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${
                                selectedTeamGroups.includes(group)
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {group}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {allSpecialties.map((specialty) => (
                            <button
                              key={specialty}
                              onClick={() => toggleFilterSpecialty(specialty)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${
                                selectedSpecialties.includes(specialty)
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {specialty}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Roles */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Roles</h4>
                        <div className="flex flex-wrap gap-2">
                          {allRoles.map((role) => (
                            <button
                              key={role}
                              onClick={() => toggleFilterRole(role)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${
                                selectedRoles.includes(role)
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Count */}
                  <div className="text-sm text-gray-600">
                    {sortedContacts.length} of {contacts.length} contacts
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openContactDrawer(contact.id)}
                    >
                      {/* Contact Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                          <p className="text-sm text-gray-500">{contact.organization}</p>
                        </div>
                        
                        {/* More Menu */}
                        <div className="relative more-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMoreMenu(showMoreMenu === contact.id ? null : contact.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          {showMoreMenu === contact.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Edit
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Archive
                                </button>
                                <button 
                                  onClick={() => {
                                    setShowDeleteConfirm(contact.id);
                                    setShowMoreMenu(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Specialty Tags */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {contact.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Methods */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {contact.phone}
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {contact.email}
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>

                        {contact.portalLink && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Patient Portal
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">{contact.address}</span>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
                      {contact.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">{contact.notes}</p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                                  <button 
                            onClick={() => {
                              setPreSelectedRecipient(contact.name);
                              setActiveTab('shareCenter');
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Share
                          </button>
                        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          Add Note
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          Add Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'appointments' && (
          <div>
            {/* Appointments List */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
                <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">Dr. Sarah Chen</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Children's Neurology Center</p>
                        <p className="text-sm text-gray-500">Follow-up neurology consultation</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Dec 15, 2024</p>
                        <p className="text-sm text-gray-600">2:30 PM</p>
                        <p className="text-xs text-gray-500 mt-1">EST</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">123 Medical Plaza, Suite 400, Boston MA 02115</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => openPrepChecklist({ 
                          id: '1', 
                          contactId: 'contact-1',
                          contactName: 'Dr. Sarah Chen', 
                          purpose: 'Follow-up neurology consultation',
                          dateTime: '2024-12-15T14:30:00',
                          clinicName: 'Children\'s Neurology Center',
                          prepStatus: 'in_progress',
                          timezone: 'America/New_York',
                          location: '123 Medical Plaza, Suite 400, Boston MA 02115',
                          isVirtual: false
                        })}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Prep
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attach docs
                      </button>
                      <button 
                        onClick={() => generateICSFile({
                          id: '1',
                          contactName: 'Dr. Sarah Chen',
                          purpose: 'Follow-up neurology consultation',
                          dateTime: '2024-12-15T14:30:00',
                          clinicName: 'Children\'s Neurology Center',
                          location: '123 Medical Plaza, Suite 400, Boston MA 02115',
                          timezone: 'America/New_York'
                        })}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                        </svg>
                        Add to calendar
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">Michael Rodriguez, PT</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Ready
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Pediatric Physical Therapy</p>
                        <p className="text-sm text-gray-500">Weekly PT session</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Dec 16, 2024</p>
                        <p className="text-sm text-gray-600">10:00 AM</p>
                        <p className="text-xs text-gray-500 mt-1">EST</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">456 Therapy Center Dr, Cambridge MA 02139</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => openPrepChecklist({ 
                          id: '2', 
                          contactId: 'contact-2',
                          contactName: 'Michael Rodriguez, PT', 
                          purpose: 'Weekly PT session',
                          dateTime: '2024-12-16T10:00:00',
                          clinicName: 'Pediatric Physical Therapy',
                          prepStatus: 'ready',
                          timezone: 'America/New_York',
                          location: '456 Therapy Center Dr, Cambridge MA 02139',
                          isVirtual: false
                        })}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Prep
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attach docs
                      </button>
                      <button 
                        onClick={() => generateICSFile({
                          id: '2',
                          contactName: 'Michael Rodriguez, PT',
                          purpose: 'Weekly PT session',
                          dateTime: '2024-12-16T10:00:00',
                          clinicName: 'Pediatric Physical Therapy',
                          location: '456 Therapy Center Dr, Cambridge MA 02139',
                          timezone: 'America/New_York'
                        })}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                        </svg>
                        Add to calendar
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Appointments */}
              <div>
                <button
                  onClick={() => setShowPastAppointments(!showPastAppointments)}
                  className="flex items-center justify-between w-full text-left py-2 text-lg font-medium text-gray-900 hover:text-gray-700"
                >
                  <span>Past Appointments (2)</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${showPastAppointments ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {showPastAppointments && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-700">Dr. Jennifer Walsh</h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                              Completed
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">GI Specialists</p>
                          <p className="text-sm text-gray-500">Nutrition consultation</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">Nov 28, 2024</p>
                          <p className="text-sm text-gray-500">1:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'shareCenter' && (
          <div className="space-y-6">
            {/* Share Center Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Center</h2>
              <p className="mt-1 text-sm text-gray-600">Choose what to share, with whom, and for how long.</p>
            </div>

            {/* Share Center Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Share Controls */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share Controls</h3>
                
                {/* Pick Recipients */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick recipient(s)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  {/* Selected Recipients */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preSelectedRecipient && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {preSelectedRecipient}
                        <button 
                          onClick={() => setPreSelectedRecipient('')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Dr. Sarah Chen
                      <button className="ml-1 text-blue-600 hover:text-blue-800">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>
                  {preSelectedRecipient && (
                    <p className="text-xs text-blue-600 mt-2">
                      ✓ {preSelectedRecipient} pre-selected from contact
                    </p>
                  )}
                </div>

                {/* Choose Content to Share */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose content to share
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Visit Packets</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Milestone Report</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Medication list (read-only)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Nutrition plan (read-only; if available)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Emergency info</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Appointments (upcoming only)</span>
                    </label>
                  </div>
                </div>

                {/* Access Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access type
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Secure link with expiry (7 days)</option>
                    <option>Secure link with expiry (30 days)</option>
                    <option>Secure link with expiry (90 days)</option>
                    <option>Custom expiry</option>
                    <option>PDF attachment (generate and download)</option>
                  </select>
                </div>

                {/* Permissions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="permissions" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">View only (default)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="permissions" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Download allowed</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add a short note..."
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowShareConfirmationModal(true)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create share link
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Generate PDF
                  </button>
                </div>
              </div>

              {/* Right Column: Active Shares */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Shares</h3>
                
                {/* Active Share Links */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Dr. Sarah Chen</h4>
                        <p className="text-xs text-gray-500">Visit Packets, Milestone Report</p>
                        <p className="text-xs text-gray-500">Created: Dec 10, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Expires: Dec 17, 2024</p>
                        <p className="text-xs text-gray-500">Views: 3</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                        Copy link
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        Extend expiry
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100">
                        Revoke
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Michael Rodriguez, PT</h4>
                        <p className="text-xs text-gray-500">Milestone Report, Appointments</p>
                        <p className="text-xs text-gray-500">Created: Dec 8, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Expires: Dec 15, 2024</p>
                        <p className="text-xs text-gray-500">Views: 1</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                        Copy link
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                        Extend expiry
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>

                {/* Past Shares */}
                <div className="mt-6">
                  <button className="flex items-center justify-between w-full text-left py-2 text-sm font-medium text-gray-900 hover:text-gray-700">
                    <span>Past shares (5)</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Log Panel */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <button 
                  onClick={() => setShowAuditLog(!showAuditLog)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Audit Log</h3>
                    <p className="text-sm text-gray-600">Track all sharing activity and access</p>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${showAuditLog ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {showAuditLog && (
                <div className="px-6 py-4">
                  {/* Filters */}
                  <div className="mb-4 flex flex-wrap gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by recipient</label>
                      <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All recipients</option>
                        <option value="dr-chen">Dr. Sarah Chen</option>
                        <option value="michael-pt">Michael Rodriguez, PT</option>
                        <option value="dr-walsh">Dr. Jennifer Walsh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by content</label>
                      <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All content</option>
                        <option value="visit-packets">Visit Packets</option>
                        <option value="milestone-report">Milestone Report</option>
                        <option value="medication-list">Medication List</option>
                        <option value="nutrition-plan">Nutrition Plan</option>
                        <option value="emergency-info">Emergency Info</option>
                        <option value="appointments">Appointments</option>
                      </select>
                    </div>
                  </div>

                  {/* Audit Log Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dec 10, 2024 2:30 PM</td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Link Created
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Visit Packets, Milestone Report</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Sarah Chen</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dec 10, 2024 2:35 PM</td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Link Viewed
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Visit Packets, Milestone Report</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Sarah Chen</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dec 8, 2024 10:15 AM</td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Link Created
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Milestone Report, Appointments</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Michael Rodriguez, PT</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dec 8, 2024 10:20 AM</td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Link Expired
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Milestone Report, Appointments</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Michael Rodriguez, PT</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Nov 28, 2024 1:00 PM</td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Link Created
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Nutrition Plan</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Jennifer Walsh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'packets' && (
          <div className="space-y-6">
            {/* Packets Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Packets</h2>
              <p className="mt-1 text-sm text-gray-600">Build and manage information packets for different purposes</p>
            </div>

            {/* Packets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* School/IEP Packet Tile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">School/IEP Packet</h3>
                    <p className="text-sm text-gray-500">Academic and developmental information</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowSchoolIEPBuilder(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Build
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Open last
                  </button>
                </div>
              </div>

              {/* Emergency Info Tile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Emergency Info</h3>
                    <p className="text-sm text-gray-500">Critical medical and contact details</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowEmergencyInfoBuilder(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Build
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Open last
                  </button>
                </div>
              </div>

              {/* Visit Packet Tile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Visit Packet</h3>
                    <p className="text-sm text-gray-500">Pulls from Home and Journal selections</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowVisitPacketBuilder(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Build
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Open last
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Document
              </button>
            </div>
            
            <div className="flex space-x-6">
              {/* Left: Folders */}
              <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Folders</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedFolder('general')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedFolder === 'general' 
                        ? 'text-gray-700 bg-blue-50 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${selectedFolder === 'general' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>General</span>
                  </button>
                  <button 
                    onClick={() => setSelectedFolder('school')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedFolder === 'school' 
                        ? 'text-gray-700 bg-blue-50 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${selectedFolder === 'school' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>School</span>
                  </button>
                  <button 
                    onClick={() => setSelectedFolder('medical')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedFolder === 'medical' 
                        ? 'text-gray-700 bg-blue-50 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${selectedFolder === 'medical' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Medical</span>
                  </button>
                  <button 
                    onClick={() => setSelectedFolder('insurance')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedFolder === 'insurance' 
                        ? 'text-gray-700 bg-blue-50 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${selectedFolder === 'insurance' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Insurance</span>
                  </button>
                </div>
              </div>

              {/* Right: File List */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Files</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked to</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">IEP_2024.pdf</div>
                              <div className="text-sm text-gray-500">2.3 MB</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">PDF</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 10, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dr. Sarah Chen</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Rename</button>
                            <button className="text-gray-600 hover:text-gray-900">Move</button>
                            <button 
                              onClick={() => {
                                setSelectedDocumentForLinking('IEP_2024.pdf');
                                setShowLinkToAppointmentModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Link
                            </button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Insurance_Card.jpg</div>
                              <div className="text-sm text-gray-500">1.1 MB</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Image</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 8, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Rename</button>
                            <button className="text-gray-600 hover:text-gray-900">Move</button>
                            <button className="text-gray-600 hover:text-gray-900">Link</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Medical_Records.docx</div>
                              <div className="text-sm text-gray-500">3.7 MB</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Document</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 5, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Neurology Visit</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Rename</button>
                            <button className="text-gray-600 hover:text-gray-900">Move</button>
                            <button 
                              onClick={() => {
                                setSelectedDocumentForLinking('Medical_Records.docx');
                                setShowLinkToAppointmentModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Link
                            </button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Prescription_List.pdf</div>
                              <div className="text-sm text-gray-500">0.8 MB</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">PDF</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 3, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Rename</button>
                            <button className="text-gray-600 hover:text-gray-900">Move</button>
                            <button 
                              onClick={() => {
                                setSelectedDocumentForLinking('Prescription_List.pdf');
                                setShowLinkToAppointmentModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Link
                            </button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Templates Section */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* School Medication Permission Template */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">School Medication Permission</h5>
                      <p className="text-xs text-gray-500">Blank template</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTemplate('school-medication');
                      setShowTemplateModal(true);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Document
                  </button>
                </div>

                {/* Therapy Plan of Care Template */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Therapy Plan of Care</h5>
                      <p className="text-xs text-gray-500">Blank template</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTemplate('therapy-plan');
                      setShowTemplateModal(true);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create Document
                  </button>
                </div>

                {/* Release of Information Template */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Release of Information</h5>
                      <p className="text-xs text-gray-500">Blank template</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTemplate('release-info');
                      setShowTemplateModal(true);
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Create Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Add Contact</h3>
              
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="contact-role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contact-role"
                      value={contactForm.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.role ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select role</option>
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="contact-organization"
                    value={contactForm.organization}
                    onChange={(e) => handleFormChange('organization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital, clinic, or organization name"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map(specialty => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleSpecialty(specialty)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          contactForm.specialties.includes(specialty)
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        value={contactForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={contactForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="email@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>
        </div>

                  <div className="mt-4">
                    <label htmlFor="contact-portal" className="block text-sm font-medium text-gray-700 mb-1">
                      Portal URL
                    </label>
                    <input
                      type="url"
                      id="contact-portal"
                      value={contactForm.portalUrl}
                      onChange={(e) => handleFormChange('portalUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://patient.portal.com"
                    />
        </div>

                  {formErrors.contact && <p className="text-red-500 text-xs mt-2">{formErrors.contact}</p>}
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Address</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="contact-street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="contact-street"
                        value={contactForm.street}
                        onChange={(e) => handleFormChange('street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street, Suite 100"
                      />
        </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <label htmlFor="contact-city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="contact-city"
                          value={contactForm.city}
                          onChange={(e) => handleFormChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="City"
                        />
        </div>

                      <div>
                        <label htmlFor="contact-state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="contact-state"
                          value={contactForm.state}
                          onChange={(e) => handleFormChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ST"
                          maxLength={2}
                        />
        </div>

                      <div>
                        <label htmlFor="contact-zip" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP
                        </label>
                        <input
                          type="text"
                          id="contact-zip"
                          value={contactForm.zip}
                          onChange={(e) => handleFormChange('zip', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="12345"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {contactMethodOptions.map(method => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={contactForm.preferredContact === method}
                          onChange={(e) => handleFormChange('preferredContact', e.target.value)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team Groups */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Groups
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {teamGroupOptions.map(group => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => toggleTeamGroup(group)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          contactForm.teamGroups.includes(group)
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelContact}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
              {showAddAppointmentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-gray-900">New Appointment</h3>
                  <button
                    onClick={handleCancelAppointment}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Date, Time, Timezone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) => handleAppointmentFormChange('date', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          appointmentFormErrors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {appointmentFormErrors.date && (
                        <p className="mt-1 text-sm text-red-600">{appointmentFormErrors.date}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                      <input
                        type="time"
                        value={appointmentForm.time}
                        onChange={(e) => handleAppointmentFormChange('time', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          appointmentFormErrors.time ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {appointmentFormErrors.time && (
                        <p className="mt-1 text-sm text-red-600">{appointmentFormErrors.time}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={appointmentForm.timezone}
                        onChange={(e) => handleAppointmentFormChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  {/* Provider/Clinic Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider/Clinic *</label>
                    
                    {/* Existing Contact Search */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-2">Search existing contacts</label>
                      <select
                        value={appointmentForm.providerId}
                        onChange={(e) => handleAppointmentFormChange('providerId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a contact...</option>
                        {contacts.map(contact => (
                          <option key={contact.id} value={contact.id}>
                            {contact.name} - {contact.role} ({contact.organization})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Or Add Ad Hoc */}
                    <div className="text-sm text-gray-600 mb-3">Or add ad hoc provider/clinic:</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Provider name"
                          value={appointmentForm.providerName}
                          onChange={(e) => handleAppointmentFormChange('providerName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Clinic/organization"
                          value={appointmentForm.clinicName}
                          onChange={(e) => handleAppointmentFormChange('clinicName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    {appointmentFormErrors.provider && (
                      <p className="mt-1 text-sm text-red-600">{appointmentFormErrors.provider}</p>
                    )}
                  </div>

                  {/* Location Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    
                    <div className="mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={appointmentForm.isVirtual}
                          onChange={(e) => handleAppointmentFormChange('isVirtual', e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Virtual appointment (telehealth)</span>
                      </label>
                    </div>
                    
                    {appointmentForm.isVirtual ? (
                      <input
                        type="url"
                        placeholder="Telehealth URL (Zoom, Teams, etc.)"
                        value={appointmentForm.teleheathUrl}
                        onChange={(e) => handleAppointmentFormChange('teleheathUrl', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          appointmentFormErrors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Address or location"
                        value={appointmentForm.location}
                        onChange={(e) => handleAppointmentFormChange('location', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          appointmentFormErrors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    )}
                    
                    {appointmentFormErrors.location && (
                      <p className="mt-1 text-sm text-red-600">{appointmentFormErrors.location}</p>
                    )}
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                    <textarea
                      placeholder="e.g., Follow-up neurology, Physical therapy evaluation, IEP meeting..."
                      value={appointmentForm.purpose}
                      onChange={(e) => handleAppointmentFormChange('purpose', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        appointmentFormErrors.purpose ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {appointmentFormErrors.purpose && (
                      <p className="mt-1 text-sm text-red-600">{appointmentFormErrors.purpose}</p>
                    )}
                  </div>

                  {/* Prep Template */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prep Template</label>
                    <select
                      value={appointmentForm.prepTemplate}
                      onChange={(e) => handleAppointmentFormChange('prepTemplate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a prep template...</option>
                      {prepTemplates.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      This will help generate a prep checklist. Default is inferred from provider specialty.
          </p>
          </div>
        </div>
                
                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={handleCancelAppointment}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAppointment}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Contact</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this contact? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Delete contact logic
                    setContacts(contacts.filter(c => c.id !== showDeleteConfirm));
                    setShowDeleteConfirm(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Drawer */}
      {showContactDrawer && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50" onClick={closeContactDrawer}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-sm text-gray-600">{selectedContact.role}</p>
                    <p className="text-sm text-gray-500">{selectedContact.organization}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedContact.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={closeContactDrawer}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Communication */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Communication</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedContact.phone}
                      </div>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedContact.email}
                      </div>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {selectedContact.portalLink && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Patient Portal
                        </div>
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Care Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Care Notes</h3>
                  </div>
                  
                  {/* Add Note */}
                  <div className="mb-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a care note..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={addCareNote}
                      disabled={!newNote.trim()}
                      className="mt-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Note
                    </button>
                  </div>
                  
                  {/* Notes List */}
                  <div className="space-y-3">
                    {selectedContact.careNotes && selectedContact.careNotes.length > 0 ? (
                      selectedContact.careNotes.map((note) => (
                        <div key={note.id} className="bg-gray-50 rounded-md p-3">
                          <p className="text-sm text-gray-800">{note.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No care notes yet</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Upcoming Appointments</h3>
                    <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Add Appointment
                    </button>
        </div>

                  <div className="space-y-3">
                    {selectedContact.upcomingAppointments && selectedContact.upcomingAppointments.length > 0 ? (
                      selectedContact.upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                              <p className="text-sm text-gray-600">{appointment.location}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                            </div>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No upcoming appointments</p>
                    )}
                  </div>
                </div>

                {/* Share Access Summary */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Share Access</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visit Packets</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContact.shareAccess?.visitPackets 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedContact.shareAccess?.visitPackets ? 'Has Access' : 'No Access'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Milestones</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContact.shareAccess?.milestones 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedContact.shareAccess?.milestones ? 'Has Access' : 'No Access'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Medications</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContact.shareAccess?.medications 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedContact.shareAccess?.medications ? 'Has Access' : 'No Access'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      closeContactDrawer();
                      setActiveTab('shareCenter');
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Share
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Add Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prep Checklist Drawer */}
      {showPrepChecklist && selectedAppointmentForPrep && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50" onClick={closePrepChecklist}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-lg transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedAppointmentForPrep.contactName} Prep
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedAppointmentForPrep.purpose}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedAppointmentForPrep.dateTime).toLocaleDateString()} at{' '}
                      {new Date(selectedAppointmentForPrep.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <button
                    onClick={closePrepChecklist}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Prep Progress</span>
                    <span>{getPrepProgress(selectedAppointmentForPrep)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getPrepProgress(selectedAppointmentForPrep)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {(() => {
                  const template = getPrepTemplate(selectedAppointmentForPrep);
                  const data = prepChecklistData[template as keyof typeof prepChecklistData];
                  if (!data) return <div>No prep data available</div>;
                  
                  return (
                    <>
                      {/* Questions to Ask */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Questions to Ask</h3>
                        <div className="space-y-3">
                          {data.questions.map((question, index) => (
                            <label key={index} className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{question}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Items to Bring */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Items to Bring</h3>
                        <div className="space-y-3">
                          {data.items.map((item, index) => (
                            <label key={index} className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Documents to Attach */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Documents to Attach</h3>
                        <div className="space-y-3">
                          {data.documents.map((doc, index) => (
                            <label key={index} className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{doc}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 space-y-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                            Link from Documents library
                          </button>
                          <button 
                            onClick={() => {
                              closePrepChecklist();
                              setActiveTab('packets');
                            }}
                            className="block text-sm text-green-600 hover:text-green-800 underline"
                          >
                            📋 Attach Visit Packet (if exists)
                          </button>
                        </div>
                      </div>

                      {/* Add Custom Task */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Tasks</h3>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add a custom task..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Add
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Mark Ready
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Print Prep
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Share Prep
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* School/IEP Packet Builder Modal */}
      {showSchoolIEPBuilder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-5 mx-auto p-4 border max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] flex flex-col">
              <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">School/IEP Packet Builder</h3>
                <button 
                  onClick={() => setShowSchoolIEPBuilder(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Reorderable Sections */}
              <div className="space-y-6">
                {/* Student Info Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900">Student Info</h4>
                    <span className="text-sm text-gray-500">Auto from Profile</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        defaultValue="Alex Johnson"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Student name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="text"
                        defaultValue="March 15, 2019"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Date of birth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                      <input
                        type="text"
                        defaultValue="Pre-K"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Grade level"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                      <input
                        type="text"
                        defaultValue="Sunshine Elementary"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="School name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contacts for School Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Contacts for School</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Parents, Primary Clinician</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Parent</label>
                        <input
                          type="text"
                          defaultValue="Sarah Johnson"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Parent name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          defaultValue="(555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Clinician</label>
                        <input
                          type="text"
                          defaultValue="Dr. Sarah Chen"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Clinician name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Phone</label>
                        <input
                          type="text"
                          defaultValue="(555) 987-6543"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Clinic phone"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication List Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Medication List</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-2">Read-only, scheduled windows only</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Keppra (Levetiracetam)</span>
                        <span className="text-gray-500">8:00 AM, 8:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Vitamin D3</span>
                        <span className="text-gray-500">9:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feeding Supports Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Feeding Supports</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-2">Read-only from Profile/Nutrition</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Texture Preferences</label>
                        <input
                          type="text"
                          defaultValue="Soft, pureed foods"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Texture preferences"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Utensils</label>
                        <input
                          type="text"
                          defaultValue="Adaptive spoon, weighted cup"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Utensils needed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Considerations Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Safety Considerations</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        rows={2}
                        defaultValue="Peanuts, tree nuts, shellfish"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List any allergies"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Steps</label>
                      <textarea
                        rows={3}
                        defaultValue="1. Administer EpiPen if available\n2. Call 911 immediately\n3. Contact parents and primary clinician\n4. Monitor breathing and consciousness"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency response steps"
                      />
                    </div>
                  </div>
                </div>

                {/* Communication Supports Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Communication Supports</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">AAC Devices</label>
                      <input
                        type="text"
                        defaultValue="iPad with Proloquo2Go, PECS cards"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="AAC devices used"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visual Supports</label>
                      <input
                        type="text"
                        defaultValue="Picture schedule, choice boards, visual timers"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Visual supports needed"
                      />
                    </div>
                  </div>
                </div>

                {/* Daily Schedule Notes Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Daily Schedule Notes</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={4}
                      defaultValue="Alex responds well to routine and visual schedules. Prefers quiet activities in the morning. Needs frequent breaks during structured activities. Responds positively to verbal praise and high-fives."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes about daily schedule and preferences"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Footer - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 mt-4">
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save Draft
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Generate PDF
                </button>
                <button 
                  onClick={() => {
                    setShowSchoolIEPBuilder(false);
                    setActiveTab('shareCenter');
                  }}
                  className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Info Builder Modal */}
      {showEmergencyInfoBuilder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-4 border max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">Emergency Info Card</h3>
                <button 
                  onClick={() => setShowEmergencyInfoBuilder(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* One-Page Layout */}
              <div className="space-y-6">
                {/* Child Identifiers Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Child Identifiers</h4>
                  <div className="flex items-start space-x-4">
                    {/* Photo Placeholder */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {/* Info Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Alex Johnson"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Child's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="text"
                          defaultValue="March 15, 2019"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Date of birth"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                          type="text"
                          defaultValue="5 years old"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Current age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <input
                          type="text"
                          defaultValue="40 lbs"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Current weight"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions/Allergies Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Conditions & Allergies</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                      <textarea
                        rows={2}
                        defaultValue="Epilepsy, Cerebral Palsy, Feeding difficulties"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="List medical conditions"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        rows={2}
                        defaultValue="Peanuts, tree nuts, shellfish, latex"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="List allergies and reactions"
                      />
                    </div>
                  </div>
                </div>

                {/* Rescue Medications Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Rescue Medications & Locations</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-700 font-medium">Names only; no dosing guidance</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rescue Medications</label>
                      <input
                        type="text"
                        defaultValue="EpiPen, Diastat, Rescue inhaler"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="List rescue medications"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Locations</label>
                      <input
                        type="text"
                        defaultValue="Backpack, Nurse's office, Home"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Where medications are stored"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Contacts Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Primary Contacts & Provider</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Parent</label>
                      <input
                        type="text"
                        defaultValue="Sarah Johnson"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Parent name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                      <input
                        type="text"
                        defaultValue="(555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Parent phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Provider</label>
                      <input
                        type="text"
                        defaultValue="Dr. Sarah Chen"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Provider name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider Phone</label>
                      <input
                        type="text"
                        defaultValue="(555) 987-6543"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Provider phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Hospital Preference Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Hospital Preference</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Hospital</label>
                      <input
                        type="text"
                        defaultValue="Children's Hospital Boston"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Hospital name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
                      <input
                        type="text"
                        defaultValue="300 Longwood Ave, Boston, MA 02115"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Hospital address"
                      />
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Important Disclaimer</h4>
                      <p className="text-sm text-yellow-700 mt-1">For informational use; not a medical directive.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Footer - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 mt-4">
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Generate Wallet Card (mini)
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Print Home Poster (letter)
                </button>
                <button 
                  onClick={() => {
                    setShowEmergencyInfoBuilder(false);
                    setActiveTab('shareCenter');
                  }}
                  className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Share Link (expiry 30 days)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visit Packet Builder Modal */}
      {showVisitPacketBuilder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-4 border max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">Visit Packet Builder</h3>
                <button 
                  onClick={() => setShowVisitPacketBuilder(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Current Draft Visit Packet */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Current "Draft Visit Packet"</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h5 className="text-sm font-medium text-green-800">Review Required</h5>
                      <p className="text-sm text-green-700 mt-1">Review accuracy before sharing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Included Items from Home/Journals */}
              <div className="space-y-6">
                {/* Journal Entries Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Journal Entries</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Seizure Activity</h5>
                        <p className="text-xs text-gray-600">Dec 10, 2024 - 2:30 PM</p>
                        <p className="text-sm text-gray-700 mt-1">Alex had a brief absence seizure during circle time. Duration: 15 seconds. No injury.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Feeding Progress</h5>
                        <p className="text-xs text-gray-600">Dec 9, 2024 - 6:00 PM</p>
                        <p className="text-sm text-gray-700 mt-1">Successfully tried pureed carrots. Tolerated well, no gagging. Ate 3 tablespoons.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Communication Breakthrough</h5>
                        <p className="text-xs text-gray-600">Dec 8, 2024 - 4:15 PM</p>
                        <p className="text-sm text-gray-700 mt-1">Used AAC device to request "more juice" independently. First time using 2-word phrase.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Milestones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Motor Development</h5>
                        <p className="text-xs text-gray-600">Dec 7, 2024</p>
                        <p className="text-sm text-gray-700 mt-1">Able to sit independently for 5 minutes without support. Improved trunk control.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Social-Emotional</h5>
                        <p className="text-xs text-gray-600">Dec 5, 2024</p>
                        <p className="text-sm text-gray-700 mt-1">Initiated play with peer during free time. Shared toy without prompting.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication List Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Medication List</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">Current Medications</h5>
                        <p className="text-xs text-gray-600">Updated: Dec 10, 2024</p>
                        <p className="text-sm text-gray-700 mt-1">Keppra 250mg 2x daily, Vitamin D3 1000 IU daily, Rescue inhaler as needed</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New Entry Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Add New Entry</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>Select entry type</option>
                        <option>Journal Entry</option>
                        <option>Milestone</option>
                        <option>Medication Update</option>
                        <option>Behavior Note</option>
                        <option>Feeding Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Entry title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Describe the entry..."
                      />
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Add Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Footer - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 mt-4">
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Contents
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Generate PDF
                </button>
                <button 
                  onClick={() => {
                    setShowVisitPacketBuilder(false);
                    setActiveTab('shareCenter');
                  }}
                  className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">Upload Document</span>
                        <span className="mt-1 block text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          // Handle file selection
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log('File selected:', file.name);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Link to Appointment Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link to appointment now</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select an appointment (optional)</option>
                    <option value="neurology-1">Neurology Follow-up - Dec 15, 2024</option>
                    <option value="therapy-1">OT Session - Dec 18, 2024</option>
                    <option value="school-1">IEP Meeting - Dec 20, 2024</option>
                    <option value="pediatric-1">Pediatric Check-up - Dec 22, 2024</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setShowUploadModal(false);
                      setToastMessage('Document uploaded');
                      setShowToast(true);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload
                  </button>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-6 border max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {selectedTemplate === 'school-medication' && 'School Medication Permission'}
                  {selectedTemplate === 'therapy-plan' && 'Therapy Plan of Care'}
                  {selectedTemplate === 'release-info' && 'Release of Information'}
                </h3>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {selectedTemplate === 'school-medication' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">School Medication Permission Form</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter student name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter medication name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
                          <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter dosage instructions"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter emergency contact" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'therapy-plan' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Therapy Plan of Care</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter patient name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Type</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                              <option>Select therapy type</option>
                              <option>Occupational Therapy</option>
                              <option>Physical Therapy</option>
                              <option>Speech Therapy</option>
                              <option>Behavioral Therapy</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
                          <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter therapy goals"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                          <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter treatment plan"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 2x per week" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'release-info' && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Release of Information</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter patient name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Information to be Released</label>
                          <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Describe information to be released"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name/Organization</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter recipient name or organization" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Release</label>
                          <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter purpose of information release"></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions Footer - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 mt-4">
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setShowTemplateModal(false);
                    setToastMessage('Document saved to Documents');
                    setShowToast(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save to Documents
                </button>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link to Appointment Modal */}
      {showLinkToAppointmentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Link Document to Appointment</h3>
                <button 
                  onClick={() => setShowLinkToAppointmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Document Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{selectedDocumentForLinking}</p>
                    <p className="text-xs text-gray-500">Will be added to appointment's prep checklist</p>
                  </div>
                </div>

                {/* Choose Appointment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Appointment</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select an appointment</option>
                    <option value="neurology-1">Neurology Follow-up - Dec 15, 2024</option>
                    <option value="therapy-1">OT Session - Dec 18, 2024</option>
                    <option value="school-1">IEP Meeting - Dec 20, 2024</option>
                    <option value="pediatric-1">Pediatric Check-up - Dec 22, 2024</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setShowLinkToAppointmentModal(false);
                      setToastMessage('Document linked to appointment');
                      setShowToast(true);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Link Document
                  </button>
                  <button 
                    onClick={() => setShowLinkToAppointmentModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Confirmation Modal */}
      {showShareConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Confirm Share</h3>
              
              {/* Summary of what's included */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Summary of what's included:</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Dr. Sarah Chen (recipient)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Visit Packets, Milestone Report</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Secure link with 7-day expiry</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">View only permissions</span>
                  </div>
                </div>
              </div>

              {/* Security Reminder */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Security Reminder</h4>
                    <p className="text-sm text-yellow-700 mt-1">Never share sensitive info over insecure channels.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setShowShareConfirmationModal(false);
                    setToastMessage('Share link created successfully!');
                    setShowToast(true);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setShowShareConfirmationModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border bg-green-50 border-green-200 text-green-800">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareTeamScreen; 