import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { ShareButton } from '@/components/ShareButton';
import { MultiRecipeSelector } from '@/components/MultiRecipeSelector';
import { Clock, Globe, Flame, Leaf, Edit, Plus, ShoppingCart, List } from 'lucide-react';
import { Recipe } from '@shared/schema';
import { useState } from 'react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose, onEdit }: RecipeDetailModalProps) {
  const { t, language } = useLanguage();
  const [isMultiSelectorOpen, setIsMultiSelectorOpen] = useState(false);

  console.log('🔍 RecipeDetailModal render:', {
    isOpen,
    hasRecipe: !!recipe,
    recipeFull: recipe
  });

  if (!isOpen) {
    return null;
  }

  if (!recipe) {
    console.log('❌ RecipeDetailModal: No recipe provided');
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">No recipe data available</p>
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const recipeName = language === 'ar' ? recipe.nameAr || recipe.nameEn : recipe.nameEn || recipe.nameAr;
  const recipeDescription = language === 'ar' ? recipe.descriptionAr || recipe.descriptionEn : recipe.descriptionEn || recipe.descriptionAr;
  const ingredients = language === 'ar' ? recipe.ingredientsAr || recipe.ingredientsEn : recipe.ingredientsEn || recipe.ingredientsAr;
  const instructions = language === 'ar' ? recipe.instructionsAr || recipe.instructionsEn : recipe.instructionsEn || recipe.instructionsAr;
  const tools = language === 'ar' ? recipe.toolsAr || recipe.toolsEn : recipe.toolsEn || recipe.toolsAr;

  const imageUrl = recipe.images && recipe.images.length > 0 
    ? recipe.images[0] 
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='%23666' text-anchor='middle' dy='.3em'%3ERecipe Image%3C/text%3E%3C/svg%3E";

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {recipeName || 'Recipe Details'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(recipe)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                title="Edit Recipe"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="w-full h-64 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img 
              src={imageUrl}
              alt={recipeName || 'Recipe'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recipe Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Country: {recipe.country || 'Not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {recipe.servingTemperature === 'hot' ? (
                    <Flame className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Leaf className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    Temperature: {recipe.servingTemperature || 'Not specified'}
                  </span>
                </div>

                {recipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Prep Time: {recipe.prepTime} minutes</span>
                  </div>
                )}

                {recipe.calories && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">Calories: {recipe.calories}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">Rating:</span>
                  <div className="text-yellow-500">
                    {'★'.repeat(recipe.rating || 0)}{'☆'.repeat(5 - (recipe.rating || 0))}
                  </div>
                </div>

                {recipe.category && (
                  <div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {recipeDescription || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Ingredients */}
          {ingredients && ingredients.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <List className="w-5 h-5" />
                Ingredients
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">
                      {ingredient.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {ingredient.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {tools && tools.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tools Needed</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {instructions && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Instructions</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {instructions}
                </p>
              </div>
            </div>
          )}

          {/* Video Link */}
          {recipe.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Video</h3>
              <a 
                href={recipe.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
              >
                Watch Video
              </a>
            </div>
          )}

          {/* Additional Links */}
          {recipe.additionalLinks && recipe.additionalLinks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Recipe Links</h3>
              <div className="space-y-2">
                {recipe.additionalLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
                  >
                    <div className="font-medium text-blue-800 dark:text-blue-200">{link.title}</div>
                    {link.description && (
                      <div className="text-sm text-blue-600 dark:text-blue-300">{link.description}</div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setIsMultiSelectorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Shopping List
            </button>
            <button
              onClick={() => onEdit(recipe)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              Edit Recipe
            </button>
            <ShareButton recipe={recipe} />
          </div>
        </div>
      </div>

      {/* Multi Recipe Selector Modal */}
      {isMultiSelectorOpen && (
        <MultiRecipeSelector
          recipe={recipe}
          isOpen={isMultiSelectorOpen}
          onClose={() => setIsMultiSelectorOpen(false)}
          onAddToShoppingList={() => {}}
        />
      )}
    </div>
  );
}