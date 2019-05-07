import { _ } from 'underscore';
import utils from '../utils/helpers';
import users from '../utils/sample.users';

const AuthController = {

    index: (req, res) => {
        res.render('index', { title: 'Welcome' });
    },

    about: (req, res) => {
        res.render('about', { title: 'About' });
    },
    
    signup: (req, res) => {
        if (req.method === 'GET') {
            res.render('authentication', { title: 'Sign Up' });
        }
        else {
            const { email, password, confirm_password } = req.body;
            const id = utils.get_random_id();
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
    },
    
    signin: (req, res) => {
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
    },
};

export default AuthController;

