/* eslint-disable func-style */
/* eslint-disable prefer-arrow-callback */
// should is not used directly in the file but is added as a mocha requirement

import supertest from 'supertest';
import app from '../app';
import { test_logger } from '../utils/loggers';
import { createDB, clearDB } from '../utils/localDbOps';

const server = supertest.agent(app);
const BASE_URL = '/api/v1';

describe('/users', () => {

    before(async () => {
        test_logger('Creating DB in users-spec');
        await createDB();
    });

    after(async () => {
        test_logger('Clearing DB in users-spec');
        await clearDB();
    });

    describe('/auth/signup', () => {
        describe('POST /auth/signup', () => { 
            it('should return invalid email error', done => {
                server
                    .post(`${BASE_URL}/auth/signup`)
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
                    confirm_password: 'password'
                };
                server
                    .post(`${BASE_URL}/auth/signup`)
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(201);
                        res.body.data.should.have.property(
                            'email', `${data.email}`);
                        res.body.data.should.have.property('token');
                        done();
                    });
            });

            it('should indicate if user already exists', done => {
                const email = 'a@b.com';
                const data = {
                    email, password: 'password',
                    confirm_password: 'password', firstname: 'chidi',
                    lastname: 'orjinta'
                };
                server
                    .post(`${BASE_URL}/auth/signup`)
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(409);
                        res.body.error.should.equal(
                            `User with email ${email} already exists`);
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
                    .post(`${BASE_URL}/auth/signup`)
                    .send(data)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(422);
                        res.body.errors[0].msg.should.equal(
                            'Password confirmation does not match password');
                        done();
                    });
            });

            describe('/users/:id/account/confirmation', () => {
                it('should confirm a user email account', done => {
                    const id = 5;
                    server
                        .get(`${BASE_URL}/users/${id}/account/confirmation`)
                        .expect(200)
                        .end((err, res) => {
                            res.status.should.equal(200);
                            res.body.data.should.have.property(
                                'mailverified', true);
                            done();
                        });
                });

                it('should send a confirmation email', done => {
                    const id = 1;
                    server
                        .get(`${BASE_URL}/users/${id}/account/mail`)
                        .expect(200)
                        .end((err, res) => {
                            res.status.should.equal(200);
                            done();
                        });
                });
            });

        });
    });

    describe('/auth/signin', () => {
        describe('POST /auth/signin', () => {
            it('should return registered user if found', done => {
                const user = { email: 'a@b.com', password: 'password' };
                server
                    .post(`${BASE_URL}/auth/signin`)
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
                    .post(`${BASE_URL}/auth/signin`)
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
                    .post(`${BASE_URL}/auth/signin`)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        res.status.should.equal(404);
                        res.body.error.should.equal(
                            `User with email ${user.email} not found`);
                        done();
                    });
            });
        });
    });

    describe('POST /users/:email/reset_password', () => {
        it('should return error if user not found', done => {
            const email = 'unknown@email.com';
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        `User with email ${email} not found`);
                    done();
                });
        });

        it('should update remembered password', done => {
            const email = 'a@b.com';
            const data = { 
                current_password: 'password', 
                new_pass: 'newpassword', 
                confirm_new: 'newpassword' 
            };
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(204);
                    done();
                });
        });

        it('should update unremembered password', done => {
            const email = 'a@b.com';
            const data = { 
                current_password: '', 
                new_pass: '', 
                confirm_new: '' 
            };
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(204);
                    done();
                });
        });

        it('should return error if passwords do not match', done => {
            const email = 'a@b.com';
            const data = { 
                current_password: 'password', 
                new_pass: 'newpassword', 
                confirm_new: 'newpassword1' 
            };
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal(
                        'Password confirmation does not match password');
                    done();
                });
        });

        it('should update unremembered password', done => {
            const email = 'a@b.com';
            const data = { 
                current_password: 'password', 
                new_pass: '', 
                confirm_new: '' 
            };
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal(
                        'Please enter a new password');
                    done();
                });
        });

        it('should return 404 for wrong password', done => {
            const email = 'a@b.com';
            const data = { 
                current_password: 'passpart',
                new_pass: 'password',
                confirm_new: 'password' 
            };
            server
                .post(`${BASE_URL}/users/${email}/reset_password`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(
                        'You entered an incorrect password');
                    done();
                });
        });
    });
    
    describe('PATCH /users/:id/verify', () => {
        it('should verify user', done => {
            server
                .patch(`${BASE_URL}/users/2/verify`)
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
                .patch(`${BASE_URL}/users/${id}/verify`)
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
                .get(`${BASE_URL}/users`)
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
                .get(`${BASE_URL}/users`)
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
                .get(`${BASE_URL}/users`)
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
                .get(`${BASE_URL}/users/1`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    done();
                });
        });
    
        it('should return error message for non-existent user', done => {
            server
                .get(`${BASE_URL}/users/45`)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal('User with id 45 not found');
                    done();
                });
        });

        it('should return 500 internal server error', done => {
            server
                .get(`${BASE_URL}/users/whatever`)
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
                .patch(`${BASE_URL}/users/1/update`)
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

        it('should indicate if user is not found', done => {
            const id = 100;
            server
                .patch(`${BASE_URL}/users/${100}/update`)
                .send({ 
                    firstname: 'new_firstname',
                    lastname: 'new_lastname',
                    phone: '07031234567',
                    home: 'new_home',
                    office: 'new_office' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.error.should.equal(`User with id ${id} not found`);
                    done();
                });
        });
        it('should throw error for wrong phone number format', done => {
            server
                .patch(`${BASE_URL}/users/4/update`)
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
                .patch(`${BASE_URL}/users/4/photo/update`)
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
                .get(`${BASE_URL}/users/${id}/photo/upload/`)
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
