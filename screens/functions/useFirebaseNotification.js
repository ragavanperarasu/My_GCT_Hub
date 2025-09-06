// useFirebaseNotification.ts
import { useEffect, useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const useFirebaseNotification = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    /* ── 1. Ask permission (Android 13+) ─────────────────────────────── */
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
    };
    requestPermission();

    /* ── 2. Get token once and save it ───────────────────────────────── */
    messaging()
      .getToken()
      .then(setFcmToken)           // <─ save here
      .catch(console.error);

    /* ── 3. Listeners (as you already had) ───────────────────────────── */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? '',
      );
    });

    return unsubscribe; // cleanup
  }, []);

  return fcmToken;      // <─ expose to caller
};











// import { useEffect } from 'react';
// import { Alert, Platform, PermissionsAndroid } from 'react-native';
// import messaging from '@react-native-firebase/messaging';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   //console.log('📩 [Background] Message:', remoteMessage);
// });

// export const useFirebaseNotification = () => {
//   useEffect(() => {
//     const requestPermission = async () => {
//       if (Platform.OS === 'android' && Platform.Version >= 33) {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         );
//         //console.log('🔐 Notification permission:', granted);
//       }
//     };

//     requestPermission();

//     messaging()
//       .getToken()
//       .then(token => {
//         //console.log('🔥 FCM Token:', token);
//         // Send to your server if needed
//       });

//     //Foreground notification handler
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       Alert.alert(
//         remoteMessage.notification?.title ?? 'Notification',
//         remoteMessage.notification?.body ?? '',
//       );
//     });

//     //Notification opened from background
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       //console.log('📲 Opened from background:', remoteMessage);
//     });

//     // App launched by tapping notification
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           //console.log('🕒 Launched from quit state:', remoteMessage);
//         }
//       });

//     return unsubscribe;
//   }, []);
// };