import dotenv from 'dotenv';
import { dev_logger } from './utils/loggers';

dotenv.config();

const Settings = {
    sendgridKey: process.env.SENDGRIDKEY.trim(),
    jwtSecret: process.env.JWT_SECRET.trim(),
    s3_bucket: 'quick-credit',
    dbSettings: () => {
        const db_settings = {
            dbName: process.env.DBNAME.trim(),
            dbHost: process.env.PGHOST.trim(),
            dbUser: process.env.PGUSER.trim(),
            dbPort: process.env.PGPORT,
            dbPassword: process.env.PGPASSWORD.trim(),
        };
        return db_settings;
    },
    AWS_settings: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        endpoint: 's3.eu-west-2.amazonaws.com',
        region: 'eu-west-2',
        signatureVersion: 'v4'
    },
};

dev_logger(Settings);
export default Settings;
