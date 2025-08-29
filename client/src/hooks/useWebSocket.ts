import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { queryClient } from '@/lib/queryClient';

interface WebSocketMessage {
  type: string;
  action: string;
  data: any;
  timestamp: number;
}

export function useWebSocket() {
  const { t } = useLanguage();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setLastSynced(new Date());
        
        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    console.log('Received WebSocket message:', message);
    setLastSynced(new Date());

    // Handle different types of updates
    switch (message.type) {
      case 'system':
        // System messages don't need user notification
        break;

      case 'recipes':
        handleRecipeUpdate(message);
        break;

      case 'shopping':
        handleShoppingUpdate(message);
        break;

      case 'pantry':
        handlePantryUpdate(message);
        break;

      case 'tools':
        handleToolsUpdate(message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const handleRecipeUpdate = (message: WebSocketMessage) => {
    // Invalidate recipes cache to refetch data
    queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
  };

  const handleShoppingUpdate = (message: WebSocketMessage) => {
    // Invalidate shopping list cache
    queryClient.invalidateQueries({ queryKey: ['/api/shopping'] });
  };

  const handlePantryUpdate = (message: WebSocketMessage) => {
    // Invalidate pantry cache
    queryClient.invalidateQueries({ queryKey: ['/api/pantry'] });
    queryClient.invalidateQueries({ queryKey: ['/api/pantry/low-stock'] });
    queryClient.invalidateQueries({ queryKey: ['/api/pantry/expiring-soon'] });
  };

  const handleToolsUpdate = (message: WebSocketMessage) => {
    // Invalidate tools cache
    queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    lastSynced,
    reconnect: connect,
  };
}