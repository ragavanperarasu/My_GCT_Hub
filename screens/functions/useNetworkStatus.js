import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    // Listener for network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(prev => {
        // Only update if status changed
        const newStatus = !state.isConnected;
        return prev !== newStatus ? newStatus : prev;
      });
    });

    return () => unsubscribe();
  }, []);

  return isOffline;
}
