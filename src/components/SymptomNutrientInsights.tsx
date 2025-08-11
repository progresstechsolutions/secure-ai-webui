import React, { useState } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IronIcon = () => <span className="text-sm">⚡</span>;
const CalciumIcon = () => <span className="text-sm">🥛</span>;
const OmegaIcon = () => <span className="text-sm">🐟</span>;
const MagnesiumIcon = () => <span className="text-sm">💎</span>;
const VitaminDIcon = () => <span className="text-sm">☀️</span>;
const VitaminBIcon = () => <span className="text-sm">🌾</span>;

interface SymptomNutrientInsightsProps {
  onBack: () => void;
  symptomName?: string;
  severity?: number;
  date?: string;
}

interface NutrientInsight {
  nutrient: string;
  icon: React.ReactNode;
  description: string;
  scientificBasis: string;
  foodSources: string[];
  dailyRecommendation: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

const SymptomNutrientInsights: React.FC<SymptomNutrientInsightsProps> = ({ 
  onBack, 
  symptomName = 'Fatigue', 
  severity = 3, 
  date = 'Today' 
}) => {
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);

  // Symptom-nutrient mapping with scientific insights
  const symptomNutrientMap: Record<string, NutrientInsight[]> = {
    'Fatigue': [
      {
        nutrient: 'Iron',
        icon: <IronIcon />,
        description: 'Iron deficiency is a leading cause of fatigue, especially in menstruating individuals',
        scientificBasis: 'Iron is essential for oxygen transport in blood. Low iron reduces oxygen delivery to tissues, causing fatigue and weakness.',
        foodSources: ['Lean red meat', 'Spinach', 'Lentils', 'Fortified cereals', 'Pumpkin seeds'],
        dailyRecommendation: '18mg for menstruating individuals',
        color: 'red',
        priority: 'high'
      },
      {
        nutrient: 'Vitamin B12',
        icon: <VitaminBIcon />,
        description: 'B12 deficiency can cause severe fatigue and neurological symptoms',
        scientificBasis: 'Vitamin B12 is crucial for energy production and red blood cell formation. Deficiency leads to megaloblastic anemia.',
        foodSources: ['Fish', 'Eggs', 'Dairy products', 'Fortified plant milks', 'Nutritional yeast'],
        dailyRecommendation: '2.4mcg',
        color: 'blue',
        priority: 'high'
      },
      {
        nutrient: 'Magnesium',
        icon: <MagnesiumIcon />,
        description: 'Magnesium supports energy production and muscle function',
        scientificBasis: 'Magnesium is a cofactor in over 300 enzymatic reactions, including those involved in energy metabolism.',
        foodSources: ['Dark chocolate', 'Nuts and seeds', 'Leafy greens', 'Whole grains', 'Avocados'],
        dailyRecommendation: '320-420mg',
        color: 'purple',
        priority: 'medium'
      }
    ],
    'Irritability': [
      {
        nutrient: 'Omega-3',
        icon: <OmegaIcon />,
        description: 'Omega-3 fatty acids support brain health and mood regulation',
        scientificBasis: 'Omega-3s are essential for brain cell membrane structure and neurotransmitter function. Low levels are linked to mood disorders.',
        foodSources: ['Salmon', 'Walnuts', 'Chia seeds', 'Flaxseeds', 'Sardines'],
        dailyRecommendation: '1.1-1.6g',
        color: 'green',
        priority: 'high'
      },
      {
        nutrient: 'Magnesium',
        icon: <MagnesiumIcon />,
        description: 'Magnesium has calming effects on the nervous system',
        scientificBasis: 'Magnesium acts as a natural muscle relaxant and helps regulate stress hormones like cortisol.',
        foodSources: ['Dark chocolate', 'Almonds', 'Spinach', 'Bananas', 'Pumpkin seeds'],
        dailyRecommendation: '320-420mg',
        color: 'purple',
        priority: 'medium'
      },
      {
        nutrient: 'Vitamin D',
        icon: <VitaminDIcon />,
        description: 'Vitamin D deficiency is associated with mood disorders',
        scientificBasis: 'Vitamin D receptors are found throughout the brain and play a role in serotonin production and mood regulation.',
        foodSources: ['Fatty fish', 'Egg yolks', 'Fortified dairy', 'Mushrooms', 'Sunlight exposure'],
        dailyRecommendation: '600-800 IU',
        color: 'yellow',
        priority: 'medium'
      }
    ],
    'Headache': [
      {
        nutrient: 'Magnesium',
        icon: <MagnesiumIcon />,
        description: 'Magnesium deficiency is linked to migraines and tension headaches',
        scientificBasis: 'Magnesium helps relax blood vessels and muscles. Deficiency can cause vasospasms and muscle tension.',
        foodSources: ['Dark chocolate', 'Nuts', 'Seeds', 'Leafy greens', 'Whole grains'],
        dailyRecommendation: '320-420mg',
        color: 'purple',
        priority: 'high'
      },
      {
        nutrient: 'Vitamin B2 (Riboflavin)',
        icon: <VitaminBIcon />,
        description: 'Riboflavin supplementation can reduce migraine frequency',
        scientificBasis: 'Riboflavin is essential for mitochondrial energy production. Migraines may be related to mitochondrial dysfunction.',
        foodSources: ['Dairy products', 'Eggs', 'Lean meats', 'Almonds', 'Mushrooms'],
        dailyRecommendation: '1.1-1.3mg',
        color: 'blue',
        priority: 'medium'
      }
    ],
    'GI Issue': [
      {
        nutrient: 'Magnesium',
        icon: <MagnesiumIcon />,
        description: 'Magnesium helps relax digestive muscles and supports gut health',
        scientificBasis: 'Magnesium acts as a natural muscle relaxant and helps maintain proper gut motility.',
        foodSources: ['Leafy greens', 'Nuts', 'Seeds', 'Whole grains', 'Dark chocolate'],
        dailyRecommendation: '320-420mg',
        color: 'purple',
        priority: 'medium'
      },
      {
        nutrient: 'Probiotics',
        icon: <span className="text-sm">🦠</span>,
        description: 'Beneficial bacteria support digestive health and immune function',
        scientificBasis: 'Probiotics help maintain gut microbiome balance and support digestive enzyme production.',
        foodSources: ['Yogurt', 'Kefir', 'Sauerkraut', 'Kimchi', 'Miso'],
        dailyRecommendation: 'Varies by strain',
        color: 'green',
        priority: 'medium'
      }
    ],
    'Mood swings': [
      {
        nutrient: 'Omega-3',
        icon: <OmegaIcon />,
        description: 'Essential fatty acids support brain health and emotional stability',
        scientificBasis: 'Omega-3s are crucial for brain cell membrane integrity and neurotransmitter function.',
        foodSources: ['Fatty fish', 'Walnuts', 'Chia seeds', 'Flaxseeds', 'Hemp seeds'],
        dailyRecommendation: '1.1-1.6g',
        color: 'green',
        priority: 'high'
      },
      {
        nutrient: 'Vitamin D',
        icon: <VitaminDIcon />,
        description: 'Vitamin D plays a role in serotonin production and mood regulation',
        scientificBasis: 'Vitamin D receptors in the brain influence serotonin synthesis and mood-regulating pathways.',
        foodSources: ['Fatty fish', 'Egg yolks', 'Fortified foods', 'Sunlight exposure'],
        dailyRecommendation: '600-800 IU',
        color: 'yellow',
        priority: 'medium'
      }
    ]
  };

  const insights = symptomNutrientMap[symptomName] || symptomNutrientMap['Fatigue'];

  const getSeverityColor = (level: number) => {
    if (level <= 2) return 'text-green-600 bg-green-100';
    if (level <= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityText = (level: number) => {
    if (level <= 2) return 'Mild';
    if (level <= 3) return 'Moderate';
    return 'Severe';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BackArrowIcon />
          </button>
          <div className="flex items-center space-x-2">
            <LightbulbIcon />
            <h1 className="text-lg font-semibold text-gray-900 lg:text-xl">Symptom Insights</h1>
          </div>
        </div>
      </header>

      {/* Symptom Summary */}
      <div className="px-4 py-4 bg-white border-b border-gray-200 lg:px-8 lg:py-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 lg:text-2xl">{symptomName}</h2>
            <p className="text-sm text-gray-500 lg:text-base">Logged on {date}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium lg:text-base lg:px-4 lg:py-2 ${getSeverityColor(severity)}`}>
            {getSeverityText(severity)} ({severity}/5)
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 lg:px-8 lg:py-8 lg:max-w-7xl lg:mx-auto">
        {/* Educational Header */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 lg:p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center lg:w-10 lg:h-10">
                <BookIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 lg:text-base">Why Nutrition Matters</h3>
                <p className="text-xs text-gray-600 lg:text-sm">
                  {symptomName} can be influenced by nutrient deficiencies. Understanding these connections helps you make informed dietary choices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrient Insights */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">Key Nutrients for {symptomName}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {insights.map((insight, index) => (
              <div 
                key={insight.nutrient}
                className={`bg-white rounded-lg p-4 shadow-sm border-2 transition-all cursor-pointer lg:p-6 ${
                  selectedNutrient === insight.nutrient 
                    ? 'border-indigo-300 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${getPriorityColor(insight.priority)}`}
                onClick={() => setSelectedNutrient(selectedNutrient === insight.nutrient ? null : insight.nutrient)}
              >
                {/* Nutrient Header */}
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {insight.icon}
                      <h4 className="font-semibold text-gray-900 lg:text-lg">{insight.nutrient}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium lg:text-sm ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.priority} priority
                    </span>
                  </div>
                  <ArrowRightIcon />
                </div>

                {/* Basic Description */}
                <p className="text-sm text-gray-600 mb-3 lg:text-base lg:mb-4">{insight.description}</p>

                {/* Expanded Details */}
                {selectedNutrient === insight.nutrient && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 lg:mt-6 lg:pt-6 lg:space-y-6">
                    {/* Scientific Basis */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 lg:text-base">Scientific Basis</h5>
                      <p className="text-xs text-gray-600 leading-relaxed lg:text-sm">{insight.scientificBasis}</p>
                    </div>

                    {/* Food Sources */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 lg:text-base">Best Food Sources</h5>
                      <div className="flex flex-wrap gap-2">
                        {insight.foodSources.map((food, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full lg:text-sm"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Daily Recommendation */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-1 lg:text-base">Daily Recommendation</h5>
                      <p className="text-xs text-gray-600 lg:text-sm">{insight.dailyRecommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 lg:mt-12 lg:pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl lg:mb-6">Take Action</h3>
          
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors lg:py-4 lg:px-6 lg:text-base">
              View Recipes Rich in These Nutrients
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors lg:py-4 lg:px-6 lg:text-base">
              Add to Nutrition Plan
            </button>
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors lg:py-4 lg:px-6 lg:text-base">
              Set Reminder to Check Progress
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-6 lg:mt-8">
          <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 lg:text-base lg:mb-3">Learn More</h4>
            <div className="space-y-2 text-xs text-gray-600 lg:text-sm">
              <p>• Track your nutrient intake to see if you're meeting daily recommendations</p>
              <p>• Consider working with a healthcare provider for personalized advice</p>
              <p>• Monitor symptom changes as you adjust your nutrition</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SymptomNutrientInsights; 