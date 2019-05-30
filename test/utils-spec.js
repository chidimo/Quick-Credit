import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sgMail from '@sendgrid/mail';

import Messenger from '../utils/Messenger';

chai.use(sinonChai);
const { expect, assert } = chai;

describe('Messenger', () => {
    describe('sendMail', () => {
        const sandbox = sinon.createSandbox();

        it('should return error passed in callback', done => {
            const err = sinon.stub();
            const result = null;

            const stub = sandbox.stub(sgMail, 'send');
            Messenger.sendEmail({}, {});
            const res = stub.yield(err, result);

            assert(sgMail.send.called);
            expect(res[0]).to.equal(err);
            sandbox.restore();
            done();
        });
        
        it('should return result passed in callback', done => {
            const err = null;
            const result = sinon.stub();

            const stub = sandbox.stub(sgMail, 'send');
            Messenger.sendEmail({}, {});
            const res = stub.yield(err, result);

            assert(sgMail.send.called);
            expect(res[0]).to.equal(result);
            sandbox.restore();
            done();
        });
    });
});
