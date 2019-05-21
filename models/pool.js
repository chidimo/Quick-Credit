import { Pool } from 'pg';
import dotenv from 'dotenv';

import Settings from '../settings';

dotenv.config();

const config = {
    user: Settings.dbSettings().dbUser,
    host: Settings.dbSettings().dbHost,
    port: Settings.dbSettings().dbPort,
    database: Settings.dbSettings().dbName,
    password: Settings.dbSettings().dbPassword
};

const pool = new Pool(config);

export default pool;
