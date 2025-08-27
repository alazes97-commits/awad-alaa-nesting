import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function SyncStatus() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [autoSync, setAutoSync] = useState(true);

  // Load sync preferences from localStorage
  useEffect(() => {
    const savedAutoSync = localStorage.getItem('autoSync');
    if (savedAutoSync !== null) {
      setAutoSync(JSON.parse(savedAutoSync));
    }
    
    const savedLastSynced = localStorage.getItem('lastSynced');
    if (savedLastSynced) {
      setLastSynced(new Date(savedLastSynced));
    }
  }, []);

  // Auto sync every 5 minutes if enabled
  useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(() => {
      performSync();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoSync]);

  const performSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Simulate sync operation (in reality, this would sync with a backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update sync status
      setSyncStatus('success');
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('lastSynced', now.toISOString());
      
      toast({
        title: t('syncSuccessful'),
        description: t('dataUpdated'),
      });

      // Reset to idle after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      toast({
        title: t('syncFailed'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });

      // Reset to idle after 5 seconds
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const toggleAutoSync = () => {
    const newAutoSync = !autoSync;
    setAutoSync(newAutoSync);
    localStorage.setItem('autoSync', JSON.stringify(newAutoSync));
    
    toast({
      title: newAutoSync ? t('autoSyncEnabled') : t('autoSyncDisabled'),
      description: newAutoSync ? t('dataWillSyncAutomatically') : t('manualSyncOnly'),
    });
  };

  const formatLastSynced = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return `${diffInMinutes}${t('minutesAgo')}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}${t('hoursAgo')}`;
    
    return date.toLocaleDateString();
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getSyncBadgeVariant = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'default';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={performSync}
            disabled={syncStatus === 'syncing'}
            data-testid="sync-button"
          >
            {getSyncIcon()}
            <span className="ml-1 hidden lg:inline">
              {syncStatus === 'syncing' ? t('syncInProgress') : t('sync')}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div>{t('lastSynced')}: {lastSynced ? formatLastSynced(lastSynced) : t('never')}</div>
            <div className="mt-1">
              <button
                onClick={toggleAutoSync}
                className="text-xs underline"
                data-testid="toggle-auto-sync"
              >
                {autoSync ? t('disableAutoSync') : t('enableAutoSync')}
              </button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <Badge variant={getSyncBadgeVariant()} className="hidden sm:inline-flex">
        {autoSync ? t('autoSync') : t('manual')}
      </Badge>
    </div>
  );
}