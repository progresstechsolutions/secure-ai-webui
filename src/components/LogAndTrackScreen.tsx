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
  const [showToast, setShowToast] = useState(false);


  const [timeFilter, setTimeFilter] = useState('7');
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [multiSymptomData, setMultiSymptomData] = useState<Array<{
    symptom: string;
    severity: number;
    notes: string;
    startDate: string;
  }>>([]);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [isMultiLogging, setIsMultiLogging] = useState(false);
  const [recentEntries, setRecentEntries] = useState([
    {
      id: 1,
      symptom: 'Headache',
      severity: 4,
      time: '2 hours ago',
      notes: 'Started after lunch, feels like pressure on temples',
      loggedTogether: false
    },
    {
      id: 2,
      symptom: 'Fatigue',
      severity: 3,
      time: 'Yesterday, 3:45 PM',
      notes: 'General tiredness, difficulty concentrating',
      loggedTogether: false
    },
    {
      id: 3,
      symptom: 'Irritability',
      severity: 2,
      time: 'Yesterday, 10:30 AM',
      notes: 'Minor mood changes, easily frustrated',
      loggedTogether: false
    },
    {
      id: 4,
      symptom: 'GI Issue',
      severity: 3,
      time: '2 days ago',
      notes: 'Stomach discomfort after breakfast',
      loggedTogether: false
    }
  ]);



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
    
    // Create new entry with current timestamp
    const currentTime = new Date();
    
    const newEntry = {
      id: Date.now(),
      symptom: selectedSymptom,
      severity: severity,
      time: 'Just now',
      notes: notes,
      startDate: new Date().toISOString().split('T')[0],
      loggedTogether: false
    };
    
    // Add new entry to the top of recent entries
    setRecentEntries(prevEntries => [newEntry, ...prevEntries]);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setCurrentStep(3);
  };

  const handleLogAnotherSymptom = () => {
    // Reset form and go back to step 1
    setSelectedSymptom('');
    setSeverity(3);
    setNotes('');
    setCurrentStep(1);
    setSearchQuery('');
  };

  const handleReturnHome = () => {
    onBack();
    // Reset form
    setSelectedSymptom('');
    setSeverity(3);
    setNotes('');
    setCurrentStep(1);
    setSearchQuery('');
  };



  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setCurrentStep(2);
    // Show quick confirmation toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleMultiSelectSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSelectedSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleKeyPress = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const handleCustomSymptom = () => {
    // For now, just log it - could be expanded to a custom input modal
    console.log('Custom symptom selected');
    setSelectedSymptom('Custom Symptom');
    setCurrentStep(2);
  };

  const handleMultiSymptomLogging = () => {
    // Initialize multi-symptom data with default values
    const initialData = selectedSymptoms.map(symptom => ({
      symptom,
      severity: 3,
      notes: '',
      startDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    }));
    
    setMultiSymptomData(initialData);
    setCurrentSymptomIndex(0);
    setIsMultiLogging(true);
    setCurrentStep(2);
  };

  const handleMultiSymptomNext = () => {
    if (currentSymptomIndex < selectedSymptoms.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
    } else {
      // All symptoms completed, save them
      handleSaveMultiSymptoms();
    }
  };

  const handleMultiSymptomBack = () => {
    if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(currentSymptomIndex - 1);
    }
  };

  const handleSaveMultiSymptoms = () => {
    // Here you would typically save to your backend
    console.log('Saving multiple symptoms:', multiSymptomData);
    
    // Create new entries with current timestamp
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const newEntries = multiSymptomData.map((data, index) => ({
      id: Date.now() + index, // Simple ID generation
      symptom: data.symptom,
      severity: data.severity,
      time: multiSymptomData.length > 1 ? `Logged together at ${timeString}` : 'Just now',
      notes: data.notes,
      startDate: data.startDate,
      loggedTogether: multiSymptomData.length > 1
    }));
    
    // Add new entries to the top of recent entries
    setRecentEntries(prevEntries => [...newEntries, ...prevEntries]);
    
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Reset multi-symptom state
    setSelectedSymptoms([]);
    setMultiSymptomData([]);
    setCurrentSymptomIndex(0);
    setIsMultiLogging(false);
    setSearchQuery('');
    
    // Move to confirmation step
    setCurrentStep(3);
  };

  const updateMultiSymptomData = (field: 'severity' | 'notes' | 'startDate', value: number | string) => {
    const updatedData = [...multiSymptomData];
    updatedData[currentSymptomIndex] = {
      ...updatedData[currentSymptomIndex],
      [field]: value
    };
    setMultiSymptomData(updatedData);
  };

  // Filter symptoms based on search query (flattened list, no categories)
  const filteredSymptoms = Object.values(symptomCategories)
    .flat()
    .filter(symptom => 
      symptom.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                     <div className="flex items-center justify-center">
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
                 <h1 className="text-lg font-semibold text-gray-900">Symptom Tracker</h1>
               </div>
            </div>
            
            
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
                role="progressbar" 
                aria-label={`Step ${currentStep} of 3`} 
                aria-valuenow={currentStep} 
                aria-valuemin={1} 
                aria-valuemax={3}
              />
            </div>
          </div>
        </div>
      </div>

             {/* Main Content Area */}
       <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
         {/* Step 1: Select Symptom */}
         {currentStep === 1 && (
           <div className="space-y-12">

                         <div className="text-center">
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">What symptom would you like to log today?</h2>
             </div>
            
                         {/* Quick Log Section */}
             <div className="space-y-8">
                                             {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                    aria-label="Search for symptoms"
                  />
                </div>

                               {/* Live Search Results */}
                {searchQuery && (
                  <div className="mt-4">
                    {/* Search Results */}
                    {filteredSymptoms.length > 0 ? (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-md">
                        <div className="max-h-64 overflow-y-auto">
                          <div className="p-2">
                            {filteredSymptoms.map((symptom) => (
                              <button
                                key={symptom}
                                onClick={() => handleMultiSelectSymptom(symptom)}
                                onKeyDown={(e) => handleKeyPress(e, () => handleMultiSelectSymptom(symptom))}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 min-h-[40px] ${
                                  selectedSymptoms.includes(symptom)
                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                aria-label={`${selectedSymptoms.includes(symptom) ? 'Remove' : 'Add'} ${symptom}`}
                                tabIndex={0}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{symptom}</span>
                                  {selectedSymptoms.includes(symptom) && (
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* No Results */
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                          <SearchIcon />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">No symptoms found</h4>
                        <p className="text-sm text-gray-500">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}

               {/* Quick Add Chips - Only show when not searching */}
               {!searchQuery && (
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Log</h3>
                   
                   {/* Recently/Most Searched */}
                   <div className="mb-4">
                     <h4 className="text-sm font-medium text-gray-700 mb-3">Your Recent</h4>
                     <div className="flex flex-wrap gap-2">
                       {recentlyLoggedSymptoms.map((symptom) => (
                         <button
                           key={symptom}
                           onClick={() => handleMultiSelectSymptom(symptom)}
                           onKeyDown={(e) => handleKeyPress(e, () => handleMultiSelectSymptom(symptom))}
                           className={`px-4 py-3 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px] ${
                             selectedSymptoms.includes(symptom)
                               ? 'bg-indigo-600 text-white border-indigo-600'
                               : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                           }`}
                           aria-label={`${selectedSymptoms.includes(symptom) ? 'Remove' : 'Add'} ${symptom}`}
                           tabIndex={0}
                         >
                           {symptom}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Popular Searches */}
                   <div className="mb-4">
                     <h4 className="text-sm font-medium text-gray-700 mb-3">Common Today</h4>
                     <div className="flex flex-wrap gap-2">
                       {suggestedSymptoms.slice(0, 4).map((symptom) => (
                         <button
                           key={symptom}
                           onClick={() => handleMultiSelectSymptom(symptom)}
                           onKeyDown={(e) => handleKeyPress(e, () => handleMultiSelectSymptom(symptom))}
                           className={`px-4 py-3 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px] ${
                             selectedSymptoms.includes(symptom)
                               ? 'bg-indigo-600 text-white border-indigo-600'
                               : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                           }`}
                           aria-label={`${selectedSymptoms.includes(symptom) ? 'Remove' : 'Add'} ${symptom}`}
                           tabIndex={0}
                         >
                           {symptom}
                         </button>
                       ))}
                     </div>
                   </div>

                                       {/* More Options */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowAllSymptoms(!showAllSymptoms)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label={showAllSymptoms ? "Hide all symptom categories" : "Show all symptom categories"}
                      >
                        {showAllSymptoms ? "− Hide all symptoms" : "+ Show all symptoms"}
                      </button>
                    </div>

                    {/* Collapsible All Symptoms Section */}
                    {showAllSymptoms && (
                      <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-sm font-medium text-gray-700">All Symptom Categories</h4>
                        {Object.entries(symptomCategories).map(([category, symptoms]) => (
                          <div key={category} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">{category}</h5>
                            <div className="flex flex-wrap gap-2">
                              {symptoms.map((symptom) => (
                                <button
                                  key={symptom}
                                  onClick={() => handleMultiSelectSymptom(symptom)}
                                  onKeyDown={(e) => handleKeyPress(e, () => handleMultiSelectSymptom(symptom))}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[40px] ${
                                    selectedSymptoms.includes(symptom)
                                      ? 'bg-indigo-600 text-white border-indigo-600'
                                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                  }`}
                                  aria-label={`${selectedSymptoms.includes(symptom) ? 'Remove' : 'Add'} ${symptom}`}
                                  tabIndex={0}
                                >
                                  {symptom}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               )}

               {/* Selected Symptoms Summary */}
               {selectedSymptoms.length > 0 && (
                 <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-sm font-medium text-indigo-900">
                       Selected Symptoms ({selectedSymptoms.length})
                     </h4>
                     <button
                       onClick={() => setSelectedSymptoms([])}
                       className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                       aria-label="Clear all selected symptoms"
                     >
                       Clear all
                     </button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {selectedSymptoms.map((symptom) => (
                       <div
                         key={symptom}
                         className="flex items-center space-x-1 px-3 py-1 bg-white text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
                       >
                         <span>{symptom}</span>
                         <button
                           onClick={() => removeSelectedSymptom(symptom)}
                           className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                           aria-label={`Remove ${symptom}`}
                         >
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            

                         {/* Log Selected Symptoms Button */}
             {selectedSymptoms.length > 0 && (
               <div className="pt-4">
                 <button
                   onClick={() => {
                     if (selectedSymptoms.length === 1) {
                       handleSymptomSelect(selectedSymptoms[0]);
                     } else {
                       handleMultiSymptomLogging();
                     }
                   }}
                   className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[48px]"
                   onKeyDown={(e) => handleKeyPress(e, () => {
                     if (selectedSymptoms.length === 1) {
                       handleSymptomSelect(selectedSymptoms[0]);
                     } else {
                       handleMultiSymptomLogging();
                     }
                   })}
                   tabIndex={0}
                   aria-label={`Log ${selectedSymptoms.length} selected symptom${selectedSymptoms.length > 1 ? 's' : ''}`}
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   <span className="font-medium">
                     Log {selectedSymptoms.length} Symptom{selectedSymptoms.length > 1 ? 's' : ''}
                   </span>
                 </button>
               </div>
             )}

             {/* Add Custom Symptom - Always Visible */}
             <div className="pt-4">
               <button
                 onClick={handleCustomSymptom}
                 className="w-full flex items-center justify-center space-x-3 px-6 py-5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[60px]"
                 onKeyDown={(e) => handleKeyPress(e, handleCustomSymptom)}
                 tabIndex={0}
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
           <div className="space-y-12">
            {isMultiLogging ? (
              // Multi-Symptom Logging Flow
              <>
                {/* Multi-Symptom Progress */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                    <span className="text-sm font-medium text-indigo-700">
                      {currentSymptomIndex + 1} of {selectedSymptoms.length}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Describe {multiSymptomData[currentSymptomIndex]?.symptom}
                  </h2>
                  <p className="text-gray-600">Your care team values every detail - take your time</p>
                </div>

                {/* Multi-Symptom Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={currentSymptomIndex === 0 ? () => setCurrentStep(1) : handleMultiSymptomBack}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    aria-label={currentSymptomIndex === 0 ? "Back to symptom selection" : "Previous symptom"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{currentSymptomIndex === 0 ? 'Back' : 'Previous'}</span>
                  </button>

                  <div className="flex space-x-2">
                    {selectedSymptoms.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSymptomIndex
                            ? 'bg-indigo-600'
                            : index < currentSymptomIndex
                            ? 'bg-indigo-300'
                            : 'bg-gray-300'
                        }`}
                        aria-label={`Symptom ${index + 1}${index === currentSymptomIndex ? ' (current)' : ''}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleMultiSymptomNext}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={currentSymptomIndex === selectedSymptoms.length - 1 ? "Save all symptoms" : "Next symptom"}
                  >
                    <span>{currentSymptomIndex === selectedSymptoms.length - 1 ? 'Save All' : 'Next'}</span>
                    {currentSymptomIndex < selectedSymptoms.length - 1 && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            ) : (
              // Single Symptom Flow
              <>
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
              </>
            )}
            
                         {/* Severity Slider */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-8">How severe is it?</h3>
               <div className="space-y-8">
                {/* Slider Track */}
                <div className="relative">
                  <div className="h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded-full transition-all duration-300"
                      style={{ width: `${((isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) / 5) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Slider Handle */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-4 border-indigo-600 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    style={{ left: `${(((isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) - 1) / 4) * 100}%` }}
                    onClick={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        const clickX = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                        const newSeverity = Math.round(percentage * 4) + 1;
                        if (isMultiLogging) {
                          updateMultiSymptomData('severity', newSeverity);
                        } else {
                          setSeverity(newSeverity);
                        }
                      }
                    }}
                    role="slider"
                    aria-label="Symptom severity"
                    aria-valuenow={isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      const currentSeverity = isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity;
                      if (e.key === 'ArrowLeft' && currentSeverity > 1) {
                        const newSeverity = currentSeverity - 1;
                        if (isMultiLogging) {
                          updateMultiSymptomData('severity', newSeverity);
                        } else {
                          setSeverity(newSeverity);
                        }
                      } else if (e.key === 'ArrowRight' && currentSeverity < 5) {
                        const newSeverity = currentSeverity + 1;
                        if (isMultiLogging) {
                          updateMultiSymptomData('severity', newSeverity);
                        } else {
                          setSeverity(newSeverity);
                        }
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
                    ].map(({ level, label, color }) => {
                      const currentSeverity = isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity;
                      return (
                        <button
                          key={level}
                          onClick={() => {
                            if (isMultiLogging) {
                              updateMultiSymptomData('severity', level);
                            } else {
                              setSeverity(level);
                            }
                          }}
                          className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 px-2 py-1 rounded ${
                            currentSeverity === level ? color : 'text-gray-500'
                          } hover:${color} hover:bg-gray-50`}
                          aria-label={`Set severity to ${label}`}
                          aria-pressed={currentSeverity === level}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Current Selection Display */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full">
                    <SeverityIcon level={(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) as 1 | 2 | 3 | 4 | 5} />
                    <span className="font-medium text-indigo-700">
                      {(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) === 1 && 'Very Mild'}
                      {(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) === 2 && 'Mild'}
                      {(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) === 3 && 'Moderate'}
                      {(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) === 4 && 'Severe'}
                      {(isMultiLogging ? multiSymptomData[currentSymptomIndex]?.severity : severity) === 5 && 'Very Severe'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

                         {/* Optional Notes */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-6">Add notes (optional)</h3>
              <textarea
                value={isMultiLogging ? multiSymptomData[currentSymptomIndex]?.notes || '' : notes}
                onChange={(e) => {
                  if (isMultiLogging) {
                    updateMultiSymptomData('notes', e.target.value);
                  } else {
                    setNotes(e.target.value);
                  }
                }}
                placeholder="Describe what you're experiencing..."
                className="w-full p-4 border border-gray-300 rounded-xl resize-none min-h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                style={{ 
                  minHeight: '8rem',
                  height: `${Math.max(8, Math.ceil((isMultiLogging ? multiSymptomData[currentSymptomIndex]?.notes || '' : notes).length / 50))}rem`
                }}
                aria-label="Additional notes about the symptom"
              />
              <p className="text-sm text-gray-500 mt-2">
                (Optional: Add any triggers, context, or observations that might help)
              </p>
            </div>

                         {/* When did this start? */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-6">When did this start?</h3>
               <div className="p-4 bg-gray-50 rounded-xl">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                 <input
                   type="date"
                   value={isMultiLogging ? multiSymptomData[currentSymptomIndex]?.startDate || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                   onChange={(e) => {
                     if (isMultiLogging) {
                       updateMultiSymptomData('startDate', e.target.value);
                     }
                   }}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   aria-label="Select date when symptom started"
                 />
                 <p className="text-sm text-gray-500 mt-2">
                   Defaults to today - adjust if the symptom started on a different date
                 </p>
               </div>
            </div>

                         {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-12">
              {!isMultiLogging && (
                <>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[48px]"
                    aria-label="Go back to symptom selection"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveSymptom}
                    className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[48px]"
                    aria-label="Save symptom log"
                  >
                    Save Symptom
                  </button>
                </>
              )}
            </div>
          </div>
        )}

                 {/* Step 3: Confirmation & Next Steps */}
         {currentStep === 3 && (
           <div className="text-center space-y-12">
            {/* AI/LLM Encouragement/Tip */}
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border-l-4 border-green-400 rounded" role="alert" aria-label="Encouragement message">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 text-sm font-medium">
                  {isMultiLogging 
                    ? `Great job logging ${selectedSymptoms.length} symptoms! Your care team will have a complete picture.`
                    : getConfirmationTip(selectedSymptom)
                  }
                </span>
              </div>
            </div>
            {/* Success Message */}
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center" aria-hidden="true">
                  <SuccessIcon className="text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isMultiLogging ? `${selectedSymptoms.length} Symptoms logged!` : 'Symptom logged!'}
              </h2>
              <p className="text-lg text-gray-600">
                {isMultiLogging 
                  ? `You've successfully logged ${selectedSymptoms.length} symptoms. Your care team will have a complete picture of what's happening.`
                  : "You're helping Jamie's care team stay informed. Every log makes a difference."
                }
              </p>
            </div>

                         {/* Quick Actions */}
             <div className="space-y-6">
              <button
                onClick={handleLogAnotherSymptom}
                                 className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[48px]"
                aria-label="Log another symptom"
              >
                Log Another Symptom
              </button>
              <button
                onClick={handleReturnHome}
                                 className="w-full px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[48px]"
                aria-label="Return to home screen"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </div>

             {/* Recent Entries Section - Always visible below main content */}
       <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
         <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
                     {/* Section Header */}
           <div className="px-6 py-4 border-b border-gray-100">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <span className="text-lg font-semibold text-gray-900">Recent Entries</span>
                 <span className="text-sm text-gray-500">({recentEntries.length} entries)</span>
               </div>
               <div className="relative">
                 <select 
                   value={timeFilter}
                   onChange={(e) => setTimeFilter(e.target.value)}
                                       className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:border-gray-400 transition-colors min-h-[44px]"
                   aria-label="Filter entries by time period"
                 >
                   <option value="7">Past 7 days</option>
                   <option value="30">Past 30 days</option>
                   <option value="180">Past 6 months</option>
                   <option value="365">Past 1 year</option>
                   <option value="custom">Custom</option>
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </div>
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
               <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                     <div className="flex items-center justify-between mb-1">
                       <div className="flex items-center space-x-2">
                         <h5 className="text-sm font-medium text-gray-900">
                           {entry.symptom}
                         </h5>
                         {entry.loggedTogether && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                             Logged together
                           </span>
                         )}
                       </div>
                       <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                         {entry.time}
                       </span>
                     </div>
                     
                     {entry.notes && (
                       <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                         {entry.notes}
                       </p>
                     )}
                     
                     {/* Actions Row */}
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                       <div className="flex items-center space-x-3">
                                                 <span className="text-sm text-gray-700 font-medium">
                          {entry.severity === 1 ? 'Very Mild' :
                           entry.severity === 2 ? 'Mild' :
                           entry.severity === 3 ? 'Moderate' :
                           entry.severity === 4 ? 'Severe' : 'Very Severe'}
                        </span>
                         <div className="flex space-x-1" aria-label={`Severity level ${entry.severity} out of 5`}>
                           {[1, 2, 3, 4, 5].map((level) => (
                             <div
                               key={level}
                               className={`w-1.5 h-1.5 rounded-full ${
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
                       
                                               {/* Action Buttons */}
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 min-h-[32px] min-w-[32px]"
                            aria-label={`Edit ${entry.symptom} entry`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                     </div>
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

       {/* Toast Notification */}
       {showToast && (
         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
           <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <span className="font-medium">
               {currentStep === 2 ? 'Symptom logged successfully!' : 'Symptom selected!'}
             </span>
           </div>
         </div>
       )}
     </div>
   );
 };

export default LogAndTrackScreen; 