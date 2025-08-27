import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Trash2, Package, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertPantrySchema } from '@shared/schema';

const formSchema = z.object({
  itemNameEn: z.string().optional().default(''),
  itemNameAr: z.string().optional().default(''),
  quantity: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  category: z.string().optional().default(''),
  expiryDate: z.string().optional().default(''),
  location: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  minimumStock: z.string().optional().default(''),
});

type FormData = z.infer<typeof formSchema>;

export function Pantry() {
  const { language, t, isRtl } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemNameEn: '',
      itemNameAr: '',
      quantity: '',
      unit: '',
      category: '',
      expiryDate: '',
      location: '',
      notes: '',
      minimumStock: '',
    },
  });

  // Fetch pantry items
  const { data: pantryItems = [], isLoading } = useQuery({
    queryKey: ['/api/pantry'],
  });

  // Fetch low stock items
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['/api/pantry/low-stock'],
  });

  // Fetch expiring soon items
  const { data: expiringSoonItems = [] } = useQuery({
    queryKey: ['/api/pantry/expiring-soon'],
  });

  // Add item mutation
  const addMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const processedData = {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
      };
      const response = await apiRequest('POST', '/api/pantry', processedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pantry'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pantry/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pantry/expiring-soon'] });
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

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/pantry/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pantry'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pantry/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pantry/expiring-soon'] });
      toast({
        title: t('success'),
        description: t('itemDeleted'),
      });
    },
  });

  const onSubmit = (data: FormData) => {
    addMutation.mutate(data);
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return new Date(expiryDate) <= sevenDaysFromNow;
  };

  const isLowStock = (item: any) => {
    if (!item.minimumStock || !item.quantity) return false;
    const currentQuantity = parseFloat(item.quantity);
    const minStock = parseFloat(item.minimumStock);
    return !isNaN(currentQuantity) && !isNaN(minStock) && currentQuantity <= minStock;
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('myPantry')}
            </h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-pantry-item-button">
                <Plus className="h-4 w-4 mr-2" />
                {t('addPantryItem')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('addPantryItem')}</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
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
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('location')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="location-select">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fridge">{t('fridge')}</SelectItem>
                              <SelectItem value="freezer">{t('freezer')}</SelectItem>
                              <SelectItem value="pantryLocation">{t('pantryLocation')}</SelectItem>
                              <SelectItem value="cabinet">{t('cabinet')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('expiryDate')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="expiry-date-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="minimumStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('minimumStock')}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="minimum-stock-input" />
                          </FormControl>
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
                  </div>
                  
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

        {/* Alerts */}
        {((lowStockItems as any[]).length > 0 || (expiringSoonItems as any[]).length > 0) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(lowStockItems as any[]).length > 0 && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <AlertTriangle className="h-5 w-5" />
                    {t('lowStock')} ({lowStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(lowStockItems as any[]).slice(0, 3).map((item: any) => (
                      <div key={item.id} className="text-sm text-orange-700 dark:text-orange-300">
                        {language === 'ar' ? item.itemNameAr || item.itemNameEn : item.itemNameEn || item.itemNameAr}
                      </div>
                    ))}
                    {(lowStockItems as any[]).length > 3 && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        +{(lowStockItems as any[]).length - 3} {t('more')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {(expiringSoonItems as any[]).length > 0 && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <Calendar className="h-5 w-5" />
                    {t('expiringSoon')} ({expiringSoonItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(expiringSoonItems as any[]).slice(0, 3).map((item: any) => (
                      <div key={item.id} className="text-sm text-red-700 dark:text-red-300">
                        {language === 'ar' ? item.itemNameAr || item.itemNameEn : item.itemNameEn || item.itemNameAr}
                      </div>
                    ))}
                    {(expiringSoonItems as any[]).length > 3 && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        +{(expiringSoonItems as any[]).length - 3} {t('more')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">{t('loading')}...</div>
          </div>
        ) : (pantryItems as any[]).length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{t('pantryEmpty')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(pantryItems as any[]).map((item: any) => (
              <Card key={item.id} className="relative" data-testid={`pantry-item-${item.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {language === 'ar' ? item.itemNameAr || item.itemNameEn : item.itemNameEn || item.itemNameAr}
                    </CardTitle>
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
                  
                  <div className="flex gap-2 flex-wrap">
                    {isLowStock(item) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t('lowStock')}
                      </Badge>
                    )}
                    {isExpiringSoon(item.expiryDate) && (
                      <Badge variant="destructive" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {t('expiringSoon')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('quantity')}:</span>
                      <span>{item.quantity} {item.unit && t(item.unit)}</span>
                    </div>
                    
                    {item.category && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('category')}:</span>
                        <span>{t(item.category)}</span>
                      </div>
                    )}
                    
                    {item.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('location')}:</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {t(item.location)}
                        </span>
                      </div>
                    )}
                    
                    {item.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('expiryDate')}:</span>
                        <span className={isExpiringSoon(item.expiryDate) ? 'text-red-600' : ''}>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {item.minimumStock && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('minimumStock')}:</span>
                        <span>{item.minimumStock}</span>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}