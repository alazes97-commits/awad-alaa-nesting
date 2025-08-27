import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Recipe } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface StarRatingProps {
  recipe: Recipe;
  onRatingUpdate?: (newRating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ recipe, onRatingUpdate, interactive = false, size = 'md' }: StarRatingProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(recipe.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleRatingClick = async (newRating: number) => {
    if (!interactive || isUpdating) return;

    setIsUpdating(true);
    try {
      await apiRequest('PATCH', `/api/recipes/${recipe.id}`, {
        rating: newRating
      });
      
      setRating(newRating);
      if (onRatingUpdate) {
        onRatingUpdate(newRating);
      }
      
      toast({
        title: t('ratingUpdated'),
        description: t('ratingUpdatedSuccessfully'),
      });
    } catch (error) {
      toast({
        title: t('errorOccurred'),
        description: t('failedToUpdateRating'),
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        return (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            className={`p-0 h-auto ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => handleRatingClick(starValue)}
            onMouseEnter={() => interactive && setHoveredRating(starValue)}
            onMouseLeave={() => interactive && setHoveredRating(null)}
            disabled={isUpdating}
            data-testid={`star-rating-${starValue}`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                starValue <= displayRating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              } ${interactive && hoveredRating !== null && starValue <= hoveredRating ? 'text-yellow-500 fill-yellow-500' : ''}`}
            />
          </Button>
        );
      })}
      <span className="ml-2 text-sm font-medium" data-testid="rating-value">
        {rating}
      </span>
    </div>
  );
}