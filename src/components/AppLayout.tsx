import React from 'react';
import TopNavigationBar from './TopNavigationBar';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigateToHome: () => void;
  onNavigateToNutrition: () => void;
  onNavigateToCareTeam: () => void;
  onNavigateToProfile: () => void;
  onLogSymptom?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onNavigateToHome,
  onNavigateToNutrition,
  onNavigateToCareTeam,
  onNavigateToProfile,
  onLogSymptom
}) => {
  const getActiveTab = (): 'home' | 'nutrition' | 'careTeam' | 'profile' | 'log' => {
    switch (currentView) {
      case 'home':
        return 'home';
      case 'nutrition':
      case 'recipeLibrary':
        return 'nutrition';
      case 'careTeam':
        return 'careTeam';
      case 'profile':
        return 'profile';
      case 'log':
      case 'trackersDashboard':
        return 'log';
      default:
        return 'home';
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <TopNavigationBar />
      
      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* AI Assistant Bubble */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-40">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <button 
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'
            }`}
            onClick={onNavigateToHome}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === 'log' ? 'text-indigo-600' : 'text-gray-400'
            }`}
            onClick={onLogSymptom}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Log & Track</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === 'nutrition' ? 'text-indigo-600' : 'text-gray-400'
            }`}
            onClick={onNavigateToNutrition}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
                            <span className="text-xs">NutriMed</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === 'careTeam' ? 'text-indigo-600' : 'text-gray-400'
            }`}
            onClick={onNavigateToCareTeam}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Care Team</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'
            }`}
            onClick={onNavigateToProfile}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout; 