import React, { useState, useEffect } from 'react';
import QuickLog from './QuickLog';
import Journal from './Journal';

// Icon components
const SymptomIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const NutritionIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const MedicationIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface TrackersDashboardProps {
  onNavigateToSymptomTracker: () => void;
  onNavigateToNutritionTracker: () => void;
  onNavigateToMedicationTracker: () => void;
  onBack: () => void;
}

const TrackersDashboard: React.FC<TrackersDashboardProps> = ({
  onNavigateToSymptomTracker,
  onNavigateToNutritionTracker,
  onNavigateToMedicationTracker,
  onBack
}) => {
  // State for segmented control - remember last choice per user
  const [activeSegment, setActiveSegment] = useState<'quickLog' | 'journal'>('quickLog');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Load last choice from localStorage on component mount
  useEffect(() => {
    const savedSegment = localStorage.getItem('logTrackSegment');
    if (savedSegment === 'journal' || savedSegment === 'quickLog') {
      setActiveSegment(savedSegment);
    }
  }, []);

  // Save choice to localStorage when it changes
  const handleSegmentChange = (segment: 'quickLog' | 'journal') => {
    setActiveSegment(segment);
    localStorage.setItem('logTrackSegment', segment);
  };

  // Handle QuickLog save
  const handleQuickLogSave = (data: any) => {
    console.log('QuickLog saved:', data);
    // TODO: Implement actual save logic
  };

  // Handle QuickLog cancel
  const handleQuickLogCancel = () => {
    // Stay on the same segment, just close the QuickLog form
    console.log('QuickLog cancelled');
  };

  // Help tips data
  const helpTips = [
    {
      id: 1,
      title: 'Pin your most-used tiles',
      description: 'Customize your dashboard by pinning the trackers you use most frequently for quick access.'
    },
    {
      id: 2,
      title: 'Use voice notes or photos',
      description: 'Coming soon! You\'ll be able to record voice notes or take photos to capture symptoms and observations faster.',
      comingSoon: true
    },
    {
      id: 3,
      title: 'Save drafts if you\'re interrupted',
      description: 'Don\'t lose your progress - save drafts and come back to complete your entries later.'
    }
  ];
  const trackers = [
    {
      id: 'symptom',
      title: 'Symptom Tracker',
      description: 'Log and monitor symptoms, track patterns, and get insights',
      icon: <SymptomIcon />,
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      onClick: onNavigateToSymptomTracker
    },
    {
      id: 'nutrition',
      title: 'Nutrition Tracker',
      description: 'Plan meals, track nutrition, and manage dietary needs',
      icon: <NutritionIcon />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      onClick: onNavigateToNutritionTracker
    },
    {
      id: 'medication',
      title: 'Medication Tracker',
      description: 'Track medications, set reminders, and monitor adherence',
      icon: <MedicationIcon />,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      onClick: onNavigateToMedicationTracker
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Log & Track</h1>
            <p className="text-sm text-gray-600">Capture today's care in seconds.</p>
          </div>
          
                     {/* Right Actions - Desktop */}
           <div className="hidden sm:flex items-center space-x-3">
             <button
               onClick={onNavigateToSymptomTracker}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               aria-label="Quick log a symptom"
             >
               Quick Log
             </button>
             <button
               onClick={() => {
                 if (activeSegment === 'journal') {
                   // TODO: Trigger export in Journal component
                   console.log('Export from Journal via header button');
                 } else {
                   // Switch to Journal segment and then export
                   handleSegmentChange('journal');
                 }
               }}
               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
               aria-label="Export data"
             >
               Export
             </button>
             
             {/* Help Button */}
             <button
               onClick={() => setShowHelpModal(true)}
               className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative group"
               aria-label="Tips for logging faster"
               title="Tips for logging faster"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               
               {/* Tooltip */}
               <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                 Tips for logging faster
                 <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
               </div>
             </button>
           </div>
           
           {/* Mobile Overflow Menu */}
           <div className="sm:hidden">
             <button
               onClick={() => {
                 // TODO: Implement mobile overflow menu
                 console.log('Mobile overflow menu - to be implemented');
               }}
               className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               aria-label="More options"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
               </svg>
             </button>
           </div>
        </div>
             </header>

       {/* Segmented Control */}
       <div className="bg-white border-b border-gray-200 px-4 py-3">
         <div className="max-w-md mx-auto">
           <div className="bg-gray-100 rounded-lg p-1 flex">
             <button
               onClick={() => handleSegmentChange('quickLog')}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                 activeSegment === 'quickLog'
                   ? 'bg-white text-indigo-700 shadow-sm'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
               aria-label="Quick Log segment"
               aria-pressed={activeSegment === 'quickLog'}
             >
               Quick Log
             </button>
             <button
               onClick={() => handleSegmentChange('journal')}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                 activeSegment === 'journal'
                   ? 'bg-white text-indigo-700 shadow-sm'
                   : 'text-gray-600 hover:text-gray-900'
               }`}
               aria-label="Journal segment"
               aria-pressed={activeSegment === 'journal'}
             >
               Journal
             </button>
           </div>
         </div>
       </div>

               {/* Main Content */}
        {activeSegment === 'quickLog' ? (
          <QuickLog 
            onSave={handleQuickLogSave}
            onCancel={handleQuickLogCancel}
          />
        ) : (
          <Journal onExport={() => {
            // TODO: Handle export from Journal
            console.log('Export from Journal');
          }} />
        )}

       {/* Help Modal */}
       {showHelpModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <h2 className="text-lg font-semibold text-gray-900">Tips for logging faster</h2>
               <button
                 onClick={() => setShowHelpModal(false)}
                 className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                 aria-label="Close help modal"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             {/* Modal Content */}
             <div className="p-6">
               <div className="space-y-6">
                 {helpTips.map((tip) => (
                   <div key={tip.id} className="flex items-start space-x-3">
                     {/* Tip Number */}
                     <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                       <span className="text-sm font-semibold text-indigo-700">{tip.id}</span>
                     </div>
                     
                     {/* Tip Content */}
                     <div className="flex-1">
                       <h3 className="text-sm font-medium text-gray-900 mb-1">
                         {tip.title}
                         {tip.comingSoon && (
                           <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                             Coming soon
                           </span>
                         )}
                       </h3>
                       <p className="text-sm text-gray-600">{tip.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Modal Footer */}
             <div className="flex justify-end p-6 border-t border-gray-200">
               <button
                 onClick={() => setShowHelpModal(false)}
                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               >
                 Got it
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default TrackersDashboard; 