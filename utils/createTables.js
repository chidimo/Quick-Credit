import pool from '../models/pool';
import { dev_logger, test_logger } from './loggers';

import {
    createUserTable,
    createLoansTable,
    createRepaymentsTable,
} from './dbOps';

const queries = [
    createUserTable, createLoansTable, createRepaymentsTable,
];

export const createTables = async () => {
    for (const query of queries) {
        dev_logger(query);
        test_logger(query);
        await pool.query(query);
    }
};

createTables();
export default createTables;
