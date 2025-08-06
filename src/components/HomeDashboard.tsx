import React, { useState } from 'react';

// Icon components
const PlateIcon = () => <span className="text-2xl">🍽️</span>;
const BellIcon = () => <span className="text-2xl">🔔</span>;
const GrowthIcon = () => <span className="text-2xl">📈</span>;

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
  onNavigateToGrowthDevelopment?: () => void;
  onNavigateToNutrition?: () => void;
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
  onNavigateToGrowthDevelopment, 
  onNavigateToNutrition,
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

        {/* Today's Snapshot Cards */}
        <div className="space-y-4">
          <SnapshotCard
            icon={<PlateIcon />}
            title="Nutrition Plan"
            summary="Today's plan ready"
            actionText="View Plan"
            actionVariant="primary"
            onClick={onNavigateToNutrition}
          />

          <SnapshotCard
            icon={<BellIcon />}
            title="Alerts"
            summary="2 unread alerts"
            actionText="Check Alerts"
            onClick={onNavigateToAlerts}
          />

          <SnapshotCard
            icon={<GrowthIcon />}
            title="Growth & Development"
            summary="+1cm this month"
            actionText="View Details"
            onClick={onNavigateToGrowthDevelopment}
          />
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