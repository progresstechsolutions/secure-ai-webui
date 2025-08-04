import React, { useState } from 'react';

// Icon components (matching the style from HomeDashboard)
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

const SymptomIcon = () => <span className="text-2xl">🏥</span>;
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

interface LogSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogSymptomModal: React.FC<LogSymptomModalProps> = ({ isOpen, onClose }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Suggested symptoms (most common/recent)
  const suggestedSymptoms = [
    'Irritability',
    'Fatigue', 
    'Seizure',
    'GI Issue',
    'Headache',
    'Mood swings'
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

  const handleSubmit = () => {
    // Handle symptom logging logic here
    console.log('Symptom logged:', { selectedSymptom, severity, notes });
    onClose();
    // Reset form
    setSelectedSymptom('');
    setSeverity(3);
    setNotes('');
    setCurrentStep(1);
    setSearchQuery('');
    setExpandedCategories([]);
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
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BackArrowIcon />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Log Symptom for Jamie</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
                     {/* Step Indicator */}
           <div className="flex items-center justify-center mb-6">
             <div className="flex items-center space-x-2">
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

          {/* Step 1: Select Symptom */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What symptom would you like to log today?</h3>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search or select a symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Suggested Symptoms */}
              {!searchQuery && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested</h4>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {suggestedSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomSelect(symptom)}
                        className="flex-shrink-0 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Symptom List */}
              <div className="space-y-4">
                {filteredCategories.map(({ category, symptoms }) => (
                  <div key={category} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{category}</span>
                      <ChevronDownIcon className={`transform transition-transform ${
                        expandedCategories.includes(category) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedCategories.includes(category) && (
                      <div className="px-4 pb-3 space-y-2">
                        {symptoms.map((symptom) => (
                          <button
                            key={symptom}
                            onClick={() => handleSymptomSelect(symptom)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
                          >
                            {symptom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Symptom */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCustomSymptom}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <PlusIcon />
                  <span className="font-medium">Can't find it? Add a custom symptom</span>
                </button>
              </div>
            </div>
          )}

                     {/* Step 2: Symptom Details */}
           {currentStep === 2 && (
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-6">Describe {selectedSymptom}</h3>
               
               {/* Severity Selector */}
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-gray-700 mb-3">How severe is it?</h4>
                 <div className="flex justify-between items-center">
                   {[1, 2, 3, 4, 5].map((level) => (
                     <button
                       key={level}
                       onClick={() => setSeverity(level)}
                       className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${
                         severity === level
                           ? 'bg-indigo-50 border-2 border-indigo-500'
                           : 'hover:bg-gray-50 border-2 border-transparent'
                       }`}
                     >
                       <SeverityIcon level={level as 1 | 2 | 3 | 4 | 5} />
                       <span className="text-xs text-gray-600">
                         {level === 1 && 'Very Mild'}
                         {level === 2 && 'Mild'}
                         {level === 3 && 'Moderate'}
                         {level === 4 && 'Severe'}
                         {level === 5 && 'Very Severe'}
                       </span>
                     </button>
                   ))}
                 </div>
               </div>

               {/* Optional Notes */}
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-gray-700 mb-3">Add notes (optional)</h4>
                 <textarea
                   value={notes}
                   onChange={(e) => setNotes(e.target.value)}
                   placeholder="Describe what you're experiencing, any triggers, or additional details..."
                   className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                 />
               </div>

               {/* Date/Time Picker */}
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-gray-700 mb-3">When did this start?</h4>
                 <div className="flex space-x-3">
                   <button className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                     Now
                   </button>
                   <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                     Earlier Today
                   </button>
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="flex space-x-3">
                 <button
                   onClick={() => setCurrentStep(1)}
                   className="btn-secondary flex-1"
                 >
                   Back
                 </button>
                 <button
                   onClick={handleSaveSymptom}
                   className="btn-primary flex-1"
                 >
                   Save Symptom
                 </button>
               </div>
                          </div>
           )}

           {/* Step 3: Confirmation & Next Steps */}
           {currentStep === 3 && (
             <div className="text-center">
               {/* Success Message */}
               <div className="mb-8">
                 <div className="flex justify-center mb-4">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                     <SuccessIcon className="text-green-600" />
                   </div>
                 </div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Symptom logged!</h3>
                 <p className="text-gray-600">You're helping Jamie's care team stay informed.</p>
               </div>

               {/* Quick Actions */}
               <div className="space-y-3">
                 <button
                   onClick={handleLogAnotherSymptom}
                   className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                 >
                   Log Another Symptom
                 </button>
                 <button
                   onClick={handleReturnHome}
                   className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                 >
                   Return Home
                 </button>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 };

export default LogSymptomModal; 