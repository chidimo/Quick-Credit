// should is not used directly in the file but is added as a mocha requirement
import sinon from 'sinon';
import sgMail from '@sendgrid/mail';
import supertest from 'supertest';
import chai from 'chai';
import sinonChai from 'sinon-chai';

import app from '../app';
import LoansController, { loans_model } from '../controllers/LoansController';

chai.use(sinonChai);
const { expect } = chai;

const server = supertest.agent(app);
const BASE_URL = '/api/v1';

describe('/loans', () => {

    const sandbox = sinon.createSandbox();

    before(() => {
        sandbox.stub(sgMail, 'send').returns();
    });

    after(() => {
        sandbox.restore();
    });

    describe('/loans: Get all loans', () => {
        it('should return a list of all loans', done => {
            server
                .get(`${BASE_URL}/loans`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const each of res.body.data) {
                        each.should.have.property('id');
                        each.should.have.property('userid');
                        each.should.have.property('createdon');
                        each.should.have.property('status');
                        each.should.have.property('amount');
                        each.should.have.property('tenor');
                        each.should.have.property('repaid');
                        each.should.have.property('interest');
                        each.should.have.property('balance');
                        each.should.have.property('paymentinstallment');
                    }
                    done();
                });
        });

        it('should throw error while getting all loans', async () => {
            const req = {
                query: { status: 'approved', repaid: true }
            };
            const res = { status() {}, json() {} };
            sinon.stub(res, 'status').returnsThis();
            sinon.stub(loans_model, 'select').throws();
            await LoansController.get_all_loans(req, res);
            expect(res.status).to.have.been.calledWith(500); 
            sinon.restore();      
        });
                
        it('should return all loans which have BEEN repaid', done => {
            server
                .get(`${BASE_URL}/loans`)
                .query({ status: 'approved', repaid: true })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const loan of res.body.data) {
                        loan.should.have.property('status', 'approved');
                        loan.should.have.property('repaid', true);
                    }
                    done();
                });
        });

        it('should return all loans which have NOT been repaid', done => {
            server
                .get(`${BASE_URL}/loans`)
                .query({ status: 'approved', repaid: false })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const loan of res.body.data) {
                        loan.should.have.property('status', 'approved');
                        loan.should.have.property('repaid', false);
                    }
                    done();
                });
        });

        describe('/loans/user', () => {
            it('should return all loans for specified user', done => {
                const id = 1;
                server
                    .get(`${BASE_URL}/loans/user/${id}`)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(200);
                        for (const each of res.body.data) {
                            each.should.have.property('userid', id);
                        }
                        done();
                    });
            });

            it('should throw error while getting user loans', async () => {
                const req = { params: { id: 5 } };
                const res = { status() {}, json() {} };
                sinon.stub(res, 'status').returnsThis();
                sinon.stub(loans_model, 'select').throws();
                await LoansController.get_user_loans(req, res);
                expect(res.status).to.have.been.calledWith(500);       
            });
        });
    });

    describe('/loans: Get loan', () => {
        it('should return correct data for existent loan', done => {
            server
                .get(`${BASE_URL}/loans/1`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('id');
                    res.body.data.should.have.property('userid');
                    res.body.data.should.have.property('createdon');
                    res.body.data.should.have.property('status');
                    res.body.data.should.have.property('amount');
                    res.body.data.should.have.property('tenor');
                    res.body.data.should.have.property('repaid');
                    res.body.data.should.have.property('interest');
                    res.body.data.should.have.property('balance');
                    res.body.data.should.have.property('paymentinstallment');
                    done();
                });
        });
    
        it('should return error message for non-existent loan', done => {
            const id = 12345;
            server
                .get(`${BASE_URL}/loans/${id}`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        `Loan with id ${id} not found`);
                    done();
                });
        });
    });
    
    describe('/loans: Create a loan', () => {
        it('should create and return a new loan', done => {
            const data = { userid: 12, amount: 50000, tenor: 12 };
            server
                .post(`${BASE_URL}/loans`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(201);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('userid', data.userid);
                    res.body.data.should.have.property('createdon');
                    res.body.data.should.have.property('status', 'pending');
                    res.body.data.should.have.property('repaid', false);
                    res.body.data.should.have.property('amount', data.amount);
                    res.body.data.should.have.property('tenor', data.tenor);
                    res.body.data.should.have.property('interest', 2500);
                    res.body.data.should.have.property('balance', 50000);
                    res.body.data.should.have.property(
                        'paymentinstallment', 4375);
                    done();
                });
        });
        
        it('should return errors for large tenor', done => {
            const data = { userid: '25', amount: 50000, tenor: 13 };
            server
                .post(`${BASE_URL}/loans`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(422);
                    res.body.errors.should.be.an.instanceOf(Array);
                    res.body.errors[0].msg.should.equal(
                        'Tenor cannot be greater than 12'
                    );
                    done();
                });
        });
            
        it('should return errors for large amount', done => {
            const data = { userid: 30, amount: 5000000, tenor: 10 };
            server
                .post(`${BASE_URL}/loans`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(422);
                    res.body.errors.should.be.an.instanceOf(Array);
                    res.body.errors[0].msg.should.equal(
                        'Amount cannot be greater than 1,000,000'
                    );
                    done();
                });
        });
    });

    describe('/loans: Approve or reject a loan application', () => {
        it('should set status to approved', done => {
            server
                .patch(`${BASE_URL}/loans/5/approve`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.status.should.be.equal('approved');
                    done();
                });
        });
        
        it('should set status to rejected', done => {
            server
                .patch(`${BASE_URL}/loans/6/reject`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.status.should.be.equal('rejected');
                    done();
                });
        });
        
        it('should return error if loan is not found', done => {
            const id = 150;
            server
                .patch(`${BASE_URL}/loans/${id}/reject`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        `Loan with id ${id} not found`);
                    done();
                });
        });
    });
    
    describe('loans: View loan repayment history', () => {
        it('should return array of loan repayments given a loan Id', done => {
            server
                .get(`${BASE_URL}/loans/2/repayments`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const payment of res.body.data) {
                        payment.loanid.should.equal(2);
                    }
                    done();
                });
        });
    });
    
    describe('/loans: Create loan repayment', () => {
        it('should create and return a repayment', done => {
            const data = { amount: 4375, adminid: 3 };
            server
                .post(`${BASE_URL}/loans/4/repayment`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(201);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('loanid', 4);
                    res.body.data.should.have.property('adminid', 3);
                    res.body.data.should.have.property('amount', 4375);
                    res.body.data.should.have.property('createdon');
                    done();
                });
        });
    });

    describe('/repayments', () => {
        it('should return all repayments', done => {
            server
                .get(`${BASE_URL}/repayments`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    for (const each of res.body.data) {
                        each.should.have.property('id');
                        each.should.have.property('loanid');
                        each.should.have.property('createdon');
                        each.should.have.property('adminid');
                        each.should.have.property('amount');
                    }
                    done();
                });
        });
    });

    describe('/repayments', () => {
        it('should return a single repayment', done => {
            const id = 5;
            server
                .get(`${BASE_URL}/repayments/${id}`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('id', id);
                    res.body.data.should.have.property('loanid');
                    res.body.data.should.have.property('adminid');
                    res.body.data.should.have.property('createdon');
                    res.body.data.should.have.property('amount');
                    done();
                });
        });
        it('should return error if repayment is not found', done => {
            const id = 150;
            server
                .get(`${BASE_URL}/repayments/${id}`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        `Repayment with id ${id} not found`);
                    done();
                });
        });
    });
        
});
