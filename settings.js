import dotenv from 'dotenv';
import { test_logger } from './utils/loggers';

dotenv.config();

const Settings = {
    dbSettings: () => {
        const activeEnvironment = process.env.NODE_ENV.trim();
        const settings = {
            development: {
                databaseName: 'quick_credit',
                dbHost: process.env.PGHOST.trim(),
                dbUser: process.env.PGUSER.trim(),
                dbPort: process.env.PGPORT,
                dbPassword: process.env.PGPASSWORD.trim(),
            },
            production: {
                databaseName: 'quick_credit',
                dbHost: process.env.PGHOST.trim(),
                dbUser: process.env.PGUSER.trim(),
                dbPort: process.env.PGPORT,
                dbPassword: process.env.PGPASSWORD.trim(),
            },
            test: {
                databaseName: 'testdb',
                dbHost: process.env.PGHOST.trim(),
                dbUser: process.env.PGUSER.trim(),
                dbPort: process.env.PGPORT,
                dbPassword: process.env.PGPASSWORD.trim(),
            }
        };
        return settings[activeEnvironment];
    },
    jwtSecret: process.env.JWT_SECRET,
};

test_logger(Settings);
export default Settings;
