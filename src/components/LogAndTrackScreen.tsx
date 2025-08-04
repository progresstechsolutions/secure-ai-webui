import React, { useState } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg className={`w-16 h-16 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SeverityIcon = ({ level }: { level: 1 | 2 | 3 | 4 | 5 }) => {
  const colors = {
    1: 'text-green-500',
    2: 'text-yellow-500', 
    3: 'text-orange-500',
    4: 'text-red-500',
    5: 'text-red-600'
  };
  return <span className={`text-xl ${colors[level]}`}>●</span>;
};

interface LogAndTrackScreenProps {
  onBack: () => void;
}

const LogAndTrackScreen: React.FC<LogAndTrackScreenProps> = ({ onBack }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [timeStarted, setTimeStarted] = useState<'now' | 'earlier' | 'other'>('now');

  // Mock data for recent entries
  const recentEntries = [
    {
      id: 1,
      symptom: 'Headache',
      severity: 4,
      time: '2 hours ago',
      notes: 'Started after lunch, feels like pressure on temples'
    },
    {
      id: 2,
      symptom: 'Fatigue',
      severity: 3,
      time: 'Yesterday, 3:45 PM',
      notes: 'General tiredness, difficulty concentrating'
    },
    {
      id: 3,
      symptom: 'Irritability',
      severity: 2,
      time: 'Yesterday, 10:30 AM',
      notes: 'Minor mood changes, easily frustrated'
    },
    {
      id: 4,
      symptom: 'GI Issue',
      severity: 3,
      time: '2 days ago',
      notes: 'Stomach discomfort after breakfast'
    }
  ];

  // Most frequent symptoms for trend badges
  const frequentSymptoms = [
    { symptom: 'Headache', count: 8, trend: 'up' },
    { symptom: 'Fatigue', count: 6, trend: 'stable' },
    { symptom: 'Irritability', count: 4, trend: 'down' }
  ];

  // AI-suggested symptoms (most common/recent)
  const suggestedSymptoms = [
    'Irritability',
    'Fatigue', 
    'Seizure',
    'GI Issue',
    'Headache',
    'Mood swings'
  ];

  // Recently logged symptoms (for quick access)
  const recentlyLoggedSymptoms = [
    'Headache',
    'Fatigue',
    'Irritability'
  ];

  // Categorized symptoms
  const symptomCategories = {
    'Neurological': [
      'Seizure',
      'Headache',
      'Dizziness',
      'Confusion',
      'Memory issues',
      'Tremors'
    ],
    'Gastrointestinal': [
      'GI Issue',
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Constipation',
      'Bloating',
      'Stomach pain'
    ],
    'Mood & Behavior': [
      'Irritability',
      'Mood swings',
      'Anxiety',
      'Depression',
      'Aggression',
      'Hyperactivity'
    ],
    'Physical': [
      'Fatigue',
      'Fever',
      'Rash',
      'Joint pain',
      'Muscle weakness',
      'Swelling'
    ],
    'Sleep': [
      'Insomnia',
      'Excessive sleepiness',
      'Night terrors',
      'Sleep walking'
    ]
  };

  const handleSaveSymptom = () => {
    // Handle symptom logging logic here
    console.log('Symptom saved:', { selectedSymptom, severity, notes });
    setCurrentStep(3);
  };

  const handleLogAnotherSymptom = () => {
    // Reset form and go back to step 1
    setSelectedSymptom('');
    setSeverity(3);
    setNotes('');
    setCurrentStep(1);
    setSearchQuery('');
    setExpandedCategories([]);
  };

  const handleReturnHome = () => {
    onBack();
    // Reset form
    setSelectedSymptom('');
    setSeverity(3);
    setNotes('');
    setCurrentStep(1);
    setSearchQuery('');
    setExpandedCategories([]);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setCurrentStep(2);
  };

  const handleCustomSymptom = () => {
    // For now, just log it - could be expanded to a custom input modal
    console.log('Custom symptom selected');
    setSelectedSymptom('Custom Symptom');
    setCurrentStep(2);
  };

  // Filter symptoms based on search query
  const filteredCategories = Object.entries(symptomCategories).map(([category, symptoms]) => ({
    category,
    symptoms: symptoms.filter(symptom => 
      symptom.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(({ symptoms }) => symptoms.length > 0);

  // AI/LLM suggestions for Step 1
  const aiSuggestionStep1 = {
    label: 'Common for PMS today',
    symptoms: ['Headache', 'Fatigue'],
    reason: 'Based on recent logs and today’s trends.'
  };

  // AI/LLM suggestions for Step 2
  const aiSevereAlert = severity >= 4;

  // AI/LLM suggestions for Step 3 (confirmation)
  function getConfirmationTip(symptom: string) {
    if (symptom.toLowerCase().includes('fatigue')) {
      return 'Remember to rest and stay hydrated if you’re feeling fatigued.';
    }
    if (symptom.toLowerCase().includes('headache')) {
      return 'Try to rest in a quiet, dark room and drink water.';
    }
    if (symptom.toLowerCase().includes('gi')) {
      return 'Gentle foods and hydration can help with GI issues.';
    }
    if (symptom.toLowerCase().includes('irritability')) {
      return 'Taking a few deep breaths or a short walk may help.';
    }
    return 'Great job keeping track! Small steps make a big difference.';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Persistent Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Go back to previous screen"
              >
                <BackArrowIcon />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Log & Track</h1>
                <p className="text-sm text-gray-600">Jamie's health monitoring - we're here to help you stay informed</p>
              </div>
            </div>
            
            {/* Right side - Child avatar */}
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                aria-label="Jamie's profile picture"
              >
                J
              </div>
              <span className="text-sm font-medium text-gray-900">Jamie</span>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2" role="progressbar" aria-label={`Step ${currentStep} of 3`} aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        step < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: Select Symptom */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* AI/LLM Suggestion Bar */}
            <div className="bg-indigo-50 border-l-4 border-indigo-400 px-4 py-3 rounded flex items-center space-x-3 mb-2" role="alert" aria-label="AI suggestions">
              <span className="font-medium text-indigo-700 text-sm">{aiSuggestionStep1.label}:</span>
              <span className="text-indigo-700 text-sm font-semibold">{aiSuggestionStep1.symptoms.join(', ')}</span>
              <span className="ml-auto text-xs text-indigo-400">{aiSuggestionStep1.reason}</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What symptom would you like to log today?</h2>
              <p className="text-gray-600">Take your time - we're here to help you track what matters most</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search or select a symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                aria-label="Search for symptoms"
              />
            </div>

            {/* AI-Suggested Symptoms */}
            {!searchQuery && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2" aria-hidden="true">🤖</span>
                  AI Suggested
                </h3>
                <div className="flex flex-wrap gap-3">
                  {suggestedSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomSelect(symptom)}
                      className="px-6 py-4 bg-indigo-50 text-indigo-700 rounded-full text-base font-medium hover:bg-indigo-100 hover:scale-105 transition-all duration-200 border border-indigo-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label={`Select ${symptom} symptom`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Logged Symptoms */}
            {!searchQuery && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2" aria-hidden="true">🕒</span>
                  Recently Logged
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recentlyLoggedSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomSelect(symptom)}
                      className="px-6 py-4 bg-gray-50 text-gray-700 rounded-full text-base font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-200 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      aria-label={`Select ${symptom} symptom (recently logged)`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">All Symptoms</h3>
              {filteredCategories.map(({ category, symptoms }) => (
                <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-expanded={expandedCategories.includes(category)}
                    aria-label={`${expandedCategories.includes(category) ? 'Collapse' : 'Expand'} ${category} symptoms`}
                  >
                    <span className="font-semibold text-gray-900 text-lg">{category}</span>
                    <ChevronDownIcon className={`transform transition-transform duration-200 ${
                      expandedCategories.includes(category) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedCategories.includes(category) && (
                    <div className="px-6 pb-6 space-y-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2 pt-4">
                        {symptoms.map((symptom) => (
                          <button
                            key={symptom}
                            onClick={() => handleSymptomSelect(symptom)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:scale-105 transition-all duration-200 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`Select ${symptom} symptom from ${category}`}
                          >
                            {symptom}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Symptom - Always Visible */}
            <div className="pt-4">
              <button
                onClick={handleCustomSymptom}
                className="w-full flex items-center justify-center space-x-3 px-6 py-5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Add a custom symptom not listed above"
              >
                <PlusIcon />
                <span className="font-medium text-lg">Can't find it? Add a custom symptom</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Symptom Details */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* AI/LLM Severe Alert */}
            {aiSevereAlert && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded flex items-center space-x-2 mb-2" role="alert" aria-label="Severe symptom alert">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                </svg>
                <span className="text-yellow-800 text-sm font-medium">Consider notifying your care team if this persists.</span>
              </div>
            )}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Describe {selectedSymptom}</h2>
              <p className="text-gray-600">Your care team values every detail - take your time</p>
            </div>
            
            {/* Severity Slider */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">How severe is it?</h3>
              <div className="space-y-6">
                {/* Slider Track */}
                <div className="relative">
                  <div className="h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full transition-all duration-300"
                      style={{ width: `${(severity / 5) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-indigo-600 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    style={{ left: `${((severity - 1) / 4) * 100}%` }}
                    onClick={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        const clickX = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                        const newSeverity = Math.round(percentage * 4) + 1;
                        setSeverity(newSeverity);
                      }
                    }}
                    role="slider"
                    aria-label="Symptom severity"
                    aria-valuenow={severity}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft' && severity > 1) {
                        setSeverity(severity - 1);
                      } else if (e.key === 'ArrowRight' && severity < 5) {
                        setSeverity(severity + 1);
                      }
                    }}
                  />
                  
                  {/* Severity Labels */}
                  <div className="flex justify-between mt-4">
                    {[
                      { level: 1, label: 'Very Mild', color: 'text-green-600' },
                      { level: 2, label: 'Mild', color: 'text-yellow-600' },
                      { level: 3, label: 'Moderate', color: 'text-orange-600' },
                      { level: 4, label: 'Severe', color: 'text-red-600' },
                      { level: 5, label: 'Very Severe', color: 'text-red-700' }
                    ].map(({ level, label, color }) => (
                      <button
                        key={level}
                        onClick={() => setSeverity(level)}
                        className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          severity === level ? color : 'text-gray-500'
                        } hover:${color}`}
                        aria-label={`Set severity to ${label}`}
                        aria-pressed={severity === level}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Current Selection Display */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full">
                    <SeverityIcon level={severity as 1 | 2 | 3 | 4 | 5} />
                    <span className="font-medium text-indigo-700">
                      {severity === 1 && 'Very Mild'}
                      {severity === 2 && 'Mild'}
                      {severity === 3 && 'Moderate'}
                      {severity === 4 && 'Severe'}
                      {severity === 5 && 'Very Severe'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add notes (optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what you're experiencing..."
                className="w-full p-4 border border-gray-300 rounded-xl resize-none min-h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                style={{ 
                  minHeight: '8rem',
                  height: `${Math.max(8, Math.ceil(notes.length / 50))}rem`
                }}
                aria-label="Additional notes about the symptom"
              />
              <p className="text-sm text-gray-500 mt-2">
                (Optional: Add any triggers, context, or observations that might help)
              </p>
            </div>

            {/* When did this start? */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">When did this start?</h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setTimeStarted('now')}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    timeStarted === 'now'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Symptom started now"
                  aria-pressed={timeStarted === 'now'}
                >
                  Now
                </button>
                <button 
                  onClick={() => setTimeStarted('earlier')}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    timeStarted === 'earlier'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Symptom started earlier today"
                  aria-pressed={timeStarted === 'earlier'}
                >
                  Earlier Today
                </button>
                <button 
                  onClick={() => setTimeStarted('other')}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    timeStarted === 'other'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Symptom started at a different time"
                  aria-pressed={timeStarted === 'other'}
                >
                  Other
                </button>
              </div>
              
              {/* Custom Date/Time Picker for "Other" */}
              {timeStarted === 'other' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        aria-label="Select date when symptom started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={new Date().toTimeString().slice(0, 5)}
                        aria-label="Select time when symptom started"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Go back to symptom selection"
              >
                Back
              </button>
              <button
                onClick={handleSaveSymptom}
                className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Save symptom log"
              >
                Save Symptom
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Next Steps */}
        {currentStep === 3 && (
          <div className="text-center space-y-8">
            {/* AI/LLM Encouragement/Tip */}
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border-l-4 border-green-400 rounded" role="alert" aria-label="Encouragement message">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 text-sm font-medium">{getConfirmationTip(selectedSymptom)}</span>
              </div>
            </div>
            {/* Success Message */}
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center" aria-hidden="true">
                  <SuccessIcon className="text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Symptom logged!</h2>
              <p className="text-lg text-gray-600">You're helping Jamie's care team stay informed. Every log makes a difference.</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <button
                onClick={handleLogAnotherSymptom}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Log another symptom"
              >
                Log Another Symptom
              </button>
              <button
                onClick={handleReturnHome}
                className="w-full px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Return to home screen"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Entries Section - Always visible below main content */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900">Recent Entries</span>
                <span className="text-sm text-gray-500">({recentEntries.length} today)</span>
              </div>
              <button 
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="View all symptom entries"
              >
                See All
              </button>
            </div>
          </div>

          {/* Trend Badges */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Most Frequent This Week</h4>
            <div className="flex flex-wrap gap-2">
              {frequentSymptoms.map(({ symptom, count, trend }) => (
                <div key={symptom} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-full">
                  <span className="text-sm font-medium text-gray-700">{symptom}</span>
                  <span className="text-xs text-gray-500">({count})</span>
                  <span className={`text-xs ${
                    trend === 'up' ? 'text-red-500' : 
                    trend === 'down' ? 'text-green-500' : 'text-gray-500'
                  }`} aria-label={`Trend: ${trend}`}>
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Entries Timeline */}
          <div className="divide-y divide-gray-100">
            {recentEntries.map((entry, index) => (
              <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" tabIndex={0}>
                <div className="flex items-start space-x-3">
                  {/* Severity Indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.severity === 1 ? 'bg-green-500' :
                      entry.severity === 2 ? 'bg-yellow-500' :
                      entry.severity === 3 ? 'bg-orange-500' :
                      entry.severity === 4 ? 'bg-red-500' : 'bg-red-600'
                    }`} aria-label={`Severity level ${entry.severity}`} />
                  </div>
                  
                  {/* Entry Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {entry.symptom}
                      </h5>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {entry.time}
                      </span>
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {entry.notes}
                      </p>
                    )}
                    
                    {/* Severity Label */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">
                        Severity: {
                          entry.severity === 1 ? 'Very Mild' :
                          entry.severity === 2 ? 'Mild' :
                          entry.severity === 3 ? 'Moderate' :
                          entry.severity === 4 ? 'Severe' : 'Very Severe'
                        }
                      </span>
                      <div className="flex space-x-1" aria-label={`Severity level ${entry.severity} out of 5`}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= entry.severity
                                ? (entry.severity === 1 ? 'bg-green-500' :
                                   entry.severity === 2 ? 'bg-yellow-500' :
                                   entry.severity === 3 ? 'bg-orange-500' :
                                   entry.severity === 4 ? 'bg-red-500' : 'bg-red-600')
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Icon */}
                  <div className="flex-shrink-0">
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label={`Edit ${entry.symptom} entry`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {recentEntries.length === 0 && (
            <div className="px-6 py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">No entries yet</h4>
              <p className="text-sm text-gray-500">Start logging symptoms to see your history here - every entry helps your care team</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogAndTrackScreen; 