import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { ShareButton } from '@/components/ShareButton';
import { Heart, Globe, Flame, Leaf } from 'lucide-react';
import { Recipe } from '@shared/schema';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onView, onEdit, onDelete }: RecipeCardProps) {
  const { t, language } = useLanguage();
  const [isFavorited, setIsFavorited] = useState(false);


  const recipeName = language === 'ar' ? recipe.nameAr : recipe.nameEn;
  const recipeDescription = language === 'ar' ? recipe.descriptionAr : recipe.descriptionEn;

  // Use a placeholder image if no images are provided
  const imageUrl = recipe.images && recipe.images.length > 0 
    ? recipe.images[0] 
    : "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";

  return (
    <Card className="recipe-card overflow-hidden shadow-sm" data-testid={`recipe-card-${recipe.id}`}>
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
            onClick={() => onView(recipe)}
            data-testid={`view-recipe-${recipe.id}`}
          >
            {t('viewRecipe')}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFavorited(!isFavorited)}
            data-testid={`favorite-recipe-${recipe.id}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <ShareButton recipe={recipe} />
        </div>
      </CardContent>
    </Card>
  );
}
