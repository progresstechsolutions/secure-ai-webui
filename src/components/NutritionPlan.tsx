import React, { useState } from 'react';

// Icon components (matching the style from HomeDashboard)
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const AvatarIcon = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
    J
  </div>
);

const PlateIcon = () => <span className="text-2xl">🍽️</span>;
const WaterIcon = () => <span className="text-2xl">💧</span>;
const CalorieIcon = () => <span className="text-2xl">🔥</span>;
const ProteinIcon = () => <span className="text-2xl">🥩</span>;
const FiberIcon = () => <span className="text-2xl">🌾</span>;
const VitaminIcon = () => <span className="text-2xl">🥬</span>;
const IronIcon = () => <span className="text-lg">⚡</span>;
const OmegaIcon = () => <span className="text-lg">🐟</span>;
const CalciumIcon = () => <span className="text-lg">🥛</span>;
const VitaminDIcon = () => <span className="text-lg">☀️</span>;
const RecipeIcon = () => <span className="text-lg">📖</span>;
const SwapIcon = () => <span className="text-lg">🔄</span>;
const CheckIcon = () => <span className="text-lg">✓</span>;
const PlusIcon = () => <span className="text-lg">➕</span>;

interface NutritionPlanProps {
  onBack: () => void;
  onNavigateToRecipeLibrary?: (mealType?: string) => void;
  onNavigateToSymptomInsights?: (symptomName: string, severity: number, date: string) => void;
}

const NutritionPlan: React.FC<NutritionPlanProps> = ({ onBack, onNavigateToRecipeLibrary, onNavigateToSymptomInsights }) => {
  const [expandedNutrients, setExpandedNutrients] = useState(false);

  // Sample nutrition data with more detailed nutrient tracking
  const nutritionData = {
    calories: { current: 850, target: 1800, unit: 'cal' },
    protein: { current: 45, target: 80, unit: 'g' },
    fiber: { current: 12, target: 25, unit: 'g' },
    water: { current: 4, target: 8, unit: 'glasses' },
    calcium: { current: 800, target: 1000, unit: 'mg', percentage: 80 },
    vitaminD: { current: 12, target: 20, unit: 'IU', percentage: 60 },
    iron: { current: 14, target: 18, unit: 'mg', percentage: 78 },
    omega3: { current: 1.2, target: 1.6, unit: 'g', percentage: 75 }
  };

  const meals = {
    breakfast: {
      name: 'Breakfast',
      time: '8:00 AM',
      items: [
        { 
          name: 'Oatmeal with berries', 
          calories: 320, 
          protein: 12, 
          fiber: 8,
          icon: '🥣',
          nutrients: ['Iron', 'Fiber'],
          recipe: 'Berry Oatmeal Bowl'
        },
        { 
          name: 'Greek yogurt', 
          calories: 150, 
          protein: 15, 
          fiber: 0,
          icon: '🥛',
          nutrients: ['Protein', 'Calcium'],
          recipe: 'Greek Yogurt Parfait'
        },
        { 
          name: 'Banana', 
          calories: 105, 
          protein: 1, 
          fiber: 3,
          icon: '🍌',
          nutrients: ['Potassium', 'Fiber'],
          recipe: null
        }
      ],
      totalCalories: 575,
      completed: true
    },
    lunch: {
      name: 'Lunch',
      time: '12:30 PM',
      items: [
        { 
          name: 'Grilled chicken salad', 
          calories: 280, 
          protein: 35, 
          fiber: 6,
          icon: '🥗',
          nutrients: ['Protein', 'Iron'],
          recipe: 'Grilled Chicken Caesar Salad'
        },
        { 
          name: 'Mixed greens', 
          calories: 25, 
          protein: 2, 
          fiber: 2,
          icon: '🥬',
          nutrients: ['Vitamin K', 'Folate'],
          recipe: 'Mixed Greens Salad'
        },
        { 
          name: 'Olive oil dressing', 
          calories: 120, 
          protein: 0, 
          fiber: 0,
          icon: '🫒',
          nutrients: ['Healthy Fats'],
          recipe: 'Homemade Olive Oil Dressing'
        }
      ],
      totalCalories: 425,
      completed: false
    },
    dinner: {
      name: 'Dinner',
      time: '6:30 PM',
      items: [
        { 
          name: 'Salmon with quinoa', 
          calories: 450, 
          protein: 35, 
          fiber: 8,
          icon: '🐟',
          nutrients: ['Omega-3', 'Protein'],
          recipe: 'Baked Salmon with Quinoa'
        },
        { 
          name: 'Steamed broccoli', 
          calories: 55, 
          protein: 4, 
          fiber: 5,
          icon: '🥦',
          nutrients: ['Vitamin C', 'Fiber'],
          recipe: 'Steamed Broccoli'
        },
        { 
          name: 'Sweet potato', 
          calories: 180, 
          protein: 4, 
          fiber: 4,
          icon: '🍠',
          nutrients: ['Vitamin A', 'Fiber'],
          recipe: 'Roasted Sweet Potato'
        }
      ],
      totalCalories: 685,
      completed: false
    },
    snacks: {
      name: 'Snacks',
      time: 'Throughout day',
      items: [
        { 
          name: 'Almonds', 
          calories: 160, 
          protein: 6, 
          fiber: 3,
          icon: '🥜',
          nutrients: ['Healthy Fats', 'Vitamin E'],
          recipe: null
        },
        { 
          name: 'Apple', 
          calories: 95, 
          protein: 0, 
          fiber: 4,
          icon: '🍎',
          nutrients: ['Fiber', 'Vitamin C'],
          recipe: null
        }
      ],
      totalCalories: 255,
      completed: false
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNutrientIcon = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case 'iron': return <IronIcon />;
      case 'omega-3': return <OmegaIcon />;
      case 'calcium': return <CalciumIcon />;
      case 'vitamin d': return <VitaminDIcon />;
      default: return <span className="text-sm">•</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BackArrowIcon />
            </button>
            <div className="flex items-center space-x-2">
              <PlateIcon />
              <h1 className="text-lg font-semibold text-gray-900">Today's Nutrition Plan for Jamie</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AvatarIcon />
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Switch Child
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Daily Nutrient Goals Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Daily Nutrient Goals</h2>
            <button 
              onClick={() => setExpandedNutrients(!expandedNutrients)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {expandedNutrients ? 'Show Less' : 'Show More'}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CalciumIcon />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Calcium</span>
                    <span className="text-gray-500">{nutritionData.calcium.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(nutritionData.calcium.percentage)}`}
                      style={{ width: `${nutritionData.calcium.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <VitaminDIcon />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Vitamin D</span>
                    <span className="text-gray-500">{nutritionData.vitaminD.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(nutritionData.vitaminD.percentage)}`}
                      style={{ width: `${nutritionData.vitaminD.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {expandedNutrients && (
                <>
                  <div className="flex items-center space-x-2">
                    <IronIcon />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Iron</span>
                        <span className="text-gray-500">{nutritionData.iron.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(nutritionData.iron.percentage)}`}
                          style={{ width: `${nutritionData.iron.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <OmegaIcon />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Omega-3</span>
                        <span className="text-gray-500">{nutritionData.omega3.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(nutritionData.omega3.percentage)}`}
                          style={{ width: `${nutritionData.omega3.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meal Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</h2>
          
          {Object.entries(meals).map(([mealKey, meal]) => (
            <div 
              key={mealKey}
              className={`bg-white rounded-lg p-4 shadow-sm border-2 transition-colors ${
                meal.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                  <p className="text-sm text-gray-500">{meal.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">{meal.totalCalories} cal</span>
                  {meal.completed && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {meal.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 text-2xl">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className="text-xs text-gray-500">{item.calories} cal</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.nutrients.map((nutrient, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {getNutrientIcon(nutrient)}
                            <span>{nutrient}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{item.protein}g protein</span>
                        <span>•</span>
                        <span>{item.fiber}g fiber</span>
                      </div>
                    </div>
                                         <div className="flex flex-col space-y-1">
                       {item.recipe && (
                         <button 
                           onClick={() => onNavigateToRecipeLibrary?.(mealKey)}
                           className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center space-x-1"
                         >
                           <RecipeIcon />
                           <span>Recipe</span>
                         </button>
                       )}
                       <button className="text-gray-600 hover:text-gray-700 text-xs font-medium flex items-center space-x-1">
                         <SwapIcon />
                         <span>Swap</span>
                       </button>
                     </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
                  <PlusIcon />
                  <span>Log Additional Food</span>
                </button>
                <button className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${
                  meal.completed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}>
                  <CheckIcon />
                  <span>{meal.completed ? 'Completed' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

                 {/* Personalized Suggestions */}
         <div className="mt-6">
           <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalized Suggestions</h2>
           <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
             <div className="flex items-start space-x-3">
               <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                 <span className="text-purple-600 text-sm font-bold">AI</span>
               </div>
               <div className="flex-1">
                 <p className="text-sm font-medium text-gray-900 mb-1">Based on Jamie's recent symptoms, consider adding:</p>
                 <ul className="text-xs text-gray-600 space-y-1">
                   <li>• Dark chocolate (70%+) for magnesium and mood support</li>
                   <li>• Chamomile tea to help with relaxation</li>
                   <li>• Extra hydration with electrolyte-rich foods</li>
                 </ul>
                 <button 
                   onClick={() => onNavigateToSymptomInsights?.('Fatigue', 3, 'Today')}
                   className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                 >
                   Why this recommendation? →
                 </button>
               </div>
             </div>
           </div>
         </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-2">
                <PlusIcon />
                <span className="text-sm font-medium text-gray-900">Log Meal</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Add something not on the plan</p>
            </button>
            <button className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-2">
                <RecipeIcon />
                <span className="text-sm font-medium text-gray-900">View Full Week</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">See weekly nutrition plan</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionPlan; 