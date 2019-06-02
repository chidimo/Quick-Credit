import jwt from 'jsonwebtoken';

import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

import { mockRequest, mockResponse } from './mocks';
import AuthenticationMiddleware from '../middleware/authentication';

chai.use(sinonChai);
const { expect, } = chai;

describe('Middleware', () => {

    beforeEach(() => { sinon.restore(); });

    describe('generateToken', () => {
        it('should generate and add token to reqeuest', done => {
            const req = mockRequest();
            const res = mockResponse();
            const next = sinon.stub();
            sinon.stub(jwt, 'sign').returns('token-string');
            AuthenticationMiddleware.generateToken(req, res, next);
            expect(req.token).to.equal('token-string');
            expect(next).to.have.been.called;
            done();
        });
    });
    
    describe('AuthenticationMiddleware', () => {
        describe('verifyToken', () => {
            it('should return error if token is missing', done => {
                const req = mockRequest();
                const res = mockResponse();
                const next = sinon.stub();
                AuthenticationMiddleware.verifyToken(req, res, next);
                expect(res.status).to.have.been.calledWith(422);
                expect(res.json).to.have.been.calledWith({ 
                    error: 'No token provided',
                    msg: 'Include a valid token in the x-access-token header'
                });
                done();
            });

            it('should return next for correct token', done => {
                const token = '123456';
                const options = {
                    headers: { 'x-access-token': token }
                };

                const req = mockRequest(options);
                const res = mockResponse();
                const next = sinon.stub();
                sinon.stub(jwt, 'verify').returns(token);
                AuthenticationMiddleware.verifyToken(req, res, next);
                expect(next).to.have.been.called;
                done();
            });

            it('should throw error on token verification', done => {
                const options = {
                    headers: { 'x-access-token': '123456' }
                };

                sinon.stub(jwt, 'verify').throws();
                const req = mockRequest(options);
                const res = mockResponse();
                const next = sinon.stub();
                AuthenticationMiddleware.verifyToken(req, res, next);
                expect(res.status).to.have.been.calledWith(422);
                expect(res.json).to.have.been.calledWith({
                    error: 'Invalid token'
                });
                done();
            });
        });        
    });
});
