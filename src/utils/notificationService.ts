import { PushAlert } from '../types/disaster';
import { playEmergencySiren, playNotificationChime, speakDisasterAlert } from './audioAlert';

export async function requestPushPermission(): Promise<NotificationPermission> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function getPushPermissionStatus(): NotificationPermission {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission || 'default';
  } catch {
    return 'denied';
  }
}

export async function dispatchPushAlert(alert: PushAlert, playAudio: boolean = true) {
  // 1. Play Emergency Siren / Chime
  if (playAudio) {
    try {
      if (alert.severity === 'CRITICAL' || alert.severity === 'WARNING') {
        playEmergencySiren(4);
        setTimeout(() => {
          speakDisasterAlert(alert.title, 'en-IN');
        }, 4200);
      } else {
        playNotificationChime();
      }
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  }

  // 2. Dispatch Native Browser Push Notification
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const nativeNotif = new Notification(`⚠️ ${alert.title}`, {
        body: `${alert.message}\nAction: ${alert.recommendedAction}`,
        icon: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=128&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=64&auto=format&fit=crop&q=80',
        tag: alert.id,
        requireInteraction: alert.severity === 'CRITICAL'
      });

      nativeNotif.onclick = () => {
        window.focus();
        nativeNotif.close();
      };
    }
  } catch (err) {
    console.warn('Native notification dispatch failed or restricted:', err);
  }

  // 3. Persist Alert to Server Broadcast Registry
  try {
    await fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
  } catch (err) {
    console.warn('Backend broadcast persistence error:', err);
  }
}
