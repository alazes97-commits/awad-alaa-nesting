import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { LanguageToggle } from './LanguageToggle';
import { SyncStatus } from './SyncStatus';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Utensils, User, Menu, ShoppingCart, Package, X } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();
  const { familyGroup } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show default name if no family group loaded yet
  const appName = familyGroup ? `${familyGroup.name} Nesting` : "Family Nesting";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">
                {appName}
              </h1>
            </div>
          </div>

          {/* Navigation - Show on medium and larger screens */}
          <nav className="flex items-center space-x-6 rtl:space-x-reverse">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors font-medium" data-testid="nav-recipes">
              {t('recipes')}
            </Link>
            <Link href="/add" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors font-medium" data-testid="nav-add-recipe">
              {t('addRecipe')}
            </Link>
            <Link href="/shopping" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors flex items-center gap-1 font-medium" data-testid="nav-shopping-list">
              <ShoppingCart className="h-4 w-4" />
              {t('shoppingList')}
            </Link>
            <Link href="/pantry" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors flex items-center gap-1 font-medium" data-testid="nav-pantry">
              <Package className="h-4 w-4" />
              Pantry
            </Link>
            <Link href="/tools" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors flex items-center gap-1 font-medium" data-testid="nav-tools">
              <Utensils className="h-4 w-4" />
              Tools
            </Link>
          </nav>

          {/* Sync, Language Toggle and User Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <SyncStatus />
            <LanguageToggle />

            {/* User Profile */}
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer" data-testid="user-profile">
              <User className="text-accent-foreground text-sm" />
            </div>

            {/* Mobile Menu Button - Show on smaller screens */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu">
                  <Menu className="text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    {appName}
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-4">
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors" 
                    onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 100)}
                    data-testid="mobile-nav-recipes"
                  >
                    <Utensils className="h-5 w-5" />
                    {t('recipes')}
                  </Link>
                  <Link 
                    href="/add" 
                    className="flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors" 
                    onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 100)}
                    data-testid="mobile-nav-add-recipe"
                  >
                    <User className="h-5 w-5" />
                    {t('addRecipe')}
                  </Link>
                  <Link 
                    href="/shopping" 
                    className="flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors" 
                    onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 100)}
                    data-testid="mobile-nav-shopping-list"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {t('shoppingList')}
                  </Link>
                  <Link 
                    href="/pantry" 
                    className="flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors" 
                    onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 100)}
                    data-testid="mobile-nav-pantry"
                  >
                    <Package className="h-5 w-5" />
                    {t('pantry')}
                  </Link>
                  <Link 
                    href="/tools" 
                    className="flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors" 
                    onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 100)}
                    data-testid="mobile-nav-tools"
                  >
                    <Utensils className="h-5 w-5" />
                    Tools
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
