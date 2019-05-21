import { Pool } from 'pg';
import dotenv from 'dotenv';

import Settings from '../settings';
import { dev_logger } from './loggers';

dotenv.config();

const config = {
    user: Settings.dbSettings().dbUser,
    host: Settings.dbSettings().dbHost,
    port: Settings.dbSettings().dbPort,
    database: Settings.dbSettings().dbName,
    password: Settings.dbSettings().dbPassword
};

const pool = new Pool(config);

const dropUsers = `
    DROP TABLE users
`;
const dropLoans = `
    DROP TABLE loans
`;
const dropRepayments = `
    DROP TABLE repayments
`;
const queries = [ dropUsers, dropLoans, dropRepayments ];
const clearDB = async () => {
    for (const query of queries) {
        dev_logger(query);
        await pool.query(query);
    }
};

export default clearDB;
