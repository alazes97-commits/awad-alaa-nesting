import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Recipe } from '@shared/schema';
import { ExternalLink, ShoppingCart, Wrench } from 'lucide-react';

interface MultiRecipeSelectorProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToShoppingList: (selectedLinks: number[]) => void;
}

export function MultiRecipeSelector({ recipe, isOpen, onClose, onAddToShoppingList }: MultiRecipeSelectorProps) {
  const { t, language } = useLanguage();
  const [selectedLinks, setSelectedLinks] = useState<number[]>([0]); // Include main recipe by default

  const allRecipeVersions = [
    {
      id: 0,
      title: language === 'ar' ? recipe.nameAr : recipe.nameEn,
      titleAr: recipe.nameAr,
      ingredients: language === 'ar' ? recipe.ingredientsAr : recipe.ingredientsEn,
      tools: language === 'ar' ? recipe.toolsAr : recipe.toolsEn,
      servings: recipe.servings,
      videoUrl: recipe.videoUrl
    },
    ...(recipe.additionalRecipes || []).map((additionalRecipe, index) => ({
      id: index + 1,
      title: language === 'ar' ? additionalRecipe.nameAr : additionalRecipe.nameEn,
      titleAr: additionalRecipe.nameAr,
      ingredients: language === 'ar' ? additionalRecipe.ingredientsAr : additionalRecipe.ingredientsEn,
      tools: language === 'ar' ? additionalRecipe.toolsAr : additionalRecipe.toolsEn,
      servings: additionalRecipe.servings,
      videoUrl: additionalRecipe.videoUrl
    }))
  ];

  const handleSelectionChange = (linkId: number, checked: boolean) => {
    if (checked) {
      setSelectedLinks([...selectedLinks, linkId]);
    } else {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId));
    }
  };

  const handleAddSelected = () => {
    onAddToShoppingList(selectedLinks);
    onClose();
  };

  const totalIngredients = selectedLinks.reduce((total, linkId) => {
    const version = allRecipeVersions.find(v => v.id === linkId);
    return total + (version?.ingredients?.length || 0);
  }, 0);

  const totalTools = selectedLinks.reduce((total, linkId) => {
    const version = allRecipeVersions.find(v => v.id === linkId);
    return total + (version?.tools?.length || 0);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Select Recipe Versions to Add
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                <span>{totalIngredients} ingredients</span>
              </div>
              <div className="flex items-center gap-1">
                <Wrench className="w-4 h-4" />
                <span>{totalTools} tools</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {allRecipeVersions.map((version) => (
              <Card key={version.id} className={`transition-all ${selectedLinks.includes(version.id) ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedLinks.includes(version.id)}
                        onCheckedChange={(checked) => handleSelectionChange(version.id, !!checked)}
                      />
                      <CardTitle className="text-lg">
                        {language === 'ar' ? version.titleAr : version.title}
                      </CardTitle>
                      {version.id === 0 && (
                        <Badge variant="secondary">Main</Badge>
                      )}
                    </div>
                    {version.videoUrl && (
                      <a 
                        href={version.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                        title="Watch video"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        Ingredients ({version.ingredients?.length || 0})
                      </h4>
                      <div className="max-h-20 overflow-y-auto text-muted-foreground">
                        {version.ingredients?.slice(0, 3).map((ingredient, index) => (
                          <div key={index} className="text-xs">
                            {typeof ingredient === 'string' ? ingredient : ingredient.name}
                          </div>
                        ))}
                        {(version.ingredients?.length || 0) > 3 && (
                          <div className="text-xs">...and {(version.ingredients?.length || 0) - 3} more</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Tools ({version.tools?.length || 0})
                      </h4>
                      <div className="max-h-20 overflow-y-auto text-muted-foreground">
                        {version.tools?.slice(0, 3).map((tool, index) => (
                          <div key={index} className="text-xs">{tool}</div>
                        ))}
                        {(version.tools?.length || 0) > 3 && (
                          <div className="text-xs">...and {(version.tools?.length || 0) - 3} more</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSelected}
              disabled={selectedLinks.length === 0}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add {selectedLinks.length} {selectedLinks.length === 1 ? 'Version' : 'Versions'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}