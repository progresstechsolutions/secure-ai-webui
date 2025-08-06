import React from 'react';

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
            <h1 className="text-lg font-semibold text-gray-900">Daily Care Hub</h1>
            <p className="text-sm text-gray-600">Monitor and manage Jamie's care</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="space-y-4">
          {trackers.map((tracker) => (
            <button
              key={tracker.id}
              onClick={tracker.onClick}
              className={`w-full p-6 bg-white rounded-xl border ${tracker.borderColor} shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${tracker.color} text-white`}>
                  {tracker.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {tracker.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tracker.description}
                  </p>
                </div>
                
                {/* Chevron */}
                <div className={`${tracker.textColor}`}>
                  <ChevronRightIcon />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onNavigateToSymptomTracker}
              className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <div className="text-center">
                <div className="text-red-600 mb-2">
                  <SymptomIcon />
                </div>
                <span className="text-sm font-medium text-red-700">Log Symptom</span>
              </div>
            </button>
            
            <button
              onClick={onNavigateToNutritionTracker}
              className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <div className="text-center">
                <div className="text-green-600 mb-2">
                  <NutritionIcon />
                </div>
                <span className="text-sm font-medium text-green-700">Plan Meal</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackersDashboard; 