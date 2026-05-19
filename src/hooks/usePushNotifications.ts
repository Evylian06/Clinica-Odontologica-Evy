import { useState } from 'react';

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications(userId: number | null, isAdmin: boolean = false) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = typeof window !== 'undefined';

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  };

  const registerPushSubscription = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push messaging is not supported');
      return false;
    }

    setLoading(true);

    try {
      // Register service worker
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        console.log('Service Worker registered');
      }

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '') as BufferSource,
      });

      const subscriptionData: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: pushSubscription.getKey('p256dh') ? 
            btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('p256dh')!))) : '',
          auth: pushSubscription.getKey('auth') ? 
            btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('auth')!))) : '',
        },
      };

      setSubscription(subscriptionData);

      // Send subscription to server
      const endpoint = isAdmin ? '/api/admin/push/register' : '/api/push/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscriptionData,
          userId: isAdmin ? undefined : userId,
          adminId: isAdmin ? userId : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register subscription');
      }

      console.log('Push subscription registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering push subscription:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const enableNotifications = async (): Promise<boolean> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return false;
    }

    return await registerPushSubscription();
  };

  return {
    permission,
    subscription,
    loading,
    requestPermission,
    registerPushSubscription,
    enableNotifications,
    mounted,
  };
}

// Helper function to convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
