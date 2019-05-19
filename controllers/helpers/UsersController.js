import AWS from 'aws-sdk';
import settings from '../../settings';
import { dev_logger } from '../../utils/loggers';
import { InternalServerError } from '../../utils/errorHandlers';

const s3  = new AWS.S3({
    accessKeyId: settings.AWS_settings.accessKeyId,
    secretAccessKey: settings.AWS_settings.secretAccessKey,
    endpoint: 's3.eu-west-2.amazonaws.com',
    region: 'eu-west-2',
    signatureVersion: 'v4'
});

export const aws_signed_url = (id, filetype) => {
    dev_logger('aws.getSignedUrl method');
    const params = {
        ACL: 'public-read',
        Bucket: settings.s3_bucket,
        Key: `profile_photos/${id}`,
        ContentType: filetype
    };
    const url = s3.getSignedUrl('putObject', params);
    return url;
};

export const update_user_photo_url = async (model_instance, id, url, res) => {
    try {
        await model_instance.update(
            `photo='${url}'`, `WHERE id=${id}`);
    }
    catch (e) { return InternalServerError(res, e); }
};
