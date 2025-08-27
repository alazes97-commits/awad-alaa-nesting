import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Utensils, User, Menu } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t('appName')}
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link href="/" className="text-foreground hover:text-primary transition-colors" data-testid="nav-recipes">
              {t('recipes')}
            </Link>
            <Link href="/add" className="text-foreground hover:text-primary transition-colors" data-testid="nav-add-recipe">
              {t('addRecipe')}
            </Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors" data-testid="nav-categories">
              {t('categories')}
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors" data-testid="nav-favorites">
              {t('myFavorites')}
            </a>
          </nav>

          {/* Language Toggle and User Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageToggle />

            {/* User Profile */}
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer" data-testid="user-profile">
              <User className="text-accent-foreground text-sm" />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" data-testid="mobile-menu">
              <Menu className="text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
