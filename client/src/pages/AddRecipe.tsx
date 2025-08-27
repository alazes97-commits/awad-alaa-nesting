import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { insertRecipeSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

const formSchema = z.object({
  nameEn: z.string().optional().default(''),
  nameAr: z.string().optional().default(''),
  descriptionEn: z.string().optional().default(''),
  descriptionAr: z.string().optional().default(''),
  country: z.string().optional().default(''),
  servingTemperature: z.string().optional().default(''),
  category: z.string().optional().default(''),
  calories: z.number().optional().default(0),
  prepTime: z.number().optional().default(0),
  images: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(''),
  instructionsEn: z.string().optional().default(''),
  instructionsAr: z.string().optional().default(''),
  ingredientsEn: z.array(z.object({
    name: z.string().optional().default(''),
    amount: z.string().optional().default(''),
  })).optional().default([{ name: '', amount: '' }]),
  ingredientsAr: z.array(z.object({
    name: z.string().optional().default(''),
    amount: z.string().optional().default(''),
  })).optional().default([{ name: '', amount: '' }]),
  toolsEn: z.array(z.string()).optional().default(['']) ,
  toolsAr: z.array(z.string()).optional().default(['']) ,
  additionalLinks: z.array(z.object({
    title: z.string().optional().default(''),
    url: z.string().optional().default(''),
  })).optional().default([]),
  rating: z.number().min(0).max(5).optional().default(0),
});

type FormData = z.infer<typeof formSchema>;

export function AddRecipe() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const editId = searchParams.get('edit');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      country: '',
      servingTemperature: '',
      category: '',
      calories: undefined,
      prepTime: undefined,
      images: [],
      videoUrl: '',
      ingredientsEn: [{ name: '', amount: '' }],
      ingredientsAr: [{ name: '', amount: '' }],
      instructionsEn: '',
      instructionsAr: '',
      toolsEn: [''],
      toolsAr: [''],
      additionalLinks: [],
      rating: 0,
    },
  });

  // Load recipe data if editing
  const { data: existingRecipe } = useQuery({
    queryKey: ['/api/recipes', editId],
    enabled: !!editId,
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${editId}`);
      if (!response.ok) throw new Error('Recipe not found');
      return response.json();
    },
  });

  useEffect(() => {
    if (existingRecipe) {
      form.reset({
        ...existingRecipe,
        ingredientsEn: existingRecipe.ingredientsEn.length ? existingRecipe.ingredientsEn : [{ name: '', amount: '' }],
        ingredientsAr: existingRecipe.ingredientsAr.length ? existingRecipe.ingredientsAr : [{ name: '', amount: '' }],
        toolsEn: existingRecipe.toolsEn.length ? existingRecipe.toolsEn : [''],
        toolsAr: existingRecipe.toolsAr.length ? existingRecipe.toolsAr : [''],
        additionalLinks: existingRecipe.additionalLinks || [],
      });
    }
  }, [existingRecipe, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest('POST', '/api/recipes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      toast({
        title: t('recipeSaved'),
        description: 'Recipe created successfully',
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: t('errorOccurred'),
        description: 'Failed to create recipe',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest('PUT', `/api/recipes/${editId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes', editId] });
      toast({
        title: t('recipeSaved'),
        description: 'Recipe updated successfully',
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: t('errorOccurred'),
        description: 'Failed to update recipe',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Filter out empty strings from arrays
    const cleanedData = {
      ...data,
      ingredientsEn: (data.ingredientsEn || []).filter(ing => ing.name?.trim() && ing.amount?.trim()),
      ingredientsAr: (data.ingredientsAr || []).filter(ing => ing.name?.trim() && ing.amount?.trim()),
      toolsEn: (data.toolsEn || []).filter(tool => tool?.trim()),
      toolsAr: (data.toolsAr || []).filter(tool => tool?.trim()),
      additionalLinks: (data.additionalLinks || []).filter(link => link.title?.trim() && link.url?.trim()),
    };

    if (editId) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const countries = [
    'egypt', 'lebanon', 'syria', 'morocco', 'italy', 'france', 'india', 'mexico', 'greece', 'turkey'
  ];

  const categories = [
    'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink'
  ];

  const addIngredient = () => {
    const currentEn = form.getValues('ingredientsEn');
    const currentAr = form.getValues('ingredientsAr');
    form.setValue('ingredientsEn', [...currentEn, { name: '', amount: '' }]);
    form.setValue('ingredientsAr', [...currentAr, { name: '', amount: '' }]);
  };

  const removeIngredient = (index: number) => {
    const currentEn = form.getValues('ingredientsEn');
    const currentAr = form.getValues('ingredientsAr');
    if (currentEn.length > 1) {
      form.setValue('ingredientsEn', currentEn.filter((_, i) => i !== index));
      form.setValue('ingredientsAr', currentAr.filter((_, i) => i !== index));
    }
  };

  const addTool = () => {
    const currentEn = form.getValues('toolsEn');
    const currentAr = form.getValues('toolsAr');
    form.setValue('toolsEn', [...currentEn, '']);
    form.setValue('toolsAr', [...currentAr, '']);
  };

  const removeTool = (index: number) => {
    const currentEn = form.getValues('toolsEn');
    const currentAr = form.getValues('toolsAr');
    if (currentEn.length > 1) {
      form.setValue('toolsEn', currentEn.filter((_, i) => i !== index));
      form.setValue('toolsAr', currentAr.filter((_, i) => i !== index));
    }
  };

  const addLink = () => {
    const current = form.getValues('additionalLinks');
    form.setValue('additionalLinks', [...current, { title: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    const current = form.getValues('additionalLinks');
    form.setValue('additionalLinks', current.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {editId ? t('editRecipe') : t('addNewRecipe')}
            </h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('recipeNameEn')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('enterRecipeNameEn')}
                              {...field}
                              data-testid="recipe-name-en"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('recipeNameAr')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('enterRecipeNameAr')}
                              className="text-right"
                              {...field}
                              data-testid="recipe-name-ar"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('countryOfOrigin')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="country-select">
                                <SelectValue placeholder={t('selectCountry')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {t(country)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servingTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('servingTemperature')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="temperature-select">
                                <SelectValue placeholder={t('selectTemperature')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hot">{t('hot')}</SelectItem>
                              <SelectItem value="cold">{t('cold')}</SelectItem>
                              <SelectItem value="room_temp">{t('roomTemp')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="category-select">
                                <SelectValue placeholder={t('selectCategory')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {t(category)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('calories')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="calories-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prepTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('prepTime')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="prep-time-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description in English..."
                              value={field.value || ''}
                              onChange={field.onChange}
                              data-testid="description-en"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="descriptionAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف (العربية)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="وصف مختصر بالعربية..."
                              className="text-right"
                              value={field.value || ''}
                              onChange={field.onChange}
                              data-testid="description-ar"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Video URL */}
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('videoTutorial')}</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={field.value || ''}
                            onChange={field.onChange}
                            data-testid="video-url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Recipe Images */}
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            images={field.value || []}
                            onImagesChange={field.onChange}
                            maxImages={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('ingredients')}</h3>
                    {form.watch('ingredientsEn').map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`ingredientsEn.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Name (English)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="Ingredient name"
                                  {...field}
                                  data-testid={`ingredient-en-name-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ingredientsAr.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>الاسم (العربية)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="اسم المكون"
                                  className="text-right"
                                  {...field}
                                  data-testid={`ingredient-ar-name-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ingredientsEn.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Amount (EN)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="2 cups"
                                  {...field}
                                  data-testid={`ingredient-en-amount-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ingredientsAr.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>الكمية (العربية)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="كوبان"
                                  className="text-right"
                                  {...field}
                                  data-testid={`ingredient-ar-amount-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            disabled={form.watch('ingredientsEn').length === 1}
                            data-testid={`remove-ingredient-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addIngredient}
                      className="mb-4"
                      data-testid="add-ingredient"
                    >
                      <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('add')} Ingredient
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="instructionsEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('instructionsEn')}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={8}
                              placeholder={t('stepByStepEn')}
                              {...field}
                              data-testid="instructions-en"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instructionsAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('instructionsAr')}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={8}
                              placeholder={t('stepByStepAr')}
                              className="text-right"
                              {...field}
                              data-testid="instructions-ar"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tools */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('requiredTools')}</h3>
                    {form.watch('toolsEn').map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`toolsEn.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Tool Name (English)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="Large pot"
                                  {...field}
                                  data-testid={`tool-en-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`toolsAr.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>اسم الأداة (العربية)</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="قدر كبير"
                                  className="text-right"
                                  {...field}
                                  data-testid={`tool-ar-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeTool(index)}
                            disabled={form.watch('toolsEn').length === 1}
                            data-testid={`remove-tool-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTool}
                      className="mb-4"
                      data-testid="add-tool"
                    >
                      <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('add')} Tool
                    </Button>
                  </div>

                  {/* Additional Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('additionalLinks')}</h3>
                    {form.watch('additionalLinks').map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`additionalLinks.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Link Title</FormLabel>}
                              <FormControl>
                                <Input
                                  placeholder="Recipe video"
                                  {...field}
                                  data-testid={`link-title-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`additionalLinks.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>URL</FormLabel>}
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder="https://..."
                                  {...field}
                                  data-testid={`link-url-${index}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLink(index)}
                            data-testid={`remove-link-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLink}
                      className="mb-4"
                      data-testid="add-link"
                    >
                      <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t('add')} Link
                    </Button>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/')}
                      disabled={isLoading}
                      data-testid="cancel-button"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      data-testid="save-recipe-button"
                    >
                      {isLoading ? 'Saving...' : editId ? t('save') : t('save')}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
