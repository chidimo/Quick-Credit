import sinon from 'sinon';

import AuthenticationMiddleware from '../middleware/authentication';

sinon.stub(AuthenticationMiddleware, 'verifyToken').callsFake(
    (req, res, next) => next()
);
