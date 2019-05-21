/* eslint-disable func-style */
/* eslint-disable prefer-arrow-callback */
// should is not used directly in the file but is added as a mocha requirement

import supertest from 'supertest';
import app from '../app';
import { exec } from 'child_process';
import { test_logger } from '../utils/loggers';

const server = supertest.agent(app);

describe('/users', () => {
    const dump = 'psql -h localhost -d testdb -U postgres -f test/testdb.sql';
    const connect = 'psql -h localhost -d testdb -U postgres -c';
    const query = 'delete from users';
    const clear = `${connect} "${query}"`;

    before(done => {
        exec(dump, err => {
            if (err) {
                test_logger(`dump error: ${ err }`);
            }
            test_logger('****Database populated successfully.****');
            done();
        });
    });
   
    after(done => {
        exec(clear, err => {
            if (err) {
                test_logger(`Error clearing db ${err}`);
            }
        });
        test_logger('****Database cleared successfully.****');
        done();
    });

    describe('/auth/signup', () => {
        describe('POST /auth/signup', () => { 
            it('should return invalid email error', done => {
                server
                    .post('/auth/signup')
                    .send({ email: 'abcd', password: 'wrongpassword' })
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(422);
                        res.body.errors[0].msg.should.equal(
                            'Please provide a valid email address');
                        done();
                    });
            });

            it('should register and return user', done => {
                const data = {
                    email: 'valid@address.com', password: 'password',
                    confirm_password: 'password', firstname: 'chidi',
                    lastname: 'orjinta'
                };
                server
                    .post('/auth/signup')
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(201);
                        res.body.data.should.have.property(
                            'email', `${data.email}`);
                        res.body.data.should.have.property(
                            'firstname', `${data.firstname}`);
                        res.body.data.should.have.property(
                            'lastname', `${data.lastname}`);
                        res.body.data.should.have.property('token');
                        done();
                    });
            });
                
            it('should catch password mismatch error', done => {
                const data = {
                    email: 'valid@address.com', password: 'password',
                    confirm_password: 'wrong', firstname: 'chidi',
                    lastname: 'orjinta'
                };
                server
                    .post('/auth/signup')
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(422);
                        res.body.errors[0].msg.should.equal(
                            'Password confirmation does not match password');
                        done();
                    });
            });
                
            it('should catch no firstname error', done => {
                const data = {
                    email: 'valid@address.com', password: 'password',
                    confirm_password: 'password', lastname: 'orjinta'
                };
                server
                    .post('/auth/signup')
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(422);
                        res.body.errors[0].msg.should.equal(
                            'First name is required');
                        done();
                    });
            });
                
            it('should catch no lastname error', done => {
                const data = {
                    email: 'valid@address.com', password: 'password',
                    confirm_password: 'password', firstname: 'chidi'
                };
                server
                    .post('/auth/signup')
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(422);
                        res.body.errors[0].msg.should.equal(
                            'Last name is required');
                        done();
                    });
            });
        });
    });

    describe('/auth/signin', () => {
        describe('POST /auth/signin', () => {
            it('should return registered user if found', done => {
                const user = { email: 'a@b.com', password: 'password' };
                server
                    .post('/auth/signin')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(200);
                        res.body.data.should.be.an.instanceOf(Object);
                        res.body.data.should.have.property(
                            'email', 'a@b.com');
                        done();
                    });
            });

            it('should return error for wrong password', done => {
                const user = { email: 'a@b.com', password: 'wrongpassword' };
                server
                    .post('/auth/signin')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(404);
                        res.body.error.should.equal('Incorrect password');
                        done();
                    });
            });

            it('should return error if user does NOT exist', done => {
                const user = { email: 'not@exist.com', password: 'password' };
                server
                    .post('/auth/signin')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(404);
                        res.body.error.should.equal(
                            `User with email ${user.email} does not exist.`);
                        done();
                    });
            });
        });
    });

    describe('PATCH /users/:id/verify', () => {
        it('should verify user', done => {
            server
                .patch('/users/2/verify')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('status', 'verified');
                    done();
                });
        });
        it('should not verify non-existent user', done => {
            const id = 100;
            server
                .patch(`/users/${id}/verify`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(`User with id ${id} not found`);
                    done();
                });
        });
    });
    
    describe('GET /users?status=', () => {
        it('should return a list of all users', done => {
            server
                .get('/users')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Array);
                    for (const each of res.body.data) {
                        each.should.have.property('id');
                        each.should.have.property('email');
                        each.should.have.property('firstname');
                        each.should.have.property('lastname');
                        each.should.have.property('phone');
                        each.should.have.property('status');
                        each.should.have.property('address');
                    }
                    done();
                });
        });
        
        it('should return a list of verified users', done => {
            server
                .get('/users')
                .query({ status: 'verified' })
                .end((err, res) => {
                    res.status.should.equal(200);
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
                    res.status.should.equal(200);
                    for (const user of res.body.data) {
                        user.status.should.equal('unverified');
                    }
                    done();
                });
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user if user with id is found', done => {
            server
                .get('/users/1')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    done();
                });
        });
    
        it('should return error message for non-existent user', done => {
            server
                .get('/users/45')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal('User with id 45 not found');
                    done();
                });
        });

        it('should return 500 internal server error', done => {
            server
                .get('/users/whatever')
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(500);
                    res.body.message.should.equal('Internal server error');
                    done();
                });
        });
    });

    describe('PATCH /users/:id/update', () => {
        it('should update and return the user profile', done => {
            server
                .patch('/users/1/update')
                .send({ 
                    firstname: 'new_firstname',
                    lastname: 'new_lastname',
                    phone: '07031234567',
                    home: 'new_home',
                    office: 'new_office' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property(
                        'firstname', 'new_firstname');
                    res.body.data.should.have.property(
                        'lastname', 'new_lastname');
                    res.body.data.should.have.property('phone', '07031234567');
                    res.body.data.address.should.have.property(
                        'home', 'new_home');
                    res.body.data.address.should.have.property(
                        'office', 'new_office');
                    done();
                });
        });
        it('should throw error for wrong phone number format', done => {
            server
                .patch('/users/4/update')
                .send({ 
                    firstname: 'new_first',
                    lastname: 'new_last',
                    phone: '070123456789',
                    home: 'new_home',
                    office: 'new_office' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal(
                        'Wrong number format: E.G. 07012345678'
                    );
                    done();
                });
        });
    });

    describe('PATCH /users/:id/photo/update/', () => {
        it('should update user photo and return user', done => {
            const body = { photo_url: 'https://amazon.com/whatever' };
            server
                .patch('/users/4/photo/update')
                .send(body)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.photo.should.equal(body.photo_url);
                    done();
                });
        });
    });

    describe('GET /users/:id/photo/upload/', () => {
        it('should return a presigned url', done => {
            const id = 4;
            const filetype = 'image/png';
            server
                .get(`/users/${id}/photo/upload/`)
                .send({ filetype })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('signed_url');
                    done();
                });
        });
    });
        
});
