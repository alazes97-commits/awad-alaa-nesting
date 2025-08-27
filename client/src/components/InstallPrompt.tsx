import { usePWA } from '@/hooks/usePWA';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

export function InstallPrompt() {
  const { t } = useLanguage();
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 md:max-w-md md:left-auto">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {t('installApp')}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              {t('installAppDescription')}
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={installApp}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="install-app-button"
              >
                <Download className="h-4 w-4 mr-1" />
                {t('install')}
              </Button>
              <Button
                onClick={() => setIsDismissed(true)}
                variant="outline"
                size="sm"
                data-testid="dismiss-install-button"
              >
                {t('later')}
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            data-testid="close-install-prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}