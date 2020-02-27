import dotenv from 'dotenv';

dotenv.config();

// export const s3_bucket = 'quick-credit';
export const s3_bucket = process.env.S3_BUCKET;
export const jwtSecret = process.env.JWT_SECRET.trim();
export const sendgridKey = process.env.SENDGRIDKEY.trim();
export const connectionString = process.env.CONNECTION_STRING.trim();

export const AWS_settings = () => ({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: 's3.eu-west-2.amazonaws.com',
    region: 'eu-west-2',
    signatureVersion: 'v4'
});
