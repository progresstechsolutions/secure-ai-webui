import React, { useState, useEffect } from 'react';
import { AIFillFieldsModal } from './shared/SharedModals';
import Toast, { ToastType } from './shared/Toast';

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

const AIIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

interface QuickLogProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const QuickLog: React.FC<QuickLogProps> = ({ onSave, onCancel }) => {
  // State for log type selection - remember last choice
  const [selectedLogType, setSelectedLogType] = useState<'symptom' | 'nutrition' | 'medication'>('symptom');

  
  // Form states


  // Symptom form states
  const [symptomStep, setSymptomStep] = useState<1 | 2 | 3>(1);
  const [selectedSymptomType, setSelectedSymptomType] = useState<string>('');
  const [pinnedSymptomTypes, setPinnedSymptomTypes] = useState<string[]>([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  
  // Core fields
  const [coreFields, setCoreFields] = useState({
    startTime: new Date().toISOString().slice(0, 16), // Now as default
    duration: '',
    isOngoing: false,
    severity: 3,
    contextTags: [] as string[],
    notes: ''
  });

  // Type-specific fields
  const [typeSpecificFields, setTypeSpecificFields] = useState<any>({});

  // Nutrition form states
  const [nutritionStep, setNutritionStep] = useState<1 | 2>(1);
  const [selectedIntakeType, setSelectedIntakeType] = useState<string>('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showMixingGuideModal, setShowMixingGuideModal] = useState(false);
  


  // Nutrition intake form
  const [nutritionIntakeForm, setNutritionIntakeForm] = useState({
    time: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  // Type-specific nutrition fields
  const [nutritionTypeFields, setNutritionTypeFields] = useState<any>({});
  
  // Medication form states
  const [medicationAction, setMedicationAction] = useState<'record' | 'add'>('record');


  // Record dose form
  const [recordDoseForm, setRecordDoseForm] = useState({
    medicationName: '',
    doseTaken: '',
    scheduledWindow: '',
    actualTime: new Date().toISOString().slice(0, 16),
    lotBottle: 'Current bottle',
    notes: ''
  });

  // Add medication form
  const [addMedicationForm, setAddMedicationForm] = useState({
    name: '',
    form: '',
    strength: '',
    directions: '',
    scheduleWindows: [] as string[],
    pharmacy: ''
  });

  // Medication data
  const [medications, setMedications] = useState([
    { name: 'Tylenol', form: 'tablet', strength: '500mg' },
    { name: 'Amoxicillin', form: 'liquid', strength: '125mg/5mL' },
    { name: 'Albuterol', form: 'inhaler', strength: '90mcg' }
  ]);

  // Modal states
  const [showScanModal, setShowScanModal] = useState(false);
  const [showSyringeModal, setShowSyringeModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Show toast function
  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message, isVisible: true });
  };

  // Clear toast function
  const clearToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Clear validation errors
  const clearValidationErrors = () => {
    setValidationErrors({});
    setErrors({});
  };

  // Helper function to display validation errors
  const getValidationError = (fieldName: string) => {
    return validationErrors[fieldName] || errors[fieldName];
  };

  // Validation functions
  const validateSymptomForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedSymptomType) {
      newErrors.symptomType = 'Please choose a Symptom type';
    }
    
    if (!coreFields.startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    
    if (coreFields.duration === '' && !coreFields.isOngoing) {
      newErrors.duration = 'Please enter duration or mark as ongoing';
    }
    
    if (coreFields.severity === null) {
      newErrors.severity = 'Please select severity level';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNutritionForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedIntakeType) {
      newErrors.intakeType = 'Please choose an Intake type';
    }
    
    if (!nutritionIntakeForm.time) {
      newErrors.time = 'Please select a time';
    }
    
    // Type-specific validation
    if (selectedIntakeType === 'Meal/Snack') {
      if (!nutritionTypeFields.foods || nutritionTypeFields.foods.length === 0) {
        newErrors.foods = 'Please enter at least one food item';
      }
      if (!nutritionTypeFields.portionSize) {
        newErrors.portionSize = 'Please select portion size';
      }
    } else if (selectedIntakeType === 'Drink') {
      if (!nutritionTypeFields.beverage) {
        newErrors.beverage = 'Please select beverage type';
      }
      if (!nutritionTypeFields.volume) {
        newErrors.volume = 'Please enter volume';
      }
    } else if (selectedIntakeType === 'Enteral feed') {
      if (!nutritionTypeFields.formulaBrand) {
        newErrors.formulaBrand = 'Please enter formula brand';
      }
      if (!nutritionTypeFields.volume) {
        newErrors.volume = 'Please enter volume';
      }
    } else if (selectedIntakeType === 'Supplement') {
      if (!nutritionTypeFields.name) {
        newErrors.name = 'Please enter supplement name';
      }
      if (!nutritionTypeFields.amount) {
        newErrors.amount = 'Please enter amount';
      }
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMedicationForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (medicationAction === 'record') {
      if (!recordDoseForm.medicationName) {
        newErrors.medicationName = 'Please select or enter medication name';
      }
      if (!recordDoseForm.doseTaken) {
        newErrors.doseTaken = 'Please enter dose taken';
      }
      if (!recordDoseForm.actualTime) {
        newErrors.actualTime = 'Please select actual time';
      }
    } else if (medicationAction === 'add') {
      if (!addMedicationForm.name) {
        newErrors.name = 'Please enter medication name';
      }
      if (!addMedicationForm.form) {
        newErrors.form = 'Please select form';
      }
      if (!addMedicationForm.strength) {
        newErrors.strength = 'Please enter strength';
      }
      if (!addMedicationForm.directions) {
        newErrors.directions = 'Please enter directions';
      }
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load last selection from localStorage
  useEffect(() => {
    const savedLogType = localStorage.getItem('quickLogType');
    if (savedLogType === 'symptom' || savedLogType === 'nutrition' || savedLogType === 'medication') {
      setSelectedLogType(savedLogType);
    }
    
    // Load pinned symptom types
    const savedPinned = localStorage.getItem('pinnedSymptomTypes');
    if (savedPinned) {
      setPinnedSymptomTypes(JSON.parse(savedPinned));
    }
  }, []);

  // Save selection to localStorage
  const handleLogTypeChange = (logType: 'symptom' | 'nutrition' | 'medication') => {
    setSelectedLogType(logType);
    localStorage.setItem('quickLogType', logType);
    setErrors({}); // Clear errors when switching
    
    // Reset symptom form when switching to symptom
    if (logType === 'symptom') {
      setSymptomStep(1);
      setSelectedSymptomType('');
      setCoreFields({
        startTime: new Date().toISOString().slice(0, 16),
        duration: '',
        isOngoing: false,
        severity: 3,
        contextTags: [],
        notes: ''
      });
      setTypeSpecificFields({});
    }
    
         // Reset nutrition form when switching to nutrition
     if (logType === 'nutrition') {
       setNutritionStep(1);
       setSelectedIntakeType('');
       setNutritionIntakeForm({
         time: new Date().toISOString().slice(0, 16),
         notes: ''
       });
       setNutritionTypeFields({});
     }
     
     // Reset medication form when switching to medication
     if (logType === 'medication') {
       setMedicationAction('record');
       setRecordDoseForm({
         medicationName: '',
         doseTaken: '',
         scheduledWindow: '',
         actualTime: new Date().toISOString().slice(0, 16),
         lotBottle: 'Current bottle',
         notes: ''
       });
       setAddMedicationForm({
         name: '',
         form: '',
         strength: '',
         directions: '',
         scheduleWindows: [],
         pharmacy: ''
       });
     }
  };

  // Symptom type management
  const handlePinSymptomType = (type: string) => {
    const newPinned = pinnedSymptomTypes.includes(type)
      ? pinnedSymptomTypes.filter(t => t !== type)
      : [...pinnedSymptomTypes, type].slice(0, 5); // Keep only top 5
    setPinnedSymptomTypes(newPinned);
    localStorage.setItem('pinnedSymptomTypes', JSON.stringify(newPinned));
  };

  const handleSymptomTypeSelect = (type: string) => {
    setSelectedSymptomType(type);
    setSymptomStep(2);
  };

  const handleNextStep = () => {
    if (symptomStep < 3) {
      setSymptomStep(symptomStep + 1 as 1 | 2 | 3);
    }
  };

  const handlePrevStep = () => {
    if (symptomStep > 1) {
      setSymptomStep(symptomStep - 1 as 1 | 2 | 3);
    }
  };

  // Nutrition intake type management
  const handleIntakeTypeSelect = (type: string) => {
    setSelectedIntakeType(type);
    setNutritionStep(2);
  };

  const handleNutritionNextStep = () => {
    if (nutritionStep < 2) {
      setNutritionStep(nutritionStep + 1 as 1 | 2);
    }
  };

  const handleNutritionPrevStep = () => {
    if (nutritionStep > 1) {
      setNutritionStep(nutritionStep - 1 as 1 | 2);
    }
  };

  // Medication form handlers
  const handleMedicationActionSelect = (action: 'record' | 'add') => {
    setMedicationAction(action);
  };



  const handleScheduleWindowToggle = (window: string) => {
    const current = addMedicationForm.scheduleWindows;
    const newWindows = current.includes(window)
      ? current.filter(w => w !== window)
      : [...current, window];
    setAddMedicationForm({...addMedicationForm, scheduleWindows: newWindows});
  };

  // Render type-specific fields
  const renderTypeSpecificFields = () => {
    switch (selectedSymptomType) {
      case 'seizure':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seizure Type
              </label>
              <select
                value={typeSpecificFields.seizureType || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, seizureType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select type</option>
                <option value="unknown">Unknown/New</option>
                <option value="focal">Focal</option>
                <option value="generalized">Generalized</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recovery State
              </label>
              <div className="flex space-x-3">
                {['OK', 'Tired', 'Confused'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setTypeSpecificFields({...typeSpecificFields, recoveryState: state})}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      typeSpecificFields.recoveryState === state
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.clustering || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, clustering: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Clustering (multiple seizures)</span>
              </label>
            </div>
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Latency (minutes)
              </label>
              <input
                type="number"
                value={typeSpecificFields.sleepLatency || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, sleepLatency: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="How long to fall asleep"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Night Awakenings
              </label>
              <input
                type="number"
                value={typeSpecificFields.nightAwakenings || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, nightAwakenings: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Number of times woke up"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.snoring || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, snoring: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Snoring</span>
              </label>
            </div>
          </div>
        );

      case 'gi':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stool Type (Bristol Scale)
              </label>
              <select
                value={typeSpecificFields.stoolType || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, stoolType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select type</option>
                <option value="1">Type 1 - Separate hard lumps</option>
                <option value="2">Type 2 - Sausage-like but lumpy</option>
                <option value="3">Type 3 - Sausage-like with cracks</option>
                <option value="4">Type 4 - Smooth and soft</option>
                <option value="5">Type 5 - Soft blobs</option>
                <option value="6">Type 6 - Mushy consistency</option>
                <option value="7">Type 7 - Entirely liquid</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.straining || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, straining: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Straining</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.vomiting || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, vomiting: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Vomiting</span>
              </label>
            </div>
          </div>
        );

      case 'pain':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Indicators
              </label>
              <div className="space-y-3">
                {['Face grimace', 'Guarding', 'Inconsolable cry', 'Less active'].map((indicator) => (
                  <label key={indicator} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={typeSpecificFields.painIndicators?.includes(indicator) || false}
                      onChange={(e) => {
                        const current = typeSpecificFields.painIndicators || [];
                        const newIndicators = e.target.checked
                          ? [...current, indicator]
                          : current.filter((i: string) => i !== indicator);
                        setTypeSpecificFields({...typeSpecificFields, painIndicators: newIndicators});
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{indicator}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sensory':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Triggers
              </label>
              <div className="flex flex-wrap gap-2">
                {['Sound', 'Light', 'Touch'].map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => {
                      const current = typeSpecificFields.triggers || [];
                      const newTriggers = current.includes(trigger)
                        ? current.filter((t: string) => t !== trigger)
                        : [...current, trigger];
                      setTypeSpecificFields({...typeSpecificFields, triggers: newTriggers});
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      typeSpecificFields.triggers?.includes(trigger)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.flushing || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, flushing: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Flushing</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.sweating || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, sweating: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sweating</span>
              </label>
            </div>
          </div>
        );

      case 'respiratory':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.cough || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, cough: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Cough</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.wheeze || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, wheeze: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Wheeze</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.runnyNose || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, runnyNose: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Runny nose</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.mouthBreathing || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, mouthBreathing: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mouth breathing</span>
              </label>
            </div>
          </div>
        );

      case 'behavior':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Episode Type
              </label>
              <select
                value={typeSpecificFields.episodeType || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, episodeType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select type</option>
                <option value="irritability">Irritability</option>
                <option value="agitation">Agitation</option>
                <option value="elopement">Elopement</option>
                <option value="repetitive">Repetitive behavior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typeSpecificFields.stoppedActivity || false}
                    onChange={(e) => setTypeSpecificFields({...typeSpecificFields, stoppedActivity: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Stopped activity</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typeSpecificFields.neededSupport || false}
                    onChange={(e) => setTypeSpecificFields({...typeSpecificFields, neededSupport: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Needed support</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'motor':
        return (
          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeSpecificFields.gaitInstability || false}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, gaitInstability: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Gait instability</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Falls Count
              </label>
              <input
                type="number"
                value={typeSpecificFields.fallsCount || ''}
                onChange={(e) => setTypeSpecificFields({...typeSpecificFields, fallsCount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Number of falls"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render nutrition type-specific fields
  const renderNutritionTypeFields = () => {
    switch (selectedIntakeType) {
      case 'meal':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foods <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nutritionTypeFields.foods || ''}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, foods: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Type food items..."
                />
                {nutritionTypeFields.foods && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {foodSuggestions
                      .filter(food => food.toLowerCase().includes(nutritionTypeFields.foods.toLowerCase()))
                      .slice(0, 5)
                      .map((food) => (
                        <button
                          key={food}
                          onClick={() => setNutritionTypeFields({...nutritionTypeFields, foods: food})}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {food}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portion Size
              </label>
              <select
                value={nutritionTypeFields.portionSize || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, portionSize: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select portion size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="grams">Grams</option>
                <option value="ounces">Ounces</option>
              </select>
              {(nutritionTypeFields.portionSize === 'grams' || nutritionTypeFields.portionSize === 'ounces') && (
                <input
                  type="number"
                  value={nutritionTypeFields.portionAmount || ''}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, portionAmount: e.target.value})}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Amount in ${nutritionTypeFields.portionSize}`}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texture
              </label>
              <div className="flex flex-wrap gap-2">
                {textureOptions.map((texture) => (
                  <button
                    key={texture}
                    onClick={() => {
                      const current = nutritionTypeFields.textures || [];
                      const newTextures = current.includes(texture)
                        ? current.filter((t: string) => t !== texture)
                        : [...current, texture];
                      setNutritionTypeFields({...nutritionTypeFields, textures: newTextures});
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      nutritionTypeFields.textures?.includes(texture)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {texture}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setting
              </label>
              <div className="flex flex-wrap gap-2">
                {settingOptions.map((setting) => (
                  <button
                    key={setting}
                    onClick={() => {
                      const current = nutritionTypeFields.settings || [];
                      const newSettings = current.includes(setting)
                        ? current.filter((s: string) => s !== setting)
                        : [...current, setting];
                      setNutritionTypeFields({...nutritionTypeFields, settings: newSettings});
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      nutritionTypeFields.settings?.includes(setting)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {setting}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'drink':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beverage <span className="text-red-500">*</span>
              </label>
              <select
                value={nutritionTypeFields.beverage || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, beverage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select beverage</option>
                {beverageOptions.map((beverage) => (
                  <option key={beverage} value={beverage.toLowerCase()}>{beverage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={nutritionTypeFields.volume || ''}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, volume: e.target.value})}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Amount"
                />
                <select
                  value={nutritionTypeFields.volumeUnit || 'ml'}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, volumeUnit: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="ml">mL</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'enteral':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formula Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nutritionTypeFields.formulaBrand || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, formulaBrand: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Pediasure, Ensure, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concentration
              </label>
              <input
                type="text"
                value={nutritionTypeFields.concentration || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, concentration: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 1.0 kcal/mL or 2 scoops to 100mL water"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume (mL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={nutritionTypeFields.volume || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, volume: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Volume in mL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Method
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setNutritionTypeFields({...nutritionTypeFields, delivery: 'bolus'})}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                    nutritionTypeFields.delivery === 'bolus'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Bolus
                </button>
                <button
                  onClick={() => setNutritionTypeFields({...nutritionTypeFields, delivery: 'continuous'})}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                    nutritionTypeFields.delivery === 'continuous'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Continuous
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Need help with mixing ratios?
                  </p>
                  <button
                    onClick={() => setShowMixingGuideModal(true)}
                    className="text-sm text-blue-800 underline hover:text-blue-900 mt-1"
                  >
                    View mixing guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'supplement':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplement Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nutritionTypeFields.supplementName || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, supplementName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Vitamin D, Iron, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form
              </label>
              <select
                value={nutritionTypeFields.form || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, form: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select form</option>
                {supplementForms.map((form) => (
                  <option key={form} value={form.toLowerCase()}>{form}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strength per Unit
              </label>
              <input
                type="text"
                value={nutritionTypeFields.strength || ''}
                onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, strength: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 400 IU, 50mg, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Given <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={nutritionTypeFields.amount || ''}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, amount: e.target.value})}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Amount"
                />
                <input
                  type="text"
                  value={nutritionTypeFields.amountUnit || ''}
                  onChange={(e) => setNutritionTypeFields({...nutritionTypeFields, amountUnit: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Units or mL"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };



  // Save functions
  const handleSave = () => {
    clearValidationErrors();
    
    switch (selectedLogType) {
      case 'symptom':
        if (symptomStep < 3) {
          // If not on final step, continue to next step
          handleNextStep();
          return;
        }
        
        // Validate symptom form
        if (!validateSymptomForm()) {
          showToast('error', 'Please fix the errors before saving');
          return;
        }
        
        const symptomData = {
          type: 'symptom',
          symptomType: selectedSymptomType,
          coreFields,
          typeSpecificFields,
          timestamp: new Date().toISOString()
        };
        
        onSave(symptomData);
        showToast('success', 'Symptom saved. You can find it in Journal.');
        
        // Reset symptom form
        setSymptomStep(1);
        setSelectedSymptomType('');
        setCoreFields({
          startTime: new Date().toISOString().slice(0, 16),
          duration: '',
          isOngoing: false,
          severity: 3,
          contextTags: [],
          notes: ''
        });
        setTypeSpecificFields({});
        break;
      case 'nutrition':
        if (nutritionStep < 2) {
          // If not on final step, continue to next step
          handleNutritionNextStep();
          return;
        }
        
        // Validate nutrition form
        if (!validateNutritionForm()) {
          showToast('error', 'Please fix the errors before saving');
          return;
        }
        
        const nutritionData = {
          type: 'nutrition',
          intakeType: selectedIntakeType,
          time: nutritionIntakeForm.time,
          notes: nutritionIntakeForm.notes,
          typeSpecificFields: nutritionTypeFields,
          timestamp: new Date().toISOString()
        };
        
        onSave(nutritionData);
        showToast('success', 'Nutrition entry saved. You can find it in Journal.');
        
        // Reset nutrition form
        setNutritionStep(1);
        setSelectedIntakeType('');
        setNutritionIntakeForm({
          time: new Date().toISOString().slice(0, 16),
          notes: ''
        });
        setNutritionTypeFields({});
        break;
      case 'medication':
        // Validate medication form
        if (!validateMedicationForm()) {
          showToast('error', 'Please fix the errors before saving');
          return;
        }
        
        if (medicationAction === 'record') {
          const doseData = {
            type: 'medication_dose',
            ...recordDoseForm,
            timestamp: new Date().toISOString()
          };
          
          onSave(doseData);
          showToast('success', 'Dose recorded.');
          
          // Reset form
          setRecordDoseForm({
            medicationName: '',
            doseTaken: '',
            scheduledWindow: '',
            actualTime: new Date().toISOString().slice(0, 16),
            lotBottle: 'Current bottle',
            notes: ''
          });
        } else {
          const medicationData = {
            type: 'medication_add',
            ...addMedicationForm,
            timestamp: new Date().toISOString()
          };
          
          onSave(medicationData);
          showToast('success', 'Medication added. You can now record doses.');
          
          // Reset form
          setAddMedicationForm({
            name: '',
            form: '',
            strength: '',
            directions: '',
            scheduleWindows: [],
            pharmacy: ''
          });
        }
        break;
    }
  };

  const handleSaveAndAddAnother = () => {
    handleSave();
    // Form will be reset after save, so we can stay on the same form
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    switch (selectedLogType) {
      case 'symptom':
        return selectedSymptomType !== '' || 
               coreFields.notes !== '' || 
               coreFields.contextTags.length > 0 ||
               Object.keys(typeSpecificFields).length > 0;
      case 'nutrition':
        return selectedIntakeType !== '' || 
               nutritionIntakeForm.notes !== '' ||
               Object.keys(nutritionTypeFields).length > 0;
      case 'medication':
        return medicationAction === 'record' ? 
               (recordDoseForm.medicationName !== '' || recordDoseForm.doseTaken !== '' || recordDoseForm.notes !== '') :
               (addMedicationForm.name !== '' || addMedicationForm.strength !== '' || addMedicationForm.directions !== '');
      default:
        return false;
    }
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      onCancel();
    }
  };

  // Symptom type data
  const symptomTypes = [
    { id: 'seizure', name: 'Seizure', icon: '⚡', color: 'bg-purple-500' },
    { id: 'sleep', name: 'Sleep', icon: '😴', color: 'bg-blue-500' },
    { id: 'gi', name: 'GI', icon: '🤢', color: 'bg-orange-500' },
    { id: 'pain', name: 'Pain/Discomfort', icon: '😣', color: 'bg-red-500' },
    { id: 'sensory', name: 'Sensory/Autonomic', icon: '🌡️', color: 'bg-yellow-500' },
    { id: 'respiratory', name: 'Respiratory/ENT', icon: '🫁', color: 'bg-cyan-500' },
    { id: 'behavior', name: 'Behavior Episode', icon: '😤', color: 'bg-pink-500' },
    { id: 'motor', name: 'Motor', icon: '🏃', color: 'bg-green-500' }
  ];

  // Context tags
  const contextTags = [
    'therapy day', 'illness', 'travel', 'loud environment', 'school day', 'menses'
  ];

  // Nutrition intake types
  const intakeTypes = [
    { id: 'meal', name: 'Meal/Snack', icon: '🍽️', color: 'bg-orange-500' },
    { id: 'drink', name: 'Drink', icon: '🥤', color: 'bg-blue-500' },
    { id: 'enteral', name: 'Enteral Feed', icon: '💉', color: 'bg-purple-500' },
    { id: 'supplement', name: 'Supplement', icon: '💊', color: 'bg-green-500' }
  ];

  // Food suggestions for autocomplete
  const foodSuggestions = [
    'Apple', 'Banana', 'Chicken', 'Rice', 'Broccoli', 'Carrots', 'Yogurt', 'Cheese',
    'Bread', 'Pasta', 'Fish', 'Beef', 'Pork', 'Eggs', 'Milk', 'Juice', 'Water',
    'Crackers', 'Cereal', 'Oatmeal', 'Soup', 'Salad', 'Pizza', 'Hamburger'
  ];

  // Beverage options
  const beverageOptions = [
    'Water', 'Milk', 'Juice', 'Formula', 'Other'
  ];

  // Texture options
  const textureOptions = [
    'Puree', 'Soft', 'Regular'
  ];

  // Setting options
  const settingOptions = [
    'Home', 'School', 'Therapy'
  ];

  // Supplement forms
  const supplementForms = [
    'Liquid', 'Tablet', 'Chewable', 'Powder'
  ];

  // Medication forms
  const medicationForms = [
    'Tablet', 'Liquid', 'Inhaler', 'Patch', 'Topical', 'Other'
  ];

  // Schedule windows
  const scheduleWindows = ['AM', 'Noon', 'PM', 'HS'];

  // Lot/bottle options
  const lotBottleOptions = [
    'Current bottle',
    'New bottle opened',
    'Lot #12345',
    'Lot #67890'
  ];

  // Log type tiles
  const logTypes = [
    {
      id: 'symptom',
      title: 'Symptom',
      icon: <SymptomIcon />,
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      description: 'Log symptoms and severity'
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: <NutritionIcon />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      description: 'Track meals and food intake'
    },
    {
      id: 'medication',
      title: 'Medication',
      icon: <MedicationIcon />,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-500',
      description: 'Record medication taken'
    }
  ];

  // Render form based on selected type
  const renderForm = () => {
    switch (selectedLogType) {
      case 'symptom':
        return (
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    symptomStep >= step 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      symptomStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Choose Symptom Type */}
            {symptomStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Choose Symptom Type</h3>
                  <button
                    onClick={() => setShowManageModal(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Manage
                  </button>
                </div>

                {/* Pinned Types */}
                {pinnedSymptomTypes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Pinned</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {pinnedSymptomTypes.map((typeId) => {
                        const type = symptomTypes.find(t => t.id === typeId);
                        if (!type) return null;
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleSymptomTypeSelect(type.id)}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="text-sm font-medium text-gray-900">{type.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Types */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {pinnedSymptomTypes.length > 0 ? 'All Types' : ''}
                  </h4>
                  {getValidationError('symptomType') && (
                    <div className="text-red-600 text-sm mb-3">{getValidationError('symptomType')}</div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {symptomTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSymptomTypeSelect(type.id)}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{type.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Core Fields */}
            {symptomStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Core Information</h3>
                  <button
                    onClick={handlePrevStep}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  {getValidationError('startTime') && (
                    <div className="text-red-600 text-sm mb-2">{getValidationError('startTime')}</div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCoreFields({...coreFields, startTime: new Date().toISOString().slice(0, 16)})}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        coreFields.startTime === new Date().toISOString().slice(0, 16)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Now
                    </button>
                    <input
                      type="datetime-local"
                      value={coreFields.startTime}
                      onChange={(e) => setCoreFields({...coreFields, startTime: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  {getValidationError('duration') && (
                    <div className="text-red-600 text-sm mb-2">{getValidationError('duration')}</div>
                  )}
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      value={coreFields.duration}
                      onChange={(e) => setCoreFields({...coreFields, duration: e.target.value})}
                      disabled={coreFields.isOngoing}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                      placeholder="Minutes"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={coreFields.isOngoing}
                        onChange={(e) => setCoreFields({...coreFields, isOngoing: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Ongoing</span>
                    </label>
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity: {coreFields.severity}/5 <span className="text-red-500">*</span>
                  </label>
                  {getValidationError('severity') && (
                    <div className="text-red-600 text-sm mb-2">{getValidationError('severity')}</div>
                  )}
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={coreFields.severity}
                    onChange={(e) => setCoreFields({...coreFields, severity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Context Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {contextTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = coreFields.contextTags.includes(tag)
                            ? coreFields.contextTags.filter(t => t !== tag)
                            : [...coreFields.contextTags, tag];
                          setCoreFields({...coreFields, contextTags: newTags});
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          coreFields.contextTags.includes(tag)
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={coreFields.notes}
                    onChange={(e) => setCoreFields({...coreFields, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe what you're experiencing..."
                    rows={3}
                    maxLength={300}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {coreFields.notes.length}/300
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Type-specific Fields */}
            {symptomStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {symptomTypes.find(t => t.id === selectedSymptomType)?.name} Details
                  </h3>
                  <button
                    onClick={handlePrevStep}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                </div>

                {/* Render type-specific fields based on selectedSymptomType */}
                {renderTypeSpecificFields()}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleSaveAndAddAnother}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Save & add another
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Safety Strip */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    If you're concerned about safety, contact your clinician or local emergency services.
                  </p>
                  <button
                    onClick={() => setShowEmergencyModal(true)}
                    className="text-sm text-yellow-800 underline hover:text-yellow-900 mt-1"
                  >
                    View emergency info
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

             case 'nutrition':
         return (
           <div className="space-y-6">
             {/* Step Indicator */}
             <div className="flex items-center justify-center space-x-4 mb-6">
               {[1, 2].map((step) => (
                 <div key={step} className="flex items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                     nutritionStep >= step 
                       ? 'bg-indigo-600 text-white' 
                       : 'bg-gray-200 text-gray-600'
                   }`}>
                     {step}
                   </div>
                   {step < 2 && (
                     <div className={`w-12 h-0.5 mx-2 ${
                       nutritionStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                     }`} />
                   )}
                 </div>
               ))}
             </div>

             {/* Step 1: Choose Intake Type */}
             {nutritionStep === 1 && (
               <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-gray-900">Choose Intake Type</h3>
                 <div className="grid grid-cols-2 gap-4">
                   {intakeTypes.map((type) => (
                     <button
                       key={type.id}
                       onClick={() => handleIntakeTypeSelect(type.id)}
                       className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <div className="text-center">
                         <div className="text-3xl mb-3">{type.icon}</div>
                         <div className="text-sm font-medium text-gray-900">{type.name}</div>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* Step 2: Intake Fields */}
             {nutritionStep === 2 && (
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-semibold text-gray-900">
                     {intakeTypes.find(t => t.id === selectedIntakeType)?.name} Details
                   </h3>
                   <button
                     onClick={handleNutritionPrevStep}
                     className="text-sm text-gray-600 hover:text-gray-800"
                   >
                     ← Back
                   </button>
                 </div>

                 {/* Render type-specific fields */}
                 {renderNutritionTypeFields()}

                 {/* Common Fields */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Time
                   </label>
                   <div className="flex space-x-3">
                     <button
                       onClick={() => setNutritionIntakeForm({...nutritionIntakeForm, time: new Date().toISOString().slice(0, 16)})}
                       className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                         nutritionIntakeForm.time === new Date().toISOString().slice(0, 16)
                           ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                           : 'border-gray-300 text-gray-700 hover:border-gray-400'
                       }`}
                     >
                       Now
                     </button>
                     <input
                       type="datetime-local"
                       value={nutritionIntakeForm.time}
                       onChange={(e) => setNutritionIntakeForm({...nutritionIntakeForm, time: e.target.value})}
                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Notes (optional)
                   </label>
                   <textarea
                     value={nutritionIntakeForm.notes}
                     onChange={(e) => setNutritionIntakeForm({...nutritionIntakeForm, notes: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="Logistics only (no symptoms)..."
                     rows={3}
                   />
                 </div>

                 {/* Placeholder Features */}
                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <button
                         className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                         title="Scan barcode coming soon"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                         </svg>
                         <span className="text-sm">Scan barcode</span>
                       </button>
                       <button
                         className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                         title="Photo plate recognition coming soon"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         <span className="text-sm">Photo recognition</span>
                       </button>
                     </div>
                     <div className="text-xs text-gray-500">
                       Coming soon
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
         );

             case 'medication':
         return (
           <div className="space-y-6">
             {/* Action Selection */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Choose Action
               </label>
               <div className="grid grid-cols-2 gap-4">
                 <button
                   onClick={() => handleMedicationActionSelect('record')}
                   className={`p-4 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                     medicationAction === 'record'
                       ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                       : 'border-gray-300 text-gray-700 hover:border-gray-400'
                   }`}
                 >
                   <div className="text-center">
                     <div className="text-2xl mb-2">💊</div>
                     <div className="font-medium">Record a dose</div>
                   </div>
                 </button>
                 <button
                   onClick={() => handleMedicationActionSelect('add')}
                   className={`p-4 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                     medicationAction === 'add'
                       ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                       : 'border-gray-300 text-gray-700 hover:border-gray-400'
                   }`}
                 >
                   <div className="text-center">
                     <div className="text-2xl mb-2">➕</div>
                     <div className="font-medium">Add new medication</div>
                   </div>
                 </button>
               </div>
             </div>

             {/* Record Dose Form */}
             {medicationAction === 'record' && (
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Medication Name <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <input
                       type="text"
                       value={recordDoseForm.medicationName}
                       onChange={(e) => setRecordDoseForm({...recordDoseForm, medicationName: e.target.value})}
                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                         errors.medicationName ? 'border-red-300' : 'border-gray-300'
                       }`}
                       placeholder="Search medications..."
                     />
                     {recordDoseForm.medicationName && (
                       <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                         {medications
                           .filter(med => med.name.toLowerCase().includes(recordDoseForm.medicationName.toLowerCase()))
                           .map((med) => (
                             <button
                               key={med.name}
                               onClick={() => setRecordDoseForm({...recordDoseForm, medicationName: med.name})}
                               className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                             >
                               <div className="font-medium">{med.name}</div>
                               <div className="text-sm text-gray-600">{med.strength} {med.form}</div>
                             </button>
                           ))}
                         <button
                           onClick={() => handleMedicationActionSelect('add')}
                           className="w-full px-4 py-2 text-left text-indigo-600 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none font-medium"
                         >
                           + Add new medication
                         </button>
                       </div>
                     )}
                   </div>
                   {errors.medicationName && (
                     <p className="mt-1 text-sm text-red-600">{errors.medicationName}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Dose Taken <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     value={recordDoseForm.doseTaken}
                     onChange={(e) => setRecordDoseForm({...recordDoseForm, doseTaken: e.target.value})}
                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                       errors.doseTaken ? 'border-red-300' : 'border-gray-300'
                     }`}
                     placeholder="e.g., 1 tablet, 5 mL, 2 puffs"
                   />
                   {errors.doseTaken && (
                     <p className="mt-1 text-sm text-red-600">{errors.doseTaken}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Scheduled Window
                   </label>
                   <select
                     value={recordDoseForm.scheduledWindow}
                     onChange={(e) => setRecordDoseForm({...recordDoseForm, scheduledWindow: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   >
                     <option value="">Select window</option>
                     {scheduleWindows.map((window) => (
                       <option key={window} value={window}>{window}</option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Actual Time
                   </label>
                   <div className="flex space-x-3">
                     <button
                       onClick={() => setRecordDoseForm({...recordDoseForm, actualTime: new Date().toISOString().slice(0, 16)})}
                       className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                         recordDoseForm.actualTime === new Date().toISOString().slice(0, 16)
                           ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                           : 'border-gray-300 text-gray-700 hover:border-gray-400'
                       }`}
                     >
                       Now
                     </button>
                     <input
                       type="datetime-local"
                       value={recordDoseForm.actualTime}
                       onChange={(e) => setRecordDoseForm({...recordDoseForm, actualTime: e.target.value})}
                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Lot/Bottle (optional)
                   </label>
                   <select
                     value={recordDoseForm.lotBottle}
                     onChange={(e) => setRecordDoseForm({...recordDoseForm, lotBottle: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   >
                     {lotBottleOptions.map((option) => (
                       <option key={option} value={option}>{option}</option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Notes (optional)
                   </label>
                   <textarea
                     value={recordDoseForm.notes}
                     onChange={(e) => setRecordDoseForm({...recordDoseForm, notes: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="Logistics only (e.g., 'new bottle opened')..."
                     rows={2}
                   />
                 </div>

                 {/* Placeholder Features */}
                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <button
                         className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                         title="Scan label to auto-fill coming soon"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                         </svg>
                         <span className="text-sm">Scan label</span>
                       </button>
                       <button
                         className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                         title="AR syringe guide coming soon"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-sm">AR syringe guide</span>
                       </button>
                     </div>
                     <div className="text-xs text-gray-500">
                       Coming soon
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Add Medication Form */}
             {medicationAction === 'add' && (
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Name (brand/generic) <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     value={addMedicationForm.name}
                     onChange={(e) => setAddMedicationForm({...addMedicationForm, name: e.target.value})}
                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                       errors.name ? 'border-red-300' : 'border-gray-300'
                     }`}
                     placeholder="e.g., Tylenol, Acetaminophen"
                   />
                   {errors.name && (
                     <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Form <span className="text-red-500">*</span>
                   </label>
                   <select
                     value={addMedicationForm.form}
                     onChange={(e) => setAddMedicationForm({...addMedicationForm, form: e.target.value})}
                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                       errors.form ? 'border-red-300' : 'border-gray-300'
                     }`}
                   >
                     <option value="">Select form</option>
                     {medicationForms.map((form) => (
                       <option key={form} value={form.toLowerCase()}>{form}</option>
                     ))}
                   </select>
                   {errors.form && (
                     <p className="mt-1 text-sm text-red-600">{errors.form}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Strength <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     value={addMedicationForm.strength}
                     onChange={(e) => setAddMedicationForm({...addMedicationForm, strength: e.target.value})}
                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                       errors.strength ? 'border-red-300' : 'border-gray-300'
                     }`}
                     placeholder="e.g., 5 mg or 125 mg/5 mL"
                   />
                   {errors.strength && (
                     <p className="mt-1 text-sm text-red-600">{errors.strength}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Directions (SIG)
                   </label>
                   <input
                     type="text"
                     value={addMedicationForm.directions}
                     onChange={(e) => setAddMedicationForm({...addMedicationForm, directions: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="e.g., 5 mL twice daily"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Schedule Windows
                   </label>
                   <div className="flex flex-wrap gap-2">
                     {scheduleWindows.map((window) => (
                       <button
                         key={window}
                         onClick={() => handleScheduleWindowToggle(window)}
                         className={`px-3 py-1 rounded-full text-sm transition-colors ${
                           addMedicationForm.scheduleWindows.includes(window)
                             ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                             : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                         }`}
                       >
                         {window}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Pharmacy (optional)
                   </label>
                   <input
                     type="text"
                     value={addMedicationForm.pharmacy}
                     onChange={(e) => setAddMedicationForm({...addMedicationForm, pharmacy: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                     placeholder="Pharmacy name"
                   />
                 </div>
               </div>
             )}
           </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Log Type Selection Tiles */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What would you like to log?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {logTypes.map((logType) => (
              <button
                key={logType.id}
                onClick={() => handleLogTypeChange(logType.id as 'symptom' | 'nutrition' | 'medication')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  selectedLogType === logType.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-lg ${logType.color} text-white mb-3`}>
                    {logType.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{logType.title}</h3>
                  <p className="text-sm text-gray-600">{logType.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI and Media Capture Tools */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  showToast('info', 'AI features coming soon! Enable in Settings when available.');
                  setShowAIModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <AIIcon />
                <span>Use AI to fill fields</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative group"
                title="Media capture coming soon"
              >
                <CameraIcon />
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Media capture coming soon
                  <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative group"
                title="Media capture coming soon"
              >
                <MicrophoneIcon />
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Media capture coming soon
                  <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {renderForm()}
        </div>
      </div>

                    {/* Footer Actions - Only show for non-symptom forms or when on final step */}
        {((selectedLogType === 'symptom' && symptomStep === 3) || 
          (selectedLogType === 'nutrition' && nutritionStep === 2) || 
          (selectedLogType === 'medication')) && (
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
           <div className="max-w-2xl mx-auto">
             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
               <button
                 onClick={handleSave}
                 className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               >
                 Save
               </button>
               <button
                 onClick={handleSaveAndAddAnother}
                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
               >
                 Save & add another
               </button>
               <button
                 onClick={handleCancelClick}
                 className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}

      {/* AI Modal */}
      {/* AI Modal */}
      <AIFillFieldsModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />

             {/* Manage Modal */}
       {showManageModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
             <div className="p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Pinned Types</h3>
               <p className="text-sm text-gray-600 mb-6">
                 Pin your most-used symptom types for quick access (max 5).
               </p>
               
               <div className="space-y-3">
                 {symptomTypes.map((type) => (
                   <label key={type.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                     <div className="flex items-center">
                       <span className="text-xl mr-3">{type.icon}</span>
                       <span className="text-sm font-medium text-gray-900">{type.name}</span>
                     </div>
                     <input
                       type="checkbox"
                       checked={pinnedSymptomTypes.includes(type.id)}
                       onChange={() => handlePinSymptomType(type.id)}
                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                     />
                   </label>
                 ))}
               </div>
               
               <div className="flex justify-end mt-6">
                 <button
                   onClick={() => setShowManageModal(false)}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                 >
                   Done
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Emergency Modal */}
       {showEmergencyModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0">
                   <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                   </svg>
                 </div>
                 <h3 className="ml-3 text-lg font-semibold text-gray-900">Emergency Information</h3>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                   <h4 className="font-medium text-red-800 mb-2">Emergency Services</h4>
                   <p className="text-sm text-red-700 mb-2">Call 911 immediately if you need emergency medical assistance.</p>
                   <p className="text-sm text-red-700">For non-emergency concerns, contact your healthcare provider.</p>
                 </div>
                 
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                   <h4 className="font-medium text-blue-800 mb-2">Your Care Team</h4>
                   <p className="text-sm text-blue-700 mb-2">Primary Care: Dr. Smith - (555) 123-4567</p>
                   <p className="text-sm text-blue-700">Specialist: Dr. Johnson - (555) 987-6543</p>
                 </div>
                 
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <h4 className="font-medium text-green-800 mb-2">24/7 Nurse Line</h4>
                   <p className="text-sm text-green-700">Available for medical advice: (555) 456-7890</p>
                 </div>
               </div>
               
               <div className="flex justify-end mt-6">
                 <button
                   onClick={() => setShowEmergencyModal(false)}
                   className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Close
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Cancel Confirmation Modal */}
       {showCancelConfirmModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0">
                   <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                   </svg>
                 </div>
                 <h3 className="ml-3 text-lg font-semibold text-gray-900">Unsaved Changes</h3>
               </div>
               
               <p className="text-sm text-gray-600 mb-6">
                 You have unsaved changes. Are you sure you want to cancel? Your progress will be lost.
               </p>
               
               <div className="flex justify-end space-x-3">
                 <button
                   onClick={() => setShowCancelConfirmModal(false)}
                   className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Continue Editing
                 </button>
                 <button
                   onClick={() => {
                     setShowCancelConfirmModal(false);
                     onCancel();
                   }}
                   className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                 >
                   Cancel Anyway
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

               {/* Barcode Modal */}
        {showBarcodeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Barcode</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Point your camera at a food product barcode to automatically fill nutrition information.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Coming soon!</strong> This feature will be available in a future update.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBarcodeModal(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Plate Recognition</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Take a photo of your meal and AI will help identify and log the foods automatically.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Coming soon!</strong> This feature will be available in a future update.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mixing Guide Modal */}
        {showMixingGuideModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Enteral Feeding Mixing Guide</h3>
                  <button
                    onClick={() => setShowMixingGuideModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Important Safety Notes</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Always follow your healthcare provider's specific instructions</li>
                      <li>• Use clean, sterile equipment</li>
                      <li>• Check expiration dates on all products</li>
                      <li>• Store prepared formula according to manufacturer guidelines</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Common Mixing Ratios</h4>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Pediasure 1.0 kcal/mL</h5>
                      <p className="text-sm text-gray-600">Ready to use - no mixing required</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Pediasure 1.5 kcal/mL</h5>
                      <p className="text-sm text-gray-600">Mix 1 can with 1/3 can of water</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Ensure 1.0 kcal/mL</h5>
                      <p className="text-sm text-gray-600">Ready to use - no mixing required</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Ensure 1.5 kcal/mL</h5>
                      <p className="text-sm text-gray-600">Mix 1 can with 1/3 can of water</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> These are general guidelines. Always consult your healthcare provider for specific instructions for your child's needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowMixingGuideModal(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

                 {/* Scan Modal */}
         {showScanModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
               <div className="p-6">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Label</h3>
                 <p className="text-sm text-gray-600 mb-6">
                   Point your camera at a medication label to automatically fill information.
                 </p>
                 
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                   <div className="flex items-start">
                     <div className="flex-shrink-0">
                       <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-yellow-800">
                         <strong>Coming soon!</strong> This feature will be available in a future update.
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex justify-end space-x-3">
                   <button
                     onClick={() => setShowScanModal(false)}
                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                   >
                     Got it
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Syringe Guide Modal */}
         {showSyringeModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
               <div className="p-6">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">AR Syringe Guide</h3>
                 <p className="text-sm text-gray-600 mb-6">
                   Use augmented reality to help measure the correct dose with a syringe.
                 </p>
                 
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                   <div className="flex items-start">
                     <div className="flex-shrink-0">
                       <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-yellow-800">
                         <strong>Coming soon!</strong> This feature will be available in a future update.
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex justify-end space-x-3">
                   <button
                     onClick={() => setShowSyringeModal(false)}
                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                   >
                     Got it
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

      {/* Toast */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={clearToast}
      />
    </div>
  );
};

export default QuickLog;
