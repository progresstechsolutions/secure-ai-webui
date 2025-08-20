import React, { useState } from 'react';

const GrowthDevelopmentScreen: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false);
  const [showDomainDetailModal, setShowDomainDetailModal] = useState(false);
  const [selectedDomainForDetail, setSelectedDomainForDetail] = useState('');
  const [activeMobileTab, setActiveMobileTab] = useState('Skills');
  
  // Growth sub-navigation state
  const [activeGrowthTab, setActiveGrowthTab] = useState<'domains' | 'overview' | 'reports' | 'ideas'>('domains');
  
  // Overview tab state
  const [overviewDateRange, setOverviewDateRange] = useState('30 days');
  
  // Settings state
  const [defaultView, setDefaultView] = useState<'age-based' | 'developmental'>('age-based');
  const [showSkillsBeyondLevel, setShowSkillsBeyondLevel] = useState(true);
  const [weeklyReminder, setWeeklyReminder] = useState(false);

  // Report generation state
  const [reportOptions, setReportOptions] = useState({
    domains: ['motor', 'communication', 'social-emotional', 'cognitive-play', 'adaptive-self-help'],
    includeEmerging: true,
    includeNotes: true
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const [useDevelopmentalLevel, setUseDevelopmentalLevel] = useState(false);
  const [chronologicalAge, setChronologicalAge] = useState('6 months');
  const [developmentalLevel, setDevelopmentalLevel] = useState('Early');
  const [timeScope, setTimeScope] = useState('30 days');
  
  // Add Skill Quick Sheet states
  const [showAddSkillSheet, setShowAddSkillSheet] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillStatus, setSkillStatus] = useState('Observed');
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0]);
  const [supportsUsed, setSupportsUsed] = useState<string[]>([]);
  const [context, setContext] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Skills Checklist state
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');
  const [skillsLevelFilter, setSkillsLevelFilter] = useState('All');
  const [skillsSubdomainFilter, setSkillsSubdomainFilter] = useState<string[]>([]);
  const [skillsStatusFilter, setSkillsStatusFilter] = useState('All');
  const [skillsSortBy, setSkillsSortBy] = useState('Recommended');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showCustomSkillForm, setShowCustomSkillForm] = useState(false);
  const [customSkillForm, setCustomSkillForm] = useState({
    name: '',
    subdomain: '',
    levelBand: 'Early'
  });

  // Skill History drawer state
  const [showSkillHistory, setShowSkillHistory] = useState(false);
  const [selectedSkillForHistory, setSelectedSkillForHistory] = useState<any>(null);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // Sample domain data
  const domains = [
    {
      id: 'motor',
      name: 'Motor',
      subtitle: 'Gross & Fine',
      icon: '🏃‍♀️',
      observed: 8,
      suggested: 12,
      lastSkill: 'Rolls both ways',
      lastDate: '2024-03-15'
    },
    {
      id: 'communication',
      name: 'Communication',
      subtitle: 'Expressive & Receptive',
      icon: '💬',
      observed: 5,
      suggested: 10,
      lastSkill: 'Uses 3 words',
      lastDate: '2024-03-12'
    },
    {
      id: 'social-emotional',
      name: 'Social-Emotional',
      subtitle: '',
      icon: '😊',
      observed: 6,
      suggested: 8,
      lastSkill: 'Social smile',
      lastDate: '2024-03-10'
    },
    {
      id: 'cognitive-play',
      name: 'Cognitive/Play',
      subtitle: '',
      icon: '🧩',
      observed: 4,
      suggested: 9,
      lastSkill: 'Bangs objects together',
      lastDate: '2024-03-08'
    },
    {
      id: 'adaptive-self-help',
      name: 'Adaptive/Self-Help',
      subtitle: 'feeding, dressing, toileting',
      icon: '👕',
      observed: 3,
      suggested: 7,
      lastSkill: 'Finger feeds',
      lastDate: '2024-03-05'
    }
  ];

  // Sample skills data with proper age band mapping
  const allSkills = [
    // Motor skills
    { id: 'm1', domain: 'motor', subdomain: 'gross', name: 'Rolls both ways', ageBand: 'Early', description: 'Rolls from back to stomach and stomach to back' },
    { id: 'm2', domain: 'motor', subdomain: 'gross', name: 'Sits briefly without support', ageBand: 'Early', description: 'Maintains sitting position for a few seconds' },
    { id: 'm3', domain: 'motor', subdomain: 'gross', name: 'Pulls to stand', ageBand: 'Toddler', description: 'Pulls self up to standing position using furniture' },
    { id: 'm4', domain: 'motor', subdomain: 'gross', name: 'Cruises along furniture', ageBand: 'Toddler', description: 'Walks sideways while holding onto furniture' },
    { id: 'm5', domain: 'motor', subdomain: 'gross', name: 'Walks with support', ageBand: 'Toddler', description: 'Takes steps while holding hands or walker' },
    { id: 'm6', domain: 'motor', subdomain: 'fine', name: 'Pincer grasp', ageBand: 'Early', description: 'Picks up small objects using thumb and index finger' },
    { id: 'm7', domain: 'motor', subdomain: 'fine', name: 'Stacks 2 blocks', ageBand: 'Toddler', description: 'Places one block on top of another' },
    { id: 'm8', domain: 'motor', subdomain: 'gross', name: 'Throws ball forward', ageBand: 'Toddler', description: 'Throws ball in forward direction' },
    { id: 'm9', domain: 'motor', subdomain: 'gross', name: 'Runs with coordination', ageBand: 'Preschool', description: 'Runs with improved balance and coordination' },
    { id: 'm10', domain: 'motor', subdomain: 'gross', name: 'Hops on one foot', ageBand: 'Preschool', description: 'Hops briefly on one foot' },
    { id: 'm11', domain: 'motor', subdomain: 'gross', name: 'Catches large ball', ageBand: 'Preschool', description: 'Catches ball with arms extended' },
    { id: 'm12', domain: 'motor', subdomain: 'fine', name: 'Uses scissors', ageBand: 'Preschool', description: 'Cuts paper with child-safe scissors' },
    
    // Communication skills
    { id: 'c1', domain: 'communication', subdomain: 'expressive', name: 'Babbles with consonants', ageBand: 'Early', description: 'Makes consonant sounds like ba, da, ma' },
    { id: 'c2', domain: 'communication', subdomain: 'receptive', name: 'Points to request', ageBand: 'Toddler', description: 'Points to objects to indicate wants' },
    { id: 'c3', domain: 'communication', subdomain: 'expressive', name: 'Uses 5-10 words', ageBand: 'Toddler', description: 'Says 5-10 recognizable words' },
    { id: 'c4', domain: 'communication', subdomain: 'receptive', name: 'Follows 1-step directions', ageBand: 'Toddler', description: 'Understands and follows simple commands' },
    { id: 'c5', domain: 'communication', subdomain: 'expressive', name: 'Names common objects', ageBand: 'Preschool', description: 'Identifies familiar objects by name' },
    { id: 'c6', domain: 'communication', subdomain: 'expressive', name: 'Combines 2 words', ageBand: 'Preschool', description: 'Uses two-word phrases' },
    { id: 'c7', domain: 'communication', subdomain: 'expressive', name: 'Asks questions', ageBand: 'Preschool', description: 'Asks what, where, why questions' },
    { id: 'c8', domain: 'communication', subdomain: 'expressive', name: 'Tells simple stories', ageBand: 'School-age', description: 'Recounts events in sequence' },
    { id: 'c9', domain: 'communication', subdomain: 'expressive', name: 'Uses past tense', ageBand: 'School-age', description: 'Correctly uses past tense verbs' },
    { id: 'c10', domain: 'communication', subdomain: 'receptive', name: 'Follows 3-step directions', ageBand: 'School-age', description: 'Understands and follows multi-step commands' },
    
    // Social-Emotional skills
    { id: 's1', domain: 'social-emotional', subdomain: 'interaction', name: 'Social smile', ageBand: 'Early', description: 'Smiles in response to social interaction' },
    { id: 's2', domain: 'social-emotional', subdomain: 'interaction', name: 'Joint attention', ageBand: 'Early', description: 'Looks where you point' },
    { id: 's3', domain: 'social-emotional', subdomain: 'interaction', name: 'Waves bye', ageBand: 'Toddler', description: 'Waves goodbye' },
    { id: 's4', domain: 'social-emotional', subdomain: 'interaction', name: 'Brings item to show', ageBand: 'Toddler', description: 'Shows objects to others' },
    { id: 's5', domain: 'social-emotional', subdomain: 'interaction', name: 'Parallel play', ageBand: 'Preschool', description: 'Plays alongside other children' },
    { id: 's6', domain: 'social-emotional', subdomain: 'interaction', name: 'Takes turns briefly', ageBand: 'Preschool', description: 'Participates in simple turn-taking' },
    { id: 's7', domain: 'social-emotional', subdomain: 'regulation', name: 'Shows empathy', ageBand: 'Preschool', description: 'Comforts others when upset' },
    { id: 's8', domain: 'social-emotional', subdomain: 'interaction', name: 'Shares toys', ageBand: 'Preschool', description: 'Willingly shares toys with peers' },
    { id: 's9', domain: 'social-emotional', subdomain: 'regulation', name: 'Manages emotions', ageBand: 'School-age', description: 'Uses strategies to calm down' },
    { id: 's10', domain: 'social-emotional', subdomain: 'interaction', name: 'Makes friends', ageBand: 'School-age', description: 'Initiates and maintains friendships' },
    
    // Cognitive/Play skills
    { id: 'cp1', domain: 'cognitive-play', subdomain: 'early-play', name: 'Bangs two objects', ageBand: 'Early', description: 'Hits two objects together' },
    { id: 'cp2', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Puts objects in/out', ageBand: 'Toddler', description: 'Places objects in containers and removes them' },
    { id: 'cp3', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Cause-and-effect toy play', ageBand: 'Toddler', description: 'Understands simple cause and effect' },
    { id: 'cp4', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Matches shapes', ageBand: 'Preschool', description: 'Identifies and matches similar shapes' },
    { id: 'cp5', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Completes 3-piece puzzle', ageBand: 'Preschool', description: 'Assembles simple puzzles' },
    { id: 'cp6', domain: 'cognitive-play', subdomain: 'pretend', name: 'Pretend feeds doll', ageBand: 'Preschool', description: 'Engages in pretend play' },
    { id: 'cp7', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Counts to 10', ageBand: 'Preschool', description: 'Recites numbers 1-10' },
    { id: 'cp8', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Recognizes colors', ageBand: 'Preschool', description: 'Names basic colors' },
    { id: 'cp9', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Understands time concepts', ageBand: 'School-age', description: 'Grasps yesterday, today, tomorrow' },
    { id: 'cp10', domain: 'cognitive-play', subdomain: 'problem-solving', name: 'Solves simple problems', ageBand: 'School-age', description: 'Finds solutions to everyday challenges' },
    
    // Adaptive/Self-Help skills
    { id: 'a1', domain: 'adaptive-self-help', subdomain: 'feeding', name: 'Finger feeds', ageBand: 'Early', description: 'Picks up food with fingers and eats' },
    { id: 'a2', domain: 'adaptive-self-help', subdomain: 'feeding', name: 'Drinks from open cup with help', ageBand: 'Toddler', description: 'Uses open cup with assistance' },
    { id: 'a3', domain: 'adaptive-self-help', subdomain: 'feeding', name: 'Uses spoon with some spills', ageBand: 'Toddler', description: 'Attempts to use spoon independently' },
    { id: 'a4', domain: 'adaptive-self-help', subdomain: 'dressing', name: 'Removes socks', ageBand: 'Toddler', description: 'Takes off socks independently' },
    { id: 'a5', domain: 'adaptive-self-help', subdomain: 'dressing', name: 'Helps with dressing', ageBand: 'Toddler', description: 'Assists with putting on clothes' },
    { id: 'a6', domain: 'adaptive-self-help', subdomain: 'toileting', name: 'Indicates wet/soiled diaper', ageBand: 'Toddler', description: 'Shows awareness of diaper state' },
    { id: 'a7', domain: 'adaptive-self-help', subdomain: 'toileting', name: 'Sits on toilet with support', ageBand: 'Toddler', description: 'Sits on toilet with assistance' },
    { id: 'a8', domain: 'adaptive-self-help', subdomain: 'hygiene', name: 'Washes hands with help', ageBand: 'Preschool', description: 'Washes hands with supervision' },
    { id: 'a9', domain: 'adaptive-self-help', subdomain: 'dressing', name: 'Buttons large buttons', ageBand: 'Preschool', description: 'Fastens large buttons independently' },
    { id: 'a10', domain: 'adaptive-self-help', subdomain: 'hygiene', name: 'Brushes teeth with help', ageBand: 'Preschool', description: 'Brushes teeth with supervision' }
  ];

  // Subdomain tags for each domain
  const domainSubdomains = {
    'motor': ['Gross', 'Fine'],
    'communication': ['Expressive', 'Receptive'],
    'social-emotional': ['Interaction', 'Regulation'],
    'cognitive-play': ['Early Play', 'Problem-Solving', 'Pretend'],
    'adaptive-self-help': ['Feeding', 'Dressing', 'Toileting', 'Hygiene']
  };

  // Sample milestone entries for the journal
  const milestoneEntries = [
    {
      id: '1',
      domainIcon: '🏃',
      skillName: 'Rolls both ways',
      status: 'Observed',
      date: '2024-03-15',
      context: 'home'
    },
    {
      id: '2',
      domainIcon: '💬',
      skillName: 'Uses 3 words',
      status: 'Observed',
      date: '2024-03-12',
      context: 'therapy'
    },
    {
      id: '3',
      domainIcon: '😊',
      skillName: 'Social smile',
      status: 'Emerging',
      date: '2024-03-10',
      context: 'home'
    }
  ];

  // Sample skill statuses for demonstration
  const skillStatuses: Record<string, string> = {
    'm1': 'Observed',
    'm2': 'Emerging',
    'c1': 'Observed',
    'c2': 'Not yet',
    's1': 'Observed',
    'cp1': 'Emerging',
    'a1': 'Not yet'
  };

  // Sample last observed dates
  const lastObservedDates: Record<string, string> = {
    'm1': '2024-03-15',
    'c1': '2024-03-12',
    's1': '2024-03-10'
  };

  // Sample supports used
  const sampleSupportsUsed: Record<string, string[]> = {
    'm2': ['hand-over-hand', 'prompts'],
    'cp1': ['adaptive utensil'],
    'a1': ['AAC']
  };

  // Supports options for skills
  const supportsOptions = ['hand-over-hand', 'adaptive utensil', 'prompts', 'AAC', 'orthotics'];

  // Sample skill history data
  const skillHistoryData: Record<string, {
    statusChanges: Array<{
      date: string;
      status: string;
      supports: string[];
      author: string;
    }>;
    notes: Array<{
      timestamp: string;
      text: string;
      author: string;
    }>;
  }> = {
    'm1': {
      statusChanges: [
        { date: '2024-03-15', status: 'Observed', supports: [], author: 'Mom' },
        { date: '2024-03-10', status: 'Emerging', supports: ['hand-over-hand'], author: 'Dad' },
        { date: '2024-02-28', status: 'Not yet', supports: [], author: 'Mom' }
      ],
      notes: [
        { timestamp: '2024-03-15 14:30', text: 'First time rolling both ways consistently!', author: 'Mom' },
        { timestamp: '2024-03-12 10:15', text: 'Showed interest in rolling during tummy time', author: 'Dad' }
      ]
    },
    'c1': {
      statusChanges: [
        { date: '2024-03-12', status: 'Observed', supports: [], author: 'Mom' },
        { date: '2024-03-05', status: 'Emerging', supports: ['prompts'], author: 'Therapist' }
      ],
      notes: [
        { timestamp: '2024-03-12 16:45', text: 'Said "mama" clearly for the first time!', author: 'Mom' },
        { timestamp: '2024-03-08 11:20', text: 'Working on consonant sounds in therapy', author: 'Therapist' }
      ]
    }
  };

  const [showMilestoneDetail, setShowMilestoneDetail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMilestones, setHasMilestones] = useState(true); // For demo purposes, set to true initially

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Observed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Emerging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not yet':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'N/A':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContextLabel = (context: string) => {
    switch (context) {
      case 'home':
        return 'Home';
      case 'school':
        return 'School';
      case 'therapy':
        return 'Therapy';
      case 'community':
        return 'Community';
      default:
        return context;
    }
  };

  const handleViewMilestone = (milestoneId: string) => {
    setShowMilestoneDetail(milestoneId);
  };

  const handleViewAllMilestones = () => {
    // TODO: Route to Log & Track > Journal filtered to Milestones type
    console.log('Navigate to Journal with Milestones filter');
  };

  // Skeleton loading components
  const DomainTileSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-9 bg-gray-200 rounded w-full"></div>
    </div>
  );

  const JournalEntrySkeleton = () => (
    <div className="px-6 py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="flex items-center space-x-2">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );

  const contextOptions = ['home', 'school', 'therapy', 'community'];

  // Helper function to get age band from chronological age
  const getAgeBandFromChronological = (age: string): string => {
    if (age.includes('months')) {
      const months = parseInt(age.split(' ')[0]);
      if (months <= 12) return 'Early';
      if (months <= 36) return 'Toddler';
      if (months <= 60) return 'Preschool';
      return 'School-age';
    } else if (age.includes('years')) {
      const years = parseInt(age.split(' ')[0]);
      if (years <= 5) return 'Preschool';
      return 'School-age';
    }
    return 'Early'; // default
  };

  // Helper function to check if skill is within ±1 age band
  const isSkillAgeAppropriate = (skillAgeBand: string, selectedAgeBand: string): boolean => {
    const ageBands = ['Early', 'Toddler', 'Preschool', 'School-age'];
    const skillIndex = ageBands.indexOf(skillAgeBand);
    const selectedIndex = ageBands.indexOf(selectedAgeBand);
    
    if (skillIndex === -1 || selectedIndex === -1) return true; // fallback
    
    return Math.abs(skillIndex - selectedIndex) <= 1;
  };

  const handleOpenDomain = (domainId: string) => {
    // TODO: Route to domain detail (will be implemented in 5B)
    console.log(`Opening domain: ${domainId}`);
    
    // For now, show a placeholder modal indicating this will be implemented in Phase 5B
    setShowDomainDetailModal(true);
    setSelectedDomainForDetail(domainId);
  };

  const handleAddSkill = () => {
    setShowAddSkillSheet(true);
    setCurrentStep(1);
    setSelectedDomain('');
    setSelectedSkill('');
    setSkillStatus('Observed');
    setDateObserved(new Date().toISOString().split('T')[0]);
    setSupportsUsed([]);
    setContext([]);
    setNotes('');
    setShowAllSkills(false);
    setSearchQuery('');
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // TODO: Save skill data
    console.log('Saving skill:', { selectedDomain, selectedSkill, skillStatus, dateObserved, supportsUsed, context, notes });
    setShowAddSkillSheet(false);
    // TODO: Show toast: "Skill saved. View it in Journal or the domain page."
  };

  const handleSaveAndAddAnother = () => {
    // TODO: Save skill data
    console.log('Saving skill and adding another:', { selectedDomain, selectedSkill, skillStatus, dateObserved, supportsUsed, context, notes });
    // Reset form for next skill
    setSelectedSkill('');
    setSkillStatus('Observed');
    setDateObserved(new Date().toISOString().split('T')[0]);
    setSupportsUsed([]);
    setContext([]);
    setNotes('');
    setCurrentStep(2); // Go back to skill selection
  };

  const handleSaveSettings = () => {
    // TODO: Save settings to localStorage or API
    setShowSettingsModal(false);
    // TODO: Show toast: "Settings saved."
  };

  // Get current age band for filtering
  const currentAgeBand = useDevelopmentalLevel ? developmentalLevel : getAgeBandFromChronological(chronologicalAge);

  const filteredSkills = allSkills.filter(skill => {
    if (selectedDomain && skill.domain !== selectedDomain) return false;
    if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filter by age appropriateness (default: ±1 band)
  const ageAppropriateSkills = showAllSkills ? filteredSkills : filteredSkills.filter(skill => 
    isSkillAgeAppropriate(skill.ageBand, currentAgeBand)
  );

  const suggestedSkills = ageAppropriateSkills.slice(0, 10);
  const displayedSkills = showAllSkills ? ageAppropriateSkills : suggestedSkills;

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    // TODO: Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportReady(true);
    }, 2000);
  };



  const handleDownloadReport = () => {
    // TODO: Trigger actual PDF download
    setReportReady(false);
    setShowReportModal(false);
    // TODO: Show toast: "Report downloaded"
  };

  const handleSkillStatusChange = (skillId: string, status: string) => {
    // TODO: Update skill status in database
    console.log(`Updating skill ${skillId} status to ${status}`);
    // TODO: Show toast: "Updated"
  };

  const handleSkillSupportsUpdate = (skillId: string, supports: string[]) => {
    // TODO: Update skill supports in database
    console.log(`Updating skill ${skillId} supports to:`, supports);
  };

  const handleBulkAction = (action: string) => {
    if (selectedSkills.length === 0) return;
    
    switch (action) {
      case 'mark-observed':
        // TODO: Mark all selected skills as observed
        break;
      case 'mark-emerging':
        // TODO: Mark all selected skills as emerging
        break;
      case 'add-to-visit-packet':
        // TODO: Add selected skills to visit packet
        break;
    }
    
    setSelectedSkills([]);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillForm.name || !customSkillForm.subdomain) return;
    
    // TODO: Add custom skill to database
    console.log('Adding custom skill:', customSkillForm);
    setShowCustomSkillForm(false);
    setCustomSkillForm({ name: '', subdomain: '', levelBand: 'Early' });
    // TODO: Show toast: "Custom skill added"
  };

  const getFilteredAndGroupedSkills = () => {
    let filtered = allSkills.filter(skill => skill.domain === selectedDomainForDetail);
    
    // Apply search filter
    if (skillsSearchQuery) {
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(skillsSearchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(skillsSearchQuery.toLowerCase())
      );
    }
    
    // Apply level filter
    if (skillsLevelFilter !== 'All') {
      filtered = filtered.filter(skill => skill.ageBand === skillsLevelFilter);
    }
    
    // Apply subdomain filter
    if (skillsSubdomainFilter.length > 0) {
      filtered = filtered.filter(skill => skillsSubdomainFilter.includes(skill.subdomain));
    }
    
    // Apply status filter
    if (skillsStatusFilter !== 'All') {
      filtered = filtered.filter(skill => skillStatuses[skill.id] === skillsStatusFilter);
    }
    
    // Apply sorting
    switch (skillsSortBy) {
      case 'A-Z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Recently updated':
        // TODO: Sort by last updated date
        break;
      case 'Recommended':
      default:
        // Keep default order (age-appropriate first)
        break;
    }
    
    // Group skills
    const currentLevel = chronologicalAge.includes('months') ? 
      getAgeBandFromChronological(chronologicalAge) : developmentalLevel;
    
    const ageBands = ['Early', 'Toddler', 'Preschool', 'School-age'];
    const currentIndex = ageBands.indexOf(currentLevel);
    
    const suggested = filtered.filter(skill => skill.ageBand === currentLevel);
    const stretchNext = filtered.filter(skill => {
      const skillIndex = ageBands.indexOf(skill.ageBand);
      return skillIndex === currentIndex + 1;
    });
    const foundations = filtered.filter(skill => {
      const skillIndex = ageBands.indexOf(skill.ageBand);
      return skillIndex < currentIndex;
    });
    
    return { suggested, stretchNext, foundations };
  };

  // Keyboard navigation state
  const [focusedSkillIndex, setFocusedSkillIndex] = useState<number>(-1);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent, skillId: string, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = Math.min(index + 1, getFilteredAndGroupedSkills().suggested.length - 1);
        setFocusedSkillIndex(nextIndex);
        setFocusedSkillId(skillId);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        setFocusedSkillIndex(prevIndex);
        setFocusedSkillId(skillId);
        break;
      case ' ':
        event.preventDefault();
        // Toggle status - find current status and cycle through
        const currentStatus = skillStatuses[skillId] || 'Not yet';
        const statusOptions = ['Observed', 'Emerging', 'Not yet', 'N/A'];
        const currentIndex = statusOptions.indexOf(currentStatus);
        const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
        handleSkillStatusChange(skillId, nextStatus);
        break;
      case 'Enter':
        event.preventDefault();
        // Open supports popover - this will be handled by the supports button
        const supportsButton = document.querySelector(`[data-skill-id="${skillId}"] [data-supports-button]`) as HTMLButtonElement;
        if (supportsButton) {
          supportsButton.click();
        }
        break;
    }
  };

  const handleSkillFocus = (skillId: string, index: number) => {
    setFocusedSkillIndex(index);
    setFocusedSkillId(skillId);
  };

  // SkillRow Component with enhanced accessibility
  const SkillRow: React.FC<{
    skill: any;
    status: string;
    lastObserved?: string;
    supports: string[];
    isSelected: boolean;
    isFocused: boolean;
    index: number;
    onSelectionChange: (selected: boolean) => void;
    onStatusChange: (status: string) => void;
    onSupportsUpdate: (supports: string[]) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onFocus: () => void;
  }> = ({ skill, status, lastObserved, supports, isSelected, isFocused, index, onSelectionChange, onStatusChange, onSupportsUpdate, onKeyDown, onFocus }) => {
    const [showSupportsPopover, setShowSupportsPopover] = useState(false);
    const [showOverflowMenu, setShowOverflowMenu] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(lastObserved || new Date().toISOString().split('T')[0]);

    const supportsOptions = ['hand-over-hand', 'adaptive utensil', 'prompts', 'AAC', 'orthotics'];

    const handleStatusChange = (newStatus: string) => {
      if (newStatus === 'Observed' && !lastObserved) {
        setShowDatePicker(true);
      } else {
        onStatusChange(newStatus);
      }
    };

    const handleDateSave = () => {
      onStatusChange('Observed');
      setShowDatePicker(false);
      // TODO: Save last observed date
    };

    return (
      <div 
        className={`bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors ${
          isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        role="row"
        aria-selected={isSelected}
        aria-label={`Skill: ${skill.name}, Status: ${status}`}
      >
        <div className="flex items-center space-x-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Select ${skill.name} skill`}
          />

          {/* Skill Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h6 className="text-sm font-medium text-gray-900 truncate">{skill.name}</h6>
              <button
                className="text-gray-400 hover:text-gray-600"
                aria-label={`Show description for ${skill.name}`}
                title={skill.description}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {skill.subdomain}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {skill.ageBand}
              </span>
            </div>
          </div>

          {/* Status Radios */}
          <div className="flex items-center space-x-2" role="radiogroup" aria-label={`Status for ${skill.name}`}>
            {['Observed', 'Emerging', 'Not yet', 'N/A'].map((statusOption) => (
              <label key={statusOption} className="flex items-center">
                <input
                  type="radio"
                  name={`status-${skill.id}`}
                  value={statusOption}
                  checked={status === statusOption}
                  onChange={() => handleStatusChange(statusOption)}
                  className="mr-1 text-blue-600 focus:ring-blue-500"
                  aria-label={`Mark ${skill.name} as ${statusOption}`}
                />
                <span className="text-xs text-gray-700">{statusOption}</span>
              </label>
            ))}
          </div>

          {/* Last Observed Date */}
          {lastObserved && (
            <div className="text-xs text-gray-500">
              Last: {new Date(lastObserved).toLocaleDateString()}
            </div>
          )}

          {/* Supports Link */}
          <div className="relative">
            <button
              data-supports-button
              data-skill-id={skill.id}
              onClick={() => setShowSupportsPopover(!showSupportsPopover)}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
              aria-label="Manage supports for this skill"
              aria-expanded={showSupportsPopover}
              aria-haspopup="true"
            >
              Supports
            </button>
            
            {showSupportsPopover && (
              <div 
                className="absolute right-0 top-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                role="dialog"
                aria-label="Supports selection"
              >
                <h6 className="text-xs font-medium text-gray-900 mb-2">Supports used:</h6>
                <div className="space-y-1">
                  {supportsOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={supports.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSupportsUpdate([...supports, option]);
                          } else {
                            onSupportsUpdate(supports.filter(s => s !== option));
                          }
                        }}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        aria-label={`Use ${option} support`}
                      />
                      <span className="text-xs text-gray-700 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Overflow Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="More options for this skill"
              aria-expanded={showOverflowMenu}
              aria-haspopup="true"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showOverflowMenu && (
              <div 
                className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10"
                role="menu"
                aria-label="Skill options"
              >
                <button 
                  onClick={() => {
                    handleViewSkillHistory(skill);
                    setShowOverflowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                  role="menuitem"
                >
                  View history
                </button>
                <button className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded" role="menuitem">
                  Add note
                </button>
                <button 
                  onClick={() => {
                    if (visitPacketItems.has(skill.id)) {
                      handleRemoveFromVisitPacket(skill.id);
                    } else {
                      handleAddToVisitPacket(skill.id);
                    }
                    setShowOverflowMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1 text-xs rounded ${
                    visitPacketItems.has(skill.id)
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  role="menuitem"
                >
                  {visitPacketItems.has(skill.id) ? 'Remove from Visit Packet' : 'Add to Visit Packet'}
                </button>
                <button className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded" role="menuitem">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="date-picker-title"
          >
            <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
              <h6 id="date-picker-title" className="text-sm font-medium text-gray-900 mb-3">When did you observe this skill?</h6>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select observation date"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateSave}
                  className="px-3 py-1 text-sm text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleViewSkillHistory = (skill: any) => {
    setSelectedSkillForHistory(skill);
    setShowSkillHistory(true);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedSkillForHistory) return;
    
    // TODO: Add note to database
    console.log('Adding note to skill:', selectedSkillForHistory.id, newNoteText);
    setNewNoteText('');
    setShowAddNoteForm(false);
    // TODO: Show toast: "Note added"
  };

  const handleEditLastEntry = () => {
    if (!selectedSkillForHistory) return;
    
    // TODO: Open edit form for last status change
    console.log('Editing last entry for skill:', selectedSkillForHistory.id);
    // TODO: Show edit modal
  };

  // Care Ideas panel state
  const [careIdeasEnvironment, setCareIdeasEnvironment] = useState<string[]>(['home']);
  const [careIdeasSupports, setCareIdeasSupports] = useState<string[]>([]);
  const [careIdeasTimeAvailable, setCareIdeasTimeAvailable] = useState<string>('10-15 min');

  // Sample care ideas data
  const careIdeasData: Record<string, Array<{
    id: string;
    title: string;
    goalTags: string[];
    levelTag: 'Suggested now' | 'Stretch' | 'Foundations';
    materials: string[];
    steps: string[];
    adaptations: string[];
    safetyNote?: string;
    environment: string[];
    supports: string[];
    timeRequired: string;
  }>> = {
    'motor': [
      {
        id: 'motor-1',
        title: 'Tummy-time with bolster',
        goalTags: ['Gross motor', 'Core strength'],
        levelTag: 'Suggested now',
        materials: ['Firm pillow or bolster', 'Favorite toys'],
        steps: [
          'Place bolster under child\'s chest for support',
          'Position interesting toys just out of reach',
          'Encourage reaching and stretching movements',
          'Gradually increase time spent in position'
        ],
        adaptations: ['Use visual markers', 'Hand-over-hand support'],
        safetyNote: 'Supervise closely, ensure safe surface',
        environment: ['home', 'therapy'],
        supports: ['visuals', 'hand-over-hand'],
        timeRequired: '5 min'
      },
      {
        id: 'motor-2',
        title: 'Cruising along couch',
        goalTags: ['Gross motor', 'Balance'],
        levelTag: 'Suggested now',
        materials: ['Stable furniture', 'Soft landing area'],
        steps: [
          'Clear safe path along furniture edge',
          'Place favorite toys at intervals',
          'Encourage side-stepping while holding on',
          'Celebrate each step taken'
        ],
        adaptations: ['Use visual markers', 'Provide hand support'],
        safetyNote: 'Ensure furniture is stable, supervise closely',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '10-15 min'
      },
      {
        id: 'motor-3',
        title: 'Stack 2-3 blocks',
        goalTags: ['Fine motor', 'Precision'],
        levelTag: 'Stretch',
        materials: ['Large, lightweight blocks'],
        steps: [
          'Start with just 2 blocks',
          'Model stacking action slowly',
          'Encourage imitation and practice',
          'Gradually increase to 3 blocks'
        ],
        adaptations: ['Larger blocks', 'Non-slip base'],
        safetyNote: 'Use soft blocks, supervise play',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '5 min'
      },
      {
        id: 'motor-4',
        title: 'Large-bead threading',
        goalTags: ['Fine motor', 'Coordination'],
        levelTag: 'Stretch',
        materials: ['Large wooden beads', 'Thick string'],
        steps: [
          'Demonstrate threading motion',
          'Start with just a few beads',
          'Practice hand-eye coordination',
          'Celebrate each successful thread'
        ],
        adaptations: ['Larger beads', 'Stiffer string'],
        safetyNote: 'Supervise closely, avoid small parts',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '10 min'
      },
      {
        id: 'motor-5',
        title: 'Two-hand carry',
        goalTags: ['Fine motor', 'Bilateral coordination'],
        levelTag: 'Foundations',
        materials: ['Various sized containers', 'Toys'],
        steps: [
          'Start with small, lightweight items',
          'Encourage using both hands together',
          'Practice carrying different objects',
          'Build up to larger containers'
        ],
        adaptations: ['Larger handles', 'Non-slip grips'],
        safetyNote: 'Ensure items are safe to carry',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '5 min'
      }
    ],
    'communication': [
      {
        id: 'comm-1',
        title: 'Choice-making with pictures',
        goalTags: ['Receptive', 'Understanding'],
        levelTag: 'Suggested now',
        materials: ['Picture cards', 'Favorite items'],
        steps: [
          'Show 2-3 picture options',
          'Ask "Which one do you want?"',
          'Wait for response (point, reach, or vocalize)',
          'Provide chosen item immediately'
        ],
        adaptations: ['Larger pictures', 'Real objects'],
        safetyNote: 'Keep choices simple and clear',
        environment: ['home', 'school'],
        supports: ['visuals', 'aac'],
        timeRequired: '5 min'
      },
      {
        id: 'comm-2',
        title: 'Label-and-point during routines',
        goalTags: ['Expressive', 'Vocabulary'],
        levelTag: 'Suggested now',
        materials: ['Daily routine items', 'Picture schedule'],
        steps: [
          'Point to items during daily activities',
          'Say the name clearly and wait',
          'Encourage child to repeat or point',
          'Use consistent labels for same items'
        ],
        adaptations: ['Picture schedule', 'Visual cues'],
        safetyNote: 'Keep routines predictable and positive',
        environment: ['home', 'school'],
        supports: ['visuals'],
        timeRequired: '10-15 min'
      },
      {
        id: 'comm-3',
        title: '"One-step helper" games',
        goalTags: ['Receptive', 'Following directions'],
        levelTag: 'Stretch',
        materials: ['Simple household tasks', 'Clear instructions'],
        steps: [
          'Give one simple instruction at a time',
          'Use gestures and visual cues',
          'Model the action if needed',
          'Celebrate completion of each step'
        ],
        adaptations: ['Visual instructions', 'Hand-over-hand'],
        safetyNote: 'Choose safe, age-appropriate tasks',
        environment: ['home', 'school'],
        supports: ['visuals', 'hand-over-hand'],
        timeRequired: '10 min'
      },
      {
        id: 'comm-4',
        title: 'Echoic practice with favorite words',
        goalTags: ['Expressive', 'Imitation'],
        levelTag: 'Stretch',
        materials: ['Favorite toys', 'Books', 'Daily items'],
        steps: [
          'Say favorite words clearly and slowly',
          'Wait for child to attempt imitation',
          'Accept any approximation of the word',
          'Provide positive reinforcement'
        ],
        adaptations: ['Slower speech', 'Visual cues'],
        safetyNote: 'Keep practice fun and low-pressure',
        environment: ['home', 'therapy'],
        supports: ['visuals'],
        timeRequired: '5 min'
      }
    ],
    'social-emotional': [
      {
        id: 'social-1',
        title: 'Peekaboo turn-taking',
        goalTags: ['Interaction', 'Social games'],
        levelTag: 'Suggested now',
        materials: ['Blanket', 'Favorite toy', 'Mirror'],
        steps: [
          'Play simple peekaboo games',
          'Take turns hiding and revealing',
          'Encourage child to initiate hiding',
          'Use different hiding spots'
        ],
        adaptations: ['Visual cues', 'Slower pace'],
        safetyNote: 'Keep game fun and not scary',
        environment: ['home', 'therapy'],
        supports: ['visuals'],
        timeRequired: '10 min'
      },
      {
        id: 'social-2',
        title: '"Show and share" box',
        goalTags: ['Interaction', 'Sharing'],
        levelTag: 'Suggested now',
        materials: ['Special box', 'Favorite items'],
        steps: [
          'Create a special sharing box',
          'Encourage child to show items to others',
          'Practice sharing and taking turns',
          'Celebrate sharing behaviors'
        ],
        adaptations: ['Visual schedule', 'Picture cues'],
        safetyNote: 'Ensure items are safe to share',
        environment: ['home', 'school'],
        supports: ['visuals'],
        timeRequired: '15 min'
      },
      {
        id: 'social-3',
        title: 'Visual schedule for transitions',
        goalTags: ['Regulation', 'Predictability'],
        levelTag: 'Stretch',
        materials: ['Picture schedule', 'Timer', 'Transition items'],
        steps: [
          'Create simple picture schedule',
          'Show upcoming transitions',
          'Use timer for countdown',
          'Provide transition object if needed'
        ],
        adaptations: ['Larger pictures', 'Simple steps'],
        safetyNote: 'Keep transitions smooth and predictable',
        environment: ['home', 'school'],
        supports: ['visuals', 'timer'],
        timeRequired: '5 min'
      },
      {
        id: 'social-4',
        title: 'Emotion faces matching',
        goalTags: ['Regulation', 'Emotional awareness'],
        levelTag: 'Stretch',
        materials: ['Emotion cards', 'Mirror', 'Simple faces'],
        steps: [
          'Show simple emotion faces',
          'Model making the same face',
          'Practice in front of mirror',
          'Connect emotions to situations'
        ],
        adaptations: ['Larger faces', 'Simple emotions'],
        safetyNote: 'Start with basic emotions only',
        environment: ['home', 'therapy'],
        supports: ['visuals'],
        timeRequired: '10 min'
      }
    ],
    'cognitive-play': [
      {
        id: 'cog-1',
        title: 'In-out games',
        goalTags: ['Early Play', 'Exploration'],
        levelTag: 'Suggested now',
        materials: ['Containers', 'Various objects', 'Toys'],
        steps: [
          'Demonstrate putting items in and out',
          'Practice with different containers',
          'Encourage exploration and experimentation',
          'Celebrate discovery and learning'
        ],
        adaptations: ['Larger containers', 'Simple objects'],
        safetyNote: 'Ensure objects are safe and age-appropriate',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '10 min'
      },
      {
        id: 'cog-2',
        title: 'Cause-effect button toys',
        goalTags: ['Problem-Solving', 'Cause-effect'],
        levelTag: 'Suggested now',
        materials: ['Simple cause-effect toys', 'Buttons'],
        steps: [
          'Show how pressing button creates effect',
          'Encourage child to press buttons',
          'Practice different buttons and effects',
          'Celebrate cause-effect understanding'
        ],
        adaptations: ['Larger buttons', 'Clear effects'],
        safetyNote: 'Choose toys with clear, safe effects',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '10 min'
      },
      {
        id: 'cog-3',
        title: 'Shape sorter',
        goalTags: ['Problem-Solving', 'Matching'],
        levelTag: 'Stretch',
        materials: ['Simple shape sorter', 'Basic shapes'],
        steps: [
          'Start with just 2-3 simple shapes',
          'Demonstrate matching and sorting',
          'Practice with hand-over-hand support',
          'Gradually increase difficulty'
        ],
        adaptations: ['Larger shapes', 'Simple designs'],
        safetyNote: 'Supervise closely, ensure pieces are safe',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand', 'visuals'],
        timeRequired: '15 min'
      },
      {
        id: 'cog-4',
        title: 'Pretend tea party',
        goalTags: ['Pretend', 'Imaginative play'],
        levelTag: 'Stretch',
        materials: ['Toy cups', 'Plates', 'Pretend food'],
        steps: [
          'Model pretend actions (drinking, eating)',
          'Encourage imitation of pretend behaviors',
          'Practice simple pretend scenarios',
          'Celebrate imaginative play'
        ],
        adaptations: ['Realistic toys', 'Simple scenarios'],
        safetyNote: 'Ensure toys are safe and age-appropriate',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '15 min'
      }
    ],
    'adaptive-self-help': [
      {
        id: 'adaptive-1',
        title: 'Open-cup sips with tiny amounts',
        goalTags: ['Feeding', 'Drinking skills'],
        levelTag: 'Suggested now',
        materials: ['Small open cup', 'Tiny amounts of liquid'],
        steps: [
          'Start with very small amounts',
          'Demonstrate sipping motion',
          'Practice with hand-over-hand support',
          'Gradually increase amount'
        ],
        adaptations: ['Smaller cup', 'Thicker liquids'],
        safetyNote: 'Supervise closely, use safe liquids',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '5 min'
      },
      {
        id: 'adaptive-2',
        title: 'Spoon practice with thick foods',
        goalTags: ['Feeding', 'Self-feeding'],
        levelTag: 'Suggested now',
        materials: ['Child-sized spoon', 'Thick foods (yogurt, pudding)'],
        steps: [
          'Demonstrate proper spoon grip',
          'Practice scooping thick foods',
          'Encourage self-feeding attempts',
          'Provide positive reinforcement'
        ],
        adaptations: ['Adaptive spoon', 'Non-slip bowl'],
        safetyNote: 'Supervise eating, choose safe foods',
        environment: ['home', 'therapy'],
        supports: ['adaptive utensils'],
        timeRequired: '15 min'
      },
      {
        id: 'adaptive-3',
        title: 'Sock-off game',
        goalTags: ['Dressing', 'Undressing skills'],
        levelTag: 'Stretch',
        materials: ['Loose socks', 'Comfortable clothing'],
        steps: [
          'Start with loose, easy-to-remove socks',
          'Demonstrate pulling motion',
          'Practice with hand-over-hand support',
          'Celebrate each successful removal'
        ],
        adaptations: ['Larger socks', 'Loose fit'],
        safetyNote: 'Ensure socks are not too tight',
        environment: ['home', 'therapy'],
        supports: ['hand-over-hand'],
        timeRequired: '5 min'
      },
      {
        id: 'adaptive-4',
        title: 'Hand-wash 3-step routine',
        goalTags: ['Hygiene', 'Self-care routine'],
        levelTag: 'Stretch',
        materials: ['Sink', 'Soap', 'Towel', 'Step stool'],
        steps: [
          'Turn on water (with help)',
          'Apply soap and rub hands',
          'Rinse and dry hands'
        ],
        adaptations: ['Step stool', 'Visual routine'],
        safetyNote: 'Supervise water temperature and usage',
        environment: ['home', 'school'],
        supports: ['visuals', 'hand-over-hand'],
        timeRequired: '10 min'
      }
    ]
  };

  // Overview metrics helper functions
  const getTotalObservedSkills = () => {
    // TODO: Calculate total observed skills based on overviewDateRange
    return 25;
  };

  const getTotalEmergingSkills = () => {
    // TODO: Calculate total emerging skills based on overviewDateRange
    return 8;
  };

  const getNewSkillsThisPeriod = () => {
    // TODO: Calculate new skills in the last 30 days
    return 3;
  };

  const getPracticeStreak = () => {
    // TODO: Calculate practice streak (days with milestone updates)
    return 7;
  };

  const getFilteredCareIdeas = () => {
    const domain = selectedDomainForDetail;
    if (!domain || !careIdeasData[domain]) return [];
    
    let ideas = careIdeasData[domain];
    
    // Filter by environment
    if (careIdeasEnvironment.length > 0) {
      ideas = ideas.filter(idea => 
        idea.environment.some(env => careIdeasEnvironment.includes(env))
      );
    }
    
    // Filter by supports
    if (careIdeasSupports.length > 0) {
      ideas = ideas.filter(idea => 
        idea.supports.some(support => careIdeasSupports.includes(support))
      );
    }
    
    // Filter by time available
    ideas = ideas.filter(idea => {
      if (careIdeasTimeAvailable === '5 min') return idea.timeRequired === '5-10 min';
      if (careIdeasTimeAvailable === '10-15 min') return idea.timeRequired === '10-15 min';
      if (careIdeasTimeAvailable === '20+ min') return idea.timeRequired === '15-20 min';
      return true;
    });
    
    // Content logic: prioritize based on skill statuses
    const { suggested, stretchNext, foundations } = getFilteredAndGroupedSkills();
    const notYetOrEmergingCount = suggested.filter(skill => 
      (skillStatuses[skill.id] === 'Not yet' || skillStatuses[skill.id] === 'Emerging')
    ).length;
    
    // Show more "Foundations" ideas if >50% of "Suggested now" are Not yet
    const shouldShowFoundations = notYetOrEmergingCount > suggested.length * 0.5;
    
    // Sort by priority: Suggested now > Stretch > Foundations
    ideas.sort((a, b) => {
      const priority = { 'Suggested now': 3, 'Stretch': 2, 'Foundations': 1 };
      return priority[b.levelTag] - priority[a.levelTag];
    });
    
    // Limit to 3-6 ideas
    return ideas.slice(0, shouldShowFoundations ? 6 : 4);
  };

  // Progress Timeline state
  const [progressTimeScope, setProgressTimeScope] = useState('30 days');
  const [progressView, setProgressView] = useState<'By date' | 'By subdomain'>('By date');
  const [progressCustomStartDate, setProgressCustomStartDate] = useState('');
  const [progressCustomEndDate, setProgressCustomEndDate] = useState('');

  // Sample progress data for demonstration
  const progressData: Record<string, {
    timeline: Array<{
      date: string;
      skill: string;
      status: 'Observed' | 'Emerging';
    }>;
    subdomains: Record<string, {
      observed: number;
      emerging: number;
    }>;
  }> = {
    'motor': {
      timeline: [
        { date: '2024-03-15', skill: 'Rolls both ways', status: 'Observed' },
        { date: '2024-03-12', skill: 'Sits briefly without support', status: 'Observed' },
        { date: '2024-03-08', skill: 'Pulls to stand', status: 'Emerging' },
        { date: '2024-03-05', skill: 'Pincer grasp', status: 'Observed' },
        { date: '2024-02-28', skill: 'Stacks 2 blocks', status: 'Emerging' }
      ],
      subdomains: {
        'gross': { observed: 3, emerging: 2 },
        'fine': { observed: 1, emerging: 1 }
      }
    },
    'communication': {
      timeline: [
        { date: '2024-03-12', skill: 'Uses 5-10 words', status: 'Observed' },
        { date: '2024-03-08', skill: 'Follows 1-step directions', status: 'Observed' },
        { date: '2024-03-03', skill: 'Points to request', status: 'Emerging' }
      ],
      subdomains: {
        'expressive': { observed: 1, emerging: 0 },
        'receptive': { observed: 1, emerging: 1 }
      }
    },
    'social-emotional': {
      timeline: [
        { date: '2024-03-10', skill: 'Social smile', status: 'Observed' },
        { date: '2024-03-05', skill: 'Joint attention', status: 'Emerging' }
      ],
      subdomains: {
        'interaction': { observed: 1, emerging: 1 },
        'regulation': { observed: 0, emerging: 0 }
      }
    }
  };

  const getProgressDataForDomain = () => {
    const domain = selectedDomainForDetail;
    if (!domain || !progressData[domain]) return null;
    
    const data = progressData[domain];
    let filteredTimeline = [...data.timeline];
    
    // Filter by time scope
    const endDate = new Date();
    let startDate = new Date();
    
    switch (progressTimeScope) {
      case '30 days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90 days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'Custom':
        if (progressCustomStartDate && progressCustomEndDate) {
          startDate = new Date(progressCustomStartDate);
          const customEnd = new Date(progressCustomEndDate);
          filteredTimeline = filteredTimeline.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= customEnd;
          });
          return { timeline: filteredTimeline, subdomains: data.subdomains };
        }
        break;
    }
    
    filteredTimeline = filteredTimeline.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
    
    return { timeline: filteredTimeline, subdomains: data.subdomains };
  };

  const handleExportDomainProgress = () => {
    // TODO: Export domain progress to PDF
    console.log('Exporting domain progress to PDF');
    // TODO: Show toast: "Export started"
  };

  const handleAddToVisitPacket = (itemId: string, itemType: string = 'skill') => {
    setVisitPacketItems(prev => new Set(Array.from(prev).concat(itemId)));
    showToastMessage(`${itemType} added to Visit Packet`);
  };

  const handleRemoveFromVisitPacket = (itemId: string, itemType: string = 'skill') => {
    setVisitPacketItems(prev => {
      const newSet = new Set(Array.from(prev));
      newSet.delete(itemId);
      return newSet;
    });
    showToastMessage(`${itemType} removed from Visit Packet`);
  };

  const handleAddSelectedToVisitPacket = () => {
    if (selectedSkills.length === 0) return;
    
    setVisitPacketItems(prev => new Set(Array.from(prev).concat(selectedSkills)));
    showToastMessage(`${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} added to Visit Packet`);
    setSelectedSkills([]);
  };

  // Export domain report modal state
  const [showExportReportModal, setShowExportReportModal] = useState(false);
  const [exportReportOptions, setExportReportOptions] = useState({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0]
    },
    include: {
      observed: true,
      emerging: true,
      notes: true
    },
    sections: {
      skillsList: true,
      careIdeasSnapshot: true,
      timelineChart: true
    }
  });
  const [exportReportStatus, setExportReportStatus] = useState<'options' | 'generating' | 'ready'>('options');

  // Visit Packet state
  const [visitPacketItems, setVisitPacketItems] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  const handleExportDomainReport = () => {
    // TODO: Generate domain report PDF
    console.log('Generating domain report with options:', exportReportOptions);
    setExportReportStatus('generating');
    
    // Simulate PDF generation
    setTimeout(() => {
      setExportReportStatus('ready');
    }, 2000);
  };

  const handleSaveToVisitPacket = () => {
    // TODO: Save report to visit packet
    console.log('Saving report to visit packet');
    // TODO: Show toast: "Report saved to visit packet"
  };

  const showToastMessage = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Growth & Milestones
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track observed skills across domains at your child's pace.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Info Icon */}
              <div className="relative group">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Not a diagnostic tool
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              {/* AI Suggestions Button */}
              <button 
                onClick={() => setShowAISuggestionsModal(true)}
                className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Get AI suggestions for next skills"
              >
                Suggest next skills (AI)
              </button>

              {/* Secondary Action */}
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate Milestone Report
              </button>

              {/* Primary Action */}
              <button 
                onClick={handleAddSkill}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Sub-navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Growth & Milestones navigation">
            <button
              onClick={() => setActiveGrowthTab('domains')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeGrowthTab === 'domains'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeGrowthTab === 'domains' ? 'page' : undefined}
            >
              Domains
            </button>
            <button
              onClick={() => setActiveGrowthTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeGrowthTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeGrowthTab === 'overview' ? 'page' : undefined}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveGrowthTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeGrowthTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeGrowthTab === 'reports' ? 'page' : undefined}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveGrowthTab('ideas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeGrowthTab === 'ideas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeGrowthTab === 'ideas' ? 'page' : undefined}
            >
              Ideas Library
            </button>
          </nav>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-6">
            {/* Age Selector */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Age:</label>
              {useDevelopmentalLevel ? (
                <select
                  value={developmentalLevel}
                  onChange={(e) => setDevelopmentalLevel(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Early">Early (0-12m)</option>
                  <option value="Toddler">Toddler (12-36m)</option>
                  <option value="Preschool">Preschool (3-5y)</option>
                  <option value="School-age">School-age (5+)</option>
                </select>
              ) : (
                <select
                  value={chronologicalAge}
                  onChange={(e) => setChronologicalAge(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="18 months">18 months</option>
                  <option value="24 months">24 months</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                  <option value="5 years">5 years</option>
                  <option value="6 years">6 years</option>
                </select>
              )}
            </div>

            {/* Developmental Level Toggle */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Use developmental level instead:</label>
              <button
                onClick={() => setUseDevelopmentalLevel(!useDevelopmentalLevel)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  useDevelopmentalLevel ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useDevelopmentalLevel ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Time Scope */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Time scope:</label>
              <select
                value={timeScope}
                onChange={(e) => setTimeScope(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="This week">This week</option>
                <option value="30 days">30 days</option>
                <option value="90 days">90 days</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeGrowthTab === 'domains' && (
        <>
          {/* Domain Tiles */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* Main Content - Domain Tiles */}
          <div className="lg:flex-1">
            {isLoading ? (
              // Loading state - skeleton tiles
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <DomainTileSkeleton key={i} />
                ))}
              </div>
            ) : !hasMilestones ? (
              // Empty state - no milestones yet
              <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                  <div className="text-gray-400 mb-6">
                    <svg className="mx-auto h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No milestones yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start by adding a skill you've noticed.
                  </p>
                  <button
                    onClick={handleAddSkill}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Add your first skill"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            ) : (
              // Normal state - domain tiles
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {domains.map((domain) => {
                  const progressPercentage = (domain.observed / domain.suggested) * 100;
                  const circumference = 2 * Math.PI * 18; // radius = 18
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

                  return (
                    <div key={domain.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" role="article" aria-labelledby={`domain-${domain.id}-title`}>
                      {/* Domain Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl" aria-hidden="true">{domain.icon}</div>
                          <div>
                            <h3 id={`domain-${domain.id}-title`} className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                            {domain.subtitle && (
                              <p className="text-sm text-gray-500">{domain.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Ring */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative" role="progressbar" aria-valuenow={domain.observed} aria-valuemin={0} aria-valuemax={domain.suggested} aria-label={`${domain.name} progress: ${domain.observed} of ${domain.suggested} skills observed`}>
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                            {/* Background circle */}
                            <circle
                              cx="18"
                              cy="18"
                              r="18"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="18"
                              cy="18"
                              r="18"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              {domain.observed}/{domain.suggested}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Text */}
                      <p className="text-sm text-gray-600 text-center mb-4">
                        Observed {domain.observed} of {domain.suggested} suggested skills
                      </p>

                      {/* Last Skill Info */}
                      <div className="text-center mb-4">
                        {domain.lastSkill ? (
                          <p className="text-sm text-gray-500">
                            Last new skill: <span className="font-medium text-gray-700">{domain.lastSkill}</span> on {domain.lastDate}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">No skills yet</p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleOpenDomain(domain.id)}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        aria-label={`Open ${domain.name} domain details`}
                      >
                        Open
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Gutter - Future Care Ideas Panel (5B) */}
          <div className="hidden xl:block xl:w-80 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Ideas</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-2">Coming in Phase 5B</p>
                <p className="text-xs text-gray-400">Personalized care recommendations and strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Milestones Journal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Journal Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent milestone entries</h2>
              <button
                onClick={handleViewAllMilestones}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="View all milestone entries"
              >
                View all
              </button>
            </div>
          </div>

          {/* Journal Entries */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              // Loading state - skeleton entries
              Array.from({ length: 5 }).map((_, i) => (
                <JournalEntrySkeleton key={i} />
              ))
            ) : !hasMilestones ? (
              // Empty state - no milestone entries
              <div className="px-6 py-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">No milestone entries yet</p>
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Add your first milestone entry"
                >
                  Add Skill
                </button>
              </div>
            ) : (
              // Normal state - milestone entries
              milestoneEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors" role="article" aria-labelledby={`milestone-${entry.id}-title`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl" aria-hidden="true">{entry.domainIcon}</div>
                      <div>
                        <h3 id={`milestone-${entry.id}-title`} className="text-sm font-medium text-gray-900">{entry.skillName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(entry.status)}`} role="status" aria-label={`Status: ${entry.status}`}>
                            {entry.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {entry.date} • {getContextLabel(entry.context)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewMilestone(entry.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label={`View details for ${entry.skillName}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Page Footer with Settings Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              CareGene • Growth & Development Tracking
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Open milestone settings"
            >
              Milestone settings
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Overview Tab Content */}
      {activeGrowthTab === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics Strip */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Cross-Domain Progress</h2>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Date range:</label>
                <select
                  value={overviewDateRange}
                  onChange={(e) => setOverviewDateRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="This week">This week</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Observed Skills Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Observed Skills</p>
                    <p className="text-2xl font-bold text-blue-900">{getTotalObservedSkills()}</p>
                    <p className="text-xs text-blue-700">Total in range</p>
                  </div>
                  <div className="text-blue-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Emerging Skills Card */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Emerging Skills</p>
                    <p className="text-2xl font-bold text-yellow-900">{getTotalEmergingSkills()}</p>
                    <p className="text-xs text-yellow-700">In development</p>
                  </div>
                  <div className="text-yellow-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* New This Period Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">New This Period</p>
                    <p className="text-2xl font-bold text-green-900">{getNewSkillsThisPeriod()}</p>
                    <p className="text-xs text-green-700">Last 30 days</p>
                  </div>
                  <div className="text-green-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Practice Streak Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Practice Streak</p>
                    <p className="text-2xl font-bold text-purple-900">{getPracticeStreak()}</p>
                    <p className="text-xs text-purple-700">Days with updates</p>
                  </div>
                  <div className="text-purple-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Quick Sheet Modal */}
      {showAddSkillSheet && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-skill-title"
          aria-describedby="add-skill-description"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="add-skill-title" className="text-xl font-semibold text-gray-900">Add Skill</h2>
              <button
                onClick={() => setShowAddSkillSheet(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close add skill form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <nav aria-label="Add skill progress" className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep 
                        ? 'bg-blue-600 text-white' 
                        : step < currentStep 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                    }`}
                    aria-current={step === currentStep ? 'step' : undefined}
                    aria-label={`Step ${step}${step < currentStep ? ' completed' : step === currentStep ? ' current' : ''}`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 6 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} aria-hidden="true" />
                  )}
                </div>
              ))}
            </nav>

            {/* Step Content */}
            <div className="min-h-64" id="add-skill-description">
              {/* Step 1: Choose Domain */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Domain</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {domains.map((domain) => (
                      <button
                        key={domain.id}
                        onClick={() => {
                          setSelectedDomain(domain.id);
                          handleNextStep();
                        }}
                        className={`p-4 border rounded-lg text-left hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedDomain === domain.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        aria-pressed={selectedDomain === domain.id}
                        aria-label={`Select ${domain.name} domain${domain.subtitle ? ` (${domain.subtitle})` : ''}`}
                      >
                        <div className="text-2xl mb-2" aria-hidden="true">{domain.icon}</div>
                        <div className="font-medium text-gray-900">{domain.name}</div>
                        {domain.subtitle && (
                          <div className="text-sm text-gray-500">{domain.subtitle}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Skill */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Skill</h3>
                  <div className="mb-4">
                    <label htmlFor="skill-search" className="sr-only">Search skills</label>
                    <input
                      id="skill-search"
                      type="text"
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Search skills by name"
                    />
                  </div>
                  
                  {/* AI Pick Skill Button */}
                  <div className="mb-4">
                    <button
                      disabled
                      className="w-full px-3 py-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed opacity-60"
                      title="Coming soon"
                      aria-label="Use AI to pick skill (coming soon)"
                    >
                      Use AI to pick skill
                    </button>
                    <p className="text-xs text-gray-400 mt-1 text-center">Coming soon</p>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto" role="listbox" aria-label="Available skills">
                    {displayedSkills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => {
                          setSelectedSkill(skill.id);
                          handleNextStep();
                        }}
                        className={`w-full p-3 text-left border rounded-lg hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedSkill === skill.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        role="option"
                        aria-selected={selectedSkill === skill.id}
                        aria-label={`Select skill: ${skill.name} (${skill.ageBand} level)`}
                      >
                        <div className="font-medium text-gray-900">{skill.name}</div>
                        <div className="text-sm text-gray-500">{skill.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{skill.ageBand}</div>
                      </button>
                    ))}
                  </div>
                  {filteredSkills.length > 10 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-expanded={showAllSkills}
                      aria-controls="skill-list"
                    >
                      {showAllSkills ? 'Show top 10' : `Show all ${filteredSkills.length} skills in domain`}
                    </button>
                  )}
                </div>
              )}

              {/* Step 3: Mark Status */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Status</h3>
                  <fieldset className="space-y-3">
                    <legend className="sr-only">Skill status options</legend>
                    {['Observed', 'Emerging', 'Not yet', 'Not applicable'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={skillStatus === status}
                          onChange={(e) => setSkillStatus(e.target.value)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                          aria-describedby={`status-${status.toLowerCase().replace(' ', '-')}-help`}
                        />
                        <span className="text-gray-900">{status}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="mt-3 text-sm text-gray-500">
                    <p id="status-observed-help">Observed: You've seen your child demonstrate this skill</p>
                    <p id="status-emerging-help">Emerging: Your child is starting to show this skill</p>
                    <p id="status-not-yet-help">Not yet: Your child hasn't shown this skill yet</p>
                    <p id="status-not-applicable-help">N/A: This skill doesn't apply to your child's situation</p>
                  </div>
                </div>
              )}

              {/* Step 4: Date Observed */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Date Observed</h3>
                  <label htmlFor="date-observed" className="block text-sm font-medium text-gray-700 mb-2">
                    When did you observe this skill?
                  </label>
                  <input
                    id="date-observed"
                    type="date"
                    value={dateObserved}
                    onChange={(e) => setDateObserved(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-describedby="date-observed-help"
                  />
                  <p id="date-observed-help" className="mt-1 text-sm text-gray-500">
                    Select the date when you first noticed this skill, or today if you're observing it now.
                  </p>
                </div>
              )}

              {/* Step 5: Supports Used */}
              {currentStep === 5 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Supports Used (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">Select any supports or accommodations that helped your child demonstrate this skill.</p>
                  <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <legend className="sr-only">Support options</legend>
                    {supportsOptions.map((support) => (
                      <label key={support} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={supportsUsed.includes(support)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSupportsUsed([...supportsUsed, support]);
                            } else {
                              setSupportsUsed(supportsUsed.filter(s => s !== support));
                            }
                          }}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900 capitalize">{support}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              )}

              {/* Step 6: Context and Notes */}
              {currentStep === 6 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Context and Notes</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Context (Optional)</label>
                    <p className="text-sm text-gray-500 mb-3">Where and when did you observe this skill?</p>
                    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <legend className="sr-only">Context options</legend>
                      {contextOptions.map((ctx) => (
                        <label key={ctx} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={context.includes(ctx)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setContext([...context, ctx]);
                              } else {
                                setContext(context.filter(c => c !== ctx));
                              }
                            }}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-900 capitalize">{ctx}</span>
                        </label>
                      ))}
                    </fieldset>
                  </div>
                  <div>
                    <label htmlFor="skill-notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional, 200 chars)
                    </label>
                    <textarea
                      id="skill-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                      rows={3}
                      placeholder="Add any additional notes about how your child demonstrated this skill..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-describedby="notes-counter"
                    />
                    <div id="notes-counter" className="text-right text-sm text-gray-500 mt-1">
                      {notes.length}/200
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Go to previous step"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddSkillSheet(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Cancel adding skill"
                >
                  Cancel
                </button>
                {currentStep === 6 ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Save skill entry"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleSaveAndAddAnother}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Save skill and add another"
                    >
                      Save & Add Another
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedDomain || (currentStep === 2 && !selectedSkill)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Go to next step"
                    aria-describedby={(!selectedDomain || (currentStep === 2 && !selectedSkill)) ? "next-step-error" : undefined}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
            {(!selectedDomain || (currentStep === 2 && !selectedSkill)) && (
              <div id="next-step-error" className="mt-2 text-sm text-red-600" role="alert">
                Please complete the current step before continuing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Milestone Detail Modal */}
      {showMilestoneDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Milestone Detail</h3>
              <p className="text-sm text-gray-500 mb-4">
                This feature will show detailed milestone information.
              </p>
              <button
                onClick={() => setShowMilestoneDetail(null)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Settings Modal */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 id="settings-modal-title" className="text-lg font-semibold text-gray-900">Milestone Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close settings modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Default View Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Default view
                </label>
                <fieldset className="space-y-2">
                  <legend className="sr-only">Default view options</legend>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="defaultView"
                      value="age-based"
                      checked={defaultView === 'age-based'}
                      onChange={(e) => setDefaultView(e.target.value as 'age-based' | 'developmental')}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">Age-based (chronological age)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="defaultView"
                      value="developmental"
                      checked={defaultView === 'developmental'}
                      onChange={(e) => setDefaultView(e.target.value as 'age-based' | 'developmental')}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">Developmental level</span>
                  </label>
                </fieldset>
                <p className="mt-2 text-sm text-gray-500">
                  Choose how milestones are displayed by default when you visit this page.
                </p>
              </div>

              {/* Show Skills Beyond Current Level */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show skills beyond current level</label>
                    <p className="text-sm text-gray-500 mt-1">
                      Display skills that are typically achieved at higher age/developmental levels
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSkillsBeyondLevel(!showSkillsBeyondLevel)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      showSkillsBeyondLevel ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={showSkillsBeyondLevel}
                    aria-label="Toggle showing skills beyond current level"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showSkillsBeyondLevel ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Weekly Reminder */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Weekly reminder to review milestones</label>
                    <p className="text-sm text-gray-500 mt-1">
                      Get notified weekly to review and update your child's milestone progress
                    </p>
                  </div>
                  <button
                    onClick={() => setWeeklyReminder(!weeklyReminder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      weeklyReminder ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={weeklyReminder}
                    aria-label="Toggle weekly milestone reminders"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      weeklyReminder ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Cancel settings changes"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Save milestone settings"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Milestone Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 id="report-modal-title" className="text-lg font-semibold text-gray-900">Milestone Report (last 30 days)</h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReady(false);
                  setIsGeneratingReport(false);
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close report modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!isGeneratingReport && !reportReady && (
              <>
                <div className="space-y-6">
                  {/* Domain Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Include domains
                    </label>
                    <fieldset className="space-y-2">
                      <legend className="sr-only">Domain selection options</legend>
                      {[
                        { id: 'motor', name: 'Motor (Gross & Fine)', icon: '🏃' },
                        { id: 'communication', name: 'Communication (Expressive & Receptive)', icon: '💬' },
                        { id: 'social-emotional', name: 'Social-Emotional', icon: '😊' },
                        { id: 'cognitive-play', name: 'Cognitive/Play', icon: '🧩' },
                        { id: 'adaptive-self-help', name: 'Adaptive/Self-Help', icon: '👕' }
                      ].map((domain) => (
                        <label key={domain.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={reportOptions.domains.includes(domain.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReportOptions(prev => ({
                                  ...prev,
                                  domains: [...prev.domains, domain.id]
                                }));
                              } else {
                                setReportOptions(prev => ({
                                  ...prev,
                                  domains: prev.domains.filter(d => d !== domain.id)
                                }));
                              }
                            }}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-900 flex items-center">
                            <span className="mr-2" aria-hidden="true">{domain.icon}</span>
                            {domain.name}
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  </div>

                  {/* Include Emerging Skills */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Include Emerging skills</label>
                        <p className="text-sm text-gray-500 mt-1">
                          Show skills that your child is starting to demonstrate
                        </p>
                      </div>
                      <button
                        onClick={() => setReportOptions(prev => ({ ...prev, includeEmerging: !prev.includeEmerging }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          reportOptions.includeEmerging ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={reportOptions.includeEmerging}
                        aria-label="Toggle including emerging skills in report"
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          reportOptions.includeEmerging ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Include Notes */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Include Notes</label>
                        <p className="text-sm text-gray-500 mt-1">
                          Include any additional notes you've added to milestone entries
                        </p>
                      </div>
                      <button
                        onClick={() => setReportOptions(prev => ({ ...prev, includeNotes: !prev.includeNotes }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          reportOptions.includeNotes ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={reportOptions.includeNotes}
                        aria-label="Toggle including notes in report"
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          reportOptions.includeNotes ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportReady(false);
                      setIsGeneratingReport(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Cancel report generation"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={reportOptions.domains.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Generate milestone report PDF"
                    aria-describedby={reportOptions.domains.length === 0 ? "domain-selection-error" : undefined}
                  >
                    Generate PDF
                  </button>
                </div>
                {reportOptions.domains.length === 0 && (
                  <div id="domain-selection-error" className="mt-2 text-sm text-red-600" role="alert">
                    Please select at least one domain to include in the report.
                  </div>
                )}
              </>
            )}

            {/* Generating Report State */}
            {isGeneratingReport && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-hidden="true"></div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h4>
                <p className="text-sm text-gray-500">Please wait while we compile your milestone data...</p>
              </div>
            )}

            {/* Report Ready State */}
            {reportReady && (
              <div className="text-center py-8">
                <div className="text-green-500 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Download Ready</h4>
                <p className="text-sm text-gray-500 mb-6">Your milestone report has been generated successfully.</p>
                
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadReport}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Download milestone report PDF"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleSaveToVisitPacket}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Save report to Visit Packet"
                  >
                    Save to Visit Packet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Suggestions Modal */}
      {showAISuggestionsModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-suggestions-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 id="ai-suggestions-title" className="text-lg font-semibold text-gray-900">AI Skill Suggestions</h3>
              <button
                onClick={() => setShowAISuggestionsModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close AI suggestions modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Based on your child's current skills and developmental level, here are some suggested next skills to work on:
              </p>
              
              {/* Disabled AI Suggestions */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700">Fine motor precision</h6>
                      <p className="text-xs text-gray-500 mt-1">Practice stacking 4-5 blocks with steady hands</p>
                    </div>
                    <button
                      disabled
                      className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-200 border border-gray-300 rounded cursor-not-allowed"
                    >
                      Accept
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700">Bilateral coordination</h6>
                      <p className="text-xs text-gray-500 mt-1">Use both hands together for activities like clapping</p>
                    </div>
                    <button
                      disabled
                      className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-200 border border-gray-300 rounded cursor-not-allowed"
                    >
                      Accept
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700">Hand-eye coordination</h6>
                      <p className="text-xs text-gray-500 mt-1">Practice throwing and catching a soft ball</p>
                    </div>
                    <button
                      disabled
                      className="px-3 py-2 text-xs font-medium text-gray-400 bg-gray-200 border border-gray-300 rounded cursor-not-allowed"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">AI-powered suggestions coming soon!</p>
                    <p className="text-xs text-blue-700 mt-1">
                      We're working on intelligent skill recommendations based on your child's unique development pattern.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
                              <button
                  onClick={() => setShowAISuggestionsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Close AI suggestions"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Detail Placeholder Modal */}
      {showDomainDetailModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="domain-detail-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-7xl shadow-lg rounded-md bg-white h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <div>
                <h3 id="domain-detail-title" className="text-xl font-semibold text-gray-900">
                  {domains.find(d => d.id === selectedDomainForDetail)?.name || 'Domain'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Track skills and explore care ideas.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  disabled
                  className="px-3 py-2 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed opacity-60"
                  title="Coming soon"
                  aria-label="Suggest next skills with AI (coming soon)"
                >
                  Suggest next skills (AI)
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Export domain report"
                >
                  Export domain report
                </button>
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Add skill to this domain"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowDomainDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Close domain detail modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Chip */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="relative w-6 h-6">
                    <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="62.83"
                        strokeDashoffset="37.7"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">3/5</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-900">
                    Observed 3 of 5 suggested skills
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Tabbed Layout */}
            <div className="lg:hidden">
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8" aria-label="Domain detail tabs">
                  {['Skills', 'Care Ideas', 'Progress'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveMobileTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeMobileTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      aria-label={`View ${tab.toLowerCase()} tab`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mobile Tab Content */}
              <div className="h-[calc(90vh-200px)] overflow-y-auto">
                {activeMobileTab === 'Skills' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Skills Checklist</h4>
                    <p className="text-sm text-gray-500">Coming in Phase 5B Step 4</p>
                  </div>
                )}
                {activeMobileTab === 'Care Ideas' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Care Ideas</h4>
                    <p className="text-sm text-gray-500">Coming in Phase 5B Step 5</p>
                  </div>
                )}
                {activeMobileTab === 'Progress' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Progress Timeline</h4>
                    <p className="text-sm text-gray-500">Coming in Phase 5B Step 6</p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Two-Column Layout */}
            <div className="hidden lg:flex lg:space-x-8 h-[calc(90vh-200px)]">
              {/* Left Column - Skills Checklist (70%) */}
              <div 
                className="flex-1 bg-gray-50 rounded-lg p-6 overflow-y-auto"
                role="region"
                aria-label="Skills Checklist"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Skills Checklist</h4>
                
                {/* Top Bar - Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  {/* Search */}
                  <div className="mb-4">
                    <label htmlFor="skills-search" className="sr-only">Search skills</label>
                    <input
                      id="skills-search"
                      type="text"
                      placeholder="Search skills..."
                      value={skillsSearchQuery}
                      onChange={(e) => setSkillsSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Search skills by name or description"
                    />
                  </div>
                  
                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Level Filter */}
                    <div>
                      <label htmlFor="level-filter" className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                      <select
                        id="level-filter"
                        value={skillsLevelFilter}
                        onChange={(e) => setSkillsLevelFilter(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All levels</option>
                        <option value="Early">Early (0-12m)</option>
                        <option value="Toddler">Toddler (12-36m)</option>
                        <option value="Preschool">Preschool (3-5y)</option>
                        <option value="School-age">School-age (5+)</option>
                      </select>
                    </div>
                    
                    {/* Subdomain Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subdomain</label>
                      <div className="flex flex-wrap gap-1">
                        {domainSubdomains[selectedDomainForDetail as keyof typeof domainSubdomains]?.map((subdomain) => (
                          <button
                            key={subdomain}
                            onClick={() => {
                              if (skillsSubdomainFilter.includes(subdomain.toLowerCase())) {
                                setSkillsSubdomainFilter(prev => prev.filter(s => s !== subdomain.toLowerCase()));
                              } else {
                                setSkillsSubdomainFilter(prev => [...prev, subdomain.toLowerCase()]);
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded-full border ${
                              skillsSubdomainFilter.includes(subdomain.toLowerCase())
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label={`Filter by ${subdomain} subdomain`}
                          >
                            {subdomain}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status Filter */}
                    <div>
                      <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        id="status-filter"
                        value={skillsStatusFilter}
                        onChange={(e) => setSkillsStatusFilter(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All statuses</option>
                        <option value="Observed">Observed</option>
                        <option value="Emerging">Emerging</option>
                        <option value="Not yet">Not yet</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                    
                    {/* Sort */}
                    <div>
                      <label htmlFor="sort-filter" className="block text-xs font-medium text-gray-700 mb-1">Sort</label>
                      <select
                        id="sort-filter"
                        value={skillsSortBy}
                        onChange={(e) => setSkillsSortBy(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Recommended">Recommended</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Recently updated">Recently updated</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedSkills.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">
                        {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleBulkAction('mark-observed')}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200"
                        >
                          Mark Observed
                        </button>
                        <button
                          onClick={() => handleBulkAction('mark-emerging')}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200"
                        >
                          Mark Emerging
                        </button>
                        <button
                          onClick={handleAddSelectedToVisitPacket}
                          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200"
                        >
                          Add selected to Visit Packet
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills List */}
                <div className="space-y-4">
                  {(() => {
                    const { suggested, stretchNext, foundations } = getFilteredAndGroupedSkills();
                    
                    return (
                      <>
                        {/* Suggested Now Section */}
                        {suggested.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Suggested now ({suggested.length})
                            </h5>
                            <div className="space-y-2">
                              {suggested.map((skill) => (
                                <SkillRow
                                  key={skill.id}
                                  skill={skill}
                                  status={skillStatuses[skill.id] || 'Not yet'}
                                  lastObserved={lastObservedDates[skill.id]}
                                  supports={sampleSupportsUsed[skill.id] || []}
                                  isSelected={selectedSkills.includes(skill.id)}
                                  isFocused={focusedSkillId === skill.id}
                                  index={suggested.indexOf(skill)}
                                  onSelectionChange={(selected) => {
                                    if (selected) {
                                      setSelectedSkills(prev => [...prev, skill.id]);
                                    } else {
                                      setSelectedSkills(prev => prev.filter(id => id !== skill.id));
                                    }
                                  }}
                                  onStatusChange={(status) => handleSkillStatusChange(skill.id, status)}
                                  onSupportsUpdate={(supports) => handleSkillSupportsUpdate(skill.id, supports)}
                                  onKeyDown={(e) => handleKeyDown(e, skill.id, suggested.indexOf(skill))}
                                  onFocus={() => handleSkillFocus(skill.id, suggested.indexOf(skill))}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stretch Next Section */}
                        {stretchNext.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              Stretch next ({stretchNext.length})
                            </h5>
                            <div className="space-y-2">
                              {stretchNext.map((skill) => (
                                <SkillRow
                                  key={skill.id}
                                  skill={skill}
                                  status={skillStatuses[skill.id] || 'Not yet'}
                                  lastObserved={lastObservedDates[skill.id]}
                                  supports={sampleSupportsUsed[skill.id] || []}
                                  isSelected={selectedSkills.includes(skill.id)}
                                  isFocused={focusedSkillId === skill.id}
                                  index={stretchNext.indexOf(skill)}
                                  onSelectionChange={(selected) => {
                                    if (selected) {
                                      setSelectedSkills(prev => [...prev, skill.id]);
                                    } else {
                                      setSelectedSkills(prev => prev.filter(id => id !== skill.id));
                                    }
                                  }}
                                  onStatusChange={(status) => handleSkillStatusChange(skill.id, status)}
                                  onSupportsUpdate={(supports) => handleSkillSupportsUpdate(skill.id, supports)}
                                  onKeyDown={(e) => handleKeyDown(e, skill.id, stretchNext.indexOf(skill))}
                                  onFocus={() => handleSkillFocus(skill.id, stretchNext.indexOf(skill))}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Foundations Section */}
                        {foundations.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                              Foundations ({foundations.length})
                            </h5>
                            <div className="space-y-2">
                              {foundations.map((skill) => (
                                <SkillRow
                                  key={skill.id}
                                  skill={skill}
                                  status={skillStatuses[skill.id] || 'Not yet'}
                                  lastObserved={lastObservedDates[skill.id]}
                                  supports={sampleSupportsUsed[skill.id] || []}
                                  isSelected={selectedSkills.includes(skill.id)}
                                  isFocused={focusedSkillId === skill.id}
                                  index={foundations.indexOf(skill)}
                                  onSelectionChange={(selected) => {
                                    if (selected) {
                                      setSelectedSkills(prev => [...prev, skill.id]);
                                    } else {
                                      setSelectedSkills(prev => prev.filter(id => id !== skill.id));
                                    }
                                  }}
                                  onStatusChange={(status) => handleSkillStatusChange(skill.id, status)}
                                  onSupportsUpdate={(supports) => handleSkillSupportsUpdate(skill.id, supports)}
                                  onKeyDown={(e) => handleKeyDown(e, skill.id, foundations.indexOf(skill))}
                                  onFocus={() => handleSkillFocus(skill.id, foundations.indexOf(skill))}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No Skills Message */}
                        {suggested.length === 0 && stretchNext.length === 0 && foundations.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No skills match the current filters.</p>
                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Add Custom Skill */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCustomSkillForm(true)}
                    className="w-full px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Add custom skill"
                  >
                    + Add custom skill
                  </button>
                </div>
              </div>

              {/* Right Column - Care Ideas (30%, sticky) */}
              <div 
                className="w-80 bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto lg:sticky lg:top-6 lg:self-start"
                role="region"
                aria-label="Care Ideas"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Care Ideas for {selectedDomainForDetail?.charAt(0).toUpperCase() + selectedDomainForDetail?.slice(1)}
                  </h4>
                  <button
                    disabled
                    className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                    title="Coming soon"
                    aria-label="Generate care ideas using AI (coming soon)"
                  >
                    Generate care ideas (AI)
                  </button>
                </div>
                
                {/* Personalize Bar */}
                <div className="space-y-4 mb-6">
                  {/* Environment */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Environment</label>
                    <div className="flex flex-wrap gap-1">
                      {['home', 'school', 'therapy', 'community'].map((env) => (
                        <button
                          key={env}
                          onClick={() => {
                            if (careIdeasEnvironment.includes(env)) {
                              setCareIdeasEnvironment(prev => prev.filter(e => e !== env));
                            } else {
                              setCareIdeasEnvironment(prev => [...prev, env]);
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            careIdeasEnvironment.includes(env)
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label={`Filter by ${env} environment`}
                        >
                          {env.charAt(0).toUpperCase() + env.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Supports Available */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Supports available</label>
                    <div className="flex flex-wrap gap-1">
                      {['Visuals', 'AAC', 'Adaptive utensils', 'Orthotics', 'Timer', 'Sensory breaks'].map((support) => (
                        <button
                          key={support}
                          onClick={() => {
                            if (careIdeasSupports.includes(support.toLowerCase())) {
                              setCareIdeasSupports(prev => prev.filter(s => s !== support.toLowerCase()));
                            } else {
                              setCareIdeasSupports(prev => [...prev, support.toLowerCase()]);
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            careIdeasSupports.includes(support.toLowerCase())
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label={`Filter by ${support} support`}
                        >
                          {support}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time Available */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Time available</label>
                    <div className="flex gap-1">
                      {['5 min', '10-15 min', '20+ min'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setCareIdeasTimeAvailable(time)}
                          className={`px-3 py-1 text-xs rounded-md border ${
                            careIdeasTimeAvailable === time
                              ? 'bg-purple-100 border-purple-300 text-purple-800'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label={`Select ${time} time available`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Care Ideas Cards */}
                <div className="space-y-4">
                  {(() => {
                    const filteredIdeas = getFilteredCareIdeas();
                    
                    if (filteredIdeas.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm mb-3">Log or update skills to see tailored ideas.</p>
                          <button
                            onClick={() => {
                              // TODO: Navigate to skills section
                              console.log('Navigate to skills');
                            }}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                          >
                            Go to Skills
                          </button>
                        </div>
                      );
                    }
                    
                    return filteredIdeas.map((idea) => (
                      <div key={idea.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-900">{idea.title}</h5>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Pin to shortcuts"
                            title="Pin to shortcuts"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {idea.goalTags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            idea.levelTag === 'Suggested now' ? 'bg-green-100 text-green-800' :
                            idea.levelTag === 'Stretch' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {idea.levelTag}
                          </span>
                        </div>
                        
                        {/* Materials */}
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-700">Materials: </span>
                          <span className="text-xs text-gray-600">{idea.materials.join(', ')}</span>
                        </div>
                        
                        {/* Steps */}
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-700">Steps:</span>
                          <ul className="mt-1 space-y-1">
                            {idea.steps.map((step, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start">
                                <span className="text-gray-400 mr-1">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Adaptations */}
                        {idea.adaptations.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-gray-700">Adaptations: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {idea.adaptations.map((adaptation) => (
                                <span key={adaptation} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {adaptation}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Safety Note */}
                        {idea.safetyNote && (
                          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                            <span className="text-xs font-medium text-red-800">Safety: </span>
                            <span className="text-xs text-red-700">{idea.safetyNote}</span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex space-x-2 pt-3 border-t border-gray-200">
                          <button className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                            Save
                          </button>
                          <button className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                            Print
                          </button>
                          <button className="flex-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100">
                            Share
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Skill Form Modal */}
      {showCustomSkillForm && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-skill-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 id="custom-skill-title" className="text-lg font-semibold text-gray-900">Add Custom Skill</h3>
              <button
                onClick={() => setShowCustomSkillForm(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close custom skill form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Skill Name */}
              <div>
                <label htmlFor="custom-skill-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name *
                </label>
                <input
                  id="custom-skill-name"
                  type="text"
                  value={customSkillForm.name}
                  onChange={(e) => setCustomSkillForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter skill name"
                  aria-describedby="skill-name-help"
                />
                <p id="skill-name-help" className="mt-1 text-sm text-gray-500">
                  Describe the specific skill you want to track
                </p>
              </div>

              {/* Subdomain */}
              <div>
                <label htmlFor="custom-skill-subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain *
                </label>
                <select
                  id="custom-skill-subdomain"
                  value={customSkillForm.subdomain}
                  onChange={(e) => setCustomSkillForm(prev => ({ ...prev, subdomain: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select subdomain</option>
                  {domainSubdomains[selectedDomainForDetail as keyof typeof domainSubdomains]?.map((subdomain) => (
                    <option key={subdomain} value={subdomain.toLowerCase()}>
                      {subdomain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Band */}
              <div>
                <label htmlFor="custom-skill-level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level Band
                </label>
                <select
                  id="custom-skill-level"
                  value={customSkillForm.levelBand}
                  onChange={(e) => setCustomSkillForm(prev => ({ ...prev, levelBand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Early">Early (0-12m)</option>
                  <option value="Toddler">Toddler (12-36m)</option>
                  <option value="Preschool">Preschool (3-5y)</option>
                  <option value="School-age">School-age (5+)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setShowCustomSkillForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Cancel adding custom skill"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomSkill}
                disabled={!customSkillForm.name || !customSkillForm.subdomain}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save custom skill"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill History Drawer */}
      {showSkillHistory && selectedSkillForHistory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedSkillForHistory.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedSkillForHistory.subdomain} • {selectedSkillForHistory.ageBand}
                </p>
              </div>
              <button
                onClick={() => setShowSkillHistory(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close skill history"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Actions */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={handleEditLastEntry}
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit last entry
                </button>
                <button
                  onClick={() => setShowAddNoteForm(true)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Add note
                </button>
              </div>

              {/* Status Changes Timeline */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Status Changes</h4>
                <div className="space-y-4">
                  {skillHistoryData[selectedSkillForHistory.id]?.statusChanges?.map((change, index) => (
                    <div key={index} className="relative pl-6">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      
                      {/* Timeline line */}
                      {index < (skillHistoryData[selectedSkillForHistory.id]?.statusChanges?.length || 0) - 1 && (
                        <div className="absolute left-1.5 top-5 w-0.5 h-8 bg-gray-200"></div>
                      )}
                      
                      {/* Content */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {change.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(change.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {change.supports.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-600">Supports: </span>
                            <span className="text-xs text-gray-800">
                              {change.supports.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Updated by {change.author}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!skillHistoryData[selectedSkillForHistory.id]?.statusChanges || skillHistoryData[selectedSkillForHistory.id].statusChanges.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No status changes recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Notes</h4>
                <div className="space-y-3">
                  {skillHistoryData[selectedSkillForHistory.id]?.notes?.map((note, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-yellow-800">
                          {note.author}
                        </span>
                        <span className="text-xs text-yellow-600">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-yellow-900">{note.text}</p>
                    </div>
                  ))}
                  
                  {(!skillHistoryData[selectedSkillForHistory.id]?.notes || skillHistoryData[selectedSkillForHistory.id].notes.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No notes yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Form Modal */}
      {showAddNoteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
              <button
                onClick={() => setShowAddNoteForm(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close add note form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="note-text" className="block text-sm font-medium text-gray-700 mb-2">
                Note *
              </label>
              <textarea
                id="note-text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your note about this skill..."
                aria-describedby="note-help"
              />
              <p id="note-help" className="mt-1 text-sm text-gray-500">
                Add observations, progress notes, or reminders about this skill.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddNoteForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline Section (Desktop) */}
      <div className="hidden lg:block mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-900">Progress Timeline</h4>
          
          {/* Progress Controls */}
          <div className="flex items-center space-x-4">
            {/* Time Scope */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Time scope:</span>
              <div className="flex space-x-1">
                {['30 days', '90 days', 'Custom'].map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setProgressTimeScope(scope)}
                    className={`px-3 py-1 text-xs rounded-md border ${
                      progressTimeScope === scope
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
              
              {/* Custom Date Range */}
              {progressTimeScope === 'Custom' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={progressCustomStartDate}
                    onChange={(e) => setProgressCustomStartDate(e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                    placeholder="Start date"
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="date"
                    value={progressCustomEndDate}
                    onChange={(e) => setProgressCustomEndDate(e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                    placeholder="End date"
                  />
                </div>
              )}
            </div>
            
            {/* View Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">View:</span>
              <div className="flex space-x-1">
                {['By date', 'By subdomain'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setProgressView(view as 'By date' | 'By subdomain')}
                    className={`px-3 py-1 text-xs rounded-md border ${
                      progressView === view
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="mb-6">
          {(() => {
            const progressData = getProgressDataForDomain();
            if (!progressData) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No progress data available for this domain.</p>
                </div>
              );
            }

            if (progressView === 'By date') {
              return (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Timeline View</h5>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline entries */}
                    <div className="space-y-4">
                      {progressData.timeline.map((item, index) => (
                        <div key={index} className="relative pl-12">
                          {/* Timeline dot */}
                          <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-2 ${
                            item.status === 'Observed' 
                              ? 'bg-green-500 border-green-600' 
                              : 'bg-yellow-500 border-yellow-600'
                          }`}></div>
                          
                          {/* Content */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {item.skill}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Observed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Subdomain View</h5>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(progressData.subdomains).map(([subdomain, counts]) => (
                      <div key={subdomain} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {subdomain}
                          </span>
                          <span className="text-xs text-gray-500">
                            {counts.observed + counts.emerging} skills
                          </span>
                        </div>
                        
                        {/* Progress bars */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 w-16">Observed:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(counts.observed / Math.max(counts.observed + counts.emerging, 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-700 w-8">{counts.observed}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 w-16">Emerging:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(counts.emerging / Math.max(counts.observed + counts.emerging, 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-700 w-8">{counts.emerging}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          })()}
        </div>

        {/* New Skills Added List */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-4">New skills added</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(() => {
              const progressData = getProgressDataForDomain();
              if (!progressData || progressData.timeline.length === 0) {
                return (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    <p className="text-sm">No new skills in the selected time period.</p>
                  </div>
                );
              }

              return progressData.timeline
                .filter(item => item.status === 'Observed')
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.skill}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // TODO: Navigate to skill history
                          console.log('Navigate to skill history for:', item.skill);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                      >
                        View history
                      </button>
                      <button
                        onClick={() => {
                          if (visitPacketItems.has(item.skill)) {
                            handleRemoveFromVisitPacket(item.skill, 'Progress item');
                          } else {
                            handleAddToVisitPacket(item.skill, 'Progress item');
                          }
                        }}
                        className={`text-xs px-2 py-1 rounded ${
                          visitPacketItems.has(item.skill)
                            ? 'text-red-600 bg-red-50 border border-red-200'
                            : 'text-green-600 bg-green-50 border border-green-200'
                        }`}
                      >
                        {visitPacketItems.has(item.skill) ? 'Remove' : 'Add to Visit Packet'}
                      </button>
                    </div>
                  </div>
                ));
            })()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleExportDomainProgress}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export domain progress (PDF)
          </button>
          <button
            onClick={() => handleAddToVisitPacket('domain-progress', 'Domain progress')}
            className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add to Visit Packet
          </button>
        </div>
      </div>

      {/* Export Domain Report Modal */}
      {showExportReportModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-report-title"
        >
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 id="export-report-title" className="text-lg font-semibold text-gray-900">
                Export Domain Report
              </h3>
              <button
                onClick={() => {
                  setShowExportReportModal(false);
                  setExportReportStatus('options');
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close export report modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content based on status */}
            {exportReportStatus === 'options' && (
              <div className="space-y-6">
                {/* Date Range Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="export-start-date" className="block text-xs font-medium text-gray-600 mb-1">
                        Start Date
                      </label>
                      <input
                        id="export-start-date"
                        type="date"
                        value={exportReportOptions.dateRange.start}
                        onChange={(e) => setExportReportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="export-end-date" className="block text-xs font-medium text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        id="export-end-date"
                        type="date"
                        value={exportReportOptions.dateRange.end}
                        onChange={(e) => setExportReportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Include Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Include</label>
                  <div className="space-y-2">
                    {[
                      { key: 'observed', label: 'Observed skills', description: 'Skills marked as observed in the selected time range' },
                      { key: 'emerging', label: 'Emerging skills', description: 'Skills marked as emerging in the selected time range' },
                      { key: 'notes', label: 'Notes and observations', description: 'All notes and observations for skills in the selected time range' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={exportReportOptions.include[option.key as keyof typeof exportReportOptions.include]}
                          onChange={(e) => setExportReportOptions(prev => ({
                            ...prev,
                            include: { ...prev.include, [option.key]: e.target.checked }
                          }))}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{option.label}</span>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Report Sections</label>
                  <div className="space-y-2">
                    {[
                      { key: 'skillsList', label: 'Skills List', description: 'Complete list of skills with current status and progress' },
                      { key: 'careIdeasSnapshot', label: 'Care Ideas Snapshot', description: 'Current care ideas and activity suggestions' },
                      { key: 'timelineChart', label: 'Timeline Chart', description: 'Visual timeline of skill development progress' }
                    ].map((section) => (
                      <label key={section.key} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={exportReportOptions.sections[section.key as keyof typeof exportReportOptions.sections]}
                          onChange={(e) => setExportReportOptions(prev => ({
                            ...prev,
                            sections: { ...prev.sections, [section.key]: e.target.checked }
                          }))}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{section.label}</span>
                          <p className="text-xs text-gray-500">{section.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowExportReportModal(false);
                      setExportReportStatus('options');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExportDomainReport}
                    disabled={!exportReportOptions.dateRange.start || !exportReportOptions.dateRange.end}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate PDF
                  </button>
                </div>
              </div>
            )}

            {/* Generating Status */}
            {exportReportStatus === 'generating' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h4>
                <p className="text-sm text-gray-500">
                  Creating your domain report with the selected options...
                </p>
              </div>
            )}

            {/* Ready Status */}
            {exportReportStatus === 'ready' && (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Report Ready!</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Your domain report has been generated successfully.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleDownloadReport}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Download Report
                  </button>
                  <button
                    onClick={handleSaveToVisitPacket}
                    className="px-6 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save to Visit Packet
                  </button>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowExportReportModal(false);
                    setExportReportStatus('options');
                  }}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification with live region */}
      {showToast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
            toastType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toastType === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center space-x-2">
            {toastType === 'success' && (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toastType === 'info' && (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toastType === 'error' && (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile Sticky Save/Update Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // TODO: Save all changes
              showToastMessage('Changes saved successfully');
            }}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              // TODO: Reset changes
              showToastMessage('Changes reset');
            }}
            className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrowthDevelopmentScreen; 