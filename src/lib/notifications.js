import { Alert, AppState } from 'react-native';
import { Permissions, Notifications } from 'expo';
import { getUser } from './auth';
import { postExpoToken } from './api';

export async function registerForPushNotifications() {
  const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
  let finalStatus = existingStatus;

  // prompt for permission if not determined
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
    finalStatus = status;
  }

  console.log('Notifications status: ' + finalStatus);

  // stop here if permission not granted
  if (finalStatus !== 'granted') {
    return;
  }

  // configure expo notification token
  let token = await Notifications.getExpoPushTokenAsync();

  // send token to server
  getUser()
  .then((user) => {
    postExpoToken(user.id, token);
  })
  .then(() => {
    console.log("Expo token sent to server");
  });
}

export async function handleNotification(notification) {
  // this.setState({ notification: notification });
  console.log('notification context: ' + notification);
  if (AppState.currentState == 'active') {
    // handle foreground notification
    if (notification.data.type === 'message') {
      Alert.alert(notification.data.title + "\n\n" + notification.data.body);
    } else if (notification.data.type === 'event') {
      Alert.alert(notification.data.title + "\n\n" + notification.data.event);
    } else {
      Alert.alert('else', {test: 'OK'});
    }
  } else {
    // handle background notification
    Notifications.presentLocalNotificationAsync(this.state.notification);
  }
}
