import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <span className="text-sm font-medium">EN</span>
      <div 
        className={`language-toggle ${language === 'ar' ? 'arabic' : ''}`}
        onClick={toggleLanguage}
        data-testid="language-toggle"
      >
        <div className="language-toggle-slider"></div>
      </div>
      <span className="text-sm font-medium">العربية</span>
    </div>
  );
}
