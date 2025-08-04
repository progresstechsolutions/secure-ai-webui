import React, { useState } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const AvatarIcon = () => (
  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
    J
  </div>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface GrowthDataPoint {
  id: string;
  date: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  notes?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'motor' | 'social' | 'cognitive' | 'adaptive';
  status: 'achieved' | 'in_progress' | 'not_yet';
  dateAchieved?: string;
  notes?: string;
  isPMSSpecific?: boolean;
}

interface GrowthDevelopmentScreenProps {
  onBack: () => void;
  onNavigateToNutrition?: () => void;
  onNavigateToSymptomLogs?: () => void;
}

const GrowthDevelopmentScreen: React.FC<GrowthDevelopmentScreenProps> = ({ onBack, onNavigateToNutrition, onNavigateToSymptomLogs }) => {
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<GrowthDataPoint | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'height' | 'weight' | 'headCircumference'>('height');
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Sample growth data
  const growthData: GrowthDataPoint[] = [
    { id: '1', date: '2024-01-15', height: 120, weight: 22, headCircumference: 48, notes: 'Regular checkup' },
    { id: '2', date: '2024-02-15', height: 121, weight: 22.5, headCircumference: 48.2, notes: 'Monthly measurement' },
    { id: '3', date: '2024-03-15', height: 122, weight: 23, headCircumference: 48.5, notes: 'Growth spurt noted' },
    { id: '4', date: '2024-04-15', height: 123, weight: 23.2, headCircumference: 48.7, notes: 'Steady growth' },
  ];

  // Sample milestones data
  const milestones: Milestone[] = [
    { 
      id: '1', 
      title: 'First Words', 
      description: 'Says first meaningful words', 
      category: 'communication', 
      status: 'achieved', 
      dateAchieved: '2024-02-10',
      notes: 'Said "mama" and "dada" clearly',
      isPMSSpecific: false
    },
    { 
      id: '2', 
      title: 'Walking Unaided', 
      description: 'Walks independently without support', 
      category: 'motor', 
      status: 'achieved', 
      dateAchieved: '2024-01-15',
      notes: 'Took first steps across the living room',
      isPMSSpecific: false
    },
    { 
      id: '3', 
      title: 'Eye Contact', 
      description: 'Makes consistent eye contact during interactions', 
      category: 'social', 
      status: 'in_progress',
      notes: 'Improving but still inconsistent',
      isPMSSpecific: true
    },
    { 
      id: '4', 
      title: 'Object Permanence', 
      description: 'Understands objects exist when out of sight', 
      category: 'cognitive', 
      status: 'not_yet',
      isPMSSpecific: false
    },
    { 
      id: '5', 
      title: 'Self-Feeding', 
      description: 'Feeds self with spoon or fingers', 
      category: 'adaptive', 
      status: 'in_progress',
      notes: 'Can pick up food but needs help with utensils',
      isPMSSpecific: false
    },
  ];

  const handleAddMeasurement = () => {
    setIsAddMeasurementModalOpen(true);
  };

  const handleCloseAddMeasurementModal = () => {
    setIsAddMeasurementModalOpen(false);
  };

  const handleDataPointClick = (dataPoint: GrowthDataPoint) => {
    setSelectedDataPoint(dataPoint);
  };

  const handleCloseDataPointModal = () => {
    setSelectedDataPoint(null);
  };

  const handleAddMilestone = () => {
    setIsAddMilestoneModalOpen(true);
  };

  const handleCloseAddMilestoneModal = () => {
    setIsAddMilestoneModalOpen(false);
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  const handleCloseMilestoneModal = () => {
    setSelectedMilestone(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getPercentile = (value: number, metric: string) => {
    // Mock percentile calculation - in real app this would be based on growth charts
    const percentiles: Record<string, Record<number, number>> = {
      height: { 120: 25, 121: 30, 122: 35, 123: 40 },
      weight: { 22: 30, 22.5: 35, 23: 40, 23.2: 42 },
      headCircumference: { 48: 35, 48.2: 37, 48.5: 40, 48.7: 42 }
    };
    return percentiles[metric]?.[value] || 50;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved':
        return <span className="text-green-600 text-lg">✔️</span>;
      case 'in_progress':
        return <span className="text-yellow-600 text-lg">⏳</span>;
      case 'not_yet':
        return <span className="text-red-600 text-lg">❌</span>;
      default:
        return <span className="text-gray-400 text-lg">○</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication':
        return 'bg-blue-100 text-blue-800';
      case 'motor':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'cognitive':
        return 'bg-orange-100 text-orange-800';
      case 'adaptive':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Auto-generate insights based on growth data
  const generateInsights = () => {
    if (growthData.length < 2) {
      return {
        summary: "Add more measurements to generate insights",
        status: 'neutral',
        recommendations: []
      };
    }

    const recentGrowth = growthData.slice(-2);
    const heightChange = recentGrowth[1].height! - recentGrowth[0].height!;
    const weightChange = recentGrowth[1].weight! - recentGrowth[0].weight!;
    
    // Calculate growth rate (cm per month)
    const daysBetween = (new Date(recentGrowth[1].date).getTime() - new Date(recentGrowth[0].date).getTime()) / (1000 * 60 * 60 * 24);
    const monthsBetween = daysBetween / 30;
    const monthlyHeightGrowth = heightChange / monthsBetween;
    const monthlyWeightGrowth = weightChange / monthsBetween;

    // Determine growth status
    let summary = "";
    let status: 'positive' | 'neutral' | 'concern' = 'neutral';
    let recommendations: string[] = [];

    if (monthlyHeightGrowth >= 0.5 && monthlyWeightGrowth >= 0.2) {
      summary = "Jamie's growth is steady and on track.";
      status = 'positive';
      recommendations = ["Continue current nutrition plan", "Monitor for any changes"];
    } else if (monthlyHeightGrowth < 0.3 || monthlyWeightGrowth < 0.1) {
      summary = "Growth slowed this month — review nutrition or consult care team.";
      status = 'concern';
      recommendations = ["Review nutrition plan", "Check for recent symptoms", "Consider consulting care team"];
    } else {
      summary = "Growth is progressing, but monitor for consistency.";
      status = 'neutral';
      recommendations = ["Continue monitoring", "Ensure consistent nutrition"];
    }

    return { summary, status, recommendations };
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Growth & Development</h1>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <AvatarIcon />
              <span className="text-sm text-gray-600">Jamie</span>
            </div>
          </div>
          <button
            onClick={handleAddMeasurement}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            title="Add Measurement"
          >
            <PlusIcon />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Metric Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-lg p-1 border border-gray-200">
            {[
              { key: 'height', label: 'Height', color: 'bg-blue-500' },
              { key: 'weight', label: 'Weight', color: 'bg-green-500' },
              { key: 'headCircumference', label: 'Head Circ.', color: 'bg-purple-500' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Growth Chart</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Height</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Head Circ.</span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="relative h-64 bg-gray-50 rounded-lg border border-gray-200 p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
              <span>125</span>
              <span>120</span>
              <span>115</span>
              <span>110</span>
            </div>

            {/* Chart lines */}
            <div className="ml-12 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-gray-200"></div>
                ))}
              </div>

              {/* Data points and lines */}
              <div className="relative h-full">
                {/* Height line */}
                <svg className="absolute inset-0 w-full h-full">
                  <polyline
                    points={growthData.map((point, index) => 
                      `${(index / (growthData.length - 1)) * 100},${100 - ((point.height! - 110) / 15) * 100}`
                    ).join(' ')}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  {growthData.map((point, index) => (
                    <circle
                      key={point.id}
                      cx={`${(index / (growthData.length - 1)) * 100}%`}
                      cy={`${100 - ((point.height! - 110) / 15) * 100}%`}
                      r="4"
                      fill="#3B82F6"
                      className="cursor-pointer hover:r-6 transition-all"
                      onClick={() => handleDataPointClick(point)}
                    />
                  ))}
                </svg>

                {/* Weight line */}
                <svg className="absolute inset-0 w-full h-full">
                  <polyline
                    points={growthData.map((point, index) => 
                      `${(index / (growthData.length - 1)) * 100},${100 - ((point.weight! - 20) / 5) * 100}`
                    ).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  {growthData.map((point, index) => (
                    <circle
                      key={`weight-${point.id}`}
                      cx={`${(index / (growthData.length - 1)) * 100}%`}
                      cy={`${100 - ((point.weight! - 20) / 5) * 100}%`}
                      r="4"
                      fill="#10B981"
                      className="cursor-pointer hover:r-6 transition-all"
                      onClick={() => handleDataPointClick(point)}
                    />
                  ))}
                </svg>

                {/* Head circumference line */}
                <svg className="absolute inset-0 w-full h-full">
                  <polyline
                    points={growthData.map((point, index) => 
                      `${(index / (growthData.length - 1)) * 100},${100 - ((point.headCircumference! - 47) / 3) * 100}`
                    ).join(' ')}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                  />
                  {growthData.map((point, index) => (
                    <circle
                      key={`head-${point.id}`}
                      cx={`${(index / (growthData.length - 1)) * 100}%`}
                      cy={`${100 - ((point.headCircumference! - 47) / 3) * 100}%`}
                      r="4"
                      fill="#8B5CF6"
                      className="cursor-pointer hover:r-6 transition-all"
                      onClick={() => handleDataPointClick(point)}
                    />
                  ))}
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
                {growthData.map((point) => (
                  <span key={point.id}>{formatDate(point.date)}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Tap on data points to view details
          </p>
        </div>

                 {/* Recent Measurements */}
         <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Measurements</h3>
           <div className="space-y-3">
             {growthData.slice().reverse().map((point) => (
               <div 
                 key={point.id}
                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => handleDataPointClick(point)}
               >
                 <div>
                   <p className="text-sm font-medium text-gray-900">{formatDate(point.date)}</p>
                   <p className="text-xs text-gray-600">{point.notes}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-gray-900">
                     {point.height}cm • {point.weight}kg • {point.headCircumference}cm
                   </p>
                   <p className="text-xs text-gray-500">
                     {getPercentile(point.height!, 'height')}% • {getPercentile(point.weight!, 'weight')}% • {getPercentile(point.headCircumference!, 'headCircumference')}%
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>

                   {/* Developmental Milestones */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Developmental Milestones</h3>
              <button
                onClick={handleAddMilestone}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm flex items-center space-x-2"
              >
                <PlusIcon />
                <span>Add Milestone</span>
              </button>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(milestone.category)}`}>
                        {milestone.category}
                      </span>
                      {milestone.isPMSSpecific && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          PMS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                    {milestone.dateAchieved && (
                      <p className="text-xs text-green-600 font-medium">
                        Achieved: {formatDate(milestone.dateAchieved)}
                      </p>
                    )}
                    {milestone.notes && (
                      <p className="text-xs text-gray-500 mt-1">{milestone.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights & Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Trends</h3>
            
            {/* Summary Card */}
            <div className={`rounded-lg p-4 mb-4 ${
              insights.status === 'positive' 
                ? 'bg-green-50 border border-green-200' 
                : insights.status === 'concern' 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  insights.status === 'positive' 
                    ? 'bg-green-100' 
                    : insights.status === 'concern' 
                    ? 'bg-yellow-100' 
                    : 'bg-blue-100'
                }`}>
                  {insights.status === 'positive' && (
                    <span className="text-green-600 text-lg">📈</span>
                  )}
                  {insights.status === 'concern' && (
                    <span className="text-yellow-600 text-lg">⚠️</span>
                  )}
                  {insights.status === 'neutral' && (
                    <span className="text-blue-600 text-lg">📊</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-2">{insights.summary}</p>
                  {insights.recommendations.length > 0 && (
                    <div className="space-y-1">
                      {insights.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-gray-600">• {rec}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="space-y-3">
              <button
                onClick={onNavigateToNutrition}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-sm">🥗</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">See related nutrition changes</p>
                    <p className="text-xs text-gray-600">Review Jamie's nutrition plan and recent meals</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={onNavigateToSymptomLogs}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📋</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">View recent symptoms</p>
                    <p className="text-xs text-gray-600">Check for any symptoms that might affect growth</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
      </main>

      {/* Add Measurement Modal */}
      {isAddMeasurementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Measurement</h2>
                <button
                  onClick={handleCloseAddMeasurementModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Record Jamie's latest growth measurements</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 123.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 23.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Head Circumference (cm) - Optional</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 48.7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes - Optional</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Any observations or notes about this measurement..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseAddMeasurementModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Save Measurement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Point Details Modal */}
      {selectedDataPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Measurement Details</h2>
                <button
                  onClick={handleCloseDataPointModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{formatDate(selectedDataPoint.date)}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedDataPoint.height}</p>
                  <p className="text-sm text-gray-600">Height (cm)</p>
                  <p className="text-xs text-gray-500">{getPercentile(selectedDataPoint.height!, 'height')}% percentile</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedDataPoint.weight}</p>
                  <p className="text-sm text-gray-600">Weight (kg)</p>
                  <p className="text-xs text-gray-500">{getPercentile(selectedDataPoint.weight!, 'weight')}% percentile</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedDataPoint.headCircumference}</p>
                  <p className="text-sm text-gray-600">Head Circ. (cm)</p>
                  <p className="text-xs text-gray-500">{getPercentile(selectedDataPoint.headCircumference!, 'headCircumference')}% percentile</p>
                </div>
              </div>
              
              {selectedDataPoint.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{selectedDataPoint.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseDataPointModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Close
                </button>
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Edit
                </button>
              </div>
            </div>
                     </div>
         </div>
       )}

       {/* Add Milestone Modal */}
       {isAddMilestoneModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-md w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-gray-900">Add Milestone</h2>
                 <button
                   onClick={handleCloseAddMilestoneModal}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <CloseIcon />
                 </button>
               </div>
               <p className="text-sm text-gray-600 mt-2">Track Jamie's developmental progress</p>
             </div>

             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Milestone</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                   <option value="">Select a milestone...</option>
                   <option value="first_words">First Words</option>
                   <option value="walking_unaided">Walking Unaided</option>
                   <option value="eye_contact">Eye Contact</option>
                   <option value="object_permanence">Object Permanence</option>
                   <option value="self_feeding">Self-Feeding</option>
                   <option value="pointing">Pointing</option>
                   <option value="imitation">Imitation</option>
                   <option value="joint_attention">Joint Attention</option>
                   <option value="custom">Custom Milestone</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                   <option value="communication">Communication</option>
                   <option value="motor">Motor</option>
                   <option value="social">Social</option>
                   <option value="cognitive">Cognitive</option>
                   <option value="adaptive">Adaptive</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                 <div className="space-y-2">
                   <label className="flex items-center space-x-3">
                     <input type="radio" name="status" value="achieved" className="text-indigo-600 focus:ring-indigo-500" />
                     <span className="text-sm text-gray-900">✔️ Achieved</span>
                   </label>
                   <label className="flex items-center space-x-3">
                     <input type="radio" name="status" value="in_progress" className="text-indigo-600 focus:ring-indigo-500" />
                     <span className="text-sm text-gray-900">⏳ In Progress</span>
                   </label>
                   <label className="flex items-center space-x-3">
                     <input type="radio" name="status" value="not_yet" className="text-indigo-600 focus:ring-indigo-500" />
                     <span className="text-sm text-gray-900">❌ Not Yet</span>
                   </label>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Date Achieved (if applicable)</label>
                 <input
                   type="date"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                 <textarea
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                   rows={3}
                   placeholder="Any observations or notes about this milestone..."
                 />
               </div>
               <div className="flex items-center space-x-2">
                 <input type="checkbox" id="pms_specific" className="text-indigo-600 focus:ring-indigo-500" />
                 <label htmlFor="pms_specific" className="text-sm text-gray-700">PMS-specific milestone</label>
               </div>

               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleCloseAddMilestoneModal}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Cancel
                 </button>
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                   Save Milestone
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Milestone Details Modal */}
       {selectedMilestone && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-md w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-gray-900">Milestone Details</h2>
                 <button
                   onClick={handleCloseMilestoneModal}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <CloseIcon />
                 </button>
               </div>
               <p className="text-sm text-gray-600 mt-2">{selectedMilestone.title}</p>
             </div>

             <div className="p-6 space-y-4">
               <div className="flex items-center space-x-3">
                 <div className="flex-shrink-0">
                   {getStatusIcon(selectedMilestone.status)}
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-medium text-gray-900">{selectedMilestone.title}</h3>
                   <p className="text-sm text-gray-600">{selectedMilestone.description}</p>
                 </div>
               </div>

               <div className="flex items-center space-x-2">
                 <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedMilestone.category)}`}>
                   {selectedMilestone.category}
                 </span>
                 {selectedMilestone.isPMSSpecific && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                     PMS
                   </span>
                 )}
               </div>

               {selectedMilestone.dateAchieved && (
                 <div className="bg-green-50 p-3 rounded-lg">
                   <p className="text-sm font-medium text-green-800">Achieved on {formatDate(selectedMilestone.dateAchieved)}</p>
                 </div>
               )}

               {selectedMilestone.notes && (
                 <div className="bg-gray-50 p-3 rounded-lg">
                   <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                   <p className="text-sm text-gray-600">{selectedMilestone.notes}</p>
                 </div>
               )}

               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={handleCloseMilestoneModal}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 >
                   Close
                 </button>
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                   Edit
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default GrowthDevelopmentScreen; 