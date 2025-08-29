import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Recipe } from '@shared/schema';

interface ServingAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  selectedRecipes: number[];
  onConfirm: (people: number, days: number) => void;
}

export function ServingAdjustmentDialog({ 
  isOpen, 
  onClose, 
  recipe, 
  selectedRecipes, 
  onConfirm 
}: ServingAdjustmentDialogProps) {
  const { t, language } = useLanguage();
  const [people, setPeople] = useState(4);
  const [days, setDays] = useState(1);

  const handleConfirm = () => {
    onConfirm(people, days);
    onClose();
  };

  const getOriginalServings = () => {
    if (selectedRecipes.length === 1 && selectedRecipes[0] === 0) {
      return recipe.servings || 4;
    }
    if (selectedRecipes.length === 1 && selectedRecipes[0] > 0) {
      const additionalRecipe = recipe.additionalRecipes?.[selectedRecipes[0] - 1];
      return additionalRecipe?.servings || 4;
    }
    return 4; // Default when multiple recipes selected
  };

  const originalServings = getOriginalServings();
  const totalServingsNeeded = people * days;
  const multiplier = totalServingsNeeded / originalServings;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="serving-adjustment-dialog">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {language === 'ar' ? 'تعديل حجم الوجبة' : 'Adjust Serving Size'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {language === 'ar' 
              ? `الوصفة الأصلية تكفي ${originalServings} أشخاص`
              : `Original recipe serves ${originalServings} people`
            }
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="people" className="text-sm font-medium">
                {language === 'ar' ? 'عدد الأشخاص' : 'Number of People'}
              </Label>
              <Input
                id="people"
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
                data-testid="input-people"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="days" className="text-sm font-medium">
                {language === 'ar' ? 'عدد الأيام' : 'Number of Days'}
              </Label>
              <Input
                id="days"
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                data-testid="input-days"
                className="mt-1"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {language === 'ar' ? 'الحساب:' : 'Calculation:'}
              </div>
              <div className="text-blue-700 dark:text-blue-200">
                {language === 'ar' 
                  ? `${people} أشخاص × ${days} أيام = ${totalServingsNeeded} وجبة`
                  : `${people} people × ${days} days = ${totalServingsNeeded} servings`
                }
              </div>
              <div className="text-blue-700 dark:text-blue-200">
                {language === 'ar' 
                  ? `المضاعف: ×${multiplier.toFixed(1)}`
                  : `Multiplier: ×${multiplier.toFixed(1)}`
                }
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            data-testid="button-cancel-serving"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleConfirm}
            data-testid="button-confirm-serving"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {language === 'ar' ? 'إضافة للقائمة' : 'Add to List'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}