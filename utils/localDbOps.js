import pool from '../models/pool';
import { dev_logger, test_logger } from './loggers';

import {
    createUserTable,
    populateUserTable,
    createLoansTable,
    populateLoansTable,
    createRepaymentsTable,
    populateRepaymentsTable,
    dropUsers,
    dropLoans,
    dropRepayments
} from './dbOps';

const setup = [
    createUserTable, createLoansTable, createRepaymentsTable,
    populateUserTable, populateLoansTable, populateRepaymentsTable
];

const cleanup = [ dropUsers, dropLoans, dropRepayments ];

export const createDB = async () => {
    for (const query of setup) {
        dev_logger(query);
        test_logger(query);
        await pool.query(query);
    }
};

export const clearDB = async () => {
    for (const query of cleanup) {
        dev_logger(query);
        await pool.query(query);
    }
};
