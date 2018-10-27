import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import settings from '../config/settings';

const config = settings.aws.s3;
const bucket = config.bucket;
const directory = config.directory;

const s3  = new AWS.S3({
  apiVersion: config.apiVersion,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

export { s3, bucket, directory };
