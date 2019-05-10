// should is not used directly in the file but is added as a mocha requirement

import supertest from 'supertest';
import app from '../app';

const server = supertest.agent(app);

describe('/: Home page', () => {
    it('should return home page', done => {
        server
            .get('/')
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
});

describe('/: About', () => {
    it('should return 200', done => {
        server
            .get('/about')
            .expect(200)
            .end((err, res) => {
                res.status.should.be.equal(200);
                done();
            });
    });
});

describe('/: server 404', () => {
    it('should render the error page', done => {
        server
            .get('/unknown-page')
            .expect(404)
            .end((err, res) => {
                res.status.should.be.equal(404);
                done();
            });
    });
});
