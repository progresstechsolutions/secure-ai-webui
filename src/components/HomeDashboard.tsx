import React, { useState } from 'react';
import LogSymptomModal from './LogSymptomModal';

// Icon components (using simple SVG icons)
const AvatarIcon = () => (
  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
    J
  </div>
);

const SmileyIcon = ({ mood }: { mood: 'happy' | 'neutral' | 'sad' }) => {
  const icons = {
    happy: '😊',
    neutral: '😐',
    sad: '😔'
  };
  return <span className="text-2xl">{icons[mood]}</span>;
};

const PlateIcon = () => <span className="text-2xl">🍽️</span>;
const BellIcon = () => <span className="text-2xl">🔔</span>;
const GrowthIcon = () => <span className="text-2xl">📈</span>;
const ChevronIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AIIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

interface SnapshotCardProps {
  icon: React.ReactNode;
  title: string;
  summary: string;
  actionText: string;
  actionVariant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface HomeDashboardProps {
  onNavigateToNutrition?: () => void;
  onNavigateToSymptomInsights?: (symptomName: string, severity: number, date: string) => void;
  onNavigateToAlerts?: () => void;
  onNavigateToCareTeam?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToGrowthDevelopment?: () => void;
}

const SnapshotCard: React.FC<SnapshotCardProps> = ({
  icon,
  title,
  summary,
  actionText,
  actionVariant = 'secondary',
  onClick
}) => (
  <div className="card mb-4">
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
        className={`btn-${actionVariant} text-sm`}
      >
        {actionText}
      </button>
    </div>
  </div>
);

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigateToNutrition, onNavigateToSymptomInsights, onNavigateToAlerts, onNavigateToCareTeam, onNavigateToProfile, onNavigateToGrowthDevelopment }) => {
  const [currentTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  const [isLogSymptomModalOpen, setIsLogSymptomModalOpen] = useState(false);

  const greeting = `Good ${currentTime}, Jamie's Mom!`;

  const handleLogSymptom = () => {
    setIsLogSymptomModalOpen(true);
  };

  const handleCloseLogSymptomModal = () => {
    setIsLogSymptomModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AvatarIcon />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Jamie</h1>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                PMS
              </span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronIcon />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Personalized Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>
        </div>

        {/* Today's Snapshot Cards */}
        <div className="space-y-4">
          <SnapshotCard
            icon={<SmileyIcon mood="happy" />}
            title="Symptom Status"
            summary="No new symptoms logged"
            actionText="Log Symptom"
            actionVariant="primary"
            onClick={handleLogSymptom}
          />

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
      </main>

      {/* AI Assistant Bubble */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <AIIcon />
      </button>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center py-2 px-3 text-indigo-600">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            className="flex flex-col items-center py-2 px-3 text-gray-400"
            onClick={handleLogSymptom}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Log & Track</span>
          </button>
          
          <button 
            className="flex flex-col items-center py-2 px-3 text-gray-400"
            onClick={onNavigateToNutrition}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="text-xs">Nutrition</span>
          </button>
          
          <button 
            className="flex flex-col items-center py-2 px-3 text-gray-400"
            onClick={onNavigateToCareTeam}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Care Team</span>
          </button>
          
          <button 
            className="flex flex-col items-center py-2 px-3 text-gray-400"
            onClick={onNavigateToProfile}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Log Symptom Modal */}
      <LogSymptomModal 
        isOpen={isLogSymptomModalOpen}
        onClose={handleCloseLogSymptomModal}
      />
    </div>
  );
};

export default HomeDashboard; 