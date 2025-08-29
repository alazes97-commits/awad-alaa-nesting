import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { Header } from '@/components/Header';
import { SearchFilters } from '@/components/SearchFilters';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { EmailSync } from '@/components/EmailSync';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Recipe } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function Home() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    country?: string;
    servingTemperature?: string;
    category?: string;
    rating?: number;
  }>({});

  const { data: recipes = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/recipes', searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.country) params.append('country', filters.country);
      if (filters.servingTemperature) params.append('servingTemperature', filters.servingTemperature);
      if (filters.category) params.append('category', filters.category);
      if (filters.rating) params.append('rating', filters.rating.toString());
      // Remove family group filter for now to see all recipes
      // if (user?.familyGroupId) params.append('familyGroupId', user.familyGroupId);
      
      const queryString = params.toString();
      const url = `/api/recipes${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      console.log('✅ Recipes fetched:', data.length, 'recipes');
      console.log('📋 Recipe data:', data);
      return data;
    },
    enabled: true, // Always fetch recipes
  });

  console.log('🏠 Home component render - recipes:', recipes?.length || 0);

  const handleViewRecipe = (recipe: Recipe) => {
    console.log('🔄 Opening recipe modal for:', recipe.nameEn || recipe.nameAr);
    console.log('🔄 Full recipe object:', recipe);
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
    console.log('🔄 Modal state set to open');
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setLocation(`/add?edit=${recipe.id}`);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await apiRequest('DELETE', `/api/recipes/${id}`);
      refetch();
    } catch (error) {
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
        <EmailSync />
        <SearchFilters onSearch={handleSearch} onFilter={handleFilter} currentFilters={filters} />

        {/* Add Recipe Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground" data-testid="recipes-title">
            {t('recipes')}
          </h2>
          <Button 
            onClick={() => setLocation('/add')}
            className="flex items-center space-x-2 rtl:space-x-reverse shadow-md"
            data-testid="add-recipe-button"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewRecipe')}</span>
          </Button>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes && Array.isArray(recipes) && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" data-testid="recipes-grid">
            {recipes.map((recipe: Recipe) => {
              console.log('Rendering recipe card:', recipe.nameEn || recipe.nameAr);
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onView={handleViewRecipe}
                  onEdit={handleEditRecipe}
                  onDelete={handleDeleteRecipe}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="no-recipes">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">{t('noRecipesFound')}</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first recipe!
            </p>
            <Button 
              onClick={() => setLocation('/add')}
              className="flex items-center space-x-2 rtl:space-x-reverse mx-auto"
              data-testid="add-first-recipe"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewRecipe')}</span>
            </Button>
          </div>
        )}
        </div>
      </main>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isDetailModalOpen}
        onClose={() => {
          console.log('Closing recipe modal');
          setIsDetailModalOpen(false);
        }}
        onEdit={handleEditRecipe}
      />
    </div>
  );
}
