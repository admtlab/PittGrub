import { Buffer } from 'buffer';
import { ImagePicker } from 'expo';


export const captureImage = async () => {
  return await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    base64: true
  });
}

export const parseRawImage = (image) => {
  image = image.base64 || image;
  return Buffer.from(image, 'base64');
}
