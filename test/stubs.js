import sinon from 'sinon';

import AuthenticationMiddleware from '../middleware/authentication';

sinon.stub(AuthenticationMiddleware, 'verifyToken').callsFake(
    (req, res, next) => next()
);

sinon.stub(AuthenticationMiddleware, 'generateToken').callsFake(
    (req, res, next) => next()
);
