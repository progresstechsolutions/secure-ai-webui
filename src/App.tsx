import React, { useState } from 'react';
import HomeDashboard from './components/HomeDashboard';
import NutritionPlan from './components/NutritionPlan';
import RecipeLibrary from './components/RecipeLibrary';
import SymptomNutrientInsights from './components/SymptomNutrientInsights';
import AlertsScreen from './components/AlertsScreen';
import CareTeamScreen from './components/CareTeamScreen';
import ProfileSettingsScreen from './components/ProfileSettingsScreen';
import GrowthDevelopmentScreen from './components/GrowthDevelopmentScreen';
import LogAndTrackScreen from './components/LogAndTrackScreen';
import TrackersDashboard from './components/TrackersDashboard';
import MedicationTracker from './components/MedicationTracker';
import AppLayout from './components/AppLayout';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'nutrition' | 'recipeLibrary' | 'symptomInsights' | 'alerts' | 'careTeam' | 'profile' | 'growthDevelopment' | 'log' | 'trackersDashboard' | 'medicationTracker'>('home');
  const [previousView, setPreviousView] = useState<'home' | 'trackersDashboard'>('home');
  const [recipeLibraryMealType, setRecipeLibraryMealType] = useState<string | undefined>();
  const [insightData, setInsightData] = useState<{
    symptomName: string;
    severity: number;
    date: string;
  } | null>(null);

  const handleNavigateToNutrition = () => {
    setPreviousView('home');
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

  // New navigation handlers for trackers
  const handleNavigateToTrackersDashboard = () => {
    setCurrentView('trackersDashboard');
  };

  const handleNavigateBackFromTrackersDashboard = () => {
    setCurrentView('home');
  };

  const handleNavigateToSymptomTracker = () => {
    setCurrentView('log');
  };

  const handleNavigateToNutritionTracker = () => {
    setPreviousView('trackersDashboard');
    setCurrentView('nutrition');
  };

  const handleNavigateBackFromNutritionTracker = () => {
    setCurrentView(previousView);
  };

  const handleNavigateToMedicationTracker = () => {
    setCurrentView('medicationTracker');
  };

  const handleNavigateToLog = () => {
    setCurrentView('log');
  };

  const handleNavigateBackFromLog = () => {
    setCurrentView('trackersDashboard');
  };

  const handleNavigateBackFromMedicationTracker = () => {
    setCurrentView('trackersDashboard');
  };

  return (
    <AppLayout
      currentView={currentView}
      onNavigateToHome={handleNavigateToHome}
      onNavigateToGrowthDevelopment={handleNavigateToGrowthDevelopment}
      onNavigateToCareTeam={handleNavigateToCareTeam}
      onNavigateToProfile={handleNavigateToProfile}
      onLogSymptom={handleNavigateToTrackersDashboard}
    >
      {currentView === 'home' && (
        <HomeDashboard
          onNavigateToSymptomInsights={handleNavigateToSymptomInsights}
          onNavigateToAlerts={handleNavigateToAlerts}
          onNavigateToLog={handleNavigateToLog}
        />
      )}
      {currentView === 'nutrition' && (
        <NutritionPlan 
          onBack={handleNavigateBackFromNutritionTracker} 
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
      {currentView === 'log' && (
        <LogAndTrackScreen
          onBack={handleNavigateBackFromLog}
        />
      )}
      {currentView === 'trackersDashboard' && (
        <TrackersDashboard
          onNavigateToSymptomTracker={handleNavigateToSymptomTracker}
          onNavigateToNutritionTracker={handleNavigateToNutritionTracker}
          onNavigateToMedicationTracker={handleNavigateToMedicationTracker}
          onBack={handleNavigateBackFromTrackersDashboard}
        />
      )}
      {currentView === 'medicationTracker' && (
        <MedicationTracker
          onBack={handleNavigateBackFromMedicationTracker}
        />
      )}
    </AppLayout>
  );
}

export default App; 