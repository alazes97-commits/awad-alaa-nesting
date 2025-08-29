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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { useUser } from '@/hooks/useUser';
import { Plus, Trash2, Wrench, Check } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

const formSchema = z.object({
  toolNameEn: z.string().optional().default(''),
  toolNameAr: z.string().optional().default(''),
  category: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

type FormData = z.infer<typeof formSchema>;

export function Tools() {
  const { language, t, isRtl } = useLanguage();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolNameEn: '',
      toolNameAr: '',
      category: '',
      notes: '',
    },
  });

  // Fetch tools list
  const { data: toolsItems = [], isLoading } = useQuery({
    queryKey: ['/api/tools', user?.familyGroupId],
    queryFn: () => {
      // In demo mode (no user), fetch items with null familyGroupId
      const url = user?.familyGroupId 
        ? `/api/tools?familyGroupId=${user.familyGroupId}`
        : '/api/tools?familyGroupId=';
      return fetch(url).then(res => res.json());
    },
  });

  const toolsArray = Array.isArray(toolsItems) ? toolsItems : [];

  // Create tool mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('POST', '/api/tools', {
        ...data,
        isAvailable: false,
        familyGroupId: user?.familyGroupId || null,
        createdBy: user?.id || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
    }
  });

  // Toggle available mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/tools/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
    },
  });

  // Delete tool mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/tools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
    },
  });

  // Clear available tools mutation
  const clearAvailableMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/tools/available?familyGroupId=${user?.familyGroupId || ''}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools', user?.familyGroupId] });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const availableTools = toolsArray.filter((item: any) => item.isAvailable);
  const neededTools = toolsArray.filter((item: any) => !item.isAvailable);

  return (
    <div className={`h-full bg-gray-50 dark:bg-gray-900 ${isRtl ? 'rtl' : 'ltr'} flex flex-col overflow-hidden`}>
      <Header />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🔧 Tools List
            </h1>
            
            <div className="flex gap-4">
              {availableTools.length > 0 && (
                <Button 
                  onClick={() => clearAvailableMutation.mutate()}
                  variant="outline"
                  disabled={clearAvailableMutation.isPending}
                >
                  Clear Available
                </Button>
              )}
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-tool">
                    <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    Add Tool
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Tool</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="toolNameEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tool Name (English)</FormLabel>
                            <FormControl>
                              <Input placeholder="Large pot" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="toolNameAr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الأداة (العربية)</FormLabel>
                            <FormControl>
                              <Input placeholder="قدر كبير" className="text-right" {...field} />
                            </FormControl>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cooking">Cooking</SelectItem>
                                <SelectItem value="baking">Baking</SelectItem>
                                <SelectItem value="preparation">Preparation</SelectItem>
                                <SelectItem value="serving">Serving</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                          Add Tool
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Needed Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Wrench className="h-5 w-5" />
                  Needed Tools ({neededTools.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {neededTools.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    🎉 All tools are available!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {neededTools.map((tool: any) => (
                      <div
                        key={tool.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => toggleMutation.mutate(tool.id)}
                            disabled={toggleMutation.isPending}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {language === 'ar' ? tool.toolNameAr : tool.toolNameEn}
                              </h4>
                              {tool.recipeCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Used in {tool.recipeCount} recipe{tool.recipeCount !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            {tool.category && (
                              <p className="text-sm text-gray-500 capitalize">{tool.category}</p>
                            )}
                            {tool.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{tool.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(tool.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  Available Tools ({availableTools.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableTools.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No tools marked as available yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {availableTools.map((tool: any) => (
                      <div
                        key={tool.id}
                        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={true}
                            onCheckedChange={() => toggleMutation.mutate(tool.id)}
                            disabled={toggleMutation.isPending}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium line-through text-gray-500">
                                {language === 'ar' ? tool.toolNameAr : tool.toolNameEn}
                              </h4>
                              {tool.recipeCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Used in {tool.recipeCount} recipe{tool.recipeCount !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            {tool.category && (
                              <p className="text-sm text-gray-500 capitalize">{tool.category}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(tool.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}