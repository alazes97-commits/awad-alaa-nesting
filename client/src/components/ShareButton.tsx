import { useState } from 'react';
import { Share, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Recipe } from '@shared/schema';

interface ShareButtonProps {
  recipe: Recipe;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({ recipe, variant = 'outline', size = 'icon' }: ShareButtonProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const recipeName = language === 'ar' ? recipe.nameAr : recipe.nameEn;
  const recipeDescription = language === 'ar' ? recipe.descriptionAr : recipe.descriptionEn;

  const shareData = {
    title: `${recipeName} - ${t('appName')}`,
    text: recipeDescription || `${t('checkOutThisRecipe')}: ${recipeName}`,
    url: `${window.location.origin}/recipe/${recipe.id}`,
  };

  const handleShare = async () => {
    try {
      // Try Web Share API first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: t('shared'),
          description: t('recipeSharedSuccessfully'),
        });
      } else {
        // Fallback to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: t('copied'),
          description: t('linkCopiedToClipboard'),
        });
      }
    } catch (error) {
      // Final fallback - try copying just the URL
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: t('copied'),
          description: t('linkCopiedToClipboard'),
        });
      } catch (clipboardError) {
        toast({
          title: t('errorOccurred'),
          description: t('failedToShare'),
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      data-testid={`share-recipe-${recipe.id}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Share className="w-4 h-4 text-muted-foreground" />
      )}
      {size !== 'icon' && <span className="ml-2">{t('share')}</span>}
    </Button>
  );
}