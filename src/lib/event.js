import { s3, bucket } from '../lib/aws';

function toKey(id) {
  const dir = 'event/image/';
  return dir + id + '.jpeg';
}

export async function fetchImage(id) {
  const params = {
    Bucket: bucket,
    Key: toKey(id),
  }

  const data = s3.getObject(params);

  return 'data:image/png;base64,' + data.Body;
}

export async function buildUrl(id) {
  return "https://s3.amazonaws.com/" + bucket + "/" + directory + "/" + id + ".png";
}

export async function uploadImage(id, image) {
  const params = {
    Bucket: bucket,
    Key: toKey(id),
    ACL: 'public-read',
    Body: image,
    ContentType: 'image/jpeg',
  };

  console.log('params');
  console.log(params);

  return s3.upload(params, (err) => {
    if (err) {
      console.log("Error uploading image: " + err.message);
      console.log(err);
      Promise.reject("Error uploading image: " + err);
    }
    console.log("Successfully uploaded image");
  });
}
