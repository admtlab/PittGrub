import { Alert } from 'react-native';
import { Permissions, Notifications } from 'expo';
import { getUser } from './auth';
import { postExpoToken } from './api';

export async function registerForPushNotifications() {
  console.log('Check for push notifications');
  const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
  let finalStatus = existingStatus;

  // prompt for permission if not determined
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
    finalStatus = status;
  }

  // stop here if permission not granted
  if (finalStatus !== 'granted') {
    console.log('status: ' + finalStatus);
    return;
  }

  // configure expo notification token
  let token = await Notifications.getExponentPushTokenAsync();

  // send token to server
  getUser()
  .then((user) => {
    postExpoToken(user.id, token);
    console.log('status: ' + finalStatus);
  });
}

export async function handleNotification(notification) {
  this.setState({ notification: notification });
  console.log('notification context: ' + notification);
  if (this.state.appState == 'active') {
    // handle foreground notification
    Alert.alert(
      'New event: ' + notification.title,
      'body: ' + notification.body + ' data: ' + notification.data,
      {text: 'OK'});
  } else {
    // handle background notification
    Notifications.presentLocalNotificationAsync(this.state.notification);
  }
}
