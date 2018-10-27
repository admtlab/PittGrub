import { ImagePicker, Permissions } from 'expo';
import { postLocation } from '../lib/api';


export async function registerForCamera() {
  const { existingStatus } = await Permissions.getAsync(Permissions.CAMERA);
  let finalStatus = existingStatus;

  // prompt for permission if not determined
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    finalStatus = status;
  }

  console.log('Camera status: ' + finalStatus);

  // stop here if permission not granted
  if (finalStatus !== 'granted') {
    return false;
  }

  return true
}
