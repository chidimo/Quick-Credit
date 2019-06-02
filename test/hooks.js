import sinon from 'sinon';

import { test_logger } from '../utils/loggers';
import { createDB, clearDB } from '../utils/localDbOps';


before(async () => {
    test_logger('Creating DB');
    await createDB();
});

after(async () => {
    test_logger('Clearing DB');
    await clearDB();
});

afterEach(() => {
    sinon.restore(); // restore the globally stubbed AuthenticationMiddleware
});
