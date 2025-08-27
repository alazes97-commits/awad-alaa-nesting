import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import { ShareButton } from '@/components/ShareButton';
import { useToast } from '@/hooks/use-toast';
import { Edit, Heart, Globe, Flame, Leaf, Clock, Check, ShoppingCart } from 'lucide-react';
import { Recipe } from '@shared/schema';
import { processIngredients } from '@/utils/ingredientUtils';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose, onEdit }: RecipeDetailModalProps) {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();

  if (!recipe) {
    return null;
  }

  const addToShoppingListMutation = useMutation({
    mutationFn: async () => {
      const ingredients = language === 'ar' ? recipe.ingredientsAr : recipe.ingredientsEn;
      const processedIngredients = processIngredients(ingredients || []);
      
      const promises = processedIngredients.map(ingredient => 
        apiRequest('POST', '/api/shopping', {
          itemNameEn: language === 'en' ? ingredient.name : '',
          itemNameAr: language === 'ar' ? ingredient.name : '',
          quantity: `${ingredient.amount} ${ingredient.unit}`,
          unit: ingredient.unit,
          category: ingredient.category,
          notes: `From recipe: ${language === 'ar' ? recipe.nameAr : recipe.nameEn}`,
          recipeId: recipe.id,
          familyGroupId: user?.familyGroupId || null,
          createdBy: user?.id || null
        })
      );
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      toast({
        title: t('success'),
        description: t('ingredientsAddedToShoppingList'),
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
    addToShoppingListMutation.mutate();
  };


  const recipeName = language === 'ar' ? recipe.nameAr : recipe.nameEn;
  const recipeInstructions = language === 'ar' ? recipe.instructionsAr : recipe.instructionsEn;
  const ingredients = language === 'ar' ? recipe.ingredientsAr : recipe.ingredientsEn;
  const tools = language === 'ar' ? recipe.toolsAr : recipe.toolsEn;

  // Use a placeholder image if no images are provided
  const imageUrl = recipe.images && recipe.images.length > 0 
    ? recipe.images[0] 
    : "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-testid="recipe-detail-modal">
        <DialogHeader className="sticky top-0 bg-card border-b border-border pb-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold" data-testid="recipe-detail-title">
              {recipeName}
            </DialogTitle>
            <StarRating recipe={recipe} interactive size="md" />
          </div>
          <DialogDescription className="sr-only">
            Recipe details for {recipeName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column: Images and Video */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <img 
              src={imageUrl}
              alt={recipeName}
              className="w-full h-64 object-cover rounded-lg mb-4"
              data-testid="recipe-detail-image"
            />

            {/* Video Section */}
            {recipe.videoUrl && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-3">
                  {t('videoTutorial')}
                </h3>
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">▶</div>
                    <p className="text-muted-foreground">
                      <a 
                        href={recipe.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        data-testid="video-tutorial-link"
                      >
                        Watch Tutorial
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recipe Details */}
          <div>
            {/* Quick Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('quickInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Globe className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('country')}:
                  </span>
                  <span className="font-medium">{t(recipe.country)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    {recipe.servingTemperature === 'hot' ? (
                      <Flame className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    ) : (
                      <Leaf className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    )}
                    {t('serving')}:
                  </span>
                  <span className="font-medium">{t(recipe.servingTemperature)}</span>
                </div>
                {recipe.calories && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Leaf className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('calories')}:
                    </span>
                    <span className="font-medium">{recipe.calories} cal</span>
                  </div>
                )}
                {recipe.prepTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('prepTime')}:
                    </span>
                    <span className="font-medium">{recipe.prepTime} min</span>
                  </div>
                )}
                <div className="pt-2">
                  <Badge variant="secondary" className="text-xs">
                    {t(recipe.category)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tools Required */}
            {tools && tools.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('toolsRequired')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tools.map((tool, index) => (
                      <li key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleAddToShoppingList}
                disabled={addToShoppingListMutation.isPending}
                data-testid="add-to-shopping-list-button"
              >
                <ShoppingCart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('addToShoppingList')}
              </Button>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => onEdit(recipe)}
                data-testid="edit-recipe-button"
              >
                <Edit className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('editRecipe')}
              </Button>
              <Button variant="outline" className="w-full" data-testid="add-to-favorites-button">
                <Heart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('addToFavorites')}
              </Button>
              <ShareButton recipe={recipe} variant="outline" size="default" />
            </div>
          </div>
        </div>

        {/* Ingredients and Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 pb-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t('ingredients')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ingredients && ingredients.map((ingredient, index) => (
                  <li 
                    key={index} 
                    className="flex justify-between items-center p-2 bg-muted rounded border"
                    data-testid={`ingredient-${index}`}
                  >
                    <span>{ingredient.name}</span>
                    <span className="font-medium">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t('instructions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap" data-testid="recipe-instructions">
                  {recipeInstructions}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Links */}
        {recipe.additionalLinks && recipe.additionalLinks.length > 0 && (
          <div className="px-6 pb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {t('additionalLinks')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.additionalLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        data-testid={`additional-link-${index}`}
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
