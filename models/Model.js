import { Pool } from 'pg';
import dotenv from 'dotenv';

import Settings from '../settings';
import { dev_logger, test_logger } from '../utils/loggers';

dotenv.config();

const config = {
    user: Settings.dbSettings().dbUser,
    host: Settings.dbSettings().dbHost,
    port: Settings.dbSettings().dbPort,
    database: Settings.dbSettings().databaseName,
    password: Settings.dbSettings().dbPassword
};

test_logger(`test db config ${JSON.stringify(config)}`);

class Model {
    constructor(table) {
        this.table = table;
        this.pool = new Pool(config);
        this.pool.on('error', (err, client) => {
            dev_logger(`****Unexpected error on idle client, ${err}`);
            process.exit(-1);
        });
    }

    async select(columns, clause) {
        let query = `SELECT ${columns} FROM ${this.table}`;
        if (clause) query = `${query} WHERE ${clause}`;
        dev_logger(`\nSELECT QUERY: ${query}\n`);
        return await this.pool.query(query);
    }

    async update(columns, clause) {
        const query = `UPDATE ${this.table} SET ${columns} WHERE ${clause}`;
        dev_logger(`\nUPDATE QUERY: ${query}\n`);
        return await this.pool.query(query);
    }

    async insert(columns, values) {
        const query = `INSERT INTO ${this.table} ${columns} VALUES(${values})`;
        dev_logger(`\nINSERT QUERY: ${query}\n`);
        return await this.pool.query(query);
    }
    
}

export default Model;
