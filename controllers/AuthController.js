import { _ } from 'underscore';
import utils from '../utils/helpers';
import users from '../utils/sample.users';

import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const AuthController = {

    index: (req, res) => {
        res.render('index', { title: 'Welcome' });
    },

    about: (req, res) => {
        res.render('about', { title: 'About' });
    },

    signup: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('password')
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).trim()
            .withMessage('Password must be at least 8 characters')
            .isLength({ max: 16 })
            .withMessage('Password must be at most 16 characters')
            .isAlphanumeric().withMessage('Password must be alphanumeric')
            .custom((value, { req }) => {
                if (value !== req.body.confirm_password) {
                    throw new Error(
                        'Password confirmation does not match password'
                    );
                }
                else return value;
            }),
        sanitizeBody('email').trim().escape(),
        sanitizeBody('password').trim().escape(),
        sanitizeBody('confirm_password').trim().escape(),

        (req, res) => {
            
            if (req.method === 'GET') {
                res.render('authentication', { title: 'Sign Up' });
            }
            else {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                const { email, password } = req.body;
                const id = utils.get_random_id();

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
    ],
    
    signin: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail()
            .custom((value, { req }) => {
                const { email, password } = req.body;
                const user = users.find(user => (user.email === email));
                if (user === undefined) {
                    throw new Error('User not found');
                }
                if (user.password !== password) {
                    throw new Error('Wrong password');
                }
                return value;
            }),

        body('password')
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).trim()
            .withMessage('Password must be at least 8 characters')
            .isLength({ max: 16 })
            .withMessage('Password must be at most 16 characters')
            .isAlphanumeric().withMessage('Password must be alphanumeric'),

        sanitizeBody('email').trim().escape(),
        sanitizeBody('password').trim().escape(),

        (req, res) => {
            if (req.method === 'GET') {
                res.render( 'authentication', { title: 'Sign In' });
            }
            else {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                const { email } = req.body;
                const user = users.find(user => user.email === email);
                res.send({ status: 200, data: user });
            }
        }
    ],
};

export default AuthController;

