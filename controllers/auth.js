const _ = require('underscore');
const utils = require('../utils/helpers');
const users = require('../utils/sample.users');

const index = (req, res) => {
    res.render('index', { title: 'Welcome' });
};
const about = (req, res) => {
    res.render('about', { title: 'About' });
};

const signup = (req, res) => {
    if (req.method === 'GET') {
        res.render('registration', { title: 'Sign Up' });
    }
    else {
        const { email, password, confirm_password } = req.body;
        const id = utils.get_random_id();
        // const token = utils.generate_token(email, password);
        if (password !== confirm_password) {
            res.send({ status: 404, error: 'Passwords do not match' });
        }
        else {
            res.send({
                status: 201,
                data: {
                    id,
                    email,
                    password,
                    first_name: '',
                    last_name: '',
                    address: {
                        home: '',
                        office: '',
                    },
                    status: 'unverified',
                    isAdmin: false,
                    token: '45erkjherht45495783',
                }
            });
        }
    }
};

const signin = (req, res) => {
    if (req.method === 'GET') {
        res.render( 'authentication', { title: 'Sign In' });
    }
    else {
        const { email, password } = req.body;
        const [ user, ] = _.filter(users, user => (user.email === email));
        if (user) {
            if (user.password === password) res.send({
                status: 200, data: user
            });
            else res.send({
                status: 404, error: 'Email and password do not match'
            });
        }
        else res.send({ status: 404, error: 'User not found' });
    }
};

module.exports = { 
    index,
    about,
    signup,
    signin
};
