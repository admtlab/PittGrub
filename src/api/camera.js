import { Buffer } from 'buffer';
import { ImagePicker, Permissions } from 'expo';


export const captureImage = async (settings) => {
  return await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    base64: true,
    exif: true,
    ...settings
  });
}

export const parseRawImage = (image) => {
  image = image.base64 || image;
  return Buffer.from(image, 'base64');
}

export async function registerForCamera() {
  console.log('registering');
  const { status } = await Permissions.getAsync(Permissions.CAMERA);
  let finalStatus = status;

  console.log(finalStatus);

  // prompt for permission
  if (status !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    finalStatus = status;
  }

  console.log(finalStatus);


  // return whether permission was granted
  return finalStatus === 'granted';
}
