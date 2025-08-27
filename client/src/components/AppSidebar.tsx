import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  Utensils, 
  Plus, 
  ShoppingCart, 
  Package, 
  Users, 
  ChefHat
} from 'lucide-react';

export function AppSidebar() {
  const { t } = useLanguage();
  const { familyGroup } = useUser();
  const [location] = useLocation();

  const appName = familyGroup ? `${familyGroup.name} Nesting` : "Family Nesting";

  const navigationItems = [
    {
      title: t('recipes'),
      icon: ChefHat,
      href: '/',
      active: location === '/'
    },
    {
      title: t('addRecipe'),
      icon: Plus,
      href: '/add',
      active: location === '/add'
    },
    {
      title: t('shoppingList'),
      icon: ShoppingCart,
      href: '/shopping',
      active: location === '/shopping'
    },
    {
      title: t('pantry'),
      icon: Package,
      href: '/pantry',
      active: location === '/pantry'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Utensils className="text-primary-foreground text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">
              {appName}
            </h2>
            {familyGroup && (
              <p className="text-sm text-sidebar-foreground/70">
                {t('familySync')}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={item.active}>
                <Link href={item.href} className="w-full">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 w-full cursor-pointer">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Family Sync</p>
                  <p className="text-xs text-sidebar-foreground/70">
                    {familyGroup ? 'Connected' : 'Setup required'}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}