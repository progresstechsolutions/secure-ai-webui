import React, { useState, useEffect } from 'react';

interface GrowthDevelopmentScreenProps {
  onBack: () => void;
}

interface DomainData {
  id: string;
  name: string;
  icon: string;
  observedSkills: number;
  suggestedSkills: number;
  lastSkillName?: string;
  lastSkillDate?: string;
}

interface SkillData {
  id: string;
  name: string;
  domain: string;
  ageRange: string;
  description: string;
  ageBand: string; // Added for age-based filtering
}

interface MilestoneEntry {
  id: string;
  skillId: string;
  skillName: string;
  domain: string;
  domainIcon: string;
  status: 'observed' | 'emerging' | 'not-yet' | 'not-applicable';
  dateObserved: string;
  context: string[];
  supports: string[];
  notes: string;
  caregiver: string;
}

interface AddSkillForm {
  step: number;
  selectedDomain: string;
  selectedSkill: string;
  status: 'observed' | 'emerging' | 'not-yet' | 'not-applicable';
  dateObserved: string;
  supports: string[];
  context: string[];
  notes: string;
}

const GrowthDevelopmentScreen: React.FC<GrowthDevelopmentScreenProps> = ({ onBack }) => {
  const [showQuickAddSheet, setShowQuickAddSheet] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMilestoneDetail, setShowMilestoneDetail] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneEntry | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [milestoneSettings, setMilestoneSettings] = useState({
    defaultView: 'age-based' as 'age-based' | 'developmental-level',
    showSkillsBeyondLevel: true,
    weeklyReminder: false
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false
  });
  const [reportOptions, setReportOptions] = useState({
    includeDomains: ['motor', 'communication', 'social-emotional', 'cognitive', 'adaptive'],
    includeEmergingSkills: true,
    includeNotes: true
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [showDomainDetail, setShowDomainDetail] = useState(false);
  
  // Filter states
  const [useDevelopmentalLevel, setUseDevelopmentalLevel] = useState(false);
  const [chronologicalAge, setChronologicalAge] = useState('24 months'); // Prefilled from Profile
  const [developmentalLevel, setDevelopmentalLevel] = useState('Toddler (12–36m)');
  const [timeScope, setTimeScope] = useState('30 days');

  // Add Skill form state
  const [addSkillForm, setAddSkillForm] = useState<AddSkillForm>({
    step: 1,
    selectedDomain: '',
    selectedSkill: '',
    status: 'observed',
    dateObserved: new Date().toISOString().split('T')[0],
    supports: [],
    context: [],
    notes: ''
  });

  // Skill filtering state
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Loading and empty states
  const [isLoading, setIsLoading] = useState(false);
  const [hasMilestones, setHasMilestones] = useState(false);

  const ageOptions = [
    '6 months', '12 months', '18 months', '24 months', '30 months', '36 months',
    '4 years', '5 years', '6 years', '7 years', '8 years', '9 years', '10 years'
  ];

  const developmentalLevels = [
    'Early (0–12m)',
    'Toddler (12–36m)', 
    'Preschool (3–5y)',
    'School-age (5+)'
  ];

  const timeScopeOptions = [
    'This week',
    '30 days',
    '90 days', 
    'Custom'
  ];

  // Domain data - this would come from API in real implementation
  const domains: DomainData[] = [
    {
      id: 'motor',
      name: 'Motor',
      icon: '🏃',
      observedSkills: 8,
      suggestedSkills: 12,
      lastSkillName: 'Walks independently',
      lastSkillDate: '2024-01-15'
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: '💬',
      observedSkills: 5,
      suggestedSkills: 10,
      lastSkillName: 'Says "mama" and "dada"',
      lastSkillDate: '2024-01-10'
    },
    {
      id: 'social-emotional',
      name: 'Social-Emotional',
      icon: '😊',
      observedSkills: 6,
      suggestedSkills: 8,
      lastSkillName: 'Shows affection',
      lastSkillDate: '2024-01-12'
    },
    {
      id: 'cognitive',
      name: 'Cognitive/Play',
      icon: '🧩',
      observedSkills: 4,
      suggestedSkills: 9,
      lastSkillName: 'Stacks 2 blocks',
      lastSkillDate: '2024-01-08'
    },
    {
      id: 'adaptive',
      name: 'Adaptive/Self-Help',
      icon: '👕',
      observedSkills: 3,
      suggestedSkills: 7,
      lastSkillName: 'Feeds self with fingers',
      lastSkillDate: '2024-01-05'
    }
  ];

  // Sample skills data - this would come from API in real implementation
  const allSkills: SkillData[] = [
    // Motor skills - 0-6 months
    { id: 'm1', name: 'Rolls both ways', domain: 'motor', ageRange: '3-6 months', description: 'Rolls from back to tummy and tummy to back', ageBand: '0-6' },
    { id: 'm2', name: 'Sits briefly without support', domain: 'motor', ageRange: '4-7 months', description: 'Sits independently for short periods', ageBand: '0-6' },
    { id: 'm3', name: 'Pulls to stand', domain: 'motor', ageRange: '6-10 months', description: 'Pulls self up to standing position', ageBand: '6-12' },
    { id: 'm4', name: 'Cruises along furniture', domain: 'motor', ageRange: '8-12 months', description: 'Walks while holding onto furniture', ageBand: '6-12' },
    { id: 'm5', name: 'Walks with support', domain: 'motor', ageRange: '9-12 months', description: 'Takes steps while holding hands', ageBand: '6-12' },
    { id: 'm6', name: 'Pincer grasp', domain: 'motor', ageRange: '9-12 months', description: 'Picks up small objects with thumb and finger', ageBand: '6-12' },
    { id: 'm7', name: 'Stacks 2 blocks', domain: 'motor', ageRange: '15-18 months', description: 'Stacks 2 blocks on top of each other', ageBand: '12-18' },
    { id: 'm8', name: 'Throws ball forward', domain: 'motor', ageRange: '18-24 months', description: 'Throws ball in forward direction', ageBand: '18-24' },
    { id: 'm9', name: 'Runs with coordination', domain: 'motor', ageRange: '18-24 months', description: 'Runs with good balance and coordination', ageBand: '18-24' },
    { id: 'm10', name: 'Climbs stairs with help', domain: 'motor', ageRange: '18-24 months', description: 'Climbs stairs while holding railing or hand', ageBand: '18-24' },
    { id: 'm11', name: 'Stands on one foot', domain: 'motor', ageRange: '24-30 months', description: 'Balances on one foot briefly', ageBand: '24-30' },
    { id: 'm12', name: 'Jumps with both feet', domain: 'motor', ageRange: '24-30 months', description: 'Jumps off ground with both feet', ageBand: '24-30' },
    { id: 'm13', name: 'Pedals tricycle', domain: 'motor', ageRange: '30-36 months', description: 'Pedals tricycle independently', ageBand: '30-36' },
    { id: 'm14', name: 'Catches large ball', domain: 'motor', ageRange: '30-36 months', description: 'Catches large ball with arms', ageBand: '30-36' },
    { id: 'm15', name: 'Hops on one foot', domain: 'motor', ageRange: '36-48 months', description: 'Hops on one foot multiple times', ageBand: '36-48' },
    
    // Communication skills - 0-6 months
    { id: 'c1', name: 'Babbles with consonants', domain: 'communication', ageRange: '4-7 months', description: 'Makes consonant sounds like "ba", "da", "ma"', ageBand: '0-6' },
    { id: 'c2', name: 'Responds to name', domain: 'communication', ageRange: '4-7 months', description: 'Turns head when name is called', ageBand: '0-6' },
    { id: 'c3', name: 'Says "mama" and "dada"', domain: 'communication', ageRange: '9-12 months', description: 'Uses mama and dada specifically', ageBand: '6-12' },
    { id: 'c4', name: 'Points to request', domain: 'communication', ageRange: '9-12 months', description: 'Points to objects they want', ageBand: '6-12' },
    { id: 'c5', name: 'Uses 5-10 words', domain: 'communication', ageRange: '12-15 months', description: 'Uses 5-10 recognizable words', ageBand: '12-18' },
    { id: 'c6', name: 'Follows 1-step directions', domain: 'communication', ageRange: '12-15 months', description: 'Follows simple commands like "come here"', ageBand: '12-18' },
    { id: 'c7', name: 'Names common objects', domain: 'communication', ageRange: '15-18 months', description: 'Names familiar objects like ball, cup, dog', ageBand: '12-18' },
    { id: 'c8', name: 'Combines 2 words', domain: 'communication', ageRange: '18-24 months', description: 'Combines two words together', ageBand: '18-24' },
    { id: 'c9', name: 'Names body parts', domain: 'communication', ageRange: '18-24 months', description: 'Names 3-5 body parts', ageBand: '18-24' },
    { id: 'c10', name: 'Uses 50+ words', domain: 'communication', ageRange: '24-30 months', description: 'Uses 50 or more words', ageBand: '24-30' },
    { id: 'c11', name: 'Asks questions', domain: 'communication', ageRange: '24-30 months', description: 'Asks "what" and "where" questions', ageBand: '24-30' },
    { id: 'c12', name: 'Uses 3-word sentences', domain: 'communication', ageRange: '30-36 months', description: 'Uses 3-word sentences', ageBand: '30-36' },
    { id: 'c13', name: 'Tells simple stories', domain: 'communication', ageRange: '36-48 months', description: 'Tells simple stories or events', ageBand: '36-48' },
    
    // Social-Emotional skills - 0-6 months
    { id: 's1', name: 'Social smile', domain: 'social-emotional', ageRange: '1-3 months', description: 'Smiles in response to faces and voices', ageBand: '0-6' },
    { id: 's2', name: 'Joint attention', domain: 'social-emotional', ageRange: '6-9 months', description: 'Looks where you point and follows gaze', ageBand: '6-12' },
    { id: 's3', name: 'Waves bye', domain: 'social-emotional', ageRange: '9-12 months', description: 'Waves goodbye when prompted', ageBand: '6-12' },
    { id: 's4', name: 'Brings item to show', domain: 'social-emotional', ageRange: '12-15 months', description: 'Brings objects to show to others', ageBand: '12-18' },
    { id: 's5', name: 'Shows affection', domain: 'social-emotional', ageRange: '12-18 months', description: 'Shows affection to familiar people', ageBand: '12-18' },
    { id: 's6', name: 'Parallel play', domain: 'social-emotional', ageRange: '18-24 months', description: 'Plays near other children', ageBand: '18-24' },
    { id: 's7', name: 'Takes turns briefly', domain: 'social-emotional', ageRange: '18-24 months', description: 'Takes turns in simple games', ageBand: '18-24' },
    { id: 's8', name: 'Shows empathy', domain: 'social-emotional', ageRange: '24-30 months', description: 'Shows concern for others', ageBand: '24-30' },
    { id: 's9', name: 'Shares toys', domain: 'social-emotional', ageRange: '30-36 months', description: 'Shares toys with prompting', ageBand: '30-36' },
    { id: 's10', name: 'Plays cooperatively', domain: 'social-emotional', ageRange: '36-48 months', description: 'Plays cooperatively with others', ageBand: '36-48' },
    
    // Cognitive/Play skills - 0-6 months
    { id: 'cp1', name: 'Bangs two objects', domain: 'cognitive', ageRange: '6-9 months', description: 'Bangs two objects together', ageBand: '6-12' },
    { id: 'cp2', name: 'Puts objects in/out', domain: 'cognitive', ageRange: '9-12 months', description: 'Puts objects in and takes them out of containers', ageBand: '6-12' },
    { id: 'cp3', name: 'Cause-and-effect toy play', domain: 'cognitive', ageRange: '9-12 months', description: 'Plays with toys that respond to actions', ageBand: '6-12' },
    { id: 'cp4', name: 'Stacks 2 blocks', domain: 'cognitive', ageRange: '15-18 months', description: 'Stacks 2 blocks on top of each other', ageBand: '12-18' },
    { id: 'cp5', name: 'Matches shapes', domain: 'cognitive', ageRange: '18-24 months', description: 'Matches simple shapes', ageBand: '18-24' },
    { id: 'cp6', name: 'Completes 3-piece puzzle', domain: 'cognitive', ageRange: '18-24 months', description: 'Completes simple 3-piece puzzles', ageBand: '18-24' },
    { id: 'cp7', name: 'Pretend feeds doll', domain: 'cognitive', ageRange: '18-24 months', description: 'Engages in pretend play feeding dolls', ageBand: '18-24' },
    { id: 'cp8', name: 'Imitates actions', domain: 'cognitive', ageRange: '18-24 months', description: 'Imitates adult actions', ageBand: '18-24' },
    { id: 'cp9', name: 'Pretend play', domain: 'cognitive', ageRange: '24-30 months', description: 'Engages in pretend play', ageBand: '24-30' },
    { id: 'cp10', name: 'Counts to 3', domain: 'cognitive', ageRange: '24-30 months', description: 'Counts objects to 3', ageBand: '24-30' },
    { id: 'cp11', name: 'Names colors', domain: 'cognitive', ageRange: '30-36 months', description: 'Names 3-4 colors', ageBand: '30-36' },
    { id: 'cp12', name: 'Completes puzzles', domain: 'cognitive', ageRange: '30-36 months', description: 'Completes 3-4 piece puzzles', ageBand: '30-36' },
    
    // Adaptive/Self-Help skills - 0-6 months
    { id: 'a1', name: 'Finger feeds', domain: 'adaptive', ageRange: '6-9 months', description: 'Feeds self using fingers', ageBand: '6-12' },
    { id: 'a2', name: 'Drinks from open cup with help', domain: 'adaptive', ageRange: '6-9 months', description: 'Drinks from cup with assistance', ageBand: '6-12' },
    { id: 'a3', name: 'Uses spoon with some spills', domain: 'adaptive', ageRange: '12-15 months', description: 'Uses spoon to feed self with some mess', ageBand: '12-18' },
    { id: 'a4', name: 'Removes socks', domain: 'adaptive', ageRange: '12-15 months', description: 'Removes socks independently', ageBand: '12-18' },
    { id: 'a5', name: 'Helps with dressing', domain: 'adaptive', ageRange: '15-18 months', description: 'Helps put on simple clothing items', ageBand: '12-18' },
    { id: 'a6', name: 'Indicates wet/soiled diaper', domain: 'adaptive', ageRange: '18-24 months', description: 'Shows awareness of wet or dirty diaper', ageBand: '18-24' },
    { id: 'a7', name: 'Sits on toilet with support', domain: 'adaptive', ageRange: '18-24 months', description: 'Sits on toilet with assistance', ageBand: '18-24' },
    { id: 'a8', name: 'Washes hands', domain: 'adaptive', ageRange: '24-30 months', description: 'Washes hands with help', ageBand: '24-30' },
    { id: 'a9', name: 'Puts on simple clothes', domain: 'adaptive', ageRange: '30-36 months', description: 'Puts on simple clothing items', ageBand: '30-36' },
    { id: 'a10', name: 'Uses toilet', domain: 'adaptive', ageRange: '30-36 months', description: 'Uses toilet with help', ageBand: '30-36' }
  ];

  const supportOptions = [
    'Hand-over-hand',
    'Adaptive utensil',
    'Prompts',
    'AAC',
    'Brace/orthotics'
  ];

  const contextOptions = [
    'Home',
    'School',
    'Therapy',
    'Community'
  ];

  // Sample milestone entries - this would come from API in real implementation
  const milestoneEntries: MilestoneEntry[] = [
    {
      id: '1',
      skillId: 'm7',
      skillName: 'Stacks 2 blocks',
      domain: 'motor',
      domainIcon: '🏃',
      status: 'observed',
      dateObserved: '2024-01-15',
      context: ['Home', 'Therapy'],
      supports: ['Prompts'],
      notes: 'Successfully stacked 2 blocks during playtime. Needed minimal prompting to start.',
      caregiver: 'Mom'
    },
    {
      id: '2',
      skillId: 'c5',
      skillName: 'Uses 5-10 words',
      domain: 'communication',
      domainIcon: '💬',
      status: 'emerging',
      dateObserved: '2024-01-12',
      context: ['Home'],
      supports: ['AAC'],
      notes: 'Using about 8 words consistently. AAC device helps with new words.',
      caregiver: 'Dad'
    },
    {
      id: '3',
      skillId: 's5',
      skillName: 'Shows affection',
      domain: 'social-emotional',
      domainIcon: '😊',
      status: 'observed',
      dateObserved: '2024-01-10',
      context: ['Home'],
      supports: [],
      notes: 'Gives hugs and kisses to family members spontaneously.',
      caregiver: 'Mom'
    },
    {
      id: '4',
      skillId: 'cp4',
      skillName: 'Stacks 2 blocks',
      domain: 'cognitive',
      domainIcon: '🧩',
      status: 'observed',
      dateObserved: '2024-01-08',
      context: ['Therapy'],
      supports: ['Hand-over-hand'],
      notes: 'Completed stacking task with hand-over-hand assistance initially, then independently.',
      caregiver: 'Therapist'
    },
    {
      id: '5',
      skillId: 'a3',
      skillName: 'Uses spoon with some spills',
      domain: 'adaptive',
      domainIcon: '👕',
      status: 'emerging',
      dateObserved: '2024-01-05',
      context: ['Home'],
      supports: ['Adaptive utensil'],
      notes: 'Using adapted spoon. Still some spills but much improved coordination.',
      caregiver: 'Mom'
    },
    {
      id: '6',
      skillId: 'm8',
      skillName: 'Throws ball forward',
      domain: 'motor',
      domainIcon: '🏃',
      status: 'not-yet',
      dateObserved: '2024-01-03',
      context: ['Therapy'],
      supports: ['Hand-over-hand'],
      notes: 'Working on ball throwing. Needs support to aim and release.',
      caregiver: 'Therapist'
    },
    {
      id: '7',
      skillId: 'c8',
      skillName: 'Combines 2 words',
      domain: 'communication',
      domainIcon: '💬',
      status: 'not-applicable',
      dateObserved: '2024-01-01',
      context: ['Therapy'],
      supports: ['AAC'],
      notes: 'Not yet combining words. Using AAC for communication.',
      caregiver: 'Therapist'
    },
    {
      id: '8',
      skillId: 's6',
      skillName: 'Parallel play',
      domain: 'social-emotional',
      domainIcon: '😊',
      status: 'observed',
      dateObserved: '2023-12-28',
      context: ['School'],
      supports: [],
      notes: 'Plays alongside peers at preschool. Shows interest in other children.',
      caregiver: 'Teacher'
    },
    {
      id: '9',
      skillId: 'cp6',
      skillName: 'Completes 3-piece puzzle',
      domain: 'cognitive',
      domainIcon: '🧩',
      status: 'emerging',
      dateObserved: '2023-12-25',
      context: ['Home'],
      supports: ['Prompts'],
      notes: 'Can complete 2 pieces independently, needs prompts for 3rd piece.',
      caregiver: 'Dad'
    },
    {
      id: '10',
      skillId: 'a6',
      skillName: 'Indicates wet/soiled diaper',
      domain: 'adaptive',
      domainIcon: '👕',
      status: 'observed',
      dateObserved: '2023-12-22',
      context: ['Home'],
      supports: [],
      notes: 'Consistently indicates when diaper needs changing.',
      caregiver: 'Mom'
    }
  ];

  const handleOpenDomain = (domainId: string) => {
    setCurrentDomain(domainId);
    setShowDomainDetail(true);
  };

  const handleCloseDomainDetail = () => {
    setShowDomainDetail(false);
    setCurrentDomain(null);
  };

  const handleViewMilestone = (milestone: MilestoneEntry) => {
    setSelectedMilestone(milestone);
    setShowMilestoneDetail(true);
  };

  const handleViewAllMilestones = () => {
    // Navigate to Journal filtered to Milestones type
    console.log('Navigate to Journal > Milestones filter');
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('milestoneSettings', JSON.stringify(milestoneSettings));
    setShowSettingsModal(false);
    showToast('success', 'Settings saved.');
  };

  const handleCancelSettings = () => {
    setShowSettingsModal(false);
  };

  const handleOpenReportModal = () => {
    setShowReportModal(true);
    setReportReady(false);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setIsGeneratingReport(false);
    setReportReady(false);
  };

  const handleGeneratePDF = () => {
    setIsGeneratingReport(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportReady(true);
    }, 2000);
  };

  const handleSaveToVisitPacket = () => {
    // Add report to visit packet
    console.log('Adding milestone report to visit packet');
    showToast('success', 'Report added to Visit Packet');
    handleCloseReportModal();
  };

  const handleDomainToggle = (domainId: string) => {
    setReportOptions(prev => ({
      ...prev,
      includeDomains: prev.includeDomains.includes(domainId)
        ? prev.includeDomains.filter(id => id !== domainId)
        : [...prev.includeDomains, domainId]
    }));
  };

  const handleOpenAISuggestions = () => {
    setShowAISuggestionsModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'observed': return 'bg-green-100 text-green-800';
      case 'emerging': return 'bg-yellow-100 text-yellow-800';
      case 'not-yet': return 'bg-gray-100 text-gray-800';
      case 'not-applicable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'observed': return 'Observed';
      case 'emerging': return 'Emerging';
      case 'not-yet': return 'Not yet';
      case 'not-applicable': return 'N/A';
      default: return status;
    }
  };

  // Skeleton components for loading states
  const DomainSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );

  const MilestoneEntrySkeleton = () => (
    <div className="px-6 py-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-6 h-6 bg-gray-200 rounded mt-1"></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
        <div className="ml-4 w-12 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateProgress = (observed: number, suggested: number) => {
    return Math.min((observed / suggested) * 100, 100);
  };

  // Add Skill form handlers
  const handleNextStep = () => {
    if (addSkillForm.step < 6) {
      setAddSkillForm(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrevStep = () => {
    if (addSkillForm.step > 1) {
      setAddSkillForm(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleSave = (saveAndAddAnother = false) => {
    // Validate required fields
    if (!addSkillForm.selectedDomain || !addSkillForm.selectedSkill) {
      showToast('error', 'Please complete all required fields');
      return;
    }

    // Save skill logic would go here
    console.log('Saving skill:', addSkillForm);
    
    showToast('success', 'Skill saved. View it in Journal or the domain page.');
    
    if (!saveAndAddAnother) {
      setShowQuickAddSheet(false);
      // Reset form
      setAddSkillForm({
        step: 1,
        selectedDomain: '',
        selectedSkill: '',
        status: 'observed',
        dateObserved: new Date().toISOString().split('T')[0],
        supports: [],
        context: [],
        notes: ''
      });
      setShowAllSkills(false);
    } else {
      // Reset form but keep domain selection
      setAddSkillForm(prev => ({
        step: 2,
        selectedDomain: prev.selectedDomain,
        selectedSkill: '',
        status: 'observed',
        dateObserved: new Date().toISOString().split('T')[0],
        supports: [],
        context: [],
        notes: ''
      }));
    }
  };

  const handleCancel = () => {
    setShowQuickAddSheet(false);
    // Reset form
    setAddSkillForm({
      step: 1,
      selectedDomain: '',
      selectedSkill: '',
      status: 'observed',
      dateObserved: new Date().toISOString().split('T')[0],
      supports: [],
      context: [],
      notes: ''
    });
    setShowAllSkills(false);
  };

  // Filter skills by domain and age
  const getFilteredSkills = () => {
    const domainSkills = allSkills.filter(skill => skill.domain === addSkillForm.selectedDomain);
    
    if (showAllSkills) {
      return domainSkills;
    }
    
    // Get current age in months for filtering
    const currentAgeMonths = parseInt(chronologicalAge.split(' ')[0]);
    
    // Filter skills within ±1 age band of current age
    const ageBands = ['0-6', '6-12', '12-18', '18-24', '24-30', '30-36', '36-48'];
    const currentAgeBandIndex = ageBands.findIndex(band => {
      const [min, max] = band.split('-').map(Number);
      return currentAgeMonths >= min && currentAgeMonths <= max;
    });
    
    if (currentAgeBandIndex === -1) {
      return domainSkills; // If age not found, show all skills
    }
    
    // Get skills within ±1 band
    const relevantBands: string[] = [];
    if (currentAgeBandIndex > 0) relevantBands.push(ageBands[currentAgeBandIndex - 1]);
    relevantBands.push(ageBands[currentAgeBandIndex]);
    if (currentAgeBandIndex < ageBands.length - 1) relevantBands.push(ageBands[currentAgeBandIndex + 1]);
    
    return domainSkills.filter(skill => relevantBands.includes(skill.ageBand));
  };

  const filteredSkills = getFilteredSkills();
  const suggestedSkills = showAllSkills ? filteredSkills : filteredSkills.slice(0, 10);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasMilestones(true); // Simulate data loading
    }, 1000);
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                  <button
                    onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                  </button>
                <div>
                <h1 className="text-xl font-semibold text-gray-900">Growth & Milestones</h1>
                <p className="text-sm text-gray-600">Track observed skills across domains at your child's pace.</p>
                </div>
              </div>

                        <div className="flex items-center space-x-3">
              {/* Info Icon */}
              <div className="relative group">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                    </button>
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Not a diagnostic tool
                  <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
              </div>

              {/* Secondary Action */}
                  <button
                  onClick={handleOpenReportModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                Generate Milestone Report
                  </button>

              {/* AI Suggestions Button */}
              <button
                onClick={handleOpenAISuggestions}
                className="px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                aria-label="Get AI suggestions for next skills"
              >
                Suggest next skills (AI)
              </button>

              {/* Primary Action */}
                          <button
                onClick={() => setShowQuickAddSheet(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                Add Skill
                          </button>
                  </div>
                  </div>
                </div>
              </div>
              
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-6">
            {/* Age Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label htmlFor="age-selector" className="text-sm font-medium text-gray-700">Age:</label>
              <select
                id="age-selector"
                value={chronologicalAge}
                onChange={(e) => setChronologicalAge(e.target.value)}
                disabled={useDevelopmentalLevel}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                aria-describedby="age-helper"
              >
                {ageOptions.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
              <p id="age-helper" className="text-xs text-gray-500 sm:hidden">
                {useDevelopmentalLevel ? 'Disabled when using developmental level' : 'Chronological age for milestone comparison'}
              </p>
            </div>

            {/* Developmental Level Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="developmental-toggle"
                  checked={useDevelopmentalLevel}
                  onChange={(e) => setUseDevelopmentalLevel(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  aria-describedby="developmental-helper"
                />
                <span className="text-sm font-medium text-gray-700">Use developmental level instead</span>
              </label>
              <p id="developmental-helper" className="text-xs text-gray-500 sm:hidden">
                Switch to developmental milestones for children with different developmental timelines
              </p>
              
              {useDevelopmentalLevel && (
                <select
                  value={developmentalLevel}
                  onChange={(e) => setDevelopmentalLevel(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label="Select developmental level"
                >
                  {developmentalLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Time Scope */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label htmlFor="time-scope" className="text-sm font-medium text-gray-700">Time scope:</label>
              <select
                id="time-scope"
                value={timeScope}
                onChange={(e) => setTimeScope(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {timeScopeOptions.map(scope => (
                  <option key={scope} value={scope}>{scope}</option>
                ))}
              </select>
                        </div>
                        </div>
                        </div>
                      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <>
                {/* Domain Tiles Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <DomainSkeleton key={index} />
                  ))}
                        </div>
                
                {/* Milestones Journal Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                        </div>
                  <div className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <MilestoneEntrySkeleton key={index} />
                    ))}
                        </div>
                      </div>
              </>
            )}

            {/* Empty State */}
            {!isLoading && !hasMilestones && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  {/* Illustration */}
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                        </div>
                      </div>

                  {/* Text */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start tracking your child's development</h3>
                  <p className="text-gray-600 mb-6">
                    Begin by adding a skill you've noticed your child demonstrating. Track their progress across all developmental domains.
                  </p>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => setShowQuickAddSheet(true)}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    aria-label="Add your first skill"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                        </div>
                        </div>
            )}

            {/* Content State */}
            {!isLoading && hasMilestones && (
              <>
                {/* Domain Tiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {domains.map((domain) => {
                    const progress = calculateProgress(domain.observedSkills, domain.suggestedSkills);
                    return (
                      <div
                        key={domain.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleOpenDomain(domain.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenDomain(domain.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ${domain.name} domain details`}
                      >
                        {/* Domain Header */}
                        <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl" aria-hidden="true">{domain.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                          </div>
                          </div>

                        {/* Progress Ring */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                              {/* Background circle */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                              />
                              {/* Progress circle */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeDasharray={`${progress}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                      </div>
                  </div>
                  
                        {/* Progress Text */}
                        <p className="text-sm text-gray-600 text-center mb-3">
                          Observed {domain.observedSkills} of {domain.suggestedSkills} suggested skills
                        </p>

                        {/* Last Skill */}
                        <p className="text-xs text-gray-500 text-center mb-4">
                          {domain.lastSkillName ? (
                            <>Last new skill: {domain.lastSkillName} on {formatDate(domain.lastSkillDate!)}</>
                          ) : (
                            'No skills yet'
                          )}
                        </p>

                        {/* CTA Button */}
                    <button 
                          className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          aria-label={`View ${domain.name} domain details`}
                        >
                          Open
                    </button>
                  </div>
                    );
                  })}
              </div>

                {/* Milestones Journal Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Recent milestone entries</h2>
                  <button
                        onClick={handleViewAllMilestones}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                        aria-label="View all milestone entries"
                      >
                        View all
                          </button>
                    </div>
                        </div>

                  <div className="divide-y divide-gray-200">
                    {milestoneEntries.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-xl mt-1" aria-hidden="true">{entry.domainIcon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {entry.skillName}
                          </h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.status)}`}>
                                  {getStatusLabel(entry.status)}
                            </span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{formatDate(entry.dateObserved)}</span>
                                {entry.context.length > 0 && (
                                  <span>{entry.context.join(', ')}</span>
                                )}
                                <span>by {entry.caregiver}</span>
                              </div>
                            </div>
                          </div>
                            <button
                            onClick={() => handleViewMilestone(entry)}
                            className="ml-4 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label={`View details for ${entry.skillName}`}
                          >
                            View
                            </button>
                          </div>
                        </div>
                    ))}
                      </div>
                              </div>
              </>
            )}
                        </div>
                        
          {/* Right Gutter - Reserved for Care Ideas Panel (5B) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Ideas</h3>
                <p className="text-sm text-gray-600">
                  Personalized care suggestions and activity ideas will appear here in Phase 5B.
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

      {/* Add Skill Quick Sheet */}
      {showQuickAddSheet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:max-h-[90vh] md:rounded-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Skill</h3>
                  <p className="text-sm text-gray-600">Step {addSkillForm.step} of 6</p>
                </div>
                        <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close add skill form"
                        >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                        </button>
                      </div>
                      
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(addSkillForm.step / 6) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={addSkillForm.step}
                  aria-valuemin={1}
                  aria-valuemax={6}
                  aria-label={`Step ${addSkillForm.step} of 6`}
                ></div>
                              </div>
                      </div>
                      
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step Content */}
              <div className="space-y-6">
                {/* Step 1: Choose Domain */}
                {addSkillForm.step === 1 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Choose Domain *</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {domains.map((domain) => (
                        <button
                          key={domain.id}
                          onClick={() => {
                            setAddSkillForm(prev => ({ ...prev, selectedDomain: domain.id }));
                            setShowAllSkills(false); // Reset to age-appropriate view when domain changes
                          }}
                          className={`p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            addSkillForm.selectedDomain === domain.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          aria-pressed={addSkillForm.selectedDomain === domain.id}
                          aria-label={`Select ${domain.name} domain`}
                        >
                          <div className="text-center">
                            <span className="text-2xl block mb-2" aria-hidden="true">{domain.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{domain.name}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

                {/* Step 2: Select Skill */}
                {addSkillForm.step === 2 && (
              <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Select Skill *</h4>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        {showAllSkills 
                          ? `All skills in ${domains.find(d => d.id === addSkillForm.selectedDomain)?.name} domain:`
                          : `Skills for ${chronologicalAge} (±1 age band):`
                        }
                      </div>
                      
                      {/* AI Skill Picker Button */}
                      <div className="flex justify-center mb-4">
                      <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed opacity-60"
                          title="Coming soon"
                        >
                          Use AI to pick skill
                      </button>
                </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {suggestedSkills.map((skill) => (
                          <button
                            key={skill.id}
                            onClick={() => setAddSkillForm(prev => ({ ...prev, selectedSkill: skill.id }))}
                            className={`w-full p-3 rounded-lg border text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              addSkillForm.selectedSkill === skill.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            aria-pressed={addSkillForm.selectedSkill === skill.id}
                            aria-label={`Select skill: ${skill.name}`}
                          >
                            <div className="font-medium text-gray-900">{skill.name}</div>
                            <div className="text-sm text-gray-600">{skill.description}</div>
                            <div className="text-xs text-gray-500 mt-1">Age: {skill.ageRange}</div>
                          </button>
                        ))}
                        </div>
                        
                      {filteredSkills.length > 10 && (
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setShowAllSkills(!showAllSkills)}
                            className="text-indigo-600 text-sm font-medium hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label={showAllSkills 
                              ? `Show age-appropriate skills only (${Math.min(10, filteredSkills.length)} skills)`
                              : `Show all skills in ${domains.find(d => d.id === addSkillForm.selectedDomain)?.name} domain (${filteredSkills.length} skills)`
                            }
                          >
                            {showAllSkills 
                              ? `Show age-appropriate skills only (${Math.min(10, filteredSkills.length)} skills)`
                              : `Show all skills in ${domains.find(d => d.id === addSkillForm.selectedDomain)?.name} domain (${filteredSkills.length} skills)`
                            }
                          </button>
                              </div>
                      )}

                      {suggestedSkills.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No skills found for the selected domain and age range.</p>
                          <button 
                            onClick={() => setShowAllSkills(true)}
                            className="text-indigo-600 text-sm font-medium hover:text-indigo-700 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label="Show all skills in this domain"
                          >
                            Show all skills in this domain
                          </button>
                              </div>
                      )}
                                </div>
                                </div>
                )}

                {/* Step 3: Mark Status */}
                {addSkillForm.step === 3 && (
                              <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Mark Status *</h4>
                    <div className="space-y-3">
                      {[
                        { value: 'observed', label: 'Observed', description: 'Child demonstrates this skill consistently' },
                        { value: 'emerging', label: 'Emerging', description: 'Child shows some signs of this skill' },
                        { value: 'not-yet', label: 'Not yet', description: 'Child has not shown this skill yet' },
                        { value: 'not-applicable', label: 'Not applicable', description: 'This skill is not relevant for this child' }
                      ].map((status) => (
                        <label key={status.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={addSkillForm.status === status.value}
                            onChange={(e) => setAddSkillForm(prev => ({ ...prev, status: e.target.value as any }))}
                            className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            aria-describedby={`status-${status.value}-description`}
                          />
                            <div>
                            <div className="font-medium text-gray-900">{status.label}</div>
                            <div id={`status-${status.value}-description`} className="text-sm text-gray-600">{status.description}</div>
                            </div>
                        </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Date Observed */}
                {addSkillForm.step === 4 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Date Observed *</h4>
                    <div>
                      <label htmlFor="date-observed" className="block text-sm font-medium text-gray-700 mb-2">
                        When did you observe this skill?
                      </label>
                      <input
                        id="date-observed"
                        type="date"
                        value={addSkillForm.dateObserved}
                        onChange={(e) => setAddSkillForm(prev => ({ ...prev, dateObserved: e.target.value }))}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        aria-describedby="date-helper"
                      />
                      <p id="date-helper" className="text-xs text-gray-500 mt-1">Select the date when you observed this skill</p>
                        </div>
                      </div>
                    )}
                    
                {/* Step 5: Supports Used */}
                {addSkillForm.step === 5 && (
                      <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Supports Used (Optional)</h4>
                    <p className="text-sm text-gray-600 mb-4">What supports helped the child demonstrate this skill?</p>
                    <div className="flex flex-wrap gap-2">
                      {supportOptions.map((support) => (
                        <button
                          key={support}
                          onClick={() => {
                            const newSupports = addSkillForm.supports.includes(support)
                              ? addSkillForm.supports.filter(s => s !== support)
                              : [...addSkillForm.supports, support];
                            setAddSkillForm(prev => ({ ...prev, supports: newSupports }));
                          }}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            addSkillForm.supports.includes(support)
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                          aria-pressed={addSkillForm.supports.includes(support)}
                          aria-label={`${addSkillForm.supports.includes(support) ? 'Remove' : 'Add'} ${support} support`}
                        >
                          {support}
                        </button>
                      ))}
                          </div>
                  </div>
                )}

                {/* Step 6: Context and Notes */}
                {addSkillForm.step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Context (Optional)</h4>
                      <p className="text-sm text-gray-600 mb-4">Where did you observe this skill?</p>
                      <div className="flex flex-wrap gap-2">
                        {contextOptions.map((context) => (
                          <button
                            key={context}
                            onClick={() => {
                              const newContext = addSkillForm.context.includes(context)
                                ? addSkillForm.context.filter(c => c !== context)
                                : [...addSkillForm.context, context];
                              setAddSkillForm(prev => ({ ...prev, context: newContext }));
                            }}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              addSkillForm.context.includes(context)
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }`}
                            aria-pressed={addSkillForm.context.includes(context)}
                            aria-label={`${addSkillForm.context.includes(context) ? 'Remove' : 'Add'} ${context} context`}
                          >
                            {context}
                              </button>
                        ))}
                      </div>
                </div>

                    <div>
                      <label htmlFor="skill-notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="skill-notes"
                        value={addSkillForm.notes}
                        onChange={(e) => setAddSkillForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any additional notes about this skill observation..."
                        maxLength={200}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        aria-describedby="notes-counter"
                      />
                      <div id="notes-counter" className="text-xs text-gray-500 mt-1 text-right">
                        {addSkillForm.notes.length}/200
                        </div>
                          </div>
                        </div>
                )}
                  </div>
                </div>

            {/* Sticky Navigation Bar */}
            <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0">
              <div className="flex justify-between">
                    <button
                  onClick={handlePrevStep}
                  disabled={addSkillForm.step === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go to previous step"
                >
                  Previous
                    </button>

                <div className="flex space-x-3">
                  {addSkillForm.step === 6 ? (
                    <>
                    <button
                        onClick={() => handleSave(true)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Save skill and add another"
                    >
                        Save & Add Another
                    </button>
                      <button
                        onClick={() => handleSave(false)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Save skill"
                      >
                        Save
                            </button>
                    </>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      disabled={
                        (addSkillForm.step === 1 && !addSkillForm.selectedDomain) ||
                        (addSkillForm.step === 2 && !addSkillForm.selectedSkill)
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Go to next step"
                    >
                      Next
                            </button>
                  )}
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
              {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Milestone Report (last 30 days)</h3>
                        <button
                  onClick={handleCloseReportModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close report modal"
                        >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                        </button>
                      </div>
                      
              {/* Report Options */}
              <div className="space-y-6">
                {/* Include Domains */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Include domains
                  </label>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <label key={domain.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reportOptions.includeDomains.includes(domain.id)}
                          onChange={() => handleDomainToggle(domain.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-lg" aria-hidden="true">{domain.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{domain.name}</span>
                              </div>
                      </label>
                        ))}
                      </div>
                    </div>

                {/* Include Emerging Skills */}
              <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Include Emerging skills</div>
                      <div className="text-sm text-gray-600">Show skills that are still developing</div>
                      </div>
                    <input
                      type="checkbox"
                      checked={reportOptions.includeEmergingSkills}
                      onChange={(e) => setReportOptions(prev => ({ ...prev, includeEmergingSkills: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>

                {/* Include Notes */}
                          <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Include Notes</div>
                      <div className="text-sm text-gray-600">Include caregiver notes and observations</div>
                          </div>
                    <input
                      type="checkbox"
                      checked={reportOptions.includeNotes}
                      onChange={(e) => setReportOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                          </div>
                  </div>
                  
              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                {!reportReady ? (
                  <>
                    <button
                      onClick={handleCloseReportModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                      <button
                      onClick={handleGeneratePDF}
                      disabled={isGeneratingReport || reportOptions.includeDomains.length === 0}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isGeneratingReport ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate PDF'
                      )}
                      </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveToVisitPacket}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save to Visit Packet
                      </button>
                    <button
                      onClick={handleCloseReportModal}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Download Ready
                      </button>
                  </>
                )}
                    </div>
                    </div>
                  </div>
                </div>
      )}

      {/* Toast */}
      {toast.isVisible && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className={`border rounded-lg p-4 shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {toast.type === 'success' && (
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'info' && (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                    <button
                  onClick={() => setToast(prev => ({ ...prev, isVisible: false }))}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
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

      {/* Milestone Detail Modal */}
      {showMilestoneDetail && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedMilestone.domainIcon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMilestone.skillName}</h3>
                    <p className="text-sm text-gray-600">{domains.find(d => d.id === selectedMilestone.domain)?.name} Domain</p>
              </div>
                </div>
                <button
                  onClick={() => setShowMilestoneDetail(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedMilestone.status)}`}>
                  {getStatusLabel(selectedMilestone.status)}
                </span>
                      </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Date Observed</h4>
                  <p className="text-sm text-gray-600">{formatDate(selectedMilestone.dateObserved)}</p>
                      </div>
                      <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Caregiver</h4>
                  <p className="text-sm text-gray-600">{selectedMilestone.caregiver}</p>
                      </div>
                    </div>
                    
              {/* Context */}
              {selectedMilestone.context.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Context</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.context.map((context) => (
                      <span key={context} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {context}
                      </span>
                    ))}
                      </div>
                    </div>
              )}

              {/* Supports Used */}
              {selectedMilestone.supports.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Supports Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.supports.map((support) => (
                      <span key={support} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        {support}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedMilestone.notes && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedMilestone.notes}
                  </p>
        </div>
      )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowMilestoneDetail(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Close
                </button>
                  <button
                  onClick={() => {
                    setShowMilestoneDetail(false);
                    // This would open edit mode in a real implementation
                    console.log('Edit milestone:', selectedMilestone.id);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Milestone Settings</h3>
                <button
                  onClick={handleCancelSettings}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Settings Form */}
              <div className="space-y-6">
                {/* Default View */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Default View
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="defaultView"
                        value="age-based"
                        checked={milestoneSettings.defaultView === 'age-based'}
                        onChange={(e) => setMilestoneSettings(prev => ({ ...prev, defaultView: e.target.value as 'age-based' | 'developmental-level' }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Age-based</div>
                        <div className="text-sm text-gray-600">Show milestones based on chronological age</div>
                  </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="defaultView"
                        value="developmental-level"
                        checked={milestoneSettings.defaultView === 'developmental-level'}
                        onChange={(e) => setMilestoneSettings(prev => ({ ...prev, defaultView: e.target.value as 'age-based' | 'developmental-level' }))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Developmental level</div>
                        <div className="text-sm text-gray-600">Show milestones based on developmental stage</div>
                            </div>
                    </label>
                          </div>
                </div>

                {/* Show Skills Beyond Level */}
                  <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Show skills beyond current level</div>
                      <div className="text-sm text-gray-600">Display skills that may be emerging or not yet achieved</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={milestoneSettings.showSkillsBeyondLevel}
                      onChange={(e) => setMilestoneSettings(prev => ({ ...prev, showSkillsBeyondLevel: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                  </div>
                  
                {/* Weekly Reminder */}
                  <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Weekly reminder to review milestones</div>
                      <div className="text-sm text-gray-600">Get notified to check your child's progress weekly</div>
                    </div>
                      <input
                      type="checkbox"
                      checked={milestoneSettings.weeklyReminder}
                      onChange={(e) => setMilestoneSettings(prev => ({ ...prev, weeklyReminder: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                    </div>
                  </div>
                  
              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelSettings}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
                  </div>
                </div>
              </div>
        </div>
      )}
              
      {/* Page Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center">
                <button
              onClick={handleOpenSettings}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-3 py-1"
              aria-label="Open milestone settings"
                >
              Milestone settings
                </button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {showAISuggestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Skill Suggestions</h3>
                <button
                  onClick={() => setShowAISuggestionsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close AI suggestions"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Coming soon</h4>
                <p className="text-gray-600 mb-6">
                  We'll use your recent milestones and age/level to propose 3–5 next-step skills.
                </p>
                <button
                  onClick={() => setShowAISuggestionsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domain Detail View */}
      {showDomainDetail && currentDomain && (
        <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleCloseDomainDetail}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    aria-label="Back to milestones overview"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {domains.find(d => d.id === currentDomain)?.name}
                    </h1>
                    <p className="text-sm text-gray-600">Track skills and explore care ideas.</p>
                  </div>
                </div>

                {/* Progress Chip */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="relative w-6 h-6">
                      <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 2 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 2 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray={`${calculateProgress(
                            domains.find(d => d.id === currentDomain)?.observedSkills || 0,
                            domains.find(d => d.id === currentDomain)?.suggestedSkills || 1
                          )}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Observed {domains.find(d => d.id === currentDomain)?.observedSkills} of {domains.find(d => d.id === currentDomain)?.suggestedSkills} suggested skills
                    </span>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setShowQuickAddSheet(true);
                        setAddSkillForm(prev => ({ ...prev, selectedDomain: currentDomain, step: 1 }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Skill
                    </button>
                    <button
                      disabled
                      className="px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed opacity-60"
                      title="Coming soon"
                    >
                      Suggest next skills (AI)
                    </button>
                    <button
                      onClick={() => {
                        setShowReportModal(true);
                        setReportOptions(prev => ({ ...prev, includeDomains: [currentDomain] }));
                      }}
                      className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Export domain report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Detail Content */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl" aria-hidden="true">
                    {domains.find(d => d.id === currentDomain)?.icon}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {domains.find(d => d.id === currentDomain)?.name} Domain Detail
                </h3>
                <p className="text-gray-600 mb-6">
                  This view will contain the skill checklist, care ideas, and progress timeline in Phase 5B.
                </p>
                <button
                  onClick={handleCloseDomainDetail}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthDevelopmentScreen; 