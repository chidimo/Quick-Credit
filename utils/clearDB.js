import pool from '../models/pool';
import { dev_logger } from './loggers';

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
