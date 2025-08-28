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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Heart, Globe, Flame, Leaf, ShoppingCart, Trash2 } from 'lucide-react';
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
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isMultiSelectorOpen, setIsMultiSelectorOpen] = useState(false);

  console.log('RecipeCard rendering for:', recipe?.nameEn || recipe?.nameAr, recipe);

  const addToShoppingListMutation = useMutation({
    mutationFn: async (selectedLinkIds?: number[]) => {
      const linksToProcess = selectedLinkIds || [0]; // Default to main recipe
      
      const allPromises: Promise<any>[] = [];
      
      for (const linkId of linksToProcess) {
        // For now, use main recipe data for all links (can be enhanced later)
        const ingredients = language === 'ar' ? recipe.ingredientsAr : recipe.ingredientsEn;
        const tools = language === 'ar' ? recipe.toolsAr : recipe.toolsEn;
        const processedIngredients = processIngredients(ingredients || []);
        
        const linkTitle = linkId === 0 ? 'Main Recipe' : recipe.additionalLinks?.[linkId - 1]?.title || `Link ${linkId}`;
        
        // Add ingredients to shopping list
        const ingredientPromises = processedIngredients.map(ingredient => 
          apiRequest('POST', '/api/shopping', {
            itemNameEn: language === 'en' ? ingredient.name : '',
            itemNameAr: language === 'ar' ? ingredient.name : '',
            quantity: `${ingredient.amount} ${ingredient.unit}`,
            unit: ingredient.unit,
            category: ingredient.category,
            notes: `From recipe: ${language === 'ar' ? recipe.nameAr : recipe.nameEn} (${linkTitle})`,
            recipeId: recipe.id,
            familyGroupId: user?.familyGroupId || null,
            createdBy: user?.id || null
          })
        );
        
        // Add tools to tools list
        const toolPromises = (tools || [])
          .filter(tool => tool && tool.trim() !== '')
          .map(tool => 
            apiRequest('POST', '/api/tools', {
              toolNameEn: language === 'en' ? tool : '',
              toolNameAr: language === 'ar' ? tool : '',
              category: 'cooking',
              notes: `From recipe: ${language === 'ar' ? recipe.nameAr : recipe.nameEn} (${linkTitle})`,
              isAvailable: false,
              recipeId: recipe.id,
              familyGroupId: user?.familyGroupId || null,
              createdBy: user?.id || null
            })
          );
        
        allPromises.push(...ingredientPromises, ...toolPromises);
      }
      
      await Promise.all(allPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
      toast({
        title: t('success'),
        description: 'Ingredients and tools added to lists!',
      });
    },
    onError: () => {
      toast({
        title: t('errorOccurred'),
        description: t('failedToAddToShoppingList'),
        variant: 'destructive',
      });
    }
  });

  const handleAddToShoppingList = () => {
    // Check if recipe has additional links
    const hasMultipleLinks = recipe.additionalLinks && recipe.additionalLinks.length > 0;
    
    if (hasMultipleLinks) {
      setIsMultiSelectorOpen(true);
    } else {
      addToShoppingListMutation.mutate([0]); // Add main recipe only
    }
  };

  const handleMultipleLinksAdd = (selectedLinkIds: number[]) => {
    addToShoppingListMutation.mutate(selectedLinkIds);
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
          <div className="text-yellow-500 text-sm">
            {'★'.repeat(recipe.rating || 0)}
          </div>
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
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleAddToShoppingList}
            disabled={addToShoppingListMutation.isPending}
            data-testid={`add-to-shopping-${recipe.id}`}
            title="Add to Shopping List"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setIsFavorited(!isFavorited)}
            data-testid={`favorite-recipe-${recipe.id}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
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
          onAddToShoppingList={handleMultipleLinksAdd}
        />
      )}
    </div>
  );
}
