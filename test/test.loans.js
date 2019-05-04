require('should');
const supertest = require('supertest');
const assert = require('assert');
const app = require('../app');

const server = supertest.agent(app);

describe('Loans endpoint: Get all loans', () => {
    it('should be return a list of all loans', done => {
        server
            .get('/loans')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Array);
                for (const each of res.body.data) {
                    assert(each.should.be.an.instanceOf(Object));
                }
                done();
            });
    });
});

describe('Loans endpoint: Get loan', () => {
    it('should return correct data for existent loan', done => {
        server
            .get('/loans/123456789')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Object);
                done();
            });
    });

    it('should return error message for non-existent loan', done => {
        server
            .get('/loans/12345')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(404);
                res.body.error.should.equal('Loan with id 12345 not found');
                assert(res.body.error === 'Loan with id 12345 not found');
                done();
            });
    });
});

describe('Loans endpoint: Get all loans by their repayment status', () => {
    it('should return all loans which have NOT been repaid', done => {
        server
            .get('/loans')
            .query({ status: 'approved', repaid: false })
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Array);
                for (const loan of res.body.data) {
                    assert(loan.status === 'approved');
                    assert(loan.repaid === false);
                }
                done();
            });
    });

    it('should return all loans which have BEEN repaid', done => {
        server
            .get('/loans')
            .query({ status: 'approved', repaid: true })
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Array);
                for (const loan of res.body.data) {
                    assert(loan.status === 'approved');
                    assert(loan.repaid === true);
                }
                done();
            });
    });
});

describe('Loans endpoint: Create a loan', () => {
    it('should create and return a new loan', done => {
        server
            .post('/loans')
            .send({ email: 'user@email.com', amount: 50000, tenor: 12 })
            .expect(200)
            .end((err, res) => {
                res.body.status.should.be.equal(201);
                res.body.data.should.be.an.instanceOf(Object);
                res.body.data.should.have.property('status', 'pending');
                res.body.data.should.have.property('paymentInstallment', 4375);
                res.body.data.should.have.property('interest', 2500);
                done();
            });
    });
});

describe('Loans endpoint: Approve or reject a loan application', () => {
    it('should set status to approved', done => {
        server
            .patch('/loans/123456789/approve')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.status.should.be.equal('approved');
                done();
            });
    });

    it('should set status to rejected', done => {
        server
            .patch('/loans/123456789/reject')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.status.should.be.equal('rejected');
                done();
            });
    });
});

describe('Loans endpoint: View loan repayment history', () => {
    it('should return array of loan repayments given a loan Id', done => {
        server
            .get('/loans/123456789/repayments')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Array);
                for (const payment of res.body.data) {
                    payment.loanId.should.equal('123456789');
                }
                done();
            });
    });
});

describe('Loans endpoint: Create loan repayment', () => {
    it('should create and return a repayment', done => {
        server
            .post('/loans/123456789/repayment')
            .send({ amount: 4375 })
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(201);
                res.body.data.should.be.an.instanceOf(Object);
                res.body.data.should.have.property('loanId', '123456789');
                res.body.data.should.have.property('amount', 4375);
                done();
            });
    });
});
