import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RefreshCw, Check, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function SyncStatus() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isConnected, lastSynced, reconnect } = useWebSocket();
  const [autoSync, setAutoSync] = useState(true);

  // Load sync preferences from localStorage
  useEffect(() => {
    const savedAutoSync = localStorage.getItem('autoSync');
    if (savedAutoSync !== null) {
      setAutoSync(JSON.parse(savedAutoSync));
    }
  }, []);

  const performManualSync = () => {
    if (!isConnected) {
      reconnect();
      toast({
        title: t('reconnecting'),
        description: t('attemptingToReconnect'),
      });
    } else {
      toast({
        title: t('alreadyConnected'),
        description: t('realTimeSyncActive'),
      });
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
    if (isConnected) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getSyncBadgeVariant = () => {
    return isConnected ? 'default' : 'destructive';
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={performManualSync}
            data-testid="sync-button"
          >
            {getSyncIcon()}
            <span className="ml-1 hidden lg:inline">
              {isConnected ? t('connected') : t('disconnected')}
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
        {isConnected ? t('realTimeSync') : t('offline')}
      </Badge>
    </div>
  );
}