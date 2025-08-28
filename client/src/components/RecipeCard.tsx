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
    <Card className="group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" data-testid={`recipe-card-${recipe.id}`}>
      <img 
        src={imageUrl}
        alt={recipeName}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1" data-testid={`recipe-title-${recipe.id}`}>
            {recipeName}
          </h3>
          <StarRating recipe={recipe} size="sm" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="flex items-center">
            <Globe className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
            {t(recipe.country)}
          </span>
          <span className="flex items-center">
            {recipe.servingTemperature === 'hot' ? (
              <Flame className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
            ) : (
              <Leaf className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
            )}
            {t(recipe.servingTemperature)}
          </span>
          {recipe.calories && (
            <span className="flex items-center">
              <Leaf className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {recipe.calories} cal
            </span>
          )}
        </div>

        {recipeDescription && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {recipeDescription}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {t(recipe.category)}
          </Badge>
          {recipe.prepTime && (
            <Badge variant="outline" className="text-xs">
              {recipe.prepTime} min
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button
            className="flex-1"
            onClick={() => {
              console.log('Recipe card view button clicked for:', recipe.nameEn);
              onView(recipe);
            }}
            data-testid={`view-recipe-${recipe.id}`}
          >
            {t('viewRecipe')}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToShoppingList}
            disabled={addToShoppingListMutation.isPending}
            data-testid={`add-to-shopping-${recipe.id}`}
            title={t('addToShoppingList')}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFavorited(!isFavorited)}
            data-testid={`favorite-recipe-${recipe.id}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                data-testid={`delete-recipe-${recipe.id}`}
                title={t('deleteRecipe')}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteRecipeConfirmation').replace('{{recipeName}}', language === 'ar' ? recipe.nameAr || recipe.nameEn : recipe.nameEn || recipe.nameAr)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(recipe.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ShareButton recipe={recipe} />
        </div>
      </CardContent>

      {/* Multi Recipe Selector Modal */}
      <MultiRecipeSelector
        recipe={recipe}
        isOpen={isMultiSelectorOpen}
        onClose={() => setIsMultiSelectorOpen(false)}
        onAddToShoppingList={handleMultipleLinksAdd}
      />
    </Card>
  );
}
