// should is not used directly in the file but is added as a mocha requirement

import { exec } from 'child_process';
import supertest from 'supertest';
import assert from 'assert';
import app from '../app';
import { test_logger } from '../utils/loggers';

const server = supertest.agent(app);

describe('/loans', () => {
    const dump = 'psql -h localhost -d testdb -U postgres -f test/testdb.sql';
    // const drop = 'psql -h localhost -U postgres -c "drop database testdb"';    
    before(done => {
        exec(dump, err => {
            if (err) {
                test_logger(`dump error: ${ err }`);
            }
            test_logger('****Database populated successfully.****');
            done();
        });
    });
   
    // after(done => {
    //     test_logger('After hook start');
    //     exec(drop, err => {
    //         if (err) {
    //             test_logger(`Fatal drop error ${err}`);
    //         }
    //     });
    //     test_logger('****Database DROPPED successfully.****');
    //     done();
    // });

    describe('/loans: Get all loans', () => {
        it('should be return a list of all loans', done => {
            server
                .get('/loans')
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
    });

    describe('/loans: Get loan', () => {
        it('should return correct data for existent loan', done => {
            server
                .get('/loans/1')
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
                .get(`/loans/${id}`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        `Loan with id ${id} does not exist`);
                    done();
                });
        });
    });
    
    describe('/loans: Create a loan', () => {
        it('should create and return a new loan', done => {
            const data = { userid: 12, amount: 50000, tenor: 12 };
            server
                .post('/loans')
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
                .post('/loans')
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
                .post('/loans')
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
                .patch('/loans/5/approve')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.status.should.be.equal('approved');
                    done();
                });
        });
        
        it('should set status to rejected', done => {
            server
                .patch('/loans/6/reject')
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
                .get('/loans/2/repayments')
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
                .post('/loans/4/repayment')
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
                .get('/repayments')
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

    describe('GET /repayments', () => {
        it('should return a single repayment', done => {
            const id = 5;
            server
                .get(`/repayments/${id}`)
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
    });
        
});
