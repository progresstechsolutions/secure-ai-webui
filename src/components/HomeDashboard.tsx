import React, { useState } from 'react';

// Icon components


interface SnapshotCardProps {
  icon: React.ReactNode;
  title: string;
  summary: string;
  actionText: string;
  actionVariant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface HomeDashboardProps {
  onNavigateToSymptomInsights?: (symptomName: string, severity: number, date: string) => void;
  onNavigateToAlerts?: () => void;
  onNavigateToLog?: () => void;
}

const SnapshotCard: React.FC<SnapshotCardProps> = ({
  icon,
  title,
  summary,
  actionText,
  actionVariant = 'secondary',
  onClick
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{summary}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
          actionVariant === 'primary' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'text-indigo-600 hover:text-indigo-700'
        }`}
      >
        {actionText}
      </button>
    </div>
  </div>
);

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  onNavigateToSymptomInsights, 
  onNavigateToAlerts, 
  onNavigateToLog 
}) => {
  const [currentTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  const greeting = `Good ${currentTime}, Jamie's Mom!`;

  return (
    <div className="px-4 py-6">

        {/* Personalized Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>
        </div>

        {/* Jamie's Care Snapshot */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 shadow-sm mb-8" role="region" aria-label="Personalized care insights">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">Jamie's Care Snapshot</h3>
              <div className="space-y-2 text-sm text-indigo-800">
                <p>• Jamie has logged <span className="font-semibold text-indigo-900">headaches</span> 4 times in the last 2 months</p>
                <p>• <span className="font-semibold text-indigo-900">Iron intake</span> is below target this week</p>
                <p>• <span className="font-semibold text-indigo-900">Medication compliance</span> is at 85% this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* PMS-Specific Tip Carousel */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tips</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Do: Include leafy greens today</p>
                <p className="text-xs text-gray-600">Spinach and kale are rich in essential nutrients for PMS management</p>
                <button 
                  onClick={() => onNavigateToSymptomInsights?.('Fatigue', 3, 'Today')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                >
                  Why this recommendation? →
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 mt-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✗</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Don't: Skip hydration</p>
                <p className="text-xs text-gray-600">Aim for 8 glasses of water to support overall health</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default HomeDashboard; 