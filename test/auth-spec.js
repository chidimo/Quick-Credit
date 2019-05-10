// should is not used directly in the file but is added as a mocha requirement

import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

const server = supertest.agent(app);

describe('/auth/signup', () => {
    describe('/auth/signup GET', () => {
        it('should return the signup form page', done => {
            server
                .get('/auth/signup')
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });

    describe('auth/signup POST', () => {
        it('should register and return user', done => {
            server
                .post('/auth/signup')
                .send({ email: 'email@address.com', password: 'password', 
                    confirm_password: 'password' })
                .expect(200)
                .end((err, res) => {
                    res.body.status.should.equal(201);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property(
                        'email', 'email@address.com');
                    done();
                });
        });
        
        it("should return error if passwords don't match", done => {
            server
                .post('/auth/signup')
                .send({ email: 'email@address.com', password: 'password',
                    confirm_password: 'wrong' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal(
                        'Password confirmation does not match password');
                    done();
                });
        });
    });
});

describe('/auth/signin', () => {
    describe('/auth/signin: GET', () => {
        it('should return the signin form page', done => {
            server
                .get('/auth/signin')
                .expect(200)
                .end((err, res) => {
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });

    describe('/auth/signin: post', () => {
        it('should return registered user if found', done => {
            const user = { email: 'me@yahoo.com', password: 'password' };
            const token = jwt.sign(
                { ...user, confirm_password: 'password' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            server
                .post('/auth/signin')
                .send({ ...user, token })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.data.should.be.an.instanceOf(Object);
                    res.body.data.should.have.property('email', 'me@yahoo.com');
                    res.body.data.should.have.property('token', token);
                    done();
                });
        });
        
        it('should return invalid token error', done => {
            const user = { email: 'me@yahoo.com', password: 'password' };
            server
                .post('/auth/signin')
                .send({ ...user, token: 'somerandomstring' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.error.should.equal('Invalid token');
                    done();
                });
        });

        it('should return wrong password error', done => {
            server
                .post('/auth/signin')
                .send({ email: 'me@yahoo.com', password: 'wrongpassword' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal('Wrong password');
                    done();
                });
        });
    
        it('should return error if user is not found', done => {
            server
                .post('/auth/signin')
                .send({ email: 'email@address.com', password: 'password' })
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(422);
                    res.body.errors[0].msg.should.equal('User not found');
                    done();
                });
        });
    });

});
