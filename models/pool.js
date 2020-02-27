import { Pool } from 'pg';
import dotenv from 'dotenv';

import { connectionString } from '../settings';

dotenv.config();

const pool = new Pool({ connectionString });

export default pool;
