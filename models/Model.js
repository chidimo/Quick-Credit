import { dev_logger } from '../utils/loggers';
import pool from './pool';

class Model {
    constructor(table) {
        this.table = table;
        this.pool = pool;
        this.pool.on('error', (err, client) => {
            if (err) {
                dev_logger(`****Unexpected error on idle client, ${err}`);
            }
            dev_logger(`Client: ${client}`);
            process.exit(-1);
        });
    }

    async select(columns, clause) {
        let query = `SELECT ${columns} FROM ${this.table}`;
        if (clause) query = `${query} ${clause}`;
        dev_logger(`\nSELECT QUERY: ${query}\n`);
        return await this.pool.query(query);
    }

    async update(columns, clause) {
        const query = `UPDATE ${this.table} SET ${columns} ${clause}`;
        dev_logger(`\nUPDATE QUERY: ${query}\n`);
        return await this.pool.query(query);
    }
    
    async incrementation_update(column, value, clause) {
        // insitu increment of a particular value
        const query = `
            UPDATE ${this.table}
            SET ${column}=${column} - ${value}
            ${clause}
        `;
        dev_logger(`\nUPDATE QUERY: ${query}\n`);
        return await this.pool.query(query);
    }

    async insert_with_return(columns, values) {
        const query = `
            INSERT INTO ${this.table} ${columns}
            VALUES(${values})
            RETURNING id
        `;
        dev_logger(`\nINSERT WITH RETURN QUERY: ${query}\n`);
        return await this.pool.query(query);
    }
    
}

export default Model;
