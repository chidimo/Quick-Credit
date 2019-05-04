require('should');
const supertest = require('supertest');
const app = require('../app');

const server = supertest.agent(app);

describe('Users endpoint: Verify user', () => {
    it('should verify user', done => {
        server
            .patch('/users/bbc@bbc.uk/verify')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Object);
                res.body.data.should.have.property('status', 'verified');
                done();
            });
    });
});

describe('Users endpoint: Get all users', () => {
    it('should return a list of all users', done => {
        server
            .get('/users')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Array);
                done();
            });
    });

    it('should return a list of verified users', done => {
        server
            .get('/users')
            .query({ status: 'verified' })
            .end((err, res) => {
                res.body.status.should.equal(200);
                for (const user of res.body.data) {
                    user.status.should.equal('verified');
                }
                done();
            });
    });

    it('should return a list of unverified users', done => {
        server
            .get('/users')
            .query({ status: 'unverified' })
            .end((err, res) => {
                res.body.status.should.equal(200);
                for (const user of res.body.data) {
                    user.status.should.equal('unverified');
                }
                done();
            });
    });
});

describe('Users endpoint: Get a user', () => {
    it('should return a user if user with id is found', done => {
        server
            .get('/users/123456789')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Object);
                done();
            });
    });

    it('should return error message for non-existent user', done => {
        server
            .get('/users/12345')
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(404);
                res.body.error.should.equal('User with id 12345 not found');
                done();
            });
    });
});

describe('Users endpoint: Edit profile', () => {
    it('should update and return the user profile', done => {
        server
            .patch('/users/123456789/update')
            .send({ 
                firstName: 'newFN',
                lastName: 'newLN',
                phone: '070312345678',
                home: 'newHome',
                office: 'newOffice' })
            .expect(200)
            .end((err, res) => {
                res.body.status.should.equal(200);
                res.body.data.should.be.an.instanceOf(Object);
                res.body.data.should.have.property('firstName', 'newFN');
                res.body.data.should.have.property('lastName', 'newLN');
                res.body.data.should.have.property('phone', '070312345678');
                res.body.data.address.should.have.property('home', 'newHome');
                res.body.data.address.should.have.property(
                    'office', 'newOffice');
                done();
            });
    });
});
