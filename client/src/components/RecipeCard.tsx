import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { ShareButton } from '@/components/ShareButton';
import { MultiRecipeSelector } from '@/components/MultiRecipeSelector';
import { ServingAdjustmentDialog } from '@/components/ServingAdjustmentDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Globe, Flame, Leaf, ShoppingCart, Trash2 } from 'lucide-react';
import { Recipe } from '@shared/schema';
import { processIngredients } from '@/utils/ingredientUtils';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onView, onEdit, onDelete }: RecipeCardProps) {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [isMultiSelectorOpen, setIsMultiSelectorOpen] = useState(false);
  const [isServingDialogOpen, setIsServingDialogOpen] = useState(false);
  const [pendingSelectedRecipes, setPendingSelectedRecipes] = useState<number[]>([]);

  console.log('RecipeCard rendering for:', recipe?.nameEn || recipe?.nameAr, recipe);

  const addToShoppingListMutation = useMutation({
    mutationFn: async ({ selectedRecipes, people, days }: { selectedRecipes: number[], people: number, days: number }) => {
      const response = await apiRequest('POST', '/api/shopping/recipe', { 
        recipeId: recipe.id, 
        selectedRecipes,
        people,
        days
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
    },
  });

  const handleAddToShoppingList = () => {
    // Check if recipe has additional recipes
    const hasMultipleRecipes = recipe.additionalRecipes && recipe.additionalRecipes.length > 0;
    
    if (hasMultipleRecipes) {
      setIsMultiSelectorOpen(true);
    } else {
      // Open serving adjustment dialog for main recipe
      setPendingSelectedRecipes([0]);
      setIsServingDialogOpen(true);
    }
  };

  const handleMultipleRecipesAdd = (selectedRecipes: number[]) => {
    // Open serving adjustment dialog with selected recipes
    setPendingSelectedRecipes(selectedRecipes);
    setIsServingDialogOpen(true);
  };

  const handleServingConfirm = (people: number, days: number) => {
    addToShoppingListMutation.mutate({ selectedRecipes: pendingSelectedRecipes, people, days });
  };


  const recipeName = language === 'ar' ? recipe.nameAr : recipe.nameEn;
  const recipeDescription = language === 'ar' ? recipe.descriptionAr : recipe.descriptionEn;

  // Use a placeholder image if no images are provided
  const imageUrl = recipe.images && recipe.images.length > 0 
    ? recipe.images[0] 
    : "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";

  if (!recipe) {
    console.log('RecipeCard: No recipe data provided');
    return null;
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      data-testid={`recipe-card-${recipe.id}`}
      style={{ minHeight: '400px', display: 'block', width: '100%' }}
    >
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img 
          src={imageUrl}
          alt={recipeName || 'Recipe'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3ERecipe%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-lg text-gray-900 dark:text-white truncate flex-1 mr-2" 
            data-testid={`recipe-title-${recipe.id}`}
          >
            {recipeName || 'Untitled Recipe'}
          </h3>
          <StarRating recipe={recipe} size="sm" interactive={true} />
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
          <span className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {recipe.country || 'Unknown'}
          </span>
          <span className="flex items-center">
            {recipe.servingTemperature === 'hot' ? '🔥' : '🥬'}
            <span className="ml-1">{recipe.servingTemperature || 'N/A'}</span>
          </span>
        </div>

        {recipeDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {recipeDescription}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
            {recipe.category || 'General'}
          </span>
          {recipe.prepTime && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
              {recipe.prepTime} min
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            onClick={() => {
              console.log('Recipe card view button clicked for:', recipe.nameEn || recipe.nameAr);
              onView(recipe);
            }}
            data-testid={`view-recipe-${recipe.id}`}
          >
            View Recipe
          </button>
          <button
            className={`p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${addToShoppingListMutation.isPending ? 'bg-green-100 scale-110' : ''}`}
            onClick={handleAddToShoppingList}
            disabled={addToShoppingListMutation.isPending}
            data-testid={`add-to-shopping-${recipe.id}`}
            title="Add to Shopping List"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
            onClick={() => {
              if (confirm(`Delete recipe: ${recipeName || 'this recipe'}?`)) {
                onDelete(recipe.id);
              }
            }}
            data-testid={`delete-recipe-${recipe.id}`}
            title="Delete Recipe"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Multi Recipe Selector Modal */}
      {isMultiSelectorOpen && (
        <MultiRecipeSelector
          recipe={recipe}
          isOpen={isMultiSelectorOpen}
          onClose={() => setIsMultiSelectorOpen(false)}
          onAddToShoppingList={handleMultipleRecipesAdd}
        />
      )}

      {/* Serving Adjustment Dialog */}
      {isServingDialogOpen && (
        <ServingAdjustmentDialog
          recipe={recipe}
          selectedRecipes={pendingSelectedRecipes}
          isOpen={isServingDialogOpen}
          onClose={() => setIsServingDialogOpen(false)}
          onConfirm={handleServingConfirm}
        />
      )}
    </div>
  );
}
