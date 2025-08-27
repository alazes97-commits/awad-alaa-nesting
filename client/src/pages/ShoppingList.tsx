import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { Plus, Trash2, ShoppingCart, Check } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { combineIngredients, groupIngredientsByCategory, processIngredients, formatAmount } from '@/utils/ingredientUtils';

const formSchema = z.object({
  itemNameEn: z.string().optional().default(''),
  itemNameAr: z.string().optional().default(''),
  quantity: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  category: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

type FormData = z.infer<typeof formSchema>;

export function ShoppingList() {
  const { language, t, isRtl } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemNameEn: '',
      itemNameAr: '',
      quantity: '',
      unit: '',
      category: '',
      notes: '',
    },
  });

  // Fetch shopping list
  const { data: shoppingItems = [], isLoading } = useQuery({
    queryKey: ['/api/shopping', user?.familyGroupId],
    queryFn: () => {
      const url = user?.familyGroupId 
        ? `/api/shopping?familyGroupId=${user.familyGroupId}`
        : '/api/shopping';
      return fetch(url).then(res => res.json());
    },
    enabled: !!user, // Only fetch when user is loaded
  });

  // Add item mutation
  const addMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/shopping', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      toast({
        title: t('success'),
        description: t('itemAdded'),
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t('errorOccurred'),
        description: t('failedToAddItem'),
        variant: 'destructive',
      });
    },
  });

  // Toggle completion mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('PATCH', `/api/shopping/${id}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
    },
  });

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/shopping/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      toast({
        title: t('success'),
        description: t('itemDeleted'),
      });
    },
  });

  // Clear completed mutation
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      const url = user?.familyGroupId 
        ? `/api/shopping/completed?familyGroupId=${user.familyGroupId}`
        : '/api/shopping/completed';
      const response = await apiRequest('DELETE', url);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping', user?.familyGroupId] });
      toast({
        title: t('success'),
        description: t('completedItemsCleared'),
      });
    },
  });

  const onSubmit = (data: FormData) => {
    addMutation.mutate(data);
  };

  const completedItems = (shoppingItems as any[]).filter((item: any) => item.isCompleted);
  const pendingItems = (shoppingItems as any[]).filter((item: any) => !item.isCompleted);
  
  // Debug logs
  console.log('ShoppingItems:', shoppingItems);
  console.log('PendingItems:', pendingItems);
  console.log('ViewMode:', viewMode);
  
  // Process and group shopping items by category
  const groupedItems = useMemo(() => {
    console.log('Computing groupedItems, viewMode:', viewMode, 'pendingItems:', pendingItems);
    if (viewMode !== 'grouped') return {};
    
    const processed = pendingItems.map(item => {
      const name = language === 'ar' ? item.itemNameAr : item.itemNameEn;
      return {
        ...item,
        displayName: name || item.itemNameEn || item.itemNameAr,
        amount: parseFloat(item.quantity) || 1,
        unit: item.unit || 'piece',
        category: item.category || 'other'
      };
    });
    
    const categoryGroups: Record<string, any[]> = {};
    
    for (const item of processed) {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      categoryGroups[item.category].push(item);
    }
    
    // Sort each category
    for (const category in categoryGroups) {
      categoryGroups[category].sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    
    console.log('Final categoryGroups:', categoryGroups);
    return categoryGroups;
  }, [pendingItems, viewMode, language]);

  const categoryTranslations: Record<string, { en: string; ar: string }> = {
    vegetables: { en: 'Vegetables', ar: 'خضار' },
    meat: { en: 'Meat & Poultry', ar: 'لحوم ودواجن' },
    dairy: { en: 'Dairy', ar: 'منتجات ألبان' },
    grains: { en: 'Grains & Starches', ar: 'حبوب ونشويات' },
    spices: { en: 'Spices & Herbs', ar: 'بهارات وأعشاب' },
    oils: { en: 'Oils & Liquids', ar: 'زيوت وسوائل' },
    other: { en: 'Other', ar: 'أخرى' }
  };

  const getCategoryName = (category: string) => {
    const translation = categoryTranslations[category];
    return translation ? (language === 'ar' ? translation.ar : translation.en) : category;
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('shoppingList')}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode(viewMode === 'grouped' ? 'list' : 'grouped')}
              variant="outline"
              data-testid="toggle-view-button"
            >
              {viewMode === 'grouped' ? t('listView') : t('groupedView')}
            </Button>
            
            {completedItems.length > 0 && (
              <Button
                onClick={() => clearCompletedMutation.mutate()}
                variant="outline"
                disabled={clearCompletedMutation.isPending}
                data-testid="clear-completed-button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('clearCompleted')}
              </Button>
            )}
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="add-shopping-item-button">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addShoppingItem')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('addShoppingItem')}</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="itemNameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('itemNameEn')}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="item-name-en-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="itemNameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('itemNameAr')}</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-right" data-testid="item-name-ar-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('quantity')}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="quantity-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('unit')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="unit-select">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">{t('kg')}</SelectItem>
                                <SelectItem value="gram">{t('gram')}</SelectItem>
                                <SelectItem value="liter">{t('liter')}</SelectItem>
                                <SelectItem value="cup">{t('cup')}</SelectItem>
                                <SelectItem value="piece">{t('piece')}</SelectItem>
                                <SelectItem value="tablespoon">{t('tablespoon')}</SelectItem>
                                <SelectItem value="teaspoon">{t('teaspoon')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('category')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="category-select">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vegetables">{t('vegetables')}</SelectItem>
                              <SelectItem value="fruits">{t('fruits')}</SelectItem>
                              <SelectItem value="meat">{t('meat')}</SelectItem>
                              <SelectItem value="dairy">{t('dairy')}</SelectItem>
                              <SelectItem value="grains">{t('grains')}</SelectItem>
                              <SelectItem value="spices">{t('spices')}</SelectItem>
                              <SelectItem value="beverages">{t('beverages')}</SelectItem>
                              <SelectItem value="other">{t('other')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('notes')}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} data-testid="notes-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {t('cancel')}
                      </Button>
                      <Button type="submit" disabled={addMutation.isPending} data-testid="save-item-button">
                        {t('save')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">{t('loading')}...</div>
          </div>
        ) : (shoppingItems as any[]).length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{t('shoppingListEmpty')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Grouped View */}
            {viewMode === 'grouped' && Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      {getCategoryName(category)} ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-800"
                          data-testid={`shopping-item-${item.id}`}
                        >
                          <Checkbox
                            checked={item.isCompleted}
                            onCheckedChange={() => toggleMutation.mutate(item.id)}
                            data-testid={`toggle-item-${item.id}`}
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.quantity && `${item.quantity}`}
                            </div>
                            {item.notes && (
                              <div className="text-xs text-gray-400 mt-1">{item.notes}</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`delete-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              /* List View - Pending Items */
              pendingItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      {t('pending')} ({pendingItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-800"
                          data-testid={`shopping-item-${item.id}`}
                        >
                          <Checkbox
                            checked={item.isCompleted}
                            onCheckedChange={() => toggleMutation.mutate(item.id)}
                            data-testid={`toggle-item-${item.id}`}
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {language === 'ar' ? item.itemNameAr || item.itemNameEn : item.itemNameEn || item.itemNameAr}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.quantity && item.unit && `${item.quantity} ${t(item.unit)}`}
                              {item.category && ` • ${t(item.category)}`}
                            </div>
                            {item.notes && (
                              <div className="text-xs text-gray-400 mt-1">{item.notes}</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`delete-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    {t('completed')} ({completedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 opacity-75"
                        data-testid={`completed-item-${item.id}`}
                      >
                        <Checkbox
                          checked={item.isCompleted}
                          onCheckedChange={() => toggleMutation.mutate(item.id)}
                          data-testid={`toggle-completed-${item.id}`}
                        />
                        <div className="flex-1">
                          <div className="font-medium line-through text-gray-500">
                            {language === 'ar' ? item.itemNameAr || item.itemNameEn : item.itemNameEn || item.itemNameAr}
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.quantity && item.unit && `${item.quantity} ${t(item.unit)}`}
                            {item.category && ` • ${t(item.category)}`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`delete-completed-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}