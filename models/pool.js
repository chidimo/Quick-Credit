import { Pool } from 'pg';
import dotenv from 'dotenv';

import { dbSettings } from '../settings';

dotenv.config();

const config = {
    user: dbSettings().dbUser,
    host: dbSettings().dbHost,
    port: dbSettings().dbPort,
    database: dbSettings().dbName,
    password: dbSettings().dbPassword
};

const pool = new Pool(config);

export default pool;
