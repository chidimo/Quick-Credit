import sinon from 'sinon';
import Messenger from '../utils/Messenger';

import { test_logger } from '../utils/loggers';
import { createDB, clearDB } from '../utils/localDbOps';

const sandbox = sinon.createSandbox();

before(async () => {
    test_logger('Creating DB');
    await createDB();
});

after(async () => {
    test_logger('Clearing DB');
    await clearDB();
});

beforeEach(() => {
    sandbox.stub(Messenger, 'sendEmail').callsFake(
        ((data, template_data) => {console.log('\n\nMocked MESSENGER\n\n'); return; })
    );
});

afterEach(() => {
    sinon.restore(); // restore the globally stubbed AuthenticationMiddleware
    sandbox.restore(); // restore the Messenger sandbox
});
