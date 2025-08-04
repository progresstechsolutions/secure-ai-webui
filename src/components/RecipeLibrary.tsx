import React, { useState, useMemo } from 'react';

// Icon components
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const IronIcon = () => <span className="text-sm">⚡</span>;
const CalciumIcon = () => <span className="text-sm">🥛</span>;
const OmegaIcon = () => <span className="text-sm">🐟</span>;
const FiberIcon = () => <span className="text-sm">🌾</span>;

interface Recipe {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    nutrient?: string;
  }>;
  instructions: string[];
  nutrients: {
    calories: number;
    protein: number;
    fiber: number;
    iron?: number;
    calcium?: number;
    omega3?: number;
  };
  tags: string[];
  isFavorite: boolean;
  prepTime: string;
  cookTime: string;
  servings: number;
}

interface RecipeLibraryProps {
  onBack: () => void;
  initialMealType?: string;
}

const RecipeLibrary: React.FC<RecipeLibraryProps> = ({ onBack, initialMealType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState(initialMealType || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Sample recipe data
  const recipes: Recipe[] = [
    {
      id: '1',
      name: 'Berry Oatmeal Bowl',
      mealType: 'breakfast',
      description: 'Iron-rich oatmeal with antioxidant berries for PMS symptom relief',
      ingredients: [
        { name: 'Rolled oats', amount: '1 cup', nutrient: 'Iron' },
        { name: 'Mixed berries', amount: '1/2 cup', nutrient: 'Antioxidants' },
        { name: 'Chia seeds', amount: '1 tbsp', nutrient: 'Omega-3' },
        { name: 'Almond milk', amount: '1 cup', nutrient: 'Calcium' },
        { name: 'Honey', amount: '1 tbsp' }
      ],
      instructions: [
        'Combine oats and almond milk in a saucepan',
        'Cook over medium heat for 5-7 minutes, stirring occasionally',
        'Add berries and chia seeds, cook for 2 more minutes',
        'Drizzle with honey and serve warm'
      ],
      nutrients: {
        calories: 320,
        protein: 12,
        fiber: 8,
        iron: 4,
        calcium: 200
      },
      tags: ['PMS-friendly', 'iron-rich', 'fiber-rich', 'vegan'],
      isFavorite: false,
      prepTime: '5 min',
      cookTime: '10 min',
      servings: 1
    },
    {
      id: '2',
      name: 'Grilled Chicken Caesar Salad',
      mealType: 'lunch',
      description: 'Protein-packed salad with iron-rich greens and healthy fats',
      ingredients: [
        { name: 'Chicken breast', amount: '4 oz', nutrient: 'Protein' },
        { name: 'Romaine lettuce', amount: '2 cups', nutrient: 'Iron' },
        { name: 'Cherry tomatoes', amount: '1/2 cup', nutrient: 'Vitamin C' },
        { name: 'Olive oil', amount: '1 tbsp', nutrient: 'Healthy Fats' },
        { name: 'Parmesan cheese', amount: '2 tbsp', nutrient: 'Calcium' }
      ],
      instructions: [
        'Season chicken breast with salt and pepper',
        'Grill chicken for 6-8 minutes per side until cooked through',
        'Chop lettuce and slice tomatoes',
        'Combine ingredients and drizzle with olive oil',
        'Top with grated parmesan cheese'
      ],
      nutrients: {
        calories: 280,
        protein: 35,
        fiber: 6,
        iron: 3,
        calcium: 150
      },
      tags: ['PMS-friendly', 'high-protein', 'low-carb', 'gluten-free'],
      isFavorite: true,
      prepTime: '10 min',
      cookTime: '15 min',
      servings: 1
    },
    {
      id: '3',
      name: 'Baked Salmon with Quinoa',
      mealType: 'dinner',
      description: 'Omega-3 rich salmon with protein-packed quinoa for hormonal balance',
      ingredients: [
        { name: 'Salmon fillet', amount: '4 oz', nutrient: 'Omega-3' },
        { name: 'Quinoa', amount: '1/2 cup', nutrient: 'Protein' },
        { name: 'Broccoli', amount: '1 cup', nutrient: 'Fiber' },
        { name: 'Lemon', amount: '1/2', nutrient: 'Vitamin C' },
        { name: 'Olive oil', amount: '1 tbsp' }
      ],
      instructions: [
        'Preheat oven to 400°F (200°C)',
        'Season salmon with salt, pepper, and lemon juice',
        'Bake salmon for 12-15 minutes',
        'Cook quinoa according to package instructions',
        'Steam broccoli until tender-crisp',
        'Serve salmon over quinoa with broccoli on the side'
      ],
      nutrients: {
        calories: 450,
        protein: 35,
        fiber: 8,
        omega3: 2.5,
        iron: 2
      },
      tags: ['PMS-friendly', 'omega-3-rich', 'high-protein', 'gluten-free'],
      isFavorite: false,
      prepTime: '15 min',
      cookTime: '20 min',
      servings: 1
    },
    {
      id: '4',
      name: 'Dark Chocolate Energy Bites',
      mealType: 'snacks',
      description: 'Magnesium-rich energy bites for mood support and cravings',
      ingredients: [
        { name: 'Dates', amount: '1 cup', nutrient: 'Fiber' },
        { name: 'Almonds', amount: '1/2 cup', nutrient: 'Vitamin E' },
        { name: 'Dark chocolate (70%)', amount: '2 oz', nutrient: 'Magnesium' },
        { name: 'Chia seeds', amount: '2 tbsp', nutrient: 'Omega-3' },
        { name: 'Coconut flakes', amount: '1/4 cup' }
      ],
      instructions: [
        'Soak dates in warm water for 10 minutes',
        'Process almonds in food processor until finely chopped',
        'Add dates and process until mixture forms a ball',
        'Mix in dark chocolate chips and chia seeds',
        'Roll into 12 small balls and coat with coconut flakes',
        'Refrigerate for 30 minutes before serving'
      ],
      nutrients: {
        calories: 160,
        protein: 4,
        fiber: 6,
        iron: 1.5
      },
      tags: ['PMS-friendly', 'magnesium-rich', 'vegan', 'no-bake'],
      isFavorite: true,
      prepTime: '15 min',
      cookTime: '0 min',
      servings: 12
    },
    {
      id: '5',
      name: 'Greek Yogurt Parfait',
      mealType: 'breakfast',
      description: 'Calcium-rich parfait with probiotics for gut health',
      ingredients: [
        { name: 'Greek yogurt', amount: '1 cup', nutrient: 'Protein' },
        { name: 'Granola', amount: '1/4 cup', nutrient: 'Fiber' },
        { name: 'Mixed berries', amount: '1/2 cup', nutrient: 'Antioxidants' },
        { name: 'Honey', amount: '1 tbsp' },
        { name: 'Almonds', amount: '2 tbsp', nutrient: 'Vitamin E' }
      ],
      instructions: [
        'Layer half the yogurt in a glass',
        'Add granola and berries',
        'Top with remaining yogurt',
        'Drizzle with honey and sprinkle with almonds'
      ],
      nutrients: {
        calories: 350,
        protein: 25,
        fiber: 8,
        calcium: 300
      },
      tags: ['PMS-friendly', 'calcium-rich', 'probiotic', 'gluten-free'],
      isFavorite: false,
      prepTime: '5 min',
      cookTime: '0 min',
      servings: 1
    },
    {
      id: '6',
      name: 'Spinach and Feta Omelette',
      mealType: 'breakfast',
      description: 'Iron and protein-rich omelette for sustained energy',
      ingredients: [
        { name: 'Eggs', amount: '3 large', nutrient: 'Protein' },
        { name: 'Spinach', amount: '1 cup', nutrient: 'Iron' },
        { name: 'Feta cheese', amount: '2 tbsp', nutrient: 'Calcium' },
        { name: 'Olive oil', amount: '1 tsp' },
        { name: 'Salt and pepper', amount: 'to taste' }
      ],
      instructions: [
        'Whisk eggs in a bowl with salt and pepper',
        'Heat olive oil in a non-stick pan over medium heat',
        'Add spinach and cook until wilted',
        'Pour eggs over spinach and cook until set',
        'Add feta cheese and fold omelette in half',
        'Cook for 1 more minute and serve'
      ],
      nutrients: {
        calories: 280,
        protein: 22,
        fiber: 2,
        iron: 4,
        calcium: 200
      },
      tags: ['PMS-friendly', 'iron-rich', 'high-protein', 'keto-friendly'],
      isFavorite: false,
      prepTime: '5 min',
      cookTime: '8 min',
      servings: 1
    }
  ];

  const mealTypes = [
    { key: 'all', label: 'All Recipes' },
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snacks', label: 'Snacks' }
  ];

  const availableTags = ['PMS-friendly', 'iron-rich', 'calcium-rich', 'omega-3-rich', 'vegan', 'gluten-free', 'high-protein'];

  // Filter recipes based on search, meal type, and tags
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesMealType = selectedMealType === 'all' || recipe.mealType === selectedMealType;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => recipe.tags.includes(tag));
      
      return matchesSearch && matchesMealType && matchesTags;
    });
  }, [searchQuery, selectedMealType, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleFavorite = (recipeId: string) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for recipe:', recipeId);
  };

  const getNutrientIcon = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case 'iron': return <IronIcon />;
      case 'calcium': return <CalciumIcon />;
      case 'omega-3': return <OmegaIcon />;
      case 'fiber': return <FiberIcon />;
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
            <h1 className="text-lg font-semibold text-gray-900">Recipe Library</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FilterIcon />
          </button>
        </div>
      </header>

      {/* Section 1: Filters & Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative mb-3">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by ingredient, meal, or nutrient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {/* Meal Type Filters */}
          <div className="flex space-x-1 overflow-x-auto">
            {mealTypes.map((mealType) => (
              <button
                key={mealType.key}
                onClick={() => setSelectedMealType(mealType.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedMealType === mealType.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mealType.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe List */}
      <main className="px-4 py-6">
        {/* Section 3: Featured/Recommended */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">AI</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Recommended for Jamie today</h3>
                <p className="text-xs text-gray-600 mb-2">Try Spinach Omelette for added iron based on recent fatigue logs.</p>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  View Recommended Recipe →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        <div className="space-y-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                             {/* Recipe Header */}
               <div className="p-4 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                     <div className="flex items-center space-x-2 mb-2">
                       <span className="text-2xl">
                         {recipe.mealType === 'breakfast' ? '🍳' : 
                          recipe.mealType === 'lunch' ? '🥗' : 
                          recipe.mealType === 'dinner' ? '🍽️' : '🍎'}
                       </span>
                       <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                         {recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1)}
                       </span>
                       <span className="text-xs text-gray-500">
                         {recipe.prepTime} • {recipe.cookTime}
                       </span>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-1">{recipe.name}</h3>
                     <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                    
                    {/* Key Nutrients */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.nutrients.iron && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          <IronIcon />
                          <span>Iron {recipe.nutrients.iron}mg</span>
                        </span>
                      )}
                      {recipe.nutrients.calcium && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          <CalciumIcon />
                          <span>Calcium {recipe.nutrients.calcium}mg</span>
                        </span>
                      )}
                      {recipe.nutrients.omega3 && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          <OmegaIcon />
                          <span>Omega-3 {recipe.nutrients.omega3}g</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className={`p-2 rounded-full transition-colors ${
                      recipe.isFavorite 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <StarIcon filled={recipe.isFavorite} />
                  </button>
                </div>
              </div>

              {/* Recipe Details */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Nutrition (per serving)</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Calories: {recipe.nutrients.calories}</div>
                      <div>Protein: {recipe.nutrients.protein}g</div>
                      <div>Fiber: {recipe.nutrients.fiber}g</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Ingredients</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span>{ingredient.name}</span>
                          {ingredient.nutrient && getNutrientIcon(ingredient.nutrient)}
                        </div>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{recipe.ingredients.length - 3} more ingredients
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                                 {/* Action Buttons */}
                 <div className="flex space-x-2">
                   <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                     View Recipe
                   </button>
                   <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                     Add to Plan
                   </button>
                   <button className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                     Mark as Made
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Section 4: Add Your Own Recipe */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-3">➕</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Your Own Recipe</h3>
              <p className="text-sm text-gray-600 mb-4">Create custom recipes tailored to your child's needs</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors">
                Add Custom Recipe
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeLibrary; 