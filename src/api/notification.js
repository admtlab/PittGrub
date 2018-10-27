import { baseUrl, post } from './http';
import { Permissions, Notifications } from 'expo';
import { Alert, AppState } from 'react-native';


const NOTIFICATION_TOKEN_ENDPOINT =  `${baseUrl}/token/notification`;


// from: https://docs.expo.io/versions/v30.0.0/guides/push-notifications
export async function registerForNotifications() {
  const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  // only ask for permissions if undetermined
  // iOS will not necessarily ask a second time
  if (existingStatus !== 'granted') {
    // Android notification permissions are granted on app install
    // this will only prompt on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // return whether permission was granted
  return finalStatus === 'granted';
}

export async function setExpoPushToken(accessToken) {
  let pushToken = await Notifications.getExpoPushTokenAsync();
  return post(NOTIFICATION_TOKEN_ENDPOINT, {
    token: accessToken,
    body: { token: pushToken }
  });
}

export async function handleNotification(notification) {
  console.log(`notification: ${JSON.stringify(notification)}`);
  if (AppState.currentState === 'active') {
    const ok = { text: 'OK' };
    if (notification.data.type === 'message') {
      Alert.alert(notification.data.title, notification.data.body, ok);
    } else if (notification.data.type === 'event') {
      Alert.alert(notification.data.title, notification.data.event, ok);
    } else {
      Alert.alert("Else", "Other notification type", ok);
    }
  } else {
    Notifications.presentLocalNotificationAsync(notification);
  }
}
