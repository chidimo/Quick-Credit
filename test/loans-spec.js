// should is not used directly in the file but is added as a mocha requirement

import supertest from 'supertest';
import assert from 'assert';
import app from '../app';

const server = supertest.agent(app);

describe('/loans', () => {

    describe('/loans: Get all loans', () => {
        it('should be return a list of all loans', done => {
            server
                .get('/loans')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const each of res.body.data) {
                        assert(each.should.be.an.instanceOf(Object));
                    }
                    done();
                });
        });
    });

    describe('/loans: Get loan', () => {
        it('should return correct data for existent loan', done => {
            server
                .get('/loans/123456789')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    done();
                });
        });
    
        it('should return error message for non-existent loan', done => {
            server
                .get('/loans/12345')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal('Loan with id 12345 not found');
                    assert(res.body.error === 'Loan with id 12345 not found');
                    done();
                });
        });
    });
    
    describe('/loans: Get all loans by their repayment status', () => {
        it('should return all loans which have NOT been repaid', done => {
            server
                .get('/loans')
                .query({ status: 'approved', repaid: false })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
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
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const loan of res.body.data) {
                        assert(loan.status === 'approved');
                        assert(loan.repaid === true);
                    }
                    done();
                });
        });
    });
    
    describe('/loans: Create a loan', () => {
        it('should create and return a new loan', done => {
            server
                .post('/loans')
                .send({ email: 'user@email.com', amount: 50000, tenor: 12 })
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(201);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('status', 'pending');
                    res.body.data.should.have.property('paymentInstallment', 4375);
                    res.body.data.should.have.property('interest', 2500);
                    done();
                });
        });
        
        it('should return errors for large tenor', done => {
            server
                .post('/loans')
                .send({ email: 'user@email.com', amount: 50000, tenor: 13 })
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
            server
                .post('/loans')
                .send({ email: 'user@email.com', amount: 5000000, tenor: 10 })
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
                .patch('/loans/123456789/approve')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.status.should.be.equal('approved');
                    done();
                });
        });
        
        it('should set status to rejected', done => {
            server
                .patch('/loans/123456789/reject')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.status.should.be.equal('rejected');
                    done();
                });
        });
    });
    
    describe('/loans: View loan repayment history', () => {
        it('should return array of loan repayments given a loan Id', done => {
            server
                .get('/loans/123456789/repayments')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const payment of res.body.data) {
                        payment.loanId.should.equal('123456789');
                    }
                    done();
                });
        });
    });
    
    describe('/loans: Create loan repayment', () => {
        it('should create and return a repayment', done => {
            server
                .post('/loans/123456789/repayment')
                .send({ amount: 4375 })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(201);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('loanId', '123456789');
                    res.body.data.should.have.property('amount', 4375);
                    done();
                });
        });
        
        it('should return error if amount is not a number', done => {
            server
                .post('/loans/123456789/repayment')
                .send({ amount: '4375+' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal(
                        'Repayment amount must be a number'
                    );
                    done();
                });
        });
    });
        
});
