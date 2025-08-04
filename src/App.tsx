import React, { useState } from 'react';
import HomeDashboard from './components/HomeDashboard';
import NutritionPlan from './components/NutritionPlan';
import RecipeLibrary from './components/RecipeLibrary';
import SymptomNutrientInsights from './components/SymptomNutrientInsights';
import AlertsScreen from './components/AlertsScreen';
import CareTeamScreen from './components/CareTeamScreen';
import ProfileSettingsScreen from './components/ProfileSettingsScreen';
import GrowthDevelopmentScreen from './components/GrowthDevelopmentScreen';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'nutrition' | 'recipeLibrary' | 'symptomInsights' | 'alerts' | 'careTeam' | 'profile' | 'growthDevelopment'>('home');
  const [recipeLibraryMealType, setRecipeLibraryMealType] = useState<string | undefined>();
  const [insightData, setInsightData] = useState<{
    symptomName: string;
    severity: number;
    date: string;
  } | null>(null);

  const handleNavigateToNutrition = () => {
    setCurrentView('nutrition');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  const handleNavigateToRecipeLibrary = (mealType?: string) => {
    setRecipeLibraryMealType(mealType);
    setCurrentView('recipeLibrary');
  };

  const handleNavigateBackFromRecipeLibrary = () => {
    setCurrentView('nutrition');
    setRecipeLibraryMealType(undefined);
  };

  const handleNavigateToSymptomInsights = (symptomName: string, severity: number, date: string) => {
    setInsightData({ symptomName, severity, date });
    setCurrentView('symptomInsights');
  };

  const handleNavigateBackFromInsights = () => {
    setCurrentView('home');
    setInsightData(null);
  };

  const handleNavigateToAlerts = () => {
    setCurrentView('alerts');
  };

  const handleNavigateBackFromAlerts = () => {
    setCurrentView('home');
  };

  const handleNavigateToCareTeam = () => {
    setCurrentView('careTeam');
  };

  const handleNavigateBackFromCareTeam = () => {
    setCurrentView('home');
  };

  const handleNavigateToProfile = () => {
    setCurrentView('profile');
  };

  const handleNavigateBackFromProfile = () => {
    setCurrentView('home');
  };

  const handleNavigateToGrowthDevelopment = () => {
    setCurrentView('growthDevelopment');
  };

  const handleNavigateBackFromGrowthDevelopment = () => {
    setCurrentView('home');
  };

  return (
    <div className="App min-h-screen bg-gray-50">
                   {currentView === 'home' && (
               <HomeDashboard
                 onNavigateToNutrition={handleNavigateToNutrition}
                 onNavigateToSymptomInsights={handleNavigateToSymptomInsights}
                 onNavigateToAlerts={handleNavigateToAlerts}
                 onNavigateToCareTeam={handleNavigateToCareTeam}
                 onNavigateToProfile={handleNavigateToProfile}
                 onNavigateToGrowthDevelopment={handleNavigateToGrowthDevelopment}
               />
             )}
      {currentView === 'nutrition' && (
        <NutritionPlan 
          onBack={handleNavigateToHome} 
          onNavigateToRecipeLibrary={handleNavigateToRecipeLibrary}
          onNavigateToSymptomInsights={handleNavigateToSymptomInsights}
        />
      )}
      {currentView === 'recipeLibrary' && (
        <RecipeLibrary 
          onBack={handleNavigateBackFromRecipeLibrary}
          initialMealType={recipeLibraryMealType}
        />
      )}
      {currentView === 'symptomInsights' && insightData && (
        <SymptomNutrientInsights 
          onBack={handleNavigateBackFromInsights}
          symptomName={insightData.symptomName}
          severity={insightData.severity}
          date={insightData.date}
        />
      )}
      {currentView === 'alerts' && (
        <AlertsScreen 
          onBack={handleNavigateBackFromAlerts}
        />
      )}
                   {currentView === 'careTeam' && (
               <CareTeamScreen
                 onBack={handleNavigateBackFromCareTeam}
               />
             )}
             {currentView === 'profile' && (
               <ProfileSettingsScreen
                 onBack={handleNavigateBackFromProfile}
               />
             )}
             {currentView === 'growthDevelopment' && (
               <GrowthDevelopmentScreen
                 onBack={handleNavigateBackFromGrowthDevelopment}
                 onNavigateToNutrition={handleNavigateToNutrition}
                 onNavigateToSymptomLogs={() => {
                   // For now, navigate to home where symptoms can be logged
                   // In a full implementation, this would go to a symptom logs screen
                   setCurrentView('home');
                 }}
               />
             )}
           </div>
         );
       }

export default App; 