import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: {
    country?: string;
    servingTemperature?: string;
    category?: string;
    rating?: number;
  }) => void;
}

export function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    servingTemperature: '',
    category: '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    const actualValue = value === 'all_countries' || value === 'all_temperatures' ? '' : value;
    const newFilters = { ...filters, [key]: actualValue };
    setFilters(newFilters);
    onFilter({
      country: newFilters.country || undefined,
      servingTemperature: newFilters.servingTemperature || undefined,
      category: newFilters.category || undefined,
    });
  };

  const countries = [
    'egypt', 'lebanon', 'syria', 'morocco', 'italy', 'france', 'india', 'mexico', 'greece', 'turkey'
  ];

  const categories = [
    'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink'
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('searchRecipes')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rtl:pl-4 rtl:pr-10"
              placeholder={t('searchPlaceholder')}
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('country')}
          </label>
          <Select value={filters.country || 'all_countries'} onValueChange={(value) => handleFilterChange('country', value)}>
            <SelectTrigger data-testid="country-filter">
              <SelectValue placeholder={t('allCountries')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_countries">{t('allCountries')}</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {t(country)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Temperature Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('serving')}
          </label>
          <Select value={filters.servingTemperature || 'all_temperatures'} onValueChange={(value) => handleFilterChange('servingTemperature', value)}>
            <SelectTrigger data-testid="temperature-filter">
              <SelectValue placeholder={t('all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_temperatures">{t('all')}</SelectItem>
              <SelectItem value="hot">{t('hot')}</SelectItem>
              <SelectItem value="cold">{t('cold')}</SelectItem>
              <SelectItem value="room_temp">{t('roomTemp')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="default"
          size="sm"
          className="rounded-full"
          onClick={() => {
            setFilters({ country: '', servingTemperature: '', category: '' });
            setSearchQuery('');
            onSearch('');
            onFilter({});
          }}
          data-testid="filter-all"
        >
          {t('all')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full"
          onClick={() => onFilter({ rating: 5 })}
          data-testid="filter-5-stars"
        >
          {t('5Stars') || '5 Stars'}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={() => handleFilterChange('category', category)}
            data-testid={`filter-${category}`}
          >
            {t(category)}
          </Button>
        ))}
      </div>
    </div>
  );
}
