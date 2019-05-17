import dotenv from 'dotenv';
import { dev_logger } from './utils/loggers';

dotenv.config();

const Settings = {
    dbSettings: () => {
        let databaseName;
        switch (process.env.NODE_ENV.trim()) {
        case 'development':
            databaseName = 'quick_credit';
            break;
        case 'test':
            databaseName = 'testdb';
            break;
        case 'production':
            databaseName = 'quick_credit';
            break;
        }

        const db_settings = {
            databaseName,
            dbHost: process.env.PGHOST.trim(),
            dbUser: process.env.PGUSER.trim(),
            dbPort: process.env.PGPORT,
            dbPassword: process.env.PGPASSWORD.trim(),
        };
        return db_settings;
    },
    jwtSecret: process.env.JWT_SECRET,
};

dev_logger(Settings);
export default Settings;
