import pool from '../models/pool';
import { dev_logger, test_logger } from './loggers';
import hashPassword from './hashPassword';

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        firstname VARCHAR DEFAULT '',
        lastname VARCHAR DEFAULT '',
        phone VARCHAR DEFAULT '',
        photo VARCHAR NULL,
        address jsonb DEFAULT '{"home": "", "office": ""}',
        status VARCHAR DEFAULT 'unverified',
        isadmin BOOLEAN DEFAULT false,
        mailverified BOOLEAN DEFAULT false
    );
`;

const populateUserTable = `
    INSERT INTO users(email, password, firstname, lastname, phone, address)
    VALUES ('a@b.com', '${hashPassword('password')}', 'first', 'men', '080121515', '{"home": "iyaba", "office": "ring road"}'),
    ('c@d.go', '${hashPassword('password')}', 'name', 'cat', '08151584151', '{"home": "london", "office": "NYC"}'),
    ('me@yahoo.com', '${hashPassword('password')}', 'tayo', 'dele', '08012345678', '{"home": "ijebu","office": "ijegun"}'),
    ('abc@gmail.com', '${hashPassword('password')}', 'what', 'is', '08012345678','{"home": "must","office": "not"}'),
    ('name@chat.co', '${hashPassword('password')}', 'niger', 'tornadoes', '08012345678', '{"home": "niger","office": "niger"}'),
    ('bcc@gmail.com', '${hashPassword('password')}', 'bcc', 'lions', '08012345678', '{"home": "gboko","office": "gboko"}'),
    ('bbc@bbc.uk', '${hashPassword('password')}', 'bbc', 'broadcast', '08012345678', '{"home": "london","office": "uk"}'),
    ('c@g.move', '${hashPassword('password')}', 'abc', 'def', '08012345678', '{"home": "shop","office": "home"}'),
    ('an@dela.ng', '${hashPassword('password')}', 'and', 'ela', '08012345678', '{"home": "ikorodu","office": "lagos"}'),
    ('soft@ware.eng', '${hashPassword('password')}', 'soft', 'eng', '08012345678', '{"home": "remote","office": "on-site"}');
`;

const createLoansTable = `
    CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        userid INT NOT NULL,
        useremail VARCHAR NULL,
        createdon TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR DEFAULT 'pending',
        repaid BOOLEAN DEFAULT false,
        amount FLOAT NOT NULL,
        tenor INT NOT NULL,
        interest FLOAT NOT NULL,
        balance FLOAT NOT NULL,
        paymentinstallment FLOAT NOT NULL
    );
`;
    
const populateLoansTable = `
        INSERT INTO loans(userid, status, repaid, amount, tenor, interest, balance, paymentinstallment)
        VALUES (1, 'approved', false, 50000, 12, 2500, 36999.35, 4375),
        (2, 'approved', true, 100000, 12, 5000, 0, 8750),
        (3, 'approved', false, 200000, 8, 10000, 200000, 26250),
        (4, 'approved', false, 25000, 12, 1250, 24500, 2187.5),
        (5, 'approved', false, 45000, 6, 2250, 26250, 7875),
        (6, 'pending', false, 80000, 12, 4000, 8000, 7000),
        (7, 'rejected', false, 60000, 6, 3000, 6000, 10500),
        (8, 'approved', false, 125000, 12, 6250, 20000, 10937.5),
        (9, 'rejected', false, 190000, 12, 9500, 19000, 16625),
        (10, 'pending', false, 1000000, 12, 50000, 0, 87500);
    `;
    
const createRepaymentsTable = `
    CREATE TABLE IF NOT EXISTS repayments (
        id SERIAL PRIMARY KEY,
        loanid INT NOT NULL,
        adminid INT NOT NULL,
        createdon TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        amount FLOAT NOT NULL
    );
`;
const populateRepaymentsTable = `
        INSERT INTO repayments(loanid, adminid, amount)
        VALUES (1, 3, 4375),
            (1, 3, 4375),
            (2, 1, 26250),
            (1, 2, 4375),
            (3, 4, 2875),
            (5, 8, 10500),
            (4, 3, 4375),
            (8, 1, 4375),
            (8, 4, 4375),
            (10, 8, 4375)
    `;

const queries = [
    createUserTable, createLoansTable, createRepaymentsTable,
    populateUserTable, populateLoansTable, populateRepaymentsTable
];

const createDB = async () => {
    for (const query of queries) {
        dev_logger(query);
        test_logger(query);
        await pool.query(query);
    }
};

export default createDB;
