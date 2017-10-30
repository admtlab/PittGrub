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
  this.setState({ notification: notification });
  console.log('notification context: ' + notification);
  if (this.state.appState == 'active') {
    // handle foreground notification
    console.log(JSON.stringify(notification));
    Alert.alert(
      'New PittGrub event!',
      notification.data.data,
      {text: 'OK'});
    Alert.alert(JSON.stringify(notification));
  } else {
    // handle background notification
    Notifications.presentLocalNotificationAsync(this.state.notification);
  }
}
