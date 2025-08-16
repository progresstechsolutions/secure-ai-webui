import React from 'react';

interface CareTeamScreenProps {
  onBack: () => void;
}

const CareTeamScreen: React.FC<CareTeamScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
              <h1 className="text-xl font-semibold text-gray-900">Care Team</h1>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Care Team Management</h2>
          <p className="text-gray-600">
            This page will be built in Phase 6. Content coming soon...
          </p>
          </div>
        </div>
    </div>
  );
};

export default CareTeamScreen; 