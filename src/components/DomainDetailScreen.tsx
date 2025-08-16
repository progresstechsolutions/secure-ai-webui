import React, { useState, useEffect } from 'react';

interface DomainDetailScreenProps {
  onBack: () => void;
  domain?: string;
}

interface DomainData {
  id: string;
  name: string;
  icon: string;
  description: string;
  observedSkills: number;
  totalSkills: number;
  subdomains: string[];
  lastNewSkill?: {
    name: string;
    date: string;
  };
}

interface SkillData {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  ageRange: string;
  levelBand: 'Early' | 'Toddler' | 'Preschool' | 'School-age';
  description: string;
  status: 'observed' | 'emerging' | 'not-yet' | 'not-applicable';
  dateObserved?: string;
  supports?: string[];
  isCustom?: boolean;
}

const DomainDetailScreen: React.FC<DomainDetailScreenProps> = ({ onBack, domain }) => {
  
  // State for modals and actions
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // Mobile tab state
  const [activeTab, setActiveTab] = useState<'skills' | 'care-ideas' | 'progress'>('skills');
  
  // Filter state
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'alphabetical' | 'recent'>('recommended');
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showCustomSkillForm, setShowCustomSkillForm] = useState(false);
  const [customSkillForm, setCustomSkillForm] = useState({
    name: '',
    subdomain: '',
    levelBand: ''
  });

  // Sample domain data - in real app this would come from props or API
  const domainData: DomainData = {
    id: domain || 'motor',
    name: domain === 'motor' ? 'Motor' : 
          domain === 'communication' ? 'Communication' :
          domain === 'social-emotional' ? 'Social-Emotional' :
          domain === 'cognitive-play' ? 'Cognitive/Play' :
          domain === 'adaptive-self-help' ? 'Adaptive/Self-Help' : 'Motor',
    icon: domain === 'motor' ? '🏃' :
          domain === 'communication' ? '💬' :
          domain === 'social-emotional' ? '😊' :
          domain === 'cognitive-play' ? '🧩' :
          domain === 'adaptive-self-help' ? '👕' : '🏃',
    description: 'Track skills and explore care ideas.',
    observedSkills: 3,
    totalSkills: 12,
    subdomains: domain === 'motor' ? ['Gross', 'Fine'] :
                domain === 'communication' ? ['Expressive', 'Receptive'] :
                domain === 'social-emotional' ? ['Interaction', 'Regulation'] :
                domain === 'cognitive-play' ? ['Early Play', 'Problem-Solving', 'Pretend'] :
                domain === 'adaptive-self-help' ? ['Feeding', 'Dressing', 'Toileting', 'Hygiene'] :
                ['Gross', 'Fine'],
    lastNewSkill: {
      name: 'Sits briefly without support',
      date: '2024-01-15'
    }
  };

  // Sample skills data with subdomain tags and level bands
  const skillsData: SkillData[] = [
    // Motor skills
    { id: 'm1', name: 'Rolls both ways', domain: 'motor', subdomain: 'Gross', ageRange: '6-9 months', levelBand: 'Early', description: 'Rolls from back to tummy and tummy to back', status: 'observed', dateObserved: '2024-01-15' },
    { id: 'm2', name: 'Sits briefly without support', domain: 'motor', subdomain: 'Gross', ageRange: '6-9 months', levelBand: 'Early', description: 'Sits independently for short periods', status: 'observed', dateObserved: '2024-01-10' },
    { id: 'm3', name: 'Pulls to stand', domain: 'motor', subdomain: 'Gross', ageRange: '9-12 months', levelBand: 'Early', description: 'Pulls up to standing position using furniture', status: 'emerging' },
    { id: 'm4', name: 'Walks with support', domain: 'motor', subdomain: 'Gross', ageRange: '9-12 months', levelBand: 'Early', description: 'Takes steps while holding onto furniture or hands', status: 'not-yet' },
    { id: 'm5', name: 'Pincer grasp', domain: 'motor', subdomain: 'Fine', ageRange: '9-12 months', levelBand: 'Early', description: 'Picks up small objects with thumb and forefinger', status: 'observed', dateObserved: '2024-01-05' },
    { id: 'm6', name: 'Stacks 2 blocks', domain: 'motor', subdomain: 'Fine', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Places one block on top of another', status: 'not-yet' },
    { id: 'm7', name: 'Throws ball forward', domain: 'motor', subdomain: 'Gross', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Throws ball in forward direction', status: 'not-yet' },
    
    // Communication skills
    { id: 'c1', name: 'Babbles with consonants', domain: 'communication', subdomain: 'Expressive', ageRange: '6-9 months', levelBand: 'Early', description: 'Makes consonant sounds like "ba", "da", "ma"', status: 'observed', dateObserved: '2024-01-12' },
    { id: 'c2', name: 'Points to request', domain: 'communication', subdomain: 'Expressive', ageRange: '9-12 months', levelBand: 'Early', description: 'Points to objects to indicate wants', status: 'emerging' },
    { id: 'c3', name: 'Uses 5-10 words', domain: 'communication', subdomain: 'Expressive', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Says recognizable words consistently', status: 'not-yet' },
    { id: 'c4', name: 'Follows 1-step directions', domain: 'communication', subdomain: 'Receptive', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Understands and follows simple commands', status: 'not-yet' },
    { id: 'c5', name: 'Names common objects', domain: 'communication', subdomain: 'Expressive', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Labels familiar objects when asked', status: 'not-yet' },
    { id: 'c6', name: 'Combines 2 words', domain: 'communication', subdomain: 'Expressive', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Uses two-word phrases like "more milk"', status: 'not-yet' },
    
    // Social-Emotional skills
    { id: 's1', name: 'Social smile', domain: 'social-emotional', subdomain: 'Interaction', ageRange: '2-3 months', levelBand: 'Early', description: 'Smiles in response to faces and voices', status: 'observed', dateObserved: '2023-12-20' },
    { id: 's2', name: 'Joint attention', domain: 'social-emotional', subdomain: 'Interaction', ageRange: '6-9 months', levelBand: 'Early', description: 'Looks where you point and shares focus', status: 'emerging' },
    { id: 's3', name: 'Waves bye', domain: 'social-emotional', subdomain: 'Interaction', ageRange: '9-12 months', levelBand: 'Early', description: 'Waves hand in greeting or farewell', status: 'not-yet' },
    { id: 's4', name: 'Brings item to show', domain: 'social-emotional', subdomain: 'Interaction', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Shows objects to others for sharing', status: 'not-yet' },
    { id: 's5', name: 'Parallel play', domain: 'social-emotional', subdomain: 'Interaction', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Plays alongside other children', status: 'not-yet' },
    { id: 's6', name: 'Takes turns briefly', domain: 'social-emotional', subdomain: 'Regulation', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Waits for turn in simple games', status: 'not-yet' },
    
    // Cognitive/Play skills
    { id: 'cp1', name: 'Bangs two objects', domain: 'cognitive-play', subdomain: 'Early Play', ageRange: '6-9 months', levelBand: 'Early', description: 'Bangs objects together to make sound', status: 'observed', dateObserved: '2024-01-08' },
    { id: 'cp2', name: 'Puts objects in/out', domain: 'cognitive-play', subdomain: 'Early Play', ageRange: '9-12 months', levelBand: 'Early', description: 'Places objects in containers and removes them', status: 'emerging' },
    { id: 'cp3', name: 'Cause-and-effect toy play', domain: 'cognitive-play', subdomain: 'Problem-Solving', ageRange: '9-12 months', levelBand: 'Early', description: 'Understands that actions produce results', status: 'not-yet' },
    { id: 'cp4', name: 'Matches shapes', domain: 'cognitive-play', subdomain: 'Problem-Solving', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Fits shapes into matching holes', status: 'not-yet' },
    { id: 'cp5', name: 'Completes 3-piece puzzle', domain: 'cognitive-play', subdomain: 'Problem-Solving', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Assembles simple puzzle pieces', status: 'not-yet' },
    { id: 'cp6', name: 'Pretend feeds doll', domain: 'cognitive-play', subdomain: 'Pretend', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Engages in pretend play with dolls', status: 'not-yet' },
    
    // Adaptive/Self-Help skills
    { id: 'a1', name: 'Finger feeds', domain: 'adaptive-self-help', subdomain: 'Feeding', ageRange: '6-9 months', levelBand: 'Early', description: 'Picks up and eats finger foods', status: 'observed', dateObserved: '2024-01-03' },
    { id: 'a2', name: 'Drinks from open cup with help', domain: 'adaptive-self-help', subdomain: 'Feeding', ageRange: '6-9 months', levelBand: 'Early', description: 'Drinks from cup with assistance', status: 'emerging' },
    { id: 'a3', name: 'Uses spoon with some spills', domain: 'adaptive-self-help', subdomain: 'Feeding', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Attempts to feed self with spoon', status: 'not-yet' },
    { id: 'a4', name: 'Removes socks', domain: 'adaptive-self-help', subdomain: 'Dressing', ageRange: '12-18 months', levelBand: 'Toddler', description: 'Takes off socks independently', status: 'not-yet' },
    { id: 'a5', name: 'Helps with dressing', domain: 'adaptive-self-help', subdomain: 'Dressing', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Participates in dressing activities', status: 'not-yet' },
    { id: 'a6', name: 'Indicates wet/soiled diaper', domain: 'adaptive-self-help', subdomain: 'Toileting', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Shows awareness of toileting needs', status: 'not-yet' },
    { id: 'a7', name: 'Sits on toilet with support', domain: 'adaptive-self-help', subdomain: 'Toileting', ageRange: '24-30 months', levelBand: 'Toddler', description: 'Sits on potty chair or toilet', status: 'not-yet' },
    { id: 'a8', name: 'Washes hands with help', domain: 'adaptive-self-help', subdomain: 'Hygiene', ageRange: '18-24 months', levelBand: 'Toddler', description: 'Participates in hand washing', status: 'not-yet' }
  ];

  // Helper functions for filtering and sorting
  const getLevelBand = (ageRange: string): 'Early' | 'Toddler' | 'Preschool' | 'School-age' => {
    const months = parseInt(ageRange.split('-')[0]);
    if (months < 12) return 'Early';
    if (months < 36) return 'Toddler';
    if (months < 60) return 'Preschool';
    return 'School-age';
  };

  const getCurrentLevel = (): 'Early' | 'Toddler' | 'Preschool' | 'School-age' => {
    // In a real app, this would come from user profile
    return 'Early'; // Default for demo
  };

  const getNextLevel = (current: string): string => {
    const levels = ['Early', 'Toddler', 'Preschool', 'School-age'];
    const currentIndex = levels.indexOf(current);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current;
  };

  const getPreviousLevel = (current: string): string => {
    const levels = ['Early', 'Toddler', 'Preschool', 'School-age'];
    const currentIndex = levels.indexOf(current);
    return currentIndex > 0 ? levels[currentIndex - 1] : current;
  };

  // Filter skills by current domain and all filters
  const filteredSkills = skillsData.filter(skill => {
    const domainMatch = skill.domain === domainData.id;
    const subdomainMatch = selectedSubdomain === 'all' || skill.subdomain === selectedSubdomain;
    const levelMatch = selectedLevel === 'all' || skill.levelBand === selectedLevel;
    const statusMatch = selectedStatus === 'all' || skill.status === selectedStatus;
    const searchMatch = !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return domainMatch && subdomainMatch && levelMatch && statusMatch && searchMatch;
  });

  // Sort skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'recent':
        return (b.dateObserved || '').localeCompare(a.dateObserved || '');
      case 'recommended':
      default:
        // Sort by level band priority, then by status
        const levelOrder = ['Early', 'Toddler', 'Preschool', 'School-age'];
        const levelDiff = levelOrder.indexOf(a.levelBand) - levelOrder.indexOf(b.levelBand);
        if (levelDiff !== 0) return levelDiff;
        
        const statusOrder = ['observed', 'emerging', 'not-yet', 'not-applicable'];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    }
  });

  // Group skills by level
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel(currentLevel);
  const previousLevel = getPreviousLevel(currentLevel);

  const suggestedSkills = sortedSkills.filter(skill => skill.levelBand === currentLevel);
  const stretchSkills = sortedSkills.filter(skill => skill.levelBand === nextLevel);
  const foundationSkills = sortedSkills.filter(skill => skill.levelBand === previousLevel);

  const progressPercentage = Math.round((domainData.observedSkills / domainData.totalSkills) * 100);

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

  const handleSkillStatusChange = (skillId: string, newStatus: string) => {
    // In a real app, this would update the skill status in the database
    showToast(`Updated ${skillsData.find(s => s.id === skillId)?.name} status to ${getStatusLabel(newStatus)}`, 'success');
  };

  const handleBulkSelect = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedSkills.length === 0) {
      showToast('Please select skills first', 'error');
      return;
    }
    showToast(`${action} applied to ${selectedSkills.length} skills`, 'success');
    setSelectedSkills([]);
    setBulkSelectMode(false);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillForm.name || !customSkillForm.subdomain || !customSkillForm.levelBand) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    showToast('Custom skill added successfully', 'success');
    setCustomSkillForm({ name: '', subdomain: '', levelBand: '' });
    setShowCustomSkillForm(false);
  };

  // Component for rendering individual skill rows
  const SkillRow = ({ skill }: { skill: SkillData }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showSupports, setShowSupports] = useState(false);

    return (
      <div className={`flex items-center justify-between p-3 bg-white rounded-lg border ${selectedSkills.includes(skill.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
        {/* Left side - Skill info */}
        <div className="flex items-center space-x-3 flex-1">
          {bulkSelectMode && (
            <input
              type="checkbox"
              checked={selectedSkills.includes(skill.id)}
              onChange={() => handleBulkSelect(skill.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{skill.name}</h3>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                    {skill.description}
                  </div>
                )}
              </button>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {skill.subdomain}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {skill.levelBand}
              </span>
            </div>
            <p className="text-sm text-gray-600">{skill.ageRange}</p>
            {skill.dateObserved && (
              <p className="text-xs text-green-600">Observed: {new Date(skill.dateObserved).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Right side - Status and actions */}
        <div className="flex items-center space-x-3">
          {/* Status radio buttons */}
          <div className="flex items-center space-x-2">
            {(['observed', 'emerging', 'not-yet', 'not-applicable'] as const).map(status => (
              <label key={status} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name={`status-${skill.id}`}
                  value={status}
                  checked={skill.status === status}
                  onChange={() => handleSkillStatusChange(skill.id, status)}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">{getStatusLabel(status)}</span>
              </label>
            ))}
          </div>

          {/* Supports link */}
          <button
            onClick={() => setShowSupports(!showSupports)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Supports
          </button>

          {/* Overflow menu */}
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Supports popover */}
        {showSupports && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-48">
            <h4 className="font-medium text-gray-900 mb-2">Supports used</h4>
            <div className="space-y-2">
              {['Hand-over-hand', 'Prompts', 'AAC', 'Orthotics', 'Adaptive utensil'].map(support => (
                <label key={support} className="flex items-center space-x-2">
                  <input type="checkbox" className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">{support}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleAddSkill = () => {
    setShowAddSkillModal(true);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="mr-2 text-2xl">{domainData.icon}</span>
                {domainData.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{domainData.description}</p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Progress chip */}
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-blue-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - progressPercentage / 100)}`}
                    className="text-blue-600 transition-all duration-300"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-700">
                  {progressPercentage}%
                </span>
              </div>
              <span className="text-sm font-medium text-blue-700">
                {domainData.observedSkills} of {domainData.totalSkills} skills
              </span>
            </div>

            {/* AI Suggestions button */}
            <button
              disabled
              className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
              title="Coming soon"
            >
              Suggest next skills (AI)
            </button>

            {/* Export button */}
            <button
              onClick={handleExportReport}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Export domain report
            </button>

            {/* Add Skill button */}
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>

             {/* Mobile Tab Navigation */}
       <div className="lg:hidden border-b border-gray-200">
         <div className="flex">
           <button
             onClick={() => setActiveTab('skills')}
             className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === 'skills'
                 ? 'border-blue-500 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
           >
             Skills
           </button>
           <button
             onClick={() => setActiveTab('care-ideas')}
             className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === 'care-ideas'
                 ? 'border-blue-500 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
           >
             Care Ideas
           </button>
           <button
             onClick={() => setActiveTab('progress')}
             className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
               activeTab === 'progress'
                 ? 'border-blue-500 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700'
             }`}
           >
             Progress
           </button>
         </div>
       </div>

       {/* Main content */}
       <div className="flex flex-col lg:flex-row min-h-0">
         {/* Left column - Skills Checklist (70% on desktop) */}
         <div className="flex-1 lg:w-[70%] lg:pr-6">
                       {/* Mobile Skills Tab */}
            <div className={`lg:block ${activeTab === 'skills' ? 'block' : 'hidden'}`}>
              <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Skills Checklist</h2>
                  <p className="text-gray-600 mb-6">
                    Track observed skills in the {domainData.name} domain. 
                    Mark skills as observed, emerging, or not yet demonstrated.
                  </p>
                  
                  {/* Top Bar - Search and Filters */}
                  <div className="mb-6 space-y-4">
                    {/* Search */}
                    <div>
                      <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Level Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                        <select
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All levels</option>
                          <option value="Early">Early (0-12m)</option>
                          <option value="Toddler">Toddler (12-36m)</option>
                          <option value="Preschool">Preschool (3-5y)</option>
                          <option value="School-age">School-age (5+)</option>
                        </select>
                      </div>

                      {/* Subdomain Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                        <select
                          value={selectedSubdomain}
                          onChange={(e) => setSelectedSubdomain(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All subdomains</option>
                          {domainData.subdomains.map(subdomain => (
                            <option key={subdomain} value={subdomain}>{subdomain}</option>
                          ))}
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All statuses</option>
                          <option value="observed">Observed</option>
                          <option value="emerging">Emerging</option>
                          <option value="not-yet">Not yet</option>
                          <option value="not-applicable">N/A</option>
                        </select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="recommended">Recommended</option>
                          <option value="alphabetical">A-Z</option>
                          <option value="recent">Recently updated</option>
                        </select>
                      </div>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setBulkSelectMode(!bulkSelectMode)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                          bulkSelectMode
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {bulkSelectMode ? 'Cancel' : 'Bulk Select'}
                      </button>

                      {bulkSelectMode && selectedSkills.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{selectedSkills.length} selected</span>
                          <button
                            onClick={() => handleBulkAction('Mark as Observed')}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                          >
                            Mark Observed
                          </button>
                          <button
                            onClick={() => handleBulkAction('Add to Visit Packet')}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Add to Packet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Skills List - Grouped by Level */}
                  <div className="space-y-6">
                    {/* Suggested Now */}
                    {suggestedSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Suggested now ({suggestedSkills.length})
                        </h3>
                        <div className="space-y-3">
                          {suggestedSkills.map(skill => (
                            <SkillRow key={skill.id} skill={skill} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stretch Next */}
                    {stretchSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          Stretch next ({stretchSkills.length})
                        </h3>
                        <div className="space-y-3">
                          {stretchSkills.map(skill => (
                            <SkillRow key={skill.id} skill={skill} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Foundations */}
                    {foundationSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Foundations ({foundationSkills.length})
                        </h3>
                        <div className="space-y-3">
                          {foundationSkills.map(skill => (
                            <SkillRow key={skill.id} skill={skill} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {sortedSkills.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No skills found for the selected filters.</p>
                      </div>
                    )}

                    {/* Add Custom Skill */}
                    <div className="border-t pt-4">
                      {showCustomSkillForm ? (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <h4 className="font-medium text-gray-900">Add Custom Skill</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Skill name"
                              value={customSkillForm.name}
                              onChange={(e) => setCustomSkillForm(prev => ({ ...prev, name: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                              value={customSkillForm.subdomain}
                              onChange={(e) => setCustomSkillForm(prev => ({ ...prev, subdomain: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select subdomain</option>
                              {domainData.subdomains.map(subdomain => (
                                <option key={subdomain} value={subdomain}>{subdomain}</option>
                              ))}
                            </select>
                            <select
                              value={customSkillForm.levelBand}
                              onChange={(e) => setCustomSkillForm(prev => ({ ...prev, levelBand: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select level</option>
                              <option value="Early">Early (0-12m)</option>
                              <option value="Toddler">Toddler (12-36m)</option>
                              <option value="Preschool">Preschool (3-5y)</option>
                              <option value="School-age">School-age (5+)</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowCustomSkillForm(false)}
                              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddCustomSkill}
                              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomSkillForm(true)}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                        >
                          + Add custom skill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

           {/* Mobile Care Ideas Tab */}
           <div className={`lg:hidden ${activeTab === 'care-ideas' ? 'block' : 'hidden'}`}>
             <div className="p-6">
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-lg font-medium text-gray-900 mb-4">Care Ideas</h2>
                 <p className="text-gray-600 mb-6">
                   Personalized suggestions to support {domainData.name} development.
                 </p>
                 
                 {/* Placeholder for care ideas */}
                 <div className="space-y-4">
                   <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                     <h3 className="font-medium text-blue-900 mb-2">Practice sitting balance</h3>
                     <p className="text-sm text-blue-700 mb-3">
                       Place toys just out of reach to encourage reaching and balance.
                     </p>
                     <div className="flex items-center justify-between">
                       <span className="text-xs text-blue-600">Daily activity</span>
                       <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                         Mark complete
                       </button>
                     </div>
                   </div>
                   
                   <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                     <h3 className="font-medium text-green-900 mb-2">Tummy time with toys</h3>
                     <p className="text-sm text-green-700 mb-3">
                       Encourage reaching and rolling with colorful toys.
                     </p>
                     <div className="flex items-center justify-between">
                       <span className="text-xs text-green-600">3x per day</span>
                       <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                         Mark complete
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Mobile Progress Tab */}
           <div className={`lg:hidden ${activeTab === 'progress' ? 'block' : 'hidden'}`}>
             <div className="p-6">
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-lg font-medium text-gray-900 mb-4">Progress Timeline</h2>
                 <p className="text-gray-600 mb-6">
                   Track {domainData.name} development over time.
                 </p>
                 
                 {/* Placeholder for progress timeline */}
                 <div className="space-y-4">
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                     <div className="flex-1">
                       <h3 className="font-medium text-gray-900">Rolls both ways</h3>
                       <p className="text-sm text-gray-600">Observed on Jan 15, 2024</p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                     <div className="flex-1">
                       <h3 className="font-medium text-gray-900">Sits briefly without support</h3>
                       <p className="text-sm text-gray-600">Observed on Jan 10, 2024</p>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                     <div className="flex-1">
                       <h3 className="font-medium text-gray-900">Pulls to stand</h3>
                       <p className="text-sm text-gray-600">Emerging - first noticed Jan 20, 2024</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Right column - Care Ideas panel (30% on desktop, sticky) */}
         <div className="hidden lg:block lg:w-[30%]">
           <div className="sticky top-0 p-6">
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h2 className="text-lg font-medium text-gray-900 mb-4">Care Ideas</h2>
               <p className="text-gray-600 mb-6">
                 Personalized suggestions to support {domainData.name} development.
               </p>
               
               {/* Placeholder for care ideas */}
               <div className="space-y-4">
                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                   <h3 className="font-medium text-blue-900 mb-2">Practice sitting balance</h3>
                   <p className="text-sm text-blue-700 mb-3">
                     Place toys just out of reach to encourage reaching and balance.
                   </p>
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-blue-600">Daily activity</span>
                     <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                       Mark complete
                     </button>
                   </div>
                 </div>
                 
                 <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                   <h3 className="font-medium text-green-900 mb-2">Tummy time with toys</h3>
                   <p className="text-sm text-green-700 mb-3">
                     Encourage reaching and rolling with colorful toys.
                   </p>
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-green-600">3x per day</span>
                     <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                       Mark complete
                     </button>
                   </div>
                 </div>
                 
                 <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                   <h3 className="font-medium text-purple-900 mb-2">Standing practice</h3>
                   <p className="text-sm text-purple-700 mb-3">
                     Support under arms while standing at furniture.
                   </p>
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-purple-600">2x per day</span>
                     <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                       Mark complete
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-green-500 text-white' :
            toastType === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Placeholder modals */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Skill to {domainData.name}</h3>
                <button
                  onClick={() => setShowAddSkillModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                This would open the same quick-add sheet from Phase 5A, pre-filtered to the {domainData.name} domain.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddSkillModal(false);
                    showToast('Skill added successfully!', 'success');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export {domainData.name} Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                This would open an export modal with the {domainData.name} domain pre-selected.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    showToast('Report exported successfully!', 'success');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainDetailScreen;
