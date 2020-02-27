import AWS from 'aws-sdk';
import { s3_bucket, AWS_settings } from '../../settings';
import { dev_logger } from '../../utils/loggers';

const s3  = new AWS.S3({
    accessKeyId: AWS_settings.accessKeyId,
    secretAccessKey: AWS_settings.secretAccessKey,
    endpoint: 's3.eu-west-2.amazonaws.com',
    region: 'eu-west-2',
    signatureVersion: 'v4'
});

export const aws_signed_url = (id, filetype) => {
    dev_logger('aws.getSignedUrl method');
    const params = {
        ACL: 'public-read',
        Bucket: s3_bucket,
        Key: `profile_photos/${id}`,
        ContentType: filetype
    };
    const url = s3.getSignedUrl('putObject', params);
    return url;
};
