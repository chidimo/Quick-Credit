import dotenv from 'dotenv';
import { dev_logger } from './utils/loggers';

dotenv.config();

export const s3_bucket = 'quick-credit';
export const jwtSecret = process.env.JWT_SECRET.trim();
export const sendgridKey = process.env.SENDGRIDKEY.trim();

export const dbSettings = () => ({
    dbName: process.env.DBNAME.trim(),
    dbHost: process.env.PGHOST.trim(),
    dbUser: process.env.PGUSER.trim(),
    dbPort: process.env.PGPORT,
    dbPassword: process.env.PGPASSWORD.trim(),
});

export const AWS_settings = () => ({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: 's3.eu-west-2.amazonaws.com',
    region: 'eu-west-2',
    signatureVersion: 'v4'
});
