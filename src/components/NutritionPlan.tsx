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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; icon: string; type: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLoggingModal, setShowLoggingModal] = useState(false);
  const [loggingData, setLoggingData] = useState({
    itemName: '',
    mealType: 'Breakfast',
    amount: '',
    dose: '',
    timeTaken: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    identifier: '',
    notes: '',
    itemIcon: '',
    itemType: 'food'
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showHistorySection, setShowHistorySection] = useState(false);
  const [historyTimeFilter, setHistoryTimeFilter] = useState('7days');
  const [showAISuggestion, setShowAISuggestion] = useState(true);

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

  // Sample nutrition history data
  const [nutritionHistory, setNutritionHistory] = useState([
    {
      id: '1',
      date: '2024-01-15',
      itemName: 'Oatmeal with berries',
      mealType: 'Breakfast',
      amount: '1 cup',
      dose: '',
      timeTaken: '8:00 AM',
      icon: '🥣',
      type: 'food'
    },
    {
      id: '2',
      date: '2024-01-15',
      itemName: 'Vitamin D',
      mealType: 'Other',
      amount: '1 tablet',
      dose: '1000 IU',
      timeTaken: '8:30 AM',
      icon: '☀️',
      type: 'supplement'
    },
    {
      id: '3',
      date: '2024-01-15',
      itemName: 'Greek yogurt',
      mealType: 'Snack',
      amount: '1 cup',
      dose: '',
      timeTaken: '10:30 AM',
      icon: '🥛',
      type: 'food'
    },
    {
      id: '4',
      date: '2024-01-14',
      itemName: 'Grilled chicken salad',
      mealType: 'Lunch',
      amount: '1 bowl',
      dose: '',
      timeTaken: '12:30 PM',
      icon: '🥗',
      type: 'food'
    },
    {
      id: '5',
      date: '2024-01-14',
      itemName: 'Iron Supplement',
      mealType: 'Other',
      amount: '1 tablet',
      dose: '65mg',
      timeTaken: '2:00 PM',
      icon: '⚡',
      type: 'supplement'
    },
    {
      id: '6',
      date: '2024-01-14',
      itemName: 'Salmon with quinoa',
      mealType: 'Dinner',
      amount: '1 serving',
      dose: '',
      timeTaken: '6:30 PM',
      icon: '🐟',
      type: 'food'
    },
    {
      id: '7',
      date: '2024-01-13',
      itemName: 'Banana',
      mealType: 'Snack',
      amount: '1 medium',
      dose: '',
      timeTaken: '3:00 PM',
      icon: '🍌',
      type: 'food'
    },
    {
      id: '8',
      date: '2024-01-13',
      itemName: 'Water',
      mealType: 'Other',
      amount: '2 glasses',
      dose: '',
      timeTaken: 'Throughout day',
      icon: '💧',
      type: 'drink'
    }
  ]);

  // Sample reminders data
  const [reminders, setReminders] = useState([
    {
      id: '1',
      itemName: 'Vitamin D',
      scheduledTime: '8:00 AM',
      type: 'Medication',
      completed: false,
      icon: '☀️'
    },
    {
      id: '2',
      itemName: 'Iron Supplement',
      scheduledTime: '12:00 PM',
      type: 'Medication',
      completed: false,
      icon: '⚡'
    },
    {
      id: '3',
      itemName: 'Lunch',
      scheduledTime: '12:30 PM',
      type: 'Nutrition',
      completed: false,
      icon: '🍽️'
    },
    {
      id: '4',
      itemName: 'Doctor Appointment',
      scheduledTime: '2:00 PM',
      type: 'Appointment',
      completed: false,
      icon: '👩‍⚕️'
    }
  ]);

  // Get upcoming reminders (not completed, sorted by time)
  const upcomingReminders = reminders
    .filter(reminder => !reminder.completed)
    .sort((a, b) => {
      const timeA = new Date(`2000-01-01 ${a.scheduledTime}`);
      const timeB = new Date(`2000-01-01 ${b.scheduledTime}`);
      return timeA.getTime() - timeB.getTime();
    })
    .slice(0, 3);

  const handleMarkReminderDone = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
  };

  const handleViewAllReminders = () => {
    setShowRemindersModal(true);
  };

  const handleCloseRemindersModal = () => {
    setShowRemindersModal(false);
  };

  const handleToggleHistorySection = () => {
    setShowHistorySection(!showHistorySection);
  };

  const handleHistoryTimeFilterChange = (filter: string) => {
    setHistoryTimeFilter(filter);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getFilteredHistory = () => {
    const today = new Date();
    const filterDate = new Date();
    
    switch (historyTimeFilter) {
      case '7days':
        filterDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(today.getDate() - 30);
        break;
      case '6months':
        filterDate.setMonth(today.getMonth() - 6);
        break;
      case '1year':
        filterDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return nutritionHistory; // Custom or all
    }
    
    return nutritionHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= filterDate;
    });
  };

  // Comprehensive food database for search
  const foodDatabase = [
    // Breakfast foods
    { id: '1', name: 'Oatmeal', icon: '🥣', type: 'food' },
    { id: '2', name: 'Greek Yogurt', icon: '🥛', type: 'food' },
    { id: '3', name: 'Banana', icon: '🍌', type: 'food' },
    { id: '4', name: 'Eggs', icon: '🥚', type: 'food' },
    { id: '5', name: 'Toast', icon: '🍞', type: 'food' },
    { id: '6', name: 'Smoothie', icon: '🥤', type: 'food' },
    { id: '7', name: 'Pancakes', icon: '🥞', type: 'food' },
    { id: '8', name: 'Cereal', icon: '🥣', type: 'food' },
    
    // Fruits
    { id: '9', name: 'Apple', icon: '🍎', type: 'food' },
    { id: '10', name: 'Orange', icon: '🍊', type: 'food' },
    { id: '11', name: 'Strawberries', icon: '🍓', type: 'food' },
    { id: '12', name: 'Blueberries', icon: '🫐', type: 'food' },
    { id: '13', name: 'Grapes', icon: '🍇', type: 'food' },
    { id: '14', name: 'Pineapple', icon: '🍍', type: 'food' },
    { id: '15', name: 'Mango', icon: '🥭', type: 'food' },
    
    // Vegetables
    { id: '16', name: 'Spinach', icon: '🥬', type: 'food' },
    { id: '17', name: 'Broccoli', icon: '🥦', type: 'food' },
    { id: '18', name: 'Carrots', icon: '🥕', type: 'food' },
    { id: '19', name: 'Tomatoes', icon: '🍅', type: 'food' },
    { id: '20', name: 'Cucumber', icon: '🥒', type: 'food' },
    { id: '21', name: 'Bell Peppers', icon: '🫑', type: 'food' },
    { id: '22', name: 'Sweet Potato', icon: '🍠', type: 'food' },
    { id: '23', name: 'Kale', icon: '🥬', type: 'food' },
    
    // Proteins
    { id: '24', name: 'Chicken Breast', icon: '🍗', type: 'food' },
    { id: '25', name: 'Salmon', icon: '🐟', type: 'food' },
    { id: '26', name: 'Tuna', icon: '🐟', type: 'food' },
    { id: '27', name: 'Beef', icon: '🥩', type: 'food' },
    { id: '28', name: 'Turkey', icon: '🦃', type: 'food' },
    { id: '29', name: 'Tofu', icon: '🧈', type: 'food' },
    { id: '30', name: 'Lentils', icon: '🫘', type: 'food' },
    { id: '31', name: 'Chickpeas', icon: '🫘', type: 'food' },
    
    // Nuts and seeds
    { id: '32', name: 'Almonds', icon: '🥜', type: 'food' },
    { id: '33', name: 'Walnuts', icon: '🌰', type: 'food' },
    { id: '34', name: 'Pistachios', icon: '🫘', type: 'food' },
    { id: '35', name: 'Chia Seeds', icon: '🌱', type: 'food' },
    { id: '36', name: 'Flax Seeds', icon: '🌱', type: 'food' },
    { id: '37', name: 'Sunflower Seeds', icon: '🌻', type: 'food' },
    
    // Grains
    { id: '38', name: 'Quinoa', icon: '🌾', type: 'food' },
    { id: '39', name: 'Brown Rice', icon: '🍚', type: 'food' },
    { id: '40', name: 'Pasta', icon: '🍝', type: 'food' },
    { id: '41', name: 'Bread', icon: '🍞', type: 'food' },
    { id: '42', name: 'Bagel', icon: '🥯', type: 'food' },
    
    // Dairy
    { id: '43', name: 'Milk', icon: '🥛', type: 'food' },
    { id: '44', name: 'Cheese', icon: '🧀', type: 'food' },
    { id: '45', name: 'Cottage Cheese', icon: '🧀', type: 'food' },
    { id: '46', name: 'Butter', icon: '🧈', type: 'food' },
    
    // Drinks
    { id: '47', name: 'Water', icon: '💧', type: 'drink' },
    { id: '48', name: 'Coffee', icon: '☕', type: 'drink' },
    { id: '49', name: 'Tea', icon: '🫖', type: 'drink' },
    { id: '50', name: 'Green Tea', icon: '🫖', type: 'drink' },
    { id: '51', name: 'Orange Juice', icon: '🧃', type: 'drink' },
    { id: '52', name: 'Coconut Water', icon: '🥥', type: 'drink' },
    
    // Supplements
    { id: '53', name: 'Vitamin D', icon: '☀️', type: 'supplement' },
    { id: '54', name: 'Iron Supplement', icon: '⚡', type: 'supplement' },
    { id: '55', name: 'Calcium', icon: '🥛', type: 'supplement' },
    { id: '56', name: 'Omega-3', icon: '🐟', type: 'supplement' },
    { id: '57', name: 'Magnesium', icon: '⚡', type: 'supplement' },
    { id: '58', name: 'B12', icon: '💊', type: 'supplement' },
    { id: '59', name: 'Folate', icon: '💊', type: 'supplement' },
    { id: '60', name: 'Zinc', icon: '⚡', type: 'supplement' }
  ];

  // Recent and popular nutrition items for quick-log chips
  const recentItems = [
    { id: '1', name: 'Oatmeal', icon: '🥣', type: 'food' },
    { id: '2', name: 'Banana', icon: '🍌', type: 'food' },
    { id: '3', name: 'Greek Yogurt', icon: '🥛', type: 'food' },
    { id: '4', name: 'Vitamin D', icon: '☀️', type: 'supplement' }
  ];

  const popularItems = [
    { id: '5', name: 'Spinach', icon: '🥬', type: 'food' },
    { id: '6', name: 'Salmon', icon: '🐟', type: 'food' },
    { id: '7', name: 'Iron Supplement', icon: '⚡', type: 'supplement' },
    { id: '8', name: 'Water', icon: '💧', type: 'drink' },
    { id: '9', name: 'Almonds', icon: '🥜', type: 'food' },
    { id: '10', name: 'Chicken Breast', icon: '🍗', type: 'food' }
  ];

  // Combine recent and popular items, prioritizing recent ones
  const quickLogItems = [...recentItems, ...popularItems.filter(item => 
    !recentItems.some(recent => recent.name === item.name)
  )];

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'];

  const openLoggingModal = (item?: { id: string; name: string; icon: string; type: string }) => {
    if (item) {
      setLoggingData({
        itemName: item.name,
        mealType: 'Breakfast',
        amount: '',
        dose: '',
        timeTaken: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        identifier: '',
        notes: '',
        itemIcon: item.icon,
        itemType: item.type
      });
    } else {
      setLoggingData({
        itemName: '',
        mealType: 'Breakfast',
        amount: '',
        dose: '',
        timeTaken: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        identifier: '',
        notes: '',
        itemIcon: '',
        itemType: 'food'
      });
    }
    setShowLoggingModal(true);
  };

  const closeLoggingModal = () => {
    setShowLoggingModal(false);
  };

  const handleLoggingDataChange = (field: string, value: string) => {
    setLoggingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveLogging = () => {
    // TODO: Save the nutrition entry to backend/database
    console.log('Saving nutrition entry:', loggingData);
    
    // Show confirmation
    setShowConfirmation(true);
    closeLoggingModal();
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const handleQuickLog = (item: { id: string; name: string; icon: string; type: string }) => {
    openLoggingModal(item);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      // Filter food database based on search query
      const filtered = foodDatabase.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (item: { id: string; name: string; icon: string; type: string }) => {
    openLoggingModal(item);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleAddCustomItem = () => {
    openLoggingModal();
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
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
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Nutrition</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search foods, meals, or supplements…"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {showSearchResults && searchQuery.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
              {searchResults.length > 0 ? (
                <ul className="py-2">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800"
                    >
                      <span className="text-base mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for "{searchQuery}". Add your own item?
                  <button
                    onClick={handleAddCustomItem}
                    className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Log Chips */}
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-3 pb-3">
            {quickLogItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuickLog(item)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm flex-shrink-0"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-gray-700">{item.name}</span>
                <span className="text-indigo-600 text-lg">+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reminders Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-500">See what's scheduled for today</span>
            </div>
          </div>

          {upcomingReminders.length > 0 ? (
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{reminder.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reminder.itemName}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{reminder.scheduledTime}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.type === 'Medication' ? 'bg-red-100 text-red-700' :
                          reminder.type === 'Nutrition' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {reminder.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkReminderDone(reminder.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    aria-label="Mark as done"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-sm text-gray-500">No reminders scheduled for today.</p>
            </div>
          )}

          <button
            onClick={handleViewAllReminders}
            className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View all reminders</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Nutrition History Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={handleToggleHistorySection}
          >
            <h2 className="text-lg font-semibold text-gray-900">History</h2>
            <div className="flex items-center space-x-3">
              <select
                value={historyTimeFilter}
                onChange={(e) => handleHistoryTimeFilterChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="7days">Past 7 days</option>
                <option value="30days">Past 30 days</option>
                <option value="6months">Past 6 months</option>
                <option value="1year">Past 1 year</option>
                <option value="custom">Custom</option>
              </select>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${showHistorySection ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {showHistorySection && (
            <div className="space-y-2">
              {(() => {
                const filteredHistory = getFilteredHistory();
                if (filteredHistory.length === 0) {
                  return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                      <p className="text-sm text-gray-500">No nutrition entries found for this period.</p>
                    </div>
                  );
                }
                
                // Group entries by date
                const groupedHistory = filteredHistory.reduce((groups, entry) => {
                  const date = entry.date;
                  if (!groups[date]) {
                    groups[date] = [];
                  }
                  groups[date].push(entry);
                  return groups;
                }, {} as Record<string, typeof filteredHistory>);
                
                return Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 px-1">{formatDate(date)}</h3>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl">{entry.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">{entry.itemName}</p>
                              <span className="text-xs text-gray-500">{entry.timeTaken}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.mealType === 'Breakfast' ? 'bg-yellow-100 text-yellow-700' :
                                entry.mealType === 'Lunch' ? 'bg-orange-100 text-orange-700' :
                                entry.mealType === 'Dinner' ? 'bg-purple-100 text-purple-700' :
                                entry.mealType === 'Snack' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {entry.mealType}
                              </span>
                              <span>•</span>
                              <span>{entry.amount}</span>
                              {entry.dose && (
                                <>
                                  <span>•</span>
                                  <span>{entry.dose}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* AI-Powered Suggestion/Tip Banner */}
        {showAISuggestion && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 relative">
              <button
                onClick={() => setShowAISuggestion(false)}
                className="absolute top-2 right-2 p-1 text-blue-400 hover:text-blue-600 transition-colors"
                aria-label="Dismiss suggestion"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="pr-6">
                <p className="text-sm text-blue-800 mb-3">
                  Based on Jamie's recent logs, consider adding more leafy greens this week for better iron absorption.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSearchQuery('spinach');
                      setShowAISuggestion(false);
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors font-medium"
                  >
                    Log Now
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('leafy greens');
                      setShowAISuggestion(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    See Meal Ideas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Nutrition Logging Modal/Drawer */}
      {showLoggingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full max-w-md mx-4 rounded-t-xl sm:rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Log Nutrition</h2>
              <button
                onClick={closeLoggingModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <div className="flex items-center space-x-2">
                  {loggingData.itemIcon && (
                    <span className="text-2xl">{loggingData.itemIcon}</span>
                  )}
                  <input
                    type="text"
                    value={loggingData.itemName}
                    onChange={(e) => handleLoggingDataChange('itemName', e.target.value)}
                    placeholder="Enter item name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal/Intake Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleLoggingDataChange('mealType', type)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        loggingData.mealType === type
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  value={loggingData.amount}
                  onChange={(e) => handleLoggingDataChange('amount', e.target.value)}
                  placeholder="e.g., 1 cup, 2 tablets"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Dose (for supplements) */}
              {loggingData.itemType === 'supplement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Dose</label>
                  <input
                    type="text"
                    value={loggingData.dose}
                    onChange={(e) => handleLoggingDataChange('dose', e.target.value)}
                    placeholder="e.g., 500mg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Time Taken */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Taken</label>
                <input
                  type="time"
                  value={loggingData.timeTaken}
                  onChange={(e) => handleLoggingDataChange('timeTaken', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Identifier (for supplements) */}
              {loggingData.itemType === 'supplement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unique Identifier (optional)</label>
                  <input
                    type="text"
                    value={loggingData.identifier}
                    onChange={(e) => handleLoggingDataChange('identifier', e.target.value)}
                    placeholder="e.g., Brand name, prescription number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={loggingData.notes}
                  onChange={(e) => handleLoggingDataChange('notes', e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <button
                onClick={handleSaveLogging}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={closeLoggingModal}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {showConfirmation && (
        <div className="fixed bottom-4 left-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-between">
          <span className="font-medium">Nutrition entry logged!</span>
          <button
            onClick={() => setShowConfirmation(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NutritionPlan; 