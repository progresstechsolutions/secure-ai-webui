import React, { useState } from 'react';

interface GrowthData {
  date: string;
  height: number;
  weight: number;
  notes: string;
}

interface DevelopmentMilestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  date?: string;
}

interface GrowthDevelopmentScreenProps {
  onBack?: () => void;
  onNavigateToNutrition?: () => void;
  onNavigateToSymptomLogs?: () => void;
}

const GrowthDevelopmentScreen: React.FC<GrowthDevelopmentScreenProps> = ({ 
  onBack,
  onNavigateToNutrition,
  onNavigateToSymptomLogs
}) => {
  const [growthData] = useState<GrowthData[]>([
    { date: '2024-01-15', height: 165, weight: 58, notes: 'Regular checkup' },
    { date: '2024-02-15', height: 166, weight: 59, notes: 'Good progress' },
    { date: '2024-03-15', height: 167, weight: 60, notes: 'Steady growth' },
  ]);

  const [milestones] = useState<DevelopmentMilestone[]>([
    { id: '1', title: 'Regular Exercise', description: 'Maintain 30 min daily activity', achieved: true, date: '2024-01-10' },
    { id: '2', title: 'Balanced Nutrition', description: 'Follow recommended meal plan', achieved: true, date: '2024-02-01' },
    { id: '3', title: 'Stress Management', description: 'Practice relaxation techniques', achieved: false },
    { id: '4', title: 'Sleep Quality', description: 'Maintain 7-8 hours sleep', achieved: false },
  ]);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Growth & Development</h1>
        {onBack && (
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Growth Tracking */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Growth Tracking</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">167 cm</div>
              <div className="text-sm text-gray-600">Current Height</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">60 kg</div>
              <div className="text-sm text-gray-600">Current Weight</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {growthData.map((data, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{data.date}</div>
                  <div className="text-sm text-gray-600">{data.notes}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.height} cm</div>
                  <div className="text-sm text-gray-600">{data.weight} kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Milestones */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Development Milestones</h2>
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.achieved 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {milestone.achieved ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    {milestone.date && (
                      <p className="text-xs text-gray-500 mt-1">Achieved: {milestone.date}</p>
                    )}
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  {milestone.achieved ? 'View Details' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Entry Button */}
      <div className="text-center">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Add New Growth Entry
        </button>
      </div>
    </div>
  );
};

export default GrowthDevelopmentScreen; 